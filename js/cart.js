//create a dictionary to store the prices of the products in firebase so we don't need to
//keep pulling data.
var prices_dict = {};
let empty = false;


//function to update the text which shows the number of items in cart.
function update_cart_item_count() {
  var numCart = 0
  for (var k = 0; k < localStorage.length; k++) {
    if (localStorage.key(k).includes("shop/")) {
      numCart += Number(localStorage.getItem(localStorage.key(k)));
    }
  }
  $('.cart_item_number').text(numCart);
  return numCart;
}


//function to update the total cost of all the items in a customer's cart.
function update_total_price() {
  var runningTotal = 0;
  //iterate over the local storage
  for (var k = 0; k < localStorage.length; k++) {
    if (localStorage.key(k).includes("shop/")) {
      var price = Number(prices_dict[localStorage.key(k).substring(5)]);
      var quantity = Number(localStorage.getItem(localStorage.key(k)));
      var days = Number($("#plusDay" + localStorage.key(k).substring(5)).parent().children("h4").text().substring(6));
      //compute the running cost.
      runningTotal += (price * quantity*days);
    }
  }
  //use jquery to update the total, subtotal, and delivery fee.
  $('#total_text').text("Subtotal: $" + Number(runningTotal).toFixed(2));

  var delivery_fee = 0

  if ($('#in-store').is(':checked')) {
    delivery_fee = 0;
  } else if ($('#delivery').is(':checked')) {
    delivery_fee = Number(Number(runningTotal) * .04).toFixed(2);
  }

  $("#delivery_fee").text("Delivery: $" + delivery_fee)

  var real_total = Number(runningTotal) + Number(delivery_fee);

  $("#real_total").text("Total: $" + Number(real_total).toFixed(2));

}


//Function to be run once the payment has been completed.
//This essentially removes the items from cart and ensures that the user can't make changes to the items purchased
//by locking the cart and buttons.
function paymentComplete() {
  $("#pay_button").html("Payment Made!")
  $("#example-2").remove();
  $(".success").css("display", "block");

  //now we need to clear the items in cart and remove all items from the cart on screen.

  localStorage.clear();
  $('.cart_remove').unbind();
  $('.subtract_icon').unbind();
  $('.subtract_day_icon').unbind();
  $('.add_day_icon').unbind();
  $('.add_icon').unbind();
  $('input[type = "radio"]').unbind();

  //prevent users from changing the radio button.
  $('input[type = "radio"]').on("click", function() {
    return false;
  });

  $("#deliveryAddress").prop("disabled", "true");
 //prevent clicks from being made in the container cart since they've already purchase something
  update_cart_item_count();
}


//dynamically create the list items in cart.
function create_container(id, name, price, quantity) {

  //base HTML list item.
  var template_container = "<div class=\"row\"><div class=\"row_container\"><div class=\"product-image\"><img src=\"FILEPATH\"></div><h4>NAME</h4><h4>$PRICE</h4><div class=\"change_day_rental_div\"><i class=\"add_day_icon fas fa-plus\" id=\"plusDayID\"></i><h4>Days: 1</h4><i class=\"subtract_day_icon fas fa-minus\" id=\"subtractDayID\"></i></div><div class=\"add_remove_product_div\"><i class=\"add_icon fas fa-plus\" id=\"plusID\"></i><h4 id=\"qtyID\">Qty: 5</h4><i class=\"subtract_icon fas fa-minus\" id=\"minusID\"></i></div><button type=\"button\" class=\"cart_remove btn btn-primary\" id=\"ID\">Remove</button></div></div><hr class=\"hrID\">"

  //populate our data inside.
  template_container = template_container.replace("FILEPATH", "./res/" + id + ".jpg");
  template_container = template_container.replace("NAME", name);
  template_container = template_container.replace("PRICE", price + "/day");
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("QUANTITY", quantity);
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("ID", id);
  template_container = template_container.replace("ID", id);
  return template_container;
}

//hide the pay by credit card view and show the paypal view.
function paypal(){
  document.getElementById('form').style.display = 'none';
  document.getElementById('paypal').style.display = 'block';
}
//hide the paypal view and show the stripe credit card payment system.
function shopStripe(){
  document.getElementById('form').style.display = 'block';
  document.getElementById('paypal').style.display = 'none';
}


