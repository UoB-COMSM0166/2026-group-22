// src/scenes/BossScene.js
class BossScene {
  constructor() {
    this.player = null; 
    this.boss = null;
    this.playerBullets = [];
    this.bossBullets = [];

    this.projectiles = []; // 弓箭
    this.platforms = [];   // 锁链机关

    this.statsBar = new StatsBar();

     this.flySpeed = 6;
    this.shootCooldown = 10;
    this.currentCooldown = 0;
  }

  spawnArrow(x, y, vx, vy) {
    if (this.currentBossType === 'summoner') {
      this.projectiles.push(new Arrow(x, y, vx, vy));
    }
  }

  onEnter(bossType) {
     this.currentBossType = bossType;
    sceneManager.currentScene = this;

    const bossMap = {
      'summoner': SummonerBoss,
      'regular': Boss,
     };
 
    const BossClass = bossMap[bossType] || Boss;
    this.boss = new BossClass(width / 2, height / 2); 
 
    this.player = sceneManager.player;
    this.player.hp = 100;               
    this.player.active = true;          
    this.player.invincibilityTimer = 0; 
    this.player.worldReference = this; 

    this.playerBullets = [];
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
    if (this.player.hp <= 0) {
      this.resetScene();
      return; 
    }

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
    if (attack) {
      this.bossBullets.push(attack);
    }

    this.updateProjectiles();
    this.checkCollisions();
 
    if (this.boss.hp <= 0) {
      setTimeout(() => sceneManager.switch("camp"), 2000);
    }
  }

  handlePlayerMovement() {
     if (keyIsDown(87) || keyIsDown(UP_ARROW)) this.player.y -= this.flySpeed;
    if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) this.player.y += this.flySpeed;
    if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) this.player.x -= this.flySpeed;
    if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) this.player.x += this.flySpeed;
 
    this.player.x = constrain(this.player.x, 30, width - 30);
    this.player.y = constrain(this.player.y, 30, height - 30);
  }

  handlePlayerShooting() {
     if (this.currentCooldown > 0) this.currentCooldown--;
    if (keyIsDown(74) && this.currentCooldown <= 0) {
      let pb = new Bullet(this.player.x + 20, this.player.y, 12, 0, 15, 10, color(255, 255, 0));
      this.playerBullets.push(pb);
      this.currentCooldown = this.shootCooldown;
    }
  }

   updateProjectiles() {
     const bulletGroups = [this.playerBullets, this.bossBullets];
     if (this.boss.minionBullets) bulletGroups.push(this.boss.minionBullets);
    bulletGroups.forEach(group => {
      for (let i = group.length - 1; i >= 0; i--) {
        group[i].update();
        if (!group[i].active) group.splice(i, 1);
      }
    });
  }
 
   checkCollisions() {
    this.resolveHitGroup(this.playerBullets, this.boss, (b, boss) => boss.takeDamage(b.damage));
    this.resolveHitGroup(this.bossBullets, this.player, (b, p) => p.hp -= b.damage);

      if (this.boss.minions) {
      this.resolveHitGroup(this.boss.minions, this.player, (m, p) => {
        const dir = (p.x < m.x) ? -1 : 1;
        p.takeDamage(10, dir); 
      });

      if (this.isPlatformerMode) {
        this.projectiles.forEach((arrow) => {
          if (!arrow.active) return;
          this.boss.minions.some(m => {
            if (m.active && arrow.intersects(m)) {
              m.takeDamage(20);
              arrow.active = false;
              return true;
            }
          });
        });
      }

      this.playerBullets.forEach((pb, i) => {
        this.boss.minions.some(m => {
          if (pb.intersects(m)) {
            m.takeDamage(pb.damage);
            pb.active = false;
            this.playerBullets.splice(i, 1);
            return true;
          }
        });
      });
 
      if (this.boss.minionBullets) {
        this.resolveHitGroup(this.boss.minionBullets, this.player, (mb, p) => p.hp -= mb.damage);
      }
    }
  }
 
  resolveHitGroup(projectiles, target, onHit) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i].intersects(target)) {
        onHit(projectiles[i], target);
        projectiles[i].active = false; 
        projectiles.splice(i, 1);
      }
    }
  }

  draw() {
     this.update();
    background(20, 20, 60);

    if (this.isPlatformerMode) {
      this.platforms.forEach(p => p.show());
      this.projectiles.forEach(p => p.show());
    }

    this.boss.show();
    this.player.show();

    for (let b of this.playerBullets) b.show();
    for (let b of this.bossBullets) b.show();

    this.drawUI();
  }

  drawUI() {
     let barW = 400;
    let hpW = map(max(0, this.boss.hp), 0, this.boss.maxHp, 0, barW);
    
    push();
    rectMode(CORNER); 
    fill(40, 200);
    rect(width / 2 - barW / 2, 30, barW, 15, 5);
    fill(255, 0, 50);
    rect(width / 2 - barW / 2, 30, hpW, 15, 5);
    pop();

    this.statsBar.draw(this.player, shopState.coins, false);
  }

  keyPressed() {
     if (keyCode === ESCAPE) {
      this.playerBullets = [];
       this.bossBullets = [];
      sceneManager.switch("camp");
    }
  }

  resetScene() {
     this.onEnter(this.currentBossType);
     this.currentCooldown = 0;
  }
}