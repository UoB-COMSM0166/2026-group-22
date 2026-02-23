let kirby;
let playerFrames = [];
let cameraX = 0;

async function setup() {
  createCanvas(CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT);
  // We "instantiate" the player here
  const stillFrame = await loadImage(CONFIG.PATH.PLAYER_IDLE);
  const walkFrame = await loadImage(CONFIG.PATH.PLAYER_MOVE);
  playerFrames = [stillFrame, walkFrame]
  kirby = new Player(playerFrames);
}

function draw() {
  background(135, 206, 235); // Sky Blue

  cameraX = kirby.x - width / 2;
  cameraX = constrain(cameraX, 0, CONFIG.WORLD.WIDTH - width);

  push(); 
  translate(-cameraX, 0);

  // Draw a simple ground
  fill(34, 139, 34);
  rect(0, height - CONFIG.WORLD.FLOOR_OFFSET, CONFIG.WORLD.WIDTH, CONFIG.WORLD.FLOOR_OFFSET);

  // Run Kirby's methods
  kirby.update();
  kirby.show();

  pop();
  
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
