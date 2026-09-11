/**
 * Hospital Appointment and Patient Care Management System (HAPCMS)
 * Prisma ORM Clinical & Analytical Demonstration Script
 * 
 * Demonstrates:
 * 1. Type-safe ORM connectivity via @prisma/client
 * 2. Deep relational graph traversal (Patient -> Appointment -> Doctor -> Consultation -> Diagnosis -> Prescription)
 * 3. Inpatient ward capacity and bed occupancy analysis
 * 4. Financial billing reconciliation and payment status calculation
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['error', 'warn']
});

function formatCurrency(amount) {
  return `$${Number(amount || 0).toFixed(2)}`;
}

async function ensureDatabaseConnected(maxRetries = 3, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await prisma.$queryRaw`SELECT 1;`;
      return true;
    } catch (err) {
      if (attempt === maxRetries) throw err;
      console.log(`⏳ Database compute waking up (attempt ${attempt}/${maxRetries}), retrying in ${delayMs/1000}s...`);
      await new Promise(res => setTimeout(res, delayMs));
    }
  }
}

async function runPrismaDemonstration() {
  console.log('\n=================================================================');
  console.log('🏥 HAPCMS — PRISMA ORM & RELATIONAL QUERY ENGINE DEMONSTRATION');
  console.log('=================================================================');

  try {
    await ensureDatabaseConnected();

    // -------------------------------------------------------------------------
    // 1. SYSTEM HEALTH & TABLE RECORD COUNTS
    // -------------------------------------------------------------------------
    console.log('\n📊 1. LIVE RELATIONAL RECORD AUDIT (via Prisma Models):');
    const [
      departmentCount,
      doctorCount,
      patientCount,
      appointmentCount,
      consultationCount,
      diagnosisCount,
      prescriptionCount,
      wardCount,
      bedCount,
      admissionCount,
      billCount,
      paymentCount
    ] = await Promise.all([
      prisma.department.count(),
      prisma.doctor.count(),
      prisma.patient.count(),
      prisma.appointment.count(),
      prisma.consultation.count(),
      prisma.diagnosis.count(),
      prisma.prescription.count(),
      prisma.ward.count(),
      prisma.bed.count(),
      prisma.admission.count(),
      prisma.bill.count(),
      prisma.payment.count()
    ]);

    const counts = [
      { Entity: 'department', Count: departmentCount, Cluster: 'Provider & Roster' },
      { Entity: 'doctor', Count: doctorCount, Cluster: 'Provider & Roster' },
      { Entity: 'patient', Count: patientCount, Cluster: 'Patient & Appointment' },
      { Entity: 'appointment', Count: appointmentCount, Cluster: 'Patient & Appointment' },
      { Entity: 'consultation', Count: consultationCount, Cluster: 'Clinical Care' },
      { Entity: 'diagnosis', Count: diagnosisCount, Cluster: 'Clinical Care' },
      { Entity: 'prescription', Count: prescriptionCount, Cluster: 'Clinical Care' },
      { Entity: 'ward', Count: wardCount, Cluster: 'Inpatient Facilities' },
      { Entity: 'bed', Count: bedCount, Cluster: 'Inpatient Facilities' },
      { Entity: 'admission', Count: admissionCount, Cluster: 'Inpatient Facilities' },
      { Entity: 'bill', Count: billCount, Cluster: 'Financial & Accounts' },
      { Entity: 'payment', Count: paymentCount, Cluster: 'Financial & Accounts' }
    ];
    console.table(counts);

    // -------------------------------------------------------------------------
    // 2. LONGITUDINAL PATIENT CARE RECORD (DEEP RELATIONAL TRAVERSAL)
    // -------------------------------------------------------------------------
    console.log('\n=================================================================');
    console.log('📋 2. LONGITUDINAL PATIENT SUMMARY (Deep Graph Traversal in 1 ORM Call)');
    console.log('=================================================================');

    const patient = await prisma.patient.findUnique({
      where: { patient_id: 1 },
      include: {
        appointment: {
          include: {
            doctor: {
              include: { department: true }
            },
            consultation: {
              include: {
                diagnosis: true,
                prescription: {
                  include: { prescription_item: true }
                }
              }
            }
          }
        },
        admission: {
          include: {
            bed: { include: { ward: true } },
            doctor: true
          }
        },
        bill: {
          include: { payment: true }
        }
      }
    });

    if (patient) {
      console.log(`👤 PATIENT PROFILE: ${patient.first_name} ${patient.last_name}`);
      console.log(`   DOB: ${patient.date_of_birth.toISOString().split('T')[0]} | Gender: ${patient.gender} | Blood: ${patient.blood_group}`);
      console.log(`   Emergency Contact: ${patient.emergency_contact_name} (${patient.emergency_contact_phone})`);

      console.log('\n   🩺 OUTPATIENT CONSULTATION ENCOUNTERS:');
      patient.appointment.forEach((apt, idx) => {
        const doc = apt.doctor;
        const consult = apt.consultation;
        console.log(`   [Visit #${idx + 1}] Date: ${apt.appointment_date.toISOString().split('T')[0]} | Status: ${apt.status} | Type: ${apt.appointment_type}`);
        console.log(`            Attending Physician: Dr. ${doc.first_name} ${doc.last_name} (${doc.department.department_name})`);
        
        if (consult) {
          console.log(`            Symptoms: "${consult.symptoms}"`);
          console.log(`            Vitals: BP ${consult.blood_pressure || 'N/A'}, HR ${consult.heart_rate || 'N/A'} bpm, Temp ${consult.temperature_celsius || 'N/A'}°C`);
          
          if (consult.diagnosis.length > 0) {
            const diags = consult.diagnosis.map(d => `${d.diagnosis_name} [${d.icd_code} - ${d.diagnosis_type}]`).join(', ');
            console.log(`            Diagnoses: ${diags}`);
          }
          
          if (consult.prescription.length > 0) {
            consult.prescription.forEach(rx => {
              const meds = rx.prescription_item.map(item => `${item.medicine_name} ${item.strength} (${item.dosage_form}, ${item.frequency} x ${item.duration_days}d)`).join('; ');
              console.log(`            Prescriptions: ${meds}`);
            });
          }
        }
      });

      if (patient.admission.length > 0) {
        console.log('\n   🛏️ INPATIENT ADMISSIONS:');
        patient.admission.forEach(adm => {
          console.log(`   [Admission #${adm.admission_id}] Admitted: ${adm.admission_date.toISOString().split('T')[0]} | Ward: ${adm.bed.ward.ward_name} (Bed: ${adm.bed.bed_number})`);
          console.log(`            Status: ${adm.status} | Admitting Doctor: Dr. ${adm.doctor.first_name} ${adm.doctor.last_name}`);
          console.log(`            Reason: ${adm.admission_reason}`);
        });
      }
    }

    // -------------------------------------------------------------------------
    // 3. INPATIENT WARD CAPACITY & REAL-TIME BED OCCUPANCY
    // -------------------------------------------------------------------------
    console.log('\n=================================================================');
    console.log('🛏️  3. REAL-TIME WARD OCCUPANCY & BED CAPACITY REPORT');
    console.log('=================================================================');

    const wards = await prisma.ward.findMany({
      include: {
        bed: true
      },
      orderBy: { ward_name: 'asc' }
    });

    const wardStats = wards.map(w => {
      const totalBeds = w.total_beds;
      const occupiedBeds = w.bed.filter(b => b.status === 'OCCUPIED').length;
      const availableBeds = w.bed.filter(b => b.status === 'AVAILABLE').length;
      const occupancyRate = totalBeds > 0 ? ((occupiedBeds / totalBeds) * 100).toFixed(1) + '%' : '0.0%';

      return {
        'Ward Name': w.ward_name,
        'Type': w.ward_type,
        'Daily Rate': formatCurrency(w.daily_rate),
        'Total Beds': totalBeds,
        'Occupied': occupiedBeds,
        'Available': availableBeds,
        'Occupancy Rate': occupancyRate
      };
    });
    console.table(wardStats);

    // -------------------------------------------------------------------------
    // 4. FINANCIAL AUDIT & RECONCILIATION
    // -------------------------------------------------------------------------
    console.log('\n=================================================================');
    console.log('💰 4. FINANCIAL AUDIT & OUTSTANDING REVENUE RECONCILIATION');
    console.log('=================================================================');

    const bills = await prisma.bill.findMany({
      include: {
        patient: true,
        payment: true
      },
      orderBy: { bill_id: 'asc' }
    });

    const financialRows = bills.map(bill => {
      const totalInvoiced = Number(bill.total_amount);
      const totalPaid = bill.payment.reduce((sum, p) => sum + Number(p.amount_paid), 0);
      const balanceDue = totalInvoiced - totalPaid;

      return {
        'Bill ID': `#${bill.bill_id}`,
        'Date': bill.bill_date.toISOString().split('T')[0],
        'Patient': `${bill.patient.first_name} ${bill.patient.last_name}`,
        'Invoiced': formatCurrency(totalInvoiced),
        'Total Paid': formatCurrency(totalPaid),
        'Balance Due': formatCurrency(balanceDue),
        'Status': bill.payment_status,
        'Payments Count': bill.payment.length
      };
    });
    console.table(financialRows);

    console.log('\n✨ Prisma query execution completed with 100% type-safety & relational integrity.');
    console.log('💡 TIP: Run `npm run studio` or `./run_db.sh studio` to browse these tables visually in your browser!\n');

  } catch (err) {
    console.error('❌ Error executing Prisma demonstration:', err);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  runPrismaDemonstration();
}

module.exports = { runPrismaDemonstration };
