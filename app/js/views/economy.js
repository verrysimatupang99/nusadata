import { escapeHtml, formatBillionUsd, formatPercent, formatTrillionIdr } from '../format.js';
import { lineChart } from '../charts/line.js';
import { horizontalBarChart, verticalGroupedBarChart } from '../charts/bar.js';
import { donutChart } from '../charts/donut.js';
import { annualRealGdpGrowth, budgetSummary, expenditureComposition2024, fxReservesSeries, gdpPerCapitaSeries, latestEconomy, quarterlyRealGdpGrowth, sectorComposition2024, topExportCommodities2024, tradeBalanceSeries } from '../data/economy.js';

export function renderEconomy() {
  const annual = lineChart({
    labels: annualRealGdpGrowth.map((row) => row.year),
    series: [{ name: 'Annual growth', color: '#a51f2d', values: annualRealGdpGrowth.map((row) => row.value) }],
    width: 650, height: 265, area: true, yLabel: '% year-on-year', valueFormat: (v) => formatPercent(v), ariaLabel: 'Annual real GDP growth, 2015 to 2024',
  });
  const quarterly = lineChart({
    labels: quarterlyRealGdpGrowth.map((row) => row.quarter),
    series: [{ name: 'Quarterly growth yoy', color: '#244e79', values: quarterlyRealGdpGrowth.map((row) => row.value) }],
    width: 650, height: 235, yLabel: '% year-on-year', valueFormat: (v) => formatPercent(v), ariaLabel: 'Quarterly real GDP growth, 2023 to Q3 2025',
  });
  const perCapita = lineChart({
    labels: gdpPerCapitaSeries.map((row) => row.year),
    series: [
      { name: 'Rp million per person', color: '#a51f2d', values: gdpPerCapitaSeries.map((row) => row.idrM) },
    ],
    width: 570, height: 230, area: true, yLabel: 'Rp million', valueFormat: (v) => `Rp ${v.toFixed(1)}M`, ariaLabel: 'GDP per capita in million rupiah',
  });
  const reserves = lineChart({
    labels: fxReservesSeries.map((row) => row.year),
    series: [{ name: 'Official reserve assets', color: '#244e79', values: fxReservesSeries.map((row) => row.value) }],
    width: 570, height: 230, area: true, yLabel: 'US$ billion', valueFormat: (v) => formatBillionUsd(v), ariaLabel: 'Official reserve assets',
  });
  const trade = verticalGroupedBarChart({
    labels: tradeBalanceSeries.map((row) => row.year),
    series: [
      { name: 'Exports', color: '#244e79', values: tradeBalanceSeries.map((row) => row.exports) },
      { name: 'Imports', color: '#a51f2d', values: tradeBalanceSeries.map((row) => row.imports) },
    ],
    width: 650, height: 255, valueFormat: (v) => formatBillionUsd(v), ariaLabel: 'Exports and imports of goods',
  });
  const commodities = horizontalBarChart({
    items: topExportCommodities2024,
    width: 570, rowHeight: 28, labelWidth: 188,
    valueFormat: (v) => formatBillionUsd(v), color: 'var(--navy)', ariaLabel: 'Leading export commodity groups',
  });
  const sectorDonut = donutChart({ items: sectorComposition2024, width: 520, height: 282, centerLabel: 'GDP by production', ariaLabel: 'Sectoral composition of GDP, 2024' });
  const demandDonut = donutChart({ items: expenditureComposition2024, width: 520, height: 250, centerLabel: 'GDP by expenditure', ariaLabel: 'Expenditure composition of GDP, 2024' });
  const b = budgetSummary.year2024;
  const n = budgetSummary.year2025;
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Economy</p><h1>National accounts, trade and the public purse</h1><p class="lede">Indonesia's economy is still anchored by household demand and Java, but commodity exports, manufacturing and fiscal settings shape the cycle.</p></div><div class="asof">Latest GDP: Q3 2025<br>${escapeHtml(latestEconomy.sourceQ3)}</div></section>
    <section class="figure-row">
      ${fact('Real GDP growth', `${latestEconomy.gdpGrowthQ3.toFixed(2)}%`, 'Q3 2025 yoy · BPS, Nov 2025')}
      ${fact('GDP at current prices', formatTrillionIdr(latestEconomy.gdpCurrentQ3T), 'Q3 2025 · BPS, Nov 2025')}
      ${fact('GDP per capita', 'Rp 85.2M', '2025 estimate · about US$5,215')}
      ${fact('Java share of GDP', `${latestEconomy.javaShareOfGdp.toFixed(1)}%`, 'Q3 2025 · BPS')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Annual growth history', 'Real GDP, constant 2010 prices', annual, 'BPS annual national accounts, 2015–2024')}
      ${panel('Recent quarters', 'Year-on-year quarterly growth', quarterly, 'BPS quarterly GDP releases through Nov 2025')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Production composition', 'Shares of GDP, 2024', sectorDonut, 'BPS national accounts by industry, 2024; rounded')}
      ${panel('Expenditure composition', 'Shares of GDP, 2024', demandDonut, 'BPS national accounts by expenditure, 2024; rounded')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('GDP per capita', 'Current rupiah per person', perCapita, 'BPS national accounts; 2025 estimate shown distinctly')}
      ${panel('Foreign reserves', 'Official reserve assets', reserves, 'Bank Indonesia international reserves, end-Oct 2025')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Goods trade', 'Exports and imports, annual', trade, 'BPS foreign trade statistics, 2015–2024')}
      ${panel('Leading exports', 'Broad commodity groups, 2024', commodities, 'BPS/UN Comtrade commodity groupings, 2024; rounded')}
    </section>
    <section class="panel" style="margin-top:12px">
      <header class="panel-header"><div><p class="eyebrow">Public finances</p><h2>APBN: deficit inside the three-percent rule</h2><p>Central government revenue, expenditure and deficit.</p></div></header>
      <div class="panel-body budget-grid">
        ${budgetCard('2024 realization', b)}
        ${budgetCard('2025 budget posture', n)}
      </div>
      <div class="panel-body" style="padding-top:0"><p class="source-line">Ministry of Finance APBN KiTa, Jan 2025; APBN 2025 budget posture</p></div>
    </section>`;
  return { html };
}

function fact(label, value, note) {
  return `<div class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(note)}</div></div>`;
}

function panel(title, subtitle, chart, source) {
  return `<article class="panel"><header class="panel-header"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(source)}</p></div></article>`;
}

function budgetCard(title, row) {
  return `<article class="fact-card budget-card"><div class="fact-label">${escapeHtml(title)}</div><dl class="detail-list"><div class="detail-row"><dt>Revenue</dt><dd>${formatTrillionIdr(row.revenueT)}</dd></div><div class="detail-row"><dt>Expenditure</dt><dd>${formatTrillionIdr(row.expenditureT)}</dd></div><div class="detail-row"><dt>Deficit</dt><dd>${formatTrillionIdr(row.deficitT)} · ${row.deficitPctGdp.toFixed(2)}% GDP</dd></div></dl></article>`;
}
