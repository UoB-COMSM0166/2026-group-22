// src/classes/Platform.js
class Platform extends GameObject {
  constructor(x, y, w, h, img) {
    super(x, y, w, h);
    this.color = [100, 100, 100];
    this.img = img;
    this.tileSize = 40;

    this.velX = 0;
    this.velY = 0;

    this.buffer = createGraphics(w, h);
    for (let ix = 0; ix < w; ix += this.tileSize) {
      for (let iy = 0; iy < h; iy += this.tileSize) {
        this.buffer.image(this.img, ix, iy, this.tileSize, this.tileSize);
      }
    }
  }

  update() {
    // Static platforms don't need much logic, 
    // but you could add moving platform logic here later!
  }

  resolve(entity, world) {
    if (!this.active || !entity.active || !entity.intersects(this)) return false;

    const p = this.getBounds();
    const e = entity.getBounds();

    const isOver = e.right > p.left + 5 && e.left < p.right - 5;

    if (isOver && entity.y < this.y) {
      entity.y = p.top - entity.h / 2;
      entity.velY = 0;
      if (entity.land) entity.land();

      entity.x += this.velX;
      entity.y += this.velY;

      this.handlePlatformTriggers(entity, world);

      return true;
    }

    const overlap = entity.getOverlap(this);
    const minOverlap = Math.min(overlap.bottom, overlap.left, overlap.right);

    if (minOverlap === overlap.bottom) {
      entity.y = p.bottom + entity.h / 2;
      entity.velY = 0;
    } else if (overlap.left < overlap.right) {
      entity.x = p.left - entity.w / 2;
    } else {
      entity.x = p.right + entity.w / 2;
    }
    return true;
  }

  handlePlatformTriggers(entity, world) {
    if (!(entity instanceof Player)) return;

    // Vanishing platforms
    if (this instanceof VanishablePlatform) {
      this.isTouched = true;
    }

    // Skill resets
    if (this.removesSkill) {
      entity.abilities.resetSkills();
    }

    // Boss transitions
    if (this.hasBoss || this.hasSummonerBoss) {
      sceneManager.switch("boss", {
        bossType: this.hasSummonerBoss ? "summoner" : "regular",
        bgLayers: world.bgLayers,
        worldAssets: world.worldAssets
      });
    }
  }

  show() {
    image(this.buffer, this.x - this.w / 2, this.y - this.h / 2);
  }
}