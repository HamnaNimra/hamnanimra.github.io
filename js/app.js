window.onscroll = function () { stickyNav() };

var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;
var pageName = document.getElementById("pageName");

function stickyNav() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
    pageName.style.opacity = "1";
  } else {
    navbar.classList.remove("sticky");
    pageName.style.opacity = "0";
  }
}

function navigationMenu() {
  var menu = document.getElementById("menu");
  if (menu.style.display == "block") {
    menu.style.display = "none";
  } else {
    menu.style.display = "block";
  }
}
