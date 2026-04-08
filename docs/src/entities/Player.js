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

    this.abilities = new AbilityManager(this);

    // --- BUBBLE SYSTEM ---
    this.bubbleMode = false;
    this.worldReference = null;
  }

  // Implementation of the abstract update() method
  update() {
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;

    this.abilities.update();
    this.abilities.handleInput();

    if (this.state === CONFIG.PLAYER_STATES.HURT) {
      this.updateHurt();
    } else {
      this.move(); // Movement is still a core Player responsibility
    }

    this.applyPhysics();
    this.animate();
  }

  // Logic for horizontal movement and facing direction
  move() {
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

  updateHurt() {
    // Lock controls during knockback. Return to normal after i-frames stabilize.
    if (this.invincibilityTimer < 45) {
      this.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  // Implementation of the abstract show() method
  show() {
    drawingContext.shadowBlur = 0;

    if (this.invincibilityTimer > 0 && frameCount % 10 < 5) return;

    this.abilities.draw();

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
    if (this.isFacingLeft) scale(-1, 1);
    imageMode(CENTER);
    image(frameImg, 0, 0, this.w, this.h);
    pop();

    BubbleItem.drawUI(this);
  }

  // Handles which frame should be displayed
  animate() {
    if (!this.isGrounded) return;

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
  }

  // Override applyPhysics to include floor collision logic
  applyPhysics() {
    let wasGrounded = this.isGrounded;

    this.isGrounded = false;
    super.applyPhysics(); // Run the gravity logic from Entity.js first

    // allow the player to jump only once if already on air
    if (wasGrounded && !this.isGrounded && this.velY > 0 && this.jumpCount === 0) {
      this.jumpCount = 1;
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

    this.abilities.resetSkills(); // Reset through manager
    this.abilities.resetBubbleState(); // Should be added to AbilityManager
  }
}