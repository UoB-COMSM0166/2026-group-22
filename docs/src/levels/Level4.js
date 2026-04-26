CONFIG.LEVELS[3] = {
  worldWidth: 15000,
  worldHeight: 1600,
  assets: {
    enemySprites: {
      idle: { path: "skeleton/idle.png", w: 128, h: 128, count: 7 },
      walk: { path: "skeleton/walk.png", w: 128, h: 128, count: 6 },
      hurt: { path: "skeleton/hurt.png", w: 128, h: 128, count: 6 },
    },
    bossSprites: {
      idle: { path: "karasu_tengu/idle.png", w: 128, h: 128, count: 6 },
      attack: { path: "karasu_tengu/attack_1.png", w: 128, h: 128, count: 6 },
      hurt: { path: "karasu_tengu/hurt.png", w: 128, h: 128, count: 3 },
      dead: { path: "karasu_tengu/dead.png", w: 128, h: 128, count: 6 }
    }
  },
  enemyConfig: {
    width: 40,
    height: 60,
    visualW: 100,
    visualH: 110,
    visualAlignment: 'bottom',
    maxHp: 150,
    damage: 12,
    speed: 1.7
  },
  platforms: [
    { gap: 0, altitude: 950, w: 320, h: 40 },
    { gap: 150, altitude: 800, w: 200, h: 40 },

    { gap: 200, altitude: 1000, w: 160, h: 40, isChainDrop: true, dropAltitude: 800 },

    { gap: 150, altitude: 800, w: 320, h: 40, hasEnemy: true },

    { gap: 150, altitude: 800, w: 120, h: 40, isVanish: true },
    { gap: 120, altitude: 800, w: 120, h: 40, isMoving: true, rangeX: 100, rangeY: 0, speed: 0.03 },

    { gap: 200, altitude: 800, w: 160, h: 40 },

    { gap: 150, altitude: 850, w: 120, h: 40, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.03 },

    { gap: 150, altitude: 850, w: 240, h: 40, hasCheckpoint: true, hasCoin: true },

    { gap: 150, altitude: 850, w: 120, h: 40, isVanish: true },
    { gap: 120, altitude: 850, w: 120, h: 40, isVanish: true },

    { gap: 120, altitude: 850, w: 160, h: 40 },

    { gap: 200, altitude: 1100, w: 160, h: 40, isChainDrop: true, dropAltitude: 850 },

    { gap: 150, altitude: 850, w: 200, h: 40, hasEnemy: true },

    { gap: 150, altitude: 850, w: 160, h: 40 },

    { gap: 200, altitude: 1100, w: 120, h: 40, isChainDrop: true, dropAltitude: 750 },
    { gap: 150, altitude: 1000, w: 120, h: 40, isChainDrop: true, dropAltitude: 650 },


    { gap: 150, altitude: 650, w: 240, h: 40, hasCheckpoint: true, hasCoin: true },

    { gap: 150, altitude: 650, w: 120, h: 40, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.025 },
    { gap: 180, altitude: 650, w: 120, h: 40, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.025 },
    { gap: 150, altitude: 750, w: 200, h: 40, hasEnemy: true },

    { gap: 150, altitude: 750, w: 120, h: 40, isVanish: true },
    { gap: 120, altitude: 750, w: 120, h: 40, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.04 },

    { gap: 150, altitude: 750, w: 160, h: 40 },
    { gap: 220, altitude: 900, w: 120, h: 40, isChainDrop: true, dropAltitude: 750 },
    { gap: 150, altitude: 900, w: 120, h: 40, isChainDrop: true, dropAltitude: 750 },

    { gap: 150, altitude: 750, w: 80, h: 40, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 40, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 40, isVanish: true },

    { gap: 150, altitude: 750, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 550, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 350, w: 80, h: 40, isVanish: true, hasCoin: true },

    { gap: 150, altitude: 150, w: 480, h: 40, hasCheckpoint: true, hasCoin: true },

    { gap: 200, altitude: 0, w: 2000, h: 250, hasBoss: true, bossType: "summoner" }
  ],
  items: [
    { type: "BOW", x: 200, y: 580 },
  ],
  bossArena: {
    worldWidth: 800,
    worldHeight: 800,
    bossConfig: {
      width: 150,
      height: 150,
      visualW: 150,
      visualH: 150,
      visualAlignment: 'bottom',
      maxHp: 1000,
      speed: 0
    },
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};