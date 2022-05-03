(function ($) {
    $(function () {
  
  
      class Vacantions {
        constructor() {
          this.slider = $('.js-vacancy_list');
        }
  
        initializeSlider() {
          var $this = this;
  
          // On init event
          $this.slider.on('init', function (event) {
            var prevVacantions = $(event.target).find('.js-vacancy_item.slick-active').first().prev().length;
            var nextVacantions = $(event.target).find('.js-vacancy_item.slick-active').last().next().length;
  
            (!prevVacantions) ? $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__prev').addClass('js-ag-vacancy_arrow__hide') : $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__prev').removeClass('js-ag-vacancy_arrow__hide');
            (!nextVacantions) ? $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__next').addClass('js-ag-vacancy_arrow__hide') : $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__next').removeClass('js-ag-vacancy_arrow__hide');
          });
  
          $this.slider.slick({
            infinite: false,
            slidesToShow: 2,
            variableWidth: true,
            rows: false,
            arrows: true,
            adaptiveHeight: true,
            prevArrow: $('.js-ag-vacancy_arrow__prev'),
            nextArrow: $('.js-ag-vacancy_arrow__next'),
            responsive: [
              {
                breakpoint: 1200,
                settings: {
                  slidesToShow: 1,
                }
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: 2,
                }
              },
              {
                breakpoint: 600,
                settings: {
                  slidesToShow: 1,
                }
              }
            ]
          });
  
          // On swipe event
          $this.slider.on('swipe afterChange', function (event) {
            var prevVacantions = $(event.target).find('.js-vacancy_item.slick-active').first().prev().length;
            var nextVacantions = $(event.target).find('.js-vacancy_item.slick-active').last().next().length;
  
            (!prevVacantions) ? $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__prev').addClass('js-ag-vacancy_arrow__hide') : $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__prev').removeClass('js-ag-vacancy_arrow__hide');
            (!nextVacantions) ? $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__next').addClass('js-ag-vacancy_arrow__hide') : $('.js-ag-vacancy_arrow.js-ag-vacancy_arrow__next').removeClass('js-ag-vacancy_arrow__hide');
          });
        }
  
        init() {
          this.initializeSlider();
        }
      }
  
      var vacantions = new Vacantions();
      vacantions.init();
  
  
    });
  })(jQuery);