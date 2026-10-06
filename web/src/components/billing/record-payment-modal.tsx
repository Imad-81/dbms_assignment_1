"use client";

import { useState } from "react";
import { Plus, X, CreditCard, AlertCircle } from "lucide-react";
import { recordPayment } from "@/lib/actions";
import { formatCurrency } from "@/lib/utils";

export function RecordPaymentModal({
  bills,
}: {
  bills: {
    bill_id: number;
    total_amount: any;
    payment_status: string;
    patient: { first_name: string; last_name: string };
    payment: { amount_paid: any }[];
  }[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBillId, setSelectedBillId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedBill = bills.find((b) => b.bill_id === Number(selectedBillId));
  const paid = selectedBill
    ? selectedBill.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0)
    : 0;
  const due = selectedBill ? Math.max(0, Number(selectedBill.total_amount) - paid) : 0;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const res = await recordPayment(formData);

    if (res.success) {
      setIsOpen(false);
      window.location.reload();
    } else {
      setError(res.error || "Failed to record payment");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 rounded-lg bg-terracotta-500 px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-terracotta-600"
      >
        <CreditCard className="h-4 w-4" />
        <span>Record Tender Settlement</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-warm-border bg-white p-6 shadow-warm-modal animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-warm-border pb-4">
              <div>
                <h3 className="text-base font-bold text-charcoal-900">
                  Record Payment Settlement
                </h3>
                <p className="text-xs text-stone-500">
                  Post patient settlement against invoice ledger with multi-tender support.
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
                  Target Invoice Statement *
                </label>
                <select
                  required
                  name="bill_id"
                  value={selectedBillId}
                  onChange={(e) => setSelectedBillId(e.target.value ? Number(e.target.value) : "")}
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                >
                  <option value="">-- Select invoice --</option>
                  {bills.map((b) => (
                    <option key={b.bill_id} value={b.bill_id}>
                      INV-{String(b.bill_id).padStart(5, "0")} — {b.patient.first_name} {b.patient.last_name} (${Number(b.total_amount).toFixed(2)} - {b.payment_status})
                    </option>
                  ))}
                </select>
              </div>

              {selectedBill && (
                <div className="rounded-xl border border-warm-border bg-warm-bg/50 p-3 text-xs">
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Total Invoiced:</span>
                    <span className="font-mono font-bold text-charcoal-900">
                      {formatCurrency(Number(selectedBill.total_amount))}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-stone-600">
                    <span>Already Settled:</span>
                    <span className="font-mono text-sage-700">
                      {formatCurrency(paid)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-warm-border mt-1 pt-1 font-semibold text-rose-700">
                    <span>Outstanding Due:</span>
                    <span className="font-mono text-sm">
                      {formatCurrency(due)}
                    </span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Payment Amount ($) *
                  </label>
                  <input
                    required
                    name="amount_paid"
                    type="number"
                    step="0.01"
                    min="1"
                    defaultValue={due > 0 ? due : 50}
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-charcoal-800">
                    Tender Method *
                  </label>
                  <select
                    required
                    name="payment_method"
                    defaultValue="CREDIT_CARD"
                    className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                  >
                    <option value="CREDIT_CARD">Credit Card</option>
                    <option value="DEBIT_CARD">Debit Card</option>
                    <option value="UPI">UPI / Digital QR</option>
                    <option value="CASH">Cash Counter</option>
                    <option value="INSURANCE">Insurance TPA Cashless</option>
                    <option value="NET_BANKING">Net Banking Transfer</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Transaction / Claim Reference
                </label>
                <input
                  name="transaction_reference"
                  type="text"
                  placeholder="e.g. TXN-VISA-994102 or CLAIM-STAR-8812"
                  className="mt-1 w-full rounded-lg border border-warm-border px-3 py-2 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-800">
                  Cashier Notes
                </label>
                <input
                  name="notes"
                  type="text"
                  placeholder="e.g. Paid at reception desk by patient spouse"
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
                  {loading ? "Recording..." : "Post Payment Settlement"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
