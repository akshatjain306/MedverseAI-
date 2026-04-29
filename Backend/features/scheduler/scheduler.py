"""
DocThink — AI Healthcare Scheduler Backend
Rule-based doctor recommendation + appointment management.
Zero external API usage — all logic is local.
Real-time WebSocket broadcast for live updates.
"""

import os
import json
import sqlite3
import uuid
import asyncio
import threading
from datetime import datetime, date
from fastapi import WebSocket, WebSocketDisconnect

# =========================================================
# SYMPTOM → SPECIALIZATION MAPPING (Rule-Based)
# =========================================================
SYMPTOM_SPECIALIZATION_MAP = {
    # Neurologist
    "headache": "Neurologist",
    "migraine": "Neurologist",
    "dizziness": "Neurologist",
    "seizure": "Neurologist",
    "numbness": "Neurologist",
    "tingling": "Neurologist",
    "memory loss": "Neurologist",
    "confusion": "Neurologist",
    "fainting": "Neurologist",

    # Cardiologist
    "chest pain": "Cardiologist",
    "heart palpitation": "Cardiologist",
    "palpitations": "Cardiologist",
    "high blood pressure": "Cardiologist",
    "shortness of breath": "Cardiologist",
    "irregular heartbeat": "Cardiologist",
    "swollen legs": "Cardiologist",

    # Pulmonologist
    "cough": "Pulmonologist",
    "wheezing": "Pulmonologist",
    "breathing difficulty": "Pulmonologist",
    "asthma": "Pulmonologist",
    "chronic cough": "Pulmonologist",
    "blood in sputum": "Pulmonologist",

    # Gastroenterologist
    "stomach pain": "Gastroenterologist",
    "abdominal pain": "Gastroenterologist",
    "nausea": "Gastroenterologist",
    "vomiting": "Gastroenterologist",
    "diarrhea": "Gastroenterologist",
    "constipation": "Gastroenterologist",
    "bloating": "Gastroenterologist",
    "acidity": "Gastroenterologist",
    "acid reflux": "Gastroenterologist",
    "indigestion": "Gastroenterologist",

    # Dermatologist
    "rash": "Dermatologist",
    "itching": "Dermatologist",
    "skin irritation": "Dermatologist",
    "acne": "Dermatologist",
    "eczema": "Dermatologist",
    "hair loss": "Dermatologist",
    "skin lesion": "Dermatologist",

    # Orthopedist
    "joint pain": "Orthopedist",
    "back pain": "Orthopedist",
    "knee pain": "Orthopedist",
    "fracture": "Orthopedist",
    "muscle pain": "Orthopedist",
    "sprain": "Orthopedist",
    "swollen joints": "Orthopedist",
    "neck pain": "Orthopedist",
    "shoulder pain": "Orthopedist",

    # ENT Specialist
    "ear pain": "ENT Specialist",
    "sore throat": "ENT Specialist",
    "hearing loss": "ENT Specialist",
    "nasal congestion": "ENT Specialist",
    "sinus": "ENT Specialist",
    "snoring": "ENT Specialist",
    "tonsillitis": "ENT Specialist",
    "runny nose": "ENT Specialist",

    # Ophthalmologist
    "eye pain": "Ophthalmologist",
    "blurry vision": "Ophthalmologist",
    "red eyes": "Ophthalmologist",
    "eye irritation": "Ophthalmologist",
    "watery eyes": "Ophthalmologist",

    # Endocrinologist
    "diabetes": "Endocrinologist",
    "thyroid": "Endocrinologist",
    "weight gain": "Endocrinologist",
    "weight loss": "Endocrinologist",
    "hormonal imbalance": "Endocrinologist",
    "excessive thirst": "Endocrinologist",
    "frequent urination": "Endocrinologist",

    # Psychiatrist
    "anxiety": "Psychiatrist",
    "depression": "Psychiatrist",
    "insomnia": "Psychiatrist",
    "stress": "Psychiatrist",
    "panic attack": "Psychiatrist",
    "mood swings": "Psychiatrist",

    # General Physician (common/mild symptoms)
    "fever": "General Physician",
    "cold": "General Physician",
    "fatigue": "General Physician",
    "weakness": "General Physician",
    "body ache": "General Physician",
    "flu": "General Physician",
    "chills": "General Physician",
    "sore body": "General Physician",
    "malaise": "General Physician",
    "loss of appetite": "General Physician",
}

