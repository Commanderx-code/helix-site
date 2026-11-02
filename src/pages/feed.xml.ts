// An RSS feed of the tools' releases and the site's posts, newest first
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { tools, releaseNotes } from '../data/tools';
import { plainNotes, renderNotes } from '../data/notes';
import { allPosts } from '../data/posts';

export async function GET(context: APIContext) {
  const entries = (
    await Promise.all(tools.map(async (tool) => (await releaseNotes(tool.repo, 5)).map((release) => ({ tool, release }))))
  )
    .flat()
    .sort((a, b) => b.release.date.localeCompare(a.release.date));

  const releases = entries.map(({ tool, release }) => ({
    title: `${tool.name} ${release.tag}${release.name !== release.tag ? `: ${release.name}` : ''}`,
    link: release.url,
    pubDate: new Date(release.date),
    description: plainNotes(release.body) || `${tool.name} ${release.tag} is out.`,
    content: renderNotes(release.body),
    categories: [tool.name],
  }));
  const posts = (await allPosts()).map((post) => ({
    title: post.data.title,
    link: `/posts/${post.id}/`,
    pubDate: post.data.date,
    description: post.data.description,
    categories: post.data.categories,
  }));

  return rss({
    title: 'Helix Tech releases and posts',
    description: 'New releases of Helix Toolbox, Helix Boot, webOS Launcher and Touchdown, and guides to using them.',
    site: context.site!,
    items: [...releases, ...posts].sort((a, b) => b.pubDate.getTime() - a.pubDate.getTime()),
    customData: '<language>en-us</language>',
  });
}
