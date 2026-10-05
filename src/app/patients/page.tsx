import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/utils";
import { RegisterPatientModal } from "@/components/patients/register-patient-modal";
import { PatientDeleteAction } from "@/components/patients/patient-delete-action";
import {
  Users,
  Search,
  Phone,
  Mail,
  Heart,
  ChevronRight,
  ShieldCheck,
  Calendar,
} from "lucide-react";

export const dynamic = "force-dynamic";

function calculateAge(dob: Date): number {
  const diff = Date.now() - new Date(dob).getTime();
  const ageDate = new Date(diff);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

export default async function PatientsPage({
  searchParams,
}: {
  searchParams: { q?: string; blood?: string };
}) {
  const query = searchParams.q || "";
  const bloodFilter = searchParams.blood || "";

  const whereClause: any = {};
  if (query) {
    whereClause.OR = [
      { first_name: { contains: query, mode: "insensitive" } },
      { last_name: { contains: query, mode: "insensitive" } },
      { phone: { contains: query } },
    ];
  }
  if (bloodFilter) {
    whereClause.blood_group = bloodFilter;
  }

  const patients = await prisma.patient.findMany({
    where: whereClause,
    orderBy: { patient_id: "asc" },
    include: {
      appointment: { take: 1, orderBy: { appointment_date: "desc" } },
      admission: { where: { status: "ADMITTED" } },
      consultation: { select: { consultation_id: true } },
    },
  });

  return (
    <div className="space-y-6">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Master Patient Registry & EMR Index
          </h1>
          <p className="text-xs text-stone-500">
            Comprehensive patient demographic index and longitudinal health dossiers.
          </p>
        </div>
        <RegisterPatientModal />
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-warm-border bg-white p-3 shadow-warm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-stone-400" />
          <form method="GET">
            <input
              name="q"
              defaultValue={query}
              type="text"
              placeholder="Search patient by name or phone..."
              className="w-full rounded-lg border border-warm-border bg-warm-bg/30 py-2 pl-9 pr-4 text-xs text-charcoal-900 focus:border-terracotta-500 focus:outline-none focus:ring-1 focus:ring-terracotta-500"
            />
          </form>
        </div>

        {/* Quick Blood Group Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-400 mr-1">
            Blood:
          </span>
          {["", "O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"].map((bg) => (
            <Link
              key={bg || "all"}
              href={`/patients?blood=${bg}${query ? `&q=${query}` : ""}`}
              className={`rounded-md px-2 py-1 font-mono text-[11px] font-semibold transition ${
                bloodFilter === bg
                  ? "bg-terracotta-500 text-white shadow-sm"
                  : "bg-warm-subtle text-stone-600 hover:bg-stone-200"
              }`}
            >
              {bg || "All"}
            </Link>
          ))}
        </div>
      </div>

      {/* Patient Directory Table */}
      <div className="rounded-xl border border-warm-border bg-white shadow-warm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border bg-warm-bg/40 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <th className="px-5 py-3.5">MRN / Patient Name</th>
                <th className="px-5 py-3.5">Age / Gender</th>
                <th className="px-5 py-3.5">Blood Group</th>
                <th className="px-5 py-3.5">Contact Information</th>
                <th className="px-5 py-3.5">Emergency Contact</th>
                <th className="px-5 py-3.5">Clinical Status</th>
                <th className="px-5 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-xs text-stone-400">
                    No matching patient records found in the Neon database.
                  </td>
                </tr>
              ) : (
                patients.map((p) => {
                  const age = calculateAge(p.date_of_birth);
                  const isAdmitted = p.admission.length > 0;

                  return (
                    <tr
                      key={p.patient_id}
                      className="group transition-colors hover:bg-warm-bg/50"
                    >
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-warm-subtle text-xs font-bold text-charcoal-700 border border-warm-border">
                            {p.first_name[0]}
                            {p.last_name[0]}
                          </div>
                          <div>
                            <Link
                              href={`/patients/${p.patient_id}`}
                              className="font-bold text-charcoal-900 group-hover:text-terracotta-600 hover:underline"
                            >
                              {p.first_name} {p.last_name}
                            </Link>
                            <div className="font-mono text-[10px] text-stone-400">
                              MRN-{String(p.patient_id).padStart(5, "0")}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-3.5 text-stone-700">
                        <span className="font-semibold text-charcoal-900">{age} yrs</span>
                        <span className="ml-1 text-stone-400">
                          ({p.gender === "M" ? "Male" : p.gender === "F" ? "Female" : p.gender})
                        </span>
                        <div className="text-[10px] text-stone-400">
                          DOB: {formatDate(p.date_of_birth)}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-block rounded-md bg-warm-subtle px-2 py-0.5 font-mono text-[11px] font-bold text-stone-800 border border-warm-border">
                          {p.blood_group}
                        </span>
                      </td>

                      <td className="px-5 py-3.5 text-stone-600">
                        <div className="flex items-center gap-1.5 text-charcoal-900 font-medium">
                          <Phone className="h-3 w-3 text-stone-400" />
                          <span>{p.phone}</span>
                        </div>
                        {p.email && (
                          <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                            <Mail className="h-3 w-3 text-stone-400" />
                            <span className="truncate max-w-[140px]">{p.email}</span>
                          </div>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-stone-600">
                        <div className="font-medium text-charcoal-800">
                          {p.emergency_contact_name}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {p.emergency_contact_phone}
                        </div>
                      </td>

                      <td className="px-5 py-3.5">
                        {isAdmitted ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200">
                            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                            Inpatient Admitted
                          </span>
                        ) : (
                          <span className="inline-block rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-medium text-sage-700 border border-sage-200">
                            Outpatient ({p.consultation.length} Encounters)
                          </span>
                        )}
                      </td>

                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/patients/${p.patient_id}`}
                            className="inline-flex items-center gap-1 rounded-lg border border-warm-border bg-white px-2.5 py-1 text-xs font-semibold text-charcoal-800 shadow-sm hover:bg-warm-subtle hover:text-terracotta-600"
                          >
                            <span>EMR Dossier</span>
                            <ChevronRight className="h-3.5 w-3.5 text-stone-400" />
                          </Link>
                          <PatientDeleteAction
                            patientId={p.patient_id}
                            patientName={`${p.first_name} ${p.last_name}`}
                            iconOnly={true}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
