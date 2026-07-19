import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  // Workers set to 1 (serial execution) instead of Playwright's default parallelism.
  // This API testing suite shares real backend state across test files (e.g. account
  // data, cards), since there's no way to create isolated test data per run.
  // Running in parallel caused race conditions between files targeting the same account.
  // Trade-off: slower suite execution, prioritizing reliability over speed for this
  // project's scale.
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'https://homebanking-demo.onrender.com',
    extraHTTPHeaders: {
      'Content-Type': 'application/json',
    },
  },
});