#!/usr/bin/env node
// Capture deterministic local renders of NusaData with headless Chrome, using only Node's
// standard library and the browser DevTools protocol.
import { createServer } from 'node:http';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { setTimeout as delay } from 'node:timers/promises';

const root = resolve(new URL('..', import.meta.url).pathname);
const appRoot = join(root, 'app');
const outputRoot = join(root, 'screenshots');
const shots = JSON.parse(readFileSync(join(root, 'shots.json'), 'utf8'));

const mimeTypes = new Map([
  ['.html', 'text/html; charset=utf-8'], ['.css', 'text/css; charset=utf-8'], ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'], ['.svg', 'image/svg+xml'], ['.png', 'image/png'], ['.jpg', 'image/jpeg'],
]);

export function startStaticServer(directory) {
  const server = createServer((request, response) => {
    try {
      const url = new URL(request.url || '/', 'http://local.invalid');
      let pathname = decodeURIComponent(url.pathname);
      if (pathname === '/') pathname = '/index.html';
      const file = normalize(join(directory, pathname));
      if (!file.startsWith(directory) || !existsSync(file) || statSync(file).isDirectory()) {
        response.writeHead(404).end('not found');
        return;
      }
      response.writeHead(200, { 'content-type': mimeTypes.get(extname(file)) || 'application/octet-stream', 'cache-control': 'no-store' });
      response.end(readFileSync(file));
    } catch (error) {
      response.writeHead(500).end(String(error));
    }
  });
  return new Promise((resolveServer) => server.listen(0, '127.0.0.1', () => resolveServer(server)));
}

export async function launchChrome() {
  const profile = mkdtempSync(join(tmpdir(), 'nusadata-chrome-'));
  const chrome = spawn('google-chrome', [
    '--headless=new', '--disable-gpu', '--disable-dev-shm-usage', '--no-first-run', '--no-default-browser-check',
    '--hide-scrollbars', '--mute-audio', `--user-data-dir=${profile}`, '--remote-debugging-port=0', 'about:blank',
  ], { stdio: ['ignore', 'ignore', 'pipe'] });
  let stderr = '';
  const browserWsUrl = await new Promise((resolveLaunch, rejectLaunch) => {
    const timer = setTimeout(() => rejectLaunch(new Error(`Timed out waiting for Chrome DevTools endpoint\n${stderr}`)), 10000);
    chrome.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
      const match = stderr.match(/DevTools listening on (ws:\/\/\S+)/);
      if (match) { clearTimeout(timer); resolveLaunch(match[1]); }
    });
    chrome.once('exit', (code) => rejectLaunch(new Error(`Chrome exited before DevTools was ready (${code})\n${stderr}`)));
  });
  return { chrome, browserWsUrl, profile };
}

export class CdpConnection {
  constructor(wsUrl) { this.wsUrl = wsUrl; this.nextId = 1; this.pending = new Map(); this.listeners = new Map(); }
  async open() {
    this.socket = new WebSocket(this.wsUrl);
    await new Promise((resolveOpen, rejectOpen) => {
      this.socket.addEventListener('open', resolveOpen, { once: true });
      this.socket.addEventListener('error', rejectOpen, { once: true });
    });
    this.socket.addEventListener('message', (event) => this.receive(event.data));
  }
  receive(raw) {
    const message = JSON.parse(raw);
    if (message.id) {
      const pending = this.pending.get(message.id);
      if (!pending) return;
      this.pending.delete(message.id);
      if (message.error) pending.reject(new Error(`${message.error.message}: ${message.error.data || ''}`));
      else pending.resolve(message.result || {});
      return;
    }
    const key = message.sessionId ? `${message.sessionId}:${message.method}` : message.method;
    for (const listener of this.listeners.get(key) || []) listener(message.params || {}, message.sessionId);
    for (const listener of this.listeners.get('*') || []) listener(message);
  }
  on(method, listener, sessionId) {
    const key = sessionId ? `${sessionId}:${method}` : method;
    if (!this.listeners.has(key)) this.listeners.set(key, []);
    this.listeners.get(key).push(listener);
  }
  send(method, params = {}, sessionId) {
    const id = this.nextId++;
    const message = { id, method, params };
    if (sessionId) message.sessionId = sessionId;
    this.socket.send(JSON.stringify(message));
    return new Promise((resolveSend, rejectSend) => this.pending.set(id, { resolve: resolveSend, reject: rejectSend }));
  }
  close() { try { this.socket?.close(); } catch {} }
}

