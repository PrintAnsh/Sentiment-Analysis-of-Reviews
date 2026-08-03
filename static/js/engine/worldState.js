/**
 * WorldState.js - Single Source of Truth for World State & Coordinates
 * Realm of Echoes: World Engine Stabilization
 */

class WorldState {
  static GROUND_RATIO = 0.82; // Single Source of Truth Ground Ratio
  static WORLD_WIDTH_MULTIPLIER = 5.0; // Total world width factor

  static getGroundY(height = (typeof window !== 'undefined' ? window.innerHeight : 900)) {
    return height * WorldState.GROUND_RATIO;
  }

  constructor() {
    // Biome & Environment State
    this.scrollProgress = 0.0;
    this.activeBiomeIndex = 0;
    this.emotionState = 'Neutral';

    // Interior & Building State
    this.isInsideBuilding = false;
    this.activeBuildingId = null;
    this.activeRoomType = null;
    this.currentDoor = null;

    // Player Saved State for Building Exits
    this.savedOutdoorX = 0;
    this.savedOutdoorY = WorldState.getGroundY();

    // Camera Mode State
    this.cameraMode = 'EXTERIOR'; // 'EXTERIOR' or 'INTERIOR'
  }

  setScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1.0, progress));
    this.activeBiomeIndex = Math.min(6, Math.floor(this.scrollProgress * 7));
  }

  setEmotionState(state) {
    this.emotionState = state;
  }

  enterBuilding(door, spawnPoint) {
    this.isInsideBuilding = true;
    this.activeBuildingId = door.id;
    this.activeRoomType = door.roomType;
    this.currentDoor = door;
    this.cameraMode = 'INTERIOR';
  }

  exitBuilding() {
    this.isInsideBuilding = false;
    this.activeBuildingId = null;
    this.activeRoomType = null;
    this.currentDoor = null;
    this.cameraMode = 'EXTERIOR';
  }
}

// Global Export if script loaded globally
if (typeof window !== 'undefined') {
  window.WorldState = WorldState;
}
