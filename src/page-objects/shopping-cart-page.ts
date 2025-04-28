import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class ShoppingCartPage extends BasePage {
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
}