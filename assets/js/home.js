/***********************************
/* initialize email for localStorage
************************************/

const email = localStorage.getItem('email') ? localStorage.getItem('email') : 'unknown'

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
/* Create Sliders NewsFeed
***************************/
function initSlick(category) {

  // Sliders feed
  const buttonsOpanModal = document.querySelectorAll('.openModal');

  // Show slider when slider is init
  $('.newsfeed.' + category + ' .slickContainer').on('init', function (slick) {
    const slider = document.querySelector('.newsfeed.' + category)
    slider.classList.add('slickSlideInitialized')
  });

  $('.newsfeed.' + category + ' .slickContainer').slick({
    dots: false,
    infinite: false,
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

  /****************************************************
  /*  Change date when user clic on an arrow sliders
  *****************************************************/
  $('.newsfeed.' + category + ' .slickContainer').on('beforeChange', function (event, slick, currentSlide, nextSlide) {
    let currentSlideDom = document.querySelectorAll('.newsfeed.' + category + ' .slickContainer .slick-slide')[nextSlide]
    const year = currentSlideDom.firstChild.firstChild.getAttribute('data-content-year')
    document.querySelector('.headerNewsFeed .bubbleContainer.active .selectedDate').innerText = year
  });


  /****************************************************
  /*  Save slide active after each slider event
  *****************************************************/
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Save currentSlide for each category
  $('.newsfeed.' + category + ' .slickContainer').on('afterChange', function (event, slick, currentSlide) {
    // Save category feed on localStorage
    localStorage.setItem(email + '-slide' + capitalizeFirstLetter(category), currentSlide)
  });

  // If currentSlide of category saved, go to the right slide
  if (localStorage.getItem(email + '-slide' + capitalizeFirstLetter(category))) $('.newsfeed.' + category + ' .slickContainer').slick('slickGoTo', localStorage.getItem(email + '-slide' + capitalizeFirstLetter(category)))

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

  // Active right feed with localStorage
  if (localStorage.getItem(email + '-feed')) {
    switch (localStorage.getItem(email + '-feed')) {
      case 'all':
        activateNewsFeed('all')
        for (let choice of choices) {
          choice.classList.add('active')
        }
        break;
      case 'talk':
        activateNewsFeed('talk')
        activateNewsCta('talk')
        break;
      case 'press':
        activateNewsFeed('press')
        activateNewsCta('press')
        break;
      default:
        activateNewsFeed('pub')
        activateNewsCta('pub')
    }
  }
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
const allFeed = document.querySelector('.bubbleContainer.all')
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
      if (!e.currentTarget.classList.contains('all'))
        choice.classList.remove('active')
    }
    choice.classList.add('active')
    let category = choice.getAttribute('data-category')
    activateNewsFeed(category)
    // Save category feed on localStorage
    localStorage.setItem(email + '-feed', category)
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
    newsId = newsElt.getAttribute('data-content-id');

    // 1 - click on allfeed CTA
    activateNewsFeed('all')
    for (let choice of choices) {
      choice.classList.add('active')
    }

    // 2 - Save All feed on localStorage
    localStorage.setItem(email + '-feed', 'all');

    // 2 - find data-content-id on newsfeed all element and calculate index position of this slide
    let indexRightSlide = document.querySelector('.newsfeed.all .slickContainer .cardContainer[data-content-id="' + newsId + '"]').closest(".slick-slide").getAttribute('data-slick-index')

    // 3 - go to this slide
    $('.newsfeed.all .slickContainer').slick('slickGoTo', indexRightSlide)

    // 4 - scroll to the newsfeed all
    allFeedCta.scrollIntoView({ behavior: 'smooth' });

    // 5 - remove class active when click in body 
    overlayBody.addEventListener('click', function (e) {
      for (let choice of choices) {
        choice.classList.remove('active')
      }
    })

    // 6 - Remove active class when user clic outside
    const removeClickEventNews = function (e) {
      const classNamesTime = ['newsList', 'newsWrapper', 'avatarContainer', 'avatar', 'txtInfos', 'name', 'iframeContainer', 'newsFeedThumb', 'newsMessage ']
      if (!classNamesTime.some(classNameTime => e.target.classList.contains(classNameTime))) {
        // Hide all select Button Open
        newsElt.classList.remove('active')
        overlayBody.removeEventListener('click', removeClickEventNews)
      }
    }
    overlayBody.addEventListener('click', removeClickEventNews);
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