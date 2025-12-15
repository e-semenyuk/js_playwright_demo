import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';

export class AutopayPage extends BasePage {
  // Locators
  private biWeeklyOption = this.page.locator('[data-test="bi-weekly-option"]');
  private startDateSelector = this.page.locator('[data-test="start-date-selector"]');
  private budgetMatchOption = this.page.locator('[data-test="budget-match-option"]');
  private fastTrackOption = this.page.locator('[data-test="fast-track-option"]');
  private previewScheduleButton = this.page.locator('[data-test="preview-schedule-button"]');
  private previewScheduleModal = this.page.locator('[data-test="preview-schedule-modal"]');
  private paymentDates = this.page.locator('[data-test="payment-date"]');
  private paymentAmounts = this.page.locator('[data-test="payment-amount"]');
  private thirdBiWeeklyIndicator = this.page.locator('[data-test="third-bi-weekly-indicator"]');

  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the Autopay setup page
   */
  async goToAutopaySetupPage() {
    await this.goto('/autopay-setup');
  }

  /**
   * Select bi-weekly cadence
   */
  async selectBiWeeklyCadence() {
    await this.click(this.biWeeklyOption);
  }

  /**
   * Select start date
   */
  async selectStartDate(dateValue: string) {
    await this.click(this.startDateSelector);
    await this.fill(this.startDateSelector, dateValue);
  }

  /**
   * Select Budget Match mode
   */
  async selectBudgetMatchMode() {
    await this.click(this.budgetMatchOption);
  }

  /**
   * Select Fast Track mode
   */
  async selectFastTrackMode() {
    await this.click(this.fastTrackOption);
  }

  /**
   * Open preview schedule modal
   */
  async openPreviewScheduleModal() {
    await this.click(this.previewScheduleButton);
    await this.waitForElement(this.previewScheduleModal);
  }

  /**
   * Get list of payment dates from the schedule preview
   */
  async getPaymentDates(): Promise<string[]> {
    return await this.paymentDates.allInnerTexts();
  }

  /**
   * Get list of payment amounts from the schedule preview
   */
  async getPaymentAmounts(): Promise<string[]> {
    return await this.paymentAmounts.allInnerTexts();
  }

  /**
   * Check if third bi-weekly indicators are shown
   */
  async hasThirdBiWeeklyIndicators(): Promise<boolean> {
    return await this.thirdBiWeeklyIndicator.isVisible();
  }

  /**
   * Verify dates are 14 days apart
   */
  async verifyDatesAreBiWeekly(dates: string[]): Promise<boolean> {
    if (dates.length < 2) return false;
    
    for (let i = 1; i < dates.length; i++) {
      const prevDate = new Date(dates[i - 1]);
      const currentDate = new Date(dates[i]);
      
      const differenceInDays = Math.round(
        (currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      
      if (differenceInDays !== 14) return false;
    }
    
    return true;
  }

  /**
   * Get month name from payment date string
   */
  getMonthFromDateString(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', { month: 'long' });
  }

  /**
   * Count payments per month
   */
  countPaymentsPerMonth(dates: string[]): Record<string, number> {
    const paymentsPerMonth: Record<string, number> = {};
    
    dates.forEach(dateString => {
      const month = this.getMonthFromDateString(dateString);
      if (!paymentsPerMonth[month]) {
        paymentsPerMonth[month] = 1;
      } else {
        paymentsPerMonth[month]++;
      }
    });
    
    return paymentsPerMonth;
  }

  /**
   * Get months with three payments
   */
  getMonthsWithThreePayments(dates: string[]): string[] {
    const paymentsPerMonth = this.countPaymentsPerMonth(dates);
    
    return Object.keys(paymentsPerMonth).filter(
      month => paymentsPerMonth[month] === 3
    );
  }
}
