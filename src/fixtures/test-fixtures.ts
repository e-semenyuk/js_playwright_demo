import { test as base, APIRequestContext, Page } from '@playwright/test';
import { UsersApiClient } from '../api-clients/users-api';
import { logInfo } from '../utils/logger';

// Extend basic test fixtures
export type TestFixtures = {
  apiContext: APIRequestContext;
  usersApi: UsersApiClient;
};

// Create custom test with extended fixtures
export const test = base.extend<TestFixtures>({
  // API context fixture
  apiContext: async ({ playwright }, use) => {
    logInfo('Setting up API context');
    const context = await playwright.request.newContext({
      baseURL: process.env.API_URL,
      extraHTTPHeaders: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });

    await use(context);

    // Cleanup
    await context.dispose();
  },

  // Users API client fixture
  usersApi: async ({ apiContext }, use) => {
    logInfo('Setting up Users API client');
    const client = new UsersApiClient(apiContext);
    await use(client);
  },
});

// Export assertions
export const expect = test.expect;

/**
 * Common test hooks
 */
export const commonHooks = {
  beforeEach: async ({ page }: { page: Page }) => {
    if (page) {
      // Set viewport size
      await page.setViewportSize({ width: 1920, height: 1080 });
      
      // Set default timeout
      page.setDefaultTimeout(30000);
      
      logInfo('Common test setup completed');
    }
  },

  afterEach: async ({ page }: { page: Page }) => {
    if (page) {
      // Add any cleanup steps here
      logInfo('Test cleanup completed');
    }
  }
};

// Helper function to generate test data
export const generateTestData = {
  uniqueEmail: () => `test-${Date.now()}@example.com`,
  uniqueUsername: () => `user-${Date.now()}`,
  randomString: (length: number) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
};