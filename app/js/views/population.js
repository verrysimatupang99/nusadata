import { escapeHtml, formatNumber, formatPercent } from '../format.js';
import { lineChart } from '../charts/line.js';
import { horizontalBarChart } from '../charts/bar.js';
import { populationPyramid } from '../charts/pyramid.js';
import { fertilitySeries, lifeExpectancySeries, populationHistory, populationKeyFacts, populationPyramid2025, urbanizationSeries } from '../data/population.js';
import { provinceStatistics } from '../data/regions.js';

export function renderPopulation() {
  const history = lineChart({
    labels: populationHistory.map((row) => row.year),
    series: [{ name: 'Population', color: '#244e79', values: populationHistory.map((row) => row.value) }],
    width: 650, height: 265, area: true, yLabel: 'million people', valueFormat: (v) => `${v.toFixed(1)} million`, ariaLabel: 'Population history and projection',
  });
  const urban = lineChart({
    labels: urbanizationSeries.map((row) => row.year),
    series: [{ name: 'Urban share', color: '#a51f2d', values: urbanizationSeries.map((row) => row.value) }],
    width: 560, height: 220, area: true, yLabel: '% of population', valueFormat: (v) => formatPercent(v), ariaLabel: 'Urban population share',
  });
  const vital = lineChart({
    labels: lifeExpectancySeries.map((row) => row.year),
    series: [
      { name: 'Life expectancy, years', color: '#244e79', values: lifeExpectancySeries.map((row) => row.value) },
      { name: 'Fertility, births per woman × 10', color: '#a51f2d', values: fertilitySeries.map((row) => row.value * 10), dashed: true },
    ],
    width: 560, height: 220, yLabel: 'years / fertility ×10', valueFormat: (v) => formatNumber(v, 2), ariaLabel: 'Life expectancy and fertility trends',
  });
  const top = [...provinceStatistics].sort((a, b) => b.populationM - a.populationM).slice(0, 10);
  const topBars = horizontalBarChart({
    items: top.map((province) => ({ label: province.name, value: province.populationM, note: 'mid-2024' })),
    width: 620, rowHeight: 27, labelWidth: 150, valueFormat: (v) => `${v.toFixed(1)}m`, color: 'var(--navy)', ariaLabel: 'Ten largest provinces by population',
  });
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Population</p><h1>A large, young archipelago entering its demographic dividend</h1><p class="lede">The 2025 projection puts Indonesia at 284.4 million people. Age structure, urbanization and provincial concentration matter as much as the headline total.</p></div><div class="asof">Latest population: mid-2025<br>BPS projection</div></section>
    <section class="figure-row">
      ${fact('Population', `${populationKeyFacts.totalM.toFixed(1)} million`, populationKeyFacts.sourcePopulation)}
      ${fact('Growth rate', `${populationKeyFacts.growthPct.toFixed(2)}% / year`, 'BPS population projection, 2025')}
      ${fact('Density', `${populationKeyFacts.densityPerKm2} people/km²`, 'BPS projection and land area, 2025')}
      ${fact('Urban share', `${populationKeyFacts.urbanShare.toFixed(2)}%`, populationKeyFacts.sourceWdi)}
    </section>
    <section class="two-col" style="margin-top:12px">
      <article class="panel"><header class="panel-header"><div><h2>Population pyramid, 2025</h2><p>Five-year age groups; male left, female right.</p></div></header><div class="panel-body">${populationPyramid({ groups: populationPyramid2025, width: 560, height: 470, ariaLabel: 'Indonesia population pyramid, 2025' })}<p class="source-line">BPS mid-year population projection, 2025; age-sex distribution rounded</p></div></article>
      <div class="section-stack">
        <article class="panel"><header class="panel-header"><div><h3>History and projection</h3><p>Mid-year population, million people.</p></div></header><div class="panel-body">${history}<p class="source-line">BPS census/projection series through 2025; 2030 point is a projection</p></div></article>
        <article class="panel"><header class="panel-header"><div><h3>Demographic facts</h3></div></header><div class="panel-body"><dl class="detail-list">
          ${row('Life expectancy', `${populationKeyFacts.lifeExpectancy.toFixed(1)} years`, 'World Bank WDI, 2024')}
          ${row('Fertility rate', `${populationKeyFacts.fertilityRate.toFixed(2)} births/woman`, 'World Bank WDI, 2024')}
          ${row('Dependency ratio', `${populationKeyFacts.dependencyRatio.toFixed(1)} per 100`, 'BPS projection, 2025')}
          ${row('Working-age share', `${populationKeyFacts.workingAgeShare.toFixed(1)}%`, 'BPS projection, 2025')}
        </dl></div></article>
      </div>
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Urbanization', 'Share of population living in urban areas', urban, 'World Bank WDI, 2015–2024')}
      ${panel('Vital indicators', 'Life expectancy and fertility trend', vital, 'World Bank WDI, 2015–2024; fertility scaled ×10 only for visual comparison')}
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Top ten provinces by population</h2><p>Java dominates the distribution.</p></div><a href="#/regions">Open regions</a></header><div class="panel-body">${topBars}<p class="source-line">BPS provincial mid-year population estimates, 2024</p></div></section>`;
  return { html };
}

function fact(label, value, note) {
  return `<div class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(note)}</div></div>`;
}
function row(term, value, note) {
  return `<div class="detail-row"><dt>${escapeHtml(term)}<br><small class="source-line">${escapeHtml(note)}</small></dt><dd>${escapeHtml(value)}</dd></div>`;
}
function panel(title, subtitle, chart, source) {
  return `<article class="panel"><header class="panel-header"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(source)}</p></div></article>`;
}
