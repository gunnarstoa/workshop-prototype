import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
  preprocess: vitePreprocess(),
  kit: {
    adapter: adapter({
      fallback: '404.html'
    }),
    paths: {
      base: process.env.GITHUB_ACTIONS ? '/workshop-prototype' : ''
    },
    prerender: {
      handleHttpError: 'warn'
    }
  }
};

export default config;
