$(document).ready(function(){
  // there is only one button on this page $('button')
  // if there were more, I could identify with id using #id
  // or class by using button.class
    getQuote();

    $('#newquote').click(function(){
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
            xhr.setRequestHeader('X-Mashape-Key', 'Ed9vPJR86VmshfeGiPlZvYDF3n6hp1g2a4Ejsnf6nhLVVS5h5v');
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.setRequestHeader('Accept', 'application/json');
          }
      });
}

function displayResponse(data) {
    $( '#quote' ).html(data.quote);
    $( '#author' ).html(data.author);

  // these are various ways to search for elements
  // both of these worked
  // parent > child
//  $('#tweet > iframe').each( function() {
//    console.log('found: '+this.id);
//  });
  //
//  element.class
//  $('iframe.twitter-share-button').each( function() {
//    console.log('found widget: '+this.id);
//    $( this ).remove();
//  });

  // in the end, all I needed was to empty the tweet div since it was
  // constructed as an empty div and the code below creates a new button
  $('#tweet').empty();

  twttr.widgets.createShareButton(
    document.URL,
    document.getElementById('tweet'),
    {
      size: 'large',
      text: ''.concat(data.quote, ' ', data.author)
    }
  ).then( function( el ) {
    console.log('Tweet button added: ' + el.id);
  });

}
