// The light-or-dark switch in the header. theme.js in the head has already
// put the starting theme on <html>; this remembers a choice and follows the
// system again when there is none.
const root = document.documentElement;
const color = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];

const stored = () => {
  try {
    return localStorage.getItem('theme');
  } catch {
    return null;
  }
};

const apply = (theme: 'light' | 'dark') => {
  root.setAttribute('data-theme', theme);
  color?.setAttribute('content', theme === 'light' ? '#f6f7fb' : '#0b0d12');
  for (const button of buttons) {
    button.setAttribute('aria-label', `Switch to the ${theme === 'light' ? 'dark' : 'light'} theme`);
  }
};

for (const button of buttons) {
  button.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    try {
      localStorage.setItem('theme', next);
    } catch {
      // Not remembered, but switched for this page
    }
    apply(next);
  });
}

matchMedia('(prefers-color-scheme: light)').addEventListener('change', (e) => {
  if (!stored()) apply(e.matches ? 'light' : 'dark');
});

apply(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');

export {};
