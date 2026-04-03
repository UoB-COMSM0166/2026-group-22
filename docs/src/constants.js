// src/constants.js
const CONFIG = {
  // World Physics
  WORLD: {
    GRAVITY: 0.2,
    FLOOR_OFFSET: 40, // How far from the bottom the "floor" is
    CEILING_LIMIT: 0,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    WIDTH: 2000,
    HEIGHT: 400,
  },

  LEVELS: [], // initialised as an empty array then add each level in their own corresponding file
  
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

  SKILLS: {
    NONE: null,
    JUMP: "JUMP_BOOST",
    BOW: "ARCHERY",
    SPEED: "SPEED_BOOST",
    SHIELD: "INVINCIBILITY"
  },

  ITEM_TYPES: {
    JUMP_BOOSTER: JumpBooster,
    BOW_PICKUP: BowItem // 新增：弓箭道具
  },

  CONTROLS: {
    JUMP: 32, // Space
    LEFT: 65, // Left Arrow
    RIGHT: 68 // Right Arrow
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