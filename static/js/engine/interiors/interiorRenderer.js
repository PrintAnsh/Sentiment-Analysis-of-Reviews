/**
 * InteriorRenderer.js - Rich Pixel Scenery for Building Interior Rooms
 * Realm of Echoes: Single Source of Truth Interior Engine
 */

class InteriorRenderer {
  static INTERIOR_CONFIGS = {
    cabin: {
      name: "Hidden Cabin",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    village_hall: {
      name: "Village Town Hall",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    station: {
      name: "Echo Post Office",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    lab: {
      name: "Main Laboratory",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    shrine: {
      name: "Temple Shrine",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    observatory: {
      name: "Observatory Deck",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    },
    spire: {
      name: "Spire Citadel",
      spawnPoint: { x: 140, y: 460 },
      exitDoor: { x: 60, y: 410, width: 36, height: 50 }
    }
  };

  static getSpawnPoint(roomType) {
    const config = this.INTERIOR_CONFIGS[roomType] || this.INTERIOR_CONFIGS.lab;
    return { ...config.spawnPoint };
  }

  static getExitDoor(roomType) {
    const config = this.INTERIOR_CONFIGS[roomType] || this.INTERIOR_CONFIGS.lab;
    return { ...config.exitDoor };
  }

  static renderInterior(ctx, width, height, roomType, time, lightingSystem) {
    ctx.save();

    const config = this.INTERIOR_CONFIGS[roomType] || this.INTERIOR_CONFIGS.lab;
    const floorY = height * 0.75;
    const wallHeight = floorY;

    // 1. Render Room Back Wall & Flooring
    ctx.fillStyle = '#0f1424';
    ctx.fillRect(0, 0, width, wallHeight);

    ctx.fillStyle = '#1a2035';
    ctx.fillRect(0, wallHeight, width, height - wallHeight);

    // Floor Planks / Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, wallHeight);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // 2. Render Specific Room Interior
    switch (roomType) {
      case 'cabin':
        this.renderCabinInterior(ctx, width, height, floorY, time);
        break;
      case 'village_hall':
        this.renderVillageHallInterior(ctx, width, height, floorY, time);
        break;
      case 'station':
        this.renderStationInterior(ctx, width, height, floorY, time);
        break;
      case 'lab':
        this.renderLabInterior(ctx, width, height, floorY, time);
        break;
      case 'shrine':
        this.renderShrineInterior(ctx, width, height, floorY, time);
        break;
      case 'observatory':
        this.renderObservatoryInterior(ctx, width, height, floorY, time);
        break;
      case 'spire':
        this.renderSpireInterior(ctx, width, height, floorY, time);
        break;
      default:
        this.renderLabInterior(ctx, width, height, floorY, time);
        break;
    }

    // 3. Render Exit Portal
    const door = config.exitDoor;
    const doorY = floorY - door.height;
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 16;
    ctx.fillRect(door.x, doorY, door.width, door.height);

    ctx.fillStyle = '#fff';
    ctx.font = '9px "Press Start 2P", monospace';
    ctx.fillText("EXIT", door.x + 2, doorY - 8);

    ctx.restore();
  }

  static renderCabinInterior(ctx, width, height, floorY, time) {
    // Woodland Cabin Fireplace & Herbal Desk
    ctx.fillStyle = '#3e2723';
    ctx.fillRect(200, floorY - 90, 70, 90);

    const flameH = Math.sin(time * 6) * 4 + 18;
    ctx.fillStyle = '#ff6d00';
    ctx.shadowColor = '#ff6d00';
    ctx.shadowBlur = 12;
    ctx.fillRect(225, floorY - flameH - 10, 20, flameH);

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(340, floorY - 40, 120, 40);
    ctx.fillStyle = '#00e676';
    ctx.fillRect(360, floorY - 55, 12, 15);
    ctx.fillStyle = '#ff4081';
    ctx.fillRect(400, floorY - 55, 12, 15);

    this.renderNPC(ctx, 500, floorY - 36, "🧝 Woodland Ranger", "#81c784", time);
  }

  static renderVillageHallInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#37474f';
    ctx.fillRect(200, floorY - 80, 80, 80);

    const flameH = Math.sin(time * 8) * 6 + 20;
    ctx.fillStyle = '#ff6d00';
    ctx.shadowColor = '#ff6d00';
    ctx.shadowBlur = 14;
    ctx.fillRect(230, floorY - flameH, 20, flameH);

    ctx.fillStyle = '#5d4037';
    ctx.fillRect(340, floorY - 36, 120, 36);
    ctx.fillRect(320, floorY - 24, 16, 24);
    ctx.fillRect(468, floorY - 24, 16, 24);

    this.renderNPC(ctx, 520, floorY - 36, "🧙‍♂️ Elder Oracle", "#ffd54f", time);
  }

  static renderStationInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#263238';
    ctx.fillRect(180, floorY - 60, 100, 60);
    ctx.fillStyle = '#00e5ff';
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 8;
    ctx.fillRect(190, floorY - 50, 80, 30);

    ctx.fillStyle = '#795548';
    ctx.fillRect(340, floorY - 40, 120, 40);

    this.renderNPC(ctx, 500, floorY - 36, "👷 Post Engineer", "#00e676", time);
  }

  static renderLabInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#4e342e';
    ctx.fillRect(150, floorY - 90, 60, 90);
    ctx.fillStyle = '#ff80ab';
    ctx.fillRect(156, floorY - 80, 48, 10);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(156, floorY - 60, 48, 10);

    ctx.fillStyle = '#6d4c41';
    ctx.fillRect(300, floorY - 40, 140, 40);
    
    const tubeGlow = Math.sin(time * 4) * 8 + 12;
    ctx.fillStyle = '#00e676';
    ctx.shadowColor = '#00e676';
    ctx.shadowBlur = tubeGlow;
    ctx.fillRect(320, floorY - 70, 16, 30);
    ctx.fillStyle = '#ff1744';
    ctx.shadowColor = '#ff1744';
    ctx.fillRect(360, floorY - 70, 16, 30);

    this.renderNPC(ctx, 480, floorY - 36, "👨‍🔬 Master Alchemist", "#00e5ff", time);
  }

  static renderShrineInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#455a64';
    ctx.fillRect(260, floorY - 50, 120, 50);
    
    const crystalFloat = Math.sin(time * 3) * 8;
    ctx.fillStyle = '#e040fb';
    ctx.shadowColor = '#e040fb';
    ctx.shadowBlur = 20;
    ctx.beginPath();
    ctx.arc(320, floorY - 80 + crystalFloat, 16, 0, Math.PI * 2);
    ctx.fill();

    this.renderNPC(ctx, 460, floorY - 36, "🛡️ Ether Priestess", "#e040fb", time);
  }

  static renderObservatoryInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#78909c';
    ctx.fillRect(200, floorY - 70, 10, 70);
    ctx.save();
    ctx.translate(205, floorY - 70);
    ctx.rotate(-Math.PI / 4);
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-20, -6, 40, 12);
    ctx.restore();

