CONFIG.LEVELS[3] = {
  worldWidth: 15000,
  worldHeight: 1600,
  assets: {
    platformTile: "./assets/platform_tile1.png",
    backgrounds: {
      far: "./assets/bg/lv4/farBg4.png",
      midBack: "./assets/bg/lv4/midBackBg4.png",
      midFront: "./assets/bg/lv4/midFrontBg4.png",
      front: "./assets/bg/lv4/frontBg4.png"
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
      dead: { path: "./assets/karasu_tengu/dead.png", w: 128, h: 128, count: 6 }
    }
  },
  enemyConfig: {
    width: 60,
    height: 60,
    visualW: 240,
    visualH: 240,
    visualAlignment: 'bottom',
    maxHp: 50,
    damage: 5,
    speed: 1
  },
  platforms: [
    { gap: 0, altitude: 950, w: 300, h: 20 },
    { gap: 150, altitude: 800, w: 200, h: 20 },

    { gap: 200, altitude: 1000, w: 150, h: 20, isChainDrop: true, dropAltitude: 800 },

    { gap: 150, altitude: 800, w: 300, h: 20, hasEnemy: true },

    { gap: 150, altitude: 800, w: 120, h: 20, isVanish: true },
    { gap: 120, altitude: 800, w: 120, h: 20, isMoving: true, rangeX: 100, rangeY: 0, speed: 0.03 },

    { gap: 200, altitude: 800, w: 150, h: 20 },

    { gap: 150, altitude: 850, w: 120, h: 20, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.03 },

    { gap: 150, altitude: 850, w: 250, h: 20, hasCheckpoint: true, hasCoin: true },

    { gap: 150, altitude: 850, w: 120, h: 20, isVanish: true },
    { gap: 120, altitude: 850, w: 120, h: 20, isVanish: true },

    { gap: 120, altitude: 850, w: 150, h: 20 },

    { gap: 200, altitude: 1100, w: 150, h: 20, isChainDrop: true, dropAltitude: 850 },

    { gap: 150, altitude: 850, w: 200, h: 20, hasEnemy: true },

    { gap: 150, altitude: 850, w: 150, h: 20 },

    { gap: 200, altitude: 1100, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 },
    { gap: 150, altitude: 1000, w: 120, h: 20, isChainDrop: true, dropAltitude: 650 },


    { gap: 150, altitude: 650, w: 250, h: 20, hasCheckpoint: true, hasCoin: true },

    { gap: 150, altitude: 650, w: 120, h: 20, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.025 },
    { gap: 180, altitude: 650, w: 120, h: 20, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.025 },
    { gap: 150, altitude: 750, w: 200, h: 20, hasEnemy: true },

    { gap: 150, altitude: 750, w: 100, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 120, h: 20, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.04 },

    { gap: 150, altitude: 750, w: 180, h: 20 },
    { gap: 220, altitude: 900, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 },
    { gap: 150, altitude: 900, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 },

    { gap: 150, altitude: 750, w: 80, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 20, isVanish: true },

    { gap: 150, altitude: 750, w: 80, h: 20, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 550, w: 80, h: 20, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 350, w: 80, h: 20, isVanish: true, hasCoin: true },

    { gap: 150, altitude: 150, w: 500, h: 20, hasCheckpoint: true, hasCoin: true },

    { gap: 200, altitude: 0, w: 3000, h: 250, hasBoss: true, bossType: "crusher" }
  ],
  items: [
    { type: "BOW", x: 200, y: 580 },
    { type: "JUMP_BOOSTER", x: 10500, y: 1400 }
  ],
  bossArena: {
    worldWidth: 1200,
    worldHeight: 800,
    bossConfig: {
      width: 150,
      height: 150,
      visualW: 150,
      visualH: 150,
      visualAlignment: 'bottom',
      maxHp: 500,
      speed: 0
    },
    platforms: [
      { gap: 0, altitude: 0, w: 1200, h: 100 },

      { gap: -950, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 }
    ]
  }
};