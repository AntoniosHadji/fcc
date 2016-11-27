var app = {

  onReady: function() {
    $( 'li' ).click( app.choosePlayer );
    $( '.squares' ).click( player.pickSquare );
    console.log('ready');
    console.log('Current Player is ' + app.player);
  },

  player: 'X',

  computer: function(player) {
    if (player === 'X') {
      return 'O';
    } else {
      return 'X';
    }
  },

  choosePlayer: function(event) {
    // console.dir(event);

    $( 'li#playx' ).toggleClass( 'active' );
    $( 'li#playo' ).toggleClass( 'active' );

    if (app.player === 'X') {
      app.player = 'O';
    } else {
      app.player = 'X';
    }
    console.log('Current Player is ' + app.player);
  },

  coord: function(id) {
    switch (id) {
      case 'tl':
        return 0;
      case 'tm':
        return 1;
      case 'tr':
        return 2;
      case 'ml':
        return 3;
      case 'mm':
        return 4;
      case 'mr':
        return 5;
      case 'bl':
        return 6;
      case 'bm':
        return 7;
      case 'br':
        return 8;
    }
  },

  returnID: function(index) {
    switch (index) {
      case 0:
        return '#tl div.table-cell';
      case 1:
        return '#tm div.table-cell';
      case 2:
        return '#tr div.table-cell';
      case 3:
        return '#ml div.table-cell';
      case 4:
        return '#mm div.table-cell';
      case 5:
        return '#mr div.table-cell';
      case 6:
        return '#bl div.table-cell';
      case 7:
        return '#bm div.table-cell';
      case 8:
        return '#br div.table-cell';
    }
  },

};

var computer = {
  board: new Array(9),

  winPaths: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ],

  pickSquare: function() {
    var result = [];
    console.log(computer.board);

    computer.winPaths.forEach(function(element, index, arr) {
      console.log(element);
      // row[0]=computer, row[1]=player, row[2]=index, row[3]=empty slot
      var row = [];
      var x = 0;
      var o = 0;
      element.forEach(function(e, i, a) {
        if (computer.board[e] === 'X') {
          x++;
        }
        if (computer.board[e] === 'O') {
          o++;
        }
        if (computer.board[e] === undefined) {
          row[3] = i;
        }
      });

      row[0] = o;
      row[1] = x;
      row[2] = index;
      if ( x + o !== 3 ) {
        result.push(row);
        console.log('row: ' + row);
      }
    });
    result.sort();
    var data = computer.returnSquareIndex(result);
    if (data !== undefined ) {
      console.log('si: ' + data, data.length);
      var square = computer.winPaths[data[2]][data[3]];
      var d = app.returnID(square);
      console.log('square: ' + d );
      $( d ).text('O');
      computer.board[app.coord(d.substr(1, 2))] = 'O';
    } else {
      console.log('Game Complete');
    }
  },

  returnSquareIndex: function(resultArray) {
    var r;
    resultArray.forEach( function(e, i, a) {
      console.log('e: ', i, e, e[0], e[1]);
      if (e[0] === 2) r = e;
      if (e[1] === 2) r = e;
    });
    if (r === undefined) {
      return resultArray[0];
    } else {
      return r;
    }
  },

  play: function() {
    console.log('computers turn');
    computer.pickSquare();
  },
};

var player = {
  pickSquare: function(event) {
    // whole event for inspection
    // console.dir(event);
    // console.log(event.target);
    $( event.target ).text( app.player );
    // square id
    console.log(event.currentTarget.id);
    var square = app.coord(event.currentTarget.id);
    computer.board[square] = app.player;
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
