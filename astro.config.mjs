// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// Sitio estático desplegado en GitHub Pages (project page).
export default defineConfig({
  site: 'https://pcornejov.github.io',
  base: '/Keiji',
  integrations: [react()],
});
