// Helper functions

var fullMask = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];

function matterVector(x, y) {
    return Matter.Vector.create(x, y);
}



function createEngine() {
    // Returns a Matter.Engine object

    var en = Matter.Engine.create();                                            // Create the engine
    en.run = function() {                                                       // Alias to Matter.Engine.Run(engine);
        Matter.Engine.run(this);
    }
    en.update = function() {                                                    // Alias to Matter.Engine.Update(engine);
        Matter.Engine.update(this);
    }
    return en;                                                                  // Return the engine
}


function createMouse(elt) {
    // Returns a Matter.Mouse object

    if (elt != undefined) {                                                     // If elt is defined
        if (elt.elt != undefined) {                                                 // If elt is a p5 canvas
            return Matter.Mouse.create(elt.elt);
        } else if (elt.canvas != undefined) {                                       // Else if elt is a renderer
            return Matter.Mouse.create(elt.canvas);
        } else {                                                                    // Else use elt as is
            return Matter.Mouse.create(elt);
        }
    } else {                                                                    // Else use the default (defaut: uses document.body)
        return Matter.Mouse.create()
    }
}


function createMouseConstraint(en, me) {
    // Returns a Mouse Constraint that needs to be added to the world

    if (me != undefined) {                                                      // If (mouse/element) is defined
        if (me.elt != undefined) {                                                  // If me has an elt attribute (ie. is a PCanvas)
            return Matter.MouseConstraint.create(en, {                                  // Return a created Mouse Constraint using the canvas elt
                mouse: Matter.Mouse.create(me.elt),
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
        } else if (me.canvas != undefined) {                                         // Else if me has a width attribute (ie. is a Matter.Renderer)
            return Matter.MouseConstraint.create(en, {                                  // Return a created Mouse Constraint using the canvaas elt
                mouse: Matter.Mouse.create(me.canvas),
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
        } else {                                                                    // Else (ie. is a Matter.Mouse)
            return Matter.MouseConstraint.create(en, {                                  // Return a created Mouse Constraint using the mouse
                mouse: me,
                constraint: {
                    stiffness: 0.2,
                    render: {
                        visible: false
                    }
                }
            });
        }
    } else {                                                                    // Else (me is not defined)
        return Matter.MouseConstraint.create(en, {                                  // Return a default Matter.Mouse (defualt: uses document.body (the <body> tag)
            mouse: Matter.Mouse.create(),
            constraint: {
                        stiffness: 0.2,
                        render: {
                            visible: false
                        }
                    }
        });
    }
}


function addMouseConstraint(en, me) {
    // Automaticlly creates the Mouse Constraint and adds it to the world (engine.world) then returns the Mouse Constraint

    var m = createMouseConstraint(en, me);                                      // Creates the Mouse Constraint
    Matter.World.add(en.world, m);                                              // Adds the Mouse Constraint to the world
    return m;                                                                   // Returns the Mouse Constraint
}

function createRenderer(en, options={}) {
    // Returns a Matter.Render object

    if (options.width == undefined) {
        options.width = 800;
    }
    if (options.height == undefined) {
        options.height = 600;
    }
    if (options.debug == undefined) {
        options.debug = false;
    }

    if (options.debug) {                                                                // If debug is true
        return Matter.Render.create({                                               // Return a Matter.Render object with debug options
            element: options.elt || document.body,                                              // elt is a container (like <div>) to contain the Renderer's Canvas (defualt: uses document.body (the <body> tag)
            engine: en,
            options: {
                width: options.width,
                height: options.height,
                showDebug: true,
                showBounds: true,
                showVelocity: true,
                showCollisions: true,
                showSeparations: true,
                showAngleIndicator: true,
                showShadows: true,
            },
            width: options.width,
            height: options.height,
            run: function() {
                Matter.Render.run(this);
            }
        });
    } else {                                                                    // If debug is false
        return Matter.Render.create({                                               // Return a Matter.Render object
            element: options.elt || document.body,                                              // elt is a container (like <div>) to contain the Renderer's Canvas (defualt: uses document.body (the <body> tag)
            engine: en,
            options: {
                width: options.width,
                height: options.height
            },
            width: options.width,
            height: options.height,
            run: function() {
                Matter.Render.run(this);
            }
        })
    }
}


function createEventListener(engine, mConstraint) {
    return new EventListener(engine, mConstraint);
}


function removeFromArray(arr, elt, n=Infinity) {
    // Checks through the Array (arr) and removes the Element (elt) n Number of times
    if (n < 1) {                                                                // Error checks if n < 1
        console.log('Error: removeFromArray call with less than 0');                // Log the Error
        return false;
    }

    for (var i = 0; i < arr.length; i++) {                                      // Loops through the array
        if (arr[i] == elt) {                                                        // If the array element is the Element elt
            arr.splice(i, 1);                                                           // Remove it from the array
            i--;                                                                        // Decrement the index by 1
            n--;                                                                        // Decrement the number by 1
            if (n < 1) {
                break;                                                                      // Break if n is less than 1
            }
        }
    }
}



function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}



function collisionGroups(n) {
    n = limitInRange(n, 0, 31);
    return 2 ** n;
}


function limitInRange(n, min, max) {
    while (n < min) {
        n += (max - min) + 1;
    }
    while (n > max) {
        n -= (max - min) + 1;
    }
    return n
}



// Classes


class Particle {
    // Base Class
    constructor(world) {
        this.world = world;                                                     // Stores the world as an Attribute
        this.inConstraints = [];
        this.outConstraints = [];
        this.maskArray = fullMask;
    }

    pos(val={}, y) {
        // Returns the Position if no argument is given otherwise sets the Position with the argument(s)

        if (y != undefined) {
            Matter.Body.setPosition(this.body, {x: val, y: y});                     // Set the Position of the body to val(x), y
        } else if (val.x != undefined && val.y != undefined) {
            Matter.Body.setPosition(this.body, val);                                // Set the Position of the body to val.x, val.y
        } else {
            return this.body.position;                                              // Return the Position of the body
        }
    }

    angle(val) {
        // Returns the Angle if no argument is given otherwise sets the Angle with the argument (in radians)

        if (val) {
            Matter.Body.setAngle(this.body, val);                                   // Set the Angle of the body to val
        } else {
            return this.body.angle;                                                 // Return the Angle of the body
        }
    }

    vel(val={}, y) {
        // Returns the Velocity if no argument is given otherwise sets the Velocity with the argument(s)

        if (y != undefined) {
            Matter.Body.setVelocity(this.body, {x: val, y: y});                     // Set the Position of the body to val(x), y
        } else if (val.x != undefined && val.y != undefined) {
            Matter.Body.setVelocity(this.body, val)                                 // Set the Velocity of the Body to val.x, val.y
        } else {
            return this.body.velocity                                               // Return the Velocity of the body
        }
    }

    angVel(val) {
        // Returns the Angular Velocity if no argument is given otherwise sets the Angular Velocity with the argument

        if (val != undefined) {
            Matter.Body.setAngularVelocity(this.body, val);                         // Set the Angular Velocity of the body to val;
        } else {
            return this.body.angularVelocity;                                       // Return the Angular Velocity of the body
        }
    }

    friction(val) {
        // Returns the Friction if no argument is given otherwise sets the Friction with the argument

        if (val != undefined) {
            this.body.friction = val;                                              // Set the Friction of the body to val;
        } else {
            return this.body.friction;                                             // Return the Friction of the body
        }
    }

    frictionAir(val) {
        // Returns the Air Friction if no argument is given otherwise sets the Air Friction with the argument

        if (val != undefined) {
            this.body.frictionAir = val;                                            // Set the Air Friction of the body to val;
        } else {
            return this.body.frictionAir;                                           // Return the Air Friction of the body
        }
    }

    frictionStatic(val) {
        // Returns the Static Friction if no argument is given otherwise sets the Static Friction with the argument

        if (val != undefined) {
            this.body.frictionStatic = val;                                         // Set the Static Friction of the body to val;
        } else {
            return this.body.frictionStatic;                                        // Return the Static Friction of the body
        }
    }

    restitution(val) {
        // Returns the Restitution if no argument is given otherwise sets the Restitution with the argument

        if (val != undefined) {
            this.body.restitution = val;                                            // Set the Restitution of the body to val
        } else {
            return this.body.restitution;                                           // Return the Restitution of the body
        }
    }

    mass(val) {
        // Returns the Mass if no argument is given otherwise sets the Mass with the argument

        if (val != undefined) {
            Matter.Body.setMass(this.body, val);                                    // Set the Mass of the body to val;
        } else {
            return this.body.mass;                                                  // Return the Mass of the body
        }
    }

    density(val) {
        // Returns the Density if no argument is given otherwise sets the Density with the argument

        if (val != undefined) {
            Matter.Body.setDensity(this.body, val);                                 // Set the Density of the body to val;
        } else {
            return this.body.density;                                               // Return the Density of the body
        }
    }

    inertia(val) {
        // Returns the Inertia if no argument is given otherwise sets the Inertia with the argument

        if (val != undefined) {
            Matter.Body.setInertia(this.body, val);                                 // Set the Inertia of the body to val;
        } else {
            return this.body.inertia;                                               // Return the Inertia of the body
        }
    }

    area() {
        // Returns the area of the body

        return this.body.area;
    }

    fixed(val) {
        if (val != undefined) {
            Matter.Body.setStatic(this.body, val);
        } else {
            return this.body.isStatic;
        }
    }

    applyForce(val={}, offset={}) {
        // Apply force of value val and offseted from the center with offset

        if (offset.x == undefined) {
            offset.x = this.pos().x;
        } else {
            offset.x = this.pos().x + offset.x;
        }
        if (offset.y == undefined) {
            offset.y = this.pos().y;
        } else {
            offset.y = this.pos().y + offset.y;
        }
        if (val.x == undefined) {
            val.x = 0;
        } else {
            val.x = val.x / 100;
        }
        if (val.y == undefined) {
            val.y = 0;
        } else {
            val.y = val.y / 100;
        }
        Matter.Body.applyForce(this.body, offset, val);
    }


    remove(arr=undefined, n=Infinity) {
        // Removes the body from the world and optionally remove this object from given arr
        for (var i = 0; i < this.outConstraints.length; i++) {
            this.outConstraints[i].remove();
            removeFromArray(this.outConstraints[i].bodyB.inConstraints, this.outConstraints[i]);
        }
        for (var i = 0; i < this.inConstraints.length; i++) {
            this.inConstraints[i].remove();
            removeFromArray(this.inConstraints[i].bodyA.outConstraints, this.inConstraints[i]);
        }
        Matter.World.remove(this.world, this.body);                                 // Remove the body from the world
        if (arr) {
            removeFromArray(arr, this, n);                                             // If Array arr is given remove the object from the array
        }
    }

    removeConstraint(bodB) {
        for (var i = 0; i < this.outConstraints.length; i++) {
            if (this.outConstraints[i].bodyB == bodB) {
                this.outConstraints[i].removeFromBodies();
                i--;
            }
        }
        for (var i = 0; i < this.inConstraints.length; i++) {
            if (this.inConstraints[i].bodyA == bodB) {
                this.inConstraints[i].removeFromBodies();
                i--;
            }
        }
    }

    offScreen(sWidth, sHeight, options={}) {
        // Return true if object is Off Screen otherwise return false
        // options include which boundaries to check (ub: Upper Boundary, rb: Right Boundary, db: Downward Boundary, lb: Left Boundary)
        // options also includes threshold which is how many pixels to check outside of the screen

        var pos = this.pos();                                                   // Get the position of the body
        options.threshold = options.threshold || 50;                            // Set the threshold to default of 50 pixels
        if (options.ub === undefined) {
            options.ub = true;                                                      // Set the boundaries to default of true
        }
        if (options.rb === undefined) {
            options.rb = true;                                                      // Set the boundaries to default of true
        }
        if (options.db === undefined) {
            options.db = true;                                                      // Set the boundaries to default of true
        }
        if (options.lb === undefined) {
            options.lb = true;                                                      // Set the boundaries to default of true
        }
        if (options.ub) {
            if (pos.y < -options.threshold) {                                           // Checks if the body is Outside the Screen up
                return true;
            }
        }
        if (options.lb) {
            if (pos.x < -options.threshold) {                                           // Checks if the body is Outside the Screen left
                return true;
            }
        }
        if (options.rb) {
            if (pos.x > sWidth + options.threshold) {                                   // Checks if the body is Outside the Screen right
                return true;
            }
        }
        if (options.db) {
            if (pos.y > sHeight + options.threshold) {                                  // Checks if the body is Outside the Screen down
                return true;
            }
        }
        return false;                                                           // Return False (body is not outside boundary)
    }

    isHeld(constraint) {
        // Returns true if this body is being held by the Mouse Constraint

        return (constraint.body == this.body)
    }

    removeOffScreen(sWidth, sHeight, options={}) {
        // Checks if the body is outside the boundary and Automaticlly removes the body from the world
        // options additionally includes an arr to remove from the list

        if (this.offScreen(sWidth, sHeight, options)) {                         // Check if outside the Boundaries
            this.remove(options.arr);                                               // Remove the body from the world and optionally remove this object from the array
            return true;
        } else {                                                                // Return if body was removed or not
            return false;
        }
    }

    constraint(bodB, options={}) {
        return Particle.constraint(this.world, this, bodB, options)
    }

    category(val) {
        if (val != undefined) {
            this.collision.category = collisionGroups(val);
        } else {
            return Math.log2(this.collision.category);
        }
    }

    group(val) {
        if (val != undefined) {
            this.collision.group = val;
        } else {
            return this.collision.group;
        }
    }

    addMask(val) {
        val = limitInRange(val, 0, 31);
        if (!(val in this.maskArray)) {
            this.maskArray.push(val);
            this.constructMask();
        }
    }

    resetMask() {
        // this.collision.mask = 4294967295;
        this.maskArray = fullMask;
        this.constructMask();
    }

    deleteMask() {
        this.maskArray = [0];
        this.constructMask();
    }

    removeMask(val) {
        val = limitInRange(val, 0, 31);
        if (val in this.maskArray) {
            removeFromArray(this.maskArray, val);
            this.constructMask();
        }
    }

    constructMask() {
        var total = '';
        for (var i = 0; i < 32; i++) {
            if (this.maskArray.includes((31 - i))) {
                total = total + '1';
            } else {
                total = total + '0';
            }
        }
        this.collision.mask = parseInt(total, 2);
    }

    canCollide(bodB) {
        return Matter.Detector.canCollide(this.collision, bodB.collision)
    }

    label(val) {
        if (val != undefined) {
            this.body.label = val;
        } else {
            return this.body.label;
        }
    }

    id(val) {
        if (val != undefined) {
            for (var i = 0; i < this.world.bodies.length; i++) {
                if (this.world.bodies[i].id == val) {
                    if (this.world.bodies[i] == this.body) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }
            this.body.id = val;
            return true;
        } else {
            return this.body.id;
        }
    }

    static constraint(world, bodA, bodB, options={}) {
        return new Joint(world, bodA, bodB, options);
    }

    static canCollide(bodA, bodB) {
        return Matter.Detector.canCollide(bodA.collision, bodB.collision);
    }

    static getParticle(world, id) {
        for (var i = 0; i < world.bodies.length; i++) {
            if (world.bodies[i].id == id) {
                return world.bodies[i].particle;
            }
        }
    }

    static getParticles(world, label) {
        var ps = [];
        for (var i = 0; i < world.bodies.length; i++) {
            if (world.bodies[i].label == label) {
                ps.push(world.bodies[i].particle);
            }
        }
        return ps;
    }

    static nextId(world) {
        var index = 1;
        var done = false;
        while (!done) {
            var con = true;
            for (var i = 0; i < world.bodies.length; i++) {
                if (world.bodies[i].id == index) {
                    con = false;
                    break;
                }
            }
            if (con) {
                return index;
            }
            index++;
        }
    }
}


class Joint {
    constructor(world, bodA, bodB, options={}) {
        options.bodyA = bodA.body;
        options.bodyB = bodB.body;
        this.bodyA = bodA;
        this.bodyB = bodB;
        this.world = world;
        this.cons = Matter.Constraint.create(options);
        Matter.World.add(this.world, this.cons);
        this.bodyA.outConstraints.push(this);
        this.bodyB.inConstraints.push(this);
    }

    show() {
        var p1 = this.bodyA.pos();
        var p2 = this.bodyB.pos();
        line(p1.x, p1.y, p2.x, p2.y);
    }

    removeFromBodies(arr, n=Infinity) {
        removeFromArray(this.bodyA.outConstraints, this);
        removeFromArray(this.bodyB.inConstraints, this);
        Matter.World.remove(this.world, this.cons);
        if (arr != undefined) {
            removeFromArray(arr, this, n);
        }
    }

    remove(arr, n=Infinity) {
        Matter.World.remove(this.world, this.cons);
        if (arr != undefined) {
            removeFromArray(arr, this, n);
        }
    }
}


class EventListener {
    constructor(engine, mConstraint) {
        this.engine = engine;
        this.world = this.engine.world;
        this.mConstraint = mConstraint;
    }

    // addListener(name, callBack) {
    //     Matter.Events.on(this.engine, name, callBack);
    // }
    //
    // removeListener(name, callBack) {
    //     Matter.Events.off(this.engine, name, callBack);
    // }

    beforeAdd(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.world, 'beforeAddParticle', callBack);
        } else {
            Matter.Events.off(this.world, 'beforeAddParticle');
        }
    }

    afterAdd(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.world, 'afterAddParticle', callBack);
        } else {
            Matter.Events.off(this.world, 'afterAddParticle');
        }
    }

    startCollision(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.engine, 'collisionStart', function(event) {
                for (var i = 0; i < event.pairs.length; i++) {
                    event.pairs[i].bodA = event.pairs[i].bodyA.particle;
                    event.pairs[i].bodB = event.pairs[i].bodyB.particle;
                    event.pairs[i].collision.bodA = event.pairs[i].collision.bodyA.particle;
                    event.pairs[i].collision.bodB = event.pairs[i].collision.bodyB.particle;
                }
                callBack(event);
            });
        } else {
            Matter.Events.off(this.engine, 'collisionStart');
        }
    }

    activeCollision(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.engine, 'collisionActive', function(event) {
                for (var i = 0; i < event.pairs.length; i++) {
                    event.pairs[i].bodA = event.pairs[i].bodyA.particle;
                    event.pairs[i].bodB = event.pairs[i].bodyB.particle;
                    event.pairs[i].collision.bodA = event.pairs[i].collision.bodyA.particle;
                    event.pairs[i].collision.bodB = event.pairs[i].collision.bodyB.particle;
                }
                callBack(event);
            });
        } else {
            Matter.Events.off(this.engine, 'collisionActive');
        }
    }

    endCollision(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.engine, 'collisionEnd', function(event) {
                for (var i = 0; i < event.pairs.length; i++) {
                    event.pairs[i].bodA = event.pairs[i].bodyA.particle;
                    event.pairs[i].bodB = event.pairs[i].bodyB.particle;
                    event.pairs[i].collision.bodA = event.pairs[i].collision.bodyA.particle;
                    event.pairs[i].collision.bodB = event.pairs[i].collision.bodyB.particle;
                }
                callBack(event);
            });
        } else {
            Matter.Events.off(this.engine, 'collisionEnd');
        }
    }

    mouseDown(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.mConstraint, 'mousedown', callBack);
        } else {
            Matter.Events.off(this.mConstraint, 'mousedown')
        }
    }

    mouseDown(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.mConstraint, 'mouseup', callBack);
        } else {
            Matter.Events.off(this.mConstraint, 'mouseup')
        }
    }

    startDrag(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.mConstraint, 'startdrag', function(event) {
                event.body = event.body.particle;
                callBack(event);
            })
        } else {
            Matter.Events.off(this.mConstraint, 'startdrag');
        }
    }

    endDrag(callBack, b=true) {
        if (b) {
            Matter.Events.on(this.mConstraint, 'enddrag', function(event) {
                event.body = event.body.particle;
                callBack(event);
            })
        } else {
            Matter.Events.off(this.mConstraint, 'enddrag');
        }
    }
}


