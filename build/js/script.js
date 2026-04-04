jQuery('document').ready(function () {
  function footerToBottom() {
    var browserHeight = jQuery(window).height(),
      footerOuterHeight = jQuery('footer').outerHeight(true),
      mainHeightMarginPaddingBorder =
        jQuery('#main').outerHeight(true) - jQuery('#main').height();
    jQuery('#main').css({
      'min-height':
        browserHeight - footerOuterHeight - mainHeightMarginPaddingBorder - 120,
    });
  }
  footerToBottom();
  jQuery(window).resize(function () {
    footerToBottom();
  });
  ////////////////////////
  jQuery('.navbar-nav li a.nav-link').click(function () {
    var selected = jQuery(this).attr('href');
    jQuery.scrollTo(selected, 700, {
      offset: function () {
        return { top: -129 };
      },
    });
    jQuery('.navbar-collapse').collapse('hide');
    jQuery('.menu_button').removeClass('active');
    jQuery('.navbar-nav li').removeClass('active');
    jQuery(this).parents('.navbar-nav li').addClass('active');
    return false;
  });
  ////////////////////////

  /////////////////////////////////
  jQuery('.product_slider').slick({
    prevArrow: '<div class="prev"><i class="icofont-thin-left"></i></div>',
    nextArrow: '<div class="next"><i class="icofont-thin-right"></i></div>',
    dots: false,
    infinite: true,
    arrows: true,
    speed: 600,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          touchThreshold: 100,
          swipeToSlide: true,
          slidesToShow: 3,
        },
      },
    ],
  });

  //////////////////////////////////////////
  function init() {
    window.addEventListener('scroll', function (e) {
      var distanceY = window.pageYOffset || document.documentElement.scrollTop,
        shrinkOn = 50,
        header = document.querySelector('header');
      if (distanceY > shrinkOn) {
        classie.add(header, 'smaller');
      } else {
        if (classie.has(header, 'smaller')) {
          classie.remove(header, 'smaller');
        }
      }
    });
    window.addEventListener('load', function (e) {
      var distanceY = window.pageYOffset || document.documentElement.scrollTop,
        shrinkOn = 100,
        header = document.querySelector('header');
      if (distanceY > shrinkOn) {
        classie.add(header, 'smaller');
      } else {
        if (classie.has(header, 'smaller')) {
          classie.remove(header, 'smaller');
        }
      }
    });
  }
  window.onload = init();
  ////////////////////////////
  //jQuery('input[name="phone"]').mask("+7 (999) 999-99-99");
  ////////////////////////////
  //jQuery('.item_title').matchHeight();
  /////////////////////////////

  jQuery(window).scroll(function () {
    if (jQuery(this).scrollTop() != 0) {
      jQuery('#toTop').fadeIn();
    } else {
      jQuery('#toTop').fadeOut();
    }
  });

  jQuery('#toTop').click(function () {
    jQuery('body,html').animate(
      {
        scrollTop: 0,
      },
      800
    );
  });

  //////////////////////////////////
  var x, i, j, l, ll, selElmnt, a, b, c;
  /* Look for any elements with the class "custom_select": */
  x = document.getElementsByClassName('custom_select');
  l = x.length;
  for (i = 0; i < l; i++) {
    selElmnt = x[i].getElementsByTagName('select')[0];
    ll = selElmnt.length;
    /* For each element, create a new DIV that will act as the selected item: */
    a = document.createElement('DIV');
    a.setAttribute('class', 'select-selected');
    a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
    x[i].appendChild(a);
    /* For each element, create a new DIV that will contain the option list: */
    b = document.createElement('DIV');
    b.setAttribute('class', 'select-items select-hide');
    for (j = 1; j < ll; j++) {
      /* For each option in the original select element,
      create a new DIV that will act as an option item: */
      c = document.createElement('DIV');
      c.innerHTML = selElmnt.options[j].innerHTML;
      c.addEventListener('click', function (e) {
        /* When an item is clicked, update the original select box,
        and the selected item: */
        var y, i, k, s, h, sl, yl;
        s = this.parentNode.parentNode.getElementsByTagName('select')[0];
        sl = s.length;
        h = this.parentNode.previousSibling;
        for (i = 0; i < sl; i++) {
          if (s.options[i].innerHTML == this.innerHTML) {
            s.selectedIndex = i;
            h.innerHTML = this.innerHTML;
            y = this.parentNode.getElementsByClassName('same-as-selected');
            yl = y.length;
            for (k = 0; k < yl; k++) {
              y[k].removeAttribute('class');
            }
            this.setAttribute('class', 'same-as-selected');
            break;
          }
        }
        h.click();
      });
      b.appendChild(c);
    }
    x[i].appendChild(b);
    a.addEventListener('click', function (e) {
      /* When the select box is clicked, close any other select boxes,
      and open/close the current select box: */
      e.stopPropagation();
      closeAllSelect(this);
      this.nextSibling.classList.toggle('select-hide');
      this.classList.toggle('select-arrow-active');
    });
  }

  function closeAllSelect(elmnt) {
    /* A function that will close all select boxes in the document,
    except the current select box: */
    var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
    x = document.getElementsByClassName('select-items');
    y = document.getElementsByClassName('select-selected');
    xl = x.length;
    yl = y.length;
    for (i = 0; i < yl; i++) {
      if (elmnt == y[i]) {
        arrNo.push(i);
      } else {
        y[i].classList.remove('select-arrow-active');
      }
    }
    for (i = 0; i < xl; i++) {
      if (arrNo.indexOf(i)) {
        x[i].classList.add('select-hide');
      }
    }
  }

  /* If the user clicks anywhere outside the select box,
  then close all select boxes: */
  document.addEventListener('click', closeAllSelect);

  //////////////////////////////
  /////////////////////////////////
  jQuery('.main_slider_desk').on('init', function (e, slick) {
    var jQueryfirstAnimatingElements = jQuery(
      'div.main_slider_desk_item:first-child'
    ).find('[data-animation]');
    doAnimations(jQueryfirstAnimatingElements);
  });
  jQuery('.main_slider_desk').on(
    'beforeChange',
    function (e, slick, currentSlide, nextSlide) {
      var jQueryanimatingElements = jQuery(
        'div.main_slider_desk_item[data-slick-index="' + nextSlide + '"]'
      ).find('[data-animation]');
      doAnimations(jQueryanimatingElements);
    }
  );
  jQuery('.main_slider_desk').slick({
    dots: false,
    infinite: true,
    arrows: false,
    speed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    autoplay: true,
    pauseOnHover: false,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          dots: true,
        },
      },
    ],
  });

  ////////////////////////////////////////

  function doAnimations(elements) {
    var animationEndEvents =
      'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    elements.each(function () {
      var jQuerythis = jQuery(this);
      var jQueryanimationDelay = jQuerythis.data('delay');
      var jQueryanimationType = 'animated ' + jQuerythis.data('animation');
      jQuerythis.css({
        'animation-delay': jQueryanimationDelay,
        '-webkit-animation-delay': jQueryanimationDelay,
      });
      jQuerythis
        .addClass(jQueryanimationType)
        .one(animationEndEvents, function () {
          jQuerythis.removeClass(jQueryanimationType);
        });
    });
  }
  ///////////////////////////
  new WOW().init();
  ////////////////////
  ///////////////////////////////////////////
  jQuery('.menu_show,.menu_close').click(function () {
    if (jQuery('.mobile_menu_wrapp').css('right') == '-700px') {
      jQuery('.mobile_menu_wrapp').animate({ right: '0px' }, 500);
      return false;
    }
    if (jQuery('.mobile_menu_wrapp').css('right') == '0px') {
      jQuery('.menu_button').removeClass('active');
      jQuery('.mobile_menu_wrapp').animate({ right: '-700px' }, 500);
      return false;
    }
  });
  ///////////////////////////////////////
  jQuery('.mobile_menu .has_child a').click(function () {
    jQuery(this)
      .parents('.has_child')
      .find('.sub_menu')
      .slideToggle('150', function () {
        // Animation complete.
      });
  });
  ////////////////////////////////////
  jQuery(document).click(function (e) {
    if (jQuery(e.target).closest('.menu_show,.mobile_menu_wrapp').length)
      return;
    jQuery('.mobile_menu_wrapp').css('right', '-700');
    jQuery('.mobile_menu_wrapp').animate({ right: '-700px' }, 500);
    jQuery('.menu_button').removeClass('active');
    e.stopPropagation();
  });
  /////////////////////////////////////
  jQuery('.toggle').on('click', function () {
    jQuery('.menu_button').toggleClass('active');
  });
  /////////////////////////////////
  jQuery('.cat_mp_slider').slick({
    nextArrow: '<div class="next"><i class="icofont-thin-right"></i></div>',
    dots: true,
    infinite: true,
    arrows: true,
    speed: 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    touchThreshold: 100,
    swipeToSlide: true,
    variableWidth: true,
  });

  //////////////////////////////////////////

  $('#open_mp_feedback').on('click', function () {
    $('.mp_feedback_body').slideToggle('slow', function () {
      // Animation complete.
    });
  });

  ////////////////////////

  $('.feedback_form').on('submit', function (event) {
    $(this)
      .parents('.mp_feedback_body')
      .find('.succes_message')
      .fadeIn(400)
      .delay(2000)
      .fadeOut(400);
    event.preventDefault();
  });
  ////////////////////////

  ///////////////////
  jQuery('.open_search').click(function () {
    jQuery(this)
      .parents('.top_search_wrap')
      .find('.top_search_body')
      .slideToggle('slow', function () {
        // Animation complete.
      });
  });
  //////////////////
  jQuery(document).click(function (e) {
    if (jQuery(e.target).closest('.top_search_wrap').length) return;
    jQuery('.top_search_body').hide(700);
    e.stopPropagation();
  });
  ///////////////////
  jQuery('#open_child_list').click(function () {
    jQuery(this)
      .parents('.footer_menu')
      .find('.footer_menu_mob_submenu')
      .slideToggle('slow', function () {
        // Animation complete.
      });
  });
  ////////////////

  jQuery('.open_menu_child').click(function () {
    jQuery(this)
      .parents('li')
      .find('.sub_menu')
      .slideToggle('slow', function () {
        // Animation complete.
      });
  });

  ////////////////

  jQuery('.open_contacts_list').click(function () {
    jQuery(this)
      .parents('.contact_page_body_box')
      .toggleClass('open')
      .find('.contacts_list_wpapper')
      .slideToggle('slow', function () {
        // Animation complete.
      });
  });
  ////////////////////
  jQuery('.show_more_contacts_list_box').click(function () {
    jQuery(this).parents('.contacts_list_wpapper').toggleClass('open_more');
    jQuery(this).hide();
  });
  //////////////////////

  var custom_values_001 = [0, 30, 60, 90, 120, 150];
  // be careful! FROM and TO should be index of values array
  var my_from_001 = custom_values_001.indexOf(60);
  var my_to_001 = custom_values_001.indexOf(150);

  $('#range_001').ionRangeSlider({
    grid: true,
    from: my_from_001,
    to: my_to_001,
    values: custom_values_001,
  });

  var custom_values_002 = [1.5, 2, 3];
  // be careful! FROM and TO should be index of values array
  var my_from_002 = custom_values_002.indexOf(2);
  var my_to_002 = custom_values_002.indexOf(3);

  $('#range_002').ionRangeSlider({
    grid: true,
    from: my_from_002,
    to: my_to_002,
    values: custom_values_002,
  });
  ////////////////////
  jQuery('.filters_open').click(function () {
    jQuery(this)
      .parents('.filters_wrapper')
      .toggleClass('open')
      .find('.filters_block')
      .slideToggle(300, function () {
        // Animation complete.
      });
  });
  //////////////////
  jQuery('.show_moreitems').click(function () {
    jQuery(this).parents('.items_greed').toggleClass('open_more');
    jQuery(this).hide();
  });
  //////////////////////
  jQuery('.open_more_pdf').click(function () {
    jQuery(this).parents('.instr_right_list').toggleClass('open_more');
    jQuery(this).hide();
  });
  //////////////////////
  jQuery('.open_more_videos').click(function () {
    jQuery(this).parents('.video_greed_wrapper').toggleClass('open_more');
    jQuery(this).hide();
  });
  ////////////////////////
  $(document).on('click', '.button_play_video', function () {
    var $video = $('.video_iframe'),
      src = $video.attr('src');

    $video.attr('src', src + '&autoplay=1');
    $('.button_play_video').fadeOut();
  });

  ///////////////////

  $(document).on('click', '.button_play_video_2', function () {
    var $video_2 = $(this).parent('.video_inner').find('.video_iframe'),
      src = $video_2.attr('src');

    $video_2.attr('src', src + '&autoplay=1');
    $(this).fadeOut();
  });
  /////////////////
  // jQuery(".open_instr").click(function() {
  //   jQuery(".mob_instruction_wrapper").hide();
  //     jQuery(this).parents("li").find(".mob_instruction_wrapper").slideToggle('400', function() {

  //     })
  //   });
  jQuery('.open_instr').click(function () {
    jQuery(this)
      .parents('.instr_items_greed')
      .siblings('ul')
      .find('li')
      .find('.open_instr')
      .removeClass('active');
    jQuery(this)
      .parents('.instr_items_greed')
      .siblings('ul')
      .find('li')
      .find('.mob_instruction_wrapper')
      .slideUp(300);
    jQuery(this)
      .parents('li')
      .siblings('li')
      .find('.open_instr')
      .removeClass('active');
    jQuery(this)
      .parents('li')
      .siblings('li')
      .find('.mob_instruction_wrapper')
      .slideUp(300);
    jQuery(this)
      .toggleClass('active')
      .parents('li')
      .find('.mob_instruction_wrapper')
      .slideToggle(300, function () {
        // Animation complete.
      });
  });
  jQuery(document).click(function (e) {
    if (jQuery(e.target).closest('.mob_instruction_wrapper,.open_instr').length)
      return;
    jQuery('.mob_instruction_wrapper').hide(300);
    jQuery('.open_instr').removeClass('active');
    e.stopPropagation();
  });

  jQuery('.close_suport_form').click(function () {
    jQuery(this).parents('.suport_feedback_form_wrapper').hide(400);
    return false;
  });

  jQuery('#open_sf').click(function () {
    jQuery(this)
      .parents('.suport_feedback')
      .find('.suport_feedback_form_wrapper')
      .fadeIn(400);
    return false;
  });

  jQuery('.suport_form').on('submit', function (event) {
    $(this)
      .parents('.suport_feedback')
      .find('.suport_feedback_form_wrapper')
      .hide();
    $(this)
      .parents('.suport_feedback')
      .find('.succes_message')
      .fadeIn(400)
      .delay(2000)
      .fadeOut(400);
    event.preventDefault();
  });
  ////////////////////////////////
  $('.tovar_slider').slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: '.tovar_slider_nav',
  });
  $('.tovar_slider_nav').slick({
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: '.tovar_slider',
    dots: false,
    prevArrow: '<div class="prev"><i class="icofont-thin-left"></i></div>',
    nextArrow: '<div class="next"><i class="icofont-thin-right"></i></div>',
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          touchThreshold: 100,
          slidesToShow: 4,
          dots: true,
          touchThreshold: 100,
          arrows: false,
          swipeToSlide: true,
        },
      },
    ],
  });
  ////////////////////////
  jQuery('.open_item').click(function () {
    jQuery(this)
      .parents('.open_item_parent')
      .toggleClass('opened')
      .find('.hidden_item')
      .slideToggle('400', function () {});
    return false;
  });
  /////////////////////////////
  jQuery('.open_more_par').click(function () {
    jQuery(this).parents('.tovar_parameters_mobile').toggleClass('open_more');
    jQuery(this).hide();
  });
  ////////////////////////
  var $vid_quantity = $('.video_greed_wrapper .form-row>div');

  if ($vid_quantity.length < 3) {
    $vid_quantity.parents('.video_greed_wrapper').addClass('no_more');
  }
});
