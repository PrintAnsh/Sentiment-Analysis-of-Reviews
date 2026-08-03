/**
 * WorldObjects.js - Unified World Coordinate Interactive Object Manager
 * Realm of Echoes: Single Source of Truth Coordinates
 */

class WorldObjectManager {
  constructor() {
    this.objects = [];
    this.initWorldObjects();
  }

  initWorldObjects() {
    this.objects = [
      // Forest Biome (0.0 - 0.15)
      { id: 'sign_forest', type: 'sign', progress: 0.04, name: 'Woodland Signboard', pages: ["🌲 Whispering Woodland: Beware of lingering sentiment echoes."] },
      { id: 'flower_1', type: 'flower', progress: 0.07, name: 'Glowing Flora' },
      { id: 'shroom_1', type: 'mushroom', progress: 0.10, name: 'Luminous Shroom' },
      { id: 'ruins_1', type: 'ruins', progress: 0.13, name: 'Ancient Stone Pillar' },

      // Village Biome (0.15 - 0.32)
      { id: 'treasure_chest', type: 'chest', progress: 0.20, name: 'Ancient Treasure Chest', isOpen: false, pages: ["📦 You opened the Treasure Chest! Inside is an Ancient Sentiment Rune (+50 Arcane Knowledge)."] },
      { id: 'lantern_1', type: 'lantern', progress: 0.22, name: 'Village Streetlamp' },
      { id: 'crate_1', type: 'crate', progress: 0.27, name: 'Merchant Crate' },
      { id: 'fence_1', type: 'fence', progress: 0.30, name: 'Wooden Fence' },

      // Review Station Biome (0.32 - 0.48)
      { id: 'station_mailbox', type: 'mailbox', progress: 0.37, name: 'Echo Post Mailbox', pages: ["📮 Echo Post Mailbox: 14 new review letters waiting for analysis in the Laboratory!"] },
      { id: 'sign_station', type: 'sign', progress: 0.42, name: 'Station Notice Board', pages: ["📜 Post Notice: Submit review text at the Research Laboratory terminal."] },

      // Laboratory Biome (0.48 - 0.62)
      { id: 'terminal_machine', type: 'terminal', progress: 0.54, name: 'Alchemical ML Forge', pages: ["🧪 Alchemical ML Forge: Ignition key ready. Enter review text to analyze sentiment."] },
      { id: 'crystal_tube', type: 'glowing_tube', progress: 0.58, name: 'Sentiment Core Reactor' },

      // Shrine Biome (0.62 - 0.78)
      { id: 'shrine_altar', type: 'altar', progress: 0.66, name: 'Ether Sentiment Altar', pages: ["🔮 Ether Altar: The sentiment energy of all analyzed reviews resonates here."] },
      { id: 'lantern_2', type: 'lantern', progress: 0.74, name: 'Shrine Torch' },

      // Observatory & Spire (0.78 - 1.0)
      { id: 'observatory_telescope', type: 'telescope', progress: 0.82, name: 'Celestial Telescope', pages: ["🔭 Celestial Telescope: Observing sentiment constellations across the kingdom."] },
      { id: 'sign_spire', type: 'sign', progress: 0.94, name: 'Spire Horizon Marker', pages: ["🏰 Spire Horizon: The highest point of the Realm of Echoes."] }
    ];
  }

