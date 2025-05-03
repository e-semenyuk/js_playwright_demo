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