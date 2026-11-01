// The screenshot viewer: a gallery slide opens its picture over the page,
// as large as the screen allows, with the caption, the previous and next
// shots a key or a press away, and the original file a link. Without this
// script the slide links to that file, as before.
for (const root of document.querySelectorAll<HTMLElement>('[data-showcase]')) {
  const box = root.querySelector<HTMLDialogElement>('[data-lightbox]');
  if (!box) continue;
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-track] a')];
  const figure = box.querySelector<HTMLElement>('[data-figure]')!;
  const caption = box.querySelector<HTMLElement>('[data-caption]')!;
  const count = box.querySelector<HTMLElement>('[data-place]')!;
  const original = box.querySelector<HTMLAnchorElement>('[data-original]')!;
  let current = 0;

  const show = (i: number) => {
    current = (i + links.length) % links.length;
    const link = links[current];
    // The slide's own picture, with its sizes, so the browser fetches the
    // width the screen needs and no more
    const img = link.querySelector('img')!.cloneNode() as HTMLImageElement;
    img.sizes = '100vw';
    img.loading = 'eager';
    img.removeAttribute('fetchpriority');
    figure.replaceChildren(img);
    caption.textContent = img.alt;
    count.textContent = `${current + 1} / ${links.length}`;
    original.href = link.href;
  };

  links.forEach((link, i) => {
    link.addEventListener('click', (e) => {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      show(i);
      box.showModal();
    });
  });
  box.querySelector('[data-prev]')!.addEventListener('click', () => show(current - 1));
  box.querySelector('[data-next]')!.addEventListener('click', () => show(current + 1));
  box.querySelector('[data-close]')!.addEventListener('click', () => box.close());
  box.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
    else return;
    e.preventDefault();
    e.stopPropagation();
  });
  // A press on the dark around the picture closes it
  box.addEventListener('click', (e) => {
    if (e.target === box) box.close();
  });
  // Back where it was opened from
  box.addEventListener('close', () => links[current].focus());
}
