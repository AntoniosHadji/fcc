// Pomodoro clock
// Questions: How to used timers?
// Use pure javascript and DOM api
// depends on countdown.js http://countdownjs.org/readme.html

//global variables
window.timerId;

/**
 * no dependency
 * return endtime of session
 */
function returnSessionTargetTime(sessionTime) {
  let now = new Date();
  let target = new Date(
    now.getFullYear(), now.getMonth(), now.getDate(),
    now.getHours(), now.getMinutes() + sessionTime, now.getSeconds()
  );
  return target;
}


document.getElementById('resetTimer').addEventListener('click',
  function(event) {
    console.log('click: ' + event.target.id);
    window.clearInterval(window.timerId);
    window.timerId = null;
    document.getElementById('pomodoro').innerHTML = null;
    let report = window.pomodoroStartTime.toString();
    report += ' ' + window.pomodoroStopTime.toString();
    addData(report);
  }
);

document.getElementById('startTimer').addEventListener('click',
  function(event) {
    console.log('click: ' + event.target.id);
    window.pomodoroStartTime = new Date();
    if (window.timerId) { window.clearInterval(window.timerId) };
    let pval = parseInt(document.getElementById('ptime').value);
    let bval = parseInt(document.getElementById('btime').value);

    window.timerId =
      countdown(
        returnSessionTargetTime(pval),
        function(ts) {
          if (ts.value < 0) {
            document.getElementById('pomodoro').innerHTML = ts
              .toHTML('strong', 'Break Time!!')
              .replace('and', '</br>and</br>');
          } else {
            if (ts.value < bval*60*1000 - 1000) {
              document.getElementById('pomodoro').innerHTML = 'Break Time:</br>';
              document.getElementById('pomodoro').innerHTML += ts
                .toHTML('strong', 'Completed!!')
                .replace('and', '</br>and</br>');
            } else {
              window.pomodoroStopTime = new Date();
              document.getElementById('pomodoro').innerHTML = 'Completed!!';
              document.clearInterval(window.timerId);
            }
          }
          document.getElementById('pomodoro').innerHTML
        },
        countdown.DEFAULTS, NaN, 0 // default values for countdown.js
      );
  }
);

function onReady() {
  document.getElementById("startTimer").className =
   document.getElementById("startTimer").className.replace
      ( /(?:^|\s)disabled(?!\S)/g , '' )

  document.getElementById("resetTimer").className =
   document.getElementById("resetTimer").className.replace
      ( /(?:^|\s)disabled(?!\S)/g , '' )

  console.log('onReady Completed');
}

window.onload = onReady();

// http://www.w3schools.com/js/tryit.asp?filename=tryjs_setinterval2
// http://www.w3schools.com/js/js_timing.asp
// https://developer.mozilla.org/en-US/docs/Web/API/WindowTimers/setInterval
