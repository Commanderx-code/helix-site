// Motion for every page: the header that settles once the page scrolls,
// sections that rise into view, counters that count up, the typed word in
// the headline, screenshots that drift as the page scrolls and a ring that
// follows the mouse. Without this script, or with reduced motion, every
// part of the page is simply there.
const still = matchMedia('(prefers-reduced-motion: reduce)').matches;

// The header turns frosted and shorter once the page leaves the top
const header = document.querySelector<HTMLElement>('[data-header]');
if (header) {
  const update = () => header.toggleAttribute('data-scrolled', scrollY > 8);
  update();
  addEventListener('scroll', update, { passive: true });
}

if (!still) {
  // Each [data-reveal] rises into view, a beat after the one before it in the same parent
  const reveals = [...document.querySelectorAll<HTMLElement>('[data-reveal]')];
  for (const el of reveals) {
    const siblings = [...(el.parentElement?.children ?? [])].filter((c) => c.hasAttribute('data-reveal'));
    el.style.setProperty('--reveal-order', String(siblings.indexOf(el)));
  }
  const rise = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        el.classList.add('is-in');
        rise.unobserve(el);
        // Once in place, drop the reveal so the element's own transitions,
        // like a card growing under the pointer, are not slowed by it
        const settle = () => {
          el.removeAttribute('data-reveal');
          el.classList.remove('is-in');
        };
        const order = Number(el.style.getPropertyValue('--reveal-order')) || 0;
        setTimeout(settle, 1700 + order * 160);
      }
    },
    { rootMargin: '0px 0px -8% 0px' },
  );
  document.documentElement.setAttribute('data-motion', '');
  reveals.forEach((el) => rise.observe(el));

  // Counters show zero from the start and run up to their number once they
  // are seen, after a beat so the page has painted first
  const counters = [...document.querySelectorAll<HTMLElement>('[data-count]')];
  const format = new Intl.NumberFormat('en-US');
  counters.forEach((el) => (el.textContent = '0'));
  const count = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        const el = entry.target as HTMLElement;
        count.unobserve(el);
        const target = Number(el.dataset.count);
        const run = () => {
          const start = performance.now();
          const step = (now: number) => {
            const t = Math.min((now - start) / 3200, 1);
            el.textContent = format.format(Math.round(target * (1 - (1 - t) ** 3)));
            if (t < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        };
        setTimeout(run, 400);
      }
    },
    { threshold: 0.3 },
  );
  counters.forEach((el) => count.observe(el));

  // The typed word: types each word, holds it, deletes it, types the next
  for (const el of document.querySelectorAll<HTMLElement>('[data-typed]')) {
    const words = el.dataset.typed!.split('|');
    let word = 0;
    let shown = words[0].length;
    let deleting = true;
    const tick = () => {
      if (deleting) {
        shown--;
        if (shown === 0) {
          deleting = false;
          word = (word + 1) % words.length;
        }
      } else {
        shown++;
      }
      el.textContent = words[word].slice(0, shown) || '​';
      const done = !deleting && shown === words[word].length;
      if (done) deleting = true;
      setTimeout(tick, done ? 2200 : deleting ? 45 : 90);
    };
    setTimeout(tick, 2600);
  }

  // Screenshots drift at their own depth as the page scrolls
  const drifters = [...document.querySelectorAll<HTMLElement>('[data-depth]')];
  if (drifters.length) {
    let queued = false;
    const drift = () => {
      queued = false;
      for (const el of drifters) {
        el.style.setProperty('--drift', `${(scrollY * Number(el.dataset.depth)).toFixed(1)}px`);
      }
    };
    addEventListener(
      'scroll',
      () => {
        if (!queued) requestAnimationFrame(drift);
        queued = true;
      },
      { passive: true },
    );
  }

  // A ring follows the mouse, and opens into a labelled disc over [data-cursor]
  if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const ring = document.createElement('div');
    ring.className = 'cursor-ring';
    ring.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span');
    ring.append(label);
    document.body.append(ring);

    let x = innerWidth / 2;
    let y = innerHeight / 2;
    let rx = x;
    let ry = y;
    const follow = () => {
      rx += (x - rx) * 0.18;
      ry += (y - ry) * 0.18;
      ring.style.transform = `translate(${rx.toFixed(1)}px, ${ry.toFixed(1)}px)`;
      requestAnimationFrame(follow);
    };
    requestAnimationFrame(follow);

    addEventListener('pointermove', (e) => {
      x = e.clientX;
      y = e.clientY;
      ring.classList.add('is-visible');
      const target = e.target as Element;
      const labelled = target.closest<HTMLElement>('[data-cursor]');
      ring.classList.toggle('is-label', !!labelled);
      ring.classList.toggle('is-link', !labelled && !!target.closest('a, button, summary'));
      if (labelled) label.textContent = labelled.dataset.cursor!;
    });
    document.documentElement.addEventListener('pointerleave', () => ring.classList.remove('is-visible'));
  }
}

export {};
