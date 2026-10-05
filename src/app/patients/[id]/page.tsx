import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatDateTime, formatTime } from "@/lib/utils";
import { PatientDeleteAction } from "@/components/patients/patient-delete-action";
import {
  ArrowLeft,
  Calendar,
  Stethoscope,
  Pill,
  FlaskConical,
  Receipt,
  Bed,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  HeartPulse,
} from "lucide-react";

export const dynamic = "force-dynamic";

function calculateAge(dob: Date): number {
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default async function PatientDossierPage({
  params,
}: {
  params: { id: string };
}) {
  const patientId = parseInt(params.id, 10);
  if (isNaN(patientId)) notFound();

  // Multi-table longitudinal fetch (matches DBMS Query 1 requirements)
  const patient = await prisma.patient.findUnique({
    where: { patient_id: patientId },
    include: {
      consultation: {
        orderBy: { consultation_timestamp: "desc" },
        include: {
          doctor: { include: { department: true } },
          appointment: true,
          diagnosis: true,
          prescription: {
            include: { prescription_item: true },
          },
          test_order: {
            include: { lab_test: true },
          },
        },
      },
      appointment: {
        orderBy: { appointment_date: "desc" },
        include: { doctor: { include: { department: true } } },
      },
      admission: {
        orderBy: { admission_date: "desc" },
        include: {
          doctor: true,
          bed: { include: { ward: true } },
        },
      },
      bill: {
        orderBy: { bill_date: "desc" },
        include: { payment: true },
      },
      test_order: {
        orderBy: { order_date: "desc" },
        include: { lab_test: true, doctor: true },
      },
    },
  });

  if (!patient) notFound();

  const age = calculateAge(patient.date_of_birth);
  const activeAdmission = patient.admission.find((a) => a.status === "ADMITTED");

  return (
    <div className="space-y-6">
      {/* Back Link & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/patients"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-terracotta-600"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Master Patient Registry</span>
        </Link>
        <PatientDeleteAction
          patientId={patient.patient_id}
          patientName={`${patient.first_name} ${patient.last_name}`}
          buttonLabel="Delete Patient Record"
          iconOnly={false}
          redirectTo="/patients"
        />
      </div>

      {/* Patient Dossier Header Card */}
      <div className="rounded-2xl border border-warm-border bg-white p-6 shadow-warm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-terracotta-50 text-xl font-bold text-terracotta-700 border border-terracotta-200">
              {patient.first_name[0]}
              {patient.last_name[0]}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-xl font-bold text-charcoal-900">
                  {patient.first_name} {patient.last_name}
                </h1>
                <span className="rounded-md bg-warm-subtle px-2 py-0.5 font-mono text-xs font-bold text-stone-800 border border-warm-border">
                  {patient.blood_group}
                </span>
                {activeAdmission && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-bold text-rose-700 border border-rose-200">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                    Admitted ({activeAdmission.bed.ward.ward_name} • Bed {activeAdmission.bed.bed_number})
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
                <span className="font-mono text-stone-400">
                  MRN-{String(patient.patient_id).padStart(5, "0")}
                </span>
                <span>•</span>
                <span>
                  {age} years old ({patient.gender === "M" ? "Male" : "Female"})
                </span>
                <span>•</span>
                <span>DOB: {formatDate(patient.date_of_birth)}</span>
              </div>

              <div className="mt-3 flex flex-wrap gap-4 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-stone-400" />
                  <span>{patient.phone}</span>
                </div>
                {patient.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="h-3.5 w-3.5 text-stone-400" />
                    <span>{patient.email}</span>
                  </div>
                )}
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-stone-400" />
                  <span>{patient.address}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Emergency Contact Badge */}
          <div className="rounded-xl border border-warm-border bg-warm-bg/60 p-3 text-xs sm:max-w-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Emergency Contact
            </span>
            <div className="mt-1 font-semibold text-charcoal-900">
              {patient.emergency_contact_name}
            </div>
            <div className="text-[11px] text-stone-600">
              {patient.emergency_contact_phone}
            </div>
          </div>
        </div>
      </div>

      {/* Longitudinal Clinical Timeline (Showcases DBMS Query 1) */}
      <div className="space-y-6">
        <div>
          <h2 className="text-base font-bold tracking-tight text-charcoal-900">
            Longitudinal Clinical Encounters & Diagnostic Record
          </h2>
          <p className="text-xs text-stone-500">
            Cross-table record synthesizing clinical consultations, vitals, ICD-10 diagnoses, pharmacological regimens, and laboratory telemetry.
          </p>
        </div>

        {patient.consultation.length === 0 ? (
          <div className="rounded-xl border border-warm-border bg-white p-8 text-center text-xs text-stone-400">
            No clinical consultations recorded for this patient yet.
          </div>
        ) : (
          patient.consultation.map((c) => (
            <div
              key={c.consultation_id}
              className="rounded-xl border border-warm-border bg-white p-6 shadow-warm space-y-5"
            >
              {/* Encounter Header */}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-warm-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sage-50 text-sage-600 border border-sage-200">
                    <Stethoscope className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-charcoal-900">
                      Consultation with Dr. {c.doctor.first_name} {c.doctor.last_name}
                    </h3>
                    <div className="text-[11px] text-stone-500">
                      {c.doctor.department.department_name} • Specialty: {c.doctor.specialization}
                    </div>
                  </div>
                </div>

                <div className="text-right text-xs">
                  <span className="font-semibold text-charcoal-900">
                    {formatDate(c.consultation_timestamp)}
                  </span>
                  <div className="text-[11px] text-stone-400">
                    {formatTime(c.consultation_timestamp)}
                  </div>
                </div>
              </div>

              {/* Vitals & Clinical Examination */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-lg border border-warm-border bg-warm-bg/40 p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Blood Pressure
                  </span>
                  <div className="mt-1 font-mono text-base font-bold text-charcoal-900">
                    {c.blood_pressure || "—"}
                  </div>
                  <span className="text-[10px] text-stone-400">mmHg</span>
                </div>
                <div className="rounded-lg border border-warm-border bg-warm-bg/40 p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Heart Rate
                  </span>
                  <div className="mt-1 font-mono text-base font-bold text-charcoal-900">
                    {c.heart_rate ? `${c.heart_rate}` : "—"}
                  </div>
                  <span className="text-[10px] text-stone-400">bpm</span>
                </div>
                <div className="rounded-lg border border-warm-border bg-warm-bg/40 p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Body Temp
                  </span>
                  <div className="mt-1 font-mono text-base font-bold text-charcoal-900">
                    {c.temperature_celsius ? `${c.temperature_celsius}°C` : "—"}
                  </div>
                  <span className="text-[10px] text-stone-400">Celsius</span>
                </div>
                <div className="rounded-lg border border-warm-border bg-warm-bg/40 p-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                    Oxygen Sat (SpO2)
                  </span>
                  <div className="mt-1 font-mono text-base font-bold text-charcoal-900">
                    {c.spo2_percent ? `${c.spo2_percent}%` : "—"}
                  </div>
                  <span className="text-[10px] text-stone-400">Pulse Oximetry</span>
                </div>
              </div>

              {/* Symptoms & Subjective/Objective Clinical Notes */}
              <div className="space-y-2 text-xs">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[11px] text-stone-500">
                    Chief Complaints & Symptoms:
                  </span>
                  <p className="mt-0.5 rounded-lg bg-warm-bg/50 p-2.5 text-charcoal-800">
                    {c.symptoms}
                  </p>
                </div>
                <div>
                  <span className="font-bold uppercase tracking-wider text-[11px] text-stone-500">
                    Attending Clinical Assessment & Plan:
                  </span>
                  <p className="mt-0.5 rounded-lg bg-warm-bg/50 p-2.5 text-stone-700">
                    {c.clinical_notes}
                  </p>
                </div>
              </div>

              {/* ICD-10 Diagnoses Section */}
              {c.diagnosis.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    ICD-10 Diagnoses ({c.diagnosis.length})
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {c.diagnosis.map((d) => (
                      <div
                        key={d.diagnosis_id}
                        className="flex items-center gap-2 rounded-lg border border-warm-border bg-warm-bg/60 px-3 py-1.5 text-xs"
                      >
                        <span className="font-mono font-bold text-terracotta-600">
                          {d.icd_code}
                        </span>
                        <span className="font-semibold text-charcoal-800">
                          {d.diagnosis_name}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.2 text-[10px] font-bold ${
                            d.diagnosis_type === "CONFIRMED"
                              ? "bg-sage-100 text-sage-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {d.diagnosis_type}
                        </span>
                        {d.remarks && (
                          <span className="text-[11px] text-stone-500 border-l border-warm-border pl-2">
                            {d.remarks}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Pharmacological Regimen & Prescriptions */}
              {c.prescription.length > 0 && (
                <div className="space-y-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <Pill className="h-3.5 w-3.5 text-terracotta-500" />
                    <span>Prescribed Medications ({c.prescription[0]?.prescription_item.length || 0} Items)</span>
                  </span>
                  <div className="overflow-x-auto rounded-lg border border-warm-border">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-warm-bg/50 border-b border-warm-border text-[10px] uppercase text-stone-500">
                        <tr>
                          <th className="px-3 py-2 font-semibold">Medicine Name</th>
                          <th className="px-3 py-2 font-semibold">Dosage / Strength</th>
                          <th className="px-3 py-2 font-semibold">Frequency</th>
                          <th className="px-3 py-2 font-semibold">Duration</th>
                          <th className="px-3 py-2 font-semibold">Instructions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-warm-border">
                        {c.prescription.flatMap((pr) =>
                          pr.prescription_item.map((item) => (
                            <tr key={item.item_id}>
                              <td className="px-3 py-2 font-bold text-charcoal-900">
                                {item.medicine_name}
                              </td>
                              <td className="px-3 py-2 text-stone-600">
                                {item.dosage_form} • {item.strength}
                              </td>
                              <td className="px-3 py-2 font-mono text-[11px] text-stone-700">
                                {item.frequency}
                              </td>
                              <td className="px-3 py-2 text-stone-600">
                                {item.duration_days} days ({item.route})
                              </td>
                              <td className="px-3 py-2 text-stone-500">
                                {item.instructions || "As directed"}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Diagnostic Orders Linked to Consultation */}
              {c.test_order.length > 0 && (
                <div className="space-y-2">
                  <span className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    <FlaskConical className="h-3.5 w-3.5 text-amber-600" />
                    <span>Laboratory & Diagnostic Orders</span>
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {c.test_order.map((t) => (
                      <div
                        key={t.order_id}
                        className="rounded-lg border border-warm-border bg-warm-bg/30 p-3 text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-charcoal-900">
                            {t.lab_test.test_name}
                          </span>
                          <span
                            className={`rounded px-1.5 py-0.5 font-mono text-[10px] font-bold ${
                              t.abnormal_flag === "CRITICAL"
                                ? "bg-rose-100 text-rose-800"
                                : t.abnormal_flag === "ABNORMAL"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-sage-100 text-sage-800"
                            }`}
                          >
                            {t.abnormal_flag}
                          </span>
                        </div>
                        <div className="mt-1 text-[11px] text-stone-500">
                          Result:{" "}
                          <span className="font-semibold text-charcoal-800">
                            {t.test_result || "Awaiting Laboratory Processing"}
                          </span>
                        </div>
                        {t.reference_range_observed && (
                          <div className="mt-0.5 text-[10px] text-stone-400">
                            Reference: {t.reference_range_observed}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Inpatient History & Billing Ledger */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Inpatient Admissions */}
        <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
          <h3 className="text-sm font-bold text-charcoal-900">
            Inpatient Admissions & Ward Stay History
          </h3>
          <p className="text-xs text-stone-500">
            Ward allocations, bed numbers, and discharge summaries.
          </p>

          <div className="mt-4 space-y-3">
            {patient.admission.length === 0 ? (
              <p className="text-xs text-stone-400">No inpatient stays recorded.</p>
            ) : (
              patient.admission.map((adm) => (
                <div
                  key={adm.admission_id}
                  className="rounded-lg border border-warm-border bg-warm-bg/40 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-charcoal-900">
                      {adm.bed.ward.ward_name} (Bed {adm.bed.bed_number})
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        adm.status === "ADMITTED"
                          ? "bg-rose-100 text-rose-800"
                          : "bg-sage-100 text-sage-800"
                      }`}
                    >
                      {adm.status}
                    </span>
                  </div>
                  <div className="mt-1 text-stone-600">
                    Reason: {adm.admission_reason}
                  </div>
                  <div className="mt-1 text-[11px] text-stone-500">
                    Admitted: {formatDate(adm.admission_date)}
                    {adm.discharge_date && ` • Discharged: ${formatDate(adm.discharge_date)}`}
                  </div>
                  {adm.discharge_summary && (
                    <div className="mt-2 rounded bg-white p-2 text-[11px] text-stone-600 border border-warm-border">
                      <span className="font-semibold text-charcoal-800">Summary: </span>
                      {adm.discharge_summary}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Financial Billing Ledger */}
        <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
          <h3 className="text-sm font-bold text-charcoal-900">
            Financial Ledger & Invoices
          </h3>
          <p className="text-xs text-stone-500">
            Itemized consultation, diagnostic, ward, and medication fees.
          </p>

          <div className="mt-4 space-y-3">
            {patient.bill.length === 0 ? (
              <p className="text-xs text-stone-400">No invoices generated.</p>
            ) : (
              patient.bill.map((b) => {
                const paid = b.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0);
                const outstanding = Number(b.total_amount) - paid;

                return (
                  <div
                    key={b.bill_id}
                    className="rounded-lg border border-warm-border bg-warm-bg/40 p-3 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-charcoal-900">
                        INV-{String(b.bill_id).padStart(5, "0")} ({formatDate(b.bill_date)})
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                          b.payment_status === "PAID"
                            ? "bg-sage-100 text-sage-800"
                            : b.payment_status === "PARTIALLY_PAID"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-rose-100 text-rose-800"
                        }`}
                      >
                        {b.payment_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-stone-600 text-[11px]">
                      <span>
                        Consult: {formatCurrency(Number(b.consultation_charges))} | Labs:{" "}
                        {formatCurrency(Number(b.test_charges))} | Bed:{" "}
                        {formatCurrency(Number(b.bed_charges))}
                      </span>
                      <span className="font-mono font-bold text-charcoal-900">
                        Total: {formatCurrency(Number(b.total_amount))}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-t border-warm-border pt-1 text-[11px]">
                      <span className="text-stone-500">
                        Paid: {formatCurrency(paid)}
                      </span>
                      <span className="font-semibold text-rose-700">
                        Due: {formatCurrency(outstanding)}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