    ctx.fillStyle = '#102040';
    ctx.fillRect(320, floorY - 110, 120, 70);
    ctx.fillStyle = '#80d8ff';
    ctx.fillRect(330, floorY - 100, 100, 50);

    this.renderNPC(ctx, 490, floorY - 36, "🔭 Astronomer", "#80d8ff", time);
  }

  static renderSpireInterior(ctx, width, height, floorY, time) {
    ctx.fillStyle = '#1a0d2a';
    ctx.fillRect(240, floorY - 140, 140, 140);
    
    const spireGlow = Math.sin(time * 2) * 10 + 20;
    ctx.fillStyle = '#ffab40';
    ctx.shadowColor = '#ffab40';
    ctx.shadowBlur = spireGlow;
    ctx.beginPath();
    ctx.moveTo(310, floorY - 140);
    ctx.lineTo(290, floorY - 20);
    ctx.lineTo(330, floorY - 20);
    ctx.closePath();
    ctx.fill();

    this.renderNPC(ctx, 500, floorY - 36, "👑 Spire Archmage", "#ffab40", time);
  }

  static renderNPC(ctx, x, y, name, glowColor, time) {
    ctx.save();
    const breathY = Math.sin(time * 3) * 2;

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.beginPath();
    ctx.ellipse(x + 12, y + 34, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#37474f';
    ctx.fillRect(x, y + breathY, 24, 32);

    ctx.fillStyle = glowColor;
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 10;
    ctx.fillRect(x + 4, y - 10 + breathY, 16, 14);

    ctx.fillStyle = '#fff';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(name, x - 10, y - 16);

    ctx.restore();
  }
}
