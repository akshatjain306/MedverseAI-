"""
Medverse AI — System Performance Benchmark Script
==================================================
Benchmarks API response times for all endpoints.
Outputs: Mean, Std, P95, P99 latencies per endpoint.

Usage:
    1. Start the backend: python app.py
    2. Run this script: python evaluation/benchmark.py

The backend must be running on http://localhost:5000.
"""

import os
import json
import time
import requests
import statistics
import numpy as np

# -----------------------------------------------
# CONFIG
# -----------------------------------------------
BASE_URL = "http://127.0.0.1:5000"
NUM_REQUESTS = 20  # Requests per endpoint (increase for better stats)


# -----------------------------------------------
# BENCHMARK FUNCTION
# -----------------------------------------------
def benchmark_endpoint(name, method, url, data=None, files=None, headers=None, num_requests=NUM_REQUESTS):
    """Benchmark a single endpoint."""
    times = []
    errors = 0

    print(f"\n  Benchmarking: {name} ({num_requests} requests)")

    for i in range(num_requests):
        try:
            start = time.time()

            if method == "GET":
                resp = requests.get(url, timeout=120)
            elif method == "POST":
                if files:
                    resp = requests.post(url, files=files, timeout=120)
                else:
                    resp = requests.post(url, json=data, headers=headers or {"Content-Type": "application/json"}, timeout=120)
            elif method == "DELETE":
                resp = requests.delete(url, timeout=120)

            elapsed = (time.time() - start) * 1000  # ms
            times.append(elapsed)

            if resp.status_code != 200:
                errors += 1

        except Exception as e:
            errors += 1
            print(f"    [ERROR] Request {i+1}: {e}")

    if not times:
        return {"name": name, "error": "All requests failed"}

    return {
        "name": name,
        "mean_ms": round(np.mean(times), 1),
        "std_ms": round(np.std(times), 1),
        "min_ms": round(min(times), 1),
        "max_ms": round(max(times), 1),
        "p95_ms": round(np.percentile(times, 95), 1),
        "p99_ms": round(np.percentile(times, 99), 1),
        "median_ms": round(np.median(times), 1),
        "requests": len(times),
        "errors": errors,
    }


