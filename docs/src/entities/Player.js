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

    this.gravity = CONFIG.WORLD.GRAVITY;
    this.lift = CONFIG.PLAYER.LIFT;
    this.maxJumpCount = CONFIG.PLAYER.MAX_JUMP_COUNT;
    this.animationSpeed = CONFIG.PLAYER.ANIMATION_SPEED;

    this.currentFrame = 0;
    this.isFacingLeft = false;
    this.isGrounded = false;
    this.jumpCount = 0;

    this.state = CONFIG.PLAYER_STATES.NORMAL;
    this.invincibilityTimer = 0; // 0 means "can be hit"

    this.isInhaling = false;
    this.inhaleRange = 250;

    // --- SKILL SYSTEM ---
    this.hasSkill = false;
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0; // Useful for tracking how long a boost lasts

    this.isCharging = false;
    this.bowCharge = 0;
    this.shootCooldown = 15;
    this.currentCooldown = 0;

    // --- BUBBLE SYSTEM ---
    this.bubbleMode = false;
    this.bubbleCount = 0;
    this.bubbleStepTimer = 0;
    this.bubbleStepMax = 160;
    this.bubbleDamageCooldown = 0;

    this.worldReference = null;
  }

  // Implementation of the abstract update() method
  update() {
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;
    BubbleItem.updateSurvival(this);

    if (this.hasSkill && this.skillTimer > 0) {
      this.skillTimer--;
      if (this.skillTimer <= 0) this.resetSkills();
    }

    // 2. STATE MACHINE SWITCH
    switch (this.state) {
      case CONFIG.PLAYER_STATES.NORMAL:
        this.updateNormal();
        break;
      case CONFIG.PLAYER_STATES.INHALING:
        this.updateInhale();
        break;
      case CONFIG.PLAYER_STATES.BOW_CHARGING:
        this.updateBow();
        break;
      case CONFIG.PLAYER_STATES.HURT:
        this.updateHurt();
        break;
    }

    this.applyPhysics(); // Inherited from Entity
    if (this.currentCooldown > 0) this.currentCooldown--;
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
  }

  updateNormal() {
    this.move(); // Standard A/D movement

    // Transition Checks
    if (keyIsDown(CONFIG.CONTROLS.INHALE)) { // 'K' for Inhale
      this.state = CONFIG.PLAYER_STATES.INHALING;
    } else if (keyIsDown(CONFIG.CONTROLS.BOW) && this.currentSkill === CONFIG.SKILLS.BOW && this.currentCooldown <= 0) { // 'L' for Bow
      this.state = CONFIG.PLAYER_STATES.BOW_CHARGING;
      this.isCharging = true;
    }
  }

  updateInhale() {
    this.move();
    this.isInhaling = true;
    this.velX *= 0.5; // Kirby slows down while inhaling

    // Transition back to normal
    if (!keyIsDown(CONFIG.CONTROLS.INHALE)) {
      this.isInhaling = false;
      this.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  updateBow() {
    this.move();
    this.velX *= 0.2; // Strong movement penalty while aiming
    this.bowCharge = min(this.bowCharge + 0.6, 25);

    // Fire and Transition back
    if (!keyIsDown(CONFIG.CONTROLS.BOW)) {
      this.fireArrow(this.bowCharge);
      this.isCharging = false;
      this.bowCharge = 0;
      this.currentCooldown = 30;
      this.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  fireArrow(power) {
    let dir = this.isFacingLeft ? -1 : 1;

    // Dynamic physics based on power
    // vx = horizontal speed, vy = upward "kick"
    let vx = (8 + power) * dir;
    let vy = -5 - (power * 0.8);

    if (this.worldReference) {
      this.worldReference.spawnArrow(this.x, this.y, vx, vy);
    }
  }

  updateHurt() {
    // Lock controls during knockback. Return to normal after i-frames stabilize.
    if (this.invincibilityTimer < 45) {
      this.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  // Implementation of the abstract show() method
  show() {
    if (this.invincibilityTimer > 0 && frameCount % 10 < 5) return;
    if (this.isInhaling) this.drawInhaleEffect();

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

    // --- VISUAL CHARGE LINE ---
    if (this.isCharging) {
      stroke(255, 50, 50, 200); // Red aiming line
      strokeWeight(3);
      // Line extends based on charge amount
      let aimX = 15 + this.bowCharge * 2;
      let aimY = -10 - this.bowCharge * 1.5;
      line(5, -5, aimX, aimY);
    }

    pop();

    BubbleItem.drawUI(this);
  }

  // Helper method to keep show() clean
  drawInhaleEffect() {
    push();
    fill(255, 255, 255, 80); // Semi-transparent white
    noStroke();

    // Draw suction cone in the direction Kirby is facing
    let dir = this.isFacingLeft ? -1 : 1;
    let startAngle = this.isFacingLeft ? PI - QUARTER_PI : -QUARTER_PI;
    let endAngle = this.isFacingLeft ? PI + QUARTER_PI : QUARTER_PI;

    // Center the arc at Kirby's mouth/front
    arc(this.x + (15 * dir), this.y, 120, 100, startAngle, endAngle);
    pop();
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

    super.takeDamage(amount);
    this.invincibilityTimer = 60; // 1 second of i-frames

    this.state = CONFIG.PLAYER_STATES.HURT;

    this.isCharging = false;
    this.isInhaling = false;
    this.bowCharge = 0;

    // Apply Knockback: directionX is -1 (left) or 1 (right)
    // this.velX = directionX * 8;
    // this.velY = -5;
    // this.isGrounded = false;
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
    this.active = true;
    // 1. Move him back to the starting coordinates from your CONFIG
    this.x = startX;
    this.y = startY;

    // 2. Kill all momentum so he doesn't "carry" his fall speed into the respawn
    this.velX = 0;
    this.land();

    this.resetSkills();
    this.resetBubbleState();
  }

  resetSkills() {
    if (this.currentSkill === CONFIG.SKILLS.JUMP) {
      this.lift = CONFIG.PLAYER.LIFT;
    } else if (this.currentSkill === CONFIG.SKILLS.SHRINK) {
      this.w = CONFIG.PLAYER.WIDTH;
      this.h = CONFIG.PLAYER.HEIGHT;
      // 避免还原变大时脚底卡入地面，稍微把角色往上提一点
      this.y -= (CONFIG.PLAYER.HEIGHT / 2);
    }
    this.hasSkill = false;
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0;
  }

  activateBubble(count = 3) {
    this.bubbleCount = count;
    this.bubbleStepTimer = this.bubbleStepMax;
    this.bubbleDamageCooldown = 0;
  }

  resetBubbleState() {
    if (this.bubbleMode) {
      this.activateBubble(3);
    } else {
      this.bubbleCount = 0;
      this.bubbleStepTimer = 0;
      this.bubbleDamageCooldown = 0;
    }
  }
}