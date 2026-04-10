// src/core/AbilityManager.js

class AbilityManager {
  constructor(player) {
    this.player = player;

    // --- Core Abilities ---
    this.isInhaling = false;
    this.inhaleRange = 250;

    // --- Skill System ---
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0;
    this.isCharging = false;
    this.bowCharge = 0;
    this.cooldown = 0;

    // --- Bubble System ---
    this.bubbleActivated = false;
    this.bubbleCount = 0;
    this.bubbleStepTimer = 0;
    this.bubbleStepMax = 160;
    this.bubbleDamageCooldown = 0;
  }

  update() {
    // 1. Skill Timer Logic
    if (this.currentSkill !== CONFIG.SKILLS.NONE && this.skillTimer > 0) {
      this.skillTimer--;
      if (this.skillTimer <= 0) this.resetSkills();
    }

    // 2. Cooldowns & Charge
    if (this.cooldown > 0) this.cooldown--;
    if (this.isCharging) {
      this.bowCharge = min(this.bowCharge + 0.6, 25);
    }

    this.updateSurvival();
  }

  handleInput() {
    // Only allow input if player isn't in HURT state
    if (this.player.state === CONFIG.PLAYER_STATES.HURT) return;

    if (this.player.isAttacking() && this.cooldown <= 0) {
      this.fireBullet();
    }

    // --- Inhale Logic (K Key) ---
    if (this.player.isInhaling()) {
      this.player.state = CONFIG.PLAYER_STATES.INHALING;
      this.isInhaling = true;
      this.player.velX *= 0.5;
    } else if (this.player.state === CONFIG.PLAYER_STATES.INHALING) {
      this.isInhaling = false;
      this.player.state = CONFIG.PLAYER_STATES.NORMAL;
    }

    // --- Bow Skill Logic (L Key) ---
    const canUseBow = this.currentSkill === CONFIG.SKILLS.BOW && this.cooldown <= 0;
    if (canUseBow && keyIsDown(CONFIG.CONTROLS.BOW)) {
      this.player.state = CONFIG.PLAYER_STATES.BOW_CHARGING;
      this.isCharging = true;
      this.player.velX *= 0.2;
    } else if (this.isCharging && !keyIsDown(CONFIG.CONTROLS.BOW)) {
      this.fireArrow();
      this.player.state = CONFIG.PLAYER_STATES.NORMAL;
    }
  }

  fireBullet() {
    let dir = this.player.isFacingLeft ? -1 : 1;

    // Use the world reference to spawn the bullet
    if (this.player.worldReference) {
      this.player.worldReference.spawnBullet(
        this.player.x + (20 * dir),
        this.player.y,
        dir
      );
    }

    // Set the cooldown inside the manager
    this.cooldown = 15;
  }

  fireArrow() {
    let dir = this.player.isFacingLeft ? -1 : 1;
    let vx = (8 + this.bowCharge) * dir;
    let vy = -5 - (this.bowCharge * 0.8);

    if (this.player.worldReference) {
      this.player.worldReference.spawnArrow(this.player.x, this.player.y, vx, vy);
    }
    this.isCharging = false;
    this.bowCharge = 0;
    this.cooldown = 30;
  }

  updateSurvival() {
    if (!this.player.bubbleMode || !this.bubbleActivated) return;

    if (this.bubbleCount > 0) {
      this.bubbleStepTimer--;
      if (this.bubbleStepTimer <= 0) {
        this.bubbleCount--;
        this.bubbleStepTimer = (this.bubbleCount > 0) ? this.bubbleStepMax : 0;
      }
    } else {
      if (this.bubbleDamageCooldown > 0) {
        this.bubbleDamageCooldown--;
      } else {
        this.player.hp = max(0, this.player.hp - 5);
        this.bubbleDamageCooldown = 60;
      }
    }
  }

  setSkill(skillType, duration = 600) {
    this.resetSkills(); // Clear current first
    this.currentSkill = skillType;
    this.skillTimer = duration;

    if (skillType === CONFIG.SKILLS.JUMP) {
      this.player.lift = CONFIG.PLAYER.LIFT * 1.5;
    }

    if (skillType === CONFIG.SKILLS.SHRINK) {
      this.player.w = CONFIG.PLAYER.WIDTH * 0.4;
      this.player.h = CONFIG.PLAYER.HEIGHT * 0.4;
    }
  }

  activateBubble(count = 3) {
    this.bubbleActivated = true;
    this.bubbleCount = count;
    this.bubbleStepTimer = this.bubbleStepMax;
    this.bubbleDamageCooldown = 0;
  }

  resetSkills() {
    this.player.w = CONFIG.PLAYER.WIDTH;
    this.player.h = CONFIG.PLAYER.HEIGHT;
    this.player.lift = CONFIG.PLAYER.LIFT;
    this.currentSkill = CONFIG.SKILLS.NONE;
    this.skillTimer = 0;
    this.isCharging = false;
  }

  resetBubbleState() {
    if (this.player.bubbleMode) {
      this.activateBubble(3);
    } else {
      this.bubbleActivated = false;
      this.bubbleCount = 0;
    }
  }

  draw() {
    if (this.player.isInhaling()) this.drawInhaleEffect();
    if (this.isCharging) this.drawAimLine();

    if (this.currentSkill !== CONFIG.SKILLS.NONE) {
      drawingContext.shadowBlur = 20;
      drawingContext.shadowColor = 'yellow';
    }
  }

  drawInhaleEffect() {
    push();
    fill(255, 255, 255, 80); // Semi-transparent white
    noStroke();

    // Draw suction cone in the direction Kirby is facing
    let dir = this.player.isFacingLeft ? -1 : 1;
    let startAngle = this.player.isFacingLeft ? PI - QUARTER_PI : -QUARTER_PI;
    let endAngle = this.player.isFacingLeft ? PI + QUARTER_PI : QUARTER_PI;

    // Center the arc at Kirby's mouth/front
    arc(this.player.x + (15 * dir), this.player.y, 120, 100, startAngle, endAngle);
    pop();
  }

  drawAimLine() {
    push();

    translate(this.player.x, this.player.y);

    if (this.player.isFacingLeft) scale(-1, 1);

    stroke(255, 50, 50, 200); // Pulse-red aiming line
    strokeWeight(3);

    let aimX = 15 + this.bowCharge * 2;
    let aimY = -10 - this.bowCharge * 1.5;

    line(5, -5, aimX, aimY);

    noStroke();
    fill(255, 100, 100);
    ellipse(aimX, aimY, 4, 4);
    pop();
  }
}