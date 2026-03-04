import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Product Page
 * Represents a single product detail page with add to cart and buy now functionality
 */
export class ProductPage extends BasePage {
  // Existing locators
  readonly addToCartButton: Locator;
  readonly cartCount: Locator;
  
  // New locators for checkout flow (XPANBFLFA-60)
  readonly buyNowButton: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  readonly productDescription: Locator;

  constructor(page: Page) {
    super(page);
    
    // Existing locators
    this.addToCartButton = page.locator('[data-test="add-to-cart-button"]');
    this.cartCount = page.locator('[data-test="cart-count"]');
    
    // New locators for checkout flow
    this.buyNowButton = page.locator('[data-test="buy-now-button"]');
    this.productTitle = page.locator('[data-test="product-title"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.productImage = page.locator('[data-test="product-image"]');
    this.productDescription = page.locator('[data-test="product-description"]');
  }

  /**
   * Add product to cart (existing functionality)
   */
  async addToCart(): Promise<void> {
    await this.click(this.addToCartButton);
  }

  /**
   * Get cart count (existing functionality)
   */
  async getCartCount(): Promise<string> {
    return this.getText(this.cartCount);
  }

  /**
   * Click "Buy Now" button to initiate checkout
   * Related to: XPANBFLFA-60 - Guest User Redirect to Login at Checkout
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
   * Get product title
   */
  async getProductTitle(): Promise<string | null> {
    return await this.productTitle.textContent();
  }

  /**
   * Get product price
   */
  async getProductPrice(): Promise<string | null> {
    return await this.productPrice.textContent();
  }

  /**
   * Check if product page is fully loaded
   */
  async isProductPageLoaded(): Promise<boolean> {
    const titleVisible = await this.productTitle.isVisible();
    const priceVisible = await this.productPrice.isVisible();
    const buyNowVisible = await this.buyNowButton.isVisible();
    
    return titleVisible && priceVisible && buyNowVisible;
  }

  /**
   * Navigate to a specific product by ID
   */
  async navigateToProduct(productId: string): Promise<void> {
    logStep(`Navigating to product: ${productId}`);
    await this.goto(`/products/${productId}`);
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