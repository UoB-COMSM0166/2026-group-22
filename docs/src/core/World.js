class World {
  constructor(player, doorNumber, bgLayers, worldAssets) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    this.player.worldReference = this;

    const levelData = CONFIG.LEVELS[doorNumber - 1];

    // Pull dimensions from CONFIG
    this.width = levelData.worldWidth;
    this.height = levelData.worldHeight;
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
    this.checkpoints = [];
    this.playerBullets = [];

    this.statsBar = new StatsBar();

    LevelBuilder.build(this, levelData);
  }

  update() {
    this.platforms.forEach(p => p.update());
    this.player.update();
    this.updateProjectiles();
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
      platform.resolve(this.player, this); 
      this.enemies.forEach(e => platform.resolve(e, this));
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
      this.items = this.items.filter(i => i.active || i.shouldRespawn);
    }
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

  updateProjectiles() {
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      this.playerBullets[i].update();
      if (!this.playerBullets[i].active) {
        this.playerBullets.splice(i, 1);
      }
    }
  }

  spawnBullet(x, y, dir) {
    let pb = new Bullet(
      x, y,
      12 * dir, 0, // Velocity
      15, 10,      // Damage/Speed
      color(255, 255, 0)
    );
    this.playerBullets.push(pb);
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
    // this.drawBackground();

    // Draw Checkpoints BEFORE the player
    this.checkpoints.forEach(cp => cp.show());
    this.platforms.forEach(p => p.show());
    this.coins.forEach(c => c.show());
    this.items.forEach(item => item.show());
    this.enemies.forEach(e => e.show());
    this.playerBullets.forEach(b => b.show());

    // Draw the Player
    this.player.show();
    EntityOverlay.draw(this.player);

    pop();

    // 4. Fixed Front Overlay (UI-like layer)
    if (this.bgLayers.front) {
      image(this.bgLayers.front, 0, 0, width, height);
    }

    this.statsBar.draw(this.player, gameState.coins);
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

  drawBackground() {}

  respawnPlayer() {
    const ab = this.player.abilities;
    let currentSkill = ab.currentSkill;

    this.player.hp -= 20;
    this.player.reset(this.spawnX, this.spawnY);

    if (currentSkill === CONFIG.SKILLS.BOW) {
      ab.setSkill(CONFIG.SKILLS.BOW, 999999);
    }
  }

  resetPlayer() {
    // loss one heart
    this.player.hp = 100;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y
    this.player.reset(this.spawnX, this.spawnY);
  }
}