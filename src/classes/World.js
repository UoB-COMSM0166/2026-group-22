class World {
  constructor(player) {
    this.player = player;
    this.cameraX = 0;
    
    // Pull dimensions from your CONFIG
    this.width = CONFIG.WORLD.WIDTH;
    this.height = CONFIG.WORLD.CANVAS_HEIGHT;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.backgroundColor = [135, 206, 235];

    this.platforms = [];
    this.setupLevel();
  }

  setupLevel() {
    this.platforms.push(new Platform(300, 250, 150, 20));
    this.platforms.push(new Platform(600, 180, 150, 20));
    this.platforms.push(new Platform(900, 250, 200, 20));
  }

  update() {
    // 1. Update the Player
    this.player.update();

    // Check player-platform collision 
    for (let platform of this.platforms) {
      this.handleSolidCollision(this.player, platform);
    }

    this.player.animate();

    // 2. Handle Camera Logic
    this.cameraX = this.player.x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.width - width);
  }

  handleSolidCollision(player, platform) {
  if (player.intersects(platform)) {
    // 1. Calculate overlaps on all 4 sides
    let overlapLeft   = (player.x + player.w / 2) - (platform.x - platform.w / 2);
    let overlapRight  = (platform.x + platform.w / 2) - (player.x - player.w / 2);
    let overlapTop    = (player.y + player.h / 2) - (platform.y - platform.h / 2);
    let overlapBottom = (platform.y + platform.h / 2) - (player.y - player.h / 2);

    // 2. Find the smallest overlap (that's the side we hit)
    let minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);

    if (minOverlap === overlapTop && player.velY > 0) {
      // Hit Top (Landing)
      player.y = platform.y - platform.h / 2 - player.h / 2;
      player.velY = 0;
      player.jumpCount = 0;
      player.isGrounded = true;
    } 
    else if (minOverlap === overlapBottom && player.velY < 0) {
      // Hit Bottom (Bonk head)
      player.y = platform.y + platform.h / 2 + player.h / 2;
      player.velY = 0;
    } 
    else if (minOverlap === overlapLeft) {
      // Hit Left Side
      player.x = platform.x - platform.w / 2 - player.w / 2;
    } 
    else if (minOverlap === overlapRight) {
      // Hit Right Side
      player.x = platform.x + platform.w / 2 + player.w / 2;
    }
  }
}

  show() {
    background(this.backgroundColor);
    // 3. Apply Camera Transformation
    push();
    translate(-this.cameraX, 0);

    // Draw the environment
    this.drawBackground();

    for (let platform of this.platforms) {
      platform.show();
    }
    
    // Draw the Player
    this.player.show();

    pop();
  }

  drawBackground() {
    // Draw Ground
    fill(34, 139, 34);

    rectMode(CENTER); 
    let groundX = this.width / 2;
    let groundY = height - (this.groundThickness / 2);
    rect(groundX, groundY, this.width, this.groundThickness);
  }
}