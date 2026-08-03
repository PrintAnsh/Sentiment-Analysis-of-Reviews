/**
 * DialogueData.js - Modular Script & Lore Registry for NPCs and Objects
 * Realm of Echoes: Phase 3 NPC System
 */

const DIALOGUE_DATA = {
  // Forest NPCs
  "forest_spirit": {
    name: "Forest Spirit",
    avatar: "🧝‍♀️",
    pages: [
      "Welcome, Alchemist... The whispers of travelers pass through these ancient woods.",
      "Every review carries an emotional essence — Positive light, Negative void, or Neutral balance.",
      "Travel east to the Research Laboratory to harness the Alchemical Machine!"
    ]
  },
  "forest_fairy": {
    name: "Sylvan Fairy",
    avatar: "🧚‍♀️",
    pages: [
      "Tee-hee! I dance where positive feelings blossom! 🌸",
      "When reviews contain words like 'masterpiece' or 'stunning', my wings glow bright pink!"
    ]
  },

  // Village NPCs
  "elder_oracle": {
    name: "Elder Oracle",
    avatar: "🧙‍♂️",
    pages: [
      "Ah, greetings young traveler! I have guarded the Sentiment Haven for generations.",
      "Our alchemy relies on Natural Language Processing. Machine learning models convert human words into TF-IDF numerical feature vectors.",
      "Visit the Laboratory ahead to analyze any review text or batch dataset!"
    ]
  },
  "village_merchant": {
    name: "Rune Merchant",
    avatar: "🧔",
    pages: [
      "Spices, potions, and review analytics! Customer feedback is the lifeblood of trade.",
      "A single bad review with 'defective' or 'garbage' can ruin a shop's reputation!"
    ]
  },

  // Review Station NPCs
  "station_master": {
    name: "Post Master",
    avatar: "🎩",
    pages: [
      "Over 10,000 review letters arrive at Echo Station every moon cycle!",
      "We batch process them using CSV uploads and feed them directly into the TF-IDF classifier!"
    ]
  },

  // Research Laboratory NPCs
  "lab_alchemist": {
    name: "Master Alchemist",
    avatar: "🧪",
    pages: [
      "Welcome to the Alchemical ML Forge! Here we train Scikit-Learn Logistic Regression classifiers.",
      "We extract unigrams, bigrams, and token weights to determine sentiment polarity with high precision!",
      "Press [E] on the central terminal to ignite the analysis engine!"
    ]
  },

  // Emotion Engine NPC
  "shrine_priestess": {
    name: "Ether Priestess",
    avatar: "🔮",
    pages: [
      "I am the keeper of the Visual Manifestation Shrine.",
      "Observe how the ambient light shifts whenever reviews are processed in the laboratory!"
    ]
  },

  // Observatory NPC
  "observatory_astronomer": {
    name: "Astronomer",
    avatar: "🔭",
    pages: [
      "Look through the celestial telescope! The stars form confusion matrices and sentiment score distributions!",
      "Our model achieves over 89% accuracy on multi-domain review benchmarks!"
    ]
  }
};

// Aliases to prevent any undefined variable ReferenceErrors
const DIALOGUE_DATABASE = DIALOGUE_DATA;
window.DIALOGUE_DATA = DIALOGUE_DATA;
window.DIALOGUE_DATABASE = DIALOGUE_DATA;
