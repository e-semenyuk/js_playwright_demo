import { defineConfig, devices } from '@playwright/test';
import path from 'path';

export default defineConfig({
  testDir: '../tests',
  outputDir: '../reports',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: '../reports/html-report' }],
    ['list']
  ],
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  projects: [
    {
      name: 'e2e-chromium',
      testMatch: /.*e2e.*\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'e2e-firefox',
      testMatch: /.*e2e.*\.spec\.ts/,
      use: { ...devices['Desktop Firefox'] }
    },
    {
      name: 'api',
      testMatch: /.*api.*\.spec\.ts/,
      use: { }
    }
  ],
  // Look for environment config file
  globalSetup: path.resolve(__dirname, './environments.config.ts')
});