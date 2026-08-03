/**
 * SkyRenderer.js - Pixel Sky, Celestial Objects, Shooting Stars & Cloud Renderer
 * Realm of Echoes: Biome Theme Engine & Smooth Background Transitions
 */

class SkyRenderer {
  static BIOME_SKY_THEMES = [
    // Biome 0: Forest (Whispering Woodland)
    { top: [28, 13, 43], mid: [18, 13, 32], bot: [9, 27, 18], cloudColor: 'rgba(160, 220, 180, 0.3)', moonHalo: 'rgba(0, 230, 118, 0.25)' },
    // Biome 1: Village (Sentiment Haven)
    { top: [45, 14, 58], mid: [30, 17, 51], bot: [16, 20, 36], cloudColor: 'rgba(255, 183, 77, 0.3)', moonHalo: 'rgba(255, 171, 64, 0.25)' },
    // Biome 2: Station (Echo Post Station)
    { top: [25, 10, 51], mid: [15, 12, 36], bot: [10, 14, 26], cloudColor: 'rgba(128, 216, 255, 0.3)', moonHalo: 'rgba(0, 229, 255, 0.25)' },
    // Biome 3: Laboratory (Alchemical Research Lab)
    { top: [12, 22, 48], mid: [8, 13, 30], bot: [4, 6, 12], cloudColor: 'rgba(0, 229, 255, 0.35)', moonHalo: 'rgba(0, 229, 255, 0.35)' },
    // Biome 4: Emotion Shrine (Visual Manifestation Shrine)
    { top: [66, 22, 42], mid: [41, 16, 36], bot: [20, 8, 23], cloudColor: 'rgba(224, 64, 251, 0.35)', moonHalo: 'rgba(224, 64, 251, 0.35)' },
    // Biome 5: Observatory (Analytics Observatory)
    { top: [8, 8, 26], mid: [4, 4, 18], bot: [2, 2, 8], cloudColor: 'rgba(128, 203, 196, 0.25)', moonHalo: 'rgba(128, 216, 255, 0.4)' },
    // Biome 6: Spire (Spire Citadel)
    { top: [59, 10, 42], mid: [36, 6, 32], bot: [18, 3, 20], cloudColor: 'rgba(255, 171, 64, 0.35)', moonHalo: 'rgba(255, 215, 64, 0.35)' }
  ];

  constructor() {
    this.stars = [];
    this.clouds = [];
    this.shootingStars = [];
    this.time = 0;

    this.currentBiomeIndex = 0;
    this.targetBiomeIndex = 0;
    this.transitionProgress = 1.0; // 0.0 to 1.0
    this.transitionSpeed = 0.67; // ~1.5s duration

    this.initStars(140);
    this.initClouds(10);
  }

