// The tool slider: previous and next, a dot per slide, and a slide every
// few seconds until someone hovers, focuses or pauses it. Reduced motion
// turns off both the timer and the smooth scroll.
const DELAY = 6000;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

for (const root of document.querySelectorAll<HTMLElement>('[data-showcase]')) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const slides = [...track.children] as HTMLElement[];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  const pause = root.querySelector<HTMLButtonElement>('[data-pause]')!;
  if (slides.length < 2) continue;

  root.querySelector<HTMLElement>('[data-controls]')!.hidden = false;
  let current = 0;
  let paused = still;
  let held = false;
  let timer: number | undefined;

  const show = (i: number) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft - slides[0].offsetLeft, behavior: still ? 'auto' : 'smooth' });
  };

  // The slide most in view is the current one, however it got there
  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        current = slides.indexOf(entry.target as HTMLElement);
        dots.forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
      }
    },
    { root: track, threshold: 0.6 },
  );
  slides.forEach((slide) => seen.observe(slide));

  const tick = () => {
    clearInterval(timer);
    if (!paused && !held) timer = window.setInterval(() => show(current + 1), DELAY);
  };
  const setPaused = (value: boolean) => {
    paused = value;
    pause.textContent = paused ? 'Play' : 'Pause';
    tick();
  };

  root.querySelector('[data-prev]')!.addEventListener('click', () => show(current - 1));
  root.querySelector('[data-next]')!.addEventListener('click', () => show(current + 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i)));
  pause.addEventListener('click', () => setPaused(!paused));

  // Hold still while someone is looking at or working in the slider
  const hold = (value: boolean) => () => {
    held = value;
    tick();
  };
  root.addEventListener('pointerenter', hold(true));
  root.addEventListener('pointerleave', hold(false));
  root.addEventListener('focusin', hold(true));
  root.addEventListener('focusout', (e) => {
    if (!root.contains(e.relatedTarget as Node)) hold(false)();
  });

  setPaused(paused);
}

export {};
