class World {
  constructor(player, doorNumber, bgLayers, worldAssets) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    this.player.worldReference = this;

    const levelData = CONFIG.LEVELS[doorNumber - 1];
    this.player.bubbleMode = !!levelData.bubbleMode;

    // Pull dimensions from your CONFIG
    this.width = levelData.worldWidth;
    this.height = levelData.worldHeight;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y;
    this.itemTypes = CONFIG.ITEM_TYPES;
    this.backgroundColor = [135, 206, 235];
    this.bgLayers = bgLayers;

    this.worldAssets = worldAssets;
    this.platformTile = worldAssets.platformTile;

    this.enemies = [];
    this.platforms = [];
    this.coins = [];
    this.items = [];
    this.holes = [];
    this.checkpoints = [];
    this.setupLevel(levelData);

    this.statsBar = new StatsBar()

    this.playerBullets = [];
  }

  setupLevel(data) {
    if (data.bubbleMode) {
      this.player.bubbleMode = true;
      this.player.activateBubble(3); // Start with 3 bubbles
    } else {
      this.player.bubbleMode = false;
      this.player.resetBubbleState(); // Ensure they are cleared for other levels
    }

    let currentX = data.startX;

    // place platforms
    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w / 2;
      let centerY = this.height - p.altitude - p.h / 2;
      let topY = centerY - p.h / 2; // The top surface

      // 1. Declare the variable first
      let platform;
      if (p.isMoving) {
        platform = new MovingPlatform(
          centerX, centerY, p.w, p.h, this.platformTile, p.rangeX, p.rangeY, p.speed
        );
      } else if (p.isVanish) {
        platform = new VanishablePlatform(centerX, centerY, p.w, p.h, this.platformTile);
      } else if (p.isChainDrop) {
        let targetY = this.height - p.dropAltitude - p.h / 2;
        platform = new ChainPlatform(centerX, centerY, p.w, p.h, this.platformTile, targetY);
      } else {
        platform = new Platform(centerX, centerY, p.w, p.h, this.platformTile);
      }

      platform.removesSkill = p.removesSkill || false;

      // 3. Now that 'platform' is defined, you can add properties to it
      platform.hasBoss = p.hasBoss || false;

      platform.hasSummonerBoss = p.hasSummonerBoss || false;

      // 4. Push the platform to your array only ONCE
      this.platforms.push(platform);

      // place coins
      if (p.hasCoin) {
        this.coins.push(new Coin(centerX, centerY - 35));
      }

      // a series of coins
      if (p.coins && Array.isArray(p.coins)) {
        for (let offsetX of p.coins) {
          this.coins.push(new Coin(centerX + offsetX, centerY - 35));
        }
      }

      // place enemy
      if (p.hasEnemy) {
        this.enemies.push(new Enemy(centerX, centerY - 100, 40, 40, 50, 2)); // temporaries
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
    this.handlePlayerShooting(); // Check for 'J' key
    this.updateProjectiles();
    this.platforms.forEach(p => p.update());
    this.enemies.forEach(e => e.update(this.platforms));
    this.coins.forEach(c => c.update(this.player));
    this.items.forEach(item => item.update(this.player));

    // Check Checkpoints
    for (let cp of this.checkpoints) {
      if (cp.update(this.player)) {
        this.spawnX = cp.x;
        this.spawnY = cp.y - 10;
      }
    }

    // 2. Resolve Interactions via InteractionManager
    for (let platform of this.platforms) {
      InteractionManager.resolveSolid(this.player, platform, this);
      for (let enemy of this.enemies) {
        InteractionManager.resolveSolid(enemy, platform, this);
      }
    }

    InteractionManager.handleCombat(this.player, this.enemies, this.playerBullets);
    InteractionManager.handlePuzzles(this.playerBullets, this.platforms);
    InteractionManager.handleWorldLimits(this.player, this);

    // handle player hp
    if (this.player.hp <= 0) this.resetPlayer();

    if (frameCount % 60 === 0) {
      this.enemies = this.enemies.filter(e => e.active);
      this.playerBullets = this.playerBullets.filter(b => b.active);
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

  handlePlayerShooting() {
    if (keyIsDown(74) && this.player.currentCooldown <= 0) {
      let dir = this.player.isFacingLeft ? -1 : 1;

      let pb = new Bullet(
        this.player.x + (20 * dir),
        this.player.y,
        12 * dir, 0,
        15, 10,
        color(255, 255, 0)
      );

      this.playerBullets.push(pb);
      this.player.currentCooldown = this.player.shootCooldown;
    }
  }

  updateProjectiles() {
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      this.playerBullets[i].update();
      if (!this.playerBullets[i].active) {
        this.playerBullets.splice(i, 1);
      }
    }
  }

  spawnArrow(x, y, vx, vy) {
    let arrow = new Arrow(x, y, vx, vy);
    this.playerBullets.push(arrow);
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

    this.playerBullets.forEach(b => b.show());

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

  respawnPlayer() {
    let currentSkill = this.player.currentSkill;

    this.player.hp -= 20;
    this.player.reset(this.spawnX, this.spawnY);

    if (currentSkill === CONFIG.SKILLS.BOW) {
      this.player.hasSkill = true;
      this.player.currentSkill = CONFIG.SKILLS.BOW;
    }
  }

  resetPlayer() {
    // loss one heart
    this.player.hp = 100;
    this.player.reset(CONFIG.PLAYER.START_X, CONFIG.PLAYER.START_Y);
  }
}