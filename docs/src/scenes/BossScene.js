// src/scenes/BossScene.js
class BossScene extends GameplayScene {
  constructor() {
    super();
    this.player = null; // Reference to the existing player
    this.boss = null;
    this.world = null;
    this.bossBullets = [];
    this.statsBar = new StatsBar();
  }

  onEnter(data) {
    const { bossType, bgLayers, worldAssets } = data;

    this.player = sceneManager.player;
    this.currentBossType = bossType;
    this.bgLayers = bgLayers;
    this.worldAssets = worldAssets;
    // 1. Tell the global manager this is the active scene
    // This allows the Boss/Minions to find playerBullets
    sceneManager.currentScene = this;

    const arenaLevelIndex = 5;
    this.world = new World(this.player, arenaLevelIndex, this.bgLayers, this.worldAssets);

    const bossMap = {
      'summoner': SummonerBoss,
      'regular': Boss,
    };

    const bossSprites = {
      idle: assets.getImg('boss_idle'),   // Make sure these keys exist in AssetManager
      attack: assets.getImg('boss_shoot')
    };

    // 1. Dynamic Boss Creation
    const startX = this.world.width - 120;
    const startY = this.world.height - 300;

    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(startX, startY, bossSprites);

    this.applyCanvasMode();

    // 2. Setup Player for flight mode
    // We use the global player instance but reset their position
    this.player.x = 100;
    this.player.y = this.CANVAS_H - 150;
    this.player.velX = 0;
    this.player.velY = 0;
    this.player.hp = 100;               // Restore HP to stop the reset loop
    this.player.active = true;           // Reactivate the entity
    this.player.invincibilityTimer = 0; // Stop the flashing immediately

    this.bossBullets = [];
    this.projectiles = [];
    this.platforms = [];

    if (bossType === 'summoner') {
      this.isPlatformerMode = true;
      this.player.hasSkill = true;
      this.player.currentSkill = CONFIG.SKILLS.BOW; 
      
      this.player.x = 150;
      this.player.y = height / 2; 

      // 【爽点1】：锁链增加到 8 个，排布更密集！宽度稍微调窄一点防拥挤
      let pCount = 8;
      let spacing = width / (pCount + 1);
      for(let i = 1; i <= pCount; i++) {
        this.platforms.push(new ChainPlatform(i * spacing, 80, 80, 30, height + 200));
      }

    } else {
      this.isPlatformerMode = false;
      this.player.resetSkills(); 
      this.player.x = 100;
      this.player.y = height / 2; 
      this.boss.x = width - 120; 
    }
  }

  update() {
    if (!this.player || !this.world) return;

    if (this.player.hp <= 0) {
      this.resetScene();
      return; 
    }

    this.world.update();

    if (this.isPlatformerMode) {
      // 零重力飞行
      let oldY = this.player.y;
      this.player.update(); 
      this.player.y = oldY; 
      this.player.velY = 0; 

      this.handlePlayerMovement();

      // 更新锁链平台 & 检测是否砸中 Boss
      for (let i = 0; i < this.platforms.length; i++) {
        let p = this.platforms[i];
        p.update();
        
        if (p.state === 'DROPPING' && !p.hasHitBoss && this.boss.intersects(p)) {
          // 【爽点2】：砸中扣 100 血，总血量 300，精准三发入魂！
          this.boss.takeDamage(100); 
          p.hasHitBoss = true; 
          console.log("天降正义！砸中 Boss！");
        }

        // 【爽点3】：无限弹药！掉出屏幕的锁链会在天花板自动重生！
        if (p.y > height + 100) {
          this.platforms[i] = new ChainPlatform(p.x, 80, 80, 30, height + 200);
        }
      }

      // 更新弓箭碰撞
      for (let i = this.projectiles.length - 1; i >= 0; i--) {
        let arrow = this.projectiles[i];
        arrow.update();

        // 弓箭射断锁链
        for (let p of this.platforms) {
          if (p.state === 'IDLE' && arrow.intersects(p)) {
            p.triggerBreak();
            arrow.active = false;
          }
        }
        
        if (arrow.active && arrow.intersects(this.boss)) {
          this.boss.takeDamage(15);
          arrow.active = false;
        }

        if (!arrow.active || arrow.y > height) {
          this.projectiles.splice(i, 1);
        }
      }

    } else {
      this.handlePlayerMovement();
      this.handlePlayerShooting();
    }
 
    let attack = this.boss.update();
    if (attack) this.bossBullets.push(attack);

    for (let platform of this.world.platforms) {
      InteractionManager.resolveSolid(this.boss, platform, this.world);
    }

    InteractionManager.updateProjectiles(this.bossBullets);
    if (this.boss.minionBullets) {
      InteractionManager.updateProjectiles(this.boss.minionBullets);
    }

    this.checkCollisions();
 
    if (this.boss.hp <= 0) {
      setTimeout(() => sceneManager.switch("camp"), 2000);
    }
  }

  checkCollisions() {
    InteractionManager.handleCombat(this.player, [this.boss], this.world.playerBullets);

    InteractionManager.resolveHitGroup(this.bossBullets, this.player, (bullet, p) => {
      // Calculate knockback direction
      const dir = (p.x < bullet.x) ? -1 : 1;
      p.takeDamage(bullet.damage, dir);
    });

    // 4. REUSE: Minion interactions
    if (this.boss.minions) {
      // Handles playerBullets hitting minions AND minions touching player
      InteractionManager.handleCombat(this.player, this.boss.minions, this.world.playerBullets);

      // Handles minion bullets hitting player
      InteractionManager.resolveHitGroup(this.boss.minionBullets, this.player, (bullet, p) => {
        const dir = (p.x < bullet.x) ? -1 : 1;
        p.takeDamage(bullet.damage, dir);
      });
    }
  }

  draw() {
    this.update();
    this.world.show();

    push();
    translate(-this.world.cameraX, -this.world.cameraY);
    this.boss.show();
    for (let b of this.bossBullets) b.show();
    pop();

    this.drawUI();
  }

  drawUI() {
    this.statsBar.drawBossHealth(this.boss);
    this.statsBar.draw(this.player, gameState.coins, false);
  }

  keyPressed() {
     if (keyCode === ESCAPE) {
      this.playerBullets = [];
       this.bossBullets = [];
      sceneManager.switch("camp");
    }

    if (this.player) {
      this.player.handleKeyPress();
    }
  }

  resetScene() {
    this.onEnter({
      bossType: this.currentBossType,
      bgLayers: this.bgLayers,
      worldAssets: this.worldAssets
    });

    // Optional: If you used an 'isVictoryTriggered' flag, reset it too
    this.isVictoryTriggered = false;
  }
}