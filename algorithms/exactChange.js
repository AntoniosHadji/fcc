var assert = require('chai').assert
// first difficulty - currency values are floating point and cause round off error.  Multiply by 100 to avoid
// missed adding arrays to currency array, this was very frustrating and confusing because it 
// led me to believe the difference between 0.50 and .5 could be a potential error or "" vs ''. 
// this is incorrect thinking due to inexperience with javascript
// numbers are always numbers unless there is a floating point error
// strings are always strings regardless of single quote or double quote

var values = {   1: "PENNY",
                 5: "NICKEL",
                 10: "DIME",
                 25: "QUARTER",
                 100: "ONE",
                 500: "FIVE",
                1000: "TEN",
                2000: "TWENTY",
               10000: "ONE HUNDRED"
             };


function balanceCID(cid, start) {
  var balance = 0.00;
  for (var i=start; i>=0; i--) {
    balance += cid[i][1]*100;
  }
  return balance/100;
}

function checkCashRegister(price, cash, cid) {
  var change = cash*100 - price*100;
  if (balanceCID(cid, cid.length-1)*100 === change) { return "Closed";}

  var money = [10000, 2000, 1000, 500, 100, 25, 10, 5, 1];

  var currency = [];
  for (var i=0; i<money.length; i++) {
    if (balanceCID(cid, cid.length-1-i)*100 < change) { return "Insufficient Funds"; }

    if (change > money[i]) {
      var amt = Math.floor(change/money[i])*money[i];
      var index = money.length - i - 1;
      if (cid[index][1]*100 >= amt) {
        currency.push([values[money[i]], amt/100]);
        change = change - amt;
      } else if (cid[index][1] > 0) {
        currency.push([values[money[i]], cid[index][1]]);
        change = change - cid[index][1]*100;
      }
    }

  }

  // Here is your change, ma'am.
  return currency;
}

// Example cash-in-drawer array:
var testcid = [["PENNY", 1.01],
             ["NICKEL", 2.05],
             ["DIME", 3.10],
             ["QUARTER", 4.25],
             ["ONE", 90.00],
             ["FIVE", 55.00],
             ["TEN", 20.00],
             ["TWENTY", 60.00],
             ["ONE HUNDRED", 100.00]];

console.log(
checkCashRegister(19.50, 20.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]])
);
assert.deepEqual(
    checkCashRegister(19.50, 20.00,
      [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]),
      [["QUARTER", 0.50]], "Which value is not === ?");

console.log(
checkCashRegister(3.26, 100.00, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]])
);
assert.deepEqual(
    checkCashRegister(3.26, 100.00,
      [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.10], ["QUARTER", 4.25], ["ONE", 90.00], ["FIVE", 55.00], ["TEN", 20.00], ["TWENTY", 60.00], ["ONE HUNDRED", 100.00]]),
      [["TWENTY", 60.00], ["TEN", 20.00], ["FIVE", 15.00], ["ONE", 1.00], ["QUARTER", 0.50], ["DIME", 0.20], ["PENNY", 0.04]], "Which values are not equal?");


// testing with mocha and chai are awesome!!! TDD is so much easier
// in this case only chai is used as the assertion engine (??) instead of default node assert
// if I were to move these tests to test/test.js  I could run mocha and have it constantly display passing versus not passing tests.
// this saves my brain from having to review the console output and compare if my results are correct or not !!!!!!!!!!!
// HUGE productivity boost!!!!!!!!!
