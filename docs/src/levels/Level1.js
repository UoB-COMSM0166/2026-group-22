CONFIG.LEVELS[0] = {
  worldWidth: 12000,
  worldHeight: 800,
  assets: {
    tile: "lv1/env/tile.png",
    crackTile: null,
    backgrounds: {
      far: "lv1/bg/far.png",
      midBack: "lv1/bg/mid_back.png",
      midFront: "lv1/bg/mid_front.png",
      front: "lv1/bg/front.png"
    },
    enemySprites: {
      idle: { path: "crawler/idle.png", w: 370, h: 425, count: 1 },
      walk: { path: "crawler/walk.png", w: 484, h: 434, count: 3 },
      hurt: { path: "crawler/hurt.png", w: 381, h: 433, count: 1 },
    },
    bossSprites: {
      idle: { path: "ocular/idle.png", w: 828, h: 997, count: 1 },
      attack: { path: "ocular/attack.png", w: 731, h: 1027, count: 1 },
      hurt: { path: "ocular/hurt.png", w: 1872, h: 2254, count: 1 },
      dead: { path: "ocular/dead.png", w: 1653, h: 2247, count: 1 }
    }
  },
  enemyConfig: {
    width: 100,
    height: 100,
    visualW: 100,
    visualH: 100,
    visualAlignment: 'center',
    maxHp: 50,
    damage: 5,
    speed: 1
  },
  platforms: [
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

    { gap: 150, altitude: 350, w: 320, h: 40, hasCoin: true },

    { gap: 150, altitude: 320, w: 200, h: 40, hasCheckpoint: true },

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
    bossConfig: {
      width: 112,
      height: 160,
      visualW: 136,
      visualH: 160,
      visualAlignment: 'bottom',
      maxHp: 500,
      speed: 0
    },
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};