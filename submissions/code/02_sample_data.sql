-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Realistic Sample Seed Data (Review 1 Deliverable)
-- Target: PostgreSQL 14+
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS
-- ----------------------------------------------------------------------------
INSERT INTO department (department_id, department_name, building_floor, head_of_department, contact_phone) VALUES
(1, 'Cardiology', 'Block A - 3rd Floor', 'Dr. Sarah Jenkins', '+1-555-0101'),
(2, 'Neurology', 'Block A - 4th Floor', 'Dr. Robert Chen', '+1-555-0102'),
(3, 'Orthopedics', 'Block B - 2nd Floor', 'Dr. Marcus Vance', '+1-555-0103'),
(4, 'Pediatrics', 'Block B - 1st Floor', 'Dr. Emily Watson', '+1-555-0104'),
(5, 'General Medicine', 'Block C - Ground Floor', 'Dr. David Miller', '+1-555-0105'),
(6, 'Diagnostic Pathology & Imaging', 'Block C - Basement 1', 'Dr. Arthur Pendelton', '+1-555-0106');

SELECT setval('department_department_id_seq', (SELECT MAX(department_id) FROM department));

-- ----------------------------------------------------------------------------
-- 2. DOCTORS
-- ----------------------------------------------------------------------------
INSERT INTO doctor (doctor_id, department_id, first_name, last_name, specialization, license_number, consultation_fee, phone, email, is_active) VALUES
(1, 1, 'Sarah', 'Jenkins', 'Interventional Cardiology', 'MED-LIC-CARD-001', 150.00, '+1-555-1001', 'sarah.jenkins@hospital.org', true),
(2, 1, 'Alan', 'Turing', 'Electrophysiology', 'MED-LIC-CARD-002', 130.00, '+1-555-1002', 'alan.turing@hospital.org', true),
(3, 2, 'Robert', 'Chen', 'Stroke & Neurocritical Care', 'MED-LIC-NEUR-003', 175.00, '+1-555-1003', 'robert.chen@hospital.org', true),
(4, 3, 'Marcus', 'Vance', 'Orthopedic Trauma & Joint Replacement', 'MED-LIC-ORTH-004', 140.00, '+1-555-1004', 'marcus.vance@hospital.org', true),
(5, 4, 'Emily', 'Watson', 'General Pediatrics & Neonatology', 'MED-LIC-PED-005', 100.00, '+1-555-1005', 'emily.watson@hospital.org', true),
(6, 5, 'David', 'Miller', 'Internal Medicine & Geriatrics', 'MED-LIC-GEN-006', 90.00, '+1-555-1006', 'david.miller@hospital.org', true);

SELECT setval('doctor_doctor_id_seq', (SELECT MAX(doctor_id) FROM doctor));

-- ----------------------------------------------------------------------------
-- 3. DOCTOR SCHEDULES
-- ----------------------------------------------------------------------------
INSERT INTO doctor_schedule (schedule_id, doctor_id, day_of_week, start_time, end_time, slot_duration_minutes, max_patients) VALUES
(1, 1, 'Monday', '09:00:00', '13:00:00', 30, 8),
(2, 1, 'Wednesday', '09:00:00', '13:00:00', 30, 8),
(3, 1, 'Friday', '14:00:00', '18:00:00', 30, 8),
(4, 2, 'Tuesday', '10:00:00', '14:00:00', 20, 12),
(5, 2, 'Thursday', '10:00:00', '14:00:00', 20, 12),
(6, 3, 'Monday', '10:00:00', '16:00:00', 30, 12),
(7, 3, 'Thursday', '10:00:00', '16:00:00', 30, 12),
(8, 4, 'Tuesday', '08:30:00', '12:30:00', 20, 12),
(9, 4, 'Friday', '08:30:00', '12:30:00', 20, 12),
(10, 5, 'Monday', '09:00:00', '15:00:00', 20, 18),
(11, 5, 'Wednesday', '09:00:00', '15:00:00', 20, 18),
(12, 6, 'Monday', '08:00:00', '14:00:00', 15, 24),
(13, 6, 'Tuesday', '08:00:00', '14:00:00', 15, 24),
(14, 6, 'Thursday', '08:00:00', '14:00:00', 15, 24);

