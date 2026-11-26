import { escapeHtml, formatMonthLabel, formatPercent } from '../format.js';
import { lineChart } from '../charts/line.js';
import { horizontalBarChart } from '../charts/bar.js';
import { annualInflationAverage, inflationComponentsOctober2025, inflationGroupsOctober2025, latestPrices, monthlyInflation, policyRateDecisions } from '../data/prices.js';

export function renderPrices() {
  const labels = monthlyInflation.map((row) => formatMonthLabel(row.month));
  const monthly = lineChart({
    labels,
    series: [
      { name: 'Headline CPI', color: '#a51f2d', values: monthlyInflation.map((row) => row.value) },
      { name: 'Core CPI', color: '#244e79', values: monthlyInflation.map((row) => row.core) },
    ],
    width: 760, height: 310, dense: true, xEvery: 4, yLabel: '% year-on-year', valueFormat: (v) => formatPercent(v), ariaLabel: 'Monthly headline and core CPI inflation, 36 months',
  });
  const annual = lineChart({
    labels: annualInflationAverage.map((row) => row.year),
    series: [{ name: 'Average annual inflation', color: '#244e79', values: annualInflationAverage.map((row) => row.value) }],
    width: 560, height: 230, area: true, yLabel: '%', valueFormat: (v) => formatPercent(v), ariaLabel: 'Average annual CPI inflation',
  });
  const policy = lineChart({
    labels: policyRateDecisions.map((row) => formatMonthLabel(row.month)),
    series: [{ name: 'BI policy rate', color: '#a51f2d', values: policyRateDecisions.map((row) => row.value) }],
    width: 560, height: 230, step: true, yLabel: '%', valueFormat: (v) => formatPercent(v), ariaLabel: 'Bank Indonesia policy rate decisions',
  });
  const groups = horizontalBarChart({
    items: inflationGroupsOctober2025,
    width: 600, rowHeight: 27, labelWidth: 206, valueFormat: (v) => formatPercent(v), color: (item) => item.value < 0 ? 'var(--sage)' : 'var(--accent)', ariaLabel: 'Inflation by expenditure group, October 2025',
  });
  const components = horizontalBarChart({
    items: inflationComponentsOctober2025,
    width: 520, rowHeight: 34, labelWidth: 142, valueFormat: (v) => formatPercent(v), color: (item) => item.color, ariaLabel: 'Headline, core, volatile food and administered inflation',
  });
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Prices</p><h1>Inflation is back inside Bank Indonesia's target band</h1><p class="lede">October CPI inflation of 2.86% year-on-year sits inside the 2.5% ± 1% target corridor; food prices are the pressure point.</p></div><div class="asof">Latest CPI: October 2025<br>CPI index 109.04</div></section>
    <section class="figure-row">
      ${fact('Headline CPI', `${latestPrices.headlineYoy.toFixed(2)}%`, 'yoy · BPS CPI, Oct 2025')}
      ${fact('Core inflation', `${latestPrices.coreYoy.toFixed(2)}%`, 'yoy · BPS CPI, Oct 2025')}
      ${fact('Volatile food', `${latestPrices.volatileFoodYoy.toFixed(2)}%`, 'yoy · BPS CPI, Oct 2025')}
      ${fact('BI policy rate', '4.75%', 'Bank Indonesia, 22 Oct 2025')}
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Thirty-six months of CPI inflation</h2><p>Headline and core year-on-year rates. The band is 1.5%–3.5%.</p></div><span class="pill red">target 2.5% ± 1%</span></header><div class="panel-body">${monthly}<p class="source-line">BPS monthly CPI releases, Nov 2022–Oct 2025</p></div></section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Inflation by expenditure group', 'Year-on-year, October 2025', groups, 'BPS CPI expenditure groups, Oct 2025')}
      <div class="section-stack">
        ${panel('Core, volatile and administered', 'October 2025 components', components, 'BPS CPI component inflation, Oct 2025')}
        <article class="panel"><header class="panel-header"><div><h3>Reading the target</h3></div></header><div class="panel-body"><p>Bank Indonesia's inflation target is <strong>2.5% ± 1%</strong>. October's headline rate is inside the corridor, while volatile food at 6.59% explains most of the remaining pressure.</p><p class="source-line">Bank Indonesia inflation target and policy statement, 2025</p></div></article>
      </div>
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Annual average inflation', 'Calendar-year averages', annual, 'BPS annual CPI series through 2024')}
      ${panel('BI policy rate', 'Decision points since 2021', policy, 'Bank Indonesia Board of Governors statements through Oct 2025')}
    </section>`;
  return { html };
}

function fact(label, value, note) {
  return `<div class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(note)}</div></div>`;
}
function panel(title, subtitle, chart, source) {
  return `<article class="panel"><header class="panel-header"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(source)}</p></div></article>`;
}
