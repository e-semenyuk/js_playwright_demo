import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Select delivery option
   */
  async selectDeliveryOption(option: string): Promise<void> {
    logStep(`Selecting delivery option: ${option}`);
    await this.click(`[data-test="delivery-option-${option}"]`);
  }

  /**
   * Proceed to payment
   */
  async proceedToPayment(): Promise<void> {
    logStep('Proceeding to payment');
    await this.waitForNavigation(async () => {
      await this.click('[data-test="proceed-to-payment-button"]');
    });
  }

  /**
   * Enter payment details
   */
  async enterPaymentDetails(cardNumber: string, expiry: string, cvv: string): Promise<void> {
    logStep('Entering payment details');
    await this.fill('[data-test="card-number"]', cardNumber);
    await this.fill('[data-test="card-expiry"]', expiry);
    await this.fill('[data-test="card-cvv"]', cvv);
  }

  /**
   * Complete payment
   */
  async completePayment(): Promise<void> {
    logStep('Completing payment');
    await this.waitForNavigation(async () => {
      await this.click('[data-test="complete-payment-button"]');
    });
  }

  /**
   * Verify cart items are displayed
   */
  async areCartItemsDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="cart-items"]');
  }

  /**
   * Verify delivery options are displayed
   */
  async areDeliveryOptionsDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="delivery-options"]');
  }

  /**
   * Verify payment methods are displayed
   */
  async arePaymentMethodsDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="payment-methods"]');
  }
}
