/**
 * App.js - Master Controller, Performance & Direct Responsive Scroll Physics
 * Realm of Echoes: Responsive Movement Polish
 */

class App {
  constructor() {
    this.worldState = null;
    this.sceneManager = null;
    this.worldEngine = null;
    this.characterSystem = null;
    this.dialogueSystem = null;
    this.observatoryCharts = null;
    this.interactionSystem = null;
    this.lenis = null;
    this.presets = [];

    // Virtual Scroll Physics State
    this.scrollProgress = 0;
    this.virtualScrollY = 0;
    this.targetScrollY = 0;
    this.maxScrollY = window.innerHeight * 6.0;
    this.lastScrollY = 0;

    // Cache DOM References
    this.progressBarEl = null;
    this.modalOverlayEl = null;
    this.reviewInputEl = null;
    this.shrineStatusEl = null;
  }

  init() {
    console.log("[App] Initializing Realm of Echoes (Single Source of Truth WorldState & SceneManager)...");

    this.progressBarEl = document.getElementById('scroll-progress');
    this.modalOverlayEl = document.getElementById('modal-overlay');
    this.reviewInputEl = document.getElementById('review-input');
    this.shrineStatusEl = document.getElementById('current-shrine-status');

    // 0. Initialize Shared WorldState & SceneManager
    this.worldState = new WorldState();
    this.sceneManager = new SceneManager(this.worldState);

    // 1. Initialize Master Engine & Systems
    this.worldEngine = new WorldEngine('viewport-canvas', this.worldState, this.sceneManager);
    this.characterSystem = new CharacterSystem(document.getElementById('viewport-canvas'), this.worldState, this.sceneManager);
    this.dialogueSystem = new DialogueSystem();
    this.observatoryCharts = new ObservatoryCharts();

    // 2. Initialize Interaction System
    this.interactionSystem = new InteractionSystem(
      this.worldState,
      this.sceneManager,
      this.worldEngine.npcSystem,
      this.worldEngine.objectManager,
      this.worldEngine.buildingSystem
    );

    // 3. Setup Accessibility Scrolling
    this.setupAccessibilityScrolling();

    // 4. Fallback Lenis Setup
    if (typeof Lenis !== 'undefined') {
      try {
        this.lenis = new Lenis({
          duration: 1.2,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
          smoothWheel: true
        });

        this.lenis.on('scroll', () => {
          const nativeY = window.scrollY || window.pageYOffset || 0;
          if (nativeY > 0) {
            this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, nativeY));
          }
        });
      } catch (e) {
        console.warn("[App] Lenis fallback warning:", e);
      }
    }

    window.addEventListener('resize', () => {
      this.maxScrollY = window.innerHeight * 6.0;
    });

    // 5. Start Render Loop
    this.gameLoop();

    // 6. Fetch API Data
    this.fetchPresets();
    this.fetchModelMetrics();
  }

  setupAccessibilityScrolling() {
    // Mouse Wheel & Laptop Trackpad
    window.addEventListener('wheel', (e) => {
      if (this.modalOverlayEl && this.modalOverlayEl.classList.contains('active')) {
        return; // Allow modal internal scrolling
      }

      e.preventDefault();
      const delta = e.deltaY;
      this.targetScrollY += delta * 0.85; // Crisp input scaling
      this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
    }, { passive: false });

    // Keyboard Scrolling
    window.addEventListener('keydown', (e) => {
      if (this.modalOverlayEl && this.modalOverlayEl.classList.contains('active')) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        this.targetScrollY += 100;
        this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        this.targetScrollY -= 100;
        this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
      }
    });

    // Touchscreen Swipe
    let touchStartY = 0;
    window.addEventListener('touchstart', (e) => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });

    window.addEventListener('touchmove', (e) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      this.targetScrollY += deltaY * 1.2;
      this.targetScrollY = Math.max(0, Math.min(this.maxScrollY, this.targetScrollY));
    }, { passive: true });
  }

  updateScrollingPhysics() {
    const lerpSpeed = 0.28;
    const dy = this.targetScrollY - this.virtualScrollY;

    if (Math.abs(dy) > 0.5) {
      this.virtualScrollY += dy * lerpSpeed;
    } else {
      this.virtualScrollY = this.targetScrollY;
    }

    const maxScroll = this.maxScrollY || 1;
    this.scrollProgress = Math.max(0, Math.min(1.0, this.virtualScrollY / maxScroll));
    const scrollDelta = this.virtualScrollY - this.lastScrollY;
    this.lastScrollY = this.virtualScrollY;

    if (this.progressBarEl) {
      this.progressBarEl.style.width = `${this.scrollProgress * 100}%`;
    }

    if (Math.abs(window.scrollY - this.virtualScrollY) > 5) {
      window.scrollTo(0, this.virtualScrollY);
    }

    if (this.worldEngine) {
      this.worldEngine.updateScrollProgress(this.scrollProgress);
      this.updateActiveBiomeHUD(this.worldEngine.activeBiomeIndex);
    }
    if (this.characterSystem) {
      this.characterSystem.update(this.scrollProgress, scrollDelta);
    }
  }

  gameLoop() {
    requestAnimationFrame((time) => {
      if (this.lenis) {
        this.lenis.raf(time);
      }

      this.updateScrollingPhysics();

      if (this.characterSystem && this.worldEngine) {
        const cameraOffsetX = this.characterSystem.cameraSystem.getOffsetX();
        // Render world & character (Character is passed to worldEngine to render at Layer 10)
        this.worldEngine.render(cameraOffsetX, this.characterSystem);

        if (this.interactionSystem) {
          this.interactionSystem.update(this.characterSystem.x, cameraOffsetX);
        }
      }

      this.gameLoop();
    });
  }

  updateActiveBiomeHUD(activeIndex) {
    for (let i = 0; i < 7; i++) {
      const el = document.getElementById(`step-${i}`);
      if (el) {
        if (i === activeIndex) el.classList.add('active');
        else el.classList.remove('active');
      }
    }
  }

  // API Calls
  async fetchPresets() {
    try {
      const res = await fetch('/api/presets');
      const data = await res.json();
      if (data.status === 'success') {
        this.presets = data.presets;
        this.renderPresetChips();
      }
    } catch (e) {
      this.presets = [
        { title: "Pixel Game Review", review: "This game is an absolute masterpiece of pixel art and sound design! I loved every second." },
        { title: "Defective Hardware", review: "Terrible quality. Cracked after two days, audio disconnects constantly, and support ignored my refund." },
        { title: "Average Stay", review: "The hotel room was acceptable, staff were standard, and features functioned normally." }
      ];
      this.renderPresetChips();
    }
  }

  renderPresetChips() {
    const container = document.getElementById('presets-chips');
    if (!container) return;
    container.innerHTML = '';

    this.presets.forEach((p) => {
      const chip = document.createElement('div');
      chip.className = 'preset-chip';
      chip.textContent = `📋 ${p.title || p.category}`;
      chip.onclick = () => {
        if (this.reviewInputEl) this.reviewInputEl.value = p.review;
      };
      container.appendChild(chip);
    });
  }

  async fetchModelMetrics() {
    try {
      const res = await fetch('/api/model-info');
      const data = await res.json();
      if (data.status === 'success') {
        if (this.observatoryCharts) this.observatoryCharts.init(data.metrics);
      }
    } catch (e) {
      if (this.observatoryCharts) this.observatoryCharts.init(null);
    }
  }

  async handleBatchFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    console.log("[App] Batch file selected:", file.name);

    if (this.characterSystem && this.characterSystem.cameraSystem) {
      this.characterSystem.cameraSystem.triggerShake(6, 0.4);
    }

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/batch', {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      if (data.status === 'success' && data.data && data.data.length > 0) {
        this.displayAnalysisResult(data.data[0]);
      }
    } catch (e) {
      console.warn("[App] Batch upload fallback:", e);
      const reader = new FileReader();
      reader.onload = (evt) => {
        const text = evt.target.result;
        let reviewText = text;
        if (file.name.endsWith('.json')) {
          try {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
              reviewText = typeof parsed[0] === 'string' ? parsed[0] : (parsed[0].review || text);
            }
          } catch (err) {}
        } else {
          const lines = text.split('\n');
          if (lines.length > 0 && lines[0].trim()) {
            reviewText = lines[0].trim().replace(/^"(.*)"$/, '$1');
          }
        }
        if (this.reviewInputEl) this.reviewInputEl.value = reviewText;
        this.analyzeInputText();
      };
      reader.readAsText(file);
    }
  }

  async analyzeInputText() {
    const text = this.reviewInputEl ? this.reviewInputEl.value.trim() : '';
    if (!text) return;

    if (this.characterSystem && this.characterSystem.cameraSystem) {
      this.characterSystem.cameraSystem.triggerShake(6, 0.4);
    }

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.status === 'success') {
        this.displayAnalysisResult(data.data);
      }
    } catch (e) {
      const isPos = text.toLowerCase().includes('great') || text.toLowerCase().includes('masterpiece') || text.toLowerCase().includes('love');
      const isNeg = text.toLowerCase().includes('bad') || text.toLowerCase().includes('terrible') || text.toLowerCase().includes('worst');
      const pol = isPos ? 'Positive' : (isNeg ? 'Negative' : 'Neutral');
      this.displayAnalysisResult({
        polarity: pol,
        confidence: 0.92,
        engine_used: "Local Lexicon Fallback",
        aspects: [{ aspect: "General", sentiment: pol }]
      });
    }
  }

  displayAnalysisResult(res) {
    const card = document.getElementById('sentiment-result-card');
    const badge = document.getElementById('result-polarity-badge');
    const conf = document.getElementById('result-confidence-score');
    const engineEl = document.getElementById('result-engine-used');
    const runesEl = document.getElementById('result-aspect-runes');

    if (!card) return;
    card.classList.add('active');
    badge.textContent = res.polarity.toUpperCase();
    badge.className = `polarity-badge ${res.polarity}`;
    conf.textContent = `Confidence: ${(res.confidence * 100).toFixed(1)}%`;
    engineEl.textContent = `Engine: ${res.engine_used}`;

    if (this.worldEngine && this.worldEngine.worldReactionEngine) {
      this.worldEngine.worldReactionEngine.applySentimentReaction(res.polarity);
    }

    if (this.shrineStatusEl) {
      this.shrineStatusEl.textContent = `Current State: ${res.polarity} Energy Active`;
      this.shrineStatusEl.style.color = res.polarity === 'Positive' ? '#00e676' : (res.polarity === 'Negative' ? '#ff1744' : '#ffc400');
    }

    runesEl.innerHTML = '';
    if (res.aspects && res.aspects.length > 0) {
      res.aspects.forEach(a => {
        const chip = document.createElement('span');
        chip.className = `rune-chip ${a.sentiment.toLowerCase()}`;
        chip.textContent = `${a.aspect}: ${a.sentiment}`;
        runesEl.appendChild(chip);
      });
    }
  }

  interactNPC(name, icon) {
    if (this.characterSystem) this.characterSystem.setInteractState(true);
    if (this.dialogueSystem) {
      this.dialogueSystem.showNPCDialogue(
        name,
        icon,
        "Greetings Traveler! In this kingdom, every review letter carries emotional energy."
      );
    }
  }

  interactMailbox() {
    if (this.characterSystem) this.characterSystem.setInteractState(true);
    if (this.dialogueSystem) {
      this.dialogueSystem.showNPCDialogue(
        "Realm Mailbox",
        "📮",
        "Mailbox opened! Head to the Ancient Research Laboratory to ignite the ML Sentiment Engine!"
      );
    }
  }

  openLabTerminal() {
    if (this.characterSystem) this.characterSystem.setInteractState(true);
    if (this.dialogueSystem) this.dialogueSystem.showLabTerminal();
  }

  closeModals() {
    if (this.characterSystem) this.characterSystem.setInteractState(false);
    if (this.dialogueSystem) this.dialogueSystem.showLabTerminal();
    if (this.interactionSystem) this.interactionSystem.closeDialogue();
  }
}

const app = new App();
window.addEventListener('DOMContentLoaded', () => app.init());
