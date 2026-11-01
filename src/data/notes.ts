// Release notes come from GitHub as Markdown, written by whoever can publish
// a release there. They are rendered and then cut down to plain formatting
// (text, lists, links, code, tables), so nothing in them can run or load on
// the site. The page and the feed both go through here.
import { marked } from 'marked';
import sanitize from 'sanitize-html';

const escape = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// A GitHub address pasted as is reads as GitHub itself shows it: the
// repository and the pull request, issue, commit or comparison
const github = /^https:\/\/github\.com\/([^/\s]+\/[^/\s]+)\/(pull|issues|commit|compare)\/([^\s?#]+)$/;
export function linkText(href: string): string {
  const m = github.exec(href);
  if (!m) return href;
  const [, repo, kind, rest] = m;
  if (kind === 'commit') return `${repo}@${rest.slice(0, 7)}`;
  if (kind === 'compare') return `${repo}@${rest}`;
  return `${repo}#${rest.split('/')[0]}`;
}

// Pictures would come from GitHub, which the site's policy does not load, so
// they become links; raw HTML is shown as text
marked.use({
  renderer: {
    image: ({ href, text }) => `<a href="${escape(href)}">${escape(text || 'image')}</a>`,
    html: ({ text }) => escape(text),
    link({ href, tokens }) {
      const bare = tokens.length === 1 && tokens[0].type === 'text' && tokens[0].raw === href;
      const text = bare ? escape(linkText(href)) : this.parser.parseInline(tokens);
      return `<a href="${escape(href)}">${text}</a>`;
    },
  },
});

const allowed: sanitize.IOptions = {
  allowedTags: [
    'p', 'br', 'hr', 'strong', 'em', 'b', 'i', 's', 'del', 'code', 'pre', 'blockquote',
    'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
  ],
  allowedAttributes: { a: ['href'] },
  allowedSchemes: ['http', 'https', 'mailto'],
};

/** The notes as safe HTML. */
export function renderNotes(markdown: string): string {
  return sanitize(marked.parse(markdown, { async: false, gfm: true }), allowed);
}

/** The notes as one line of plain text, cut to a length, for a feed or a summary. */
export function plainNotes(markdown: string, max = 300): string {
  const text = sanitize(marked.parse(markdown, { async: false, gfm: true }), { allowedTags: [], allowedAttributes: {} })
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text;
}
