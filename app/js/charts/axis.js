export function linearScale(domainMin, domainMax, rangeMin, rangeMax) {
  const span = domainMax - domainMin || 1;
  return (value) => rangeMin + ((value - domainMin) / span) * (rangeMax - rangeMin);
}

export function extentOf(values, padding = 0) {
  const finite = values.filter((value) => Number.isFinite(value));
  let min = Math.min(...finite);
  let max = Math.max(...finite);
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  if (min === max) {
    min -= 1;
    max += 1;
  }
  const span = max - min;
  return [min - span * padding, max + span * padding];
}

export function niceTicks(min, max, count = 5) {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [];
  if (min === max) return [min];
  const span = max - min;
  const rough = span / Math.max(1, count - 1);
  const power = 10 ** Math.floor(Math.log10(rough));
  const candidates = [1, 2, 2.5, 5, 10].map((step) => step * power);
  const step = candidates.find((candidate) => span / candidate <= count + 0.5) || candidates.at(-1);
  const first = Math.ceil(min / step) * step;
  const ticks = [];
  for (let value = first; value <= max + step * 0.001; value += step) {
    ticks.push(Math.abs(value) < step / 1e6 ? 0 : Number(value.toFixed(8)));
  }
  return ticks;
}

export function defaultMargins() {
  return { top: 14, right: 18, bottom: 30, left: 48 };
}

export function formatTick(value) {
  const abs = Math.abs(value);
  if (abs >= 1000) return `${Math.round(value)}`;
  if (abs >= 100) return value.toFixed(0);
  if (abs >= 10) return value.toFixed(1).replace(/\.0$/, '');
  return value.toFixed(2).replace(/0$/, '').replace(/\.0$/, '').replace(/\.$/, '');
}
