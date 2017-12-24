let veh;
let game;

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
  veh = new Vehicle(width/2, height/2, 0, [0, 127, 255], [255, 0, 127]);

  game = new Game(veh, new Vehicle(random(width), random(height), random(360), [255, 0, 255], [0, 255, 0]), new Vehicle(random(width), random(height), random(360), [255, 0, 255], [0, 255, 0]));
}

function draw() {
  background(0);
  if (keyIsDown(87)) {
    veh.moveForward(0.5);
  }
  if (keyIsDown(83)) {
    veh.moveBackward(0.5);
  }
  if (keyIsDown(68)) {
    veh.moveRight(0.5);
  }
  if (keyIsDown(65)) {
    veh.moveLeft(0.5);
  }
  if (keyIsDown(69)) {
    veh.rotateC(0.5);
  }
  if (keyIsDown(81)) {
    veh.rotateAC(0.5);
  }
  if (keyIsDown(32)) {
    veh.fire();
  }
  game.update();
  game.render();
}
