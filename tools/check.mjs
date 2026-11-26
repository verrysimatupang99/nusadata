#!/usr/bin/env node
// Static-entry checker for NusaData: external references, unresolved local files, forbidden
// browser features, syntax and the published make.fun byte budgets.
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join, normalize, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const root = resolve(new URL('..', import.meta.url).pathname);
const appRoot = join(root, 'app');
const screenshotsRoot = join(root, 'screenshots');
const failures = [];
const notes = [];

export function walk(directory, base = directory) {
  const output = [];
  if (!existsSync(directory)) return output;
  for (const entry of readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) output.push(...walk(path, base));
    else if (entry.isFile()) output.push({ path, relative: relative(base, path).replaceAll('\\', '/'), size: statSync(path).size });
  }
  return output;
}

const files = walk(appRoot);
let appBytes = 0;
let entryCount = 0;
const countEntries = (directory) => {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    entryCount += 1;
    if (entry.isDirectory()) countEntries(join(directory, entry.name));
  }
};
countEntries(appRoot);

for (const file of files) {
  appBytes += file.size;
  if (Buffer.byteLength(file.relative, 'utf8') > 1000) failures.push(`${file.relative}: path exceeds 1000 UTF-8 bytes`);
  const text = readFileSync(file.path, 'utf8');
  const externalPatterns = [
    /https?:\/\//i, /(?:src|href)\s*=\s*['"]\/\//i, /url\(\s*['"]?\/\//i, /@import\s+['"](?:https?:)?\/\//i, /<meta[^>]+http-equiv\s*=\s*['"]refresh/i,
  ];
  for (const pattern of externalPatterns) {
    if (pattern.test(text)) failures.push(`${file.relative}: forbidden external or redirect reference matching ${pattern}`);
  }
  if (/\bnew\s+Function\b|\beval\s*\(|document\.cookie|serviceWorker\s*\./.test(text)) failures.push(`${file.relative}: forbidden eval, cookie or service worker feature`);
  if (['.js', '.mjs'].includes(extname(file.path))) {
    const parsed = spawnSync(process.execPath, ['--check', file.path], { encoding: 'utf8' });
    if (parsed.status !== 0) failures.push(`${file.relative}: does not parse as JavaScript: ${parsed.stderr.trim().split('\n')[0]}`);
  }
}

const index = readFileSync(join(appRoot, 'index.html'), 'utf8');
for (const match of index.matchAll(/(?:src|href)=['"]([^'"]+)['"]/g)) {
  const ref = match[1];
  if (ref.startsWith('#') || ref.startsWith('data:')) continue;
  if (/^(?:https?:)?\/\//.test(ref)) failures.push(`index.html: external reference ${ref}`);
  else if (!existsSync(normalize(join(appRoot, ref)))) failures.push(`index.html: unresolved local reference ${ref}`);
}

for (const file of files.filter((item) => ['.js', '.mjs'].includes(extname(item.path)))) {
  const text = readFileSync(file.path, 'utf8');
  for (const match of text.matchAll(/(?:import\s*(?:[^'";]+\s+from\s*)?|import\()\s*['"]([^'"]+)['"]/g)) {
    const specifier = match[1];
    if (specifier.startsWith('./') || specifier.startsWith('../')) {
      const target = normalize(join(file.path, '..', specifier));
      if (!existsSync(target)) failures.push(`${file.relative}: unresolved import ${specifier}`);
    } else if (!specifier.startsWith('data:')) failures.push(`${file.relative}: bare or external import specifier ${specifier}`);
  }
}

if (entryCount > 993) failures.push(`app has ${entryCount} entries, exceeding 993`);
if (appBytes > 16777216) failures.push(`app uses ${appBytes} bytes, exceeding 16777216`);
if (statSync(join(appRoot, 'index.html')).size > 1048576) failures.push('index.html exceeds 1 MiB');
notes.push(`app entries: ${entryCount}/993`);
notes.push(`app bytes: ${appBytes}/16777216`);

if (existsSync(screenshotsRoot)) {
  const shots = walk(screenshotsRoot);
  if (shots.length < 3 || shots.length > 4) failures.push(`screenshots count is ${shots.length}, expected 3 or 4`);
  for (const shot of shots) {
    if (!/^[A-Za-z0-9][A-Za-z0-9._-]*\.(?:png|jpe?g)$/i.test(shot.relative)) failures.push(`${shot.relative}: invalid screenshot filename`);
    if (shot.size > 262144) failures.push(`${shot.relative}: ${shot.size} bytes exceeds 262144`);
  }
  notes.push(`screenshots: ${shots.length}, ${shots.reduce((sum, item) => sum + item.size, 0)} bytes`);
} else notes.push('screenshots directory not yet created');

const firstLoad = ['index.html', 'css/base.css', 'css/components.css', 'js/main.js', 'js/router.js', 'js/format.js', 'js/charts/sparkline.js', 'js/charts/axis.js'];
const firstBytes = firstLoad.filter((file) => existsSync(join(appRoot, file))).reduce((sum, file) => sum + statSync(join(appRoot, file)).size, 0);
notes.push(`explicit eager shell bytes (before transitive dashboard import): ${firstBytes}`);
for (const note of notes) console.log(note);
if (failures.length) {
  console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
  process.exit(1);
}
console.log('static checks passed');
