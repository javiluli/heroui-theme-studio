import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, type Plugin } from 'vite';

function searchMetadata(): Plugin {
  const domain = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const configuredUrl = process.env.SITE_URL || (domain && `https://${domain}`);
  const home = configuredUrl ? new URL(configuredUrl) : undefined;
  if (home && home.protocol !== 'https:') {
    throw new Error('SITE_URL must be an HTTPS URL.');
  }
  const canonical = home ? `${home.origin}/` : undefined;

  return {
    name: 'studio-search-metadata',
    apply: 'build',
    transformIndexHtml() {
      return canonical ? [
        { tag: 'link', attrs: { rel: 'canonical', href: canonical } },
        { tag: 'meta', attrs: { property: 'og:url', content: canonical } },
      ] : [];
    },
    generateBundle() {
      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: `User-agent: *\nAllow: /\n${canonical ? `Sitemap: ${canonical}sitemap.xml\n` : ''}`,
      });
      if (canonical) {
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${canonical}</loc></url></urlset>\n`,
        });
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), searchMetadata()],
  // WebLLM is an ESM package loaded lazily by the AI panel. Exclude it from
  // Vite's dev dependency pre-bundle to avoid stale /node_modules/.vite/deps/
  // URLs after dependency optimization/restarts. The production build is unchanged.
  optimizeDeps: {
    exclude: ['@mlc-ai/web-llm'],
  },
});
