/**
 * ParticleSystem.js - Pooled Multi-Type Pixel Particle, Rain & Reactive FX Engine
 * Realm of Echoes: Phase 6 Magic Phase
 */

class ParticleSystem {
  constructor() {
    this.particles = [];
    this.butterflies = [];
    this.rainDrops = [];
    this.emotionState = 'Neutral';
    this.poolSize = 120;
    
    this.initParticlePool(this.poolSize);
    this.initButterflies(6);
    this.initRainPool(60);
  }

  initParticlePool(count) {
    this.particles = [];
    const types = ['sakura', 'firefly', 'stardust', 'pollen', 'leaf', 'ember'];

    for (let i = 0; i < count; i++) {
      const type = types[i % types.length];
      this.particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        type: type,
        size: Math.random() * 3 + 1,
        speedX: (Math.random() - 0.5) * 0.7,
        speedY: type === 'sakura' || type === 'leaf' ? (0.3 + Math.random() * 0.5) : (-0.2 - Math.random() * 0.4),
        alpha: Math.random() * 0.8 + 0.2,
        pulsePhase: Math.random() * Math.PI * 2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05
      });
    }
  }

  initButterflies(count) {
    this.butterflies = [];
    for (let i = 0; i < count; i++) {
      this.butterflies.push({
        x: Math.random() * window.innerWidth,
        y: window.innerHeight * 0.6 + Math.random() * 100,
        color: i % 2 === 0 ? '#ff4081' : '#00e5ff',
        wingPhase: Math.random() * Math.PI * 2,
        speedX: (Math.random() - 0.5) * 1.2,
        speedY: (Math.random() - 0.5) * 0.8
      });
    }
  }

  initRainPool(count) {
    this.rainDrops = [];
    for (let i = 0; i < count; i++) {
      this.rainDrops.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        length: 14 + Math.random() * 10,
        speedY: 450 + Math.random() * 200,
        speedX: -60 - Math.random() * 30,
        alpha: 0.4 + Math.random() * 0.4
      });
    }
  }

  setEmotionState(state) {
    this.emotionState = state;
  }

  update(dt, width, height) {
    // 1. Update Pooled Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.x += p.speedX + Math.sin(p.pulsePhase) * 0.3;
      p.y += p.speedY;
      p.pulsePhase += 0.03;
      p.rotation += p.rotationSpeed;

      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;
      if (p.y < -20) p.y = height + 20;
      if (p.y > height + 20) p.y = -20;
    }

    // 2. Update Butterflies
    for (let i = 0; i < this.butterflies.length; i++) {
      const b = this.butterflies[i];
      b.x += b.speedX + Math.sin(b.wingPhase) * 0.8;
      b.y += b.speedY + Math.cos(b.wingPhase) * 0.5;
      b.wingPhase += 0.15;

      if (b.x < -20) b.x = width + 20;
      if (b.x > width + 20) b.x = -20;
    }

    // 3. Update Rain Drops if Negative Sentiment
    if (this.emotionState === 'Negative') {
      for (let i = 0; i < this.rainDrops.length; i++) {
        const r = this.rainDrops[i];
        r.x += r.speedX * dt;
        r.y += r.speedY * dt;

        if (r.y > height || r.x < -20) {
          r.x = Math.random() * (width + 200);
          r.y = -20;
        }
      }
    }
  }

  render(ctx, width, height) {
    ctx.save();

    // Render Rain if Negative Sentiment
    if (this.emotionState === 'Negative') {
      ctx.strokeStyle = 'rgba(128, 216, 255, 0.45)';
      ctx.lineWidth = 1.5;
      for (let i = 0; i < this.rainDrops.length; i++) {
        const r = this.rainDrops[i];
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 3, r.y + r.length);
        ctx.stroke();
      }
    }

    // Render Particles
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);

      let color = '#00e5ff';
      let size = p.size;

      if (p.type === 'leaf') color = '#2e7d32';
      else if (p.type === 'pollen') color = '#fff59d';
      else if (this.emotionState === 'Positive') color = p.type === 'sakura' ? '#ff80ab' : '#ffd54f';
      else if (this.emotionState === 'Negative') color = p.type === 'ember' ? '#ff1744' : '#d500f9';
      else color = p.type === 'firefly' ? '#ffd54f' : '#00e5ff';

      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = Math.max(0.1, Math.min(1.0, p.alpha + Math.sin(p.pulsePhase) * 0.3));

      if (p.type === 'sakura' || p.type === 'leaf') {
        ctx.fillRect(-size, -size * 0.5, size * 2, size);
      } else {
        ctx.fillRect(-size * 0.5, -size * 0.5, size, size);
      }

      ctx.restore();
    }

    // Render Butterflies
    for (let i = 0; i < this.butterflies.length; i++) {
      const b = this.butterflies[i];
      ctx.save();
      ctx.translate(b.x, b.y);
      const wingSpread = Math.abs(Math.sin(b.wingPhase)) * 8;

      ctx.fillStyle = b.color;
      ctx.shadowColor = b.color;
      ctx.shadowBlur = 8;

      ctx.fillRect(-wingSpread - 2, -4, wingSpread, 6);
      ctx.fillRect(2, -4, wingSpread, 6);

      ctx.restore();
    }

    ctx.restore();
  }
}
