var app = {

  onReady: function() {
    $( 'li' ).click( app.choosePlayer );
    $( '.squares' ).click( player.pickSquare );
    console.log('ready');
    console.log('Current Player is ' + app.player);
  },

  player: 'X',

  choosePlayer: function(event) {
    // console.dir(event);

    $( 'li#playx' ).toggleClass( 'active' );
    $( 'li#playo' ).toggleClass( 'active' );

    if (app.player === 'X') {
      app.player = 'O';
    } else {
      app.player = 'X';
    }
    console.log(app.player);
  },

};

var computer = {
  play: function() {
    console.log('computers turn');
  },
};

var player = {
  pickSquare: function(event) {
    // console.dir(event);
    // console.log(event.target.innerText);
    $( event.target ).text( app.player );
    computer.play();
  },

};


$(document).ready( app.onReady );

// vim: set foldmethod=syntax :

// NOTES:
// this works to call javascript function from html
// I'm not using it because i want to keep all javascript separate from html
// <a href="javascript:;" onclick="changePlayer('X');"> -->
//
