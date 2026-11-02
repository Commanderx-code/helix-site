// One share card per page: /og/home.png, /og/contact.png and so on, and one
// per tool under its slug
import type { APIRoute } from 'astro';
import { tools } from '../../data/tools';
import { allPosts } from '../../data/posts';
import { card, type Card } from '../../og/card';

// The tools' dark accents, as in tools.css
const accents: Record<string, string> = {
  toolbox: '#3bd2ff',
  boot: '#c084fc',
  'config-bible': '#e879f9',
  'webos-launcher': '#7fb4ff',
  touchdown: '#79e4b7',
};

const pages: Record<string, Card> = {
  home: {
    eyebrow: 'Build. Configure. Optimize.',
    title: 'Tools for your machines',
    text: 'A Linux setup toolbox, a rescue USB that builds itself, a handbook for your workstation, a home screen for LG TVs and a scoreboard for the terminal.',
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Say hello.',
    text: 'A question, an idea, something broken, or a tool you would like to see: write and it will be read.',
  },
  news: {
    eyebrow: 'Releases',
    title: 'What’s new.',
    text: 'The latest releases of every Helix Tech tool, with their notes.',
  },
  posts: {
    eyebrow: 'Guides and notes',
    title: 'Posts.',
    text: 'What the Helix Tech tools do, how they work and how to get the most from them.',
  },
  privacy: {
    eyebrow: 'Privacy',
    title: 'Nothing to track.',
    text: 'No cookies, no analytics, no third-party scripts. What the site keeps, and why.',
  },
  'coming-soon': {
    eyebrow: 'Coming soon',
    title: 'On its way.',
    text: 'Something new from Helix Tech is almost ready. Follow the feed or watch GitHub to hear first.',
  },
  maintenance: {
    eyebrow: 'Maintenance',
    title: 'Back in a moment.',
    text: 'The site is being worked on. The tools and their downloads stay where they always are, on GitHub.',
  },
  ...Object.fromEntries(
    tools.map((tool, i) => [
      tool.slug,
      {
        eyebrow: `${String(i + 1).padStart(2, '0')} / ${tool.category}`,
        title: tool.name,
        text: tool.pitch,
        accent: accents[tool.slug],
      },
    ]),
  ),
};

export async function getStaticPaths() {
  const posts = (await allPosts()).map((post) => [
    post.id,
    {
      eyebrow: post.data.categories[0],
      title: post.data.title,
      text: post.data.description,
      accent: post.data.tool ? accents[post.data.tool] : undefined,
    },
  ]);
  return [...Object.entries(pages), ...posts].map(([slug, props]) => ({ params: { slug }, props }));
}

export const GET: APIRoute = async ({ props }) =>
  new Response(await card(props as Card), { headers: { 'Content-Type': 'image/png' } });
