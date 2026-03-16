class World {
  constructor(player, doorNumber) {
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
    this.collectableTypes = CONFIG.COLLECTABLE_TYPES;
    this.backgroundColor = [135, 206, 235];

    this.enemies = [];
    this.platforms = [];
    this.coins = [];
    this.collectables = [];
    this.holes = [];
    this.checkpoints = [];
    this.setupLevel(levelData);
    this.bosses = [];      
    this.bossBullets = []; 
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

      // place coins
      if (p.hasCoin) {
        this.coins.push(new Coin(centerX, centerY - 35));
      }

      // place enemy
      if (p.hasEnemy) {
        this.enemies.push(new Enemy(centerX, centerY - 100, 40, 40, 10, 2)); // temporaries
      }
      
      this.checkpoints.push(new Checkpoint(centerX + p.w/4, topY));
      currentX = centerX + p.w/2;
    }

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
    // place boss
    if (p.hasBoss) {
       this.bosses.push(new Boss(centerX, centerY - 200)); 
    }
  }

update() {
    // 1. 更新玩家状态
    this.player.update();

    // 2. 更新平台（主要是移动平台）
    for (let platform of this.platforms) {
      platform.update();
    }

    // 3. 处理玩家与平台的物理碰撞
    for (let platform of this.platforms) {
      this.handleSolidCollision(this.player, platform);
    }

    // --- 新增：Boss 逻辑更新 ---
    for (let boss of this.bosses) {
      // 执行 Boss AI 并获取可能发射的子弹
      let bulletData = boss.update(); 
      if (bulletData) {
        // 将子弹数据存入数组
        this.bossBullets.push(bulletData);
      }

      // 处理玩家与 Boss 的碰撞逻辑
      if (this.player.intersects(boss) && boss.hp > 0) {
        // 如果 Kirby 正在下落并且在 Boss 头部上方：判定为踩踏攻击
        if (this.player.velY > 0 && this.player.y < boss.y - boss.h / 4) {
          boss.takeDamage(50); 
          this.player.velY = -8; // 给 Kirby 一个向上的反弹力
        } else {
          // 否则判定为玩家受伤
          this.player.hp -= 10;
          // 简单的击退效果：根据相对位置将玩家弹开
          this.player.velX = (this.player.x < boss.x) ? -10 : 10;
          this.player.velY = -5;
        }
      }
    }

    // --- 新增：Boss 子弹物理与碰撞 ---
    for (let i = this.bossBullets.length - 1; i >= 0; i--) {
      let b = this.bossBullets[i];
      b.x += b.speed; // 子弹水平移动
      b.distanceTraveled += Math.abs(b.speed);

      // 检查子弹是否打中玩家
      // 我们手动计算距离来模拟碰撞，或者构造一个临时 bounds
      let d = dist(b.x, b.y, this.player.x, this.player.y);
      if (d < 30) { // 30 是子弹的碰撞半径
        this.player.hp -= 5;
        this.bossBullets.splice(i, 1); // 销毁子弹
        continue;
      }

      // 超过射程销毁子弹
      if (b.distanceTraveled > b.range) {
        this.bossBullets.splice(i, 1);
      }
    }

    // 4. 更新普通敌人逻辑
    for (let enemy of this.enemies) {
      enemy.update(this.platforms);
      
      // 检查敌人与 Kirby 的碰撞
      if (this.player.intersects(enemy)) {
        this.handleEnemyCollision(this.player, enemy);
      }

      // 处理敌人与平台的物理碰撞
      for (let platform of this.platforms) {
        this.handleSolidCollision(enemy, platform);
      }
    }

    // 5. 检查检查点 (Checkpoints)
    for (let cp of this.checkpoints) {
      if (cp.update(this.player)) {
        this.spawnX = cp.x;
        this.spawnY = cp.y - 10; 
      }
    }

    // 6. 物品收集逻辑
    for (let coin of this.coins) {
      coin.update(this.player);
    }
    for (let coll of this.collectables) {
      coll.update(this.player);
    }

    // 7. 世界边界与死亡判定
    this.handleWorldBoundaries(this.player);

    // 8. 性能维护：清理非活跃对象
    if (frameCount % 60 === 0) {
      this.enemies = this.enemies.filter(e => e.active);
      this.coins = this.coins.filter(c => c.active);
      this.collectables = this.collectables.filter(c => c.active);
      // Boss 如果血量归零，可以根据需要决定是否移除
      // this.bosses = this.bosses.filter(b => b.hp > 0);
    }

    // 9. 更新玩家动画与相机跟随
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
    // Classic platformer logic:
    // If Kirby is falling and hits the top of the enemy, kill the enemy
    if (player.velY > 0 && player.y < enemy.y - enemy.h / 2) {
      enemy.active = false;
      player.velY = -5; // Give Kirby a little bounce
    } else {
      // Otherwise, Kirby gets hurt
      player.hp -= 10;
      // Push Kirby back a little bit (Knockback)
      // Knockback logic
      player.velX = (player.x < enemy.x) ? -8 : 8;
      player.velY = -5; // Small pop up
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
    // 1. 绘制背景颜色（天空）
    background(this.backgroundColor);

    // 2. 应用摄像机变换
    // 将坐标系向左向上平移，实现摄像机跟随玩家的效果
    push();
    translate(-this.cameraX, -this.cameraY);

    // 3. 绘制静态背景（地面、孔洞等）
    this.drawBackground();

    // 4. 绘制检查点 (Checkpoints)
    for (let cp of this.checkpoints) {
      cp.show();
    }

    // 5. 绘制平台
    for (let platform of this.platforms) {
      platform.show();
    }

    // 6. 绘制收集品（金币和技能球）
    for (let coin of this.coins) {
      coin.show();
    }
    for (let coll of this.collectables) {
      coll.show();
    }

    // 7. 绘制普通敌人
    for (let enemy of this.enemies) {
      enemy.show();
    }

    // --- 新增：绘制 Boss ---
    for (let boss of this.bosses) {
      boss.show();
      
      // 可选：在 Boss 头顶画一个简单的血条
      if (boss.hp > 0) {
        push();
        fill(255, 0, 0, 100); // 半透明底色
        rect(boss.x, boss.y - boss.h/2 - 20, 100, 10);
        fill(0, 255, 0); // 绿色当前血量
        let healthBarW = map(boss.hp, 0, boss.maxHp, 0, 100);
        rectMode(CORNER);
        rect(boss.x - 50, boss.y - boss.h/2 - 25, healthBarW, 10);
        pop();
      }
    }

    // --- 新增：绘制 Boss 子弹 ---
    push();
    fill(255, 100, 0); // 橘红色子弹
    stroke(255, 200, 0);
    strokeWeight(2);
    for (let b of this.bossBullets) {
      ellipse(b.x, b.y, 20, 20); // 绘制圆形子弹
    }
    pop();

    // 8. 最后绘制玩家（确保 Kirby 在最上层）
    if (this.player.active) {
      this.player.show();
    }

    pop(); // 恢复坐标系
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