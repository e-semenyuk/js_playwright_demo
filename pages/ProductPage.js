class ProductPage {
  constructor(page) {
    this.page = page;
    this.productTitle = page.locator('[data-test="product-name"]');
    this.productPrice = page.locator('[data-test="product-price"]');
    this.addToCartButton = page.locator('[data-test="add-to-cart"]');
    this.cartBadge = page.locator('[data-test="shopping-cart-badge"]');
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async getProductDetails() {
    return {
      title: await this.productTitle.textContent(),
      price: await this.productPrice.textContent()
    };
  }
}

module.exports = ProductPage;