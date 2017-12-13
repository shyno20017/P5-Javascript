function Obstacle(x, h) {
    this.x = x;
    this.h = h;
    this.s = 4;

    this.update = function(nh) {
        this.x -= this.s;
        if (this.x < -50) {
            this.x = width;
            this.h = nh;
            score++;
        }
    }

    this.show = function(player) {
        if (this.collide(player)) {
            fill(255, 0, 0);
            score = -1;
        } else {
            fill(255);
        }
        rect(this.x, 0, 50, this.h);
        rect(this.x, this.h + 150, 50, height - this.h - 100);
    }

    this.collide = function(player) {
        if (player.x > this.x - 20 && player.x < this.x + 70) {
            if (player.y - 20 > this.h && player.y + 20 < this.h + 150) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }
}
