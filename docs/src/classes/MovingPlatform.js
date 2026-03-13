// src/classes/MovingPlatform.js
class MovingPlatform extends Platform {
  constructor(x, y, w, h, rangeX = 100, rangeY = 0, speed = 0.02) {
    super(x, y, w, h);
    this.color = [155, 89, 182];
    this.startX = x;
    this.startY = y;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
    this.speed = speed;
    
    // We store the velocity so the World can apply it to the player
    this.velX = 0;
    this.velY = 0;
  }

  update() {
    let oldX = this.x;
    let oldY = this.y;

    // Use sin() for smooth back-and-forth movement
    let movement = sin(frameCount * this.speed);
    
    this.x = this.startX + movement * this.rangeX;
    this.y = this.startY + movement * this.rangeY;

    // Calculate velocity so the player can "stick" to it
    this.velX = this.x - oldX;
    this.velY = this.y - oldY;
  }

  show() {
    super.show();
    fill(this.color);
  }
}