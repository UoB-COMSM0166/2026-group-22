class World {
  constructor(player) {
    this.player = player;
    this.cameraX = 0;
    
    // Pull dimensions from your CONFIG
    this.width = CONFIG.WORLD.WIDTH;
    this.height = CONFIG.WORLD.CANVAS_HEIGHT;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.backgroundColor = [135, 206, 235];
  }

  update() {
    // 1. Update the Player
    this.player.update();

    // 2. Handle Camera Logic
    this.cameraX = this.player.x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.width - width);
  }

  show() {
    background(this.backgroundColor);
    // 3. Apply Camera Transformation
    push();
    translate(-this.cameraX, 0);

    // Draw the environment
    this.drawBackground();
    
    // Draw the Player
    this.player.show();

    pop();
  }

  drawBackground() {
    // Draw Ground
    fill(34, 139, 34);
    rect(0, height - this.groundThickness, this.width, this.groundThickness);
    
    // You can add trees, platforms, or mirror-shards here later!
  }
}