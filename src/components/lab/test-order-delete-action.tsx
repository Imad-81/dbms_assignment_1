"use client";

import { DeleteButton } from "@/components/ui/delete-button";
import { deleteTestOrder } from "@/lib/actions";

export function TestOrderDeleteAction({
  orderId,
  testName,
  patientName,
}: {
  orderId: number;
  testName: string;
  patientName: string;
}) {
  return (
    <DeleteButton
      title="Delete Laboratory Order"
      description={`Are you sure you want to delete order ORD-${String(orderId).padStart(4, "0")} (${testName}) for ${patientName}?`}
      buttonLabel="Delete"
      iconOnly={true}
      onDelete={async () => deleteTestOrder(orderId)}
    />
  );
}
