var p;
var blocks = [];
var mic;
var clap = false;
var score = 0;

function setup() {
    createCanvas(600, 400);
    p = new Player();
    blocks.push(new Obstacle(width/3, random(50, height-200)));
    noCursor();
    mic = new p5.AudioIn();
    mic.start();
}

function mousePressed() {
    p.move(-12);
}

function draw() {
    background(0);
    stroke(255);
    text(score,20,20);
    p.update();
    p.show();
    for (var i = 0; i < blocks.length; i++) {
        blocks[i].update(random(50, height-200));
        blocks[i].show(p);
    }
    var lev = mic.getLevel() * 600;
    if (lev > 60 && !clap) {
        p.move(-15);
        clap = true;
    }
    if (lev < 20) {
        clap = false;
    }
}
