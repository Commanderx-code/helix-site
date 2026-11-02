// What the search box looks through, fetched the first time it opens. It runs
// in the visitor's browser, so nothing typed into it leaves the page; a hosted
// search would need the Content-Security-Policy opened to it, and one built on
// WebAssembly would need script-src opened.
import { allPosts } from '../data/posts';
import { faq } from '../data/faq';
import { tools } from '../data/tools';

/** Words only: pictures and link addresses would match searches they have nothing to do with */
const plainMarkdown = (markdown = '') =>
  markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/^\|[\s|-]+\|$/gm, ' ')
    .replace(/[`*_#|>]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const pages = [
  {
    title: 'Homelab',
    url: '/#homelab',
    summary: 'Where networking, self-hosted services and home automation come together.',
    text: 'OPNsense WireGuard Docker ZimaBoard Home Assistant Zigbee Uptime Kuma Checkmk monitoring',
  },
  { title: 'What’s new', url: '/news/', summary: 'The latest release of each tool.', text: 'releases changelog RSS feed' },
  { title: 'Contact', url: '/contact/', summary: 'Write to Helix Tech about the tools, the site or anything else.', text: 'email help support' },
  { title: 'Privacy', url: '/privacy/', summary: 'What the sites keep about their visitors, which is next to nothing.', text: 'cookies analytics tracking' },
  { title: 'Docs', url: 'https://docs.helixtech.app/', summary: 'Guides and reference for the tools.', text: 'documentation manual install' },
];

export async function GET() {
  const entries = [
    ...tools.map((t) => ({
      kind: 'Tool',
      title: t.name,
      url: `/tools/${t.slug}/`,
      summary: t.pitch,
      text: [t.category, t.summary, t.platforms, ...t.features].join(' '),
    })),
    ...(await allPosts()).map((post) => ({
      kind: 'Post',
      title: post.data.title,
      url: `/posts/${post.id}/`,
      summary: post.data.description,
      text: [...post.data.categories, plainMarkdown(post.body)].join(' '),
    })),
    ...faq.map((q) => ({ kind: 'FAQ', title: q.question, url: '/#faq', summary: q.answer, text: '' })),
    ...pages.map((page) => ({ kind: 'Page', ...page })),
  ];
  return new Response(JSON.stringify(entries), { headers: { 'Content-Type': 'application/json' } });
}
