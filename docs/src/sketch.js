// src/sketch.js

function preload() {
  // 1. Initialize the scenes so their preload methods can be called
  sceneManager.init(); 
  
  // 2. Delegate preloading to the manager
  sceneManager.preload();
}

function setup() {
  // 3. Delegate canvas creation and scene-specific setup
  sceneManager.setup();
}

function draw() {
  // 4. The manager decides WHICH scene to draw
  sceneManager.draw();
}

function mousePressed() {
  // 5. Pass mouse events to the active scene
  sceneManager.mousePressed();
}

function keyPressed() {
  // 6. Pass key events to the active scene
  sceneManager.keyPressed();
}

function windowResized() {
  // 7. Handle screen resizing (important for the Level vs Menu logic)
  sceneManager.windowResized();
}