#!/usr/bin/env node
// Browser audit: open every NusaData route, exercise controls, and fail on console errors or exceptions.
import { setTimeout as delay } from 'node:timers/promises';
import { captureShots, CdpConnection, launchChrome, startStaticServer } from './shoot.mjs';
import { join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const appRoot = join(root, 'app');
const routes = ['#/', '#/economy', '#/population', '#/prices', '#/labour', '#/regions', '#/indicators', '#/indicators/real-gdp-growth', '#/releases', '#/about', '#/definitely-not-a-route'];

export async function auditRoutesAndControls() {
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
    await cdp.send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 800, deviceScaleFactor: 1, mobile: false }, sessionId);
    const errors = [];
    cdp.on('Runtime.consoleAPICalled', (params) => {
      if (['error', 'assert'].includes(params.type)) errors.push(`console.${params.type}: ${params.args?.map((arg) => arg.value ?? arg.description ?? '').join(' ')}`);
    }, sessionId);
    cdp.on('Runtime.exceptionThrown', (params) => errors.push(`exception: ${params.exceptionDetails?.exception?.description || params.exceptionDetails?.text}`), sessionId);
    cdp.on('Log.entryAdded', (params) => { if (params.entry?.level === 'error') errors.push(`log: ${params.entry.text}`); }, sessionId);
    const evaluate = async (expression) => {
      const result = await cdp.send('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true }, sessionId);
      if (result.exceptionDetails) throw new Error(result.exceptionDetails.exception?.description || result.exceptionDetails.text);
      return result.result?.value;
    };
    const navigate = async (hash) => {
      const before = errors.length;
      await cdp.send('Page.navigate', { url: `http://127.0.0.1:${port}/${hash}` }, sessionId);
      await delay(850);
      const state = await evaluate(`({ text: document.querySelector('#app')?.textContent?.trim().length || 0, heading: document.querySelector('#app h1')?.textContent || '', hash: location.hash })`);
      if (!state.text) failures.push(`${hash}: empty view`);
      if (errors.length > before) failures.push(`${hash}: ${errors.slice(before).join(' | ')}`);
      return state;
    };
    for (const route of routes) {
      const state = await navigate(route);
      console.log(`${route}: ${state.heading.slice(0, 64) || 'rendered'}`);
    }

    // Header controls: menu toggles and search navigates to the indicator catalogue.
    await navigate('#/');
    await evaluate(`document.querySelector('#menu-toggle').click(); document.querySelector('#menu-toggle').getAttribute('aria-expanded')`);
    await evaluate(`document.querySelector('#global-search').value='poverty'; document.querySelector('#site-search').dispatchEvent(new Event('submit',{cancelable:true}))`);
    await delay(650);
    const searchHash = await evaluate('location.hash');
    if (!searchHash.includes('/indicators') || !searchHash.includes('poverty')) failures.push(`header search did not reach indicator catalogue: ${searchHash}`);

    // Region controls: metric buttons, tile selection and sortable table headings.
    await navigate('#/regions');
    await evaluate(`document.querySelector('[data-metric-index="1"]').click()`);
    await delay(160);
    const populationMetric = await evaluate(`document.querySelector('.tilemap-layout .panel-header p').textContent`);
    if (!populationMetric.includes('Population')) failures.push('region population metric button did not repaint');
    await evaluate(`document.querySelector('[data-province="JK"]').dispatchEvent(new MouseEvent('click',{bubbles:true}))`);
    await delay(160);
    const provinceName = await evaluate(`document.querySelector('.province-detail')?.parentElement?.querySelector('h2')?.textContent || document.querySelector('.tilemap-layout aside h2').textContent`);
    if (!provinceName.includes('Jakarta')) failures.push(`province tile click selected ${provinceName}`);
    await evaluate(`document.querySelector('[data-sort-key="povertyPct"]').click()`);
    await delay(160);
    const firstRow = await evaluate(`document.querySelector('.province-table tbody td').textContent`);
    if (!firstRow) failures.push('province table sort did not render rows');

    // Catalogue controls: search input, category filter, reset and row navigation.
    await navigate('#/indicators');
    await evaluate(`const input=document.querySelector('#catalog-search'); input.value='inflation'; input.dispatchEvent(new Event('input',{bubbles:true}))`);
    await delay(350);
    const filtered = await evaluate(`document.querySelectorAll('.indicator-row').length`);
    if (filtered < 3) failures.push(`indicator search returned only ${filtered} rows`);
    await evaluate(`const select=document.querySelector('#catalog-category'); select.value='Welfare'; select.dispatchEvent(new Event('change',{bubbles:true}))`);
    await delay(180);
    const welfareRows = await evaluate(`document.querySelectorAll('.indicator-row').length`);
    if (welfareRows !== 0) failures.push('combined inflation+Welfare filter should yield no rows in this control path');
    await evaluate(`document.querySelector('#catalog-reset').click()`);
    await delay(180);
    await evaluate(`document.querySelector('[data-indicator-id="poverty-rate"]').click()`);
    await delay(400);
    const detailHash = await evaluate('location.hash');
    if (!detailHash.includes('poverty-rate')) failures.push(`indicator row did not open detail: ${detailHash}`);

    if (errors.length) failures.push(`browser errors remain: ${[...new Set(errors)].join(' | ')}`);
    await cdp.send('Target.closeTarget', { targetId });
  } finally {
    cdp.close();
    browser.chrome.kill('SIGTERM');
    await new Promise((resolveClose) => server.close(resolveClose));
  }
  if (failures.length) {
    console.error(failures.map((failure) => `FAIL ${failure}`).join('\n'));
    process.exitCode = 1;
  } else console.log('route and control audit passed');
}

if (process.argv[1] === new URL(import.meta.url).pathname) await auditRoutesAndControls();
