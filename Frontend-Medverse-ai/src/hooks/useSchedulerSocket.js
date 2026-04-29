import { useEffect, useRef, useState, useCallback } from "react";

/**
 * useSchedulerSocket — React hook for real-time scheduler updates.
 *
 * Connects to the FastAPI WebSocket at /ws/scheduler.
 * Auto-reconnects on disconnect with exponential backoff.
 * Falls back to HTTP polling if WebSocket fails repeatedly.
 *
 * Events received:
 *   - initial_state: all current appointments on connect
 *   - appointment_booked: a new appointment was made (by any user)
 *   - appointment_cancelled: an appointment was cancelled
 *   - state_refresh: full state re-sync
 *   - pong: heartbeat response
 */

const WS_BASE = (import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000")
  .replace("http://", "ws://")
  .replace("https://", "wss://");

const WS_URL = `${WS_BASE}/ws/scheduler`;
const POLL_INTERVAL = 5000; // 5s polling fallback
const HEARTBEAT_INTERVAL = 15000; // 15s ping
const MAX_RECONNECT_ATTEMPTS = 10;

export default function useSchedulerSocket({ onBooking, onCancellation, onSlotUpdate } = {}) {
  const wsRef = useRef(null);
  const heartbeatRef = useRef(null);
  const reconnectTimerRef = useRef(null);
  const pollTimerRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);

  const [connected, setConnected] = useState(false);
  const [clientCount, setClientCount] = useState(0);
  const [appointments, setAppointments] = useState([]);
  const [lastEvent, setLastEvent] = useState(null);
  const [usingPolling, setUsingPolling] = useState(false);

  // =====================================================
  // EXTRACT BOOKED SLOTS from appointments list
  // =====================================================
  const getBookedSlots = useCallback((appts) => {
    const slotMap = {};
    for (const appt of appts) {
      const key = `${appt.doctor_name}__${appt.date}`;
      if (!slotMap[key]) slotMap[key] = [];
      slotMap[key].push(appt.time_slot);
    }
    return slotMap;
  }, []);

  // =====================================================
  // HTTP POLLING FALLBACK
  // =====================================================
  const startPolling = useCallback(() => {
    if (pollTimerRef.current) return; // Already polling
    setUsingPolling(true);
    console.log("[POLL] Starting HTTP polling fallback");

    const poll = async () => {
      try {
        const apiBase = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:5000";
        const res = await fetch(`${apiBase}/api/scheduler/appointments`);
        const data = await res.json();
        if (data.success) {
          setAppointments(data.data || []);
          onSlotUpdate?.(getBookedSlots(data.data || []));
        }
      } catch (err) {
        console.error("[POLL] Polling error:", err);
      }
    };

    poll(); // Immediate first poll
    pollTimerRef.current = setInterval(poll, POLL_INTERVAL);
  }, [getBookedSlots, onSlotUpdate]);

  const stopPolling = useCallback(() => {
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
      setUsingPolling(false);
      console.log("[POLL] Stopped polling");
    }
  }, []);

  // =====================================================
  // WEBSOCKET MESSAGE HANDLER
  // =====================================================
  const handleMessage = useCallback((event) => {
    try {
      const msg = JSON.parse(event.data);

      // Update client count
      if (msg.connected_clients !== undefined) {
        setClientCount(msg.connected_clients);
      }

      switch (msg.type) {
        case "initial_state":
          console.log("[WS] Received initial state:", msg.appointments?.length, "appointments");
          setAppointments(msg.appointments || []);
          onSlotUpdate?.(getBookedSlots(msg.appointments || []));
          break;

        case "appointment_booked":
          console.log("[WS] New booking:", msg.appointment?.id);
          setAppointments((prev) => [...prev, msg.appointment]);
          setLastEvent({ type: "booked", data: msg.appointment, at: Date.now() });
          onBooking?.(msg.appointment, msg.booked_slot);
          onSlotUpdate?.(msg.booked_slot);
          break;

        case "appointment_cancelled":
          console.log("[WS] Cancellation:", msg.cancelled?.id);
          setAppointments((prev) =>
            prev.filter((a) => a.id !== msg.cancelled?.id)
          );
          setLastEvent({ type: "cancelled", data: msg.cancelled, at: Date.now() });
          onCancellation?.(msg.cancelled, msg.freed_slot);
          onSlotUpdate?.(msg.freed_slot);
          break;

        case "state_refresh":
          setAppointments(msg.appointments || []);
          onSlotUpdate?.(getBookedSlots(msg.appointments || []));
          break;

        case "pong":
          // Heartbeat acknowledged
          break;

        default:
          console.log("[WS] Unknown message type:", msg.type);
      }
    } catch (err) {
      console.error("[WS] Message parse error:", err);
    }
  }, [onBooking, onCancellation, onSlotUpdate, getBookedSlots]);

  // =====================================================
  // CONNECT
  // =====================================================
  const connect = useCallback(() => {
    // Don't connect if already connected
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    try {
      console.log(`[WS] Connecting to ${WS_URL}...`);
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("[WS] ✅ Connected");
        setConnected(true);
        reconnectAttemptsRef.current = 0;
        stopPolling(); // Stop polling since WS is live

        // Start heartbeat
        heartbeatRef.current = setInterval(() => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send("ping");
          }
        }, HEARTBEAT_INTERVAL);
      };

      ws.onmessage = handleMessage;

      ws.onclose = (e) => {
        console.log(`[WS] ❌ Disconnected (code: ${e.code})`);
        setConnected(false);
        clearInterval(heartbeatRef.current);

        // Auto-reconnect with exponential backoff
        const attempts = ++reconnectAttemptsRef.current;
        if (attempts <= MAX_RECONNECT_ATTEMPTS) {
          const delay = Math.min(1000 * Math.pow(2, attempts - 1), 30000);
          console.log(`[WS] Reconnecting in ${delay}ms (attempt ${attempts}/${MAX_RECONNECT_ATTEMPTS})`);
          reconnectTimerRef.current = setTimeout(connect, delay);
        } else {
          console.log("[WS] Max reconnect attempts reached. Falling back to polling.");
          startPolling();
        }
      };

      ws.onerror = (err) => {
        console.error("[WS] Error:", err);
        // onclose will handle reconnect
      };
    } catch (err) {
      console.error("[WS] Connection failed:", err);
      startPolling();
    }
  }, [handleMessage, startPolling, stopPolling]);

  // =====================================================
  // LIFECYCLE
  // =====================================================
  useEffect(() => {
    connect();

    return () => {
      // Cleanup on unmount
      clearInterval(heartbeatRef.current);
      clearTimeout(reconnectTimerRef.current);
      stopPolling();
      if (wsRef.current) {
        wsRef.current.onclose = null; // Prevent reconnect on intentional close
        wsRef.current.close();
      }
    };
  }, [connect, stopPolling]);

  // =====================================================
  // PUBLIC API
  // =====================================================
  const requestRefresh = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send("get_state");
    }
  }, []);

  return {
    connected,        // Boolean: WebSocket connected?
    usingPolling,     // Boolean: Fallen back to polling?
    clientCount,      // Number: How many clients are connected
    appointments,     // Array: All current appointments
    lastEvent,        // Object: Last booking/cancellation event
    requestRefresh,   // Function: Force a state refresh
  };
}
