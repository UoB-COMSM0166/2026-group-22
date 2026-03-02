class World {
  constructor(player) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    const levelData = CONFIG.LEVELS["ONE"];
    
    // Pull dimensions from your CONFIG
    this.width = levelData.worldWidth;
    this.height = levelData.worldHeight;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.backgroundColor = [135, 206, 235];

    this.platforms = [];
    this.setupLevel(levelData);
  }

  setupLevel(data) {
    let currentX = data.startX;

    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w/2;
      let centerY = this.height - p.altitude - p.h/2;
      this.platforms.push(new Platform(centerX, centerY, p.w, p.h));
      currentX = centerX + p.w/2;
    }
  }

  update() {
    // 1. Update the Player
    this.player.update();

    // Check player-platform collision 
    for (let platform of this.platforms) {
      this.handleSolidCollision(this.player, platform);
    }

    this.handleWorldBoundaries(this.player);

    this.player.animate();
    this.updateCamera();
  }

  updateCamera() {
    // 2. Handle Camera Logic
    this.cameraX = this.player.x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.width - width);

    // Vertical Camera (New!)
    // This centers the camera on the player's Y position
    this.cameraY = this.player.y - height / 2;
    
    // Constrain it so we don't show the "void" above or below the map
    // 0 is the top of your world, this.height is the bottom
    this.cameraY = constrain(this.cameraY, 0, this.height - height);
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

  handleWorldBoundaries(player) {
    let floorY = this.height - (this.groundThickness + player.h/2);
    let ceilingY = player.h/2;

    // Floor collision
    if (player.y > floorY) {
      player.y = floorY;
      player.velY = 0;
      player.jumpCount = 0;
      player.isGrounded = true;
    }
    
    // Ceiling limit
    if (player.y < ceilingY) {
      player.y = ceilingY;
      player.velY = 0;
    }

    player.x = constrain(player.x, player.w/2, this.width - player.w/2);
  }

  show() {
    background(this.backgroundColor);
    // 3. Apply Camera Transformation
    push();
    translate(-this.cameraX, -this.cameraY);

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
    let groundY = this.height - (this.groundThickness / 2);
    rect(groundX, groundY, this.width, this.groundThickness);
  }
}