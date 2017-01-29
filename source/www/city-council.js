/** Helper function to load external scripts */
  function loadScript(src, onLoad) {
    var script_tag = document.createElement('script');
    script_tag.setAttribute('type', 'text/javascript');
    script_tag.setAttribute('src', src);

    if (script_tag.readyState) {
      script_tag.onreadystatechange = function () {
        if (this.readyState == 'complete' || this.readyState == 'loaded') {
          onLoad();
        }
      };
    } else {
      script_tag.onload = onLoad;
    }

    // append loaded script to head
    (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
  }

  function scrolltoTop() {
    $('.councilors').animate({ scrollTop: 0 });
  }

  function toTitleCase(str) {
    if (!str) {
      return '';
    }

    str = str.toString();

    return str.replace(/-/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  }

  function init() {
    $.getJSON('city-council/data/city-council-data.json', function( data ) {

      $.each( data, function( key, val ) {

        var city_council_url = (val.city_council_url) ? '<a href="' + val.city_council_url + '" target="_blank" title="Visit City Council Page" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-external-link-square"></i></a>' : '';
        var twitter = (val.twitter_url) ? '<a href="' + val.twitter_url + '" target="_blank" title="Visit Twitter Profile" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-twitter"></i></a>' : '';
        var facebook = (val.facebook_url) ? '<a href="' + val.facebook_url + '" target="_blank" title="Visit Facebook Profile" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-facebook"></i></a>' : '';
        var email = (val.email) ? '<a href="mailto:' + val.email + '" title="Email Councilor" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-envelope"></i></a>' : '';
        var phone = (val.phone) ? '<a href="tel:' + val.phone + '" title="Call Councilor" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-phone"></i></a>' : '';
        var calendar = (val.city_council_council_calendar_url) ? '<a href="' + val.city_council_council_calendar_url + '" title="Visit City Council Calendar" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-calendar-check-o"></i></a>' : '';
        var address = (val.address_complete) ? '<a href="https://maps.google.com?q=' + val.address_complete.replace(/,/g, '').replace(/ /g, '+') + '" title="Visit City Council Map" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-map-marker"></i></a>' : '';

        var district = (val.district) ? '   District: ' + toTitleCase(val.district) : '';
        var at_large = (val.at_large) ? '   At-large' + toTitleCase(val.at_large) : '&nbsp;';

        var html = '<div class="councilor mdl-card mdl-shadow--2dp card-square fade-in c' + key + '" onclick="void(0)" data-name="' + val.name + '" data-party="' + val.party + '" data-gender="' + val.gender + '" data-ethnicity="' + val.ethnicity + '">' +
          '<div class="mdl-card__title mdl-card--expand" style="background-image: url(city-council/images/headshots/512x512/' + val.name_slug + '.jpg)">' +
          '   <h2 class="mdl-card__title-text">' + val.name + '</h2>' +
          '   <h2 class="overlay"></h2>' +
          '</div>' +
          '<div class="mdl-card__supporting-text">' +
          '   ' + toTitleCase(val.title) + ' - ' + toTitleCase(val.party) + '<br/>' +
          district + at_large +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
          '   ' + twitter + facebook + email + phone + address + calendar + city_council_url +
          '</div>' +
          '</div>';

        var jsonld = {
          "@context": "http://schema.org",
          "@type": "Person",
          "address": {
            "@type": "PostalAddress"
          },
          "url": "http://www.janedoe.com",
          "sameAs": []
        };

        if (val.email) {
          jsonld.email = 'mailto:' + val.email;
        }

        if (val.phone) {
          jsonld.telephone = val.phone;
        }

        if (val.twitter_url) {
          jsonld.sameAs.push(val.twitter_url);
        }

        if (val.facebook_url) {
          jsonld.sameAs.push(val.facebook_url);
        }

        jsonld.image = 'https://civilserviceusa.github.io/city-council/images/headshots/512x512/' + val.name_slug + '.jpg';
        jsonld.jobTitle = toTitleCase(val.title) + ' of New York City Council';
        jsonld.name = val.name;
        jsonld.url = val.city_council_url;

        jsonld.address.addressLocality = val.address_city;
        jsonld.address.addressRegion = val.address_state;
        jsonld.address.postalCode = val.address_zipcode;
        jsonld.address.streetAddress = val.address_number + ' ' + val.address_prefix + ' ' + val.address_street + ', ' + val.address_sec_unit_type + ' ' + val.address_sec_unit_num;

        var jsonld_script = '<scr' + 'ipt type="application/ld+json">' + JSON.stringify(jsonld) + '</scr' + 'ipt>';

        $(html).appendTo('.councilors .wrapper');
        $(jsonld_script).appendTo('head');

      });

      $('input[type="checkbox"]').change(updateCouncilors)

      updateCouncilors();

      loadScript('https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js', function() {
        if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
          document.documentElement.classList.add('mdl-js');
          componentHandler.upgradeAllRegistered();
        } else {
          componentHandler.upgradeElement = componentHandler.register = function() {};
        }
      });
    });
  }

  loadScript('https://code.jquery.com/jquery-2.2.4.min.js', init);

  function isCommandPressed(event) {
    return event.metaKey && ! event.ctrlKey;
  }

  function openSearch() {
    $('.modal').show();
    $('section').addClass('searching');
    setTimeout(function(){
      $('#search').focus();
    }, 250);
  }

  function closeSearch() {
    $('.modal').fadeOut();
    scrolltoTop();
    $('section').removeClass('searching');
  }

  function doSearch(){
    var search = $('#search').val();
    if (search && search !== '') {
      $('.councilor').hide();
      $('.councilor[data-name*="' + search + '" i]').show();
    } else {
      $('.councilor').show();
    }

    var count = $('.councilor:visible').length;
    var total = $('.councilor').length;
    var percent = Math.round((count / total) * 100);

    $('span.count').text(count);
    $('span.total').text(total);
    $('span.percent').text(percent + '%');
  }

  function updateCouncilors () {
    // Handle Party
    var $constitution = $('.councilor[data-party="constitution"]');
    var $democrat = $('.councilor[data-party="democrat"]');
    var $green = $('.councilor[data-party="green"]');
    var $independent = $('.councilor[data-party="independent"]');
    var $libertarian = $('.councilor[data-party="libertarian"]');
    var $nonpartisan = $('.councilor[data-party="nonpartisan"]');
    var $republican = $('.councilor[data-party="republican"]');

    var constitution = $('#party-constitution').is(':checked');
    var democrat = $('#party-democrat').is(':checked');
    var green = $('#party-green').is(':checked');
    var independent = $('#party-independent').is(':checked');
    var libertarian = $('#party-libertarian').is(':checked');
    var nonpartisan = $('#party-nonpartisan').is(':checked');
    var republican = $('#party-republican').is(':checked');

    $constitution.show();
    $democrat.show();
    $green.show();
    $independent.show();
    $libertarian.show();
    $nonpartisan.show();
    $republican.show();

    // Hide Checkboxes for Options we don't need
    if($constitution.length === 0) {
      $('#party-constitution').closest('label').hide();
    }

    if($democrat.length === 0) {
      $('#party-democrat').closest('label').hide();
    }

    if($green.length === 0) {
      $('#party-green').closest('label').hide();
    }

    if($independent.length === 0) {
      $('#party-independent').closest('label').hide();
    }

    if($libertarian.length === 0) {
      $('#party-libertarian').closest('label').hide();
    }

    if($nonpartisan.length === 0) {
      $('#party-nonpartisan').closest('label').hide();
    }

    if($republican.length === 0) {
      $('#party-republican').closest('label').hide();
    }

    // Handle Gender
    var $female = $('.councilor[data-gender="female"]');
    var $male = $('.councilor[data-gender="male"]');
    var $unspecified_gender = $('.councilor[data-gender="unspecified"]');

    var female = $('#gender-female').is(':checked');
    var male = $('#gender-male').is(':checked');
    var unspecified_gender = $('#gender-unspecified').is(':checked');

    $female.show();
    $male.show();
    $unspecified_gender.show();

    // Hide Checkboxes for Options we don't need
    if($female.length === 0) {
      $('#gender-female').closest('label').hide();
    }

    if($male.length === 0) {
      $('#gender-male').closest('label').hide();
    }

    if($unspecified_gender.length === 0) {
      $('#gender-unspecified').closest('label').hide();
    }

    // Handle Ethnicity
    var $african_american = $('.councilor[data-ethnicity="african-american"]');
    var $asian_american = $('.councilor[data-ethnicity="asian-american"]');
    var $hispanic_american = $('.councilor[data-ethnicity="hispanic-american"]');
    var $middle_eastern_american = $('.councilor[data-ethnicity="middle-eastern-american"]');
    var $multi_racial_american = $('.councilor[data-ethnicity="multi-racial-american"]');
    var $native_american = $('.councilor[data-ethnicity="native-american"]');
    var $pacific_islander = $('.councilor[data-ethnicity="pacific-islander"]');
    var $white_american = $('.councilor[data-ethnicity="white-american"]');
    var $unspecified = $('.councilor[data-ethnicity="unspecified"]');

    var african_american = $('#ethnicity-african-american').is(':checked');
    var asian_american = $('#ethnicity-asian-american').is(':checked');
    var hispanic_american = $('#ethnicity-hispanic-american').is(':checked');
    var middle_eastern_american = $('#ethnicity-middle-eastern-american').is(':checked');
    var multi_racial_american = $('#ethnicity-multi-racial-american').is(':checked');
    var native_american = $('#ethnicity-native-american').is(':checked');
    var pacific_islander = $('#ethnicity-pacific-islander').is(':checked');
    var white_american = $('#ethnicity-white-american').is(':checked');
    var unspecified = $('#ethnicity-unspecified').is(':checked');

    $african_american.show();
    $asian_american.show();
    $hispanic_american.show();
    $middle_eastern_american.show();
    $multi_racial_american.show();
    $native_american.show();
    $pacific_islander.show();
    $white_american.show();
    $unspecified.show();

    // Hide Checkboxes for Options we don't need
    if($african_american.length === 0) {
      $('#ethnicity-african-american').closest('label').hide();
    }

    if($asian_american.length === 0) {
      $('#ethnicity-asian-american').closest('label').hide();
    }

    if($hispanic_american.length === 0) {
      $('#ethnicity-hispanic-american').closest('label').hide();
    }

    if($middle_eastern_american.length === 0) {
      $('#ethnicity-middle-eastern-american').closest('label').hide();
    }

    if($multi_racial_american.length === 0) {
      $('#ethnicity-multi-racial-american').closest('label').hide();
    }

    if($native_american.length === 0) {
      $('#ethnicity-native-american').closest('label').hide();
    }

    if($pacific_islander.length === 0) {
      $('#ethnicity-pacific-islander').closest('label').hide();
    }

    if($white_american.length === 0) {
      $('#ethnicity-white-american').closest('label').hide();
    }

    if($unspecified.length === 0) {
      $('#ethnicity-unspecified').closest('label').hide();
    }


    // Hide Unmatched Items

    if (constitution || democrat || green || independent || libertarian || nonpartisan || republican) {
      if (!constitution) {
        $constitution.hide();
      }
      if (!democrat) {
        $democrat.hide();
      }
      if (!green) {
        $green.hide();
      }
      if (!independent) {
        $independent.hide();
      }
      if (!libertarian) {
        $libertarian.hide();
      }
      if (!nonpartisan) {
        $nonpartisan.hide();
      }
      if (!republican) {
        $republican.hide();
      }
    }

    if (female || male || unspecified_gender) {
      if (!female) {
        $female.hide();
      }
      if (!male) {
        $male.hide();
      }
      if (!unspecified_gender) {
        $unspecified_gender.hide();
      }
    }

    if (african_american || asian_american || hispanic_american || middle_eastern_american || multi_racial_american || native_american || pacific_islander || white_american || unspecified) {
      if (!african_american) {
        $african_american.hide();
      }
      if (!asian_american) {
        $asian_american.hide();
      }
      if (!hispanic_american) {
        $hispanic_american.hide();
      }
      if (!middle_eastern_american) {
        $middle_eastern_american.hide();
      }
      if (!multi_racial_american) {
        $multi_racial_american.hide();
      }
      if (!native_american) {
        $native_american.hide();
      }
      if (!pacific_islander) {
        $pacific_islander.hide();
      }
      if (!white_american) {
        $white_american.hide();
      }
      if (!unspecified) {
        $unspecified.hide();
      }
    }

    var count = $('.councilor:visible').length;
    var total = $('.councilor').length;
    var percent = Math.round((count / total) * 100);

    $('span.count').text(count);
    $('span.total').text(total);
    $('span.percent').text(percent + '%');
  }

  window.addEventListener('keydown', function (e) {
    if (e.keyCode === 114 || ( e.ctrlKey && e.keyCode === 70) || ( isCommandPressed(e) && e.keyCode === 70) ) {
      e.preventDefault();
      openSearch();
    } else if (e.keyCode === 27) {
      closeSearch();
    }
  });
