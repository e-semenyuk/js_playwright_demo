import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Locator for the 'Enable Auto-Suggestions' toggle switch
   */
  get autoSuggestionsToggle() {
    return this.page.locator('input#auto-suggestions-toggle');
  }

  /**
   * Check if the 'Enable Auto-Suggestions' toggle switch is present
   */
  async isAutoSuggestionsTogglePresent(): Promise<boolean> {
    return await this.isVisible(this.autoSuggestionsToggle);
  }
}
