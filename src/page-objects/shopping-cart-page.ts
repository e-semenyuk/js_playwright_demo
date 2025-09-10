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

  async getShippingCost(): Promise<string> {
    return this.getText('[data-test="shipping-cost"]');
  }

  async getTax(): Promise<string> {
    return this.getText('[data-test="tax"]');
  }

  async getTotalAmount(): Promise<string> {
    return this.getText('[data-test="total-amount"]');
  }

  async proceedToPayment(): Promise<void> {
    await this.click('[data-test="proceed-to-payment"]');
  }
}
}