SELECT setval('doctor_schedule_schedule_id_seq', (SELECT MAX(schedule_id) FROM doctor_schedule));

-- ----------------------------------------------------------------------------
-- 4. PATIENTS
-- ----------------------------------------------------------------------------
INSERT INTO patient (patient_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, created_at) VALUES
(1, 'Alice', 'Morgan', '1985-04-12', 'F', 'O+', '+1-555-2001', 'alice.morgan@example.com', '742 Evergreen Terrace, Springfield', 'Paul Morgan (Husband)', '+1-555-2101', '2026-01-10 08:30:00+00'),
(2, 'James', 'Wilson', '1972-11-23', 'M', 'A+', '+1-555-2002', 'james.wilson@example.com', '12 Baker Street, Londonderry', 'Martha Wilson (Wife)', '+1-555-2102', '2026-01-15 09:15:00+00'),
(3, 'Sophia', 'Rodriguez', '1998-07-04', 'F', 'B-', '+1-555-2003', 'sophia.r@example.com', '450 Ocean Parkway, Miami', 'Carlos Rodriguez (Father)', '+1-555-2103', '2026-01-20 11:45:00+00'),
(4, 'Ethan', 'Hunt', '1968-09-18', 'M', 'AB+', '+1-555-2004', 'ethan.hunt@example.com', '88 Mission Way, Langley', 'Julia Meade (Spouse)', '+1-555-2104', '2026-02-01 14:20:00+00'),
(5, 'Liam', 'O''Connor', '2018-05-30', 'M', 'O-', '+1-555-2005', 'fiona.oconnor@example.com', '23 Clover Hill Road, Boston', 'Fiona O''Connor (Mother)', '+1-555-2105', '2026-02-05 10:10:00+00'),
(6, 'Elena', 'Rostova', '1990-12-14', 'F', 'A-', '+1-555-2006', 'elena.rostova@example.com', '310 Birch Avenue, Seattle', 'Nikolai Rostov (Brother)', '+1-555-2106', '2026-02-10 16:00:00+00'),
(7, 'George', 'Clark', '1955-03-08', 'M', 'O+', '+1-555-2007', 'george.clark@example.com', '512 Elmwood Drive, Denver', 'Dorothy Clark (Daughter)', '+1-555-2107', '2026-02-12 09:30:00+00');

SELECT setval('patient_patient_id_seq', (SELECT MAX(patient_id) FROM patient));

-- ----------------------------------------------------------------------------
-- 5. APPOINTMENTS
-- ----------------------------------------------------------------------------
INSERT INTO appointment (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, status, appointment_type, reason_for_visit, cancellation_reason) VALUES
(1, 1, 1, '2026-02-16', '09:30:00', 'COMPLETED', 'NEW_VISIT', 'Chest pain and palpitations during exertion', NULL),
(2, 2, 3, '2026-02-16', '10:30:00', 'COMPLETED', 'NEW_VISIT', 'Severe recurrent migraine and dizziness', NULL),
(3, 3, 4, '2026-02-17', '09:00:00', 'COMPLETED', 'NEW_VISIT', 'Right knee swelling following sports injury', NULL),
(4, 4, 1, '2026-02-18', '10:00:00', 'COMPLETED', 'NEW_VISIT', 'High blood pressure follow-up and shortness of breath', NULL),
(5, 5, 5, '2026-02-18', '11:00:00', 'COMPLETED', 'NEW_VISIT', 'Persistent pediatric high fever and dry cough', NULL),
(6, 6, 6, '2026-02-19', '09:15:00', 'COMPLETED', 'ROUTINE_CHECKUP', 'Annual general physical checkup and fatigue', NULL),
(7, 7, 1, '2026-02-23', '10:30:00', 'CONFIRMED', 'FOLLOW_UP', 'Post-procedure cardiac review', NULL),
(8, 1, 1, '2026-03-02', '11:00:00', 'SCHEDULED', 'FOLLOW_UP', 'Cardiology medication review', NULL),
(9, 2, 6, '2026-02-20', '11:00:00', 'CANCELLED', 'ROUTINE_CHECKUP', 'Routine blood pressure check', 'Patient had a scheduling emergency');

