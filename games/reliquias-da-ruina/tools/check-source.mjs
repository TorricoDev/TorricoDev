import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
async function collect(directory) {
  const files = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory()) files.push(...await collect(resolve(directory, entry.name)));
    else if (/\.(js|mjs)$/.test(entry.name)) files.push(resolve(directory, entry.name));
  }
  return files;
}
const files = [resolve(root, 'vite.config.js'), resolve(root, 'playwright.config.js')];
for (const directory of ['src', 'tools', 'tests']) files.push(...await collect(resolve(root, directory)));
for (const file of files.sort()) {
  const result = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
  if (result.status !== 0) { console.error(result.stderr || result.error); process.exit(1); }
}
console.log(`${files.length} arquivos JavaScript verificados sintaticamente.`);
