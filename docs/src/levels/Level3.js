CONFIG.LEVELS[2] = {
  worldWidth: 12000,
  worldHeight: 800,
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
    maxHp: 120,
    damage: 10,
    speed: 1.5
  },
  platforms: [
    { gap: 0, altitude: 0, w: 240, h: 80 },
    { gap: 100, altitude: 100, w: 200, h: 40, coins: [-45, 0, 45] },
    { gap: 90, altitude: 170, w: 120, h: 40, hasCoin: true },
    { gap: 80, altitude: 240, w: 120, h: 40, hasCoin: true },
    { gap: 90, altitude: 190, w: 120, h: 40, hasCoin: true },

    { gap: 100, altitude: 320, w: 240, h: 40, hasEnemy: true },

    { gap: 100, altitude: 340, w: 120, h: 40, isVanish: true, hasCheckpoint: true },
    { gap: 120, altitude: 420, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 80, altitude: 360, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 80, altitude: 300, w: 80, h: 40, isVanish: true, hasCoin: true },

    { gap: 90, altitude: 280, w: 120, h: 40, hasCheckpoint: true },

    { gap: 0, altitude: 0, w: 400, h: 320 },
    { gap: -400, altitude: 370, w: 400, h: 400 },
    { gap: 0, altitude: 280, w: 120, h: 40, removesSkill: true },

    { gap: 90, altitude: 330, w: 80, h: 40, hasCoin: true, isVanish: true },
    { gap: 70, altitude: 380, w: 80, h: 40, hasCoin: true, isVanish: true },
    { gap: 70, altitude: 330, w: 80, h: 40, hasCoin: true, isVanish: true },

    { gap: 80, altitude: 280, w: 80, h: 40, hasCoin: true, isVanish: true },

    { gap: 90, altitude: 240, w: 240, h: 40, hasEnemy: true, hasCheckpoint: true },

    {
      gap: 160, altitude: 320, w: 120, h: 40,
      isMoving: true, rangeX: 100, rangeY: 0, speed: 0.035
    },

    { gap: 180, altitude: 360, w: 240, h: 40, hasEnemy: true },

    {
      gap: 120, altitude: 420, w: 120, h: 40,
      isMoving: true, rangeX: 0, rangeY: 120, speed: 0.045
    },

    { gap: 110, altitude: 360, w: 80, h: 40, hasCoin: true },
    { gap: 80, altitude: 430, w: 80, h: 40, hasCoin: true, hasCheckpoint: true },
    { gap: 90, altitude: 280, w: 80, h: 40, hasCoin: true },
    { gap: 70, altitude: 340, w: 80, h: 40, hasCoin: true },
    { gap: 70, altitude: 400, w: 80, h: 40, hasCoin: true },
    { gap: 70, altitude: 360, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 70, altitude: 440, w: 80, h: 40, hasCoin: true },
    { gap: 70, altitude: 320, w: 80, h: 40, isVanish: true, hasCoin: true },
    { gap: 100, altitude: 400, w: 160, h: 40, hasEnemy: true, hasCheckpoint: true },
    { gap: 80, altitude: 390, w: 80, h: 40 },

    {
      gap: 120, altitude: 300, w: 120, h: 40,
      isMoving: true, rangeX: 100, rangeY: 0, speed: 0.04
    },

    { gap: 180, altitude: 380, w: 80, h: 40, hasCheckpoint: true },
    { gap: 90, altitude: 450, w: 80, h: 40 },
    { gap: 100, altitude: 420, w: 240, h: 40, hasCoin: true, coins: [-45, 0, 45] },

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
      maxHp: 1000,
      speed: 0
    },
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};