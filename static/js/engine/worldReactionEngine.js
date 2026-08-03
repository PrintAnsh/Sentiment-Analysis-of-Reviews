/**
 * WorldReactionEngine.js - Centralized Sentiment Reaction & Environment Synchronizer
 * Realm of Echoes: Phase 6 Magic Phase
 */

class WorldReactionEngine {
  constructor(worldEngine) {
    this.worldEngine = worldEngine;
    this.currentState = 'Neutral';
    this.targetState = 'Neutral';
    this.transitionProgress = 1.0; // 0.0 to 1.0
    this.transitionDuration = 1.5; // seconds

    // Environmental Effects State
    this.rainActive = false;
    this.lightningFlash = 0; // Alpha
    this.lightningTimer = 0;

    // World Banner State
    this.bannerText = '';
    this.bannerAlpha = 0;
    this.bannerTimer = 0;
    this.bannerColor = '#00e5ff';
  }

  applySentimentReaction(polarity) {
    this.targetState = polarity;
    this.transitionProgress = 0.0;
    this.currentState = polarity;

    // 1. Synchronize World Engine Particle State
    if (this.worldEngine) {
      this.worldEngine.setEmotionState(polarity);
    }

    // 2. Set Specific Environment Effects
    if (polarity === 'Positive') {
      this.rainActive = false;
      this.triggerBanner("✨ Positive Energy Restored ✨", "#00e676");
      if (this.worldEngine.cameraEffects) {
        this.worldEngine.cameraEffects.setZoom(1.15); // Temporary positive cinematic zoom
        setTimeout(() => this.worldEngine.cameraEffects.setZoom(1.0), 1800);
      }
    } else if (polarity === 'Negative') {
      this.rainActive = true;
      this.triggerBanner("⚡ Dark Echoes Rising ⚡", "#ff1744");
      // Trigger subtle camera shake
      if (this.worldEngine.cameraEffects && window.app && window.app.characterSystem) {
        window.app.characterSystem.cameraSystem.triggerShake(8, 0.5);
      }
    } else {
      this.rainActive = false;
      this.triggerBanner("⚖️ The Realm Remains Balanced ⚖️", "#00e5ff");
    }
  }

  triggerBanner(text, color) {
    this.bannerText = text;
    this.bannerColor = color;
    this.bannerAlpha = 1.0;
    this.bannerTimer = 2.5; // Displays for 2.5 seconds
  }

  update(dt) {
    // 1. Transition Lerp
    if (this.transitionProgress < 1.0) {
      this.transitionProgress += dt / this.transitionDuration;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
      }
    }

    // 2. Update Banner Timer
    if (this.bannerTimer > 0) {
      this.bannerTimer -= dt;
      if (this.bannerTimer <= 0.8) {
        this.bannerAlpha = Math.max(0, this.bannerTimer / 0.8);
      }
    }

    // 3. Negative State Occasional Lightning Flashes
    if (this.rainActive) {
      this.lightningTimer += dt;
      if (this.lightningTimer > 3.0 && Math.random() < 0.08) {
        this.lightningFlash = 0.4 + Math.random() * 0.3;
        this.lightningTimer = 0;
      }
      if (this.lightningFlash > 0) {
        this.lightningFlash -= dt * 3.0;
        if (this.lightningFlash < 0) this.lightningFlash = 0;
      }
    } else {
      this.lightningFlash = 0;
    }
  }

  renderOverlays(ctx, width, height) {
    ctx.save();

    // 1. Render Lightning Flash for Negative Sentiment
    if (this.lightningFlash > 0) {
      ctx.fillStyle = `rgba(224, 64, 251, ${this.lightningFlash})`;
      ctx.fillRect(0, 0, width, height);
    }

    // 2. Render World Sentiment Banner Notification
    if (this.bannerAlpha > 0.01 && this.bannerText) {
      const bannerY = 90;
      const bannerW = 420;
      const bannerH = 44;
      const bannerX = (width - bannerW) * 0.5;

      ctx.save();
      ctx.globalAlpha = this.bannerAlpha;

      // Banner Glass Background
      ctx.fillStyle = 'rgba(10, 14, 26, 0.9)';
      ctx.fillRect(bannerX, bannerY, bannerW, bannerH);

      // Glowing Border
      ctx.strokeStyle = this.bannerColor;
      ctx.lineWidth = 2;
      ctx.shadowColor = this.bannerColor;
      ctx.shadowBlur = 14;
      ctx.strokeRect(bannerX, bannerY, bannerW, bannerH);

      // Banner Text
      ctx.fillStyle = this.bannerColor;
      ctx.font = '11px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(this.bannerText, width * 0.5, bannerY + 26);

      ctx.restore();
    }

    ctx.restore();
  }
}
