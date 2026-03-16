class World {
  constructor(player, doorNumber) {
    this.player = player;
    this.cameraX = 0;
    this.cameraY = 0;

    const levelData = CONFIG.LEVELS[doorNumber - 1];
    this.width = levelData.worldWidth;
    this.height = levelData.worldHeight;
    this.groundThickness = CONFIG.WORLD.FLOOR_OFFSET;
    this.spawnX = CONFIG.PLAYER.START_X;
    this.spawnY = CONFIG.PLAYER.START_Y;
    this.collectableTypes = CONFIG.COLLECTABLE_TYPES;
    this.backgroundColor = [135, 206, 235];

    this.enemies = [];
    this.platforms = [];
    this.coins = [];
    this.collectables = [];
    this.holes = [];
    this.checkpoints = [];
    this.bosses = [];      
    this.bossBullets = [];
    this.playerBullets = []; 
    this.isBossBattle = false;

    this.setupLevel(levelData);
  }

  setupLevel(data) {
    let currentX = data.startX;
    for (let p of data.platforms) {
      let centerX = currentX + p.gap + p.w/2;
      let centerY = this.height - p.altitude - p.h/2;
      let topY = centerY - p.h/2;
      if (p.isMoving) {
        this.platforms.push(new MovingPlatform(centerX, centerY, p.w, p.h, p.rangeX, p.rangeY, p.speed));
      } else {
        this.platforms.push(new Platform(centerX, centerY, p.w, p.h));
      }
      if (p.hasBoss) this.bosses.push(new Boss(centerX, centerY - 200)); 
      if (p.hasCoin) this.coins.push(new Coin(centerX, centerY - 35));
      if (p.hasEnemy) this.enemies.push(new Enemy(centerX, centerY - 100, 40, 40, 10, 2));
      this.checkpoints.push(new Checkpoint(centerX + p.w/4, topY));
      currentX = centerX + p.w/2;
    }
    this.collectables = data.collectables.map(d => {
      const cls = this.collectableTypes[d.type];
      return cls ? new cls(d.x, d.y) : null;
    }).filter(i => i);
    this.holes = data.holes.map(h => new Hole(h.startX, h.endX));
  }

startBossBattle() {
    this.isBossBattle = true;
    
    // --- 新增：删除最后两个重生点 ---
    if (this.checkpoints.length > 2) {
      this.checkpoints = this.checkpoints.slice(0, -2);
    }

    // 1. 摄像机固定在关卡最后一段
    this.cameraX = this.width - width; 
    this.cameraY = this.height - height;

    // 2. 玩家出现在当前屏幕左侧
    this.player.x = this.cameraX + 150; 
    this.player.y = this.height / 2;
    this.player.velX = 0; // 进入时重置速度，防止滑行
    this.player.velY = 0;

    // 3. 初始放置一下 Boss
    if (this.bosses[0]) {
        this.bosses[0].x = this.cameraX + width - 150;
        this.bosses[0].y = this.height / 2;
        this.bosses[0].hp = this.bosses[0].maxHp; // 确保 Boss 是满血
    }
}

  updateBossBattle() {
    // 1. 玩家自由飞行操作
    let flySpeed = 6;
    if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.player.y -= flySpeed;
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.player.y += flySpeed;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.player.x -= flySpeed;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.player.x += flySpeed;

    // 2. 限制玩家移动范围（仅限当前屏幕内）
    this.player.x = constrain(this.player.x, this.cameraX + 40, this.width - 40);
    this.player.y = constrain(this.player.y, 40, this.height - 40);

    // 3. 玩家发射星星 (向右射击)
    if (keyIsDown(74) && frameCount % 10 === 0) {
      this.playerBullets.push({ x: this.player.x + 30, y: this.player.y, speed: 12 });
    }

    // 4. 更新子弹与 Boss 判定
    let boss = this.bosses[0];
    if (boss && boss.hp > 0) {
    boss.x = this.cameraX + width - 120;
      let bData = boss.update();
      if (bData) {
        bData.speed = -8; // Boss子弹向左
        this.bossBullets.push(bData);
      }
    }

    // 处理玩家子弹
    for (let i = this.playerBullets.length - 1; i >= 0; i--) {
      let b = this.playerBullets[i];
      b.x += b.speed;
      if (boss && boss.hp > 0 && dist(b.x, b.y, boss.x, boss.y) < 70) {
        boss.takeDamage(10);
        this.playerBullets.splice(i, 1);
        continue;
      }
      if (b.x > this.cameraX + width) {
    this.playerBullets.splice(i, 1);
}
    }

    // 处理 Boss 子弹碰撞
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      b.x += b.speed;
      if (dist(b.x, b.y, this.player.x, this.player.y) < 30) {
        this.player.hp -= 5;
        this.bossBullets.splice(i, 1);
      }
      if (b.x < this.cameraX) this.bossBullets.splice(i, 1);
    }
  }

  update() {
    if (this.isBossBattle) {
      this.updateBossBattle();
    } else {
      // --- 正常模式 ---
      this.player.update();
      for (let p of this.platforms) p.update();
      for (let p of this.platforms) this.handleSolidCollision(this.player, p);
      
      // 触发 Boss 战 (地图宽度 12000，高台触发点)
      if (this.player.x > this.width - 2500) { 
        this.startBossBattle();
      }

      for (let e of this.enemies) {
        e.update(this.platforms);
        if (this.player.intersects(e)) this.handleEnemyCollision(this.player, e);
        for (let p of this.platforms) this.handleSolidCollision(e, p);
      }

      for (let cp of this.checkpoints) {
        if (cp.update(this.player)) { 
          this.spawnX = cp.x; 
          this.spawnY = cp.y - 10; 
        }
      }

      // --- 金币收集逻辑 ---
      for (let coin of this.coins) {
        // 如果金币原本没被吃掉，现在被吃掉了
        if (coin.active && this.player.intersects(coin)) {
          coin.active = false; // 金币消失
          if (this.player.coins !== undefined) {
            this.player.coins += 1; // 玩家金币数加1
          } else {
            this.player.score = (this.player.score || 0) + 1; // 兼容 score 命名
          }
        }
        coin.update(this.player);
      }

      for (let coll of this.collectables) coll.update(this.player);
      
      this.handleWorldBoundaries(this.player);
      
      if (this.player.hp <= 0) {
        this.resetPlayer();
      }

      if (frameCount % 60 === 0) {
        this.enemies = this.enemies.filter(e => e.active);
        this.coins = this.coins.filter(c => c.active);
        this.collectables = this.collectables.filter(c => c.active);
      }

      this.player.animate();
      this.updateCamera();
    }
  }

  updateCamera() {
    this.cameraX = constrain(this.player.x - width / 2, 0, this.width - width);
    this.cameraY = constrain(this.player.y - height / 2, 0, this.height - height);
  }

  // --- 关键修正：确保背景颜色填满，消除偏移感 ---
