// The countdown on the coming-soon page: [data-countdown] carries the
// instant in data-until, and holds a [data-unit] for days, hours, minutes
// and seconds. Once the moment has passed, the [data-arrived] line is shown
// in its place.
const boxes = document.querySelectorAll<HTMLElement>('[data-countdown]');

for (const box of boxes) {
  const until = Date.parse(box.dataset.until ?? '');
  if (Number.isNaN(until)) continue;
  const units: Record<string, HTMLElement | null> = {
    days: box.querySelector('[data-unit="days"]'),
    hours: box.querySelector('[data-unit="hours"]'),
    minutes: box.querySelector('[data-unit="minutes"]'),
    seconds: box.querySelector('[data-unit="seconds"]'),
  };
  const arrived = box.parentElement?.querySelector<HTMLElement>('[data-arrived]');

  const tick = () => {
    const left = until - Date.now();
    if (left <= 0) {
      box.hidden = true;
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
    for (const [name, el] of Object.entries(units)) {
      if (el) el.textContent = String(parts[name as keyof typeof parts]).padStart(2, '0');
    }
  };
  const timer = setInterval(tick, 1000);
  tick();
}

export {};
