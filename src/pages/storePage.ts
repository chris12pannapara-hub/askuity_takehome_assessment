class StorePage {
  // Selectors
  private sizeFilterMenu = "//*[@id='root']/div/main/div/div[1]/h4";
  private sizeXS = "//*[@id='root']/div/main/div/div[1]/div[1]";
  private sizeML = "//*[@id='root']/div/main/div/div[1]/div[4]";
  private productGrid = "//*[@id='root']/div/main/main/div";
  private productCount = "//*[@id='root']/div/main/main/main/p";
  private blueTShirt = "//div[contains(text(), 'Blue T-Shirt')]";
  private blackTShirtWhiteStripes = "//div[contains(text(), 'Black T-Shirt with white stripes')]";
  private addToCartButton = ".add-to-cart-btn | button:has-text('Add to Cart')";
  private cartIcon = "//button[@data-testid='cart-icon'] | .cart-icon";
  private cartPanel = "//div[@data-testid='cart-panel'] | .cart-panel";
  private cartItems = "//div[@data-testid='cart-item']";
  private blueTShirtInCart = "//span[contains(text(), 'Blue T-Shirt')]";
  private increaseQuantityButton = "//button[@data-testid='increase-qty'] | button:has-text('+')";
  private cartSubtotal = "//span[@data-testid='subtotal'] | .subtotal-amount";
  private removeItemButton = "//button[@data-testid='remove-item'] | button:has-text('X')";
  private clearCartButton = "//button[@data-testid='clear-cart'] | button:has-text('Clear Cart')";
  private emptyCartMessage = "//div[@data-testid='empty-cart'] | .empty-cart-message";

  async open() {
    await browser.url("https://automation-interview.vercel.app/");
  }

  async checkSizeFilter(): Promise<string> {
    const sizeFilterBtn = await $(this.sizeFilterMenu);
    return await sizeFilterBtn.getText();
  }

  async selectSizeXS() {
    const xsCheckbox = await $(this.sizeXS);
    await xsCheckbox.click();
  }

  async selectSizeML() {
    const mlCheckbox = await $(this.sizeML);
    await mlCheckbox.click();
  }

  async getProductCount(): Promise<number> {
    const productCountText = await $(this.productCount).getText();
    // Extract number from text like "5 Product(s) found"
    const match = productCountText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async getVisibleProductCount(): Promise<number> {
    const products = await $$(this.productGrid);
    return products.length;
  }

  async addBlueTShirtToCart() {
    const product = await $(this.blueTShirt);
    await product.scrollIntoView();
    const addBtn = await product.$("..//" + this.addToCartButton);
    await addBtn.click();
  }

  async addBlackTShirtWithStripesToCart() {
    const product = await $(this.blackTShirtWhiteStripes);
    await product.scrollIntoView();
    const addBtn = await product.$("..//" + this.addToCartButton);
    await addBtn.click();
  }

  async openCart() {
    const cartBtn = await $(this.cartIcon);
    await cartBtn.click();
    await browser.pause(500); // Wait for panel to open
  }

  async getCartItemCount(): Promise<number> {
    const items = await $$(this.cartItems);
    return items.length;
  }

  async increaseBlueTShirtQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {
      // Find Blue T-Shirt item first
      const blueTShirtItem = await $(this.blueTShirtInCart);
      await blueTShirtItem.scrollIntoView();
      
      // Find the increase button for this item
      const increaseBtn = await blueTShirtItem.$("../../" + this.increaseQuantityButton);
      await increaseBtn.click();
      await browser.pause(300); // Brief pause between clicks
    }
  }

  async getCartSubtotal(): Promise<number> {
    const subtotalText = await $(this.cartSubtotal).getText();
    // Extract number from text like "$49.99" or "49.99"
    const match = subtotalText.replace(/[^\d.]/g, '');
    return parseFloat(match);
  }

  async getProductPriceInCart(productName: string): Promise<number> {
    const productItem = await $(`//span[contains(text(), '${productName}')]`);
    const priceText = await productItem.$("../../span[@data-testid='price']").getText();
    const match = priceText.replace(/[^\d.]/g, '');
    return parseFloat(match);
  }

  async removeAllItems() {
    const removeButtons = await $$(this.removeItemButton);
    for (let i = await removeButtons.length - 1; i >= 0; i--) {
      await removeButtons[i].click();
      await browser.pause(300);
    }
  }

  async clearCart() {
    const clearBtn = $(this.clearCartButton);
    if (await clearBtn.isDisplayed()) {
      await clearBtn.click();
    }
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      const emptyMsg = await $(this.emptyCartMessage);
      return await emptyMsg.isDisplayed();
    } catch {
      return false;
    }
  }

  async getCartSubtotalAmount(): Promise<string> {
    const subtotal = await $(this.cartSubtotal).getText();
    return subtotal;
  }
}

export default new StorePage();
