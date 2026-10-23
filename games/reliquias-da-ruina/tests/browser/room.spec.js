import { test, expect } from '@playwright/test';

async function position(page) {
  return page.locator('#player-position').evaluate(el => ({ x: Number(el.dataset.x), y: Number(el.dataset.y) }));
}
async function move(page, keys, duration) {
  for (const key of keys) await page.keyboard.down(key);
  await page.waitForTimeout(duration);
  for (const key of keys) await page.keyboard.up(key);
}

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
});

test('boots without runtime errors and preserves a 320×180 canvas with integer zoom', async ({ page }) => {
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.reload();
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  const size = await page.locator('canvas').evaluate(c => ({ w: c.width, h: c.height, display: c.getBoundingClientRect().width }));
  expect(size.w).toBe(320); expect(size.h).toBe(180);
  expect(size.display / size.w).toBe(Math.round(size.display / size.w));
  expect(errors).toEqual([]);
});

test('walks in eight directions, then retains facing while idle', async ({ page }) => {
  const directions = [['N', ['w']], ['NE', ['w', 'd']], ['E', ['d']], ['SE', ['s', 'd']], ['S', ['s']], ['SW', ['s', 'a']], ['W', ['a']], ['NW', ['w', 'a']]];
  for (const [facing, keys] of directions) {
    await page.keyboard.press('r', { delay: 60 });
    await move(page, keys, 120);
    await expect(page.locator('#player-facing')).toHaveText(facing);
    await expect(page.locator('#player-state')).toHaveText('IDLE');
  }
});

test('collides with world bounds and altar', async ({ page }) => {
  await move(page, ['d'], 2600);
  expect((await position(page)).x).toBeCloseTo(298, 0);
  await page.keyboard.press('r', { delay: 60 });
  await move(page, ['w'], 1500);
  expect((await position(page)).y).toBeCloseTo(73, 0);
});

test('pause freezes physics, reset returns to spawn, focus loss releases keys', async ({ page }) => {
  await page.keyboard.press('p', { delay: 60 });
  await expect(page.locator('#game-status')).toContainText('PAUSADO');
  const paused = await position(page);
  await move(page, ['d'], 250);
  expect(await position(page)).toEqual(paused);
  await page.keyboard.press('p', { delay: 60 });
  await move(page, ['a'], 150);
  await page.keyboard.press('r', { delay: 60 });
  await expect.poll(() => position(page)).toEqual({ x: 160, y: 116 });
  await page.keyboard.down('d');
  await page.evaluate(() => window.dispatchEvent(new Event('blur')));
  await page.keyboard.up('d');
  await expect(page.locator('#game-status')).toContainText('PAUSADO');
  await page.keyboard.press('p', { delay: 60 });
  await expect(page.locator('#player-state')).toHaveText('IDLE');
});
