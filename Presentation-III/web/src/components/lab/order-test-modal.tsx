"use client";

import { useState } from "react";
import { Plus, X, FlaskConical, AlertCircle } from "lucide-react";
import { orderLabTest } from "@/lib/actions";

export function OrderTestModal({
  patients,
  doctors,
  tests,
  consultations,
}: {
  patients: { patient_id: number; first_name: string; last_name: string }[];
  doctors: { doctor_id: number; first_name: string; last_name: string }[];
  tests: { test_id: number; test_name: string; test_code: string; standard_price: any }[];
  consultations: { consultation_id: number; patient_id: number }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await orderLabTest(formData);

    if (res.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to order lab test");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-terracotta-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-terracotta-600"
      >
        <Plus className="h-4 w-4" />
        <span>Order Diagnostic Test</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Order Diagnostic Investigation
                </h3>
                <p className="text-xs text-stone-500">
                  Transmit laboratory order to Pathology & Diagnostic Imaging.
                </p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1 text-stone-400 hover:bg-warm-subtle hover:text-stone-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 flex items-center gap-2 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Patient *
                </label>
                <select
                  required
                  name="patient_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Choose patient --</option>
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.first_name} {p.last_name} (MRN-{String(p.patient_id).padStart(5, "0")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Ordering Clinician *
                </label>
                <select
                  required
                  name="doctor_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Choose ordering doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      Dr. {d.first_name} {d.last_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Diagnostic Test *
                </label>
                <select
                  required
                  name="test_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Select test from catalog --</option>
                  {tests.map((t) => (
                    <option key={t.test_id} value={t.test_id}>
                      {t.test_name} ({t.test_code}) - ${Number(t.standard_price).toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Linked Clinical Encounter *
                </label>
                <select
                  required
                  name="consultation_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Select consultation encounter --</option>
                  {consultations.map((c) => (
                    <option key={c.consultation_id} value={c.consultation_id}>
                      Consultation #{c.consultation_id} (Patient #{c.patient_id})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-warm-border pt-4">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-lg border border-warm-border bg-white px-4 py-2 text-xs font-semibold text-stone-700 hover:bg-warm-subtle"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg bg-terracotta-500 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-terracotta-600 disabled:opacity-50"
                >
                  {loading ? "Ordering..." : "Transmit Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
