import os
import cv2
import numpy as np
import tensorflow as tf

# ------------------------------
# PATH LOADING
# ------------------------------
def resolve_model_path(name):
    paths = [
        os.path.join("models", name),
        os.path.join("Backend", "models", name),
        name,
    ]
    for p in paths:
        if os.path.exists(p):
            return p
    raise FileNotFoundError(f"Model file {name} not found")

# ------------------------------
# MODEL LOADING (Lazy Load)
# ------------------------------
MODEL_PATH = resolve_model_path("pneumonia_cnn_model.h5")

cnn_model = None

def load_model():
    global cnn_model
    if cnn_model is None:
        print("Loading X-Ray CNN Model...")
        cnn_model = tf.keras.models.load_model(MODEL_PATH)
        print("X-Ray CNN Model Loaded Successfully!")
    return cnn_model


# ------------------------------
# IMAGE PREPROCESSING
# ------------------------------
def preprocess_image(image_path, img_size=(224, 224)):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"❌ Image not found: {image_path}")

    img = cv2.imread(image_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    img = cv2.resize(img, img_size)
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    return img


# ------------------------------
# PREDICTION FUNCTION
# ------------------------------
def predict_xray(image_path):
    model = load_model()

    img = preprocess_image(image_path)
    pred = model.predict(img)[0][0]

    label = "PNEUMONIA" if pred > 0.70 else "NORMAL"
    confidence = float(pred if pred > 0.5 else (1 - pred))

    return {
        "success": True,
        "label": label,
        "confidence": round(confidence, 4),
        "message": f"Prediction: {label} ({confidence*100:.2f}% confidence)"
    }


# ------------------------------
# DIRECT TERMINAL USAGE (Optional)
# ------------------------------
if __name__ == "__main__":
    image_path = input("📁 Enter image path: ").strip().replace('"', '').replace("'", "")
    try:
        result = predict_xray(image_path)
        print("\n=========== RESULT ===========")
        print("Image:", image_path)
        print("Prediction:", result["label"])
        print("Confidence:", f"{result['confidence']*100:.2f}%")
        print("================================\n")
    except Exception as e:
        print("❌ Error:", str(e))
