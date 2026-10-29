import { build } from 'esbuild';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { createRequire } from 'node:module';

// Render the real React routes at build time. No crawler-only or hidden SEO copy.
process.env.NODE_ENV = 'production';
const require = createRequire(import.meta.url);
const bundlePath = resolve('node_modules/.cache/aethersync-prerender.cjs');
await mkdir(dirname(bundlePath), { recursive: true });
try {
  await build({ entryPoints: ['src/entry-prerender.tsx'], outfile: bundlePath, bundle: true, platform: 'node', format: 'cjs', jsx: 'automatic', external: ['react', 'react-dom', 'react-dom/*', 'react-router-dom', 'react-router-dom/*'], loader: { '.css': 'empty' }, define: { 'process.env.NODE_ENV': '"production"' } });
  const { renderPage, getSeo, publicPaths, SITE_URL } = require(bundlePath);
  const template = await readFile('dist/index.html', 'utf8');
  if (!template.includes('<!--seo:start-->') || !template.includes('<div id="root"></div>')) throw new Error('Prerender template markers are missing.');
  const escape = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  for (const path of [...publicPaths, '/404']) {
    const seo = getSeo(path);
    const tags = [
      `<title>${escape(seo.title)}</title>`,
      `<link rel="canonical" href="${escape(seo.canonical)}" />`,
      ...Object.entries({ description: seo.description, robots: seo.robots, 'twitter:card': 'summary_large_image', 'twitter:title': seo.title, 'twitter:description': seo.description, 'twitter:image': `${SITE_URL}/og-image.png`, 'twitter:image:alt': 'Aethersync — Intelligent software. In your hands.' }).map(([name, content]) => `<meta name="${name}" content="${escape(content)}" />`),
      ...Object.entries({ 'og:type': 'website', 'og:site_name': 'Aethersync', 'og:title': seo.title, 'og:description': seo.description, 'og:url': seo.canonical, 'og:image': `${SITE_URL}/og-image.png`, 'og:image:alt': 'Aethersync — Intelligent software. In your hands.', 'og:locale': 'en_US' }).map(([property, content]) => `<meta property="${property}" content="${escape(content)}" />`),
      `<script id="site-schema" type="application/ld+json">${JSON.stringify(seo.graph).replace(/</g, '\\u003c')}</script>`,
    ].join('\n    ');
    const html = template.replace(/<!--seo:start-->[\s\S]*?<!--seo:end-->/, `<!--seo:start-->\n    ${tags}\n    <!--seo:end-->`).replace('<div id="root"></div>', () => `<div id="root" data-prerendered="true">${renderPage(path)}</div>`);
    const file = resolve('dist', path === '/' ? 'index.html' : `${path.slice(1)}.html`);
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${publicPaths.map(path => `  <url><loc>${SITE_URL}${path}</loc></url>`).join('\n')}\n</urlset>\n`;
  await writeFile('dist/sitemap.xml', sitemap);
  console.log(`Prerendered ${publicPaths.length} indexable pages and a noindex 404 page for ${SITE_URL}.`);
} finally {
  await rm(bundlePath, { force: true });
}
