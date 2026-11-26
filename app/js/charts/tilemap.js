import { escapeHtml } from '../format.js';

function metricColor(value, min, max, negativeGood = false) {
  const t = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  if (negativeGood) {
    const light = [241, 229, 214];
    const dark = [118, 21, 33];
    const mix = light.map((channel, index) => Math.round(channel + (dark[index] - channel) * t));
    return `rgb(${mix.join(',')})`;
  }
  const light = [239, 231, 214];
  const dark = [36, 78, 121];
  const mix = light.map((channel, index) => Math.round(channel + (dark[index] - channel) * t));
  return `rgb(${mix.join(',')})`;
}

export function provinceTileMap({ provinces, metric, width = 900, tileW = 48, tileH = 38, gap = 5, ariaLabel = 'Province tile map' }) {
  const values = provinces.map((province) => province[metric.key]).filter(Number.isFinite);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const tiles = provinces.map((province) => {
    const x = 8 + province.mapX * (tileW + gap);
    const y = 8 + province.mapY * (tileH + gap);
    const color = metricColor(province[metric.key], min, max, metric.negativeGood);
    const tip = `${province.name}\n${metric.label}: ${metric.format(province[metric.key])}\nPopulation: ${province.populationM.toFixed(1)} million`;
    return `<g><rect class="tile-shape" x="${x}" y="${y}" width="${tileW}" height="${tileH}" rx="2" fill="${color}" stroke="rgba(23,35,58,.42)" tabindex="0" data-province="${escapeHtml(province.code)}" data-tip="${escapeHtml(tip)}" role="button" aria-label="${escapeHtml(province.name)}"><title>${escapeHtml(tip)}</title></rect><text x="${x + tileW / 2}" y="${y + 16}" text-anchor="middle" font-size="10" font-weight="750" fill="${metric.negativeGood && province[metric.key] > min + (max - min) * .55 ? '#fffdf8' : !metric.negativeGood && province[metric.key] > min + (max - min) * .55 ? '#fffdf8' : '#17233a'}" pointer-events="none">${escapeHtml(province.short)}</text><text x="${x + tileW / 2}" y="${y + 29}" text-anchor="middle" font-size="8.5" fill="${province[metric.key] > min + (max - min) * .55 ? '#fffdf8' : '#3f4b64'}" pointer-events="none">${escapeHtml(metric.shortFormat(province[metric.key]))}</text></g>`;
  }).join('');
  const height = 16 + 6 * (tileH + gap);
  return `<div class="chart-box tilemap-box"><svg class="chart-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escapeHtml(ariaLabel)}"><text class="axis-label" x="8" y="${height - 1}">Schematic tile positions west → east; tile size is equal, not land area.</text>${tiles}</svg><div class="chart-legend"><span class="legend-key"><span class="legend-swatch" style="color:rgb(239,231,214)"></span>low</span><span>${escapeHtml(metric.label)}</span><span class="legend-key"><span class="legend-swatch" style="color:${metric.negativeGood ? 'rgb(118,21,33)' : 'rgb(36,78,121)'}"></span>high</span></div></div>`;
}
