class Vehicle {
  constructor(x, y, angle, mColor, sColor) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.rot = angle;
    this.rvel = 0;
    this.racc = 0;
    this.hp = 100;
    this.ep = 100;
    this.counter = 0;
    this.mColor = mColor;
    this.sColor = sColor;
    this.state = {};
    this.storage = {};
    this.destroyed = false;
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
    let p = createVector(0.2, 0);
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
    this.racc += (0.2 * mag);
  }

  rotateAntiClockwise(mag) {
    this.rotateClockwise(-mag);
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

  getRotationAnticlockwise() {
    return -this.rvel * 10;
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
    if (this.ep < 5) {
      return {failed: 'energy', present: false, distance: -1};
    } else if (angle > 180 || angle < 0) {
      return {failed: 'invalid', present: false, distance: -1};
    } else {
      this.ep -= 5;
      for (car of cars) {
        if (this !== car && collidePointArc(car.pos.x, car.pos.y, this.pos.x, this.pos.y, 1500, this.rot, angle)) {
          return {failed: false, present: true, distance: (((this.pos.y - car.pos.y) ** 2 + (this.pos.x - car.pos.x) ** 2) ** 0.5) / 20}
        }
      }
      return {failed: false, present: false, distance: -1};
    }
  }

  set(name, value) {
    this.storage[name] = value;
  }

  get(name) {
    return this.storage[name]
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
