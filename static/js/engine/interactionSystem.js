/**
 * InteractionSystem.js - Proximity, Building Entrance & Multi-Page Dialogue Controller
 * Realm of Echoes: Single Source of Truth Coordinates (Building Transitions Disabled)
 */

class InteractionSystem {
  constructor(worldState, sceneManager, npcSystem, objectManager, buildingSystem) {
    this.worldState = worldState;
    this.sceneManager = sceneManager;
    this.npcSystem = npcSystem;
    this.objectManager = objectManager;
    this.buildingSystem = buildingSystem;

    this.activeTarget = null;
    this.activeDoor = null;

    this.isDialogueActive = false;
    this.currentPages = [];
    this.currentPageIndex = 0;
    this.typewriterInterval = null;

    // Cache DOM References
    this.promptEl = document.getElementById('world-interaction-prompt');
    this.modalEl = document.getElementById('dialogue-modal');
    this.overlayEl = document.getElementById('modal-overlay');
    this.nameEl = document.getElementById('dialogue-speaker-name');
    this.avatarEl = document.getElementById('dialogue-speaker-avatar');
    this.textEl = document.getElementById('dialogue-text-body');
    this.pageCounterEl = document.getElementById('dialogue-page-counter');

    this.initEventListeners();
  }

  initEventListeners() {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E' || e.key === ' ') {
        if (this.isDialogueActive) {
          this.advanceDialogue();
        } else if (this.activeTarget) {
          this.triggerInteraction(this.activeTarget);
        }
      } else if (e.key === 'Escape') {
        if (this.isDialogueActive) {
          this.closeDialogue();
        }
      }
    });
  }

  update(playerX, cameraOffsetX) {
    const groundY = WorldState.getGroundY() - 48;

    this.activeDoor = null; // Building enter functionality disabled
    const nearestNPC = this.npcSystem ? this.npcSystem.getNearestNPC(playerX, groundY, cameraOffsetX) : null;
    const nearestObj = this.objectManager ? this.objectManager.getNearestObject(playerX, cameraOffsetX) : null;

    this.activeTarget = nearestNPC || nearestObj;

    if (this.promptEl) {
      if (this.activeTarget && !this.isDialogueActive) {
        this.promptEl.style.display = 'block';
        this.promptEl.style.left = `${this.activeTarget.renderX}px`;
        this.promptEl.style.top = `${this.activeTarget.renderY - 40}px`;
        this.promptEl.style.transform = 'translateX(-50%)';
        this.promptEl.textContent = `E - Talk to ${this.activeTarget.name}`;
      } else {
        this.promptEl.style.display = 'none';
      }
    }
  }

  triggerInteraction(target) {
    if (this.isDialogueActive) return;

    if (target.id === 'treasure_chest') {
      target.isOpen = true;
    }

    this.currentPages = target.pages || ["..."];
    this.currentPageIndex = 0;
    this.isDialogueActive = true;

    this.showDialoguePage(target.name, target.avatar, this.currentPages[0]);
  }

  showDialoguePage(speakerName, avatarIcon, textContent) {
    if (!this.modalEl) return;

    if (this.nameEl) this.nameEl.textContent = speakerName;
    if (this.avatarEl) this.avatarEl.textContent = avatarIcon;
    if (this.textEl) this.textEl.textContent = '';

    if (this.pageCounterEl) {
      this.pageCounterEl.textContent = `Page ${this.currentPageIndex + 1} of ${this.currentPages.length}`;
    }

    this.modalEl.style.display = 'flex';
    if (this.overlayEl) this.overlayEl.classList.add('active');

    let index = 0;
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);

    this.typewriterInterval = setInterval(() => {
      if (index < textContent.length) {
        if (this.textEl) this.textEl.textContent += textContent.charAt(index);
        index++;
      } else {
        clearInterval(this.typewriterInterval);
      }
    }, 20);
  }

  advanceDialogue() {
    this.currentPageIndex++;
    if (this.currentPageIndex < this.currentPages.length) {
      const pageText = this.currentPages[this.currentPageIndex];
      this.showDialoguePage(
        this.activeTarget ? this.activeTarget.name : "Oracle",
        this.activeTarget ? this.activeTarget.avatar : "👤",
        pageText
      );
    } else {
      this.closeDialogue();
    }
  }

  closeDialogue() {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.isDialogueActive = false;

    if (this.modalEl) this.modalEl.style.display = 'none';
    if (this.overlayEl) this.overlayEl.classList.remove('active');
  }
}
