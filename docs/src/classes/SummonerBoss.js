class SummonerBoss {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.maxHp = 220;
    this.hp = this.maxHp;

    this.movePhase = 0;
    this.spawnCooldown = 30;
    this.spawnTimer = this.spawnCooldown;

    this.minionManager = new MinionManager();
  }

  update(player, playerBullets) {
    this.movePattern();

    // Spawn minions
    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnTimer = this.spawnCooldown;
      this.spawnMinion();
    }

    // Update all summoned minions
    this.minionManager.update(player);

    if (player) {
      this.minionManager.checkPlayerCollisions(player);
    }

    if (playerBullets) {
      this.minionManager.checkBulletCollisions(playerBullets);
    }

    return null; // keep compatible with old BossScene pattern
  }

  movePattern() {
    this.movePhase += 0.03;
    this.y += sin(this.movePhase) * 1.5;
  }

  spawnMinion() {
    const offsetY = random(-40, 40);
    this.minionManager.add(new Minion(this.x - 50, this.y + offsetY));
  }

  takeDamage(amount) {
    this.hp -= amount;
  }

  show() {
    push();
    fill(200, 80, 120);
    ellipse(this.x, this.y, 120, 120);

    fill(255);
    ellipse(this.x - 20, this.y - 10, 16, 16);
    ellipse(this.x + 20, this.y - 10, 16, 16);

    fill(40);
    ellipse(this.x - 20, this.y - 10, 7, 7);
    ellipse(this.x + 20, this.y - 10, 7, 7);

    fill(80);
    rect(this.x - 20, this.y + 15, 40, 8, 4);
    pop();

    this.minionManager.show();
  }
}