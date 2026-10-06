-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Milestone: Presentation-II / Review 2 Deliverable
-- Document: Comprehensive Realistic Sample Seed Data (DML)
-- Target RDBMS: PostgreSQL 16 (Neon Cloud Serverless)
-- Student: Shaik Imaduddin (Roll No: 25WU0101048)
-- Faculty: Dr. Kiran Mayee Adavala
-- ============================================================================

BEGIN;

-- ----------------------------------------------------------------------------
-- 1. DEPARTMENTS (6 Clinical & Administrative Master Units)
-- ----------------------------------------------------------------------------
INSERT INTO department (department_id, department_name, building_floor, head_of_department, contact_phone) VALUES
(1, 'Cardiology', 'Block A - 3rd Floor', 'Dr. Sarah Jenkins', '+1-555-0101'),
(2, 'Neurology', 'Block A - 4th Floor', 'Dr. Robert Chen', '+1-555-0102'),
(3, 'Orthopedics', 'Block B - 2nd Floor', 'Dr. Marcus Vance', '+1-555-0103'),
(4, 'Pediatrics', 'Block B - 1st Floor', 'Dr. Emily Watson', '+1-555-0104'),
(5, 'General Medicine', 'Block C - Ground Floor', 'Dr. David Miller', '+1-555-0105'),
(6, 'Diagnostic Pathology & Imaging', 'Block C - Basement 1', 'Dr. Arthur Pendelton', '+1-555-0106');

-- ----------------------------------------------------------------------------
-- 2. DOCTORS (8 Licensed Physicians across Departments)
-- ----------------------------------------------------------------------------
INSERT INTO doctor (doctor_id, department_id, first_name, last_name, specialization, license_number, consultation_fee, phone, email, is_active) VALUES
(1, 1, 'Sarah', 'Jenkins', 'Interventional Cardiology', 'MED-LIC-CARD-001', 150.00, '+1-555-1001', 'sarah.jenkins@hospital.org', true),
(2, 1, 'Alan', 'Turing', 'Electrophysiology & Arrhythmia', 'MED-LIC-CARD-002', 130.00, '+1-555-1002', 'alan.turing@hospital.org', true),
(3, 2, 'Robert', 'Chen', 'Stroke & Neurocritical Care', 'MED-LIC-NEUR-003', 175.00, '+1-555-1003', 'robert.chen@hospital.org', true),
(4, 3, 'Marcus', 'Vance', 'Orthopedic Trauma & Joint Replacement', 'MED-LIC-ORTH-004', 140.00, '+1-555-1004', 'marcus.vance@hospital.org', true),
(5, 4, 'Emily', 'Watson', 'General Pediatrics & Neonatology', 'MED-LIC-PED-005', 100.00, '+1-555-1005', 'emily.watson@hospital.org', true),
(6, 5, 'David', 'Miller', 'Internal Medicine & Geriatrics', 'MED-LIC-GEN-006', 90.00, '+1-555-1006', 'david.miller@hospital.org', true),
(7, 2, 'Maya', 'Lin', 'Cognitive Neurology & Epilepsy', 'MED-LIC-NEUR-007', 160.00, '+1-555-1007', 'maya.lin@hospital.org', true),
(8, 3, 'Vikram', 'Patel', 'Spine Surgery & Sports Medicine', 'MED-LIC-ORTH-008', 155.00, '+1-555-1008', 'vikram.patel@hospital.org', true);

-- ----------------------------------------------------------------------------
-- 3. DOCTOR SCHEDULES (16 Duty Shifts with Shift Thresholds)
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
(14, 6, 'Thursday', '08:00:00', '14:00:00', 15, 24),
(15, 7, 'Wednesday', '11:00:00', '17:00:00', 30, 12),
(16, 8, 'Wednesday', '09:00:00', '13:00:00', 20, 12);

