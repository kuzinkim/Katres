var debugTimes = false;

/**
 * Global Variables
 */

/**
 * Document Ready
 */

function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) {
        for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

        return arr2;
    }
}

function _iterableToArray(iter) {
    if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance");
}

document.addEventListener("DOMContentLoaded", function(event) {

    var swiper = new Swiper('.main-slider-container', {
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
    var slider = document.querySelector('.main-slider-container')

    if(slider !== null){
        
        slider.addEventListener('mouseenter', function(){
            swiper.autoplay.stop();
        })

        slider.addEventListener('mouseleave', function(){
            swiper.autoplay.start();
        })
    }

    var galleryThumbs = new Swiper('.detail-slider-thumbs', {
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,
        touchRatio: 0,
        navigation: {
            nextEl: '.detail-slider__arrow--next',
            prevEl: '.detail-slider__arrow--prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 2,
                spaceBetween: 15
            },
            350: {
                slidesPerView: 3,
            },
            470: {
                slidesPerView: 4,
                spaceBetween: 30
            }
        }
    });

    var gallery = new Swiper('.detail-slider-top', {
        spaceBetween: 10,
        thumbs: {
            swiper: galleryThumbs
        }
    });

    var descripGallery = new Swiper('.detail-description-container', {
        navigation: {
            nextEl: '.detail-description__slider-arrow--next',
            prevEl: '.detail-description__slider-arrow--prev',
        },
        breakpoints: {
            320: {
                slidesPerView: 1,
                spaceBetween: 15
            },
            768: {
                spaceBetween: 30,
                slidesPerView: 3,
            },
        }
    });

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

    // табы в карточке товара
    var tabButtons = _toConsumableArray(document.querySelectorAll('.detail-tabs__button'));
    var tabContents = _toConsumableArray(document.querySelectorAll('.detail-tabs__tab'));

    for (var j = 0; j < tabButtons.length; j += 1) {
        if (j === 0) {
            tabButtons[j].classList.add('detail-tabs__button_active');
        }

        tabButtons[j].addEventListener('click', function (e) {
            e.preventDefault();
            var target = e.target.getAttribute('href');
            var current = document.querySelector('.detail-tabs__tab_active');
            current.classList.remove('detail-tabs__tab_active');
            current.classList.add('detail-tabs__tab_hidden');
            var newActive = document.querySelector(target);
            newActive.classList.add('detail-tabs__tab_active');
            newActive.classList.remove('detail-tabs__tab_hidden');

            document.querySelector('.detail-tabs__button_active').classList.remove('detail-tabs__button_active');
            document.querySelector('.detail-tabs__button_preactive') && document.querySelector('.detail-tabs__button_preactive').classList.remove('detail-tabs__button_preactive');
            e.target.classList.add('detail-tabs__button_active');
            e.target.previousElementSibling && e.target.previousElementSibling.classList.add('detail-tabs__button_preactive');
        })
    }

    for (var k = 0; k < tabContents.length; k += 1) {
        if (k !== 0) {
            tabContents[k].classList.add('detail-tabs__tab_hidden');
        } else {
            tabContents[k].classList.add('detail-tabs__tab_active');
        }
    }
});

function initCompareTable(items, spcifications) {
	let $items = $(items);
	if (!$items[0]) return false;

	let responsive = [
		{
			breakpoint: 0,
			settings: {
				columns: 1,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 480,
			settings: {
				columns: 2,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 600,
			settings: {
				columns: 3,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 768,
			settings: {
				columns: 4,
				duplicate: 'in'
			}
		},
		{
			breakpoint: 992,
			settings: {
				columns: 4,
				duplicate: 'out'
			}
		},
		{
			breakpoint: 1280,
			settings: {
				columns: 5,
				duplicate: 'out'
			}
		},
	];

	if (spcifications) {
		responsive = [
			{
				breakpoint: 0,
				settings: {
					columns: 1,
				}
			},
			{
				breakpoint: 600,
				settings: {
					columns: 2,
				}
			},
			{
				breakpoint: 768,
				settings: {
					columns: 3,
				}
			},
			{
				breakpoint: 992,
				settings: {
					columns: 5,
				}
			},
			{
				breakpoint: 1280,
				settings: {
					columns: 7,
				}
			},
		];
	}

	for (let i = 0; i < $items.length; i++) {
		const item = $($items[i]);

		item.compareTable({
			sort: true,
			prev: '<svg width="10" height="10"><use xlink:href="/assets/images/sprite.svg#arrow"></use></svg>',
			next: '<svg width="10" height="10"><use xlink:href="/assets/images/sprite.svg#arrow"></use></svg>',
			folding: true,
			lines: 10,
			responsive: responsive,
		});
	}
}

$(document).ready(function() {
	// init tables
	initCompareTable('.js-table-props');
	initCompareTable('.js-compare-table', true);
});

