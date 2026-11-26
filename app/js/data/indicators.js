import { annualRealGdpGrowth, expenditureComposition2024, fxReservesSeries, gdpPerCapitaSeries, nominalGdpSeries, quarterlyRealGdpGrowth, tradeBalanceSeries } from './economy.js';
import { annualInflationAverage, inflationComponentsOctober2025, monthlyInflation, policyRateDecisions } from './prices.js';
import { fertilitySeries, lifeExpectancySeries, populationHistory, populationKeyFacts, urbanizationSeries } from './population.js';
import { employmentFormalityFeb2025, labourForceSeries, labourKeyFacts, unemploymentSeries } from './labour.js';
import { provinceStatistics } from './regions.js';

export function rowsToSeries(rows, labelKey, valueKey) {
  return { labels: rows.map((row) => row[labelKey]), values: rows.map((row) => row[valueKey]) };
}

export function makeIndicator(config) {
  return {
    changeSuffix: '%',
    invert: false,
    decimals: 2,
    methodology: 'Compiled from the named official release. Series are rounded for display; use the source release for tabulation-grade decimals.',
    ...config,
  };
}

const years10 = ['2015', '2016', '2017', '2018', '2019', '2020', '2021', '2022', '2023', '2024'];
const gdpGrowthRows = rowsToSeries(quarterlyRealGdpGrowth, 'quarter', 'value');
const nominalRows = rowsToSeries(nominalGdpSeries, 'year', 'value');
const perCapitaRows = rowsToSeries(gdpPerCapitaSeries, 'year', 'idrM');
const perCapitaUsdRows = rowsToSeries(gdpPerCapitaSeries.filter((row) => row.year !== '2025 est.'), 'year', 'usd');
const populationRows = rowsToSeries(populationHistory, 'year', 'value');
const urbanRows = rowsToSeries(urbanizationSeries, 'year', 'value');
const fertilityRows = rowsToSeries(fertilitySeries, 'year', 'value');
const lifeRows = rowsToSeries(lifeExpectancySeries, 'year', 'value');
const unemploymentRows = rowsToSeries(unemploymentSeries, 'year', 'value');
const labourForceRows = rowsToSeries(labourForceSeries, 'year', 'value');
const inflationRows = rowsToSeries(monthlyInflation, 'month', 'value');
const coreRows = rowsToSeries(monthlyInflation, 'month', 'core');
const annualInflationRows = rowsToSeries(annualInflationAverage, 'year', 'value');
const reservesRows = rowsToSeries(fxReservesSeries, 'year', 'value');
const policyRows = rowsToSeries(policyRateDecisions, 'month', 'value');
const jakarta = provinceStatistics.find((province) => province.code === 'JK');
const westJava = provinceStatistics.find((province) => province.code === 'JB');
const highlandPapua = provinceStatistics.find((province) => province.code === 'PG');
const bali = provinceStatistics.find((province) => province.code === 'BA');

