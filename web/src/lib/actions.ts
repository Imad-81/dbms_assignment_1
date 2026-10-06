"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  appointment_status_type,
  appointment_visit_type,
  lab_abnormal_flag,
  lab_order_status,
  payment_tender_method,
} from "@prisma/client";

// ============================================================================
// 1. PATIENT ACTIONS
// ============================================================================

export async function createPatient(formData: FormData) {
  try {
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const dateOfBirth = new Date(formData.get("date_of_birth") as string);
    const gender = formData.get("gender") as string;
    const bloodGroup = formData.get("blood_group") as string;
    const phone = formData.get("phone") as string;
    const email = (formData.get("email") as string) || null;
    const address = formData.get("address") as string;
    const emergencyContactName = formData.get("emergency_contact_name") as string;
    const emergencyContactPhone = formData.get("emergency_contact_phone") as string;

    const patient = await prisma.patient.create({
      data: {
        first_name: firstName,
        last_name: lastName,
        date_of_birth: dateOfBirth,
        gender,
        blood_group: bloodGroup,
        phone,
        email,
        address,
        emergency_contact_name: emergencyContactName,
        emergency_contact_phone: emergencyContactPhone,
      },
    });

    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true, patientId: patient.patient_id };
  } catch (error: any) {
    console.error("Error creating patient:", error);
    return { success: false, error: error.message || "Failed to create patient" };
  }
}

// ============================================================================
// 2. APPOINTMENT ACTIONS
// ============================================================================

export async function createAppointment(formData: FormData) {
  try {
    const patientId = parseInt(formData.get("patient_id") as string, 10);
    const doctorId = parseInt(formData.get("doctor_id") as string, 10);
    const appointmentDate = new Date(formData.get("appointment_date") as string);
    const timeStr = formData.get("appointment_time") as string; // "09:30"
    const appointmentTime = new Date(`1970-01-01T${timeStr}:00Z`);
    const appointmentType = (formData.get("appointment_type") as appointment_visit_type) || "NEW_VISIT";
    const reasonForVisit = (formData.get("reason_for_visit") as string) || null;

    // Check slot conflict
    const existing = await prisma.appointment.findFirst({
      where: {
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: { notIn: ["CANCELLED"] },
      },
    });

    if (existing) {
      return { success: false, error: "Doctor already has an appointment booked at this slot." };
    }

    const appt = await prisma.appointment.create({
      data: {
        patient_id: patientId,
        doctor_id: doctorId,
        appointment_date: appointmentDate,
        appointment_time: appointmentTime,
        status: "SCHEDULED",
        appointment_type: appointmentType,
        reason_for_visit: reasonForVisit,
      },
    });

    revalidatePath("/appointments");
    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true, appointmentId: appt.appointment_id };
  } catch (error: any) {
    console.error("Error creating appointment:", error);
    return { success: false, error: error.message || "Failed to book appointment" };
  }
}

export async function updateAppointmentStatus(appointmentId: number, status: appointment_status_type) {
  try {
    await prisma.appointment.update({
      where: { appointment_id: appointmentId },
      data: { status },
    });

    revalidatePath("/appointments");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error updating appointment status:", error);
    return { success: false, error: error.message || "Failed to update status" };
  }
}

// ============================================================================
// 3. INPATIENT ADMISSIONS & DISCHARGE
// ============================================================================

export async function admitPatient(formData: FormData) {
  try {
    const patientId = parseInt(formData.get("patient_id") as string, 10);
    const doctorId = parseInt(formData.get("doctor_id") as string, 10);
    const bedId = parseInt(formData.get("bed_id") as string, 10);
    const reason = formData.get("admission_reason") as string;

    // Transaction: create admission and mark bed OCCUPIED
    const result = await prisma.$transaction(async (tx) => {
      const targetBed = await tx.bed.findUnique({
        where: { bed_id: bedId },
      });

      if (!targetBed || targetBed.status !== "AVAILABLE") {
        throw new Error("Selected bed is not available for admission.");
      }

      const admission = await tx.admission.create({
        data: {
          patient_id: patientId,
          admitting_doctor_id: doctorId,
          bed_id: bedId,
          admission_reason: reason,
          status: "ADMITTED",
        },
      });

      await tx.bed.update({
        where: { bed_id: bedId },
        data: { status: "OCCUPIED" },
      });

      return admission;
    });

    revalidatePath("/inpatient");
    revalidatePath("/");
    return { success: true, admissionId: result.admission_id };
  } catch (error: any) {
    console.error("Error admitting patient:", error);
    return { success: false, error: error.message || "Failed to admit patient" };
  }
}

