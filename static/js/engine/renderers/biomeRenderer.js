/**
 * BiomeRenderer.js - Handcrafted Biomes & 1:1 Door Sprite Alignment
 * Realm of Echoes: Single Source of Truth World Coordinates
 */

class BiomeRenderer {
  constructor() {
    this.time = 0;
  }

  update(dt) {
    this.time += dt;
  }

  // Helper for world position to screen position calculation
  getScreenX(progress, cameraOffsetX) {
    const totalWorldWidth = window.innerWidth * WorldState.WORLD_WIDTH_MULTIPLIER;
    const startX = window.innerWidth * 0.2;
    const worldX = startX + (progress * totalWorldWidth);
    return worldX - cameraOffsetX;
  }

  // Layer 7: Environment Trees
  renderTrees(ctx, width, height, scrollProgress, cameraOffsetX) {
    ctx.save();
    const groundY = WorldState.getGroundY(height);

    // Forest Trees (Progress: 0.05)
    const forestX = this.getScreenX(0.05, cameraOffsetX);
    if (forestX > -600 && forestX < width + 600) {
      this.drawPixelTree(ctx, forestX - 180, groundY - 180, 120, 180);
      this.drawPixelTree(ctx, forestX + 160, groundY - 150, 90, 150);
    }

    // Village Trees (Progress: 0.18)
    const villageX = this.getScreenX(0.18, cameraOffsetX);
    if (villageX > -600 && villageX < width + 600) {
      this.drawPixelTree(ctx, villageX - 220, groundY - 140, 80, 140);
    }

    ctx.restore();
  }

  // Layer 8: Building Structures
  renderBuildings(ctx, width, height, scrollProgress, activeBiomeIndex, emotionState, cameraOffsetX) {
    ctx.save();
    const groundY = WorldState.getGroundY(height);

    // 1. Forest Biome (Progress: 0.05 - Hidden Cabin)
    this.renderForestCabin(ctx, this.getScreenX(0.05, cameraOffsetX), groundY);

    // 2. Village Biome (Progress: 0.18 - Town Hall)
    this.renderVillageStructures(ctx, this.getScreenX(0.18, cameraOffsetX), groundY);

    // 3. Review Station Biome (Progress: 0.35 - Post Office)
    this.renderStationStructures(ctx, this.getScreenX(0.35, cameraOffsetX), groundY);

    // 4. Research Laboratory Biome (Progress: 0.52 - Main Lab)
    this.renderLaboratoryStructures(ctx, this.getScreenX(0.52, cameraOffsetX), groundY);

    // 5. Emotion Engine Shrine (Progress: 0.68 - Shrine)
    this.renderEmotionShrine(ctx, this.getScreenX(0.68, cameraOffsetX), groundY, emotionState);

    // 6. Analytics Observatory (Progress: 0.85 - Observatory)
    this.renderObservatoryBuilding(ctx, this.getScreenX(0.85, cameraOffsetX), groundY);

    // 7. Credits Spire Citadel (Progress: 0.98 - Citadel)
    this.renderCreditsCitadel(ctx, this.getScreenX(0.98, cameraOffsetX), groundY);

    ctx.restore();
  }

