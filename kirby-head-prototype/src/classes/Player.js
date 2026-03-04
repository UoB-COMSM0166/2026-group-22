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
  }

  // Implementation of the abstract update() method
  update() {
    this.move();         // Defined below
    this.applyPhysics(); // Inherited from Entity
  }

  // Logic for horizontal movement and facing direction
  move() {
    if (keyIsDown(LEFT_ARROW)) {
      this.velX = -this.speed; // Use velX instead of changing x directly
      this.isFacingLeft = true;
    } else if (keyIsDown(RIGHT_ARROW)) {
      this.velX = this.speed;
      this.isFacingLeft = false;
    } else {
      this.velX = 0; // Stop moving if no key is pressed
    }
  }

  // Implementation of the abstract show() method
  show() {
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
    return keyIsDown(LEFT_ARROW) || keyIsDown(RIGHT_ARROW);
  }

  float() {
    // Using velY instead of verticalSpeed to match Entity class
    if (this.jumpCount < this.maxJumpCount) {
      this.velY = this.lift;
      this.jumpCount++;
      this.isGrounded = false;
    }
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
}