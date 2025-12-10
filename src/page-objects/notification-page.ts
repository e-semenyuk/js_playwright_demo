import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class NotificationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Wait for push notification to appear
   */
  async waitForPushNotification(timeout: number = 30000): Promise<void> {
    logStep(`Waiting for push notification, timeout: ${timeout}ms`);
    await this.waitForElement('[data-test="push-notification"]', timeout);
  }

  /**
   * Open push notification
   */
  async openPushNotification(): Promise<void> {
    logStep('Opening push notification');
    await this.click('[data-test="push-notification"]');
  }

  /**
   * Get order ID from notification
   */
  async getNotificationOrderId(): Promise<string> {
    logStep('Getting order ID from notification');
    const orderIdText = await this.getText('[data-test="notification-order-id"]');
    return orderIdText || '';
  }

  /**
   * Get total amount from notification
   */
  async getNotificationTotalAmount(): Promise<string> {
    logStep('Getting total amount from notification');
    const totalAmountText = await this.getText('[data-test="notification-total-amount"]');
    return totalAmountText || '';
  }

  /**
   * Check if delivery timeframe is displayed in notification
   */
  async isDeliveryTimeframeDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="notification-delivery-timeframe"]');
  }

  /**
   * Verify if notification redirects to correct order details page
   */
  async verifyRedirectToOrderDetails(orderId: string): Promise<boolean> {
    logStep('Verifying redirection to order details page');
    const currentUrl = this.page.url();
    return currentUrl.includes(`/orders/${orderId}`);
  }
}