//form validation
$(document).ready(function () {

    $("#paypal").hide();

  $("#pay_button").on("click", function (e) {

    var isDeliveryLocationSpecified = $("#deliveryAddress").val();

    var isDeliveryChecked = $('#delivery').is(':checked');

    if(isDeliveryChecked && isDeliveryLocationSpecified === "") {
        return alert("You've selected delivery, please fill out the complete address for your packages to be delivered");
    }

    if (document.forms["payForm"]["fullName"].value == "") {
      alert("Name must be filled out");
      return false;
    }

    if(document.forms["payForm"]["email"].value == "") {
      alert("Email must be filled out.");
      return false;
    } else if(!document.forms["payForm"]["email"].value.includes("@")) {
      alert("Email is invalid. Make sure to include an @ symbol");
      return false;
    }

    if(document.forms["payForm"]["address"].value == "") {
      alert("Address must be filled out.");
      return false;
    }

    if(document.forms["payForm"]["city"].value == "") {
      alert("City must be filled out.");
      return false;
    }

    if(document.forms["payForm"]["state"].value == "") {
      alert("State must be filled out.");
      return false;
    }

    if(document.forms["payForm"]["zip"].value == "") {
      alert("ZIP must be filled out.");
      return false;
    } else if(isNaN(document.forms["payForm"]["zip"].value)) {
      alert("ZIP is invalid. Make sure your Zipcode is a number.");
      return false;
    }

    if(document.forms["payForm"]["card"].value == ""){
      alert("Card number must be filled out.");
      return false;
    } else if(isNaN(document.forms["payForm"]["card"].value)) {
      //regular expression to remove - and replace it with ""
      let newCard = document.forms["payForm"]["card"].value.replace(/-/g,'');
      if(isNaN(newCard)){
        alert("Card number is invalid. Make sure you're entering numbers.");
        return false;
      }
    } 
    
    let creditCardNumber = document.forms["payForm"]["card"].value.replace(/-/g,'');
    if(String(creditCardNumber).length != 16) {
      alert("Card number is invalid. Make sure to enter 16 digits.");
      return false;
    }

    if(document.forms["payForm"]["expiration"].value == ""){
      alert("Expiration date must be filled out.");
      return false;
    } else if(!document.forms["payForm"]["expiration"].value.includes("/")) {
      alert("Expiration date format is invalid. Correct format: mm/yy");
      return false;
    } else if(isNaN(document.forms["payForm"]["expiration"].value)) {
      let newCard = document.forms["payForm"]["expiration"].value.replace('/','');
      if(isNaN(newCard)){
        alert("Expiration date format is invalid. Correct format: mm/yy");
        return false;
      }
      let month = newCard[0] + newCard[1];
      if(month > 12){
        alert("Expiration date format is invalid. Correct format: mm/yy");
        return false;
      }
    } else if(document.forms["payForm"]["email"].value.length > 5) {
      alert("Expiration date format is invalid. Correct format: mm/yy");
      return false;
    }

    if(document.forms["payForm"]["CVC"].value == ""){
      alert("CVC number must be filled out.");
      return false;
    } else if(isNaN(document.forms["payForm"]["CVC"].value)) {
      alert("CVC number is invalid.");
      return false;
    } else if(document.forms["payForm"]["CVC"].value.length > 3) {
      alert("CVC number is invalid.");
      return false;
    }

    e.preventDefault();
    $("#pay_button").html("Making Payment <i  class=\"fas fa-circle-notch fa-spin\"></i>")
    timer = setTimeout(paymentComplete, 1500);

  })

  $('#in-store').click(function () {
    update_total_price();
  });

  $('#delivery').click(function () {
    update_total_price();
  });

  //update the number of items in the cart
  update_cart_item_count();

  var database = firebase.database();

  //our initial call to the database to pull all the product costs, and other information.

  for (var k = 0; k < localStorage.length; k++) {
    if (localStorage.key(k).includes("shop/")) {
      var id = localStorage.key(k).substring(5);

      database.ref('/products/' + id + "/").once('value').then(function (snapshot) {

        var name = snapshot.child("name").val();
        var description = snapshot.child("description").val();
        var price = snapshot.child("price").val();
        var currentID = snapshot.key;
        var currentQuantity = localStorage.getItem("shop/" + currentID);

        prices_dict[currentID] = price;

        var container_string = create_container(currentID, name, price, currentQuantity);

        $("#container_cart").append(container_string);

        $("#qty" + currentID).text("Qty: " + currentQuantity);

        //set callback on plus/minus buttons or remove buttons

        $("#" + currentID).on("click", function (e) {

          $(".hr" + currentID).remove();


          $("#" + currentID).parent().parent().remove();

          localStorage.removeItem("shop/" + currentID);

          update_cart_item_count();
          update_total_price();

        });

        //set callback on button

        $("#plus" + currentID).on("click", function (e) {

          var current = Number(localStorage.getItem('shop/' + currentID));

          var newQuantity = current + 1;

          localStorage.setItem("shop/" + currentID, newQuantity);
          $("#qty" + currentID).text("Qty: " + newQuantity);

          update_cart_item_count();

          update_total_price();

        });

        //set callback on button

        $("#minus" + currentID).on("click", function (e) {

          var current = Number(localStorage.getItem('shop/' + currentID));

          var newQuantity = current - 1;

          if (newQuantity <= 0) {
            $("#" + currentID).trigger("click");
          } else {
            localStorage.setItem("shop/" + currentID, newQuantity);
            $("#qty" + currentID).text("Qty: " + newQuantity);
          }

          update_cart_item_count();

          update_total_price();

        });

        //set callback on button

        $("#plusDay" + currentID).on("click", function (e) {
          var currentDaysString = $("#plusDay" + currentID).parent().children("h4").text().substring(6);
          var currentDaysNum = Number(currentDaysString);

          var newDays = currentDaysNum + 1;
          $("#plusDay" + currentID).parent().children("h4").text("Days: " + newDays);

          update_cart_item_count();
          update_total_price();


        });

        //set callback on button

        $("#subtractDay" + currentID).on("click", function (e) {
          var currentDaysString = $("#subtractDay" + currentID).parent().children("h4").text().substring(6);
          var currentDaysNum = Number(currentDaysString);

          var newDays = currentDaysNum - 1;

          if (newDays <= 0) {
            $("#" + currentID).trigger("click");
          } else {
            $("#subtractDay" + currentID).parent().children("h4").text("Days: " + newDays);
          }

          update_cart_item_count();
          update_total_price();

        });

      }).finally(function () {
        update_total_price();
      });
    }
  }
});
