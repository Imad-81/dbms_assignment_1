"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { deleteAdmission } from "@/lib/actions";

export function AdmissionDeleteAction({
  admissionId,
  patientName,
  bedNumber,
}: {
  admissionId: number;
  patientName: string;
  bedNumber: string;
}) {
  return (
    <DeleteButton
      title="Cancel & Remove Inpatient Admission"
      description={`Are you sure you want to cancel admission #${admissionId} for ${patientName}? Bed ${bedNumber} will be immediately released back to AVAILABLE.`}
      buttonLabel="Cancel Stay"
      iconOnly={false}
      onDelete={async () => deleteAdmission(admissionId)}
    />
  );
}