-- ----------------------------------------------------------------------------
-- 4. PATIENT REGISTRY (25 Realistic Demographics)
-- ----------------------------------------------------------------------------
INSERT INTO patient (patient_id, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone) VALUES
(1, 'Alice', 'Morgan', '1985-04-12', 'F', 'O+', '+1-555-2001', 'alice.morgan@example.com', '742 Evergreen Terrace, Springfield', 'Paul Morgan (Husband)', '+1-555-2101'),
(2, 'James', 'Wilson', '1972-11-23', 'M', 'A+', '+1-555-2002', 'james.wilson@example.com', '12 Baker Street, Londonderry', 'Martha Wilson (Wife)', '+1-555-2102'),
(3, 'Sophia', 'Rodriguez', '1998-07-04', 'F', 'B-', '+1-555-2003', 'sophia.r@example.com', '450 Ocean Parkway, Miami', 'Carlos Rodriguez (Father)', '+1-555-2103'),
(4, 'Ethan', 'Hunt', '1968-09-18', 'M', 'AB+', '+1-555-2004', 'ethan.hunt@example.com', '88 Mission Way, Langley', 'Julia Meade (Spouse)', '+1-555-2104'),
(5, 'Liam', 'O''Connor', '2018-05-30', 'M', 'O-', '+1-555-2005', 'fiona.oconnor@example.com', '23 Clover Hill Road, Boston', 'Fiona O''Connor (Mother)', '+1-555-2105'),
(6, 'Elena', 'Rostova', '1990-12-14', 'F', 'A-', '+1-555-2006', 'elena.rostova@example.com', '310 Birch Avenue, Seattle', 'Nikolai Rostov (Brother)', '+1-555-2106'),
(7, 'George', 'Clark', '1955-03-08', 'M', 'O+', '+1-555-2007', 'george.clark@example.com', '512 Elmwood Drive, Denver', 'Dorothy Clark (Daughter)', '+1-555-2107'),
(8, 'Hanna', 'Al-Mansoor', '1989-09-22', 'F', 'B+', '+1-555-2008', 'hanna.mansoor@example.com', '14 Palm Crest Lane, Austin', 'Tariq Mansoor (Brother)', '+1-555-2108'),
(9, 'Marcus', 'Aurelius', '1962-04-26', 'M', 'A-', '+1-555-2009', 'm.aurelius@example.com', '100 Forum Way, Philadelphia', 'Faustina Aurelius (Wife)', '+1-555-2109'),
(10, 'Clara', 'Schumann', '1995-01-19', 'F', 'AB-', '+1-555-2010', 'clara.s@example.com', '88 Symphony Park, Chicago', 'Robert Schumann (Husband)', '+1-555-2110'),
(11, 'Dev', 'Kapoor', '1983-06-11', 'M', 'O+', '+1-555-2011', 'dev.kapoor@example.com', '402 Silicon Vista, San Jose', 'Pooja Kapoor (Sister)', '+1-555-2111'),
(12, 'Isabella', 'Fontana', '1993-10-05', 'F', 'O-', '+1-555-2012', 'isabella.f@example.com', '67 Vineyard Terrace, Portland', 'Luca Fontana (Father)', '+1-555-2112'),
(13, 'Samuel', 'Adebayo', '1977-02-17', 'M', 'B+', '+1-555-2013', 'samuel.a@example.com', '15 Highland Court, Atlanta', 'Ngozi Adebayo (Wife)', '+1-555-2113'),
(14, 'Grace', 'Hopper', '1950-12-09', 'F', 'A+', '+1-555-2014', 'grace.hopper@example.com', '42 Compiler Way, Arlington', 'Vincent Hopper (Son)', '+1-555-2114'),
(15, 'Kenji', 'Sato', '2001-08-30', 'M', 'A-', '+1-555-2015', 'kenji.sato@example.com', '78 Sakura Drive, San Francisco', 'Akiko Sato (Mother)', '+1-555-2115'),
(16, 'Fatima', 'Zahra', '1988-03-25', 'F', 'O+', '+1-555-2016', 'fatima.z@example.com', '91 Oasis Blvd, Phoenix', 'Omar Zahra (Husband)', '+1-555-2116'),
(17, 'Lucas', 'Dubois', '1970-07-14', 'M', 'B-', '+1-555-2017', 'lucas.dubois@example.com', '12 Rue Promenade, New Orleans', 'Camille Dubois (Daughter)', '+1-555-2117'),
(18, 'Zoe', 'Kravitz', '1996-11-01', 'F', 'AB+', '+1-555-2018', 'zoe.k@example.com', '204 Sunset Crest, Los Angeles', 'Lenny Kravitz (Father)', '+1-555-2118'),
(19, 'Noah', 'Bennett', '2015-03-12', 'M', 'O+', '+1-555-2019', 'claire.bennett@example.com', '55 Pinecrest Road, Minneapolis', 'Claire Bennett (Mother)', '+1-555-2119'),
(20, 'Amara', 'Okafor', '1982-05-20', 'F', 'A+', '+1-555-2020', 'amara.okafor@example.com', '33 Magnolia Gardens, Charlotte', 'Chidi Okafor (Brother)', '+1-555-2120'),
(21, 'Oliver', 'Twist', '2004-02-14', 'M', 'B+', '+1-555-2021', 'oliver.t@example.com', '18 Oliver Walk, Detroit', 'Rose Maylie (Aunt)', '+1-555-2121'),
(22, 'Sonia', 'Gandhi', '1965-12-09', 'F', 'O-', '+1-555-2022', 'sonia.g@example.com', '10 Janpath Road, New Delhi', 'Rahul Gandhi (Son)', '+1-555-2122'),
(23, 'Daniel', 'Craig', '1969-03-02', 'M', 'A+', '+1-555-2023', 'daniel.craig@example.com', '007 Regent Street, London', 'Rachel Weisz (Wife)', '+1-555-2123'),
(24, 'Mira', 'Nair', '1975-10-15', 'F', 'AB-', '+1-555-2024', 'mira.nair@example.com', '89 Cinema Drive, Brooklyn', 'Mahmood Mamdani (Husband)', '+1-555-2124'),
(25, 'Benjamin', 'Franklin', '1958-01-17', 'M', 'O+', '+1-555-2025', 'ben.franklin@example.com', '1776 Independence Mall, Philadelphia', 'Deborah Read (Spouse)', '+1-555-2125');

