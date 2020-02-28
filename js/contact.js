
//wait until the document is ready.
$(document).ready(function () {
    function update_cart_item_count() {
      var numCart = 0
      //loop over local storage. 
      for(var k = 0; k < localStorage.length; k++) {
        if (localStorage.key(k).includes("shop/")) {
          numCart += Number(localStorage.getItem(localStorage.key(k)));
        }
      }
      //set the text on the nav describing the # of items in cart. 
      $('.cart_item_number').text(numCart);
      return numCart;
    }

    update_cart_item_count();

    //action to occurr when the submit form button is clicked. 
    $("#submit_form").on("click", function (e) {
        e.preventDefault();
        $("#submit_form").html("Sending Data: <i  class=\"fas fa-circle-notch fa-spin\"></i>")
        timer = setTimeout(sendingComplete, 1500);
    })
});

//Disable the inputs once a submission has been submitted. 
function sendingComplete() {
    $("#submit_form").html("Data Sent!")
    $('input'). prop("disabled", true)
    $('textarea'). prop("disabled", true)
    $('button'). prop("disabled", true)
}
