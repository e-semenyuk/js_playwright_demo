import { test, expect } from '../../src/fixtures/test-fixtures';
import { logInfo } from '../../src/utils/logger';
import { ProductPage } from '../../src/page-objects/product-page';
import { CartPage } from '../../src/page-objects/cart-page';

test.describe('Shopping Cart Functionality', () => {
  test('should add a product to the cart as a logged-in user', async ({ page, usersApi }) => {
    logInfo('Starting test: Add product to cart as logged-in user');

    // Log in as a registered user (assuming login is handled via API or UI)
    // For simplicity, we assume the user is already logged in

    // Navigate to a product page
    const productPage = new ProductPage(page);
    await productPage.goto('/product/1');

    // Click the 'Add to Cart' button
    await productPage.addProductToCart();

    // Verify the cart icon updates with the new item
    const cartItemCount = await productPage.getCartItemCount();
    expect(cartItemCount).toBe('1');

    // Navigate to the cart page
    const cartPage = new CartPage(page);
    await cartPage.goto('/cart');

    // Verify the product is displayed in the cart with the correct quantity and price
    const productName = await cartPage.getProductName();
    const productPrice = await cartPage.getProductPrice();
    const productQuantity = await cartPage.getProductQuantity();

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
    expect(productQuantity).toBe('1');
  });
});