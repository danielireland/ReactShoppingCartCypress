import CartPage from '../pages/CartPage.js';

const cartPage = new CartPage();


beforeEach(() => {
  cy.visit('/')
});


//test data
const productNames = ['Skater Black Sweatshirt', 'Black Tule Oversized', 'Blue Sweatshirt', 'Grey T-shirt'];


describe('Validate opening and closing the checkout menu', () => {

  it('Open and close the cart', () => {
    // Open cart and expect elements to be visible
    cartPage.openCloseCart();
    cartPage.validateCartIsOpen();

    // Close cart and expect elements to not be visible
    cartPage.openCloseCart();
    cartPage.validateCartIsClosed();
  });
});

describe(`Validate adding products to the cart`, () => {

  // Test each product in productNames[] 
  productNames.forEach(productName => {
    it('Add single product to cart and validate', () => {
      cartPage.addSingleProductToCartAndValidate(productName);
      cartPage.confirmProductShownInCart(productName);
    });
  });

  // Add all products in productNames[] to the cart
  it(`Add multiple products to the cart and validate`, () => {
    cartPage.addMultipleProductsToCartAndValidate(productNames);
  });
  
});

describe('Validate opening and closing the checkout menu', () => {

  it('Add product to cart and update quantity', () => {
    const productName = productNames[0];

    // Add product to cart and validate quantity
    cartPage.addProductToCart(productName);
    cartPage.validateProductQuantityInCart(productName, 1);

    // Increase item quantity and validate quantity
    cartPage.increaseProductQuantity();
    cartPage.validateProductQuantityInCart(productName, 2);

    // Decrease item quantity and validate quantity
    cartPage.decreaseProductQuantity();
    cartPage.validateProductQuantityInCart(productName, 1);

    // Remove product and validate product removal
    cartPage.removeProductFromCart();
    cartPage.validateProductRemovedFromCart();
  });
});


