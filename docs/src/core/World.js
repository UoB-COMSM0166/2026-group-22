class World {
  constructor(player, levelData, levelAssets) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    this.player.worldReference = this;

    this.levelData = levelData;
    this.levelAssets = levelAssets;

    this.width = this.levelData.worldWidth;
    this.height = this.levelData.worldHeight;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y;
    this.itemTypes = CONFIG.ITEM_TYPES;
    this.bgLayers = levelAssets.backgrounds;

    this.enemies = [];
    this.platforms = [];
    this.coins = [];
    this.items = [];
    this.checkpoints = [];
    this.playerBullets = [];

    this.statsBar = new StatsBar();

    LevelBuilder.build(this, this.levelData, this.levelAssets);
  }

  update() {
    this.platforms.forEach(p => p.update());
    this.player.update();
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

    for (let platform of this.platforms) {
      platform.resolve(this.player, this);
      this.enemies.forEach(e => platform.resolve(e, this));
    }

    InteractionManager.handleCombat(this.player, this.enemies, this.playerBullets);
    InteractionManager.handlePuzzles(this.playerBullets, this.platforms);
    InteractionManager.handleWorldLimits(this.player, this);
    InteractionManager.updateProjectiles(this.playerBullets);

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
    this.cameraX = this.player.x - width / 2;
    this.cameraX = constrain(this.cameraX, 0, this.width - width);

    this.cameraY = this.player.y - height / 2;
    this.cameraY = constrain(this.cameraY, 0, this.height - height);
  }

  spawnBullet(x, y, dir) {
    let pb = new Bullet(
      x, y, 12 * dir, 0, 15, 10, color(255, 255, 0)
    );
    this.playerBullets.push(pb);
  }

  spawnArrow(x, y, vx, vy) {
    let arrow = new Arrow(x, y, vx, vy);
    this.playerBullets.push(arrow);
  }

  show() {
    this.drawParallax(this.bgLayers.far, this.cameraX * 0.05);
    this.drawParallax(this.bgLayers.midBack, this.cameraX * 0.15);
    this.drawParallax(this.bgLayers.midFront, this.cameraX * 0.45);

    push();
    translate(-this.cameraX, -this.cameraY);

    this.checkpoints.forEach(cp => cp.show());
    this.platforms.forEach(p => p.show());
    this.coins.forEach(c => c.show());
    this.items.forEach(item => item.show());
    this.enemies.forEach(e => {
      e.show();
      EntityOverlay.draw(e);
    });
    this.playerBullets.forEach(b => b.show());
    this.player.show();
    EntityOverlay.draw(this.player);
    pop();

    image(this.bgLayers.front, 0, 0, width, height);

    this.statsBar.draw(this.player, gameState.coins);
  }

  drawParallax(img, scroll) {
    if (!img || img.width === 0) return;

    let drawW = img.width * (height / img.height);
    let offset = -(scroll % drawW);

    image(img, offset, 0, drawW, height);
    image(img, offset + drawW, 0, drawW, height);
    image(img, offset - drawW, 0, drawW, height);
  }

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
    this.player.hp = 100;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y
    this.player.reset(this.spawnX, this.spawnY);
  }
}