var assert = require('chai').assert;


function pairwise(arr, arg) {
  var arrayIndices = [];

  return arr.reduce(function(pV, cV, cI) {
    for (var i=cI+1; i<arr.length; i++) {
      if (arrayIndices.indexOf(cI) === -1 &&
          arrayIndices.indexOf(i) === -1) {
        if (cV+arr[i] === arg) {
          arrayIndices.push(cI, i);
          continue;
        }
      }
    }
    return arrayIndices.reduce(function(a,b) { return a+b; }, 0);
  }, 0);
}

var t1 = Date.now();
// duplicate values being added ??
assert.equal(pairwise([1, 1, 1], 2),  1);
assert.equal(pairwise([1, 1, 1, 1], 2),  6);

assert.equal(pairwise([1,4,2,3,0,5], 7), 11);
assert.equal(pairwise([1, 3, 2, 4], 4),  1);
assert.equal(pairwise([], 100),0);

assert.equal(pairwise([0, 0, 0, 0, 1, 1], 1),  10);
var t2 = Date.now();
console.log('all tests passed: ', Date().toString(), t2-t1, 'ms');
