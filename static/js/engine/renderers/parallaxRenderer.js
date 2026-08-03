/**
 * ParallaxRenderer.js - Multi-Layer Parallax Background & Environmental Landscapes
 * Realm of Echoes: Biome Theme Engine & Single Source of Truth Coordinates
 */

class ParallaxRenderer {
  static BIOME_PARALLAX_THEMES = [
    // 0: Forest
    { mountainColor: 'rgba(24, 18, 48, 0.75)', nearColor: '#1b4332', grassColor: '#00c853' },
    // 1: Village
    { mountainColor: 'rgba(45, 20, 50, 0.75)', nearColor: '#2e1c0c', grassColor: '#ffb300' },
    // 2: Station
    { mountainColor: 'rgba(20, 25, 55, 0.75)', nearColor: '#152038', grassColor: '#00e5ff' },
    // 3: Lab
    { mountainColor: 'rgba(15, 22, 45, 0.75)', nearColor: '#0f172a', grassColor: '#00e676' },
    // 4: Shrine
    { mountainColor: 'rgba(50, 15, 45, 0.75)', nearColor: '#2a1038', grassColor: '#e040fb' },
    // 5: Observatory
    { mountainColor: 'rgba(12, 16, 38, 0.75)', nearColor: '#0d152a', grassColor: '#80d8ff' },
    // 6: Spire
    { mountainColor: 'rgba(55, 12, 40, 0.75)', nearColor: '#300a24', grassColor: '#ffab40' }
  ];

  constructor() {
    this.time = 0;
    this.dragonPosition = { x: 0, y: 0 };
    this.currentBiomeIndex = 0;
    this.targetBiomeIndex = 0;
    this.transitionProgress = 1.0;
  }

  update(dt, activeBiomeIndex = 0) {
    this.time += dt;

    if (activeBiomeIndex !== this.targetBiomeIndex) {
      this.currentBiomeIndex = this.targetBiomeIndex;
      this.targetBiomeIndex = Math.min(6, Math.max(0, activeBiomeIndex));
      this.transitionProgress = 0.0;
    }

    if (this.transitionProgress < 1.0) {
      this.transitionProgress += dt * 0.67;
      if (this.transitionProgress >= 1.0) {
        this.transitionProgress = 1.0;
        this.currentBiomeIndex = this.targetBiomeIndex;
      }
    }

    // Animate dragon silhouette flight trajectory across Spire & Observatory horizon
    this.dragonPosition.x = (this.time * 40) % 2500 - 300;
    this.dragonPosition.y = 120 + Math.sin(this.time * 0.8) * 35;
  }

