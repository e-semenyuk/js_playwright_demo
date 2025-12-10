import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class OrderConfirmationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Get order ID from the confirmation page
   */
  async getOrderId(): Promise<string> {
    logStep('Getting order ID');
    const orderIdText = await this.getText('[data-test="order-id"]');
    return orderIdText?.replace('Order ID: ', '') || '';
  }

  /**
   * Get total amount from the confirmation page
   */
  async getTotalAmount(): Promise<string> {
    logStep('Getting total amount');
    const totalAmountText = await this.getText('[data-test="total-amount"]');
    return totalAmountText || '';
  }

  /**
   * Check if order confirmation is displayed
   */
  async isOrderConfirmationDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="order-confirmation"]');
  }
}
