import { test, expect } from '../../../src/fixtures/test-fixtures';
import { AccountPage } from '../../../src/page-objects/account-page';

test.describe('Account Orders Security', () => {
  test('should redirect to login page when accessing /account/orders without authentication', async ({ page }) => {
    const accountPage = new AccountPage(page);
    await accountPage.navigateToOrders();
    
    // Verify redirection to login page
    const isLoginPage = await accountPage.isLoginPage();
    expect(isLoginPage).toBeTruthy();
  });
});
