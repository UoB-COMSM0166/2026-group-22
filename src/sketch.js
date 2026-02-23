let kirby;
let gameWorld;

async function setup() {
  createCanvas(CONFIG.WORLD.CANVAS_WIDTH, CONFIG.WORLD.CANVAS_HEIGHT);
  // We "instantiate" the player here
  const stillFrame = await loadImage(CONFIG.PATH.PLAYER_IDLE);
  const walkFrame = await loadImage(CONFIG.PATH.PLAYER_MOVE);
  const playerFrames = [stillFrame, walkFrame];

  kirby = new Player(playerFrames);
  gameWorld = new World(kirby);
}

function draw() {
  gameWorld.update();
  gameWorld.show();

  drawUI();
}

function drawUI() {
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