SELECT setval('appointment_appointment_id_seq', (SELECT MAX(appointment_id) FROM appointment));

-- ----------------------------------------------------------------------------
-- 6. CLINICAL CONSULTATIONS
-- ----------------------------------------------------------------------------
INSERT INTO consultation (consultation_id, appointment_id, patient_id, doctor_id, consultation_timestamp, symptoms, clinical_notes, blood_pressure, heart_rate, temperature_celsius, spo2_percent, follow_up_date) VALUES
(1, 1, 1, 1, '2026-02-16 09:45:00+00', 'Chest tightness, intermittent palpitations for 2 weeks', 'Normal S1/S2 heart sounds, no systolic murmurs. Ordered ECG and Lipid Profile.', '135/88', 84, 36.8, 98.0, '2026-03-02'),
(2, 2, 2, 3, '2026-02-16 10:50:00+00', 'Unilateral throbbing headache, photophobia, nausea', 'Cranial nerves II-XII grossly intact. No focal neurological deficits. Migraine with aura diagnosed.', '122/78', 72, 37.0, 99.0, '2026-03-16'),
(3, 3, 3, 4, '2026-02-17 09:25:00+00', 'Acute right knee pain, localized swelling, difficulty bearing weight', 'Lachman test positive, joint effusion noted. Suspected anterior cruciate ligament (ACL) sprain. Ordered MRI.', '118/74', 78, 36.6, 99.5, '2026-02-24'),
(4, 4, 1, 1, '2026-02-18 10:20:00+00', 'Severe dyspnea, bilateral ankle edema, fatigue', 'Elevated JVP, bibasilar rales, S3 gallop present. Severe decompensated heart failure. Recommended immediate ICU admission.', '165/102', 104, 37.1, 93.0, NULL),
(5, 5, 5, 5, '2026-02-18 11:15:00+00', 'Fever of 39.2C, productive cough, irritability for 3 days', 'Bilateral coarse crackles, pharyngeal erythema. Prescribed pediatric antipyretic and oral antibiotic suspension.', '95/60', 118, 39.2, 96.5, '2026-02-25'),
(6, 6, 6, 6, '2026-02-19 09:35:00+00', 'Generalized lethargy, poor sleep quality, mild hair loss', 'Pale conjunctiva, thyroid normal, cardiopulmonary clear. Ordered Complete Blood Count (CBC) and Ferritin.', '110/70', 68, 36.7, 99.0, '2026-03-05');

SELECT setval('consultation_consultation_id_seq', (SELECT MAX(consultation_id) FROM consultation));

-- ----------------------------------------------------------------------------
-- 7. DIAGNOSES
-- ----------------------------------------------------------------------------
INSERT INTO diagnosis (diagnosis_id, consultation_id, icd_code, diagnosis_name, diagnosis_type, remarks) VALUES
(1, 1, 'I10', 'Essential (Primary) Hypertension', 'CONFIRMED', 'Stage 1 hypertension, lifestyle modification initiated'),
(2, 1, 'R00.2', 'Palpitations', 'PROVISIONAL', 'Rule out arrhythmia; 24h Holter requested'),
(3, 2, 'G43.109', 'Migraine with aura, not intractable', 'CONFIRMED', 'Prescribed triptan therapy and sleep hygiene counsel'),
(4, 3, 'S83.511A', 'Sprain of anterior cruciate ligament of right knee', 'PROVISIONAL', 'Pending MRI confirmation, knee brace applied'),
(5, 4, 'I50.9', 'Heart failure, unspecified', 'CONFIRMED', 'Acute decompensation, requiring ICU stabilization and inotropic support'),
(6, 4, 'I11.0', 'Hypertensive heart disease with heart failure', 'SECONDARY', 'Chronic poorly controlled hypertension'),
(7, 5, 'J20.9', 'Acute bronchitis, unspecified', 'CONFIRMED', 'Pediatric presentation, good hydration recommended'),
(8, 6, 'D50.9', 'Iron deficiency anemia, unspecified', 'PROVISIONAL', 'Microcytic hypochromic picture expected');

