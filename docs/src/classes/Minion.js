class Minion {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = -2.5;
    this.vy = random(-1.2, 1.2);

    this.size = 24;
    this.hp = 1;
    this.isDead = false;
    this.damage = 10;

    this.shootCooldown = 90;
    this.shootTimer = this.shootCooldown;
  }

  update(player) {
    this.x += this.vx;
    this.y += this.vy;

    if (player) {
      if (player.y < this.y) this.y -= 0.4;
      if (player.y > this.y) this.y += 0.4;
    }

    this.shootTimer--;

    if (this.x < -50 || this.y < -50 || this.y > height + 50) {
      this.isDead = true;
    }
  }

  tryShoot(player) {
    if (!player) return null;
    if (this.shootTimer > 0) return null;

    this.shootTimer = this.shootCooldown;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;

    const speed = 4;

    return {
      x: this.x,
      y: this.y,
      vx: (dx / len) * speed,
      vy: (dy / len) * speed,
      size: 10,
      damage: 8
    };
  }

  hitsPlayer(player) {
    const d = dist(this.x, this.y, player.x, player.y);
    return d < this.size * 0.5 + 15;
  }

  takeDamage(amount) {
    this.hp -= amount;
    if (this.hp <= 0) {
      this.isDead = true;
    }
  }

  show() {
    push();
    fill(255, 160, 60);
    ellipse(this.x, this.y, this.size);

    fill(255);
    ellipse(this.x - 5, this.y - 3, 5, 5);
    ellipse(this.x + 5, this.y - 3, 5, 5);

    fill(60);
    ellipse(this.x - 5, this.y - 3, 2, 2);
    ellipse(this.x + 5, this.y - 3, 2, 2);
    pop();
  }
}