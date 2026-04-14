// src/entities/Minion.js
class Minion extends Entity {
  constructor(x, y) {
    // super(x, y, width, height, hp, speed)
    super(x, y, 30, 30, 1, 2.5);

    const minionSprites = {
      idle: assets.getImg('minion_idle'), // Ensure these keys exist in AssetManager
      walk: assets.getImg('minion_walk'),
      attack: assets.getImg('minion_attack')
    };

    this.sprites = minionSprites;

    this.anim = new AnimationManager(this, this.sprites);

    // Custom movement vectors
    this.vx = -this.speed;
    this.vy = random(-1.2, 1.2);

    // this.isDead = false;
    this.damage = 10;

    this.shootCooldown = 90;
    this.shootTimer = this.shootCooldown;
  }

  // We override the Entity update to handle unique "Flying/Homing" logic
  update() {
    // 1. Basic Movement
    this.x += this.vx;
    this.y += this.vy;

    // 2. Homing Logic: Gently follow the player's Y-position
    const player = sceneManager.player;
    if (player) {
      if (player.y < this.y) this.y -= 0.4;
      if (player.y > this.y) this.y += 0.4;
    }

    // 3. Countdown for shooting
    if (this.shootTimer > 0) this.shootTimer--;
    if (this.attackSpriteTimer > 0) this.attackSpriteTimer--;

    // 4. Self-Cleanup: Mark as dead if flies off-screen
    if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
      this.active = false;
    }
  }

  tryShoot() {
    const player = sceneManager.player;

    // Only shoot if player exists and cooldown is ready
    if (!player || this.shootTimer > 0) return null;

    this.shootTimer = this.shootCooldown;
    this.attackSpriteTimer = 15;

    // Calculate direction towards player
    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    const bulletSpeed = 4;
    const vx = (dx / distance) * bulletSpeed;
    const vy = (dy / distance) * bulletSpeed;

    // Return a projectile object for the Boss to manage
    return new Bullet(
      this.x, 
      this.y, 
      vx, 
      vy, 
      10,                // Size
      8,                 // Damage
      color(255, 60, 60) // Minion Bullet Color (Red)
    );
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }

  // Visuals (Now uses this.w from the Entity class)
  show() {
    if (!this.active) return;

    let state = 'idle';
    if (this.attackSpriteTimer > 0) state = 'attack';
    else if (Math.abs(this.vx) > 0.1) state = 'walk';

    this.anim.update(state);
    
    // Use the internal config for visual dimensions
    this.anim.draw(
      this.x, 
      this.y, 
      -1, 
      90, 
      90
    );
  }
}