SELECT setval('diagnosis_diagnosis_id_seq', (SELECT MAX(diagnosis_id) FROM diagnosis));

-- ----------------------------------------------------------------------------
-- 8. PRESCRIPTIONS & PRESCRIPTION ITEMS
-- ----------------------------------------------------------------------------
INSERT INTO prescription (prescription_id, consultation_id, patient_id, doctor_id, issue_date, special_instructions) VALUES
(1, 1, 1, 1, '2026-02-16', 'Low sodium diet, monitor BP daily at home'),
(2, 2, 2, 3, '2026-02-16', 'Take at onset of aura. Avoid bright screen exposure.'),
(3, 3, 3, 4, '2026-02-17', 'RICE protocol (Rest, Ice, Compression, Elevation). Avoid weight-bearing.'),
(4, 5, 5, 5, '2026-02-18', 'Ensure high fluid intake. Return if breathing becomes labored.'),
(5, 6, 6, 6, '2026-02-19', 'Take iron supplements on an empty stomach with orange juice for absorption.');

SELECT setval('prescription_prescription_id_seq', (SELECT MAX(prescription_id) FROM prescription));

INSERT INTO prescription_item (item_id, prescription_id, medicine_name, dosage_form, strength, frequency, duration_days, route, instructions) VALUES
(1, 1, 'Amlodipine Besylate', 'Tablet', '5mg', '1-0-0 (Morning)', 30, 'Oral', 'Take after breakfast'),
(2, 1, 'Metoprolol Succinate', 'Tablet', '25mg', '0-0-1 (Night)', 30, 'Oral', 'Take before sleeping'),
(3, 2, 'Sumatriptan Succinate', 'Tablet', '50mg', 'PRN (As needed)', 10, 'Oral', 'Max 2 tablets in 24 hours'),
(4, 2, 'Naproxen Sodium', 'Tablet', '500mg', '1-0-1 (Twice daily)', 5, 'Oral', 'Take with food'),
(5, 3, 'Etodolac', 'Capsule', '400mg', '1-0-1 (Twice daily)', 7, 'Oral', 'Take after meals for pain'),
(6, 3, 'Paracetamol', 'Tablet', '650mg', 'PRN (Every 6 hrs)', 5, 'Oral', 'For breakthrough pain'),
(7, 4, 'Amoxicillin-Clavulanate Suspension', 'Syrup', '250mg/5ml', '5ml TID (8 hourly)', 7, 'Oral', 'Shake well before use'),
(8, 4, 'Paracetamol Pediatric Drops', 'Syrup', '100mg/ml', '1.5ml QDS (6 hourly)', 3, 'Oral', 'For fever above 38.5C'),
(9, 5, 'Ferrous Ascorbate', 'Tablet', '100mg', '1-0-0 (Morning)', 60, 'Oral', 'Avoid dairy products within 2 hours');

SELECT setval('prescription_item_item_id_seq', (SELECT MAX(item_id) FROM prescription_item));

-- ----------------------------------------------------------------------------
-- 9. LAB TESTS & TEST ORDERS
-- ----------------------------------------------------------------------------
INSERT INTO lab_test (test_id, department_id, test_name, test_code, test_category, standard_price, sample_type, normal_range, turnaround_hours) VALUES
(1, 6, 'Complete Blood Count (CBC)', 'LAB-CBC-01', 'Hematology', 45.00, 'Whole Blood (EDTA)', 'Hb: 12-16 g/dL, WBC: 4.5-11.0 x10^3/uL, Platelets: 150-450 x10^3/uL', 6),
(2, 6, 'Comprehensive Lipid Profile', 'LAB-LIP-02', 'Biochemistry', 65.00, 'Serum (Fasting)', 'Total Chol < 200 mg/dL, LDL < 100 mg/dL, HDL > 50 mg/dL, Trig < 150 mg/dL', 12),
(3, 6, '12-Lead Electrocardiogram (ECG)', 'LAB-ECG-03', 'Cardiology Diagnostics', 50.00, 'Non-Invasive Diagnostic', 'Normal Sinus Rhythm, PR: 120-200ms, QRS < 120ms', 2),
(4, 6, 'MRI Right Knee Joint', 'RAD-MRI-04', 'Radiology', 450.00, 'Imaging', 'Intact cruciate ligaments, menisci, and articular cartilage', 24),
(5, 6, 'Serum Ferritin & Iron Studies', 'LAB-FER-05', 'Biochemistry', 80.00, 'Serum', 'Ferritin: 30-300 ng/mL, Serum Iron: 60-170 ug/dL', 12),
(6, 6, 'NT-proBNP Cardiac Biomarker', 'LAB-BNP-06', 'Biochemistry', 120.00, 'Plasma', '< 125 pg/mL (age < 75)', 4);

