import { test, expect } from '@playwright/test';

test.use({ viewport: { width: 1100, height: 1200 } });
const errorsByPage = new WeakMap();
const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];

async function frames(page) {
  return page.locator('#lab-directions output').evaluateAll(elements => elements.map(el => Number(el.dataset.frameIndex)));
}
async function canvasImage(page) {
  await page.locator('canvas').scrollIntoViewIfNeeded();
  return page.screenshot({ clip: await page.locator('canvas').boundingBox() });
}
async function paused(page) {
  if (await page.locator('#lab-status').textContent() === 'REPRODUZINDO') await page.getByRole('button', { name: 'Pausar', exact: true }).click();
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  errorsByPage.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(`${message.text()} (${message.location().url})`); });
  await page.clock.install();
  await page.goto('/?view=animations');
  await expect(page.locator('#lab-status')).toHaveText('REPRODUZINDO');
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 500));
});
test.afterEach(async ({ page }) => { expect(errorsByPage.get(page)).toEqual([]); });

test('catalog loads the shared actor, metadata and eight real directional animations', async ({ page }, testInfo) => {
  await expect(page.locator('#room-view')).toBeHidden();
  await expect(page.getByRole('link', { name: '02 / Laboratório de animações' })).toHaveAttribute('aria-current', 'page');
  await expect(page.getByLabel('Personagem', { exact: true })).toHaveValue('traveler-placeholder');
  await page.getByLabel('Personagem', { exact: true }).selectOption('traveler-placeholder');
  await expect(page.getByLabel('Animação', { exact: true })).toHaveValue('idle');
  await expect(page.locator('#lab-cell')).toHaveText('48 × 48 px');
  await expect(page.locator('#lab-sheet')).toHaveText('96 × 240 px');
  await expect(page.locator('#lab-fps')).toHaveText('4 original · 4 efetivo');
  await expect(page.locator('#lab-alpha')).toHaveText('RGBA · alpha 0 / 255');
  const entries = page.locator('#lab-directions li');
  await expect(entries).toHaveCount(8);
  expect(await entries.evaluateAll(items => items.map(item => item.dataset.direction))).toEqual(directions);
  for (const [target, source] of [['NW', 'NE'], ['W', 'E'], ['SW', 'SE']]) {
    const sample = page.locator(`[data-direction="${target}"] output`);
    await expect(sample).toHaveAttribute('data-flip-x', 'true');
    await expect(sample).toHaveAttribute('data-animation-key', `traveler-placeholder:idle:${source}`);
  }
  for (const direction of ['N', 'NE', 'E', 'SE', 'S']) await expect(page.locator(`[data-direction="${direction}"] output`)).toHaveAttribute('data-flip-x', 'false');
  await testInfo.attach('lab-overview-3x.png', { body: await page.screenshot({ fullPage: true }), contentType: 'image/png' });
});

test('pause, resume, bidirectional stepping and timeline select actual sheet frames', async ({ page }, testInfo) => {
  await page.getByLabel('Animação', { exact: true }).selectOption('move');
  await paused(page);
  expect(await frames(page)).toEqual(Array(8).fill(0));
  const image = await canvasImage(page);
  await page.clock.runFor(320);
  expect(await frames(page)).toEqual(Array(8).fill(0));
  expect(image.equals(await canvasImage(page))).toBe(true);
  for (const index of [1, 2, 3, 0]) {
    await page.getByRole('button', { name: 'Próximo quadro' }).click();
    expect(await frames(page)).toEqual(Array(8).fill(index));
    await expect(page.locator('#lab-status')).toHaveText('PAUSADO');
  }
  await page.getByRole('button', { name: 'Quadro anterior' }).click();
  expect(await frames(page)).toEqual(Array(8).fill(3));
  await page.locator('#lab-frame').focus();
  await page.keyboard.press('Home');
  await page.keyboard.press('ArrowRight');
  await page.keyboard.press('ArrowRight');
  expect(await frames(page)).toEqual(Array(8).fill(2));
  const starts = [0, 4, 8, 12, 16, 12, 8, 4];
  for (const [index, direction] of directions.entries()) await expect(page.locator(`[data-direction="${direction}"] output`)).toHaveAttribute('data-texture-frame', String(starts[index] + 2));
  await page.clock.runFor(32);
  await testInfo.attach('lab-move-frame-3.png', { body: await canvasImage(page), contentType: 'image/png' });
  await page.getByRole('button', { name: 'Reproduzir', exact: true }).click();
  await page.clock.runFor(150);
  expect(await frames(page)).not.toEqual(Array(8).fill(2));
  await paused(page);
  await page.getByLabel('Animação', { exact: true }).selectOption('idle');
  await page.clock.runFor(300);
  expect(await frames(page)).toEqual(Array(8).fill(0));
  await expect(page.locator('#lab-status')).toHaveText('PAUSADO');
  await expect(page.locator('#lab-frames')).toHaveText('2 por direção · loop');
});

