// this file is configured for use with mocha testing framework
var assert = require('chai').assert;

describe('Array', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
  });
});


describe('Array2', function() {
  describe('#indexOf()', function() {
    it('should return -1 when the value is not present', function() {
      assert.equal(-1, [1,2,3].indexOf(4));
    });
    it('should return index when the value is present', function() {
      assert.equal(0, [1,2,3].indexOf(1));
    });
  });
});
