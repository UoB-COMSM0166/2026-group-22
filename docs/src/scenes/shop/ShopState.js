// src/Shop/ShopState.js
class ShopState {
  constructor() {
    this.coins = typeof START_COINS !== 'undefined' ? START_COINS : 100;
    this.owned = {}; // We will populate this dynamically
    this.equippedWeaponId = null;
    
    // Initialize owned status for all items in ShopData
    this.initOwnedStatus();
  }

  // Prevents hardcoding by checking SHOP_ITEMS directly
  initOwnedStatus() {
    if (typeof SHOP_ITEMS !== 'undefined') {
      SHOP_ITEMS.forEach(item => {
        this.owned[item.id] = false;
      });
    }
  }

  load() {
    try {
      const raw = localStorage.getItem(SHOP_STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (typeof data.coins === "number") this.coins = data.coins;

      // Merge saved ownership with current item list
      if (data.owned && typeof data.owned === "object") {
        Object.keys(data.owned).forEach(id => {
          if (this.owned.hasOwnProperty(id)) {
            this.owned[id] = !!data.owned[id];
          }
        });
      }

      // Ensure equipped weapon is actually owned
      if (data.equippedWeaponId && this.owned[data.equippedWeaponId]) {
        this.equippedWeaponId = data.equippedWeaponId;
      }
    } catch (e) {
      console.warn("ShopState.load failed:", e);
    }
  }

  save() {
    try {
      localStorage.setItem(
        SHOP_STORAGE_KEY,
        JSON.stringify({
          coins: this.coins,
          owned: this.owned,
          equippedWeaponId: this.equippedWeaponId,
        })
      );
    } catch (e) {
      console.warn("ShopState.save failed:", e);
    }
  }

  /* =============================
     Business Logic
     ============================= */

  isOwned(itemId) {
    return !!this.owned[itemId];
  }

  getItem(itemId) {
    return SHOP_ITEMS.find((it) => it.id === itemId) || null;
  }

  buy(itemId) {
    const item = this.getItem(itemId);
    if (!item || this.isOwned(itemId) || this.coins < item.price) return false;

    this.coins -= item.price;
    this.owned[itemId] = true;

    // Quality of Life: Auto-equip if nothing is currently held
    if (!this.equippedWeaponId) this.equippedWeaponId = itemId;

    this.save();
    return true;
  }

  equip(itemId) {
    if (!this.isOwned(itemId)) return false;
    this.equippedWeaponId = itemId;
    this.save();
    return true;
  }

  sell(itemId) {
    if (!this.isOwned(itemId)) return false;

    const item = this.getItem(itemId);
    const refund = Math.round(item.price * (typeof SELL_REFUND_RATE !== 'undefined' ? SELL_REFUND_RATE : 0.5));
    
    this.coins += refund;
    this.owned[itemId] = false;

    // Handle equipping a new weapon if the sold one was active
    if (this.equippedWeaponId === itemId) {
      this.equippedWeaponId = this.getOwnedItemIds()[0] || null;
    }

    this.save();
    return true;
  }

  reset() {
    this.coins = START_COINS;
    this.initOwnedStatus(); // Re-initialize the list
    this.equippedWeaponId = null;
    this.save();
  }

  getOwnedItemIds() {
    return Object.keys(this.owned).filter(id => this.owned[id]);
  }
}

const shopState = new ShopState();