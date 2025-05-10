import { test, expect } from '../../../src/fixtures/test-fixtures';
import { BasePage } from '../../../src/page-objects/base-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Login Functionality', () => {
  let page: BasePage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new BasePage(browserPage);
    await page.goto('/login');
  });

  // EPMXYZ-5248: Verify that the Sign-in form is displayed on the login page load
  test('should display the Sign-in form on the login page load', async () => {
    logInfo('Starting test to verify the Sign-in form display on the login page load');

    // Verify the presence of the Sign-in form
    const isSignInFormVisible = await page.isVisible('[data-test="sign-in-form"]');
    expect(isSignInFormVisible).toBeTruthy();
  });

  test('should successfully login with valid credentials', async () => {
    logInfo('Starting login test with valid credentials');

    // Fill in login form
    await page.fill('[data-test="username"]', process.env.TEST_USERNAME || 'test-user');
    await page.fill('[data-test="password"]', process.env.TEST_PASSWORD || 'test-password');
    
    // Click login button
    await page.waitForNavigation(async () => {
      await page.click('[data-test="login-button"]');
    });

    // Verify successful login
    const dashboardTitle = await page.getText('h1');
    expect(dashboardTitle).toContain('Dashboard');

    // Verify user is logged in
    const isProfileVisible = await page.isVisible('[data-test="user-profile"]');
    expect(isProfileVisible).toBeTruthy();
  });

  test('should show error message with invalid credentials', async () => {
    logInfo('Starting login test with invalid credentials');

    // Fill in login form with invalid credentials
    await page.fill('[data-test="username"]', 'invalid-user');
    await page.fill('[data-test="password"]', 'invalid-password');
    
    // Click login button
    await page.click('[data-test="login-button"]');

    // Verify error message
    const errorMessage = await page.getText('[data-test="error-message"]');
    expect(errorMessage).toContain('Invalid username or password');
  });
});