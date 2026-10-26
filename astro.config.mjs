import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import lit from "@astrojs/lit";
import { isOdysseyDemoPath } from './src/utils/demo-pages.js';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.consenzaestates.com', // Primary domain (www) for sitemap and canonicals
  integrations: [
    sitemap({
      filter: (page) => {
        try {
          const pathname = new URL(page).pathname;
          return !isOdysseyDemoPath(pathname);
        } catch {
          return true;
        }
      },
    }),
    mdx(),
    lit(),
  ],
});