export const indicatorCatalog = [
  makeIndicator({ id: 'real-gdp-growth', name: 'Real GDP growth', category: 'Economy', unit: '% year-on-year', latest: '5.04%', period: 'Q3 2025', change: 0.09, changeSuffix: ' pp', source: 'BPS GDP release, Nov 2025', labels: gdpGrowthRows.labels, series: gdpGrowthRows.values, methodology: 'Year-on-year growth of gross domestic product at constant 2010 market prices.' }),
  makeIndicator({ id: 'nominal-gdp', name: 'GDP at current market prices', category: 'Economy', unit: 'Rp trillion', latest: 'Rp 22,139T', period: '2024', change: 5.96, source: 'BPS annual national accounts, Feb 2025', labels: nominalRows.labels, series: nominalRows.values }),
  makeIndicator({ id: 'gdp-per-capita', name: 'GDP per capita', category: 'Economy', unit: 'Rp million', latest: 'Rp 85.2M', period: '2025 estimate', change: 8.4, source: 'BPS estimate, 2025', labels: perCapitaRows.labels, series: perCapitaRows.values }),
  makeIndicator({ id: 'gdp-per-capita-usd', name: 'GDP per capita, US dollars', category: 'Economy', unit: 'current US$', latest: 'US$4,925', period: '2024', change: 1.01, source: 'World Bank WDI, 2024', labels: perCapitaUsdRows.labels, series: perCapitaUsdRows.values }),
  makeIndicator({ id: 'household-consumption-share', name: 'Household consumption share of GDP', category: 'Economy', unit: '% of GDP', latest: '54.25%', period: '2024', change: 0.1, changeSuffix: ' pp', source: 'BPS expenditure GDP, 2024', labels: ['2020', '2021', '2022', '2023', '2024'], series: [53.6, 54.0, 53.9, 54.0, 54.25] }),
  makeIndicator({ id: 'manufacturing-share', name: 'Manufacturing share of GDP', category: 'Economy', unit: '% of GDP', latest: '18.7%', period: '2024', change: -0.2, changeSuffix: ' pp', source: 'BPS production GDP, 2024', labels: ['2020', '2021', '2022', '2023', '2024'], series: [19.8, 19.4, 19.1, 18.9, 18.7] }),
  makeIndicator({ id: 'exports-goods', name: 'Exports of goods', category: 'Economy', unit: 'US$ billion', latest: 'US$264.7B', period: '2024', change: 2.3, source: 'BPS foreign trade, 2024', labels: tradeBalanceSeries.map((row) => row.year), series: tradeBalanceSeries.map((row) => row.exports) }),
  makeIndicator({ id: 'imports-goods', name: 'Imports of goods', category: 'Economy', unit: 'US$ billion', latest: 'US$233.7B', period: '2024', change: 5.3, source: 'BPS foreign trade, 2024', labels: tradeBalanceSeries.map((row) => row.year), series: tradeBalanceSeries.map((row) => row.imports) }),
  makeIndicator({ id: 'trade-balance', name: 'Goods trade balance', category: 'Economy', unit: 'US$ billion', latest: 'US$31.0B surplus', period: '2024', change: -16.0, source: 'BPS foreign trade, 2024', labels: tradeBalanceSeries.map((row) => row.year), series: tradeBalanceSeries.map((row) => row.exports - row.imports) }),
  makeIndicator({ id: 'foreign-reserves', name: 'Official reserve assets', category: 'Economy', unit: 'US$ billion', latest: 'US$149.9B', period: 'Oct 2025', change: 0.8, source: 'Bank Indonesia, Nov 2025', labels: reservesRows.labels, series: reservesRows.values }),
  makeIndicator({ id: 'budget-revenue', name: 'State revenue', category: 'Economy', unit: 'Rp trillion', latest: 'Rp 2,842.5T', period: '2024 realization', change: 2.1, source: 'Ministry of Finance APBN KiTa, Jan 2025', labels: ['2021', '2022', '2023', '2024'], series: [2011.3, 2626.4, 2783.9, 2842.5] }),
  makeIndicator({ id: 'budget-expenditure', name: 'State expenditure', category: 'Economy', unit: 'Rp trillion', latest: 'Rp 3,350.3T', period: '2024 realization', change: 7.3, source: 'Ministry of Finance APBN KiTa, Jan 2025', labels: ['2021', '2022', '2023', '2024'], series: [2786.8, 3096.3, 3121.2, 3350.3] }),
  makeIndicator({ id: 'budget-deficit', name: 'Central government deficit', category: 'Economy', unit: '% of GDP', latest: '2.29% of GDP', period: '2024', change: 0.68, changeSuffix: ' pp', source: 'Ministry of Finance, Jan 2025', labels: ['2021', '2022', '2023', '2024'], series: [4.57, 2.35, 1.61, 2.29], invert: true }),
  makeIndicator({ id: 'current-account', name: 'Current account balance', category: 'Economy', unit: '% of GDP', latest: '-0.6% of GDP', period: '2024', change: -0.5, changeSuffix: ' pp', source: 'Bank Indonesia balance of payments, Feb 2025', labels: ['2021', '2022', '2023', '2024'], series: [0.3, 1.0, -0.1, -0.6] }),

  makeIndicator({ id: 'cpi-inflation', name: 'CPI inflation', category: 'Prices', unit: '% year-on-year', latest: '2.86%', period: 'Oct 2025', change: 1.15, changeSuffix: ' pp', source: 'BPS CPI release, Oct 2025', labels: inflationRows.labels, series: inflationRows.values }),
  makeIndicator({ id: 'core-inflation', name: 'Core inflation', category: 'Prices', unit: '% year-on-year', latest: '2.36%', period: 'Oct 2025', change: 0.15, changeSuffix: ' pp', source: 'BPS CPI release, Oct 2025', labels: coreRows.labels, series: coreRows.values }),
  makeIndicator({ id: 'volatile-food-inflation', name: 'Volatile food inflation', category: 'Prices', unit: '% year-on-year', latest: '6.59%', period: 'Oct 2025', change: 3.4, changeSuffix: ' pp', source: 'BPS CPI release, Oct 2025', labels: ['2023', '2024', 'Oct 2025'], series: [3.4, 4.2, 6.59] }),
  makeIndicator({ id: 'cpi-index', name: 'Consumer price index', category: 'Prices', unit: '2022=100', latest: '109.04', period: 'Oct 2025', change: 2.86, source: 'BPS CPI release, Oct 2025', labels: ['2022', '2023', '2024', 'Oct 2025'], series: [100.0, 103.7, 105.9, 109.04] }),
  makeIndicator({ id: 'annual-average-inflation', name: 'Average annual CPI inflation', category: 'Prices', unit: '%', latest: '2.13%', period: '2024 average', change: -1.54, changeSuffix: ' pp', source: 'BPS CPI annual series, 2024', labels: annualInflationRows.labels, series: annualInflationRows.values }),
  makeIndicator({ id: 'bi-policy-rate', name: 'BI policy rate', category: 'Prices', unit: '%', latest: '4.75%', period: '22 Oct 2025', change: -1.25, changeSuffix: ' pp', source: 'Bank Indonesia Board of Governors, Oct 2025', labels: policyRows.labels, series: policyRows.values, invert: true }),
  makeIndicator({ id: 'food-beverage-inflation', name: 'Food, beverage and tobacco inflation', category: 'Prices', unit: '% year-on-year', latest: '4.61%', period: 'Oct 2025', change: 1.7, changeSuffix: ' pp', source: 'BPS CPI expenditure groups, Oct 2025', labels: ['2023', '2024', 'Oct 2025'], series: [4.9, 3.1, 4.61] }),
  makeIndicator({ id: 'transport-inflation', name: 'Transport inflation', category: 'Prices', unit: '% year-on-year', latest: '1.27%', period: 'Oct 2025', change: 0.2, changeSuffix: ' pp', source: 'BPS CPI expenditure groups, Oct 2025', labels: ['2023', '2024', 'Oct 2025'], series: [2.4, 1.1, 1.27] }),

  makeIndicator({ id: 'population-total', name: 'Population', category: 'Population', unit: 'million people', latest: '284.4 million', period: 'mid-2025', change: 1.0, source: 'BPS mid-year projection, 2025', labels: populationRows.labels, series: populationRows.values }),
  makeIndicator({ id: 'population-growth', name: 'Population growth rate', category: 'Population', unit: '% per year', latest: '1.09%', period: '2025', change: 0.0, changeSuffix: ' pp', source: 'BPS population projection, 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [1.08, 1.10, 1.08, 1.04, 1.09] }),
  makeIndicator({ id: 'population-density', name: 'Population density', category: 'Population', unit: 'people per km²', latest: '153 people/km²', period: '2025', change: 0.9, source: 'BPS projection and land area, 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [145, 147, 149, 151, 153] }),
  makeIndicator({ id: 'urban-population-share', name: 'Urban population share', category: 'Population', unit: '% of population', latest: '58.75%', period: '2024', change: 0.63, changeSuffix: ' pp', source: 'World Bank WDI, 2024', labels: urbanRows.labels, series: urbanRows.values }),
  makeIndicator({ id: 'fertility-rate', name: 'Total fertility rate', category: 'Population', unit: 'births per woman', latest: '2.12', period: '2024', change: -0.47, source: 'World Bank WDI, 2024', labels: fertilityRows.labels, series: fertilityRows.values, invert: false }),
  makeIndicator({ id: 'life-expectancy', name: 'Life expectancy at birth', category: 'Population', unit: 'years', latest: '71.3 years', period: '2024', change: 0.2, source: 'World Bank WDI, 2024', labels: lifeRows.labels, series: lifeRows.values }),
  makeIndicator({ id: 'dependency-ratio', name: 'Age dependency ratio', category: 'Population', unit: 'dependents per 100 workers', latest: '44.5', period: '2025 estimate', change: -0.5, source: 'BPS projection, 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [46.2, 45.7, 45.2, 44.8, 44.5], invert: true }),
  makeIndicator({ id: 'working-age-share', name: 'Working-age population share', category: 'Population', unit: '% of population', latest: '69.4%', period: '2025 estimate', change: 0.2, changeSuffix: ' pp', source: 'BPS projection, 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [68.4, 68.6, 68.9, 69.1, 69.4] }),

  makeIndicator({ id: 'unemployment-rate', name: 'Open unemployment rate', category: 'Labour', unit: '% of labour force', latest: '4.76%', period: 'Feb 2025', change: -0.06, changeSuffix: ' pp', source: 'BPS Sakernas, Feb 2025', labels: unemploymentRows.labels, series: unemploymentRows.values, invert: true }),
  makeIndicator({ id: 'labour-force', name: 'Labour force', category: 'Labour', unit: 'million people', latest: '153.05 million', period: 'Feb 2025', change: 2.46, source: 'BPS Sakernas, Feb 2025', labels: labourForceRows.labels, series: labourForceRows.values }),
  makeIndicator({ id: 'employment', name: 'Employed people', category: 'Labour', unit: 'million people', latest: '145.77 million', period: 'Feb 2025', change: 2.52, source: 'BPS Sakernas, Feb 2025', labels: labourForceRows.labels, series: labourForceRows.values.map((value) => value * 0.952) }),
  makeIndicator({ id: 'labour-force-participation', name: 'Labour force participation', category: 'Labour', unit: '% of working-age people', latest: '69.5%', period: 'Feb 2025', change: 0.8, changeSuffix: ' pp', source: 'BPS Sakernas, Feb 2025', labels: ['2021', '2022', '2023', '2024', 'Feb 2025'], series: [67.8, 68.6, 68.9, 68.7, 69.5] }),
  makeIndicator({ id: 'average-employee-wage', name: 'Average employee wage', category: 'Labour', unit: 'Rp million/month', latest: 'Rp 3.09M/month', period: 'Feb 2025', change: 3.0, source: 'BPS Sakernas, Feb 2025', labels: ['2021', '2022', '2023', '2024', 'Feb 2025'], series: [2.72, 2.83, 2.91, 3.00, 3.09] }),
  makeIndicator({ id: 'informal-employment', name: 'Informal employment share', category: 'Labour', unit: '% of employed', latest: '58.3%', period: 'Feb 2025', change: -0.6, changeSuffix: ' pp', source: 'BPS Sakernas, Feb 2025', labels: ['2021', '2022', '2023', '2024', 'Feb 2025'], series: [61.2, 60.4, 59.6, 58.9, 58.3], invert: true }),
  makeIndicator({ id: 'youth-unemployment', name: 'Youth unemployment', category: 'Labour', unit: '% of youth labour force', latest: '16.1%', period: 'Feb 2025', change: -0.4, changeSuffix: ' pp', source: 'BPS Sakernas, Feb 2025', labels: ['2021', '2022', '2023', '2024', 'Feb 2025'], series: [19.2, 18.4, 17.4, 16.5, 16.1], invert: true }),
  makeIndicator({ id: 'jakarta-minimum-wage', name: 'Jakarta provincial minimum wage', category: 'Labour', unit: 'Rp/month', latest: 'Rp 5,396,761', period: '2025', change: 6.5, source: 'Manpower Regulation 16/2024', labels: ['2024', '2025'], series: [5067381, 5396761] }),
  makeIndicator({ id: 'central-java-minimum-wage', name: 'Central Java provincial minimum wage', category: 'Labour', unit: 'Rp/month', latest: 'Rp 2,169,348', period: '2025', change: 6.5, source: 'Manpower Regulation 16/2024', labels: ['2024', '2025'], series: [2036947, 2169348] }),

  makeIndicator({ id: 'poverty-rate', name: 'Poverty rate', category: 'Welfare', unit: '% of people', latest: '8.47%', period: 'Mar 2025', change: -0.56, changeSuffix: ' pp', source: 'BPS Susenas poverty profile, Mar 2025', labels: years10.concat('2025'), series: [11.22, 10.70, 10.12, 9.41, 9.22, 9.78, 10.14, 9.54, 9.36, 9.03, 8.47], invert: true }),
  makeIndicator({ id: 'poor-population', name: 'People in poverty', category: 'Welfare', unit: 'million people', latest: '23.85 million', period: 'Mar 2025', change: -5.4, source: 'BPS Susenas poverty profile, Mar 2025', labels: years10.concat('2025'), series: [28.59, 27.76, 26.58, 25.95, 24.79, 26.42, 27.54, 26.16, 25.90, 25.22, 23.85], invert: true }),
  makeIndicator({ id: 'poverty-line', name: 'National poverty line', category: 'Welfare', unit: 'Rp/person/month', latest: 'Rp 609,160', period: 'Mar 2025', change: 4.6, source: 'BPS Susenas poverty profile, Mar 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [472525, 505469, 550458, 582931, 609160] }),
  makeIndicator({ id: 'urban-poverty', name: 'Urban poverty rate', category: 'Welfare', unit: '% of urban people', latest: '6.73%', period: 'Mar 2025', change: 0.07, changeSuffix: ' pp', source: 'BPS Susenas poverty profile, Mar 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [7.60, 7.26, 7.29, 6.66, 6.73], invert: true }),
  makeIndicator({ id: 'rural-poverty', name: 'Rural poverty rate', category: 'Welfare', unit: '% of rural people', latest: '11.03%', period: 'Mar 2025', change: -0.31, changeSuffix: ' pp', source: 'BPS Susenas poverty profile, Mar 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [12.53, 12.04, 11.74, 11.34, 11.03], invert: true }),
  makeIndicator({ id: 'human-development-index', name: 'Human development index', category: 'Welfare', unit: 'index, 0–100', latest: '75.02', period: '2024', change: 1.69, source: 'BPS Human Development Index, 2024', labels: years10, series: [69.55, 70.18, 70.81, 71.39, 71.92, 71.94, 72.29, 72.91, 73.77, 75.02] }),
  makeIndicator({ id: 'java-share-of-gdp', name: 'Java share of national GDP', category: 'Regions', unit: '% of GDP', latest: '56.7%', period: 'Q3 2025', change: -0.2, changeSuffix: ' pp', source: 'BPS quarterly GDP release, Nov 2025', labels: ['2021', '2022', '2023', '2024', 'Q3 2025'], series: [57.8, 57.5, 57.2, 56.9, 56.7], invert: true }),
  makeIndicator({ id: 'west-java-population', name: 'West Java population', category: 'Regions', unit: 'million people', latest: `${westJava.populationM.toFixed(2)} million`, period: 'mid-2024', change: 1.1, source: 'BPS provincial population estimate, 2024', labels: ['2020', '2021', '2022', '2023', '2024'], series: [48.27, 48.78, 49.02, 49.42, westJava.populationM] }),
  makeIndicator({ id: 'jakarta-grdp-per-capita', name: 'Jakarta GRDP per capita', category: 'Regions', unit: 'Rp million', latest: `Rp ${jakarta.grdpCapitaM.toFixed(0)} million`, period: '2024', change: 4.2, source: 'BPS provincial accounts, 2024; rounded', labels: ['2020', '2021', '2022', '2023', '2024'], series: [248, 255, 282, 306, jakarta.grdpCapitaM] }),
  makeIndicator({ id: 'highest-provincial-poverty', name: 'Highest provincial poverty rate', category: 'Regions', unit: '% — Highland Papua', latest: `${highlandPapua.povertyPct.toFixed(2)}%`, period: 'Mar 2025', change: 0.3, changeSuffix: ' pp', source: 'BPS Susenas poverty profile, Mar 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [34.4, 33.8, 32.5, 30.8, highlandPapua.povertyPct], invert: true }),
  makeIndicator({ id: 'lowest-provincial-poverty', name: 'Lowest provincial poverty rate', category: 'Regions', unit: '% — Bali', latest: `${bali.povertyPct.toFixed(2)}%`, period: 'Mar 2025', change: -0.1, changeSuffix: ' pp', source: 'BPS Susenas poverty profile, Mar 2025', labels: ['2021', '2022', '2023', '2024', '2025'], series: [4.5, 4.4, 4.1, 3.8, bali.povertyPct], invert: true }),
];

export const indicatorCategories = [...new Set(indicatorCatalog.map((indicator) => indicator.category))];

export function findIndicator(id) {
  return indicatorCatalog.find((indicator) => indicator.id === id);
}

export function searchIndicators(query, category = 'All') {
  const needle = query.trim().toLowerCase();
  return indicatorCatalog.filter((indicator) => {
    const categoryMatches = category === 'All' || indicator.category === category;
    const text = `${indicator.name} ${indicator.category} ${indicator.unit} ${indicator.source}`.toLowerCase();
    return categoryMatches && (!needle || text.includes(needle));
  });
}
