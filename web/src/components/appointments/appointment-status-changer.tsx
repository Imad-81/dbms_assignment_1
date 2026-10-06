"use client";

import { useState } from "react";
import { updateAppointmentStatus } from "@/lib/actions";
import { appointment_status_type } from "@prisma/client";

export function AppointmentStatusChanger({
  appointmentId,
  currentStatus,
}: {
  appointmentId: number;
  currentStatus: appointment_status_type;
}) {
  const [loading, setLoading] = useState(false);

  async function handleStatusChange(newStatus: appointment_status_type) {
    setLoading(true);
    await updateAppointmentStatus(appointmentId, newStatus);
    setLoading(false);
    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={currentStatus}
        disabled={loading}
        onChange={(e) => handleStatusChange(e.target.value as appointment_status_type)}
        className="rounded border border-warm-border bg-white px-2 py-1 text-[11px] font-semibold text-charcoal-800 shadow-sm focus:border-terracotta-500 focus:outline-none"
      >
        <option value="SCHEDULED">SCHEDULED</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="CHECKED_IN">CHECKED_IN</option>
        <option value="IN_CONSULTATION">IN_CONSULTATION</option>
        <option value="COMPLETED">COMPLETED</option>
        <option value="CANCELLED">CANCELLED</option>
      </select>
    </div>
  );
}