// Class functions

class Rectangle extends Particle {
    // Creates a Rectangle

    constructor(world, x, y, w, h, options={}) {
        super(world);                                                               // Sets the world
        this.body = Matter.Bodies.rectangle(x, y, w, h, options);                   // Creates the rectangle body
        this.body.particle = this;
        Matter.Events.trigger(this.world, 'beforeAddParticle', {body: this});
        Matter.World.add(this.world, this.body);                                    // Add the body to the world
        Matter.Events.trigger(this.world, 'afterAddParticle', {body: this});
        this.label('Rectangle');
        this.w = w;                                                                 // Set the width
        this.h = h;                                                                 // Set the height
        this.collision = this.body.collisionFilter;
    }
}

class PRectangle extends Rectangle {
    // Creates a rectangle for p5

    constructor(world, x, y, w, h, options={}) {
        super(world, x, y, w, h, options);
        this.label('PRectangle');
        this.fill = undefined;
        this.stroke = undefined;
        this.strokeThickness = 1;
    }

    show(options={}) {
        // Draws the rectangle. Control using p5 commands (eg: fill, stroke, etc.)

        if (options.fill == undefined) {
            options.fill = true;
        }
        if (options.stroke == undefined) {
            options.stroke = true;
        }

        var pos = this.pos();
        push();
        rectMode(CENTER);
        translate(pos.x, pos.y)
        rotate(this.angle());
        if (options.fill && (this.fill != undefined)) {
            fill(this.fill);
        }
        if (options.stroke && (this.stroke != undefined)) {
            stroke(this.stroke);
            strokeWeight(this.strokeThickness);
        }
        rect(0, 0, this.w, this.h);
        pop();
    }

