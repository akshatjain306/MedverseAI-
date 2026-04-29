"""
Medverse AI — X-Ray Analyzer Evaluation Script
===============================================
Evaluates the CNN pneumonia detection model on test images.
Outputs: AUC-ROC, Sensitivity, Specificity, Accuracy, F1-Score.

Usage:
    python evaluation/eval_xray.py --test_dir path/to/test/images

Test directory should have this structure:
    test/
    ├── NORMAL/
    │   ├── normal_001.jpeg
    │   ├── normal_002.jpeg
    │   └── ...
    └── PNEUMONIA/
        ├── pneumonia_001.jpeg
        ├── pneumonia_002.jpeg
        └── ...

You can download test images from:
- RSNA Pneumonia Detection Challenge: https://www.kaggle.com/c/rsna-pneumonia-detection-challenge
- Chest X-Ray Images (Pneumonia): https://www.kaggle.com/datasets/paultimothymooney/chest-xray-pneumonia
"""

import os
import sys
import json
import time
import argparse
import numpy as np
import cv2
import tensorflow as tf
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    confusion_matrix,
    classification_report,
    roc_curve,
)


# -----------------------------------------------
# PATHS
# -----------------------------------------------
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, "models", "pneumonia_cnn_model.h5")


# -----------------------------------------------
# LOAD MODEL
# -----------------------------------------------
print("[INFO] Loading X-Ray CNN model...")
model = tf.keras.models.load_model(MODEL_PATH)
print("[OK] Model loaded successfully")
print(f"[INFO] Input shape: {model.input_shape}")
print(f"[INFO] Output shape: {model.output_shape}")


# -----------------------------------------------
# IMAGE PREPROCESSING (same as production)
# -----------------------------------------------
def preprocess_image(image_path, img_size=(224, 224)):
    """Preprocess image exactly as the production code does."""
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image: {image_path}")
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, img_size)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)
    return img


# -----------------------------------------------
# LOAD TEST DATA
# -----------------------------------------------
def load_test_data(test_dir):
    """
    Load test images from directory structure:
    test_dir/NORMAL/  → label 0
    test_dir/PNEUMONIA/ → label 1
    """
    images = []

    normal_dir = os.path.join(test_dir, "NORMAL")
    pneumonia_dir = os.path.join(test_dir, "PNEUMONIA")

    if not os.path.exists(normal_dir) or not os.path.exists(pneumonia_dir):
        print(f"[ERROR] Expected directories: {normal_dir} and {pneumonia_dir}")
        sys.exit(1)

    # Load NORMAL images (label = 0)
    for fname in os.listdir(normal_dir):
        if fname.lower().endswith((".jpg", ".jpeg", ".png")):
            images.append(
                {"path": os.path.join(normal_dir, fname), "label": 0, "class": "NORMAL"}
            )

    # Load PNEUMONIA images (label = 1)
    for fname in os.listdir(pneumonia_dir):
        if fname.lower().endswith((".jpg", ".jpeg", ".png")):
            images.append(
                {
                    "path": os.path.join(pneumonia_dir, fname),
                    "label": 1,
                    "class": "PNEUMONIA",
                }
            )

    print(
        f"[INFO] Loaded {len(images)} images "
        f"(NORMAL: {sum(1 for i in images if i['label']==0)}, "
        f"PNEUMONIA: {sum(1 for i in images if i['label']==1)})"
    )

    return images