export function jpegDimensions(buffer) {
  let offset = 2;
  while (offset < buffer.length) {
    if (buffer[offset] !== 0xff) { offset += 1; continue; }
    const marker = buffer[offset + 1];
    const length = buffer.readUInt16BE(offset + 2);
    if ((marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf)) {
      return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  throw new Error('Could not read JPEG dimensions');
}

export async function captureShots() {
  mkdirSync(outputRoot, { recursive: true });
  const server = await startStaticServer(appRoot);
  const port = server.address().port;
  const browser = await launchChrome();
  const cdp = new CdpConnection(browser.browserWsUrl);
  const failures = [];
  try {
    await cdp.open();
    const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
    await cdp.send('Page.enable', {}, sessionId);
    await cdp.send('Runtime.enable', {}, sessionId);
    await cdp.send('Log.enable', {}, sessionId);
    const errors = [];
    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (['error', 'assert'].includes(params.type)) errors.push(`console.${params.type}: ${params.args?.map((arg) => arg.value ?? arg.description ?? '').join(' ')}`);
    }, sessionId);
    cdp.on('Runtime.exceptionThrown', (params) => errors.push(`exception: ${params.exceptionDetails?.text || ''} ${params.exceptionDetails?.exception?.description || ''}`), sessionId);
    cdp.on('Log.entryAdded', (params) => {
      if (params.entry?.level === 'error') errors.push(`log: ${params.entry.text}`);
    }, sessionId);
    for (const shot of shots) {
      errors.length = 0;
      await cdp.send('Emulation.setDeviceMetricsOverride', { width: shot.viewport.width, height: shot.viewport.height, deviceScaleFactor: 1, mobile: shot.viewport.width < 500 }, sessionId);
      const loaded = new Promise((resolveLoad) => cdp.on('Page.loadEventFired', resolveLoad, sessionId));
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/${shot.path}` }, sessionId);
      await Promise.race([loaded, delay(2500)]);
      await delay(shot.wait || 1000);
      let quality = 88;
      let buffer;
      for (let attempt = 0; attempt < 5; attempt += 1) {
        const result = await cdp.send('Page.captureScreenshot', { format: 'jpeg', quality, captureBeyondViewport: false }, sessionId);
        buffer = Buffer.from(result.data, 'base64');
        if (buffer.length <= 245000 || quality <= 52) break;
        quality -= 9;
      }
      const file = join(outputRoot, shot.file);
      writeFileSync(file, buffer);
      const dimensions = jpegDimensions(buffer);
      const problems = [];
      if (buffer.length > 262144) problems.push(`${buffer.length} bytes exceeds 262144`);
      if (Math.max(dimensions.width, dimensions.height) > 1280) problems.push(`long side ${Math.max(dimensions.width, dimensions.height)} exceeds 1280`);
      if (Math.min(dimensions.width, dimensions.height) < 360) problems.push(`short side ${Math.min(dimensions.width, dimensions.height)} below 360`);
      if (errors.length) problems.push(errors.join(' | '));
      console.log(`${shot.file}: ${dimensions.width}x${dimensions.height}, ${buffer.length} bytes, quality ${quality}`);
      if (problems.length) failures.push(`${shot.file}: ${problems.join('; ')}`);
    }
    await cdp.send('Target.closeTarget', { targetId });
  } finally {
    cdp.close();
    browser.chrome.kill('SIGTERM');
    await new Promise((resolveClose) => server.close(resolveClose));
    setTimeout(() => rmSync(browser.profile, { recursive: true, force: true }), 300).unref();
  }
  if (failures.length) {
    console.error(failures.join('\n'));
    process.exitCode = 1;
  }
}

if (process.argv[1] === new URL(import.meta.url).pathname) await captureShots();
