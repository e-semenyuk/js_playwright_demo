import { test, expect, commonHooks } from '../../src/fixtures/test-fixtures';
import { AutopayPage } from '../../src/page-objects/autopay-page';
import { logInfo } from '../../src/utils/logger';

/**
 * TEST CASE: EPMCDMETTT-23941
 * TC1-01 - Set up Bi-Weekly Autopay with explicit future start date and verify summary
 */
test.describe('Autopay Functionality', () => {
    let autopayPage: AutopayPage;

    test.beforeEach(async ({ page }) => {
        // Run common setup steps
        await commonHooks.beforeEach({ page });

        // Initialize page object and navigate to autopay setup screen
        autopayPage = new AutopayPage(page);
        await autopayPage.gotoAutopay();
    });

    test.afterEach(async ({ page }) => {
        // Run common cleanup steps
        await commonHooks.afterEach({ page });
    });

    test('should set up Bi-Weekly Autopay with a future date and verify summary', async () => {
        // Test case: EPMCDMETST-23941
        logInfo(`Starting test case EPMCDMETST-23941`);

        // Step 1: Select 'Bi-Weekly'o as the autopay cadence option
        logInfo(`Step 1: Select Bi-Weekly cadence option`);
        await autopayPage.selectBiWeeklyCadence();

        // Step 2: Choose a future date from the calendar widget as the start date
        logInfo(`Step 2: Choose a future date from the calendar widget`);
        await autopayPage.openDatePicker();
        await autopayPage.selectFutureDate();

        // Step 3: Confirm the selection
        logInfo(`Step 3: Confirm the selection`);
        await autopayPage.confirmSetup();

        // Step 4: Review the setup summary displayed on the screen
        logInfo(`Step 4: Review the setup summary`);

        // Verify the expected results:
        // - System accepts the selected future start date and validates it as eligible
        // - Selection is saved and associated with the borrower's autopay configuration
        // - Setup summary displays the chosen Bi-Weekly cadence and start date accurately
        // - No validation errors or warnings are shown
        
        // Verify cadence displayed in summary
        const cadence = await autopayPage.getSummaryCadence();
        expect(cadence).toContain('Bi-Weekly');
        
        // Verify date is displayed in summary
        const startDate = await autopayPage.getSummaryDate();
        expect(startDate).toBeTruthy();
        
        // Verify no validation errors
        const hasErrors = await autopayPage.hasValidationErrors();
        expect(hasErrors).toBeFalsy();
    });
});