test('playback speed changes observed frames without changing the original FPS', async ({ page }) => {
  const results = [];
  for (const speed of ['0.25', '2']) {
    await page.getByLabel('Velocidade').selectOption(speed);
    await page.getByLabel('Animação', { exact: true }).selectOption('idle');
    await page.getByLabel('Animação', { exact: true }).selectOption('move');
    await page.clock.runFor(160);
    const current = await frames(page);
    expect(new Set(current).size).toBe(1);
    results.push(current[0]);
    await expect(page.locator('#lab-fps')).toHaveText(`10 original · ${10 * Number(speed)} efetivo`);
    await expect(page.locator('#lab-sheet')).toHaveText('192 × 240 px');
  }
  expect(results[0]).toBe(0);
  expect(results[1]).toBeGreaterThan(0);
  await page.getByLabel('Velocidade').selectOption('1');
  await expect(page.locator('#lab-fps')).toHaveText('10 original · 10 efetivo');
});

test('grid, pivot, baseline, hitbox and three backgrounds change rendered pixels', async ({ page }, testInfo) => {
  await paused(page);
  for (const name of ['Grade de 8 px', 'Pivô', 'Baseline', 'Hitbox']) {
    const before = await canvasImage(page);
    const checkbox = page.getByRole('checkbox', { name, exact: true });
    const checked = await checkbox.isChecked();
    await checkbox.setChecked(!checked);
    await page.clock.runFor(32);
    expect(before.equals(await canvasImage(page))).toBe(false);
    await checkbox.setChecked(checked);
    await page.clock.runFor(32);
    expect(before.equals(await canvasImage(page))).toBe(true);
  }
  for (const name of ['Grade de 8 px', 'Pivô', 'Baseline', 'Hitbox']) await page.getByRole('checkbox', { name, exact: true }).check();
  const images = [];
  for (const background of ['dark', 'light', 'checker']) {
    await page.getByLabel('Fundo', { exact: true }).selectOption(background);
    await page.clock.runFor(32);
    images.push(await canvasImage(page));
    await testInfo.attach(`lab-guides-${background}.png`, { body: images.at(-1), contentType: 'image/png' });
  }
  expect(images[0].equals(images[1])).toBe(false);
  expect(images[1].equals(images[2])).toBe(false);
  await expect(page.locator('#lab-body')).toHaveText('12 × 8 px · offset 18, 32');
});

test('all zoom values 1×–8× preserve logical resolution and allow scrolling', async ({ page }) => {
  await page.locator('#lab-zoom').focus();
  await page.keyboard.press('Home');
  for (let zoom = 1; zoom <= 8; zoom++) {
    await expect.poll(() => page.locator('canvas').evaluate(canvas => canvas.getBoundingClientRect().width)).toBe(320 * zoom);
    await expect(page.locator('#lab-zoom-label')).toHaveText(`${zoom}×`);
    if (zoom < 8) await page.keyboard.press('ArrowRight');
  }
  const size = await page.locator('canvas').evaluate(canvas => ({ width: canvas.width, height: canvas.height, cssHeight: canvas.getBoundingClientRect().height, rendering: getComputedStyle(canvas).imageRendering }));
  expect(size).toMatchObject({ width: 320, height: 180, cssHeight: 1440 });
  expect(['pixelated', 'crisp-edges']).toContain(size.rendering);
  expect(await page.locator('#lab-viewport').evaluate(el => el.scrollWidth > el.clientWidth && el.scrollHeight > el.clientHeight)).toBe(true);
  await page.setViewportSize({ width: 700, height: 650 });
  await page.clock.runFor(32);
  await expect(page.locator('#lab-zoom-label')).toHaveText('8×');
  expect(await page.locator('canvas').evaluate(canvas => canvas.getBoundingClientRect().width)).toBe(2560);
});

test('navigation returns to a playable room and reopens an independent laboratory', async ({ page }) => {
  await page.clock.resume();
  await page.getByRole('link', { name: '01 / Sala jogável' }).click();
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  await expect(page.locator('#animation-lab')).toBeHidden();
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 500));
  await page.keyboard.down('d');
  await page.clock.runFor(180);
  await page.keyboard.up('d');
  expect(Number(await page.locator('#player-position').getAttribute('data-x'))).toBeGreaterThan(160);
  await page.clock.resume();
  await page.getByRole('link', { name: '02 / Laboratório de animações' }).click();
  await expect(page.locator('#lab-status')).toHaveText('REPRODUZINDO');
  await expect(page.locator('#room-view')).toBeHidden();
});

test.describe('small screen and DPR 2', () => {
  test.use({ viewport: { width: 400, height: 800 }, deviceScaleFactor: 2 });
  test('1× retains eight directions and sharp pixels', async ({ page }, testInfo) => {
    await page.locator('#lab-zoom').focus();
    await page.keyboard.press('Home');
    await page.clock.runFor(32);
    expect(await page.locator('canvas').evaluate(c => c.getBoundingClientRect().width)).toBe(320);
    await expect(page.locator('#lab-directions li')).toHaveCount(8);
    const picture = await canvasImage(page);
    expect(picture.readUInt32BE(16)).toBe(640);
    expect(picture.readUInt32BE(20)).toBe(360);
    await testInfo.attach('lab-1x-dpr-2.png', { body: picture, contentType: 'image/png' });
  });
});
