/**
 * CharacterSystem.js - Unified World Coordinate Character Movement Engine
 * Realm of Echoes: Single Source of Truth Coordinates
 */

class CharacterSystem {
  constructor(canvas, worldState, sceneManager) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.worldState = worldState;
    this.sceneManager = sceneManager;

    // Unified Position & Target State
    this.startX = window.innerWidth * 0.2;
    this.x = this.startX;
    this.targetX = this.x;
    const initCanvasHeight = (canvas && canvas.height) ? canvas.height : (typeof window !== 'undefined' ? window.innerHeight : 900);
    this.y = WorldState.getGroundY(initCanvasHeight) - 48;

    this.velocity = 0;
    this.state = 'IDLE'; // 'IDLE', 'WALK_RIGHT', 'WALK_LEFT', 'INTERACT'
    this.direction = 'RIGHT';
    this.isInteracting = false;

    // Sub-Systems
    this.spriteController = new SpriteController();
    this.cameraSystem = new CameraSystem(this.worldState, this.sceneManager);

    this.time = 0;
  }

  setInteractState(interacting) {
    this.isInteracting = interacting;
    if (interacting) {
      this.state = 'INTERACT';
      this.velocity = 0;
    } else {
      this.state = 'IDLE';
    }
  }

  update(scrollProgress, scrollDelta, dt = 0.016) {
    this.time += dt;

    if (this.isInteracting) {
      this.state = 'INTERACT';
      this.velocity = 0;
      this.cameraSystem.update(dt, this.x, this.y, false);
      this.spriteController.update(dt, false);
      return;
    }

    const isInsideBuilding = (this.sceneManager && this.sceneManager.isInteriorActive())
      || (this.worldState && this.worldState.isInsideBuilding);

    if (isInsideBuilding) {
      // Player movement inside building
      this.cameraSystem.update(dt, this.x, this.y, false);
      this.spriteController.update(dt, false);
      return;
    }

    // 1. Calculate Exact World Target Position
    const totalWorldWidth = window.innerWidth * WorldState.WORLD_WIDTH_MULTIPLIER;
    this.startX = window.innerWidth * 0.2;
    this.targetX = this.startX + (scrollProgress * totalWorldWidth);

    const canvasHeight = (this.canvas && this.canvas.height) ? this.canvas.height : window.innerHeight;
    this.y = WorldState.getGroundY(canvasHeight) - 48;

    // 2. Direct Tight Easing (Crisp, Grounded & Instantaneous Stopping)
    const distanceX = this.targetX - this.x;

    if (Math.abs(distanceX) > 0.8) {
      const step = distanceX * 0.22;
      this.x += step;
      this.velocity = step;

      if (this.velocity > 0.3) {
        this.direction = 'RIGHT';
        this.state = 'WALK_RIGHT';
      } else if (this.velocity < -0.3) {
        this.direction = 'LEFT';
        this.state = 'WALK_LEFT';
      } else {
        this.state = 'IDLE';
      }

      if (Math.abs(this.velocity) > 1.0 && Math.random() < 0.25) {
        this.spriteController.spawnFootstepDust(this.x, this.y);
      }
    } else {
      this.x = this.targetX;
      this.velocity = 0;
      this.state = 'IDLE';
    }

    // 3. Update Camera & Sprite Controllers
    const isMoving = this.state === 'WALK_RIGHT' || this.state === 'WALK_LEFT';
    this.cameraSystem.update(dt, this.x, this.y, isMoving);
    this.spriteController.update(dt, isMoving);
  }

  render() {
    this.ctx.save();

    // Apply Camera Offset
    const isInsideBuilding = (this.sceneManager && this.sceneManager.isInteriorActive())
      || (this.worldState && this.worldState.isInsideBuilding);

    const cameraOffsetX = isInsideBuilding ? 0 : this.cameraSystem.getOffsetX();
    const cameraOffsetY = isInsideBuilding ? 0 : this.cameraSystem.getOffsetY();

    const screenX = this.x - cameraOffsetX;
    const screenY = this.y - cameraOffsetY;

    // Render Character
    this.spriteController.render(
      this.ctx,
      screenX,
      screenY,
      this.state,
      this.direction,
      this.time
    );

    this.ctx.restore();
  }
}
