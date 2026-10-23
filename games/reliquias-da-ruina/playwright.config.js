import { defineConfig } from '@playwright/test';

// Start a server only inside Codex Cloud, separately. Never auto-start locally.
if (!process.env.GAME_TEST_URL) throw new Error('Defina GAME_TEST_URL com a URL da prévia no executor Cloud.');
export default defineConfig({
  testDir: './tests/browser',
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.GAME_TEST_URL,
    browserName: 'chromium',
    viewport: { width: 1100, height: 900 },
    launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH },
    trace: 'retain-on-failure',
  },
});
