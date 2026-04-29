import os
import re
import pdfplumber
import pandas as pd
from fastapi import UploadFile
import google.generativeai as genai
from dotenv import load_dotenv

# -------------------------------
# Gemini Setup
# -------------------------------
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if GEMINI_API_KEY and GEMINI_API_KEY != "YOUR_GEMINI_API_KEY_HERE":
    genai.configure(api_key=GEMINI_API_KEY)
    GEMINI_AVAILABLE = True
    print("[OK] Gemini API configured for Lab Report Analyzer")
else:
    GEMINI_AVAILABLE = False
    print("[WARN] Gemini API key not set - Lab Report Analyzer will work without AI explanations")


# -------------------------------
# Reference Ranges
# -------------------------------
REF_RANGES = {
    "Hemoglobin": {"unit": "g/dL", "ref_low": 13.0, "ref_high": 17.0},
    "WBC": {"unit": "×10^3/µL", "ref_low": 4.0, "ref_high": 11.0},
    "Platelets": {"unit": "×10^3/µL", "ref_low": 150, "ref_high": 400},
    "Creatinine": {"unit": "mg/dL", "ref_low": 0.7, "ref_high": 1.2},
    "Urea": {"unit": "mg/dL", "ref_low": 10, "ref_high": 40},
    "ALT (SGPT)": {"unit": "U/L", "ref_low": 7, "ref_high": 56},
    "AST (SGOT)": {"unit": "U/L", "ref_low": 5, "ref_high": 40},
    "Bilirubin Total": {"unit": "mg/dL", "ref_low": 0.1, "ref_high": 1.2},
    "TSH": {"unit": "µIU/mL", "ref_low": 0.4, "ref_high": 4.5},
    "T3": {"unit": "ng/dL", "ref_low": 80, "ref_high": 200},
    "T4": {"unit": "µg/dL", "ref_low": 5.1, "ref_high": 14.1},
    "Total Cholesterol": {"unit": "mg/dL", "ref_low": 0, "ref_high": 200},
    "HDL": {"unit": "mg/dL", "ref_low": 40, "ref_high": 60},
    "LDL": {"unit": "mg/dL", "ref_low": 0, "ref_high": 130},
    "Triglycerides": {"unit": "mg/dL", "ref_low": 0, "ref_high": 150},
    "Fasting Glucose": {"unit": "mg/dL", "ref_low": 70, "ref_high": 100},
    "HbA1c": {"unit": "%", "ref_low": 4.0, "ref_high": 5.6},
    "Vitamin D": {"unit": "ng/mL", "ref_low": 30, "ref_high": 100},
    "Vitamin B12": {"unit": "pg/mL", "ref_low": 250, "ref_high": 900},
    "Calcium": {"unit": "mg/dL", "ref_low": 8.5, "ref_high": 10.2},
}


# -------------------------------
# Extract PDF text
# -------------------------------
def extract_pdf_text(file):
    text = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text += (page.extract_text() or "") + "\n"
    return text


# -------------------------------
# Detect Tests
# -------------------------------
def detect_tests(raw_text):
    rows = []
    text = raw_text.lower()

    for test, meta in REF_RANGES.items():
        pattern = rf"{re.escape(test.lower())}\s*[:\-]?\s*([0-9]+\.?[0-9]*)"
        match = re.search(pattern, text)

        if match:
            rows.append({
                "test": test,
                "value": float(match.group(1)),
                "unit": meta["unit"],
                "ref_low": meta["ref_low"],
                "ref_high": meta["ref_high"],
            })

    return pd.DataFrame(rows)


# -------------------------------
# Classify values
# -------------------------------
def classify(value, low, high):
    if value < low:
        return "LOW"
    if value > high:
        return "HIGH"
    return "NORMAL"


# -------------------------------
# Gemini Explanation Function
# -------------------------------
def gemini_explain(text):
    """Use Gemini to generate explanations. Falls back to basic text if unavailable."""
    if not GEMINI_AVAILABLE:
        return f"Abnormal values detected: {text}. Please consult a healthcare professional for detailed interpretation."

    try:
        prompt = (
            "Provide a simple, clear explanation for each abnormal blood test result. "
            "Explain what each test measures and what a high or low value generally indicates. "
            "Do NOT mention diseases or treatments.\n\n"
            f"{text}\n\nExplanation:"
        )

        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content(prompt)
        cleaned_text = re.sub(r'[^a-zA-Z0-9\s.,]', '', response.text)
        return cleaned_text
    except Exception as e:
        print(f"[WARN] Gemini API error: {e}")
        return f"Abnormal values detected: {text}. Please consult a healthcare professional for detailed interpretation."


# -------------------------------
# MAIN
# -------------------------------
async def analyze_report(file: UploadFile):

    ext = file.filename.lower()

    if ext.endswith(".pdf"):
        raw_text = extract_pdf_text(file.file)
        df = detect_tests(raw_text)

    elif ext.endswith(".csv"):
        df = pd.read_csv(file.file)

    elif ext.endswith(".xlsx"):
        df = pd.read_excel(file.file)

    else:
        return {"error": "Unsupported file format"}

    if df.empty:
        return {"error": "Unable to extract any test values."}

    # Clean
    df["test"] = df["test"].astype(str).str.strip().str.replace("\ufeff", "", regex=False)

    # Classify
    df["status"] = df.apply(lambda r: classify(r["value"], r["ref_low"], r["ref_high"]), axis=1)

    abnormal = df[df["status"].isin(["LOW", "HIGH"])]

    summary = f"Total tests: {len(df)}, Abnormal: {len(abnormal)}"

    key_findings = "\n".join(
        f"{r.test}: {r.value} {r.unit} — {r.status} "
        f"(Normal: {r.ref_low}–{r.ref_high})"
        for _, r in abnormal.iterrows()
    ) or "All values are normal."

    # Send to Gemini
    if not abnormal.empty:
        text_for_ai = "\n".join(f"{r.test}: {r.value} ({r.status})" for _, r in abnormal.iterrows())
        explanation = gemini_explain(text_for_ai)
    else:
        explanation = "All values are normal."

    return {
        "summary": summary,
        "keyFindings": key_findings,
        "recommendations": explanation,
    }
