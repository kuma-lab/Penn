/***********************************
/* initialize user for localStorage
************************************/
// @todo : replace by user's id and emailUser send by server
const idUser = 1234
const emailUser = 'dcentola@asc.upenn.edu'
// Set user Object with defaults values
const userOptions = {
  "email": emailUser,
  "feed": "press",
  "slideAll": 0,
  "slidePress": 0,
  "slidePub": 0,
  "slideTalk": 0
}

// If users exists on this browser
if (localStorage.getItem('usersOptions')) {
  // Get users options on local storage
  let usersOptionsStorage = JSON.parse(localStorage.getItem('usersOptions'))
  // Verify if idUser exist
  if(!usersOptionsStorage.hasOwnProperty(idUser)) {
    // idUser doesn't exit so we add it
    usersOptionsStorage[idUser] = userOptions
    localStorage.setItem('usersOptions', JSON.stringify(usersOptionsStorage))
  }
} else {
  // Else we initialized it with first user
  localStorage.setItem('usersOptions', JSON.stringify({[idUser]: userOptions}))
}

/*****************************************************************
/*                  Reminder features Sliders
/* 
/* 1 - Default "pub" slider initialization
/* 2 - If the last viewed slider is different from the pub slider 
/*     then initialization of the slider in the localStorage
/* 3 - Initialization of the other two sliders only if the user 
/*     hover over the top buttons to change slider (on mouseover 
/*     and not on click because the idea is to preload the slider 
/*     before the click to avoid its loading in unsightly step 
/*     for visitors).
*****************************************************************/

/**************************
/* Activate News Feed
***************************/
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
/* Activate News CTA
***************************/
function activateNewsCta(category) {
  for (let choice of choices) {
    choice.classList.remove('active')
  }
  document.querySelector('.bubbleContainer.' + category).classList.add('active')
}

/**************************
/* Activate News Year
***************************/
function activateNewsYear(category) {
  // init right date with current slide's date
  let currentSlideDom = document.querySelectorAll('.newsfeed.' + category + ' .slickContainer .slick-slide')[$('.newsfeed.' + category + ' .slickContainer').slick('slickCurrentSlide')]
  const year = currentSlideDom.firstChild.firstChild.getAttribute('data-content-year')
  document.querySelector('.headerNewsFeed .bubbleContainer.active .selectedDate').innerText = year
}

/**************************
/* Create Sliders NewsFeed
***************************/
function initSlick(category) {
  // Show slider when slider is init
  $('.newsfeed.' + category + ' .slickContainer').on('init', function (slick) {
    const slider = document.querySelector('.newsfeed.' + category)
    slider.classList.add('slickSlideInitialized')
  });

  $('.newsfeed.' + category + ' .slickContainer').slick({
    dots: false,
    infinite: false,
    lazyLoad: 'ondemand',
    slidesToShow: 3,
    slidesToScroll: 3,
    prevArrow: '.newsfeed.' + category + ' .slider .arrow.left',
    nextArrow: '.newsfeed.' + category + ' .slider .arrow.right',

    responsive: [
      {
        breakpoint: 1367,
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

  /****************************************************
  /*  Change date when user clic on an arrow sliders
  *****************************************************/
  $('.newsfeed.' + category + ' .slickContainer').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    let currentSlideDom = document.querySelectorAll('.newsfeed.' + category + ' .slickContainer .slick-slide')[nextSlide]
    const year = currentSlideDom.firstChild.firstChild.getAttribute('data-content-year')
    document.querySelector('.headerNewsFeed .bubbleContainer.' + category + ' .selectedDate').innerText = year
  });

  /****************************************************
  /*  Save slide active after each slider event
  *****************************************************/
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  // Save currentSlide for each category
  $('.newsfeed.' + category + ' .slickContainer').on('afterChange', function (event, slick, currentSlide) {
    // Save category feed on localStorage
    setUserOption(idUser, 'slide' + capitalizeFirstLetter(category), currentSlide)
  })
  
  // If currentSlide of category saved, go to the right slide
  if (getUserOption(idUser, 'slide' + capitalizeFirstLetter(category))) {
    $('.newsfeed.' + category + ' .slickContainer').slick('slickGoTo', getUserOption(idUser, 'slide' + capitalizeFirstLetter(category)))
  }

  /****************************************************
  /*  Transform lazyload image to background image
  *****************************************************/
  $(".slider").on("lazyLoaded", function(e, slick, image, imageSource) {
    parentSlide = $(image).parent(".newsFeedThumb")
    imageSource.src = image.attr("src")
    parentSlide.css("background-image", 'url("' + imageSource + '")').addClass("loaded")
    image.remove()
  });

  /**************************
  /* Create Select Button
  ***************************/
  // Create one date by article and all dates by slider
  let timeLineDates = []
  let slidesDates = document.querySelectorAll('.newsfeed.' + category + ' .cardContainer[data-content-year]')
  for (let date of slidesDates) {
    timeLineDates.push(date.getAttribute('data-content-year'))
  }
  // Keep unique dates
  let timeLineUniqueDates = [...new Set(timeLineDates)]
  // Sort desc value
  timeLineUniqueDates.sort((a, b) => b - a)

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
  initSlick('pub')

  // Active right feed with localStorage
  if (getUserOption(idUser, 'feed')) {
    switch (getUserOption(idUser, 'feed')) {
      case 'all':
        activateNewsFeed('all')
        for (let choice of choices) {
          choice.classList.add('active')
        }
        activateNewsYear('all')
        break;
      case 'talk':
        activateNewsFeed('talk')
        activateNewsCta('talk')
        activateNewsYear('talk')
        break;
      case 'press':
        activateNewsFeed('press')
        activateNewsCta('press')
        activateNewsYear('press')
        break;
      default:
        activateNewsFeed('pub')
        activateNewsCta('pub')
        activateNewsYear('pub')
    }
  }
});

// system launch videos
const videoPlayers = document.querySelectorAll('.newsFeedVideo')

for (let player of videoPlayers) {
  player.addEventListener('click', function () {
    let source = this.getAttribute('data-content-source')
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
const allFeed = document.querySelector('.bubbleContainer.all')
const selectsDateAll = document.querySelectorAll('.all .time')

allFeed.addEventListener('click', function () {
  for (let choice of choices) {
    choice.classList.add('active')
  }

  activateNewsFeed('all')
  simulateClick(selectsDateAll)
  activateNewsYear('all')
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
      if (!e.currentTarget.classList.contains('all'))
        choice.classList.remove('active')
    }
    choice.classList.add('active')
    let category = choice.getAttribute('data-category')
    activateNewsFeed(category)
    activateNewsYear(category)
    // Save category feed on localStorage
    setUserOption(idUser, 'feed', category)
  })

  // Init slider on hover to anticipate user's click and fix width slider bug
  choice.addEventListener('mouseenter', (event) => {
    let category = choice.getAttribute('data-category')
    let slider = document.querySelector('.newsfeed.' + category)

    if (!slider.classList.contains('slickSlideInitialized')) {
      initSlick(category)
    }
  })
}

// Select Date feature
const selectsDate = document.querySelectorAll('.time')
const overlayBody = document.body;

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
        overlayBody.removeEventListener('click', removeClickEvent)
      }
    }
    overlayBody.addEventListener('click', removeClickEvent);

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

