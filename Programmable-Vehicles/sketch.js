let veh;
let auto;
let auto2;
let game;

function setup() {
  createCanvas(windowWidth-20, windowHeight-20);
  veh = new Vehicle(width/2, height/2, 0, undefined, (car)=> {car.setMainColor(255, 0, 0);car.setSideColor(0, 0, 255);});
  auto = new Vehicle(random(width), random(height), random(360), applyCar, setupCar);
  auto2 = new Vehicle(random(width), random(height), random(360), applyCar, setupCar);
  game = new Game(veh, auto, auto2);
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

function setupCar(car) {
  car.setMainColor(255, 0, 0);
  car.setSideColor(0, 127, 127);
  car.setValue('enemy', {present: false});
  car.setValue('run', false);
}

function applyCar(car) {
  if (car.getState().gotHit) {
    car.setValue('run', true);
  }
  if (car.getTime() % 20 === 0) {
    car.setValue('enemy', car.search(30));
    car.setValue('run', false);
  }
  if (car.getValue('run')) {
    car.moveBackward(1);
    car.moveRight(1);
  } else if (car.getValue('enemy').present) {
    if (car.getRotationClockwise() > 0) {
      car.rotateAC(0.9);
    } else {
      car.rotateC(0.9);
    }
    if (car.getValue('enemy').distance > 45) {
      car.moveForward(0.9);
    } else if (car.getValue('enemy').distance < 25) {
      car.moveBackward(0.9);
    }
    car.fire();
  } else {
    car.rotateC(0.5);
  }
}
