class Game {
  constructor() {
    this.cars = [];
    for (let car of arguments) {
      car.master = this;
      this.cars.push(car);
    }
    this.bullets = [];
  }

  fire(car) {
    this.bullets.push(new Bullet(car.pos.x, car.pos.y, car.rot));
  }

  search(shooter, angle) {
    if (angle > 180 || angle < 0) {
      return {failed: 'invalid', present: false, distance: -1};
    } else if (shooter.ep < 5) {
      return {failed: 'energy', present: false, distance: -1};
    } else {
      shooter.ep -= 5;
      for (let car of this.cars) {
        if (shooter !== car && collidePointArc(car.pos.x, car.pos.y, shooter.pos.x, shooter.pos.y, 1500, shooter.rot, angle)) {
          return {failed: false, present: true, distance: (((shooter.pos.y - car.pos.y) ** 2 + (shooter.pos.x - car.pos.x) ** 2) ** 0.5) / 20}
        }
      }
      return {failed: false, present: false, distance: -1};
    }
  }

  update() {
    for (let bullet of this.bullets) {
      let ans = bullet.update(this.cars);
      if (ans) {
        ans.hp -= 5;
      }
    }

    this.bullets = this.bullets.filter(x => !x.done);
    this.cars.forEach(x => x.apply(x));
    this.cars.forEach(x => x.update());
    this.cars = this.cars.filter(x => !x.destroyed);
  }

  render() {
    this.bullets.forEach(x => x.show());
    this.cars.forEach(x => x.show());
  }

  start() {
    this.cars.forEach(x => x.setup(x));
  }
}
