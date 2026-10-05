"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { deletePatient } from "@/lib/actions";

export function PatientDeleteAction({
  patientId,
  patientName,
  redirectTo,
  buttonLabel,
  iconOnly = true,
}: {
  patientId: number;
  patientName: string;
  redirectTo?: string;
  buttonLabel?: string;
  iconOnly?: boolean;
}) {
  return (
    <DeleteButton
      title={`Delete Patient Dossier: ${patientName}`}
      description={`Are you sure you want to permanently delete ${patientName}'s dossier? This will perform a cascaded deletion of all associated appointments, consultations, diagnoses, prescriptions, lab orders, and financial invoices, releasing any currently occupied beds.`}
      buttonLabel={buttonLabel}
      iconOnly={iconOnly}
      redirectTo={redirectTo}
      onDelete={async () => deletePatient(patientId)}
    />
  );
}
