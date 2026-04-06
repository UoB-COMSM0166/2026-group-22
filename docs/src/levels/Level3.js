CONFIG.LEVELS[2] = {
  worldWidth: 12000,
  worldHeight: 800,
  startX: 300,
  backgrounds: {
    far: "assets/bg/lv2/farBg2.png",
    midBack: "assets/bg/lv2/midBackBg2.png",
    midFront: "assets/bg/lv2/midFrontBg2.png",
    front: "assets/bg/lv2/frontBg2.png"
  },
  platforms: [
    { gap: 0, altitude: 100, w: 200, h: 20, coins: [-45,0,45] },
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
    { gap: -400, altitude: 350, w: 400, h: 400 },
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
    { gap: 100, altitude: 420, w: 220, h: 20, hasCoin: true, coins: [-45,0,45]},

    // Boss 
    { gap: 150, altitude: 0, w: 2000, h: 500, hasSummonerBoss: true }
  ],


  holes: [
    { startX: 300, endX: 12000 },
  ],
  items: [
    { type: "SHRINK_POTION", x: 2320, y: 370 },
  ]
};