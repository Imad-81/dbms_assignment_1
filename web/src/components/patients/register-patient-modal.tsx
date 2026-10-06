"use client";

import { useState } from "react";
import { Plus, X, UserPlus, Check } from "lucide-react";
import { createPatient } from "@/lib/actions";

export function RegisterPatientModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await createPatient(formData);

    if (res.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to register patient");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-terracotta-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-terracotta-600"
      >
        <UserPlus className="h-4 w-4" />
        <span>Register New Patient</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Register New Patient Dossier
                </h3>
                <p className="text-xs text-stone-500">
                  Enter demographic intake and emergency contact details.
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
              <div className="mt-4 rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    First Name *
                  </label>
                  <input
                    required
                    name="first_name"
                    type="text"
                    placeholder="e.g. Eleanor"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Last Name *
                  </label>
                  <input
                    required
                    name="last_name"
                    type="text"
                    placeholder="e.g. Vance"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Date of Birth *
                  </label>
                  <input
                    required
                    name="date_of_birth"
                    type="date"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Gender *
                  </label>
                  <select
                    required
                    name="gender"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Blood Group *
                  </label>
                  <select
                    required
                    name="blood_group"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Contact Phone *
                  </label>
                  <input
                    required
                    name="phone"
                    type="tel"
                    placeholder="+1-555-0199"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Email Address
                  </label>
                  <input
                    name="email"
                    type="email"
                    placeholder="patient@example.com"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Residential Address *
                </label>
                <input
                  required
                  name="address"
                  type="text"
                  placeholder="Street address, City, State"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div className="rounded-xl border border-warm-border bg-warm-bg/50 p-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                  Emergency Contact Verification
                </span>
                <div className="mt-2 grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700">
                      Contact Name & Relation *
                    </label>
                    <input
                      required
                      name="emergency_contact_name"
                      type="text"
                      placeholder="e.g. John Doe (Brother)"
                      className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700">
                      Emergency Phone *
                    </label>
                    <input
                      required
                      name="emergency_contact_phone"
                      type="tel"
                      placeholder="+1-555-0922"
                      className="mt-1 w-full rounded-lg border border-warm-border bg-white px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                    />
                  </div>
                </div>
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
                  {loading ? "Registering..." : "Complete Registration"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
