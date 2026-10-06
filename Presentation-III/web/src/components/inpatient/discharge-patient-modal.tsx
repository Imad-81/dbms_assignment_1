"use client";

import { useState } from "react";
import { X, LogOut, CheckCircle2, AlertCircle } from "lucide-react";
import { dischargePatient } from "@/lib/actions";

export function DischargePatientModal({
  admissionId,
  patientName,
  bedNumber,
}: {
  admissionId: number;
  patientName: string;
  bedNumber: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    formData.append("admission_id", String(admissionId));

    const res = await dischargePatient(formData);

    if (res.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to discharge patient");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="rounded border border-warm-border bg-white px-2 py-1 text-[11px] font-semibold text-terracotta-700 shadow-sm hover:bg-terracotta-50"
      >
        Discharge
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Discharge Inpatient
                </h3>
                <p className="text-xs text-stone-500">
                  Patient: {patientName} (Bed {bedNumber})
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
                  Clinical Discharge Summary & Outcome *
                </label>
                <textarea
                  required
                  name="discharge_summary"
                  rows={4}
                  placeholder="e.g. Patient successfully stabilized post inotropic therapy and diuretic titration. Lungs clear to auscultation. Discharged in stable condition with home cardiology follow-up in 2 weeks."
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="rounded-lg bg-warm-bg/60 p-3 text-[11px] text-stone-600 border border-warm-border">
                ⚠️ Discharging will immediately release Bed {bedNumber} to <strong>AVAILABLE</strong> and calculate the inpatient billing statement.
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
                  {loading ? "Processing..." : "Confirm & Discharge"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
