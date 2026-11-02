import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://helixtech.app',
  trailingSlash: 'ignore',
  // No colours in code blocks: they would come as inline styles, which the
  // Content-Security-Policy refuses
  markdown: { syntaxHighlight: false },
  // Every page but the form's landing page and the two standby pages
  integrations: [sitemap({ filter: (page) => !/\/(contact\/(?:sent|subscribed)|coming-soon|maintenance)\/$/.test(page) })],
  build: {
    // Stylesheets as files, so the Content-Security-Policy needs no inline styles
    inlineStylesheets: 'never',
  },
  vite: {
    // Scripts and small assets as files too, for the same reason; and each
    // page's styles in files of their own, so a page loads only what it uses
    build: { assetsInlineLimit: 0, cssCodeSplit: true },
  },
});
