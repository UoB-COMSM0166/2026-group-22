// ShopData.js
// Data-only: items, slots, constants

const SHOP_STORAGE_KEY = "camp_shop_state_v1";

const START_COINS = 10;
const SELL_REFUND_RATE = 1.0;

// Inventory bar layout config
const INVENTORY_MAX_SLOTS = 6;
const INVENTORY_OFFSET_X = 0.05; // move right
const INVENTORY_OFFSET_Y = 0.12; // move up

// Shelf slots (relative coords in tf space: 0..1)
const SHOP_SLOTS = [
  { itemId: "pistol",   rx: 0.287, ry: 0.255, rw: 0.075, rh: 0.100 },
  { itemId: "fireball", rx: 0.375, ry: 0.255, rw: 0.075, rh: 0.100 },
];

const SHOP_ITEMS = [
  {
    id: "pistol",
    name: "Pistol",
    price: 3,
    desc: ["A reliable handgun.", "Good for single targets."],
    iconKey: "pistol",
  },
  {
    id: "fireball",
    name: "Fireball Magic",
    price: 4,
    desc: ["Cast a blazing fireball.", "Great for crowd damage."],
    iconKey: "fireball",
  },
];

// // Inventory bar layout config
// const INVENTORY_MAX_SLOTS = 6;
// const INVENTORY_OFFSET_X = 0.05; // move right
// const INVENTORY_OFFSET_Y = 0.12; // move up
