import { Page, BrowserContext } from '@playwright/test';
import { logInfo, logStep } from './logger';

/**
 * Authentication Helper Utility
 * Provides methods to manage authentication state for testing
 * 
 * Related to: XPANBFLFA-60 - Guest User Redirect to Login at Checkout
 */
export class AuthHelper {
  /**
   * Clear all authentication tokens and session data
   * Ensures the user is in a guest (unauthenticated) state
   */
  static async clearAuthState(page: Page): Promise<void> {
    logStep('Clearing authentication state');
    
    await page.evaluate(() => {
      // Clear localStorage
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();
      
      // Clear any auth-related items specifically
      localStorage.removeItem('authToken');
      localStorage.removeItem('sessionToken');
      localStorage.removeItem('jwt');
      localStorage.removeItem('user');
      
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('sessionToken');
      sessionStorage.removeItem('jwt');
      sessionStorage.removeItem('user');
    });
    
    // Clear cookies
    const context = page.context();
    await context.clearCookies();
    
    logInfo('Authentication state cleared - user is now a guest');
  }

  /**
   * Set authentication token in storage
   * Simulates an authenticated user state
   */
  static async setAuthToken(page: Page, token: string, storageType: 'local' | 'session' = 'local'): Promise<void> {
    logStep(`Setting auth token in ${storageType}Storage`);
    
    await page.evaluate(({ token, storageType }) => {
      const storage = storageType === 'local' ? localStorage : sessionStorage;
      storage.setItem('authToken', token);
      storage.setItem('sessionToken', token);
    }, { token, storageType });
    
    logInfo('Authentication token set - user is now authenticated');
  }

  /**
   * Check if user is authenticated by verifying token presence
   */
  static async isAuthenticated(page: Page): Promise<boolean> {
    logStep('Checking authentication status');
    
    const hasToken = await page.evaluate(() => {
      const localToken = localStorage.getItem('authToken') || localStorage.getItem('sessionToken');
      const sessionToken = sessionStorage.getItem('authToken') || sessionStorage.getItem('sessionToken');
      
      return !!(localToken || sessionToken);
    });
    
    logInfo(`User authentication status: ${hasToken ? 'authenticated' : 'guest'}`);
    return hasToken;
  }

  /**
   * Get stored product context (for checkout flow)
   * Returns product ID and checkout intent stored during guest checkout attempt
   */
  static async getStoredProductContext(page: Page): Promise<{ productId: string | null; intent: string | null }> {
    logStep('Retrieving stored product context');
    
    const context = await page.evaluate(() => {
      const productId = sessionStorage.getItem('checkoutProductId') || localStorage.getItem('checkoutProductId');
      const intent = sessionStorage.getItem('checkoutIntent') || localStorage.getItem('checkoutIntent');
      
      return { productId, intent };
    });
    
    logInfo(`Product context: ${JSON.stringify(context)}`);
    return context;
  }

  /**
   * Verify that product context is stored after guest attempts checkout
   */
  static async hasStoredProductContext(page: Page, expectedProductId?: string): Promise<boolean> {
    const context = await this.getStoredProductContext(page);
    
    if (!context.productId || !context.intent) {
      return false;
    }
    
    if (expectedProductId) {
      return context.productId === expectedProductId && context.intent === 'checkout';
    }
    
    return !!context.productId && context.intent === 'checkout';
  }

  /**
   * Clear stored product context
   */
  static async clearProductContext(page: Page): Promise<void> {
    logStep('Clearing product context');
    
    await page.evaluate(() => {
      sessionStorage.removeItem('checkoutProductId');
      sessionStorage.removeItem('checkoutIntent');
      localStorage.removeItem('checkoutProductId');
      localStorage.removeItem('checkoutIntent');
    });
    
    logInfo('Product context cleared');
  }

  /**
   * Set up guest user state (no authentication)
   * This is a convenience method that clears auth and product context
   */
  static async setupGuestUser(page: Page): Promise<void> {
    logInfo('Setting up guest user state');
    await this.clearAuthState(page);
    await this.clearProductContext(page);
  }

  /**
   * Set up authenticated user state with a mock token
   */
  static async setupAuthenticatedUser(page: Page, token: string = 'mock-auth-token-12345'): Promise<void> {
    logInfo('Setting up authenticated user state');
    await this.clearAuthState(page);
    await this.setAuthToken(page, token);
  }

  /**
   * Get all cookies for debugging
   */
  static async getAllCookies(page: Page): Promise<any[]> {
    const context = page.context();
    const cookies = await context.cookies();
    logInfo(`Current cookies: ${JSON.stringify(cookies, null, 2)}`);
    return cookies;
  }

  /**
   * Get all localStorage items for debugging
   */
  static async getAllLocalStorage(page: Page): Promise<Record<string, string>> {
    const storage = await page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key) {
          items[key] = localStorage.getItem(key) || '';
        }
      }
      return items;
    });
    
    logInfo(`Current localStorage: ${JSON.stringify(storage, null, 2)}`);
    return storage;
  }

  /**
   * Get all sessionStorage items for debugging
   */
  static async getAllSessionStorage(page: Page): Promise<Record<string, string>> {
    const storage = await page.evaluate(() => {
      const items: Record<string, string> = {};
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key) {
          items[key] = sessionStorage.getItem(key) || '';
        }
      }
      return items;
    });
    
    logInfo(`Current sessionStorage: ${JSON.stringify(storage, null, 2)}`);
    return storage;
  }
}
