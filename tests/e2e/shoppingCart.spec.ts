import { test, expect } from '../../../src/fixtures/test-fixtures';
import { ShoppingCartPage } from '../../../src/page-objects/shopping-cart-page';
import { ProductPage } from '../../../src/page-objects/product-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Shopping Cart Functionality', () => {
  let productPage: ProductPage;
  let shoppingCartPage: ShoppingCartPage;

  test.beforeEach(async ({ page }) => {
    productPage = new ProductPage(page);
    shoppingCartPage = new ShoppingCartPage(page);
    await productPage.goto('/products/1'); // Navigate to a product page
  });

  test('should notify customer if product in cart becomes out-of-stock', async () => {
    logInfo('Starting test to verify out-of-stock notification');

    // Add product to cart
    await productPage.addToCart();

    // Verify cart icon updates
    const cartCount = await productPage.getCartCount();
    expect(cartCount).toBe('1');

    // Simulate the product becoming out-of-stock
    // This step would involve interacting with the backend or mocking the API response
    // For simplicity, we assume there is a method to update the inventory count
    await productPage.updateInventoryCount(0);

    // Refresh the cart page
    await shoppingCartPage.goto('/cart');

    // Verify out-of-stock notification
    const outOfStockNotification = await shoppingCartPage.getOutOfStockNotification();
    expect(outOfStockNotification).toContain('Product ID 12345 is now out-of-stock.');
  });

  test('should add a product to the cart and verify it', async () => {
    logInfo('Starting test to add a product to the cart');

    // Add product to cart
    await productPage.addToCart();

    // Verify cart icon updates
    const cartCount = await productPage.getCartCount();
    expect(cartCount).toBe('1');

    // Navigate to cart page
    await shoppingCartPage.goto('/cart');

    // Verify product is in the cart
    const productName = await shoppingCartPage.getProductName();
    const productPrice = await shoppingCartPage.getProductPrice();
    const productQuantity = await shoppingCartPage.getProductQuantity();

    expect(productName).toBeTruthy();
    expect(productPrice).toBeTruthy();
    expect(productQuantity).toBe('1');
  });
});