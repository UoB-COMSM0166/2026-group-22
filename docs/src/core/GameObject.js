class GameObject {
  constructor(x, y, w, h) {
    if (new.target === GameObject) {
      throw new TypeError("Cannot construct GameObject instances directly.");
    }

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = true;
  }

  show() {
    throw new Error("Method 'show()' must be implemented.");
  }

  update() {
    throw new Error("Method 'update()' must be implemented.");
  }

  getBounds() {
    return {
      left: this.x - this.w / 2,
      right: this.x + this.w / 2,
      top: this.y - this.h / 2,
      bottom: this.y + this.h / 2
    };
  }

  getOverlap(other) {
    let b1 = this.getBounds();
    let b2 = other.getBounds();

    return {
      left: b1.right - b2.left,
      right: b2.right - b1.left,
      top: b1.bottom - b2.top,
      bottom: b2.bottom - b1.top
    }
  }

  intersects(other) {
    let b1 = this.getBounds();
    let b2 = other.getBounds();

    return (
      b1.left < b2.right &&
      b1.right > b2.left &&
      b1.top < b2.bottom &&
      b1.bottom > b2.top
    );
  }
}