  // Layer 4: Far Mountains
  renderFarMountains(ctx, width, height, scrollProgress) {
    ctx.save();
    const offsetX = (scrollProgress * width * 0.3) % (width * 1.5);
    const theme = ParallaxRenderer.BIOME_PARALLAX_THEMES[this.targetBiomeIndex] || ParallaxRenderer.BIOME_PARALLAX_THEMES[0];

    ctx.fillStyle = theme.mountainColor;
    ctx.beginPath();
    ctx.moveTo(-100, height);

    const peaks = [
      { x: 0, y: height * 0.4 },
      { x: width * 0.15, y: height * 0.6 },
      { x: width * 0.3, y: height * 0.35 },
      { x: width * 0.5, y: height * 0.55 },
      { x: width * 0.7, y: height * 0.38 },
      { x: width * 0.88, y: height * 0.65 },
      { x: width * 1.1, y: height * 0.32 },
      { x: width * 1.3, y: height * 0.7 },
      { x: width * 1.5, y: height * 0.4 }
    ];

    for (const peak of peaks) {
      const px = peak.x - offsetX;
      ctx.lineTo(px, peak.y);
    }

    ctx.lineTo(width + 200, height);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Layer 5: Near Mountains / Midground Features
  renderNearMountains(ctx, width, height, scrollProgress) {
    ctx.save();
    const offsetX = (scrollProgress * width * 0.6);

    // Biome Specific Background Assets
    if (this.targetBiomeIndex === 0) {
      // Forest Ancient Archway & Deep Pines
      const archX = width * 0.15 - (offsetX * 0.2);
      if (archX > -200 && archX < width + 200) {
        this.drawStoneArchway(ctx, archX, height * 0.75 - 140);
      }
    } else if (this.targetBiomeIndex === 1) {
      // Village Thatched Roof Silhouettes
      const villageX = width * 0.3 - (offsetX * 0.2);
      if (villageX > -200 && villageX < width + 200) {
        this.drawVillageRoofSilhouettes(ctx, villageX, height * 0.75);
      }
    } else if (this.targetBiomeIndex === 2) {
      // Station Telegraph Towers
      const stationX = width * 0.45 - (offsetX * 0.2);
      if (stationX > -200 && stationX < width + 200) {
        this.drawTelegraphTower(ctx, stationX, height * 0.75 - 180);
      }
    } else if (this.targetBiomeIndex === 3) {
      // Laboratory Energy Monoliths
      const labX = width * 0.55 - (offsetX * 0.2);
      if (labX > -200 && labX < width + 200) {
        this.drawEnergyMonolith(ctx, labX, height * 0.75 - 160);
      }
    } else if (this.targetBiomeIndex === 4) {
      // Shrine Ether Monoliths
      const shrineX = width * 0.65 - (offsetX * 0.2);
      if (shrineX > -200 && shrineX < width + 200) {
        this.drawEtherMonolith(ctx, shrineX, height * 0.75 - 190);
      }
    } else if (this.targetBiomeIndex === 5) {
      // Observatory Domes & Constellation Board
      const obsX = width * 0.75 - (offsetX * 0.2);
      if (obsX > -200 && obsX < width + 200) {
        this.drawObservatoryDomeSilhouette(ctx, obsX, height * 0.75 - 150);
      }
    } else if (this.targetBiomeIndex === 6) {
      // Spire Citadel Floating Castle & Dragon Silhouette
      const islandX = width * 0.5 - (offsetX * 0.3);
      const islandY = height * 0.28;
      this.drawFloatingIsland(ctx, islandX, islandY, 180, 80);
      this.drawDragonSilhouette(ctx, this.dragonPosition.x - (offsetX * 0.2), this.dragonPosition.y);
    }

    ctx.restore();
  }

  // Layer 9: Foreground Ground
  renderForegroundGround(ctx, width, height, scrollProgress) {
    ctx.save();
    const groundY = WorldState.getGroundY(height);
    const theme = ParallaxRenderer.BIOME_PARALLAX_THEMES[this.targetBiomeIndex] || ParallaxRenderer.BIOME_PARALLAX_THEMES[0];

    // Deep Ground Base
    ctx.fillStyle = '#0a0d17';
    ctx.fillRect(0, groundY, width, height - groundY);

    // Soil & Layer Trim
    ctx.fillStyle = '#121829';
    ctx.fillRect(0, groundY, width, 16);

    // Animated Swaying Grass & Flowers across screen
    for (let x = 0; x < width; x += 12) {
      const sway = Math.sin(this.time * 3 + x * 0.05) * 4;

      ctx.fillStyle = theme.grassColor;
      ctx.fillRect(x, groundY - 8, 3, 8);
      ctx.fillRect(x + Math.floor(sway * 0.5), groundY - 14, 2, 6);

      if (x % 60 === 0) {
        const flowerGlow = (x % 120 === 0) ? '#ff80ab' : theme.grassColor;
        const flowerY = groundY - 16;

        ctx.fillStyle = '#2e7d32';
        ctx.fillRect(x + 1, flowerY, 2, 16);

        ctx.fillStyle = flowerGlow;
        ctx.shadowColor = flowerGlow;
        ctx.shadowBlur = 6;
        ctx.fillRect(x - 2 + Math.floor(sway * 0.3), flowerY - 4, 8, 6);
        ctx.fillRect(x + Math.floor(sway * 0.3), flowerY - 6, 4, 10);
      }
    }

    ctx.restore();
  }

  drawStoneArchway(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#1e2436';
    ctx.fillRect(Math.floor(x), Math.floor(y), 24, 140);
    ctx.fillRect(Math.floor(x + 96), Math.floor(y), 24, 140);
    ctx.fillRect(Math.floor(x - 8), Math.floor(y - 20), 136, 24);

    ctx.fillStyle = '#00c853';
    ctx.shadowColor = '#00c853';
    ctx.shadowBlur = 10;
    ctx.fillRect(x + 8, y + 40, 8, 8);
    ctx.fillRect(x + 104, y + 40, 8, 8);
    ctx.restore();
  }

  drawVillageRoofSilhouettes(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#181328';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + 50, y - 70);
    ctx.lineTo(x + 100, y);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawTelegraphTower(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#152038';
    ctx.fillRect(x, y, 12, 180);
    ctx.fillRect(x - 20, y + 30, 52, 8);
    ctx.fillRect(x - 14, y + 70, 40, 8);
    ctx.restore();
  }

  drawEnergyMonolith(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x, y, 32, 160);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 12;
    ctx.fillRect(x + 12, y + 20, 8, 120);
    ctx.restore();
  }

  drawEtherMonolith(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#2a1038';
    ctx.fillRect(x, y, 36, 190);
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(x + 18, y - 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawObservatoryDomeSilhouette(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#0d152a';
    ctx.beginPath();
    ctx.arc(x, y + 50, 60, Math.PI, 0);
    ctx.fill();
    ctx.restore();
  }

  drawFloatingIsland(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = '#1e3a29';
    ctx.fillRect(Math.floor(x), Math.floor(y), Math.floor(w), 12);
    ctx.fillStyle = '#121424';
    ctx.beginPath();
    ctx.moveTo(x, y + 12);
    ctx.lineTo(x + w * 0.2, y + h);
    ctx.lineTo(x + w * 0.5, y + h * 1.3);
    ctx.lineTo(x + w * 0.85, y + h * 0.8);
    ctx.lineTo(x + w, y + 12);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  drawDragonSilhouette(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = 'rgba(20, 14, 38, 0.85)';
    const wingFlap = Math.sin(this.time * 8) * 12;
    ctx.fillRect(Math.floor(x), Math.floor(y), 28, 8);
    ctx.fillRect(Math.floor(x + 24), Math.floor(y - 4), 10, 8);
    ctx.beginPath();
    ctx.moveTo(x + 8, y + 4);
    ctx.lineTo(x + 2, y - 24 + wingFlap);
    ctx.lineTo(x + 18, y + 4);
    ctx.fill();
    ctx.restore();
  }
}
