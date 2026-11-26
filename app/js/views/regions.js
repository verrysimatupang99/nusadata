import { escapeHtml, formatInteger, formatNumber, formatPercent, formatWholeIdr } from '../format.js';
import { horizontalBarChart } from '../charts/bar.js';
import { provinceTileMap } from '../charts/tilemap.js';
import { largestProvincialEconomies2024, provinceMetrics, provinceStatistics, regionsSourceNotes } from '../data/regions.js';

export function renderRegions() {
  return { html: buildRegionsHtml({ metricIndex: 0, selectedCode: 'JB', sortKey: 'populationM', direction: -1 }), mount: mountRegions };
}

export function buildRegionsHtml(state) {
  const metric = provinceMetrics[state.metricIndex];
  const selected = provinceStatistics.find((province) => province.code === state.selectedCode) || provinceStatistics[0];
  const controls = provinceMetrics.map((item, index) => `<button class="control-button" type="button" data-metric-index="${index}" aria-pressed="${index === state.metricIndex}">${escapeHtml(item.label.split(',')[0])}</button>`).join('');
  const map = provinceTileMap({ provinces: provinceStatistics, metric, width: 760, tileW: 42, tileH: 36, gapX: 5, gapY: 14, ariaLabel: `Map of 38 provinces coloured by ${metric.label}` });
  const rows = sortProvinces(state).map((province) => `<tr data-province-row="${escapeHtml(province.code)}" class="${province.code === selected.code ? 'selected-row' : ''}"><td><strong>${escapeHtml(province.name)}</strong><br><small>${escapeHtml(province.capital)} · ${escapeHtml(province.island)}</small></td><td class="num">${province.populationM.toFixed(2)}</td><td class="num">${province.grdpCapitaM.toFixed(1)}</td><td class="num">${province.povertyPct.toFixed(2)}%</td><td class="num">${formatWholeIdr(province.ump2025)}</td></tr>`).join('');
  const economyBars = horizontalBarChart({
    items: largestProvincialEconomies2024.map((province) => ({ label: province.name, value: province.grdpT, note: `${formatPercent(province.sharePct, 1)} of national GRDP` })),
    width: 380,
    rowHeight: 22,
    labelWidth: 112,
    valueFormat: (value) => value >= 1000 ? `Rp${(value / 1000).toFixed(2)}Q` : `Rp${formatNumber(value, 0)}T`,
    color: 'var(--navy)',
    ariaLabel: 'Ten largest provincial economies by GRDP, 2024',
  });
  
  return `
    <section class="page-heading"><div><p class="eyebrow">Regions</p><h1>Thirty-eight provinces across the archipelago</h1><p class="lede">A schematic west-to-east tile atlas with population, income and poverty for every province. Select a metric, then click a tile or table row.</p></div><div class="asof">Population mid-2024 · poverty Mar 2025<br>UMP effective 2025</div></section>
    <section class="tilemap-layout">
      <article class="panel"><header class="panel-header"><div><h2>Archipelago tile atlas</h2><p>Colour: ${escapeHtml(metric.label)}</p></div><div class="tilemap-controls">${controls}</div></header><div class="panel-body">${map}<div class="region-strip"><span><strong>West Java</strong> largest population</span><span><strong>DKI Jakarta</strong> highest GRDP per capita</span><span><strong>Highland Papua</strong> highest poverty rate</span></div><p class="source-line">${escapeHtml(regionsSourceNotes.population)}; ${escapeHtml(regionsSourceNotes.grdp)}; ${escapeHtml(regionsSourceNotes.poverty)}</p></div></article>
      <aside class="region-side-stack"><article class="panel economy-rank-panel"><header class="panel-header"><div><p class="eyebrow">Largest provincial economies</p><h3>Java plus resource provinces lead</h3><p>GRDP at current market prices, 2024.</p></div></header><div class="panel-body">${economyBars}<p class="source-line">${escapeHtml(regionsSourceNotes.grdpTotal)}</p></div></article><article class="panel province-detail-panel"><header class="panel-header"><div><p class="eyebrow">Province detail</p><h2>${escapeHtml(selected.name)}</h2><p>${escapeHtml(selected.island)} · capital ${escapeHtml(selected.capital)}</p></div></header><div class="panel-body province-detail"><div><div class="fact-label">Population</div><div class="big-number">${selected.populationM.toFixed(2)}m</div></div><dl class="detail-list">
        ${detail('Density', `${formatInteger(selected.populationM * 1000000 / selected.areaKm2)} people/km²`)}
        ${detail('GRDP per capita', `Rp ${selected.grdpCapitaM.toFixed(1)} million`)}
        ${detail('Poverty rate', formatPercent(selected.povertyPct))}
        ${detail('Minimum wage 2025', formatWholeIdr(selected.ump2025))}
        ${detail('Land area', `${formatInteger(selected.areaKm2)} km²`)}
      </dl><p class="source-line">${escapeHtml(regionsSourceNotes.population)}; ${escapeHtml(regionsSourceNotes.grdp)}; ${escapeHtml(regionsSourceNotes.poverty)}; ${escapeHtml(regionsSourceNotes.ump)}</p></div></article></aside>
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Provincial statistical table</h2><p>Click column headings to sort; click a row to inspect the province.</p></div></header><div class="data-table-wrap province-table-wrap"><table class="data-table province-table"><thead><tr>
      ${headerButton('name', 'Province', state)}${headerButton('populationM', 'Population m', state)}${headerButton('grdpCapitaM', 'GRDP/capita Rp m', state)}${headerButton('povertyPct', 'Poverty', state)}${headerButton('ump2025', 'UMP 2025', state)}
    </tr></thead><tbody>${rows}</tbody></table></div><div class="panel-body"><p class="source-line">BPS provincial estimates/accounts 2024; BPS Susenas Mar 2025; Manpower Regulation 16/2024</p></div></section>`;
}

