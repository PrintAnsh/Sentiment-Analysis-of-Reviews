/**
 * SpriteController.js - Pixel Character Rendering & Pooled Dust Particle System
 * Realm of Echoes: Phase 5 Character Polish
 */

class SpriteController {
  constructor() {
    this.frameIndex = 0;
    this.frameTimer = 0;
    this.frameRate = 0.1;
    
    // Pooled Dust Particles
    this.dustPool = [];
    this.initDustPool(20);
  }

  initDustPool(count) {
    this.dustPool = [];
    for (let i = 0; i < count; i++) {
      this.dustPool.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        size: 0,
        alpha: 0
      });
    }
  }

  spawnFootstepDust(x, y) {
    let spawned = 0;
    for (let i = 0; i < this.dustPool.length && spawned < 2; i++) {
      const p = this.dustPool[i];
      if (!p.active) {
        p.active = true;
        p.x = x + (Math.random() - 0.5) * 12;
        p.y = y + 42;
        p.vx = (Math.random() - 0.5) * 1.5;
        p.vy = -Math.random() * 1.2;
        p.size = Math.random() * 3 + 2;
        p.alpha = 0.8;
        spawned++;
      }
    }
  }

  update(dt, isMoving) {
    this.frameTimer += dt;
    if (this.frameTimer >= this.frameRate) {
      this.frameTimer = 0;
      this.frameIndex = (this.frameIndex + 1) % 6;
    }

    // Update Pooled Dust Particles
    for (let i = 0; i < this.dustPool.length; i++) {
      const p = this.dustPool[i];
      if (p.active) {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= dt * 2.5;
        p.size = Math.max(0.5, p.size - dt * 2);
        if (p.alpha <= 0) {
          p.active = false;
        }
      }
    }
  }

  render(ctx, x, y, state, direction, time) {
    ctx.save();

    const renderX = Math.floor(x);
    let renderY = Math.floor(y);

    let bounceY = 0;
    let breathScaleY = 1.0;

    if (state === 'WALK_RIGHT' || state === 'WALK_LEFT') {
      bounceY = (this.frameIndex % 3 === 0) ? -3 : 0;
    } else {
      breathScaleY = 1.0 + Math.sin(time * 3) * 0.04;
      renderY += (1.0 - breathScaleY) * 24;
    }

    renderY += bounceY;

    // Render Pooled Dust Particles
    for (let i = 0; i < this.dustPool.length; i++) {
      const p = this.dustPool[i];
      if (p.active) {
        ctx.fillStyle = `rgba(180, 200, 220, ${p.alpha})`;
        ctx.fillRect(Math.floor(p.x), Math.floor(p.y), Math.floor(p.size), Math.floor(p.size));
      }
    }

    // Render Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    ctx.beginPath();
    ctx.ellipse(renderX + 16, Math.floor(y + 44), 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Direction Flipping Context Transform
    ctx.translate(renderX + 16, renderY + 24);
    if (direction === 'LEFT') {
      ctx.scale(-1, 1);
    }
    ctx.scale(1, breathScaleY);

    // Ethereal Alchemist Cloak Body
    ctx.fillStyle = '#6a1b9a';
    ctx.fillRect(-10, -10, 20, 26);

    // Golden Trim Belt
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-2, -10, 4, 26);
    ctx.fillRect(-8, 2, 16, 3);

    // Wizard Hat
    ctx.fillStyle = '#4a148c';
    ctx.beginPath();
    ctx.moveTo(-14, -10);
    ctx.lineTo(0, -28);
    ctx.lineTo(14, -10);
    ctx.closePath();
    ctx.fill();

    // Hat Brim
    ctx.fillStyle = '#ab47bc';
    ctx.fillRect(-16, -12, 32, 4);

    // Glowing Oracle Eye
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(2, -6, 5, 4);

    // Animated Legs
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#1a237e';

    if (state === 'WALK_RIGHT' || state === 'WALK_LEFT') {
      const legPhase = Math.sin(this.frameIndex * Math.PI / 3) * 6;
      ctx.fillRect(-7 + legPhase, 16, 5, 8);
      ctx.fillRect(2 - legPhase, 16, 5, 8);
    } else {
      ctx.fillRect(-6, 16, 5, 8);
      ctx.fillRect(1, 16, 5, 8);
    }

    if (state === 'INTERACT') {
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 14;
      ctx.strokeRect(-18, -30, 36, 56);
    }

    ctx.restore();
  }
}
