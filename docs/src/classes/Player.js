// Inherit from Entity, which already inherits from GameObject
class Player extends Entity {
  constructor(frames) {
    const [idle, walk, jump] = frames;
    // 1. super() calls the Entity/GameObject constructors
    // Passes: x, y, width, height
    super(
      CONFIG.PLAYER.START_X, 
      CONFIG.PLAYER.START_Y,
      CONFIG.PLAYER.WIDTH, 
      CONFIG.PLAYER.HEIGHT,
      CONFIG.PLAYER.HP,
      CONFIG.PLAYER.SPEED
    );

    this.idleFrame = idle;
    this.walkFrame = walk;
    this.jumpFrame = jump;

    // 2. Override Entity defaults with Player-specific values
    this.gravity = CONFIG.WORLD.GRAVITY;
    this.lift = CONFIG.PLAYER.LIFT;
    this.maxJumpCount = CONFIG.PLAYER.MAX_JUMP_COUNT;
    this.animationSpeed = CONFIG.PLAYER.ANIMATION_SPEED;

    // 3. Animation-specific properties (only for Player)
    this.currentFrame = 0;
    this.isFacingLeft = false;
    this.isGrounded = false;
    this.jumpCount = 0;

    // --- SKILL SYSTEM ---
    this.hasSkill = false; 
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0; // Useful for tracking how long a boost lasts
    this.invincibilityTimer = 0; // 0 means "can be hit"
    this.bullets = [];
  }

  // Implementation of the abstract update() method
  update() {
    this.move();         // Defined below
    this.applyPhysics(); // Inherited from Entity

    if (this.hasSkill && this.skillTimer > 0) {
      this.skillTimer --; 

      if (this.skillTimer <= 0) {
        this.resetSkills();
      }
    }

    if (this.invincibilityTimer > 0) {
      this.invincibilityTimer--;
    }
    // 更新子弹
for (let bullet of this.bullets) {
  bullet.update(); 
}

// 清理失效子弹
this.bullets = this.bullets.filter(b => b.active);
  }

  // Logic for horizontal movement and facing direction
  move() {
    if (this.invincibilityTimer > 45) {
      return; // Skip movement input so the knockback velocity can finish
    }

    if (keyIsDown(CONFIG.CONTROLS.LEFT)) {
      this.velX = -this.speed; // Use velX instead of changing x directly
      this.isFacingLeft = true;
    } else if (keyIsDown(CONFIG.CONTROLS.RIGHT)) {
      this.velX = this.speed;
      this.isFacingLeft = false;
    } else {
      this.velX *= 0.9; // Stop moving if no key is pressed
    }
  }

handleKeyPress() {
  if (keyCode === CONFIG.CONTROLS.JUMP) {
    this.float();
  }

  if (keyCode === 75) { // K键射击
    this.shoot();
  }
}

  shoot() {
  let dir = this.isFacingLeft ? -1 : 1;

  let bullet = new Bullet(
    this.x,
    this.y,
    dir * 8,  // 水平速度
    0,        // 垂直速度
    8,        // size
    1,        // damage
    'yellow'
  );

  this.bullets.push(bullet);
}
  // Implementation of the abstract show() method
  show() {
    if (this.invincibilityTimer > 0 && frameCount % 10 < 5) {
      return; 
    }

    let frameImg

    if (!this.isGrounded) {
      frameImg = this.jumpFrame;
    } else if (this.isMoving()) {
      frameImg = this.currentFrame === 1 ? this.walkFrame : this.idleFrame;
    } else {
      frameImg = this.idleFrame;
    }

    if (!frameImg) return;

    push();
    translate(this.x, this.y);

    if (this.hasSkill) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = 'yellow';
    }
    
    if (this.isFacingLeft) scale(-1, 1);
    imageMode(CENTER);
    image(frameImg, 0, 0, this.w, this.h);
    pop();
    // 画子弹
for (let bullet of this.bullets) {
    bullet.show();
  }
  }

  // Handles which frame should be displayed
  animate() {
    if (!this.isGrounded) return;

    // let onGround = this.y >= this.FLOOR_Y;
    if (this.isMoving()) {
      if (frameCount % this.animationSpeed === 0) {
        this.currentFrame = this.currentFrame === 0 ? 1 : 0;
      }
    } else {
      this.currentFrame = 0; // Reset to idle frame
    }
  }

  isMoving() {
    return keyIsDown(CONFIG.CONTROLS.LEFT) || keyIsDown(CONFIG.CONTROLS.RIGHT);
  }

  float() {
    // Using velY instead of verticalSpeed to match Entity class
    if (this.jumpCount < this.maxJumpCount) {
      this.velY = this.lift;
      this.jumpCount++;
      this.isGrounded = false;
    }
  }

  land() {
    this.velY = 0;
    this.jumpCount = 0;
    this.isGrounded = true;
  }

  takeDamage(amount, directionX) {
    if (this.invincibilityTimer > 0) return; // Ignore if already hit

    this.hp -= amount;
    this.invincibilityTimer = 60; // 1 second of i-frames
    
    // Apply Knockback: directionX is -1 (left) or 1 (right)
    this.velX = directionX * 8; 
    this.velY = -5;

    this.isGrounded = false;
  }

  // Override applyPhysics to include floor collision logic
  applyPhysics() {
    let wasGrounded = this.isGrounded;

    this.isGrounded = false;
    super.applyPhysics(); // Run the gravity logic from Entity.js first

    // allow the player to jump only once if already on air
    if (wasGrounded && !this.isGrounded && this.velY > 0) {
      if (this.jumpCount === 0) {
        this.jumpCount = 1;
      }
    }
  }

  reset(startX, startY) {
    // 1. Move him back to the starting coordinates from your CONFIG
    this.x = startX;
    this.y = startY;

    // 2. Kill all momentum so he doesn't "carry" his fall speed into the respawn
    this.velX = 0;
    this.land();

    this.resetSkills();

    // 4. (Optional) Penalize health
    // this.player.hp -= 10;
  }

  resetSkills() {
    if (this.currentSkill === CONFIG.SKILLS.JUMP) {
      this.lift /= 1.5;
    }
    this.hasSkill = false;
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0;
  }
}