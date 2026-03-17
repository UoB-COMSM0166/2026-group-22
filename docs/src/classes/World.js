class World {
  constructor(player, doorNumber, bgLayers) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    const levelData = CONFIG.LEVELS[doorNumber - 1];

    // Pull dimensions from your CONFIG
    this.width = levelData.worldWidth;
    this.height = levelData.worldHeight;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y;
    this.itemTypes = CONFIG.ITEM_TYPES;
    this.backgroundColor = [135, 206, 235];
    this.bgLayers = bgLayers;

    this.enemies = [];
    this.platforms = [];
    this.coins = [];
    this.items = [];
    this.holes = [];
    this.checkpoints = [];
    this.setupLevel(levelData);

    this.statsBar = new StatsBar();
  }

  setupLevel(data) {
    let currentX = data.startX;

    // place platforms
    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w / 2;
      let centerY = this.height - p.altitude - p.h / 2;
      let topY = centerY - p.h / 2; // The top surface

     // 1. Declare the variable first
      let platform;
      if (p.vanish === true) {
        platform = new DisappearingPlatform(centerX, centerY, p.w, p.h);

      // 2. Assign the instance to the variable instead of pushing immediately
      } else if (p.isMoving) {
        platform = new MovingPlatform(
          centerX, centerY, p.w, p.h, p.rangeX, p.rangeY, p.speed
        );
      } else if (p.isVanish) {
        platform = new VanishablePlatform(centerX, centerY, p.w, p.h);
      } else {
        platform = new Platform(centerX, centerY, p.w, p.h);
      }

      platform.removesSkill = p.removesSkill || false;

      // 3. Now that 'platform' is defined, you can add properties to it
      platform.hasBoss = p.hasBoss || false;

      // 4. Push the platform to your array only ONCE
      this.platforms.push(platform);

      // place coins
      if (p.hasCoin) {
        this.coins.push(new Coin(centerX, centerY - 35));
      }

      // place enemy
      if (p.hasEnemy) {
        this.enemies.push(new Enemy(centerX, centerY - 100, 40, 40, 10, 2)); // temporaries
      }

      if (p.hasCheckpoint) {
        this.checkpoints.push(new Checkpoint(centerX + p.w / 4, topY));
      }

      currentX = centerX + p.w / 2;
    }

    // place items
    this.items = data.items.map(itemData => {
      const itemClass = this.itemTypes[itemData.type];

      if (itemClass) {
        return new itemClass(itemData.x, itemData.y);
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

    for (let platform of this.platforms) {
      platform.update();
    }

    // Check player-platform collision 
    for (let platform of this.platforms) {
      if (!platform.active) continue;
      this.handleSolidCollision(this.player, platform);
    }

    for (let enemy of this.enemies) {
      enemy.update(this.platforms);

      // Check for collision with Kirby
      if (this.player.intersects(enemy)) {
        this.handleEnemyCollision(this.player, enemy);
      }

      // Check player-platform collision 
      for (let platform of this.platforms) {
        this.handleSolidCollision(enemy, platform);
      }
    }

    // Check Checkpoints
    for (let cp of this.checkpoints) {
      if (cp.update(this.player)) {
        // The moment Kirby touches a flag, this becomes the new respawn point
        this.spawnX = cp.x;
        // We spawn him slightly above (y - 10) so he doesn't get stuck in the floor
        this.spawnY = cp.y - 10;
      }
    }

    // Update Coins
    for (let coin of this.coins) {
      coin.update(this.player);
    }

    // update items
    for (let item of this.items) {
      item.update(this.player);
    }

    // handle player hp
    if (this.player.hp <= 0) {
      this.resetPlayer();
    }

    this.handleWorldBoundaries(this.player);

    if (frameCount % 60 === 0) {
      this.enemies = this.enemies.filter(e => e.active);
      this.coins = this.coins.filter(c => c.active || c.shouldRespawn);
      this.items = this.items.filter(c => c.active || c.shouldRespawn);
    }

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

  handleSolidCollision(entity, platform) {
    if (platform.active === false) return;

    if (!entity.intersects(platform)) return;

    // 1. Get clean bounds using your new GameObject method
    const p = platform.getBounds();
    const overlap = entity.getOverlap(platform);

    // 2. Find the smallest overlap (that's the side we hit)
    const minOverlap = Math.min(overlap.top, overlap.bottom, overlap.left, overlap.right);

    if (minOverlap === overlap.top && entity.velY > 0) {
      // Hit Top (Landing)
      entity.y = p.top - entity.h / 2;
      entity.velY = 0;

      // Check if it's the player to trigger 'land' (animations/jump reset)
      if (entity instanceof Player) {
        entity.land();

        if (platform instanceof VanishablePlatform) {
          platform.isTouched = true; // This starts the vanishing timer!
        }

        // THE TRIGGER: Check if the platform is an "anti-skill" zone
        if (platform.removesSkill) {
          entity.resetSkills();
        }

        // BOSS TRIGGER CHECK
        if (platform.hasBoss) {
          console.log("[World] Boss platform detected! Transitioning to BossScene...");
          // Switch to the separate scene you created
          sceneManager.switch("boss");
        }
      }

      // handle moving platform
      if (platform.velX || platform.velY) {
        entity.x += platform.velX;
        entity.y += platform.velY;
      }
    }
    else if (minOverlap === overlap.bottom && entity.velY < 0) {
      // Hit Bottom (Bonk head)
      entity.y = p.bottom + entity.h / 2;
      entity.velY = 0;
    }
    else if (minOverlap === overlap.left) {
      // Hit Left Side
      entity.x = p.left - entity.w / 2;
    }
    else if (minOverlap === overlap.right) {
      // Hit Right Side
      entity.x = p.right + entity.w / 2;
    }
  }

  handleEnemyCollision(player, enemy) {
    if (!player.active || !enemy.active) return;
    // Check if Kirby is "Stomping"
    const isStomping = player.velY > 0 && player.y < enemy.y - enemy.h / 2;

    if (isStomping) {
      enemy.die();
      player.velY = -5;
    } else {
      // Kirby got hit: calculate direction (-1 or 1)
      const dir = (player.x < enemy.x) ? -1 : 1;
      player.takeDamage(10, dir); // Delegate to Player
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

    player.x = constrain(player.x, player.w / 2, this.width - player.w / 2);
    player.y = max(player.y, player.h / 2);
  }

  show() {
    background(this.backgroundColor);

    // 2. Parallax Layers (Far and Mid)
    // Draw BEFORE the camera translate to keep them "floating" behind everything
    if (this.bgLayers.far) {
      this.drawParallax(this.bgLayers.far, this.cameraX * 0.05);
    }

    if (this.bgLayers.midBack) {
      this.drawParallax(this.bgLayers.midBack, this.cameraX * 0.15);
    }

    // 3. MID-FRONT LAYER (Getting closer to the action)
    if (this.bgLayers.midFront) {
      this.drawParallax(this.bgLayers.midFront, this.cameraX * 0.45);
    }

    // 3. Apply Camera Transformation
    push();
    translate(-this.cameraX, -this.cameraY);

    // Draw the environment
    this.drawBackground();

    // Draw Checkpoints BEFORE the player
    this.checkpoints.forEach(cp => cp.show());

    this.platforms.forEach(p => p.show());

    this.coins.forEach(c => c.show());

    this.items.forEach(item => item.show());

    this.enemies.forEach(e => e.show());

    // Draw the Player
    this.player.show();

    pop();

    // 4. Fixed Front Overlay (UI-like layer)
    if (this.bgLayers.front) {
      image(this.bgLayers.front, 0, 0, width, height);
    }

    this.statsBar.draw(this.player, shopState.coins);
  }

  // Helper to handle the looping image math
  drawParallax(img, scroll) {
    if (!img || img.width === 0) return;

    let drawW = img.width * (height / img.height);
    let offset = -(scroll % drawW);

    image(img, offset, 0, drawW, height);
    image(img, offset + drawW, 0, drawW, height);
    image(img, offset - drawW, 0, drawW, height);
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
    this.player.hp = 100;
    this.player.reset(this.spawnX, this.spawnY);
  }
}