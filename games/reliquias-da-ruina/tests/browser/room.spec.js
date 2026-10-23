import { test, expect } from '@playwright/test';

const runtimeErrors = new WeakMap();

async function position(page) {
  return page.locator('#player-position').evaluate(el => ({ x: Number(el.dataset.x), y: Number(el.dataset.y) }));
}
async function move(page, keys, duration) {
  for (const key of keys) await page.keyboard.down(key);
  await page.clock.runFor(duration);
  for (const key of keys) await page.keyboard.up(key);
  await page.clock.runFor(32);
}
async function press(page, key) {
  await page.keyboard.down(key);
  await page.clock.runFor(32);
  await page.keyboard.up(key);
  await page.clock.runFor(32);
}
async function reset(page) {
  await press(page, 'r');
  expect(await position(page)).toEqual({ x: 160, y: 116 });
}
async function canvasImage(page) {
  return page.screenshot({ clip: await page.locator('canvas').boundingBox() });
}
async function footImage(page) {
  const canvas = await page.locator('canvas').boundingBox();
  const zoom = canvas.width / 320;
  // At spawn, the 12×8 collider must be directly above the feet (160,116).
  return page.screenshot({ clip: { x: canvas.x + 154 * zoom, y: canvas.y + 108 * zoom, width: 12 * zoom, height: 8 * zoom } });
}

test.beforeEach(async ({ page }) => {
  const errors = [];
  runtimeErrors.set(page, errors);
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => {
    if (message.type() === 'error') errors.push(`${message.text()} (${message.location().url})`);
  });
  await page.clock.install();
  await page.goto('/');
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  await page.clock.pauseAt(await page.evaluate(() => Date.now() + 500));
});

test.afterEach(async ({ page }) => {
  expect(runtimeErrors.get(page)).toEqual([]);
});

test('boots without runtime errors and preserves a 320×180 canvas with integer zoom', async ({ page }, testInfo) => {
  const size = await page.locator('canvas').evaluate(c => ({ w: c.width, h: c.height, display: c.getBoundingClientRect().width }));
  expect(size.w).toBe(320); expect(size.h).toBe(180);
  expect(size.display / size.w).toBe(Math.round(size.display / size.w));
  await testInfo.attach('room-3x.png', { body: await page.screenshot(), contentType: 'image/png' });
});

test('walks in eight directions at normalized speed, then retains facing while idle', async ({ page }, testInfo) => {
  const directions = [['N', ['w'], 0, -1], ['NE', ['w', 'd'], 1, -1], ['E', ['d'], 1, 0], ['SE', ['s', 'd'], 1, 1], ['S', ['s'], 0, 1], ['SW', ['s', 'a'], -1, 1], ['W', ['a'], -1, 0], ['NW', ['w', 'a'], -1, -1]];
  const measurements = [];
  for (const [facing, keys, signX, signY] of directions) {
    await reset(page);
    for (const key of keys) await page.keyboard.down(key);
    await page.clock.runFor(480);
    await expect(page.locator('#player-state')).toHaveText('MOVE');
    await expect(page.locator('#player-facing')).toHaveText(facing);
    const p = await position(page);
    const dx = p.x - 160, dy = p.y - 116;
    expect(Math.sign(dx)).toBe(signX);
    expect(Math.sign(dy)).toBe(signY);
    const distance = Math.hypot(dx, dy);
    expect(distance).toBeGreaterThan(31);
    expect(distance).toBeLessThan(36);
    measurements.push({ facing, dx, dy, distance });
    // Release both keys while the game clock is paused: no intermediate
    // cardinal frame is inserted between diagonal key-up events.
    for (const key of keys) await page.keyboard.up(key);
    await page.clock.runFor(32);
    await expect(page.locator('#player-facing')).toHaveText(facing);
    await expect(page.locator('#player-state')).toHaveText('IDLE');
  }
  const distances = measurements.map(m => m.distance);
  expect(Math.max(...distances) / Math.min(...distances)).toBeLessThan(1.04);
  console.log('Eight-direction displacement:', JSON.stringify(measurements));
  await testInfo.attach('displacement.json', { body: JSON.stringify(measurements, null, 2), contentType: 'application/json' });
});

test('collides with world bounds and altar', async ({ page }) => {
  await move(page, ['d'], 2600);
  expect((await position(page)).x).toBeCloseTo(298, 0);
  await reset(page);
  await move(page, ['w'], 1500);
  expect((await position(page)).y).toBeCloseTo(73, 0);
});

test('pause freezes physics, reset returns to spawn, focus loss releases keys', async ({ page }) => {
  await press(page, 'p');
  await expect(page.locator('#game-status')).toContainText('PAUSADO');
  const paused = await position(page);
  await move(page, ['d'], 250);
  expect(await position(page)).toEqual(paused);
  await press(page, 'p');
  await move(page, ['a'], 150);
  await reset(page);
  await expect.poll(() => position(page)).toEqual({ x: 160, y: 116 });
  await page.keyboard.down('d');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.keyboard.up('d');
  await page.clock.runFor(32);
  await expect(page.locator('#game-status')).toContainText('PAUSADO');
  await press(page, 'p');
  await expect(page.locator('#player-state')).toHaveText('IDLE');
});

