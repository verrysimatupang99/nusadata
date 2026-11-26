export const annualRealGdpGrowth = [
  { year: '2015', value: 4.88 }, { year: '2016', value: 5.03 }, { year: '2017', value: 5.07 },
  { year: '2018', value: 5.17 }, { year: '2019', value: 5.02 }, { year: '2020', value: -2.07 },
  { year: '2021', value: 3.70 }, { year: '2022', value: 5.31 }, { year: '2023', value: 5.05 },
  { year: '2024', value: 5.03 },
];

export const quarterlyRealGdpGrowth = [
  { quarter: 'Q1 23', value: 5.03 }, { quarter: 'Q2 23', value: 5.17 }, { quarter: 'Q3 23', value: 4.94 },
  { quarter: 'Q4 23', value: 5.04 }, { quarter: 'Q1 24', value: 5.11 }, { quarter: 'Q2 24', value: 5.05 },
  { quarter: 'Q3 24', value: 4.95 }, { quarter: 'Q4 24', value: 5.02 }, { quarter: 'Q1 25', value: 4.87 },
  { quarter: 'Q2 25', value: 5.12 }, { quarter: 'Q3 25', value: 5.04 },
];

export const nominalGdpSeries = [
  { year: '2015', value: 11526 }, { year: '2016', value: 12401 }, { year: '2017', value: 13590 },
  { year: '2018', value: 14838 }, { year: '2019', value: 15832 }, { year: '2020', value: 15438 },
  { year: '2021', value: 16970 }, { year: '2022', value: 19588 }, { year: '2023', value: 20892 },
  { year: '2024', value: 22139 },
];

export const gdpPerCapitaSeries = [
  { year: '2015', idrM: 45.2, usd: 3288 }, { year: '2016', idrM: 48.0, usd: 3521 },
  { year: '2017', idrM: 51.9, usd: 3799 }, { year: '2018', idrM: 56.0, usd: 3861 },
  { year: '2019', idrM: 59.3, usd: 4107 }, { year: '2020', idrM: 57.1, usd: 3854 },
  { year: '2021', idrM: 62.2, usd: 4287 }, { year: '2022', idrM: 71.0, usd: 4731 },
  { year: '2023', idrM: 75.0, usd: 4876 }, { year: '2024', idrM: 78.6, usd: 4925 },
  { year: '2025 est.', idrM: 85.2, usd: 5215 },
];

export const sectorComposition2024 = [
  { label: 'Manufacturing', value: 18.7, color: '#244e79' },
  { label: 'Trade, transport & accommodation', value: 20.3, color: '#a51f2d' },
  { label: 'Agriculture, forestry & fisheries', value: 12.6, color: '#667f5c' },
  { label: 'Public, education & health', value: 12.6, color: '#ad7c24' },
  { label: 'Mining, utilities & other industry', value: 10.6, color: '#3f4b64' },
  { label: 'Finance, real estate & business', value: 10.1, color: '#77552f' },
  { label: 'Construction', value: 9.7, color: '#7d3140' },
  { label: 'Other services', value: 5.4, color: '#8a8790' },
];

export const expenditureComposition2024 = [
  { label: 'Household consumption', value: 54.25, color: '#244e79' },
  { label: 'Gross fixed capital formation', value: 29.6, color: '#a51f2d' },
  { label: 'Government consumption', value: 8.0, color: '#ad7c24' },
  { label: 'Non-profit institutions & inventories', value: 7.3, color: '#667f5c' },
  { label: 'Net exports of goods and services', value: 0.85, color: '#3f4b64' },
];

export const budgetSummary = {
  year2024: {
    revenueT: 2842.5,
    expenditureT: 3350.3,
    deficitT: 507.8,
    deficitPctGdp: 2.29,
    note: '2024 unaudited realization, Ministry of Finance APBN KiTa, January 2025',
  },
  year2025: {
    revenueT: 3005.1,
    expenditureT: 3621.3,
    deficitT: 616.2,
    deficitPctGdp: 2.53,
    note: '2025 APBN budget posture, Ministry of Finance, 2025',
  },
};

export const fxReservesSeries = [
  { year: '2015', value: 105.9 }, { year: '2016', value: 116.4 }, { year: '2017', value: 130.2 },
  { year: '2018', value: 120.7 }, { year: '2019', value: 129.2 }, { year: '2020', value: 135.9 },
  { year: '2021', value: 144.9 }, { year: '2022', value: 137.2 }, { year: '2023', value: 146.4 },
  { year: '2024', value: 155.7 }, { year: 'Oct 25', value: 149.9 },
];

export const latestEconomy = {
  gdpCurrentQ3T: 6060.0,
  gdpConstantQ3T: 3444.8,
  gdpGrowthQ3: 5.04,
  gdpGrowthQ2: 5.12,
  gdpGrowthQtd: 1.43,
  gdpYearToSeptember: 5.01,
  javaShareOfGdp: 56.7,
  householdConsumptionShare: 54.25,
  sourceQ3: 'BPS quarterly GDP release, 5 Nov 2025',
  sourceAnnual: 'BPS annual national accounts, Feb 2025',
};
