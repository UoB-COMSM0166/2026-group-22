// src/constants.js
const CONFIG = {
  // World Physics
  WORLD: {
    GRAVITY: 0.2,
    FLOOR_OFFSET: 20, // How far from the bottom the "floor" is
    CEILING_LIMIT: 20,
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400
  },
  
  // Player specific
  PLAYER: {
    START_X: 100,
    START_Y: 200,
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 3,
    LIFT: -6, // Jump/Float power
    HP: 100,
    ANIMATION_SPEED: 10
  }
};

// Optional: Prevent accidental changes during runtime
Object.freeze(CONFIG);