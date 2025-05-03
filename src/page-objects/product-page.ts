import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ProductPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async addToCart(): Promise<void> {
    await this.click('[data-test="add-to-cart-button"]');
  }

  async getCartCount(): Promise<string> {
    return this.getText('[data-test="cart-count"]');
  }

  async enterQuantity(quantity: string): Promise<void> {
    await this.fill('[data-test="quantity-input"]', quantity);
  }

  async getErrorMessage(): Promise<string> {
    return this.getText('[data-test="error-message"]');
  }
}