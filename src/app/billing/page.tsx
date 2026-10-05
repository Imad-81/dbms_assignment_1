import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { RecordPaymentModal } from "@/components/billing/record-payment-modal";
import {
  Receipt,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  FileSpreadsheet,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const statusFilter = searchParams.status || "";

  const whereClause: any = {};
  if (statusFilter) whereClause.payment_status = statusFilter;

  // Query 5: Financial Audit: Billing & Payment Reconciliation
  const [bills, payments] = await Promise.all([
    prisma.bill.findMany({
      where: whereClause,
      orderBy: [{ bill_date: "desc" }, { bill_id: "desc" }],
      include: {
        patient: true,
        payment: true,
      },
    }),
    prisma.payment.findMany({
      take: 10,
      orderBy: { payment_timestamp: "desc" },
      include: {
        bill: { include: { patient: true } },
      },
    }),
  ]);

  // Aggregate computations
  const totalInvoiced = bills.reduce((acc, b) => acc + Number(b.total_amount), 0);
  const totalCollected = bills.reduce(
    (acc, b) => acc + b.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0),
    0
  );
  const totalOutstanding = totalInvoiced - totalCollected;

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Financial Audit & Payment Reconciliation
          </h1>
          <p className="text-xs text-stone-500">
            Comprehensive billing ledger, fee breakdowns, multi-tender transactions, and outstanding balance audits.
          </p>
        </div>
        <RecordPaymentModal bills={bills} />
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Gross Net Invoiced
          </span>
          <div className="mt-2 font-mono text-2xl font-bold text-charcoal-900">
            {formatCurrency(totalInvoiced)}
          </div>
          <div className="mt-1 text-xs text-stone-400">
            Across {bills.length} outpatient & inpatient invoices
          </div>
        </div>

        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Total Tender Collected
          </span>
          <div className="mt-2 font-mono text-2xl font-bold text-sage-700">
            {formatCurrency(totalCollected)}
          </div>
          <div className="mt-1 text-xs text-sage-600 font-medium">
            Settled via Cash, Cards, UPI & TPA Insurance
          </div>
        </div>

        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Outstanding Patient Receivables
          </span>
          <div className="mt-2 font-mono text-2xl font-bold text-rose-700">
            {formatCurrency(totalOutstanding)}
          </div>
          <div className="mt-1 text-xs text-rose-600 font-medium">
            Requires cashier reconciliation
          </div>
        </div>
      </div>

      {/* Main Reconciliation Ledger Table (Showcases DBMS Query 5) */}
      <div className="rounded-xl border border-warm-border bg-white shadow-warm overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-border bg-warm-bg/30 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900">
            <FileSpreadsheet className="h-4 w-4 text-terracotta-500" />
            <span>Billing & Payment Audit Ledger (DBMS Query 5)</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-stone-400">Status:</span>
            {["", "PAID", "PARTIALLY_PAID", "PENDING"].map((st) => (
              <Link
                key={st || "all"}
                href={`/billing?status=${st}`}
                className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  statusFilter === st
                    ? "bg-terracotta-500 text-white"
                    : "bg-white text-stone-600 hover:bg-stone-100 border border-warm-border"
                }`}
              >
                {st || "All Invoices"}
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border bg-warm-bg/20 text-[10px] font-bold uppercase tracking-wider text-stone-500">
                <th className="px-4 py-3">Invoice & Date</th>
                <th className="px-4 py-3">Patient & Phone</th>
                <th className="px-4 py-3 text-right">Consult</th>
                <th className="px-4 py-3 text-right">Labs</th>
                <th className="px-4 py-3 text-right">Bed Stay</th>
                <th className="px-4 py-3 text-right">Pharmacy</th>
                <th className="px-4 py-3 text-right">Net Invoiced</th>
                <th className="px-4 py-3 text-right">Total Paid</th>
                <th className="px-4 py-3 text-right">Balance Due</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {bills.map((b) => {
                const totalPaid = b.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0);
                const due = Number(b.total_amount) - totalPaid;

                return (
                  <tr key={b.bill_id} className="hover:bg-warm-bg/40">
                    <td className="px-4 py-3">
                      <div className="font-mono font-bold text-charcoal-900">
                        INV-{String(b.bill_id).padStart(5, "0")}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        {formatDate(b.bill_date)}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <Link
                        href={`/patients/${b.patient_id}`}
                        className="font-bold text-charcoal-900 hover:text-terracotta-600 hover:underline"
                      >
                        {b.patient.first_name} {b.patient.last_name}
                      </Link>
                      <div className="text-[10px] text-stone-400">
                        {b.patient.phone}
                      </div>
                    </td>

                    <td className="px-4 py-3 font-mono text-right text-stone-700">
                      {formatCurrency(Number(b.consultation_charges))}
                    </td>

                    <td className="px-4 py-3 font-mono text-right text-stone-700">
                      {formatCurrency(Number(b.test_charges))}
                    </td>

                    <td className="px-4 py-3 font-mono text-right text-stone-700">
                      {formatCurrency(Number(b.bed_charges))}
                    </td>

                    <td className="px-4 py-3 font-mono text-right text-stone-700">
                      {formatCurrency(Number(b.pharmacy_charges))}
                    </td>

                    <td className="px-4 py-3 font-mono text-right font-bold text-charcoal-900">
                      {formatCurrency(Number(b.total_amount))}
                    </td>

                    <td className="px-4 py-3 font-mono text-right font-semibold text-sage-700">
                      {formatCurrency(totalPaid)}
                    </td>

                    <td className="px-4 py-3 font-mono text-right font-bold text-rose-700">
                      {formatCurrency(due)}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                          b.payment_status === "PAID"
                            ? "bg-sage-100 text-sage-800"
                            : b.payment_status === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {b.payment_status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Multi-tender Payment Receipts Log */}
      <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm space-y-4">
        <div className="border-b border-warm-border pb-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
            Recent Multi-Tender Receipts & Transactions ({payments.length})
          </h2>
          <p className="text-[11px] text-stone-500">
            Audit trail of cashier settlements, credit card receipts, UPI references, and insurance claims.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border text-[10px] uppercase text-stone-500 font-semibold">
                <th className="pb-2">Timestamp</th>
                <th className="pb-2">Invoice Target</th>
                <th className="pb-2">Patient</th>
                <th className="pb-2">Tender Method</th>
                <th className="pb-2">Reference Code</th>
                <th className="pb-2">Cashier Notes</th>
                <th className="pb-2 text-right">Amount Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {payments.map((p) => (
                <tr key={p.payment_id} className="hover:bg-warm-bg/40">
                  <td className="py-2.5 font-mono text-stone-500">
                    {formatDateTime(p.payment_timestamp)}
                  </td>
                  <td className="py-2.5 font-mono font-bold text-charcoal-900">
                    INV-{String(p.bill_id).padStart(5, "0")}
                  </td>
                  <td className="py-2.5 font-semibold text-charcoal-900">
                    {p.bill.patient.first_name} {p.bill.patient.last_name}
                  </td>
                  <td className="py-2.5">
                    <span className="rounded bg-warm-subtle px-1.5 py-0.5 font-mono text-[10px] font-medium text-stone-700 border border-warm-border">
                      {p.payment_method}
                    </span>
                  </td>
                  <td className="py-2.5 font-mono text-[11px] text-stone-600">
                    {p.transaction_reference || "—"}
                  </td>
                  <td className="py-2.5 text-stone-500 text-[11px]">
                    {p.notes || "Standard settlement"}
                  </td>
                  <td className="py-2.5 font-mono text-right font-bold text-sage-700">
                    {formatCurrency(Number(p.amount_paid))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
