/**
 * NPCRenderer.js - Pixel NPC Rendering with Idle Breathing, Eye Blinking & Looking Around
 * Realm of Echoes: Gameplay Polish Phase 2
 */

class NPCRenderer {
  static renderNPC(ctx, npc, time) {
    ctx.save();

    const rx = Math.floor(npc.renderX);
    const ry = Math.floor(npc.renderY);

    // Culling Check
    if (rx < -80 || rx > window.innerWidth + 80) {
      ctx.restore();
      return;
    }

    // 1. Procedural Idle Breathing & Head Sway
    const breathY = Math.sin(time * 3 + (npc.id ? npc.id.length : 0)) * 2.2;
    const headSwayX = Math.sin(time * 1.5 + (rx * 0.05)) * 1.5;
    
    // 2. Eye Blinking State
    const isBlinking = (Math.floor(time * 2) % 7 === 0);

    // 3. Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(rx + 16, ry + 42, 14, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // 4. Direction Flipping Transform
    ctx.translate(rx + 16, ry + 24);
    if (npc.direction === 'LEFT') {
      ctx.scale(-1, 1);
    }

    // 5. NPC Body Cloak / Outfit
    ctx.fillStyle = npc.color || '#37474f';
    ctx.fillRect(-10, -8 + breathY, 20, 26);

    // Belt / Trim
    ctx.fillStyle = '#ffd54f';
    ctx.fillRect(-8, 2 + breathY, 16, 3);

    // Head with Sway
    ctx.fillStyle = '#ffcc80';
    ctx.fillRect(-8 + headSwayX, -22 + breathY, 16, 14);

    // Hair / Hat Accent
    ctx.fillStyle = npc.hatColor || '#4a148c';
    ctx.fillRect(-10 + headSwayX, -26 + breathY, 20, 6);

    // Glowing Eyes / Blinking
    if (!isBlinking) {
      ctx.fillStyle = npc.eyeColor || '#00e5ff';
      ctx.shadowColor = npc.eyeColor || '#00e5ff';
      ctx.shadowBlur = 6;
      ctx.fillRect(2 + headSwayX, -18 + breathY, 4, 3);
    } else {
      ctx.fillStyle = '#37474f';
      ctx.fillRect(2 + headSwayX, -17 + breathY, 4, 1);
    }

    ctx.shadowBlur = 0;

    // Legs
    ctx.fillStyle = '#1a237e';
    ctx.fillRect(-6, 18, 5, 6);
    ctx.fillRect(1, 18, 5, 6);

    // NPC Overhead Icon / Avatar
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(npc.avatar || '👤', 0, -32 + breathY);

    // NPC Name Tag
    ctx.fillStyle = '#ffe082';
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillText(npc.name, 0, -46 + breathY);

    ctx.restore();
  }
}
