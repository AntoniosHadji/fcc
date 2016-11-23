// Pomodoro clock
// Questions: How to used timers?

function getTimeRemaining(endtime) {
  let t = Date.parse(endtime) - Date.parse(new Date());
  let seconds = Math.floor((t / 1000) % 60);
  let minutes = Math.floor((t / 1000 / 60) % 60);
  let hours = Math.floor((t / (1000 * 60 * 60)) % 24);
  let days = Math.floor(t / (1000 * 60 * 60 * 24));
  return {
    total: t,
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds
  };
}

function initializeClock(id, endtime) {
  let clock = document.getElementById(id);
  let timeinterval = setInterval(function() {
    let t = getTimeRemaining(endtime);
    clock.innerHTML =  t.minutes + ':' +  t.seconds;
    if(t.total<=0){
      clearInterval(timeinterval);
    }
  },1000);
}



/**
 *
 */
function onReady() {
  console.log('onReady');
  let timer = document.getElementById('pomodoro')
    , now = new Date()
    , deadline = new Date(now.getFullYear, now.getMonth, now.getDate,
      now.getHours, now.getMinutes + 25);

  timer.innerHTML = countdown(deadline).toString();
  setInterval(function(){
    timer.innerHTML = countdown(deadline ).toString();
  }, 1000);

  //let stopTime = new Date(0,0,0,0,25);
  //let currentTime = stopTime;
  //let startTime = new Date();

  //let p = document.getElementById('pomodoro');
  //p.innerHTML = currentTime.toLocaleFormat('%M:%S');
  //console.log(currentTime.toLocaleFormat('%M:%S'));
  //$('#pomodoro').html = currentTime.toLocaleFormat('%M:%S');
  console.log('onReady Completed');
}

window.onload = onReady();
//$(document).ready( onReady );
// http://www.w3schools.com/js/tryit.asp?filename=tryjs_setinterval2
// http://www.w3schools.com/js/js_timing.asp
// https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
//