    showConstraints() {
        for (var i = 0; i < this.outConstraints.length; i++) {
            this.outConstraints[i].show();
        }
    }

    fillColor() {
        this.fill = color(...arguments);
    }

    strokeColor() {
        this.stroke = color(...arguments);
    }

    strokeWeight(val) {
        this.strokeThickness = val;
    }

    removeFill() {
        this.fill = undefined;
    }

    removeStroke() {
        this.stroke = undefined;
    }
}

class Circle extends Particle {
    // Creates a Circle

    constructor(world, x, y, r, options={}) {
        super(world);                                                               // Sets the world
        this.body = Matter.Bodies.circle(x, y, r, options={});                      // Creates the circle body
        this.body.particle = this;
        Matter.Events.trigger(this.world, 'beforeAddParticle', {body: this});
        Matter.World.add(this.world, this.body);                                    // Add the body to the world
        Matter.Events.trigger(this.world, 'afterAddParticle', {body: this});
        this.label('Circle');
        this.r = r;                                                                 // Sets the radius
        this.collision = this.body.collisionFilter;
    }
}

class PCircle extends Circle {
    // Creates a circle for p5

    constructor(world, x, y, r, options={}) {
        super(world, x, y, r, options);
        this.label('PCircle');
        this.fill = undefined;
        this.stroke = undefined;
        this.strokeThickness = 1;
    }

