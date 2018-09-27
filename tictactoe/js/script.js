/* global $ */
const app = {
  player: 'X',
  computer: 'O',

  slot: {
    'tl': 0,
    'tm': 1,
    'tr': 2,
    'ml': 3,
    'mm': 4,
    'mr': 5,
    'bl': 6,
    'bm': 7,
    'br': 8
  },

  returnID: [
    '#tl div.table-cell',
    '#tm div.table-cell',
    '#tr div.table-cell',
    '#ml div.table-cell',
    '#mm div.table-cell',
    '#mr div.table-cell',
    '#bl div.table-cell',
    '#bm div.table-cell',
    '#br div.table-cell'
  ],

  onReady: function () {
    $('li').click(app.choosePlayer)
    $('.squares').click(player.placeSquare)
    $('#myModal button').click(app.reset)
    console.log('ready')
    console.log('Player is ' + app.player)
    console.log('Computer is ' + app.computer)
  },

  choosePlayer: function (event) {
    $('li#playx').toggleClass('active')
    $('li#playo').toggleClass('active')

    if (app.player === 'X') {
      app.player = 'O'
      app.computer = 'X'
    } else {
      app.player = 'X'
      app.computer = 'O'
    }
    console.log('Player is ' + app.player)
    console.log('Computer is ' + app.computer)
  },

  gameOver: function (winner) {
    // The only possibility is that computer wins or there is a tie.
    if (winner === app.computer) {
      $('#myModal div.modal-body').html('Computer Wins')
      $('#myModal').modal('show')
    } else {
      $('#myModal div.modal-body')
        .html('Game ends in a tie! You can not beat the computer')
      $('#myModal').modal('show')
    }
  },

  reset: function () {
    // reset html table-cells
    $('.table-cell').each(function () {
      $(this).html('')
    })

    // reset board
    computer.board = new Array(9)
  }
}

const computer = {
  board: new Array(9),

  // horizontal, vertical, diagonal paths through board array
  winPaths: [
    [0, 1, 2], // 0 top row
    [3, 4, 5], // 1 middle row
    [6, 7, 8], // 2 bottom row
    [0, 3, 6], // 3 left column
    [1, 4, 7], // 4 middle column
    [2, 5, 8], // 5 right column
    [0, 4, 8], // 6 diagonals
    [2, 4, 6] // 7
  ],

  returnOptions: function () {
    // hold possible moves
    let result = []

    // iterate through the winning paths to calculate all possible moves
    computer.winPaths.forEach(function (element, index, arr) {
      // row[0]=computer, row[1]=player, row[2]=index, row[3]=potential play
      let row = []
      let p = 0
      let c = 0
      // iterate through the winning paths and count filled squares
      element.forEach(function (e, i, a) {
        if (computer.board[e] === app.player) p++
        if (computer.board[e] === app.computer) c++
        if (computer.board[e] === undefined) { // && row[3] === undefined) {
          row[3] = i
        }
      })

      row[0] = c
      row[1] = p
      row[2] = index // index of the winning path
      // if the row is not filled, push it onto the result stack
      if (p + c !== 3) {
        result.push(row)
      }
    })

    result.sort()
    return result
  },

  returnSquareIndex: function (resultArray) {
    let r
    resultArray.forEach(function (e, i, a) {
      if (e[0] === 2) r = e
      if (e[1] === 2) r = e
    })

    if (r === undefined) {
      // fix for case when player plays ml and either tm or bm
      // without this code, player can set up a win
      if (computer.board[3] === app.player) {
        if (computer.board[7] === app.player && computer.board[6] === undefined) {
          return [0, 0, 2, 0]
        }
        if (computer.board[1] === app.player && computer.board[0] === undefined) {
          return [0, 0, 0, 0]
        }
      }
      return resultArray[0]
    } else {
      return r
    }
  },

  placeSquare: function () {
    // if middle square is not played play it
    if (computer.board[4] === undefined) {
      $(app.returnID[4]).text(app.computer)
      computer.board[4] = app.computer
    } else {
      // select choice from rows computer has 2 slots first,
      // then player has two slots
      // then any non played slot
      let data = computer.returnSquareIndex(computer.returnOptions())
      if (data === undefined) {
        // no play options means that game ended in a tie
        console.log('Game Complete: tie')
        app.gameOver('tie')
      } else {
        // select slot for computer
        let square = computer.winPaths[data[2]][data[3]]
        let id = app.returnID[square]
        $(id).text(app.computer)
        if (data[0] === 2 && data[2] <= 7) {
          console.log('Game Complete: computer wins')
          app.gameOver(app.computer)
        } else {
          computer.board[app.slot[id.substr(1, 2)]] = app.computer
        }
      }
    }
  }

}

const player = {
  placeSquare: function (event) {
    // whole event for inspection
    $(event.target).text(app.player)
    console.log(event.target)
    // square id
    let square = app.slot[event.currentTarget.id]
    computer.board[square] = app.player
    window.setTimeout(computer.placeSquare, 100)
  }
}

// DOM API commmand - jQuery not needed for this functionality
window.onload = app.onReady()

// NOTES:
// this works to call javascript function from html
// I'm not using it because i want to keep all javascript separate from html
// <a href="javascript:;" onclick="changePlayer('X');"> -->

// vim: set foldmethod=syntax :
