var cells = [];

function setup() {
    createCanvas(600, 600);
    for (var i = 0; i < 10; i++) {
        cells.push(new Cell(random(0, width), random(0, height)));
        cells[i].setSize(random(7, 20));
    }
}

function draw() {
    background(0);
    for (var i = 0; i < cells.length; i++) {
        cells[i].moveRandom(cells[i].maxSpeed, 0.05);
        cells[i].update();
        cells[i].show();
    }
}
