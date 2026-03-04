// src/constants.js
const CONFIG = {
  // World Physics
  WORLD: {
    GRAVITY: 0.2,
    FLOOR_OFFSET: 20, // How far from the bottom the "floor" is
    CEILING_LIMIT: 0,
    CANVAS_WIDTH: 600,
    CANVAS_HEIGHT: 400,
    WIDTH: 2000,
    HEIGHT: 400,
  },

  LEVELS: {
    ONE: {
      worldWidth: 2000,
      worldHeight: 800,
      startX: 300,
      platforms: [
        { gap: 0, altitude: 100, w: 150, h: 20 },
        { gap: 150, altitude: 180, w: 150, h: 20 },
        { gap: 200, altitude: 250, w: 200, h: 20 },
        { gap: 100, altitude: 250, w: 150, h: 20 }
      ]
    }
  },
  
  // Player specific
  PLAYER: {
    START_X: 100,
    START_Y: 600,
    WIDTH: 40,
    HEIGHT: 40,
    SPEED: 3,
    MAX_JUMP_COUNT: 2,
    LIFT: -5.5, // Jump/Float power
    HP: 100,
    ANIMATION_SPEED: 10
  },

  // File paths
  PATH: {
    PLAYER_IDLE: './assets/kirby_idle.png', // path based on index.html, not the .js file
    PLAYER_MOVE: './assets/kirby_move.png'
  }
};

// Optional: Prevent accidental changes during runtime
Object.freeze(CONFIG);