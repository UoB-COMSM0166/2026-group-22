// src/classes/InteractionManager.js
class InteractionManager {
  /**
   * Handles combat collisions: bullets vs enemies and enemies vs player.
   */
  static handleCombat(player, enemies, bullets) {
    // Bullets vs Enemies
    for (let bullet of bullets) {
      for (let enemy of enemies) {
        if (enemy.active && bullet.active && bullet.intersects(enemy)) {
          enemy.takeDamage(bullet.damage);
          bullet.active = false;
        }
      }
    }

    // Enemies vs Player
    for (let enemy of enemies) {
      if (enemy.active && player.active && player.intersects(enemy)) {
        const dir = (player.x < enemy.x) ? -1 : 1;
        player.takeDamage(10, dir);
      }
    }
  }

  /**
   * Handles puzzle-specific interactions (e.g., Bow vs ChainPlatforms).
   */
  static handlePuzzles(bullets, platforms) {
    for (let bullet of bullets) {
      if (!bullet.active) continue;
      for (let platform of platforms) {
        if (platform instanceof ChainPlatform && platform.state === 'IDLE') {
          if (bullet.intersects(platform)) {
            platform.triggerBreak();
            bullet.active = false;
          }
        }
      }
    }
  }

  /**
   * Handles map limits, holes, and falling off the screen.
   */
  static handleWorldLimits(player, world) {
    const p = player.getBounds();
    const floorY = world.height - world.groundThickness;

    // Check for pits/holes
    let overHole = world.holes.some(h => h.contains(p.left) && h.contains(p.right));

    if (!overHole && p.bottom > floorY) {
      player.y = floorY - player.h / 2;
      player.land();
    }

    if (p.top > world.height) {
      world.respawnPlayer();
    }

    // Keep Kirby within horizontal walls
    player.x = constrain(player.x, player.w / 2, world.width - player.w / 2);
    player.y = max(player.y, player.h / 2);
  }

  static resolveHitGroup(projectiles, target, onHit) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      if (projectiles[i].active && projectiles[i].intersects(target)) {
        onHit(projectiles[i], target);
        projectiles[i].active = false;
        projectiles.splice(i, 1);
      }
    }
  }

  static updateProjectiles(projectiles) {
    for (let i = projectiles.length - 1; i >= 0; i--) {
      projectiles[i].update();
      if (!projectiles[i].active) {
        projectiles.splice(i, 1);
      }
    }
  }
}