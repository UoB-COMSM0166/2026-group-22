let kirby;
let playerFrames = [];
let stillFrame;
let walkFrame;

async function setup() {
  createCanvas(600, 400);
  // We "instantiate" the player here
  stillFrame = await loadImage('../assets/kirby_idle.png');
  walkFrame = await loadImage('../assets/kirby_move.png');
  playerFrames = [stillFrame, walkFrame]
  kirby = new Player(playerFrames);
}

function draw() {
  background(135, 206, 235); // Sky Blue
  
  // Draw a simple ground
  fill(34, 139, 34);
  rect(0, height - 20, width, 20);

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