show() {
    // 基础背景颜色
    background(20, 20, 60); 

    push();
    translate(-this.cameraX, -this.cameraY);
    
    if (this.isBossBattle) {
      // --- Boss 模式：只显示战斗相关角色 ---
      if (this.bosses[0]) this.bosses[0].show();
      this.player.show();
      
      // 玩家子弹 (星星)
      fill(255, 255, 0);
      for(let b of this.playerBullets) ellipse(b.x, b.y, 15, 15);
      
      // Boss 子弹 (火球/橘红弹)
      fill(255, 100, 0);
      for(let b of this.bossBullets) ellipse(b.x, b.y, 25, 25);
    } else {
      // --- 常规模式 ---
      background(this.backgroundColor);
      this.drawBackground();
      this.checkpoints.forEach(cp => cp.show());
      this.platforms.forEach(p => p.show());
      this.coins.forEach(c => c.show());
      this.collectables.forEach(c => c.show());
      this.enemies.forEach(e => e.show());
      this.player.show();
    }
    pop();

    // --- UI 控制逻辑 ---
    if (this.isBossBattle) {
      // 只有进入 Boss 战才显示顶部 Boss 血条和底部玩家大血条
      this.drawBossBattleUI();
    } else {
      // 只有在普通关卡才显示左上角的小血条和金币计数
      this.drawGameUI(); 
    }
  }
  drawBossBattleUI() {
    let boss = this.bosses[0];
    // 1. 顶部红色 Boss 血条
    if (boss) {
      fill(40, 200);
      rect(width/2 - 200, 25, 400, 15, 5); // 底槽
      fill(255, 0, 50);
      let bossHpW = map(max(0, boss.hp), 0, boss.maxHp, 0, 400);
      rect(width/2 - 200, 25, bossHpW, 15, 5); // 红色血条
    }

    // 2. 底部绿色玩家血条 (Boss 战专用)
    fill(40, 200);
    rect(width/2 - 100, height - 30, 200, 12, 3); // 底槽
    fill(0, 255, 100);
    let playerHpW = map(max(0, this.player.hp), 0, 100, 0, 200);
    rect(width/2 - 100, height - 30, playerHpW, 12, 3); // 绿色血条
    
    fill(255);
    textSize(12);
    textAlign(CENTER);
    text("KIRBY HP", width/2, height - 35);
  }

  // 这里的碰撞处理保持你原来的逻辑
  handleSolidCollision(entity, platform) {
    if (!entity.intersects(platform)) return;
    const p = platform.getBounds();
    const overlap = entity.getOverlap(platform);
    const minOverlap = Math.min(overlap.top, overlap.bottom, overlap.left, overlap.right);
    if (minOverlap === overlap.top && entity.velY > 0) {
      entity.y = p.top - entity.h / 2; entity.velY = 0;
      if (entity instanceof Player) entity.land();
      if (platform.velX || platform.velY) { entity.x += platform.velX; entity.y += platform.velY; }
    } else if (minOverlap === overlap.bottom && entity.velY < 0) {
      entity.y = p.bottom + entity.h / 2; entity.velY = 0;
    } else if (minOverlap === overlap.left) entity.x = p.left - entity.w / 2;
    else if (minOverlap === overlap.right) entity.x = p.right + entity.w / 2;
  }

