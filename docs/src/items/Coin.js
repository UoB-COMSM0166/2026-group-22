class Coin extends Collectable {
  constructor(x, y) {
    super(x, y, 30, 30);

    this.shouldRespawn = false;
    
    this.totalFrames = 12;
    this.currentFrame = 0;
    this.lastUpdate = 0;
    this.interval = 100;
  }

  update(player) {
    super.update(player);

    if (this.active) {
      if (millis() - this.lastUpdate >= this.interval) {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.lastUpdate = millis();
      }
    }
  }

  onCollect(player) {
    player.worldReference.sessionCoins++;
    this.active = false;
  }

  show() {
    if (!this.active) return;

    const frameImg = assets.getImg(`coin${this.currentFrame + 1}`);

    if (frameImg) {
      push();
      translate(this.x, this.y + this.hoverOffset);

      imageMode(CENTER);
      image(frameImg, 0, 0, this.w, this.h);
      pop();
    }
    this.drawDebug();
  }
}