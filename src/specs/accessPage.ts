import { expect } from "@wdio/globals";
import StorePage from "../pages/storePage";
import { TIMEOUTS, TEST_DATA } from "../config/testData";
import { logger } from "../utils/logger";

describe(": Automating the end-to-end flow of filtering products, managing cart quantities, and verifying pricing logic", () => {
  beforeEach(async () => {
    try {
      logger.info("=== Test Setup: Opening store page ===");
      await StorePage.open();
      logger.info("Store page opened successfully");
    } catch (error) {
      logger.error("Failed to open store page in beforeEach", error as Error);
      throw error;
    }
  });

  const setupCartWithItems = async () => {
    try {
      logger.info("Setting up cart with Blue T-Shirt and Black T-Shirt with white stripes");
      
      //Adding both products to cart
      await StorePage.addBlueTShirtToCart();
      await browser.pause(TIMEOUTS.actionDelay);
      await StorePage.addBlackTShirtWithStripesToCart();
      await browser.pause(TIMEOUTS.actionDelay);
      logger.debug("Both products added to cart");
      await StorePage.openCart();
      logger.debug("Cart opened");
      await browser.waitUntil(
        async () => await StorePage.isCartPanelVisible(),
        {
          timeout: TIMEOUTS.elementWait,
          timeoutMsg: 'Cart panel did not become visible'
        }
      );
      logger.info("Cart setup completed successfully");
    } catch (error) {
      logger.error("Failed to setup cart with items", error as Error);
      throw error;
    }
  };

  const setupCartWithIncreasedQuantity = async () => {
    try {
      logger.info("Setting up cart with increased Blue T-Shirt quantity");
      
      //First main setup for the cart with both items(taking blue and black t-shirt for example)
      await setupCartWithItems();
      logger.debug("Cart setup with items completed");
      
      //Verifying blue t-shirt is in cart
      const cartNames = await StorePage.getCartItemNames();
      expect(cartNames).toContain('Blue T-Shirt');
      logger.debug("Verified Blue T-Shirt exists in cart");
      await StorePage.increaseBlueTShirtQuantity(2);
      logger.info("Blue T-Shirt quantity increased by 2");
      await browser.waitUntil(
        async () => {
          const count = await StorePage.getCartItemCount();
          logger.debug(`Waiting for cart update - Current count: ${count}`);
          return count >= 3; //Checking for at least 3 items in the cart
        },
        {
          timeout: TIMEOUTS.elementWait,
          timeoutMsg: 'Cart quantity did not update as expected'
        }
      );
      logger.info("Cart quantity updated successfully");
    } catch (error) {
      logger.error("Failed to setup cart with increased quantity", error as Error);
      throw error;
    }
  };

  //                                                ============= TEST CASES =============

  it("Test 1: Navigate to the Shopping Application", async () => {
    try {
      logger.info("Test 1 started: Navigating to Shopping Application");
      
      const pageTitle = await browser.getTitle();
      logger.debug(`Page title retrieved: "${pageTitle}"`);
      
      expect(pageTitle).toBe("Typescript React Shopping cart");
      logger.info("Test 1 passed: Page title matches expected value");
    } catch (error) {
      logger.error("Test 1 failed", error as Error);
      throw error;
    }
  });

  it("Test 2-3: Filter by Size and Verify Results", async () => {
    try {
      logger.info("Test 2-3 started: Filter by Size and Verify Results");
      
      // Locate the "Sizes" filter menu
      const sizeFilterText = await StorePage.checkSizeFilter();
      logger.debug(`Size filter text: "${sizeFilterText}"`);
      expect(sizeFilterText).toBe("Sizes:");
      
      // Select 'XS' and 'ML' sizes
      logger.info("Selecting size filters: XS and ML");
      await StorePage.selectSizeXS();
      logger.debug("Selected size XS");
      
      await StorePage.selectSizeML();
      logger.debug("Selected size ML");

      // Smart wait: Wait for filter results to update
      logger.info("Waiting for filter results to update...");
      await browser.waitUntil(
        async () => {
          const productCount = await StorePage.getProductCount();
          const visibleCount = await StorePage.getVisibleProductCount();
          logger.debug(`Filter check - Expected: ${productCount}, Visible: ${visibleCount}`);
          return productCount === visibleCount;
        },
        {
          timeout: TIMEOUTS.elementWait,
          timeoutMsg: 'Filter results did not update within expected time'
        }
      );
      logger.info("✓ Filter results updated successfully");

      // Count the number of products displayed on the grid
      const productCountFromText = await StorePage.getProductCount();
      const visibleProductCount = await StorePage.getVisibleProductCount();
      
      logger.debug(`Product count from text: ${productCountFromText}, Visible: ${visibleProductCount}`);

      // Assert that the Products found text matches the actual number of visible items
      expect(visibleProductCount).toBe(productCountFromText);
      logger.info("✓ Test 2-3 passed: Filter results verified");
    } catch (error) {
      logger.error("Test 2-3 failed", error as Error);
      throw error;
    }
  });

  it("Test 4-5: Add Items to Cart and Open Cart", async () => {
    try {
      logger.info("Test 4-5 started: Add Items to Cart and Open Cart");
      await setupCartWithItems();
      
      //Verifying cart panel is actually open
      const isCartOpen = await StorePage.isCartPanelVisible();
      logger.debug(`Cart panel visible: ${isCartOpen}`);
      expect(isCartOpen).toBe(true);
      
      logger.info("Test 4-5 passed: Items added and cart opened successfully");
    } catch (error) {
      logger.error("Test 4-5 failed", error as Error);
      throw error;
    }
  });

  it("Test 6: Verify Initial Cart State", async () => {
    try {
      logger.info("Test 6 started: Verify Initial Cart State");
      await setupCartWithItems();

      //Asserting that the correct number of distinct items is present in the cart
      const cartItemCount = await StorePage.getDistinctCartItemCount();
      logger.info(`Distinct cart items count: ${cartItemCount}`);
      
      expect(cartItemCount).toBe(TEST_DATA.cart.expectedDistinctItems); //Should only have 2 distinct items since we added 2 different products
      
      logger.info("Test 6 passed: Cart has correct number of distinct items");
    } catch (error) {
      logger.error("Test 6 failed", error as Error);
      throw error;
    }
  });

  it("Test 7 & 8: Update Quantity and Verify Updated State", async () => {
    try {
      logger.info("Test 7 & 8 started: Update Quantity and Verify Updated State");
      await setupCartWithIncreasedQuantity();

      //Verifying Blue T-Shirt is still in cart
      const cartNames = await StorePage.getCartItemNames();
      logger.debug(`Cart items: ${cartNames.join(', ')}`);
      expect(cartNames).toContain('Blue T-Shirt');
      logger.debug("Verified Blue T-Shirt exists in cart after quantity increase");

      //Asserting that the total number of items in the cart has updated correctly
      const updatedCartItems = await StorePage.getCartItemCount();
      logger.info(`Updated cart items count: ${updatedCartItems}`);
      
      //Should have at least 3 Blue T-Shirts (1 initial + 2 increases)
      expect(updatedCartItems).toBeGreaterThanOrEqual(TEST_DATA.cart.blueTShirtFinalQty);
      logger.info("Test 7 & 8 passed: Quantity updated successfully");
    } catch (error) {
      logger.error("Test 7 & 8 failed", error as Error);
      throw error;
    }
  });

  it("Test 9: Validate Pricing Logic", async () => {
    try {
      logger.info("Test 9 started: Validate Pricing Logic");
      await setupCartWithIncreasedQuantity();

      //Getting Blue T-Shirt price
      let blueTShirtPrice: number;
      try {
        blueTShirtPrice = await StorePage.getProductPriceInCart(TEST_DATA.products.blueTShirt.name);
        logger.info(`Retrieved Blue T-Shirt price: $${blueTShirtPrice}`);
      } catch (error) {
        logger.error("Failed to retrieve Blue T-Shirt price", error as Error);
        throw new Error(`Could not find Blue T-Shirt price in cart: ${error}`);
      }

      //Getting Black T-Shirt price
      let blackTShirtPrice: number;
      try {
        blackTShirtPrice = await StorePage.getProductPriceInCart(TEST_DATA.products.blackTShirtWithStripes.name);
        logger.info(`Retrieved Black T-Shirt price: $${blackTShirtPrice}`);
      } catch (error) {
        logger.error("Failed to retrieve Black T-Shirt price", error as Error);
        throw new Error(`Could not find Black T-Shirt price in cart: ${error}`);
      }

      //Calculating the expected subtotal
      const expectedSubtotal = (blueTShirtPrice * TEST_DATA.cart.blueTShirtFinalQty) +  (blackTShirtPrice * TEST_DATA.cart.blackTShirtFinalQty);
      
      logger.debug("Pricing calculation", {
        blueTShirtQty: TEST_DATA.cart.blueTShirtFinalQty,
        blueTShirtPrice: blueTShirtPrice,
        blackTShirtQty: TEST_DATA.cart.blackTShirtFinalQty,
        blackTShirtPrice: blackTShirtPrice,
        expectedSubtotal: expectedSubtotal
      });

      //Getting actual subtotal from cart
      let actualSubtotal: number;
      try {
        actualSubtotal = await StorePage.getCartSubtotal();
        logger.info(`Retrieved cart subtotal: $${actualSubtotal}`);
      } catch (error) {
        logger.error("Failed to retrieve cart subtotal", error as Error);
        throw new Error(`Could not find cart subtotal: ${error}`);
      }

      //Verifying that the Subtotal displayed in the cart exactly matches calculated amount
      logger.info(`Validating pricing: Expected $${expectedSubtotal} vs Actual $${actualSubtotal}`);
      expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2); // Allowing for rounding of amount to be safe
      logger.info("Test 9 passed: Pricing validation successful");
    } catch (error) {
      logger.error("Test 9 failed", error as Error);
      throw error;
    }
  });

  it("Test 10 & 11: Clear Cart and Verify Empty State", async () => {
    try {
      logger.info("Test 10 & 11 started: Clear Cart and Verify Empty State");
      await setupCartWithItems();
      logger.info("Removing all items from cart");
      await StorePage.removeAllItems();
      logger.info("Waiting for cart to become empty...");
      await browser.waitUntil(
        async () => {
          const isEmpty = await StorePage.isCartEmpty();
          logger.debug(`Cart empty state check: ${isEmpty}`);
          return isEmpty;
        },
        {
          timeout: TIMEOUTS.elementWait,
          timeoutMsg: 'Cart did not empty within expected time'
        }
      );
      logger.info("Cart is now empty");

      //Verifying so to check that the subtotal shows $0.00
      let subtotalAmount: string;
      try {
        subtotalAmount = await StorePage.getCartSubtotalAmount();
        logger.debug(`Cart subtotal amount: ${subtotalAmount}`);
      } catch (error) {
        logger.error("Failed to retrieve cart subtotal amount", error as Error);
        throw new Error(`Could not find cart subtotal: ${error}`);
      }

      //Asserting to make sure that the Subtotal is 0
      expect(subtotalAmount).toMatch(TEST_DATA.assertions.emptyCartPattern);
      logger.info("Subtotal verified as $0.00");

      //Making sure that the cart is empty
      const isCartEmpty = await StorePage.isCartEmpty();
      logger.debug(`Final cart empty state: ${isCartEmpty}`);
      expect(isCartEmpty).toBe(true);
      logger.info("Test 10 & 11 passed: Cart successfully cleared and empty state verified");
    } catch (error) {
      logger.error("Test 10 & 11 failed", error as Error);
      throw error;
    }
  });
    it("Test 12: Verify cart badge shows correct item count", async () => {
    try {
      logger.info("Test 12: Verify cart badge count");
      await StorePage.addBlueTShirtToCart();
      await browser.pause(TIMEOUTS.actionDelay);
      await StorePage.addBlackTShirtWithStripesToCart();
      await browser.pause(TIMEOUTS.actionDelay);
      
      const cartCount = await StorePage.getCartItemCount();
      expect(cartCount).toBe(2);
      logger.info("✓ Test 12 passed");
    } catch (error) {
      logger.error("Test 12 failed", error as Error);
      throw error;
    }
  });

  it("Test 13: Verify product prices are positive", async () => {
    try {
      logger.info("Test 13: Verify positive prices");
      await StorePage.addBlueTShirtToCart();
      await browser.pause(TIMEOUTS.actionDelay);
      await StorePage.openCart();
      
      await browser.waitUntil(
        async () => await StorePage.isCartPanelVisible(),
        { timeout: TIMEOUTS.elementWait }
      );
      
      const price = await StorePage.getProductPriceInCart(TEST_DATA.products.blueTShirt.name);
      expect(price).toBeGreaterThan(0);
      logger.info("✓ Test 13 passed");
    } catch (error) {
      logger.error("Test 13 failed", error as Error);
      throw error;
    }
  });

it("Test 14: Verify cart item names are displayed correctly", async () => {
  try {
    logger.info("Test 14: Verify cart item names");
    
    // Add both products
    await StorePage.addBlueTShirtToCart();
    await browser.pause(TIMEOUTS.actionDelay);
    await StorePage.addBlackTShirtWithStripesToCart();
    await browser.pause(TIMEOUTS.actionDelay);
    
    // Open cart
    await StorePage.openCart();
    await browser.waitUntil(
      async () => await StorePage.isCartPanelVisible(),
      { timeout: TIMEOUTS.elementWait }
    );
    
    // Get all item names
    const itemNames = await StorePage.getCartItemNames();
    logger.info(`Cart items: ${itemNames.join(", ")}`);
    
    // Verify both products are present
    expect(itemNames).toContain(TEST_DATA.products.blueTShirt.name);
    expect(itemNames).toContain(TEST_DATA.products.blackTShirtWithStripes.name);
    expect(itemNames.length).toBe(2);
    
    logger.info("Test 14 passed: All item names displayed correctly");
  } catch (error) {
    logger.error("Test 14 failed", error as Error);
    throw error;
  }
});
});