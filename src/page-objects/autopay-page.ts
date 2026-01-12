import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class AutopayPage extends BasePage {
  // Page locators
  // Cadence options
  private biWeeklyOption = this.page.locator('[data-testid="bi-weekly-cadence"]');
  private weeklyOption = this.page.locator('[data-testid="weekly-cadence"]');
  private monthlyOption = this.page.locator('[data-testid="monthly-cadence"]');
  
  // Date selection
  private startDateInput = this.page.locator('[data-testid="start-date-input"]');
  private dateConfirmButton = this.page.locator('[data-testid="confirm-date-button"]');
  
  // Summary section
  private setupSummary = this.page.locator('[data-testid="setup-summary"]');
  private cadenceSummary = this.page.locator('[data-testid="cadence-summary"]');
  private dateSummary = this.page.locator('[data-testid="start-date-summary"]');
  
  // Action buttons
  private saveButton = this.page.locator('[data-testid="save-autopay-button"]');
  private validationErrors = this.page.locator('[data-testid="validation-errors"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to Autopay setup screen
   */
  async gotoAutopaySetup() {
    logStep('Navigating to Autopay setup screen');
    await this.goto('/autopay/setup');
  }

  /**
   * Select Autopay cadence
   */
  async selectBiWeeklyCadence() {
    logStep('Selecting Bi-Weekly cadence');
    await this.biWeeklyOption.click();
  }
  
  /**
   * Set start date
   */
  async setStartDate(date: string) {
    logStep(`Setting start date to: ${date}`);
    await this.fill(this.startDateInput, date);
  }

  /**
   * Confirm selected date
   */
  async confirmDateSelection() {
    logStep('Confirming selected date');
    await this.dateConfirmButton.click();
  }

  /**
   * Save autopay configuration
   */
  async saveAutopayConfiguration() {
    logStep('Saving autopay configuration');
    await this.saveButton.click();
  }

  /**
   * Get setup summary text
   */
  async getSetupSummaryText(): Promise<string> {
    await this.waitForElement(this.setupSummary);
    const text = await this.setupSummary.textContent();
    return text || '';
  }

  /**
   * Get cadence from summary
   */
  async getCadenceSummary(): Promise<string> {
    await this.waitForElement(this.cadenceSummary);
    const text = await this.cadenceSummary.textContent();
    return text || '';
  }

  /**
   * Get start date from summary
   */
  async getStartDateSummary(): Promise<string> {
    await this.waitForElement(this.dateSummary);
    const text = await this.dateSummary.textContent();
    return text || '';
  }

  /**
   * Check if validation errors are present
   */
  async hasValidationErrors(): Promise<boolean> {
    return await this.validationErrors.isVisible().catch(() => false);
  }

  /**
   * Perform full bi-weekly autopay setup with a specified date
   */
  async setupBiWeeklyAutopayWithDate(date: string) {
    await this.selectBiWeeklyCadence();
    await this.setStartDate(date);
    await this.confirmDateSelection();
    await this.saveAutopayConfiguration();
  }
}
