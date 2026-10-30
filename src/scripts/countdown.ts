// The countdown boxes (components/Countdown.astro). Each [data-countdown]
// knows its instant from data-until, or reads it from the address in
// data-until-from: a text file holding one ISO 8601 date, as the server's
// maintenance switch does. It stays hidden until it has a date. Once the
// moment has passed, the boxes give way to the [data-arrived] line.
const format = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZoneName: 'short',
});

function run(box: HTMLElement, until: number) {
  const units = ['days', 'hours', 'minutes', 'seconds'] as const;
  const cells = Object.fromEntries(units.map((u) => [u, box.querySelector<HTMLElement>(`[data-unit="${u}"]`)]));
  const list = box.querySelector<HTMLElement>('ul');
  const when = box.querySelector<HTMLElement>('[data-when]');
  const arrived = box.querySelector<HTMLElement>('[data-arrived]');

  if (when) {
    when.textContent = format.format(until);
    when.setAttribute('datetime', new Date(until).toISOString());
  }
  box.hidden = false;

  const tick = () => {
    const left = until - Date.now();
    if (left <= 0) {
      if (list) list.hidden = true;
      if (when) when.hidden = true;
      if (arrived) arrived.hidden = false;
      clearInterval(timer);
      return;
    }
    const s = Math.floor(left / 1000);
    const parts = {
      days: Math.floor(s / 86_400),
      hours: Math.floor((s % 86_400) / 3600),
      minutes: Math.floor((s % 3600) / 60),
      seconds: s % 60,
    };
    for (const u of units) {
      const cell = cells[u];
      if (cell) cell.textContent = String(parts[u]).padStart(2, '0');
    }
  };
  const timer = setInterval(tick, 1000);
  tick();
}

for (const box of document.querySelectorAll<HTMLElement>('[data-countdown]')) {
  const fixed = Date.parse(box.dataset.until ?? '');
  if (!Number.isNaN(fixed)) {
    run(box, fixed);
    continue;
  }
  const from = box.dataset.untilFrom;
  if (!from) continue;
  fetch(from, { cache: 'no-store' })
    .then((r) => (r.ok ? r.text() : ''))
    .then((text) => {
      const read = Date.parse(text.trim());
      if (!Number.isNaN(read)) run(box, read);
    })
    .catch(() => {
      // No date to show; the page reads fine without one
    });
}

export {};
