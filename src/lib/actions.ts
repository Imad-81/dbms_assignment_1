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
