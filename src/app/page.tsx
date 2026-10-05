import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatTime } from "@/lib/utils";
import {
  Users,
  Bed,
  Calendar,
  AlertTriangle,
  ArrowUpRight,
  Stethoscope,
  HeartPulse,
  Receipt,
  CheckCircle2,
  Clock,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Aggregate live metrics from Neon
  const [
    patientCount,
    activeAdmissions,
    totalBeds,
    occupiedBeds,
    todayAppointments,
    criticalLabs,
    recentConsultations,
    doctorSchedules,
    bills,
    wards,
  ] = await Promise.all([
    prisma.patient.count(),
    prisma.admission.count({ where: { status: "ADMITTED" } }),
    prisma.bed.count(),
    prisma.bed.count({ where: { status: "OCCUPIED" } }),
    prisma.appointment.findMany({
      take: 6,
      orderBy: { appointment_date: "desc" },
      include: { patient: true, doctor: { include: { department: true } } },
    }),
    prisma.test_order.findMany({
      where: { abnormal_flag: "CRITICAL" },
      include: {
        patient: true,
        lab_test: true,
        doctor: true,
      },
    }),
    prisma.consultation.findMany({
      take: 5,
      orderBy: { consultation_timestamp: "desc" },
      include: {
        patient: true,
        doctor: { include: { department: true } },
        diagnosis: true,
      },
    }),
    prisma.doctor_schedule.findMany({
      take: 6,
      include: { doctor: { include: { department: true } } },
    }),
    prisma.bill.findMany({
      include: { payment: true },
    }),
    prisma.ward.findMany({
      include: { bed: true },
    }),
  ]);

  const bedOccupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Financial aggregates
  const totalInvoiced = bills.reduce((acc, b) => acc + Number(b.total_amount), 0);
  const totalCollected = bills.reduce(
    (acc, b) => acc + b.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0),
    0
  );
  const totalOutstanding = totalInvoiced - totalCollected;

  return (
    <div className="space-y-8">
      {/* Top Banner & Date Context */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Executive Clinical Census & Operations
          </h1>
          <p className="text-xs text-stone-500">
            Real-time hospital bed matrix, clinical queues, diagnostic telemetry, and financial ledger.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/appointments"
            className="flex items-center gap-1.5 rounded-lg border border-warm-border bg-white px-3 py-1.5 text-xs font-semibold text-charcoal-800 shadow-sm hover:bg-warm-subtle"
          >
            <span>View Full Roster</span>
            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
          </Link>
          <Link
            href="/inpatient"
            className="flex items-center gap-1.5 rounded-lg bg-terracotta-500 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-terracotta-600"
          >
            <Bed className="h-3.5 w-3.5" />
            <span>Manage Beds</span>
          </Link>
        </div>
      </div>

      {/* Critical Diagnostic Alerts Banner (DBMS Query 4 highlight) */}
      {criticalLabs.length > 0 && (
        <div className="rounded-xl border border-rose-200 bg-rose-50/70 p-4 shadow-warm">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-500 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-rose-800">
                  Critical Diagnostic Telemetry Alerts ({criticalLabs.length} Orders Pending Action)
                </h3>
                <Link
                  href="/lab"
                  className="text-xs font-semibold text-rose-700 underline hover:text-rose-900"
                >
                  Open Lab Worklist &rarr;
                </Link>
              </div>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {criticalLabs.map((lab) => (
                  <div
                    key={lab.order_id}
                    className="flex items-center justify-between rounded-lg border border-rose-200/80 bg-white px-3 py-2 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-charcoal-900">
                        {lab.patient.first_name} {lab.patient.last_name}
                      </span>
                      <span className="ml-2 text-stone-500">
                        ({lab.lab_test.test_name})
                      </span>
                    </div>
                    <span className="rounded bg-rose-100 px-2 py-0.5 font-mono text-[11px] font-bold text-rose-800">
                      {lab.test_result || "CRITICAL"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4 Core Vital Metric Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Metric 1: Bed Occupancy */}
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Ward Occupancy
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-600 border border-amber-200">
              <Bed className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-charcoal-900">
              {bedOccupancyRate}%
            </span>
            <span className="text-xs text-stone-500">
              ({occupiedBeds} of {totalBeds} beds)
            </span>
          </div>
          <div className="mt-3">
            <div className="h-2 w-full overflow-hidden rounded-full bg-warm-subtle">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-500"
                style={{ width: `${bedOccupancyRate}%` }}
              />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>{activeAdmissions} Active Admissions</span>
            <Link href="/inpatient" className="font-semibold text-terracotta-600 hover:underline">
              Inspect &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 2: Registered Patients */}
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Patient Registry
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-terracotta-50 text-terracotta-600 border border-terracotta-200">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-charcoal-900">
              {patientCount}
            </span>
            <span className="text-xs text-stone-500">Active Dossiers</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Comprehensive medical records with full longitudinal clinical history.
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>3NF Normalized</span>
            <Link href="/patients" className="font-semibold text-terracotta-600 hover:underline">
              Browse Directory &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 3: Consultations & Appointments */}
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Outpatient Clinic
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sage-50 text-sage-600 border border-sage-200">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-bold tracking-tight text-charcoal-900">
              {todayAppointments.length}
            </span>
            <span className="text-xs text-stone-500">Appointments Queued</span>
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Across Cardiology, Neurology, Ortho, Pediatrics, and Gen Med.
          </p>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>Slot Conflict Guards</span>
            <Link href="/appointments" className="font-semibold text-terracotta-600 hover:underline">
              Scheduler &rarr;
            </Link>
          </div>
        </div>

        {/* Metric 4: Invoicing & Ledger */}
        <div className="rounded-xl border border-warm-border bg-white p-5 shadow-warm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Revenue Settlement
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-700 border border-stone-200">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-2xl font-bold tracking-tight text-charcoal-900">
              {formatCurrency(totalCollected)}
            </span>
            <span className="text-[11px] text-stone-500">Settled</span>
          </div>
          <div className="mt-2 text-xs text-stone-500">
            <span>Outstanding Dues: </span>
            <span className="font-semibold text-amber-700">
              {formatCurrency(totalOutstanding)}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
            <span>Multi-tender Ledger</span>
            <Link href="/billing" className="font-semibold text-terracotta-600 hover:underline">
              Ledger &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Two Column Grid: Live Appointments & Recent Clinical Consultations */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Left: Active Appointment Flow */}
        <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
          <div className="flex items-center justify-between border-b border-warm-border pb-4">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-charcoal-900">
                Clinic Encounter Stream
              </h2>
              <p className="text-xs text-stone-500">
                Live outpatient queue and scheduled appointments.
              </p>
            </div>
            <Link
              href="/appointments"
              className="text-xs font-semibold text-terracotta-600 hover:underline"
            >
              View All ({todayAppointments.length}) &rarr;
            </Link>
          </div>

          <div className="mt-4 divide-y divide-warm-border">
            {todayAppointments.map((appt) => (
              <div key={appt.appointment_id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-warm-subtle text-xs font-bold text-charcoal-700">
                    {appt.patient.first_name[0]}
                    {appt.patient.last_name[0]}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/patients/${appt.patient_id}`}
                        className="text-xs font-semibold text-charcoal-900 hover:text-terracotta-600"
                      >
                        {appt.patient.first_name} {appt.patient.last_name}
                      </Link>
                      <span className="rounded bg-warm-subtle px-1.5 py-0.5 text-[10px] font-medium text-stone-600">
                        {appt.appointment_type.replace("_", " ")}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500">
                      Dr. {appt.doctor.first_name} {appt.doctor.last_name} •{" "}
                      {appt.doctor.department.department_name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      appt.status === "COMPLETED"
                        ? "bg-sage-50 text-sage-700 border border-sage-200"
                        : appt.status === "IN_CONSULTATION"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : appt.status === "CHECKED_IN"
                        ? "bg-sky-50 text-sky-700 border border-sky-200"
                        : appt.status === "CANCELLED"
                        ? "bg-stone-100 text-stone-500 border border-stone-200"
                        : "bg-terracotta-50 text-terracotta-700 border border-terracotta-200"
                    }`}
                  >
                    {appt.status.replace("_", " ")}
                  </span>
                  <div className="mt-0.5 text-[10px] text-stone-400">
                    {formatDate(appt.appointment_date)} • {formatTime(appt.appointment_time)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Ward Utilization Breakdown (DBMS Query 3 preview) */}
        <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
          <div className="flex items-center justify-between border-b border-warm-border pb-4">
            <div>
              <h2 className="text-sm font-bold tracking-tight text-charcoal-900">
                Inpatient Ward Bed Matrix
              </h2>
              <p className="text-xs text-stone-500">
                Real-time bed utilization across specialized hospital wings.
              </p>
            </div>
            <Link
              href="/inpatient"
              className="text-xs font-semibold text-terracotta-600 hover:underline"
            >
              Bed Board &rarr;
            </Link>
          </div>

          <div className="mt-4 space-y-4">
            {wards.map((ward) => {
              const occupied = ward.bed.filter((b) => b.status === "OCCUPIED").length;
              const available = ward.bed.filter((b) => b.status === "AVAILABLE").length;
              const rate = ward.total_beds > 0 ? Math.round((occupied / ward.total_beds) * 100) : 0;

              return (
                <div key={ward.ward_id} className="rounded-lg border border-warm-border bg-warm-bg/40 p-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-charcoal-900">
                        {ward.ward_name}
                      </span>
                      <span className="ml-2 rounded bg-white px-1.5 py-0.5 text-[10px] font-medium text-stone-500 border border-warm-border">
                        Floor {ward.floor_number} • {ward.ward_type}
                      </span>
                    </div>
                    <span className="font-mono text-xs font-semibold text-charcoal-800">
                      {occupied} / {ward.total_beds} Beds ({rate}%)
                    </span>
                  </div>

                  <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-warm-subtle">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        rate > 70 ? "bg-rose-500" : rate > 30 ? "bg-amber-500" : "bg-sage-500"
                      }`}
                      style={{ width: `${rate}%` }}
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-stone-500">
                    <span>
                      Daily Tariff: {formatCurrency(Number(ward.daily_rate))}/day
                    </span>
                    <span className="font-medium text-sage-700">
                      {available} Beds Available
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Clinical Encounters & ICD-10 Diagnoses (DBMS Query 1 showcase) */}
      <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
        <div className="flex items-center justify-between border-b border-warm-border pb-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-charcoal-900">
              Recent Clinical Documentation & Diagnoses
            </h2>
            <p className="text-xs text-stone-500">
              Structured clinical findings, vitals telemetry, and ICD-10 classifications.
            </p>
          </div>
          <Link
            href="/patients"
            className="text-xs font-semibold text-terracotta-600 hover:underline"
          >
            All Patient Dossiers &rarr;
          </Link>
        </div>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border text-[11px] uppercase tracking-wider text-stone-500">
                <th className="pb-3 font-semibold">Patient</th>
                <th className="pb-3 font-semibold">Attending Physician</th>
                <th className="pb-3 font-semibold">Symptoms & Clinical Notes</th>
                <th className="pb-3 font-semibold">Vitals (BP / HR / SpO2)</th>
                <th className="pb-3 font-semibold">ICD-10 Diagnoses</th>
                <th className="pb-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {recentConsultations.map((c) => (
                <tr key={c.consultation_id} className="hover:bg-warm-bg/50">
                  <td className="py-3 font-semibold text-charcoal-900">
                    <Link
                      href={`/patients/${c.patient_id}`}
                      className="hover:text-terracotta-600 hover:underline"
                    >
                      {c.patient.first_name} {c.patient.last_name}
                    </Link>
                    <div className="text-[10px] text-stone-400">
                      DOB: {formatDate(c.patient.date_of_birth)} ({c.patient.blood_group})
                    </div>
                  </td>
                  <td className="py-3 text-stone-700">
                    Dr. {c.doctor.first_name} {c.doctor.last_name}
                    <div className="text-[10px] text-stone-400">
                      {c.doctor.department.department_name}
                    </div>
                  </td>
                  <td className="max-w-xs py-3 text-stone-600">
                    <p className="truncate font-medium text-charcoal-800">{c.symptoms}</p>
                    <p className="truncate text-[11px] text-stone-500">{c.clinical_notes}</p>
                  </td>
                  <td className="py-3 font-mono text-[11px] text-stone-700">
                    <span className="font-semibold text-charcoal-900">
                      {c.blood_pressure || "—"}
                    </span>{" "}
                    | {c.heart_rate ? `${c.heart_rate} bpm` : "—"} |{" "}
                    {c.spo2_percent ? `${c.spo2_percent}%` : "—"}
                  </td>
                  <td className="py-3">
                    <div className="flex flex-wrap gap-1">
                      {c.diagnosis.map((d) => (
                        <span
                          key={d.diagnosis_id}
                          className="rounded bg-warm-subtle px-1.5 py-0.5 font-mono text-[10px] font-medium text-stone-700 border border-warm-border"
                          title={d.diagnosis_name}
                        >
                          {d.icd_code}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 text-right">
                    <Link
                      href={`/patients/${c.patient_id}`}
                      className="rounded border border-warm-border bg-white px-2 py-1 text-[11px] font-semibold text-charcoal-700 shadow-sm hover:bg-warm-subtle"
                    >
                      Dossier
                    </Link>
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
