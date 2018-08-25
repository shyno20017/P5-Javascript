class GameManager {
  constructor() {
    this.p1 = undefined;
    this.p2 = undefined;
    this.weaponManager = new WeaponManager();

    this.particles = [];
  }

  newGame() {
    this.p1 = new Character([width / 2, 100, 255, 0], [keys.W, keys.D, keys.S, keys.A, keys.F, keys.G], BasicArrow, KillBeam, manager);
    this.p2 = new Character([width / 2, height - 100, 0, 0], [keys.UP, keys.RIGHT, keys.DOWN, keys.LEFT, keys.O, keys.P], BasicArrow, KillBeam, manager);
    this.p1.setOpponent(this.p2);
    this.p2.setOpponent(this.p1);
  }

  addShot(shot) {
    return this.weaponManager.addShot(shot);
  }

  update() {
    this.weaponManager.update();
    if (this.p1.alive) {
      this.p1.update();
    }
    if (this.p2.alive) {
      this.p2.update();
    }

    this.particleUpdate();
  }

  display() {
    this.weaponManager.display();
    if (this.p1.alive) {
      this.p1.display();
    }
    if (this.p2.alive) {
      this.p2.display();
    }

    this.particleDisplay();
  }

  createParticles(x, y, n) {
    for (let i = 0; i < n; i++) {
      this.particles.push(new Particle(x, y));
    }
  }

  particleUpdate() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
    }

    this.particles = this.particles.filter(particle => particle.lifetime > -20);
  }

  particleDisplay() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].display();
    }
  }
}

class WeaponManager {
  constructor() {
    this.shots = [];
  }

  addShot(shot) {
    this.shots.push(shot);
    return shot;
  }

  checkShots() {
    this.shots = this.shots.filter(shot => shot.alive);
  }

  collideShots() {
    for (let i = 0; i < this.shots.length; i++) {
      for (let j = 0; j < this.shots.length; j++) {
        if (i != j) {
          this.shots[i].collide(this.shots[j], 20);
        }
      }
    }
  }

  update() {
    for (let i = 0; i < this.shots.length; i++) {
      this.shots[i].update();
    }

    this.collideShots();
    this.checkShots();
  }

  display() {
    for (let i = 0; i < this.shots.length; i++) {
      this.shots[i].display();
    }
  }
}