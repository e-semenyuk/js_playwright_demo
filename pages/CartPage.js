class CartPage {
  constructor(page) {
    this.page = page;
    this.cartItem = page.locator('[data-test="cart-item"]');
    this.itemName = page.locator('[data-test="inventory-item-name"]');
    this.itemPrice = page.locator('[data-test="inventory-item-price"]');
    this.itemQuantity = page.locator('[data-test="item-quantity"]');
  }

  async verifyCartItem(expectedDetails) {
    await expect(this.itemName).toHaveText(expectedDetails.title);
    await expect(this.itemPrice).toHaveText(expectedDetails.price);
    await expect(this.itemQuantity).toHaveText('1');
  }
}

module.exports = CartPage;