export async function dischargePatient(formData: FormData) {
  try {
    const admissionId = parseInt(formData.get("admission_id") as string, 10);
    const dischargeSummary = formData.get("discharge_summary") as string;

    await prisma.$transaction(async (tx) => {
      const admission = await tx.admission.findUnique({
        where: { admission_id: admissionId },
        include: { bed: { include: { ward: true } }, doctor: true },
      });

      if (!admission || admission.status !== "ADMITTED") {
        throw new Error("Active admission record not found.");
      }

      const dischargeDate = new Date();
      await tx.admission.update({
        where: { admission_id: admissionId },
        data: {
          status: "DISCHARGED",
          discharge_date: dischargeDate,
          discharge_summary: dischargeSummary,
        },
      });

      // Free bed
      await tx.bed.update({
        where: { bed_id: admission.bed_id },
        data: { status: "AVAILABLE" },
      });

      // Auto-generate inpatient invoice if not already generated
      const days = Math.max(
        1,
        Math.ceil((dischargeDate.getTime() - admission.admission_date.getTime()) / (1000 * 60 * 60 * 24))
      );
      const bedRate = Number(admission.bed.ward.daily_rate);
      const bedCharges = days * bedRate;
      const docFee = Number(admission.doctor.consultation_fee) * days;
      const tax = (bedCharges + docFee) * 0.05;
      const total = bedCharges + docFee + tax;

      const existingBill = await tx.bill.findUnique({
        where: { admission_id: admissionId },
      });

      if (!existingBill) {
        await tx.bill.create({
          data: {
            patient_id: admission.patient_id,
            admission_id: admissionId,
            consultation_charges: docFee,
            bed_charges: bedCharges,
            tax_amount: tax,
            total_amount: total,
            payment_status: "PENDING",
          },
        });
      }
    });

    revalidatePath("/inpatient");
    revalidatePath("/billing");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error discharging patient:", error);
    return { success: false, error: error.message || "Failed to discharge patient" };
  }
}

// ============================================================================
// 4. DIAGNOSTIC LAB ORDERS & RESULTS
// ============================================================================

export async function orderLabTest(formData: FormData) {
  try {
    const patientId = parseInt(formData.get("patient_id") as string, 10);
    const doctorId = parseInt(formData.get("doctor_id") as string, 10);
    const testId = parseInt(formData.get("test_id") as string, 10);
    const consultationId = parseInt(formData.get("consultation_id") as string, 10);

    const order = await prisma.test_order.create({
      data: {
        patient_id: patientId,
        ordered_by_doctor_id: doctorId,
        test_id: testId,
        consultation_id: consultationId,
        order_status: "ORDERED",
        abnormal_flag: "PENDING",
      },
    });

    revalidatePath("/lab");
    revalidatePath("/");
    return { success: true, orderId: order.order_id };
  } catch (error: any) {
    console.error("Error ordering test:", error);
    return { success: false, error: error.message || "Failed to order lab test" };
  }
}

