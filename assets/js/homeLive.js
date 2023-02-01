
const newsFeeds = document.querySelectorAll('.newsfeed')

function activateNewsFeed(category) {
    for (let newsFeed of newsFeeds) {
        newsFeed.classList.remove('active')
    }
    document.querySelector('.newsfeed.' + category).classList.add('active')

    let slickContainer = document.querySelector('.newsfeed.' + category + ' .slickContainer')
    if (!slickContainer.classList.contains('slick-slider')) {
        initSlick(category)
    } else {
        //  Make sure slider is adjusted to any resize since it was last displayed
        $('.newsfeed.' + category + ' .slickContainer').slick('setPosition')
    }
}

/**************************
/* Create Sliders NewsFeed
***************************/
function initSlick(category) {

    // Sliders feed
    const buttonsOpanModal = document.querySelectorAll('.openModal');

    $('.newsfeed.' + category + ' .slickContainer').slick({
        dots: false,
        infinite: false,
        slidesToShow: 3,
        slidesToScroll: 3,
        prevArrow: '.newsfeed.' + category + ' .slider .arrow.left',
        nextArrow: '.newsfeed.' + category + ' .slider .arrow.right',

        responsive: [
            {
                breakpoint: 1025,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2
                }
            },
            {
                breakpoint: 601,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]
    });

    // Disabled Click on modal when user swipe
    $('.newsfeed.' + category + ' .slickContainer').on('swipe', function (event, slick, direction) {
        for (let buttonOpanModal of buttonsOpanModal) {
            buttonOpanModal.classList.add('disabledModal')
        }

        setTimeout(function () {
            for (let buttonOpanModal of buttonsOpanModal) {
                buttonOpanModal.classList.remove('disabledModal')
            }
        }, 0.5)
    });

    /**************************
    /* Create Select Button
    ***************************/
    // Create one date by article and all dates by slider
    let timeLineDates = [];
    let slidesDates = document.querySelectorAll('.newsfeed.' + category + ' .cardContainer[data-content-year]')
    for (let date of slidesDates) {
        timeLineDates.push(date.getAttribute('data-content-year'))
    }
    // Keep unique dates
    let timeLineUniqueDates = [...new Set(timeLineDates)]
    // Sort desc value
    timeLineUniqueDates.sort((a, b) => b - a);

    // Insert dates on select Date
    const listDates = document.querySelector('.bubbleContainer.' + category + ' .time .listDates')
    for (let date of timeLineUniqueDates) {
        listDates.innerHTML += '<li class="dateOption">' + date + '</li>'
    }
    // Add the date by default (first of the list)
    const firstDate = document.querySelector('.bubbleContainer.' + category + ' .time .selectedDate')
    firstDate.innerHTML = timeLineUniqueDates[0]
}

$(document).ready(function () {
    initSlick('pub');
});

// system launch videos
const videoPlayers = document.querySelectorAll('.newsFeedVideo')

for (let player of videoPlayers) {
    player.addEventListener('click', function () {
        let source = this.getAttribute('data-content-source');
        this.innerHTML = '<iframe width="100%" height="285px" src="' + source + '?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
    })
}

// To Simulate Click on another element 
const simulateClick = function (elem) {
    let evt = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
    });
};

const closeSelectDate = function () {
    // Hide all select Button Open
    const selectsDate = document.querySelectorAll('.time')
    for (let selectDate of selectsDate) {
        selectDate.classList.remove('active')
    }
}

// Active news feed
const choices = document.querySelectorAll('.bubbleContainer')
const allFeed = document.querySelector('#allFeed')
const selectsDateAll = document.querySelectorAll('.all .time')

allFeed.addEventListener('click', function () {
    for (let choice of choices) {
        choice.classList.add('active')
    }

    activateNewsFeed('all')
    simulateClick(selectsDateAll)
});

for (let choice of choices) {
    choice.addEventListener('click', function (e) {
        // Remove regenerated carousel when user click on Select Years Button
        const classNamesTime = ['time', 'selectDate', 'list', 'selectedDate', 'dateOption']
        if (classNamesTime.some(classNameTime => e.target.classList.contains(classNameTime)))
            return;
        // Hide all select Button Open
        closeSelectDate()
        // Show the right carousel
        for (let choice of choices) {
            choice.classList.remove('active')
        }
        choice.classList.add('active')
        let category = choice.getAttribute('data-category')
        activateNewsFeed(category)
    })
}

// Select Date feature
const selectsDate = document.querySelectorAll('.time')
const overlaySelect = document.body;

for (let selectDate of selectsDate) {
    selectDate.addEventListener('click', function (e) {
        // Show the right select and active right(s) button(s)
        selectDate.classList.toggle('active')

        // Close Select Button when user clic outside
        const removeClickEvent = function (e) {
            const classNamesTime = ['time', 'selectDate', 'list', 'selectedDate', 'dateOption']
            if (!classNamesTime.some(classNameTime => e.target.classList.contains(classNameTime))) {
                // Hide all select Button Open
                closeSelectDate()
                overlaySelect.removeEventListener('click', removeClickEvent)
            }
        }
        overlaySelect.addEventListener('click', removeClickEvent);

        // Configure each options of selectDate
        const optionsDate = selectDate.querySelectorAll('.listDates li')
        const selectedDate = selectDate.querySelector('.selectedDate')
        for (let optionDate of optionsDate) {
            optionDate.addEventListener('click', function (e) {
                selectedDate.innerHTML = e.currentTarget.textContent
                // Find index to the right slide
                const category = selectedDate.closest('.bubbleContainer').getAttribute('data-category')
                let indexRightSlide = document.querySelector('.newsfeed.' + category + ' .slickContainer .cardContainer[data-content-year="' + e.currentTarget.textContent + '"]').closest(".slick-slide").getAttribute('data-slick-index')
                $('.newsfeed.' + category + ' .slickContainer').slick('slickGoTo', indexRightSlide)
                // if All Select Selected
                const isAllSelected = document.querySelector('.bubbleContainer.all').classList.contains('active')
                if (isAllSelected) {
                    for (let choice of choices) {
                        choice.classList.add('active')
                    }
                }
            })
        }
    })
}

// Ranking
const charts = document.querySelectorAll('.ranking .chart')
const chartSelect = document.getElementById('rankingFiles')

chartSelect.addEventListener('change', function () {
    for (let chart of charts) {
        chart.classList.remove('active')
    }
    document.querySelector('.ranking .chart.' + this.value).classList.add('active')
})