    show(options={}) {
        // Draws the Circle. Control using p5 commands (eg: fill, stroke, etc.)

        if (options.fill == undefined) {
            options.fill = true;
        }
        if (options.stroke == undefined) {
            options.stroke = true;
        }

        var pos = this.pos();
        push();
        translate(pos.x, pos.y);
        rotate(this.angle());
        if (options.fill && (this.fill != undefined)) {
            fill(this.fill);
        }
        if (options.stroke && (this.stroke != undefined)) {
            stroke(this.stroke);
            strokeWeight(this.strokeThickness);
        }
        ellipse(0, 0, this.r * 2);
        pop();
    }

    showConstraints() {
        for (var i = 0; i < this.outConstraints.length; i++) {
            this.outConstraints[i].show();
        }
    }


    fillColor() {
        this.fill = color(...arguments);
    }

    strokeColor() {
        this.stroke = color(...arguments);
    }

    strokeWeight(val) {
        this.strokeThickness = val;
    }

    removeFill() {
        this.fill = undefined;
    }

    removeStroke() {
        this.stroke = undefined;
    }
}

class Polygon extends Particle {
    // Creates a polygon

    constructor(world, x, y, s, r, options={}) {
        super(world);                                                               // Sets the world
        this.body = Matter.Bodies.polygon(x, y, s, r, options);                     // Creates the polygon body
        this.body.particle = this;
        Matter.Events.trigger(this.world, 'beforeAddParticle', {body: this});
        Matter.World.add(this.world, this.body);                                    // Add the body to the world
        Matter.Events.trigger(this.world, 'afterAddParticle', {body: this});
        this.label('Polygon');
        this.s = s;                                                                 // Set the number of the sides
        this.r = r;                                                                 // Set the radius
        this.collision = this.body.collisionFilter;
    }
}

