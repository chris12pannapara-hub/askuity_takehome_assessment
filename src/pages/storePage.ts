
import { storePageSelectors } from "../selectors/storePageSelectors";

class StorePage {
  async open() {
    await browser.url("https://automation-interview.vercel.app/");
  }

  async checkSizeFilter(): Promise<string> {
    const sizeFilterBtn = await $(storePageSelectors.sizeFilterMenu);
    return await sizeFilterBtn.getText();
  }

  async selectSizeXS() {
    const xsCheckbox = await $(storePageSelectors.sizeXS);
    await xsCheckbox.click();
  }

  async selectSizeML() {
    const mlCheckbox = await $(storePageSelectors.sizeML);
    await mlCheckbox.click();
  }

  async getProductCount(): Promise<number> {
    const productCountText = await $(storePageSelectors.productCount).getText();
    // Extract number from text like "5 Product(s) found"
    const match = productCountText.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  async getVisibleProductCount(): Promise<number> {
    const products = await $$(storePageSelectors.productGrid);
    return products.length;
  }

  async addBlueTShirtToCart() {
    const product = await $(storePageSelectors.addblueTShirtbtn);
    await product.scrollIntoView();
    await product.click();
  }

  async addBlackTShirtWithStripesToCart() {
    const product = await $(storePageSelectors.addblackTShirtWhiteStripesbtn);
    await product.scrollIntoView();
    await product.click();
  }

  async openCart() {
    // Check if cart panel is already open
    const cartPanel = await $(storePageSelectors.cartPanel);
    const isCartOpen = await cartPanel.isDisplayed().catch(() => false);
    await browser.pause(500);
    
    if (!isCartOpen) {
      // Cart is not open, so click the cart button to open it
      const cartBtn = await $(storePageSelectors.cartIconbtn);
      await cartBtn.click();
      await browser.pause(500); // Wait for panel to open
    }
  }
  async getDistinctCartItemCount(): Promise<number> {
    const items = await $$(storePageSelectors.cartItemsDistinct);
    return items.length;
  }
  async getCartItemCount(): Promise<number> {
    const cartIcon = await $(storePageSelectors.cartItems);
    await cartIcon.waitForExist({ timeout: 10000 });
    const cartcount = await cartIcon.getText();
    return parseInt(cartcount, 10);
  }
  async getCartItemNames(): Promise<string[]> {
  await $(storePageSelectors.cartPanel).waitForExist({ timeout: 10000 });
  const nameElements = await $$(storePageSelectors.cartItemsname);
  const names = [];
  for (const element of nameElements) {
    names.push(await element.getText());
  }
  return names;  // ['Blue T-Shirt', 'Black T-shirt with white stripes']
  }

  async increaseBlueTShirtQuantity(times: number = 1) {
    for (let i = 0; i < times; i++) {      
      // Find the increase button for this item
      const increaseBtn = await $(storePageSelectors.increaseQuantityButton);
      await increaseBtn.click();
      await browser.pause(300); // Brief pause between clicks
    }
  }

  async getCartSubtotal(): Promise<number> {
    const subtotalText = await $(storePageSelectors.cartSubtotal).getText();
    // Extract number from text like "$49.99" or "49.99"
    const match = subtotalText.replace(/[^\d.]/g, '');
    return parseFloat(match);
  }

async getProductPriceInCart(productName: string): Promise<number> {
  await $(storePageSelectors.cartPanel).waitForExist({ timeout: 10000 });
  const cartItems = await $$(storePageSelectors.cartItemsDistinct);
  for (const item of cartItems) {
    const cartItemName = await item.$(storePageSelectors.cartItemsname);
    if (await cartItemName.getText() === productName) {
      const priceElement = await item.$(storePageSelectors.productPrice);
      const priceText = await priceElement.getText();
      const productPrice = priceText.replace(/[^\d.]/g, '');
      return parseFloat(productPrice);
    }
  }
  throw new Error(`Item ${productName} not found`);
}

  async removeAllItems() {
    const removeButtons = await $$(storePageSelectors.removeItemButton);
    for (let i = await removeButtons.length - 1; i >= 0; i--) {
      await removeButtons[i].click();
      await browser.pause(300);
    }
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      const emptyMsg = await $(storePageSelectors.emptyCartMessage);
      return await emptyMsg.isDisplayed();
    } catch {
      return false;
    }
  }

  async getCartSubtotalAmount(): Promise<string> {
    const subtotal = await $(storePageSelectors.cartSubtotal).getText();
    return subtotal;
  }
}

export default new StorePage();
