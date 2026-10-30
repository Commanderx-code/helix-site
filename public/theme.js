// Runs in the head, before the page paints: the theme chosen with the
// header switch, or failing that the system's, goes on <html> so the right
// colours show from the first frame. The switch itself lives in the site's
// script.
(() => {
  let theme = null;
  try {
    theme = localStorage.getItem('theme');
  } catch {
    // Storage may be blocked; the system theme is used
  }
  if (theme !== 'light' && theme !== 'dark') {
    theme = matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  document.documentElement.setAttribute('data-theme', theme);
})();
