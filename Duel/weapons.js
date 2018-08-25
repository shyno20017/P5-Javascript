class BasicArrow {
  constructor(shooter, target) {
    this.pos = createVector(shooter.body.pos.x, shooter.body.pos.y);
    this.vel = createVector(target.body.pos.x - this.pos.x, target.body.pos.y - this.pos.y);
    this.startingSpeed = 25;
    this.finalSpeed = 10;
    this.framesTillFinalSpeed = 30;
    this.vel.normalize().mult(this.startingSpeed);

    this.killer = false;


    this.length = 50;
    this.halfLength = this.length / 2;

    this.startingVel = this.vel.copy();
    this.direction = this.vel.heading();

    this.target = target;

    this.cooldown = 17;
    this.stunLength = 40;
    this.alive = true;

    this.counter = 0;
  }

  update() {
    this.pos.add(this.vel);
    if (this.collide(this.target.body, 30)) {
      this.target.gotHit(this);
      manager.createParticles(this.pos.x, this.pos.y, 15);
    }

    this.borderCollide();
    this.speedAdjust();
    this.counter++;
    if (this.counter > this.framesTillFinalSpeed) {
      this.counter = this.framesTillFinalSpeed
    }
  }

  collide(target, dist, killCollide = true) {
    if (p5.Vector.dist(target.pos, this.pos) < dist) {
      if (killCollide) {
        this.alive = false;
      }
      manager.createParticles(this.pos.x, this.pos.y, 10);
      return true;
    }
    return false;
  }

  display() {
    push();
    stroke(0);
    strokeWeight(4);
    translate(this.pos.x, this.pos.y);
    rotate(this.direction);
    line(-this.halfLength, 0, this.halfLength, 0);
    pop();
  }

  borderCollide() {
    if (this.pos.x < -50 || this.pos.x > width + 50 || this.pos.y < -50 || this.pos.y > width + 50) {
      this.alive = false;
      return true;
    }
    return false;
  }

  speedAdjust() {
    let modifier = this.startingSpeed - int(this.counter / (this.framesTillFinalSpeed / (this.startingSpeed - this.finalSpeed)));
    this.vel.normalize().mult(modifier);
  }
}


class KillBeam {
  constructor(shooter) {
    this.pos = createVector(shooter.body.pos.x, shooter.body.pos.y);

    let direction = p5.Vector.sub(shooter.opponent.body.pos, shooter.body.pos).heading();
    if (direction < 0) {
      direction += 360;
    }
    this.rot = direction;

    this.shooter = shooter;
    this.fired = false;

    this.killer = true;

    this.counter = 0;
    this.firedTime = 10

    this.chargeTime = 30;

    this.alive = true;
  }

  rotate(keys) {
    if (keys.left && !keys.right) {
      if (this.rot <= 180) {
        this.rot += 0.3;
      } else {
        this.rot -= 0.3;
      }
    } else if (keys.right && !keys.left) {
      if (this.rot <= 180) {
        this.rot -= 0.3;
      } else {
        this.rot += 0.3;
      }
    }

    if (keys.up) {
      this.shooter.body.force(0, -this.shooter.characterSpeed / 6);
    }
    if (keys.right) {
      this.shooter.body.force(this.shooter.characterSpeed / 6, 0);
    }
    if (keys.down) {
      this.shooter.body.force(0, this.shooter.characterSpeed / 6);
    }
    if (keys.left) {
      this.shooter.body.force(-this.shooter.characterSpeed / 6, 0);
    }

    this.pos.set(this.shooter.body.pos.x, this.shooter.body.pos.y)
  }

  update() {
    if (!this.fired) {
      if (this.rot > 360) {
        this.rot -= 360;
      } else if (this.rot < 0) {
        this.rot += 360;
      }
    } else {
      if (this.counter > this.firedTime) {
        this.alive = false;
      }

      let target = this.shooter.opponent;

      let direction = createVector(width * 2, 0);
      angleMode(DEGREES);
      direction.rotate(this.rot);
      direction.add(this.pos);
      if (collideLineRect(this.pos.x, this.pos.y, direction.x, direction.y, target.body.pos.x - (target.body.size / 2), target.body.pos.y - (target.body.size / 2), target.body.size, target.body.size)) {
        target.lose();
      }

      this.counter++;
    }
  }

  collide(other) {
    if (!this.fired) {
      return false;
    } else {
      if (!other.kill) {
        let direction = createVector(width * 2, 0);
        angleMode(DEGREES);
        direction.rotate(this.rot);
        direction.add(this.pos);
        if (collideLineRect(this.pos.x, this.pos.y, direction.x, direction.y, other.pos.x - 10, other.pos.y - 10, 30, 30)) {
          other.alive = false;
          this.shooter.manager.createParticles(other.pos.x, other.pos.y, 5);
          return true;
        }
        return false;
      }
    }
  }

  display() {
    if (!this.fired) {
      push();
      translate(this.pos.x, this.pos.y);
      angleMode(DEGREES);
      rotate(this.rot);
      stroke(255, 0, 0);
      strokeWeight(1);
      line(0, 0, width * 2, 0);
      pop();
    } else {
      push();
      translate(this.pos.x, this.pos.y);
      angleMode(DEGREES);
      rotate(this.rot);
      stroke(255, 0, 0, 200);
      if (this.counter < this.firedTime / 2) {
        strokeWeight(map(this.counter, 0, this.firedTime / 2, 0, 20));
      } else {
        strokeWeight(map(this.counter, this.firedTime / 2, this.firedTime, 20, 0));
      }
      line(0, 0, width * 2, 0);
      pop();
    }
  }
}