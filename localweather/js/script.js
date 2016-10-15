$(document).ready(function(){

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
        $("#data").append(data.currently.summary);
        $("#data").append("</br>");
        switch (data.currently.icon) {
          case "clear-day":
            $( "#data" ).append("<i class='fa-5x wi wi-day-sunny'></i>");
            break;
          case "clear-night":
            $( "#data" ).append("<i class='fa-5x wi wi-night-clear'></i>");
            break;
          case "rain":
          case "snow":
          case "sleet":
          case "fog":
          case "cloudy":
            var icon = "".concat("<i class='fa-5x wi wi-",
              data.currently.icon, "'></i>");
            $( "#data" ).append(icon);
            break;
          case "partly-cloudy-day":
            $( "#data" ).append("<i class='fa-5x wi wi-day-cloudy'></i>");
            break;
          case "partly-cloudy-night":
            $( "#data" ).append("<i class='fa-5x wi wi-night-partly-cloudy'></i>");
            break;
          case "wind":
            $( "#data" ).append("<i class='fa-5x wi wi-windy'></i>");
            break;
          default:
            $( "#data" ).append("<i class='fa-5x wi wi-na'></i>");
        }
        $("#temperature").append("Temperature: ".concat(data.currently.temperature));
        $("#temperature").append("<i class='fa-5x wi wi-celsius'></i>");
      }, "jsonp");

    });
  } else {
    console.log("Geolocation Not Available.");
  }


});

// notes:
      // html replaces html in element
      //$("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
      // append adds to existing html
      //$("#data").append("</br>test-data: " + position);
