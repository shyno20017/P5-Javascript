var socket;
var started = false;
var giveCode = false;
var afterGive = false;
var guessing = false;
var waiting = false;
var won = false;
var lost = false;
var pl = 0;
var myCode = '0000';
var myGuess = '0000';
var numGuesses = 0;
var myPs = [];
var entry, win1, win2, lose1, lose2;
var winSounds = [];
var loseSounds = [];

function preload() {
  entry = loadSound("Sounds/entry.wav");
  win1 = loadSound("Sounds/win.wav");
  win2 = loadSound("Sounds/win2.wav");
  lose1 = loadSound("Sounds/lose.wav");
  lose2 = loadSound("Sounds/lose2.wav");
  winSounds = [win1, win2];
  loseSounds = [lose1, lose2];
}

function setup() {
  createCanvas(600, 600);
  background(0);

  var ipdress = prompt("Adress of Server")
  socket = io.connect('http://' + ipdress + ':3000');
  socket.on('mouse', newDrawing);
  socket.on('p', setPlayer);
  socket.on('start', function () {
    console.log('Started');
    started = true;
    giveCode = true;
  });
  socket.on('guess', function () {
    guessing = true;
    afterGive = false;
    waiting = false;
  });
  socket.on('wait', function () {
    afterGive = false;
    waiting = true;
    guessing = false;
  });
  socket.on('results', function (data) {
    console.log(data);
    addResult(data);
  });
  socket.on('win', function () {
    won = true;
    guessing = false;
    waiting = false;
    afterGive = false;
    random(winSounds).play();
  });
  socket.on('lose', function () {
    lost = true;
    guessing = false;
    waiting = false;
    afterGive = false;
    random(loseSounds).play();
  });
  socket.on('reset', function () {
    started = false;
    giveCode = false;
    afterGive = false;
    guessing = false;
    waiting = false;
    won = false;
    lost = false;
    myCode = "0000";
    myGuess = "0000";
    numGuesses = 0;
    for (var i = 0; i < myPs.length; i++) {
      myPs[i].remove();
    }
    if (pl === 1) {
      pl = 2;
    } else if (pl === 2) {
      pl = 1;
    }
  })
}

function draw() {
  background(0);
  if (!started) {
    textAlign(CENTER);
    textSize(40);
    fill(255);
    text("Waiting for Game to Start", width/2, height/2);
  } else {
    if (giveCode) {
      fill(255);
      textSize(40);
      text("Enter Code", width/2, 350);
      text("Your Code", width/2, 50);
      drawCircles();
      drawCode();
      drawButtons();
    } else if (afterGive) {
      fill(0, 255, 0);
      textSize(40);
      text("Your Code", width/2, 50);
      drawCode();
      fill(255);
      text("Waiting for Opponent", width/2, height/2);
    } else if (guessing) {
      fill(255);
      textSize(40);
      text("Your Code", width/2, 50);
      drawCode();
      fill(255);
      text("Guess The Code", width/2, 250);
      drawGuess();
      drawCircles();
      drawButtons();
    } else if (waiting) {
      fill(255);
      textSize(40);
      text("Your Code", width/2, 50);
      drawCode();
      fill(255);
      text("Opponent is Guessing", width/2, height/2);
    } else if (won) {
      fill(0, 255, 0);
      textSize(40);
      text("You Won", width/2, height/2)
    } else if (lost) {
      fill(255, 0, 0);
      textSize(40);
      text("You Lost", width/2, height/2);
    }
  }
}


function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 36);
}

function setPlayer(data) {
  if (data.tp == 'p1') {
    pl = 1;
  } else {
    pl = 2;
  }
}

function drawCircles() {
  noStroke();
  fill(255, 0, 0);
  ellipse(150, 450, 80);
  fill(0, 255, 0);
  ellipse(250, 450, 80);
  fill(0, 0, 255);
  ellipse(350, 450, 80);
  fill(255, 255, 0);
  ellipse(450, 450, 80);
}

function drawButtons() {
  fill(255);
  rectMode(CENTER);
  rect(50, height/2, 100, 50);
  rect(550, height/2, 98, 50);
  fill(0);
  textSize(25);
  text("Submit", 50, height/2+10);
  text("Back", 550, height/2+10)
}

