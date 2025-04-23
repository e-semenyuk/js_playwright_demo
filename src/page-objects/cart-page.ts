import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class CartPage extends BasePage {
  private readonly productName: Locator;
  private readonly productPrice: Locator;
  private readonly productQuantity: Locator;

  constructor(page: Page) {
    super(page);
    this.productName = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.productQuantity = page.locator('[data-test="product-quantity"]');
  }

  async getProductName(): Promise<string | null> {
    return await this.getText(this.productName);
  }

  async getProductPrice(): Promise<string | null> {
    return await this.getText(this.productPrice);
  }

  async getProductQuantity(): Promise<string | null> {
    return await this.getText(this.productQuantity);
  }
}