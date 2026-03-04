import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * ProductPage - Page Object for product detail page
 * JIRA: XPANBFLFA-61
 */
export class ProductPage extends BasePage {
  // Locators
  private readonly buyNowButton: Locator;
  private readonly addToCartButton: Locator;
  private readonly cartCount: Locator;
  private readonly productTitle: Locator;
  private readonly productPrice: Locator;
  private readonly productImage: Locator;
  private readonly productDescription: Locator;

  constructor(page: Page) {
    super(page);
    
    // Initialize locators
    this.buyNowButton = page.locator('[data-test="buy-now-button"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart-button"]');
    this.cartCount = page.locator('[data-test="cart-count"]');
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.productImage = page.locator('[data-test="product-image"]');
    this.productDescription = page.locator('[data-test="product-description"]');
  }

  /**
   * Navigate to a specific product page
   * @param productId - The ID of the product
   */
  async navigateToProduct(productId: string): Promise<void> {
    logStep(`Navigating to product page: ${productId}`);
    await this.goto(`/product/${productId}`);
  }

  /**
   * Click the "Buy Now" button
   * This should trigger checkout flow or login modal for guest users
   */
  async clickBuyNow(): Promise<void> {
    logStep('Clicking Buy Now button');
    await this.buyNowButton.click();
  }

  /**
   * Check if "Buy Now" button is visible
   */
  async isBuyNowButtonVisible(): Promise<boolean> {
    return await this.buyNowButton.isVisible();
  }

  /**
   * Check if product page is loaded correctly
   */
  async isProductPageLoaded(): Promise<boolean> {
    logStep('Checking if product page is loaded');
    return await this.productTitle.isVisible() && 
           await this.productPrice.isVisible() &&
           await this.buyNowButton.isVisible();
  }

  /**
   * Get product title text
   */
  async getProductTitle(): Promise<string | null> {
    return await this.productTitle.textContent();
  }

  /**
   * Get product price text
   */
  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  /**
   * Add product to cart (existing functionality)
   */
  async addToCart(): Promise<void> {
    logStep('Adding product to cart');
    await this.addToCartButton.click();
  }

  /**
   * Get cart count (existing functionality)
   */
  async getCartCount(): Promise<string | null> {
    return await this.cartCount.textContent();
  }

  /**
   * Wait for product page to be fully loaded
   */
  async waitForProductPageLoad(): Promise<void> {
    logStep('Waiting for product page to load');
    await this.productTitle.waitFor({ state: 'visible' });
    await this.buyNowButton.waitFor({ state: 'visible' });
  }
}