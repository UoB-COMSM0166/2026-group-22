// src/Shop/ShopData.js

/** * Persistence & Economy Constants
 */
const START_COINS = 25;        // Give Kirby a little more starting cash for testing
const SELL_REFUND_RATE = 1.0;  // 80% refund (more realistic than 100%)

/** * Inventory Bar Layout
 * Positioned relative to the background (0.0 to 1.0)
 */
const INVENTORY_MAX_SLOTS = 6;
const INVENTORY_OFFSET_X = 0.05; 
const INVENTORY_OFFSET_Y = 0.12; 

/** * Shop Shelf Configuration
 * rx/ry: relative x/y position on the background image
 * rw/rh: relative width/height of the hit-box
 */
const SHOP_SLOTS = [
  { itemId: "pistol",   rx: 0.287, ry: 0.255, rw: 0.075, rh: 0.100 },
  { itemId: "fireball", rx: 0.375, ry: 0.255, rw: 0.075, rh: 0.100 },
  // Adding a future slot placeholder:
  // { itemId: "boots",  rx: 0.463, ry: 0.255, rw: 0.075, rh: 0.100 },
];

/** * Item Catalog
 * Adding 'type' and 'stats' makes it easier for the LevelScene to read.
 */
const SHOP_ITEMS = [
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
];