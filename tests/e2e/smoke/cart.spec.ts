import { test, expect } from '../../../src/fixtures/test-fixtures';
import { BasePage } from '../../../src/page-objects/base-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Cart Functionality', () => {
  let page: BasePage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new BasePage(browserPage);
    await page.goto('/login');

    // Log in as a registered user
    await page.fill('[data-test="username"]', process.env.TEST_USERNAME || 'test-user');
    await page.fill('[data-test="password"]', process.env.TEST_PASSWORD || 'test-password');
    await page.click('[data-test="login-button"]');
    await page.waitForSelector('[data-test="user-profile"]'); // Ensure login is successful
  });

  test('should add a product to the cart as a logged-in user', async () => {
    logInfo('Starting test for adding product to cart');

    // Navigate to a product page
    await page.goto('/products/1');
    await page.waitForSelector('[data-test="product-title"]');

    // Get product details
    const productTitle = await page.getText('[data-test="product-title"]');
    const productPrice = await page.getText('[data-test="product-price"]');

    // Add product to cart
    await page.click('[data-test="add-to-cart-button"]');

    // Verify cart icon updates
    const cartCount = await page.getText('[data-test="cart-count"]');
    expect(cartCount).toBe('1');

    // Navigate to cart page
    await page.goto('/cart');
    await page.waitForSelector('[data-test="cart-item"]');

    // Verify product is in cart
    const cartItemTitle = await page.getText('[data-test="cart-item-title"]');
    const cartItemPrice = await page.getText('[data-test="cart-item-price"]');
    const cartItemQuantity = await page.getText('[data-test="cart-item-quantity"]');

    expect(cartItemTitle).toBe(productTitle);
    expect(cartItemPrice).toBe(productPrice);
    expect(cartItemQuantity).toBe('1');
  });
});