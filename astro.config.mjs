import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://helix.helixstack.io',
  trailingSlash: 'ignore',
  build: {
    // Stylesheets as files, so the Content-Security-Policy needs no inline styles
    inlineStylesheets: 'never',
  },
  vite: {
    // Scripts and small assets as files too, for the same reason
    build: { assetsInlineLimit: 0 },
  },
});
