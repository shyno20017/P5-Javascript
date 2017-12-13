var planets = []
var stars = [];

var sSlider;
var mSlider;
var starSlider;

var pmx;
var pmy;
var h = false;

function setup() {
    createP('Size:')
    sSlider = createSlider(5, 50, 10);
    createP('Mass:');
    mSlider = createSlider(10, 100, 10);
    createP('Star:');
    starSlider = createSlider(0, 1, 0);
    createP('');
    createCanvas(600, 400);
}

function draw() {
    background(0);

    for (var i = 0; i < planets.length; i++) {
        for (var j = 0; j < planets.length; j++) {
            if (i != j) {
                planets[i].attract(planets[j]);
            }
        }
    }

    for (var i = 0; i < stars.length; i++) {
        for (var j = 0; j < planets.length; j++) {
            stars[i].attract(planets[j])
            console.log('ran')
        }
    }

    for (var i = 0; i < planets.length; i++) {
        planets[i].update();
        planets[i].display();
    }

    for (var i = 0; i < stars.length; i++) {
        stars[i].display();
    }
}

function mousePressed() {
    if (starSlider.value() == 1) {
        stars.push(new Star(mouseX, mouseY, sSlider.value(), mSlider.value()))
    } else {
        if (mouseX > 0 && mouseX < width && mouseY > 0 && mouseY < height) {
            //planets.push(new Planet(mouseX, mouseY, sSlider.value(), mSlider.value(), 0, 0))
            h = true;
            pmx = mouseX;
            pmy = mouseY;
        }
    }
}

function mouseReleased() {
    if (h) {
        h = false;
        var rmx = mouseX - pmx;
        var rmy = mouseY - pmy;
        var rf = createVector(rmx, rmy);
        rf.mult(0.05);
        planets.push(new Planet(pmx, pmy, sSlider.value(), mSlider.value(), rf.x, rf.y))
    }
}
