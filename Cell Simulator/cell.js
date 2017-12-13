function Cell(x, y, vx=0, vy=0, ax=0, ay=0, s=10, rs=random(100, 2000)) {
    this.pos = createVector(x, y);
    this.vel = createVector(vx, vy);
    this.acc = createVector(ax, ay);
    this.size = s;
    this.maxSpeed = 20/this.size;
    this.col = color(random(0, 255), random(0, 255), random(0, 255));
    this.counterx = random(0, 100000);
    this.countery = random(0, 100000);
    this.seed = int(rs);

    this.show = function() {
        noStroke();
        fill(this.col);
        ellipse(this.pos.x, this.pos.y, this.size);
    }

    this.update = function() {
        this.vel.add(this.acc);
        this.vel.limit(this.maxSpeed);
        this.pos.add(this.vel);
        this.acc.mult(0);
        this.collideBoundary();
    }

    this.applyForce = function(force) {
        this.acc.add(force);
    }

    this.moveRandom = function(ran=this.maxSpeed) {
        this.applyForce(createVector(random(-ran,ran), random(-ran, ran)));
    }

    this.moveNoise = function(ran=this.maxSpeed, inc=0.01) {
        noiseSeed(this.seed);
        xn = map(noise(this.counterx), 0, 1, -ran, ran);
        yn = map(noise(this.countery), 0, 1, -ran, ran);
        this.applyForce(createVector(xn, yn));
        this.counterx += inc;
        this.countery += inc;
    }

    this.collideBoundary = function() {
        if (this.pos.x < this.size/2) {
            this.applyForce(createVector(40/this.size, 0));
            this.pos.x = this.size/2;
        }
        if (this.pos.x > width-this.size/2) {
            this.applyForce(createVector(-40/this.size, 0));
            this.pos.x = width - this.size/2;
        }
        if (this.pos.y < this.size/2) {
            this.applyForce(createVector(0, 40/this.size));
            this.pos.y = this.size/2;
        }
        if (this.pos.y > height-this.size/2) {
            this.applyForce(createVector(0, -40/this.size));
            this.pos.y = height - this.size/2;
        }
    }

    this.setSize = function(ns) {
        this.size = ns;
    }

    this.collideCell = function(other) {
        
    }
}