-- ----------------------------------------------------------------------------
-- 5. WARDS (4 Care Categories)
-- ----------------------------------------------------------------------------
INSERT INTO ward (ward_id, department_id, ward_name, ward_type, floor_number, daily_rate, total_beds) VALUES
(1, 1, 'Cardiac Intensive Care Unit (CICU)', 'ICU', 3, 600.00, 6),
(2, 3, 'Orthopedic Inpatient Ward', 'GENERAL', 2, 120.00, 10),
(3, 5, 'Executive Medical Suite Ward', 'PRIVATE', 4, 350.00, 6),
(4, 5, 'Acute Emergency Stabilization Bay', 'EMERGENCY', 0, 400.00, 6);

-- ----------------------------------------------------------------------------
-- 6. BEDS (28 Monitored Inpatient Beds)
-- ----------------------------------------------------------------------------
INSERT INTO bed (bed_id, ward_id, bed_number, status, is_active) VALUES
-- Ward 1 (CICU - 6 Beds)
(1, 1, 'CICU-01', 'OCCUPIED', true),
(2, 1, 'CICU-02', 'AVAILABLE', true),
(3, 1, 'CICU-03', 'OCCUPIED', true),
(4, 1, 'CICU-04', 'AVAILABLE', true),
(5, 1, 'CICU-05', 'MAINTENANCE', true),
(6, 1, 'CICU-06', 'AVAILABLE', true),
-- Ward 2 (Orthopedic - 10 Beds)
(7, 2, 'ORTH-01', 'OCCUPIED', true),
(8, 2, 'ORTH-02', 'AVAILABLE', true),
(9, 2, 'ORTH-03', 'AVAILABLE', true),
(10, 2, 'ORTH-04', 'OCCUPIED', true),
(11, 2, 'ORTH-05', 'MAINTENANCE', true),
(12, 2, 'ORTH-06', 'AVAILABLE', true),
(13, 2, 'ORTH-07', 'AVAILABLE', true),
(14, 2, 'ORTH-08', 'AVAILABLE', true),
(15, 2, 'ORTH-09', 'AVAILABLE', true),
(16, 2, 'ORTH-10', 'AVAILABLE', true),
-- Ward 3 (Executive Private - 6 Beds)
(17, 3, 'EXEC-01', 'AVAILABLE', true),
(18, 3, 'EXEC-02', 'AVAILABLE', true),
(19, 3, 'EXEC-03', 'AVAILABLE', true),
(20, 3, 'EXEC-04', 'OCCUPIED', true),
(21, 3, 'EXEC-05', 'AVAILABLE', true),
(22, 3, 'EXEC-06', 'AVAILABLE', true),
-- Ward 4 (Emergency Bay - 6 Beds)
(23, 4, 'EMRG-01', 'OCCUPIED', true),
(24, 4, 'EMRG-02', 'AVAILABLE', true),
(25, 4, 'EMRG-03', 'AVAILABLE', true),
(26, 4, 'EMRG-04', 'AVAILABLE', true),
(27, 4, 'EMRG-05', 'AVAILABLE', true),
(28, 4, 'EMRG-06', 'AVAILABLE', true);