export async function recordLabResult(formData: FormData) {
  try {
    const orderId = parseInt(formData.get("order_id") as string, 10);
    const testResult = formData.get("test_result") as string;
    const referenceObserved = formData.get("reference_range_observed") as string;
    const abnormalFlag = formData.get("abnormal_flag") as lab_abnormal_flag;
    const technicianRemarks = formData.get("technician_remarks") as string;

    await prisma.test_order.update({
      where: { order_id: orderId },
      data: {
        test_result: testResult,
        reference_range_observed: referenceObserved,
        abnormal_flag: abnormalFlag,
        technician_remarks: technicianRemarks,
        order_status: "COMPLETED",
        result_date: new Date(),
      },
    });

    revalidatePath("/lab");
    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error recording lab result:", error);
    return { success: false, error: error.message || "Failed to record lab result" };
  }
}

// ============================================================================
// 5. BILLING & PAYMENTS
// ============================================================================

export async function recordPayment(formData: FormData) {
  try {
    const billId = parseInt(formData.get("bill_id") as string, 10);
    const amountPaid = parseFloat(formData.get("amount_paid") as string);
    const paymentMethod = formData.get("payment_method") as payment_tender_method;
    const transactionReference = (formData.get("transaction_reference") as string) || null;
    const notes = (formData.get("notes") as string) || null;

    await prisma.$transaction(async (tx) => {
      await tx.payment.create({
        data: {
          bill_id: billId,
          amount_paid: amountPaid,
          payment_method: paymentMethod,
          transaction_reference: transactionReference,
          notes,
        },
      });

      // Recalculate bill balance
      const bill = await tx.bill.findUnique({
        where: { bill_id: billId },
        include: { payment: true },
      });

      if (bill) {
        const totalPaid = bill.payment.reduce((acc, p) => acc + Number(p.amount_paid), 0);
        const billTotal = Number(bill.total_amount);

        let newStatus = bill.payment_status;
        if (totalPaid >= billTotal) {
          newStatus = "PAID";
        } else if (totalPaid > 0) {
          newStatus = "PARTIALLY_PAID";
        }

        await tx.bill.update({
          where: { bill_id: billId },
          data: { payment_status: newStatus },
        });
      }
    });

    revalidatePath("/billing");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error recording payment:", error);
    return { success: false, error: error.message || "Failed to record payment" };
  }
}

// ============================================================================
// 6. RECORD DELETION ACTIONS (CASCADE / REFERENTIAL INTEGRITY TRANSACTIONS)
// ============================================================================

export async function deletePatient(patientId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // 1. Release any active beds occupied by this patient
      const activeAdmissions = await tx.admission.findMany({
        where: { patient_id: patientId, status: "ADMITTED" },
      });
      for (const adm of activeAdmissions) {
        await tx.bed.update({
          where: { bed_id: adm.bed_id },
          data: { status: "AVAILABLE" },
        });
      }

      // 2. Delete payments linked to bills of this patient, then the bills
      const patientBills = await tx.bill.findMany({
        where: { patient_id: patientId },
        select: { bill_id: true },
      });
      const billIds = patientBills.map((b) => b.bill_id);
      if (billIds.length > 0) {
        await tx.payment.deleteMany({
          where: { bill_id: { in: billIds } },
        });
        await tx.bill.deleteMany({
          where: { bill_id: { in: billIds } },
        });
      }

      // 3. Delete diagnostic test orders for this patient
      await tx.test_order.deleteMany({
        where: { patient_id: patientId },
      });

      // 4. Delete clinical consultations and their prescriptions/diagnoses
      const patientConsultations = await tx.consultation.findMany({
        where: { patient_id: patientId },
        select: { consultation_id: true },
      });
      const consultIds = patientConsultations.map((c) => c.consultation_id);

      if (consultIds.length > 0) {
        const prescriptions = await tx.prescription.findMany({
          where: { consultation_id: { in: consultIds } },
          select: { prescription_id: true },
        });
        const prescIds = prescriptions.map((p) => p.prescription_id);
        if (prescIds.length > 0) {
          await tx.prescription_item.deleteMany({
            where: { prescription_id: { in: prescIds } },
          });
          await tx.prescription.deleteMany({
            where: { prescription_id: { in: prescIds } },
          });
        }

        await tx.diagnosis.deleteMany({
          where: { consultation_id: { in: consultIds } },
        });

        await tx.consultation.deleteMany({
          where: { consultation_id: { in: consultIds } },
        });
      }

      // 5. Delete admissions
      await tx.admission.deleteMany({
        where: { patient_id: patientId },
      });

      // 6. Delete appointments
      await tx.appointment.deleteMany({
        where: { patient_id: patientId },
      });

      // 7. Delete patient
      await tx.patient.delete({
        where: { patient_id: patientId },
      });
    });

    revalidatePath("/patients");
    revalidatePath("/appointments");
    revalidatePath("/inpatient");
    revalidatePath("/lab");
    revalidatePath("/billing");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting patient:", error);
    return { success: false, error: error.message || "Failed to delete patient" };
  }
}