  initStars(count) {
    this.stars = [];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random(),
        y: Math.random() * 0.55,
        size: Math.random() < 0.25 ? 2 : 1,
        twinkleSpeed: 0.02 + Math.random() * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        baseAlpha: 0.3 + Math.random() * 0.7
      });
    }
  }

  initClouds(count) {
    this.clouds = [];
    for (let i = 0; i < count; i++) {
      this.clouds.push({
        x: Math.random() * 2000,
        y: 30 + Math.random() * 180,
        width: 80 + Math.random() * 140,
        height: 24 + Math.random() * 30,
        speed: 0.15 + Math.random() * 0.25,
        layer: Math.random() < 0.5 ? 'far' : 'near',
        opacity: 0.25 + Math.random() * 0.3
      });
    }
  }

  update(dt, activeBiomeIndex = 0) {
    this.time += dt;

    // Smooth Biome Theme Transition
    if (activeBiomeIndex !== this.targetBiomeIndex) {
      this.currentBiomeIndex = this.targetBiomeIndex;
      this.targetBiomeIndex = Math.min(6, Math.max(0, activeBiomeIndex));
      this.transitionProgress = 0.0;
    }

    if (this.transitionProgress < 1.0) {
      this.transitionProgress += dt * this.transitionSpeed;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.currentBiomeIndex = this.targetBiomeIndex;
      }
    }

    // 1. Update Cloud Positions
    for (const cloud of this.clouds) {
      cloud.x += cloud.speed;
      if (cloud.x > 2500) {
        cloud.x = -cloud.width - 100;
        cloud.y = 30 + Math.random() * 180;
      }
    }

    // 2. Spawn Shooting Stars (Especially active in Observatory & Spire)
    const shootingStarChance = (this.targetBiomeIndex >= 5) ? 0.04 : 0.015;
    if (Math.random() < shootingStarChance && this.shootingStars.length < 4) {
      this.shootingStars.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * 0.3,
        length: 40 + Math.random() * 60,
        speed: 400 + Math.random() * 300,
        alpha: 1.0,
        angle: Math.PI * 0.25
      });
    }

    // Update Shooting Stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const s = this.shootingStars[i];
      s.x += Math.cos(s.angle) * s.speed * dt;
      s.y += Math.sin(s.angle) * s.speed * dt;
      s.alpha -= dt * 1.8;
      if (s.alpha <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }
  }

  // Layer 1: Sky Background
  renderSky(ctx, width, height, scrollProgress) {
    ctx.save();
    const skyGradient = this.getSkyGradient(ctx, height);
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  // Layer 2: Stars
  renderStars(ctx, width, height) {
    ctx.save();
    for (const star of this.stars) {
      const alpha = Math.max(0.1, star.baseAlpha + Math.sin(this.time * star.twinkleSpeed * 60 + star.twinklePhase) * 0.3);
      ctx.fillStyle = `rgba(224, 247, 250, ${alpha})`;
      const sx = Math.floor(star.x * width);
      const sy = Math.floor(star.y * height);
      ctx.fillRect(sx, sy, star.size, star.size);
    }
    ctx.restore();
  }

  // Layer 3: Moon & Shooting Stars
  renderMoon(ctx, width, height, scrollProgress) {
    ctx.save();
    // Render Shooting Stars
    for (const s of this.shootingStars) {
      ctx.strokeStyle = `rgba(0, 229, 255, ${s.alpha})`;
      ctx.lineWidth = 2;
      ctx.shadowColor = '#00e5ff';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle) * s.length, s.y - Math.sin(s.angle) * s.length);
      ctx.stroke();
    }

    // Moon Position
    const moonX = width * 0.78 - (scrollProgress * width * 0.15);
    const moonY = height * 0.22;
    const radius = 32;

    const theme = SkyRenderer.BIOME_SKY_THEMES[this.targetBiomeIndex] || SkyRenderer.BIOME_SKY_THEMES[0];
    const haloGrad = ctx.createRadialGradient(moonX, moonY, radius * 0.5, moonX, moonY, radius * 3);
    haloGrad.addColorStop(0, theme.moonHalo);
    haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius * 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e1f5fe';
    ctx.beginPath();
    ctx.arc(moonX, moonY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(moonX - 12, moonY - 10, 8, 8);
    ctx.fillRect(moonX - 10, moonY - 12, 4, 12);
    ctx.fillRect(moonX + 6, moonY + 4, 10, 6);

    ctx.fillStyle = 'rgba(16, 20, 36, 0.55)';
    ctx.beginPath();
    ctx.arc(moonX + 8, moonY - 4, radius * 0.85, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Layer 6: Clouds
  renderClouds(ctx, width, height, scrollProgress) {
    ctx.save();
    const parallaxOffset = scrollProgress * width * 0.3;
    const theme = SkyRenderer.BIOME_SKY_THEMES[this.targetBiomeIndex] || SkyRenderer.BIOME_SKY_THEMES[0];

    for (const cloud of this.clouds) {
      const cx = (cloud.x - parallaxOffset) % (width + cloud.width + 200) - cloud.width;
      const cy = cloud.y;

      ctx.fillStyle = theme.cloudColor;
      const w = cloud.width;
      const h = cloud.height;

      ctx.fillRect(Math.floor(cx), Math.floor(cy + h * 0.4), Math.floor(w), Math.floor(h * 0.6));
      ctx.fillRect(Math.floor(cx + w * 0.2), Math.floor(cy + h * 0.15), Math.floor(w * 0.35), Math.floor(h * 0.4));
      ctx.fillRect(Math.floor(cx + w * 0.45), Math.floor(cy), Math.floor(w * 0.4), Math.floor(h * 0.55));
      ctx.fillRect(Math.floor(cx + w * 0.7), Math.floor(cy + h * 0.25), Math.floor(w * 0.25), Math.floor(h * 0.35));
    }
    ctx.restore();
  }

  getSkyGradient(ctx, height) {
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    const themeA = SkyRenderer.BIOME_SKY_THEMES[this.currentBiomeIndex] || SkyRenderer.BIOME_SKY_THEMES[0];
    const themeB = SkyRenderer.BIOME_SKY_THEMES[this.targetBiomeIndex] || SkyRenderer.BIOME_SKY_THEMES[0];
    const t = this.transitionProgress;

    const lerpColor = (c1, c2) => {
      const r = Math.round(c1[0] + (c2[0] - c1[0]) * t);
      const g = Math.round(c1[1] + (c2[1] - c1[1]) * t);
      const b = Math.round(c1[2] + (c2[2] - c1[2]) * t);
      return `rgb(${r}, ${g}, ${b})`;
    };

    grad.addColorStop(0, lerpColor(themeA.top, themeB.top));
    grad.addColorStop(0.6, lerpColor(themeA.mid, themeB.mid));
    grad.addColorStop(1, lerpColor(themeA.bot, themeB.bot));

    return grad;
  }
}
