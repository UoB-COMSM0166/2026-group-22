function preload() {
  assets.preload();
  sceneManager.init();
  sceneManager.preload();
}

function setup() {
  sceneManager.setup();
  sceneManager.start();
}

function draw() {
  sceneManager.draw();
}

function mousePressed() {
  sceneManager.mousePressed();
}

function keyPressed() {
  sceneManager.keyPressed();
}

function windowResized() {
  sceneManager.windowResized();
}