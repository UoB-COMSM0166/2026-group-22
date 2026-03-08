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
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y;
    this.collectableTypes = CONFIG.COLLECTABLE_TYPES;
    this.backgroundColor = [135, 206, 235];

    this.platforms = [];
    this.coins = [];
    this.collectables = [];
    this.holes = [];
    this.checkpoints = [];
    this.setupLevel(levelData);
  }

  setupLevel(data) {
    let currentX = data.startX;

    // place platforms
    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w/2;
      let centerY = this.height - p.altitude - p.h/2;
      let topY = centerY - p.h/2; // The top surface

      if (p.isMoving) {
        this.platforms.push(
          new MovingPlatform(centerX, centerY, p.w, p.h, p.rangeX, p.rangeY, p.speed)
        );
      } else {
        this.platforms.push(new Platform(centerX, centerY, p.w, p.h));
      }
      
      this.checkpoints.push(new Checkpoint(centerX + p.w/4, topY));
      currentX = centerX + p.w/2;
    }

    // place coins
    this.coins = data.coins.map(c => new Coin(c.x, c.y));

    // place collectables
    this.collectables = data.collectables.map(collectableData => {
      const collectableClass = this.collectableTypes[collectableData.type];

      if (collectableClass) {
        return new collectableClass(collectableData.x, collectableData.y);
      }

      console.warn(`Type ${itemData.type} not found in ITEM_TYPES`);
      return null;
    }).filter(i => i); // Remove nulls

    // place holes
    this.holes = data.holes.map(h => new Hole(h.startX, h.endX));
  }

  update() {
    // 1. Update the Player
    this.player.update();

    // Check Checkpoints
    for (let cp of this.checkpoints) {
      if (cp.update(this.player)) {
        // The moment Kirby touches a flag, this becomes the new respawn point
        this.spawnX = cp.x;
        // We spawn him slightly above (y - 10) so he doesn't get stuck in the floor
        this.spawnY = cp.y - 10; 
      }
    }

    // Check player-platform collision 
    for (let platform of this.platforms) {
      platform.update();
      this.handleSolidCollision(this.player, platform);
    }

    // Update Coins
    for (let coin of this.coins) {
      coin.update(this.player);
    }

    // update collectables
    for (let coll of this.collectables) {
      coll.update(this.player);
    }

    // Clean up: Filter out inactive coins every few frames (Performance!)
    if (frameCount % 60 === 0) {
      this.coins = this.coins.filter(c => c.active);
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
    if (!player.intersects(platform)) return;

    // 1. Get clean bounds using your new GameObject method
    const p = platform.getBounds();
    const overlap = player.getOverlap(platform);

    // 2. Find the smallest overlap (that's the side we hit)
    const minOverlap = Math.min(overlap.top, overlap.bottom, overlap.left, overlap.right);

    if (minOverlap === overlap.top && player.velY > 0) {
      // Hit Top (Landing)
      player.y = p.top - player.h / 2;
      player.land();
      // handle moving platform
      if (platform.velX || platform.velY) {
        player.x += platform.velX;
        player.y += platform.velY;
      }
    } 
    else if (minOverlap === overlap.bottom && player.velY < 0) {
      // Hit Bottom (Bonk head)
      player.y = p.bottom + player.h / 2;
      player.velY = 0;
    } 
    else if (minOverlap === overlap.left) {
      // Hit Left Side
      player.x = p.left - player.w / 2;
    } 
    else if (minOverlap === overlap.right) {
      // Hit Right Side
      player.x = p.right + player.w / 2;
    }
  }

  handleWorldBoundaries(player) {
    const p = player.getBounds();
    const floorY = this.height - this.groundThickness;

    // 1. Check if the player is currently over ANY hole
    let overHole = this.holes.some(h => h.contains(p.left) && h.contains(p.right));

    // Floor collision
    if (!overHole && p.bottom > floorY) {
      player.y = floorY - player.h / 2;
      player.land();
    }

    // 3. If he falls off the bottom of the world, reset him (or kill him)
    if (p.top > this.height) {
      this.resetPlayer(); 
    }

    player.x = constrain(player.x, player.w/2, this.width - player.w/2);
    player.y = max(player.y, player.h/2);
  }

  show() {
    background(this.backgroundColor);
    // 3. Apply Camera Transformation
    push();
    translate(-this.cameraX, -this.cameraY);

    // Draw the environment
    this.drawBackground();

    // Draw Checkpoints BEFORE the player
    for (let cp of this.checkpoints) {
      cp.show();
    }

    for (let platform of this.platforms) {
      platform.show();
    }

    for (let coin of this.coins) {
      coin.show();
    }

    for (let coll of this.collectables) {
      coll.show();
    }
    
    // Draw the Player
    this.player.show();

    pop();
  }

  drawBackground() {
    // Draw Ground
    fill(34, 139, 34);

    rectMode(CORNER); 
    // let groundX = this.width / 2;
    let currentX = 0;
    let groundY = this.height - this.groundThickness;

    // Draw ground segments between holes
    for (let hole of this.holes) {
      // Draw ground from current position to the start of the hole
      rect(currentX, groundY, hole.left - currentX, this.groundThickness);
      currentX = hole.right; // Skip to the other side of the hole
    }
    
    rect(currentX, groundY, this.width - currentX, this.groundThickness);
  }

  resetPlayer() {
    this.player.reset(this.spawnX, this.spawnY);
  }
}