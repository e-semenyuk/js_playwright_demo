import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class ProductPage extends BasePage {
  private readonly addToCartButton: Locator;
  private readonly cartIcon: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('[data-test="add-to-cart-button"]');
    this.cartIcon = page.locator('[data-test="cart-icon"]');
  }

  /**
   * Add product to cart
   */
  async addToCart() {
    logStep('Adding product to cart');
    await this.click(this.addToCartButton);
  }

  /**
   * Get cart item count
   */
  async getCartItemCount(): Promise<string | null> {
    return await this.getText(this.cartIcon);
  }
}
