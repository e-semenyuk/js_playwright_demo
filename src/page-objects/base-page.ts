import { Page, Locator } from '@playwright/test';
import { logStep } from '../utils/logger';

export class BasePage {
  constructor(protected page: Page) {}

  /**
   * Navigate to a specific URL
   */
  async goto(path: string) {
    logStep(`Navigating to ${path}`);
    await this.page.goto(path);
  }

  /**
   * Wait for navigation after an action
   */
  async waitForNavigation(callback: () => Promise<void>) {
    await Promise.all([
      this.page.waitForLoadState('networkidle'),
      callback()
    ]);
  }

  /**
   * Get page title
   */
  async getTitle(): Promise<string> {
    return await this.page.title();
  }

  /**
   * Fill input field
   */
  async fill(locator: Locator | string, value: string) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logStep(`Filling ${value} into ${element}`);
    await element.fill(value);
  }

  /**
   * Click element
   */
  async click(locator: Locator | string) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    logStep(`Clicking ${element}`);
    await element.click();
  }

  /**
   * Check if element is visible
   */
  async isVisible(locator: Locator | string): Promise<boolean> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.isVisible();
  }

  /**
   * Get text content
   */
  async getText(locator: Locator | string): Promise<string | null> {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    return await element.textContent();
  }

  /**
   * Wait for element to be visible
   */
  async waitForElement(locator: Locator | string, timeout?: number) {
    const element = typeof locator === 'string' ? this.page.locator(locator) : locator;
    await element.waitFor({ state: 'visible', timeout });
  }

  /**
   * Take screenshot
   */
  async takeScreenshot(name: string) {
    logStep(`Taking screenshot: ${name}`);
    await this.page.screenshot({ path: `reports/screenshots/${name}.png` });
  }
}