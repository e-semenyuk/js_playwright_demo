import { Page, Locator } from '@playwright/test';
import { logStep } from '../../utils/logger';

/**
 * LoginModal Component
 * Represents the login/sign-up modal that appears when guest users attempt to checkout
 * JIRA: XPANBFLFA-61
 */
export class LoginModal {
  private page: Page;
  
  // Locators
  private readonly modalContainer: Locator;
  private readonly modalTitle: Locator;
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly signInButton: Locator;
  private readonly signUpLink: Locator;
  private readonly closeButton: Locator;
  private readonly modalBackdrop: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Initialize locators
    this.modalContainer = page.locator('[data-test="login-modal"]');
    this.modalTitle = page.locator('[data-test="login-modal-title"]');
    this.usernameInput = page.locator('[data-test="login-modal-username"]');
    this.passwordInput = page.locator('[data-test="login-modal-password"]');
    this.signInButton = page.locator('[data-test="login-modal-signin-button"]');
    this.signUpLink = page.locator('[data-test="login-modal-signup-link"]');
    this.closeButton = page.locator('[data-test="login-modal-close"]');
    this.modalBackdrop = page.locator('[data-test="modal-backdrop"]');
  }

  /**
   * Wait for the login modal to be visible
   * @param timeout - Optional timeout in milliseconds
   */
  async waitForModalVisible(timeout?: number): Promise<void> {
    logStep('Waiting for login modal to appear');
    await this.modalContainer.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if the login modal is visible
   */
  async isVisible(): Promise<boolean> {
    logStep('Checking if login modal is visible');
    return await this.modalContainer.isVisible();
  }

  /**
   * Get the modal title text
   */
  async getModalTitle(): Promise<string | null> {
    logStep('Getting modal title text');
    return await this.modalTitle.textContent();
  }

  /**
   * Check if the username input field is visible
   */
  async isUsernameInputVisible(): Promise<boolean> {
    return await this.usernameInput.isVisible();
  }

  /**
   * Check if the password input field is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    return await this.passwordInput.isVisible();
  }

  /**
   * Check if the sign-in button is visible
   */
  async isSignInButtonVisible(): Promise<boolean> {
    return await this.signInButton.isVisible();
  }

  /**
   * Check if the sign-up link/button is visible
   */
  async isSignUpLinkVisible(): Promise<boolean> {
    return await this.signUpLink.isVisible();
  }

  /**
   * Check if the close button is visible
   */
  async isCloseButtonVisible(): Promise<boolean> {
    return await this.closeButton.isVisible();
  }

  /**
   * Check if the modal backdrop is visible
   */
  async isBackdropVisible(): Promise<boolean> {
    return await this.modalBackdrop.isVisible();
  }

  /**
   * Fill in the username field
   * @param username - Username to enter
   */
  async fillUsername(username: string): Promise<void> {
    logStep(`Filling username: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Fill in the password field
   * @param password - Password to enter
   */
  async fillPassword(password: string): Promise<void> {
    logStep('Filling password');
    await this.passwordInput.fill(password);
  }

  /**
   * Click the sign-in button
   */
  async clickSignIn(): Promise<void> {
    logStep('Clicking sign-in button');
    await this.signInButton.click();
  }

  /**
   * Click the sign-up link
   */
  async clickSignUp(): Promise<void> {
    logStep('Clicking sign-up link');
    await this.signUpLink.click();
  }

  /**
   * Close the modal by clicking the close button
   */
  async closeModal(): Promise<void> {
    logStep('Closing login modal');
    await this.closeButton.click();
  }

  /**
   * Dismiss the modal by clicking outside (on backdrop)
   */
  async dismissByBackdrop(): Promise<void> {
    logStep('Dismissing modal by clicking backdrop');
    await this.modalBackdrop.click({ position: { x: 10, y: 10 } });
  }

  /**
   * Perform a complete login action
   * @param username - Username for login
   * @param password - Password for login
   */
  async login(username: string, password: string): Promise<void> {
    logStep(`Logging in with username: ${username}`);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  /**
   * Verify modal is displayed with all expected elements
   */
  async verifyModalStructure(): Promise<{
    modalVisible: boolean;
    titleVisible: boolean;
    usernameVisible: boolean;
    passwordVisible: boolean;
    signInVisible: boolean;
    signUpVisible: boolean;
  }> {
    logStep('Verifying login modal structure');
    return {
      modalVisible: await this.isVisible(),
      titleVisible: await this.modalTitle.isVisible(),
      usernameVisible: await this.isUsernameInputVisible(),
      passwordVisible: await this.isPasswordInputVisible(),
      signInVisible: await this.isSignInButtonVisible(),
      signUpVisible: await this.isSignUpLinkVisible()
    };
  }

  /**
   * Wait for modal to be hidden (after successful login or dismissal)
   */
  async waitForModalHidden(timeout?: number): Promise<void> {
    logStep('Waiting for login modal to disappear');
    await this.modalContainer.waitFor({ state: 'hidden', timeout });
  }
}
