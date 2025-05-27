import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../src/page-objects/checkout-page';
import { ShoppingCartPage } from '../../src/page-objects/shopping-cart-page';

test.describe('EPMXYZ-5232: Verify gift wrap cost in order confirmation email', () => {
  test.beforeEach(async ({ page }) => {
    // Preconditions: User must be logged into the application and have items in the cart.
    // Navigate to the shopping cart page and add items to the cart.
    const shoppingCartPage = new ShoppingCartPage(page);
    await shoppingCartPage.goto();
    // Assuming there are methods to login and add items to the cart.
    await shoppingCartPage.login();
    await shoppingCartPage.addItemToCart();
  });

  test('should include gift wrap cost in order confirmation email', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);
    
    // Step 1: Navigate to the checkout page.
    await checkoutPage.goto();
    expect(await page.title()).toContain('Checkout');

    // Step 2: Select the gift wrap option.
    await checkoutPage.selectGiftWrapOption();
    expect(await page.isChecked('[data-test="gift-wrap-option"]')).toBeTruthy();

    // Step 3: Complete the purchase.
    await checkoutPage.completePurchase();
    expect(await page.isVisible('[data-test="order-confirmation"]')).toBeTruthy();

    // Step 4: Check the order confirmation email.
    const orderConfirmationEmail = await checkoutPage.getOrderConfirmationEmail();
    expect(orderConfirmationEmail).toContain('Total order cost includes the additional cost of $5.00 for gift wrap');
  });
});
