import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDate, formatTime } from "@/lib/utils";
import { BookAppointmentModal } from "@/components/appointments/book-appointment-modal";
import { AppointmentStatusChanger } from "@/components/appointments/appointment-status-changer";
import {
  Calendar,
  Clock,
  UserCheck,
  Stethoscope,
  Filter,
  CheckCircle2,
  AlertCircle,
  Building,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AppointmentsPage({
  searchParams,
}: {
  searchParams: { status?: string; doctor?: string };
}) {
  const statusFilter = searchParams.status || "";
  const doctorFilter = searchParams.doctor ? parseInt(searchParams.doctor, 10) : undefined;

  const whereClause: any = {};
  if (statusFilter) whereClause.status = statusFilter;
  if (doctorFilter) whereClause.doctor_id = doctorFilter;

  const [appointments, schedules, patients, doctors] = await Promise.all([
    prisma.appointment.findMany({
      where: whereClause,
      orderBy: [{ appointment_date: "desc" }, { appointment_time: "asc" }],
      include: {
        patient: true,
        doctor: { include: { department: true } },
      },
    }),
    // Query 2 logic: Doctor Schedule & Appointment Load Analysis
    prisma.doctor_schedule.findMany({
      include: {
        doctor: {
          include: {
            department: true,
            appointment: {
              where: {
                status: { in: ["SCHEDULED", "CONFIRMED", "CHECKED_IN", "IN_CONSULTATION"] },
              },
            },
          },
        },
      },
      orderBy: [{ doctor: { department: { department_name: "asc" } } }, { day_of_week: "asc" }],
    }),
    prisma.patient.findMany({
      select: { patient_id: true, first_name: true, last_name: true },
      orderBy: { first_name: "asc" },
    }),
    prisma.doctor.findMany({
      select: {
        doctor_id: true,
        first_name: true,
        last_name: true,
        specialization: true,
        department: { select: { department_name: true } },
      },
      orderBy: { first_name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Header and Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-charcoal-900">
            Physician Rostering & Outpatient Scheduling
          </h1>
          <p className="text-xs text-stone-500">
            Real-time appointment slot booking, shift capacity evaluation, and clinic status transitions.
          </p>
        </div>
        <BookAppointmentModal patients={patients} doctors={doctors} />
      </div>

      {/* Doctor Schedule & Appointment Load Analysis (Showcases DBMS Query 2) */}
      <div className="rounded-xl border border-warm-border bg-white p-6 shadow-warm">
        <div className="flex items-center justify-between border-b border-warm-border pb-4">
          <div>
            <h2 className="text-sm font-bold tracking-tight text-charcoal-900">
              Physician Capacity & Shift Roster (DBMS Query 2)
            </h2>
            <p className="text-xs text-stone-500">
              Evaluates doctor shift availability, total patient capacity, and remaining unbooked slots.
            </p>
          </div>
          <span className="rounded bg-warm-subtle px-2 py-1 font-mono text-[11px] font-semibold text-stone-600 border border-warm-border">
            16 Weekly Shifts
          </span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {schedules.map((s) => {
            const bookedCount = s.doctor.appointment.length;
            const availableSlots = Math.max(0, s.max_patients - bookedCount);
            const loadPercent = Math.min(100, Math.round((bookedCount / s.max_patients) * 100));

            return (
              <div
                key={s.schedule_id}
                className="rounded-xl border border-warm-border bg-warm-bg/30 p-4 transition hover:bg-warm-bg/60"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xs font-bold text-charcoal-900">
                      Dr. {s.doctor.first_name} {s.doctor.last_name}
                    </h3>
                    <p className="text-[11px] text-stone-500">
                      {s.doctor.department.department_name}
                    </p>
                  </div>
                  <span className="rounded bg-white px-2 py-0.5 font-mono text-[10px] font-bold text-stone-700 border border-warm-border">
                    {s.day_of_week}
                  </span>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs text-stone-600">
                  <Clock className="h-3.5 w-3.5 text-stone-400" />
                  <span>
                    {formatTime(s.start_time)} – {formatTime(s.end_time)} ({s.slot_duration_minutes}m slots)
                  </span>
                </div>

                <div className="mt-3 space-y-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-500">
                      Load: {bookedCount} / {s.max_patients} Patients
                    </span>
                    <span className="font-semibold text-sage-700">
                      {availableSlots} Slots Left
                    </span>
                  </div>
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-warm-subtle">
                    <div
                      className={`h-full rounded-full transition-all ${
                        loadPercent > 80
                          ? "bg-rose-500"
                          : loadPercent > 40
                          ? "bg-amber-500"
                          : "bg-sage-500"
                      }`}
                      style={{ width: `${loadPercent}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Appointment Queue and Table */}
      <div className="rounded-xl border border-warm-border bg-white shadow-warm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-warm-border bg-warm-bg/30 p-4">
          <div className="flex items-center gap-2 text-xs font-bold text-charcoal-900">
            <Calendar className="h-4 w-4 text-terracotta-500" />
            <span>Active Outpatient Queue ({appointments.length} Appointments)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-stone-400">Status:</span>
            {["", "SCHEDULED", "CONFIRMED", "CHECKED_IN", "IN_CONSULTATION", "COMPLETED"].map(
              (st) => (
                <Link
                  key={st || "all"}
                  href={`/appointments?status=${st}`}
                  className={`rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                    statusFilter === st
                      ? "bg-terracotta-500 text-white"
                      : "bg-white text-stone-600 hover:bg-stone-100 border border-warm-border"
                  }`}
                >
                  {st || "All"}
                </Link>
              )
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-warm-border bg-warm-bg/20 text-[11px] font-semibold uppercase tracking-wider text-stone-500">
                <th className="px-5 py-3.5">Date & Slot</th>
                <th className="px-5 py-3.5">Patient Details</th>
                <th className="px-5 py-3.5">Attending Physician</th>
                <th className="px-5 py-3.5">Visit Classification</th>
                <th className="px-5 py-3.5">Reason for Visit</th>
                <th className="px-5 py-3.5">Appointment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-border">
              {appointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-xs text-stone-400">
                    No appointments match the selected filter.
                  </td>
                </tr>
              ) : (
                appointments.map((a) => (
                  <tr key={a.appointment_id} className="hover:bg-warm-bg/40">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-charcoal-900">
                        {formatDate(a.appointment_date)}
                      </div>
                      <div className="font-mono text-[11px] text-stone-400">
                        {formatTime(a.appointment_time)}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <Link
                        href={`/patients/${a.patient_id}`}
                        className="font-bold text-charcoal-900 hover:text-terracotta-600 hover:underline"
                      >
                        {a.patient.first_name} {a.patient.last_name}
                      </Link>
                      <div className="text-[10px] text-stone-400">
                        {a.patient.phone} • {a.patient.blood_group}
                      </div>
                    </td>

                    <td className="px-5 py-3.5 text-stone-700">
                      <span className="font-semibold text-charcoal-900">
                        Dr. {a.doctor.first_name} {a.doctor.last_name}
                      </span>
                      <div className="text-[10px] text-stone-400">
                        {a.doctor.department.department_name}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span className="rounded bg-warm-subtle px-2 py-0.5 text-[11px] font-medium text-stone-700 border border-warm-border">
                        {a.appointment_type.replace("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 max-w-xs text-stone-600">
                      <p className="truncate">{a.reason_for_visit || "General consultation"}</p>
                    </td>

                    <td className="px-5 py-3.5">
                      <AppointmentStatusChanger
                        appointmentId={a.appointment_id}
                        currentStatus={a.status}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
