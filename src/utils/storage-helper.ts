import { Page } from '@playwright/test';
import { logStep, logInfo } from './logger';

/**
 * Storage Helper - Utilities for managing browser storage (localStorage, sessionStorage)
 * JIRA: XPANBFLFA-61
 */

export interface StorageItem {
  key: string;
  value: string;
}

/**
 * Clear all localStorage items
 */
export async function clearLocalStorage(page: Page): Promise<void> {
  logStep('Clearing localStorage');
  await page.evaluate(() => localStorage.clear());
}

/**
 * Clear all sessionStorage items
 */
export async function clearSessionStorage(page: Page): Promise<void> {
  logStep('Clearing sessionStorage');
  await page.evaluate(() => sessionStorage.clear());
}

/**
 * Clear all browser storage (localStorage + sessionStorage)
 */
export async function clearAllStorage(page: Page): Promise<void> {
  logStep('Clearing all browser storage');
  await clearLocalStorage(page);
  await clearSessionStorage(page);
}

/**
 * Get an item from localStorage
 */
export async function getLocalStorageItem(page: Page, key: string): Promise<string | null> {
  logInfo(`Getting localStorage item: ${key}`);
  return await page.evaluate((k) => localStorage.getItem(k), key);
}

/**
 * Get an item from sessionStorage
 */
export async function getSessionStorageItem(page: Page, key: string): Promise<string | null> {
  logInfo(`Getting sessionStorage item: ${key}`);
  return await page.evaluate((k) => sessionStorage.getItem(k), key);
}

/**
 * Set an item in localStorage
 */
export async function setLocalStorageItem(page: Page, key: string, value: string): Promise<void> {
  logInfo(`Setting localStorage item: ${key}`);
  await page.evaluate(({ k, v }) => localStorage.setItem(k, v), { k: key, v: value });
}

/**
 * Set an item in sessionStorage
 */
export async function setSessionStorageItem(page: Page, key: string, value: string): Promise<void> {
  logInfo(`Setting sessionStorage item: ${key}`);
  await page.evaluate(({ k, v }) => sessionStorage.setItem(k, v), { k: key, v: value });
}

/**
 * Remove an item from localStorage
 */
export async function removeLocalStorageItem(page: Page, key: string): Promise<void> {
  logInfo(`Removing localStorage item: ${key}`);
  await page.evaluate((k) => localStorage.removeItem(k), key);
}

/**
 * Remove an item from sessionStorage
 */
export async function removeSessionStorageItem(page: Page, key: string): Promise<void> {
  logInfo(`Removing sessionStorage item: ${key}`);
  await page.evaluate((k) => sessionStorage.removeItem(k), key);
}

/**
 * Get all items from localStorage
 */
export async function getAllLocalStorageItems(page: Page): Promise<StorageItem[]> {
  logInfo('Getting all localStorage items');
  return await page.evaluate(() => {
    const items: StorageItem[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        const value = localStorage.getItem(key);
        if (value) {
          items.push({ key, value });
        }
      }
    }
    return items;
  });
}

/**
 * Get all items from sessionStorage
 */
export async function getAllSessionStorageItems(page: Page): Promise<StorageItem[]> {
  logInfo('Getting all sessionStorage items');
  return await page.evaluate(() => {
    const items: StorageItem[] = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key) {
        const value = sessionStorage.getItem(key);
        if (value) {
          items.push({ key, value });
        }
      }
    }
    return items;
  });
}

/**
 * Check if a specific item exists in localStorage
 */
export async function localStorageHasItem(page: Page, key: string): Promise<boolean> {
  const value = await getLocalStorageItem(page, key);
  return value !== null;
}

/**
 * Check if a specific item exists in sessionStorage
 */
export async function sessionStorageHasItem(page: Page, key: string): Promise<boolean> {
  const value = await getSessionStorageItem(page, key);
  return value !== null;
}

/**
 * Verify that no auth token exists (user is guest)
 * Checks common token storage keys
 */
export async function verifyNoAuthToken(page: Page): Promise<boolean> {
  logStep('Verifying no auth token exists');
  const commonTokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'sessionToken', 'auth_token'];
  
  for (const key of commonTokenKeys) {
    const localValue = await getLocalStorageItem(page, key);
    const sessionValue = await getSessionStorageItem(page, key);
    
    if (localValue || sessionValue) {
      logInfo(`Found token in storage: ${key}`);
      return false;
    }
  }
  
  logInfo('No auth tokens found - user is guest');
  return true;
}

/**
 * Verify that product context has been stored (for post-login redirect)
 * @param expectedProductId - Optional expected product ID to verify
 */
export async function verifyProductContextStored(page: Page, expectedProductId?: string): Promise<boolean> {
  logStep('Verifying product context is stored');
  const commonContextKeys = ['checkoutProductId', 'productContext', 'pendingCheckout', 'checkout_intent'];
  
  for (const key of commonContextKeys) {
    const localValue = await getLocalStorageItem(page, key);
    const sessionValue = await getSessionStorageItem(page, key);
    
    if (localValue || sessionValue) {
      logInfo(`Found product context in storage: ${key}`);
      
      if (expectedProductId) {
        const contextValue = localValue || sessionValue;
        if (contextValue && contextValue.includes(expectedProductId)) {
          logInfo(`Product context matches expected product ID: ${expectedProductId}`);
          return true;
        }
      } else {
        return true;
      }
    }
  }
  
  logInfo('No product context found in storage');
  return false;
}

/**
 * Clear authentication tokens from storage
 */
export async function clearAuthTokens(page: Page): Promise<void> {
  logStep('Clearing authentication tokens');
  const commonTokenKeys = ['authToken', 'token', 'accessToken', 'jwt', 'sessionToken', 'auth_token'];
  
  for (const key of commonTokenKeys) {
    await removeLocalStorageItem(page, key);
    await removeSessionStorageItem(page, key);
  }
  
  logInfo('All auth tokens cleared');
}
