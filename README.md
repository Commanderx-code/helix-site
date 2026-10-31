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

## Standby pages

Two pages stand in for the site and are built with it, linked from nowhere
and kept out of search.

`/coming-soon/` announces something that is not out yet. Its words, and the
instant it counts down to, are in `src/data/soon.ts`; without a date it
says so instead of counting.

`/maintenance/` is what the server shows while the site is being worked on.
The switch is a file on the VPS: while `/srv/helix/MAINTENANCE` exists,
Caddy answers every page with it and a 503. Put a date in the file and the
page counts down to it:

```sh
echo 2026-11-01T03:00:00Z | sudo tee /srv/helix/MAINTENANCE   # on, back at that time
sudo touch /srv/helix/MAINTENANCE                              # on, no time given
sudo rm /srv/helix/MAINTENANCE                                 # off
```

No reload either way. The Caddyfile block that does this lives with the
server's config in the homelab repository.

## Checks

Two more workflows watch the site. Quality runs Lighthouse on every push and
pull request, once as a desktop and once as a phone on a slow connection,
against the thresholds in `lighthouserc.json` and `lighthouserc.mobile.json`,
and keeps both sets of reports as an artifact. Check links runs weekly: it builds the site, follows
every link on every page, local and external, and opens an issue labelled
"broken links" (or adds to the open one) when something stops answering.
Both can also be started by hand from the Actions tab.

Visitor numbers come from the server's access log, read by GoAccess on the
VPS; the site itself runs no analytics.

## License

The site's code is MIT licensed. Screenshots and logos belong to their
projects.
