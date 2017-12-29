class Vehicle {
  constructor(x, y, angle, apply=()=>1, setup=()=>1) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.rot = angle;
    this.rvel = 0;
    this.racc = 0;
    this.hp = 100;
    this.ep = 100;
    this.counter = 0;
    this.mColor = color(255, 255, 255);
    this.sColor = color(255, 0, 0);
    this.state = {gotHit: false, hitEnemy: false};
    this.storage = {};
    this.destroyed = false;
    this.setup = setup;
    this.apply = apply;
    this.timer = 0;
  }

  show() {
    push();
    rectMode(CENTER);
    angleMode(DEGREES);
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    scale(2);
    stroke(this.sColor);
    fill(this.mColor);
    rect(0, 0, 30, 30);
    fill(this.sColor);
    ellipse(0, 0, 5);
    line(0, 0, 20, 0);
    pop();
  }

  applyForce(x, y, rot) {
    this.acc.add(x, y);
    this.racc += rot;
  }

  moveForward(mag) {
    mag = constrain(mag, -1, 1);
    let p = createVector(0.1, 0);
    p.rotate(this.rot);
    p.mult(mag)
    this.applyForce(p.x, p.y, 0);
  }

  moveBackward(mag) {
    this.moveForward(-mag);
  }

  moveRight(mag) {
    mag = constrain(mag, -1, 1);
    let p = createVector(0, 0.1);
    p.rotate(this.rot);
    p.mult(mag)
    this.applyForce(p.x, p.y, 0);
  }

  moveLeft(mag) {
    this.moveRight(-mag);
  }

  rotateC(mag) {
    this.rotateClockwise(mag);
  }

  rotateAC(mag) {
    this.rotateAntiClockwise(mag)
  }

  rotateClockwise(mag) {
    mag = constrain(mag, -1, 1);
    this.racc += (0.1 * mag);
  }

  rotateAntiClockwise(mag) {
    this.rotateClockwise(-mag);
  }

  setMainColor(r, g, b) {
    this.mColor = color(r, g, b);
  }

  setSideColor(r, g, b) {
    this.sColor = color(r, g, b);
  }

  getForwardSpeed() {
    angleMode(DEGREES);
    let dir = this.vel.heading();
    if (dir < 0) {
      dir = 360 + dir;
    }
    return this.vel.mag() * cos(abs(this.rot - dir)) * 10;
  }

  getBackwardSpeed() {
    return -getForwardSpeed();
  }

  getRightSpeed() {
    angleMode(DEGREES);
    let dir = this.vel.heading();
    if (dir < 0) {
      dir = 360 + dir;
    }
    let r = this.rot - dir
    if (r > 0) {
      return -(this.vel.mag() * sin(abs(this.rot - dir))) * 10;
    } else {
      return this.vel.mag() * sin(abs(this.rot - dir)) * 10;
    }
  }

  getLeftSpeed() {
    return -getLeftSpeed();
  }

  getRotationClockwise() {
    return this.rvel * 10;
  }

  getRotationAntiClockwise() {
    return -this.rvel * 10;
  }

  getRotation() {
    return this.rot;
  }

  update() {
    if (this.hp <= 0) {
      this.destroyed = true;
      return;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.mult(0.96);

    this.rvel += this.racc;
    this.rot += this.rvel;
    this.racc *= 0;
    this.rvel *= 0.96;

    this.pos.x = constrain(this.pos.x, 30, width-30);
    this.pos.y = constrain(this.pos.y, 30, height-30);
    this.vel.limit(3);
    this.rot %= 360;
    this.rvel = constrain(this.rvel, -10, 10);



    this.counter = constrain(this.counter - 1, 0, 100);
    this.ep = constrain(this.ep + 0.5, 0, 100);
    this.timer++;

    this.state = {gotHit: false, hitEnemy: false};
  }

  getHP() {
    return floor(this.hp);
  }

  getEP() {
    return floor(this.ep);
  }

  ready() {
    return !this.counter > 0;
  }

  search(angle) {
    return this.master.search(this, angle);
  }

  setValue(name, value) {
    this.storage[name] = value;
  }

  getValue(name) {
    return this.storage[name]
  }

  getState() {
    return this.state;
  }

  getTime() {
    return this.timer;
  }

  fire() {
    if (this.counter > 0) {
      return {failed: 'recharge'};
    } else if (this.ep < 15) {
      return {failed: 'energy'};
    } else {
      this.master.fire(this)
      this.ep -= 15;
      this.counter = 20;
      return {failed: false}
    }
  }
}