function drawCode() {
  var xcoor = 150;
  for (var i = 0; i < myCode.length; i++) {
    if (myCode[i] == 0) {
      fill(255);
    } else if (myCode[i] == 1) {
      fill(255, 0, 0);
    } else if (myCode[i] == 2) {
      fill(0, 255, 0);
    } else if (myCode[i] == 3) {
      fill(0, 0, 255);
    } else if (myCode[i] == 4) {
      fill(255, 255, 0);
    }
    noStroke();
    ellipse(xcoor, 100, 80);
    xcoor += 100;
  }
}

function drawGuess() {
  var xcoor = 150;
  for (var i = 0; i < myGuess.length; i++) {
    if (myGuess[i] == 0) {
      fill(255);
    } else if (myGuess[i] == 1) {
      fill(255, 0, 0);
    } else if (myGuess[i] == 2) {
      fill(0, 255, 0);
    } else if (myGuess[i] == 3) {
      fill(0, 0, 255);
    } else if (myGuess[i] == 4) {
      fill(255, 255, 0);
    }
    noStroke();
    ellipse(xcoor, 350, 80);
    xcoor += 100;
  }
}

function mouseReleased() {
  if (giveCode) {
    if (dist(mouseX, mouseY, 150, 450) < 40) {
      if (myCode[0] === '0') {
        myCode = myCode.replaceAt(0, "1");
      } else if(myCode[1] === '0') {
        myCode = myCode.replaceAt(1, "1");
      } else if(myCode[2] === '0') {
        myCode = myCode.replaceAt(2, "1");
      } else if(myCode[3] === '0') {
        myCode = myCode.replaceAt(3, "1");
      }
    } else if (dist(mouseX, mouseY, 250, 450) < 40) {
      if (myCode[0] === '0') {
        myCode = myCode.replaceAt(0, "2");
      } else if(myCode[1] === '0') {
        myCode = myCode.replaceAt(1, "2");
      } else if(myCode[2] === '0') {
        myCode = myCode.replaceAt(2, "2");
      } else if(myCode[3] === '0') {
        myCode = myCode.replaceAt(3, "2");
      }
    } else if (dist(mouseX, mouseY, 350, 450) < 40) {
      if (myCode[0] === '0') {
        myCode = myCode.replaceAt(0, "3");
      } else if(myCode[1] === '0') {
        myCode = myCode.replaceAt(1, "3");
      } else if(myCode[2] === '0') {
        myCode = myCode.replaceAt(2, "3");
      } else if(myCode[3] === '0') {
        myCode = myCode.replaceAt(3, "3");
      }
    } else if (dist(mouseX, mouseY, 450, 450) < 40) {
      if (myCode[0] === '0') {
        myCode = myCode.replaceAt(0, "4");
      } else if(myCode[1] === '0') {
        myCode = myCode.replaceAt(1, "4");
      } else if(myCode[2] === '0') {
        myCode = myCode.replaceAt(2, "4");
      } else if(myCode[3] === '0') {
        myCode = myCode.replaceAt(3, "4");
      }
    } else if (mouseX > 0 && mouseX < 100 && mouseY > 275 && mouseY < 325) {
      submitCode();
    } else if (mouseX > 500 && mouseX < 600 && mouseY > 275 && mouseY < 325) {
      backCode();
    }
  }
  if (guessing) {
    if (dist(mouseX, mouseY, 150, 450) < 40) {
      if (myGuess[0] === '0') {
        myGuess = myGuess.replaceAt(0, "1");
      } else if(myGuess[1] === '0') {
        myGuess = myGuess.replaceAt(1, "1");
      } else if(myGuess[2] === '0') {
        myGuess = myGuess.replaceAt(2, "1");
      } else if(myGuess[3] === '0') {
        myGuess = myGuess.replaceAt(3, "1");
      }
    } else if (dist(mouseX, mouseY, 250, 450) < 40) {
      if (myGuess[0] === '0') {
        myGuess = myGuess.replaceAt(0, "2");
      } else if(myGuess[1] === '0') {
        myGuess = myGuess.replaceAt(1, "2");
      } else if(myGuess[2] === '0') {
        myGuess = myGuess.replaceAt(2, "2");
      } else if(myGuess[3] === '0') {
        myGuess = myGuess.replaceAt(3, "2");
      }
    } else if (dist(mouseX, mouseY, 350, 450) < 40) {
      if (myGuess[0] === '0') {
        myGuess = myGuess.replaceAt(0, "3");
      } else if(myGuess[1] === '0') {
        myGuess = myGuess.replaceAt(1, "3");
      } else if(myGuess[2] === '0') {
        myGuess = myGuess.replaceAt(2, "3");
      } else if(myGuess[3] === '0') {
        myGuess = myGuess.replaceAt(3, "3");
      }
    } else if (dist(mouseX, mouseY, 450, 450) < 40) {
      if (myGuess[0] === '0') {
        myGuess = myGuess.replaceAt(0, "4");
      } else if(myGuess[1] === '0') {
        myGuess = myGuess.replaceAt(1, "4");
      } else if(myGuess[2] === '0') {
        myGuess = myGuess.replaceAt(2, "4");
      } else if(myGuess[3] === '0') {
        myGuess = myGuess.replaceAt(3, "4");
      }
    } else if (mouseX > 0 && mouseX < 100 && mouseY > 275 && mouseY < 325) {
      submitCode();
    } else if (mouseX > 500 && mouseX < 600 && mouseY > 275 && mouseY < 325) {
      backCode();
    }
  }
  return false;
}

