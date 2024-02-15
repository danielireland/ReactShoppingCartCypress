//test data
const productNames = ['Skater Black Sweatshirt', 'Black Tule Oversized', 'Blue Sweatshirt'];

//selectors
const productPriceText = '[class="Product__Val-sc-124al1g-6 eKyHNu"]';
const addToCartBtn = 'button:contains("Add to cart")';
const cartPriceText = '[class="Cart__SubPriceValue-sc-1h98xa9-9 dCNBgZ"]';
const cartProductName = '[class="CartProduct__Title-sc-11uohgb-2 jVsMjn"]';
const cartMenuIcon = '[class="Cart__CartButton-sc-1h98xa9-0 Xqoyz"]';
const checkoutBtn = 'button:contains("Add to cart")';
const subtotalLabel = '[class="Cart__Sub-sc-1h98xa9-7 exHAGw"]';
const cartHeader = '[class="Cart__HeaderTitle-sc-1h98xa9-6 iLEImJ"]';
const cartItemTotal = '[class="Cart__CartIcon-sc-1h98xa9-2 fJGXHr"]';

const valueRegex = /[$,\s]/g 


beforeEach(() => {
  cy.visit('/')
});


describe('Validate opening and closing the checkout menu', () => {

  it('Open and close the cart', () => {

    cy.get(cartMenuIcon).click();

    cy.get(checkoutBtn).should('be.visible');
    cy.get(subtotalLabel).should('be.visible');
    cy.get(cartHeader).should('be.visible');

    cy.get(cartMenuIcon).click();

    // cy.get(checkoutBtn).should('not.exist'); 
    cy.get(subtotalLabel).should('not.exist');
    cy.get(cartHeader).should('not.exist');
    
  });


});

productNames.forEach(productName => {
  describe(`Validate adding single a product "${productName}" to the cart`, () => {

    it('Add sinlge product to cart and validate', () => {
      cy.get(`[alt="${productName}"]`).parent().as('product');

      // Get the value of the product
      cy.get('@product').find(productPriceText).then($productValue => {
        const productValue = $productValue.text().replace(valueRegex, '');
        cy.get('@product').find(addToCartBtn).click();

        // Assert product shown in cart
        cy.get(cartProductName).then($cartProduct => {
          const cartProduct = $cartProduct.text();
          expect(cartProduct).to.equal(productName);
        });

        // Assert cart subtotal is correct
        cy.get(cartPriceText).then($cartValue => {
          const cartValue = $cartValue.text().replace(valueRegex, '');
          expect(cartValue).to.equal(productValue);
        });
      });
    });

  });
});

describe(`Validate multiple products "${productNames[0]}", "${productNames[1]}" and "${productNames[2]}" are added to the cart`, () => {

  it(`Add multiple products to the cart and validate`, () => {

    cy.get(`[alt="${productNames[0]}"]`).parent().as('product1');
    cy.get(`[alt="${productNames[1]}"]`).parent().as('product2');
    cy.get(`[alt="${productNames[2]}"]`).parent().as('product3');

    let productValue1;
    let productValue2;
    let productValue3;

    cy.get('@product1').find(productPriceText).then($productValue => {
      productValue1 = $productValue.text().replace(valueRegex, '');
      cy.get('@product1').find(addToCartBtn).click();
    });

    cy.get('@product2').find(productPriceText).then($productValue => {
      productValue2 = $productValue.text().replace(valueRegex, '');
      cy.get('@product2').find(addToCartBtn).click();
    });

    cy.get('@product3').find(productPriceText).then($productValue => {
      productValue3 = $productValue.text().replace(valueRegex, '');
      cy.get('@product3').find(addToCartBtn).click();
    });

    let cartProducts = [];


    // Assert products are in the cart
    cy.get(cartProductName).each(($cartProduct) => {
      cartProducts.push($cartProduct.text().trim());
    }).then(() => {
      cy.wrap(productNames).each(productName => {
        expect(cartProducts).to.include(productName);
      });
    });

    // Assert cart subtotal is correct
    cy.get(cartPriceText).then($cartValue => {
      const cartValue = $cartValue.text().replace(valueRegex, '');
      let expectedCartValue = (+productValue1 + +productValue2 + +productValue3).toFixed(2)
      expect(cartValue).to.equal(expectedCartValue);
    });

    // Assert cart item total is corect
    cy.get(cartItemTotal).then($cartItems => {
      expect($cartItems.text()).to.equal("3");
    });

  });

});
