# Game Design & UI/UX Specification Document
## Project Title: Sentiment Analysis of Reviews (*Realm of Echoes: The Indie Pixel World*)

---

## 1. Executive Summary & Vision Statement

### 1.1 Project Overview
**Sentiment Analysis of Reviews** is an interactive, continuous-scrolling pixel-art indie game and web application. Rather than a traditional static dashboard, **the website itself is the game**. Users navigate an ethereal retro pixel-art world featuring a playable character, dynamic camera system, interactable NPCs, buildings, signposts, and alchemical machines. Every Machine Learning feature is discovered naturally by exploring the world.

### 1.2 Core Vision & Experience
- **Concept**: *Continuous Scrolling Indie Pixel-Art World*.
- **Exploration Loop**: 
  1. **Traverse**: The user walks/scrolls through distinct pixel-art biomes and locations (Forest, Village, Review Station, Ancient Laboratory, Emotion Engine, Observatory, Credits).
  2. **Interact**: The player character interacts with NPCs, mailboxes, research terminals, and emotion engines.
  3. **Analyze**: In the Laboratory & Station, reviews are processed by a real Flask + Scikit-Learn TF-IDF machine learning engine.
  4. **Discover**: Analytics, charts, confusion matrices, and word clouds are housed inside the **Analytics Observatory** building within the game world.

---

## 2. World Sections & Map Journey

The world is constructed as a seamless, continuous scrolling interactive landscape:

```
+---------------------------------------------------------------------------------------------------------------+
| [1. Forest]  -->  [2. Village]  -->  [3. Review Station]  -->  [4. Research Lab]  -->  [5. Emotion Engine]  |
| Ambient trees      NPC lore,         Mailbox & Quick           Alchemical ML        Visual Particle           |
| & Mists            Signposts         Review Terminal           Sentiment Forge      Manifestation Chamber     |
+---------------------------------------------------------------------------------------------------------------+
                                                                |
                                                                v
                                              +-----------------------------------+
                                              | [6. Analytics Observatory]  -->   |  [7. Credits]
                                              | Interactive Charts, Metrics,      |  Horizon Sunset & Spire
                                              | Confusion Matrix & Word Cloud     |
                                              +-----------------------------------+
```

### Biome & Location Details:
1. **Forest Biome**: Atmospheric introduction with floating petals, pixel mists, ambient soundscapes, and movement controls tutorial.
2. **Village**: Town square with interactive NPCs providing lore on sentiment analysis and signposts explaining the realm.
3. **Review Station**: A cozy station building containing an interactive Mailbox and Quick Review Scanner.
4. **Ancient Research Laboratory**: The core ML chamber containing the Alchemical Sentiment Machine. Input reviews or drop datasets to trigger sentiment classification.
5. **Emotion Engine**: A grand manifestation temple with real-time canvas shaders/particles reacting to current sentiment (Radiant Blossom Light / Void Corruption / Arcane Ether).
6. **Analytics Observatory**: A multi-story observatory room fitted with celestial telescopes and pixel-framed interactive charts (Chart.js), score distribution, confusion matrix, and aspect word clouds.
7. **Credits & Spire**: Sunset horizon view featuring towering spires, dragon silhouettes, and developer credits.

---

## 3. Aesthetic & Visual Design Tokens

Synthesized from pixel-art and synthwave inspirations:

- **Art Style**: High-fidelity Retro Pixel Art with modern shaders and particle effects.
- **Palette**:
  - **Forest & Atmosphere**: Emerald Dark `#091b12`, Deep Violet `#1c0d2b`, Soft Pink `#ff80ab`
  - **Village & Sunset**: Amber Dusk `#ffab40`, Warm Rose `#ff4081`, Night Slate `#101424`
  - **Laboratory & Neon**: Electric Cyan `#00e5ff`, Synth Magenta `#e040fb`, Alchemical Gold `#ffd54f`
  - **Observatory & Space**: Midnight Indigo `#0a0e1a`, Celestial Cyan `#80d8ff`, Star Amber `#ffe082`

---

## 4. Technical Architecture (7-Phase Roadmap)

### Frontend
- **Framework**: React + Vite
- **Animation & Scroll Engine**: GSAP + GSAP ScrollTrigger + Lenis smooth scroll
- **Rendering**: Canvas API for pixel rendering, sprite animation state machines, and particle effects
- **Charts & Data**: Chart.js embedded into pixel UI frames in the Observatory

### Backend & ML
- **Framework**: Python Flask API
- **NLP / ML**: Scikit-learn (TF-IDF Vectorizer + Logistic Regression / Naive Bayes Classifier) + NLTK (VADER fallback engine)
- **Data Models**: Multi-domain review dataset classification, confidence scoring, aspect extraction, and confusion matrix payload.

---

## 5. Verification & Approval Checklist

- [x] GDD updated to reflect Continuous Scrolling Indie Pixel World architecture.
- [x] 7-Phase implementation roadmap aligned with requirements.
- [x] Implementation Plan updated (`implementation_plan.md`).