  renderForestCabin(ctx, screenX, groundY) {
    if (screenX < -500 || screenX > window.innerWidth + 500) return;

    ctx.save();
    ctx.fillStyle = '#2e1c0c';
    ctx.fillRect(screenX - 60, groundY - 110, 120, 110);
    
    ctx.fillStyle = '#5d4037';
    ctx.beginPath();
    ctx.moveTo(screenX - 72, groundY - 110);
    ctx.lineTo(screenX, groundY - 160);
    ctx.lineTo(screenX + 72, groundY - 110);
    ctx.closePath();
    ctx.fill();

    // Door centered at screenX
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 12;
    ctx.fillRect(screenX - 14, groundY - 50, 28, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Hidden Cabin", screenX, groundY - 175);

    ctx.restore();
  }

  drawPixelTree(ctx, x, y, w, h) {
    ctx.save();
    const windSway = Math.sin(this.time * 2 + x) * 4;

    ctx.fillStyle = '#2d1b10';
    ctx.fillRect(Math.floor(x + w * 0.4), Math.floor(y + h * 0.4), Math.floor(w * 0.2), Math.floor(h * 0.6));

    ctx.fillStyle = '#1b4332';
    ctx.fillRect(Math.floor(x + windSway), Math.floor(y + h * 0.2), Math.floor(w), Math.floor(h * 0.4));
    ctx.fillStyle = '#2d6a4f';
    ctx.fillRect(Math.floor(x + w * 0.15 + windSway), Math.floor(y + h * 0.08), Math.floor(w * 0.7), Math.floor(h * 0.35));
    ctx.fillStyle = '#52b788';
    ctx.fillRect(Math.floor(x + w * 0.3 + windSway), Math.floor(y), Math.floor(w * 0.4), Math.floor(h * 0.25));

    ctx.restore();
  }

  renderVillageStructures(ctx, screenX, groundY) {
    if (screenX < -600 || screenX > window.innerWidth + 600) return;

    ctx.save();
    this.drawPixelHouse(ctx, screenX, groundY - 140, 160, 140, '#311b92', "Village Town Hall");
    this.drawStreetLantern(ctx, screenX + 120, groundY - 90);

    ctx.restore();
  }

  drawPixelHouse(ctx, centerX, y, w, h, roofColor, nameLabel) {
    ctx.save();
    const x = centerX - w * 0.5;

    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(Math.floor(x), Math.floor(y + h * 0.35), Math.floor(w), Math.floor(h * 0.65));

    ctx.fillStyle = '#3f2b96';
    const chimneyX = x + w * 0.75;
    const chimneyY = y - 10;
    ctx.fillRect(chimneyX, chimneyY, 20, 40);

    ctx.fillStyle = roofColor;
    ctx.beginPath();
    ctx.moveTo(x - 12, y + h * 0.35);
    ctx.lineTo(centerX, y);
    ctx.lineTo(x + w + 12, y + h * 0.35);
    ctx.closePath();
    ctx.fill();

    const flicker = Math.sin(this.time * 8 + centerX) * 0.15 + 0.85;
    ctx.fillStyle = `rgba(255, 213, 79, ${flicker})`;
    ctx.shadowColor = '#ffd54f';
    ctx.shadowBlur = 12;
    ctx.fillRect(x + 20, y + h * 0.5, 28, 28);
    ctx.fillRect(x + w - 48, y + h * 0.5, 28, 28);

    // Door centered at centerX
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 12;
    ctx.fillRect(centerX - 14, y + h - 44, 28, 44);

    if (nameLabel) {
      ctx.fillStyle = '#ffe082';
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText(nameLabel, centerX, y - 16);
    }

    ctx.restore();
  }

  drawStreetLantern(ctx, x, y) {
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(Math.floor(x), Math.floor(y), 8, 90);
    
    const flickerAlpha = Math.sin(this.time * 12 + x) * 0.2 + 0.8;
    ctx.fillStyle = `rgba(0, 229, 255, ${flickerAlpha})`;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 16;
    ctx.fillRect(x - 6, y - 16, 20, 20);

    ctx.restore();
  }

  renderStationStructures(ctx, screenX, groundY) {
    if (screenX < -600 || screenX > window.innerWidth + 600) return;

    ctx.save();
    ctx.fillStyle = '#1e1035';
    ctx.fillRect(Math.floor(screenX - 100), Math.floor(groundY - 150), 200, 150);
    
    const signSwing = Math.sin(this.time * 2) * 4;
    ctx.save();
    ctx.translate(screenX, groundY - 130);
    ctx.rotate(signSwing * Math.PI / 180);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(-70, 0, 140, 30);
    ctx.fillStyle = '#000';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('POST STATION', -62, 20);
    ctx.restore();

    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 12;
    ctx.fillRect(screenX - 16, groundY - 50, 32, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Echo Post Office", screenX, groundY - 165);

    ctx.restore();
  }

  renderLaboratoryStructures(ctx, screenX, groundY) {
    if (screenX < -600 || screenX > window.innerWidth + 600) return;

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(Math.floor(screenX - 130), Math.floor(groundY - 180), 260, 180);

    const pulseAlpha = (Math.sin(this.time * 4) + 1) * 0.5;
    ctx.fillStyle = `rgba(0, 229, 255, ${pulseAlpha * 0.6 + 0.4})`;
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 16;
    ctx.fillRect(screenX - 130, groundY - 120, 260, 12);

    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(screenX - 16, groundY - 50, 32, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Main Laboratory", screenX, groundY - 195);

    ctx.restore();
  }

  renderEmotionShrine(ctx, screenX, groundY, emotionState) {
    if (screenX < -600 || screenX > window.innerWidth + 600) return;

    ctx.save();
    const auraColor = emotionState === 'Positive' ? '#00e676' : (emotionState === 'Negative' ? '#ff1744' : '#00e5ff');

    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(Math.floor(screenX - 110), Math.floor(groundY - 60), 220, 60);

    ctx.fillStyle = '#121426';
    ctx.fillRect(screenX - 90, groundY - 180, 24, 120);
    ctx.fillRect(screenX - 40, groundY - 210, 24, 150);
    ctx.fillRect(screenX + 35, groundY - 210, 24, 150);
    ctx.fillRect(screenX + 85, groundY - 180, 24, 120);

    const orbY = groundY - 140 + Math.sin(this.time * 2.5) * 12;
    ctx.fillStyle = auraColor;
    ctx.shadowColor = auraColor;
    ctx.shadowBlur = 28;
    ctx.beginPath();
    ctx.arc(screenX, orbY, 28, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 12;
    ctx.fillRect(screenX - 14, groundY - 50, 28, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Temple Shrine", screenX, groundY - 225);

    ctx.restore();
  }

  renderObservatoryBuilding(ctx, screenX, groundY) {
    if (screenX < -700 || screenX > window.innerWidth + 700) return;

    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(Math.floor(screenX - 150), Math.floor(groundY - 160), 300, 160);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.arc(screenX, groundY - 160, 90, Math.PI, 0);
    ctx.fill();

    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 12;
    ctx.beginPath();
    ctx.moveTo(screenX, groundY - 200);
    ctx.lineTo(screenX + 70, groundY - 270);
    ctx.stroke();

    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(screenX - 16, groundY - 50, 32, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Observatory Deck", screenX, groundY - 280);

    ctx.restore();
  }

  renderCreditsCitadel(ctx, screenX, groundY) {
    if (screenX < -600 || screenX > window.innerWidth + 600) return;

    ctx.save();
    ctx.fillStyle = '#1e112a';
    ctx.fillRect(Math.floor(screenX - 80), Math.floor(groundY - 260), 160, 260);

    ctx.beginPath();
    ctx.moveTo(screenX - 100, groundY - 260);
    ctx.lineTo(screenX, groundY - 360);
    ctx.lineTo(screenX + 100, groundY - 260);
    ctx.closePath();
    ctx.fill();

    // Spire Citadel Entrance Door centered at screenX
    ctx.fillStyle = '#ffab40';
    ctx.shadowColor = '#ffab40';
    ctx.shadowBlur = 16;
    ctx.fillRect(screenX - 16, groundY - 50, 32, 50);

    ctx.fillStyle = '#ffe082';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText("Spire Citadel", screenX, groundY - 375);

    ctx.restore();
  }
}
