<p align="center">
  <img src="https://img.shields.io/badge/React-19.1-61DAFB?style=for-the-badge&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white" alt="FastAPI" />
  <img src="https://img.shields.io/badge/TensorFlow-2.x-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
  <img src="https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<h1 align="center">🏥 MEDVERSE AI</h1>
<h3 align="center">Empowering Healthcare with Explainable AI</h3>

<p align="center">
  A full-stack AI-powered healthcare platform that provides intelligent diagnostics, lab report analysis, X-ray detection, and smart doctor scheduling — all with explainable, transparent AI.
</p>

---

## ✨ Features

| Feature | Description | Tech |
|---------|-------------|------|
| 🩺 **Symptom Checker** | AI-powered symptom analysis using Bio-ClinicalBERT + XGBoost ensemble | NLP + ML |
| 📊 **Lab Report Analyzer** | Upload PDF/CSV lab reports for instant AI-driven interpretation | Gemini AI + PDF Parsing |
| 🫁 **X-Ray Analyzer** | CNN-based pneumonia detection from chest X-ray images | TensorFlow + CNN |
| 📅 **DocThink Scheduler** | Rule-based doctor recommendation + appointment booking with priority triage | FastAPI + SQLite |
| 🎨 **Premium UI** | Glassmorphism design with smooth animations and responsive layout | React + Tailwind + Framer Motion |

---

## 🏗️ Architecture

```
MEDVERSE-AI/
├── Backend/                      # FastAPI Backend Server
│   ├── app.py                    # Main server — all API routes
│   ├── requirements.txt          # Python dependencies
│   ├── features/
│   │   ├── symptom_checker/
│   │   │   └── symptom.py        # Bio-ClinicalBERT + XGBoost symptom analysis
│   │   ├── lab_report_analyzer/
│   │   │   └── report.py         # Gemini-powered lab report parsing
│   │   ├── xray_analyzer/
│   │   │   └── xray.py           # CNN pneumonia detection
│   │   └── scheduler/
│   │       └── scheduler.py      # Rule-based doctor recommendation engine
│   ├── models/                   # ML model files (not tracked in git)
│   │   ├── final_disease_model.pkl
│   │   └── pneumonia_cnn_model.h5
│   └── utils/
│       └── preprocess.py         # Data preprocessing utilities
│
├── Frontend-Medverse-ai/         # React + Vite Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── MainPage.jsx      # Landing page
│   │   │   ├── Dashboard.jsx     # Feature dashboard
│   │   │   ├── SymptomChecker.jsx
│   │   │   ├── ReportAnalyzer.jsx
│   │   │   ├── XRayAnalyzer.jsx
│   │   │   └── Scheduler.jsx     # DocThink appointment scheduler
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DoctorCard.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ResultCard.jsx
│   │   │   └── UploadCard.jsx
│   │   └── services/
│   │       └── api.js            # Centralized API client (Axios)
│   └── package.json
│
├── .gitignore
├── LICENSE                       # MIT License
└── README.md
```

---

## 🧠 AI Models

### 1. Symptom Checker
- **Architecture**: Bio-ClinicalBERT (emilyalsentzer) → feature extraction → XGBoost classifier
- **Input**: Natural language symptom description
- **Output**: Top 5 predicted diseases with confidence scores + recommended specializations

### 2. Lab Report Analyzer
- **Architecture**: Google Gemini 2.5 Flash (multimodal)
- **Input**: PDF / CSV lab reports
- **Output**: Structured analysis with findings, abnormal values, and recommendations

### 3. X-Ray Analyzer
- **Architecture**: Custom CNN trained on chest X-ray dataset
- **Input**: Chest X-ray image (JPEG/PNG)
- **Output**: Normal / Pneumonia classification with confidence score

### 4. DocThink Scheduler
- **Architecture**: Rule-based engine (zero API cost)
- **Symptom Mapping**: 80+ symptom keywords → 10 specializations
- **Priority Triage**: HIGH / MEDIUM / LOW based on symptom severity
- **Conflict Detection**: Prevents double-booking via SQLite
- **Doctor Database**: 24+ doctors across 10 specializations

