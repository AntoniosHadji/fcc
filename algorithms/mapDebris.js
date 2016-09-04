var assert = require('chai').assert;


function orbitalPeriod(arr) {
  var GM = 398600.4418;
  var earthRadius = 6367.4447;
 
  return arr.map(function(currentValue, index, array) {
    currentValue.orbitalPeriod =
      Math.round(
          2*Math.PI*Math.sqrt(
            Math.pow(earthRadius + currentValue.avgAlt,3)/GM
            )
          );
    delete currentValue.avgAlt;
    return currentValue;
  });

}

assert.deepEqual(
  orbitalPeriod([{name : "sputnik", avgAlt : 35873.5553}]),
  [{name: "sputnik", orbitalPeriod: 86400}]);
