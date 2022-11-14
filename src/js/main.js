/***************** SLIDER *************/
if (document.getElementById('slider') != null) {


}


if (document.getElementsByClassName('container') != null) {
    const accordion = document.getElementsByClassName('container');
    for (let i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener('click', function () {
            this.classList.toggle('active')
        })
    }
}


var burgerMenu = document.getElementById('burger-menu');
var overlay = document.getElementById('menu');
var body = document.getElementById('body');
burgerMenu.addEventListener('click', function () {
    this.classList.toggle("close");
    overlay.classList.toggle("overlay");
    body.classList.toggle("scrollOff");
});

