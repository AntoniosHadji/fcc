$( document ).ready(function() {

  $( "#search" ).click(function() {
    $( "#results" ).empty();

    // uri encoding of searchterm caused much confusion
    // multiple words are included for this request with spaces in string
    var params = {
        action: "query",
        format: "json",
        list: "search",
        formatversion: 2,
        srsearch: $( "#searchTerm" ).val(),

      };

    $.ajax({
      url: "https://en.wikipedia.org/w/api.php",
      data: params,
      type: "GET",
      dataType: "jsonp"
    })

    .done(function( json ) {
      $.each(json.query.search, function(k, v) {
        $( "#results" ).append(
          "<a href='https://en.wikipedia.org/?title=" +
          encodeURIComponent(v.title) +"' class='list-group-item' target='_blank'>" +
          "<h4 class='list-group-item-heading'>" + v.title  +  "</h4>" +
          "<p class='list-group-item-text'>" + v.snippet + "</p>" +
          "</a>");
      });
      console.dir(json);
    })

    .fail(function( xhr, status, errorThrown) {
      console.log( "Sorry, there was a problem!" );
      console.log( "Error: " + errorThrown );
      console.log( "Status: " + status );
      console.dir( xhr );
    })

    .always(function( xhr, status ) {
      console.log("ajax request completed with status: " + status);
    });


  });

  console.log("jQuery document ready event finished");
});  // end of ready event

//https://en.wikipedia.org/w/api.php?action=query&format=json&list=search&srsearch=buckminster%20fuller
//  console.log( $( location ).attr('href'));

