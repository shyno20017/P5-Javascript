var engine;
var mConstraint;
var boxes = [];
var polys = [];
var constraints = [];
var ground;
var canvas;
var listen;

function setup() {
    canvas = createCanvas(800, 600);
    engine = createEngine();
    mConstraint = addMouseConstraint(engine, canvas);
    boxes.push(new PRectangle(engine.world, 200, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 400, 200, 30, 30));
    boxes.push(new PRectangle(engine.world, 600, 200, 30, 30));
    ground = new PBoundary(engine.world, width/2, height+70, width*2, 200);
    ground.fillColor(0);
    ground.strokeColor(0, 0);
    ground.label('ground');
    // listen = createEventListener(engine, mConstraint);
    // listen.afterAdd(function(event) {console.log(event);})
    // listen.activeCollision(function(event) {
    //     for (var i = 0; i < event.pairs.length; i++) {
    //         if (event.pairs[i].bodA.label() != 'ground') {
    //             event.pairs[i].bodA.fillColor(0, 0, 255);
    //         }
    //         if (event.pairs[i].bodB.label() != 'ground') {
    //             event.pairs[i].bodB.fillColor(0, 0, 255);
    //         }
    //     }
    // })
    // listen.endCollision(function(event) {
    //     for (var i = 0; i < event.pairs.length; i++) {
    //         if (event.pairs[i].bodA.label() != 'ground') {
    //             event.pairs[i].bodA.removeFill();
    //         }
    //         if (event.pairs[i].bodB.label() != 'ground') {
    //             event.pairs[i].bodB.removeFill();
    //         }
    //     }
    // })
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

    ground.show();
}

function keyPressed(data) {
    if (data.key == ' ') {
        polys.push(new PPolygon(engine.world, mouseX, mouseY, 5, 15));
    }
}



// var engine = createEngine();
// var render = createRenderer(engine, {debug: true});
// var mConstraint = addMouseConstraint(engine, render);
// var listen = createEventListener(engine, mConstraint);
// var box1 = new Rectangle(engine.world, 200, 0, 30, 30);
// var box2 = new Rectangle(engine.world, 400, 0, 30, 30);
// var box3 = new Rectangle(engine.world, 600, 0, 30, 30);
// var ground = new Boundary(engine.world, render.width/2, render.height, render.width*2, 60);
// listen.startCollision(function(event) {
//     for (var i = 0; i < event.pairs.length; i++) {
//         console.log(event.pairs[i].bodA);
//         console.log(event.pairs[i].bodB);
//     }
// });
// box1.category(1);
// box2.category(2);
// box3.category(3);
// box1.deleteMask();
// box1.addMask(3);
// engine.run();
// render.run();
