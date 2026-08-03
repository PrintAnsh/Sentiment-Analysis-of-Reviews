/**
 * WorldEngine.js - Master World, Interior & Sentiment Reaction Engine
 * Realm of Echoes: Single Source of Truth Render Pipeline
 */

class WorldEngine {
  constructor(canvasId, worldState, sceneManager) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.worldState = worldState || new WorldState();
    this.sceneManager = sceneManager;

    this.scrollProgress = 0; // 0.0 to 1.0
    this.activeBiomeIndex = 0;
    this.emotionState = 'Neutral';
    this.lastTime = performance.now();

    // Sub-Systems
    this.skyRenderer = new SkyRenderer();
    this.parallaxRenderer = new ParallaxRenderer();
    this.biomeRenderer = new BiomeRenderer();
    this.particleSystem = new ParticleSystem();

    // Phase 3 Systems
    this.npcSystem = new NPCSystem();
    this.objectManager = new WorldObjectManager();

    // Phase 4 Systems
    this.transitionManager = new TransitionManager();
    this.cameraEffects = new CameraEffects();
    this.lightingSystem = new LightingSystem();
    this.buildingSystem = new BuildingSystem(
      this.worldState,
      this.sceneManager,
      this.transitionManager,
      this.cameraEffects,
      this.lightingSystem
    );

    // Phase 6 World Reaction Engine
    this.worldReactionEngine = new WorldReactionEngine(this);

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());
  }

  resizeCanvas() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  updateScrollProgress(progress) {
    this.scrollProgress = Math.max(0, Math.min(1, progress));
    this.activeBiomeIndex = Math.min(6, Math.floor(this.scrollProgress * 7));
    if (this.worldState) {
      this.worldState.setScrollProgress(progress);
    }
  }

  setEmotionState(state) {
    this.emotionState = state;
    if (this.worldState) {
      this.worldState.setEmotionState(state);
    }
    this.particleSystem.setEmotionState(state);
  }

  isInteriorActive() {
    if (this.sceneManager) {
      return this.sceneManager.isInteriorActive();
    }
    return this.worldState && this.worldState.isInsideBuilding;
  }

  render(cameraOffsetX = 0, characterSystem = null) {
    const now = performance.now();
    const dt = Math.min(0.1, (now - this.lastTime) / 1000);
    this.lastTime = now;

    const width = this.canvas.width;
    const height = this.canvas.height;

    this.ctx.clearRect(0, 0, width, height);

    // Update Sub-Systems
    this.skyRenderer.update(dt, this.activeBiomeIndex);
    this.parallaxRenderer.update(dt, this.activeBiomeIndex);
    this.biomeRenderer.update(dt);
    this.particleSystem.update(dt, width, height);
    this.transitionManager.update(dt);
    this.cameraEffects.update(dt);
    this.buildingSystem.update(dt, cameraOffsetX);
    this.worldReactionEngine.update(dt);

    this.ctx.save();
    this.cameraEffects.applyZoomTransform(this.ctx, width, height);

    if (this.isInteriorActive()) {
      // ----------------------------------------------------
      // INTERIOR RENDER MODE
      // ----------------------------------------------------
      const roomType = (this.worldState && this.worldState.activeRoomType) 
        ? this.worldState.activeRoomType 
        : 'lab';

      InteriorRenderer.renderInterior(
        this.ctx,
        width,
        height,
        roomType,
        now / 1000,
        this.lightingSystem
      );

      this.lightingSystem.renderInteriorLighting(
        this.ctx,
        width,
        height,
        roomType
      );

      // Layer 10: Player in interior
      if (characterSystem) {
        characterSystem.render();
      }

      this.particleSystem.render(this.ctx, width, height);
    } else {
      // ----------------------------------------------------
      // EXTERIOR RENDER MODE (Strict 12-Layer Hierarchy)
      // ----------------------------------------------------
      this.npcSystem.update(dt, 0, cameraOffsetX);
      this.objectManager.update(dt, cameraOffsetX);

      // 1. Sky Background
      this.skyRenderer.renderSky(this.ctx, width, height, this.scrollProgress);

      // 2. Stars
      this.skyRenderer.renderStars(this.ctx, width, height);

      // 3. Moon & Celestial Aura
      this.skyRenderer.renderMoon(this.ctx, width, height, this.scrollProgress);

      // 4. Far Mountains
      this.parallaxRenderer.renderFarMountains(this.ctx, width, height, this.scrollProgress);

      // 5. Near Mountains / Midground Features
      this.parallaxRenderer.renderNearMountains(this.ctx, width, height, this.scrollProgress);

      // 6. Clouds
      this.skyRenderer.renderClouds(this.ctx, width, height, this.scrollProgress);

      // 7. Trees
      this.biomeRenderer.renderTrees(this.ctx, width, height, this.scrollProgress, cameraOffsetX);

      // 8. Buildings
      this.biomeRenderer.renderBuildings(this.ctx, width, height, this.scrollProgress, this.activeBiomeIndex, this.emotionState, cameraOffsetX);

      // 9. Ground
      this.parallaxRenderer.renderForegroundGround(this.ctx, width, height, this.scrollProgress);

      // Render World Objects & NPCs
      this.objectManager.render(this.ctx);
      this.npcSystem.render(this.ctx);

      // 10. Player Character
      if (characterSystem) {
        characterSystem.render();
      }

      // 11. Particles
      this.particleSystem.render(this.ctx, width, height);

      // Atmospheric Vignette Lighting
      this.renderAtmosphericLighting(width, height);
    }

    this.ctx.restore();

    // 12. Overlays & UI
    this.worldReactionEngine.renderOverlays(this.ctx, width, height);

    // Fade Transition Overlay
    this.transitionManager.render(this.ctx, width, height);
  }

  renderAtmosphericLighting(width, height) {
    this.ctx.save();
    const grad = this.ctx.createRadialGradient(
      width * 0.5, height * 0.5, Math.min(width, height) * 0.4,
      width * 0.5, height * 0.5, Math.max(width, height) * 0.8
    );
    grad.addColorStop(0, 'rgba(0, 0, 0, 0)');
    grad.addColorStop(1, 'rgba(5, 7, 15, 0.65)');

    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }
}