-- ----------------------------------------------------------------------------
-- 7. LAB TESTS (8 Pathology & Radiology Catalog Investigations)
-- ----------------------------------------------------------------------------
INSERT INTO lab_test (test_id, department_id, test_name, test_code, test_category, standard_price, sample_type, normal_range, turnaround_hours) VALUES
(1, 6, 'Complete Blood Count (CBC)', 'LAB-CBC-01', 'Hematology', 45.00, 'Whole Blood (EDTA)', 'Hb: 12-16 g/dL, WBC: 4.5-11.0 x10^3/uL, Plt: 150-450', 6),
(2, 6, 'Comprehensive Lipid Profile', 'LAB-LIP-02', 'Biochemistry', 65.00, 'Serum (Fasting)', 'Total Chol < 200 mg/dL, LDL < 100 mg/dL, HDL > 50 mg/dL', 12),
(3, 6, '12-Lead Electrocardiogram (ECG)', 'LAB-ECG-03', 'Cardiology Diagnostics', 50.00, 'Non-Invasive Diagnostic', 'Normal Sinus Rhythm, PR: 120-200ms, QRS < 120ms', 2),
(4, 6, 'MRI Right Knee Joint', 'RAD-MRI-04', 'Radiology', 450.00, 'Imaging', 'Intact cruciate ligaments, menisci, and articular cartilage', 24),
(5, 6, 'Serum Ferritin & Iron Studies', 'LAB-FER-05', 'Biochemistry', 80.00, 'Serum', 'Ferritin: 30-300 ng/mL, Serum Iron: 60-170 ug/dL', 12),
(6, 6, 'NT-proBNP Cardiac Biomarker', 'LAB-BNP-06', 'Biochemistry', 120.00, 'Plasma', '< 125 pg/mL (age < 75)', 4),
(7, 6, 'Glycated Hemoglobin (HbA1c)', 'LAB-A1C-07', 'Endocrinology', 40.00, 'Whole Blood', 'Normal: < 5.7%, Prediabetes: 5.7-6.4%, Diabetes >= 6.5%', 6),
(8, 6, 'Renal Function Panel (BUN & Creatinine)', 'LAB-REN-08', 'Biochemistry', 55.00, 'Serum', 'Creatinine: 0.7-1.3 mg/dL, BUN: 7-20 mg/dL', 8);

-- ----------------------------------------------------------------------------
-- 8. INPATIENT ADMISSIONS (7 Inpatient Stays)
-- ----------------------------------------------------------------------------
INSERT INTO admission (admission_id, patient_id, admitting_doctor_id, bed_id, admission_date, discharge_date, admission_reason, discharge_summary, status) VALUES
(1, 4, 1, 1, '2026-02-18 11:00:00+00', NULL, 'Acute decompensated congestive heart failure with pulmonary congestion', NULL, 'ADMITTED'),
(2, 7, 1, 17, '2026-02-10 14:00:00+00', '2026-02-14 11:30:00+00', 'Elective coronary angioplasty post-stent placement monitoring', 'Patient successfully underwent single-vessel DES stenting to LAD. Hemodynamically stable upon discharge.', 'DISCHARGED'),
(3, 9, 3, 3, '2026-02-22 08:30:00+00', NULL, 'Transient Ischemic Attack (TIA) with expressive dysphasia', NULL, 'ADMITTED'),
(4, 11, 4, 7, '2026-02-24 10:15:00+00', NULL, 'Comminuted tibia fracture post high-impact motor collision', NULL, 'ADMITTED'),
(5, 13, 6, 20, '2026-02-25 16:00:00+00', NULL, 'Diabetic ketoacidosis (DKA) with severe electrolyte imbalance', NULL, 'ADMITTED'),
(6, 17, 6, 23, '2026-02-26 02:30:00+00', NULL, 'Acute exacerbation of chronic obstructive pulmonary disease (COPD)', NULL, 'ADMITTED'),
(7, 25, 8, 10, '2026-02-21 09:00:00+00', NULL, 'Total hip arthroplasty postoperative rehabilitation', NULL, 'ADMITTED');

