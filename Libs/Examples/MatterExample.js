// Example using the defualt renderer

/*

var engine = createEngine();
var render = createRenderer(engine);
var poly = new Polygon(engine.world, render.width/2, 0, 5, 20);
var ground = new Boundary(engine.world, render.width/2, render.height, render.width, 60);
var mConstraint = addMouseConstraint(engine, render);
engine.run();
render.run();

*/



// Example using p5 as renderer

/*

var engine;
var canvas;
var mConstraint;
var poly;
var ground;
function setup() {
    canvas = createCanvas(800, 600);
    engine = createEngine();
    mConstraint = addMouseConstraint(engine, canvas);
    poly = new PPolygon(engine.world, width/2, 0, 5, 20);
    ground = new PBoundary(engine.world, width/2, height, width, 60);
    engine.run();
}

function draw() {
    background(0);
    fill(0);
    stroke(255);
    poly.show();
    ground.show();
}

*/



// More Complicated example using p5 as renderer

/*

var engine;
var mConstraint;
var boxes = [];
var polys = [];
var ground;
var canvas;

function setup() {
    canvas = createCanvas(800, 600);
    engine = createEngine();
    mConstraint = addMouseConstraint(engine, canvas);
    boxes.push(new PRectangle(engine.world, 200, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 400, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 600, 200, 30, 30));
    ground = new PBoundary(engine.world, width/2, height, width, 50);
}

function draw() {
    engine.update();
    background(51);
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].offScreen(width, height, {ub:false, threshold: 200})) {
            boxes[i].remove(boxes);
            i--;
            console.log(engine.world.bodies.length, boxes.length);
        } else {
            if (boxes[i].isHeld(mConstraint)) {
                //boxes[i].angVel(boxes[i].angVel() + 0.006);
                fill(255, 0, 0);
                if (keyIsDown(81)) {
                    boxes[i].angVel(boxes[i].angVel() - 0.006);
                } else if (keyIsDown(69)) {
                    boxes[i].angVel(boxes[i].angVel() + 0.006);
                }
            } else {
                fill(0, 255, 0);
            }
            noStroke();
            boxes[i].show();
        }
    }
    for (var i = 0; i < polys.length; i++) {
        if (polys[i].offScreen(width, height, {ub:false, threshold: 200})) {
            polys[i].remove(polys);
            i--;
        } else {
            if (polys[i].isHeld(mConstraint)) {
                //polys[i].angVel(polys[i].angVel() + 0.006);
                fill(255, 0, 0);
                if (keyIsDown(81)) {
                    polys[i].angVel(polys[i].angVel() - 0.006);
                } else if (keyIsDown(69)) {
                    polys[i].angVel(polys[i].angVel() + 0.006);
                }
            } else {
                fill(0, 255, 0);
            }
            noStroke();
            polys[i].show();
        }
    }
    fill(0);
    ground.show();
}

function keyPressed(data) {
    if (data.key == ' ') {
        polys.push(new PPolygon(engine.world, mouseX, mouseY, 5, 15));
    }
}

*/


// Example that includes constraint

/*


var engine;
var canvas;
var mConstraint;
var rect1;
var rect2;
var ground;
var cons=[];


function setup() {
    canvas = createCanvas(800, 600);
    engine = createEngine();
    mConstraint = addMouseConstraint(engine, canvas);
    rect1 = new PRectangle(engine.world, width/4, 0, 30, 30);
    rect2 = new PRectangle(engine.world, width/2, 0, 30, 30);
    ground = new PBoundary(engine.world, width/2, height, width, 60);
    cons.push(Particle.constraint(engine.world, rect1, rect2, {stiffness: 0.01}));
}

function draw() {
    engine.update();
    background(50);
    noStroke();
    fill(0, 255, 0);
    rect1.show();
    rect2.show();
    fill(0);
    ground.show();
    stroke(0, 0, 255);
    strokeWeight(4);
    for (var i = 0; i < cons.length; i++) {
        cons[i].show();
    }
}

*/

// More Complicated Example

/*

var engine;
var mConstraint;
var boxes = [];
var polys = [];
var constraints = [];
var ground;
var canvas;

function setup() {
    canvas = createCanvas(800, 600);
    engine = createEngine();
    mConstraint = addMouseConstraint(engine, canvas);
    boxes.push(new PRectangle(engine.world, 200, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 400, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 600, 200, 30, 30));
    ground = new PBoundary(engine.world, width/2, height+70, width*2, 200);
}

function draw() {
    engine.update();
    background(51);
    for (var i = 0; i < boxes.length; i++) {
        if (boxes[i].offScreen(width, height, {ub:false, threshold: 200})) {
            boxes[i].remove(boxes);
            i--;
        } else {
            if (boxes[i].isHeld(mConstraint)) {
                //boxes[i].angVel(boxes[i].angVel() + 0.006);
                fill(255, 0, 0);
                if (keyIsDown(81)) {
                    boxes[i].angVel(boxes[i].angVel() - 0.006);
                } else if (keyIsDown(69)) {
                    boxes[i].angVel(boxes[i].angVel() + 0.006);
                }
            } else {
                fill(0, 255, 0);
            }
            noStroke();
            boxes[i].show();
        }
    }
    for (var i = 0; i < boxes.length; i++) {
        stroke(0, 0, 255);
        strokeWeight(4);
        boxes[i].showConstraints();
    }
    for (var i = 0; i < polys.length; i++) {
        if (polys[i].offScreen(width, height, {ub:false, threshold: 200})) {
            polys[i].remove(polys);
            i--;
        } else {
            if (polys[i].isHeld(mConstraint)) {
                //polys[i].angVel(polys[i].angVel() + 0.006);
                fill(255, 0, 0);
                if (keyIsDown(81)) {
                    polys[i].angVel(polys[i].angVel() - 0.006);
                } else if (keyIsDown(69)) {
                    polys[i].angVel(polys[i].angVel() + 0.006);
                }
            } else {
                fill(0, 255, 0);
            }
            noStroke();
            polys[i].show();
        }
    }
    noStroke();
    fill(0);
    ground.show();
}

function keyPressed(data) {
    if (data.key == ' ') {
        polys.push(new PPolygon(engine.world, mouseX, mouseY, 5, 15));
    }
}

*/
