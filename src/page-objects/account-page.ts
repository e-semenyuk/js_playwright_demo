import { Page } from '@playwright/test';
import { BasePage } from './base-page';

export class AccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToOrders() {
    await this.goto('/account/orders');
  }

  async isLoginPage() {
    return this.getTitle().then(title => title.includes('Login'));
  }
}