-- ----------------------------------------------------------------------------
-- 9. OUTPATIENT APPOINTMENTS (20 Booked & Completed Visits)
-- ----------------------------------------------------------------------------
INSERT INTO appointment (appointment_id, patient_id, doctor_id, appointment_date, appointment_time, status, appointment_type, reason_for_visit, cancellation_reason) VALUES
(1, 1, 1, '2026-02-16', '09:30:00', 'COMPLETED', 'NEW_VISIT', 'Chest pain and palpitations during exertion', NULL),
(2, 2, 3, '2026-02-16', '10:30:00', 'COMPLETED', 'NEW_VISIT', 'Severe recurrent migraine and dizziness', NULL),
(3, 3, 4, '2026-02-17', '09:00:00', 'COMPLETED', 'NEW_VISIT', 'Right knee swelling following sports injury', NULL),
(4, 4, 1, '2026-02-18', '10:00:00', 'COMPLETED', 'NEW_VISIT', 'High blood pressure follow-up and shortness of breath', NULL),
(5, 5, 5, '2026-02-18', '11:00:00', 'COMPLETED', 'NEW_VISIT', 'Persistent pediatric high fever and dry cough', NULL),
(6, 6, 6, '2026-02-19', '09:15:00', 'COMPLETED', 'ROUTINE_CHECKUP', 'Annual general physical checkup and fatigue', NULL),
(7, 7, 1, '2026-02-23', '10:30:00', 'COMPLETED', 'FOLLOW_UP', 'Post-procedure cardiac review', NULL),
(8, 1, 1, '2026-03-02', '11:00:00', 'CONFIRMED', 'FOLLOW_UP', 'Cardiology medication review', NULL),
(9, 2, 6, '2026-02-20', '11:00:00', 'CANCELLED', 'ROUTINE_CHECKUP', 'Routine blood pressure check', 'Patient had a scheduling emergency'),
(10, 8, 2, '2026-03-03', '10:30:00', 'IN_CONSULTATION', 'NEW_VISIT', 'Arrhythmia and unexplained fainting episodes', NULL),
(11, 10, 7, '2026-03-04', '11:30:00', 'CHECKED_IN', 'NEW_VISIT', 'Memory impairment and sleep disturbances', NULL),
(12, 12, 4, '2026-03-06', '09:30:00', 'SCHEDULED', 'NEW_VISIT', 'Shoulder impingement and rotator cuff pain', NULL),
(13, 14, 6, '2026-03-09', '08:30:00', 'SCHEDULED', 'ROUTINE_CHECKUP', 'Geriatric arthritis and mobility management', NULL),
(14, 15, 8, '2026-03-11', '09:40:00', 'SCHEDULED', 'NEW_VISIT', 'Lumbar disc herniation post gym workout', NULL),
(15, 16, 5, '2026-03-09', '10:00:00', 'CONFIRMED', 'NEW_VISIT', 'Childhood asthma check and nebulizer review', NULL),
(16, 18, 3, '2026-03-12', '14:00:00', 'SCHEDULED', 'NEW_VISIT', 'Tingling sensation and numbness in left extremities', NULL),
(17, 20, 1, '2026-03-13', '14:30:00', 'CONFIRMED', 'NEW_VISIT', 'Hypertensive urgency evaluation', NULL),
(18, 21, 5, '2026-03-16', '09:30:00', 'SCHEDULED', 'NEW_VISIT', 'Nutritional assessment and growth delay check', NULL),
(19, 22, 6, '2026-03-17', '10:15:00', 'SCHEDULED', 'FOLLOW_UP', 'Thyroid hormone titration', NULL),
(20, 24, 7, '2026-03-18', '13:00:00', 'SCHEDULED', 'NEW_VISIT', 'Cluster headache diagnostic workup', NULL);

-- ----------------------------------------------------------------------------
-- 10. CLINICAL CONSULTATIONS (8 Encounters with Vitals)
-- ----------------------------------------------------------------------------
INSERT INTO consultation (consultation_id, appointment_id, patient_id, doctor_id, consultation_timestamp, symptoms, clinical_notes, blood_pressure, heart_rate, temperature_celsius, spo2_percent, follow_up_date) VALUES
(1, 1, 1, 1, '2026-02-16 09:45:00+00', 'Chest tightness, intermittent palpitations for 2 weeks', 'Normal S1/S2 heart sounds, no systolic murmurs. Ordered ECG and Lipid Profile.', '135/88', 84, 36.8, 98.0, '2026-03-02'),
(2, 2, 2, 3, '2026-02-16 10:50:00+00', 'Unilateral throbbing headache, photophobia, nausea', 'Cranial nerves II-XII grossly intact. No focal neurological deficits. Migraine with aura diagnosed.', '122/78', 72, 37.0, 99.0, '2026-03-16'),
(3, 3, 3, 4, '2026-02-17 09:25:00+00', 'Acute right knee pain, localized swelling, difficulty bearing weight', 'Lachman test positive, joint effusion noted. Suspected anterior cruciate ligament (ACL) sprain. Ordered MRI.', '118/74', 78, 36.6, 99.5, '2026-02-24'),
(4, 4, 4, 1, '2026-02-18 10:20:00+00', 'Severe dyspnea, bilateral ankle edema, fatigue', 'Elevated JVP, bibasilar rales, S3 gallop present. Severe decompensated heart failure. Recommended immediate ICU admission.', '165/102', 104, 37.1, 93.0, NULL),
(5, 5, 5, 5, '2026-02-18 11:15:00+00', 'Fever of 39.2C, productive cough, irritability for 3 days', 'Bilateral coarse crackles, pharyngeal erythema. Prescribed pediatric antipyretic and oral antibiotic suspension.', '95/60', 118, 39.2, 96.5, '2026-02-25'),
(6, 6, 6, 6, '2026-02-19 09:35:00+00', 'Generalized lethargy, poor sleep quality, mild hair loss', 'Pale conjunctiva, thyroid normal, cardiopulmonary clear. Ordered Complete Blood Count (CBC) and Ferritin.', '110/70', 68, 36.7, 99.0, '2026-03-05'),
(7, 7, 7, 1, '2026-02-23 10:45:00+00', 'Follow-up after LAD stent implantation, mild puncture site soreness', 'Groin puncture site clean, distal pulses intact (dorsalis pedis 2+). ECG demonstrates stable sinus rhythm. Continue dual antiplatelet therapy.', '128/82', 70, 36.6, 98.5, '2026-04-20'),
(8, 10, 8, 2, '2026-03-03 10:45:00+00', 'Sudden onset flutter sensation in chest, presyncope while standing', 'Irregularly irregular rhythm auscultated. Suspected paroxysmal atrial fibrillation. Ordered stat 12-lead ECG and Holter monitor.', '130/84', 112, 36.9, 97.0, '2026-03-17');

