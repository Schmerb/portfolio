'use strict';

const state = {
    isMobile: false,
    hasTouch: false,
    scroll: {
        yPos: 0,
        up: false,
        baseYPos: 0,
        downBaseYPos: 0,
    }
};



// SELECTOR CONSTANTS

const CHECKOUT_BTN = '.checkout-btn';    

// Sections
const ABOUT_ME = '#about-me';
const PROJECTS = '#projects';
const CONTACT  = '#contact';

const FORM_FIELDS  = '.contact-form input, .contact-form textarea';
const CONTACT_FORM = '.contact-form';
const SUBMIT_BTN   = '.submit-btn';

const UP_ARROW      = '.icon-up-arrow-box';
const UP_ARROW_WRAP = '.up-icon-wrap';
const NAV_PROJECT   = '.project';
const NAV_ABOUT     = '.about';
const NAV_WORKFLOW  = '.workflow';
const NAV_CONTACT   = '.contact';



//================================================================================
// HTML Template literals
//================================================================================

function getTemplate(todo) {
    return `<div>
                ${todo}
            </div>`;
}


//================================================================================
// DOM / Display functions
//================================================================================

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Toggles the side menu
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function toggleMenu() {
    $('.main-nav')
        .add('.burger')
        .toggleClass('open');
    $('html')
        .add('body')
        .toggleClass('no-scroll');
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Adds hidden class to all classes passed in as args
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function hide() {
    Object.values(arguments).forEach((target) => {
        $(target).addClass('hidden');
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Removes hidden class from all classes passed in as args
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function show() {
    Object.values(arguments).forEach((target) => {
        $(target).removeClass('hidden');
    });
}



//================================================================================
// API handlers / Display handlers
//================================================================================


// TODO





//================================================================================
// API calls
//================================================================================


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Sends email to me on form submit
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function sendEmail($form) {
    // hide previous error
    hide('.error');
    // start sending animation
    $(SUBMIT_BTN).addClass('sending');

    console.log($form[0][0].value);
    console.log($form[0][1].value);
    console.log($form[0][2].value);

    console.log($form.serialize());

    $.ajax({
        url: "https://formspree.io/mikeschmerbeck@gmail.com",
        method: "POST",
        data: $form.serialize(),
        dataType: 'json',
        success: res => {
            $(SUBMIT_BTN).removeClass('sending')
                         .addClass('sent')
                         .addClass('fadeOut')
                         .find('span')
                         .text('SENT!');
            setTimeout(() => {
                // wait 3s then clear form and reset button
                $form[0].reset();
                $(FORM_FIELDS).siblings('span')
                              .removeClass('move');
                $(SUBMIT_BTN).removeClass('sent')
                             .removeClass('fadeOut')
                             .find('span')
                             .text('Send');
            }, 3000);  
        },
        error: (jqXHR, status, err) => {
            console.log({jqXHR, status, err});
            console.log(jqXHR.responseJSON.error);

            // stop sending animation
            $(SUBMIT_BTN).removeClass('sending');
            // display error message
            show('.error');
            $(CONTACT_FORM).find('input[type=text]').focus();
        }
    });
}






//================================================================================
// Utility functions
//================================================================================

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Gives a smooth animation to page navigation bringing the 
// target element to the top of the window
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function smoothScroll(target, duration = 1200, offset = 0) {
    $('body, html').animate({
        scrollTop: $(target).offset().top - offset
    }, duration);
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Check screen size to determine Mobile Vs. Desktop
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function checkSizeHandler() {
    checkSize();
    $(window).resize(checkSize); 
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Called by checkSizeHandler to set state if mobile view
// or not (Portrait view)
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function checkSize() {
    state.isMobile = window.innerWidth <= 414;

    fixBannerImg();
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Checks if a user has touched their device and
// applies class to body and global var indicating whether
// user has touched / can touch. 
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function checkForTouch() {
    window.addEventListener('touchstart', function onFirstTouch() {
        // or set your app's state however you normally would
        state.hasTouch = true;
        // we only need to know once that a human touched the screen, so we can stop listening now
        window.removeEventListener('touchstart', onFirstTouch, false);
    }, false);
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Checks if an element is visible in order to slide
// it into place on scroll
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function slideIntoPlace() {
    const win     = $(window);
    const targets = ['.target',
                     '.tech-logos li',
                     '.links-list li',
                     '.proj-details',
                     '.workflow-section li'
                    ];
    const allMods = $(targets.join(', '));

    allMods.each((i, el) => {
        const $el = $(el);
        $el.isVisible(true) ? $el.addClass("already-visible") : null; 
    });

    win.scroll(e => {
        allMods.each((i, el) => {
            const $el = $(el);
            $el.isVisible(true) ? $el.addClass("slide-in") : null; 
        });
    });
}

$.fn.isVisible = function(partial) {
    var $t            = $(this),
        $w            = $(window),
        viewTop       = $w.scrollTop(),        // Top of window to top of document
        viewBottom    = viewTop + $w.height(), // bottom of window to top of document
        _top          = $t.offset().top,       // Distance from top of element to top of document
        _bottom       = _top + $t.height(),    // Distance form bottom of element to top of document
        compareTop    = partial === true ? _bottom : _top,
        compareBottom = partial === true ? _top : _bottom;

    return ((compareBottom <= viewBottom) && (compareTop >= viewTop));
};

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Places event listener to fire on scroll
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
let timer;
function checkScrollPos() {
    $(window).scroll(() => {
        toggleUpArrow();
        fixBanner();
        // start timer to fade out burger icon after 3s
        window.clearTimeout(timer);
        timer = window.setTimeout(function() {
            if($('.fixed-banner').hasClass('show') && !$('.main-nav').hasClass('open')) {
                $('.fixed-banner').removeClass('fix')
                                  .removeClass('show');
            }
        }, 3000);
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Checks vertical scroll position and hides/shows up arrow
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function toggleUpArrow() {
    let winToTop       = $(document).height() - $(window).scrollTop();
    let distFromBottom = winToTop - $(window).height();
    if(distFromBottom >= 100) {
        $(UP_ARROW).add(UP_ARROW_WRAP).addClass('fade');
    } else {
        show(UP_ARROW_WRAP);
        setTimeout(() => {
            $(UP_ARROW).add(UP_ARROW_WRAP).removeClass('fade');
        }, 100);
    }
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Fixes banner to top of window below header
// on upward scrolls
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function fixBanner() {
    let current = $(window).scrollTop();
    if(current > $('.banner').height()) {
        $('.fixed-banner').addClass('fix');
    } else {
        $('.fixed-banner').removeClass('fix');
    }
    
     // if current yPos is less than previous, scrolling upwards
     if(current <= state.scroll.yPos) {
        
        // scrolled upwards for 10 or more px
        if(state.scroll.baseYPos - current >= 10) {
            let distFromBottom = $(document).height() - current - $(window).height();
            if(distFromBottom > 200) {
                $('.fixed-banner').addClass('show');
            }
        }

        // just started going up, keep track of beginning of upwards distance
        if(state.scroll.up === false) {
            state.scroll.baseYPos = current;
        }
        state.scroll.up = true;
    } else {// scrolling downwards

        // just started going dowm, keep track of beginning of downwards distance
        if(state.scroll.up === true) {
            state.scroll.downBaseYPos = current; 
        }

        // scrolled downwards for 40 or more px
        // Making sure its more than 100px from top ensures
        // an overscroll event above document wont trigger it
        if(current - state.scroll.downBaseYPos >= 40 && current >= 100) {
            $('.fixed-banner').removeClass('show');
        }
        
        state.scroll.up = false;
        state.scroll.baseYPos = 0;
    }
    state.scroll.yPos = current;
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// make sure that user can scroll in case menu disappears
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function checkIfUserCanScroll() {
    if($('.fixed-banner').hasClass('fix') 
        && !$('.fixed-banner').hasClass('show')
        && $('body').hasClass('no-scroll')
        && $('html').hasClass('no-scroll')) {
            // reset no-scroll classes
            $('html').add('body').removeClass('no-scroll');
    }
}  

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Sets max-height of banner image to current height to
// avoid page jump due to search bar showing / hiding on
// mobile devices
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function fixBannerImg() {
    $('.banner').css('max-height', '');
    let h = $('.banner').height();
    $('.banner').css('max-height', h);
}




//================================================================================
// Event Listeners
//================================================================================
function checkoutProjectsClick() {
    $(CHECKOUT_BTN).on('click', e => {
        e.preventDefault();
        smoothScroll(PROJECTS, 1000);
    });    
}
// toggles slide menu
function burgerClick() {
    $('.burger-btn').on('click', e => {
        e.preventDefault();
        toggleMenu();
    });
}
// toggles slide menu to close
function menuClick() {
    $('.main-nav').on('click', e => {
        toggleMenu();
    });
}

//
// Contact Form
//
function contactFormFocus() {
    $(FORM_FIELDS).on('focusin', function(e) {
        e.preventDefault();
        $(this).siblings('span').addClass('move');
    });
    $(FORM_FIELDS).on('focusout', function(e) {
        e.preventDefault();
        if(!($(this).val().trim())) {
            $(this).siblings('span').removeClass('move');
        }
    });
}

function contactFormSubmit() {
    $(CONTACT_FORM).on('submit', function(e) {
        e.preventDefault();
        // $(SUBMIT_BTN).removeClass('error');
        sendEmail($(this));
    });
}

// Footer
function upArrowClick() {
    $(UP_ARROW).on('click', function(e) {
        e.preventDefault();
        smoothScroll('header');
    });
}
function navItemClicks() {
    $(NAV_PROJECT).on('click', e => {
        e.preventDefault();
        smoothScroll('#projects');
    });
    $(NAV_ABOUT).on('click', e => {
        e.preventDefault();
        smoothScroll('#about-me');
    });
    $(NAV_WORKFLOW).on('click', e => {
        e.preventDefault();
        smoothScroll('#workflow');
    });
    $(NAV_CONTACT).on('click', e => {
        e.preventDefault();
        smoothScroll('#contact');
    });
}

//================================================================================
// Event Listener Groups
//================================================================================

function navClicks() {
    checkoutProjectsClick();
    navItemClicks();
    burgerClick();
    menuClick();
}

function bodyClicks() {
    contactFormFocus();
    contactFormSubmit();
}

function footerClicks() {
    upArrowClick();
}

//================================================================================
// Utility and Initialization handlers
//================================================================================

function utils() {
    checkSizeHandler();
    checkScrollPos();
    checkForTouch();
    fixBannerImg();
    slideIntoPlace();
}

function init() {
    // displaySlider(); // initializes slick slider
    // responsiveReslick(); // tears down and reslicks slider on window resize
}

//================================================================================
// Entry point -- Main
//================================================================================

$(function () {
    utils();

    navClicks();
    bodyClicks();
    footerClicks();

    init();

});
// // // // // // // // // // // // // // //
// 
//   Particles Config
//
// // // // // // // // // // // // // // // 


particlesJS("particles-js", {
    "particles": {
      "number": {
        "value": 50,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": "#ffffff"
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg", 
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 3,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": "#ffffff",
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 5,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "bounce": false,
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "grab"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 140,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 10
        },
        "repulse": {
          "distance": 200,
          "duration": 0.4
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  });

// // // // // // // // // // // // // // //
// 
//   Slick Carousel 
//
// // // // // // // // // // // // // // // 

const SLIDER = '.slider';

// * * * * * * * * * * * * * * * * * * * * * * * * * 
// Drone banner carousel
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function initSlider() {
    $(SLIDER).slick({
        dots: false,
        arrows: true,
        infinite: false,
        speed: 2400,
        slidesToShow: 4,
        slidesToScroll: 4,
        variableWidth: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4
                }
            },
            {
                breakpoint: 860,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3
                }
            },
            {
                breakpoint: 580,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 415,
                settings: {
                    speed: 2000,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    cssEase: 'ease-in-out'
                }
            }
            // You can unslick at a given breakpoint now by adding:
            // settings: "unslick"
            // instead of a settings object
        ]
    });
}


// * * * * * * * * * * * * * * * * * * * * * * * * * 
// Intializes slider and sets height to zero
// before and unsets height after it is 'slicked'
// to avoid FOUC
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function displaySlider() {
    $('.slick-slider').css('height', '0px');
    initSlider();
    $('.slick-slider').css('height', '');
}


// * * * * * * * * * * * * * * * * * * * * * * * * * 
//          Destroys slick carousels
// @params   Slider element to be destroyed
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function unslick(SLIDER) {
    if ($(SLIDER).hasClass('slick-initialized')) {
        $(SLIDER).slick('unslick');
    }
}


// * * * * * * * * * * * * * * * * * * * * * * * * * 
//  Used to reslick sliders on window resize 
//  inccrease. 
//  Slick settings handles unslick for mobile 
//  but does not reslick when window size increases
// * * * * * * * * * * * * * * * * * * * * * * * * * 
function responsiveReslick() {
    $(window).resize(function () {
        let width = parseInt($('body').css('width'));
        if (!$(SLIDER).hasClass('slick-initialized')) {
            initSlider();
        }
    });
}