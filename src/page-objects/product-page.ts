import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class ProductPage extends BasePage {
  // Product page elements
  private readonly buyNowButton = '[data-test="buy-now-button"]';
  private readonly addToCartButton = '[data-test="add-to-cart-button"]';
  private readonly cartCount = '[data-test="cart-count"]';
  private readonly userProfileIndicator = '[data-test="user-profile"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Click the "Add to Cart" button
   */
  async addToCart(): Promise<void> {
    logStep('Clicking Add to Cart button');
    await this.click(this.addToCartButton);
  }

  /**
   * Get the current cart item count displayed on the product page
   */
  async getCartCount(): Promise<string> {
    return this.getText(this.cartCount);
  }

  /**
   * Click the "Buy Now" button to initiate checkout
   */
  async clickBuyNow(): Promise<void> {
    logStep('Clicking Buy Now button');
    await this.click(this.buyNowButton);
  }

  /**
   * Check if the "Buy Now" button is visible on the product page
   */
  async isBuyNowButtonVisible(): Promise<boolean> {
    logStep('Checking if Buy Now button is visible');
    return this.isVisible(this.buyNowButton);
  }

  /**
   * Check if a user profile indicator is visible (i.e., user is authenticated)
   */
  async isUserAuthenticated(): Promise<boolean> {
    logStep('Checking if user is authenticated via profile indicator');
    return this.isVisible(this.userProfileIndicator);
  }
}