/**
 * LightingSystem.js - Multi-Mode Ambient & Dynamic Light Halo Renderer
 * Realm of Echoes: Phase 4 Lighting System
 */

class LightingSystem {
  constructor() {
    this.lights = [];
  }

  addLight(x, y, radius, color, intensity = 0.5) {
    this.lights.push({ x, y, radius, color, intensity });
  }

  clearLights() {
    this.lights = [];
  }

  renderInteriorLighting(ctx, width, height, roomType) {
    ctx.save();

    let ambientColor = 'rgba(10, 14, 26, 0.4)';
    if (roomType === 'forest_cabin') ambientColor = 'rgba(9, 27, 18, 0.55)';
    else if (roomType === 'town_hall') ambientColor = 'rgba(30, 15, 10, 0.5)';
    else if (roomType === 'research_lab') ambientColor = 'rgba(10, 20, 40, 0.5)';
    else if (roomType === 'emotion_temple') ambientColor = 'rgba(25, 10, 35, 0.55)';
    else if (roomType === 'observatory_deck') ambientColor = 'rgba(8, 12, 26, 0.6)';

    // Ambient Tint
    ctx.fillStyle = ambientColor;
    ctx.fillRect(0, 0, width, height);

    // Light Halos
    for (const l of this.lights) {
      const grad = ctx.createRadialGradient(l.x, l.y, 0, l.x, l.y, l.radius);
      grad.addColorStop(0, l.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(l.x, l.y, l.radius, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
