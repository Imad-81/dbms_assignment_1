import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime } from "@/lib/utils";
import { OrderTestModal } from "@/components/lab/order-test-modal";
import { RecordResultModal } from "@/components/lab/record-result-modal";
import { TestOrderDeleteAction } from "@/components/lab/test-order-delete-action";
import {
  FlaskConical,
  ShieldAlert,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Activity,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LabPage() {
  const [testOrders, catalog, criticalOrders, patients, doctors, consultations] =
    await Promise.all([
      prisma.test_order.findMany({
        orderBy: { order_date: "desc" },
        include: {
          patient: true,
          doctor: { include: { department: true } },
          lab_test: true,
        },
      }),
      prisma.lab_test.findMany({
        include: { department: true },
        orderBy: { test_name: "asc" },
      }),
      // Query 4: Pending & Critical Diagnostic Laboratory Orders
      prisma.test_order.findMany({
        where: {
          OR: [{ abnormal_flag: "CRITICAL" }, { order_status: { not: "COMPLETED" } }],
        },
        orderBy: { order_date: "desc" },
        include: {
          patient: true,
          doctor: true,
          lab_test: true,
        },
      }),
      prisma.patient.findMany({
        select: { patient_id: true, first_name: true, last_name: true },
        orderBy: { first_name: "asc" },
      }),
      prisma.doctor.findMany({
        select: { doctor_id: true, first_name: true, last_name: true },
        orderBy: { first_name: "asc" },
      }),
      prisma.consultation.findMany({
        select: { consultation_id: true, patient_id: true },
        orderBy: { consultation_timestamp: "desc" },
      }),
    ]);

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Diagnostic Laboratory & Pathology Hub
          </h1>
          <p className="text-xs text-stone-500">
            Diagnostic test catalog, critical abnormal telemetry, turnaround tracking, and result verification.
          </p>
        </div>
        <OrderTestModal
          patients={patients}
          doctors={doctors}
          tests={catalog}
          consultations={consultations}
        />
      </div>

      {/* Critical & Pending Worklist (Showcases DBMS Query 4) */}
      <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-6 shadow-warm">
        <div className="flex items-center justify-between border-b border-rose-200/80 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-rose-900">
                Pending & Critical Diagnostic Orders (DBMS Query 4)
              </h2>
              <p className="text-xs text-rose-700">
                Filtered strictly by abnormal_flag = &apos;CRITICAL&apos; OR order_status != &apos;COMPLETED&apos;.
              </p>
            </div>
          </div>
          <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-800">
            {criticalOrders.length} Priority Orders
          </span>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-rose-200/80 text-[10px] uppercase tracking-wider text-rose-800 font-bold">
                <th className="pb-2.5">Order ID & Date</th>
                <th className="pb-2.5">Patient</th>
                <th className="pb-2.5">Ordering Doctor</th>
                <th className="pb-2.5">Diagnostic Test</th>
                <th className="pb-2.5">Status</th>
                <th className="pb-2.5">Flag</th>
                <th className="pb-2.5">Observed Finding</th>
                <th className="pb-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-rose-200/50">
              {criticalOrders.map((ord) => (
                <tr key={ord.order_id} className="hover:bg-rose-100/30">
                  <td className="py-3 font-mono font-bold text-charcoal-900">
                    ORD-{String(ord.order_id).padStart(5, "0")}
                    <div className="text-[10px] text-stone-500 font-normal">
                      {formatDateTime(ord.order_date)}
                    </div>
                  </td>

                  <td className="py-3">
                    <Link
                      href={`/patients/${ord.patient_id}`}
                      className="font-bold text-charcoal-900 hover:text-terracotta-600 hover:underline"
                    >
                      {ord.patient.first_name} {ord.patient.last_name}
                    </Link>
                  </td>

                  <td className="py-3 text-stone-700">
                    Dr. {ord.doctor.first_name} {ord.doctor.last_name}
                  </td>

                  <td className="py-3 font-medium text-charcoal-900">
                    {ord.lab_test.test_name}
                    <span className="ml-1 text-[10px] text-stone-500">
                      ({ord.lab_test.sample_type})
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        ord.order_status === "COMPLETED"
                          ? "bg-sage-100 text-sage-800"
                          : ord.order_status === "ANALYZING"
                          ? "bg-sky-100 text-sky-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {ord.order_status}
                    </span>
                  </td>

                  <td className="py-3">
                    <span
                      className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                        ord.abnormal_flag === "CRITICAL"
                          ? "bg-rose-600 text-white animate-pulse"
                          : ord.abnormal_flag === "ABNORMAL"
                          ? "bg-amber-200 text-amber-900"
                          : "bg-stone-200 text-stone-700"
                      }`}
                    >
                      {ord.abnormal_flag}
                    </span>
                  </td>

                  <td className="py-3 max-w-xs font-mono text-[11px] text-stone-800">
                    {ord.test_result || "Sample in analysis queue"}
                  </td>

                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <RecordResultModal
                        orderId={ord.order_id}
                        testName={ord.lab_test.test_name}
                        patientName={`${ord.patient.first_name} ${ord.patient.last_name}`}
                      />
                      <TestOrderDeleteAction
                        orderId={ord.order_id}
                        testName={ord.lab_test.test_name}
                        patientName={`${ord.patient.first_name} ${ord.patient.last_name}`}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Complete Orders Worklist & Catalog */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Diagnostic Test Catalog */}
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm space-y-4">
          <div className="border-b border-warm-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Laboratory Test Catalog ({catalog.length} Tests)
            </h3>
            <p className="text-[11px] text-stone-500">
              Turnaround SLA, standard tariffs, and specimen types.
            </p>
          </div>

          <div className="space-y-3">
            {catalog.map((t) => (
              <div
                key={t.test_id}
                className="rounded-lg border border-warm-border bg-warm-bg/40 p-3 text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-charcoal-900">{t.test_name}</span>
                  <span className="font-mono font-semibold text-terracotta-600">
                    {formatCurrency(Number(t.standard_price))}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>Code: {t.test_code}</span>
                  <span>Turnaround: {t.turnaround_hours}h</span>
                </div>
                <div className="text-[10px] text-stone-400">
                  Specimen: {t.sample_type} • Range: {t.normal_range || "N/A"}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Full Laboratory Orders Queue */}
        <div className="lg:col-span-2 rounded-xl border border-warm-border bg-white p-5 shadow-warm space-y-4">
          <div className="border-b border-warm-border pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
              Complete Diagnostic Worklist ({testOrders.length} Orders)
            </h3>
            <p className="text-[11px] text-stone-500">
              Chronological log of clinical laboratory orders and telemetry verification.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-warm-border text-[10px] uppercase text-stone-500 font-semibold">
                  <th className="pb-2">Order</th>
                  <th className="pb-2">Patient</th>
                  <th className="pb-2">Diagnostic Test</th>
                  <th className="pb-2">Findings</th>
                  <th className="pb-2">Flag</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-border">
                {testOrders.map((to) => (
                  <tr key={to.order_id} className="hover:bg-warm-bg/40">
                    <td className="py-2.5 font-mono text-stone-500">
                      ORD-{String(to.order_id).padStart(4, "0")}
                    </td>
                    <td className="py-2.5 font-semibold text-charcoal-900">
                      <Link
                        href={`/patients/${to.patient_id}`}
                        className="hover:text-terracotta-600 hover:underline"
                      >
                        {to.patient.first_name} {to.patient.last_name}
                      </Link>
                    </td>
                    <td className="py-2.5 text-stone-700">
                      {to.lab_test.test_name}
                    </td>
                    <td className="py-2.5 max-w-xs font-mono text-[11px] text-stone-600">
                      <p className="truncate">{to.test_result || "Pending processing"}</p>
                    </td>
                    <td className="py-2.5">
                      <span
                        className={`rounded px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                          to.abnormal_flag === "CRITICAL"
                            ? "bg-rose-100 text-rose-800"
                            : to.abnormal_flag === "ABNORMAL"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-sage-100 text-sage-800"
                        }`}
                      >
                        {to.abnormal_flag}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <RecordResultModal
                          orderId={to.order_id}
                          testName={to.lab_test.test_name}
                          patientName={`${to.patient.first_name} ${to.patient.last_name}`}
                        />
                        <TestOrderDeleteAction
                          orderId={to.order_id}
                          testName={to.lab_test.test_name}
                          patientName={`${to.patient.first_name} ${to.patient.last_name}`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
