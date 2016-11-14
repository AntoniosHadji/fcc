QUnit.test( "hello test", function( assert ) {
  assert.ok( 1 == "1", "Passed!" );
});

QUnit.test( "calculator functions", function( assert ) {
  var test = [1, 2, 3];
  assert.deepEqual( test, [1,2,3], "Confirm manual test");
  assert.deepEqual(
    string2Array('1+2*3-4/5'),
    [1, '+', 2, '*', 3, '-', 4, '/', 5]);
  assert.deepEqual(
    string2Array('1+25*3-47/5'),
    [1, '+', 25, '*', 3, '-', 47, '/', 5]);
  assert.equal( calculate('1+2*3-4/5'), 6.2);
  assert.equal( calculate('1+2*3*4/5'), 5.8);

});
