// An RSS feed of the tools' releases, newest first
import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { tools, releaseNotes } from '../data/tools';

export async function GET(context: APIContext) {
  const entries = (
    await Promise.all(tools.map(async (tool) => (await releaseNotes(tool.repo, 5)).map((release) => ({ tool, release }))))
  )
    .flat()
    .sort((a, b) => b.release.date.localeCompare(a.release.date));

  return rss({
    title: 'Helix Tech releases',
    description: 'New releases of Helix Toolbox, Helix Boot, webOS Launcher and Touchdown.',
    site: context.site!,
    items: entries.map(({ tool, release }) => ({
      title: `${tool.name} ${release.tag}${release.name !== release.tag ? `: ${release.name}` : ''}`,
      link: release.url,
      pubDate: new Date(release.date),
      description: release.body.trim() || `${tool.name} ${release.tag} is out.`,
      categories: [tool.name],
    })),
    customData: '<language>en-us</language>',
  });
}
