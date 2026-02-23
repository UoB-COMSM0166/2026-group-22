// src/constants.js
const CONFIG = {
  // World Physics
  WORLD: {
    GRAVITY: 0.2,
    FLOOR_OFFSET: 20, // How far from the bottom the "floor" is
    CEILING_LIMIT: 0,
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,
    WIDTH: 2000
  },
  
  // Player specific
  PLAYER: {
    START_X: 100,
    START_Y: 200,
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 3,
    MAX_JUMP_COUNT: 2,
    LIFT: -6, // Jump/Float power
    HP: 100,
    ANIMATION_SPEED: 10
  },

  // File paths
  PATH: {
    PLAYER_IDLE: '../assets/kirby_idle.png',
    PLAYER_MOVE: '../assets/kirby_move.png'
  }
};

// Optional: Prevent accidental changes during runtime
Object.freeze(CONFIG);