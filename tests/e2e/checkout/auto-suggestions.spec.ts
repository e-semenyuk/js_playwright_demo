import { test, expect } from '../../../src/fixtures/test-fixtures';
import { CheckoutPage } from '../../../src/page-objects/checkout-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Auto-Suggestions Feature', () => {
  let page: CheckoutPage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new CheckoutPage(browserPage);
    await page.goto();
  });

  test('EPMXYZ-4589: Verify API interaction when auto-suggestions are enabled', async () => {
    logInfo('Starting test for verifying API interaction when auto-suggestions are enabled');

    // Step 1: Navigate to the checkout page
    await page.goto();
    expect(await page.page.title()).toBe('Checkout');

    // Step 2: Toggle the "Enable Auto-Suggestions" switch to the on position
    await page.toggleAutoSuggestions(true);

    // Step 3: Start entering an address in the address input field
    await page.enterAddress('123 Main St');

    // Verify API calls to the address suggestion service are made
    const apiCalled = await page.isApiCalled();
    expect(apiCalled).toBeTruthy();
  });
});
