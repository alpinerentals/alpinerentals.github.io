

//wait until the document is ready before writing methods which interface with the UI
$(document).ready(function () {
    //function to update the # of items displayed in cart in the upper right corner. 
    function update_cart_item_count() {
      var numCart = 0
      //iterate over the local storage. 
      for(var k = 0; k < localStorage.length; k++) {
        if (localStorage.key(k).includes("shop/")) {
          numCart += Number(localStorage.getItem(localStorage.key(k)));
        }
      }
      //update the text in the nav bar. 
      $('.cart_item_number').text(numCart);
      return numCart;
    }
    //call the function. 
    update_cart_item_count();
});
