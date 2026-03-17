CONFIG.LEVELS[0] = {
  worldWidth: 12000, 
  worldHeight: 800,
  backgrounds: {
    far: "assets/bg/farBg1.png",
    midBack: "assets/bg/midBackBg1.png",
    midFront: "assets/bg/midFrontBg1.png",
    front: "assets/bg/frontBg1.png"
  },
  startX: 300,
  platforms: [
    // --- 前半段保持绝对不变 ---
    { gap: 0,   altitude: 100, w: 150, h: 20 },
    { gap: 120, altitude: 180, w: 120, h: 20, hasCoin: true },
    { gap: 150, altitude: 150, w: 200, h: 20, hasEnemy: true },

    { gap: 120, altitude: 220, w: 100, h: 20, 
      isMoving: true, rangeX: 0, rangeY: 130, speed: 0.04 },
    { gap: 50,  altitude: 360, w: 150, h: 20 }, 
    
    { gap: 105, altitude: 0,   w: 220, h: 580, removesSkill: true }, 

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
    
    { gap: 150, altitude: 0, w: 2000, h: 500, hasBoss: true}
  ],
  holes: [
    { startX: 300, endX: 12000 },
  ],
  collectables: [
    { type: "JUMP_BOOSTER", x: 1385,  y: 380 }
  ]
};