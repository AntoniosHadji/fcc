$(document).ready(function(){
  // there is only one button on this page $("button")
  // if there were more, I could identify with id using #id
  // or class by using button.class
    getQuote();

    $("#newquote").click(function(){
      getQuote();
    });
});

function getQuote() {
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
}

function displayResponse(data) {
  if (data.hasOwnProperty("quote"))
    $( "#quote" ).html(data.quote);

  if (data.hasOwnProperty("author"))
    $( "#author" ).html(data.author);
}
