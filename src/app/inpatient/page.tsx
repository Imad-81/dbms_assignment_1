import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate } from "@/lib/utils";
import { AdmitPatientModal } from "@/components/inpatient/admit-patient-modal";
import { DischargePatientModal } from "@/components/inpatient/discharge-patient-modal";
import { AdmissionDeleteAction } from "@/components/inpatient/admission-delete-action";
import {
  Bed,
  Building,
  User,
  Clock,
  Activity,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InpatientPage() {
  const [wards, activeAdmissions, patients, doctors, availableBeds] = await Promise.all([
    // Query 3: Real-Time Inpatient Bed Occupancy & Capacity Report
    prisma.ward.findMany({
      include: {
        bed: {
          include: {
            admission: {
              where: { status: "ADMITTED" },
              include: {
                patient: true,
                doctor: true,
              },
            },
          },
        },
      },
      orderBy: { floor_number: "asc" },
    }),
    prisma.admission.findMany({
      where: { status: "ADMITTED" },
      orderBy: { admission_date: "desc" },
      include: {
        patient: true,
        doctor: { include: { department: true } },
        bed: { include: { ward: true } },
      },
    }),
    prisma.patient.findMany({
      select: { patient_id: true, first_name: true, last_name: true },
      orderBy: { first_name: "asc" },
    }),
    prisma.doctor.findMany({
      select: { doctor_id: true, first_name: true, last_name: true, specialization: true },
      orderBy: { first_name: "asc" },
    }),
    prisma.bed.findMany({
      where: { status: "AVAILABLE" },
      include: { ward: true },
      orderBy: { bed_number: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Inpatient Ward Census & Bed Matrix
          </h1>
          <p className="text-xs text-stone-500">
            Real-time ward capacity tracking, bed allocation telemetry, and patient discharge workflows.
          </p>
        </div>
        <AdmitPatientModal
          patients={patients}
          doctors={doctors}
          availableBeds={availableBeds}
        />
      </div>

      {/* Ward Occupancy & Capacity Aggregates (Showcases DBMS Query 3) */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {wards.map((w) => {
          const occupied = w.bed.filter((b) => b.status === "OCCUPIED").length;
          const available = w.bed.filter((b) => b.status === "AVAILABLE").length;
          const maintenance = w.bed.filter((b) => b.status === "MAINTENANCE").length;
          const rate = w.total_beds > 0 ? Math.round((occupied / w.total_beds) * 100) : 0;

          return (
            <div
              key={w.ward_id}
              className="rounded-xl border border-warm-border bg-white p-5 shadow-warm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xs font-bold text-charcoal-900">
                    {w.ward_name}
                  </h3>
                  <span className="rounded bg-warm-subtle px-1.5 py-0.5 text-[10px] font-semibold text-stone-600 border border-warm-border">
                    Floor {w.floor_number} • {w.ward_type}
                  </span>
                </div>
                <span className="font-mono text-xs font-bold text-charcoal-800">
                  {rate}%
                </span>
              </div>

              <div className="h-2 w-full overflow-hidden rounded-full bg-warm-subtle">
                <div
                  className={`h-full rounded-full transition-all ${
                    rate > 75 ? "bg-rose-500" : rate > 30 ? "bg-amber-500" : "bg-sage-500"
                  }`}
                  style={{ width: `${rate}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                <div className="rounded bg-rose-50 p-1.5 border border-rose-100">
                  <div className="font-bold text-rose-800">{occupied}</div>
                  <div className="text-rose-600">Occupied</div>
                </div>
                <div className="rounded bg-sage-50 p-1.5 border border-sage-100">
                  <div className="font-bold text-sage-800">{available}</div>
                  <div className="text-sage-600">Available</div>
                </div>
                <div className="rounded bg-stone-100 p-1.5 border border-stone-200">
                  <div className="font-bold text-stone-800">{maintenance}</div>
                  <div className="text-stone-600">Maint</div>
                </div>
              </div>

              <div className="text-[11px] text-stone-500 flex justify-between border-t border-warm-border pt-2">
                <span>Daily Tariff:</span>
                <span className="font-mono font-semibold text-charcoal-900">
                  {formatCurrency(Number(w.daily_rate))}/day
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Visual Ward Bed Matrix */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-warm-border pb-3">
          <div>
            <h2 className="text-base font-bold tracking-tight text-charcoal-900">
              Interactive Bed Matrix (28 Beds across 4 Wings)
            </h2>
            <p className="text-xs text-stone-500">
              Click on an occupied bed to view patient telemetry or initiate clinical discharge.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-sage-500" />
              <span className="text-stone-600">Available</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-terracotta-500" />
              <span className="text-stone-600">Occupied</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-stone-400" />
              <span className="text-stone-600">Maintenance</span>
            </span>
          </div>
        </div>

        {wards.map((ward) => (
          <div key={ward.ward_id} className="space-y-3">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-stone-400" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-charcoal-800">
                {ward.ward_name} ({ward.bed.length} Beds)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {ward.bed.map((b) => {
                const admission = b.admission[0];
                const isOccupied = b.status === "OCCUPIED" && admission;

                return (
                  <div
                    key={b.bed_id}
                    className={`rounded-xl border p-3 text-xs transition-all ${
                      b.status === "AVAILABLE"
                        ? "border-sage-200 bg-sage-50/50 hover:bg-sage-50"
                        : b.status === "OCCUPIED"
                        ? "border-terracotta-200 bg-terracotta-50/60 shadow-sm"
                        : "border-warm-border bg-stone-100 opacity-60"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-charcoal-900">
                        {b.bed_number}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                          b.status === "AVAILABLE"
                            ? "bg-sage-200 text-sage-800"
                            : b.status === "OCCUPIED"
                            ? "bg-terracotta-200 text-terracotta-800"
                            : "bg-stone-300 text-stone-700"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    {isOccupied ? (
                      <div className="mt-2 space-y-1">
                        <Link
                          href={`/patients/${admission.patient_id}`}
                          className="block truncate font-bold text-charcoal-900 hover:text-terracotta-600 hover:underline"
                        >
                          {admission.patient.first_name} {admission.patient.last_name}
                        </Link>
                        <div className="truncate text-[10px] text-stone-500">
                          Dr. {admission.doctor.last_name}
                        </div>
                        <div className="pt-2">
                          <DischargePatientModal
                            admissionId={admission.admission_id}
                            patientName={`${admission.patient.first_name} ${admission.patient.last_name}`}
                            bedNumber={b.bed_number}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="mt-4 text-[11px] text-stone-400">
                        {b.status === "AVAILABLE" ? "Ready for intake" : "Offline"}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Active Admissions Table */}
      <div className="rounded-xl border border-warm-border bg-white shadow-warm overflow-hidden">
        <div className="border-b border-warm-border bg-warm-bg/30 p-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-charcoal-900">
            Active Inpatient Registry ({activeAdmissions.length} Admitted Patients)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border bg-warm-bg/20 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <th className="px-5 py-3">Patient</th>
                <th className="px-5 py-3">Ward & Bed</th>
                <th className="px-5 py-3">Admitting Doctor</th>
                <th className="px-5 py-3">Admission Date</th>
                <th className="px-5 py-3">Clinical Indication</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {activeAdmissions.map((adm) => (
                <tr key={adm.admission_id} className="hover:bg-warm-bg/40">
                  <td className="px-5 py-3">
                    <Link
                      href={`/patients/${adm.patient_id}`}
                      className="font-bold text-charcoal-900 hover:text-terracotta-600 hover:underline"
                    >
                      {adm.patient.first_name} {adm.patient.last_name}
                    </Link>
                    <div className="text-[10px] text-stone-400">
                      {adm.patient.phone} • {adm.patient.blood_group}
                    </div>
                  </td>

                  <td className="px-5 py-3">
                    <div className="font-semibold text-charcoal-900">
                      {adm.bed.ward.ward_name}
                    </div>
                    <div className="font-mono text-[10px] text-stone-400">
                      Bed: {adm.bed.bed_number}
                    </div>
                  </td>

                  <td className="px-5 py-3 text-stone-700">
                    Dr. {adm.doctor.first_name} {adm.doctor.last_name}
                    <div className="text-[10px] text-stone-400">
                      {adm.doctor.department.department_name}
                    </div>
                  </td>

                  <td className="px-5 py-3 font-mono text-[11px] text-stone-600">
                    {formatDate(adm.admission_date)}
                  </td>

                  <td className="px-5 py-3 max-w-xs text-stone-600">
                    <p className="truncate">{adm.admission_reason}</p>
                  </td>

                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/patients/${adm.patient_id}`}
                        className="rounded border border-warm-border bg-white px-2 py-1 text-[11px] font-semibold text-stone-700 shadow-sm hover:bg-warm-subtle"
                      >
                        Dossier
                      </Link>
                      <DischargePatientModal
                        admissionId={adm.admission_id}
                        patientName={`${adm.patient.first_name} ${adm.patient.last_name}`}
                        bedNumber={adm.bed.bed_number}
                      />
                      <AdmissionDeleteAction
                        admissionId={adm.admission_id}
                        patientName={`${adm.patient.first_name} ${adm.patient.last_name}`}
                        bedNumber={adm.bed.bed_number}
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
  );
}
