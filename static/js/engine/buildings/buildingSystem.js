/**
 * BuildingSystem.js - Unified World Coordinate Door Alignment & Transition System
 * Realm of Echoes: Decorative Landmark Engine (Interior Transitions Disabled)
 */

class BuildingSystem {
  constructor(worldState, sceneManager, transitionManager, cameraEffects, lightingSystem) {
    this.worldState = worldState;
    this.sceneManager = sceneManager;
    this.transitionManager = transitionManager;
    this.cameraEffects = cameraEffects;
    this.lightingSystem = lightingSystem;

    this.doors = [];
    this.currentDoor = null;
    this.initBuildingDoors();
  }

  initBuildingDoors() {
    this.doors = [
      { id: 'door_cabin', name: 'Hidden Cabin', roomType: 'cabin', progress: 0.05, x: 0 },
      { id: 'door_townhall', name: 'Village Town Hall', roomType: 'village_hall', progress: 0.18, x: 0 },
      { id: 'door_postoffice', name: 'Echo Post Office', roomType: 'station', progress: 0.35, x: 0 },
      { id: 'door_laboratory', name: 'Main Laboratory', roomType: 'lab', progress: 0.52, x: 0 },
      { id: 'door_shrine', name: 'Temple Shrine', roomType: 'shrine', progress: 0.68, x: 0 },
      { id: 'door_observatory', name: 'Observatory Deck', roomType: 'observatory', progress: 0.85, x: 0 },
      { id: 'door_spire', name: 'Spire Citadel', roomType: 'spire', progress: 0.98, x: 0 }
    ];
  }

  update(dt, cameraOffsetX) {
    const groundY = WorldState.getGroundY() - 48;
    const totalWorldWidth = window.innerWidth * WorldState.WORLD_WIDTH_MULTIPLIER;
    const startX = window.innerWidth * 0.2;

    for (let i = 0; i < this.doors.length; i++) {
      const door = this.doors[i];
      door.x = startX + (door.progress * totalWorldWidth);
      door.renderX = door.x - cameraOffsetX;
      door.renderY = groundY - 50;
    }
  }

  getNearestDoor(playerX) {
    // Building interaction disabled — buildings are decorative landmarks
    return null;
  }

  enterBuilding(door) {
    // Disabled
    return;
  }

  exitBuilding() {
    // Disabled
    return;
  }
}
