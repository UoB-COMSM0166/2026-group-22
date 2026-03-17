CONFIG.LEVELS[2] = {
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
      isMoving: true, rangeX: 0, rangeY: 170, speed: 0.045 },

    { gap: 100, altitude: 500, w: 250, h: 20, hasCoin: true, hasEnemy: true }, 
    
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
    
    { gap: 100, altitude: 0, w: 2000, h: 500, hasBoss: true }
  ],
  holes: [
    { startX: 300, endX: 12000 },
  ],
  collectables: [
    { type: "JUMP_BOOSTER", x: 1385,  y: 380 }
  ]
};