-- ----------------------------------------------------------------------------
-- 11. ICD-10 DIAGNOSES (10 Clinical Classifications)
-- ----------------------------------------------------------------------------
INSERT INTO diagnosis (diagnosis_id, consultation_id, icd_code, diagnosis_name, diagnosis_type, remarks) VALUES
(1, 1, 'I10', 'Essential (Primary) Hypertension', 'CONFIRMED', 'Stage 1 hypertension, lifestyle modification initiated'),
(2, 1, 'R00.2', 'Palpitations', 'PROVISIONAL', 'Rule out arrhythmia; 24h Holter requested'),
(3, 2, 'G43.109', 'Migraine with aura, not intractable', 'CONFIRMED', 'Prescribed triptan therapy and sleep hygiene counsel'),
(4, 3, 'S83.511A', 'Sprain of anterior cruciate ligament of right knee', 'PROVISIONAL', 'Pending MRI confirmation, knee brace applied'),
(5, 4, 'I50.9', 'Heart failure, unspecified', 'CONFIRMED', 'Acute decompensation, requiring ICU stabilization and inotropic support'),
(6, 4, 'I11.0', 'Hypertensive heart disease with heart failure', 'SECONDARY', 'Chronic poorly controlled hypertension'),
(7, 5, 'J20.9', 'Acute bronchitis, unspecified', 'CONFIRMED', 'Pediatric presentation, good hydration recommended'),
(8, 6, 'D50.9', 'Iron deficiency anemia, unspecified', 'PROVISIONAL', 'Microcytic hypochromic picture expected'),
(9, 7, 'Z95.5', 'Presence of coronary angioplasty implant and stent', 'CONFIRMED', 'Elective DES post-monitoring'),
(10, 8, 'I48.91', 'Unspecified atrial fibrillation', 'PROVISIONAL', 'Paroxysmal arrhythmia workup in progress');

-- ----------------------------------------------------------------------------
-- 12. PRESCRIPTIONS & PRESCRIPTION ITEMS (7 Prescriptions, 12 Medications)
-- ----------------------------------------------------------------------------
INSERT INTO prescription (prescription_id, consultation_id, patient_id, doctor_id, issue_date, special_instructions) VALUES
(1, 1, 1, 1, '2026-02-16', 'Low sodium diet, monitor BP daily at home'),
(2, 2, 2, 3, '2026-02-16', 'Take at onset of aura. Avoid bright screen exposure.'),
(3, 3, 3, 4, '2026-02-17', 'RICE protocol (Rest, Ice, Compression, Elevation). Avoid weight-bearing.'),
(4, 5, 5, 5, '2026-02-18', 'Ensure high fluid intake. Return if breathing becomes labored.'),
(5, 6, 6, 6, '2026-02-19', 'Take iron supplements on an empty stomach with orange juice for absorption.'),
(6, 7, 7, 1, '2026-02-23', 'Dual antiplatelet therapy for 12 months. Do not discontinue without cardiologist review.'),
(7, 8, 8, 2, '2026-03-03', 'Rate control initiation. Report any bradycardia or extreme dizziness.');

INSERT INTO prescription_item (item_id, prescription_id, medicine_name, dosage_form, strength, frequency, duration_days, route, instructions) VALUES
(1, 1, 'Amlodipine Besylate', 'Tablet', '5mg', '1-0-0 (Morning)', 30, 'Oral', 'Take after breakfast'),
(2, 1, 'Metoprolol Succinate', 'Tablet', '25mg', '0-0-1 (Night)', 30, 'Oral', 'Take before sleeping'),
(3, 2, 'Sumatriptan Succinate', 'Tablet', '50mg', 'PRN (As needed)', 10, 'Oral', 'Max 2 tablets in 24 hours'),
(4, 2, 'Naproxen Sodium', 'Tablet', '500mg', '1-0-1 (Twice daily)', 5, 'Oral', 'Take with food'),
(5, 3, 'Etodolac', 'Capsule', '400mg', '1-0-1 (Twice daily)', 7, 'Oral', 'Take after meals for pain'),
(6, 3, 'Paracetamol', 'Tablet', '650mg', 'PRN (Every 6 hrs)', 5, 'Oral', 'For breakthrough pain'),
(7, 4, 'Amoxicillin-Clavulanate Suspension', 'Syrup', '250mg/5ml', '5ml TID (8 hourly)', 7, 'Oral', 'Shake well before use'),
(8, 4, 'Paracetamol Pediatric Drops', 'Syrup', '100mg/ml', '1.5ml QDS (6 hourly)', 3, 'Oral', 'For fever above 38.5C'),
(9, 5, 'Ferrous Ascorbate', 'Tablet', '100mg', '1-0-0 (Morning)', 60, 'Oral', 'Avoid dairy products within 2 hours'),
(10, 6, 'Ticagrelor', 'Tablet', '90mg', '1-0-1 (Twice daily)', 90, 'Oral', 'Antiplatelet therapy - do not skip'),
(11, 6, 'Aspirin (Enteric Coated)', 'Tablet', '75mg', '0-1-0 (Afternoon)', 90, 'Oral', 'Take with lunch'),
(12, 7, 'Bisoprolol Fumarate', 'Tablet', '2.5mg', '1-0-0 (Morning)', 30, 'Oral', 'Take every morning at the same time');

