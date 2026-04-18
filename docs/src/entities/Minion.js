class Minion extends Entity {
  constructor(x, y) {
    super(x, y, 30, 30, 1, 2.5);

    const minionSprites = {
      idle: assets.getImg('minion_idle'),
      walk: assets.getImg('minion_walk'),
      attack: assets.getImg('minion_attack')
    };

    this.sprites = minionSprites;
    this.anim = new AnimationManager(this, this.sprites);

    this.vx = -this.speed;
    this.vy = random(-1.2, 1.2);

    this.damage = 10;

    this.shootCooldown = 90;
    this.shootTimer = this.shootCooldown;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;

    const player = sceneManager.player;
    if (player) {
      if (player.y < this.y) this.y -= 0.4;
      if (player.y > this.y) this.y += 0.4;
    }

    if (this.shootTimer > 0) this.shootTimer--;
    if (this.attackSpriteTimer > 0) this.attackSpriteTimer--;

    if (this.x < -100 || this.x > width + 100 || this.y < -100 || this.y > height + 100) {
      this.active = false;
    }
  }

  tryShoot() {
    const player = sceneManager.player;

    if (!player || this.shootTimer > 0) return null;

    this.shootTimer = this.shootCooldown;
    this.attackSpriteTimer = 15;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy) || 1;

    const bulletSpeed = 4;
    const vx = (dx / distance) * bulletSpeed;
    const vy = (dy / distance) * bulletSpeed;

    return new Bullet(
      this.x, this.y, vx, vy, 10, 8, color(255, 60, 60)
    );
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.hp = 0;
      this.active = false;
    }
  }

  show() {
    if (!this.active) return;

    let state = 'idle';
    if (this.attackSpriteTimer > 0) state = 'attack';
    else if (Math.abs(this.vx) > 0.1) state = 'walk';

    this.anim.update(state);

    this.anim.draw(this.x, this.y, -1, 90, 90);
  }
}