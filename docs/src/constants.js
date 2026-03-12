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
      worldWidth: 12000, 
      worldHeight: 800, 
      startX: 300,
      platforms: [
        // --- 前半段保持绝对不变 ---
        { gap: 0,   altitude: 100, w: 150, h: 20 },
        { gap: 120, altitude: 180, w: 120, h: 20, hasCoin: true },
        { gap: 150, altitude: 150, w: 200, h: 20, hasEnemy: true },

        { gap: 120, altitude: 220, w: 100, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 130, speed: 0.04 },
        { gap: 50,  altitude: 360, w: 150, h: 20 }, 
        
        { gap: 105, altitude: 0,   w: 220, h: 580 }, 

        { gap: 150, altitude: 500, w: 300, h: 20, hasCoin: true },
        { gap: 150, altitude: 300, w: 200, h: 20, hasEnemy: true }, 

        { gap: 180, altitude: 350, w: 150, h: 20,  
          isMoving: true, rangeX: 80, rangeY: 0, speed: 0.02 }, 
        { gap: 180, altitude: 350, w: 150, h: 20, hasCoin: true }, 
        { gap: 180, altitude: 400, w: 150, h: 20, 
          isMoving: true, rangeX: 80, rangeY: 0, speed: 0.02 },

        { gap: 150, altitude: 400, w: 250, h: 20, hasEnemy: true }, 

        { gap: 180, altitude: 0,   w: 250, h: 420 }, 
        
        // 第二个跷跷板（已根据上个指令调低到350）
        { gap: 150, altitude: 350, w: 300, h: 20, hasCoin: true },

        // --- 核心修改点：在跷跷板之后先加一个静止平台 ---
        { gap: 150, altitude: 320, w: 180, h: 20 }, 
        
        // 然后再接移动平台
        { gap: 120, altitude: 300, w: 100, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 150, speed: 0.03 },
        { gap: 150, altitude: 350, w: 200, h: 20, hasEnemy: true },

        { gap: 150, altitude: 450, w: 120, h: 20, hasCoin: true },
        { gap: 150, altitude: 400, w: 150, h: 20,  
          isMoving: true, rangeX: 120, rangeY: 0, speed: 0.03 },
        
        { gap: 150, altitude: 0, w: 2000, h: 500 }
      ],
      holes: [
        { startX: 300, endX: 12000 },
      ],
      collectables: [
        { type: "JUMP_BOOSTER", x: 1385,  y: 380 }
      ]
    },

    THREE: {
      worldWidth: 12000, 
      worldHeight: 800, 
      startX: 300,
      platforms: [
        // --- 前半段保持绝对不变 ---
        { gap: 0,   altitude: 100, w: 150, h: 20 },
        { gap: 120, altitude: 180, w: 120, h: 20, hasCoin: true, vanish: true },
        { gap: 120, altitude: 150, w: 200, h: 20, hasEnemy: true },

        { gap: 120, altitude: 200, w: 100, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 130, speed: 0.045 },
        { gap: 50,  altitude: 360, w: 150, h: 20 }, 

         //获得能力需要跨越的大平台
        { gap: 105, altitude: 0,   w: 220, h: 580 }, 

        { gap: 150, altitude: 500, w: 300, h: 20, hasCoin: true, hasEnemy: true},
        { gap: 150, altitude: 300, w: 200, h: 20, hasEnemy: true }, 

        { gap: 180, altitude: 350, w: 150, h: 20,  
          isMoving: true, rangeX: 120, rangeY: 0, speed: 0.045 }, 
        { gap: 180, altitude: 350, w: 60, h: 20, hasCoin: true }, 
        { gap: 120, altitude: 300, w: 150, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 120, speed: 0.045 },

        { gap: 150, altitude: 500, w: 250, h: 20, hasCoin: true, hasEnemy: true }, 
        
        { gap: 180, altitude: 0,   w: 250, h: 420 }, 
        
        //加一个“连续跳压力段”
        { gap: 150, altitude: 420, w: 50, h: 20, vanish: true },
        { gap: 150, altitude: 360, w: 50, h: 20, vanish: true },
        { gap: 120, altitude: 300, w: 110, h: 20, hasEnemy: true },
        
        // 第二个跷跷板（已根据上个指令调低到350）
        { gap: 150, altitude: 350, w: 300, h: 20, hasCoin: true },

        { gap: 150, altitude: 320, w: 200, h: 20 }, 
        
        // 然后再接移动平台
        { gap: 120, altitude: 300, w: 120, h: 20, 
          isMoving: true, rangeX: 0, rangeY: 120, speed: 0.04 },
        { gap: 150, altitude: 450, w: 200, h: 20, hasEnemy: true },

        { gap: 150, altitude: 450, w: 120, h: 20, hasCoin: true },
        { gap: 150, altitude: 400, w: 120, h: 20,
           isMoving: true, rangeX: 120, rangeY: 0, speed: 0.045},
        
        { gap: 100, altitude: 0, w: 2000, h: 500 }
      ],
      holes: [
        { startX: 300, endX: 12000 },
      ],
      collectables: [
        { type: "JUMP_BOOSTER", x: 1385,  y: 380 }
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