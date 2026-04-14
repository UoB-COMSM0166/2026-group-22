class Boss extends Entity {
  constructor(x, y, sprites, config) {
    // x, y, width, height, hp, speed
    super(x, y, config.width, config.height, config.maxHp, config.speed);
    this.sprites = sprites;
    this.anim = new AnimationManager(this, sprites, 10, 'bottom');

    this.visualW = config.visualW;
    this.visualH = config.visualH;
    this.visualAlignment = config.visualAlignment;


    this.maxHp = 500;
    this.isHurt = false;
    this.hurtTimer = 0;
    this.attackTimer = 0;

    this.attackSpriteTimer = 0;
  }

  update() {
    // Damage state handling
    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    this.applyPhysics();

    if (this.attackSpriteTimer > 0) this.attackSpriteTimer--;

    // Attack Logic
    this.attackTimer++;
    // Use a variable for attack speed so you can make him faster as HP drops!
    let attackRate = this.hp < 200 ? 90 : 180;

    if (this.attackTimer > attackRate && this.hp > 0) {
      this.attackTimer = 0;
      this.attackSpriteTimer = 15;

      return new Slash(
        this.x - 50,                // Start slightly in front of boss
        this.y + 10,    // Random height spread
        -6,                          // Velocity X (moving left)
        0,                           // Velocity Y
        25, 50,                          // Size
        10,
        this.sprites.slash
      );
    }
    return null;
  }

  show() {
    if (this.hp <= 0) {
      this.drawExplosion(); // Add a "death" visual
      return;
    }

    let state = 'idle';
    if (this.isHurt) {
      state = 'hurt';
    } else if (this.attackSpriteTimer > 0) {
      state = 'attack';
    }

    this.anim.update(state);

    // Feedback: Flash white or red when hit
    if (this.isHurt) {
      fill(255, 100, 100);
    }

    this.anim.draw(this.x, this.y, -1, this.visualW, this.visualH, this.visualAlignment);
    noTint();
  }

  takeDamage(amount) {
    super.takeDamage(amount);
    this.isHurt = true;
    this.hurtTimer = 10;
    // Check if global shakeAmount exists before setting it
    if (window.shakeAmount !== undefined) window.shakeAmount = 10;
  }

  land() {
    this.velY = 0; // Stop the falling force immediately
  }

  drawExplosion() {
    // Simple particle effect or expanding circle
    noStroke();
    fill(255, 200, 0, 150);
    ellipse(this.x, this.y, frameCount % 100 * 2);
  }
}