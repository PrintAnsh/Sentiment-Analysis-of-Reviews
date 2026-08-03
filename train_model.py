"""
Model Training Script for Realm of Echoes: Sentiment Analysis Engine
Trains TF-IDF Vectorizer + Scikit-Learn Logistic Regression Classifier
on a balanced, multi-domain dataset of short and long reviews.
"""

import os
import joblib
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

# Comprehensive Multi-Domain Dataset with Short and Long Review Samples
TRAINING_CORPUS = [
    # --- POSITIVE (Class: "Positive") ---
    ("I love this game.", "Positive"),
    ("I had an amazing experience.", "Positive"),
    ("This product is fantastic.", "Positive"),
    ("This game is an absolute masterpiece of pixel art and sound design! Loved every second.", "Positive"),
    ("Exceptional product! High quality build, fast delivery, and ultra smooth performance.", "Positive"),
    ("Wonderful experience at the hotel. Friendly staff, immaculate rooms, and great food.", "Positive"),
    ("One of the best movies I have ever seen. Brilliant storyline and stunning visuals.", "Positive"),
    ("Flawless execution! Controls are tight, gameplay is addictive, and mechanics are innovative.", "Positive"),
    ("Awesome customer service! Solved my issue in minutes with great care.", "Positive"),
    ("Superb battery life and incredible display resolution. Highly recommend!", "Positive"),
    ("Charming world, delightful music, and rich lore. Truly a fantastic experience.", "Positive"),
    ("Great value for money. Performs way better than more expensive alternatives.", "Positive"),
    ("Beautiful craftsmanship! Sturdy, elegant, and works like a charm.", "Positive"),
    ("I love everything about this application. Fast, responsive, and beautifully designed.", "Positive"),
    ("Outstanding performance! No lag whatsoever, super smooth frame rates.", "Positive"),
    ("An amazing adventure from start to finish. Masterpiece!", "Positive"),
    ("Clean UI, easy navigation, and powerful features. 10/10!", "Positive"),
    ("Heartwarming dialogue, memorable characters, and atmospheric lighting.", "Positive"),
    ("I really enjoyed this game.", "Positive"),
    ("Highly recommend this to everyone!", "Positive"),
    ("Perfect quality and fast shipping.", "Positive"),

    # --- NEGATIVE (Class: "Negative") ---
    ("I hate this game.", "Negative"),
    ("This is the worst product.", "Negative"),
    ("Terrible experience.", "Negative"),
    ("Absolute garbage! Crashes constantly and completely unusable. Waste of money.", "Negative"),
    ("Terrible customer support. Ignored my emails for weeks and refused a refund.", "Negative"),
    ("Horrible performance. Extremely laggy, buggy controls, and ugly textures.", "Negative"),
    ("Worst purchase I have ever made. Broken out of the box and defective.", "Negative"),
    ("Awful movie. Boring plot, dreadful acting, and terrible pacing.", "Negative"),
    ("Overpriced and disappointing. Lacks basic features and feels unfinished.", "Negative"),
    ("Frustrating experience. Constantly freezes and deletes progress.", "Negative"),
    ("Cheap materials, flimsy design, and broke after two days of light use.", "Negative"),
    ("Nightmare to setup! Confusing instructions and clunky software.", "Negative"),
    ("I regret buying this. Clunky UI, painful navigation, and unresponsive buttons.", "Negative"),
    ("Dreadful service. Arrived late, damaged packaging, and missing parts.", "Negative"),
    ("Super slow speed, frequent disconnects, and useless troubleshooting guides.", "Negative"),
    ("Uninspiring gameplay, tedious quests, and frustrating difficulty spikes.", "Negative"),
    ("Extremely disappointed. Does not match the description or photos at all.", "Negative"),
    ("Bad quality control. Useless piece of plastic.", "Negative"),
    ("I hate it so much.", "Negative"),
    ("Total waste of time and money.", "Negative"),
    ("Worst service ever.", "Negative"),

    # --- NEUTRAL (Class: "Neutral") ---
    ("The package arrived yesterday.", "Neutral"),
    ("The weather is cloudy.", "Neutral"),
    ("The meeting starts at 2 PM.", "Neutral"),
    ("The product is ok. Works as described but nothing groundbreaking.", "Neutral"),
    ("Average performance for the price point. Adequate but not impressive.", "Neutral"),
    ("It arrived on time. Packaging was standard. Unit functions normally.", "Neutral"),
    ("Standard indie game with classic mechanics. Neither good nor bad.", "Neutral"),
    ("The graphics are decent, but the story is quite predictable.", "Neutral"),
    ("Acceptable build quality. Serves its basic purpose for daily tasks.", "Neutral"),
    ("Fairly quiet operation, speed is moderate, features are basic.", "Neutral"),
    ("Mixed feelings. Great visuals but mediocre sound design.", "Neutral"),
    ("It does what it says on the box. Nothing more, nothing less.", "Neutral"),
    ("Functional application. Has some minor quirks but works fine.", "Neutral"),
    ("Decent battery life, standard screen brightness, okay speakers.", "Neutral"),
    ("The meal was acceptable, service was average, prices were typical.", "Neutral"),
    ("Neutral experience overall. Wouldn't strongly recommend or criticize.", "Neutral"),
    ("Basic functionality works as expected. Installation was normal.", "Neutral"),
    ("Passable quality. Fine for casual occasional use.", "Neutral"),
    ("The book is on the table.", "Neutral"),
    ("This item is black and white.", "Neutral"),
    ("The train leaves at 5 o'clock.", "Neutral")
]

def train_and_save():
    model_dir = "model"
    os.makedirs(model_dir, exist_ok=True)

    texts = []
    labels = []
    
    for text, label in TRAINING_CORPUS:
        texts.append(text)
        labels.append(label)
        # Add slight case and prefix variations
        texts.append(text.lower())
        labels.append(label)
        texts.append(f"Review: {text}")
        labels.append(label)

    print(f"[TrainModel] Dataset size: {len(texts)} samples across 3 classes.")

    # Fit TF-IDF Vectorizer (sublinear_tf=True, min_df=1)
    vectorizer = TfidfVectorizer(
        ngram_range=(1, 2),
        max_features=2000,
        sublinear_tf=True,
        lowercase=True
    )
    X = vectorizer.fit_transform(texts)
    y = np.array(labels)

    # Fit Logistic Regression Classifier
    model = LogisticRegression(C=2.0, max_iter=1000, random_state=42)
    model.fit(X, y)

    # Evaluate
    y_pred = model.predict(X)
    acc = accuracy_score(y, y_pred)
    print(f"[TrainModel] Training Accuracy: {acc * 100:.2f}%")
    print(f"[TrainModel] Model Classes: {list(model.classes_)}")
    print(classification_report(y, y_pred))

    # Save serialized artifacts
    joblib.dump(model, os.path.join(model_dir, "sentiment_model.pkl"))
    joblib.dump(vectorizer, os.path.join(model_dir, "tfidf_vectorizer.pkl"))
    print(f"[TrainModel] Retrained and saved model artifacts to '{model_dir}/'. Success!")

if __name__ == "__main__":
    train_and_save()
