class MovingPlatform extends Platform {
  constructor(x, y, w, h, img, rangeX = 100, rangeY = 0, speed = 0.02) {
    super(x, y, w, h, img);
    this.startX = x;
    this.startY = y;
    this.rangeX = rangeX;
    this.rangeY = rangeY;
    this.speed = speed;

    this.velX = 0;
    this.velY = 0;
  }

  update() {
    let oldX = this.x;
    let oldY = this.y;

    let movement = sin(frameCount * this.speed);

    this.x = this.startX + movement * this.rangeX;
    this.y = this.startY + movement * this.rangeY;

    this.velX = this.x - oldX;
    this.velY = this.y - oldY;
  }

  show() {
    super.show();
  }
}