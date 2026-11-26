import { latestEconomy } from './economy.js';
import { latestPrices } from './prices.js';
import { labourKeyFacts } from './labour.js';
import { populationKeyFacts } from './population.js';

export const headlineIndicators = [
  { id: 'population', label: 'Population', value: '284.4', unit: 'million people', period: 'mid-2025', change: 1.0, source: 'BPS projection, 2025', spark: [270.2, 272.7, 275.8, 278.7, 281.6, 284.4], route: '#/population' },
  { id: 'nominal-gdp', label: 'GDP, current prices', value: 'Rp 6,060T', unit: 'quarterly output', period: 'Q3 2025', change: 7.47, source: 'BPS GDP, Nov 2025', spark: [5080, 5240, 5639, 5740, 6060], route: '#/economy' },
  { id: 'gdp-growth', label: 'Real GDP growth', value: '5.04%', unit: 'year-on-year', period: 'Q3 2025', change: 0.09, source: 'BPS GDP, Nov 2025', spark: [4.95, 5.02, 4.87, 5.12, 5.04], route: '#/economy' },
  { id: 'gdp-per-capita', label: 'GDP per capita', value: 'Rp 85.2M', unit: 'about US$5,215', period: '2025 estimate', change: 8.4, source: 'BPS estimate, 2025', spark: [57.1, 62.2, 71.0, 75.0, 78.6, 85.2], route: '#/economy' },
  { id: 'cpi-inflation', label: 'CPI inflation', value: '2.86%', unit: 'year-on-year', period: 'Oct 2025', change: 1.15, source: 'BPS CPI, Oct 2025', spark: [1.84, 1.71, 1.55, 1.57, 2.65, 2.86], route: '#/prices' },
  { id: 'unemployment', label: 'Unemployment', value: '4.76%', unit: 'of labour force', period: 'Feb 2025', change: -0.06, invert: true, source: 'BPS Sakernas, Feb 2025', spark: [7.07, 6.49, 5.86, 5.32, 4.91, 4.76], route: '#/labour' },
  { id: 'poverty', label: 'Poverty rate', value: '8.47%', unit: '23.85M people', period: 'Mar 2025', change: -0.56, invert: true, source: 'BPS Susenas, Mar 2025', spark: [9.78, 10.14, 9.54, 9.36, 9.03, 8.47], route: '#/labour' },
  { id: 'hdi', label: 'Human development index', value: '75.02', unit: 'high development', period: '2024', change: 1.25, source: 'BPS HDI, 2024', spark: [71.94, 72.29, 72.91, 73.77, 75.02], route: '#/indicators/human-development-index' },
  { id: 'exports', label: 'Exports of goods', value: 'US$264.7B', unit: 'annual', period: '2024', change: 2.3, source: 'BPS trade, 2024', spark: [163.2, 231.5, 292.0, 258.8, 264.7], route: '#/economy' },
  { id: 'fx-reserves', label: 'Foreign reserves', value: 'US$149.9B', unit: '6.2 months imports', period: 'Oct 2025', change: -0.9, source: 'Bank Indonesia, Nov 2025', spark: [135.9, 144.9, 137.2, 146.4, 155.7, 149.9], route: '#/economy' },
];

export const dashboardFacts = {
  javaShare: latestEconomy.javaShareOfGdp,
  householdShare: latestEconomy.householdConsumptionShare,
  labourForceM: labourKeyFacts.labourForceM,
  density: populationKeyFacts.densityPerKm2,
  cpiIndex: latestPrices.cpiIndex,
};