---

## 🚀 Quick Start

### Prerequisites
- **Python** 3.10+ 
- **Node.js** 18+ & npm
- **Google Gemini API Key** (free at [aistudio.google.com/apikey](https://aistudio.google.com/apikey))

### 1. Clone the Repository

```bash
git clone https://github.com/akshatjain306/MEDVERSE-AI.git
cd MEDVERSE-AI
```

### 2. Backend Setup

```bash
cd Backend

# Create virtual environment
python -m venv .venv

# Activate (Windows)
.venv\Scripts\activate
# Activate (macOS/Linux)
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY

# Download ML models (see Models section below)

# Start the server
python app.py
```

> Backend runs at **http://localhost:5000**

### 3. Frontend Setup

```bash
cd Frontend-Medverse-ai

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env if needed

# Start dev server
npm run dev
```

> Frontend runs at **http://localhost:5173**

---

## 📦 ML Model Setup

The ML models are too large for Git. Download and place them manually:

| Model | Size | Location | Download |
|-------|------|----------|----------|
| `final_disease_model.pkl` | ~414 MB | `Backend/models/` | [Contact maintainer] |
| `pneumonia_cnn_model.h5` | ~59 MB | `Backend/models/` | [Contact maintainer] |

> ⚠️ The app will work partially without models — the Scheduler and Lab Report features don't need them.

---

## 🔌 API Reference

### Health Check
```
GET /
→ { "success": true, "message": "Medverse API is running" }
```

### Symptom Checker
```
POST /api/symptom/check
Body: { "text": "I have severe headache and fever" }
→ { "success": true, "data": { "predictions": [...], "specializations": [...] } }
```

### Lab Report Analyzer
```
POST /api/lab/report
Body: FormData with "file" (PDF/CSV)
→ { "success": true, "data": { "analysis": "..." } }
```

### X-Ray Analyzer
```
POST /api/xray/analyze
Body: FormData with "file" (image)
→ { "success": true, "data": { "prediction": "Pneumonia", "confidence": 0.94 } }
```

### Scheduler — Recommend Doctors
```
POST /api/scheduler/recommend
Body: { "symptoms": "chest pain and shortness of breath" }
→ { "success": true, "data": { "doctors": [...], "priority": { "level": "HIGH" } } }
```

### Scheduler — Book Appointment
```
POST /api/scheduler/book
Body: {
  "patient_name": "John Doe",
  "doctor_name": "Dr. Anil Kapoor",
  "specialization": "Cardiologist",
  "date": "2026-04-14",
  "time_slot": "09:00 AM",
  "mode": "Online",
  "symptoms": "chest pain",
  "fee": "1000"
}
→ { "success": true, "data": { "appointment": { "id": "A1B2C3D4", ... } } }
```

### Scheduler — List & Cancel Appointments
```
GET  /api/scheduler/appointments
→ { "success": true, "data": [...] }

DELETE /api/scheduler/appointments/{id}
→ { "success": true, "data": { "cancelled": {...} } }
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Framer Motion, Axios |
| **Backend** | Python, FastAPI, Uvicorn |
| **AI/ML** | TensorFlow, PyTorch, Transformers (HuggingFace), XGBoost, scikit-learn |
| **NLP** | Bio-ClinicalBERT (clinical NLP model) |
| **Vision** | Custom CNN (pneumonia detection) |
| **Generative AI** | Google Gemini 2.5 Flash |
| **Database** | SQLite (appointments) |
| **Charts** | Chart.js + react-chartjs-2 |

---

## 🔐 Environment Variables

### Backend (`Backend/.env`)
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`Frontend-Medverse-ai/.env`)
```env
VITE_API_BASE_URL=http://127.0.0.1:5000
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👥 Contributors

- **Akshat Jain** — [@akshatjain306](https://github.com/akshatjain306)
- **Lokesh Kumar** — [@lokesh0802](https://github.com/lokesh0802)

---

## 🤝 Contributing

Contributions are welcome! Please read the [CONTRIBUTING.md](CONTRIBUTING.md) guide first.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

<p align="center">
  Built with ❤️ by the Medverse AI Team
</p>