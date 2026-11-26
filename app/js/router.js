import { escapeHtml } from './format.js';

const viewLoaders = {
  home: () => import('./views/dashboard.js'),
  economy: () => import('./views/economy.js'),
  population: () => import('./views/population.js'),
  prices: () => import('./views/prices.js'),
  labour: () => import('./views/labour.js'),
  regions: () => import('./views/regions.js'),
  indicators: () => import('./views/indicators.js'),
  releases: () => import('./views/releases.js'),
  about: () => import('./views/about.js'),
  notfound: () => import('./views/notfound.js'),
};

const rendererNames = {
  home: 'renderDashboard',
  economy: 'renderEconomy',
  population: 'renderPopulation',
  prices: 'renderPrices',
  labour: 'renderLabour',
  regions: 'renderRegions',
  indicators: 'renderIndicators',
  releases: 'renderReleases',
  about: 'renderAbout',
  notfound: 'renderNotFound',
};

export function parseHashRoute(hash = window.location.hash) {
  const clean = hash.replace(/^#/, '') || '/';
  const [pathPart, queryPart = ''] = clean.split('?');
  const segments = pathPart.split('/').filter(Boolean).map(decodeURIComponent);
  const query = new URLSearchParams(queryPart);
  const first = segments[0] || 'home';
  const known = Object.hasOwn(viewLoaders, first);
  return {
    name: known ? first : 'notfound',
    requested: first,
    segments,
    query,
    path: pathPart || '/',
  };
}

export function initRouter({ outlet, onRoute }) {
  const render = async () => {
    const route = parseHashRoute();
    const loader = viewLoaders[route.name] || viewLoaders.notfound;
    outlet.innerHTML = '<section class="loading-panel"><p class="eyebrow">NusaData</p><h1>Opening the statistical record…</h1></section>';
    try {
      const module = await loader();
      const renderer = module[rendererNames[route.name]];
      const view = renderer(route);
      outlet.innerHTML = view.html;
      if (typeof view.mount === 'function') view.mount(outlet, route);
      onRoute?.(route.name === 'notfound' ? 'home' : route.name);
      window.scrollTo({ top: 0, behavior: 'instant' });
    } catch (error) {
      console.error(error);
      outlet.innerHTML = `<section class="panel notfound-panel"><p class="eyebrow">Rendering error</p><h1>This statistical page failed to open.</h1><p>${escapeHtml(error?.message || error)}</p><a class="inline-link-button" href="#/">Return to dashboard</a></section>`;
    }
  };
  window.addEventListener('hashchange', render);
  if (!window.location.hash) window.location.hash = '#/';
  else render();
}
