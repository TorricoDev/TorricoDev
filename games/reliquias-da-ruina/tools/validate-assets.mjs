import { readFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { decodeRgba } from './png.mjs';
import { validateSheet } from './asset-validation.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
let count = 0;
for (const name of (await readdir(resolve(root, 'src/assets'))).filter(name => name.endsWith('.json')).sort()) {
  const manifest = JSON.parse(await readFile(resolve(root, 'src/assets', name), 'utf8'));
  // Validate before resolving file paths.
  const { validateManifest } = await import('../src/core/animation-contract.js');
  validateManifest(manifest);
  for (const [action, clip] of Object.entries(manifest.animations)) {
    const image = decodeRgba(await readFile(resolve(root, 'public', clip.file)));
    const result = validateSheet(manifest, action, image);
    count += result.frames;
    console.log(`OK ${name}/${action}: ${result.width}×${result.height}, ${result.frames} quadros`);
  }
}
if (!count) throw new Error('Nenhum spritesheet validado');
console.log(`${count} quadros validados: RGBA, dimensões, margens, alpha e alinhamento.`);
