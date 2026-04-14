CONFIG.LEVELS[3] = {
  worldWidth: 15000,
  worldHeight: 1600,
  assets: {
    platformTile: "./assets/platform_tile1.png",
    backgrounds: {
      far: "./assets/bg/lv2/farBg2.png",
      midBack: "./assets/bg/lv2/midBackBg2.png",
      midFront: "./assets/bg/lv2/midFrontBg2.png",
      front: "./assets/bg/lv2/frontBg2.png"
    },
    enemySprites: {
      idle: { path: "./assets/fire_spirit/idle.png", w: 128, h: 128, count: 6 },
      walk: { path: "./assets/fire_spirit/walk.png", w: 128, h: 128, count: 6 },
      hurt: { path: "./assets/fire_spirit/hurt.png", w: 128, h: 128, count: 6 },
    },
    bossSprites: {
      idle: { path: "./assets/karasu_tengu/idle.png", w: 128, h: 128, count: 6 },
      attack: { path: "./assets/karasu_tengu/attack_1.png", w: 128, h: 128, count: 6 },
      hurt: { path: "./assets/karasu_tengu/hurt.png", w: 128, h: 128, count: 3 },
    }
  },
  enemyConfig: {
    width: 60,
    height: 60,
    visualW: 240,
    visualH: 240,
    visualAlignment: 'bottom',
    maxHp: 50,
    speed: 1
  },
  platforms: [
    // ==========================================
    // 阶段一：高台神弓 -> 落地 -> 仰望第一锁链
    // ==========================================
    { gap: 0, altitude: 950, w: 300, h: 20 }, // 出生高台拿弓

    { gap: 150, altitude: 800, w: 200, h: 20 }, // 往下跳，安稳落地

    // 高度差 350，视野绝佳，中高蓄力即可命中！
    { gap: 200, altitude: 1000, w: 150, h: 20, isChainDrop: true, dropAltitude: 800 },

    { gap: 150, altitude: 800, w: 300, h: 20, hasEnemy: true },

    // ==========================================
    // 阶段二：混合跑酷 (消失 + 移动)
    // ==========================================
    { gap: 150, altitude: 800, w: 120, h: 20, isVanish: true }, // 踩了就跑
    { gap: 120, altitude: 800, w: 120, h: 20, isMoving: true, rangeX: 100, rangeY: 0, speed: 0.03 }, // 接水平电梯

    { gap: 200, altitude: 800, w: 150, h: 20 }, // 固定的歇脚点

    { gap: 150, altitude: 850, w: 120, h: 20, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.03 }, // 接垂直电梯

    // 第一个检查点！
    { gap: 150, altitude: 850, w: 250, h: 20, hasCheckpoint: true, hasCoin: true },

    // ==========================================
    // 阶段三：混合大考 (消失 -> 固定狙击台 -> 锁链)
    // ==========================================
    // 连续踩两块消失平台跨越峡谷
    { gap: 150, altitude: 850, w: 120, h: 20, isVanish: true },
    { gap: 120, altitude: 850, w: 120, h: 20, isVanish: true },

    // 【点睛之笔】：一块安稳的“固定狙击台”，让你在这里从容拉弓！
    { gap: 120, altitude: 850, w: 150, h: 20 },

    // 远处的靶子
    { gap: 200, altitude: 1100, w: 150, h: 20, isChainDrop: true, dropAltitude: 850 },

    { gap: 150, altitude: 850, w: 200, h: 20, hasEnemy: true },

    // ==========================================
    // 阶段四：锁链连续阶梯 (向下俯冲)
    // ==========================================
    { gap: 150, altitude: 850, w: 150, h: 20 }, // 稳固起跳台

    { gap: 200, altitude: 1100, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 },
    { gap: 150, altitude: 1000, w: 120, h: 20, isChainDrop: true, dropAltitude: 650 },

    // 第二个检查点！
    { gap: 150, altitude: 650, w: 250, h: 20, hasCheckpoint: true, hasCoin: true },

    // ==========================================
    // 阶段五：最后的移动连招
    // ==========================================
    { gap: 150, altitude: 650, w: 120, h: 20, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.025 },
    { gap: 180, altitude: 650, w: 120, h: 20, isMoving: true, rangeX: 0, rangeY: 100, speed: 0.025 },
    { gap: 150, altitude: 750, w: 200, h: 20, hasEnemy: true },

    // ==========================================
    // 阶段六：【新增】黎明前的试炼 (难度微升！)
    // ==========================================
    // 1. 消失平台起跳，接一个速度稍微加快的水平移动平台 (需要一点预判)
    { gap: 150, altitude: 750, w: 100, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 120, h: 20, isMoving: true, rangeX: 120, rangeY: 0, speed: 0.04 },

    // 2. 安稳落脚点，准备射击远处的“连环双锁链”
    { gap: 150, altitude: 750, w: 180, h: 20 }, // 宽大的狙击台
    { gap: 220, altitude: 900, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 }, // 第一个锁链
    { gap: 150, altitude: 900, w: 120, h: 20, isChainDrop: true, dropAltitude: 750 }, // 第二个锁链 (不用挪动位置，直接改蓄力力度连射！)

    // 3. 跨过自己搭的桥，迎接最后的三连极速消失跳！
    { gap: 150, altitude: 750, w: 80, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 20, isVanish: true },
    { gap: 120, altitude: 750, w: 80, h: 20, isVanish: true },
    // 阶段六：深渊坠落，决战前夕
    // ==========================================
    { gap: 150, altitude: 750, w: 80, h: 20, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 550, w: 80, h: 20, isVanish: true, hasCoin: true },
    { gap: 120, altitude: 350, w: 80, h: 20, isVanish: true, hasCoin: true },

    { gap: 150, altitude: 150, w: 500, h: 20, hasCheckpoint: true, hasCoin: true },

    // 最终 Boss 竞技场
    { gap: 200, altitude: 0, w: 3000, h: 250, hasBoss: true, bossType: "crusher" }
  ],
  items: [
    // 开局道具：神弓在出生高台上等你
    { type: "BOW", x: 200, y: 580 },

    // Boss 门前的补给
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
      // 1. The Main Floor (1200px wide for boss patrol)
      { gap: 0, altitude: 0, w: 1200, h: 100 },

      // 2. Overhead Chain Traps
      // currentX is 1200. We use negative gaps to move back over the floor.
      // centerX = 1200 + (-950) + 75 = 325
      { gap: -950, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },

      // currentX is now 400 (325 + 75). Next at centerX = 600
      // 400 + gap + 75 = 600 => gap = 125
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },

      // currentX is now 675. Next at centerX = 875
      // 675 + gap + 75 = 875 => gap = 125
      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },

      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 },

      { gap: 125, altitude: 550, w: 150, h: 20, isChainDrop: true, dropAltitude: 0 }
    ]
  }
};