# -----------------------------------------------
# RUN ALL BENCHMARKS
# -----------------------------------------------
def run_benchmarks():
    """Run benchmarks on all API endpoints."""
    print(f"\n{'='*60}")
    print(f"  MEDVERSE AI — SYSTEM PERFORMANCE BENCHMARK")
    print(f"  Target: {BASE_URL}")
    print(f"  Requests per endpoint: {NUM_REQUESTS}")
    print(f"{'='*60}")

    # Check if server is running
    try:
        resp = requests.get(f"{BASE_URL}/", timeout=5)
        print(f"\n  [OK] Server is running: {resp.json().get('message', 'OK')}")
    except Exception:
        print(f"\n  [ERROR] Cannot reach {BASE_URL} — is the backend running?")
        return

    results = []

    # -----------------------------------------------
    # 1. Health Check (baseline)
    # -----------------------------------------------
    r = benchmark_endpoint(
        name="Health Check (GET /)",
        method="GET",
        url=f"{BASE_URL}/",
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms | P95: {r['p95_ms']}ms")

    # -----------------------------------------------
    # 2. Symptom Checker
    # -----------------------------------------------
    symptom_data = {"text": "I have a severe headache and mild fever with body aches"}
    r = benchmark_endpoint(
        name="Symptom Check (POST /api/symptom/check)",
        method="POST",
        url=f"{BASE_URL}/api/symptom/check",
        data=symptom_data,
        num_requests=min(NUM_REQUESTS, 10),  # Fewer — ML model is slow
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms | P95: {r['p95_ms']}ms")

    # -----------------------------------------------
    # 3. Doctor Recommendation
    # -----------------------------------------------
    rec_data = {"symptoms": "chest pain and shortness of breath"}
    r = benchmark_endpoint(
        name="Doctor Recommend (POST /api/scheduler/recommend)",
        method="POST",
        url=f"{BASE_URL}/api/scheduler/recommend",
        data=rec_data,
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms | P95: {r['p95_ms']}ms")

    # -----------------------------------------------
    # 4. Book Appointment
    # -----------------------------------------------
    book_data = {
        "patient_name": f"Benchmark User",
        "doctor_name": "Dr. Arjun Mehta",
        "specialization": "General Physician",
        "date": "2099-12-31",  # Far future date to avoid conflicts
        "time_slot": "09:00 AM",
        "mode": "Online",
        "symptoms": "benchmark test",
        "fee": "400",
    }
    # Just benchmark a single booking (to avoid slot conflicts)
    r = benchmark_endpoint(
        name="Book Appointment (POST /api/scheduler/book)",
        method="POST",
        url=f"{BASE_URL}/api/scheduler/book",
        data=book_data,
        num_requests=1,
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms")

    # -----------------------------------------------
    # 5. List Appointments
    # -----------------------------------------------
    r = benchmark_endpoint(
        name="List Appointments (GET /api/scheduler/appointments)",
        method="GET",
        url=f"{BASE_URL}/api/scheduler/appointments",
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms | P95: {r['p95_ms']}ms")

    # -----------------------------------------------
    # 6. Get Available Slots
    # -----------------------------------------------
    r = benchmark_endpoint(
        name="Get Slots (GET /api/scheduler/slots/Dr. Arjun Mehta)",
        method="GET",
        url=f"{BASE_URL}/api/scheduler/slots/Dr. Arjun Mehta",
    )
    results.append(r)
    print(f"    → Mean: {r['mean_ms']}ms | P95: {r['p95_ms']}ms")

    # -----------------------------------------------
    # SUMMARY TABLE
    # -----------------------------------------------
    print(f"\n{'='*80}")
    print(f"  BENCHMARK RESULTS SUMMARY")
    print(f"{'='*80}")
    print(f"  {'Endpoint':<50} | {'Mean':>7} | {'Std':>6} | {'P95':>7} | {'P99':>7}")
    print(f"  {'-'*80}")

    for r in results:
        if "error" in r:
            print(f"  {r['name']:<50} | ERROR")
        else:
            print(
                f"  {r['name']:<50} | {r['mean_ms']:>5.1f}ms | {r['std_ms']:>4.1f}ms | "
                f"{r['p95_ms']:>5.1f}ms | {r.get('p99_ms', 'N/A'):>5}ms"
            )

    print(f"{'='*80}")

    # -----------------------------------------------
    # SAVE
    # -----------------------------------------------
    output_path = os.path.join(os.path.dirname(__file__), "benchmark_results.json")
    with open(output_path, "w") as f:
        json.dump(results, f, indent=2)
    print(f"\n  Results saved to: {output_path}")

    # -----------------------------------------------
    # PAPER-READY TABLE
    # -----------------------------------------------
    print(f"\n  PAPER-READY TABLE (copy to your paper):")
    print(f"  ┌{'─'*45}┬{'─'*12}┬{'─'*10}┬{'─'*10}┐")
    print(f"  │ {'Endpoint':<43} │ {'Mean (ms)':<10} │ {'Std (ms)':<8} │ {'P95 (ms)':<8} │")
    print(f"  ├{'─'*45}┼{'─'*12}┼{'─'*10}┼{'─'*10}┤")
    for r in results:
        if "error" not in r:
            short_name = r["name"].split("(")[0].strip()
            print(
                f"  │ {short_name:<43} │ {r['mean_ms']:>10.1f} │ {r['std_ms']:>8.1f} │ {r['p95_ms']:>8.1f} │"
            )
    print(f"  └{'─'*45}┴{'─'*12}┴{'─'*10}┴{'─'*10}┘")


# -----------------------------------------------
# MAIN
# -----------------------------------------------
if __name__ == "__main__":
    run_benchmarks()
