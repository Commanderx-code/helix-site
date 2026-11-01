// A link to another site opens in a new tab, so this one stays where it
// was. A download does not leave the page, so it keeps its tab. Without
// this script the links still work, in the same tab.
for (const a of document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]:not([download])')) {
  if (a.origin === location.origin) continue;
  a.target = '_blank';
  a.rel = 'noopener';
}
