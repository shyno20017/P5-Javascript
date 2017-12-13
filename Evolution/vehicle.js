function Vehicle(x, y) {
    this.position = createVector(x, y);
    this.velocity = createVector(0, -2);
    this.acceleration = createVector(0, 0);;
    this.r = 6;
    this.maxspeed = 5;
    this.maxforce = 0.5;

    this.dna = []
    this.dna[0] = random(-5, 5)
    this.dna[1] = random(-5, 5)

    this.update = function() {
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.maxspeed);
        this.position.add(this.velocity);
        this.acceleration.mult(0);
    }

    this.applyForce = function(force) {
        this.acceleration.add(force);
    }

    this.behaviors = function(good, bad) {
        var steerG = this.eat(good);
        var steerB = this.eat(bad);

        steerG.mult(this.dna[0]);
        steerB.mult(this.dna[1]);

        this.applyForce(steerG);
        this.applyForce(steerB);
    }

    this.eat = function(list) {
        var record = Infinity;
        var closest = -1;
        for (var i = 0; i < list.length; i++) {
            //var d = dist(this.position.x, this.position.y, list[i].x, list[i].y);
            var d = this.position.dist(list[i]);
            if (d < record) {
                record = d;
                closest = i;
            }
        }

        if (record < this.r) {
            list.splice(closest, 1)
        } else if (closest > -1) {
            return this.seek(list[closest])
        }

        return createVector(0, 0);
    }

    this.seek = function(target) {
        var desired = p5.Vector.sub(target, this.position);
        desired.setMag(this.maxspeed);

        var steer = p5.Vector.sub(desired, this.velocity);
        steer.limit(this.maxforce);

        return steer;
    }

    this.display = function() {
        var angle = this.velocity.heading() + PI / 2;

        fill(127);
        stroke(200);
        strokeWeight(1);

        push();

        translate(this.position.x, this.position.y);
        rotate(angle)

        beginShape();
        vertex(0, -this.r * 2);
        vertex(-this.r, this.r * 2);
        vertex(this.r, this.r * 2);
        endShape(CLOSE);

        stroke(0, 255, 0)
        line(0, 0, 0, -this.dna[0]*20)
        stroke(255, 0, 0)
        line(0, 0, 0, -this.dna[1]*20)

        pop();
    }
}
