function Planet(x, y, s, m, xv, yv) {
    this.pos = createVector(x, y);
    this.vel = createVector(xv, yv);
    this.acc = createVector(0, 0);
    this.mass = m;
    this.size = s;

    this.update = function() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    this.display = function() {
        noStroke();
        fill(127);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    this.applyForce = function(force) {
        force.div(this.mass)
        this.acc.add(force);
    }

    this.attract = function(other) {
        var dv = p5.Vector.sub(this.pos, other.pos);
        var d = this.pos.dist(other.pos);
        dv.mult(this.mass / d);
        dv.mult(0.01)
        other.applyForce(dv);
    }
}

function Star(x, y, s, m) {
    this.pos = createVector(x, y);
    this.size = s;
    this.mass = m;

    this.display = function() {
        noStroke();
        fill(255, 200, 0);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    this.attract = function(other) {
        var dv = p5.Vector.sub(this.pos, other.pos);
        var d = this.pos.dist(other.pos);
        dv.mult(this.m / d);
        dv.mult(0.01)
        other.applyForce(dv);
    }
}
