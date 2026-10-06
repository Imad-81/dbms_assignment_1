"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { deleteAppointment } from "@/lib/actions";

export function AppointmentDeleteAction({
  appointmentId,
  patientName,
  slotTime,
}: {
  appointmentId: number;
  patientName: string;
  slotTime: string;
}) {
  return (
    <DeleteButton
      title="Cancel & Delete Appointment"
      description={`Are you sure you want to permanently delete appointment #${appointmentId} for ${patientName} at ${slotTime}? Any linked consultations or invoices will also be removed.`}
      buttonLabel="Delete"
      iconOnly={true}
      onDelete={async () => deleteAppointment(appointmentId)}
    />
  );
}