# =========================================================
# PRIORITY SCORING (Rule-Based)
# =========================================================
HIGH_PRIORITY_KEYWORDS = [
    "chest pain", "breathing difficulty", "shortness of breath",
    "seizure", "fainting", "blood in sputum", "severe bleeding",
    "heart palpitation", "irregular heartbeat", "unconscious",
    "stroke", "paralysis", "severe pain",
]

MEDIUM_PRIORITY_KEYWORDS = [
    "fever", "vomiting", "diarrhea", "persistent pain", "high blood pressure",
    "abdominal pain", "stomach pain", "fracture", "swollen",
    "nausea", "migraine", "blood", "infection",
]

# Everything else is LOW priority


def compute_priority(symptoms_text: str) -> dict:
    """Compute priority score from symptom text. Returns priority level and score."""
    text = symptoms_text.lower()
    score = 0

    for keyword in HIGH_PRIORITY_KEYWORDS:
        if keyword in text:
            score += 30

    for keyword in MEDIUM_PRIORITY_KEYWORDS:
        if keyword in text:
            score += 15

    if score >= 30:
        level = "HIGH"
    elif score >= 15:
        level = "MEDIUM"
    else:
        level = "LOW"
        score = max(score, 5)  # Minimum score

    return {"level": level, "score": min(score, 100)}


