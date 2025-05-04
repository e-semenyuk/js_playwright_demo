const { test, expect } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');
const ProductPage = require('../pages/ProductPage');
const CartPage = require('../pages/CartPage');

test.describe('KAN-88: Shopping Cart Functionality', () => {
  test('Verify product is added to cart correctly', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const productPage = new ProductPage(page);
    const cartPage = new CartPage(page);

    // Step 1: Log in
    await page.goto('https://www.saucedemo.com');
    await loginPage.login('standard_user', 'secret_sauce');

    // Step 2: Navigate to product page
    await page.goto('https://www.saucedemo.com/inventory.html');
    const productDetails = await productPage.getProductDetails();

    // Step 3: Add to cart
    await productPage.addToCart();

    // Step 4: Verify cart icon
    await expect(productPage.cartBadge).toHaveText('1');

    // Step 5: Navigate to cart
    await page.goto('https://www.saucedemo.com/cart.html');

    // Step 6: Verify cart contents
    await cartPage.verifyCartItem(productDetails);

    // Verify user is still logged in
    await expect(loginPage.userMenu).toBeVisible();
  });
});