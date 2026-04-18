class Player extends Entity {
  constructor(sprites) {
    super(
      CONFIG.PLAYER.START_X,
      CONFIG.PLAYER.START_Y,
      CONFIG.PLAYER.WIDTH,
      CONFIG.PLAYER.HEIGHT,
      CONFIG.PLAYER.HP,
      CONFIG.PLAYER.SPEED
    );

    this.maxHp = this.hp;

    this.sprites = sprites;

    this.anim = new AnimationManager(this, sprites, CONFIG.PLAYER.ANIMATION_SPEED);

    this.gravity = CONFIG.WORLD.GRAVITY;
    this.lift = CONFIG.PLAYER.LIFT;
    this.maxJumpCount = CONFIG.PLAYER.MAX_JUMP_COUNT;

    this.isFacingLeft = false;
    this.isGrounded = false;
    this.jumpCount = 0;

    this.state = CONFIG.PLAYER_STATES.NORMAL;
    this.invincibilityTimer = 0;

    this.abilities = new AbilityManager(this);
    this.bubbleMode = false;
    this.worldReference = null;
  }

  update() {
    if (this.invincibilityTimer > 0) this.invincibilityTimer--;

    this.abilities.update();
    this.abilities.handleInput();

    if (this.state === CONFIG.PLAYER_STATES.HURT) {
      this.updateHurt();
    } else {
      this.move();
    }

    this.applyPhysics();
  }

  move() {
    if (keyIsDown(CONFIG.CONTROLS.LEFT)) {
      this.velX = -this.speed;
      this.isFacingLeft = true;
    } else if (keyIsDown(CONFIG.CONTROLS.RIGHT)) {
      this.velX = this.speed;
      this.isFacingLeft = false;
    } else {
      this.velX *= 0.9;
    }
  }

  handleKeyPress() {
    if (keyCode === CONFIG.CONTROLS.JUMP) {
      this.float();
    }
  }

  updateHurt() {
    if (this.invincibilityTimer < 45) {
      this.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  show() {
    drawingContext.shadowBlur = 0;

    if (this.invincibilityTimer > 0 && frameCount % 10 < 5) return;

    this.abilities.draw();

    let currentState = 'idle';
    if (this.isInhaling()) currentState = 'inhale';
    else if (this.isAttacking()) currentState = 'attack';
    else if (!this.isGrounded) currentState = 'jump';
    else if (this.isMoving()) currentState = 'walk';

    this.anim.update(currentState);

    const currentFrames = this.sprites[currentState];
    const currentImg = Array.isArray(currentFrames) ? currentFrames[this.anim.frame] : currentFrames;
    const size = this.getVisualSize(currentImg);

    this.anim.draw(this.x, this.y, this.isFacingLeft, size.w, size.h);
  }

  getVisualSize(img) {
    if (!img || img.width === 0 || img.height === 0) {
      return { w: this.w, h: this.h };
    }
    const scale = this.h / img.height;
    return {
      w: img.width * scale,
      h: this.h
    };
  }

  isMoving() {
    return keyIsDown(CONFIG.CONTROLS.LEFT) || keyIsDown(CONFIG.CONTROLS.RIGHT);
  }

  isAttacking() {
    return keyIsDown(CONFIG.CONTROLS.SHOOT);
  }

  isInhaling() {
    return keyIsDown(CONFIG.CONTROLS.INHALE);
  }

  float() {
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

  takeDamage(amount) {
    if (this.invincibilityTimer > 0) return;

    super.takeDamage(amount);
    this.invincibilityTimer = 60;
    this.state = CONFIG.PLAYER_STATES.HURT;
  }

  applyPhysics() {
    let wasGrounded = this.isGrounded;
    this.isGrounded = false;

    super.applyPhysics();

    if (wasGrounded && !this.isGrounded && this.velY > 0 && this.jumpCount === 0) {
      this.jumpCount = 1;
    }
  }

  reset(startX, startY) {
    this.active = true;

    this.x = startX;
    this.y = startY;

    this.velX = 0;
    this.land();

    this.abilities.resetSkills();
    this.abilities.resetBubbleState();
  }
}