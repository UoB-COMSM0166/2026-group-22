class Coin extends Collectable {
  constructor(x, y) {
    super(x, y, 30, 30); // Pass dimensions to Item

    this.totalFrames = 12;
    this.currentFrame = 0;
    this.lastUpdate = 0;
    this.interval = 100; // 10fps

    this.shouldRespawn = false;
  }

  update(player) {
    super.update(player); // Keeps the inhale and collection logic working

    if (this.active) {
      // Handle Animation Timer
      if (millis() - this.lastUpdate >= this.interval) {
        this.currentFrame = (this.currentFrame + 1) % this.totalFrames;
        this.lastUpdate = millis();
      }
    }
  }

  onCollect(player) {
    gameState.addCoins(1);
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
  }
}