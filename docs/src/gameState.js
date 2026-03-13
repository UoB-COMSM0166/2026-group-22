// gameState.js — shared state for all scenes + shared assets

window.GameState = window.GameState || {
  selectedCharacterId: null,
  selectedCharacter: null,

  coins: 0,
  skillsOwned: [],
  weaponsOwned: [],
  bossesDefeated: [],

  setSelectedCharacter(charObj) {
    this.selectedCharacterId = charObj?.id ?? null;
    this.selectedCharacter = charObj ?? null;
    console.log("[GameState] Selected character:", this.selectedCharacter);
  },

  resetRun() {
    this.coins = 0;
    this.skillsOwned = [];
    this.weaponsOwned = [];
    this.bossesDefeated = [];
  },

  campIntroDone: false,

};

window.Assets = window.Assets || {
  plasdripFont: null,
};

window.startLevel = window.startLevel || function (n) {
  console.log("[stub] startLevel called with:", n);
};

