import { Page } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto('/checkout');
  }

  async toggleAutoSuggestions(enable: boolean) {
    const toggleState = await this.page.isChecked('[data-test="auto-suggestions-toggle"]');
    if (toggleState !== enable) {
      await this.page.click('[data-test="auto-suggestions-toggle"]');
    }
  }

  async enterAddress(address: string) {
    await this.page.fill('[data-test="address-input"]', address);
  }

  async isApiCalled(): Promise<boolean> {
    // Implement the logic to check if API calls are made
    // This can be done using network request interception in Playwright
    // Example:
    let apiCalled = false;
    this.page.on('request', request => {
      if (request.url().includes('address-suggestion-api-endpoint')) {
        apiCalled = true;
      }
    });
    return apiCalled;
  }
}
