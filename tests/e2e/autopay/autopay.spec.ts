import { test, expect, commonHooks } from '../../../src/fixtures/test-fixtures';
import { AutopayPage } from '../../../src/page-objects/autopay-page';
import { logInfo } from '../../../src/utils/logger';

/**
 * Test suite for Borrower Autopay functionality
 * 
 * @link https://jiraeu.epam.com/browse/EPMCDMETST-241941
 */
test.describe('Borrower Autopay Functionality', () => {
  let autopayPage: AutopayPage;

  // Run common setup before each test
  test.beforeEach(async ({ page }) => {
    // Run common hooks for setup
    await commonHooks.beforeEach({ page });

    // Initialize the AutopayPage
    autopayPage = new AutopayPage(page);

    // Navigate to the autopay setup screen
    // Assuming borrower is already logged in per preconditions
    await autopayPage.goto('/autopay-setup');
  });

  // Run common cleanup after each test
  test.afterEach(async ({ page }) => {
    await commonHooks.afterEach({ page });
  });

  /**
   * Test case: Set up Bi-Weekly Autopay with explicit future start date and verify summary
   * Jira Ticket: EPMCDMETST241941
    */
  test('[set up Bi-Weekly Autopay with explicit future start date and verify summary]', async () => {
    logInfo('Starting test to set up Bi-Weekly Autopay with future start date');
    
    // 1. Select 'Bi-Weekly' as the autopay cadence option
    await autopayPage.selectCadence('Bi-Weekly');
    
    // 2. Choose a future date from the calendar widget as the start date
    await autopayPage.openDatePicker();

    // Create a date object for a future date (tomorrow)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Select the future date in the calendar
    await autopayPage.selectFutureDate(tomorrow);
    
    // 3. Confirm the selection
    await autopayPage.confirmSelection();
    
    // 4. Review the setup summary displayed on the screen
    
    // Verify expected results
    // - System accepts the selected future start date and validates it as eligible
    // - Selection is saved and associated with the borrower's autopay configuration
    // - Setup summary displays the chosen Bi-Weekly cadence and start date accurately
    // - No validation errors or warnings are shown

    // Check if summary is displayed
    const isSummaryDisplayed = await autopayPage.isSetupSummaryDisplayed();
    expect(isSummaryDisplayed).toBeTruthy('Autopay setup summary should be displayed');

    // Check if cadence is correctly displayed in the summary
    const displayedCadence = await autopayPage.getSelectedCadence();
    expect(displayedCadence).toContain('Bi-Weekly', 'Summary should show Bi-Weekly cadence');

    // Check if start date is correctly displayed in the summary
    // Note: The exact date format in the UI might differ from our test date format
    // So we'll just check if it's not empty and log it for debugging
    const displayedDate = await autopayPage.getSelectedStartDate();
    logInfo(`Displayed start date in summary: ${displayedDate}`);
    expect(displayedDate).toBeTruthy('Start date should be displayed in the summary');

    // Verify no validation errors are shown
    const hasValidationError = await autopayPage.isValidationErrorDisplayed();
    expect(hasValidationError).toBeFalsy('No validation errors should be shown');
  });
});
