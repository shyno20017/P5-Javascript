let veh;
let game;

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
  veh = new Vehicle(width/2, height/2, 0, undefined, (car)=> {car.setMainColor(255, 0, 0);car.setSideColor(0, 0, 255);});

  game = new Game(veh, new Vehicle(random(width), random(height), random(360),test1 , set1));
  game.start();
}

function draw() {
  background(0);
  if (keyIsDown(87)) {
    veh.moveForward(1);
  }
  if (keyIsDown(83)) {
    veh.moveBackward(1);
  }
  if (keyIsDown(68)) {
    veh.moveRight(1);
  }
  if (keyIsDown(65)) {
    veh.moveLeft(1);
  }
  if (keyIsDown(69)) {
    veh.rotateC(1);
  }
  if (keyIsDown(81)) {
    veh.rotateAC(1);
  }
  if (keyIsDown(32)) {
    veh.fire();
  }
  game.update();
  game.render();
}

function set1(car) {
  car.setMainColor(255, 0, 255);
  car.setSideColor(0, 255, 0);
  car.setValue('past', {present: false});
}

function test1(car) {
  if (car.timer % 30 === 0) {
    car.setValue('past', car.search(30));
  }
  if (car.getValue('past').present) {
    car.fire();
  }
}
