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

  test('Verify the order summary displays correct details before payment', async ({ page }) => {
    logInfo('Starting test to verify the order summary displays correct details before payment');

    // Add product to cart
    await productPage.addToCart();
    await productPage.addToCart(); // Adding the product twice to match the quantity of 2

    // Navigate to cart page
    await shoppingCartPage.goto('/cart');

    // Verify product details
    const productName = await shoppingCartPage.getProductName();
    const productPrice = await shoppingCartPage.getProductPrice();
    const productQuantity = await shoppingCartPage.getProductQuantity();
    const shippingCost = await shoppingCartPage.getShippingCost();
    const tax = await shoppingCartPage.getTax();
    const totalAmount = await shoppingCartPage.getTotalAmount();

    expect(productName).toBe('Wireless Headphones');
    expect(productPrice).toBe('$50');
    expect(productQuantity).toBe('2');
    expect(shippingCost).toBe('$5');
    expect(tax).toBe('$10');
    expect(totalAmount).toBe('$115');

    // Proceed to payment
    await shoppingCartPage.proceedToPayment();

    // Verify redirection to payment page
    expect(page.url()).toContain('/payment');
  });
});
