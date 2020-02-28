//create a template container for all the items to be rented.
function create_container(id, name, price) {
  var template_container = "<div class=\"col-4 product-item\"><div class=\"product-image\"><img src=\"FILEPATH\"></div><div class=\"product-text\"><h4>NAME</h4><h4 class=\"product-price-text\">$PRICE/day</h4><button type=\"button\" class=\"cart_button btn btn-primary\">Add to Cart</button><p class=\"product-id\">ID</p></div></div>"
  template_container = template_container.replace("FILEPATH", "../res/" + id + ".jpg");
  template_container = template_container.replace("NAME", name);
  template_container = template_container.replace("PRICE", price);
  template_container = template_container.replace("ID", id);

  return template_container;
}

//update the text which describes the # of items in cart.
function update_cart_item_count() {
  var numCart = 0
  for(var k = 0; k < localStorage.length; k++) {
    if (localStorage.key(k).includes("shop/")) {
      numCart += Number(localStorage.getItem(localStorage.key(k)));
    }
  }
  $('.cart_item_number').text(numCart);
  return numCart;
}


//wait until the UI elements have loaded on screen.
$(document).ready(function() {


  //update the number of items in the cart

  update_cart_item_count();

  //to determine which file is being served currently to go along with our ID conventions
  var idPrefix = 0;
  var filename = location.pathname.substring(location.pathname.lastIndexOf("/") + 1);
  if (filename == "camp_hike.html") {
      idPrefix = 1;
  } else if (filename == "climbing.html") {
      idPrefix = 2;
  } else if (filename == "cycle.html") {
      idPrefix = 3;
  } else if (filename == "paddle.html") {
      idPrefix = 4;
  } else if (filename == "photo.html") {
      idPrefix = 5;
  } else if (filename == "snow.html") {
      idPrefix = 6;
  }

  var database = firebase.database();
  database.ref('/products/').once('value').then(function(snapshot) {
    //var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';

    var i = 0;
    var arr = []
    snapshot.forEach(function(childSnapshot) {

      var id = childSnapshot.key;

      var firstDigit = (''+id)[0];
      if (firstDigit != idPrefix) { // if the current product doesn't match the category
          return; // this continues to the next iteration of the foreach
      }
      
      //get the ID, name, description, price, and stock from firebase.
      var name = childSnapshot.child("name").val();
      var description = childSnapshot.child("description").val();
      var price = childSnapshot.child("price").val();
      var stock = childSnapshot.child("stock").val();

      arr.push(create_container(id, name, price));

      //push the items into a grid with 3 items per grid row.
      if (i % 3 == 2) {
        var row_start_string = "<div class=\"row product-row\">"
        var row_end_string = "</div>"

        var total_html = row_start_string;

        for (var j = 0; j < arr.length; j++) {
          total_html += arr[j];
        }

        total_html += row_end_string;

        $(".products").append(total_html);

        arr = [];
      }


      i += 1;
    });

    var row_start_string = "<div class=\"row product-row\">"
    var row_end_string = "</div>"

    var total_html = row_start_string;

    for (var j = 0; j < arr.length; j++) {
      total_html += arr[j];
    }

    total_html += row_end_string;

    $(".products").append(total_html);

    //set the listener for all our buttons.

    //get the ID of the product that was selected and add it to cart.
    $(".cart_button").on("click", function(e) {

      var p_text = $(this).parent().children("p").text();

      localStorage.setItem("shop/" + p_text, Number(localStorage.getItem("shop/" + p_text)) + 1);

      var numCart = update_cart_item_count();

    });

  });

});