handleEnemyCollision(player, enemy) {
    if (!player.active || !enemy.active) return;
    
    if (player.velY > 0 && player.y < enemy.y - enemy.h / 2) {
      enemy.active = false;
      player.velY = -5;
    } else {
      player.hp -= 1; 
      player.velX = (player.x < enemy.x) ? -5 : 5; // 击退
      player.velY = -3;
    }
  }
  handleWorldBoundaries(player) {
    const p = player.getBounds();
    const floorY = this.height - this.groundThickness;
    let overHole = this.holes.some(h => h.contains(p.left) && h.contains(p.right));
    if (!overHole && p.bottom > floorY) { player.y = floorY - player.h / 2; player.land(); }
    if (p.top > this.height) this.resetPlayer();
    player.x = constrain(player.x, player.w/2, this.width - player.w/2);
    player.y = max(player.y, player.h/2);
  }

  drawBackground() {
    fill(34, 139, 34);
    rectMode(CORNER);
    let currentX = 0;
    let groundY = this.height - this.groundThickness;
    for (let h of this.holes) {
      rect(currentX, groundY, h.left - currentX, this.groundThickness);
      currentX = h.right;
    }
    rect(currentX, groundY, this.width - currentX, this.groundThickness);
  }

  resetPlayer() {
    this.player.reset(this.spawnX, this.spawnY);
    this.player.hp = 100; // 重置血量
  }
drawGameUI() {
    // 1. 左上角玩家血条
    fill(0, 0, 0, 100); 
    rect(20, 20, 150, 15, 5); 
    
    let hpColor = color(0, 255, 100);
    if (this.player.hp < 30) hpColor = color(255, 50, 50);
    fill(hpColor);
    let hpW = map(max(0, this.player.hp), 0, 100, 0, 150);
    rect(20, 20, hpW, 15, 5);
    
    // 2. 金币显示 (改为 Coins)
    fill(255);
    textSize(16);
    textAlign(LEFT);
    // 自动兼容 player.coins 或 player.score
    let coinCount = this.player.coins !== undefined ? this.player.coins : (this.player.score || 0);
    text("Coins: " + coinCount, 20, 55);
  }

  show() {
    background(20, 20, 60); 

    push();
    translate(-this.cameraX, -this.cameraY);
    
    if (this.isBossBattle) {
      if (this.bosses[0]) this.bosses[0].show();
      this.player.show();
      fill(255, 255, 0);
      for(let b of this.playerBullets) ellipse(b.x, b.y, 15, 15);
      fill(255, 100, 0);
      for(let b of this.bossBullets) ellipse(b.x, b.y, 25, 25);
    } else {
      background(this.backgroundColor);
      this.drawBackground();
      this.checkpoints.forEach(cp => cp.show());
      this.platforms.forEach(p => p.show());
      this.coins.forEach(c => c.show());
      this.collectables.forEach(c => c.show());
      this.enemies.forEach(e => e.show());
      this.player.show();
    }
    pop();

    this.drawGameUI(); 
    if (this.isBossBattle) this.drawBossBattleUI();
  }
}

