/*jshint globalstrict: true*/
'use strict';

// this is the module pattern of code encapsulation
// http://learn.jquery.com/code-organization/concepts/#the-module-pattern
var module = (function() {
  //function definition
  //module.onReady2()
  var onReady2 = function() {
    console.log('ready module');
  };

  return {
    onReady2: onReady2
  };
})();

// this is the object literal pattern of code encapsulation
// http://learn.jquery.com/code-organization/concepts/#the-object-literal
var literal = {
  // function definition
  // literal.onReady3()
  onReady3: function() {
    console.log( 'ready literal' );
  }
};

function onReady() {
  console.log('ready');
}


// extract value from button pressed and take appropriate action
function processKeyPress() {
  // log value of key
  console.log( $(this).text());
  // log current value of result as text
  console.log( 'text: ' + $('#result').text().trim() );
  // log current value of result as a number
  console.log( parseInt( $( '#result' ).text() ) );

  if ( $( '#result' ).text().trim() === '0.00' ){
    $( '#result' ).html( $( this ).text() );
  } else {
    $( '#result' ).append( $( this ).text() );
  }
}

//$( document ).ready( onReady );
// more concise setup of the above line
// http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/#use-the-argument-that-39-s-passed-to-the-jquery-document-ready-function
// $ is alias for jQuery unless it has been taken over by another library
// loaded after jQuery
$(function($) {

  $( 'a' ).click( processKeyPress );

});


