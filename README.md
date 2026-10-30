# Helix website

The source of [helixtech.app](https://helixtech.app): a static
[Astro](https://astro.build) site with a page for each Helix tool.

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # into dist/
```

Tool details live in `src/data/tools.ts`; screenshots and icons in
`src/assets/tools/`. Release versions are read from GitHub at build time.

## Publishing

Every push to `main`, and a daily run that picks up new releases, builds the
site in GitHub Actions and pushes the result to the `deploy` branch. The
server pulls that branch every two minutes and switches to the new build in
one step, so nothing on it accepts a push.

The pages load no third-party scripts, fonts or images, so the server can
send a strict Content-Security-Policy.

## License

The site's code is MIT licensed. Screenshots and logos belong to their
projects.
