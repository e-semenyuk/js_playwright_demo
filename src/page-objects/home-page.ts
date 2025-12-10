import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Navigate to the shopping cart
   */
  async navigateToShoppingCart(): Promise<void> {
    logStep('Navigating to shopping cart');
    await this.click('[data-test="shopping-cart-button"]');
  }

  /**
   * Check if we are on the home screen
   */
  async isHomeScreenDisplayed(): Promise<boolean> {
    return await this.isVisible('[data-test="home-screen"]');
  }
}
