// src/core/GameState.js

class GameState {
  constructor() {
    this.STORAGE_KEY = "kirby_isle_save_v1";

    // --- Identification ---
    this.selectedCharacterId = null;
    this.selectedCharacter = null;

    this.selectedItemId = null;

    // --- Economy & Inventory ---
    // Pulls default from ShopData if available, else defaults to 25
    this.coins = typeof START_COINS !== 'undefined' ? START_COINS : 25;
    this.ownedItemIds = [];
    this.equippedWeaponId = null;

    // --- Progression ---
    this.levelsUnlocked = [true, false, false, false]; // Door 1 is open by default
    this.bossesDefeated = [];
    this.campIntroDone = false;

    // --- Settings ---
    this.settings = {
      musicVolume: 0.8,
      sfxVolume: 1.0,
    };

    // Automatically attempt to load existing data on startup
    this.load();
  }

  /* =============================
     Persistence (Save/Load)
     ============================= */

  save() {
    const data = {
      coins: this.coins,
      ownedItemIds: this.ownedItemIds,
      equippedWeaponId: this.equippedWeaponId,
      levelsUnlocked: this.levelsUnlocked,
      bossesDefeated: this.bossesDefeated,
      campIntroDone: this.campIntroDone,
      settings: this.settings
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
    console.log("[GameState] Data saved to LocalStorage.");
  }

  load() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);

      // Use Object.assign to merge saved data into this instance
      Object.assign(this, data);
      console.log("[GameState] Data loaded successfully.");
    } catch (e) {
      console.error("[GameState] Load failed:", e);
    }
  }

  /* =============================
     Shop & Inventory Logic
     ============================= */

  isOwned(itemId) {
    return this.ownedItemIds.includes(itemId);
  }

  getItemData(itemId) {
    // Looks up item details in the global SHOP_ITEMS catalog
    return typeof SHOP_ITEMS !== 'undefined'
      ? SHOP_ITEMS.find(it => it.id === itemId) || null
      : null;
  }

  purchaseItem(itemId) {
    const item = this.getItemData(itemId);
    if (!item || this.isOwned(itemId) || this.coins < item.price) return false;

    this.coins -= item.price;
    this.ownedItemIds.push(itemId);

    // Auto-equip the first item bought
    if (!this.equippedWeaponId) this.equippedWeaponId = itemId;

    this.save();
    return true;
  }

  sellItem(itemId) {
    if (!this.isOwned(itemId)) return false;
    const item = this.getItemData(itemId);

    // Calculate refund based on the global rate in ShopData
    const rate = typeof SELL_REFUND_RATE !== 'undefined' ? SELL_REFUND_RATE : 0.5;
    const refund = Math.round(item.price * rate);

    this.coins += refund;
    this.ownedItemIds = this.ownedItemIds.filter(id => id !== itemId);

    // If the sold item was equipped, equip the next available item or null
    if (this.equippedWeaponId === itemId) {
      this.equippedWeaponId = this.ownedItemIds[0] || null;
    }

    this.save();
    return true;
  }

  equipWeapon(itemId) {
    if (this.isOwned(itemId)) {
      this.equippedWeaponId = itemId;
      this.save();
    }
  }

  /* =============================
     Progression & Character Logic
     ============================= */

  addCoins(amount) {
    this.coins += amount;
    this.save();
  }

  unlockLevel(index) {
    if (index >= 0 && index < this.levelsUnlocked.length) {
      this.levelsUnlocked[index] = true;
      this.save();
    }
  }

  setSelectedCharacter(charObj) {
    this.selectedCharacterId = charObj?.id ?? null;
    this.selectedCharacter = charObj ?? null;
    console.log("[GameState] Character selected:", this.selectedCharacter?.name);
  }

  resetRun() {
    this.coins = typeof START_COINS !== 'undefined' ? START_COINS : 25;
    this.ownedItemIds = [];
    this.equippedWeaponId = null;
    this.levelsUnlocked = [true, false, false, false];
    this.bossesDefeated = [];
    this.campIntroDone = false;
    this.save();
    console.log("[GameState] State reset to defaults.");
  }
}

// Create the global instance
const gameState = new GameState();