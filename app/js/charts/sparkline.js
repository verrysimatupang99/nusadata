import { escapeHtml, formatNumber } from '../format.js';

export function sparkline({ values, width = 112, height = 30, color = 'var(--navy)', valueFormat = (value) => formatNumber(value, 1), ariaLabel = 'Sparkline' }) {
  const finite = values.filter((value) => Number.isFinite(value));
  const min = Math.min(...finite);
  const max = Math.max(...finite);
  const span = max - min || 1;
  const pad = 3;
  const xFor = (index) => pad + (index / Math.max(1, values.length - 1)) * (width - pad * 2);
  const yFor = (value) => height - pad - ((value - min) / span) * (height - pad * 2);
  const path = values.map((value, index) => `${index ? 'L' : 'M'}${xFor(index).toFixed(2)} ${yFor(value).toFixed(2)}`).join('');
  const last = values.at(-1);
  const tip = `Latest: ${valueFormat(last)}\nHigh: ${valueFormat(max)} · low: ${valueFormat(min)}`;
  return `<svg class="sparkline-svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}" data-tip="${escapeHtml(tip)}"><title>${escapeHtml(tip)}</title><path d="${path}" fill="none" stroke="${escapeHtml(color)}" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/><circle cx="${xFor(values.length - 1).toFixed(2)}" cy="${yFor(last).toFixed(2)}" r="2.6" fill="${escapeHtml(color)}"/></svg>`;
}
