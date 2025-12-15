import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class AutopayPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Select autopay cadence
   * @param cadence - The cadence to select (e.g., 'Monthly', 'Bi-Weekly')
   */
  async selectCadence(cadence: string): Promise<void> {
    logStep(`Selecting ${cadence} cadence option`);
    await this.click(`[data-test="cadence-option-${cadence.toLowerCase()}"]`);
  }

  /**
   * Opens the date picker calendar
   */
  async openDatePicker(): Promise<void> {
    logStep('Opening date picker');
    await this.click('[data-test="start-date-picker"]');
  }

  /**
   * Selects a date from the calendar widget
   * @param date - Date to select
   */
  async selectFutureDate(date: Date): Promise<void> {
    // Format the date as YYYY-MM-DD for the data-date attribute
    const formattedDate = date.toISOString().split('T')[0];
    logStep(`Selecting date: ${formattedDate}`);
    
    // Click on the date in the calendar
    await this.click(`[data-test="calendar-date"][data-date="${formattedDate}"]`);
  }

  /**
   * Confirms the autopay selection
   */
  async confirmSelection(): Promise<void> {
    logStep('Confirming autopay selection');
    await this.click('[data-test="confirm-autopay-button"]');
  }

  /**
   * Gets the selected cadence from the summary
   */
  async getSelectedCadence(): Promise<string> {
    return this.getText('[data-test="summary-cadence"]');
  }

  /**
   * Gets the selected start date from the summary
   */
  async getSelectedStartDate(): Promise<string> {
    return this.getText('[data-test="summary-start-date"]');
  }

  /**
   * Checks if validation error is displayed
   */
  async isValidationErrorDisplayed(): Promise<boolean> {
    return this.isVisible('[data-test="validation-error"]');
  }

  /**
   * Gets the validation error message if displayed
   */
  async getValidationErrorMessage(): Promise<string | null> {
    if (await this.isValidationErrorDisplayed()) {
      return this.getText('[data-test="validation-error"]');
    }
    return null;
  }

  /**
   * Helper to check if the setup summary is displayed
   */
  async isSetupSummaryDisplayed(): Promise<boolean> {
    return this.isVisible('[data-test="autopay-summary"]');
  }
}
