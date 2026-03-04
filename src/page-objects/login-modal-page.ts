import { Page } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * LoginModalPage - Page Object for the Login/Sign-up Modal
 * Triggered when a guest user attempts to check out without authentication.
 */
export class LoginModalPage extends BasePage {
  // Modal container
  private readonly modal = '[data-test="login-modal"]';

  // Modal heading
  private readonly modalHeading = '[data-test="login-modal-heading"]';

  // Sign-in form fields
  private readonly usernameInput = '[data-test="login-modal-username"]';
  private readonly passwordInput = '[data-test="login-modal-password"]';

  // Action buttons
  private readonly signInButton = '[data-test="login-modal-sign-in-button"]';
  private readonly signUpButton = '[data-test="login-modal-sign-up-button"]';
  private readonly closeButton = '[data-test="login-modal-close-button"]';

  // Modal backdrop
  private readonly backdrop = '[data-test="login-modal-backdrop"]';

  constructor(page: Page) {
    super(page);
  }

  /**
   * Check if the login modal is visible
   */
  async isModalVisible(): Promise<boolean> {
    logStep('Checking if login modal is visible');
    return this.isVisible(this.modal);
  }

  /**
   * Get the modal heading text
   */
  async getModalHeading(): Promise<string | null> {
    logStep('Getting login modal heading text');
    return this.getText(this.modalHeading);
  }

  /**
   * Check if Sign In button is visible within the modal
   */
  async isSignInButtonVisible(): Promise<boolean> {
    logStep('Checking if Sign In button is visible');
    return this.isVisible(this.signInButton);
  }

  /**
   * Check if Sign Up button/link is visible within the modal
   */
  async isSignUpButtonVisible(): Promise<boolean> {
    logStep('Checking if Sign Up button/link is visible');
    return this.isVisible(this.signUpButton);
  }

  /**
   * Check if Close button is visible within the modal
   */
  async isCloseButtonVisible(): Promise<boolean> {
    logStep('Checking if Close button is visible');
    return this.isVisible(this.closeButton);
  }

  /**
   * Check if username input field is visible
   */
  async isUsernameInputVisible(): Promise<boolean> {
    logStep('Checking if username input is visible');
    return this.isVisible(this.usernameInput);
  }

  /**
   * Check if password input field is visible
   */
  async isPasswordInputVisible(): Promise<boolean> {
    logStep('Checking if password input is visible');
    return this.isVisible(this.passwordInput);
  }

  /**
   * Check if the backdrop (overlay) is visible behind the modal
   */
  async isBackdropVisible(): Promise<boolean> {
    logStep('Checking if modal backdrop is visible');
    return this.isVisible(this.backdrop);
  }

  /**
   * Dismiss the modal by clicking the close button
   */
  async closeModal(): Promise<void> {
    logStep('Closing login modal via close button');
    await this.click(this.closeButton);
  }

  /**
   * Wait for the modal to be visible
   */
  async waitForModal(): Promise<void> {
    logStep('Waiting for login modal to appear');
    await this.waitForElement(this.modal);
  }

  /**
   * Fill in sign-in credentials
   */
  async fillSignInCredentials(username: string, password: string): Promise<void> {
    logStep(`Filling sign-in credentials for user: ${username}`);
    await this.fill(this.usernameInput, username);
    await this.fill(this.passwordInput, password);
  }

  /**
   * Submit the sign-in form
   */
  async submitSignIn(): Promise<void> {
    logStep('Submitting sign-in form');
    await this.click(this.signInButton);
  }

  /**
   * Click the Sign Up option to switch to sign-up flow
   */
  async clickSignUp(): Promise<void> {
    logStep('Clicking Sign Up option in the modal');
    await this.click(this.signUpButton);
  }
}