// News link with feed's publications
const newsList = document.querySelectorAll('.newsWrapper[data-content-id]')
const allFeedCta = document.querySelector('.bubbleContainer.all')

for (let newsElt of newsList) {
  newsElt.addEventListener('click', function (e) {

    for (let newsElt of newsList) {
      newsElt.classList.remove('active')
    }
    newsElt.classList.add('active')
    newsId = newsElt.getAttribute('data-content-id')

    // 1 - click on allfeed CTA
    activateNewsFeed('all')
    activateNewsYear('all')
    for (let choice of choices) {
      choice.classList.add('active')
    }

    // 2 - Save All feed on localStorage
    setUserOption(idUser, 'feed', 'all')

    // 2 - find data-content-id on newsfeed all element and calculate index position of this slide
    let indexRightSlide = document.querySelector('.newsfeed.all .slickContainer .cardContainer[data-content-id="' + newsId + '"]').closest(".slick-slide").getAttribute('data-slick-index')

    // 3 - go to this slide
    $('.newsfeed.all .slickContainer').slick('slickGoTo', indexRightSlide)

    // 4 - add halo and remove their after 5 secondes
    let activeSlide = document.querySelector('.newsfeed.all .slickContainer .cardContainer[data-content-id="' + newsId + '"]').closest(".slick-slide")
    activeSlide.classList.add('active')
    setTimeout(function () {
      activeSlide.classList.remove('active')
      newsElt.classList.remove('active')
    }, 5000)

    const removeHalo = function () {
      activeSlide.classList.remove('active')
      newsElt.classList.remove('active')
      document.querySelector('body').removeEventListener('mousedown', removeHalo)
    }

    document.querySelector('body').addEventListener('mousedown', removeHalo)

    // 5 - scroll to the newsfeed all
    allFeedCta.scrollIntoView({ behavior: 'smooth' });
  })

}

// Ranking
const chartsBtn = document.querySelectorAll('.rankingBubbleContainer')
const charts = document.querySelectorAll('.ranking .chart')

for (let chartBtn of chartsBtn) {
  chartBtn.addEventListener('click', function () {
    // Logic for buttons 
    for (let chartBtn of chartsBtn) {
      chartBtn.classList.remove('active')
    }
    chartBtn.classList.add('active')

    // Logic for rankings
    for (let chart of charts) {
      chart.classList.remove('active')
      if (chart.classList.contains(chartBtn.getAttribute('data-category')))
        chart.classList.add('active')
    }
  })
}