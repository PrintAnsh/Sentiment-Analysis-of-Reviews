"""
Flask Server API for Realm of Echoes: Sentiment Analysis Engine
Serves static frontend assets and REST API endpoints for sentiment analysis.
"""

import json
import os
import csv
import io
from flask import Flask, request, jsonify, send_from_directory, Response
from sentiment_engine import SentimentEngine

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_FOLDER = os.path.join(BASE_DIR, "static")
MODEL_DIR = os.path.join(BASE_DIR, "model")

# Initialize Flask app
app = Flask(__name__, static_folder=STATIC_FOLDER, static_url_path="")

# Initialize ML / Lexicon Sentiment Engine
engine = SentimentEngine(model_dir=MODEL_DIR)

# Sample Review Presets across categories
PRESET_REVIEWS = [
    {
        "id": "preset-1",
        "category": "Gaming",
        "title": "Pixel RPG Fantasy",
        "review": "This game is an absolute masterpiece of pixel art and sound design! The controls are smooth, the lore is rich, and I loved every single second of exploration."
    },
    {
        "id": "preset-2",
        "category": "Tech Gadget",
        "title": "Quantum Headphones",
        "review": "Terrible build quality. The headband cracked after two days of light use, audio disconnects constantly, and customer support ignored my refund request."
    },
    {
        "id": "preset-3",
        "category": "Hotel Stay",
        "title": "Ethereal Citadel Suites",
        "review": "The hotel room was acceptable and arrived on schedule. Staff were standard, prices were average, and amenities functioned normally."
    },
    {
        "id": "preset-4",
        "category": "Cinema",
        "title": "Chronicles of the Spire",
        "review": "A breathtaking cinematic masterpiece! Visual effects were stunning, character development was deep, and the soundtrack gave me chills."
    }
]

@app.route("/")
def index():
    return send_from_directory(STATIC_FOLDER, "index.html")

@app.route("/<path:path>")
def serve_static(path):
    return send_from_directory(STATIC_FOLDER, path)

@app.route("/api/analyze", methods=["POST"])
def analyze_review():
    data = request.get_json() or {}
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = engine.analyze(text)
    return jsonify({
        "status": "success",
        "data": result
    })

@app.route("/api/batch", methods=["POST"])
def batch_analyze():
    reviews = []
    
    # Check if JSON payload directly in request body
    if request.is_json:
        data = request.get_json()
        if isinstance(data, list):
            for item in data:
                review_text = item.get("review", item.get("text", item)) if isinstance(item, dict) else item
                if review_text:
                    reviews.append(str(review_text))
        elif isinstance(data, dict):
            raw_list = data.get("reviews", data.get("data", []))
            for item in raw_list:
                review_text = item.get("review", item.get("text", item)) if isinstance(item, dict) else item
                if review_text:
                    reviews.append(str(review_text))
    elif "file" in request.files:
        uploaded_file = request.files["file"]
        filename = uploaded_file.filename.lower()
        content = uploaded_file.read().decode("utf-8", errors="ignore")

        # Parse uploaded JSON file
        if filename.endswith(".json"):
            try:
                parsed_json = json.loads(content)
                if isinstance(parsed_json, list):
                    for item in parsed_json:
                        review_text = item.get("review", item.get("text", item)) if isinstance(item, dict) else item
                        if review_text:
                            reviews.append(str(review_text))
                elif isinstance(parsed_json, dict):
                    raw_list = parsed_json.get("reviews", parsed_json.get("data", []))
                    for item in raw_list:
                        review_text = item.get("review", item.get("text", item)) if isinstance(item, dict) else item
                        if review_text:
                            reviews.append(str(review_text))
            except Exception:
                pass

        # CSV fallback if not parsed as JSON
        if not reviews:
            reader = csv.reader(io.StringIO(content))
            header = next(reader, None)
            if header and header[0].strip():
                val = header[0].strip()
                if val.lower() not in ["review", "text", "reviews", "comment"]:
                    reviews.append(val)
            for row in reader:
                if row and row[0].strip():
                    reviews.append(row[0].strip())

    if not reviews:
        # Default sample fallback
        reviews = [p["review"] for p in PRESET_REVIEWS]

    results = []
    for r in reviews[:100]: # Cap at 100 for fast processing
        res = engine.analyze(r)
        results.append(res)

    return jsonify({
        "status": "success",
        "count": len(results),
        "data": results
    })

@app.route("/api/model-info", methods=["GET"])
def model_info():
    metrics = engine.get_model_metrics()
    return jsonify({
        "status": "success",
        "metrics": metrics
    })

@app.route("/api/presets", methods=["GET"])
def get_presets():
    return jsonify({
        "status": "success",
        "presets": PRESET_REVIEWS
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() in ["true", "1"]
    print(f"[Realm of Echoes] Server running on http://0.0.0.0:{port}")
    app.run(host="0.0.0.0", port=port, debug=debug_mode)
