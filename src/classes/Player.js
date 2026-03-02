// Inherit from Entity, which already inherits from GameObject
class Player extends Entity {
  constructor(frames) {
    // 1. super() calls the Entity/GameObject constructors
    // Passes: x, y, width, height
    super(
      CONFIG.PLAYER.START_X, 
      CONFIG.PLAYER.START_Y,
      CONFIG.PLAYER.WIDTH, 
      CONFIG.PLAYER.HEIGHT);

    // 2. Override Entity defaults with Player-specific values
    this.gravity = CONFIG.WORLD.GRAVITY;
    this.speed = CONFIG.PLAYER.SPEED;
    this.lift = CONFIG.PLAYER.LIFT;
    this.hp = CONFIG.PLAYER.HP;
    this.maxJumpCount = CONFIG.PLAYER.MAX_JUMP_COUNT;

    // 3. Animation-specific properties (only for Player)
    this.frames = frames;
    this.currentFrame = 0;
    this.animationSpeed = CONFIG.PLAYER.ANIMATION_SPEED;
    this.isFacingLeft = false;
    
    this.CEILING = this.h/2 - CONFIG.WORLD.CEILING_LIMIT;
    this.WORLD_HEIGHT = CONFIG.LEVELS.ONE.worldHeight
    this.FLOOR_Y = this.WORLD_HEIGHT - (CONFIG.WORLD.FLOOR_OFFSET + (CONFIG.PLAYER.HEIGHT/2));

    this.jumpCount = 0;

    this.isGrounded = false;
  }

  // Implementation of the abstract update() method
  update() {
    this.applyPhysics(); // Inherited from Entity
    this.move();         // Defined below
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
    
    this.x += this.velX;

    this.x = constrain(this.x, CONFIG.PLAYER.WIDTH/2, CONFIG.WORLD.WIDTH - CONFIG.PLAYER.WIDTH/2);
  }

  // Implementation of the abstract show() method
  show() {
    if (!this.frames || this.frames.length === 0) return;

    push();
    translate(this.x, this.y);
    if (this.isFacingLeft) scale(-1, 1);
    imageMode(CENTER);
    
    image(this.frames[this.currentFrame], 0, 0, this.w, this.h);
    pop();
  }

  // Handles which frame should be displayed
  animate() {
    // let onGround = this.y >= this.FLOOR_Y;
    if (this.isGrounded && this.isMoving()) {
      if (frameCount % this.animationSpeed === 0) {
        this.currentFrame = (this.currentFrame + 1) % this.frames.length;
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
    }
  }

  // Override applyPhysics to include floor collision logic
  applyPhysics() {
    this.isGrounded = false;
    super.applyGravity(); // Run the gravity logic from Entity.js first

    // Floor collision
    if (this.y > this.FLOOR_Y) {
      this.y = this.FLOOR_Y;
      this.velY = 0;

      this.jumpCount = 0;
      this.isGrounded = true;
    }
    
    // Ceiling limit
    if (this.y < this.CEILING) {
      this.y = this.CEILING;
      this.velY = 0;
    }
  }
}