const CONFIG = {
  SYSTEM: {
    SAVE_KEY: "isle_save_v1",
  },

  DIFFICULTY: {
    EASY: "EASY",
    DIFFICULT: "DIFFICULT"
  },

  DIFFICULTY_PRESETS: {
    EASY: { hp: 1.0, damage: 1.0, speed: 1.0 },
    DIFFICULT: { hp: 2.0, damage: 2, speed: 1.2 }
  },

  WORLD: {
    GRAVITY: 0.2,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
  },

  CAMP: {
    DIALOGUE: [
      "Signal connecting...",
      "Handshake complete.",
      "Welcome to the Isle.\nFour doors. Four rules. One escape.",
      "The island does not sleep.\nIt watches. It listens.",
      "The doors are not portals.\nThey are tests.",
      "Each door leads to a trial.\nEach trial rewrites you.",
      "Choose a path.\nBut understand this:",
      "Once you enter,\nyou will not return unchanged.",
      "Failure is not death.\nIt is memory.",
      "The fire is safe.\nFor now.",
      "When the doors awaken,\nthe rules begin.",
      "Proceed."
    ],
    VIEWS: [
      {
        name: "4 Doors",
        imgKey: 'camp_scene',
        hotspots: [
          { id: "shop", label: "Camp Shop", x: 183, y: 260, w: 270, h: 270, action: "shop" },
          { id: "board", label: "Board", x: 427, y: 465, w: 220, h: 155, action: "board" },
          { id: "door1", label: "Door 1", x: 613, y: 308, w: 120, h: 140, action: "door", val: 1 },
          { id: "door2", label: "Door 2", x: 788, y: 311, w: 113, h: 140, action: "door", val: 2 },
          { id: "door3", label: "Door 3", x: 961, y: 314, w: 103, h: 140, action: "door", val: 3 },
          { id: "door4", label: "Door 4", x: 1128, y: 311, w: 116, h: 146, action: "door", val: 4 },
        ]
      }
    ]
  },

  SHOP: {
    START_COINS: 25,
    SELL_REFUND_RATE: 1.0,

    SLOTS: [
      { itemId: "ion_fury", rx: 0.287, ry: 0.255, rw: 0.075, rh: 0.100 },
      { itemId: "the_shredder", rx: 0.375, ry: 0.255, rw: 0.075, rh: 0.100 },
      { itemId: "vipers_kiss", rx: 0.463, ry: 0.255, rw: 0.075, rh: 0.100 },
      { itemId: "titans_breath", rx: 0.551, ry: 0.255, rw: 0.075, rh: 0.100 },
    ],

    ITEMS: [
      {
        id: "pistol",
        name: "Pistol",
        type: "weapon",
        price: 3,
        damage: 10,
        bulletSpeed: 8,
        cooldown: 30,
        desc: ["A reliable handgun.", "Good for single targets."]
      },
      {
        id: "ion_fury",
        name: "Ion Fury",
        price: 5,
        damage: 15,
        bulletSpeed: 12,
        cooldown: 20,
        desc: ["Sleek energy revolver.", "High precision, low recoil."]
      },
      {
        id: "the_shredder",
        name: "The Shredder",
        price: 8,
        damage: 8,
        bulletSpeed: 18,
        cooldown: 8,
        desc: ["Rapid-fire void repeater.", "Devastates at high speeds."]
      },
      {
        id: "vipers_kiss",
        name: "Viper's Kiss",
        price: 12,
        damage: 35,
        bulletSpeed: 10,
        cooldown: 35,
        desc: ["Corrosive burst rifle.", "Melts through armor easily."]
      },
      {
        id: "titans_breath",
        name: "Titan's Breath",
        price: 20,
        damage: 75,
        bulletSpeed: 8,
        cooldown: 60,
        desc: ["Heavy thermal cannon.", "Massive damage, slow fire."]
      },
    ]
  },

  LEVELS: [], // initialised as an empty array then add each level in their own corresponding file

  // Player specific
  PLAYER: {
    START_X: 100,
    START_Y: 600,
    WIDTH: 40,
    HEIGHT: 80,
    SPEED: 3,
    MAX_JUMP_COUNT: 2,
    LIFT: -5.5,
    HP: 100,
    ANIMATION_SPEED: 10
  },

  PLAYER_STATES: {
    NORMAL: 'NORMAL',
    INHALING: 'INHALING',
    BOW_CHARGING: 'BOW_CHARGING',
    HURT: 'HURT'
  },

  SKILLS: {
    NONE: null,
    JUMP: "JUMP_BOOST",
    SHRINK: "SHRINK",
    BOW: "ARCHERY"
  },

  ITEM_TYPES: {
    JUMP_BOOSTER: JumpBooster,
    SHRINK_POTION: ShrinkPotion,
    BUBBLE: Bubble,
    BOW: Bow
  },

  CONTROLS: {
    JUMP: 32,    // Space
    LEFT: 65,    // A
    RIGHT: 68,   // D
    SHOOT: 74,   // J (Star bullets)
    INHALE: 75,  // K (Suction)
    BOW: 76      // L (Archery Skill)
  },
};

Object.freeze(CONFIG);