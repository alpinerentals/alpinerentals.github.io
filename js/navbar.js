window.onscroll = function() {scrollFunction()};

//add scroll functionality to the navbar so it shrinks slightly when you scroll down.
function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("navbar").style.padding = "3px 10px";
  } else {
    document.getElementById("navbar").style.padding = "12px 10px";
  }
}
