import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccountOrdersPage } from '../../../src/page-objects/account-orders-page';
import { logInfo } from '../../../src/utils/logger';

test.describe('Account Orders Pagination', () => {
  let accountOrdersPage: AccountOrdersPage;

  test.beforeEach(async ({ page }) => {
    accountOrdersPage = new AccountOrdersPage(page);
    await accountOrdersPage.goto('/account/orders');
  });

  test('should display pagination controls for users with more than 10 orders', async () => {
    logInfo('Starting test to verify pagination controls');

    // Verify pagination controls are visible
    const isPaginationVisible = await accountOrdersPage.isPaginationVisible();
    expect(isPaginationVisible).toBe(true);

    // Navigate to next page and verify
    await accountOrdersPage.navigateToNextPage();
    const currentPageNumber = await accountOrdersPage.getCurrentPageNumber();
    expect(currentPageNumber).toBe('2');

    // Navigate back to previous page and verify
    await accountOrdersPage.navigateToPreviousPage();
    const previousPageNumber = await accountOrdersPage.getCurrentPageNumber();
    expect(previousPageNumber).toBe('1');
  });
});
