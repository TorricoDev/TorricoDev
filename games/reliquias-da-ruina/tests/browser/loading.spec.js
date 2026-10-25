import { test, expect } from './fixtures.js';
import { entryURL, REVIEW_DOCUMENT } from './entry-url.js';

test('scripts, styles and sheets load with no resource or console errors', async ({ page }, testInfo) => {
  const responses = [], errors = [], requests = [];
  page.on('response', response => responses.push({ url: response.url(), status: response.status(), type: response.headers()['content-type'] ?? '' }));
  page.on('request', request => { if (/^https?:/.test(request.url())) requests.push(request.url()); });
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
  await page.goto(entryURL());
  await expect(page.locator('#game-status')).toHaveText('SALA ATIVA');
  expect(errors).toEqual([]);
  expect(responses.filter(response => response.status >= 400)).toEqual([]);
  const rendering = await page.locator('canvas').evaluate(canvas => getComputedStyle(canvas).imageRendering);
  expect(['pixelated', 'crisp-edges']).toContain(rendering);
  if (process.env.GAME_TEST_FILE) {
    expect(await page.evaluate(() => navigator.onLine)).toBe(false);
    expect(await page.locator('script[src], link[rel="stylesheet"], link[rel="modulepreload"]').count()).toBe(0);
    expect(await page.locator('style').count()).toBeGreaterThan(0);
    expect(requests).toEqual([REVIEW_DOCUMENT]); // Fulfilled by the fixture, no network connection.
  } else {
    expect(responses.some(response => /\.js$/.test(new URL(response.url).pathname) && /javascript/.test(response.type))).toBe(true);
    expect(responses.some(response => /\.css$/.test(new URL(response.url).pathname) && /text\/css/.test(response.type))).toBe(true);
    for (const name of ['idle.png', 'move.png']) {
      expect(responses.some(response => new URL(response.url).pathname.endsWith(name) && response.type.includes('image/png') && response.status === 200)).toBe(true);
    }
  }
  await testInfo.attach('loading-network.json', { body: JSON.stringify({ mode: process.env.GAME_TEST_FILE ? 'html-in-memory-offline' : 'vite-http', responses, documentRequests: requests, errors }, null, 2), contentType: 'application/json' });
});
