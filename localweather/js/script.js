$(document).ready(function(){

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position) {
      var url = 'http://api.openweathermap.org/data/2.5/weather?';
      var params = {
        units: 'metric',
        APPID: '4291ac60d62260dc2669a67ad1bac8bf',
        lat: position.coords.latitude,
        lon: position.coords.longitude
      };
      var query = url + $.param(params);

      $.getJSON(query, function(data) {
        // json was inspected manually before writing this code
        $( "#data" ).append("This is the current weather ");
        $( "#data" ).append("</br>");
        $( "#data" ).append("<i class=".concat("'fa-5x wi wi-owm-", data.weather[0].id, "'></i>"));
        $( "#data" ).append(data.weather[0].description);
        $( "#data" ).append("</br>");
        $( "#data" ).append("Temperature: ".concat(data.main.temp, "ºC"));

      });

    });
  } else {
    console.log("Geolocation Not Available.");
  }

  $.get("http://ipinfo.io", function(response) {
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
