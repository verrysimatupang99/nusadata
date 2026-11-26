import { initRouter } from './router.js';

export function initializeNusaData() {
  installMenuToggle();
  installIndicatorSearch();
  installChartTooltip();
  initRouter({
    outlet: document.getElementById('app'),
    onRoute: markActiveNavigation,
  });
}

export function installMenuToggle() {
  const button = document.getElementById('menu-toggle');
  const nav = document.getElementById('site-nav');
  button?.addEventListener('click', () => {
    const open = !nav.classList.contains('nav-open');
    nav.classList.toggle('nav-open', open);
    button.setAttribute('aria-expanded', String(open));
  });
  nav?.addEventListener('click', (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      nav.classList.remove('nav-open');
      button?.setAttribute('aria-expanded', 'false');
    }
  });
}

export function installIndicatorSearch() {
  const form = document.getElementById('site-search');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = form.querySelector('input');
    const query = input ? input.value.trim() : '';
    window.location.hash = query ? `#/indicators?q=${encodeURIComponent(query)}` : '#/indicators';
  });
}

export function installChartTooltip() {
  const tooltip = document.getElementById('chart-tooltip');
  if (!tooltip) return;
  const show = (target) => {
    const text = target.getAttribute('data-tip');
    if (!text) return;
    tooltip.textContent = text;
    tooltip.hidden = false;
    const rect = target.getBoundingClientRect();
    const width = Math.min(280, window.innerWidth - 20);
    tooltip.style.maxWidth = `${width}px`;
    const x = Math.max(8, Math.min(window.innerWidth - width - 10, rect.left + rect.width / 2 - width / 2));
    const y = rect.top > 86 ? rect.top - tooltip.offsetHeight - 9 : rect.bottom + 9;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${Math.max(8, y)}px`;
  };
  const hide = () => { tooltip.hidden = true; };
  document.addEventListener('pointerover', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-tip]') : null;
    if (target) show(target);
  });
  document.addEventListener('pointermove', (event) => {
    if (tooltip.hidden) return;
    const width = tooltip.offsetWidth;
    const x = Math.max(8, Math.min(window.innerWidth - width - 10, event.clientX - width / 2));
    const y = event.clientY > 110 ? event.clientY - tooltip.offsetHeight - 14 : event.clientY + 14;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  });
  document.addEventListener('pointerout', (event) => {
    if (event.target instanceof Element && event.target.closest('[data-tip]')) hide();
  });
  document.addEventListener('focusin', (event) => {
    const target = event.target instanceof Element ? event.target.closest('[data-tip]') : null;
    if (target) show(target);
  });
  document.addEventListener('focusout', hide);
  window.addEventListener('hashchange', hide);
}

export function markActiveNavigation(routeName) {
  document.querySelectorAll('.site-nav a').forEach((link) => {
    const active = link.getAttribute('data-route') === routeName;
    if (active) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
}

initializeNusaData();
