import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

const NOW = new Date();

/**
 * Page object that represents the Autopay setup screen
 */
export class AutopayPage extends BasePage {
  // Locators
  private cadenceOptions = this.page.locator('[data-test="cadence-options"] > label');
  private biWeeklyOption = this.page.locator('[data-test="cadence-option-bi-weekly"]');
  private datePickerTrigger = this.page.locator('[data-test="date-picker-trigger"]');
  private calendarWidget = this.page.locator('[data-test="calendar-widget"]');
  private calendarDays = this.page.locator('[data-test="calendar-day"]');
  private nextMonthButton = this.page.locator('[data-test="next-month"]');
  private confirmButton = this.page.locator('[data-test="confirm-button"]');
  private setupSummary = this.page.locator('[data-test="setup-summary"]');
  private summaryCadence = this.page.locator('[data-test="summary-cadence"]');
  private summaryDate = this.page.locator('[data-test="summary-date"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the autopay setup page
   */
  async gotoAutopay(): Promise<void> {
    logStep('Navigating to the Autopay setup page');
    await this.goto('/payments/autopay');
  }

  /**
   * Select the autopay cadence option
   */
  async selectBiWeeklyCadence(): Promise<void> {
    logStep('Selecting Bi-Weekly cadence');
    await this.click(this.biWeeklyOption);
  }

  /**
   * Open the date picker
   */
  async openDatePicker(): Promise<void> {
    logStep('Opening date picker');
    await this.click(this.datePickerTrigger);
    // Wait for the calendar widget to appear
    await this.waitForElement(this.calendarWidget);
  }

  /**
   * Select a future date from the calendar widget
   */
  async selectFutureDate(): Promise<void> {
    logStep('Selecting a future date');
    
    // Go to next month to ensure we have future dates
    await this.click(this.nextMonthButton);

    // Select a date that is surely in the future (e.g., 15th of next month)
    const futureDayNum = 15;
    const futureDays = this.page.locator(`[data-test="calendar-day"][data-day="${futureDayNum}"]`);

    // If we can't find the specific date, fallback to selecting any future date
    try {
      await futureDays.waitFor({ state: 'visible', timeout: 5000 });
      await this.click(futureDays);
    } catch (error) {
      // If we can't find the specific day, just select the first available future date
      const allDays = await this.calendarDays.all();
      // Select a day in the middle of the month
      const middleIndex = Math.floor(allDays.length / 2);
      await allDays[middleIndex].click();
    }
  }

  /**
   * Confirm the autopay setup
   */
  async confirmSetup(): Promise<void> {
    logStep('Confirming autopay setup');
    await this.click(this.confirmButton);
    // Wait for the summary to appear
    await this.waitForElement(this.setupSummary);
  }

  /**
   * Get the selected cadence from the summary
   */
  async getSummaryCadence(): Promise<string | null> {
    return await this.getText(this.summaryCadence);
  }

  /**
   * Get the selected date from the summary
   */
  async getSummaryDate(): Promise<string | null> {
    return await this.getText(this.summaryDate);
  }

  /**
   * Check if validation errors are present
   */
  async hasValidationErrors(): Promise<boolean> {
    const errorMessages = this.page.locator('[data-test="validation-error"]');
    return await errorMessages.isVisible();
  }
}
