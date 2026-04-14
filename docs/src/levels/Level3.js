CONFIG.LEVELS[2] = {
  worldWidth: 12000,
  worldHeight: 800,
  assets: {
    platformTile: "./assets/platform_tile1.png",
    backgrounds: {
      far: "./assets/bg/lv3/farBg3.png",
      midBack: "./assets/bg/lv3/midBackBg3.png",
      midFront: "./assets/bg/lv3/midFrontBg3.png",
      front: "./assets/bg/lv3/frontBg3.png"
    },
    enemySprites: {
      idle: { path: "./assets/skeleton/idle.png", w: 128, h: 128, count: 7 },
      walk: { path: "./assets/skeleton/walk.png", w: 128, h: 128, count: 6 },
      hurt: { path: "./assets/skeleton/hurt.png", w: 128, h: 128, count: 6 },
    },
    bossSprites: {
      idle: { path: "./assets/karasu_tengu/idle.png", w: 128, h: 128, count: 6 },
      attack: { path: "./assets/karasu_tengu/attack_1.png", w: 128, h: 128, count: 6 },
      hurt: { path: "./assets/karasu_tengu/hurt.png", w: 128, h: 128, count: 3 },
    }
  },
  enemyConfig: {
    width: 40,
    height: 60,
    visualW: 100,
    visualH: 110,
    visualAlignment: 'bottom',
    maxHp: 50,
    speed: 1
  },
  platforms: [
    { gap: 0, altitude: 0, w: 240, h: 80 },
    { gap: 100, altitude: 100, w: 200, h: 20, coins: [-45, 0, 45] },
    { gap: 90, altitude: 170, w: 120, h: 20, hasCoin: true },
    { gap: 80, altitude: 240, w: 100, h: 20, hasCoin: true },
    { gap: 90, altitude: 190, w: 100, h: 20, hasCoin: true },

    // one enemy platforms
    { gap: 100, altitude: 320, w: 250, h: 20, hasEnemy: true },

    // a series of vanishing platforms
    { gap: 100, altitude: 340, w: 130, h: 20, isVanish: true, hasCheckpoint: true },
    { gap: 120, altitude: 420, w: 90, h: 20, isVanish: true, hasCoin: true },
    { gap: 80, altitude: 360, w: 80, h: 20, isVanish: true, hasCoin: true },
    { gap: 80, altitude: 300, w: 80, h: 20, isVanish: true, hasCoin: true },

    { gap: 90, altitude: 300, w: 120, h: 20, hasCheckpoint: true },

    // The design of the narrowed passage
    { gap: 0, altitude: 0, w: 400, h: 320 },
    { gap: -400, altitude: 370, w: 400, h: 400 },
    { gap: 0, altitude: 300, w: 100, h: 20, removesSkill: true },

    // A seires of coins and vanishing platforms
    { gap: 90, altitude: 330, w: 70, h: 20, hasCoin: true, isVanish: true },
    { gap: 70, altitude: 380, w: 70, h: 20, hasCoin: true, isVanish: true },
    { gap: 70, altitude: 330, w: 70, h: 20, hasCoin: true, isVanish: true },

    { gap: 80, altitude: 280, w: 90, h: 20, hasCoin: true, isVanish: true },

    { gap: 90, altitude: 240, w: 250, h: 20, hasEnemy: true, hasCheckpoint: true },

    // A horizontally moving platform
    {
      gap: 160, altitude: 320, w: 110, h: 20,
      isMoving: true, rangeX: 100, rangeY: 0, speed: 0.035
    },

    { gap: 180, altitude: 360, w: 250, h: 20, hasEnemy: true },

    // A vertically moving platform
    {
      gap: 120, altitude: 420, w: 100, h: 20,
      isMoving: true, rangeX: 0, rangeY: 120, speed: 0.045
    },

    { gap: 110, altitude: 360, w: 80, h: 20, hasCoin: true },
    { gap: 80, altitude: 430, w: 80, h: 20, hasCoin: true, hasCheckpoint: true },
    { gap: 90, altitude: 280, w: 60, h: 20, hasCoin: true },
    { gap: 70, altitude: 340, w: 60, h: 20, hasCoin: true },
    { gap: 70, altitude: 400, w: 60, h: 20, hasCoin: true },
    { gap: 70, altitude: 360, w: 60, h: 20, isVanish: true, hasCoin: true },
    { gap: 70, altitude: 440, w: 60, h: 20, hasCoin: true },
    { gap: 70, altitude: 320, w: 60, h: 20, isVanish: true, hasCoin: true },
    { gap: 100, altitude: 400, w: 180, h: 20, hasEnemy: true, hasCheckpoint: true },
    { gap: 80, altitude: 390, w: 90, h: 20 },

    // one moving platforms
    {
      gap: 120, altitude: 300, w: 100, h: 20,
      isMoving: true, rangeX: 100, rangeY: 0, speed: 0.04
    },

    { gap: 180, altitude: 380, w: 90, h: 20, hasCheckpoint: true },
    { gap: 90, altitude: 450, w: 90, h: 20 },
    { gap: 100, altitude: 420, w: 220, h: 20, hasCoin: true, coins: [-45, 0, 45] },

    // Boss 
    { gap: 150, altitude: 0, w: 2000, h: 500, hasBoss: true, bossType: "summoner" }
  ],
  items: [
    { type: "SHRINK_POTION", x: 2320, y: 370 },
  ],
  bossArena: {
    worldWidth: 800,
    worldHeight: 800,
    bossConfig: {
      width: 80,
      height: 150,
      visualW: 200,
      visualH: 200,
      visualAlignment: 'bottom',
      maxHp: 500,
      speed: 0
    },
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};