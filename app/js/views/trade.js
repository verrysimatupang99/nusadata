import { escapeHtml, formatBillionUsd, formatNumber, formatPercent } from '../format.js';
import { lineChart } from '../charts/line.js';
import { horizontalBarChart, verticalGroupedBarChart } from '../charts/bar.js';
import { exportCommodities2024, goodsTradeAnnual, internationalArrivalsAnnual, tourism2024, tourism2025, tradeBalance, tradeSourceNotes, tradingPartners2024 } from '../data/trade.js';

export function renderTrade() {
  const latest = goodsTradeAnnual.at(-1);
  const latestBalance = tradeBalance(latest);
  const flows = verticalGroupedBarChart({
    labels: goodsTradeAnnual.map((row) => row.year),
    series: [
      { name: 'Exports', color: '#244e79', values: goodsTradeAnnual.map((row) => row.exports) },
      { name: 'Imports', color: '#a51f2d', values: goodsTradeAnnual.map((row) => row.imports) },
    ],
    width: 700, height: 245, valueFormat: (value) => formatBillionUsd(value), ariaLabel: 'Indonesia exports and imports of goods, 2015 to 2024',
  });
  const balanceChart = lineChart({
    labels: goodsTradeAnnual.map((row) => row.year),
    series: [{ name: 'Goods balance', color: '#667f5c', values: goodsTradeAnnual.map(tradeBalance) }],
    width: 390, height: 126, area: true, xEvery: 2, yLabel: 'US$ billion',
    valueFormat: (value) => `${value >= 0 ? '+' : ''}${formatBillionUsd(value)}`, ariaLabel: 'Goods trade balance, 2015 to 2024',
  });
  const arrivalsChart = lineChart({
    labels: internationalArrivalsAnnual.map((row) => row.year),
    series: [{ name: 'International visitor arrivals', color: '#ad7c24', values: internationalArrivalsAnnual.map((row) => row.visitsM) }],
    width: 390, height: 126, area: true, xEvery: 2, yLabel: 'million visits',
    valueFormat: (value) => `${formatNumber(value, 1)}M`, ariaLabel: 'International visitor arrivals, 2015 to 2024',
  });
  const commodities = horizontalBarChart({
    items: exportCommodities2024.map((row) => ({ label: row.label, value: row.sharePct, note: `${formatBillionUsd(row.value)} · ${row.note}` })),
    width: 600, rowHeight: 28, labelWidth: 205, valueFormat: (value) => formatPercent(value, 1), color: 'var(--navy)', ariaLabel: 'Top export commodities by share of goods exports, 2024',
  });
  const partnerBars = horizontalBarChart({
    items: tradingPartners2024.map((row) => ({ label: row.name, value: row.exportValue + row.importValue, note: `exports ${formatBillionUsd(row.exportValue)} · imports ${formatBillionUsd(row.importValue)}` })),
    width: 600, rowHeight: 30, labelWidth: 132, valueFormat: (value) => formatBillionUsd(value), color: 'var(--accent)', ariaLabel: 'Leading trading partners by two-way goods trade, 2024',
  });
  const origins = horizontalBarChart({
    items: tourism2024.topOrigins.map((row) => ({ label: row.label, value: row.value, note: `${formatPercent(row.sharePct, 1)} of arrivals` })),
    width: 590, rowHeight: 28, labelWidth: 118, valueFormat: (value) => `${formatNumber(value, 2)}M`, color: '#ad7c24', ariaLabel: 'Foreign visitor arrivals by country of origin, 2024',
  });
  const entryPoints = horizontalBarChart({
    items: tourism2024.entryPoints.map((row) => ({ label: row.label, value: row.value, note: `${row.note} entry` })),
    width: 590, rowHeight: 28, labelWidth: 190, valueFormat: (value) => `${formatNumber(value, 2)}M`, color: 'var(--navy)', ariaLabel: 'Main entry points for foreign visitors, 2024',
  });
  const partnerRows = tradingPartners2024.map((row) => {
    const balance = row.exportValue - row.importValue;
    return `<tr><td><strong>${escapeHtml(row.name)}</strong></td><td class="num">${formatBillionUsd(row.exportValue)}</td><td class="num">${formatPercent(row.exportSharePct, 1)}</td><td class="num">${formatBillionUsd(row.importValue)}</td><td class="num">${formatPercent(row.importSharePct, 1)}</td><td class="num">${balance >= 0 ? '+' : '−'}${formatBillionUsd(Math.abs(balance))}</td></tr>`;
  }).join('');
  const progressPct = Math.min(100, tourism2025.arrivalsJanSepM / tourism2025.targetUpperM * 100);
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Trade and tourism</p><h1>Trade surpluses and the tourism recovery</h1><p class="lede">Goods exports reached US$264.7 billion in 2024, while tourism continued its post-pandemic recovery toward the government's 14.6–16 million visitor target range for 2025.</p></div><div class="asof">Trade year: 2024<br>Tourism data through Sep 2025</div></section>
    <section class="figure-row">
      ${fact('Exports of goods', formatBillionUsd(latest.exports), '2024 · BPS foreign trade')}
      ${fact('Imports of goods', formatBillionUsd(latest.imports), '2024 · BPS foreign trade')}
      ${fact('Goods trade balance', `+${formatBillionUsd(latestBalance)}`, '2024 surplus · fifth consecutive annual surplus')}
      ${fact('Foreign visitors', `${formatNumber(tourism2024.totalArrivalsM, 2)}M`, '2024 arrivals · BPS tourism statistics')}
    </section>
    <section class="trade-overview-grid">
      <article class="panel"><header class="panel-header"><div><p class="eyebrow">Goods trade flows</p><h2>Exports remain ahead of imports</h2><p>Annual free-on-board goods values.</p></div><span class="pill red">+US$31.0B in 2024</span></header><div class="panel-body">${flows}<p class="source-line">${escapeHtml(tradeSourceNotes.goods)}</p></div></article>
      <aside class="trade-mini-stack">
        <article class="panel compact-chart-panel"><header class="panel-header"><div><h3>Balance turning point</h3><p>Deficits in 2018–2019 became a long surplus run.</p></div></header><div class="panel-body">${balanceChart}<p class="source-line">BPS foreign trade statistics, 2015–2024</p></div></article>
        <article class="panel compact-chart-panel"><header class="panel-header"><div><h3>Tourism recovery</h3><p>Arrivals are closing on the 2019 peak.</p></div></header><div class="panel-body">${arrivalsChart}<p class="source-line">BPS International Visitor Arrivals Statistics, 2015–2024</p></div></article>
      </aside>
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Top export commodities', 'Shares of goods exports, 2024', commodities, tradeSourceNotes.commodities)}
      ${panel('Leading trading partners', 'Two-way goods trade, 2024', partnerBars, tradeSourceNotes.partners)}
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Partner balance sheet</h2><p>Export destination and import origin shares differ sharply by country.</p></div></header><div class="data-table-wrap"><table class="data-table"><thead><tr><th>Partner</th><th class="num">Exports</th><th class="num">Export share</th><th class="num">Imports</th><th class="num">Import share</th><th class="num">Balance</th></tr></thead><tbody>${partnerRows}</tbody></table></div><div class="panel-body"><p class="source-line">${escapeHtml(tradeSourceNotes.partners)}; balances are exports minus imports</p></div></section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Where visitors come from', 'Foreign visitor arrivals by nationality, 2024', origins, 'BPS International Visitor Arrivals Statistics, 2024; nationality table rounded')}
      ${panel('Where visitors enter', 'Main air and sea gateways, 2024', entryPoints, 'BPS International Visitor Arrivals Statistics, 2024; entry-point table rounded')}
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><p class="eyebrow">International visitor arrivals</p><h2>2025 is tracking inside the target corridor</h2><p>January–September arrivals reached 11.43 million, up 10.22% from the same period of 2024.</p></div><span class="pill red">target 14.6–16.0M</span></header><div class="panel-body target-panel"><div class="target-copy"><dl class="detail-list">
      ${detail('Jan–Sep 2025 arrivals', `${formatNumber(tourism2025.arrivalsJanSepM, 2)} million`, tradeSourceNotes.tourism2025)}
      ${detail('September arrivals', `${formatNumber(tourism2025.septemberArrivalsM, 2)} million · +${formatNumber(tourism2025.septemberGrowthPct, 2)}% yoy`, 'BPS monthly tourism release, Nov 2025')}
      ${detail('Bali direct arrivals 2024', `${formatNumber(tourism2024.baliDirectArrivalsM, 2)} million · ${formatPercent(tourism2024.baliSharePct, 1)} of national arrivals`, 'BPS Bali foreign tourist statistics, 2024')}
      ${detail('Average visitor spend', `US$${formatNumber(tourism2025.averageSpendUsd, 2)} · ${formatNumber(tourism2025.averageStayNights, 1)} nights`, 'BPS quarterly tourism expenditure survey, Q3 2025')}
    </dl></div><div class="target-meter" role="img" aria-label="January to September 2025 arrivals are ${formatNumber(progressPct, 1)} percent of the upper target"><div class="target-meter-track"><span style="width:${progressPct.toFixed(1)}%"></span><i style="left:${(tourism2025.targetLowerM / tourism2025.targetUpperM * 100).toFixed(1)}%"></i></div><div class="target-meter-labels"><span>0</span><strong>${formatNumber(tourism2025.arrivalsJanSepM, 2)}M by Sep</strong><span>16.0M upper target</span></div><p>${escapeHtml(tourism2025.sourceMarketNote)}.</p><p class="source-line">${escapeHtml(tradeSourceNotes.tourism2025)}</p></div></div></section>`;
  return { html };
}

function fact(label, value, note) {
  return `<div class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(note)}</div></div>`;
}
function panel(title, subtitle, chart, source) {
  return `<article class="panel"><header class="panel-header"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(source)}</p></div></article>`;
}
function detail(term, value, note) {
  return `<div class="detail-row"><dt>${escapeHtml(term)}<br><small class="source-line">${escapeHtml(note)}</small></dt><dd>${escapeHtml(value)}</dd></div>`;
}
