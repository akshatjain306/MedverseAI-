"""
Medverse AI — Symptom Checker Evaluation Script
================================================
Evaluates the Bio-ClinicalBERT disease prediction model on test data.
Outputs: Accuracy, Precision, Recall, F1-Score, Top-3 Accuracy, Confusion Matrix.

Usage:
    python evaluation/eval_symptom_checker.py

Ensure Backend virtual environment is activated and models are loaded.
"""

import os
import sys
import json
import time
import pickle
import numpy as np
import torch
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    classification_report,
    confusion_matrix,
)
from transformers import AutoModelForSequenceClassification

# -----------------------------------------------
# PATHS
# -----------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "final_disease_model.pkl")

# -----------------------------------------------
# LOAD MODEL
# -----------------------------------------------
print("[INFO] Loading disease model...")
with open(MODEL_PATH, "rb") as f:
    bundle = pickle.load(f)

state_dict = bundle["state_dict"]
tokenizer = bundle["tokenizer"]
label_encoder = bundle["label_encoder"]

model = AutoModelForSequenceClassification.from_pretrained(
    "emilyalsentzer/Bio_ClinicalBERT",
    num_labels=len(label_encoder.classes_),
)
model.load_state_dict(state_dict)
model.eval()

num_classes = len(label_encoder.classes_)
print(f"[OK] Model loaded — {num_classes} disease classes")
print(f"[INFO] Classes: {list(label_encoder.classes_)}")


# -----------------------------------------------
# TEST DATA
# -----------------------------------------------
# Option 1: Built-in test samples (use these to start)
# Option 2: Load from a CSV/JSON file (extend later with real datasets)

TEST_SAMPLES = [
    # Format: (symptom_text, expected_disease)
    # Replace these with your actual test data
    ("I have a persistent headache and mild fever", "Migraine"),
    ("severe chest pain and shortness of breath", "Heart Disease"),
    ("skin rash with itching and redness", "Allergy"),
    ("persistent cough with blood in sputum", "Tuberculosis"),
    ("frequent urination and excessive thirst", "Diabetes"),
    ("joint pain and swelling in the knees", "Arthritis"),
    ("stomach pain with nausea and vomiting", "Gastroenteritis"),
    ("blurry vision and eye pain", "Glaucoma"),
    ("sore throat and difficulty swallowing", "Pharyngitis"),
    ("anxiety, insomnia, and mood swings", "Depression"),
    # ADD MORE TEST SAMPLES HERE
    # You can also load from a CSV file — see load_test_data_from_csv()
]


def load_test_data_from_csv(csv_path):
    """
    Load test data from a CSV file with columns: 'symptoms', 'disease'
    Returns list of (symptom_text, expected_disease) tuples.
    """
    import pandas as pd

    df = pd.read_csv(csv_path)
    return list(zip(df["symptoms"].tolist(), df["disease"].tolist()))


# -----------------------------------------------
# PREDICTION FUNCTION
# -----------------------------------------------
def predict_single(text):
    """Run a single prediction, return top predictions with probabilities."""
    encoded = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

    with torch.no_grad():
        logits = model(**encoded).logits
        probs = torch.softmax(logits, dim=1).squeeze().numpy()

    # Sort by probability (descending)
    sorted_indices = np.argsort(probs)[::-1]
    top_predictions = [
        {
            "disease": label_encoder.inverse_transform([idx])[0],
            "probability": float(probs[idx]),
        }
        for idx in sorted_indices[:5]  # Top 5
    ]

    return {
        "top1": top_predictions[0]["disease"],
        "top1_conf": top_predictions[0]["probability"],
        "top3": [p["disease"] for p in top_predictions[:3]],
        "top5": [p["disease"] for p in top_predictions[:5]],
        "all_probs": probs,
    }


# -----------------------------------------------
# EVALUATION
# -----------------------------------------------
def evaluate(test_data):
    """Run full evaluation on test data."""
    print(f"\n{'='*60}")
    print(f"  MEDVERSE AI — SYMPTOM CHECKER EVALUATION")
    print(f"  Test Samples: {len(test_data)}")
    print(f"  Disease Classes: {num_classes}")
    print(f"{'='*60}\n")

    y_true = []
    y_pred = []
    top3_correct = 0
    inference_times = []

    for i, (symptoms, expected) in enumerate(test_data):
        start = time.time()
        result = predict_single(symptoms)
        elapsed = (time.time() - start) * 1000  # ms

        inference_times.append(elapsed)

        predicted = result["top1"]
        y_true.append(expected)
        y_pred.append(predicted)

        # Check top-3 accuracy
        if expected in result["top3"]:
            top3_correct += 1

        status = "✓" if predicted == expected else "✗"
        print(
            f"  [{status}] Sample {i+1}: "
            f"Expected='{expected}' | Predicted='{predicted}' "
            f"(conf={result['top1_conf']:.4f}, {elapsed:.1f}ms)"
        )

    # -----------------------------------------------
    # COMPUTE METRICS
    # -----------------------------------------------
    accuracy = accuracy_score(y_true, y_pred) * 100
    precision = precision_score(y_true, y_pred, average="weighted", zero_division=0) * 100
    recall = recall_score(y_true, y_pred, average="weighted", zero_division=0) * 100
    f1 = f1_score(y_true, y_pred, average="weighted", zero_division=0) * 100
    top3_acc = (top3_correct / len(test_data)) * 100
    avg_inference = np.mean(inference_times)
    std_inference = np.std(inference_times)

    print(f"\n{'='*60}")
    print(f"  RESULTS")
    print(f"{'='*60}")
    print(f"  Accuracy:           {accuracy:.2f}%")
    print(f"  Weighted Precision: {precision:.2f}%")
    print(f"  Weighted Recall:    {recall:.2f}%")
    print(f"  Weighted F1-Score:  {f1:.2f}%")
    print(f"  Top-3 Accuracy:     {top3_acc:.2f}%")
    print(f"  Avg Inference Time: {avg_inference:.1f} ± {std_inference:.1f} ms")
    print(f"  Disease Classes:    {num_classes}")
    print(f"  Test Samples:       {len(test_data)}")
    print(f"{'='*60}")

    # Classification report (per-class metrics)
    print(f"\n  DETAILED CLASSIFICATION REPORT:")
    print(classification_report(y_true, y_pred, zero_division=0))

    # -----------------------------------------------
    # SAVE RESULTS
    # -----------------------------------------------
    results = {
        "accuracy": round(accuracy, 2),
        "weighted_precision": round(precision, 2),
        "weighted_recall": round(recall, 2),
        "weighted_f1": round(f1, 2),
        "top3_accuracy": round(top3_acc, 2),
        "avg_inference_ms": round(avg_inference, 1),
        "std_inference_ms": round(std_inference, 1),
        "num_classes": num_classes,
        "test_samples": len(test_data),
    }

    output_path = os.path.join(os.path.dirname(__file__), "symptom_checker_results.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n  Results saved to: {output_path}")

    return results


# -----------------------------------------------
# MAIN
# -----------------------------------------------
if __name__ == "__main__":
    # Use built-in test data or load from CSV
    # To use CSV: test_data = load_test_data_from_csv("path/to/test.csv")
    test_data = TEST_SAMPLES

    print(f"[INFO] Using {len(test_data)} test samples")
    evaluate(test_data)
