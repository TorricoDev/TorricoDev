import { test, expect } from '../browser/fixtures.js';
import { readFile, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { REVIEW_ORIGIN } from '../browser/entry-url.js';

test('embedded PNGs preserve original bytes and the artifact matches its checksum', async () => {
  const file = resolve(process.env.GAME_TEST_FILE);
  const html = await readFile(file);
  const metadata = JSON.parse(await readFile(resolve(dirname(file), 'metadata.json'), 'utf8'));
  expect(createHash('sha256').update(html).digest('hex')).toBe(metadata.sha256);
  expect(html.byteLength).toBe(metadata.bytes);
  for (const [name, hash] of Object.entries(metadata.assets)) {
    const original = await readFile(resolve('public', name));
    expect(createHash('sha256').update(original).digest('hex')).toBe(hash);
    expect(html.toString()).toContain(`data:image/png;base64,${original.toString('base64')}`);
  }
});

test('a renamed copy supplies both views from memory without supporting files', async ({ page }, testInfo) => {
  const copy = testInfo.outputPath('cópia da revisão.html');
  await copyFile(resolve(process.env.GAME_TEST_FILE), copy);
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  const url = `${REVIEW_ORIGIN}/${encodeURIComponent('cópia da revisão.html')}`;
  const html = await readFile(copy);
  await page.route(`${url}*`, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
  await page.goto(url);
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  await page.getByRole('link', { name: '02 / Laboratório de animações' }).click();
  await expect(page.locator('#lab-status')).toHaveText('REPRODUZINDO');
  expect(new URL(page.url()).searchParams.get('view')).toBe('animations');
  await expect(page.locator('#lab-directions li')).toHaveCount(8);
  await page.getByRole('link', { name: '01 / Sala jogável' }).click();
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  expect(errors).toEqual([]);
});
