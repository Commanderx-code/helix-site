# Helix website

The source of [helixtech.app](https://helixtech.app): a static
[Astro](https://astro.build) site with a page for each Helix tool.

```sh
npm ci
npm run dev       # http://localhost:4321
npm run build     # into dist/
```

Tool details live in `src/data/tools.ts`; screenshots and icons in
`src/assets/tools/`. Release versions are read from GitHub at build time;
a `GITHUB_TOKEN` in `.env` keeps the dev server within the API limits.

Each page's share picture (the `og:image` under `/og/`) is drawn at build
time by `src/og/card.ts` from the site's own fonts and logo. The "What's new"
page and `/feed.xml` list the tools' releases, read from GitHub like the
versions. `@astrojs/sitemap` writes the sitemap; `public/robots.txt` points
to it.

The contact form posts to [Web3Forms](https://web3forms.com). Its access
key, which is public by design, comes from `PUBLIC_WEB3FORMS_KEY`: in `.env`
locally and in a repository variable of the same name for the build. Without
it the page offers the email address instead of a form.

## Publishing

Every push to `main`, and a daily run that picks up new releases, builds the
site in GitHub Actions and pushes the result to the `deploy` branch. The
server pulls that branch every two minutes and switches to the new build in
one step, so nothing on it accepts a push.

The pages load no third-party scripts, fonts or images, so the server can
send a strict Content-Security-Policy. The one outside address is the form's
target, so `form-action` must allow `https://api.web3forms.com`.

## License

The site's code is MIT licensed. Screenshots and logos belong to their
projects.
