class Bullet {
  constructor(x, y, rot) {
    this.pos = createVector(x, y);
    this.vel = createVector(20, 0);
    this.vel.rotate(rot);
    this.pos.add(this.vel);

    this.done = false;
  }

  update(cars) {
    this.pos.add(this.vel)
    if (this.pos.x > width || this.pos.x < 0 || this.pos.y > height || this.pos.y < 0) {
      this.done = true;
      return undefined;
    }
    for (let car of cars) {
      if (collidePointCircle(this.pos.x, this.pos.y, car.pos.x, car.pos.y, 50)) {
        this.done = true;
        return car
      }
    }
    return undefined;
  }

  show() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(255);
    noStroke();
    ellipse(0, 0, 5);
    pop();
  }
}
