<<<<<<< HEAD
# Sentiment Analysis of Reviews

**Intern ID:** CITS7491

---

## Project Overview

**Sentiment Analysis of Reviews** is a retro-themed, interactive web application that leverages Machine Learning (ML) and Natural Language Processing (NLP) to evaluate and classify review sentiments in real-time.

The application combines a high-performance Python ML backend with a custom-built, immersive pixel-art canvas frontend. Built using **Flask**, **Scikit-Learn**, **TF-IDF Vectorization**, **HTML5**, **CSS3**, and **JavaScript (ES6)**, it bridges advanced text analytics with an engaging, interactive user experience.

Users can evaluate individual review statements or perform bulk dataset predictions by uploading **CSV** or **JSON** files. The system delivers comprehensive sentiment diagnostics including polarity classification (Positive, Negative, Neutral), confidence probability scores, aspect-based sentiment detection, and dynamic word cloud visualizations.

---

## Features

- **Interactive Pixel-Art World:** Explore custom-designed parallax biomes, interactive NPCs, and atmospheric world effects built on an HTML5 canvas game engine.
- **Single Review Prediction:** Instant real-time sentiment analysis for custom text inputs.
- **Batch CSV Upload:** Bulk sentiment processing for CSV datasets with automatic header detection and validation.
- **Batch JSON Upload:** Structured JSON dataset parsing supporting review arrays and nested payload formats.
- **Word Cloud Visualization:** Dynamic keyword and frequency visualizations powered by D3.js and WordCloud2.
- **Sentiment Confidence Scores:** Granular probabilistic confidence ratings for every predicted sentiment label.
- **Aspect-Based Sentiment Detection:** Categorized sentiment breakdown across domain-specific aspects (e.g., Gameplay, Graphics, Performance).
- **Sample Review Presets:** One-click pre-loaded dataset samples for fast testing and demonstration.
- **Flask REST API:** Lightweight, robust RESTful endpoints (`/api/analyze`, `/api/batch`, `/api/model-info`, `/api/presets`).
- **Responsive UI:** Adaptive glassmorphic control panels optimized across desktop and mobile viewports.
- **Fast Prediction Pipeline:** Low-latency TF-IDF feature extraction and inference engine.
- **Comprehensive Error Handling:** Graceful client-side and server-side validation for empty inputs, malformed files, and network fallbacks.

---

## Tech Stack

| Category | Technologies |
|----------|--------------|
| Backend Language | Python (v3.8+) |
| Web Framework | Flask |
| Machine Learning & NLP | Scikit-Learn, TF-IDF Vectorizer |
| Frontend Markup & Styling | HTML5, CSS3 (Vanilla CSS, Glassmorphic Design) |
| Frontend Scripting & Engine | JavaScript (ES6+), Canvas API |
| Data Visualization | Chart.js, D3.js, WordCloud2 |
| Data Formats | JSON, CSV |

---

## Project Architecture

The application follows a decoupled client-server architecture designed for modularity, low latency, and real-time interactive feedback.

```
User
  │
  ▼
Frontend (HTML5 / CSS3 / JavaScript Canvas Engine)
  │
  ▼  HTTP REST Requests (JSON / FormData)
Flask REST API (app.py)
  │
  ▼
Sentiment Engine (sentiment_engine.py)
  │
  ├─► TF-IDF Vectorizer (Feature Extraction)
  │
  └─► Scikit-Learn Classifier (Probability Calibration)
        │
        ▼
  Prediction Result Payload
        │
        ▼
Visualization Layer (Chart.js + Word Cloud + Pixel-Art World Overlay)
```

1. **User Interface:** The user submits review text manually or uploads dataset files through the interactive frontend.
2. **REST API Gateway:** Flask routes receive the payload, perform input sanity checks, and handle batch file parsing.
3. **NLP & Feature Pipeline:** Raw text is preprocessed and vectorized into high-dimensional numerical feature matrices using fitted TF-IDF models.
4. **ML Inference:** Scikit-Learn classifiers evaluate class probabilities and calculate numerical confidence metrics.
5. **Response & Rendering:** The API packages polarity, confidence scores, aspect breakdowns, and token frequencies into JSON responses to update the UI dashboard and trigger visual reactions in the pixel-art environment.

---

## Project Structure

```
Sentiment-Analysis-of-Reviews/
│
├── app.py                     # Flask web server and REST API routes
├── sentiment_engine.py        # ML pipeline, TF-IDF vectorization, and inference engine
├── train_model.py            # Model training and artifact serialization script
├── requirements.txt           # Python dependencies
│
├── model/                     # Serialized machine learning models
│   ├── sentiment_model.pkl    # Trained classification model
│   └── tfidf_vectorizer.pkl   # Fitted TF-IDF vectorizer
│
├── static/                    # Frontend client assets
│   ├── index.html             # Master web application template
│   ├── css/                   # Stylesheets (pixel-base.css, world.css)
│   └── js/                    # Client engine and UI components
│       ├── app.js             # Main application orchestrator
│       ├── components/        # UI widgets and chart renderers
│       └── engine/            # Canvas rendering engine and game state
│
└── README.md                  # Project documentation
```

