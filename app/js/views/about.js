import { escapeHtml } from '../format.js';

export function renderAbout() {
  const sources = [
    ['BPS–Statistics Indonesia, quarterly GDP release', 'Q3 2025, published 5 Nov 2025', 'GDP level, growth, sectoral and regional shares'],
    ['BPS–Statistics Indonesia, CPI releases', 'monthly through Oct 2025', 'headline, core, volatile food, administered and expenditure-group inflation'],
    ['BPS–Statistics Indonesia, Sakernas labour force release', 'Feb 2025, published 5 May 2025', 'labour force, employment, unemployment, wages and formality'],
    ['BPS–Statistics Indonesia, Profile of Poverty in Indonesia', 'Susenas Mar 2025, published 25 Jul 2025', 'poverty rate, poor population, poverty line and provincial poverty'],
    ['BPS–Statistics Indonesia, population projections', 'mid-year 2025 and provincial 2024', 'population, age structure, provinces and projection points'],
    ['Bank Indonesia', 'policy and reserve releases through Nov 2025', 'BI policy rate, official reserve assets, balance of payments'],
    ['Ministry of Finance', 'APBN KiTa Jan 2025 and APBN 2025 posture', 'revenue, expenditure and deficit'],
    ['World Bank World Development Indicators', '2024 database vintage', 'urbanization, fertility, life expectancy and US-dollar GDP per capita'],
    ['Ministry of Manpower Regulation No. 16 of 2024', 'effective 2025', 'provincial minimum wages'],
  ].map(([name, year, use]) => `<article><strong>${escapeHtml(name)}</strong><span>${escapeHtml(year)} · used for ${escapeHtml(use)}</span></article>`).join('');
  const terms = [
    ['GDP at constant prices', 'Output valued at base-year prices so growth excludes price changes. Indonesia currently uses 2010 as the base year in the quoted quarterly releases.'],
    ['Year-on-year', 'Comparison with the same quarter or month one year earlier, reducing seasonal effects.'],
    ['Core inflation', 'CPI inflation excluding volatile food and administered prices, used to read underlying price pressure.'],
    ['Open unemployment rate', 'The share of the labour force without work, available for work and seeking or preparing work under the Sakernas definition.'],
    ['Poverty line', 'The monthly per-capita expenditure threshold below which a person is counted as poor; it differs by area and period.'],
    ['Labour force participation rate', 'The labour force as a share of the working-age population.'],
    ['GRDP', 'Gross regional domestic product, the provincial analogue of GDP.'],
    ['UMP', 'Upah Minimum Provinsi, the provincial minimum wage floor for the year.'],
    ['Age dependency ratio', 'People below 15 and above 64 per 100 people of working age.'],
    ['Official reserve assets', 'Foreign-currency assets, gold and related reserve claims controlled by monetary authorities.'],
  ].map(([term, definition]) => `<div class="glossary-item"><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join('');
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Sources and method</p><h1>What NusaData is, and how to read it</h1><p class="lede">NusaData is an independent, static national-statistics reference: a dense reading surface over published Indonesian official statistics, not an official government product.</p></div><div class="asof">Compilation vintage<br>November 2025 releases</div></section>
    <section class="panel"><header class="panel-header"><div><h2>Source ledger</h2><p>Every chart and figure in the application is tied to one of these publications.</p></div></header><div class="panel-body source-ledger">${sources}</div></section>
    <section class="two-col" style="margin-top:12px">
      <article class="panel"><header class="panel-header"><div><h2>Editorial method</h2></div></header><div class="panel-body"><p>Values are transcribed or rounded from published official releases. When series use different statistical vintages — for example census counts, mid-year projections and World Bank WDI estimates — the label names the source rather than silently blending them. Rounded provincial income values are marked as rounded in the source line. The site never calls a network API in the browser; updating means editing a data module and redeploying the static files.</p><p class="source-line">NusaData editorial note, 2025 compilation</p></div></article>
      <article class="panel"><header class="panel-header"><div><h2>Honest limitations</h2></div></header><div class="panel-body"><p>This is a reference portal, not a replacement for microdata or official tabulations. Provincial GRDP per-capita values are rounded for comparison; detailed reconciliation should use BPS tables. Some longer history is shown to provide context even where the latest headline uses a newer survey round.</p><p class="source-line">NusaData methodology note, 2025</p></div></article>
    </section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>Glossary of statistical terms</h2></div></header><div class="panel-body"><dl class="glossary">${terms}</dl></div></section>`;
  return { html };
}
