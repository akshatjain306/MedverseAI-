// import axios from "axios";

// // -------------------------------------------
// // BACKEND URL
// // -------------------------------------------
// const LOCAL = "http://127.0.0.1:5000";
// const PROD = "https://medverse-backend.vercel.app"; 

// const API_BASE =
//   window.location.hostname === "localhost" ||
//   window.location.hostname === "127.0.0.1"
//     ? LOCAL
//     : PROD;

// // --------------------------------------------------
// // SYMPTOM CHECKER API
// // --------------------------------------------------
// export const symptomCheck = async (data) => {
//   try {
//     const res = await axios.post(`${API_BASE}/api/symptom/check`, data, {
//       headers: { "Content-Type": "application/json" },
//     });

//     return res.data; // returns {success, data, error}
//   } catch (err) {
//     console.error("API ERROR:", err);
//     throw err;
//   }
// };

// // --------------------------------------------------
// // LAB REPORT ANALYSIS API (PDF/CSV/Excel)
// // --------------------------------------------------
// export const uploadLabReport = async (file) => {
//   try {
//     const form = new FormData();
//     form.append("file", file);

//     const res = await axios.post(`${API_BASE}/api/lab/report`, form, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data;
//   } catch (err) {
//     console.error("API ERROR (LAB REPORT):", err);
//     throw err;
//   }
// };

// // --------------------------------------------------
// // X-RAY ANALYSIS API
// // --------------------------------------------------
// export const analyzeXray = async (formData) => {
//   try {
//     const res = await axios.post(`${API_BASE}/api/xray/analyze`, formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     return res.data;
//   } catch (err) {
//     console.error("API ERROR (X-RAY):", err);
//     throw err;
//   }
// };

// export default {
//   symptomCheck,
//   uploadLabReport,
//   analyzeXray,
// };
import axios from "axios";

// =====================================================
// BASE URL CONFIG (reads from .env)
// =====================================================
const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";

// =====================================================
// CREATE AXIOS INSTANCE
// =====================================================
const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000, // 120s — ML models + Gemini AI take time
});

// Normalize backend errors
const handleError = (err, source = "") => {
  console.error(`API ERROR (${source}):`, err);

  return {
    success: false,
    error:
      err.response?.data?.error ||
      err.message ||
      "Something went wrong. Try again.",
    data: null,
  };
};

// =====================================================
// SYMPTOM CHECK API
// =====================================================
export const symptomCheck = async (data) => {
  try {
    const res = await api.post("/api/symptom/check", data, {
      headers: { "Content-Type": "application/json" },
    });

    return res.data; // { success, data }
  } catch (err) {
    return handleError(err, "SYMPTOM CHECK");
  }
};

// =====================================================
// LAB REPORT UPLOAD API
// =====================================================
export const uploadLabReport = async (file) => {
  try {
    const form = new FormData();
    form.append("file", file);

    const res = await api.post("/api/lab/report", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    return handleError(err, "LAB REPORT");
  }
};

// =====================================================
// X-RAY ANALYSIS API
// =====================================================
export const analyzeXray = async (fileFormData) => {
  try {
    const res = await api.post("/api/xray/analyze", fileFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (err) {
    return handleError(err, "X-RAY");
  }
};

// =====================================================
// SCHEDULER APIs (rule-based backend — no Gemini needed)
// =====================================================
export const recommendDoctors = async (symptoms) => {
  try {
    const res = await api.post("/api/scheduler/recommend", { symptoms });
    return res.data; // { success, data: { doctors, priority, ... } }
  } catch (err) {
    return handleError(err, "SCHEDULER RECOMMEND");
  }
};

export const bookAppointment = async (data) => {
  try {
    const res = await api.post("/api/scheduler/book", data);
    return res.data; // { success, data: { appointment } }
  } catch (err) {
    return handleError(err, "SCHEDULER BOOK");
  }
};

export const listAppointments = async () => {
  try {
    const res = await api.get("/api/scheduler/appointments");
    return res.data;
  } catch (err) {
    return handleError(err, "SCHEDULER LIST");
  }
};

export const cancelAppointment = async (apptId) => {
  try {
    const res = await api.delete(`/api/scheduler/appointments/${apptId}`);
    return res.data;
  } catch (err) {
    return handleError(err, "SCHEDULER CANCEL");
  }
};

// Default export for cleaner imports
export default {
  symptomCheck,
  uploadLabReport,
  analyzeXray,
  recommendDoctors,
  bookAppointment,
  listAppointments,
  cancelAppointment,
};
