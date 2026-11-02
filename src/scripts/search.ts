// The search box behind the magnifying glass in the header. It fetches
// /search.json the first time it opens and matches in the browser: every word
// typed must appear in an entry, and a word in the title counts for most.
interface Entry {
  kind: string;
  title: string;
  url: string;
  summary: string;
  text: string;
}

const MAX_RESULTS = 8;

const dialog = document.querySelector<HTMLDialogElement>('[data-search]');
const openButton = document.querySelector<HTMLButtonElement>('[data-search-open]');
const form = dialog?.querySelector('form');
const input = dialog?.querySelector('input');
const note = dialog?.querySelector('[role="status"]');
const list = dialog?.querySelector('ol');

/** Words found in the title, summary and text; 0 when any word is in none of them */
function score(entry: Entry, words: string[]) {
  const title = entry.title.toLowerCase();
  const summary = entry.summary.toLowerCase();
  const text = entry.text.toLowerCase();
  let total = 0;
  for (const word of words) {
    const points = (title.includes(word) ? 10 : 0) + (summary.includes(word) ? 3 : 0) + (text.includes(word) ? 1 : 0);
    if (!points) return 0;
    total += points;
  }
  return total;
}

function search(entries: Entry[], query: string) {
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  return entries
    .map((entry) => ({ entry, points: score(entry, words) }))
    .filter((match) => match.points)
    .sort((a, b) => b.points - a.points)
    .slice(0, MAX_RESULTS)
    .map((match) => match.entry);
}

function row({ kind, title, url, summary }: Entry) {
  const span = (name: string, words: string) => {
    const part = document.createElement('span');
    part.className = name;
    part.textContent = words;
    return part;
  };
  const link = document.createElement('a');
  link.href = url;
  link.append(span('kind', kind), span('title', title), span('summary', summary));
  const item = document.createElement('li');
  item.append(link);
  return item;
}

if (dialog && openButton && form && input && note && list) {
  let index: Promise<Entry[]> | undefined;
  // A failed fetch is not kept, so the next keystroke tries again
  const load = () =>
    (index ??= fetch('/search.json')
      .then((response) => {
        if (!response.ok) throw new Error(`/search.json: ${response.status}`);
        return response.json() as Promise<Entry[]>;
      })
      .catch((error) => {
        index = undefined;
        throw error;
      }));

  const show = async () => {
    const query = input.value.trim();
    if (!query) {
      note.textContent = '';
      list.replaceChildren();
      return;
    }
    try {
      const entries = await load();
      // Typing may have moved on while the index loaded
      if (query !== input.value.trim()) return;
      const found = search(entries, query);
      note.textContent = found.length ? `${found.length} ${found.length === 1 ? 'result' : 'results'}` : 'Nothing found.';
      list.replaceChildren(...found.map(row));
    } catch {
      note.textContent = 'Search could not load. Try again in a moment.';
    }
  };

  openButton.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('[data-search-close]')?.addEventListener('click', () => dialog.close());
  input.addEventListener('input', show);
  dialog.addEventListener('close', () => {
    input.value = '';
    show();
  });
  // A press on the backdrop lands on the dialog itself, not on the box inside
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog || (e.target as Element).closest('a')) dialog.close();
  });
  // Enter takes the first result
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    list.querySelector('a')?.click();
  });
}
