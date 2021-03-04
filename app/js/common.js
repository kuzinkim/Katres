var debugTimes = false;

/**
 * Global Variables
 */

/**
 * Document Ready
 */
document.addEventListener("DOMContentLoaded", function(event) {
    var swiper = new Swiper('.swiper-container', {
        navigation: {
          nextEl: '.main-slider__arrow--next',
          prevEl: '.main-slider__arrow--prev',
        },
        touchRatio: 0,
        pagination: {
            el: '.swiper-pagination',
        },
    });
});