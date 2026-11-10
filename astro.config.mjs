import { defineConfig } from 'astro/config';
import { assertReleaseReady } from './scripts/content-validation.mjs';

assertReleaseReady();

export default defineConfig({
  output: 'static',
  site: process.env.SITE_URL || undefined,
  base: process.env.BASE_PATH || '/',
  devToolbar: { enabled: false },
});
