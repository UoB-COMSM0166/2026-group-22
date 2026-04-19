class GameState {
  constructor() {
    this.SAVE_KEY = CONFIG.SYSTEM.SAVE_KEY;

    this.selectedCharacterId = null;
    this.selectedCharacter = null;

    this.selectedItemId = null;

    this.coins = CONFIG.SHOP.START_COINS;
    this.ownedItemIds = ["pistol"];
    this.equippedWeaponId = "pistol";

    this.levelsUnlocked = [true, false, false, false];
    this.bossesDefeated = [];
    this.campIntroDone = false;
    this.campHintsDone = false;

    this.settings = {
      musicVolume: 0.8,
      sfxVolume: 1.0,
    };

    this.difficulty = "EASY";

    this.load();
  }

  setDifficulty(level) {
    this.difficulty = level;
    this.save();
  }

  save() {
    const data = {
      difficulty: this.difficulty,
      coins: this.coins,
      ownedItemIds: this.ownedItemIds,
      equippedWeaponId: this.equippedWeaponId,
      levelsUnlocked: this.levelsUnlocked,
      bossesDefeated: this.bossesDefeated,
      campIntroDone: this.campIntroDone,
      campHintsDone: this.campHintsDone,
      settings: this.settings
    };
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    console.log("[GameState] Data saved to LocalStorage.");
  }

  load() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) {
      this.ownedItemIds = ["pistol"];
      this.equippedWeaponId = "pistol";
      this.save();
      return;
    }
      const data = JSON.parse(raw);

      Object.assign(this, data);
      console.log("[GameState] Data loaded successfully.");
    } catch (e) {
      console.error("[GameState] Load failed:", e);
    }
  }

  isOwned(itemId) {
    return this.ownedItemIds.includes(itemId);
  }

  getItemData(itemId) {
    return CONFIG.SHOP.ITEMS.find(it => it.id === itemId) || null;
  }

  purchaseItem(itemId) {
    const item = this.getItemData(itemId);
    if (!item || this.isOwned(itemId) || this.coins < item.price) return false;

    this.coins -= item.price;
    this.ownedItemIds.push(itemId);

    this.equippedWeaponId = itemId;

    this.save();
    return true;
  }

  sellItem(itemId) {
    if (!this.isOwned(itemId)) return false;
    const item = this.getItemData(itemId);

    const refund = Math.round(item.price * CONFIG.SHOP.SELL_REFUND_RATE);

    this.coins += refund;
    this.ownedItemIds = this.ownedItemIds.filter(id => id !== itemId);

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
    this.save();
  }

  resetRun() {
    this.coins = CONFIG.SHOP.START_COINS;
    this.ownedItemIds = ["pistol"];
    this.equippedWeaponId = "pistol";
    this.levelsUnlocked = [true, false, false, false];
    this.bossesDefeated = [];
    this.campIntroDone = false;
    this.campHintsDone = false;
    this.save();
  }
}

const gameState = new GameState();
