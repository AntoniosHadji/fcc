$(document).ready(function(){
  var holdtemp = 0;

  // this could be used if geolocation is not available in the browser
  $.get("https://ipinfo.io", function(response) {
    $( "#location" ).html("".concat(
      response.city, ", ", response.region, ",", response.country,
      "</br> Latitude, Longitude: ", response.loc));
  }, "jsonp");

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var url =
        'https://api.darksky.net/forecast/9fe5bc8b57a4d94356d5a54411335ecd/';
      var query = url + position.coords.latitude + ',' +
        position.coords.longitude + '?units=si';

      $.get(query, function(data) {
        // json was inspected manually before writing this code
        $( "#data" ).empty();
        switch (data.currently.icon) {
          case "clear-day":
            $( "#data" ).append("<i class='wi wi-day-sunny'></i>");
            break;
          case "clear-night":
            $( "#data" ).append("<i class='wi wi-night-clear'></i>");
            break;
          case "rain":
          case "snow":
          case "sleet":
          case "fog":
          case "cloudy":
            var icon = "".concat("<i class='wi wi-",
              data.currently.icon, "'></i>");
            $( "#data" ).append(icon);
            break;
          case "partly-cloudy-day":
            $( "#data" ).append("<i class='wi wi-day-cloudy'></i>");
            break;
          case "partly-cloudy-night":
            $( "#data" ).append("<i class='wi wi-night-partly-cloudy'></i>");
            break;
          case "wind":
            $( "#data" ).append("<i class='wi wi-windy'></i>");
            break;
          default:
            $( "#data" ).append("<i class='wi wi-na'></i>");
        }
        $("#data").append("".concat(" ", data.currently.summary));
        $("#temperature").empty();
        $("#temperature").append(data.currently.temperature);
        holdtemp = data.currently.temperature;
        $("#temperature").append("<i class='wi wi-celsius'></i>");
      }, "jsonp");

    });
  } else {
    console.log("Geolocation Not Available.");
  }

  $( "#units" ).click(function() {
    if ($.trim($( this ).text()) === "Switch to US Units") {
      $("#temperature").html(convert(holdtemp, "F"));
      $("#temperature").append("<i class='wi wi-fahrenheit'></i>");
      $( this ).text("Switch to SI Units");
    } else {
      $("#temperature").html(convert(holdtemp, "C"));
      $("#temperature").append("<i class='wi wi-celsius'></i>");
      $( this ).text("Switch to US Units");
    }
    console.log("clicked");
  });

  function convert(temp, toUnit) {
    // toUnit = C or F
    // temp is integer
    if (toUnit === "C") {
      holdtemp = (temp - 32)/1.8;
      return holdtemp;
    }

    if (toUnit === "F") {
      holdtemp = temp * 1.8 + 32;
      return holdtemp;
    }

    return temp;
  }
});

// notes:
      // html replaces html in element
      //$("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
      // append adds to existing html
      //$("#data").append("</br>test-data: " + position);
