class Boss extends Entity {
  constructor(x, y, sprites) {
    // x, y, width, height, hp, speed
    super(x, y, 150, 200, 500, 0);
    this.sprites = sprites;

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
    let attackRate = this.hp < 200 ? 30 : 60;

    if (this.attackTimer > attackRate && this.hp > 0) {
      this.attackTimer = 0;
      this.attackSpriteTimer = 15;

      return new Bullet(
        this.x - 50,                // Start slightly in front of boss
        this.y + random(-50, 50),    // Random height spread
        -8,                          // Velocity X (moving left)
        0,                           // Velocity Y
        25,                          // Size
        10,                          // Damage
        color(255, 100, 0)           // Orange color
      );
    }
    return null;
  }

  show() {
    if (this.hp <= 0) {
      this.drawExplosion(); // Add a "death" visual
      return;
    }

    push();
    translate(this.x, this.y);

    scale(-1, 1);

    let currentImg = this.sprites.idle;
    if (this.attackSpriteTimer > 0) {
      currentImg = this.sprites.attack;
    }

    // Feedback: Flash white or red when hit
    if (this.isHurt) {
      fill(255, 100, 100);
    }

    if (currentImg) {
      imageMode(CENTER);
      image(currentImg, 0, 0, this.w, this.h);
    }
    pop();
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