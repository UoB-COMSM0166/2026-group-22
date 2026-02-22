// Inherit from Entity, which already inherits from GameObject
class Player extends Entity {
  constructor(frames) {
    // 1. super() calls the Entity/GameObject constructors
    // Passes: x, y, width, height
    super(100, 200, 40, 40);

    // 2. Override Entity defaults with Player-specific values
    this.gravity = 0.2;
    this.speed = 3;
    this.lift = -6; 
    this.hp = 100;

    // 3. Animation-specific properties (only for Player)
    this.frames = frames;
    this.currentFrame = 0;
    this.animationSpeed = 10;
    this.isFacingLeft = false;
    
    // Use a constant for the floor to avoid hardcoding height - 40 everywhere
    this.FLOOR_Y = height - 40;
  }

  // Implementation of the abstract update() method
  update() {
    this.applyPhysics(); // Inherited from Entity
    this.move();         // Defined below
    this.animate();      // Defined below
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
    let onGround = this.y >= this.FLOOR_Y;

    if (onGround && this.isMoving()) {
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
    this.velY = this.lift;
  }

  // Override applyPhysics to include floor collision logic
  applyPhysics() {
    super.applyGravity(); // Run the gravity logic from Entity.js first

    // Floor collision
    if (this.y > this.FLOOR_Y) {
      this.y = this.FLOOR_Y;
      this.velY = 0;
    }
    
    // Ceiling limit
    if (this.y < 20) {
      this.y = 20;
      this.velY = 0;
    }
  }
}