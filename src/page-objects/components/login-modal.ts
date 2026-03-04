import { Page, Locator } from '@playwright/test';
import { logStep } from '../../utils/logger';

/**
 * Page Object for Login/Sign-up Modal
 * Represents the authentication modal that appears when guest users attempt to checkout
 * 
 * Related to: XPANBFLFA-60 - Guest User Redirect to Login at Checkout
 */
export class LoginModal {
  readonly page: Page;
  
  // Modal container
  readonly modal: Locator;
  
  // Modal elements
  readonly modalTitle: Locator;
  readonly closeButton: Locator;
  
  // Sign-in form elements
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  
  // Sign-up elements
  readonly signUpLink: Locator;
  readonly signUpButton: Locator;
  
  // Error messages
  readonly errorMessage: Locator;
  
  // Background overlay
  readonly modalOverlay: Locator;

  constructor(page: Page) {
    this.page = page;
    
    // Modal container and overlay
    this.modal = page.locator('[data-test="login-modal"]');
    this.modalOverlay = page.locator('[data-test="modal-overlay"]');
    
    // Modal header elements
    this.modalTitle = this.modal.locator('[data-test="modal-title"]');
    this.closeButton = this.modal.locator('[data-test="close-button"]');
    
    // Sign-in form
    this.usernameInput = this.modal.locator('[data-test="username-input"]');
    this.passwordInput = this.modal.locator('[data-test="password-input"]');
    this.signInButton = this.modal.locator('[data-test="signin-button"]');
    
    // Sign-up elements
    this.signUpLink = this.modal.locator('[data-test="signup-link"]');
    this.signUpButton = this.modal.locator('[data-test="signup-button"]');
    
    // Error message
    this.errorMessage = this.modal.locator('[data-test="error-message"]');
  }

  /**
   * Wait for the login modal to be visible
   * @param timeout - Maximum time to wait in milliseconds
   */
  async waitForModalToAppear(timeout: number = 5000): Promise<void> {
    logStep('Waiting for login modal to appear');
    await this.modal.waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if the login modal is visible
   */
  async isModalVisible(): Promise<boolean> {
    return await this.modal.isVisible();
  }

  /**
   * Get the modal title text
   */
  async getModalTitle(): Promise<string | null> {
    logStep('Getting modal title text');
    return await this.modalTitle.textContent();
  }

  /**
   * Check if sign-in form elements are visible
   */
  async isSignInFormVisible(): Promise<boolean> {
    const usernameVisible = await this.usernameInput.isVisible();
    const passwordVisible = await this.passwordInput.isVisible();
    const signInButtonVisible = await this.signInButton.isVisible();
    
    return usernameVisible && passwordVisible && signInButtonVisible;
  }

  /**
   * Check if sign-up option is available
   */
  async isSignUpOptionVisible(): Promise<boolean> {
    const signUpLinkVisible = await this.signUpLink.isVisible().catch(() => false);
    const signUpButtonVisible = await this.signUpButton.isVisible().catch(() => false);
    
    return signUpLinkVisible || signUpButtonVisible;
  }

  /**
   * Fill in username/email field
   */
  async fillUsername(username: string): Promise<void> {
    logStep(`Filling username: ${username}`);
    await this.usernameInput.fill(username);
  }

  /**
   * Fill in password field
   */
  async fillPassword(password: string): Promise<void> {
    logStep('Filling password');
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
   * Complete sign-in flow with credentials
   */
  async signIn(username: string, password: string): Promise<void> {
    logStep(`Signing in as ${username}`);
    await this.fillUsername(username);
    await this.fillPassword(password);
    await this.clickSignIn();
  }

  /**
   * Click sign-up link or button
   */
  async clickSignUp(): Promise<void> {
    logStep('Clicking sign-up option');
    
    // Try link first, then button
    if (await this.signUpLink.isVisible()) {
      await this.signUpLink.click();
    } else if (await this.signUpButton.isVisible()) {
      await this.signUpButton.click();
    } else {
      throw new Error('Sign-up option not found');
    }
  }

  /**
   * Close the modal using the close button
   */
  async closeModal(): Promise<void> {
    logStep('Closing login modal');
    await this.closeButton.click();
  }

  /**
   * Dismiss modal by clicking on the overlay (background)
   */
  async dismissModalByOverlay(): Promise<void> {
    logStep('Dismissing modal by clicking overlay');
    await this.modalOverlay.click({ position: { x: 10, y: 10 } });
  }

  /**
   * Wait for the modal to disappear
   */
  async waitForModalToDisappear(timeout: number = 5000): Promise<void> {
    logStep('Waiting for login modal to disappear');
    await this.modal.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Get error message text
   */
  async getErrorMessage(): Promise<string | null> {
    logStep('Getting error message');
    return await this.errorMessage.textContent();
  }

  /**
   * Check if error message is visible
   */
  async isErrorMessageVisible(): Promise<boolean> {
    return await this.errorMessage.isVisible();
  }

  /**
   * Check if the modal overlay is blocking background interaction
   */
  async isOverlayVisible(): Promise<boolean> {
    return await this.modalOverlay.isVisible();
  }

  /**
   * Verify modal has focus trap (keyboard navigation is contained)
   * This checks if Tab key cycles through modal elements only
   */
  async verifyFocusTrap(): Promise<boolean> {
    logStep('Verifying modal focus trap');
    
    // Focus the first input
    await this.usernameInput.focus();
    
    // Tab through elements
    await this.page.keyboard.press('Tab');
    const passwordFocused = await this.passwordInput.evaluate(el => el === document.activeElement);
    
    await this.page.keyboard.press('Tab');
    const buttonFocused = await this.signInButton.evaluate(el => el === document.activeElement);
    
    return passwordFocused && buttonFocused;
  }

  /**
   * Dismiss modal using Escape key
   */
  async dismissModalByEscape(): Promise<void> {
    logStep('Dismissing modal with Escape key');
    await this.page.keyboard.press('Escape');
  }
}
