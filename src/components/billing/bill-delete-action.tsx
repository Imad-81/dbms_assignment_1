"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { deleteBill } from "@/lib/actions";

export function BillDeleteAction({
  billId,
  patientName,
  totalAmount,
}: {
  billId: number;
  patientName: string;
  totalAmount: string;
}) {
  return (
    <DeleteButton
      title="Delete Invoice Statement"
      description={`Are you sure you want to delete invoice INV-${String(billId).padStart(5, "0")} (${totalAmount}) for ${patientName}? All recorded tender receipts for this invoice will also be removed.`}
      buttonLabel="Delete"
      iconOnly={true}
      onDelete={async () => deleteBill(billId)}
    />
  );
}
