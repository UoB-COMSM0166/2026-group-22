// ShopState.js
// State + persistence only

class ShopState {
  constructor() {
    this.coins = START_COINS;
    this.owned = { pistol: false, fireball: false };
    this.equippedWeaponId = null;
  }

  load() {
    try {
      const raw = localStorage.getItem(SHOP_STORAGE_KEY);
      if (!raw) return;

      const data = JSON.parse(raw);
      if (typeof data.coins === "number") this.coins = data.coins;

      if (data.owned && typeof data.owned === "object") {
        this.owned.pistol = !!data.owned.pistol;
        this.owned.fireball = !!data.owned.fireball;
      }

      if (typeof data.equippedWeaponId === "string" && this.owned[data.equippedWeaponId]) {
        this.equippedWeaponId = data.equippedWeaponId;
      } else {
        this.equippedWeaponId = null;
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

  isOwned(itemId) {
    return !!this.owned[itemId];
  }

  getItem(itemId) {
    return SHOP_ITEMS.find((it) => it.id === itemId) || null;
  }

  buy(itemId) {
    const item = this.getItem(itemId);
    if (!item) return false;
    if (this.isOwned(itemId)) return false;
    if (this.coins < item.price) return false;

    this.coins -= item.price;
    this.owned[itemId] = true;

    // Auto-equip first purchased item
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
    if (item) this.coins += Math.round(item.price * SELL_REFUND_RATE);

    this.owned[itemId] = false;

    if (this.equippedWeaponId === itemId) {
      this.equippedWeaponId = null;
      const next = SHOP_ITEMS.find((it) => this.owned[it.id]);
      if (next) this.equippedWeaponId = next.id;
    }

    this.save();
    return true;
  }

  reset() {
    this.coins = START_COINS;
    this.owned = { pistol: false, fireball: false };
    this.equippedWeaponId = null;
    this.save();
  }

  getOwnedItemIds() {
    return SHOP_ITEMS.map((it) => it.id).filter((id) => this.owned[id]);
  }
}
