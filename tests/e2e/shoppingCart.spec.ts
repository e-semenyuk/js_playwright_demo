import { test, expect } from '@playwright/test';
import { ProductPage } from '../../src/page-objects/product-page';
import { ShoppingCartPage } from '../../src/page-objects/shopping-cart-page';
import { LoginPage } from '../../src/page-objects/login-page';

test('Verify product is added to cart correctly', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const productPage = new ProductPage(page);
  const shoppingCartPage = new ShoppingCartPage(page);

  // Step 1: Log in as a registered user
  await loginPage.navigateTo();
  await loginPage.login('registered_user', 'password');

  // Step 2: Navigate to a product page
  await productPage.navigateTo('product-id');

  // Step 3: Click the 'Add to Cart' button
  await productPage.addToCart();

  // Step 4: Verify the cart icon updates with the new item
  await expect(productPage.cartIcon).toHaveText('1');

  // Step 5: Navigate to the cart page
  await shoppingCartPage.navigateTo();

  // Step 6: Verify the product is displayed in the cart with the correct quantity and price
  await expect(shoppingCartPage.productName).toHaveText('Product Name');
  await expect(shoppingCartPage.productQuantity).toHaveText('1');
  await expect(shoppingCartPage.productPrice).toHaveText('$19.99');
});