# =========================================================
# DOCTOR DATABASE (In-Memory)
# =========================================================
DOCTORS_DB = [
    # --- General Physician ---
    {"name": "Dr. Arjun Mehta", "specialization": "General Physician", "fee": "400", "address": "Apollo Clinic, MG Road, Bengaluru", "rating": 4.8, "availableSlots": ["09:00 AM", "10:00 AM", "11:30 AM", "02:00 PM", "04:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Priya Sharma", "specialization": "General Physician", "fee": "350", "address": "Fortis Health Centre, Sector 44, Gurugram", "rating": 4.6, "availableSlots": ["08:30 AM", "10:30 AM", "01:00 PM", "03:00 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Rajesh Kumar", "specialization": "General Physician", "fee": "300", "address": "Max Hospital, Saket, New Delhi", "rating": 4.5, "availableSlots": ["09:30 AM", "11:00 AM", "12:30 PM", "03:30 PM"], "mode": ["Online", "Offline"]},

    # --- Neurologist ---
    {"name": "Dr. Sneha Iyer", "specialization": "Neurologist", "fee": "800", "address": "NIMHANS, Hosur Road, Bengaluru", "rating": 4.9, "availableSlots": ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Vikram Desai", "specialization": "Neurologist", "fee": "750", "address": "AIIMS, Ansari Nagar, New Delhi", "rating": 4.7, "availableSlots": ["09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Kavita Nair", "specialization": "Neurologist", "fee": "700", "address": "Kokilaben Hospital, Andheri, Mumbai", "rating": 4.6, "availableSlots": ["08:30 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:30 PM"], "mode": ["Online", "Offline"]},

    # --- Cardiologist ---
    {"name": "Dr. Anil Kapoor", "specialization": "Cardiologist", "fee": "1000", "address": "Medanta Hospital, Sector 38, Gurugram", "rating": 4.9, "availableSlots": ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Sunita Rao", "specialization": "Cardiologist", "fee": "900", "address": "Narayana Health, Bommasandra, Bengaluru", "rating": 4.8, "availableSlots": ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "05:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Manoj Tiwari", "specialization": "Cardiologist", "fee": "850", "address": "Fortis Escorts, Okhla Road, New Delhi", "rating": 4.7, "availableSlots": ["08:00 AM", "10:00 AM", "12:00 PM", "03:00 PM"], "mode": ["Offline"]},

    # --- Pulmonologist ---
    {"name": "Dr. Ritu Agarwal", "specialization": "Pulmonologist", "fee": "700", "address": "Sir Ganga Ram Hospital, Rajinder Nagar, New Delhi", "rating": 4.7, "availableSlots": ["09:30 AM", "11:00 AM", "01:30 PM", "03:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Deepak Joshi", "specialization": "Pulmonologist", "fee": "650", "address": "Manipal Hospital, HAL Road, Bengaluru", "rating": 4.5, "availableSlots": ["10:00 AM", "12:00 PM", "02:30 PM", "04:30 PM"], "mode": ["Online", "Offline"]},

    # --- Gastroenterologist ---
    {"name": "Dr. Suresh Babu", "specialization": "Gastroenterologist", "fee": "750", "address": "Columbia Asia, Whitefield, Bengaluru", "rating": 4.6, "availableSlots": ["09:00 AM", "11:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Pooja Malhotra", "specialization": "Gastroenterologist", "fee": "800", "address": "BLK Super Speciality, Pusa Road, New Delhi", "rating": 4.8, "availableSlots": ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"], "mode": ["Online", "Offline"]},

    # --- Dermatologist ---
    {"name": "Dr. Ananya Reddy", "specialization": "Dermatologist", "fee": "600", "address": "Kaya Skin Clinic, Koramangala, Bengaluru", "rating": 4.7, "availableSlots": ["09:30 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Faizan Khan", "specialization": "Dermatologist", "fee": "550", "address": "VLCC Derma, Connaught Place, New Delhi", "rating": 4.5, "availableSlots": ["10:00 AM", "12:00 PM", "02:30 PM", "04:30 PM"], "mode": ["Online", "Offline"]},

    # --- Orthopedist ---
    {"name": "Dr. Rahul Verma", "specialization": "Orthopedist", "fee": "700", "address": "Indian Spinal Injuries Centre, Vasant Kunj, New Delhi", "rating": 4.8, "availableSlots": ["09:00 AM", "10:30 AM", "01:00 PM", "03:00 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Meera Patel", "specialization": "Orthopedist", "fee": "650", "address": "Sparsh Hospital, Infantry Road, Bengaluru", "rating": 4.6, "availableSlots": ["08:30 AM", "10:00 AM", "12:00 PM", "02:30 PM"], "mode": ["Online", "Offline"]},

    # --- ENT Specialist ---
    {"name": "Dr. Siddharth Saxena", "specialization": "ENT Specialist", "fee": "550", "address": "Moolchand Hospital, Lajpat Nagar, New Delhi", "rating": 4.5, "availableSlots": ["09:00 AM", "11:00 AM", "01:30 PM", "03:30 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Latha Krishnan", "specialization": "ENT Specialist", "fee": "500", "address": "Sakra World Hospital, Marathahalli, Bengaluru", "rating": 4.4, "availableSlots": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"], "mode": ["Online", "Offline"]},

    # --- Ophthalmologist ---
    {"name": "Dr. Neha Gupta", "specialization": "Ophthalmologist", "fee": "600", "address": "Shroff Eye Centre, Kailash Colony, New Delhi", "rating": 4.7, "availableSlots": ["09:00 AM", "10:30 AM", "12:00 PM", "02:30 PM", "04:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Arvind Menon", "specialization": "Ophthalmologist", "fee": "550", "address": "Narayana Nethralaya, Rajajinagar, Bengaluru", "rating": 4.8, "availableSlots": ["10:00 AM", "11:30 AM", "01:00 PM", "03:00 PM"], "mode": ["Online", "Offline"]},

    # --- Endocrinologist ---
    {"name": "Dr. Pallavi Das", "specialization": "Endocrinologist", "fee": "750", "address": "Fortis Hospital, Bannerghatta Road, Bengaluru", "rating": 4.6, "availableSlots": ["09:30 AM", "11:00 AM", "01:30 PM", "03:30 PM"], "mode": ["Online", "Offline"]},
    {"name": "Dr. Akash Sinha", "specialization": "Endocrinologist", "fee": "800", "address": "Max Super Speciality, Vaishali, Ghaziabad", "rating": 4.7, "availableSlots": ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM", "05:30 PM"], "mode": ["Online", "Offline"]},

    # --- Psychiatrist ---
    {"name": "Dr. Tara Bhat", "specialization": "Psychiatrist", "fee": "900", "address": "Cadabams Hospital, Ambalipura, Bengaluru", "rating": 4.8, "availableSlots": ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM"], "mode": ["Online"]},
    {"name": "Dr. Nikhil Chopra", "specialization": "Psychiatrist", "fee": "850", "address": "Institute of Human Behaviour, Mandir Marg, New Delhi", "rating": 4.6, "availableSlots": ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"], "mode": ["Online", "Offline"]},
]


# =========================================================
# SQLite DATABASE SETUP
# =========================================================
DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "scheduler.db")
DB_PATH = os.path.abspath(DB_PATH)


def init_db():
    """Initialize SQLite database with appointments table."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            id TEXT PRIMARY KEY,
            patient_name TEXT NOT NULL,
            doctor_name TEXT NOT NULL,
            specialization TEXT NOT NULL,
            date TEXT NOT NULL,
            time_slot TEXT NOT NULL,
            mode TEXT NOT NULL,
            symptoms TEXT,
            priority_level TEXT DEFAULT 'LOW',
            priority_score INTEGER DEFAULT 5,
            fee TEXT,
            status TEXT DEFAULT 'confirmed',
            created_at TEXT NOT NULL
        )
    """)
    conn.commit()
    conn.close()
    print("[OK] Scheduler DB initialized")


# Initialize on module load
init_db()

# In-memory appointment cache (synced with SQLite)
_appointments_cache: dict = {}

# Thread lock for concurrency-safe booking (prevents race conditions)
_booking_lock = threading.Lock()


def _load_cache():
    """Load all appointments from SQLite into memory cache."""
    global _appointments_cache
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    rows = conn.execute("SELECT * FROM appointments WHERE status = 'confirmed'").fetchall()
    conn.close()
    _appointments_cache = {row["id"]: dict(row) for row in rows}


# Load cache on startup
_load_cache()


# =========================================================
# WEBSOCKET CONNECTION MANAGER (Real-Time)
# =========================================================
class ConnectionManager:
    """Manages active WebSocket connections for real-time scheduler updates."""

    def __init__(self):
        self.active_connections: list[WebSocket] = []
        self._lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket):
        """Accept and register a new WebSocket client."""
        await websocket.accept()
        async with self._lock:
            self.active_connections.append(websocket)
        count = len(self.active_connections)
        print(f"[WS] Client connected. Total: {count}")
        # Send initial state to the newly connected client
        await self._send_initial_state(websocket)

    async def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket client on disconnect."""
        async with self._lock:
            if websocket in self.active_connections:
                self.active_connections.remove(websocket)
        count = len(self.active_connections)
        print(f"[WS] Client disconnected. Total: {count}")

    async def _send_initial_state(self, websocket: WebSocket):
        """Send the current appointment state to a newly connected client."""
        try:
            state = {
                "type": "initial_state",
                "appointments": list_appointments(),
                "connected_clients": len(self.active_connections),
            }
            await websocket.send_json(state)
        except Exception as e:
            print(f"[WS] Error sending initial state: {e}")

    async def broadcast(self, message: dict):
        """Send a message to ALL connected WebSocket clients."""
        message["connected_clients"] = len(self.active_connections)
        message["timestamp"] = datetime.now().isoformat()
        dead_connections = []

        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                dead_connections.append(connection)

        # Clean up dead connections
        if dead_connections:
            async with self._lock:
                for conn in dead_connections:
                    if conn in self.active_connections:
                        self.active_connections.remove(conn)
            print(f"[WS] Cleaned {len(dead_connections)} dead connection(s)")

    @property
    def client_count(self) -> int:
        return len(self.active_connections)


# Global connection manager instance
ws_manager = ConnectionManager()


# =========================================================
# CORE FUNCTIONS
# =========================================================

def match_specializations(symptoms_text: str) -> list[str]:
    """Match symptom keywords to specializations. Returns sorted list by frequency."""
    text = symptoms_text.lower()
    spec_counts: dict[str, int] = {}

    for keyword, spec in SYMPTOM_SPECIALIZATION_MAP.items():
        if keyword in text:
            spec_counts[spec] = spec_counts.get(spec, 0) + 1

    if not spec_counts:
        return ["General Physician"]

    # Sort by match count (most relevant first)
    sorted_specs = sorted(spec_counts.items(), key=lambda x: x[1], reverse=True)
    return [spec for spec, _ in sorted_specs]


def recommend_doctors(symptoms_text: str) -> dict:
    """
    Main recommendation function.
    Takes symptoms text → returns doctors + priority info.
    """
    specializations = match_specializations(symptoms_text)
    priority = compute_priority(symptoms_text)

    # Collect doctors matching the specializations
    matched_doctors = []
    for spec in specializations:
        for doc in DOCTORS_DB:
            if doc["specialization"] == spec and doc not in matched_doctors:
                matched_doctors.append(doc)

    # If we have fewer than 3, add General Physicians as fallback
    if len(matched_doctors) < 3:
        for doc in DOCTORS_DB:
            if doc["specialization"] == "General Physician" and doc not in matched_doctors:
                matched_doctors.append(doc)
            if len(matched_doctors) >= 3:
                break

    # Sort by rating (best first) and take top 3
    matched_doctors.sort(key=lambda d: d.get("rating", 0), reverse=True)
    top_doctors = matched_doctors[:3]

    # Format for frontend compatibility
    result_doctors = []
    for doc in top_doctors:
        # For high priority, suggest earliest slots first
        slots = list(doc["availableSlots"])
        if priority["level"] == "HIGH":
            # Already sorted earliest first — add a note
            pass

        result_doctors.append({
            "doctor": doc["name"],
            "specialization": doc["specialization"],
            "doctorFee": doc["fee"],
            "clinicAddress": doc["address"],
            "rating": doc.get("rating", 4.5),
            "availableSlots": slots,
            "mode": doc["mode"],
        })

    return {
        "doctors": result_doctors,
        "matched_specializations": specializations[:3],
        "priority": priority,
        "total_matches": len(matched_doctors),
    }


def check_slot_conflict(doctor_name: str, appt_date: str, time_slot: str) -> bool:
    """Check if a slot is already booked for a given doctor on a given date."""
    for appt in _appointments_cache.values():
        if (
            appt["doctor_name"] == doctor_name
            and appt["date"] == appt_date
            and appt["time_slot"] == time_slot
            and appt["status"] == "confirmed"
        ):
            return True
    return False


def get_available_slots(doctor_name: str, appt_date: str = None) -> dict:
    """Get available slots for a doctor, filtering out already-booked ones."""
    if appt_date is None:
        appt_date = date.today().isoformat()

    # Find the doctor
    doctor = None
    for doc in DOCTORS_DB:
        if doc["name"].lower() == doctor_name.lower():
            doctor = doc
            break

    if not doctor:
        return {"error": f"Doctor '{doctor_name}' not found"}

    all_slots = list(doctor["availableSlots"])

    # Filter out booked slots
    booked_slots = set()
    for appt in _appointments_cache.values():
        if (
            appt["doctor_name"] == doctor_name
            and appt["date"] == appt_date
            and appt["status"] == "confirmed"
        ):
            booked_slots.add(appt["time_slot"])

    available = [s for s in all_slots if s not in booked_slots]

    return {
        "doctor": doctor_name,
        "specialization": doctor["specialization"],
        "date": appt_date,
        "all_slots": all_slots,
        "booked_slots": list(booked_slots),
        "available_slots": available,
    }


def book_appointment(
    patient_name: str,
    doctor_name: str,
    specialization: str,
    appt_date: str,
    time_slot: str,
    mode: str,
    symptoms: str = "",
    fee: str = "",
) -> dict:
    """Book an appointment with conflict detection and thread-safe locking."""

    # Validate inputs
    if not patient_name or not patient_name.strip():
        return {"error": "Patient name is required"}
    if not doctor_name or not doctor_name.strip():
        return {"error": "Doctor name is required"}
    if not appt_date or not appt_date.strip():
        return {"error": "Appointment date is required"}
    if not time_slot or not time_slot.strip():
        return {"error": "Time slot is required"}
    if not mode or not mode.strip():
        return {"error": "Consultation mode is required"}

    # Thread-safe booking: acquire lock to prevent race conditions
    with _booking_lock:
        # Check for conflict (inside lock to prevent double-booking)
        if check_slot_conflict(doctor_name, appt_date, time_slot):
            return {
                "error": f"Slot {time_slot} on {appt_date} is already booked for {doctor_name}. Please choose another slot."
            }

        # Compute priority
        priority = compute_priority(symptoms)

        # Generate appointment
        appt_id = str(uuid.uuid4())[:8].upper()
        now = datetime.now().isoformat()

        appointment = {
            "id": appt_id,
            "patient_name": patient_name.strip(),
            "doctor_name": doctor_name.strip(),
            "specialization": specialization,
            "date": appt_date,
            "time_slot": time_slot,
            "mode": mode,
            "symptoms": symptoms,
            "priority_level": priority["level"],
            "priority_score": priority["score"],
            "fee": fee,
            "status": "confirmed",
            "created_at": now,
        }

        # Save to SQLite
        conn = sqlite3.connect(DB_PATH)
        conn.execute(
            """INSERT INTO appointments
               (id, patient_name, doctor_name, specialization, date, time_slot, mode,
                symptoms, priority_level, priority_score, fee, status, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
            (
                appt_id, appointment["patient_name"], appointment["doctor_name"],
                appointment["specialization"], appointment["date"], appointment["time_slot"],
                appointment["mode"], appointment["symptoms"], appointment["priority_level"],
                appointment["priority_score"], appointment["fee"], appointment["status"],
                appointment["created_at"],
            ),
        )
        conn.commit()
        conn.close()

        # Update in-memory cache
        _appointments_cache[appt_id] = appointment

    print(f"[OK] Appointment booked: {appt_id} — {patient_name} with {doctor_name}")
    return {"appointment": appointment}


def list_appointments() -> list[dict]:
    """List all confirmed appointments, sorted by date."""
    appts = list(_appointments_cache.values())
    appts.sort(key=lambda a: (a.get("date", ""), a.get("time_slot", "")))
    return appts


def cancel_appointment(appt_id: str) -> dict:
    """Cancel an appointment by ID (thread-safe)."""
    with _booking_lock:
        if appt_id not in _appointments_cache:
            return {"error": f"Appointment '{appt_id}' not found"}

        # Update SQLite
        conn = sqlite3.connect(DB_PATH)
        conn.execute("UPDATE appointments SET status = 'cancelled' WHERE id = ?", (appt_id,))
        conn.commit()
        conn.close()

        # Remove from cache
        cancelled = _appointments_cache.pop(appt_id)
        cancelled["status"] = "cancelled"

    print(f"[OK] Appointment cancelled: {appt_id}")
    return {"cancelled": cancelled}
