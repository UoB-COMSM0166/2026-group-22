// src/constants.js
const CONFIG = {
  SYSTEM: {
    SAVE_KEY: "isle_save_v1",
  },

  // World Physics
  WORLD: {
    GRAVITY: 0.2,
    CEILING_LIMIT: 0,
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    WIDTH: 2000,
    HEIGHT: 400,
  },

  CAMP: {
    DIALOGUE: [
      "Signal connecting...",
      "Handshake complete.",
      "Welcome to the Isle.\nFour doors.\nFour rules.\nOne escape.",
      "The island does not sleep.\nIt watches.\nIt listens.",
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
      { itemId: "pistol", rx: 0.287, ry: 0.255, rw: 0.075, rh: 0.100 },
      { itemId: "fireball", rx: 0.375, ry: 0.255, rw: 0.075, rh: 0.100 },
    ],

    ITEMS: [
      {
        id: "pistol",
        name: "Pistol",
        type: "weapon",
        price: 3,
        damage: 10,
        desc: ["A reliable handgun.", "Good for single targets."],
        iconKey: "icon_pistol",
      },
      {
        id: "fireball",
        name: "Fireball Magic",
        type: "spell",
        price: 4,
        damage: 25,
        desc: ["Cast a blazing fireball.", "Great for crowd damage."],
        iconKey: "icon_fireball",
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
    LIFT: -5.5, // Jump/Float power
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
    BOW: "ARCHERY",
    SPEED: "SPEED_BOOST",
    SHIELD: "INVINCIBILITY"
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

// Optional: Prevent accidental changes during runtime
Object.freeze(CONFIG);