export const goodsTradeAnnual = [
  { year: '2015', exports: 150.4, imports: 142.7 }, { year: '2016', exports: 145.2, imports: 135.7 },
  { year: '2017', exports: 168.8, imports: 157.0 }, { year: '2018', exports: 180.2, imports: 188.7 },
  { year: '2019', exports: 167.5, imports: 170.7 }, { year: '2020', exports: 163.2, imports: 141.6 },
  { year: '2021', exports: 231.5, imports: 196.2 }, { year: '2022', exports: 292.0, imports: 237.5 },
  { year: '2023', exports: 258.8, imports: 221.9 }, { year: '2024', exports: 264.7, imports: 233.7 },
];

export const exportCommodities2024 = [
  { id: 'mineral-fuels', label: 'Mineral fuels incl. coal', value: 55.5, sharePct: 21.0, note: 'HS27; coal is the dominant component' },
  { id: 'palm-oils', label: 'Palm oil and other fats/oils', value: 26.9, sharePct: 10.2, note: 'HS15; palm oil and fractions dominate' },
  { id: 'iron-steel', label: 'Iron and steel', value: 25.8, sharePct: 9.7, note: 'HS72' },
  { id: 'textiles-footwear', label: 'Textiles, garments and footwear', value: 15.7, sharePct: 5.9, note: 'HS61+62 garments plus HS64 footwear' },
  { id: 'electrical-machinery', label: 'Electrical machinery', value: 15.2, sharePct: 5.7, note: 'HS85' },
  { id: 'vehicles', label: 'Vehicles and parts', value: 11.0, sharePct: 4.2, note: 'HS87' },
  { id: 'nickel-products', label: 'Nickel products', value: 8.0, sharePct: 3.0, note: 'HS75; mostly intermediate nickel products' },
];

export const tradingPartners2024 = [
  { name: 'China', exportValue: 62.4, exportSharePct: 23.6, importValue: 73.9, importSharePct: 31.4 },
  { name: 'United States', exportValue: 26.4, exportSharePct: 10.0, importValue: 12.0, importSharePct: 5.1 },
  { name: 'Japan', exportValue: 20.7, exportSharePct: 7.8, importValue: 15.0, importSharePct: 6.4 },
  { name: 'India', exportValue: 20.3, exportSharePct: 7.7, importValue: 5.6, importSharePct: 2.4 },
  { name: 'Singapore', exportValue: 12.2, exportSharePct: 4.6, importValue: 21.5, importSharePct: 9.2 },
];

export const internationalArrivalsAnnual = [
  { year: '2015', visitsM: 10.41 }, { year: '2016', visitsM: 11.52 },
  { year: '2017', visitsM: 14.04 }, { year: '2018', visitsM: 15.81 },
  { year: '2019', visitsM: 16.11 }, { year: '2020', visitsM: 4.05 },
  { year: '2021', visitsM: 1.56 }, { year: '2022', visitsM: 5.89 },
  { year: '2023', visitsM: 11.68 }, { year: '2024', visitsM: 13.902 },
];

export const tourism2024 = {
  totalArrivalsM: 13.902,
  growthPct: 19.05,
  baliDirectArrivalsM: 6.333,
  baliSharePct: 45.6,
  foreignExchangeUsdB: 16.7,
  domesticTripsB: 1.021,
  topOrigins: [
    { label: 'Malaysia', value: 2.278, sharePct: 16.4 },
    { label: 'Australia', value: 1.670, sharePct: 12.0 },
    { label: 'Singapore', value: 1.408, sharePct: 10.1 },
    { label: 'China', value: 1.190, sharePct: 8.6 },
    { label: 'Timor-Leste', value: 0.776, sharePct: 5.6 },
    { label: 'India', value: 0.711, sharePct: 5.1 },
  ],
  entryPoints: [
    { label: 'Ngurah Rai, Bali', value: 6.309, note: 'air' },
    { label: 'Soekarno-Hatta, Jakarta', value: 2.524, note: 'air' },
    { label: 'Batam, Riau Islands', value: 1.316, note: 'sea' },
    { label: 'Juanda, East Java', value: 0.322, note: 'air' },
    { label: 'Kualanamu, North Sumatra', value: 0.247, note: 'air' },
  ],
};

export const tourism2025 = {
  arrivalsJanSepM: 11.431,
  growthJanSepPct: 10.22,
  septemberArrivalsM: 1.395,
  septemberGrowthPct: 9.04,
  targetLowerM: 14.6,
  targetUpperM: 16.0,
  sourceMarketNote: 'Jan–Sep 2025 source countries: Malaysia 19.5%, Australia 11.7%, Singapore 8.5%',
  averageSpendUsd: 1297.31,
  averageStayNights: 10.7,
};

export const tradeSourceNotes = {
  goods: 'BPS foreign trade statistics, 2024; exports US$264.7B, imports US$233.7B and surplus US$31.04B',
  commodities: 'BPS foreign trade statistics and UN Comtrade HS chapters, 2024; values and shares rounded',
  partners: 'BPS foreign trade statistics and UN Comtrade partner detail, 2024; rounded bilateral values',
  tourism: 'BPS International Visitor Arrivals Statistics, 2024; immigration records plus mobile positioning data at border posts',
  tourism2025: 'BPS monthly tourism release, Nov 2025; Ministry of Tourism 2025 target range',
};

export function tradeBalance(row) {
  return row.exports - row.imports;
}