---

## Core Functionalities

### Single Review Analysis
Allows users to enter individual review statements into the interactive terminal. The system processes the text instantly and returns polarity classifications, confidence ratings, and aspect breakdowns.

### Batch CSV Processing
Enables bulk analysis of CSV dataset files. The parser automatically detects column headers (e.g., `review`, `text`), extracts text entries, and streams predictions for batch metrics.

### Batch JSON Processing
Handles structured JSON file uploads containing arrays of review objects or key-value structures. It parses payload collections and extracts review text for batch inference.

### Sentiment Prediction
Executes trained ML classification to categorize text into **Positive**, **Negative**, or **Neutral** sentiment states.

### Confidence Score Calculation
Computes calibrated probabilistic confidence values (ranging from 0.0 to 1.0) indicating the model's certainty for each predicted label.

### Aspect-Based Sentiment Detection
Deconstructs review text to identify domain-specific components (e.g., Gameplay, Performance, Visuals) and assesses sentiment for each individual aspect.

### Word Cloud Generation
Extracts high-frequency token features and renders interactive word cloud graphics using D3.js and WordCloud2.

### Interactive Pixel-Art Interface
Provides a responsive HTML5 canvas environment featuring 7 parallax biomes, interactive entities, and dynamic weather effects that react to sentiment results.

### Flask REST APIs
Exposes RESTful endpoints (`POST /api/analyze`, `POST /api/batch`, `GET /api/model-info`, `GET /api/presets`) for integration and decoupled client communication.

---

## Installation

### Clone Repository

```bash
git clone <repository-url>
cd Sentiment-Analysis-of-Reviews
```

### Create Virtual Environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Linux / macOS:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Application

```bash
python app.py
```

Once started, open your browser and navigate to:

```
http://127.0.0.1:5000
```

---

## Usage

1. Launch the application locally by running `python app.py`.
2. Enter any custom review text into the input field and click **Analyze**.
3. View instant output diagnostics:
   - Sentiment Polarity (Positive, Negative, Neutral)
   - Confidence Score
   - Aspect Analysis
   - Dynamic Word Cloud
4. Upload a CSV dataset file using the **Upload Batch CSV/JSON** option for bulk evaluation.
5. Upload a JSON dataset file to parse structured review collections.
6. Explore the interactive pixel-art world by scrolling through biomes and interacting with entities.

---

## REST API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/analyze` | `POST` | Analyzes sentiment for a single review text payload. |
| `/api/batch` | `POST` | Performs batch sentiment analysis for uploaded CSV or JSON datasets. |
| `/api/model-info` | `GET` | Returns machine learning model metadata, vectorizer details, and performance metrics. |
| `/api/presets` | `GET` | Retrieves pre-loaded sample review datasets for instant testing. |

---

## Example API Request

### Request

`POST /api/analyze`

```json
{
  "text": "I absolutely love this game."
}
```

### Response

```json
{
  "status": "success",
  "data": {
    "polarity": "Positive",
    "confidence": 0.94,
    "engine_used": "TF-IDF + LogisticRegression",
    "aspects": [
      {
        "aspect": "General",
        "sentiment": "Positive"
      },
      {
        "aspect": "Gameplay",
        "sentiment": "Positive"
      }
    ],
    "tokens": ["absolutely", "love", "game"]
  }
}
```

---

## Requirements

- Python 3.x
- Flask
- Scikit-Learn
- TF-IDF Vectorizer
- HTML5 / CSS3 / JavaScript (ES6)
- Modern Web Browser (Chrome, Firefox, Edge, Safari)

---

## Future Enhancements

- Integration of Deep Learning models (LSTM, RoBERTa, or Transformer-based BERT architectures) for fine-grained contextual sentiment extraction.
- Multi-language sentiment analysis support using multilingual tokenizers.
- User authentication and persistent user dashboard histories.
- Database integration (PostgreSQL / MongoDB) for storing batch analysis records.
- Real-time streaming analytics dashboard for live review feeds.
- Speech-to-text audio review sentiment analysis pipeline.
- Mobile responsive layout optimization and touch-gesture control refinements.
- Cloud deployment and containerization (Docker, AWS, GCP, Heroku).
- Exportable prediction reports in PDF and Excel formats.
- Advanced interactive 3D sentiment visualization metrics.

---

## Acknowledgements

Special thanks to the developers and maintainers of the following technologies that made this project possible:

- **Flask**
- **Scikit-Learn**
- **Python**
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Open Source Community**

---

## Author

**Ansh Kushwaha**  
B.Tech CSE (AI)  
**Intern ID:** CITS7491  

**GitHub:** [github.com/AnshKushwaha](https://github.com/)

---

## License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details.

---

*This project was developed as part of an internship to demonstrate practical implementation of Sentiment Analysis using Machine Learning through an interactive web application.*
=======
# Email-Spam-Classifier
>>>>>>> c525cad5995f92b8d95384c0b76dabf6de922205
