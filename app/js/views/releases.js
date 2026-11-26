import { escapeHtml } from '../format.js';
import { releaseCalendar, releaseRhythm } from '../data/releases.js';

export function renderReleases() {
  const grouped = new Map();
  for (const release of releaseCalendar) {
    if (!grouped.has(release.month)) grouped.set(release.month, []);
    grouped.get(release.month).push(release);
  }
  const months = [...grouped.entries()].map(([month, releases]) => `<section class="release-month-block"><h2 class="release-month">${escapeHtml(month)}</h2><div class="release-list">${releases.map((release) => `<article class="release-item"><time class="release-date" datetime="${escapeHtml(release.date)}">${escapeHtml(formatReleaseDate(release.date))}</time><div><strong>${escapeHtml(release.title)}</strong><small>${escapeHtml(release.note)}</small></div><span class="pill ${release.status === 'released' ? '' : 'red'}">${escapeHtml(release.status)}</span></article>`).join('')}</div></section>`).join('');
  const rhythm = releaseRhythm.map((item) => `<article class="fact-card"><div class="fact-label">${escapeHtml(item.label)}</div><div class="fact-note" style="font-size:12px;margin-top:5px">${escapeHtml(item.text)}</div></article>`).join('');
  const html = `
    <section class="page-heading"><div><p class="eyebrow">Release calendar</p><h1>When Indonesia's official statistics arrive</h1><p class="lede">BPS moved final trade figures to the first-working-day statistical release in June 2025; CPI, trade, tourism and transport now share many release mornings.</p></div><div class="asof">Calendar structure checked against<br>BPS 2025 releases</div></section>
    <section class="three-col">${rhythm}</section>
    <section class="panel" style="margin-top:12px"><header class="panel-header"><div><h2>2025–2026 release ledger</h2><p>Released entries name the statistical event; future entries are scheduled windows.</p></div></header><div class="panel-body">${months}<p class="source-line">BPS official statistics news release calendar and published 2025 release dates</p></div></section>`;
  return { html };
}

function formatReleaseDate(iso) {
  const [, month, day] = iso.split('-');
  return `${day} ${['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][Number(month)-1]}`;
}
