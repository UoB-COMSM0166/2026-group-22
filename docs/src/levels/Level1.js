CONFIG.LEVELS[0] = {
  worldWidth: 12000,
  worldHeight: 800,
  assets: {
    platformTile: "lv1/env/tile.png",
    backgrounds: {
      far: "lv1/bg/far.png",
      midBack: "lv1/bg/mid_back.png",
      midFront: "lv1/bg/mid_front.png",
      front: "lv1/bg/front.png"
    },
    enemySprites: {
      idle: { path: "fire_spirit/idle.png", w: 128, h: 128, count: 6 },
      walk: { path: "fire_spirit/walk.png", w: 128, h: 128, count: 7 },
      hurt: { path: "fire_spirit/hurt.png", w: 128, h: 128, count: 3 },
    },
    bossSprites: {
      idle: { path: "karasu_tengu/idle.png", w: 128, h: 128, count: 6 },
      attack: { path: "karasu_tengu/attack_1.png", w: 128, h: 128, count: 6 },
      hurt: { path: "karasu_tengu/hurt.png", w: 128, h: 128, count: 3 },
      dead: { path: "karasu_tengu/dead.png", w: 128, h: 128, count: 6 }
    }
  },
  enemyConfig: {
    width: 60,
    height: 60,
    visualW: 240,
    visualH: 240,
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