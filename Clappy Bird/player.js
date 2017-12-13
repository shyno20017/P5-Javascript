function Player() {
    this.x = 50;
    this.y = height/2;
    this.speed = 0;

    this.update = function() {
        this.y += this.speed;
        this.speed++;
        if (this.speed > 4) {
            this.speed = 4;
        }
        if (this.speed < -15) {
            this.speed = -15;
        }
        if (this.y > height) {
            this.y = height;
        }
        if (this.y < 0) {
            this.y = 0;
            this.speed = 0;
        }
    }

    this.move = function(n) {
        this.speed += n;
    }

    this.show = function() {
        fill(175, 100, 127);
        noStroke();
        ellipse(this.x, this.y, 20);
    }
}
