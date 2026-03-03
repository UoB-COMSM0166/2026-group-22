class GameObject {
  constructor(x, y, w, h) {
    // ABSTRACT ENFORCEMENT:
    // This prevents you from doing 'new GameObject()'
    if (new.target === GameObject) {
      throw new TypeError("Cannot construct GameObject instances directly.");
    }

    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.active = true;
  }

  // ABSTRACT METHOD: Subclasses MUST implement this for drawing
  show() {
    throw new Error("Method 'show()' must be implemented.");
  }

  // ABSTRACT METHOD: Subclasses MUST implement this for logic/physics
  update() {
    throw new Error("Method 'update()' must be implemented.");
  }

  // Returns the edges of the object for collision detection
  getBounds() {
    return {
      left: this.x - this.w / 2,
      right: this.x + this.w / 2,
      top: this.y - this.h / 2,
      bottom: this.y + this.h / 2
    };
  }

  // AABB (Axis-Aligned Bounding Box) collision detection
  intersects(other) {
    let b1 = this.getBounds();
    let b2 = other.getBounds();

    // Check if the two rectangles overlap
    return (
      b1.left < b2.right &&
      b1.right > b2.left &&
      b1.top < b2.bottom &&
      b1.bottom > b2.top
    );
  }
}