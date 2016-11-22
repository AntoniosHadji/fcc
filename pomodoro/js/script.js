// Pomodoro clock
// Questions: How to used timers?

let stopTime = new Date(); //moment().add(25, 'minutes');

function getTimeRemaining(endtime){
  let t = Date.parse(endtime) - Date.parse(new Date());
  let seconds = Math.floor( (t/1000) % 60 );
  let minutes = Math.floor( (t/1000/60) % 60 );
  let hours = Math.floor( (t/(1000*60*60)) % 24 );
  let days = Math.floor( t/(1000*60*60*24) );
  return {
    'total': t,
    'days': days,
    'hours': hours,
    'minutes': minutes,
    'seconds': seconds,
  };
}

/**
 *
 */
function onReady() {
  console.log('onReady');
  $( '#pomodoro' ).html( 'time: ' + stopTime.toLocaleTimeString() );
};

$( document ).ready( onReady );


