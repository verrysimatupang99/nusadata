import { escapeHtml, formatNumber } from '../format.js';

export function populationPyramid({ groups, width = 420, height = 430, ariaLabel = 'Population pyramid' }) {
  const margin = { top: 13, right: 24, bottom: 30, left: 24 };
  const labelWidth = 42;
  const innerWidth = width - margin.left - margin.right - labelWidth;
  const rowHeight = (height - margin.top - margin.bottom) / groups.length;
  const center = margin.left + labelWidth + innerWidth / 2;
  const maxValue = Math.max(...groups.flatMap((group) => [group.male, group.female]));
  const scale = (value) => (value / maxValue) * (innerWidth / 2 - 5);
  const rows = groups.map((group, index) => {
    const y = margin.top + index * rowHeight;
    const maleWidth = scale(group.male);
    const femaleWidth = scale(group.female);
    const maleTip = `${group.age} men\n${formatNumber(group.male, 1)} million people`;
    const femaleTip = `${group.age} women\n${formatNumber(group.female, 1)} million people`;
    return `<g><rect class="bar-shape" x="${center - maleWidth}" y="${y + 1.5}" width="${maleWidth}" height="${Math.max(2, rowHeight - 3)}" fill="var(--navy)" tabindex="0" data-tip="${escapeHtml(maleTip)}"><title>${escapeHtml(maleTip)}</title></rect><rect class="bar-shape" x="${center}" y="${y + 1.5}" width="${femaleWidth}" height="${Math.max(2, rowHeight - 3)}" fill="var(--accent)" tabindex="0" data-tip="${escapeHtml(femaleTip)}"><title>${escapeHtml(femaleTip)}</title></rect><text class="tick-label" x="${center}" y="${y + rowHeight / 2 + 3}" text-anchor="middle">${escapeHtml(group.age)}</text></g>`;
  }).join('');
  const ticks = [0, maxValue / 2, maxValue];
  const axis = ticks.map((tick) => {
    const leftX = center - scale(tick);
    const rightX = center + scale(tick);
    return `<text class="axis-label" x="${leftX}" y="${height - 10}" text-anchor="middle">${formatNumber(tick, 0)}</text><text class="axis-label" x="${rightX}" y="${height - 10}" text-anchor="middle">${formatNumber(tick, 0)}</text>`;
  }).join('');
  return `<div class="chart-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}"><text class="axis-label" x="${center - innerWidth / 4}" y="10" text-anchor="middle">Men</text><text class="axis-label" x="${center + innerWidth / 4}" y="10" text-anchor="middle">Women</text>${rows}<line class="axis-line" x1="${center}" x2="${center}" y1="${margin.top}" y2="${height - margin.bottom}"/>${axis}<text class="axis-label" x="${center}" y="${height - 10}" text-anchor="middle">million people by five-year age group</text></svg></div>`;
}
