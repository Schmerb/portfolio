'use strict';

const state = {
    isMobile: false,
    hasTouch: false
};



// SELECTOR CONSTANTS





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


// TODO







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


//================================================================================
// Event Listeners
//================================================================================



//================================================================================
// Event Listener Groups
//================================================================================

function navClicks() {
}

function footerClicks() {
}

//================================================================================
// Utility and Initialization handlers
//================================================================================

function utils() {
    checkSizeHandler();
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
    init();
});