test('arrow keys move and opposing keys cancel', async ({ page }) => {
  await move(page, ['ArrowRight', 'ArrowUp'], 240);
  const p = await position(page);
  expect(p.x).toBeGreaterThan(160); expect(p.y).toBeLessThan(116);
  await reset(page);
  await move(page, ['w', 'a', 's', 'd'], 240);
  expect(await position(page)).toEqual({ x: 160, y: 116 });
  await expect(page.locator('#player-state')).toHaveText('IDLE');
});

test('all four walls stop the foot collider', async ({ page }) => {
  await move(page, ['a'], 2600);
  expect((await position(page)).x).toBeCloseTo(22, 0);
  await move(page, ['w'], 2000);
  expect((await position(page)).y).toBeCloseTo(40, 0);
  await reset(page);
  await move(page, ['s'], 1200);
  expect((await position(page)).y).toBeCloseTo(160, 0);
  await reset(page);
  await move(page, ['d'], 2600);
  expect((await position(page)).x).toBeCloseTo(298, 0);
});

test('all five obstacles block the player on approach', async ({ page }) => {
  for (const x of [72, 224]) {
    await reset(page);
    await move(page, ['s'], 472);
    await move(page, [x < 160 ? 'a' : 'd'], Math.round(Math.abs(x - 160) / 72 * 1000));
    await move(page, ['w'], 1500);
    expect((await position(page)).y).toBeCloseTo(142, 0);
  }
  for (const x of [72, 224]) {
    await reset(page);
    await move(page, ['d'], 1667);
    await move(page, ['w'], 1800);
    await move(page, ['a'], Math.round((280 - x) / 72 * 1000));
    await move(page, ['s'], 1000);
    expect((await position(page)).y).toBeCloseTo(55, 0);
  }
  await reset(page);
  await move(page, ['w'], 1500);
  expect((await position(page)).y).toBeCloseTo(73, 0);
});

test('idle and held movement advance visible frames; pause freezes playback', async ({ page }, testInfo) => {
  const idle = await canvasImage(page);
  await page.clock.runFor(260);
  const nextIdle = await canvasImage(page);
  expect(idle.equals(nextIdle)).toBe(false);
  await testInfo.attach('idle-frame.png', { body: nextIdle, contentType: 'image/png' });
  await move(page, ['d'], 2600);
  await page.keyboard.down('d');
  await page.clock.runFor(32);
  const moving = await canvasImage(page);
  await page.clock.runFor(120);
  expect((await position(page)).x).toBeCloseTo(298, 0);
  await expect(page.locator('#player-state')).toHaveText('MOVE');
  const nextMoving = await canvasImage(page);
  expect(moving.equals(nextMoving)).toBe(false);
  await testInfo.attach('move-frame.png', { body: nextMoving, contentType: 'image/png' });
  await press(page, 'p');
  const paused = await canvasImage(page);
  await page.clock.runFor(400);
  expect(paused.equals(await canvasImage(page))).toBe(true);
  await page.keyboard.up('d');
});

test('buttons, Escape, paused reset and collision overlay work', async ({ page }, testInfo) => {
  await move(page, ['a'], 180);
  await page.locator('#pause-button').click();
  await page.clock.runFor(32);
  await expect(page.locator('#game-status')).toContainText('PAUSADO');
  await page.locator('#reset-button').click();
  await page.clock.runFor(32);
  expect(await position(page)).toEqual({ x: 160, y: 116 });
  await expect(page.locator('#player-facing')).toHaveText('S');
  await expect(page.locator('#player-state')).toHaveText('IDLE');
  const hidden = await canvasImage(page);
  const feetWithoutOverlay = await footImage(page);
  await press(page, 'F1');
  const overlay = await canvasImage(page);
  expect(hidden.equals(overlay)).toBe(false);
  expect(feetWithoutOverlay.equals(await footImage(page))).toBe(false);
  await testInfo.attach('foot-collider.png', { body: overlay, contentType: 'image/png' });
  await press(page, 'F1');
  expect(hidden.equals(await canvasImage(page))).toBe(true);
  await press(page, 'Escape');
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  await move(page, ['d'], 180);
  expect((await position(page)).x).toBeGreaterThan(160);
  await page.locator('#reset-button').click();
  await page.clock.runFor(32);
  expect(await position(page)).toEqual({ x: 160, y: 116 });
});

for (const deviceScaleFactor of [1, 2]) {
  test.describe(`DPR ${deviceScaleFactor}`, () => {
    test.use({ deviceScaleFactor });
    test('resizes at integer 1×/2×/3× without smoothing or shrinking', async ({ page }, testInfo) => {
      for (const [width, height, zoom] of [[1100, 900, 3], [800, 700, 2], [400, 500, 1], [280, 400, 1]]) {
        await page.setViewportSize({ width, height });
        await page.clock.runFor(64);
        await expect.poll(() => page.locator('canvas').evaluate(c => c.getBoundingClientRect().width)).toBe(320 * zoom);
        const canvas = await page.locator('canvas').evaluate(c => ({ width: c.width, height: c.height, heightCSS: c.getBoundingClientRect().height, rendering: getComputedStyle(c).imageRendering }));
        expect(canvas.width).toBe(320); expect(canvas.height).toBe(180);
        expect(canvas.heightCSS).toBe(180 * zoom);
        expect(['pixelated', 'crisp-edges']).toContain(canvas.rendering);
        if (width === 400) await testInfo.attach(`room-1x-dpr-${deviceScaleFactor}.png`, { body: await canvasImage(page), contentType: 'image/png' });
      }
    });
  });
}
