import { storePageSelectors } from "../selectors/storePageSelectors";
import { logger } from "../utils/logger";
import { TIMEOUTS, ENVCONFIG } from "../config/testData";

class StorePage {
  async open() {
    try {
      logger.info("Opening store page");
      await browser.url(ENVCONFIG.baseUrl);//Using url https://automation-interview.vercel.app/ as prodUrl
      logger.info("Store page opened successfully");
    } catch (error) {
      logger.error("Failed to open store page", error as Error);
      throw error;
    }
  }

  async checkSizeFilter(): Promise<string> {
    try {
      const sizeFilterBtn = await $(storePageSelectors.sizeFilterMenu);
      const text = await sizeFilterBtn.getText();
      logger.debug(`Size filter text: "${text}"`);
      return text;
    } catch (error) {
      logger.error("Failed to check size filter", error as Error);
      throw error;
    }
  }

  async selectSizeXS() {
    try {
      logger.info("Selecting size XS");
      const xsCheckbox = await $(storePageSelectors.sizeXS);
      await xsCheckbox.scrollIntoView();
      await xsCheckbox.click();
      logger.debug("Size XS selected");
    } catch (error) {
      logger.error("Failed to select size XS", error as Error);
      throw error;
    }
  }

  async selectSizeML() {
    try {
      logger.info("Selecting size ML");
      const mlCheckbox = await $(storePageSelectors.sizeML);
      await mlCheckbox.scrollIntoView();
      await mlCheckbox.click();
      logger.debug("Size ML selected");
    } catch (error) {
      logger.error("Failed to select size ML", error as Error);
      throw error;
    }
  }

  async getProductCount(): Promise<number> {
    try {
      const productCountText = await $(storePageSelectors.productCount).getText();
      logger.debug(`Product count text: "${productCountText}"`);
      //Extracting number from text from the products found text"
      const match = productCountText.match(/\d+/);
      const count = match ? parseInt(match[0]) : 0;
      logger.debug(`Extracted product count: ${count}`);
      return count;
    } catch (error) {
      logger.error("Failed to get product count", error as Error);
      throw error;
    }
  }

  async getVisibleProductCount(): Promise<number> {
    try {
      const products = await $$(storePageSelectors.productGrid);
      logger.debug(`Visible products count: ${products.length}`);
      return products.length;
    } catch (error) {
      logger.error("Failed to get visible product count", error as Error);
      throw error;
    }
  }

  async addBlueTShirtToCart() {
    try {
      logger.info("Adding Blue T-Shirt to cart");
      const product = await $(storePageSelectors.addblueTShirtbtn);
      await product.scrollIntoView();
      await product.click();
      logger.debug("Blue T-Shirt added to cart");
    } catch (error) {
      logger.error("Failed to add Blue T-Shirt to cart", error as Error);
      throw error;
    }
  }

  async addBlackTShirtWithStripesToCart() {
    try {
      logger.info("Adding Black T-Shirt with white stripes to cart");
      const product = await $(storePageSelectors.addblackTShirtWhiteStripesbtn);
      await product.scrollIntoView();
      await product.click();
      logger.debug("Black T-Shirt with white stripes added to cart");
    } catch (error) {
      logger.error("Failed to add Black T-Shirt to cart", error as Error);
      throw error;
    }
  }

  async openCart() {
    try {
      logger.info("Opening cart");
      //Check to see if cart panel is already open
      const cartPanel = await $(storePageSelectors.cartPanel);
      const isCartOpen = await cartPanel.isDisplayed().catch(() => false);
      
      if (!isCartOpen) {
        logger.debug("Cart panel not open, clicking cart button");
        //Cart is not open, so click the cart button to open it
        const cartBtn = await $(storePageSelectors.cartIconbtn);
        await cartBtn.click();
        await browser.pause(TIMEOUTS.cartAnimation);
        logger.debug("Cart button clicked");
      } else {
        logger.debug("Cart panel already open");
      }
      return true;
    } catch (error) {
      logger.error("Failed to open cart", error as Error);
      throw error;
    }
  }

  async isCartPanelVisible(): Promise<boolean> {
    try {
      const cartPanel = await $(storePageSelectors.cartPanel);
      const isVisible = await cartPanel.isDisplayed();
      logger.debug(`Cart panel visible: ${isVisible}`);
      return isVisible;
    } catch (error) {
      logger.debug("Cart panel not visible");
      return false;
    }
  }

  async getDistinctCartItemCount(): Promise<number> {
    try {
      const items = await $$(storePageSelectors.cartItemsDistinct);
      logger.debug(`Distinct cart items count: ${items.length}`);
      return items.length;
    } catch (error) {
      logger.error("Failed to get distinct cart item count", error as Error);
      throw error;
    }
  }

  async getCartItemCount(): Promise<number> {
    try {
      const cartIcon = await $(storePageSelectors.cartItems);
      await cartIcon.waitForExist({ timeout: TIMEOUTS.elementWait });
      const cartcount = await cartIcon.getText();
      const count = parseInt(cartcount, 10);
      logger.debug(`Cart total items count: ${count}`);
      return count;
    } catch (error) {
      logger.error("Failed to get cart item count", error as Error);
      throw error;
    }
  }

