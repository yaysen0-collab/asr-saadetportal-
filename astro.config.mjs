import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  build: {
    // Keep the existing .html URLs so old links and Google canonicals stay valid.
    format: 'file',
  },
  trailingSlash: 'never',
});
