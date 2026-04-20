CONFIG.LEVELS[1] = {
  worldWidth: 6300,
  worldHeight: 800,
  assets: {
    tile: "lv2/env/tile.png",
    crackTile: "lv2/env/crack_tile.png",
    backgrounds: {
      far: "lv2/bg/far.png",
      midBack: "lv2/bg/mid_back.png",
      midFront: "lv2/bg/mid_front.png",
      front: "lv2/bg/front.png"
    },
    enemySprites: {
      idle: { path: "plent/idle.png", w: 128, h: 128, count: 5 },
      walk: { path: "plent/walk.png", w: 128, h: 128, count: 9 },
      hurt: { path: "plent/hurt.png", w: 128, h: 128, count: 3 },
    },
    bossSprites: {
      idle: { path: "ocular/idle.png", w: 828, h: 997, count: 1 },
      attack: { path: "ocular/attack.png", w: 731, h: 1027, count: 1 },
      hurt: { path: "ocular/hurt.png", w: 1872, h: 2254, count: 1 },
      dead: { path: "ocular/dead.png", w: 1653, h: 2247, count: 1 }
    }
  },
  enemyConfig: {
    width: 60,
    height: 60,
    visualW: 140,
    visualH: 140,
    visualAlignment: 'bottom',
    maxHp: 50,
    damage: 5,
    speed: 1
  },
  bubbleMode: true,

  platforms: [
    { gap: 0, altitude: 0, w: 240, h: 80 },
    { gap: 100, altitude: 100, w: 240, h: 40, coins: [-80, 0, 80], hasEnemy: true },
    { gap: 150, altitude: 160, w: 320, h: 40, coins: [-80, 40] },

    { gap: 150, altitude: 220, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 270, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 320, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 370, w: 120, h: 40, isVanish: true, hasCoin: true },

    { gap: 100, altitude: 260, w: 120, h: 40 },
    { gap: 90, altitude: 320, w: 120, h: 40 },
    { gap: 100, altitude: 280, w: 120, h: 40 },
    { gap: 90, altitude: 360, w: 80, h: 40 },
    { gap: 70, altitude: 310, w: 120, h: 40, isVanish: true },
    { gap: 70, altitude: 380, w: 80, h: 40, hasCheckpoint: true },

    {
      gap: 150,
      altitude: 400,
      w: 120,
      h: 40,
      isMoving: true,
      rangeX: 60,
      rangeY: 0,
      speed: 0.04,
      isVanish: true
    },

    {
      gap: 150,
      altitude: 340,
      w: 120,
      h: 40,
      isMoving: true,
      rangeX: 60,
      rangeY: 0,
      speed: 0.04,
      isVanish: true
    },

    {
      gap: 200,
      altitude: 420,
      w: 160,
      h: 40,
      isMoving: true,
      rangeX: 65,
      rangeY: 0,
      speed: 0.04,
      isVanish: true
    },

    { gap: 200, altitude: 380, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 90, altitude: 290, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 100, altitude: 277, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 90, altitude: 360, w: 160, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 70, altitude: 310, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 70, altitude: 380, w: 80, h: 40, hasCoin: true },

    { gap: 100, altitude: 260, w: 120, h: 40, hasEnemy: true, hasCoin: true },
    { gap: 90, altitude: 320, w: 120, h: 40, hasEnemy: true, hasCoin: true },
    { gap: 90, altitude: 260, w: 1000, h: 40, hasBoss: true, bossType: "regular" }
  ],

  items: [
    { type: "BUBBLE", x: 430, y: 620 },
    { type: "BUBBLE", x: 1674, y: 420 },
    { type: "BUBBLE", x: 2530, y: 420 },
    { type: "BUBBLE", x: 3120, y: 360 },
    { type: "BUBBLE", x: 3930, y: 300 },
    { type: "BUBBLE", x: 4740, y: 400 },
    { type: "BUBBLE", x: 5790, y: 440 }
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
      maxHp: 800,

      speed: 0
    },
    platforms: [{ gap: 0, altitude: 0, w: 800, h: 100 }]
  }
};
