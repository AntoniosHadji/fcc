var assert = require('chai').assert;

function ordinal(day) {
  if (day.substr(0, 1) === '0') { day = day.substr(1,1); }
  if (day === '11' || day === '12' || day === '13') { return day + 'th';}
  if (day === '1') { return day + 'st'; }
  if (day === '2') { return day + 'nd'; }
  if (day === '3') { return day + 'rd'; }
  return day + 'th';
}

function dateDiff(d1, d2) {
  // return days
  return Math.round((Date.parse(d2) - Date.parse(d1))/(1000*60*60*24));
}

function months(key) {
  var monthNames =  { '01': 'January',
                  '02': 'February',
                  '03': 'March',
                  '04': 'April',
                  '05': 'May',
                  '06': 'June',
                  '07': 'July',
                  '08': 'August',
                  '09': 'September',
                  '10': 'October',
                  '11': 'November',
                  '12': 'December'
                };

  return monthNames[key];
}

function makeFriendlyDates(arr) {
  var YYYY=0, MM=1, DD=2;
  var date1 = arr[0].split('-');
  var date2 = arr[1].split('-');
  var result = [];

  var dd = dateDiff(date1, date2);
  if (dd < 365 && dd > 0) {
    if (parseInt(date1[YYYY]) === new Date().getFullYear()) {
      result.push(months(date1[MM]).concat(' ', ordinal(date1[DD])));
    } else {
      result.push(months(date1[MM]).concat(' ', ordinal(date1[DD]), ', ', date1[YYYY]));
    }

    if (date1[MM] === date2[MM] && date1[YYYY] === date2[YYYY]) {
      result.push(ordinal(date2[DD]));
    } else {
      result.push(months(date2[MM]).concat(' ', ordinal(date2[DD])));
    }
  } else if (dd >= 365) {
    result.push(months(date1[MM]).concat(' ', ordinal(date1[DD]), ', ', date1[YYYY]));
    result.push(months(date2[MM]).concat(' ', ordinal(date2[DD]), ', ', date2[YYYY]));
  } else {
    result.push(months(date1[MM]).concat(' ', ordinal(date1[DD]), ', ', date1[YYYY]));
  }

  return result;
}


var t1 = Date.now();
assert.deepEqual(
  makeFriendlyDates(["2016-07-01", "2018-07-04"]),
  ["July 1st, 2016", "July 4th, 2018"]);

assert.deepEqual(
  makeFriendlyDates(['2016-07-01', '2016-07-04']),
  ["July 1st","4th"]);
assert.deepEqual(
  makeFriendlyDates(["2016-12-01", "2017-02-03"]),
  ["December 1st","February 3rd"]);

assert.deepEqual(
  makeFriendlyDates(["2017-03-01", "2017-05-05"]),
  ["March 1st, 2017","May 5th"]);

assert.deepEqual(
  makeFriendlyDates(["2022-09-05", "2023-09-04"]),
  ["September 5th, 2022","September 4th"]);

assert.deepEqual(
  makeFriendlyDates(["2018-01-13", "2018-01-13"]),
  ["January 13th, 2018"]);

assert.deepEqual(
  makeFriendlyDates(["2022-09-05", "2023-09-05"]),
  ["September 5th, 2022","September 5th, 2023"]);

var t2 = Date.now();
console.log('all tests passed: ', Date().toString(), t2-t1, 'ms');
