
export const ENVCONFIG = {
  baseUrl: "https://automation-interview.vercel.app/",
};

export const TEST_DATA = {
  products: {
    blueTShirt: {
      name: 'Blue T-Shirt',
      expectedPrice: 9.00
    },
    blackTShirtWithStripes: {
      name: 'Black T-shirt with white stripes',
      expectedPrice: 14.90
    }
  },
  cart: {
    expectedDistinctItems: 2,
    blueTShirtFinalQty: 3,
    blackTShirtFinalQty: 1
  },
  assertions: {
    emptyCartPattern: /\$0\.00|0\.00/,
    pageTitle: "Typescript React Shopping cart"
  }
};

export const TIMEOUTS = {
  elementWait: 10000,    // 10 seconds for element operations
  actionDelay: 50,       // Minimal delay between actions
  cartAnimation: 500     // Wait for cart animation to complete
};