export function mountRegions(root) {
  const state = { metricIndex: 0, selectedCode: 'JB', sortKey: 'populationM', direction: -1 };
  const repaint = () => { root.innerHTML = buildRegionsHtml(state); };
  root.addEventListener('click', (event) => {
    const target = event.target instanceof Element ? event.target : null;
    if (!target) return;
    const metricButton = target.closest('[data-metric-index]');
    if (metricButton) {
      state.metricIndex = Number(metricButton.getAttribute('data-metric-index'));
      repaint();
      return;
    }
    const sortButton = target.closest('[data-sort-key]');
    if (sortButton) {
      const key = sortButton.getAttribute('data-sort-key');
      if (state.sortKey === key) state.direction *= -1;
      else { state.sortKey = key; state.direction = key === 'name' ? 1 : -1; }
      repaint();
      return;
    }
    const row = target.closest('[data-province-row]');
    const tile = target.closest('[data-province]');
    const code = row?.getAttribute('data-province-row') || tile?.getAttribute('data-province');
    if (code) {
      state.selectedCode = code;
      repaint();
    }
  });
  root.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter' && event.key !== ' ') return;
    const tile = event.target instanceof Element ? event.target.closest('[data-province]') : null;
    if (tile) {
      event.preventDefault();
      state.selectedCode = tile.getAttribute('data-province');
      repaint();
    }
  });
}

function sortProvinces(state) {
  return [...provinceStatistics].sort((a, b) => {
    const av = a[state.sortKey];
    const bv = b[state.sortKey];
    const result = typeof av === 'string' ? av.localeCompare(bv) : av - bv;
    return result * state.direction;
  });
}
function headerButton(key, label, state) {
  const sort = state.sortKey === key ? (state.direction === 1 ? 'ascending' : 'descending') : 'none';
  return `<th><button class="sort-button" type="button" data-sort-key="${key}" aria-sort="${sort}">${escapeHtml(label)}</button></th>`;
}
function detail(term, value, note = '') {
  return `<div class="detail-row"><dt>${escapeHtml(term)}${note ? `<br><small class="source-line">${escapeHtml(note)}</small>` : ''}</dt><dd>${escapeHtml(value)}</dd></div>`;
}
