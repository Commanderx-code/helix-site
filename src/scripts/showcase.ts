// The tool slider: previous and next, a dot per slide, and a slide every
// few seconds until someone hovers, focuses or pauses it. Reduced motion
// turns off both the timer and the smooth scroll; a request to save data
// turns off the timer, so no slide loads unasked, and so does a narrow
// screen, where the row moves only when swiped. From the keyboard, only
// the slide in view can be tabbed into, one dot stands for the row of them,
// and the arrow keys move between slides.
const DELAY = 6000;
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
const sparing = matchMedia('(prefers-reduced-data: reduce)').matches;
const handheld = matchMedia('(max-width: 48rem)').matches;

for (const root of document.querySelectorAll<HTMLElement>('[data-showcase]')) {
  const track = root.querySelector<HTMLElement>('[data-track]')!;
  const slides = [...track.children] as HTMLElement[];
  const dots = [...root.querySelectorAll<HTMLButtonElement>('[data-dot]')];
  const pause = root.querySelector<HTMLButtonElement>('[data-pause]')!;
  if (slides.length < 2) continue;

  root.querySelector<HTMLElement>('[data-controls]')!.hidden = false;
  let current = 0;
  let paused = still || sparing || handheld;
  let held = false;
  let timer: number | undefined;

  const show = (i: number) => {
    const n = (i + slides.length) % slides.length;
    track.scrollTo({ left: slides[n].offsetLeft - slides[0].offsetLeft, behavior: still ? 'auto' : 'smooth' });
  };

  // The slide most in view is the current one, however it got there. The
  // others are inert, so Tab does not walk through every slide's link
  const seen = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        (entry.target as HTMLElement).inert = !entry.isIntersecting;
        if (!entry.isIntersecting) continue;
        current = slides.indexOf(entry.target as HTMLElement);
        dots.forEach((dot, i) => {
          dot.setAttribute('aria-current', String(i === current));
          dot.tabIndex = i === current ? 0 : -1;
        });
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

  // Left and right arrows move a slide, Home and End to the ends; on the
  // dots the focus moves along with the slide
  root.addEventListener('keydown', (e) => {
    const step = { ArrowLeft: -1, ArrowRight: 1 }[e.key];
    const target = e.key === 'Home' ? 0 : e.key === 'End' ? slides.length - 1 : step && current + step;
    if (target === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const n = (target + slides.length) % slides.length;
    show(n);
    if (dots.includes(e.target as HTMLButtonElement)) dots[n].focus();
  });

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
