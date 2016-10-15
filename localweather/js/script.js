$(document).ready(function(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var url = 'https://api.darksky.net/forecast/9fe5bc8b57a4d94356d5a54411335ecd/39.9984,-75.2712?units=si';

      $.getJSON(query, function(data) {
        // json was inspected manually before writing this code
        $( "#data" ).append("This is the current weather ");
        $( "#data" ).append("</br>");
        switch (data.currently.icon) {
          case "clear-day":
            $( "#data" ).append("<i class=fa-5x wi wi-day-sunny></i>");
            break;
          default:
            $( "#data" ).append("<i class=fa-5x wi wi-na></i>");
        }
        $( "#data" ).append(data.currently.summary);
        $( "#data" ).append("</br>");
        $( "#data" ).append("Temperature: ".concat(data.currently.temperature));
        $( "#data" ).append("<i class=fa-5x wi wi-celsius></i>");
      });

    });
  } else {
    console.log("Geolocation Not Available.");
  }

  $.get("https://ipinfo.io", function(response) {
    $( "#location" ).html("".concat(
      response.city, ", ", response.region, ",", response.country,
      "</br> Latitude, Longitude: ", response.loc));
  }, "jsonp");

});

// notes:
      // html replaces html in element
      //$("#data").html("latitude: " + position.coords.latitude + "<br>longitude: " + position.coords.longitude);
      // append adds to existing html
      //$("#data").append("</br>test-data: " + position);
