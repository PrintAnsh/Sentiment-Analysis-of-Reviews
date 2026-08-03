/**
 * CameraEffects.js - Camera Zoom, Easing & Cinematic Depth System
 * Realm of Echoes: Phase 4 Interior Engine
 */

class CameraEffects {
  constructor() {
    this.currentZoom = 1.0;
    this.targetZoom = 1.0;
    this.zoomSpeed = 0.05;
  }

  setZoom(zoom) {
    this.targetZoom = zoom;
  }

  update(dt) {
    this.currentZoom += (this.targetZoom - this.currentZoom) * this.zoomSpeed;
  }

  applyZoomTransform(ctx, width, height) {
    if (Math.abs(this.currentZoom - 1.0) > 0.001) {
      ctx.translate(width * 0.5, height * 0.5);
      ctx.scale(this.currentZoom, this.currentZoom);
      ctx.translate(-width * 0.5, -height * 0.5);
    }
  }
}
