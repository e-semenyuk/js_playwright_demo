import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class OrderSummaryPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async getProductName(): Promise<string> {
    return this.getText('[data-test="product-name"]');
  }

  async getProductPrice(): Promise<string> {
    return this.getText('[data-test="product-price"]');
  }

  async getProductQuantity(): Promise<string> {
    return this.getText('[data-test="product-quantity"]');
  }

  async setProductQuantity(quantity: string): Promise<void> {
    await this.page.fill('[data-test="product-quantity-input"]', quantity);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText('[data-test="error-message"]');
  }
}
