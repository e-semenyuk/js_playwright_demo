import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../../../src/page-objects/checkout-page';

test.describe('Checkout Page', () => {
  test('TC01: Verify presence of "Enable Auto-Suggestions" toggle switch @EPMXYZ-3914', async ({ page }) => {
    const checkoutPage = new CheckoutPage(page);

    // Step 1: Navigate to the checkout page
    await checkoutPage.goto('/checkout');
    expect(await page.url()).toContain('/checkout');

    // Step 2: Locate the address input fields
    const addressInputFields = page.locator('input[name="address"]');
    expect(await addressInputFields.isVisible()).toBe(true);

    // Step 3: Check for the 'Enable Auto-Suggestions' toggle switch
    expect(await checkoutPage.isAutoSuggestionsTogglePresent()).toBe(true);
  });
});
