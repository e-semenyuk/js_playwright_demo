import { test, expect } from '../../../src/fixtures/test-fixtures';
import { ProductPage } from '../../../src/page-objects/product-page';
import { CartPage } from '../../../src/page-objects/cart-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Cart Functionality', () => {
  let productPage: ProductPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    cartPage = new CartPage(page);
    await page.goto('/product');
  });

  test('should add product to cart and verify details', async () => {
    logInfo('Starting test to add product to cart and verify details');

    // Add product to cart
    await productPage.addToCart();

    // Verify cart icon updates
    const cartItemCount = await productPage.getCartItemCount();
    expect(cartItemCount).toBe('1');

    // Navigate to cart page
    await page.goto('/cart');

    // Verify product details in cart
    const productName = await cartPage.getProductName();
    const productPrice = await cartPage.getProductPrice();
    const productQuantity = await cartPage.getProductQuantity();

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
    expect(productQuantity).toBe('1');
  });
});
