class Body {
  constructor(x, y, fillColor, strokeColor) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.color = color(fillColor);
    this.defaultColor = color(fillColor);
    this.stroke = color(strokeColor);
    this.defaultStroke = color(strokeColor);
    this.size = characterSize;
    this.rot = 0;
    this.rvel = 0;
    this.racc = 0;
  }

  force(x, y) {
    this.acc.add(x, y);
  }

  forceRotate(x) {
    this.racc += x;
  }

  friction() {
    this.acc.add(this.vel.copy().mult(-frictionConstant))
    this.racc += (this.rvel * -frictionConstant / 5);
  }

  update(bounce = false) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.set(0, 0);

    this.friction();
    if (bounce) {
      this.borderBounce();
    } else {
      this.borderCollide();
    }

    this.rvel += this.racc;
    this.rot += this.rvel;
    this.racc = 0;
  }

  display() {
    push();
    fill(this.color);
    stroke(this.stroke);
    strokeWeight(2);
    rectMode(CENTER);
    translate(this.pos.x, this.pos.y);
    angleMode(DEGREES)
    rotate(this.rot);
    rect(0, 0, this.size, this.size);
    pop();
  }

  borderCollide() {
    if (this.pos.x < (this.size / 2) || this.pos.x > (width - (this.size / 2))) {
      this.pos.x = constrain(this.pos.x, this.size / 2, width - (this.size / 2));
    }
    if (this.pos.y < (this.size / 2) || this.pos.y > (width - (this.size / 2))) {
      this.pos.y = constrain(this.pos.y, this.size / 2, width - (this.size / 2));
    }
  }

  borderBounce() {
    if (this.pos.x < (this.size / 2) || this.pos.x > (width - (this.size / 2))) {
      this.pos.x = constrain(this.pos.x, this.size / 2, width - (this.size / 2));
      this.vel.x *= -1.3;
    }
    if (this.pos.y < (this.size / 2) || this.pos.y > (width - (this.size / 2))) {
      this.pos.y = constrain(this.pos.y, this.size / 2, width - (this.size / 2));
      this.vel.y *= -1.3;
    }
  }

  setColor(fillColor, strokeColor) {
    this.color = color(fillColor);
    this.stroke = color(strokeColor);
  }

  setRotationSpeed() {
    this.rvel = this.vel.mag();
  }

  resetColor() {
    this.color = this.defaultColor;
    this.stroke = this.defaultStroke;
  }
}

class KeyInput {
  constructor(upKey, rightKey, downKey, leftKey, shootKey, killKey) {
    this.upKey = upKey;
    this.rightKey = rightKey;
    this.downKey = downKey;
    this.leftKey = leftKey;
    this.shootKey = shootKey;
    this.killKey = killKey;
  }

  getKeys() {
    return {
      upKey: keyIsDown(this.upKey),
      rightKey: keyIsDown(this.rightKey),
      downKey: keyIsDown(this.downKey),
      leftKey: keyIsDown(this.leftKey),
      shootKey: keyIsDown(this.shootKey),
      killKey: keyIsDown(this.killKey),
    }
  }
}

class Character {
  constructor(bodyConfig, keyConfig, basicWeapon, killWeapon, manager) {
    this.body = new Body(...bodyConfig);
    this.keyInput = new KeyInput(...keyConfig);
    this.basicWeapon = basicWeapon;
    this.killWeapon = killWeapon
    this.cooldown = 0;
    this.stun = 0;
    this.opponent = undefined;

    this.characterSpeed = 1.25
    this.alive = true;

    this.aiming = false;
    this.currentKillWeapon = undefined;
    this.charged = 0;

    this.manager = manager;
  }

  setOpponent(opponent) {
    this.opponent = opponent
  }

  update() {
    let keys = this.keyInput.getKeys();

    let speed = this.characterSpeed;
    if (this.cooldown > 0) {
      speed = this.characterSpeed / 3;
    }

    if (this.aiming) {
      if (keys.killKey && !this.stun > 0) {
        this.currentKillWeapon.rotate({
          left: keys.leftKey,
          right: keys.rightKey,
          up: keys.upKey,
          down: keys.downKey
        });
        this.charge++;
      } else if (this.stun > 0) {
        this.aiming = false;
        this.currentKillWeapon.alive = false;
        this.currentKeyWeapon = undefined;
      } else {
        if (this.charge < this.currentKillWeapon.chargeTime) {
          this.aiming = false;
          this.currentKillWeapon.alive = false;
          this.currentKillWeapon = undefined;
        } else {
          this.aiming = false;
          this.currentKillWeapon.fired = true;
          this.currentKillWeapon = undefined;
        }
        this.charge = 0;
      }
    } else if (this.stun <= 0) {
      if (keys.upKey) {
        this.body.force(0, -speed);
      }
      if (keys.rightKey) {
        this.body.force(speed, 0);
      }
      if (keys.downKey) {
        this.body.force(0, speed);
      }
      if (keys.leftKey) {
        this.body.force(-speed, 0);
      }
      if (keys.killKey) {
        this.aiming = true;
        angleMode(DEGREES);
        this.currentKillWeapon = this.manager.addShot(new this.killWeapon(this));
      }
      if (keys.shootKey) {
        if (this.cooldown <= 0 && !this.aiming) {
          let shot = this.manager.addShot(new this.basicWeapon(this, this.opponent));
          this.cooldown += shot.cooldown;
        }
      }
      this.charge = 0;
    } else {
      this.charge = 0;
    }

    this.body.setRotationSpeed();
    this.body.update(this.stun > 0);

    this.cooldown--;
    this.stun--;
    if (this.cooldown < 0) {
      this.cooldown = 0;
    }
    if (this.stun <= 0) {
      this.stun = 0;
      this.body.resetColor();
    } else {
      this.body.setColor([255, 0, 0], [255, 0, 0]);
    }
  }

  display() {
    this.body.display();
    if (this.charge > 0) {
      push();
      noFill();
      strokeWeight(2);
      translate(this.body.pos.x, this.body.pos.y);
      if (this.charge > this.currentKillWeapon.chargeTime) {
        stroke(255, 0, 0);
        ellipse(0, 0, this.body.size * 2);
      } else {
        let angle = map(this.charge, 0, this.currentKillWeapon.chargeTime, 0, 360);
        stroke(0);
        angleMode(DEGREES);
        arc(0, 0, this.body.size * 2, this.body.size * 2, -90, angle - 90, OPEN)
      }
      pop();
    }
  }

  borderCollide() {
    this.body.borderCollide();
  }

  fire() {
    this.manager.addShot(new this.basicWeapon(this, this.opponent));
  }

  gotHit(shot) {
    if (this.stun < shot.stunLength) {
      this.stun = shot.stunLength;
    }
    this.body.force(shot.startingVel.x * 0.8, shot.startingVel.y * 0.8);
  }

  lose() {
    this.alive = false;
    this.manager.createParticles(this.body.pos.x, this.body.pos.y, 20);
    this.body.pos.set(-1000, -1000);
  }
}