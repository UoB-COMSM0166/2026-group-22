let kirby;
let playerFrames = [];
let stillFrame;
let walkFrame;

async function setup() {
  createCanvas(CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT);
  // We "instantiate" the player here
  stillFrame = await loadImage(CONFIG.PATH.PLAYER_IDLE);
  walkFrame = await loadImage(CONFIG.PATH.PLAYER_MOVE);
  playerFrames = [stillFrame, walkFrame]
  kirby = new Player(playerFrames);
}

function draw() {
  background(135, 206, 235); // Sky Blue
  
  // Draw a simple ground
  fill(34, 139, 34);
  rect(0, height - CONFIG.WORLD.FLOOR_OFFSET, width, CONFIG.WORLD.FLOOR_OFFSET);

  // Run Kirby's methods
  kirby.update();
  kirby.show();
  
  // Instructions UI
  fill(255);
  textSize(16);
  textAlign(CENTER);
  text("Arrows to Move | SPACE to Float", width/2, 30);
}

function keyPressed() {
  if (key === ' ') {
    kirby.float();
  }
}
