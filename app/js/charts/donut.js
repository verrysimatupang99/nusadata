import { escapeHtml, formatNumber, formatPercent } from '../format.js';

function arcPath(cx, cy, radius, startAngle, endAngle) {
  const large = endAngle - startAngle > Math.PI ? 1 : 0;
  const x1 = cx + radius * Math.cos(startAngle);
  const y1 = cy + radius * Math.sin(startAngle);
  const x2 = cx + radius * Math.cos(endAngle);
  const y2 = cy + radius * Math.sin(endAngle);
  return `M${cx} ${cy}L${x1.toFixed(2)} ${y1.toFixed(2)}A${radius} ${radius} 0 ${large} 1 ${x2.toFixed(2)} ${y2.toFixed(2)}Z`;
}

export function donutChart({ items, width = 360, height = 250, centerLabel = '', valueFormat = (value) => formatPercent(value, 1), ariaLabel = 'Composition chart' }) {
  const cx = 108;
  const cy = height / 2;
  const radius = Math.min(86, height / 2 - 18);
  const inner = radius * 0.58;
  const total = items.reduce((sum, item) => sum + item.value, 0) || 1;
  let angle = -Math.PI / 2;
  const slices = items.map((item) => {
    const portion = item.value / total;
    const start = angle;
    const end = angle + portion * Math.PI * 2;
    angle = end;
    const tip = `${item.label}\n${valueFormat(item.value)}`;
    return `<path class="bar-shape" d="${arcPath(cx, cy, radius, start, end)}" fill="${escapeHtml(item.color)}" tabindex="0" data-tip="${escapeHtml(tip)}"><title>${escapeHtml(tip)}</title></path>`;
  }).join('');
  const legendRows = items.map((item, index) => `<g transform="translate(205,${28 + index * 24})"><rect width="9" height="9" y="-8" fill="${escapeHtml(item.color)}"></rect><text class="tick-label" x="15" y="0">${escapeHtml(item.label)}</text><text class="tick-label" x="15" y="12" font-weight="700">${escapeHtml(formatNumber(item.value, 1))}%</text></g>`).join('');
  return `<div class="chart-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">${slices}<circle cx="${cx}" cy="${cy}" r="${inner}" fill="var(--paper-raised)" stroke="var(--rule)"/><text class="axis-label" x="${cx}" y="${cy - 3}" text-anchor="middle">${escapeHtml(centerLabel)}</text><text class="chart-title" x="${cx}" y="${cy + 16}" text-anchor="middle" style="font-size:15px">100%</text>${legendRows}</svg></div>`;
}
