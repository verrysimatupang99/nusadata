export function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

export function formatNumber(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(Number(value));
}

export function formatInteger(value) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return '—';
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value));
}

export function formatPercent(value, digits = 2) {
  return `${formatNumber(value, digits)}%`;
}

export function formatSigned(value, digits = 2, suffix = '%') {
  const sign = Number(value) > 0 ? '+' : '';
  return `${sign}${formatNumber(value, digits)}${suffix}`;
}

export function formatMillionPeople(value) {
  return `${formatNumber(value, value >= 100 ? 0 : 1)} million`;
}

export function formatTrillionIdr(value) {
  return `Rp ${formatNumber(value, value >= 1000 ? 0 : 1)}T`;
}

export function formatBillionUsd(value) {
  return `US$${formatNumber(value, 1)}B`;
}

export function formatMillionIdr(value) {
  return `Rp ${formatNumber(value, 1)}M`;
}

export function formatWholeIdr(value) {
  return `Rp ${formatInteger(value)}`;
}

export function formatMonthLabel(key) {
  const [year, month] = key.split('-').map(Number);
  const names = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${names[month - 1]} ${String(year).slice(2)}`;
}

export function arrowGlyph(direction) {
  if (direction === 'down') return 'M1 1l4 5 4-5z';
  if (direction === 'flat') return 'M1 4h8v2H1z';
  return 'M1 9l4-5 4 5z';
}

export function changeBadge(change, invert = false, suffix = '%') {
  const direction = Math.abs(change) < 0.005 ? 'flat' : change < 0 ? 'down' : 'up';
  const beneficial = direction === 'flat' ? true : invert ? change < 0 : change > 0;
  return `<span class="change ${beneficial ? '' : 'negative'}"><svg viewBox="0 0 10 10" aria-hidden="true"><path d="${arrowGlyph(direction)}" fill="currentColor"/></svg>${formatSigned(change, 2, suffix)}</span>`;
}

export function slugify(text) {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}
