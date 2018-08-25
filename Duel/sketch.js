// Author: shyno20017
// GitHub: https: //github.com/shyno20017/
// Libraries:
// - p5.js: v0 .5 .16
// - p5.dom.js: v0 .3 .4
// - p5.sound.js: v0 .3 .6
// - p5.collide.js: v0 .1 created by http: //benmoren.com
// other files:
// - key.js created by https://github.com/Cleod9


// This is heavily inspired by Duel created by FAL
// https://www.openprocessing.org/sketch/453716
// https://www.fal-works.com/




const frictionConstant = 0.1;
const characterSize = 40;

const canvasSize = 900;
let canvas;

let p1, p2;
let manager;

function setup() {
  canvas = createCanvas(canvasSize, canvasSize);
  resetBackground();
  manager = new GameManager();

  manager.newGame();
}

function draw() {
  resetBackground();
  manager.update();
  manager.display();
}