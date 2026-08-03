/**
 * NPCSystem.js - Unified World Coordinate NPC Positioning Engine
 * Realm of Echoes: Single Source of Truth Coordinates
 */

class NPCSystem {
  constructor() {
    this.npcs = [];
    this.time = 0;
    this.initNPCs();
  }

  initNPCs() {
    const db = (typeof DIALOGUE_DATABASE !== 'undefined') 
      ? DIALOGUE_DATABASE 
      : ((typeof DIALOGUE_DATA !== 'undefined') ? DIALOGUE_DATA : {});

    const getPages = (key, defaultPages) => {
      return (db && db[key] && db[key].pages) ? db[key].pages : defaultPages;
    };

    this.npcs = [
      {
        id: 'forest_fairy',
        name: 'Sylvan Fairy',
        avatar: '🧚‍♀️',
        progress: 0.08,
        color: '#2e7d32',
        hatColor: '#81c784',
        eyeColor: '#a7ffeb',
        direction: 'RIGHT',
        pages: getPages('forest_fairy', ["Welcome to the Whispering Woodland!"])
      },
      {
        id: 'elder_oracle',
        name: 'Elder Oracle',
        avatar: '🧙‍♂️',
        progress: 0.18,
        color: '#4a148c',
        hatColor: '#7b1fa2',
        eyeColor: '#ffd54f',
        direction: 'LEFT',
        pages: getPages('elder_oracle', ["Greetings Traveler! I am the Elder Oracle."])
      },
      {
        id: 'village_merchant',
        name: 'Rune Merchant',
        avatar: '🧔',
        progress: 0.25,
        color: '#e65100',
        hatColor: '#ff9800',
        eyeColor: '#80d8ff',
        direction: 'RIGHT',
        pages: getPages('village_merchant', ["Looking to trade sentiment runes?"])
      },
      {
        id: 'station_master',
        name: 'Post Master',
        avatar: '🎩',
        progress: 0.35,
        color: '#1565c0',
        hatColor: '#0d47a1',
        eyeColor: '#00e5ff',
        direction: 'LEFT',
        pages: getPages('station_master', ["Over 10,000 review letters arrive here every moon cycle!"])
      },
      {
        id: 'lab_alchemist',
        name: 'Master Alchemist',
        avatar: '🧪',
        progress: 0.52,
        color: '#00838f',
        hatColor: '#00e5ff',
        eyeColor: '#00e676',
        direction: 'RIGHT',
        pages: getPages('lab_alchemist', ["Ignite the ML Forge to analyze review sentiment!"])
      },
      {
        id: 'shrine_priestess',
        name: 'Ether Priestess',
        avatar: '🔮',
        progress: 0.68,
        color: '#6a1b9a',
        hatColor: '#ab47bc',
        eyeColor: '#e040fb',
        direction: 'LEFT',
        pages: getPages('shrine_priestess', ["The sentiment energy of all reviews resonates here."])
      },
      {
        id: 'observatory_astronomer',
        name: 'Astronomer',
        avatar: '🔭',
        progress: 0.85,
        color: '#0d47a1',
        hatColor: '#1976d2',
        eyeColor: '#80d8ff',
        direction: 'RIGHT',
        pages: getPages('observatory_astronomer', ["The stars reveal accuracy and confusion matrices!"])
      }
    ];
  }

  update(dt, playerX, cameraOffsetX) {
    this.time += dt;
    const groundY = WorldState.getGroundY() - 48;
    const totalWorldWidth = window.innerWidth * WorldState.WORLD_WIDTH_MULTIPLIER;
    const startX = window.innerWidth * 0.2;

    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      npc.x = startX + (npc.progress * totalWorldWidth);
      npc.renderX = npc.x - cameraOffsetX;
      npc.renderY = groundY;
    }
  }

  getNearestNPC(playerX, groundY, cameraOffsetX) {
    const interactionRadius = 90;
    let nearest = null;
    let minDist = Infinity;

    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      const dist = Math.abs(playerX - npc.x);

      if (dist < interactionRadius && dist < minDist) {
        minDist = dist;
        nearest = npc;
      }
    }
    return nearest;
  }

  render(ctx) {
    for (let i = 0; i < this.npcs.length; i++) {
      const npc = this.npcs[i];
      NPCRenderer.renderNPC(ctx, npc, this.time);
    }
  }
}
