import { Page, Locator } from '@playwright/test';
import { BasePage } from './base-page';
import { logStep } from '../utils/logger';

/**
 * Page Object for Checkout Page
 * Represents the checkout screen where users finalize their order
 * 
 * Related to: XPANBFLFA-60 - Guest User Redirect to Login at Checkout
 * Related to: US-2 - Checkout Screen with Product Details, Quantity, Address, Delivery Options
 */
export class CheckoutPage extends BasePage {
  // Page identifier
  readonly checkoutContainer: Locator;
  readonly pageTitle: Locator;
  
  // Product details
  readonly productName: Locator;
  readonly productPrice: Locator;
  readonly productImage: Locator;
  
  // Quantity selector
  readonly quantityInput: Locator;
  readonly quantityIncrement: Locator;
  readonly quantityDecrement: Locator;
  
  // Address selection
  readonly addressSelector: Locator;
  readonly addAddressButton: Locator;
  
  // Delivery options
  readonly deliveryOptionsContainer: Locator;
  readonly standardDeliveryOption: Locator;
  readonly expressDeliveryOption: Locator;
  
  // Promo code
  readonly promoCodeInput: Locator;
  readonly applyPromoButton: Locator;
  readonly promoErrorMessage: Locator;
  
  // Price breakdown
  readonly basePrice: Locator;
  readonly deliveryFee: Locator;
  readonly discount: Locator;
  readonly totalPrice: Locator;
  
  // Actions
  readonly placeOrderButton: Locator;

  constructor(page: Page) {
    super(page);
    
    // Page identifier
    this.checkoutContainer = page.locator('[data-test="checkout-container"]');
    this.pageTitle = page.locator('[data-test="checkout-title"]');
    
    // Product details
    this.productName = page.locator('[data-test="checkout-product-name"]');
    this.productPrice = page.locator('[data-test="checkout-product-price"]');
    this.productImage = page.locator('[data-test="checkout-product-image"]');
    
    // Quantity
    this.quantityInput = page.locator('[data-test="quantity-input"]');
    this.quantityIncrement = page.locator('[data-test="quantity-increment"]');
    this.quantityDecrement = page.locator('[data-test="quantity-decrement"]');
    
    // Address
    this.addressSelector = page.locator('[data-test="address-selector"]');
    this.addAddressButton = page.locator('[data-test="add-address-button"]');
    
    // Delivery options
    this.deliveryOptionsContainer = page.locator('[data-test="delivery-options"]');
    this.standardDeliveryOption = page.locator('[data-test="delivery-standard"]');
    this.expressDeliveryOption = page.locator('[data-test="delivery-express"]');
    
    // Promo code
    this.promoCodeInput = page.locator('[data-test="promo-code-input"]');
    this.applyPromoButton = page.locator('[data-test="apply-promo-button"]');
    this.promoErrorMessage = page.locator('[data-test="promo-error"]');
    
    // Price breakdown
    this.basePrice = page.locator('[data-test="base-price"]');
    this.deliveryFee = page.locator('[data-test="delivery-fee"]');
    this.discount = page.locator('[data-test="discount"]');
    this.totalPrice = page.locator('[data-test="total-price"]');
    
    // Actions
    this.placeOrderButton = page.locator('[data-test="place-order-button"]');
  }

  /**
   * Check if checkout page is loaded
   */
  async isCheckoutPageLoaded(): Promise<boolean> {
    logStep('Checking if checkout page is loaded');
    return await this.checkoutContainer.isVisible();
  }

  /**
   * Wait for checkout page to load
   */
  async waitForCheckoutPageLoad(timeout: number = 5000): Promise<void> {
    logStep('Waiting for checkout page to load');
    await this.checkoutContainer.waitFor({ state: 'visible', timeout });
  }

  /**
   * Get page title
   */
  async getPageTitle(): Promise<string | null> {
    return await this.pageTitle.textContent();
  }

  /**
   * Get product name on checkout page
   */
  async getProductName(): Promise<string | null> {
    return await this.productName.textContent();
  }

  /**
   * Get current quantity
   */
  async getQuantity(): Promise<string> {
    return await this.quantityInput.inputValue();
  }

  /**
   * Set quantity
   */
  async setQuantity(quantity: number): Promise<void> {
    logStep(`Setting quantity to ${quantity}`);
    await this.quantityInput.fill(quantity.toString());
  }

  /**
   * Check if place order button is enabled
   */
  async isPlaceOrderButtonEnabled(): Promise<boolean> {
    return await this.placeOrderButton.isEnabled();
  }

  /**
   * Click place order button
   */
  async clickPlaceOrder(): Promise<void> {
    logStep('Clicking place order button');
    await this.placeOrderButton.click();
  }

  /**
   * Navigate to checkout page directly (for testing)
   */
  async navigateToCheckout(): Promise<void> {
    logStep('Navigating to checkout page');
    await this.goto('/checkout');
  }
}
