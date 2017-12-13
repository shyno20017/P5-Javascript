var vehicle;
var food = [];
var poison = [];

function setup() {
    createCanvas(640, 360);
    vehicle = new Vehicle(width/2, height/2);
    for (var i = 0; i < 10; i++) {
        var vect = createVector(random(width), random(height))
        food.push(vect)
    }

    for (var i = 0; i < 10; i++) {
        var vect = createVector(random(width), random(height))
        poison.push(vect)
    }
}

function draw() {
    background(51);



    for (var i = 0; i < food.length; i++) {
        fill(0, 255, 0);
        noStroke()
        ellipse(food[i].x, food[i].y, 8, 8);
    }

    for (var i = 0; i < poison.length; i++) {
        fill(255, 0, 0);
        noStroke()
        ellipse(poison[i].x, poison[i].y, 8, 8);
    }

    if (mouseIsPressed) {
        var mouse = createVector(mouseX, mouseY);
        fill(127);
        stroke(200);
        strokeWeight(2);
        ellipse(mouse.x, mouse.y, 48, 48);
        vehicle.seek(mouse);
    } else {
        vehicle.behaviors(food, poison);
    }

    vehicle.update();
    vehicle.display();
}
