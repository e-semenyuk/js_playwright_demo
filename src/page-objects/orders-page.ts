import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class OrdersPage extends BasePage {
  // Locators
  readonly ordersListLocator: Locator;
  readonly orderItemLocator: (orderId: string) => Locator;
  readonly orderStatusLocator: (orderId: string) => Locator;
  readonly cancelOrderButtonLocator: Locator;
  readonly confirmCancelButtonLocator: Locator;
  readonly keepOrderButtonLocator: Locator;
  readonly confirmationDialogLocator: Locator;
  readonly loadingIndicatorLocator: Locator;
  readonly successMessageLocator: Locator;

  constructor(page: Page) {
    super(page);
    this.ordersListLocator = page.locator('.orders-list');
    this.orderItemLocator = (orderId: string) => page.locator(`.order-item[data-order-id="${orderId}"]`);
    this.orderStatusLocator = (orderId: string) => this.orderItemLocator(orderId).locator('.order-status');
    this.cancelOrderButtonLocator = page.locator('button.cancel-order-btn');
    this.confirmCancelButtonLocator = page.locator('button.confirm-cancel-btn');
    this.keepOrderButtonLocator = page.locator('button.keep-order-btn');
    this.confirmationDialogLocator = page.locator('.confirmation-dialog');
    this.loadingIndicatorLocator = page.locator('.loading-indicator');
    this.successMessageLocator = page.locator('.success-message');
  }

  /**
   * Navigate to the orders page
   */
  async goToOrdersPage() {
    logStep('Navigating to Orders page');
    await this.goto('/orders');
  }

  /**
   * Navigate to a specific order's details
   */
  async goToOrderDetails(orderId: string) {
    logStep(`Navigating to Order Details for ${orderId}`);
    await this.click(this.orderItemLocator(orderId));
  }

  /**
   * Get the status of a specific order
   */
  async getOrderStatus(orderId: string): Promise<string | null> {
    logStep(`Getting status for order ${orderId}`);
    return await this.getText(this.orderStatusLocator(orderId));
  }

  /**
   * Click the cancel order button
   */
  async clickCancelOrderButton() {
    logStep('Clicking Cancel Order button');
    await this.click(this.cancelOrderButtonLocator);
  }

  /**
   * Check if confirmation dialog is displayed
   */
  async isConfirmationDialogDisplayed(): Promise<boolean> {
    logStep('Checking if confirmation dialog is displayed');
    return await this.isVisible(this.confirmationDialogLocator);
  }

  /**
   * Click the "Keep Order" button on the confirmation dialog
   */
  async clickKeepOrderButton() {
    logStep('Clicking Keep Order button on confirmation dialog');
    await this.click(this.keepOrderButtonLocator);
  }

  /**
   * Click the "Cancel Order" button on the confirmation dialog
   */
  async clickConfirmCancelButton() {
    logStep('Clicking Confirm Cancel button on confirmation dialog');
    await this.click(this.confirmCancelButtonLocator);
  }

  /**
   * Check if loading indicator is displayed
   */
  async isLoadingIndicatorDisplayed(): Promise<boolean> {
    logStep('Checking if loading indicator is displayed');
    return await this.isVisible(this.loadingIndicatorLocator);
  }

  /**
   * Check if success message is displayed
   */
  async isSuccessMessageDisplayed(): Promise<boolean> {
    logStep('Checking if success message is displayed');
    return await this.isVisible(this.successMessageLocator);
  }

  /**
   * Wait for order status to change
   */
  async waitForOrderStatusChange(orderId: string, expectedStatus: string, timeout: number = 5000): Promise<void> {
    logStep(`Waiting for order ${orderId} status to change to ${expectedStatus}`);
    await this.page.waitForFunction(
      ({ orderId, expectedStatus }) => {
        const statusElement = document.querySelector(`.order-item[data-order-id="${orderId}"] .order-status`);
        return statusElement && statusElement.textContent?.trim() === expectedStatus;
      },
      { orderId, expectedStatus },
      { timeout }
    );
  }
}
