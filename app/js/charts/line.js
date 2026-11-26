import { escapeHtml, formatNumber } from '../format.js';
import { defaultMargins, extentOf, formatTick, linearScale, niceTicks } from './axis.js';

export function lineChart({
  labels,
  series,
  width = 720,
  height = 280,
  valueFormat = (value) => formatNumber(value, 1),
  yLabel = '',
  xEvery = 1,
  area = false,
  step = false,
  dense = false,
  annotations = [],
  ariaLabel = 'Line chart',
}) {
  const margin = defaultMargins();
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const allValues = series.flatMap((item) => item.values).filter((value) => Number.isFinite(value));
  let [minY, maxY] = extentOf(allValues, 0.08);
  if (minY > 0) minY = Math.min(0, minY);
  if (maxY < 0) maxY = Math.max(0, maxY);
  const xFor = (index) => margin.left + (labels.length === 1 ? innerWidth / 2 : (index / (labels.length - 1)) * innerWidth);
  const yFor = linearScale(minY, maxY, margin.top + innerHeight, margin.top);
  const yTicks = niceTicks(minY, maxY, 5);
  const zeroY = yFor(0);
  const pathFor = (values) => values.map((value, index) => {
    const x = xFor(index);
    const y = yFor(value);
    if (index === 0) return `M${x.toFixed(2)} ${y.toFixed(2)}`;
    if (step) {
      const previousX = xFor(index - 1);
      return `H${x.toFixed(2)}V${y.toFixed(2)}`;
    }
    return `L${x.toFixed(2)} ${y.toFixed(2)}`;
  }).join('');
  const grid = yTicks.map((tick) => {
    const y = yFor(tick);
    return `<line class="grid-line" x1="${margin.left}" x2="${width - margin.right}" y1="${y}" y2="${y}"/><text class="tick-label" x="${margin.left - 7}" y="${y + 3}" text-anchor="end">${escapeHtml(formatTick(tick))}</text>`;
  }).join('');
  const xTicks = labels.map((label, index) => {
    if (index % xEvery !== 0 && index !== labels.length - 1) return '';
    const x = xFor(index);
    return `<line class="grid-line" x1="${x}" x2="${x}" y1="${margin.top + innerHeight}" y2="${margin.top + innerHeight + 4}"/><text class="tick-label" x="${x}" y="${height - 10}" text-anchor="middle">${escapeHtml(label)}</text>`;
  }).join('');
  const seriesMarkup = series.map((item, seriesIndex) => {
    const path = pathFor(item.values);
    const areaMarkup = area && seriesIndex === 0
      ? `<path d="${path}L${xFor(item.values.length - 1).toFixed(2)} ${zeroY.toFixed(2)}L${xFor(0).toFixed(2)} ${zeroY.toFixed(2)}Z" fill="${escapeHtml(item.color)}" opacity="0.12"/>`
      : '';
    const circles = item.values.map((value, index) => {
      const endpoint = index === item.values.length - 1;
      const visible = !dense || endpoint || item.values.length <= 18;
      const radius = endpoint ? 3.5 : dense ? 5 : 3;
      const opacity = visible ? '1' : '0';
      const tip = `${item.name}\n${labels[index]}: ${valueFormat(value)}`;
      return `<circle class="series-point" cx="${xFor(index).toFixed(2)}" cy="${yFor(value).toFixed(2)}" r="${radius}" fill="${escapeHtml(item.color)}" opacity="${opacity}" tabindex="0" data-tip="${escapeHtml(tip)}"><title>${escapeHtml(tip)}</title></circle>`;
    }).join('');
    return `${areaMarkup}<path class="series-line" d="${path}" stroke="${escapeHtml(item.color)}" ${item.dashed ? 'stroke-dasharray="5 4"' : ''}/>${circles}`;
  }).join('');
  const annotationMarkup = annotations.map((note) => {
    const x = xFor(note.index);
    const y = yFor(note.value);
    return `<line x1="${x}" x2="${x}" y1="${margin.top}" y2="${margin.top + innerHeight}" stroke="var(--accent)" stroke-dasharray="3 4" opacity=".65"/><text class="annotation-text" x="${Math.min(width - margin.right - 78, x + 5)}" y="${Math.max(margin.top + 9, y - 7)}">${escapeHtml(note.text)}</text>`;
  }).join('');
  const legend = series.map((item) => `<span class="legend-key"><span class="legend-swatch" style="color:${escapeHtml(item.color)}"></span>${escapeHtml(item.name)}</span>`).join('');
  return `<div class="chart-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}"><desc>${escapeHtml(ariaLabel)}</desc>${grid}<line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${margin.top + innerHeight}" y2="${margin.top + innerHeight}"/>${zeroY >= margin.top && zeroY <= margin.top + innerHeight ? `<line class="axis-line" x1="${margin.left}" x2="${width - margin.right}" y1="${zeroY}" y2="${zeroY}" opacity=".65"/>` : ''}${xTicks}${yLabel ? `<text class="axis-label" x="${margin.left}" y="9">${escapeHtml(yLabel)}</text>` : ''}${seriesMarkup}${annotationMarkup}</svg><div class="chart-legend">${legend}</div></div>`;
}
