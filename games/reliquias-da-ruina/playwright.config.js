import { defineConfig } from '@playwright/test';

// Start servers/browsers only in the remote executor. The file target runs
// via an in-memory document, without network, using the same regression suite.
// The managed Chromium blocks direct file:// navigation; do not bypass policy.
const reviewFile = process.env.GAME_TEST_FILE;
if (!process.env.GAME_TEST_URL && !reviewFile) throw new Error('Defina GAME_TEST_URL ou GAME_TEST_FILE no executor Cloud.');
if (process.env.GAME_TEST_URL && reviewFile) throw new Error('Escolha apenas um destino de teste');
export default defineConfig({
  testDir: reviewFile ? './tests' : './tests/browser',
  testMatch: '**/*.spec.js',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.GAME_TEST_URL,
    offline: Boolean(reviewFile),
    browserName: 'chromium',
    viewport: { width: 1100, height: 900 },
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    trace: 'retain-on-failure',
  },
});
