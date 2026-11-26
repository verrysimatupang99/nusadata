export function renderNotFound(route) {
  const path = route?.path || window.location.hash.replace(/^#/, '');
  const html = `<section class="panel notfound-panel"><p class="eyebrow">Unknown route</p><h1>No statistical table is published at ${path}.</h1><p>The address may be mistyped. NusaData routes are hash-based so deep links keep working on any static server.</p><a class="inline-link-button" href="#/">Return to dashboard</a></section>`;
  return { html };
}
