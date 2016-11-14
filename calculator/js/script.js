function calculate(exp) {
  var result = 0;
  result = exp.split(/[-+*\/=]/);

  return result;
}

function parseExpression(exp) {
  var arr = [];
  var operators = ['-', '+', '*', '/', '=', '.'];

  for (i=0; i<exp.length; i++) {
    var item = exp.charAt(i);
    if (operators.indexOf(item) === -1) {
      if (i>0 && typeof arr[i-1] === 'number') {
        arr[i-1] = arr[i-1]*10 + parseInt(item);
      } else {
        arr.push(parseInt(item));
      }
    } else {
      arr.push(item);
    }
  }
  return arr;
}


// extract value from button pressed and take appropriate action
function processKeyPress() {
  // log value of key
  console.log( $(this).text());

  if ( $( '#result' ).text().trim() === '0.00' ){
    $( '#result' ).html( $( this ).text() );
  } else {
    $( '#result' ).append( $( this ).text() );
  }
  // log current value of result as text
  console.log( 'text: ' + $('#result').text().trim() );
}


function onReady() {
  $( 'a' ).click( processKeyPress );
}

$( document ).ready( onReady );




// http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/#use-the-argument-that-39-s-passed-to-the-jquery-document-ready-function
// $ is alias for jQuery unless it has been taken over by another library
// loaded after jQuery
// more concise setup of the above line
//$(function($) {

