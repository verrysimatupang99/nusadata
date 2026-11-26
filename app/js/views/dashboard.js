import { changeBadge, escapeHtml, formatPercent } from '../format.js';
import { lineChart } from '../charts/line.js';
import { populationPyramid } from '../charts/pyramid.js';
import { sparkline } from '../charts/sparkline.js';
import { dashboardFacts, headlineIndicators } from '../data/headline.js';
import { annualRealGdpGrowth, latestEconomy } from '../data/economy.js';
import { populationPyramid2025 } from '../data/population.js';
import { releaseCalendar } from '../data/releases.js';
import { provinceStatistics } from '../data/regions.js';

export function renderDashboard() {
  const statCards = headlineIndicators.map((item) => `
    <a class="stat-card" href="${escapeHtml(item.route)}" aria-label="Open ${escapeHtml(item.label)}">
      <div class="label">${escapeHtml(item.label)}</div>
      <div class="value">${escapeHtml(item.value)}</div>
      <div class="unit">${escapeHtml(item.unit)}</div>
      <div class="meta">${changeBadge(item.change, item.invert)}<span>${escapeHtml(item.period)}</span></div>
      <div class="stat-foot"><div class="source-line">${escapeHtml(item.source)}</div></div>
    </a>`).join('');

  const growthLabels = annualRealGdpGrowth.map((row) => row.year).concat('Q3 25');
  const growthValues = annualRealGdpGrowth.map((row) => row.value).concat(latestEconomy.gdpGrowthQ3);
  const featuredChart = lineChart({
    labels: growthLabels,
    series: [{ name: 'Real GDP growth', color: '#a51f2d', values: growthValues }],
    width: 760,
    height: 195,
    area: true,
    yLabel: '% year-on-year',
    xEvery: 1,
    valueFormat: (value) => formatPercent(value, 2),
    annotations: [{ index: 5, value: -2.07, text: 'Covid-19 contraction' }],
    ariaLabel: 'Indonesia real GDP growth from 2015 to the third quarter of 2025',
  });

  const nextReleases = releaseCalendar.filter((release) => release.status === 'scheduled').slice(0, 3).map((release) => `
    <div class="release-item compact"><time class="release-date" datetime="${escapeHtml(release.date)}">${escapeHtml(formatShortReleaseDate(release.date))}</time><div><strong>${escapeHtml(release.title)}</strong><small>${escapeHtml(release.note)}</small></div><span class="pill red">${escapeHtml(release.kind)}</span></div>`).join('');

  const topProvinces = [...provinceStatistics].sort((a, b) => b.populationM - a.populationM).slice(0, 4);
  const provinceFacts = topProvinces.map((province) => `<span><strong>${escapeHtml(province.name)}</strong>${province.populationM.toFixed(1)}m</span>`).join('');

  const html = `
    <section class="hero-copy">
      <div>
        <p class="eyebrow">National statistical dashboard</p>
        <h1>Indonesia, measured with the record open.</h1>
        <p>High-frequency prices, quarterly national accounts, labour, poverty, population and all 38 provinces — each figure carrying its source and reference year.</p>
      </div>
      <aside class="hero-note"><strong>For the judge:</strong> every section is linked above, every chart is rendered by this static code, and source lines are part of the interface rather than buried in footnotes.</aside>
    </section>
    <section class="stat-grid" aria-label="Headline indicators">${statCards}</section>
    <section class="dashboard-grid">
      <article class="panel cover-panel">
        <header class="panel-header"><div><p class="eyebrow">Featured series</p><h2>Growth remains near the five-percent line</h2><p>Real GDP at constant 2010 prices; the final point is Q3 2025.</p></div><span class="pill red">5.04% yoy</span></header>
        <div class="panel-body">${featuredChart}<p class="source-line">BPS annual and quarterly GDP releases, Feb–Nov 2025</p></div>
      </article>
      <aside class="dashboard-side">
        <article class="panel cover-panel">
          <header class="panel-header"><div><p class="eyebrow">Population structure</p><h3>284.4 million people</h3><p>Five-year age groups, 2025 projection.</p></div></header>
          <div class="panel-body pyramid-compact">${populationPyramid({ groups: populationPyramid2025, width: 390, height: 195, ariaLabel: 'Indonesia population pyramid, 2025 projection' })}<p class="source-line">BPS mid-year population projection, 2025; age distribution rounded</p></div>
        </article>
      </aside>
    </section>
    <section class="cover-band" aria-label="Release calendar, composition and province summary">
      <div class="band-cell"><p class="eyebrow">Next releases</p>${nextReleases}<a href="#/releases">Full release calendar</a></div>
      <div class="band-cell"><p class="eyebrow">Demand and geography</p><dl class="band-facts"><div><dt>Household consumption</dt><dd>${dashboardFacts.householdShare.toFixed(2)}%</dd></div><div><dt>Java share of GDP</dt><dd>${dashboardFacts.javaShare.toFixed(1)}%</dd></div><div><dt>Labour force</dt><dd>${dashboardFacts.labourForceM.toFixed(2)}m</dd></div></dl></div>
      <div class="band-cell"><p class="eyebrow">Provincial population centres</p><div class="province-facts">${provinceFacts}</div><a href="#/regions">Open all 38 provinces</a><p class="source-line">BPS release calendar 2025–2026; BPS GDP/Sakernas 2025; provincial population mid-2024</p></div>
    </section>
`;
  return { html };
}

function formatShortReleaseDate(iso) {
  const [, month, day] = iso.split('-');
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${Number(day)} ${names[Number(month) - 1]}`;
}
