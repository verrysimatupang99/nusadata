import { escapeHtml, formatNumber } from '../format.js';
import { formatTick } from './axis.js';

export function horizontalBarChart({
  items,
  width = 560,
  rowHeight = 28,
  labelWidth = 136,
  valueFormat = (value) => formatNumber(value, 1),
  color = 'var(--navy)',
  ariaLabel = 'Horizontal bar chart',
}) {
  const rightPad = 62;
  const height = rowHeight * items.length + 16;
  const maxAbs = Math.max(...items.map((item) => Math.abs(item.value)), 1);
  const barWidth = width - labelWidth - rightPad;
  const zeroX = items.some((item) => item.value < 0) ? labelWidth + barWidth / 2 : labelWidth;
  const scale = (value) => (Math.abs(value) / maxAbs) * (items.some((item) => item.value < 0) ? barWidth / 2 : barWidth);
  const rows = items.map((item, index) => {
    const y = 8 + index * rowHeight;
    const length = scale(item.value);
    const negative = item.value < 0;
    const x = negative ? zeroX - length : zeroX;
    const itemColor = typeof color === 'function' ? color(item) : item.color || color;
    const tip = `${item.label}\n${valueFormat(item.value)}${item.note ? `\n${item.note}` : ''}`;
    return `<g><text class="tick-label" x="${labelWidth - 7}" y="${y + rowHeight / 2 + 3}" text-anchor="end">${escapeHtml(item.label)}</text><rect class="bar-shape" x="${x.toFixed(2)}" y="${y + 4}" width="${Math.max(1, length).toFixed(2)}" height="${rowHeight - 9}" fill="${escapeHtml(itemColor)}" tabindex="0" data-tip="${escapeHtml(tip)}"><title>${escapeHtml(tip)}</title></rect><text class="tick-label" x="${negative ? x - 5 : x + length + 5}" y="${y + rowHeight / 2 + 3}" text-anchor="${negative ? 'end' : 'start'}">${escapeHtml(valueFormat(item.value))}</text></g>`;
  }).join('');
  return `<div class="chart-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}"><line class="axis-line" x1="${zeroX}" x2="${zeroX}" y1="5" y2="${height - 6}"/>${rows}</svg></div>`;
}

export function verticalGroupedBarChart({
  labels,
  series,
  width = 620,
  height = 250,
  valueFormat = (value) => formatNumber(value, 1),
  ariaLabel = 'Grouped bar chart',
}) {
  const margin = { top: 12, right: 12, bottom: 32, left: 48 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const values = series.flatMap((item) => item.values);
  const maxValue = Math.max(...values, 0);
  const minValue = Math.min(...values, 0);
  const span = maxValue - minValue || 1;
  const yFor = (value) => margin.top + ((maxValue - value) / span) * innerHeight;
  const zeroY = yFor(0);
  const groupWidth = innerWidth / labels.length;
  const barWidth = Math.min(22, (groupWidth - 8) / series.length);
  const grid = [0, .25, .5, .75, 1].map((part) => {
    const value = minValue + span * part;
    const y = yFor(value);
    return `<line class="grid-line" x1="${margin.left}" x2="${width - margin.right}" y1="${y}" y2="${y}"/><text class="tick-label" x="${margin.left - 7}" y="${y + 3}" text-anchor="end">${escapeHtml(formatTick(value))}</text>`;
  }).join('');
  const groups = labels.map((label, index) => {
    const start = margin.left + index * groupWidth + (groupWidth - barWidth * series.length) / 2;
    const bars = series.map((item, seriesIndex) => {
      const value = item.values[index];
      const x = start + seriesIndex * barWidth;
      const y = yFor(Math.max(0, value));
      const h = Math.abs(yFor(value) - zeroY);
      const tip = `${item.name}\n${label}: ${valueFormat(value)}`;
      return `<rect class="bar-shape" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${Math.max(2, barWidth - 2).toFixed(2)}" height="${Math.max(1, h).toFixed(2)}" fill="${escapeHtml(item.color)}" tabindex="0" data-tip="${escapeHtml(tip)}"><title>${escapeHtml(tip)}</title></rect>`;
    }).join('');
    return `${bars}<text class="tick-label" x="${margin.left + index * groupWidth + groupWidth / 2}" y="${height - 10}" text-anchor="middle">${escapeHtml(label)}</text>`;
  }).join('');
  const legend = series.map((item) => `<span class="legend-key"><span class="legend-swatch square" style="color:${escapeHtml(item.color)}"></span>${escapeHtml(item.name)}</span>`).join('');
  return `<div class="chart-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}">${grid}<line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${zeroY}" y2="${zeroY}"/>${groups}</svg><div class="chart-legend">${legend}</div></div>`;
}