# -----------------------------------------------
# EVALUATION
# -----------------------------------------------
def evaluate(test_dir):
    """Run full evaluation on test image directory."""
    test_data = load_test_data(test_dir)

    if len(test_data) == 0:
        print("[ERROR] No test images found!")
        return

    print(f"\n{'='*60}")
    print(f"  MEDVERSE AI — X-RAY ANALYZER EVALUATION")
    print(f"  Test Images: {len(test_data)}")
    print(f"  Model: {MODEL_PATH}")
    print(f"{'='*60}\n")

    y_true = []
    y_probs = []  # Raw probabilities for AUC-ROC
    y_pred = []   # Binary predictions (threshold = 0.70)
    inference_times = []
    errors = 0

    for i, sample in enumerate(test_data):
        try:
            start = time.time()
            img = preprocess_image(sample["path"])
            prob = float(model.predict(img, verbose=0)[0][0])
            elapsed = (time.time() - start) * 1000  # ms

            inference_times.append(elapsed)

            # Same threshold as production code (0.70)
            pred_label = 1 if prob > 0.70 else 0

            y_true.append(sample["label"])
            y_probs.append(prob)
            y_pred.append(pred_label)

            if (i + 1) % 50 == 0:
                print(f"  Processed {i+1}/{len(test_data)} images...")

        except Exception as e:
            errors += 1
            print(f"  [WARN] Error processing {sample['path']}: {e}")

    print(f"\n  Processed: {len(y_true)} | Errors: {errors}")

    # -----------------------------------------------
    # COMPUTE METRICS
    # -----------------------------------------------
    y_true = np.array(y_true)
    y_probs = np.array(y_probs)
    y_pred = np.array(y_pred)

    # Confusion matrix
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()

    accuracy = accuracy_score(y_true, y_pred) * 100
    sensitivity = (tp / (tp + fn)) * 100 if (tp + fn) > 0 else 0  # Recall for pneumonia
    specificity = (tn / (tn + fp)) * 100 if (tn + fp) > 0 else 0  # Recall for normal
    precision = precision_score(y_true, y_pred, zero_division=0) * 100
    f1 = f1_score(y_true, y_pred, zero_division=0) * 100
    auc_roc = roc_auc_score(y_true, y_probs)
    avg_inference = np.mean(inference_times)
    std_inference = np.std(inference_times)

    print(f"\n{'='*60}")
    print(f"  RESULTS (Threshold = 0.70)")
    print(f"{'='*60}")
    print(f"  AUC-ROC:            {auc_roc:.4f}")
    print(f"  Sensitivity (TPR):  {sensitivity:.2f}%")
    print(f"  Specificity (TNR):  {specificity:.2f}%")
    print(f"  Accuracy:           {accuracy:.2f}%")
    print(f"  Precision (PPV):    {precision:.2f}%")
    print(f"  F1-Score:           {f1:.2f}%")
    print(f"  Avg Inference Time: {avg_inference:.1f} ± {std_inference:.1f} ms")
    print(f"{'='*60}")

    print(f"\n  CONFUSION MATRIX:")
    print(f"                  Predicted")
    print(f"                NORMAL  PNEUMONIA")
    print(f"  Actual NORMAL    {tn:>5}    {fp:>5}")
    print(f"  Actual PNEUMO    {fn:>5}    {tp:>5}")

    print(f"\n  DETAILED CLASSIFICATION REPORT:")
    print(
        classification_report(
            y_true, y_pred, target_names=["NORMAL", "PNEUMONIA"], zero_division=0
        )
    )

    # -----------------------------------------------
    # THRESHOLD ANALYSIS
    # -----------------------------------------------
    print(f"\n  THRESHOLD ANALYSIS:")
    print(f"  {'Threshold':>10} | {'Accuracy':>8} | {'Sensitivity':>11} | {'Specificity':>11} | {'F1':>6}")
    print(f"  {'-'*55}")
    for thresh in [0.50, 0.55, 0.60, 0.65, 0.70, 0.75, 0.80]:
        preds = (y_probs > thresh).astype(int)
        tn_t, fp_t, fn_t, tp_t = confusion_matrix(y_true, preds).ravel()
        acc_t = accuracy_score(y_true, preds) * 100
        sens_t = (tp_t / (tp_t + fn_t)) * 100 if (tp_t + fn_t) > 0 else 0
        spec_t = (tn_t / (tn_t + fp_t)) * 100 if (tn_t + fp_t) > 0 else 0
        f1_t = f1_score(y_true, preds, zero_division=0) * 100
        marker = " ◄ current" if thresh == 0.70 else ""
        print(f"  {thresh:>10.2f} | {acc_t:>7.2f}% | {sens_t:>10.2f}% | {spec_t:>10.2f}% | {f1_t:>5.2f}%{marker}")

    # -----------------------------------------------
    # SAVE RESULTS
    # -----------------------------------------------
    results = {
        "auc_roc": round(auc_roc, 4),
        "sensitivity": round(sensitivity, 2),
        "specificity": round(specificity, 2),
        "accuracy": round(accuracy, 2),
        "precision": round(precision, 2),
        "f1_score": round(f1, 2),
        "threshold": 0.70,
        "avg_inference_ms": round(avg_inference, 1),
        "std_inference_ms": round(std_inference, 1),
        "test_images": len(y_true),
        "normal_count": int(np.sum(y_true == 0)),
        "pneumonia_count": int(np.sum(y_true == 1)),
        "confusion_matrix": {"TP": int(tp), "TN": int(tn), "FP": int(fp), "FN": int(fn)},
    }

    output_path = os.path.join(os.path.dirname(__file__), "xray_results.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n  Results saved to: {output_path}")

    return results


# -----------------------------------------------
# MAIN
# -----------------------------------------------
if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Evaluate X-Ray CNN Model")
    parser.add_argument(
        "--test_dir",
        type=str,
        required=True,
        help="Path to test directory (must contain NORMAL/ and PNEUMONIA/ subdirectories)",
    )
    args = parser.parse_args()

    evaluate(args.test_dir)
