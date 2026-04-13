CONFIG.LEVELS[1] = {
  worldWidth: 6300,
  worldHeight: 800,
  assets: {
    platformTile: "./assets/platform_tile2.png",
    backgrounds: {
      far: "assets/bg/lv2/farBg2.png",
      midBack: "assets/bg/lv2/midBackBg2.png",
      midFront: "assets/bg/lv2/midFrontBg2.png",
      front: "assets/bg/lv2/frontBg2.png"
    }
  },
  bubbleMode: true,

  platforms: [
    // a series of coins on one a long platform
    { gap: 0, altitude: 0, w: 240, h: 80 },
    { gap: 100, altitude: 100, w: 240, h: 40, coins: [-80, 0, 80] },
    { gap: 150, altitude: 160, w: 320, h: 40, coins: [-80, 40] },
    // a series of vanish platforms
    { gap: 150, altitude: 220, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 270, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 320, w: 120, h: 40, isVanish: true, hasCoin: true },
    { gap: 90, altitude: 370, w: 120, h: 40, isVanish: true, hasCoin: true },

    // a series of enemy platforms
    { gap: 100, altitude: 260, w: 120, h: 40, hasEnemy: true },
    { gap: 90, altitude: 320, w: 120, h: 40 },
    { gap: 100, altitude: 280, w: 120, h: 40, hasEnemy: true },
    { gap: 90, altitude: 360, w: 80, h: 40 },
    { gap: 70, altitude: 310, w: 120, h: 40, isVanish: true, hasEnemy: true },
    { gap: 70, altitude: 380, w: 80, h: 40, hasCheckpoint: true },

    // moving platforms 
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

    // a series of vanished platforms
    { gap: 200, altitude: 380, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 90, altitude: 290, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 100, altitude: 277, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 90, altitude: 360, w: 160, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 70, altitude: 310, w: 120, h: 40, isVanish: true, coins: [-80, 40] },
    { gap: 70, altitude: 380, w: 80, h: 40, hasCoin: true },

    // a series enemy platforms
    { gap: 100, altitude: 260, w: 120, h: 40, hasEnemy: true, hasCoin: true },
    { gap: 90, altitude: 320, w: 120, h: 40, hasEnemy: true, hasCoin: true },
    { gap: 90, altitude: 260, w: 1000, h: 40, hasSummonerBoss: true }
  ],

  items: [
    { type: "BUBBLE", x: 430, y: 620 },
    { type: "BUBBLE", x: 1674, y: 420 },
    { type: "BUBBLE", x: 2530, y: 420 },
    { type: "BUBBLE", x: 3120, y: 360 },
    { type: "BUBBLE", x: 3930, y: 300 },
    { type: "BUBBLE", x: 4740, y: 400 },
    { type: "BUBBLE", x: 5790, y: 440 }
  ]
};
