import { escapeHtml, formatNumber, formatPercent } from '../format.js';
import { lineChart } from '../charts/line.js';
import { sparkline } from '../charts/sparkline.js';
import { findIndicator, indicatorCatalog, indicatorCategories, searchIndicators } from '../data/indicators.js';

export function renderIndicators(route) {
  const id = route.segments[1];
  if (id) return renderIndicatorDetail(id);
  const query = route.query.get('q') || '';
  return { html: buildCatalogHtml(query, 'All'), mount: mountIndicatorCatalog };
}

export function buildCatalogHtml(query, category) {
  const results = searchIndicators(query, category);
  const rows = results.map((indicator) => `<tr class="indicator-row" data-indicator-id="${escapeHtml(indicator.id)}" tabindex="0"><td><span class="indicator-name">${escapeHtml(indicator.name)}</span><br><span class="indicator-note">${escapeHtml(indicator.category)} · ${escapeHtml(indicator.unit)}</span></td><td class="num"><strong>${escapeHtml(indicator.latest)}</strong><br><span class="indicator-note">${escapeHtml(indicator.period)}</span></td><td class="num">${formatSignedCompact(indicator.change, indicator.changeSuffix)}</td><td>${sparkline({ values: indicator.series, width: 116, height: 30, color: indicator.invert ? 'var(--accent)' : 'var(--navy)' })}</td><td><span class="indicator-note">${escapeHtml(indicator.source)}</span></td></tr>`).join('');
  const options = ['All', ...indicatorCategories].map((item) => `<option value="${escapeHtml(item)}" ${item === category ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('');
  return `
    <section class="page-heading"><div><p class="eyebrow">Indicator catalogue</p><h1>Fifty series, each with source and year</h1><p class="lede">Search the statistical catalogue, filter by theme, and open a series for a larger chart, table and methodology note.</p></div><div class="asof">${indicatorCatalog.length} indicators<br>Latest compilation: Nov 2025</div></section>
    <section class="panel"><div class="panel-body"><div class="catalog-tools"><label><span class="eyebrow">Search</span><input class="text-input" id="catalog-search" type="search" value="${escapeHtml(query)}" placeholder="inflation, poverty, GDP…"></label><label><span class="eyebrow">Theme</span><select class="select-input" id="catalog-category">${options}</select></label><button class="control-button" id="catalog-reset" type="button">Reset</button></div><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Indicator</th><th class="num">Latest</th><th class="num">Change</th><th>Trend</th><th>Source</th></tr></thead><tbody>${rows || `<tr><td colspan="5">No indicator matches that search.</td></tr>`}</tbody></table></div><p class="source-line">NusaData compilation from BPS, Bank Indonesia, Ministry of Finance and World Bank WDI releases; individual years shown in rows</p></div></section>`;
}

export function mountIndicatorCatalog(root) {
  const search = root.querySelector('#catalog-search');
  const category = root.querySelector('#catalog-category');
  let query = search?.value || '';
  const repaint = () => { root.innerHTML = buildCatalogHtml(query, category?.value || 'All'); };
  search?.addEventListener('input', () => { query = search.value; window.clearTimeout(search.timer); search.timer = window.setTimeout(repaint, 180); });
  category?.addEventListener('change', repaint);
  root.querySelector('#catalog-reset')?.addEventListener('click', () => { query = ''; root.innerHTML = buildCatalogHtml('', 'All'); });
  const open = (id) => { window.location.hash = `#/indicators/${encodeURIComponent(id)}`; };
  root.addEventListener('click', (event) => {
    const row = event.target instanceof Element ? event.target.closest('[data-indicator-id]') : null;
    if (row) open(row.getAttribute('data-indicator-id'));
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const row = event.target instanceof Element ? event.target.closest('[data-indicator-id]') : null;
    if (row) open(row.getAttribute('data-indicator-id'));
  });
}

export function renderIndicatorDetail(id) {
  const indicator = findIndicator(id);
  if (!indicator) {
    return { html: `<section class="panel notfound-panel"><p class="eyebrow">Indicator not found</p><h1>No series has that identifier.</h1><p>The catalogue may have moved. Return to the full list.</p><a class="inline-link-button" href="#/indicators">Open catalogue</a></section>` };
  }
  const values = indicator.series;
  const chart = lineChart({
    labels: indicator.labels,
    series: [{ name: indicator.name, color: indicator.invert ? '#a51f2d' : '#244e79', values }],
    width: 760, height: 330, area: true, dense: values.length > 24, xEvery: values.length > 24 ? 4 : 1,
    valueFormat: (v) => smartValue(v, indicator.unit), yLabel: indicator.unit, ariaLabel: `${indicator.name} time series`,
  });
  const rows = indicator.labels.map((label, index) => `<tr><td>${escapeHtml(label)}</td><td class="num">${escapeHtml(smartValue(values[index], indicator.unit))}</td></tr>`).reverse().join('');
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Indicator detail</p><h1>${escapeHtml(indicator.name)}</h1><p class="lede">${escapeHtml(indicator.unit)} · latest ${escapeHtml(indicator.latest)} in ${escapeHtml(indicator.period)}.</p></div><div class="asof"><a href="#/indicators">← full catalogue</a><br>${escapeHtml(indicator.source)}</div></section>
    <section class="indicator-detail-grid">
      <article class="panel"><header class="panel-header"><div><h2>Series chart</h2><p>${escapeHtml(indicator.period)} is the latest observation.</p></div><span class="pill red">${escapeHtml(indicator.latest)}</span></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(indicator.source)}</p></div></article>
      <aside class="section-stack"><article class="panel"><header class="panel-header"><div><h3>Methodology note</h3></div></header><div class="panel-body"><div class="method-note">${escapeHtml(indicator.methodology)}</div><dl class="detail-list" style="margin-top:10px"><div class="detail-row"><dt>Category</dt><dd>${escapeHtml(indicator.category)}</dd></div><div class="detail-row"><dt>Unit</dt><dd>${escapeHtml(indicator.unit)}</dd></div><div class="detail-row"><dt>Latest change</dt><dd>${escapeHtml(formatSignedCompact(indicator.change, indicator.changeSuffix))}</dd></div></dl></div></article>
      <article class="panel"><header class="panel-header"><div><h3>Series table</h3></div></header><div class="data-table-wrap" style="max-height:360px"><table class="data-table"><thead><tr><th>Period</th><th class="num">Value</th></tr></thead><tbody>${rows}</tbody></table></div></article></aside>
    </section>`;
  return { html };
}

function smartValue(value, unit) {
  if (unit.includes('Rp/month') || unit.includes('Rp/person')) return `Rp ${formatNumber(value, 0)}`;
  if (unit.includes('US$') || unit.includes('Rp trillion')) return formatNumber(value, 1);
  if (Math.abs(value) >= 1000) return formatNumber(value, 0);
  if (Math.abs(value) >= 100) return formatNumber(value, 1);
  return formatNumber(value, 2);
}
function formatSignedCompact(value, suffix = '%') {
  const sign = value > 0 ? '+' : '';
  return `${sign}${formatNumber(value, 2)}${suffix}`;
}
