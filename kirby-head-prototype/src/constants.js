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
      worldWidth: 3000,
      worldHeight: 800,
      startX: 300,
      platforms: [
        // --- THE STARTING STAIRS ---
        { gap: 0,   altitude: 100, w: 150, h: 20 }, // 1. Easy start
        { gap: 120, altitude: 180, w: 150, h: 20 }, // 2. Moving up
        { gap: 120, altitude: 260, w: 150, h: 20 }, // 3. A bit higher

        // --- THE LONG LEAP ---
        { gap: 250, altitude: 220, w: 300, h: 20 }, // 4. A long jump down to a wide safety platform

        // --- THE CLIMB ---
        { gap: 150, altitude: 350, w: 100, h: 20 }, // 5. Small platform (harder to land)
        { gap: 100, altitude: 480, w: 150, h: 20 }, // 6. Higher up
        { gap: 20, altitude: 530, w: 150, h: 20 }, // 6. Higher up
        { gap: -50, altitude: 650, w: 200, h: 20 }, // 7. "Underlapping" platform (jump back to climb)

        // --- THE GOAL PLATEAU ---
        { gap: 300, altitude: 550, w: 400, h: 30 }  // 8. The big finish area
      ],
      holes: [
        { x: 800, w: 150 },  // A pit at x=800
        { x: 1800, w: 200 }  // A larger pit later on
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

  CONTROLS: {
    JUMP: ' ', // Space
    LEFT: 'ArrowLeft', // Left Arrow
    RIGHT: 'ArrowRight' // Right Arrow
  },

  // File paths
  PATH: {
    PLAYER_IDLE: './assets/kirby_idle.png', // path based on index.html, not the .js file
    PLAYER_MOVE: './assets/kirby_move.png',
    PLAYER_JUMP: './assets/kirby_jump.png'
  }
};

// Optional: Prevent accidental changes during runtime
Object.freeze(CONFIG);