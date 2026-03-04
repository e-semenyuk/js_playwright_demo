import { Page, Locator } from '@playwright/test';
import { logStep } from '../../utils/logger';

/**
 * Page Object for Login/Sign-up Modal
 * Jira: XPANBFLFA-60 - Guest User Redirect to Login at Checkout
 */
export class LoginModal {
  readonly page: Page;
  readonly modal: Locator;
  readonly modalTitle: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly signUpButton: Locator;
  readonly signUpLink: Locator;
  readonly closeButton: Locator;
  readonly errorMessage: Locator;
  readonly backdrop: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Modal container
    this.modal = page.locator('[data-test="login-modal"]');
    this.backdrop = page.locator('[data-test="modal-backdrop"]');
    
    // Modal elements
    this.modalTitle = this.modal.locator('[data-test="modal-title"]');
    this.usernameInput = this.modal.locator('[data-test="username"]');
    this.emailInput = this.modal.locator('[data-test="email"]');
    this.passwordInput = this.modal.locator('[data-test="password"]');
    this.signInButton = this.modal.locator('[data-test="sign-in-button"]');
    this.signUpButton = this.modal.locator('[data-test="sign-up-button"]');
    this.signUpLink = this.modal.locator('[data-test="sign-up-link"]');
    this.closeButton = this.modal.locator('[data-test="close-modal"]');
    this.errorMessage = this.modal.locator('[data-test="error-message"]');
  }

  /**
   * Wait for modal to be visible
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForModalToAppear(timeout?: number): Promise<void> {
    logStep('Waiting for login modal to appear');
    await this.modal.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if modal is visible
   */
  async isModalVisible(): Promise<boolean> {
    logStep('Checking if login modal is visible');
    return await this.modal.isVisible();
  }

  /**
   * Get modal title text
   */
  async getModalTitle(): Promise<string | null> {
    logStep('Getting modal title text');
    return await this.modalTitle.textContent();
  }

  /**
   * Check if sign-in option is available
   */
  async isSignInOptionAvailable(): Promise<boolean> {
    logStep('Checking if sign-in option is available');
    return await this.signInButton.isVisible();
  }

  /**
   * Check if sign-up option is available
   */
  async isSignUpOptionAvailable(): Promise<boolean> {
    logStep('Checking if sign-up option is available');
    const buttonVisible = await this.signUpButton.isVisible().catch(() => false);
    const linkVisible = await this.signUpLink.isVisible().catch(() => false);
    return buttonVisible || linkVisible;
  }

  /**
   * Fill in login credentials
   * @param username - Username or email
   * @param password - Password
   */
  async fillLoginCredentials(username: string, password: string): Promise<void> {
    logStep(`Filling login credentials for user: ${username}`);
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
  }

  /**
   * Click sign-in button
   */
  async clickSignIn(): Promise<void> {
    logStep('Clicking sign-in button');
    await this.signInButton.click();
  }

  /**
   * Click sign-up link or button
   */
  async clickSignUp(): Promise<void> {
    logStep('Clicking sign-up option');
    const buttonVisible = await this.signUpButton.isVisible().catch(() => false);
    if (buttonVisible) {
      await this.signUpButton.click();
    } else {
      await this.signUpLink.click();
    }
  }

  /**
   * Close modal by clicking close button
   */
  async closeModal(): Promise<void> {
    logStep('Closing login modal');
    await this.closeButton.click();
  }

  /**
   * Close modal by clicking backdrop
   */
  async closeModalViaBackdrop(): Promise<void> {
    logStep('Closing modal by clicking backdrop');
    await this.backdrop.click({ position: { x: 10, y: 10 } });
  }

  /**
   * Check if backdrop is visible
   */
  async isBackdropVisible(): Promise<boolean> {
    logStep('Checking if modal backdrop is visible');
    return await this.backdrop.isVisible();
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    logStep('Getting error message from modal');
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is displayed
   */
  async isErrorMessageVisible(): Promise<boolean> {
    logStep('Checking if error message is visible');
    return await this.errorMessage.isVisible();
  }

  /**
   * Wait for modal to disappear
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForModalToDisappear(timeout?: number): Promise<void> {
    logStep('Waiting for login modal to disappear');
    await this.modal.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Verify modal prevents background interaction
   */
  async isBackgroundInteractionBlocked(): Promise<boolean> {
    logStep('Checking if background interaction is blocked');
    // Check if backdrop is visible and covers the page
    const backdropVisible = await this.isBackdropVisible();
    if (!backdropVisible) return false;

    // Check if backdrop has pointer-events enabled
    const backdropStyle = await this.backdrop.evaluate((el) => {
      return window.getComputedStyle(el).pointerEvents;
    });
    
    return backdropStyle !== 'none';
  }
}
