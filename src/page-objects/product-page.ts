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
}