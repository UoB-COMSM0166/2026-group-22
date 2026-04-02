CONFIG.LEVELS[4] = {
  worldWidth: 800, 
  worldHeight: 800, 
  startX: 0,          // Your engine needs this to start the loop
  platforms: [
    { 
      gap: 0,         // Starts at startX
      w: 800,         // Covers the whole floor
      h: 100, 
      altitude: 0     // On the bottom
    }
  ],
  holes: [],
  items: []
};