export async function deleteAppointment(appointmentId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      // If linked bill exists, delete payments and bill
      const linkedBill = await tx.bill.findUnique({
        where: { appointment_id: appointmentId },
      });
      if (linkedBill) {
        await tx.payment.deleteMany({ where: { bill_id: linkedBill.bill_id } });
        await tx.bill.delete({ where: { bill_id: linkedBill.bill_id } });
      }

      // If linked consultation exists, delete its child records
      const linkedConsult = await tx.consultation.findUnique({
        where: { appointment_id: appointmentId },
      });
      if (linkedConsult) {
        const prescs = await tx.prescription.findMany({
          where: { consultation_id: linkedConsult.consultation_id },
          select: { prescription_id: true },
        });
        const prescIds = prescs.map((p) => p.prescription_id);
        if (prescIds.length > 0) {
          await tx.prescription_item.deleteMany({
            where: { prescription_id: { in: prescIds } },
          });
          await tx.prescription.deleteMany({
            where: { prescription_id: { in: prescIds } },
          });
        }
        await tx.diagnosis.deleteMany({
          where: { consultation_id: linkedConsult.consultation_id },
        });
        await tx.test_order.deleteMany({
          where: { consultation_id: linkedConsult.consultation_id },
        });
        await tx.consultation.delete({
          where: { consultation_id: linkedConsult.consultation_id },
        });
      }

      await tx.appointment.delete({
        where: { appointment_id: appointmentId },
      });
    });

    revalidatePath("/appointments");
    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting appointment:", error);
    return { success: false, error: error.message || "Failed to delete appointment" };
  }
}

export async function deleteAdmission(admissionId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      const admission = await tx.admission.findUnique({
        where: { admission_id: admissionId },
      });

      if (!admission) throw new Error("Admission record not found.");

      // Release bed back to AVAILABLE
      await tx.bed.update({
        where: { bed_id: admission.bed_id },
        data: { status: "AVAILABLE" },
      });

      // Delete linked bill and payments if exists
      const linkedBill = await tx.bill.findUnique({
        where: { admission_id: admissionId },
      });
      if (linkedBill) {
        await tx.payment.deleteMany({ where: { bill_id: linkedBill.bill_id } });
        await tx.bill.delete({ where: { bill_id: linkedBill.bill_id } });
      }

      await tx.admission.delete({
        where: { admission_id: admissionId },
      });
    });

    revalidatePath("/inpatient");
    revalidatePath("/patients");
    revalidatePath("/billing");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting admission:", error);
    return { success: false, error: error.message || "Failed to remove admission" };
  }
}

export async function deleteTestOrder(orderId: number) {
  try {
    await prisma.test_order.delete({
      where: { order_id: orderId },
    });

    revalidatePath("/lab");
    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting lab order:", error);
    return { success: false, error: error.message || "Failed to delete lab order" };
  }
}

export async function deleteBill(billId: number) {
  try {
    await prisma.$transaction(async (tx) => {
      await tx.payment.deleteMany({
        where: { bill_id: billId },
      });
      await tx.bill.delete({
        where: { bill_id: billId },
      });
    });

    revalidatePath("/billing");
    revalidatePath("/patients");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    console.error("Error deleting bill:", error);
    return { success: false, error: error.message || "Failed to delete invoice" };
  }
}