SELECT setval('lab_test_test_id_seq', (SELECT MAX(test_id) FROM lab_test));

INSERT INTO test_order (order_id, consultation_id, patient_id, test_id, ordered_by_doctor_id, order_date, sample_collected_date, result_date, test_result, reference_range_observed, abnormal_flag, technician_remarks, order_status) VALUES
(1, 1, 1, 2, 1, '2026-02-16 10:00:00+00', '2026-02-16 10:30:00+00', '2026-02-16 18:00:00+00', 'Total Chol: 238 mg/dL, LDL: 152 mg/dL, HDL: 44 mg/dL, Trig: 210 mg/dL', 'Chol < 200, LDL < 100', 'ABNORMAL', 'Moderate dyslipidemia confirmed', 'COMPLETED'),
(2, 1, 1, 3, 1, '2026-02-16 10:00:00+00', '2026-02-16 10:15:00+00', '2026-02-16 10:45:00+00', 'Sinus tachycardia, rate 88 bpm. Mild LV strain pattern.', 'Normal sinus rhythm', 'ABNORMAL', 'ECG reviewed by cardiologist', 'COMPLETED'),
(3, 3, 3, 4, 4, '2026-02-17 09:30:00+00', '2026-02-17 14:00:00+00', '2026-02-18 11:00:00+00', 'Partial tear of the anterior cruciate ligament with joint effusion.', 'Intact ACL', 'ABNORMAL', 'Orthopedic consultation suggested for rehab vs arthroscopy', 'COMPLETED'),
(4, 4, 4, 6, 1, '2026-02-18 10:30:00+00', '2026-02-18 10:45:00+00', '2026-02-18 12:00:00+00', 'NT-proBNP: 4,850 pg/mL', '< 125 pg/mL', 'CRITICAL', 'Markedly elevated cardiac stress marker. Inpatient critical care needed.', 'COMPLETED'),
(5, 6, 6, 1, 6, '2026-02-19 09:40:00+00', '2026-02-19 10:00:00+00', '2026-02-19 15:30:00+00', 'Hemoglobin: 9.8 g/dL, MCV: 72 fL, Ferritin: 11 ng/mL', 'Hb: 12-16 g/dL, Ferritin: 30-300', 'ABNORMAL', 'Microcytic hypochromic anemia consistent with iron deficiency', 'COMPLETED');

SELECT setval('test_order_order_id_seq', (SELECT MAX(order_id) FROM test_order));

-- ----------------------------------------------------------------------------
-- 10. WARDS & BEDS
-- ----------------------------------------------------------------------------
INSERT INTO ward (ward_id, department_id, ward_name, ward_type, floor_number, daily_rate, total_beds) VALUES
(1, 1, 'Cardiac Intensive Care Unit (CICU)', 'ICU', 3, 600.00, 6),
(2, 3, 'Orthopedic Inpatient Ward', 'GENERAL', 2, 120.00, 10),
(3, 5, 'Executive Medical Suite Ward', 'PRIVATE', 4, 350.00, 4),
(4, 5, 'Acute Emergency Stabilization Bay', 'EMERGENCY', 0, 400.00, 8);

SELECT setval('ward_ward_id_seq', (SELECT MAX(ward_id) FROM ward));

