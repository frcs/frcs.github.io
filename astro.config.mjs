// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

/**
 * Vite plugin to ensure case-insensitive redirection during local development
 * @returns {import('vite').Plugin}
 */
function caseInsensitiveDevPlugin() {
  return {
    name: 'case-insensitive-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (req.url) {
          const [pathname, search] = req.url.split('?');
          // Only inspect routes, skip internal Vite/Astro assets
          if (
            !pathname.startsWith('/@') &&
            !pathname.startsWith('/_astro') &&
            !pathname.startsWith('/_image') &&
            !pathname.startsWith('/node_modules') &&
            !pathname.startsWith('/src') &&
            !pathname.includes('.')
          ) {
            const lower = pathname.toLowerCase();
            if (pathname !== lower) {
              const target = lower + (search ? `?${search}` : '');
              res.writeHead(302, { Location: target });
              res.end();
              return;
            }
          }
        }
        next();
      });
    }
  };
}

// https://astro.build/config
export default defineConfig({
  site: 'https://francois.pitie.net',
  base: '/',
  redirects: {
    '/grants': '/grants-impact',
    '/teaching/4c16-teaching': '/teaching/4c16',
    '/teaching/5c34-teaching': '/teaching/5c34'
  },
  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex]
  },
  vite: {
    plugins: [tailwindcss(), caseInsensitiveDevPlugin()],
    server: {
      watch: {
        usePolling: true
      }
    }
  }
});
