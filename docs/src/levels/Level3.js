CONFIG.LEVELS[2] = {
  worldWidth: 12000,
  worldHeight: 800,
  startX: 300,
  platforms: [
    // ===== 第一段：热身 =====
    { gap: 0, altitude: 100, w: 160, h: 20 },
    { gap: 90, altitude: 170, w: 120, h: 20, hasCoin: true },
    { gap: 80, altitude: 240, w: 100, h: 20 },
    { gap: 90, altitude: 190, w: 100, h: 20, isVanish: true },

    // 第一个敌人（轻干扰）
    { gap: 100, altitude: 280, w: 140, h: 20, hasEnemy: true },

    { gap: 100, altitude: 340, w: 130, h: 20 },

    // ===== 第二段：消失节奏 =====
    { gap: 120, altitude: 420, w: 90, h: 20, isVanish: true },
    { gap: 80, altitude: 360, w: 80, h: 20, isVanish: true },
    { gap: 80, altitude: 300, w: 80, h: 20, isVanish: true },

    // 落点敌人（节奏点🔥）
    { gap: 90, altitude: 400, w: 120, h: 20, hasEnemy: true },

    // ===== 第三段：禁技能区 =====
    { gap: 140, altitude: 0, w: 260, h: 560, removesSkill: true },

    { gap: 90, altitude: 430, w: 70, h: 20 },
    { gap: 70, altitude: 380, w: 70, h: 20 },
    { gap: 70, altitude: 330, w: 70, h: 20 },

    { gap: 80, altitude: 280, w: 90, h: 20, isVanish: true },

    // 第二个干扰点
    { gap: 90, altitude: 240, w: 140, h: 20, hasEnemy: true },

    // ===== 第四段：移动技巧 =====
    {
      gap: 110, altitude: 320, w: 110, h: 20,
      isMoving: true, rangeX: 140, rangeY: 0, speed: 0.045
    },

    // moving 后马上敌人（压节奏🔥）
    { gap: 120, altitude: 360, w: 90, h: 20, hasEnemy: true },

    {
      gap: 120, altitude: 420, w: 100, h: 20,
      isMoving: true, rangeX: 0, rangeY: 120, speed: 0.045
    },

    { gap: 110, altitude: 360, w: 80, h: 20 },
    { gap: 80, altitude: 430, w: 80, h: 20, hasCoin: true },

    // ===== 第五段：精准跳 =====
    { gap: 90, altitude: 280, w: 60, h: 20 },
    { gap: 70, altitude: 340, w: 60, h: 20 },
    { gap: 70, altitude: 400, w: 60, h: 20 },

    { gap: 70, altitude: 360, w: 60, h: 20, isVanish: true },
    { gap: 70, altitude: 440, w: 60, h: 20 },
    { gap: 70, altitude: 320, w: 60, h: 20, isVanish: true },

    // 高处干扰敌人（心理压力）
    { gap: 100, altitude: 400, w: 180, h: 20, hasEnemy: true },

    { gap: 80, altitude: 390, w: 90, h: 20 },

    // ===== 第六段：Boss前 =====
    {
      gap: 100, altitude: 300, w: 100, h: 20,
      isMoving: true, rangeX: 180, rangeY: 0, speed: 0.05
    },

    { gap: 120, altitude: 380, w: 90, h: 20 },
    { gap: 90, altitude: 450, w: 90, h: 20 },

    { gap: 100, altitude: 420, w: 220, h: 20, hasCoin: true },

    // ===== Boss =====
    { gap: 150, altitude: 0, w: 2000, h: 500, hasBoss: true }
  ],


  holes: [
    { startX: 300, endX: 12000 },
  ],
  items: [
    { type: "JUMP_BOOSTER", x: 2200, y: 300 }
  ]
};