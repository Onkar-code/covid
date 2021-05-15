"use strict";

$(document).ready(function () {
  var covidPerCountryRaw = {
    'recovered': undefined,
    'deaths': undefined,
    'confirmed': undefined,
    'date': undefined
  };
  var covidPerCountry = [];
  getCountryAPI(); //Fetch country data
  // function getCovidPerCountry(slug){
  // getCovidPerCountryRaw(slug, "recovered");
  //per each status
  //handleChart();
  //handlechart => "confirmed requesst"
  // }

  $("#countries").change(function _callee() {
    var country, slug;
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            country = $('#countries').find(":selected").text();
            slug = $('#countries').val();
            $('#country').html("".concat(country)); //await getCovidPerCountryData(slug, "recovered");
            //await getCovidPerCountryData(slug, "deaths");

            _context.next = 5;
            return regeneratorRuntime.awrap(getCovidPerCountryData(slug, "confirmed"));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    });
  });

  function getCountryAPI() {
    $.get("https://api.covid19api.com/countries", function (response) {
      var countries = sortArray(response);
      template = '';
      countries.forEach(function (country) {
        $('#countries').append("<option value=\"".concat(country.Slug, "\">").concat(country.Country, "</option>"));
      });
    });
  }

  function getCovidPerCountryData(slug, status) {
    var result;
    return regeneratorRuntime.async(function getCovidPerCountryData$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return regeneratorRuntime.awrap($.ajax({
              method: "GET",
              dataType: "json",
              data: '',
              url: "https://api.covid19api.com/total/country/".concat(slug, "/status/").concat(status)
            }));

          case 2:
            result = _context2.sent;
            // result.forEach( r=> {
            // });
            fillcovidPerCountryRaw(result, status);

          case 4:
          case "end":
            return _context2.stop();
        }
      }
    });
  }

  function fillcovidPerCountryRaw(data, status) {
    // console.log(data);
    for (var i = 0; i < 100; i++) {
      //reset if already has values
      // if ( covidPerCountryRaw[i].lenght != 0) {
      //     cases: 0,
      //     date: 0,
      //     recovered:0,
      //     death: 0,
      // }
      var c = covidPerCountryRaw;

      switch (data[i].Status) {
        case "recovered":
          c.recovered = data[i].Cases;
          break;

        case "confirmed":
          c.confirmed = data[i].Cases;
          break;

        case "deaths":
          c.deaths = data[i].Cases;
          break;
      }

      var result = Object.keys(c).map(function (key) {
        return [String(key), c[key]];
      });
      console.log(result);
    }

    console.log(covidPerCountry);
    debugger;
  }

  function sortArray(myArray) {
    myArray.sort(function (a, b) {
      return a.Country > b.Country ? 1 : b.Country > a.Country ? -1 : 0;
    });
    return myArray;
  }
});