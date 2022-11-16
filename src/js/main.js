/***************** SLIDER *************/
if (document.getElementById('slider') != null) {
    var swiper = new Swiper('.slider', {
        slidesPerView: 2,
        spaceBetween: 30,
        grabCursor: true,
        speed: 500,
        pagination: {
            el: '.slider__pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.slider__button-next',
            prevEl: '.slider__button-prev',
        },
    });

}

/*********** ACCARDEON **********/
if (document.getElementsByClassName('container') != null) {
    const accordion = document.getElementsByClassName('container');
    for (let i = 0; i < accordion.length; i++) {
        accordion[i].addEventListener('click', function () {
            this.classList.toggle('active')
        })
    }
}
/********** END ACCARDEON **********/

/******** MENU ********/
var burgerMenu = document.getElementById('burger-menu');
var overlay = document.getElementById('menu');
var body = document.getElementById('body');
burgerMenu.addEventListener('click', function () {
    this.classList.toggle("close");
    overlay.classList.toggle("overlay");
    body.classList.toggle("scrollOff");
});
/******** END MENU ********/
