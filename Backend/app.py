import uvicorn
import os
import shutil
import asyncio
from typing import Optional
from datetime import date
from fastapi import FastAPI, File, UploadFile, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import modular feature logic
from features.symptom_checker.symptom import analyze_symptoms
from features.lab_report_analyzer.report import analyze_report
from features.xray_analyzer.xray import predict_xray
from features.scheduler.scheduler import (
    recommend_doctors,
    book_appointment,
    list_appointments,
    get_available_slots,
    cancel_appointment,
    ws_manager,
)

app = FastAPI(title="Medverse AI Backend")

# ==========================================================
# CORS CONFIG
# ==========================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # allow frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==========================================================
# MODELS
# ==========================================================
class SymptomRequest(BaseModel):
    text: str


class SchedulerRecommendRequest(BaseModel):
    symptoms: str


class BookAppointmentRequest(BaseModel):
    patient_name: str
    doctor_name: str
    specialization: str
    date: str
    time_slot: str
    mode: str
    symptoms: Optional[str] = ""
    fee: Optional[str] = ""


# ==========================================================
# ROOT ROUTE
# ==========================================================
@app.get("/")
def home():
    return {
        "success": True,
        "message": "Medverse API is running",
        "websocket": "ws://localhost:5000/ws/scheduler",
        "connected_clients": ws_manager.client_count,
    }


# ==========================================================
# SYMPTOM CHECKER API
# ==========================================================
@app.post("/api/symptom/check")
def check(req: SymptomRequest):
    try:
        result = analyze_symptoms(req.text)
        return {"success": True, "data": result}
    except Exception as e:
        error_message = str(e) if str(e) else "An unknown error occurred during symptom analysis."
        return {"success": False, "error": error_message}


# ==========================================================
# LAB REPORT ANALYSIS API
# ==========================================================
@app.post("/api/lab/report")
async def analyze_lab_report(file: UploadFile = File(...)):
    try:
        result = await analyze_report(file)
        return {
            "success": True,
            "data": result
        }
    except Exception as e:
        return {"success": False, "error": str(e)}


# ==========================================================
# X-RAY ANALYSIS API
# ==========================================================
@app.post("/api/xray/analyze")
async def analyze_xray(file: UploadFile = File(...)):
    temp_path = None

    try:
        temp_dir = "temp"
        os.makedirs(temp_dir, exist_ok=True)

        temp_path = os.path.join(temp_dir, file.filename)

        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        result = predict_xray(temp_path)

        return {
            "success": True,
            "data": result
        }

    except Exception as e:
        return {"success": False, "error": str(e)}

    finally:
        if temp_path and os.path.exists(temp_path):
            os.remove(temp_path)


# ==========================================================
# DOCTHINK SCHEDULER APIs
# ==========================================================
@app.post("/api/scheduler/recommend")
def scheduler_recommend(req: SchedulerRecommendRequest):
    try:
        result = recommend_doctors(req.symptoms)
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.post("/api/scheduler/book")
async def scheduler_book(req: BookAppointmentRequest):
    try:
        result = book_appointment(
            patient_name=req.patient_name,
            doctor_name=req.doctor_name,
            specialization=req.specialization,
            appt_date=req.date,
            time_slot=req.time_slot,
            mode=req.mode,
            symptoms=req.symptoms,
            fee=req.fee,
        )
        if "error" in result:
            return {"success": False, "error": result["error"]}

        # ✅ BROADCAST: Notify all connected clients about the new booking
        await ws_manager.broadcast({
            "type": "appointment_booked",
            "appointment": result["appointment"],
            "booked_slot": {
                "doctor_name": req.doctor_name,
                "date": req.date,
                "time_slot": req.time_slot,
            },
        })

        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/scheduler/appointments")
def scheduler_list():
    try:
        appts = list_appointments()
        return {"success": True, "data": appts}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.get("/api/scheduler/slots/{doctor_name}")
def scheduler_slots(doctor_name: str, appt_date: Optional[str] = None):
    try:
        result = get_available_slots(doctor_name, appt_date)
        if "error" in result:
            return {"success": False, "error": result["error"]}
        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


@app.delete("/api/scheduler/appointments/{appt_id}")
async def scheduler_cancel(appt_id: str):
    try:
        result = cancel_appointment(appt_id)
        if "error" in result:
            return {"success": False, "error": result["error"]}

        # ✅ BROADCAST: Notify all connected clients about the cancellation
        await ws_manager.broadcast({
            "type": "appointment_cancelled",
            "cancelled": result["cancelled"],
            "freed_slot": {
                "doctor_name": result["cancelled"]["doctor_name"],
                "date": result["cancelled"]["date"],
                "time_slot": result["cancelled"]["time_slot"],
            },
        })

        return {"success": True, "data": result}
    except Exception as e:
        return {"success": False, "error": str(e)}


# ==========================================================
# WEBSOCKET ENDPOINT — Real-Time Scheduler Updates
# ==========================================================
@app.websocket("/ws/scheduler")
async def websocket_scheduler(websocket: WebSocket):
    """
    WebSocket endpoint for real-time scheduler updates.
    
    Clients connect here to receive live notifications:
    - appointment_booked: when any user books an appointment
    - appointment_cancelled: when any user cancels an appointment
    - initial_state: sent on connect with all current appointments
    - pong: heartbeat response
    """
    await ws_manager.connect(websocket)

    try:
        while True:
            # Listen for client messages (heartbeat pings, etc.)
            data = await websocket.receive_text()

            # Handle ping/pong heartbeat
            if data == "ping":
                await websocket.send_json({
                    "type": "pong",
                    "connected_clients": ws_manager.client_count,
                })
            elif data == "get_state":
                # Client requests current state refresh
                await websocket.send_json({
                    "type": "state_refresh",
                    "appointments": list_appointments(),
                    "connected_clients": ws_manager.client_count,
                })

    except WebSocketDisconnect:
        await ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"[WS] Error: {e}")
        await ws_manager.disconnect(websocket)


# ==========================================================
# RUN SERVER (DEV MODE)
# ==========================================================
if __name__ == "__main__":
    print("[OK] Backend Running on port 5000")
    print("[OK] WebSocket available at ws://localhost:5000/ws/scheduler")
    uvicorn.run("app:app", host="0.0.0.0", port=5000, reload=True)
