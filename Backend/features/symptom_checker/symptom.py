import pickle
import re
import os
import torch
import google.generativeai as genai
from transformers import AutoModelForSequenceClassification
from dotenv import load_dotenv

# -------------------------------
# Gemini Setup
# -------------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_API_KEY != "GEMINI_API_KEY":
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_AVAILABLE = True
    print("[OK] Gemini API configured for Symptom Checker")
else:
    GEMINI_AVAILABLE = False
    print("[WARN] Gemini API key not set - Symptom Checker will work without AI explanations")

# -------------------------------
# Load Disease Model
# -------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "models", "final_disease_model.pkl")
MODEL_PATH = os.path.abspath(MODEL_PATH)

# Fallback paths
if not os.path.exists(MODEL_PATH):
    for p in ["models/final_disease_model.pkl", "Backend/models/final_disease_model.pkl"]:
        if os.path.exists(p):
            MODEL_PATH = p
            break

print(f"[INFO] Loading disease model from: {MODEL_PATH}")

with open(MODEL_PATH, "rb") as f:
    bundle = pickle.load(f)

state_dict = bundle["state_dict"]
tokenizer = bundle["tokenizer"]
label_encoder = bundle["label_encoder"]

# Load same pretrained model used in training
model = AutoModelForSequenceClassification.from_pretrained(
    "emilyalsentzer/Bio_ClinicalBERT",
    num_labels=len(label_encoder.classes_)
)

model.load_state_dict(state_dict)
model.eval()
print(f"[OK] Disease model loaded ({len(label_encoder.classes_)} classes)")


def gemini_explain(disease, text):
    """Use Gemini to generate an explanation. Falls back to basic explanation if unavailable."""
    if not GEMINI_AVAILABLE:
        return f"Based on the symptoms described ({text}), the AI model predicts {disease}. Please consult a healthcare professional for proper diagnosis and treatment."

    try:
        prompt = f"Explain simply in 9 to 10 lines how symptoms '{text}' relate to {disease}."
        gemini_model = genai.GenerativeModel("gemini-2.0-flash")
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        print(f"[WARN] Gemini API error: {e}")
        return f"Based on the symptoms described ({text}), the AI model predicts {disease}. Please consult a healthcare professional for proper diagnosis and treatment."


def analyze_symptoms(text):
    try:
        encoded = tokenizer(text, return_tensors="pt", truncation=True, padding=True)

        with torch.no_grad():
            logits = model(**encoded).logits
            probs = torch.softmax(logits, dim=1).squeeze().numpy()

        idx = probs.argmax()
        disease = label_encoder.inverse_transform([idx])[0]
        confidence = float(probs[idx])

        explanation = gemini_explain(disease, text)
        cleaned_text = re.sub(r'[^a-zA-Z0-9\s.,]', '', explanation)

        return {
            "disease": disease,
            "confidence": confidence,
            "explanation": cleaned_text,
        }
    except Exception as e:
        print(f"Error in analyze_symptoms: {e}")
        raise e
