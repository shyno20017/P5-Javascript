var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));


var socket = require('socket.io');
var io = socket(server);

io.sockets.on('connection', newConnection);

var p1in = false;
var p2in = false;

var p1, p2;
var p1c = '0000';
var p2c = '0000';
var p1cin = false;
var p2cin = false;

var turn = 0;

function newConnection(socket) {
  console.log('New Connection: ' + socket.id);
  if (!p1in) {
    socket.emit('p', {tp: 'p1'});
    p1 = socket;
    p1in = true;
  } else if (!p2in) {
    socket.emit('p', {tp: 'p2'})
    p2 = socket;
    p2in = true;
  } else {
    console.log("Error: More than 2 connected");
  }
  socket.on('pl1c', (data) => {p1c = data.code; p1cin = true;});
  socket.on('pl2c', (data) => {p2c = data.code; p2cin = true;});

  socket.on('pl1g', function (data) {
    var guessIn = data.code;
    var ansOut = compareGuess(guessIn, p2c);
    if (ansOut.win) {
      console.log("Player 1 Wins");
      p1.emit('results', ansOut);
      p1.emit('win');
      p2.emit('lose');
      setTimeout(resetGame, 6000);
    } else {
      p1.emit('results', ansOut);
      p1.emit('wait');
      p2.emit('guess');
    }
  })
  socket.on('pl2g', function (data) {
    var guessIn = data.code;
    var ansOut = compareGuess(guessIn, p1c);
    if (ansOut.win) {
      console.log("Player 2 Wins");
      p2.emit('results', ansOut);
      p2.emit('win');
      p1.emit('lose');
      setTimeout(resetGame, 6000);
    } else {
      p2.emit('results', ansOut);
      p2.emit('wait');
      p1.emit('guess');
    }
  })
}

var check = setInterval(checkGame, 3000);
var sG
function checkGame() {
  if (p1in && p2in) {
    clearInterval(check);
    startGame();
    console.log("Start");
    sG = setInterval(startGuess, 3000);
  }
}

function keepCheck() {
  sG = setInterval(startGuess, 3000);
}

function startGuess() {
  if (p1cin && p2cin) {
    clearInterval(sG);
    turn = 1;
    p1.emit('guess', {});
    p2.emit('wait', {});
  }
}

function startGame() {
  p1.emit('start');
  p2.emit('start');
}


function compareGuess(c1, c2) {
  if (c1 === c2) {
    return {win: true, cp: 4, ct: 0, nc: 0};
  } else {
    c1Arr = strToArr(c1);
    c2Arr = strToArr(c2);
    var cpo = 0;
    var cto = 0;
    for (var i = 0; i < c1Arr.length; i++) {
      if (c1Arr[i] === c2Arr[i]) {
        c1Arr[i] = "N";
        c2Arr[i] = "M";
        cpo += 1;
      }
    }
    for (var j = 0; j < c1Arr.length; j++) {
      for (var k = 0; k < c2Arr.length; k++) {
        if (c1Arr[j] === c2Arr[k]) {
          c1Arr[j] = "N";
          c2Arr[k] = "M";
          cto += 1
          break;
        }
      }
    }
    return {win: false, cp: cpo, ct: cto, nc: 4 - (cpo + cto)}
  }
}


function strToArr(strIn) {
  var arrOut = []
  for (var i = 0; i < strIn.length; i++) {
    arrOut.push(strIn[i]);
  }
  return arrOut;
}

function resetGame() {
  p1.emit('reset');
  p2.emit('reset');
  p1cin = false;
  p2cin = false;
  p1c = "0000";
  p2c = "0000";
  setTimeout(startGame, 4000);
  setTimeout(keepCheck, 4100);
  var pin = p2;
  p2 = p1;
  p1 = pin;
}

console.log("Server Running");
