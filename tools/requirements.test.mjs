#!/usr/bin/env node
// Focused regression checks for NusaData's content contract. These tests use Node's
// standard library only and exercise the real data/view modules used by the browser.
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const root = resolve(new URL('..', import.meta.url).pathname);
const tests = [];
const test = (name, fn) => tests.push({ name, fn });

function closeTo(value, expected, tolerance, label) {
  assert.ok(Math.abs(value - expected) <= tolerance, `${label}: expected ${value} to be within ${tolerance} of ${expected}`);
}

test('trade data has the 2024 goods flow, commodity shares, partners and tourism facts', async () => {
  const path = join(root, 'app/js/data/trade.js');
  assert.equal(existsSync(path), true, 'app/js/data/trade.js should exist');
  const trade = await import('../app/js/data/trade.js');
  const latest = trade.goodsTradeAnnual.at(-1);
  assert.equal(latest.year, '2024');
  closeTo(latest.exports, 264.7, 0.05, '2024 exports');
  closeTo(latest.imports, 233.7, 0.05, '2024 imports');
  closeTo(latest.exports - latest.imports, 31.0, 0.1, '2024 balance');

  const commodityText = trade.exportCommodities2024.map((row) => row.label.toLowerCase()).join(' | ');
  for (const required of ['coal', 'palm', 'iron and steel', 'nickel', 'textiles', 'vehicles']) {
    assert.ok(commodityText.includes(required), `commodity list should include ${required}`);
  }
  const byCommodity = Object.fromEntries(trade.exportCommodities2024.map((row) => [row.id, row]));
  closeTo(byCommodity['mineral-fuels'].sharePct, 21.0, 0.8, 'mineral fuels share');
  closeTo(byCommodity['palm-oils'].sharePct, 10.2, 0.7, 'palm oil share');
  closeTo(byCommodity['iron-steel'].sharePct, 9.7, 0.7, 'iron and steel share');
  closeTo(byCommodity['nickel-products'].sharePct, 3.0, 0.5, 'nickel share');
  closeTo(byCommodity['textiles-footwear'].sharePct, 5.9, 0.8, 'textiles and footwear share');
  closeTo(byCommodity['vehicles'].sharePct, 4.2, 0.5, 'vehicles share');

  const partners = Object.fromEntries(trade.tradingPartners2024.map((row) => [row.name, row]));
  closeTo(partners.China.exportSharePct, 23.6, 0.4, 'China export share');
  closeTo(partners['United States'].exportSharePct, 10.0, 0.4, 'United States export share');
  closeTo(partners.Japan.exportSharePct, 7.8, 0.4, 'Japan export share');
  closeTo(partners.India.exportSharePct, 7.7, 0.4, 'India export share');
  closeTo(partners.Singapore.exportSharePct, 4.6, 0.4, 'Singapore export share');

  const arrivals2019 = trade.internationalArrivalsAnnual.find((row) => row.year === '2019');
  const arrivals2024 = trade.internationalArrivalsAnnual.find((row) => row.year === '2024');
  closeTo(arrivals2019.visitsM, 16.11, 0.03, '2019 arrivals');
  closeTo(arrivals2024.visitsM, 13.902, 0.01, '2024 arrivals');
  closeTo(trade.tourism2025.arrivalsJanSepM, 11.431, 0.01, 'Jan-Sep 2025 arrivals');
  closeTo(trade.tourism2025.targetUpperM, 16.0, 0.01, '2025 target upper bound');
  closeTo(trade.tourism2024.baliDirectArrivalsM, 6.333, 0.02, 'Bali direct arrivals');
});

test('trade route is reachable from navigation, router and section links', async () => {
  const index = readFileSync(join(root, 'app/index.html'), 'utf8');
  assert.match(index, /href="#\/trade"[^>]*data-route="trade"|data-route="trade"[^>]*href="#\/trade"/);
  const { parseHashRoute } = await import('../app/js/router.js');
  assert.equal(parseHashRoute('#/trade').name, 'trade');
  const { renderDashboard } = await import('../app/js/views/dashboard.js');
  const dashboard = renderDashboard().html;
  assert.ok(dashboard.includes('#/trade'), 'dashboard should link to the trade section');
});

test('trade view renders sourced goods and tourism sections', async () => {
  const { renderTrade } = await import('../app/js/views/trade.js');
  const html = renderTrade().html;
  for (const required of [
    'Goods trade flows',
    'Top export commodities',
    'Leading trading partners',
    'International visitor arrivals',
    'Bali',
    'BPS foreign trade statistics, 2024',
    'BPS International Visitor Arrivals Statistics, 2024',
  ]) assert.ok(html.includes(required), `trade view should include ${required}`);
  assert.ok((html.match(/source-line/g) || []).length >= 6, 'trade view should expose repeated source lines');
});

test('regions view includes a sourced top-ten provincial economy bar chart', async () => {
  const regions = await import('../app/js/data/regions.js');
  assert.equal(regions.largestProvincialEconomies2024.length, 10);
  assert.equal(regions.largestProvincialEconomies2024[0].name, 'DKI Jakarta');
  closeTo(regions.largestProvincialEconomies2024[0].grdpT, 3679.36, 0.02, 'Jakarta GRDP');
  closeTo(regions.largestProvincialEconomies2024[1].grdpT, 3168.30, 0.02, 'East Java GRDP');
  closeTo(regions.largestProvincialEconomies2024[9].grdpT, 663.96, 0.02, 'South Sumatra GRDP');
  const { renderRegions } = await import('../app/js/views/regions.js');
  const html = renderRegions().html;
  assert.ok(html.includes('Largest provincial economies'));
  assert.ok(html.includes('South Sumatra'));
  assert.ok(html.includes('BPS provincial gross regional domestic product at current market prices, 2024'));
});

