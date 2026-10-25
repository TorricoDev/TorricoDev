import { build } from 'vite';
import { readFile, readdir, mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { Script } from 'node:vm';
import viteConfig from '../vite.config.js';
import { validateManifest } from '../src/core/animation-contract.js';
import { assembleReviewHtml } from './review-html.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const embedded = {};
const assetHashes = {};
const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
for (const name of (await readdir(resolve(root, 'src/assets'))).filter(name => name.endsWith('.json')).sort()) {
  const manifest = validateManifest(JSON.parse(await readFile(resolve(root, 'src/assets', name), 'utf8')));
  for (const { file } of Object.values(manifest.animations)) {
    const bytes = await readFile(resolve(root, 'public', file));
    embedded[file] = `data:image/png;base64,${bytes.toString('base64')}`;
    assetHashes[file] = sha256(bytes);
  }
}

// Use Vite's existing compiler with a single classic-script entry. The normal
// Vite configuration/build is not changed and dist/ is neither read nor erased.
const result = await build({
  ...viteConfig,
  root,
  configFile: false,
  mode: 'review',
  publicDir: false,
  define: { 'import.meta.env.REVIEW_ASSETS': JSON.stringify(embedded) },
  build: {
    ...viteConfig.build,
    write: false,
    lib: { entry: resolve(root, 'src/main.js'), name: 'ReliquiasReview', formats: ['iife'] },
    rollupOptions: { output: { inlineDynamicImports: true } },
    cssCodeSplit: false,
    sourcemap: false,
    minify: 'esbuild',
  },
});
const output = (Array.isArray(result) ? result : [result]).flatMap(result => result.output);
const chunks = output.filter(file => file.type === 'chunk');
if (chunks.length !== 1 || !chunks[0].isEntry) throw new Error('A revisão requer um único script');
const styles = output.filter(file => file.type === 'asset' && file.fileName.endsWith('.css'));
if (output.length !== chunks.length + styles.length) throw new Error('Recurso não incorporado no HTML de revisão');
new Script(chunks[0].code); // Reject unresolved module imports before writing.
const notices = await Promise.all(['phaser/LICENSE.md', 'eventemitter3/LICENSE'].map(file => readFile(resolve(root, 'node_modules', file), 'utf8')));
const html = assembleReviewHtml(
  await readFile(resolve(root, 'index.html'), 'utf8'),
  chunks[0].code,
  styles.map(file => file.source.toString()).join('\n'),
  notices.join('\n\n'),
);
const directory = resolve(root, 'dist-review');
await mkdir(directory, { recursive: true });
await writeFile(resolve(directory, 'reliquias-da-ruina.html'), html);
await writeFile(resolve(directory, 'metadata.json'), JSON.stringify({
  format: 'html-with-inline-iife-css-and-png',
  bytes: Buffer.byteLength(html),
  sha256: sha256(html),
  assets: assetHashes,
}, null, 2) + '\n');
console.log(`Revisão local: dist-review/reliquias-da-ruina.html (${Buffer.byteLength(html)} bytes)`);
console.log(`SHA-256: ${sha256(html)}`);
