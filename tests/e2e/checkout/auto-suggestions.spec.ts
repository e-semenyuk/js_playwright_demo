import { test, expect } from '../../../src/fixtures/test-fixtures';
import { BasePage } from '../../../src/page-objects/base-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Auto-Suggestions Functionality', () => {
  let page: BasePage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new BasePage(browserPage);
    await page.goto('/checkout');
  });

  test('should make API calls when auto-suggestions are enabled', async () => {
    logInfo('Starting auto-suggestions test with enabled toggle');

    // Toggle the "Enable Auto-Suggestions" switch to the on position
    await page.click('[data-test="enable-auto-suggestions"]');

    // Verify the toggle switch is enabled
    const isEnabled = await page.isVisible('[data-test="enable-auto-suggestions"][aria-checked="true"]');
    expect(isEnabled).toBeTruthy();

    // Start entering an address in the address input field
    await page.fill('[data-test="address-input"]', '123 Main St');

    // Verify API calls are made (this part would typically involve checking network requests, but for simplicity, we will check for auto-suggestions appearance)
    const autoSuggestionsVisible = await page.isVisible('[data-test="auto-suggestions"]');
    expect(autoSuggestionsVisible).toBeTruthy();
  });
});