class CartPage {

    productPriceText = '[class="Product__Val-sc-124al1g-6 eKyHNu"]';
    addToCartBtn = 'button:contains("Add to cart")';
    cartPriceText = '[class="Cart__SubPriceValue-sc-1h98xa9-9 dCNBgZ"]';
    cartProductName = '[class="CartProduct__Title-sc-11uohgb-2 jVsMjn"]';
    cartMenuIcon = '[class="Cart__CartButton-sc-1h98xa9-0 Xqoyz"]';
    checkoutBtn = '[class="Cart__CheckoutButton-sc-1h98xa9-11 elxCN"]';
    subtotalLabel = '[class="Cart__Sub-sc-1h98xa9-7 exHAGw"]';
    cartHeader = '[class="Cart__HeaderTitle-sc-1h98xa9-6 iLEImJ"]';
    cartItemTotal = '[class="Cart__CartIcon-sc-1h98xa9-2 fJGXHr"]';
    increaseItemQuantity = 'button:contains("+")';
    decreaseItemQuantity = 'button:contains("-")';
    itemSizeQuantity = '[class="CartProduct__Desc-sc-11uohgb-3 bRgwLG"]';
    productContainer = '[class="CartProduct__Container-sc-11uohgb-0 iFEDVZ"]';
    removeProduct = '[title="remove product from cart"]';

    priceRegex = /[$,\s]/g 


    openCloseCart(){
        cy.get(this.cartMenuIcon).click();
    }
  
    validateCartIsOpen(){
        cy.get(this.checkoutBtn).should('be.visible');
        cy.get(this.subtotalLabel).should('be.visible');
        cy.get(this.cartHeader).should('be.visible');
    }
  
    validateCartIsClosed(){
        cy.get(this.checkoutBtn).should('not.exist');
        cy.get(this.subtotalLabel).should('not.exist');
        cy.get(this.cartHeader).should('not.exist');
    }

    addProductToCart(productName){
        cy.get(`[alt="${productName}"]`).parent().as('product');
        cy.get('@product').find(this.addToCartBtn).click();
    }
    
    validateProductQuantityInCart(productName, quantity){
        cy.get(this.productContainer).contains(`${productName}`).parent().as('productCart');
        cy.get('@productCart').then($cartProduct => {
          expect($cartProduct.text()).to.contain(`Quantity: ${quantity}`);
        });
    }
    
    increaseProductQuantity(){
        cy.get(this.increaseItemQuantity).click();
    }
    
    decreaseProductQuantity(){
        cy.get(this.decreaseItemQuantity).click();
    }
    
    removeProductFromCart(){
        cy.get('@productCart').parent().find(this.removeProduct).click();
    }
    
    validateProductRemovedFromCart(){
        cy.get(this.productContainer).should('not.exist');
    }

    addSingleProductToCartAndValidate(productName){
        cy.get(`[alt="${productName}"]`).parent().as('product');
    
        // Get the value of the product
        cy.get('@product').find(this.productPriceText).then($productValue => {
            const productValue = $productValue.text().replace(this.priceRegex, '');
            cy.get('@product').find(this.addToCartBtn).click();
    
          // Assert cart subtotal is correct
            cy.get(this.cartPriceText).then($cartValue => {
                const cartValue = $cartValue.text().replace(this.priceRegex, '');
                expect(cartValue).to.equal(productValue);
          });
        });
    }
    
    confirmProductShownInCart(productName){
        cy.get(this.cartProductName).then($cartProduct => {
            expect($cartProduct.text()).to.equal(productName);
          });
    }

    addMultipleProductsToCartAndValidate(productNames) {
        let productValues = [];
        let cartProducts = [];
    
        productNames.forEach((productName, index) => {
          cy.get(`[alt="${productName}"]`).parent().as(`product${index + 1}`);
    
          cy.get(`@product${index + 1}`).find(this.productPriceText).then($productValue => {
            productValues[index] = $productValue.text().replace(this.priceRegex, '');
            cy.get(`@product${index + 1}`).find(this.addToCartBtn).click();
          });
        });
    
        // Assert products are in the cart
        cy.get(this.cartProductName).each(($cartProduct) => {
          cartProducts.push($cartProduct.text().trim());
        }).then(() => {
          cy.wrap(productNames).each(productName => {
            expect(cartProducts).to.include(productName);
          });
        });
    
        // Assert cart subtotal is correct
        cy.get(this.cartPriceText).then($cartValue => {
          const cartValue = $cartValue.text().replace(this.priceRegex, '');
          let expectedCartValue = productValues.reduce((a, b) => +a + +b, 0).toFixed(2);
          expect(cartValue).to.equal(expectedCartValue);
        });
    
        // Assert cart item total is correct
        cy.get(this.cartItemTotal).then($cartItems => {
          expect($cartItems.text()).to.equal(productNames.length.toString());
        });
      }

  }
  
export default CartPage;
