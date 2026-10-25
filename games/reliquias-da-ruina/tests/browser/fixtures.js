import { test as base } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { REVIEW_DOCUMENT } from './entry-url.js';

export { expect } from '@playwright/test';
export const test = base.extend({
  page: async ({ page }, use) => {
    if (process.env.GAME_TEST_FILE) {
      const html = await readFile(resolve(process.env.GAME_TEST_FILE));
      await page.route(`${REVIEW_DOCUMENT}*`, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    }
    await use(page);
  },
});
