class MinionManager {
  constructor() {
    this.minions = [];
    this.minionBullets = [];
  }

  add(minion) {
    this.minions.push(minion);
  }

  update(player) {
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];
      m.update(player);

      const bullet = m.tryShoot(player);
      if (bullet) {
        this.minionBullets.push(bullet);
      }

      if (m.isDead) {
        this.minions.splice(i, 1);
      }
    }

    for (let i = this.minionBullets.length - 1; i >= 0; i--) {
      const b = this.minionBullets[i];
      b.x += b.vx;
      b.y += b.vy;

      if (b.x < -50 || b.x > width + 50 || b.y < -50 || b.y > height + 50) {
        this.minionBullets.splice(i, 1);
      }
    }
  }

  show() {
    for (const m of this.minions) {
      m.show();
    }

    fill(255, 60, 60);
    for (const b of this.minionBullets) {
      ellipse(b.x, b.y, b.size);
    }
  }

  checkPlayerCollisions(player) {
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];
      if (m.hitsPlayer(player)) {
        player.hp -= m.damage;
        this.minions.splice(i, 1);
      }
    }

    for (let i = this.minionBullets.length - 1; i >= 0; i--) {
      const b = this.minionBullets[i];
      const d = dist(b.x, b.y, player.x, player.y);

      if (d < b.size * 0.5 + 15) {
        player.hp -= b.damage;
        this.minionBullets.splice(i, 1);
      }
    }
  }

  checkBulletCollisions(playerBullets) {
    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];

      for (let j = playerBullets.length - 1; j >= 0; j--) {
        const b = playerBullets[j];
        const d = dist(b.x, b.y, m.x, m.y);

        if (d < m.size * 0.5 + 8) {
          m.takeDamage(1);
          playerBullets.splice(j, 1);
          break;
        }
      }

      if (m.isDead) {
        this.minions.splice(i, 1);
      }
    }
  }
}