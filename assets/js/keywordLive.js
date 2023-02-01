
/*********************************************************
/* Create All animation to Scroll to the right year block
**********************************************************/
function scrollToElm(container, elm, duration) {
    var pos = getRelativePos(elm);
    scrollTo(container, pos.top, duration);  // duration in seconds
}

function getRelativePos(elm) {
    var pPos = elm.parentNode.getBoundingClientRect(), // parent pos
        cPos = elm.getBoundingClientRect(), // target pos
        pos = {};

    pos.top = cPos.top - pPos.top + elm.parentNode.scrollTop,
        pos.right = cPos.right - pPos.right,
        pos.bottom = cPos.bottom - pPos.bottom,
        pos.left = cPos.left - pPos.left;

    return pos;
}

function scrollTo(element, to, duration, onDone) {
    var start = element.scrollTop,
        change = to - start,
        startTime = performance.now(),
        val, now, elapsed, t;

    function animateScroll() {
        now = performance.now();
        elapsed = (now - startTime) / 1000;
        t = (elapsed / duration);

        element.scrollTop = start + change * easeInOutQuad(t);

        if (t < 1)
            window.requestAnimationFrame(animateScroll);
        else
            onDone && onDone();
    };

    animateScroll();
}

function easeInOutQuad(t) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t };

/**************************
/* Create Sliders TimeLine
***************************/
function initSlick() {
    // Create one date by block year with articles
    let timeLineDates = [];
    let allDates = document.querySelectorAll('.listArticlesByYears .year')
    for (let date of allDates) {
        timeLineDates.push(date.innerHTML)
    }
    // Keep unique dates
    let timeLineUniqueDates = [...new Set(timeLineDates)]
    // Sort desc value
    timeLineUniqueDates.sort((a, b) => b - a);

    // Insert dates on timeline
    const listDates = document.querySelector('.keywordsTimeLine .timeContainer');
    for (let date of timeLineUniqueDates) {
        listDates.innerHTML += '<div>' + date + '</div>'
    }

    // Slider TimeLine
    $('.keywordsTimeLine .timeContainer').slick({
        infinite: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerMode: true,
        variableWidth: true,
        rows: false,
        arrows: true,
        adaptiveHeight: true,
        focusOnSelect: true,
        transformEnabled: false,
        useTransform: false,
        prevArrow: $('.keywordsTimeLine .timeContainerArrowPrev'),
        nextArrow: $('.keywordsTimeLine .timeContainerArrowNext')
    });

    /****************************************************
    /*  Change index when user clic on an arrow timeline
    /****************************************************/
    $('.keywordsTimeLine .timeContainer').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
        let year = document.querySelectorAll('.keywordsTimeLine .timeContainer .slick-slide')[nextSlide].innerHTML
        // Find element to scroll and get it top position to scroll with this container
        const element = document.querySelector('.mediaContainer[data-content-year="' + year + '"]');
        const containerBlocksYears = document.getElementsByClassName('flexContainer')[0];
        scrollToElm(containerBlocksYears, element, .2);
    });

    /****************************************
    /* Change index when user clic on a date
    *****************************************/
    const timeLineSlides = document.querySelectorAll('.slick-slide')
    for (let year of timeLineSlides) {
        year.addEventListener('click', function (e) {
            // Find year clicked on the timeline
            let indexRightYear = e.target.innerHTML;
            // Find element to scroll and get it top position to scroll with this container
            const element = document.querySelector('.mediaContainer[data-content-year="' + indexRightYear + '"]');
            const containerBlocksYears = document.getElementsByClassName('flexContainer')[0];
            scrollToElm(containerBlocksYears, element, .2);
        })
    }

}

$(document).ready(function () {
    initSlick();

    // Masonry Grid to list blocks with varying heights
    $('.flexContainer').masonry({});
});