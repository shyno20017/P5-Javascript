function resetBackground() {
  canvas.position((windowWidth / 2) - (canvasSize / 2))
  background(255);
  noFill();
  stroke(0);
  strokeWeight(8);
  rect(0, 0, width, height);
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(7));
    this.color = random(0, 255);
    this.rot = random(0, 360);
    this.rvel = random(-20, 20);

    this.lifetime = 20;
    this.alive = true;
  }

  update() {
    this.pos.add(this.vel);
    this.rot += this.rvel;
    this.lifetime--;
  }

  display() {
    push();
    angleMode(DEGREES);
    translate(this.pos.x, this.pos.y);
    rotate(this.rot);
    stroke(0);
    strokeWeight(1);
    fill(this.color, map(this.lifetime, 20, 0, 255, 0));
    rectMode(CENTER);
    rect(0, 0, 10, 10);
    pop();
  }
}