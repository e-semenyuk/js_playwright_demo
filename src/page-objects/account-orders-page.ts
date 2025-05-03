import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class AccountOrdersPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async isPaginationVisible(): Promise<boolean> {
    return this.isElementVisible('[data-test="pagination-controls"]');
  }

  async navigateToNextPage(): Promise<void> {
    await this.clickElement('[data-test="next-page-button"]');
  }

  async navigateToPreviousPage(): Promise<void> {
    await this.clickElement('[data-test="previous-page-button"]');
  }

  async getCurrentPageNumber(): Promise<string> {
    return this.getText('[data-test="current-page-number"]');
  }
}
