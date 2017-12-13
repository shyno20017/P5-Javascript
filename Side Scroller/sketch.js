var person;

function setup() {
    createCanvas(600, 400);
    person = new Person();
}

function draw() {
    background(200);

    var gravity = createVector(0, 0.1);
    person.applyForce(gravity);
    person.update();
    person.edges();
    //translate(-person.pos.x + 50, 0)
    person.display();

    fill(255, 0 , 0);
    rect(400, height - 50, 50, 50);
}

function keyPressed() {
    if (key == ' ') {
        person.applyForce(0, -10);
        console.table(person.acc);
    }
}