class PPolygon extends Polygon {
    // Creates a polygon for p5

    constructor(world, x, y, s, r, options={}) {
        super(world, x, y, s, r, options);
        this.label('PPolygon');
        this.fill = undefined;
        this.stroke = undefined;
        this.strokeThickness = 1;
    }

    show(options={}) {
        // Draws the Polygon. Control using p5 commands (eg: fill, stroke, etc.)

        if (options.fill == undefined) {
            options.fill = true;
        }
        if (options.stroke == undefined) {
            options.stroke = true;
        }

        var pos = this.pos();
        push();
        translate(pos.x, pos.y);
        rotate(this.angle() + PI/this.s);
        if (options.fill && (this.fill != undefined)) {
            fill(this.fill);
        }
        if (options.stroke && (this.stroke != undefined)) {
            stroke(this.stroke);
            strokeWeight(this.strokeThickness);
        }
        polygon(0, 0, this.r, this.s);
        pop();
    }

    showConstraints() {
        for (var i = 0; i < this.outConstraints.length; i++) {
            this.outConstraints[i].show();
        }
    }


    fillColor() {
        this.fill = color(...arguments);
    }

    strokeColor() {
        this.stroke = color(...arguments);
    }

    strokeWeight(val) {
        this.strokeThickness = val;
    }

