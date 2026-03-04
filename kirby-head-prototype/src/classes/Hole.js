class Hole {
  constructor(x, w) {
    this.x = x; // Center X of the hole
    this.w = w; // Width of the hole
    
    // Calculated boundaries for easy checking
    this.left = x - w / 2;
    this.right = x + w / 2;
  }

  // Checks if a given X position is inside the hole
  contains(targetX) {
    return targetX > this.left && targetX < this.right;
  }
}