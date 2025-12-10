import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  /**
   * Login with provided credentials
   */
  async login(email: string, password: string): Promise<void> {
    logStep(`Logging in with email: ${email}`);
    await this.fill('[data-test="username"]', email);
    await this.fill('[data-test="password"]', password);
    await this.waitForNavigation(async () => {
      await this.click('[data-test="login-button"]');
    });
  }

  /**
   * Check if user is logged in
   */
  async isLoggedIn(): Promise<boolean> {
    return await this.isVisible('[data-test="user-profile"]');
  }
}
