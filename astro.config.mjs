import { defineConfig } from 'astro/config';
import sitemap from "@astrojs/sitemap";
import mdx from "@astrojs/mdx";
import lit from "@astrojs/lit";

// https://astro.build/config
export default defineConfig({
  site: 'https://www.consenzaestates.com', // Primary domain (www) for sitemap and canonicals
  trailingSlash: 'never',
  sitemap: true, // Generate sitemap (set to "false" to disable)
  integrations: [sitemap(), mdx(), lit()], // Add renderers to the config
});