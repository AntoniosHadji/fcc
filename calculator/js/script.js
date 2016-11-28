// Found feature in Firfox 51,
// return result; if result is not defined in function,
// div with id="result" is returned

/**
 * this function calculates the entered expression
 * @param {String} exp - expression
 * @return {Number} evaluated expression
 * **/
function calculateExpression(exp) {
  let numbers = exp.split(/[-+*\/]/);
  let ops = exp.split(/[0-9\.]+/);
  // remove first element === ''
  ops.shift();
  // remove last element === ''
  ops.pop();

  doOperation('*', numbers, ops);
  doOperation('/', numbers, ops);
  doOperation('+', numbers, ops);
  doOperation('-', numbers, ops);

  return numbers[0];
}

/**
 *  doOperation
 *  @param {number} op
 *  @param {number} num
 *  @param {array} ops
 * **/
function doOperation(op, num, ops) {
  let i = ops.indexOf(op);
  while (i !== -1) {
    let values = num.splice(i, 2);
    let calc = c(op);

    num.splice(i, 0, calc(values[0], values[1]));
    ops.splice(i, 1);
    i = ops.indexOf(op);
  }
}

function c(op) {
  switch (op) {
    case '/':
      return function(a, b) {
        return a/b;
      };
      // break not required because return passes control out of the function
    case '*':
      return function(a, b) {
        return a*b;
      };
    case '+':
      return function(a, b) {
        return 1*a+1*b;
      };
    case '-':
      return function(a, b) {
        return a-b;
      };
  }
}

// extract value from button pressed and take appropriate action
function processNumKeyPress(event) {
  isLastKeyPressOps = false;
  if ( $( '#result' ).text().trim() === '' ) {
    $( '#result' ).html( $( this ).text() );
  } else {
    $( '#result' ).append( $( this ).text() );
  }
}

// this starts as undefined which is coerces to false
// undefined is falsy
let isLastKeyPressOps;
function processOpsKeyPress(event) {
  if ( $( this ).text() === 'C' ) {
    $( '#result' ).html( '' );
  } else {
    if (!isLastKeyPressOps) {
      $( '#result' ).append( $( this ).text() );
    }
  }
  isLastKeyPressOps = true;
}
//
function processEqualsKeyPress(event) {
  let exp = $( '#result' ).text().trim();
  $( '#result' ).html( calculateExpression(exp).toString() );
}

function onReady() {
  $( 'a.num' ).click( processNumKeyPress );
  $( 'a.ops' ).click( processOpsKeyPress );
  $( 'a.equalkey' ).click( processEqualsKeyPress );
}

$( document ).ready( onReady );


// http://learn.jquery.com/using-jquery-core/avoid-conflicts-other-libraries/#use-the-argument-that-39-s-passed-to-the-jquery-document-ready-function
// $ is alias for jQuery unless it has been taken over by another library
// loaded after jQuery
// more concise setup of the above line
// $(function($) {
