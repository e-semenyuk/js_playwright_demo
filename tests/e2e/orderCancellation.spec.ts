import { test, expect } from '../../src/fixtures/test-fixtures';
import { OrdersPage } from '../../src/page-objects/orders-page';
import { logInfo } from '../../src/utils/logger';

test.describe('Order Cancellation Functionality', () => {
  let ordersPage: OrdersPage;
  const testOrderId = 'ORD-12345'; // Test data from XPANBFLFA-57

  test.beforeEach(async ({ page }) => {
    // Initialize page objects
    ordersPage = new OrdersPage(page);
    
    // Login and navigate to orders page
    // Note: In a real implementation, you would use a proper login method
    // This is a placeholder assuming authentication is handled elsewhere
    await page.goto('/login');
    await page.fill('input[name="username"]', 'validuser');
    await page.fill('input[name="password"]', 'validpassword');
    await page.click('button[type="submit"]');
    
    // Navigate to Orders page
    await ordersPage.goToOrdersPage();
  });

  /**
   * @XPANBFLFA-57
   * Test case: Order Cancellation - Confirmation Dialog Prevents Accidental Cancellations
   * Verify that the system displays a confirmation dialog when a user attempts to cancel an order,
   * preventing accidental cancellations and only proceeding with cancellation when explicitly confirmed.
   */
  test('should prevent accidental order cancellation with confirmation dialog', async () => {
    logInfo('Starting test for order cancellation confirmation dialog');

    // Navigate to specific order details
    await ordersPage.goToOrderDetails(testOrderId);

    // Verify order is in Pending status
    const initialStatus = await ordersPage.getOrderStatus(testOrderId);
    expect(initialStatus).toBe('Pending');

    // Click Cancel Order button
    await ordersPage.clickCancelOrderButton();

    // Verify confirmation dialog is displayed
    const isDialogDisplayed = await ordersPage.isConfirmationDialogDisplayed();
    expect(isDialogDisplayed).toBe(true);

    // Click "Keep Order" button to dismiss dialog
    await ordersPage.clickKeepOrderButton();

    // Verify dialog is closed and order status remains unchanged
    const isDialogStillDisplayed = await ordersPage.isConfirmationDialogDisplayed();
    expect(isDialogStillDisplayed).toBe(false);
    
    const statusAfterKeeping = await ordersPage.getOrderStatus(testOrderId);
    expect(statusAfterKeeping).toBe('Pending');

    // Click Cancel Order button again
    await ordersPage.clickCancelOrderButton();

    // Verify confirmation dialog is displayed again
    const isDialogDisplayedAgain = await ordersPage.isConfirmationDialogDisplayed();
    expect(isDialogDisplayedAgain).toBe(true);

    // Click "Cancel Order" button on confirmation dialog to proceed with cancellation
    await ordersPage.clickConfirmCancelButton();

    // Verify loading indicator appears
    const isLoadingDisplayed = await ordersPage.isLoadingIndicatorDisplayed();
    expect(isLoadingDisplayed).toBe(true);

    // Wait for order status to change to "Cancelled"
    await ordersPage.waitForOrderStatusChange(testOrderId, 'Cancelled');

    // Verify success message is displayed
    const isSuccessMessageDisplayed = await ordersPage.isSuccessMessageDisplayed();
    expect(isSuccessMessageDisplayed).toBe(true);

    // Verify final order status
    const finalStatus = await ordersPage.getOrderStatus(testOrderId);
    expect(finalStatus).toBe('Cancelled');
  });
});