-- ----------------------------------------------------------------------------
-- 13. DIAGNOSTIC TEST ORDERS (8 Orders with Critical Alert Flags)
-- ----------------------------------------------------------------------------
INSERT INTO test_order (order_id, consultation_id, patient_id, test_id, ordered_by_doctor_id, order_date, sample_collected_date, result_date, test_result, reference_range_observed, abnormal_flag, technician_remarks, order_status) VALUES
(1, 1, 1, 2, 1, '2026-02-16 10:00:00+00', '2026-02-16 10:30:00+00', '2026-02-16 18:00:00+00', 'Total Chol: 238 mg/dL, LDL: 152 mg/dL, HDL: 44 mg/dL, Trig: 210 mg/dL', 'Chol < 200, LDL < 100', 'ABNORMAL', 'Moderate dyslipidemia confirmed', 'COMPLETED'),
(2, 1, 1, 3, 1, '2026-02-16 10:00:00+00', '2026-02-16 10:15:00+00', '2026-02-16 10:45:00+00', 'Sinus tachycardia, rate 88 bpm. Mild LV strain pattern.', 'Normal sinus rhythm', 'ABNORMAL', 'ECG reviewed by cardiologist', 'COMPLETED'),
(3, 3, 3, 4, 4, '2026-02-17 09:30:00+00', '2026-02-17 14:00:00+00', '2026-02-18 11:00:00+00', 'Partial tear of the anterior cruciate ligament with joint effusion.', 'Intact ACL', 'ABNORMAL', 'Orthopedic consultation suggested for rehab vs arthroscopy', 'COMPLETED'),
(4, 4, 4, 6, 1, '2026-02-18 10:30:00+00', '2026-02-18 10:45:00+00', '2026-02-18 12:00:00+00', 'NT-proBNP: 4,850 pg/mL', '< 125 pg/mL', 'CRITICAL', 'Markedly elevated cardiac stress marker. Inpatient critical care needed.', 'COMPLETED'),
(5, 6, 6, 1, 6, '2026-02-19 09:40:00+00', '2026-02-19 10:00:00+00', '2026-02-19 15:30:00+00', 'Hemoglobin: 9.8 g/dL, MCV: 72 fL, Ferritin: 11 ng/mL', 'Hb: 12-16 g/dL, Ferritin: 30-300', 'ABNORMAL', 'Microcytic hypochromic anemia consistent with iron deficiency', 'COMPLETED'),
(6, 8, 8, 3, 2, '2026-03-03 11:00:00+00', '2026-03-03 11:15:00+00', '2026-03-03 11:45:00+00', 'Atrial fibrillation with rapid ventricular response (RVR), mean rate 124 bpm', 'Normal sinus rhythm', 'CRITICAL', 'Notified attending electrophysiologist immediately', 'COMPLETED'),
(7, 4, 4, 8, 1, '2026-02-19 06:00:00+00', '2026-02-19 06:30:00+00', '2026-02-19 11:00:00+00', 'Creatinine: 1.8 mg/dL, BUN: 32 mg/dL', 'Creatinine: 0.7-1.3, BUN: 7-20', 'ABNORMAL', 'Cardiorenal syndrome pattern observed', 'COMPLETED'),
(8, 7, 7, 7, 1, '2026-02-23 11:00:00+00', '2026-02-23 11:30:00+00', NULL, NULL, NULL, 'PENDING', 'Sample in processing queue', 'ANALYZING');

-- ----------------------------------------------------------------------------
-- 14. INVOICES & MULTI-TENDER PAYMENTS (6 Bills, 5 Payments)
-- ----------------------------------------------------------------------------
-- Bill 1: Outpatient Visit for Patient Alice Morgan (Appt 1)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(1, 1, 1, NULL, '2026-02-16', 150.00, 115.00, 0.00, 45.00, 10.00, 20.00, 15.00, 315.00, 'PAID');

-- Bill 2: Outpatient Visit for Patient James Wilson (Appt 2)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(2, 2, 2, NULL, '2026-02-16', 175.00, 0.00, 0.00, 60.00, 0.00, 0.00, 11.75, 246.75, 'PAID');

