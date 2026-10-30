import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://helixtech.app',
  trailingSlash: 'ignore',
  // Every page but the form's landing page
  integrations: [sitemap({ filter: (page) => !page.includes('/contact/sent/') })],
  build: {
    // Stylesheets as files, so the Content-Security-Policy needs no inline styles
    inlineStylesheets: 'never',
  },
  vite: {
    // Scripts and small assets as files too, for the same reason; and all of
    // a page's styles in one file, so one request instead of five
    build: { assetsInlineLimit: 0, cssCodeSplit: false },
  },
});
