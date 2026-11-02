// The menu button on narrow screens folds the site links out under the
// bar and back. The panel closes when a link is chosen, on Escape, or when
// the window grows wide enough for the links to sit in the bar again.
//
// The Tools menu opens when pressed and, on wide screens, under the mouse.
// It closes when a link is chosen, on a click elsewhere, or on Escape.
const header = document.querySelector<HTMLElement>('[data-header]');
const button = header?.querySelector<HTMLButtonElement>('[data-menu]');
const nav = header?.querySelector<HTMLElement>('nav');
const wide = matchMedia('(min-width: 60.01rem)');

const more = nav?.querySelector<HTMLDetailsElement>('[data-tools]');
if (nav && more) {
  const byMouse = (e: PointerEvent) => e.pointerType === 'mouse' && wide.matches;
  const follow = (open: boolean) => (e: PointerEvent) => {
    if (byMouse(e)) more.open = open;
  };
  more.addEventListener('pointerenter', follow(true));
  more.addEventListener('pointerleave', follow(false));
  // The mouse has already opened it: a click must not shut it again
  more.querySelector('summary')?.addEventListener('click', (e) => {
    if (byMouse(e as PointerEvent)) e.preventDefault();
  });
  nav.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) more.open = false;
  });
  addEventListener('click', (e) => {
    if (!more.contains(e.target as Node)) more.open = false;
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && more.open) {
      more.open = false;
      more.querySelector('summary')?.focus();
    }
  });
}

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
  wide.addEventListener('change', () => {
    if (wide.matches) set(false);
  });
}

export {};