-- Bill 3: Inpatient Stay for Patient George Clark (Admission 2 - Private Suite)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(3, 7, NULL, 2, '2026-02-14', 600.00, 450.00, 1400.00, 320.00, 150.00, 100.00, 141.00, 2961.00, 'PAID');

-- Bill 4: Active Inpatient Interim Bill for Patient Ethan Hunt (Admission 1 - Ongoing ICU)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(4, 4, NULL, 1, '2026-02-20', 300.00, 120.00, 1200.00, 180.00, 50.00, 0.00, 92.50, 1942.50, 'PARTIALLY_PAID');

-- Bill 5: Outpatient Orthopedic Procedure for Patient Sophia Rodriguez (Appt 3)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(5, 3, 3, NULL, '2026-02-17', 140.00, 450.00, 0.00, 35.00, 0.00, 25.00, 30.00, 630.00, 'PAID');

-- Bill 6: Outpatient Consultation for Patient Hanna Al-Mansoor (Appt 10)
INSERT INTO bill (bill_id, patient_id, appointment_id, admission_id, bill_date, consultation_charges, test_charges, bed_charges, pharmacy_charges, other_charges, discount_amount, tax_amount, total_amount, payment_status) VALUES
(6, 8, 10, NULL, '2026-03-03', 130.00, 50.00, 0.00, 28.00, 0.00, 0.00, 10.40, 218.40, 'PENDING');

-- Payments
INSERT INTO payment (payment_id, bill_id, payment_timestamp, amount_paid, payment_method, transaction_reference, notes) VALUES
(1, 1, '2026-02-16 18:30:00+00', 315.00, 'CREDIT_CARD', 'TXN-VISA-904128', 'Settled full outpatient charges via Visa'),
(2, 2, '2026-02-16 11:15:00+00', 246.75, 'UPI', 'UPI-REF-88392104', 'Settled full neurology consultation bill via GooglePay/UPI'),
(3, 3, '2026-02-14 12:00:00+00', 2961.00, 'INSURANCE', 'CLAIM-STAR-HEALTH-4410', 'Direct TPA insurance cashless settlement'),
(4, 4, '2026-02-18 12:30:00+00', 1000.00, 'DEBIT_CARD', 'TXN-MC-331092', 'Initial ICU admission advance deposit'),
(5, 5, '2026-02-17 11:00:00+00', 630.00, 'CASH', 'REC-CASH-77192', 'Cash counter settlement by patient relative');

-- ----------------------------------------------------------------------------
-- 15. PRIMARY KEY SEQUENCE RESETS (Prevents Future Sequence ID Collisions)
-- ----------------------------------------------------------------------------
SELECT setval('department_department_id_seq', (SELECT COALESCE(MAX(department_id), 1) FROM department));
SELECT setval('doctor_doctor_id_seq', (SELECT COALESCE(MAX(doctor_id), 1) FROM doctor));
SELECT setval('doctor_schedule_schedule_id_seq', (SELECT COALESCE(MAX(schedule_id), 1) FROM doctor_schedule));
SELECT setval('patient_patient_id_seq', (SELECT COALESCE(MAX(patient_id), 1) FROM patient));
SELECT setval('ward_ward_id_seq', (SELECT COALESCE(MAX(ward_id), 1) FROM ward));
SELECT setval('bed_bed_id_seq', (SELECT COALESCE(MAX(bed_id), 1) FROM bed));
SELECT setval('lab_test_test_id_seq', (SELECT COALESCE(MAX(test_id), 1) FROM lab_test));
SELECT setval('appointment_appointment_id_seq', (SELECT COALESCE(MAX(appointment_id), 1) FROM appointment));
SELECT setval('consultation_consultation_id_seq', (SELECT COALESCE(MAX(consultation_id), 1) FROM consultation));
SELECT setval('diagnosis_diagnosis_id_seq', (SELECT COALESCE(MAX(diagnosis_id), 1) FROM diagnosis));
SELECT setval('prescription_prescription_id_seq', (SELECT COALESCE(MAX(prescription_id), 1) FROM prescription));
SELECT setval('prescription_item_item_id_seq', (SELECT COALESCE(MAX(item_id), 1) FROM prescription_item));
SELECT setval('test_order_order_id_seq', (SELECT COALESCE(MAX(order_id), 1) FROM test_order));
SELECT setval('admission_admission_id_seq', (SELECT COALESCE(MAX(admission_id), 1) FROM admission));
SELECT setval('bill_bill_id_seq', (SELECT COALESCE(MAX(bill_id), 1) FROM bill));
SELECT setval('payment_payment_id_seq', (SELECT COALESCE(MAX(payment_id), 1) FROM payment));

COMMIT;

-- ============================================================================
-- SAMPLE DATA INSERTION COMPLETE
-- ============================================================================
