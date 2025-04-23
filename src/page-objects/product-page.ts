import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class ProductPage extends BasePage {
  private readonly addToCartButton: Locator;
  private readonly cartIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('[data-test="add-to-cart-button"]');
    this.cartIcon = page.locator('[data-test="shopping-cart-icon"]');
  }

  async addProductToCart(): Promise<void> {
    logStep('Adding product to cart');
    await this.click(this.addToCartButton);
  }

  async getCartItemCount(): Promise<string | null> {
    return await this.getText(this.cartIcon);
  }
}