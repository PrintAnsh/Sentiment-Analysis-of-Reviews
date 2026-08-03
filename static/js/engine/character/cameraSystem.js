/**
 * CameraSystem.js - Smooth Camera Follow, Easing & Camera Shake Controller
 * Realm of Echoes: Phase 5 Polish
 */

class CameraSystem {
  constructor(worldState = null, sceneManager = null) {
    this.worldState = worldState;
    this.sceneManager = sceneManager;
    this.x = 0;
    this.targetX = 0;
    this.y = 0;
    this.targetY = 0;
    this.easing = 0.08;
    this.cameraBobbing = 0;

    // Camera Shake System
    this.shakeIntensity = 0;
    this.shakeDuration = 0;
    this.shakeTimer = 0;
  }

  triggerShake(intensity = 6, duration = 0.3) {
    this.shakeIntensity = intensity;
    this.shakeDuration = duration;
    this.shakeTimer = duration;
  }

  isInteriorMode() {
    if (this.sceneManager) {
      return this.sceneManager.isInteriorActive();
    }
    return this.worldState && this.worldState.isInsideBuilding;
  }

  update(dt, playerX, playerY, isMoving) {
    if (this.isInteriorMode()) {
      this.x = 0;
      this.y = 0;
      return;
    }

    // 1. Target Tracking
    this.targetX = playerX - window.innerWidth * 0.35;
    this.targetY = 0;

    // 2. Smooth Lerp Interpolation
    this.x += (this.targetX - this.x) * this.easing;
    this.y += (this.targetY - this.y) * this.easing;

    // 3. Subtle Walking Camera Bobbing
    if (isMoving) {
      this.cameraBobbing = Math.sin(performance.now() * 0.008) * 2;
    } else {
      this.cameraBobbing *= 0.9;
    }

    // 4. Update Camera Shake
    if (this.shakeTimer > 0) {
      this.shakeTimer -= dt;
      if (this.shakeTimer <= 0) {
        this.shakeTimer = 0;
        this.shakeIntensity = 0;
      }
    }
  }

  getOffsetX() {
    if (this.isInteriorMode()) {
      return 0;
    }
    let shakeX = 0;
    if (this.shakeTimer > 0) {
      shakeX = (Math.random() - 0.5) * this.shakeIntensity * 2;
    }
    return this.x + shakeX;
  }

  getOffsetY() {
    if (this.isInteriorMode()) {
      return 0;
    }
    let shakeY = 0;
    if (this.shakeTimer > 0) {
      shakeY = (Math.random() - 0.5) * this.shakeIntensity * 2;
    }
    return this.y + this.cameraBobbing + shakeY;
  }
}
