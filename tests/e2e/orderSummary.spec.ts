import { test, expect } from '../../src/fixtures/test-fixtures';
import { OrderSummaryPage } from '../../src/page-objects/order-summary-page';
import { ShoppingCartPage } from '../../src/page-objects/shopping-cart-page';
import { logInfo } from '../../src/utils/logger';

test.describe('Order Summary Page - Invalid Quantity Inputs', () => {
  let orderSummaryPage: OrderSummaryPage;
  let shoppingCartPage: ShoppingCartPage;

  test.beforeEach(async ({ page }) => {
    shoppingCartPage = new ShoppingCartPage(page);
    orderSummaryPage = new OrderSummaryPage(page);
    await shoppingCartPage.goto('/cart'); // Navigate to the shopping cart page
  });

  test('should prevent entering a negative quantity and display an error message', async () => {
    logInfo('Starting test to verify negative quantity input');

    // Attempt to set a negative quantity
    await orderSummaryPage.setProductQuantity('-1');

    // Verify error message is displayed
    const errorMessage = await orderSummaryPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid quantity');
  });

  test('should prevent entering a non-numeric value and display an error message', async () => {
    logInfo('Starting test to verify non-numeric quantity input');

    // Attempt to set a non-numeric quantity
    await orderSummaryPage.setProductQuantity('abc');

    // Verify error message is displayed
    const errorMessage = await orderSummaryPage.getErrorMessage();
    expect(errorMessage).toBe('Invalid quantity');
  });
});
