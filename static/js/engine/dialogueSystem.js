/**
 * DialogueSystem.js - NPC Dialogue, Mailbox, Signpost & Modal Manager
 * Realm of Echoes: The Sentiment Oracle
 */

class DialogueSystem {
  constructor() {
    this.modalOverlay = document.getElementById('modal-overlay');
    this.dialogueContainer = document.getElementById('dialogue-modal');
    this.labContainer = document.getElementById('lab-modal');
    this.typewriterInterval = null;
  }

  showNPCDialogue(speakerName, avatarIcon, textContent, onComplete = null) {
    this.closeAllModals();

    const nameEl = document.getElementById('dialogue-speaker-name');
    const avatarEl = document.getElementById('dialogue-speaker-avatar');
    const textEl = document.getElementById('dialogue-text-body');

    nameEl.textContent = speakerName;
    avatarEl.textContent = avatarIcon;
    textEl.textContent = '';

    this.dialogueContainer.style.display = 'flex';
    this.modalOverlay.classList.add('active');

    // Retro Typewriter Effect
    let index = 0;
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    
    this.typewriterInterval = setInterval(() => {
      if (index < textContent.length) {
        textEl.textContent += textContent.charAt(index);
        index++;
      } else {
        clearInterval(this.typewriterInterval);
        if (onComplete) onComplete();
      }
    }, 25);
  }

  showLabTerminal() {
    this.closeAllModals();
    this.labContainer.style.display = 'block';
    this.modalOverlay.classList.add('active');
  }

  closeAllModals() {
    if (this.typewriterInterval) clearInterval(this.typewriterInterval);
    this.dialogueContainer.style.display = 'none';
    this.labContainer.style.display = 'none';
    this.modalOverlay.classList.remove('active');
  }
}