INSERT INTO bed (bed_id, ward_id, bed_number, status, is_active) VALUES
(1, 1, 'CICU-BED-01', 'OCCUPIED', true),
(2, 1, 'CICU-BED-02', 'AVAILABLE', true),
(3, 1, 'CICU-BED-03', 'AVAILABLE', true),
(4, 2, 'ORTH-BED-01', 'AVAILABLE', true),
(5, 2, 'ORTH-BED-02', 'MAINTENANCE', true),
(6, 2, 'ORTH-BED-03', 'AVAILABLE', true),
(7, 3, 'EXEC-SUITE-01', 'OCCUPIED', true),
(8, 3, 'EXEC-SUITE-02', 'AVAILABLE', true),
(9, 4, 'EMRG-BAY-01', 'AVAILABLE', true),
(10, 4, 'EMRG-BAY-02', 'AVAILABLE', true);

SELECT setval('bed_bed_id_seq', (SELECT MAX(bed_id) FROM bed));

-- ----------------------------------------------------------------------------
-- 11. INPATIENT ADMISSIONS
-- ----------------------------------------------------------------------------
INSERT INTO admission (admission_id, patient_id, admitting_doctor_id, bed_id, admission_date, discharge_date, admission_reason, discharge_summary, status) VALUES
(1, 4, 1, 1, '2026-02-18 11:00:00+00', NULL, 'Acute decompensated congestive heart failure with pulmonary congestion', NULL, 'ADMITTED'),
(2, 7, 1, 7, '2026-02-10 14:00:00+00', '2026-02-14 11:30:00+00', 'Elective coronary angioplasty post-stent placement monitoring', 'Patient successfully underwent single-vessel DES stenting to LAD. Hemodynamically stable upon discharge.', 'DISCHARGED');

SELECT setval('admission_admission_id_seq', (SELECT MAX(admission_id) FROM admission));

-- ----------------------------------------------------------------------------
-- 12. BILLS & PAYMENTS
-- ----------------------------------------------------------------------------
-- Bill 1: Outpatient Visit for Patient Alice Morgan (Appt 1 + Consultation + Lab Tests)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(1, 1, 1, NULL, '2026-02-16', 150.00, 115.00, 0.00, 45.00, 10.00, 20.00, 15.00, 315.00, 'PAID');

-- Bill 2: Outpatient Visit for Patient James Wilson (Appt 2 + Consultation)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(2, 2, 2, NULL, '2026-02-16', 175.00, 0.00, 0.00, 60.00, 0.00, 0.00, 11.75, 246.75, 'PAID');

-- Bill 3: Inpatient Stay for Patient George Clark (Admission 2 - 4 days private suite + cardiology care)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(3, 7, NULL, 2, '2026-02-14', 600.00, 450.00, 1400.00, 320.00, 150.00, 100.00, 141.00, 2961.00, 'PAID');

-- Bill 4: Active Inpatient Interim Bill for Patient Ethan Hunt (Admission 1 - Ongoing ICU stay)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(4, 4, NULL, 1, '2026-02-20', 300.00, 120.00, 1200.00, 180.00, 50.00, 0.00, 92.50, 1942.50, 'PARTIALLY_PAID');

SELECT setval('bill_bill_id_seq', (SELECT MAX(bill_id) FROM bill));

-- Payments
INSERT INTO payment (payment_id, bill_id, payment_timestamp, amount_paid, payment_method, transaction_reference, notes) VALUES
(1, 1, '2026-02-16 18:30:00+00', 315.00, 'CREDIT_CARD', 'TXN-VISA-904128', 'Settled full outpatient charges via Visa'),
(2, 2, '2026-02-16 11:15:00+00', 246.75, 'UPI', 'UPI-REF-88392104', 'Settled full neurology consultation bill via GooglePay/UPI'),
(3, 3, '2026-02-14 12:00:00+00', 2961.00, 'INSURANCE', 'CLAIM-STAR-HEALTH-4410', 'Direct TPA insurance cashless settlement'),
(4, 4, '2026-02-18 12:30:00+00', 1000.00, 'DEBIT_CARD', 'TXN-MC-331092', 'Initial ICU admission advance deposit');

SELECT setval('payment_payment_id_seq', (SELECT MAX(payment_id) FROM payment));

-- ============================================================================
-- SEED DATA LOAD COMPLETE
-- ============================================================================
