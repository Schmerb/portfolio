'use strict';

const state = {
    isMobile: false,
    hasTouch: false
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
function checkScrollPos() {
    $(window).scroll(() => {
        // fixBanner(); TODO
        toggleUpArrow();
    });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// Checks vertical scroll position and hides/shows up arrow
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
function toggleUpArrow() {
    let winToTop       = $(document).height() - $(window).scrollTop();
    let distFromBottom = winToTop - $(window).height();
    if(distFromBottom >= 200) {
        $(UP_ARROW).add(UP_ARROW_WRAP).addClass('fade');
    } else {
        show(UP_ARROW_WRAP);
        setTimeout(() => {
            $(UP_ARROW).add(UP_ARROW_WRAP).removeClass('fade');
        }, 100);
    }
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