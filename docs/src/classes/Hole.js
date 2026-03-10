class Hole {
  constructor(startX, endX) {
    // We store the bounds directly
    this.left = startX;
    this.right = endX;
    
    // Calculate width and center in case other parts of the code need them
    this.w = endX - startX;
    this.x = startX + this.w / 2;
  }
  // Checks if a given X position is inside the hole
  contains(targetX) {
    return targetX > this.left && targetX < this.right;
  }
}