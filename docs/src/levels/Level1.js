CONFIG.LEVELS[0] = {
  worldWidth: 12000,
  worldHeight: 800,
  assets: {
    platformTile: "./assets/platform_tile1.png",
    backgrounds: {
      far: "./assets/bg/lv1/farBg1.png",
      midBack: "./assets/bg/lv1/midBackBg1.png",
      midFront: "./assets/bg/lv1/midFrontBg1.png",
      front: "./assets/bg/lv1/frontBg1.png"
    },
    enemySprites: {
      idle: { path: "./assets/fire_spirit/idle.png", w: 128, h: 128, count: 6 },
      walk: { path: "./assets/fire_spirit/walk.png", w: 128, h: 128, count: 7 },
      hurt: { path: "./assets/fire_spirit/hurt.png", w: 128, h: 128, count: 3 },
    }
  },
  platforms: [
    // --- 前半段保持绝对不变 ---
    { gap: 0, altitude: 0, w: 240, h: 80 },
    { gap: 100, altitude: 100, w: 160, h: 40 },
    { gap: 120, altitude: 180, w: 120, h: 40, hasCoin: true },
    { gap: 150, altitude: 150, w: 200, h: 40, hasEnemy: true },

    {
      gap: 120, altitude: 220, w: 120, h: 40,
      isMoving: true, rangeX: 0, rangeY: 130, speed: 0.04
    },
    { gap: 50, altitude: 360, w: 160, h: 40, hasCheckpoint: true },

    { gap: 105, altitude: 0, w: 240, h: 580, removesSkill: true },

    { gap: 150, altitude: 500, w: 320, h: 40, hasCoin: true },
    { gap: 150, altitude: 300, w: 200, h: 40, hasEnemy: true },

    {
      gap: 180, altitude: 350, w: 160, h: 40,
      isMoving: true, rangeX: 80, rangeY: 0, speed: 0.02
    },
    { gap: 180, altitude: 350, w: 160, h: 40, hasCoin: true, hasCheckpoint: true },
    {
      gap: 180, altitude: 400, w: 160, h: 40,
      isMoving: true, rangeX: 80, rangeY: 0, speed: 0.02
    },

    { gap: 150, altitude: 400, w: 240, h: 40, hasEnemy: true },

    { gap: 180, altitude: 0, w: 240, h: 420 },

    // 第二个跷跷板（已根据上个指令调低到350）
    { gap: 150, altitude: 350, w: 320, h: 40, hasCoin: true },

    // --- 核心修改点：在跷跷板之后先加一个静止平台 ---
    { gap: 150, altitude: 320, w: 200, h: 40, hasCheckpoint: true },

    // 然后再接移动平台
    {
      gap: 120, altitude: 300, w: 120, h: 40,
      isMoving: true, rangeX: 0, rangeY: 150, speed: 0.03
    },
    { gap: 150, altitude: 350, w: 200, h: 40, hasEnemy: true },

    { gap: 150, altitude: 450, w: 120, h: 40, hasCoin: true },
    {
      gap: 150, altitude: 400, w: 160, h: 40,
      isMoving: true, rangeX: 120, rangeY: 0, speed: 0.03
    },

    { gap: 150, altitude: 0, w: 2000, h: 500, hasBoss: true, bossType: "regular" }
  ],
  items: [
    { type: "JUMP_BOOSTER", x: 1420, y: 370 }
  ],
  bossArena: {
    worldWidth: 800,
    worldHeight: 800,
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};