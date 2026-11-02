import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// A post is a Markdown file in src/content/posts; its file name is its address
const posts = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** The summary in the list, in search results and in the feed */
      description: z.string(),
      date: z.coerce.date(),
      categories: z.array(z.string()).min(1),
      /** The thumbnail in the list and the picture at the top of the post */
      image: image(),
      imageAlt: z.string(),
      /** The slug of the Tool the post is about: its colour, and the links at the foot */
      tool: z.string().optional(),
    }),
});

export const collections = { posts };
