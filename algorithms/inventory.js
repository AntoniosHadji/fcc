var assert = require('chai').assert

function indexOfInventory(name, invarr) {
  for (var i=0; i<invarr.length; i++) {
    if (invarr[i][1] === name) return i;
  }
  return -1;
}


function updateInventory(inventory, delivery) {
    // All inventory must be accounted for or you're fired!
  for (var i=0; i<delivery.length; i++) {
    var index = indexOfInventory(delivery[i][1], inventory);
    if ( index === -1) {
      inventory.push(delivery[i]);
    } else {
      inventory[index][0] += delivery[i][0];
    }
  }
    return inventory.sort(function (a,b) {
      if (a[1] < b[1]) return -1;
      if (a[1] > b[1]) return 1;
      return 0;
    });
}

// Example inventory lists
var curInv = [
    [21, "Bowling Ball"],
    [2, "Dirty Sock"],
    [1, "Hair Pin"],
    [5, "Microphone"]
];

var newInv = [
    [2, "Hair Pin"],
    [3, "Half-Eaten Apple"],
    [67, "Bowling Ball"],
    [7, "Toothpaste"]
];


assert.deepEqual(
updateInventory(curInv, newInv),
[
    [88, "Bowling Ball"],
    [2, "Dirty Sock"],
    [3, "Hair Pin"],
    [3, "Half-Eaten Apple"],
    [5, "Microphone"],
    [7, "Toothpaste"]
],
"inventory does not match expected values");