    removeFill() {
        this.fill = undefined;
    }

    removeStroke() {
        this.stroke = undefined;
    }
}

class Boundary extends Particle {
    // Creates a boundary

    constructor(world, x, y, w, h, options={}) {
        super(world);                                                               // Sets the world
        options.isStatic = true;                                                    // Set the body to static (not move)
        this.body = Matter.Bodies.rectangle(x, y, w, h, options);                   // Creates the boundary body
        this.body.particle = this;
        Matter.Events.trigger(this.world, 'beforeAddParticle', {body: this});
        Matter.World.add(this.world, this.body);                                    // Add the body to the world
        Matter.Events.trigger(this.world, 'afterAddParticle', {body: this});
        this.label('Boundary');
        this.w = w;                                                                 // Set the width
        this.h = h;                                                                 // Set the height
        this.collision = this.body.collisionFilter;
    }
}

class PBoundary extends Boundary {
    // Creates a boundary for p5

    constructor(world, x, y, w, h, options={}) {
        super(world, x, y, w, h, options);
        this.label('PBoundary');
        this.fill = undefined;
        this.stroke = undefined;
        this.strokeThickness = 1;
    }

    show(options={}) {
        // Draws the boundary. Control using p5 commands (eg: fill, stroke, etc.)

        if (options.fill == undefined) {
            options.fill = true;
        }
        if (options.stroke == undefined) {
            options.stroke = true;
        }

        var pos = this.pos();
        push();
        rectMode(CENTER);
        translate(pos.x, pos.y);
        rotate(this.angle());
        if (options.fill && (this.fill != undefined)) {
            fill(this.fill);
        }
        if (options.stroke && (this.stroke != undefined)) {
            stroke(this.stroke);
            strokeWeight(this.strokeThickness);
        }
        rect(0, 0, this.w, this.h);
        pop();
    }

    showConstraints() {
        for (var i = 0; i < this.outConstraints.length; i++) {
            this.outConstraints[i].show();
        }
    }


    fillColor() {
        this.fill = color(...arguments);
    }

    strokeColor() {
        this.stroke = color(...arguments);
    }

    strokeWeight(val) {
        this.strokeThickness = val;
    }

    removeFill() {
        this.fill = undefined;
    }

    removeStroke() {
        this.stroke = undefined;
    }
}

// Module aliases
var Engine = Matter.Engine;
var Render = Matter.Render;
var World = Matter.World;
var Bodies = Matter.Bodies;
