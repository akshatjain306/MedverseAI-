import { useState, useCallback, useMemo } from "react";
import Loader from "../components/Loader";
import DoctorCard from "../components/DoctorCard";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiVideo,
  FiMapPin,
  FiCheckCircle,
  FiAlertTriangle,
  FiUser,
  FiWifi,
  FiWifiOff,
  FiUsers,
  FiZap,
  FiClock,
} from "react-icons/fi";
import { recommendDoctors, bookAppointment } from "../services/api";
import useSchedulerSocket from "../hooks/useSchedulerSocket";

export default function Scheduler() {
  const [message, setMessage] = useState("");
  const [patientName, setPatientName] = useState("");
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [doctorList, setDoctorList] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [appointmentConfirmed, setAppointmentConfirmed] = useState(false);
  const [confirmedAppt, setConfirmedAppt] = useState(null);
  const [priority, setPriority] = useState(null);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  // =====================================================
  // REAL-TIME WEBSOCKET CONNECTION
  // =====================================================
  const showToast = useCallback((msg, type = "info") => {
    setToast({ msg, type, id: Date.now() });
    setTimeout(() => setToast(null), 4000);
  }, []);

  const handleRealtimeBooking = useCallback((appointment, bookedSlot) => {
    showToast(
      `🔴 ${appointment.patient_name} booked ${appointment.doctor_name} at ${appointment.time_slot}`,
      "booking"
    );

    // If we're viewing doctor list, update the slot availability live
    setDoctorList((prev) =>
      prev.map((doc) => {
        if (doc.doctor === appointment.doctor_name) {
          return {
            ...doc,
            availableSlots: doc.availableSlots?.filter(
              (s) => s !== appointment.time_slot
            ),
          };
        }
        return doc;
      })
    );

    // If viewing selected doctor, update their slots too
    setSelectedDoctor((prev) => {
      if (prev && prev.doctor === appointment.doctor_name) {
        const updatedSlots = prev.availableSlots?.filter(
          (s) => s !== appointment.time_slot
        );
        // If the slot we selected was just booked by someone else, clear selection
        if (selectedSlot === appointment.time_slot) {
          setSelectedSlot("");
          showToast("⚠️ Your selected slot was just booked by another user!", "warning");
        }
        return { ...prev, availableSlots: updatedSlots };
      }
      return prev;
    });
  }, [showToast, selectedSlot]);

  const handleRealtimeCancellation = useCallback((cancelled, freedSlot) => {
    showToast(
      `🟢 Slot ${cancelled.time_slot} with ${cancelled.doctor_name} is now available!`,
      "cancellation"
    );

    // Re-add the freed slot to the doctor
    setDoctorList((prev) =>
      prev.map((doc) => {
        if (doc.doctor === cancelled.doctor_name) {
          const slots = doc.availableSlots || [];
          if (!slots.includes(cancelled.time_slot)) {
            return { ...doc, availableSlots: [...slots, cancelled.time_slot] };
          }
        }
        return doc;
      })
    );

    setSelectedDoctor((prev) => {
      if (prev && prev.doctor === cancelled.doctor_name) {
        const slots = prev.availableSlots || [];
        if (!slots.includes(cancelled.time_slot)) {
          return { ...prev, availableSlots: [...slots, cancelled.time_slot] };
        }
      }
      return prev;
    });
  }, [showToast]);

  const {
    connected,
    usingPolling,
    clientCount,
    appointments,
    lastEvent,
  } = useSchedulerSocket({
    onBooking: handleRealtimeBooking,
    onCancellation: handleRealtimeCancellation,
  });

  // Compute booked slots from live appointments
  const bookedSlotsMap = useMemo(() => {
    const map = {};
    const today = new Date().toISOString().split("T")[0];
    for (const appt of appointments) {
      if (appt.date === today && appt.status === "confirmed") {
        const key = appt.doctor_name;
        if (!map[key]) map[key] = new Set();
        map[key].add(appt.time_slot);
      }
    }
    return map;
  }, [appointments]);

  // =====================================================
  // HANDLERS
  // =====================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("Please describe your symptoms!");
      return;
    }

    setLoading(true);
    setDoctorList([]);
    setSelectedDoctor(null);
    setAppointmentConfirmed(false);
    setConfirmedAppt(null);
    setPriority(null);
    setError("");

    try {
      const result = await recommendDoctors(message);

      if (!result.success) {
        setError(result.error || "Failed to get recommendations.");
        return;
      }

      // Filter out already-booked slots from the recommended doctors
      const doctors = (result.data.doctors || []).map((doc) => {
        const booked = bookedSlotsMap[doc.doctor];
        if (booked) {
          return {
            ...doc,
            availableSlots: doc.availableSlots?.filter((s) => !booked.has(s)),
          };
        }
        return doc;
      });

      setDoctorList(doctors);
      setPriority(result.data.priority || null);
    } catch (err) {
      console.error(err);
      setError(`An error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectDoctor = (doctor) => {
    // Filter out booked slots when selecting
    const booked = bookedSlotsMap[doctor.doctor];
    const filteredDoc = booked
      ? { ...doctor, availableSlots: doctor.availableSlots?.filter((s) => !booked.has(s)) }
      : doctor;
    setSelectedDoctor(filteredDoc);
    setSelectedMode("");
    setSelectedSlot("");
  };

  const confirmAppointment = async () => {
    if (!selectedMode || !selectedSlot) {
      alert("Please select consultation mode and time slot!");
      return;
    }
    if (!patientName.trim()) {
      alert("Please enter your name!");
      return;
    }

    setBooking(true);

    try {
      const today = new Date().toISOString().split("T")[0];

      const result = await bookAppointment({
        patient_name: patientName.trim(),
        doctor_name: selectedDoctor.doctor,
        specialization: selectedDoctor.specialization,
        date: today,
        time_slot: selectedSlot,
        mode: selectedMode,
        symptoms: message,
        fee: selectedDoctor.doctorFee,
      });

      if (!result.success) {
        alert(result.error || "Failed to book appointment.");
        return;
      }

      setConfirmedAppt(result.data.appointment);
      setAppointmentConfirmed(true);
    } catch (err) {
      console.error(err);
      alert(`Booking failed: ${err.message}`);
    } finally {
      setBooking(false);
    }
  };

  // =====================================================
  // ANIMATION HELPERS
  // =====================================================
  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, delay } },
  });

  const priorityColor = {
    HIGH: "text-red-600 bg-red-50 border-red-200",
    MEDIUM: "text-amber-600 bg-amber-50 border-amber-200",
    LOW: "text-emerald-600 bg-emerald-50 border-emerald-200",
  };

  const toastColors = {
    booking: "bg-blue-600 text-white",
    cancellation: "bg-emerald-600 text-white",
    warning: "bg-amber-500 text-white",
    info: "bg-gray-700 text-white",
  };

  return (
    <div className="relative min-h-screen pt-28 px-6 font-inter text-gray-800 bg-gradient-to-br from-[#E6F3FF] via-white to-[#E0F7FA] antialiased overflow-hidden">
      <div className="pointer-events-none absolute -top-20 -left-20 w-[500px] h-[500px] bg-[#00B8D9]/10 blur-3xl rounded-full" />
      <div className="pointer-events-none absolute bottom-0 -right-20 w-[500px] h-[500px] bg-[#006C8E]/10 blur-3xl rounded-full" />

      {/* ============ REAL-TIME STATUS BAR ============ */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-20 right-6 z-50 flex items-center gap-3"
      >
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium backdrop-blur-xl border shadow-lg transition-all duration-500 ${
          connected
            ? "bg-emerald-50/90 border-emerald-200 text-emerald-700"
            : usingPolling
            ? "bg-amber-50/90 border-amber-200 text-amber-700"
            : "bg-red-50/90 border-red-200 text-red-700"
        }`}>
          {connected ? (
            <>
              <FiZap className="text-emerald-500 animate-pulse" />
              <span>Live</span>
              <span className="text-xs opacity-70">•</span>
              <FiUsers className="text-emerald-500" />
              <span>{clientCount}</span>
            </>
          ) : usingPolling ? (
            <>
              <FiClock className="text-amber-500 animate-spin" />
              <span>Polling</span>
            </>
          ) : (
            <>
              <FiWifiOff className="text-red-500" />
              <span>Connecting...</span>
            </>
          )}
        </div>
      </motion.div>

      {/* ============ REAL-TIME TOAST NOTIFICATIONS ============ */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -40, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: -40, x: "-50%" }}
            transition={{ duration: 0.4 }}
            className={`fixed top-32 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-xl font-medium text-sm flex items-center gap-2 ${toastColors[toast.type] || toastColors.info}`}
          >
            <FiZap className="flex-shrink-0" />
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ HEADER ============ */}
      <motion.header {...fadeUp(0)} className="relative max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-[#00B8D9] to-[#006C8E] bg-clip-text text-transparent leading-tight">
          DocThink — AI Healthcare Scheduler
        </h1>
        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Describe your symptoms, and our AI will recommend the best doctors for you.
          <span className="block text-sm text-[#00B8D9] mt-1 font-medium">
            ⚡ Real-time updates — slots update live across all users
          </span>
        </p>
      </motion.header>

      {/* ============ FORM ============ */}
      <motion.form onSubmit={handleSubmit} {...fadeUp(0.1)} className="relative max-w-5xl mx-auto mb-10 rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
        <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <FiUser className="inline mr-2" />Your Name
              </label>
              <input 
                type="text" 
                placeholder="Enter your full name" 
                value={patientName} 
                onChange={(e) => setPatientName(e.target.value)} 
                className="w-full rounded-2xl p-4 bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/50 placeholder:text-gray-400 shadow-inner" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Describe your symptoms</label>
              <textarea rows="4" placeholder="e.g., Persistent headache, mild fever, dizziness..." value={message} onChange={(e) => setMessage(e.target.value)} className="w-full rounded-2xl p-4 bg-white/70 border border-white/50 focus:outline-none focus:ring-2 focus:ring-[#00B8D9]/50 placeholder:text-gray-400 shadow-inner" />
            </div>
          </div>

        <div className="mt-8 flex justify-center">
          <motion.button whileTap={{ scale: 0.97 }} disabled={loading} type="submit" className={`inline-flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${loading ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] hover:shadow-lg hover:-translate-y-0.5"}`}>
            {loading ? "Analyzing..." : "Find Doctors"}
          </motion.button>
        </div>
      </motion.form>

      {loading && <Loader />}

      {error && (
        <motion.div {...fadeUp(0.1)} className="max-w-5xl mx-auto mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 flex items-center gap-3">
          <FiAlertTriangle className="text-xl flex-shrink-0" />
          <span>{error}</span>
        </motion.div>
      )}

      {priority && !appointmentConfirmed && (
        <motion.div {...fadeUp(0.15)} className={`max-w-5xl mx-auto mb-6 p-4 rounded-2xl border flex items-center gap-3 ${priorityColor[priority.level] || priorityColor.LOW}`}>
          <FiAlertTriangle className="text-xl flex-shrink-0" />
          <span>
            <strong>Priority: {priority.level}</strong> — 
            {priority.level === "HIGH" && " Urgent symptoms detected. Earliest available slots are recommended."}
            {priority.level === "MEDIUM" && " Moderate symptoms detected. Please book soon."}
            {priority.level === "LOW" && " Mild symptoms. You can schedule at your convenience."}
          </span>
        </motion.div>
      )}

      {/* ============ DOCTOR LIST ============ */}
      {doctorList.length > 0 && !selectedDoctor && (
        <motion.section {...fadeUp(0.2)} className="max-w-5xl mx-auto mb-10">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">Recommended Doctors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctorList.map((doctor, index) => (
              <motion.div key={index} {...fadeUp(0.1 * index)}>
                <DoctorCard
                  doctor={doctor.doctor}
                  specialization={doctor.specialization}
                  fee={doctor.doctorFee}
                  address={doctor.clinicAddress}
                />
                <div className="mt-2 text-center text-xs text-gray-500">
                  {doctor.availableSlots?.length || 0} slots available today
                </div>
                <div className="mt-2 flex justify-center">
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => handleSelectDoctor(doctor)}
                    disabled={!doctor.availableSlots?.length}
                    className={`px-6 py-2 rounded-xl text-white font-semibold ${
                      doctor.availableSlots?.length
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 hover:shadow-md"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    {doctor.availableSlots?.length ? "Book Appointment" : "Fully Booked"}
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}

      {/* ============ BOOKING SECTION ============ */}
      {selectedDoctor && !appointmentConfirmed && (
        <motion.section {...fadeUp(0.2)} className="relative max-w-5xl mx-auto mb-10 rounded-3xl p-8 bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)] space-y-8">
          <h2 className="text-2xl font-bold text-center text-gray-800">Book Appointment with {selectedDoctor.doctor}</h2>
          <DoctorCard
            doctor={selectedDoctor.doctor}
            specialization={selectedDoctor.specialization}
            fee={selectedDoctor.doctorFee}
            address={selectedDoctor.clinicAddress}
          />

          <div>
            <h3 className="text-lg font-semibold mb-3">Select Consultation Mode</h3>
            <div className="flex flex-wrap gap-3">
              {selectedDoctor.mode.map((mode) => (
                <motion.button key={mode} whileTap={{ scale: 0.97 }} onClick={() => setSelectedMode(mode)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all duration-200 ${selectedMode === mode ? "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] text-white border-transparent shadow-md" : "bg-white/70 border-white/60 text-gray-700 hover:bg-white"}`}>
                  {mode === "Online" ? <FiVideo /> : <FiMapPin />} {mode}
                </motion.button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-lg font-semibold">Available Time Slots</h3>
              {connected && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">
                  ⚡ Live
                </span>
              )}
            </div>
            {selectedDoctor.availableSlots?.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                <AnimatePresence>
                  {selectedDoctor.availableSlots.map((slot, i) => (
                    <motion.button
                      key={slot}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.3 } }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => setSelectedSlot(slot)}
                      className={`px-4 py-2 rounded-2xl border inline-flex items-center justify-center gap-2 transition-all duration-200 ${
                        selectedSlot === slot
                          ? "bg-gradient-to-r from-[#00B8D9] to-[#006C8E] text-white border-transparent shadow-md"
                          : "bg-white/70 border-white/60 text-gray-700 hover:bg-white"
                      }`}
                    >
                      <FiCalendar /> {slot}
                    </motion.button>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-2xl border border-gray-200">
                <FiAlertTriangle className="text-2xl mx-auto mb-2 text-amber-500" />
                <p className="font-medium">All slots are booked for today</p>
                <p className="text-sm mt-1">Try another doctor or check back later</p>
              </div>
            )}
          </div>

          <div className="flex justify-center">
            <motion.button whileTap={{ scale: 0.97 }} onClick={confirmAppointment} disabled={booking || !selectedDoctor.availableSlots?.length} className={`inline-flex items-center gap-2 px-8 py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${booking || !selectedDoctor.availableSlots?.length ? "bg-gray-300 cursor-not-allowed" : "bg-gradient-to-r from-emerald-500 to-green-600 hover:shadow-lg hover:-translate-y-0.5"}`}>
              <FiCheckCircle /> {booking ? "Booking..." : "Confirm Appointment"}
            </motion.button>
          </div>
        </motion.section>
      )}

      {/* ============ CONFIRMATION ============ */}
      {appointmentConfirmed && confirmedAppt && selectedDoctor && (
        <motion.section {...fadeUp(0.2)} className="relative max-w-3xl mx-auto my-12 rounded-3xl p-10 text-center bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_10px_30px_rgba(0,0,0,0.06)]">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
            <FiCheckCircle className="text-emerald-600 text-3xl" />
          </div>
          <h2 className="text-2xl font-bold text-emerald-600">Appointment Confirmed 🎉</h2>
          <div className="mt-4 text-gray-700 space-y-2">
            <p><strong>Patient:</strong> {confirmedAppt.patient_name}</p>
            <p><strong>Doctor:</strong> {confirmedAppt.doctor_name} ({confirmedAppt.specialization})</p>
            <p><strong>Mode:</strong> {confirmedAppt.mode}</p>
            <p><strong>Date:</strong> {confirmedAppt.date}</p>
            <p><strong>Time Slot:</strong> {confirmedAppt.time_slot}</p>
            <p><strong>Consultation Fee:</strong> ₹{confirmedAppt.fee}</p>
            <p><strong>Priority:</strong> {confirmedAppt.priority_level}</p>
            {confirmedAppt.mode === "Online" ? (
              <p className="mt-2 text-[#006C8E]">Join Link: <a href="https://meet.docThink.ai/session" className="underline hover:text-[#00B8D9]">https://meet.docThink.ai/session</a></p>
            ) : (
              <p className="mt-2 text-[#006C8E]">Visit Address: {selectedDoctor.clinicAddress}</p>
            )}
            <p className="mt-4 text-sm text-gray-500">Appointment ID: #{confirmedAppt.id}</p>
          </div>

          {/* Live appointments count */}
          {connected && (
            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500 flex items-center justify-center gap-2">
              <FiZap className="text-emerald-500" />
              {appointments.length} active appointment{appointments.length !== 1 ? "s" : ""} today
              <span className="text-xs opacity-60">• {clientCount} user{clientCount !== 1 ? "s" : ""} online</span>
            </div>
          )}
        </motion.section>
      )}
    </div>
  );
}