/**
 * SceneManager.js - Lightweight Scene Switcher & Transition Controller
 * Realm of Echoes: Single Source of Truth Architecture
 */

class SceneManager {
  constructor(worldState) {
    this.worldState = worldState;
    this.currentScene = 'EXTERIOR'; // 'EXTERIOR' or 'INTERIOR'
    this.transitionState = 'IDLE'; // 'IDLE', 'ENTERING', or 'EXITING'
    this.activeInterior = null;
  }

  isExteriorActive() {
    return this.currentScene === 'EXTERIOR';
  }

  isInteriorActive() {
    return this.currentScene === 'INTERIOR';
  }

  isTransitioning() {
    return this.transitionState !== 'IDLE';
  }

  getCameraMode() {
    return this.currentScene;
  }

  enterBuilding(door, transitionManager, characterSystem) {
    if (this.currentScene === 'INTERIOR' || this.isTransitioning()) return;

    this.transitionState = 'ENTERING';
    const roomType = door.roomType;
    const spawnPoint = InteriorRenderer.getSpawnPoint(roomType);
    this.activeInterior = { roomType, door, spawnPoint };

    transitionManager.startTransition(() => {
      // 1. Switch Scene
      this.currentScene = 'INTERIOR';
      this.transitionState = 'IDLE';

      // 2. Update WorldState Game Data
      if (this.worldState) {
        this.worldState.isInsideBuilding = true;
        this.worldState.activeBuildingId = door.id;
        this.worldState.activeRoomType = roomType;
        this.worldState.currentDoor = door;

        if (characterSystem) {
          this.worldState.savedOutdoorX = characterSystem.x;
          this.worldState.savedOutdoorY = characterSystem.y;
        }
      }

      // 3. Teleport Player to Interior Spawn Point
      if (characterSystem) {
        characterSystem.x = spawnPoint.x;
        characterSystem.y = spawnPoint.y;
        characterSystem.targetX = spawnPoint.x;
        characterSystem.velocity = 0;
      }
    });
  }

  exitBuilding(transitionManager, characterSystem) {
    if (this.currentScene === 'EXTERIOR' || this.isTransitioning()) return;

    this.transitionState = 'EXITING';

    transitionManager.startTransition(() => {
      // 1. Switch Scene
      this.currentScene = 'EXTERIOR';
      this.transitionState = 'IDLE';
      this.activeInterior = null;

      // 2. Determine Outdoor Player Position
      const outdoorX = (this.worldState && this.worldState.savedOutdoorX)
        ? this.worldState.savedOutdoorX
        : (window.innerWidth * 0.2);

      // 3. Update WorldState Game Data
      if (this.worldState) {
        this.worldState.isInsideBuilding = false;
        this.worldState.activeBuildingId = null;
        this.worldState.activeRoomType = null;
        this.worldState.currentDoor = null;
      }

      // 4. Restore Outdoor Player Position & Camera
      if (characterSystem) {
        characterSystem.x = outdoorX;
        characterSystem.y = WorldState.WORLD_GROUND_Y - 48;
        characterSystem.targetX = outdoorX;
        characterSystem.velocity = 0;

        if (characterSystem.cameraSystem) {
          characterSystem.cameraSystem.x = outdoorX - window.innerWidth * 0.35;
        }
      }
    });
  }
}

// Global Export if script loaded globally
if (typeof window !== 'undefined') {
  window.SceneManager = SceneManager;
}
