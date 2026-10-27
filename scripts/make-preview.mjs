import { build } from 'esbuild';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { resolve, extname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const assets = new Map();
const types = { '.jpg': 'image/jpeg', '.png': 'image/png', '.gif': 'image/gif', '.ttf': 'font/ttf', '.woff2': 'font/woff2', '.svg': 'image/svg+xml', '.mp4': 'video/mp4' };
function collect(directory, prefix = '') {
  for (const file of readdirSync(directory, { withFileTypes: true })) {
    const path = resolve(directory, file.name);
    const key = prefix + '/' + file.name;
    if (file.isDirectory()) collect(path, key);
    else if (types[extname(file.name)]) assets.set(key, 'data:' + types[extname(file.name)] + ';base64,' + readFileSync(path).toString('base64'));
  }
}
collect(resolve(root, 'public'));
const output = await build({
  stdin: {
    contents: `import React from 'react'; import {createRoot} from 'react-dom/client'; import {HashRouter} from 'react-router-dom'; import App from './src/App'; createRoot(document.getElementById('root')).render(React.createElement(HashRouter, null, React.createElement(App)));`,
    resolveDir: root,
    sourcefile: 'offline-preview.tsx',
    loader: 'tsx',
  },
  bundle: true,
  write: false,
  format: 'iife',
  minify: true,
  define: { 'process.env.NODE_ENV': '"production"' },
});
let script = output.outputFiles[0].text;
let css = [
  readFileSync(resolve(root, 'src/index.css'), 'utf8'),
  readFileSync(resolve(root, 'src/motion.css'), 'utf8'),
  readFileSync(resolve(root, 'src/hero.css'), 'utf8'),
  readFileSync(resolve(root, 'src/pages.css'), 'utf8'),
  readFileSync(resolve(root, 'src/storytelling.css'), 'utf8'),
].join('\n');
for (const [path, data] of assets) {
  script = script.replaceAll(JSON.stringify(path), JSON.stringify(data));
  css = css.replaceAll("'" + path + "'", "'" + data + "'");
}
const html = '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Aethersync offline preview"><meta name="theme-color" content="#f8f5ec"><title>Aethersync — offline preview</title><style>' + css + '</style></head><body><div id="root"></div><script>' + script.replaceAll('</script', '<\\/script') + '</script></body></html>';
const destination = resolve(root, 'preview.html');
writeFileSync(destination, html);
console.log('Created ' + destination + ' (' + (Buffer.byteLength(html) / 1024 / 1024).toFixed(1) + ' MB).');
console.log('Open preview.html directly in a browser. Fonts, images, routes and interactions are embedded; no server is needed.');