function sendCode() {
  giveCode = false;
  afterGive = true;
  if (pl == 1) {
    socket.emit('pl1c', {code: myCode});
  }
  if (pl == 2) {
    socket.emit('pl2c', {code: myCode});
  }
  entry.play();
}


function sendGuess() {
  guessing = false;
  waiting = true;
  numGuesses += 1
  if (pl == 1) {
    socket.emit('pl1g', {code: myGuess});
  }
  if (pl == 2) {
    socket.emit('pl2g', {code: myGuess});
  }
  entry.play();
}



function addResult(data) {
  var totalStr = ""

  for (var i = 0; i < myGuess.length; i++) {
    if (myGuess[i] === '1') {
      totalStr += "<span style='color:red'>O</span>"
    } else if (myGuess[i] === '2') {
      totalStr += "<span style='color:green'>O</span>"
    } else if (myGuess[i] === '3') {
      totalStr += "<span style='color:blue'>O</span>"
    } else if (myGuess[i] === '4') {
      totalStr += "<span style='color:orange'>O</span>"
    }
  }

  totalStr += ' : ';

  var greenStr = "<span style='color:green'>"
  greenStr += ("0".repeat(data.cp));
  greenStr += "</span>"
  totalStr += greenStr;
  var cyanStr = "<span style='color:cyan'>"
  cyanStr += ("0".repeat(data.ct));
  cyanStr += "</span>"
  totalStr += cyanStr;
  var blackStr = "<span style='color:black'>"
  blackStr += ("0".repeat(data.nc));
  blackStr += "</span>"
  totalStr += blackStr;




  totalStr = numGuesses + '. ' + totalStr;
  var newP = createP(totalStr);
  newP.attribute('style', 'font-size:300%');
  myPs.push(newP);
  myGuess = "0000";
}


function submitCode() {
  if (giveCode) {
    var validCode = true;
    for (var i = 0; i < myCode.length; i++) {
      if (myCode[i] === "0") {
        validCode = false;
      }
    }
    if (validCode) {
      sendCode();
    }
  } else if (guessing) {
    var validGuess = true;
    for (var j = 0; j < myGuess.length; j++) {
      if (myGuess[j] === "0") {
        validGuess = false;
      }
    }
    if (validGuess) {
      sendGuess();
    }
  }
}

function backCode() {
  if (giveCode) {
    if (myCode != "0000") {
      for (var i = myCode.length-1; i >= 0; i--) {
        if (myCode[i] != "0") {
          myCode = myCode.replaceAt(i, "0");
          break;
        }
      }
    }
  } else if (guessing) {
    if (myGuess != "0000") {
      for (var i = myGuess.length-1; i >= 0; i--) {
        if (myGuess[i] != "0") {
          myGuess = myGuess.replaceAt(i, "0");
          break;
        }
      }
    }
  }
}








String.prototype.replaceAt=function(index, replacement) {
    return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}


// End of File
