import { expect } from "@wdio/globals";
import StorePage from "../pages/storePage";

describe("Automation Challenge", () => {
  it("Open WebPage and validate title", async () => {
    await StorePage.open();
    expect(await browser.getTitle()).toStrictEqual(
      "Typescript React Shopping cart"
    );
  });
});

describe("Shopping Cart Test Suite", () => {
  beforeEach(async () => {
    await StorePage.open();
  });

  it("Test 1: Navigate to the Application", async () => {
    // Open the webpage
    expect(await browser.getTitle()).toBe("Typescript React Shopping cart");
  });

  it("Test 2-3: Filter by Size and Verify Results", async () => {
    // Locate the "Sizes" filter menu
    expect(await StorePage.checkSizeFilter()).toBe("Sizes:");
    
    // Select 'XS' and 'ML' sizes
    await StorePage.selectSizeXS();
    await StorePage.selectSizeML();

    // Wait for results to update
    await browser.pause(1000);

    // Count the number of products displayed on the grid
    const productCountFromText = await StorePage.getProductCount();
    const visibleProductCount = await StorePage.getVisibleProductCount();

    // // Assert that the "Product(s) found" text matches the actual number of visible items
    expect(visibleProductCount).toBe(productCountFromText);
  });

  // it("Test 4-5: Add Items to Cart and Open Cart", async () => {
  //   // Add the product "Blue T-Shirt" to the cart
  //   await StorePage.addBlueTShirtToCart();
  //   await browser.pause(500);

  //   // Add the product "Black T-Shirt with white stripes" to the cart
  //   await StorePage.addBlackTShirtWithStripesToCart();
  //   await browser.pause(500);

  //   // Click the cart icon/menu to expand the side panel
  //   await StorePage.openCart();
  // });

  // it("Test 6: Verify Initial Cart State", async () => {
  //   // Add items first
  //   await StorePage.addBlueTShirtToCart();
  //   await browser.pause(300);
  //   await StorePage.addBlackTShirtWithStripesToCart();
  //   await browser.pause(300);
    
  //   // Open cart
  //   await StorePage.openCart();

  //   // Assert that the correct number of distinct items (orders) is present in the cart
  //   const cartItemCount = await StorePage.getCartItemCount();
  //   expect(cartItemCount).toBe(2); // Should have 2 distinct items
  // });

  // it("Test 7-8: Update Quantity and Verify Updated State", async () => {
  //   // Setup: Add items to cart
  //   await StorePage.addBlueTShirtToCart();
  //   await browser.pause(300);
  //   await StorePage.addBlackTShirtWithStripesToCart();
  //   await browser.pause(300);

  //   // Open cart
  //   await StorePage.openCart();

  //   // Locate the "Blue T-Shirt" in the cart and click the (+) button twice
  //   // This increases quantity from 1 to 3
  //   await StorePage.increaseBlueTShirtQuantity(2);

  //   // Assert that the total number of items in the cart has updated correctly
  //   // Now should have 3 Blue T-Shirts + 1 Black T-Shirt = 4 total items
  //   const updatedCartItems = await StorePage.getCartItemCount();
  //   expect(updatedCartItems).toBeGreaterThanOrEqual(2); // At least 2 item rows
  // });

  // it("Test 9: Validate Pricing Logic", async () => {
  //   // Setup: Add items to cart
  //   await StorePage.addBlueTShirtToCart();
  //   await browser.pause(300);
  //   await StorePage.addBlackTShirtWithStripesToCart();
  //   await browser.pause(300);

  //   // Open cart
  //   await StorePage.openCart();

  //   // Increase Blue T-Shirt quantity twice (1 + 2 = 3)
  //   await StorePage.increaseBlueTShirtQuantity(2);

  //   // Get prices
  //   const blueTShirtPrice = await StorePage.getProductPriceInCart("Blue T-Shirt");
  //   const blackTShirtPrice = await StorePage.getProductPriceInCart("Black T-Shirt with white stripes");

  //   // Calculate the expected total manually
  //   const expectedSubtotal = (blueTShirtPrice * 3) + (blackTShirtPrice * 1);

  //   // Get actual subtotal from cart
  //   const actualSubtotal = await StorePage.getCartSubtotal();

  //   // Assert: Verify that the "Subtotal" displayed in the cart exactly matches calculated amount
  //   expect(actualSubtotal).toBeCloseTo(expectedSubtotal, 2); // Allow for rounding
  // });

  // it("Test 10-11: Clear Cart and Verify Empty State", async () => {
  //   // Setup: Add items to cart
  //   await StorePage.addBlueTShirtToCart();
  //   await browser.pause(300);
  //   await StorePage.addBlackTShirtWithStripesToCart();
  //   await browser.pause(300);

  //   // Open cart
  //   await StorePage.openCart();

  //   // Remove all items from the cart
  //   await StorePage.removeAllItems();
  //   await browser.pause(500);

  //   // Verify empty state
  //   // Assert that the Subtotal is 0 or not displayed
  //   const subtotalAmount = await StorePage.getCartSubtotalAmount();
  //   expect(subtotalAmount).toMatch(/\$0\.00|0\.00/); // Should show $0.00 or 0.00

  //   // Assert that the "Cart is empty" message is displayed
  //   const isCartEmpty = await StorePage.isCartEmpty();
  //   expect(isCartEmpty).toBe(true);
  // });
});