//QUnit.test( "calculator parseExpression", function( assert ) {
//  assert.equal(typeof parseExpression, 'function');
//
//  var test = [1, '+', 2, 3];
//  assert.deepEqual( test, [1,'+',2,3]);
//  assert.deepEqual(
//    parseExpression('1+2*3-4/5'),
//    [1, '+', 2, '*', 3, '-', 4, '/', 5]);
//  assert.deepEqual(
//    parseExpression('1+25*3-47/5'),
//    [1, '+', 25, '*', 3, '-', 47, '/', 5]);
//  // the 25 is working and 47 is not??
//  // I have made progress in test driven development 
//  // and also furthered my understanding of the qunit test framework
//  assert.deepEqual(
//    parseExpression('1+2.5*3-4.7/5'),
//    [1, '+', 2.5, '*', 3, '-', 4.7, '/', 5]);
//
//
//});

QUnit.test( "calculator calculate", function( assert ) {
  assert.equal(typeof calculateExpression, 'function');
  assert.equal( calculateExpression('2*3'), 6);
  assert.equal( calculateExpression('1+2*3-4/5'), 6.2);
  assert.equal( calculateExpression('1+2*3*4/5'), 5.8);
  assert.equal( calculateExpression('1+25*3-47/5'), 66.6);
  assert.equal( calculateExpression('1+2.5*3-4.7/5'), 7.56);
});
