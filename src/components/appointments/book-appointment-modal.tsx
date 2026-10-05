"use client";

import { useState } from "react";
import { Plus, X, Calendar, Clock, Stethoscope, AlertCircle } from "lucide-react";
import { createAppointment } from "@/lib/actions";

export function BookAppointmentModal({
  patients,
  doctors,
}: {
  patients: { patient_id: number; first_name: string; last_name: string }[];
  doctors: {
    doctor_id: number;
    first_name: string;
    last_name: string;
    specialization: string;
    department: { department_name: string };
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createAppointment(formData);

    if (res.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to book appointment");
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
        <span>Book Clinical Appointment</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Book Outpatient Appointment
                </h3>
                <p className="text-xs text-stone-500">
                  Assign patient to physician slot with conflict detection.
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
                  Select Patient *
                </label>
                <select
                  required
                  name="patient_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Choose registered patient --</option>
                  {patients.map((p) => (
                    <option key={p.patient_id} value={p.patient_id}>
                      {p.first_name} {p.last_name} (MRN-{String(p.patient_id).padStart(5, "0")})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Select Attending Physician *
                </label>
                <select
                  required
                  name="doctor_id"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Choose doctor --</option>
                  {doctors.map((d) => (
                    <option key={d.doctor_id} value={d.doctor_id}>
                      Dr. {d.first_name} {d.last_name} ({d.department.department_name} • {d.specialization})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Appointment Date *
                  </label>
                  <input
                    required
                    name="appointment_date"
                    type="date"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Slot Time (HH:MM) *
                  </label>
                  <input
                    required
                    name="appointment_time"
                    type="time"
                    step="900"
                    defaultValue="09:30"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Visit Classification *
                </label>
                <select
                  name="appointment_type"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="NEW_VISIT">New Visit (Initial Consultation)</option>
                  <option value="FOLLOW_UP">Follow Up Review</option>
                  <option value="ROUTINE_CHECKUP">Routine Checkup</option>
                  <option value="EMERGENCY">Emergency Triage</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Clinical Reason / Chief Complaint
                </label>
                <textarea
                  name="reason_for_visit"
                  rows={2}
                  placeholder="e.g. Follow-up for blood pressure titration and chest discomfort"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
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
                  {loading ? "Verifying Slot..." : "Confirm Slot Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
