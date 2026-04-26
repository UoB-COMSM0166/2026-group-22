class SummonerBoss extends Boss {
  constructor(x, y, sprites, config) {
    super(x, y, sprites, config);

    this.minions = [];
    this.minionBullets = [];

    this.spawnCooldown = 120;
    this.spawnTimer = this.spawnCooldown;
    this.movePhase = 0;
  }

  update() {
    if (this.hp <= 0) {
      this.applyPhysics();
      return;
    }

    if (this.isHurt) {
      this.hurtTimer--;
      if (this.hurtTimer <= 0) this.isHurt = false;
    }

    this.applyPhysics();

    if (this.attackSpriteTimer > 0) this.attackSpriteTimer--;

    this.spawnTimer--;
    if (this.spawnTimer <= 0 && this.hp > 0) {
      this.spawnTimer = this.spawnCooldown;
      this.spawnMinion();
    }

    for (let i = this.minions.length - 1; i >= 0; i--) {
      const m = this.minions[i];
      m.update();

      const bullet = m.tryShoot();
      if (bullet) {
        this.minionBullets.push(bullet);
      }

      if (!m.active) {
        this.minions.splice(i, 1);
      }
    }

    InteractionManager.updateProjectiles(this.minionBullets);

    return null;
  }

  spawnMinion() {
    const offsetY = random(-60, 60);
    this.attackSpriteTimer = 20;
    this.minions.push(new Minion(this.x - 50, this.y + offsetY));
  }

  show() {
    for (const m of this.minions) {
      m.show();
    }

    for (const b of this.minionBullets) {
      b.show();
    }
    
    super.show();
  }
}