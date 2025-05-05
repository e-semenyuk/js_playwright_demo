const { test, expect } = require('@playwright/test');
const SignInPage = require('./SignInPage');

test.describe('EPMXYZ-5306: Verify error message for empty username field when password is filled', () => {
  let signInPage;

  test.beforeEach(async ({ page }) => {
    signInPage = new SignInPage(page);
    await signInPage.navigate();
  });

  test('should display error message for empty username field', async () => {
    // Leave the Username field empty
    await signInPage.enterUsername('');

    // Enter a valid password
    await signInPage.enterPassword('validPassword');

    // Click the "Sign In" button
    await signInPage.clickSignIn();

    // Verify the error message
    const errorMessage = await signInPage.getErrorMessage();
    expect(errorMessage).toBe('The username is required.');
  });
});