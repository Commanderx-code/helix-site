// The menu button on narrow screens folds the site links out under the
// bar and back. The panel closes when a link is chosen, on Escape, or when
// the window grows wide enough for the links to sit in the bar again.
const header = document.querySelector<HTMLElement>('[data-header]');
const button = header?.querySelector<HTMLButtonElement>('[data-menu]');
const nav = header?.querySelector<HTMLElement>('nav');

if (header && button && nav) {
  const set = (open: boolean) => {
    header.toggleAttribute('data-open', open);
    button.setAttribute('aria-expanded', String(open));
  };
  button.addEventListener('click', () => set(!header.hasAttribute('data-open')));
  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) set(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && header.hasAttribute('data-open')) {
      set(false);
      button.focus();
    }
  });
  const wide = matchMedia('(min-width: 60.01rem)');
  wide.addEventListener('change', () => {
    if (wide.matches) set(false);
  });
}

export {};