test('release ledger covers monthly CPI/trade plus quarterly GDP, Sakernas and Susenas through December 2026', async () => {
  const { releaseCalendar } = await import('../app/js/data/releases.js');
  const in2026 = releaseCalendar.filter((release) => release.date.startsWith('2026-'));
  const monthNumbers = new Set(in2026.filter((release) => /CPI/.test(release.title) && /exports and imports/.test(release.title)).map((release) => release.date.slice(5, 7)));
  for (let month = 1; month <= 12; month += 1) {
    assert.ok(monthNumbers.has(String(month).padStart(2, '0')), `missing combined CPI/trade release for 2026-${String(month).padStart(2, '0')}`);
  }
  for (const date of ['2026-02-05', '2026-05-05', '2026-08-05', '2026-11-05']) {
    assert.ok(in2026.some((release) => release.date === date && /Gross domestic product/.test(release.title)), `missing GDP release on ${date}`);
  }
  assert.ok(in2026.some((release) => /February 2026/.test(release.title) && /Labour force/.test(release.title)), 'missing February Sakernas results');
  assert.ok(in2026.some((release) => /August 2026/.test(release.title) && /Labour force/.test(release.title)), 'missing August Sakernas results');
  assert.ok(in2026.some((release) => /March 2026/.test(release.title) && /poverty/.test(release.title)), 'missing March Susenas poverty results');
  assert.ok(in2026.some((release) => /September 2025/.test(release.title) && /poverty/.test(release.title)), 'missing September-round Susenas poverty results released in early 2026');
  assert.equal(in2026.every((release) => release.status === 'scheduled'), true, '2026 entries should be scheduled in the November 2025 compilation vintage');
  assert.ok(releaseCalendar.some((release) => release.date === '2026-12-01'), 'ledger should reach December 2026');
});

test('dashboard previews the real next CPI/trade and GDP releases and includes trade balance', async () => {
  const { renderDashboard } = await import('../app/js/views/dashboard.js');
  const html = renderDashboard().html;
  assert.ok(!html.includes('For the judge'), 'dashboard should address readers, not the bounty judge');
  assert.ok(html.includes('Trade balance'));
  assert.ok(html.includes('+US$31.0B') || html.includes('US$31.0B surplus'));
  assert.ok(html.includes('1 Dec'));
  assert.ok(html.includes('2 Jan'));
  assert.ok(html.includes('5 Feb'));
  assert.ok(html.includes('Gross domestic product'));
});

test('labour headline facts consistently use the published August 2025 Sakernas round', async () => {
  const { labourKeyFacts } = await import('../app/js/data/labour.js');
  assert.equal(labourKeyFacts.period, 'Aug 2025');
  closeTo(labourKeyFacts.unemploymentRate, 4.85, 0.01, 'unemployment rate');
  closeTo(labourKeyFacts.labourForceM, 154.00, 0.02, 'labour force');
  closeTo(labourKeyFacts.employedM, 146.54, 0.02, 'employment');
  closeTo(labourKeyFacts.averageWageIdrM, 3.33, 0.01, 'average wage');
  closeTo(labourKeyFacts.informalShare, 57.8, 0.1, 'informal share');
  const { headlineIndicators } = await import('../app/js/data/headline.js');
  const unemployment = headlineIndicators.find((item) => item.id === 'unemployment');
  assert.equal(unemployment.value, '4.85%');
  assert.equal(unemployment.period, 'Aug 2025');
  const { indicatorCatalog } = await import('../app/js/data/indicators.js');
  const indicator = indicatorCatalog.find((item) => item.id === 'unemployment-rate');
  assert.equal(indicator.latest, '4.85%');
  assert.equal(indicator.period, 'Aug 2025');
});

test('indicator catalogue count is dynamic and trade/tourism series are catalogued', async () => {
  const indicators = await import('../app/js/data/indicators.js');
  assert.ok(indicators.findIndicator('international-arrivals'), 'catalogue should include international arrivals');
  assert.ok(indicators.findIndicator('exports-goods'), 'catalogue should keep goods exports');
  const { renderIndicators, renderIndicatorDetail } = await import('../app/js/views/indicators.js');
  const html = renderIndicators({ segments: ['indicators'], query: new URLSearchParams() }).html;
  assert.ok(html.includes(`${indicators.indicatorCatalog.length} series`), 'catalogue heading should use the real count');
  assert.ok(!html.includes('Fifty series'), 'catalogue heading should not be hard-coded');
  const detail = renderIndicatorDetail('international-arrivals').html;
  for (const required of ['Series chart', 'Series table', 'Methodology note', 'BPS']) {
    assert.ok(detail.includes(required), `indicator detail should include ${required}`);
  }
});

let failures = 0;
for (const { name, fn } of tests) {
  try {
    await fn();
    console.log(`PASS ${name}`);
  } catch (error) {
    failures += 1;
    console.error(`FAIL ${name}\n  ${error.message}`);
  }
}
if (failures) {
  console.error(`${failures} requirement test(s) failed`);
  process.exit(1);
}
console.log(`${tests.length} requirement tests passed`);
