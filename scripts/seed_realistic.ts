import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🏥 Starting comprehensive clinical seed into Neon Cloud...");

  // 1. Departments
  const departmentsData = [
    { department_id: 1, department_name: "Cardiology", building_floor: "Block A - 3rd Floor", head_of_department: "Dr. Sarah Jenkins", contact_phone: "+1-555-0101" },
    { department_id: 2, department_name: "Neurology", building_floor: "Block A - 4th Floor", head_of_department: "Dr. Robert Chen", contact_phone: "+1-555-0102" },
    { department_id: 3, department_name: "Orthopedics", building_floor: "Block B - 2nd Floor", head_of_department: "Dr. Marcus Vance", contact_phone: "+1-555-0103" },
    { department_id: 4, department_name: "Pediatrics", building_floor: "Block B - 1st Floor", head_of_department: "Dr. Emily Watson", contact_phone: "+1-555-0104" },
    { department_id: 5, department_name: "General Medicine", building_floor: "Block C - Ground Floor", head_of_department: "Dr. David Miller", contact_phone: "+1-555-0105" },
    { department_id: 6, department_name: "Diagnostic Pathology & Imaging", building_floor: "Block C - Basement 1", head_of_department: "Dr. Arthur Pendelton", contact_phone: "+1-555-0106" },
  ];

  for (const dept of departmentsData) {
    await prisma.department.upsert({
      where: { department_id: dept.department_id },
      update: dept,
      create: dept,
    });
  }
  console.log("✅ Departments synchronized.");

  // 2. Doctors
  const doctorsData = [
    { doctor_id: 1, department_id: 1, first_name: "Sarah", last_name: "Jenkins", specialization: "Interventional Cardiology", license_number: "MED-LIC-CARD-001", consultation_fee: 150.00, phone: "+1-555-1001", email: "sarah.jenkins@hospital.org", is_active: true },
    { doctor_id: 2, department_id: 1, first_name: "Alan", last_name: "Turing", specialization: "Electrophysiology & Arrhythmia", license_number: "MED-LIC-CARD-002", consultation_fee: 130.00, phone: "+1-555-1002", email: "alan.turing@hospital.org", is_active: true },
    { doctor_id: 3, department_id: 2, first_name: "Robert", last_name: "Chen", specialization: "Stroke & Neurocritical Care", license_number: "MED-LIC-NEUR-003", consultation_fee: 175.00, phone: "+1-555-1003", email: "robert.chen@hospital.org", is_active: true },
    { doctor_id: 4, department_id: 3, first_name: "Marcus", last_name: "Vance", specialization: "Orthopedic Trauma & Joint Replacement", license_number: "MED-LIC-ORTH-004", consultation_fee: 140.00, phone: "+1-555-1004", email: "marcus.vance@hospital.org", is_active: true },
    { doctor_id: 5, department_id: 4, first_name: "Emily", last_name: "Watson", specialization: "General Pediatrics & Neonatology", license_number: "MED-LIC-PED-005", consultation_fee: 100.00, phone: "+1-555-1005", email: "emily.watson@hospital.org", is_active: true },
    { doctor_id: 6, department_id: 5, first_name: "David", last_name: "Miller", specialization: "Internal Medicine & Geriatrics", license_number: "MED-LIC-GEN-006", consultation_fee: 90.00, phone: "+1-555-1006", email: "david.miller@hospital.org", is_active: true },
    { doctor_id: 7, department_id: 2, first_name: "Maya", last_name: "Lin", specialization: "Cognitive Neurology & Epilepsy", license_number: "MED-LIC-NEUR-007", consultation_fee: 160.00, phone: "+1-555-1007", email: "maya.lin@hospital.org", is_active: true },
    { doctor_id: 8, department_id: 3, first_name: "Vikram", last_name: "Patel", specialization: "Spine Surgery & Sports Medicine", license_number: "MED-LIC-ORTH-008", consultation_fee: 155.00, phone: "+1-555-1008", email: "vikram.patel@hospital.org", is_active: true },
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.upsert({
      where: { doctor_id: doc.doctor_id },
      update: doc,
      create: doc,
    });
  }
  console.log("✅ Doctors synchronized (8 physicians).");

  // 3. Doctor Schedules
  const scheduleData = [
    { schedule_id: 1, doctor_id: 1, day_of_week: "Monday", start_time: new Date("1970-01-01T09:00:00Z"), end_time: new Date("1970-01-01T13:00:00Z"), slot_duration_minutes: 30, max_patients: 8 },
    { schedule_id: 2, doctor_id: 1, day_of_week: "Wednesday", start_time: new Date("1970-01-01T09:00:00Z"), end_time: new Date("1970-01-01T13:00:00Z"), slot_duration_minutes: 30, max_patients: 8 },
    { schedule_id: 3, doctor_id: 1, day_of_week: "Friday", start_time: new Date("1970-01-01T14:00:00Z"), end_time: new Date("1970-01-01T18:00:00Z"), slot_duration_minutes: 30, max_patients: 8 },
    { schedule_id: 4, doctor_id: 2, day_of_week: "Tuesday", start_time: new Date("1970-01-01T10:00:00Z"), end_time: new Date("1970-01-01T14:00:00Z"), slot_duration_minutes: 20, max_patients: 12 },
    { schedule_id: 5, doctor_id: 2, day_of_week: "Thursday", start_time: new Date("1970-01-01T10:00:00Z"), end_time: new Date("1970-01-01T14:00:00Z"), slot_duration_minutes: 20, max_patients: 12 },
    { schedule_id: 6, doctor_id: 3, day_of_week: "Monday", start_time: new Date("1970-01-01T10:00:00Z"), end_time: new Date("1970-01-01T16:00:00Z"), slot_duration_minutes: 30, max_patients: 12 },
    { schedule_id: 7, doctor_id: 3, day_of_week: "Thursday", start_time: new Date("1970-01-01T10:00:00Z"), end_time: new Date("1970-01-01T16:00:00Z"), slot_duration_minutes: 30, max_patients: 12 },
    { schedule_id: 8, doctor_id: 4, day_of_week: "Tuesday", start_time: new Date("1970-01-01T08:30:00Z"), end_time: new Date("1970-01-01T12:30:00Z"), slot_duration_minutes: 20, max_patients: 12 },
    { schedule_id: 9, doctor_id: 4, day_of_week: "Friday", start_time: new Date("1970-01-01T08:30:00Z"), end_time: new Date("1970-01-01T12:30:00Z"), slot_duration_minutes: 20, max_patients: 12 },
    { schedule_id: 10, doctor_id: 5, day_of_week: "Monday", start_time: new Date("1970-01-01T09:00:00Z"), end_time: new Date("1970-01-01T15:00:00Z"), slot_duration_minutes: 20, max_patients: 18 },
    { schedule_id: 11, doctor_id: 5, day_of_week: "Wednesday", start_time: new Date("1970-01-01T09:00:00Z"), end_time: new Date("1970-01-01T15:00:00Z"), slot_duration_minutes: 20, max_patients: 18 },
    { schedule_id: 12, doctor_id: 6, day_of_week: "Monday", start_time: new Date("1970-01-01T08:00:00Z"), end_time: new Date("1970-01-01T14:00:00Z"), slot_duration_minutes: 15, max_patients: 24 },
    { schedule_id: 13, doctor_id: 6, day_of_week: "Tuesday", start_time: new Date("1970-01-01T08:00:00Z"), end_time: new Date("1970-01-01T14:00:00Z"), slot_duration_minutes: 15, max_patients: 24 },
    { schedule_id: 14, doctor_id: 6, day_of_week: "Thursday", start_time: new Date("1970-01-01T08:00:00Z"), end_time: new Date("1970-01-01T14:00:00Z"), slot_duration_minutes: 15, max_patients: 24 },
    { schedule_id: 15, doctor_id: 7, day_of_week: "Wednesday", start_time: new Date("1970-01-01T11:00:00Z"), end_time: new Date("1970-01-01T17:00:00Z"), slot_duration_minutes: 30, max_patients: 12 },
    { schedule_id: 16, doctor_id: 8, day_of_week: "Wednesday", start_time: new Date("1970-01-01T09:00:00Z"), end_time: new Date("1970-01-01T13:00:00Z"), slot_duration_minutes: 20, max_patients: 12 },
  ];

  for (const s of scheduleData) {
    await prisma.doctor_schedule.upsert({
      where: { schedule_id: s.schedule_id },
      update: s,
      create: s,
    });
  }
  console.log("✅ Doctor schedules synchronized.");

  // 4. Patients (25 realistic patient profiles)
  const patientsData = [
    { patient_id: 1, first_name: "Alice", last_name: "Morgan", date_of_birth: new Date("1985-04-12"), gender: "F", blood_group: "O+", phone: "+1-555-2001", email: "alice.morgan@example.com", address: "742 Evergreen Terrace, Springfield", emergency_contact_name: "Paul Morgan (Husband)", emergency_contact_phone: "+1-555-2101" },
    { patient_id: 2, first_name: "James", last_name: "Wilson", date_of_birth: new Date("1972-11-23"), gender: "M", blood_group: "A+", phone: "+1-555-2002", email: "james.wilson@example.com", address: "12 Baker Street, Londonderry", emergency_contact_name: "Martha Wilson (Wife)", emergency_contact_phone: "+1-555-2102" },
    { patient_id: 3, first_name: "Sophia", last_name: "Rodriguez", date_of_birth: new Date("1998-07-04"), gender: "F", blood_group: "B-", phone: "+1-555-2003", email: "sophia.r@example.com", address: "450 Ocean Parkway, Miami", emergency_contact_name: "Carlos Rodriguez (Father)", emergency_contact_phone: "+1-555-2103" },
    { patient_id: 4, first_name: "Ethan", last_name: "Hunt", date_of_birth: new Date("1968-09-18"), gender: "M", blood_group: "AB+", phone: "+1-555-2004", email: "ethan.hunt@example.com", address: "88 Mission Way, Langley", emergency_contact_name: "Julia Meade (Spouse)", emergency_contact_phone: "+1-555-2104" },
    { patient_id: 5, first_name: "Liam", last_name: "O'Connor", date_of_birth: new Date("2018-05-30"), gender: "M", blood_group: "O-", phone: "+1-555-2005", email: "fiona.oconnor@example.com", address: "23 Clover Hill Road, Boston", emergency_contact_name: "Fiona O'Connor (Mother)", emergency_contact_phone: "+1-555-2105" },
    { patient_id: 6, first_name: "Elena", last_name: "Rostova", date_of_birth: new Date("1990-12-14"), gender: "F", blood_group: "A-", phone: "+1-555-2006", email: "elena.rostova@example.com", address: "310 Birch Avenue, Seattle", emergency_contact_name: "Nikolai Rostov (Brother)", emergency_contact_phone: "+1-555-2106" },
    { patient_id: 7, first_name: "George", last_name: "Clark", date_of_birth: new Date("1955-03-08"), gender: "M", blood_group: "O+", phone: "+1-555-2007", email: "george.clark@example.com", address: "512 Elmwood Drive, Denver", emergency_contact_name: "Dorothy Clark (Daughter)", emergency_contact_phone: "+1-555-2107" },
    { patient_id: 8, first_name: "Hanna", last_name: "Al-Mansoor", date_of_birth: new Date("1989-09-22"), gender: "F", blood_group: "B+", phone: "+1-555-2008", email: "hanna.mansoor@example.com", address: "14 Palm Crest Lane, Austin", emergency_contact_name: "Tariq Mansoor (Brother)", emergency_contact_phone: "+1-555-2108" },
    { patient_id: 9, first_name: "Marcus", last_name: "Aurelius", date_of_birth: new Date("1962-04-26"), gender: "M", blood_group: "A-", phone: "+1-555-2009", email: "m.aurelius@example.com", address: "100 Forum Way, Philadelphia", emergency_contact_name: "Faustina Aurelius (Wife)", emergency_contact_phone: "+1-555-2109" },
    { patient_id: 10, first_name: "Clara", last_name: "Schumann", date_of_birth: new Date("1995-01-19"), gender: "F", blood_group: "AB-", phone: "+1-555-2010", email: "clara.s@example.com", address: "88 Symphony Park, Chicago", emergency_contact_name: "Robert Schumann (Husband)", emergency_contact_phone: "+1-555-2110" },
    { patient_id: 11, first_name: "Dev", last_name: "Kapoor", date_of_birth: new Date("1983-06-11"), gender: "M", blood_group: "O+", phone: "+1-555-2011", email: "dev.kapoor@example.com", address: "402 Silicon Vista, San Jose", emergency_contact_name: "Pooja Kapoor (Sister)", emergency_contact_phone: "+1-555-2111" },
    { patient_id: 12, first_name: "Isabella", last_name: "Fontana", date_of_birth: new Date("1993-10-05"), gender: "F", blood_group: "O-", phone: "+1-555-2012", email: "isabella.f@example.com", address: "67 Vineyard Terrace, Portland", emergency_contact_name: "Luca Fontana (Father)", emergency_contact_phone: "+1-555-2112" },
    { patient_id: 13, first_name: "Samuel", last_name: "Adebayo", date_of_birth: new Date("1977-02-17"), gender: "M", blood_group: "B+", phone: "+1-555-2013", email: "samuel.a@example.com", address: "15 Highland Court, Atlanta", emergency_contact_name: "Ngozi Adebayo (Wife)", emergency_contact_phone: "+1-555-2113" },
    { patient_id: 14, first_name: "Grace", last_name: "Hopper", date_of_birth: new Date("1950-12-09"), gender: "F", blood_group: "A+", phone: "+1-555-2014", email: "grace.hopper@example.com", address: "42 Compiler Way, Arlington", emergency_contact_name: "Vincent Hopper (Son)", emergency_contact_phone: "+1-555-2114" },
    { patient_id: 15, first_name: "Kenji", last_name: "Sato", date_of_birth: new Date("2001-08-30"), gender: "M", blood_group: "A-", phone: "+1-555-2015", email: "kenji.sato@example.com", address: "78 Sakura Drive, San Francisco", emergency_contact_name: "Akiko Sato (Mother)", emergency_contact_phone: "+1-555-2115" },
    { patient_id: 16, first_name: "Fatima", last_name: "Zahra", date_of_birth: new Date("1988-03-25"), gender: "F", blood_group: "O+", phone: "+1-555-2016", email: "fatima.z@example.com", address: "91 Oasis Blvd, Phoenix", emergency_contact_name: "Omar Zahra (Husband)", emergency_contact_phone: "+1-555-2116" },
    { patient_id: 17, first_name: "Lucas", last_name: "Dubois", date_of_birth: new Date("1970-07-14"), gender: "M", blood_group: "B-", phone: "+1-555-2017", email: "lucas.dubois@example.com", address: "12 Rue Promenade, New Orleans", emergency_contact_name: "Camille Dubois (Daughter)", emergency_contact_phone: "+1-555-2117" },
    { patient_id: 18, first_name: "Zoe", last_name: "Kravitz", date_of_birth: new Date("1996-11-01"), gender: "F", blood_group: "AB+", phone: "+1-555-2018", email: "zoe.k@example.com", address: "204 Sunset Crest, Los Angeles", emergency_contact_name: "Lenny Kravitz (Father)", emergency_contact_phone: "+1-555-2118" },
    { patient_id: 19, first_name: "Noah", last_name: "Bennett", date_of_birth: new Date("2015-03-12"), gender: "M", blood_group: "O+", phone: "+1-555-2019", email: "claire.bennett@example.com", address: "55 Pinecrest Road, Minneapolis", emergency_contact_name: "Claire Bennett (Mother)", emergency_contact_phone: "+1-555-2119" },
    { patient_id: 20, first_name: "Amara", last_name: "Okafor", date_of_birth: new Date("1982-05-20"), gender: "F", blood_group: "A+", phone: "+1-555-2020", email: "amara.okafor@example.com", address: "33 Magnolia Gardens, Charlotte", emergency_contact_name: "Chidi Okafor (Brother)", emergency_contact_phone: "+1-555-2120" },
    { patient_id: 21, first_name: "Oliver", last_name: "Twist", date_of_birth: new Date("2004-02-14"), gender: "M", blood_group: "B+", phone: "+1-555-2021", email: "oliver.t@example.com", address: "18 Oliver Walk, Detroit", emergency_contact_name: "Rose Maylie (Aunt)", emergency_contact_phone: "+1-555-2121" },
    { patient_id: 22, first_name: "Sonia", last_name: "Gandhi", date_of_birth: new Date("1965-12-09"), gender: "F", blood_group: "O-", phone: "+1-555-2022", email: "sonia.g@example.com", address: "10 Janpath Road, New Delhi", emergency_contact_name: "Rahul Gandhi (Son)", emergency_contact_phone: "+1-555-2122" },
    { patient_id: 23, first_name: "Daniel", last_name: "Craig", date_of_birth: new Date("1969-03-02"), gender: "M", blood_group: "A+", phone: "+1-555-2023", email: "daniel.craig@example.com", address: "007 Regent Street, London", emergency_contact_name: "Rachel Weisz (Wife)", emergency_contact_phone: "+1-555-2123" },
    { patient_id: 24, first_name: "Mira", last_name: "Nair", date_of_birth: new Date("1975-10-15"), gender: "F", blood_group: "AB-", phone: "+1-555-2024", email: "mira.nair@example.com", address: "89 Cinema Drive, Brooklyn", emergency_contact_name: "Mahmood Mamdani (Husband)", emergency_contact_phone: "+1-555-2124" },
    { patient_id: 25, first_name: "Benjamin", last_name: "Franklin", date_of_birth: new Date("1958-01-17"), gender: "M", blood_group: "O+", phone: "+1-555-2025", email: "ben.franklin@example.com", address: "1776 Independence Mall, Philadelphia", emergency_contact_name: "Deborah Read (Spouse)", emergency_contact_phone: "+1-555-2125" },
  ];

  for (const p of patientsData) {
    await prisma.patient.upsert({
      where: { patient_id: p.patient_id },
      update: p,
      create: p,
    });
  }
  console.log("✅ Patients synchronized (25 patient records).");

  // 5. Wards (4 wards)
  const wardsData = [
    { ward_id: 1, department_id: 1, ward_name: "Cardiac Intensive Care Unit (CICU)", ward_type: "ICU" as const, floor_number: 3, daily_rate: 600.00, total_beds: 6 },
    { ward_id: 2, department_id: 3, ward_name: "Orthopedic Inpatient Ward", ward_type: "GENERAL" as const, floor_number: 2, daily_rate: 120.00, total_beds: 10 },
    { ward_id: 3, department_id: 5, ward_name: "Executive Medical Suite Ward", ward_type: "PRIVATE" as const, floor_number: 4, daily_rate: 350.00, total_beds: 6 },
    { ward_id: 4, department_id: 5, ward_name: "Acute Emergency Stabilization Bay", ward_type: "EMERGENCY" as const, floor_number: 0, daily_rate: 400.00, total_beds: 6 },
  ];

  for (const w of wardsData) {
    await prisma.ward.upsert({
      where: { ward_id: w.ward_id },
      update: w,
      create: w,
    });
  }
  console.log("✅ Wards synchronized.");

  // 6. Beds (28 beds total across the 4 wards)
  const bedsData = [
    // Ward 1 (CICU): 6 beds
    { bed_id: 1, ward_id: 1, bed_number: "CICU-01", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 2, ward_id: 1, bed_number: "CICU-02", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 3, ward_id: 1, bed_number: "CICU-03", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 4, ward_id: 1, bed_number: "CICU-04", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 5, ward_id: 1, bed_number: "CICU-05", status: "MAINTENANCE" as const, is_active: true },
    { bed_id: 6, ward_id: 1, bed_number: "CICU-06", status: "AVAILABLE" as const, is_active: true },
    // Ward 2 (Orthopedic): 10 beds
    { bed_id: 7, ward_id: 2, bed_number: "ORTH-01", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 8, ward_id: 2, bed_number: "ORTH-02", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 9, ward_id: 2, bed_number: "ORTH-03", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 10, ward_id: 2, bed_number: "ORTH-04", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 11, ward_id: 2, bed_number: "ORTH-05", status: "MAINTENANCE" as const, is_active: true },
    { bed_id: 12, ward_id: 2, bed_number: "ORTH-06", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 13, ward_id: 2, bed_number: "ORTH-07", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 14, ward_id: 2, bed_number: "ORTH-08", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 15, ward_id: 2, bed_number: "ORTH-09", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 16, ward_id: 2, bed_number: "ORTH-10", status: "AVAILABLE" as const, is_active: true },
    // Ward 3 (Executive Private): 6 beds
    { bed_id: 17, ward_id: 3, bed_number: "EXEC-01", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 18, ward_id: 3, bed_number: "EXEC-02", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 19, ward_id: 3, bed_number: "EXEC-03", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 20, ward_id: 3, bed_number: "EXEC-04", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 21, ward_id: 3, bed_number: "EXEC-05", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 22, ward_id: 3, bed_number: "EXEC-06", status: "AVAILABLE" as const, is_active: true },
    // Ward 4 (Emergency Bay): 6 beds
    { bed_id: 23, ward_id: 4, bed_number: "EMRG-01", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 24, ward_id: 4, bed_number: "EMRG-02", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 25, ward_id: 4, bed_number: "EMRG-03", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 26, ward_id: 4, bed_number: "EMRG-04", status: "OCCUPIED" as const, is_active: true },
    { bed_id: 27, ward_id: 4, bed_number: "EMRG-05", status: "AVAILABLE" as const, is_active: true },
    { bed_id: 28, ward_id: 4, bed_number: "EMRG-06", status: "AVAILABLE" as const, is_active: true },
  ];

  for (const b of bedsData) {
    await prisma.bed.upsert({
      where: { bed_id: b.bed_id },
      update: b,
      create: b,
    });
  }
  console.log("✅ Ward Beds synchronized (28 beds).");

  // 7. Lab Tests Catalog (8 tests)
  const labTestsData = [
    { test_id: 1, department_id: 6, test_name: "Complete Blood Count (CBC)", test_code: "LAB-CBC-01", test_category: "Hematology", standard_price: 45.00, sample_type: "Whole Blood (EDTA)", normal_range: "Hb: 12-16 g/dL, WBC: 4.5-11.0 x10^3/uL, Plt: 150-450", turnaround_hours: 6 },
    { test_id: 2, department_id: 6, test_name: "Comprehensive Lipid Profile", test_code: "LAB-LIP-02", test_category: "Biochemistry", standard_price: 65.00, sample_type: "Serum (Fasting)", normal_range: "Total Chol < 200 mg/dL, LDL < 100 mg/dL, HDL > 50 mg/dL", turnaround_hours: 12 },
    { test_id: 3, department_id: 6, test_name: "12-Lead Electrocardiogram (ECG)", test_code: "LAB-ECG-03", test_category: "Cardiology Diagnostics", standard_price: 50.00, sample_type: "Non-Invasive Diagnostic", normal_range: "Normal Sinus Rhythm, PR: 120-200ms, QRS < 120ms", turnaround_hours: 2 },
    { test_id: 4, department_id: 6, test_name: "MRI Right Knee Joint", test_code: "RAD-MRI-04", test_category: "Radiology", standard_price: 450.00, sample_type: "Imaging", normal_range: "Intact cruciate ligaments, menisci, and articular cartilage", turnaround_hours: 24 },
    { test_id: 5, department_id: 6, test_name: "Serum Ferritin & Iron Studies", test_code: "LAB-FER-05", test_category: "Biochemistry", standard_price: 80.00, sample_type: "Serum", normal_range: "Ferritin: 30-300 ng/mL, Serum Iron: 60-170 ug/dL", turnaround_hours: 12 },
    { test_id: 6, department_id: 6, test_name: "NT-proBNP Cardiac Biomarker", test_code: "LAB-BNP-06", test_category: "Biochemistry", standard_price: 120.00, sample_type: "Plasma", normal_range: "< 125 pg/mL (age < 75)", turnaround_hours: 4 },
    { test_id: 7, department_id: 6, test_name: "Glycated Hemoglobin (HbA1c)", test_code: "LAB-A1C-07", test_category: "Endocrinology", standard_price: 40.00, sample_type: "Whole Blood", normal_range: "Normal: < 5.7%, Prediabetes: 5.7-6.4%, Diabetes >= 6.5%", turnaround_hours: 6 },
    { test_id: 8, department_id: 6, test_name: "Renal Function Panel (BUN & Creatinine)", test_code: "LAB-REN-08", test_category: "Biochemistry", standard_price: 55.00, sample_type: "Serum", normal_range: "Creatinine: 0.7-1.3 mg/dL, BUN: 7-20 mg/dL", turnaround_hours: 8 },
  ];

  for (const lt of labTestsData) {
    await prisma.lab_test.upsert({
      where: { test_id: lt.test_id },
      update: lt,
      create: lt,
    });
  }
  console.log("✅ Lab Tests catalog synchronized.");

  // 8. Inpatient Admissions
  const admissionsData = [
    { admission_id: 1, patient_id: 4, admitting_doctor_id: 1, bed_id: 1, admission_date: new Date("2026-02-18T11:00:00Z"), discharge_date: null, admission_reason: "Acute decompensated congestive heart failure with pulmonary congestion", discharge_summary: null, status: "ADMITTED" as const },
    { admission_id: 2, patient_id: 7, admitting_doctor_id: 1, bed_id: 17, admission_date: new Date("2026-02-10T14:00:00Z"), discharge_date: new Date("2026-02-14T11:30:00Z"), admission_reason: "Elective coronary angioplasty post-stent placement monitoring", discharge_summary: "Patient successfully underwent single-vessel DES stenting to LAD. Hemodynamically stable upon discharge.", status: "DISCHARGED" as const },
    { admission_id: 3, patient_id: 9, admitting_doctor_id: 3, bed_id: 3, admission_date: new Date("2026-02-22T08:30:00Z"), discharge_date: null, admission_reason: "Transient Ischemic Attack (TIA) with expressive dysphasia", discharge_summary: null, status: "ADMITTED" as const },
    { admission_id: 4, patient_id: 11, admitting_doctor_id: 4, bed_id: 7, admission_date: new Date("2026-02-24T10:15:00Z"), discharge_date: null, admission_reason: "Comminuted tibia fracture post high-impact motor collision", discharge_summary: null, status: "ADMITTED" as const },
    { admission_id: 5, patient_id: 13, admitting_doctor_id: 6, bed_id: 20, admission_date: new Date("2026-02-25T16:00:00Z"), discharge_date: null, admission_reason: "Diabetic ketoacidosis (DKA) with severe electrolyte imbalance", discharge_summary: null, status: "ADMITTED" as const },
    { admission_id: 6, patient_id: 17, admitting_doctor_id: 6, bed_id: 23, admission_date: new Date("2026-02-26T02:30:00Z"), discharge_date: null, admission_reason: "Acute exacerbation of chronic obstructive pulmonary disease (COPD)", discharge_summary: null, status: "ADMITTED" as const },
    { admission_id: 7, patient_id: 25, admitting_doctor_id: 8, bed_id: 10, admission_date: new Date("2026-02-21T09:00:00Z"), discharge_date: null, admission_reason: "Total hip arthroplasty postoperative rehabilitation", discharge_summary: null, status: "ADMITTED" as const },
  ];

  for (const adm of admissionsData) {
    await prisma.admission.upsert({
      where: { admission_id: adm.admission_id },
      update: adm,
      create: adm,
    });
  }
  console.log("✅ Admissions synchronized (7 inpatient stays).");

  // 9. Appointments (30+ appointments across statuses)
  const appointmentsData = [
    { appointment_id: 1, patient_id: 1, doctor_id: 1, appointment_date: new Date("2026-02-16"), appointment_time: new Date("1970-01-01T09:30:00Z"), status: "COMPLETED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Chest pain and palpitations during exertion" },
    { appointment_id: 2, patient_id: 2, doctor_id: 3, appointment_date: new Date("2026-02-16"), appointment_time: new Date("1970-01-01T10:30:00Z"), status: "COMPLETED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Severe recurrent migraine and dizziness" },
    { appointment_id: 3, patient_id: 3, doctor_id: 4, appointment_date: new Date("2026-02-17"), appointment_time: new Date("1970-01-01T09:00:00Z"), status: "COMPLETED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Right knee swelling following sports injury" },
    { appointment_id: 4, patient_id: 4, doctor_id: 1, appointment_date: new Date("2026-02-18"), appointment_time: new Date("1970-01-01T10:00:00Z"), status: "COMPLETED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "High blood pressure follow-up and shortness of breath" },
    { appointment_id: 5, patient_id: 5, doctor_id: 5, appointment_date: new Date("2026-02-18"), appointment_time: new Date("1970-01-01T11:00:00Z"), status: "COMPLETED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Persistent pediatric high fever and dry cough" },
    { appointment_id: 6, patient_id: 6, doctor_id: 6, appointment_date: new Date("2026-02-19"), appointment_time: new Date("1970-01-01T09:15:00Z"), status: "COMPLETED" as const, appointment_type: "ROUTINE_CHECKUP" as const, reason_for_visit: "Annual general physical checkup and fatigue" },
    { appointment_id: 7, patient_id: 7, doctor_id: 1, appointment_date: new Date("2026-02-23"), appointment_time: new Date("1970-01-01T10:30:00Z"), status: "COMPLETED" as const, appointment_type: "FOLLOW_UP" as const, reason_for_visit: "Post-procedure cardiac review" },
    { appointment_id: 8, patient_id: 1, doctor_id: 1, appointment_date: new Date("2026-03-02"), appointment_time: new Date("1970-01-01T11:00:00Z"), status: "CONFIRMED" as const, appointment_type: "FOLLOW_UP" as const, reason_for_visit: "Cardiology medication review" },
    { appointment_id: 9, patient_id: 2, doctor_id: 6, appointment_date: new Date("2026-02-20"), appointment_time: new Date("1970-01-01T11:00:00Z"), status: "CANCELLED" as const, appointment_type: "ROUTINE_CHECKUP" as const, reason_for_visit: "Routine blood pressure check", cancellation_reason: "Patient had a scheduling emergency" },
    { appointment_id: 10, patient_id: 8, doctor_id: 2, appointment_date: new Date("2026-03-03"), appointment_time: new Date("1970-01-01T10:30:00Z"), status: "IN_CONSULTATION" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Arrhythmia and unexplained fainting episodes" },
    { appointment_id: 11, patient_id: 10, doctor_id: 7, appointment_date: new Date("2026-03-04"), appointment_time: new Date("1970-01-01T11:30:00Z"), status: "CHECKED_IN" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Memory impairment and sleep disturbances" },
    { appointment_id: 12, patient_id: 12, doctor_id: 4, appointment_date: new Date("2026-03-06"), appointment_time: new Date("1970-01-01T09:30:00Z"), status: "SCHEDULED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Shoulder impingement and rotator cuff pain" },
    { appointment_id: 13, patient_id: 14, doctor_id: 6, appointment_date: new Date("2026-03-09"), appointment_time: new Date("1970-01-01T08:30:00Z"), status: "SCHEDULED" as const, appointment_type: "ROUTINE_CHECKUP" as const, reason_for_visit: "Geriatric arthritis and mobility management" },
    { appointment_id: 14, patient_id: 15, doctor_id: 8, appointment_date: new Date("2026-03-11"), appointment_time: new Date("1970-01-01T09:40:00Z"), status: "SCHEDULED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Lumbar disc herniation post gym workout" },
    { appointment_id: 15, patient_id: 16, doctor_id: 5, appointment_date: new Date("2026-03-09"), appointment_time: new Date("1970-01-01T10:00:00Z"), status: "CONFIRMED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Childhood asthma check and nebulizer review" },
    { appointment_id: 16, patient_id: 18, doctor_id: 3, appointment_date: new Date("2026-03-12"), appointment_time: new Date("1970-01-01T14:00:00Z"), status: "SCHEDULED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Tingling sensation and numbness in left extremities" },
    { appointment_id: 17, patient_id: 20, doctor_id: 1, appointment_date: new Date("2026-03-13"), appointment_time: new Date("1970-01-01T14:30:00Z"), status: "CONFIRMED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Hypertensive urgency evaluation" },
    { appointment_id: 18, patient_id: 21, doctor_id: 5, appointment_date: new Date("2026-03-16"), appointment_time: new Date("1970-01-01T09:30:00Z"), status: "SCHEDULED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Nutritional assessment and growth delay check" },
    { appointment_id: 19, patient_id: 22, doctor_id: 6, appointment_date: new Date("2026-03-17"), appointment_time: new Date("1970-01-01T10:15:00Z"), status: "SCHEDULED" as const, appointment_type: "FOLLOW_UP" as const, reason_for_visit: "Thyroid hormone titration" },
    { appointment_id: 20, patient_id: 24, doctor_id: 7, appointment_date: new Date("2026-03-18"), appointment_time: new Date("1970-01-01T13:00:00Z"), status: "SCHEDULED" as const, appointment_type: "NEW_VISIT" as const, reason_for_visit: "Cluster headache diagnostic workup" },
  ];

  for (const a of appointmentsData) {
    await prisma.appointment.upsert({
      where: { appointment_id: a.appointment_id },
      update: a,
      create: a,
    });
  }
  console.log("✅ Appointments synchronized (20 active & historical records).");

  // 10. Consultations
  const consultationsData = [
    { consultation_id: 1, appointment_id: 1, patient_id: 1, doctor_id: 1, consultation_timestamp: new Date("2026-02-16T09:45:00Z"), symptoms: "Chest tightness, intermittent palpitations for 2 weeks", clinical_notes: "Normal S1/S2 heart sounds, no systolic murmurs. Ordered ECG and Lipid Profile.", blood_pressure: "135/88", heart_rate: 84, temperature_celsius: 36.8, spo2_percent: 98.0, follow_up_date: new Date("2026-03-02") },
    { consultation_id: 2, appointment_id: 2, patient_id: 2, doctor_id: 3, consultation_timestamp: new Date("2026-02-16T10:50:00Z"), symptoms: "Unilateral throbbing headache, photophobia, nausea", clinical_notes: "Cranial nerves II-XII grossly intact. No focal neurological deficits. Migraine with aura diagnosed.", blood_pressure: "122/78", heart_rate: 72, temperature_celsius: 37.0, spo2_percent: 99.0, follow_up_date: new Date("2026-03-16") },
    { consultation_id: 3, appointment_id: 3, patient_id: 3, doctor_id: 4, consultation_timestamp: new Date("2026-02-17T09:25:00Z"), symptoms: "Acute right knee pain, localized swelling, difficulty bearing weight", clinical_notes: "Lachman test positive, joint effusion noted. Suspected anterior cruciate ligament (ACL) sprain. Ordered MRI.", blood_pressure: "118/74", heart_rate: 78, temperature_celsius: 36.6, spo2_percent: 99.5, follow_up_date: new Date("2026-02-24") },
    { consultation_id: 4, appointment_id: 4, patient_id: 4, doctor_id: 1, consultation_timestamp: new Date("2026-02-18T10:20:00Z"), symptoms: "Severe dyspnea, bilateral ankle edema, fatigue", clinical_notes: "Elevated JVP, bibasilar rales, S3 gallop present. Severe decompensated heart failure. Recommended immediate ICU admission.", blood_pressure: "165/102", heart_rate: 104, temperature_celsius: 37.1, spo2_percent: 93.0, follow_up_date: null },
    { consultation_id: 5, appointment_id: 5, patient_id: 5, doctor_id: 5, consultation_timestamp: new Date("2026-02-18T11:15:00Z"), symptoms: "Fever of 39.2C, productive cough, irritability for 3 days", clinical_notes: "Bilateral coarse crackles, pharyngeal erythema. Prescribed pediatric antipyretic and oral antibiotic suspension.", blood_pressure: "95/60", heart_rate: 118, temperature_celsius: 39.2, spo2_percent: 96.5, follow_up_date: new Date("2026-02-25") },
    { consultation_id: 6, appointment_id: 6, patient_id: 6, doctor_id: 6, consultation_timestamp: new Date("2026-02-19T09:35:00Z"), symptoms: "Generalized lethargy, poor sleep quality, mild hair loss", clinical_notes: "Pale conjunctiva, thyroid normal, cardiopulmonary clear. Ordered Complete Blood Count (CBC) and Ferritin.", blood_pressure: "110/70", heart_rate: 68, temperature_celsius: 36.7, spo2_percent: 99.0, follow_up_date: new Date("2026-03-05") },
    { consultation_id: 7, appointment_id: 7, patient_id: 7, doctor_id: 1, consultation_timestamp: new Date("2026-02-23T10:45:00Z"), symptoms: "Follow-up after LAD stent implantation, mild puncture site soreness", clinical_notes: "Groin puncture site clean, distal pulses intact (dorsalis pedis 2+). ECG demonstrates stable sinus rhythm. Continue dual antiplatelet therapy.", blood_pressure: "128/82", heart_rate: 70, temperature_celsius: 36.6, spo2_percent: 98.5, follow_up_date: new Date("2026-04-20") },
    { consultation_id: 8, appointment_id: 10, patient_id: 8, doctor_id: 2, consultation_timestamp: new Date("2026-03-03T10:45:00Z"), symptoms: "Sudden onset flutter sensation in chest, presyncope while standing", clinical_notes: "Irregularly irregular rhythm auscultated. Suspected paroxysmal atrial fibrillation. Ordered stat 12-lead ECG and Holter monitor.", blood_pressure: "130/84", heart_rate: 112, temperature_celsius: 36.9, spo2_percent: 97.0, follow_up_date: new Date("2026-03-17") },
  ];

  for (const c of consultationsData) {
    await prisma.consultation.upsert({
      where: { consultation_id: c.consultation_id },
      update: c,
      create: c,
    });
  }
  console.log("✅ Consultations synchronized.");

  // 11. Diagnoses
  const diagnosesData = [
    { diagnosis_id: 1, consultation_id: 1, icd_code: "I10", diagnosis_name: "Essential (Primary) Hypertension", diagnosis_type: "CONFIRMED" as const, remarks: "Stage 1 hypertension, lifestyle modification initiated" },
    { diagnosis_id: 2, consultation_id: 1, icd_code: "R00.2", diagnosis_name: "Palpitations", diagnosis_type: "PROVISIONAL" as const, remarks: "Rule out arrhythmia; 24h Holter requested" },
    { diagnosis_id: 3, consultation_id: 2, icd_code: "G43.109", diagnosis_name: "Migraine with aura, not intractable", diagnosis_type: "CONFIRMED" as const, remarks: "Prescribed triptan therapy and sleep hygiene counsel" },
    { diagnosis_id: 4, consultation_id: 3, icd_code: "S83.511A", diagnosis_name: "Sprain of anterior cruciate ligament of right knee", diagnosis_type: "PROVISIONAL" as const, remarks: "Pending MRI confirmation, knee brace applied" },
    { diagnosis_id: 5, consultation_id: 4, icd_code: "I50.9", diagnosis_name: "Heart failure, unspecified", diagnosis_type: "CONFIRMED" as const, remarks: "Acute decompensation, requiring ICU stabilization and inotropic support" },
    { diagnosis_id: 6, consultation_id: 4, icd_code: "I11.0", diagnosis_name: "Hypertensive heart disease with heart failure", diagnosis_type: "SECONDARY" as const, remarks: "Chronic poorly controlled hypertension" },
    { diagnosis_id: 7, consultation_id: 5, icd_code: "J20.9", diagnosis_name: "Acute bronchitis, unspecified", diagnosis_type: "CONFIRMED" as const, remarks: "Pediatric presentation, good hydration recommended" },
    { diagnosis_id: 8, consultation_id: 6, icd_code: "D50.9", diagnosis_name: "Iron deficiency anemia, unspecified", diagnosis_type: "PROVISIONAL" as const, remarks: "Microcytic hypochromic picture expected" },
    { diagnosis_id: 9, consultation_id: 7, icd_code: "Z95.5", diagnosis_name: "Presence of coronary angioplasty implant and stent", diagnosis_type: "CONFIRMED" as const, remarks: "Elective DES post-monitoring" },
    { diagnosis_id: 10, consultation_id: 8, icd_code: "I48.91", diagnosis_name: "Unspecified atrial fibrillation", diagnosis_type: "PROVISIONAL" as const, remarks: "Paroxysmal arrhythmia workup in progress" },
  ];

  for (const d of diagnosesData) {
    await prisma.diagnosis.upsert({
      where: { diagnosis_id: d.diagnosis_id },
      update: d,
      create: d,
    });
  }
  console.log("✅ ICD-10 Diagnoses synchronized.");

  // 12. Prescriptions & Prescription Items
  const prescriptionsData = [
    { prescription_id: 1, consultation_id: 1, patient_id: 1, doctor_id: 1, issue_date: new Date("2026-02-16"), special_instructions: "Low sodium diet, monitor BP daily at home" },
    { prescription_id: 2, consultation_id: 2, patient_id: 2, doctor_id: 3, issue_date: new Date("2026-02-16"), special_instructions: "Take at onset of aura. Avoid bright screen exposure." },
    { prescription_id: 3, consultation_id: 3, patient_id: 3, doctor_id: 4, issue_date: new Date("2026-02-17"), special_instructions: "RICE protocol (Rest, Ice, Compression, Elevation). Avoid weight-bearing." },
    { prescription_id: 4, consultation_id: 5, patient_id: 5, doctor_id: 5, issue_date: new Date("2026-02-18"), special_instructions: "Ensure high fluid intake. Return if breathing becomes labored." },
    { prescription_id: 5, consultation_id: 6, patient_id: 6, doctor_id: 6, issue_date: new Date("2026-02-19"), special_instructions: "Take iron supplements on an empty stomach with orange juice for absorption." },
    { prescription_id: 6, consultation_id: 7, patient_id: 7, doctor_id: 1, issue_date: new Date("2026-02-23"), special_instructions: "Dual antiplatelet therapy for 12 months. Do not discontinue without cardiologist review." },
    { prescription_id: 7, consultation_id: 8, patient_id: 8, doctor_id: 2, issue_date: new Date("2026-03-03"), special_instructions: "Rate control initiation. Report any bradycardia or extreme dizziness." },
  ];

  for (const pr of prescriptionsData) {
    await prisma.prescription.upsert({
      where: { prescription_id: pr.prescription_id },
      update: pr,
      create: pr,
    });
  }

  const itemsData = [
    { item_id: 1, prescription_id: 1, medicine_name: "Amlodipine Besylate", dosage_form: "Tablet", strength: "5mg", frequency: "1-0-0 (Morning)", duration_days: 30, route: "Oral", instructions: "Take after breakfast" },
    { item_id: 2, prescription_id: 1, medicine_name: "Metoprolol Succinate", dosage_form: "Tablet", strength: "25mg", frequency: "0-0-1 (Night)", duration_days: 30, route: "Oral", instructions: "Take before sleeping" },
    { item_id: 3, prescription_id: 2, medicine_name: "Sumatriptan Succinate", dosage_form: "Tablet", strength: "50mg", frequency: "PRN (As needed)", duration_days: 10, route: "Oral", instructions: "Max 2 tablets in 24 hours" },
    { item_id: 4, prescription_id: 2, medicine_name: "Naproxen Sodium", dosage_form: "Tablet", strength: "500mg", frequency: "1-0-1 (Twice daily)", duration_days: 5, route: "Oral", instructions: "Take with food" },
    { item_id: 5, prescription_id: 3, medicine_name: "Etodolac", dosage_form: "Capsule", strength: "400mg", frequency: "1-0-1 (Twice daily)", duration_days: 7, route: "Oral", instructions: "Take after meals for pain" },
    { item_id: 6, prescription_id: 3, medicine_name: "Paracetamol", dosage_form: "Tablet", strength: "650mg", frequency: "PRN (Every 6 hrs)", duration_days: 5, route: "Oral", instructions: "For breakthrough pain" },
    { item_id: 7, prescription_id: 4, medicine_name: "Amoxicillin-Clavulanate Suspension", dosage_form: "Syrup", strength: "250mg/5ml", frequency: "5ml TID (8 hourly)", duration_days: 7, route: "Oral", instructions: "Shake well before use" },
    { item_id: 8, prescription_id: 4, medicine_name: "Paracetamol Pediatric Drops", dosage_form: "Syrup", strength: "100mg/ml", frequency: "1.5ml QDS (6 hourly)", duration_days: 3, route: "Oral", instructions: "For fever above 38.5C" },
    { item_id: 9, prescription_id: 5, medicine_name: "Ferrous Ascorbate", dosage_form: "Tablet", strength: "100mg", frequency: "1-0-0 (Morning)", duration_days: 60, route: "Oral", instructions: "Avoid dairy products within 2 hours" },
    { item_id: 10, prescription_id: 6, medicine_name: "Ticagrelor", dosage_form: "Tablet", strength: "90mg", frequency: "1-0-1 (Twice daily)", duration_days: 90, route: "Oral", instructions: "Antiplatelet therapy - do not skip" },
    { item_id: 11, prescription_id: 6, medicine_name: "Aspirin (Enteric Coated)", dosage_form: "Tablet", strength: "75mg", frequency: "0-1-0 (Afternoon)", duration_days: 90, route: "Oral", instructions: "Take with lunch" },
    { item_id: 12, prescription_id: 7, medicine_name: "Bisoprolol Fumarate", dosage_form: "Tablet", strength: "2.5mg", frequency: "1-0-0 (Morning)", duration_days: 30, route: "Oral", instructions: "Take every morning at the same time" },
  ];

  for (const item of itemsData) {
    await prisma.prescription_item.upsert({
      where: { item_id: item.item_id },
      update: item,
      create: item,
    });
  }
  console.log("✅ Prescriptions & Medications synchronized.");

  // 13. Test Orders
  const testOrdersData = [
    { order_id: 1, consultation_id: 1, patient_id: 1, test_id: 2, ordered_by_doctor_id: 1, order_date: new Date("2026-02-16T10:00:00Z"), sample_collected_date: new Date("2026-02-16T10:30:00Z"), result_date: new Date("2026-02-16T18:00:00Z"), test_result: "Total Chol: 238 mg/dL, LDL: 152 mg/dL, HDL: 44 mg/dL, Trig: 210 mg/dL", reference_range_observed: "Chol < 200, LDL < 100", abnormal_flag: "ABNORMAL" as const, technician_remarks: "Moderate dyslipidemia confirmed", order_status: "COMPLETED" as const },
    { order_id: 2, consultation_id: 1, patient_id: 1, test_id: 3, ordered_by_doctor_id: 1, order_date: new Date("2026-02-16T10:00:00Z"), sample_collected_date: new Date("2026-02-16T10:15:00Z"), result_date: new Date("2026-02-16T10:45:00Z"), test_result: "Sinus tachycardia, rate 88 bpm. Mild LV strain pattern.", reference_range_observed: "Normal sinus rhythm", abnormal_flag: "ABNORMAL" as const, technician_remarks: "ECG reviewed by cardiologist", order_status: "COMPLETED" as const },
    { order_id: 3, consultation_id: 3, patient_id: 3, test_id: 4, ordered_by_doctor_id: 4, order_date: new Date("2026-02-17T09:30:00Z"), sample_collected_date: new Date("2026-02-17T14:00:00Z"), result_date: new Date("2026-02-18T11:00:00Z"), test_result: "Partial tear of the anterior cruciate ligament with joint effusion.", reference_range_observed: "Intact ACL", abnormal_flag: "ABNORMAL" as const, technician_remarks: "Orthopedic consultation suggested for rehab vs arthroscopy", order_status: "COMPLETED" as const },
    { order_id: 4, consultation_id: 4, patient_id: 4, test_id: 6, ordered_by_doctor_id: 1, order_date: new Date("2026-02-18T10:30:00Z"), sample_collected_date: new Date("2026-02-18T10:45:00Z"), result_date: new Date("2026-02-18T12:00:00Z"), test_result: "NT-proBNP: 4,850 pg/mL", reference_range_observed: "< 125 pg/mL", abnormal_flag: "CRITICAL" as const, technician_remarks: "Markedly elevated cardiac stress marker. Inpatient critical care needed.", order_status: "COMPLETED" as const },
    { order_id: 5, consultation_id: 6, patient_id: 6, test_id: 1, ordered_by_doctor_id: 6, order_date: new Date("2026-02-19T09:40:00Z"), sample_collected_date: new Date("2026-02-19T10:00:00Z"), result_date: new Date("2026-02-19T15:30:00Z"), test_result: "Hemoglobin: 9.8 g/dL, MCV: 72 fL, Ferritin: 11 ng/mL", reference_range_observed: "Hb: 12-16 g/dL, Ferritin: 30-300", abnormal_flag: "ABNORMAL" as const, technician_remarks: "Microcytic hypochromic anemia consistent with iron deficiency", order_status: "COMPLETED" as const },
    { order_id: 6, consultation_id: 8, patient_id: 8, test_id: 3, ordered_by_doctor_id: 2, order_date: new Date("2026-03-03T11:00:00Z"), sample_collected_date: new Date("2026-03-03T11:15:00Z"), result_date: new Date("2026-03-03T11:45:00Z"), test_result: "Atrial fibrillation with rapid ventricular response (RVR), mean rate 124 bpm", reference_range_observed: "Normal sinus rhythm", abnormal_flag: "CRITICAL" as const, technician_remarks: "Notified attending electrophysiologist immediately", order_status: "COMPLETED" as const },
    { order_id: 7, consultation_id: 4, patient_id: 4, test_id: 8, ordered_by_doctor_id: 1, order_date: new Date("2026-02-19T06:00:00Z"), sample_collected_date: new Date("2026-02-19T06:30:00Z"), result_date: new Date("2026-02-19T11:00:00Z"), test_result: "Creatinine: 1.8 mg/dL, BUN: 32 mg/dL", reference_range_observed: "Creatinine: 0.7-1.3, BUN: 7-20", abnormal_flag: "ABNORMAL" as const, technician_remarks: "Cardiorenal syndrome pattern observed", order_status: "COMPLETED" as const },
    { order_id: 8, consultation_id: 7, patient_id: 7, test_id: 7, ordered_by_doctor_id: 1, order_date: new Date("2026-02-23T11:00:00Z"), sample_collected_date: new Date("2026-02-23T11:30:00Z"), result_date: null, test_result: null, reference_range_observed: null, abnormal_flag: "PENDING" as const, technician_remarks: "Sample in processing queue", order_status: "ANALYZING" as const },
  ];

  for (const to of testOrdersData) {
    await prisma.test_order.upsert({
      where: { order_id: to.order_id },
      update: to,
      create: to,
    });
  }
  console.log("✅ Diagnostic Test Orders synchronized (with critical callouts).");

  // 14. Bills & Payments
  const billsData = [
    { bill_id: 1, patient_id: 1, appointment_id: 1, admission_id: null, bill_date: new Date("2026-02-16"), consultation_charges: 150.00, test_charges: 115.00, bed_charges: 0.00, pharmacy_charges: 45.00, other_charges: 10.00, discount_amount: 20.00, tax_amount: 15.00, total_amount: 315.00, payment_status: "PAID" as const },
    { bill_id: 2, patient_id: 2, appointment_id: 2, admission_id: null, bill_date: new Date("2026-02-16"), consultation_charges: 175.00, test_charges: 0.00, bed_charges: 0.00, pharmacy_charges: 60.00, other_charges: 0.00, discount_amount: 0.00, tax_amount: 11.75, total_amount: 246.75, payment_status: "PAID" as const },
    { bill_id: 3, patient_id: 7, appointment_id: null, admission_id: 2, bill_date: new Date("2026-02-14"), consultation_charges: 600.00, test_charges: 450.00, bed_charges: 1400.00, pharmacy_charges: 320.00, other_charges: 150.00, discount_amount: 100.00, tax_amount: 141.00, total_amount: 2961.00, payment_status: "PAID" as const },
    { bill_id: 4, patient_id: 4, appointment_id: null, admission_id: 1, bill_date: new Date("2026-02-20"), consultation_charges: 300.00, test_charges: 120.00, bed_charges: 1200.00, pharmacy_charges: 180.00, other_charges: 50.00, discount_amount: 0.00, tax_amount: 92.50, total_amount: 1942.50, payment_status: "PARTIALLY_PAID" as const },
    { bill_id: 5, patient_id: 3, appointment_id: 3, admission_id: null, bill_date: new Date("2026-02-17"), consultation_charges: 140.00, test_charges: 450.00, bed_charges: 0.00, pharmacy_charges: 35.00, other_charges: 0.00, discount_amount: 25.00, tax_amount: 30.00, total_amount: 630.00, payment_status: "PAID" as const },
    { bill_id: 6, patient_id: 8, appointment_id: 10, admission_id: null, bill_date: new Date("2026-03-03"), consultation_charges: 130.00, test_charges: 50.00, bed_charges: 0.00, pharmacy_charges: 28.00, other_charges: 0.00, discount_amount: 0.00, tax_amount: 10.40, total_amount: 218.40, payment_status: "PENDING" as const },
  ];

  for (const b of billsData) {
    await prisma.bill.upsert({
      where: { bill_id: b.bill_id },
      update: b,
      create: b,
    });
  }

  const paymentsData = [
    { payment_id: 1, bill_id: 1, payment_timestamp: new Date("2026-02-16T18:30:00Z"), amount_paid: 315.00, payment_method: "CREDIT_CARD" as const, transaction_reference: "TXN-VISA-904128", notes: "Settled full outpatient charges via Visa" },
    { payment_id: 2, bill_id: 2, payment_timestamp: new Date("2026-02-16T11:15:00Z"), amount_paid: 246.75, payment_method: "UPI" as const, transaction_reference: "UPI-REF-88392104", notes: "Settled full neurology consultation bill via GooglePay/UPI" },
    { payment_id: 3, bill_id: 3, payment_timestamp: new Date("2026-02-14T12:00:00Z"), amount_paid: 2961.00, payment_method: "INSURANCE" as const, transaction_reference: "CLAIM-STAR-HEALTH-4410", notes: "Direct TPA insurance cashless settlement" },
    { payment_id: 4, bill_id: 4, payment_timestamp: new Date("2026-02-18T12:30:00Z"), amount_paid: 1000.00, payment_method: "DEBIT_CARD" as const, transaction_reference: "TXN-MC-331092", notes: "Initial ICU admission advance deposit" },
    { payment_id: 5, bill_id: 5, payment_timestamp: new Date("2026-02-17T11:00:00Z"), amount_paid: 630.00, payment_method: "CASH" as const, transaction_reference: "REC-CASH-77192", notes: "Cash counter settlement by patient relative" },
  ];

  for (const pay of paymentsData) {
    await prisma.payment.upsert({
      where: { payment_id: pay.payment_id },
      update: pay,
      create: pay,
    });
  }
  console.log("✅ Bills & Multi-tender Payments synchronized.");

  // Reset sequences to MAX(id)
  await prisma.$executeRawUnsafe(`SELECT setval('department_department_id_seq', (SELECT COALESCE(MAX(department_id), 1) FROM department));`);
  await prisma.$executeRawUnsafe(`SELECT setval('doctor_doctor_id_seq', (SELECT COALESCE(MAX(doctor_id), 1) FROM doctor));`);
  await prisma.$executeRawUnsafe(`SELECT setval('doctor_schedule_schedule_id_seq', (SELECT COALESCE(MAX(schedule_id), 1) FROM doctor_schedule));`);
  await prisma.$executeRawUnsafe(`SELECT setval('patient_patient_id_seq', (SELECT COALESCE(MAX(patient_id), 1) FROM patient));`);
  await prisma.$executeRawUnsafe(`SELECT setval('ward_ward_id_seq', (SELECT COALESCE(MAX(ward_id), 1) FROM ward));`);
  await prisma.$executeRawUnsafe(`SELECT setval('bed_bed_id_seq', (SELECT COALESCE(MAX(bed_id), 1) FROM bed));`);
  await prisma.$executeRawUnsafe(`SELECT setval('lab_test_test_id_seq', (SELECT COALESCE(MAX(test_id), 1) FROM lab_test));`);
  await prisma.$executeRawUnsafe(`SELECT setval('appointment_appointment_id_seq', (SELECT COALESCE(MAX(appointment_id), 1) FROM appointment));`);
  await prisma.$executeRawUnsafe(`SELECT setval('consultation_consultation_id_seq', (SELECT COALESCE(MAX(consultation_id), 1) FROM consultation));`);
  await prisma.$executeRawUnsafe(`SELECT setval('diagnosis_diagnosis_id_seq', (SELECT COALESCE(MAX(diagnosis_id), 1) FROM diagnosis));`);
  await prisma.$executeRawUnsafe(`SELECT setval('prescription_prescription_id_seq', (SELECT COALESCE(MAX(prescription_id), 1) FROM prescription));`);
  await prisma.$executeRawUnsafe(`SELECT setval('prescription_item_item_id_seq', (SELECT COALESCE(MAX(item_id), 1) FROM prescription_item));`);
  await prisma.$executeRawUnsafe(`SELECT setval('test_order_order_id_seq', (SELECT COALESCE(MAX(order_id), 1) FROM test_order));`);
  await prisma.$executeRawUnsafe(`SELECT setval('admission_admission_id_seq', (SELECT COALESCE(MAX(admission_id), 1) FROM admission));`);
  await prisma.$executeRawUnsafe(`SELECT setval('bill_bill_id_seq', (SELECT COALESCE(MAX(bill_id), 1) FROM bill));`);
  await prisma.$executeRawUnsafe(`SELECT setval('payment_payment_id_seq', (SELECT COALESCE(MAX(payment_id), 1) FROM payment));`);

  console.log("🎉 SEEDING COMPLETED SUCCESSFULLY INTO NEON CLOUD!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