  async getCartItemNames(): Promise<string[]> {
    try {
      logger.info("Getting cart item names");
      await $(storePageSelectors.cartPanel).waitForExist({ timeout: TIMEOUTS.elementWait });
      const nameElements = await $$(storePageSelectors.cartItemsname);
      const names = [];
      
      for (const element of nameElements) {
        const name = await element.getText();
        names.push(name);
        logger.debug(`Found item: "${name}"`);
      }
      
      logger.info(`Cart contains ${names.length} items: [${names.join(', ')}]`);
      return names;
    } catch (error) {
      logger.error("Failed to get cart item names", error as Error);
      throw error;
    }
  }

  async increaseBlueTShirtQuantity(times: number = 1) {
    try {
      logger.info(`Increasing Blue T-Shirt quantity by ${times}`);
      for (let i = 0; i < times; i++) {
        logger.debug(`Increase click ${i + 1}/${times}`);
        //Finding the increase button for this item
        const increaseBtn = await $(storePageSelectors.increaseQuantityButton);
        await increaseBtn.click();
        await browser.pause(TIMEOUTS.actionDelay);
      }
      logger.info(`Blue T-Shirt quantity increased by ${times}`);
    } catch (error) {
      logger.error("Failed to increase quantity", error as Error);
      throw error;
    }
  }

  async getCartSubtotal(): Promise<number> {
    try {
      logger.info("Getting cart subtotal");
      const subtotalElement = await $(storePageSelectors.cartSubtotal);
      await subtotalElement.waitForDisplayed({ timeout: TIMEOUTS.elementWait });
      
      const subtotalText = await subtotalElement.getText();
      logger.debug(`Subtotal text: "${subtotalText}"`);
      
      //Extracting number from text including the $value or just the value
      const match = subtotalText.replace(/[^\d.]/g, '');
      const subtotal = parseFloat(match);
      
      if (isNaN(subtotal)) {
        throw new Error(`Could not parse subtotal from: "${subtotalText}"`);
      }
      
      logger.info(`Cart subtotal: $${subtotal}`);
      return subtotal;
    } catch (error) {
      logger.error("Failed to get cart subtotal", error as Error);
      throw error;
    }
  }

  async getProductPriceInCart(productName: string): Promise<number> {
    try {
      logger.info(`Getting price for: "${productName}"`);
      await $(storePageSelectors.cartPanel).waitForExist({ timeout: TIMEOUTS.elementWait });
      
      const cartItems = await $$(storePageSelectors.cartItemsDistinct);
      logger.debug(`Found ${cartItems.length} items in cart`);
      
      for (const item of cartItems) {
        const cartItemName = await item.$(storePageSelectors.cartItemsname);
        const itemName = await cartItemName.getText();
        logger.debug(`Checking item: "${itemName}"`);
        
        if (itemName === productName || itemName.includes(productName)) {
          const priceElement = await item.$(storePageSelectors.productPrice);
          const priceText = await priceElement.getText();
          logger.debug(`Price text for "${productName}": "${priceText}"`);
          
          const productPrice = parseFloat(priceText.replace(/[^\d.]/g, ''));
          
          if (isNaN(productPrice)) {
            throw new Error(`Could not parse price from: "${priceText}"`);
          }
          
          logger.info(`Price for "${productName}": $${productPrice}`);
          return productPrice;
        }
      }
      
      throw new Error(`Item "${productName}" not found in cart`);
    } catch (error) {
      logger.error(`Failed to get price for ${productName}`, error as Error);
      throw error;
    }
  }

  async removeAllItems() {
    try {
      logger.info("Removing all items from cart");
      const removeButtons = await $$(storePageSelectors.removeItemButton);
      logger.debug(`Found ${removeButtons.length} remove buttons`);
      
      //Removing items from the end to avoid index shifting issues
      for (let i = await removeButtons.length - 1; i >= 0; i--) {
        logger.debug(`Removing item ${i + 1}/${removeButtons.length}`);
        await removeButtons[i].click();
        await browser.pause(TIMEOUTS.cartAnimation);
      }
      
      logger.info("All items removed successfully");
    } catch (error) {
      logger.error("Failed to remove all items", error as Error);
      throw error;
    }
  }

  async isCartEmpty(): Promise<boolean> {
    try {
      logger.debug("Checking if cart is empty");
      
      //Checking for the empty cart message
      try {
        const emptyMsg = await $(storePageSelectors.emptyCartMessage);
        const isDisplayed = await emptyMsg.isDisplayed();
        
        if (isDisplayed) {
          logger.info("Cart is empty - message displayed");
          return true;
        }
      } catch (e) {
        logger.debug("Empty message not found, checking items count");
      }

      const items = await $$(storePageSelectors.cartItemsDistinct);
      const isEmpty = await items.length === 0;
      logger.info(`Cart empty status: ${isEmpty} (${items.length} items found)`);
      return isEmpty;
    } catch (error) {
      logger.error("Error checking if cart is empty", error as Error);
      return false;
    }
  }

  async getCartSubtotalAmount(): Promise<string> {
    try {
      logger.info("Getting cart subtotal amount as string");
      const subtotalElement = await $(storePageSelectors.cartSubtotal);
      await subtotalElement.waitForDisplayed({ timeout: TIMEOUTS.elementWait });
      
      const subtotal = await subtotalElement.getText();
      logger.debug(`Subtotal amount: "${subtotal}"`);
      return subtotal;
    } catch (error) {
      logger.error("Failed to get cart subtotal amount", error as Error);
      throw error;
    }
  }
}

export default new StorePage();