// The icons a phone's home screen uses for a saved page, named in
// manifest.webmanifest: the favicon at 192 and 512 pixels, and a "maskable"
// one with the mark drawn smaller on its own navy, so a launcher that crops
// icons to a circle keeps the whole helix
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { APIRoute } from 'astro';
import { Resvg } from '@resvg/resvg-js';

const sizes = { '192': [192, false], '512': [512, false], '512-maskable': [512, true] } as const;

export function getStaticPaths() {
  return Object.keys(sizes).map((spec) => ({ params: { spec } }));
}

export const GET: APIRoute = async ({ params }) => {
  const [size, maskable] = sizes[params.spec as keyof typeof sizes];
  let svg = await readFile(path.join(process.cwd(), 'public/favicon.svg'), 'utf8');
  if (maskable) {
    // The favicon's drawing inside a wider frame: 64 units of mark in 80
    const inner = svg.replace(/^[\s\S]*?<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80"><g transform="translate(8 8)">${inner}</g></svg>`;
  }
  const png = new Resvg(svg, { background: '#0d0f2c', fitTo: { mode: 'width', value: size } }).render().asPng();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
