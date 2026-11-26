import { escapeHtml, formatMillionIdr, formatPercent, formatWholeIdr } from '../format.js';
import { lineChart } from '../charts/line.js';
import { horizontalBarChart } from '../charts/bar.js';
import { donutChart } from '../charts/donut.js';
import { employmentBySectorFeb2025, employmentFormalityFeb2025, labourForceSeries, labourKeyFacts, minimumWageLeaders2025, unemploymentSeries } from '../data/labour.js';
import { provinceStatistics } from '../data/regions.js';

export function renderLabour() {
  const unemployment = lineChart({
    labels: unemploymentSeries.map((row) => row.year),
    series: [{ name: 'Open unemployment rate', color: '#a51f2d', values: unemploymentSeries.map((row) => row.value) }],
    width: 650, height: 265, area: true, yLabel: '% of labour force', valueFormat: (v) => formatPercent(v), ariaLabel: 'Open unemployment rate, 2015 to 2025',
  });
  const labourForce = lineChart({
    labels: labourForceSeries.map((row) => row.year),
    series: [{ name: 'Labour force', color: '#244e79', values: labourForceSeries.map((row) => row.value) }],
    width: 560, height: 225, area: true, yLabel: 'million people', valueFormat: (v) => `${v.toFixed(1)} million`, ariaLabel: 'Labour force size',
  });
  const sectorDonut = donutChart({ items: employmentBySectorFeb2025, width: 530, height: 285, centerLabel: 'Employment', ariaLabel: 'Employment by sector, February 2025' });
  const formality = donutChart({ items: employmentFormalityFeb2025, width: 500, height: 235, centerLabel: 'Formality', ariaLabel: 'Formal and informal employment shares' });
  const wageItems = minimumWageLeaders2025.map((row) => ({ ...row, color: row.value > 4000000 ? '#a51f2d' : '#244e79' }));
  const wages = horizontalBarChart({
    items: wageItems,
    width: 630, rowHeight: 28, labelWidth: 170, valueFormat: (v) => formatWholeIdr(v), color: (item) => item.color, ariaLabel: 'Highest and lowest provincial minimum wages, 2025',
  });
  const lowestUmp = [...provinceStatistics].sort((a, b) => a.ump2025 - b.ump2025)[0];
  const highestUmp = [...provinceStatistics].sort((a, b) => b.ump2025 - a.ump2025)[0];
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Labour</p><h1>Unemployment is low, informality is the deeper problem</h1><p class="lede">Sakernas counted 153.05 million people in the labour force in February 2025. The headline unemployment rate was 4.76%, while most work remained informal.</p></div><div class="asof">Sakernas reference: Feb 2025<br>Published 5 May 2025</div></section>
    <section class="figure-row">
      ${fact('Unemployment rate', `${labourKeyFacts.unemploymentRate.toFixed(2)}%`, labourKeyFacts.source)}
      ${fact('Labour force', `${labourKeyFacts.labourForceM.toFixed(2)} million`, labourKeyFacts.source)}
      ${fact('Employed people', `${labourKeyFacts.employedM.toFixed(2)} million`, labourKeyFacts.source)}
      ${fact('Average employee wage', formatMillionIdr(labourKeyFacts.averageWageIdrM), 'per month · BPS Sakernas, Feb 2025')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Unemployment trend', 'Open unemployment rate, August series except latest February point', unemployment, 'BPS Sakernas, 2015–Feb 2025')}
      ${panel('Labour force growth', 'People working or available for work', labourForce, 'BPS Sakernas, rounded series')}
    </section>
    <section class="two-col" style="margin-top:12px">
      ${panel('Employment by sector', 'Shares of employed people, Feb 2025', sectorDonut, 'BPS Sakernas, Feb 2025; rounded shares')}
      ${panel('Formality split', 'Formal versus informal work, Feb 2025', formality, 'BPS Sakernas, Feb 2025')}
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Provincial minimum wages, 2025</h2><p>The highest and lowest ends of the 38-province UMP distribution.</p></div><a href="#/regions">Compare provinces</a></header><div class="panel-body">${wages}<p class="source-line">Minister of Manpower Regulation No. 16 of 2024; UMP values effective 2025</p></div></section>
    <section class="three-col" style="margin-top:12px">
      ${mini('Highest UMP', highestUmp.name, formatWholeIdr(highestUmp.ump2025))}
      ${mini('Lowest UMP', lowestUmp.name, formatWholeIdr(lowestUmp.ump2025))}
      ${mini('Youth unemployment', 'ages 15–24', formatPercent(labourKeyFacts.youthUnemployment, 1))}
    </section>`;
  return { html };
}
function fact(label, value, note) { return `<div class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(note)}</div></div>`; }
function panel(title, subtitle, chart, source) { return `<article class="panel"><header class="panel-header"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(subtitle)}</p></div></header><div class="panel-body">${chart}<p class="source-line">${escapeHtml(source)}</p></div></article>`; }
function mini(label, name, value) { return `<article class="fact-card"><div class="fact-label">${escapeHtml(label)}</div><div class="fact-value" style="font-size:21px">${escapeHtml(value)}</div><div class="fact-note">${escapeHtml(name)}</div></article>`; }
