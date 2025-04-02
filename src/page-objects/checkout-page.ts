import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToCheckout() {
    await this.goto('/checkout');
  }

  async isAddressInputVisible() {
    return this.isVisible('[data-test="address-input"]');
  }

  async isAutoSuggestionsToggleVisible() {
    return this.isVisible('[data-test="auto-suggestions-toggle"]');
  }
}
