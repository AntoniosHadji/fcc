
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

