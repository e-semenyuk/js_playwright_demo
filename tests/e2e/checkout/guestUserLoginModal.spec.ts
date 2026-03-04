import { test, expect } from '../../../src/fixtures/test-fixtures';
import { ProductPage } from '../../../src/page-objects/product-page';
import { LoginModalPage } from '../../../src/page-objects/login-modal-page';
import { logInfo } from '../../../src/utils/logger';

/**
 * Test Suite: Guest User Login Modal at Checkout
 *
 * Jira Story:    XPANBFLFA-60 – Guest User Redirect to Login at Checkout
 * Jira Test:     XPANBFLFA-61 – Guest user triggers login modal when tapping "Buy Now" without authentication
 * Test Condition: TC-1 – Guest user taps "Buy Now" and login modal appears
 *
 * Objective:
 * Verify that the system correctly detects a guest user's unauthenticated state
 * when they attempt to check out, intercepts the checkout action, and displays a
 * login/sign-up modal with appropriate options, ensuring that unauthenticated
 * users cannot proceed to checkout without authentication.
 */
test.describe('Guest User Checkout - Login Modal', () => {
  let productPage: ProductPage;
  let loginModalPage: LoginModalPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    loginModalPage = new LoginModalPage(page);

    // Navigate to a product page as a guest (no authentication)
    // Storage is clear by default in a new Playwright browser context
    await productPage.goto('/products/PROD-12345');
  });

  // XPANBFLFA-61
  test('should display login modal when guest user taps Buy Now', async ({ page }) => {
    logInfo('XPANBFLFA-61: Starting test – Guest user triggers login modal on Buy Now');

    // Step 1: Verify user is a guest (no profile indicator visible)
    const isAuthenticated = await productPage.isUserAuthenticated();
    expect(isAuthenticated, 'User should not be authenticated before test starts').toBeFalsy();

    // Step 2: Verify product page has loaded and "Buy Now" button is present
    const isBuyNowVisible = await productPage.isBuyNowButtonVisible();
    expect(isBuyNowVisible, '"Buy Now" button should be visible on the product page').toBeTruthy();

    // Step 3: Tap "Buy Now" as a guest user
    await productPage.clickBuyNow();

    // Step 4: Wait for the login modal to appear
    await loginModalPage.waitForModal();

    // Step 5: Verify the login modal is displayed
    const isModalVisible = await loginModalPage.isModalVisible();
    expect(isModalVisible, 'Login modal should be visible after guest user taps "Buy Now"').toBeTruthy();

    // Step 6: Verify modal heading is present and meaningful
    const modalHeading = await loginModalPage.getModalHeading();
    expect(modalHeading, 'Modal heading should not be empty').toBeTruthy();

    // Step 7: Verify Sign In option is available in the modal
    const isSignInVisible = await loginModalPage.isSignInButtonVisible();
    expect(isSignInVisible, '"Sign In" button should be visible in the login modal').toBeTruthy();

    // Step 8: Verify Sign Up option is available in the modal
    const isSignUpVisible = await loginModalPage.isSignUpButtonVisible();
    expect(isSignUpVisible, '"Sign Up" option should be visible in the login modal').toBeTruthy();

    // Step 9: Verify credential input fields are present
    const isUsernameInputVisible = await loginModalPage.isUsernameInputVisible();
    expect(isUsernameInputVisible, 'Username input should be visible in the login modal').toBeTruthy();

    const isPasswordInputVisible = await loginModalPage.isPasswordInputVisible();
    expect(isPasswordInputVisible, 'Password input should be visible in the login modal').toBeTruthy();

    // Step 10: Verify the modal backdrop is displayed (background is overlaid)
    const isBackdropVisible = await loginModalPage.isBackdropVisible();
    expect(isBackdropVisible, 'Modal backdrop should be visible to prevent background interaction').toBeTruthy();

    // Step 11: Verify user has NOT been navigated to the checkout page
    const currentUrl = page.url();
    expect(currentUrl, 'User should NOT be redirected to checkout without authentication')
      .not.toContain('/checkout');

    logInfo('XPANBFLFA-61: Test passed – Login modal correctly displayed for guest user on Buy Now');
  });
});
