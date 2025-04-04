import { test, expect } from '../../../src/fixtures/test-fixtures';
import { BasePage } from '../../../src/page-objects/base-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Auto-Suggestions Feature', () => {
  let page: BasePage;

  test.beforeEach(async ({ page: browserPage }) => {
    page = new BasePage(browserPage);
    await page.goto('/checkout');
  });

  test('EPMXYZ-4589: Verify API interaction when auto-suggestions are enabled', async () => {
    logInfo('Starting test to verify API interaction when auto-suggestions are enabled');

    // Ensure the toggle switch is enabled
    const isToggleEnabled = await page.isChecked('[data-test="enable-auto-suggestions"]');
    if (!isToggleEnabled) {
      await page.click('[data-test="enable-auto-suggestions"]');
    }

    // Start entering an address in the address input field
    await page.fill('[data-test="address-input"]', '123 Main St');

    // Verify API calls to the address suggestion service are made
    // This is a placeholder assertion. The actual implementation may vary depending on how API calls can be monitored in the test environment.
    const apiCalls = await page.evaluate(() => {
      // Custom function to check network requests
      return window.__apiCalls || [];
    });

    expect(apiCalls).toContain('address-suggestion-service');
  });
});