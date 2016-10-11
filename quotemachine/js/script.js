$(document).ready(function(){
  // there is only one button on this page
  // if there were more, I could identify with id using #id
  // or class by using button.class
    $("button").click(function(){
      $.ajax({
          url: 'https://andruxnet-random-famous-quotes.p.mashape.com/?cat=famous',
          type: 'POST', // The HTTP Method, can be GET POST PUT DELETE etc
          data: {}, // Additional parameters here
          dataType: 'json',
          success: displayResponse,
          error: function(err) { alert(err); },
          beforeSend: function(xhr) {
            xhr.setRequestHeader("X-Mashape-Key", "Ed9vPJR86VmshfeGiPlZvYDF3n6hp1g2a4Ejsnf6nhLVVS5h5v");
            xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xhr.setRequestHeader("Accept", "application/json");
          }
      });
    });
});

// function(data) { console.dir((data.source)); },
function displayResponse(data) {
        var items = [];
        $.each( data, function( key, val ) {
          items.push( "<li id='" + key + "'>" + val + "</li>" );
        });

        $( "<ul/>", {
          "class": "my-new-list",
          html: items.join( "" )
        }).appendTo( "body" );
      };
