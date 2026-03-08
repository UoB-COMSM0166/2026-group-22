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
        { gap: 0,   altitude: 100, w: 150, h: 20 }, 
        { gap: 120, altitude: 180, w: 150, h: 20 }, 
        { gap: 120, altitude: 260, w: 150, h: 20 }, 

        // --- THE LONG LEAP ---
        { gap: 250, altitude: 220, w: 300, h: 20 }, 

        // --- NEW: THE HORIZONTAL SHUTTLE ---
        // This replaces the small static climb with a moving gap-crosser
        { 
          gap: 150, altitude: 350, w: 150, h: 20, 
          isMoving: true, rangeX: 120, rangeY: 0, speed: 0.02 
        }, 

        // --- NEW: THE VERTICAL LIFT ---
        // A platform that helps you reach the high underlapping area
        { 
          gap: 250, altitude: 450, w: 150, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 100, speed: 0.03 
        }, 

        // --- THE UNDERLAPPING CLIMB ---
        { gap: -50, altitude: 650, w: 200, h: 20 }, 

        // --- THE GOAL PLATEAU ---
        { gap: 380, altitude: 550, w: 400, h: 30 } 
      ],
      holes: [
        { startX: 300, endX: 3000 },
      ],
      coins: [
        { x: 375,  y: 640 }, // Platform 1
        { x: 645,  y: 560 }, // Platform 2
        { x: 1315, y: 520 }, // Platform 4
        { x: 1720, y: 390 }, // Moving Shuttle (Shifted X to match its start + range)
        { x: 2120, y: 290 }, // Vertical Lift (Shifted Y to give Kirby room to stand)
        { x: 2185, y: 90  }, // Underlapping platform
        { x: 2785, y: 180 }  // Goal Area
      ],
      collectables: [
        { type: "JUMP_BOOSTER", x: 915,  y: 480 }
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

  SKILLS: {
    NONE: null,
    JUMP: "JUMP_BOOST",
    SPEED: "SPEED_BOOST",
    SHIELD: "INVINCIBILITY"
  },

  COLLECTABLE_TYPES: {
    JUMP_BOOSTER: JumpBooster
  },

  CONTROLS: {
    JUMP: ' ', // Space
    LEFT: 'a', // Left Arrow
    RIGHT: 'd' // Right Arrow
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