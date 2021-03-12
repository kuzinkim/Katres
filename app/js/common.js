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
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
    });

    var slider = document.querySelector('.swiper-container')

    slider.addEventListener('mouseenter', function(){
        swiper.autoplay.stop();
    })

    slider.addEventListener('mouseleave', function(){
        swiper.autoplay.start();
    })

    var burger = document.querySelector(".js-burg")
    var closeBtn = document.querySelector(".js-close")
    var wrapper = document.querySelector(".wrapper")
    var lockPaddingValue = window.innerWidth - document.querySelector('.wrapper').offsetWidth + "px";

    burger.addEventListener('click', function(){
        var menu = document.querySelector(".header__menu")
        var body = document.querySelector("body")
        
        if(!menu.classList.contains('is-active')){
            menu.classList.add('is-active')
            wrapper.classList.add('is-active')
            body.classList.add('is-hidden')
            body.style.paddingRight = lockPaddingValue;
        }
    });
    
    closeBtn.addEventListener('click', function(){
        var menu = document.querySelector(".header__menu")
        var body = document.querySelector("body")
        
        if(menu.classList.contains('is-active')){
            menu.classList.remove('is-active');
            wrapper.classList.remove('is-active');

            setTimeout(function(){
                body.classList.remove('is-hidden');
                body.style.paddingRight = "0";
            }, 500)
            
        }
    });
});