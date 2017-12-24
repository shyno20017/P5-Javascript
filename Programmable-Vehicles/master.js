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

  update() {
    for (let bullet of this.bullets) {
      let ans = bullet.update(this.cars);
      if (ans) {
        ans.hp -= 5;
      }
    }

    this.bullets = this.bullets.filter(x => !x.done);
    this.cars.forEach(x => x.update());
    this.cars = this.cars.filter(x => !x.destroyed);
  }

  render() {
    this.bullets.forEach(x => x.show());
    this.cars.forEach(x => x.show());
  }
}
