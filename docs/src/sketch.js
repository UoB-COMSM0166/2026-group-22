let bootImg

function preload() {
  bootImg = loadImage("./assets/scenes/title.png")
}

function setup() {
  sceneManager.initLoader(bootImg);

  assets.preload();
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