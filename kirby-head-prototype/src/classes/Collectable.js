class Collectable extends GameObject {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.hoverOffset = 0;
    this.floatSpeed = 0.1;
    this.floatAmplitude = 5;
  }

  // Common logic for all floating items
  update(player) {
    if (!this.active) return;

    // Standard floating animation
    this.hoverOffset = sin(frameCount * this.floatSpeed) * this.floatAmplitude;

    // Check if Kirby grabbed it
    if (this.intersects(player)) {
      this.onCollect(player);
      this.active = false; // "Despawn" the item
    }
  }

  // ABSTRACT METHOD: Subclasses define what happens when picked up
  onCollect(player) {
    throw new Error("Subclasses must implement onCollect()");
  }
}