(function() {
  'use strict';

  var app = {};

  app.onReady = function() {
    console.log('Ready!');
    // this is for testing only
    test();
  };

  /** this is a valid JSDoc comment for test function */
  function test() {
    for (i=0; i<10; i++) {
      console.log('this is a test function');
    }
  };

  window.onload = app.onReady();
})();


// vim: set foldmethod=syntax foldlevel=1:

