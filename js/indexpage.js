//wait for the page to load. 
$(document).ready(function () {
    function update_cart_item_count() {
      var numCart = 0
      //loop over local storage to find the # of items in cart. 
      for(var k = 0; k < localStorage.length; k++) {
        if (localStorage.key(k).includes("shop/")) {
          numCart += Number(localStorage.getItem(localStorage.key(k)));
        }
      }
      //set the upper right hand number in navbar to the number of items in cart 
      $('.cart_item_number').text(numCart);
      return numCart;
    }

    update_cart_item_count();
});
