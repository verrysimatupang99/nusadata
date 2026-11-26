export const monthlyInflation = [
  { month: '2022-11', value: 5.42, core: 3.30 }, { month: '2022-12', value: 5.51, core: 3.36 },
  { month: '2023-01', value: 5.28, core: 3.27 }, { month: '2023-02', value: 5.47, core: 3.09 },
  { month: '2023-03', value: 4.97, core: 2.94 }, { month: '2023-04', value: 4.33, core: 2.83 },
  { month: '2023-05', value: 4.00, core: 2.66 }, { month: '2023-06', value: 3.52, core: 2.58 },
  { month: '2023-07', value: 3.08, core: 2.43 }, { month: '2023-08', value: 3.27, core: 2.18 },
  { month: '2023-09', value: 2.28, core: 2.00 }, { month: '2023-10', value: 2.56, core: 1.94 },
  { month: '2023-11', value: 2.86, core: 1.87 }, { month: '2023-12', value: 2.61, core: 1.80 },
  { month: '2024-01', value: 2.57, core: 1.68 }, { month: '2024-02', value: 2.75, core: 1.68 },
  { month: '2024-03', value: 3.05, core: 1.77 }, { month: '2024-04', value: 3.00, core: 1.82 },
  { month: '2024-05', value: 2.84, core: 1.93 }, { month: '2024-06', value: 2.51, core: 1.90 },
  { month: '2024-07', value: 2.13, core: 1.95 }, { month: '2024-08', value: 2.12, core: 2.02 },
  { month: '2024-09', value: 1.84, core: 2.09 }, { month: '2024-10', value: 1.71, core: 2.21 },
  { month: '2024-11', value: 1.55, core: 2.26 }, { month: '2024-12', value: 1.57, core: 2.26 },
  { month: '2025-01', value: 0.76, core: 2.27 }, { month: '2025-02', value: -0.09, core: 2.48 },
  { month: '2025-03', value: 1.03, core: 2.03 }, { month: '2025-04', value: 1.95, core: 2.11 },
  { month: '2025-05', value: 1.60, core: 2.10 }, { month: '2025-06', value: 1.87, core: 2.19 },
  { month: '2025-07', value: 2.37, core: 2.32 }, { month: '2025-08', value: 2.31, core: 2.17 },
  { month: '2025-09', value: 2.65, core: 2.21 }, { month: '2025-10', value: 2.86, core: 2.36 },
];

export const annualInflationAverage = [
  { year: '2015', value: 6.36 }, { year: '2016', value: 3.53 }, { year: '2017', value: 3.81 },
  { year: '2018', value: 3.20 }, { year: '2019', value: 3.03 }, { year: '2020', value: 1.92 },
  { year: '2021', value: 1.56 }, { year: '2022', value: 4.21 }, { year: '2023', value: 3.67 },
  { year: '2024', value: 2.13 },
];

export const inflationGroupsOctober2025 = [
  { label: 'Food, beverages & tobacco', value: 4.61 },
  { label: 'Personal care & other services', value: 4.10 },
  { label: 'Food services & restaurants', value: 2.40 },
  { label: 'Health', value: 1.80 },
  { label: 'Education', value: 1.40 },
  { label: 'Housing, utilities & fuel', value: 1.33 },
  { label: 'Transport', value: 1.27 },
  { label: 'Recreation, sport & culture', value: 1.20 },
  { label: 'Clothing & footwear', value: 0.90 },
  { label: 'Information & communication', value: -0.15 },
];

export const inflationComponentsOctober2025 = [
  { label: 'Headline CPI', value: 2.86, color: '#a51f2d' },
  { label: 'Core inflation', value: 2.36, color: '#244e79' },
  { label: 'Volatile food', value: 6.59, color: '#ad7c24' },
  { label: 'Administered prices', value: 1.44, color: '#667f5c' },
];

export const policyRateDecisions = [
  { month: '2021-02', value: 3.75 }, { month: '2021-03', value: 3.50 }, { month: '2022-08', value: 3.75 },
  { month: '2022-09', value: 4.25 }, { month: '2022-10', value: 4.75 }, { month: '2022-11', value: 5.25 },
  { month: '2022-12', value: 5.50 }, { month: '2023-01', value: 5.75 }, { month: '2023-10', value: 6.00 },
  { month: '2024-04', value: 6.25 }, { month: '2024-09', value: 6.00 }, { month: '2025-01', value: 5.75 },
  { month: '2025-05', value: 5.50 }, { month: '2025-07', value: 5.25 }, { month: '2025-08', value: 5.00 },
  { month: '2025-09', value: 4.75 }, { month: '2025-10', value: 4.75 },
];

export const latestPrices = {
  cpiIndex: 109.04,
  headlineYoy: 2.86,
  coreYoy: 2.36,
  volatileFoodYoy: 6.59,
  targetLower: 1.5,
  targetUpper: 3.5,
  targetMidpoint: 2.5,
  source: 'BPS CPI release, Oct 2025; Bank Indonesia policy statement, 22 Oct 2025',
};
