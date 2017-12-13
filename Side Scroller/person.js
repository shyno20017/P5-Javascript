function Person() {
    this.pos = createVector(50, height - 100);
    this.vel = createVector(1, 0);
    this.acc = createVector(0, 0);

    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.edges = function() {
        if (this.pos.y > height + 1) {
            this.vel.y *= 0;
            this.acc.y *= 0;
            this.pos.y = height;
        }
    }

    this.display = function() {
        fill(0);
        rect(this.pos.x, this.pos.y - 50, 20, 50)
    }
}
