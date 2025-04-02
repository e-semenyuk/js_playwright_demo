import { test, expect } from '../../src/fixtures/test-fixtures';
import { CheckoutPage } from '../../src/page-objects/checkout-page';
import { logInfo } from '../../src/utils/logger';

test.describe('Checkout Page - Auto-Suggestions Toggle', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    checkoutPage = new CheckoutPage(page);
    await checkoutPage.navigateToCheckout();
  });

  test('EPMXYZ-3914: Verify Auto-Suggestions Toggle on Checkout Page', async () => {
    logInfo('Starting test for EPMXYZ-3914');

    // Verify address input fields are visible
    const isAddressInputVisible = await checkoutPage.isAddressInputVisible();
    expect(isAddressInputVisible).toBeTruthy();

    // Verify 'Enable Auto-Suggestions' toggle switch is visible
    const isAutoSuggestionsToggleVisible = await checkoutPage.isAutoSuggestionsToggleVisible();
    expect(isAutoSuggestionsToggleVisible).toBeTruthy();
  });
});