  update(dt, cameraOffsetX) {
    const groundY = WorldState.getGroundY() - 48;
    const totalWorldWidth = window.innerWidth * WorldState.WORLD_WIDTH_MULTIPLIER;
    const startX = window.innerWidth * 0.2;

    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      obj.x = startX + (obj.progress * totalWorldWidth);
      obj.renderX = obj.x - cameraOffsetX;
      obj.renderY = groundY;
    }
  }

  getNearestObject(playerX, cameraOffsetX) {
    const interactionRadius = 90;
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      if (!obj.pages) continue;

      const dist = Math.abs(playerX - obj.x);
      if (dist < interactionRadius && dist < minDist) {
        minDist = dist;
        nearest = obj;
      }
    }
    return nearest;
  }

  render(ctx) {
    for (let i = 0; i < this.objects.length; i++) {
      const obj = this.objects[i];
      const rx = Math.floor(obj.renderX);
      const ry = Math.floor(obj.renderY);

      if (rx < -100 || rx > window.innerWidth + 100) continue;

      ctx.save();

      switch (obj.type) {
        case 'mailbox':
          this.renderMailbox(ctx, rx, ry);
          break;
        case 'chest':
          this.renderChest(ctx, rx, ry, obj.isOpen);
          break;
        case 'terminal':
          this.renderTerminal(ctx, rx, ry);
          break;
        case 'sign':
          this.renderSign(ctx, rx, ry);
          break;
        case 'flower':
          this.renderFlower(ctx, rx, ry);
          break;
        case 'mushroom':
          this.renderMushroom(ctx, rx, ry);
          break;
        case 'ruins':
          this.renderRuins(ctx, rx, ry);
          break;
        case 'barrel':
          this.renderBarrel(ctx, rx, ry);
          break;
        case 'crate':
          this.renderCrate(ctx, rx, ry);
          break;
        case 'lantern':
          this.renderLantern(ctx, rx, ry);
          break;
        case 'fence':
          this.renderFence(ctx, rx, ry);
          break;
        case 'altar':
          this.renderAltar(ctx, rx, ry);
          break;
        case 'telescope':
          this.renderTelescope(ctx, rx, ry);
          break;
        default:
          this.renderGenericObject(ctx, rx, ry, obj.name);
          break;
      }

      ctx.restore();
    }
  }

  renderMailbox(ctx, x, y) {
    ctx.fillStyle = '#795548';
    ctx.fillRect(x + 12, y + 16, 8, 28);
    ctx.fillStyle = '#d32f2f';
    ctx.fillRect(x + 2, y, 28, 20);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x + 22, y + 4, 4, 10);
  }

  renderChest(ctx, x, y, isOpen) {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x, y + 10, 32, 22);
    ctx.fillStyle = '#ffb300';
    ctx.fillRect(x, y + 8, 32, 4);
    ctx.fillRect(x + 13, y + 16, 6, 6);

    if (isOpen) {
      ctx.fillStyle = '#ffd54f';
      ctx.shadowColor = '#ffd54f';
      ctx.shadowBlur = 12;
      ctx.fillRect(x + 4, y, 24, 8);
    }
  }

  renderTerminal(ctx, x, y) {
    ctx.fillStyle = '#263238';
    ctx.fillRect(x, y - 10, 36, 44);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 10;
    ctx.fillRect(x + 4, y - 4, 28, 20);
  }

  renderSign(ctx, x, y) {
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(x + 12, y + 12, 8, 28);
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x, y, 32, 18);
  }

  renderFlower(ctx, x, y) {
    ctx.fillStyle = '#2e7d32';
    ctx.fillRect(x + 6, y + 24, 4, 12);
    ctx.fillStyle = '#ff80ab';
    ctx.shadowColor = '#ff80ab';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x + 8, y + 22, 6, 0, Math.PI * 2);
    ctx.fill();
  }

  renderMushroom(ctx, x, y) {
    ctx.fillStyle = '#fff59d';
    ctx.fillRect(x + 6, y + 26, 4, 10);
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 6;
    ctx.beginPath();
    ctx.arc(x + 8, y + 24, 7, Math.PI, 0);
    ctx.fill();
  }

  renderRuins(ctx, x, y) {
    ctx.fillStyle = '#546e7a';
    ctx.fillRect(x, y - 16, 20, 52);
    ctx.fillStyle = '#37474f';
    ctx.fillRect(x - 4, y - 22, 28, 6);
  }

  renderBarrel(ctx, x, y) {
    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(x, y + 12, 24, 24);
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(x, y + 16, 24, 3);
    ctx.fillRect(x, y + 28, 24, 3);
  }

  renderCrate(ctx, x, y) {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x, y + 10, 26, 26);
    ctx.strokeStyle = '#4e342e';
    ctx.strokeRect(x + 2, y + 12, 22, 22);
  }

  renderLantern(ctx, x, y) {
    ctx.fillStyle = '#37474f';
    ctx.fillRect(x + 10, y, 4, 36);
    ctx.fillStyle = '#ffd54f';
    ctx.shadowColor = '#ffd54f';
    ctx.shadowBlur = 12;
    ctx.fillRect(x + 6, y + 4, 12, 12);
  }

  renderFence(ctx, x, y) {
    ctx.fillStyle = '#8d6e63';
    ctx.fillRect(x, y + 14, 40, 4);
    ctx.fillRect(x, y + 24, 40, 4);
    ctx.fillRect(x + 4, y + 10, 6, 24);
    ctx.fillRect(x + 30, y + 10, 6, 24);
  }

  renderAltar(ctx, x, y) {
    ctx.fillStyle = '#455a64';
    ctx.fillRect(x - 10, y + 12, 48, 24);
    ctx.fillStyle = '#00e676';
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.arc(x + 14, y + 4, 8, 0, Math.PI * 2);
    ctx.fill();
  }

  renderTelescope(ctx, x, y) {
    ctx.fillStyle = '#78909c';
    ctx.fillRect(x + 12, y + 16, 6, 24);
    ctx.save();
    ctx.translate(x + 15, y + 16);
    ctx.rotate(-Math.PI / 6);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-16, -4, 32, 8);
    ctx.restore();
  }

  renderGenericObject(ctx, x, y, name) {
    ctx.fillStyle = '#ab47bc';
    ctx.fillRect(x, y + 10, 20, 26);
  }
}
