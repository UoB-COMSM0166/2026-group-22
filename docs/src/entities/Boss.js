class Boss extends Entity {
  constructor(x, y, sprites, config) {
    super(x, y, config.width, config.height, config.maxHp, config.speed);
    this.sprites = sprites;
    this.anim = new AnimationManager(this, sprites, 10);

    this.visualW = config.visualW;
    this.visualH = config.visualH;
    this.visualAlignment = config.visualAlignment;

    this.maxHp = config.maxHp;
    
    this.isHurt = false;
    this.hurtTimer = 0;
    this.attackTimer = 0;

    this.attackSpriteTimer = 0;
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

    this.attackTimer++;
    let attackRate = this.hp < 200 ? 90 : 180;

    if (this.attackTimer > attackRate && this.hp > 0) {
      this.attackTimer = 0;
      this.attackSpriteTimer = 15;

      let slash = new Slash(
        this.x - 50, this.y + 10, -6, 0, 25, 50, 10, this.sprites.slash
      );

      return slash;
    }

    return null;
  }

  show() {
    if (this.hp <= 0) {
      this.anim.update('dead', false);
      this.anim.draw(this.x, this.y, -1, this.visualW, this.visualH, this.visualAlignment);
      return;
    }

    let state = 'idle';
    if (this.isHurt) {
      state = 'hurt';
    } else if (this.attackSpriteTimer > 0) {
      state = 'attack';
    }

    this.anim.update(state);
    this.anim.draw(this.x, this.y, -1, this.visualW, this.visualH, this.visualAlignment);
  }

  takeDamage(amount) {
    this.hp -= amount;

    if (this.hp <= 0) {
      this.hp = 0;
    }

    this.isHurt = true;
    this.hurtTimer = 4;
  }

  land() {
    this.velY = 0;
  }
}