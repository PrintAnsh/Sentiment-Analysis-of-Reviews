/**
 * TransitionManager.js - Scene Transition & Screen Fade Controller
 * Realm of Echoes: Phase 4 Interior Engine
 */

class TransitionManager {
  constructor() {
    this.fadeAlpha = 0.0;
    this.isFading = false;
    this.fadeDirection = 'IDLE'; // 'IN' (to black), 'OUT' (to transparent)
    this.fadeSpeed = 2.5; // Speed multiplier
    this.onPeakCallback = null;
  }

  startTransition(onPeakCallback) {
    if (this.isFading) {
      if (onPeakCallback) onPeakCallback();
      return;
    }
    this.isFading = true;
    this.fadeDirection = 'IN';
    this.fadeAlpha = 0.0;
    this.onPeakCallback = onPeakCallback;
  }

  // Alias methods to prevent any method signature runtime exceptions
  triggerFadeOut(onPeakCallback) {
    this.startTransition(onPeakCallback);
  }

  triggerFadeIn() {
    // Automatically transitions from peak darkness to transparent in update loop
  }

  update(dt) {
    if (!this.isFading) return;

    if (this.fadeDirection === 'IN') {
      this.fadeAlpha += dt * this.fadeSpeed;
      if (this.fadeAlpha >= 1.0) {
        this.fadeAlpha = 1.0;
        this.fadeDirection = 'OUT';
        if (this.onPeakCallback) {
          this.onPeakCallback();
          this.onPeakCallback = null;
        }
      }
    } else if (this.fadeDirection === 'OUT') {
      this.fadeAlpha -= dt * this.fadeSpeed;
      if (this.fadeAlpha <= 0.0) {
        this.fadeAlpha = 0.0;
        this.fadeDirection = 'IDLE';
        this.isFading = false;
      }
    }
  }

  render(ctx, width, height) {
    if (this.fadeAlpha > 0.001) {
      ctx.save();
      ctx.fillStyle = `rgba(5, 7, 15, ${this.fadeAlpha})`;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    }
  }
}
