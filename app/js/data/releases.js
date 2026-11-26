const released2025 = [
  { date: '2025-01-02', title: 'CPI inflation, farmer terms of trade, tourism and transport', kind: 'Monthly BRS', status: 'released', note: 'December 2024 price month; first working day release' },
  { date: '2025-01-15', title: 'Exports and imports of goods', kind: 'Trade', status: 'released', note: 'Final mid-month trade release before the schedule change' },
  { date: '2025-01-15', title: 'Profile of poverty in Indonesia, September 2024', kind: 'Susenas', status: 'released', note: 'September-round poverty results released in January' },
  { date: '2025-02-03', title: 'CPI inflation and monthly social-economic indicators', kind: 'Monthly BRS', status: 'released', note: 'January 2025 CPI' },
  { date: '2025-02-05', title: 'Gross domestic product, Q4 and full-year 2024', kind: 'GDP quarterly', status: 'released', note: '2024 growth 5.03%; GDP per capita Rp78.6 million' },
  { date: '2025-02-17', title: 'Exports and imports of goods', kind: 'Trade', status: 'released', note: 'January trade month' },
  { date: '2025-03-03', title: 'CPI inflation and monthly social-economic indicators', kind: 'Monthly BRS', status: 'released', note: 'February 2025 CPI' },
  { date: '2025-03-17', title: 'Exports and imports of goods', kind: 'Trade', status: 'released', note: 'February trade month' },
  { date: '2025-04-08', title: 'CPI inflation and monthly social-economic indicators', kind: 'Monthly BRS', status: 'released', note: 'March 2025 CPI; shifted around the Eid holiday' },
  { date: '2025-04-21', title: 'Exports and imports of goods', kind: 'Trade', status: 'released', note: 'March trade month' },
  { date: '2025-04-25', title: 'Monthly social-economic report, March 2025 edition', kind: 'Publication', status: 'released', note: 'BPS publication 03200.25009' },
  { date: '2025-05-02', title: 'CPI inflation and monthly social-economic indicators', kind: 'Monthly BRS', status: 'released', note: 'April 2025 CPI' },
  { date: '2025-05-05', title: 'Labour force situation, February 2025', kind: 'Sakernas', status: 'released', note: 'Unemployment 4.76%; average employee wage Rp3.09 million' },
  { date: '2025-05-05', title: 'Gross domestic product, Q1 2025', kind: 'GDP quarterly', status: 'released', note: 'First-quarter national accounts' },
  { date: '2025-05-15', title: 'Exports and imports of goods', kind: 'Trade', status: 'released', note: 'April trade month; final mid-month release' },
  { date: '2025-06-02', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'First release under the revised early-month trade schedule' },
  { date: '2025-07-01', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'June CPI; May trade' },
  { date: '2025-07-25', title: 'Profile of poverty in Indonesia, March 2025', kind: 'Susenas', status: 'released', note: 'Poverty 8.47%; poverty line Rp609,160 per capita/month' },
  { date: '2025-08-01', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'July CPI; June trade' },
  { date: '2025-08-05', title: 'Gross domestic product, Q2 2025', kind: 'GDP quarterly', status: 'released', note: 'Q2 growth 5.12% year-on-year' },
  { date: '2025-09-01', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'August CPI; July trade' },
  { date: '2025-10-01', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'September CPI; August trade' },
  { date: '2025-11-03', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'released', note: 'October CPI 2.86% year-on-year; September trade' },
  { date: '2025-11-05', title: 'Gross domestic product, Q3 2025', kind: 'GDP quarterly', status: 'released', note: 'Q3 growth 5.04% year-on-year' },
  { date: '2025-11-05', title: 'Labour force situation, August 2025', kind: 'Sakernas', status: 'released', note: 'Unemployment 4.85%; average employee wage Rp3.33 million' },
];

const monthlyCombined2026 = [
  ['2026-01-02', 'December 2025 CPI; November 2025 trade'],
  ['2026-02-02', 'January 2026 CPI; December 2025 trade'],
  ['2026-03-02', 'February 2026 CPI; January 2026 trade'],
  ['2026-04-01', 'March 2026 CPI; February 2026 trade'],
  ['2026-05-04', 'April 2026 CPI; March 2026 trade; first working day after the May Day holiday'],
  ['2026-06-01', 'May 2026 CPI; April 2026 trade'],
  ['2026-07-01', 'June 2026 CPI; May 2026 trade'],
  ['2026-08-03', 'July 2026 CPI; June 2026 trade; first working day'],
  ['2026-09-01', 'August 2026 CPI; July 2026 trade'],
  ['2026-10-01', 'September 2026 CPI; August 2026 trade'],
  ['2026-11-02', 'October 2026 CPI; September 2026 trade; first working day'],
  ['2026-12-01', 'November 2026 CPI; October 2026 trade'],
];

const scheduled2026 = [
  { date: '2026-02-05', title: 'Gross domestic product, Q4 and full-year 2025', kind: 'GDP quarterly', status: 'scheduled', note: 'Regular quarterly national accounts release window' },
  { date: '2026-02-05', title: 'Profile of poverty in Indonesia, September 2025', kind: 'Susenas', status: 'scheduled', note: 'September-round poverty results are published early in the following year' },
  { date: '2026-05-05', title: 'Gross domestic product, Q1 2026', kind: 'GDP quarterly', status: 'scheduled', note: 'Regular quarterly national accounts release window' },
  { date: '2026-05-05', title: 'Labour force situation, February 2026', kind: 'Sakernas', status: 'scheduled', note: 'February Sakernas results are published in May' },
  { date: '2026-07-24', title: 'Profile of poverty in Indonesia, March 2026', kind: 'Susenas', status: 'scheduled', note: 'March-round poverty publication window, following the 2025 pattern' },
  { date: '2026-08-05', title: 'Gross domestic product, Q2 2026', kind: 'GDP quarterly', status: 'scheduled', note: 'Regular quarterly national accounts release window' },
  { date: '2026-11-05', title: 'Gross domestic product, Q3 2026', kind: 'GDP quarterly', status: 'scheduled', note: 'Regular quarterly national accounts release window' },
  { date: '2026-11-05', title: 'Labour force situation, August 2026', kind: 'Sakernas', status: 'scheduled', note: 'August Sakernas results are published in November' },
];

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function withMonth(release) {
  const [year, month] = release.date.split('-').map(Number);
  return { ...release, month: `${monthNames[month - 1]} ${year}` };
}

export const releaseCalendar = [
  ...released2025,
  { date: '2025-12-01', title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'scheduled', note: 'November CPI; October trade' },
  ...monthlyCombined2026.map(([date, note]) => ({ date, title: 'CPI inflation plus exports and imports of goods', kind: 'Combined BRS', status: 'scheduled', note })),
  ...scheduled2026,
].map(withMonth).sort((a, b) => a.date.localeCompare(b.date) || a.title.localeCompare(b.title));

export const releaseRhythm = [
  { label: 'First working day', text: 'CPI, farmer terms of trade, tourism, transport and — since June 2025 — final trade figures.' },
  { label: 'Quarterly national accounts', text: 'GDP is released in early February, May, August and November.' },
  { label: 'February and August labour', text: 'Sakernas labour force results follow the February and August survey rounds, normally in May and November.' },
  { label: 'March and September poverty', text: 'March Susenas poverty appears around July; September-round results arrive early in the following year.' },
];
