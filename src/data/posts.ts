import { getCollection } from 'astro:content';

/** Every post, newest first */
export const allPosts = async () =>
  (await getCollection('posts')).sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

export const postDate = (date: Date) =>
  date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });

/** At the 200 words a minute people read on a screen */
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.trim().split(/\s+/).length / 200));
