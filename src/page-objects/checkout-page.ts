import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async selectGiftWrapOption(): Promise<void> {
    await this.page.click('[data-test="gift-wrap-option"]');
  }

  async completePurchase(): Promise<void> {
    await this.page.click('[data-test="complete-purchase"]');
  }
}
