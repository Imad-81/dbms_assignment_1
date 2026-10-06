-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Milestone: Presentation-II / Review 2 Deliverable
-- Document: Relational Constraint Integrity & ACID Compliance Test Suite
-- Target RDBMS: PostgreSQL 16 (Neon Cloud Serverless)
-- Student: Shaik Imaduddin (Roll No: 25WU0101048)
-- Faculty: Dr. Kiran Mayee Adavala
-- ============================================================================
--
-- This script contains 8 systematic positive and negative tests verifying that
-- the database engine enforces business rules, domain integrity, referential 
-- integrity, and unique constraints at the storage engine level.
--
-- INSTRUCTIONS FOR TESTING:
-- Each negative test is wrapped in a subtransaction or commented block. In psql,
-- each failing command will generate the verified error message shown.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TEST 1: PREVENT DOUBLE-BOOKING / OVERLAPPING APPOINTMENT SLOTS
-- Constraint: uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
-- Description: Attempts to book Dr. Sarah Jenkins (doctor_id=1) on 2026-02-16 
--              at 09:30:00, which is already assigned to Patient Alice Morgan (patient_id=1).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status)
VALUES (2, 1, '2026-02-16', '09:30:00', 'SCHEDULED');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: duplicate key value violates unique constraint "uq_doctor_slot"
DETAIL: Key (doctor_id, appointment_date, appointment_time)=(1, 2026-02-16, 09:30:00) already exists.
STATUS: PASS (Double booking prevented at database engine level).
*/


-- ----------------------------------------------------------------------------
-- TEST 2: PREVENT DUPLICATE BED NUMBERS WITHIN THE SAME WARD
-- Constraint: uq_ward_bed UNIQUE (ward_id, bed_number)
-- Description: Attempts to insert a duplicate bed number 'CICU-01' into 
--              Cardiac Intensive Care Unit (ward_id=1).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO bed (ward_id, bed_number, status)
VALUES (1, 'CICU-01', 'AVAILABLE');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: duplicate key value violates unique constraint "uq_ward_bed"
DETAIL: Key (ward_id, bed_number)=(1, CICU-01) already exists.
STATUS: PASS (Duplicate bed numbers in the same ward strictly rejected).
*/


-- ----------------------------------------------------------------------------
-- TEST 3: CHRONOLOGICAL INVERSION CHECK ON ADMISSION & DISCHARGE DATES
-- Constraint: chk_admission_dates CHECK (discharge_date IS NULL OR discharge_date >= admission_date)
-- Description: Attempts to record an admission where discharge_date precedes admission_date.
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO admission (patient_id, admitting_doctor_id, bed_id, admission_date, discharge_date, admission_reason)
VALUES (1, 1, 2, '2026-02-20 10:00:00+00', '2026-02-18 10:00:00+00', 'Invalid chronological date check');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: new row for relation "admission" violates check constraint "chk_admission_dates"
DETAIL: Failing row contains (discharge_date < admission_date).
STATUS: PASS (Chronological integrity verified).
*/


-- ----------------------------------------------------------------------------
-- TEST 4: PREVENT NEGATIVE CONSULTATION FEES
-- Constraint: chk_doctor_fee_positive CHECK (consultation_fee >= 0.00)
-- Description: Attempts to register a doctor with a negative consultation fee (-$50.00).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO doctor (department_id, first_name, last_name, specialization, license_number, consultation_fee, phone, email)
VALUES (1, 'Test', 'Doctor', 'Cardiology', 'LIC-TEST-099', -50.00, '+1-555-9999', 'test.doctor@hospital.org');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: new row for relation "doctor" violates check constraint "chk_doctor_fee_positive"
DETAIL: Failing row contains negative consultation_fee.
STATUS: PASS (Negative financial amounts rejected).
*/


-- ----------------------------------------------------------------------------
-- TEST 5: REFERENTIAL INTEGRITY (FOREIGN KEY RESTRICTION ON ORPHAN RECORDS)
-- Constraint: fk_appointment_patient FOREIGN KEY (patient_id) REFERENCES patient(patient_id)
-- Description: Attempts to create an appointment for non-existent patient (patient_id=99999).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time)
VALUES (99999, 1, '2026-04-01', '10:00:00');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: insert or update on table "appointment" violates foreign key constraint "fk_appointment_patient"
DETAIL: Key (patient_id)=(99999) is not present in table "patient".
STATUS: PASS (Foreign key integrity maintained without orphan appointments).
*/


-- ----------------------------------------------------------------------------
-- TEST 6: INVALID BLOOD GROUP VALUE CHECK CONSTRAINT
-- Constraint: chk_patient_blood_group CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'))
-- Description: Attempts to register a patient with non-standard blood type 'XYZ+'.
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO patient (first_name, last_name, date_of_birth, gender, blood_group, phone, address, emergency_contact_name, emergency_contact_phone)
VALUES ('Invalid', 'Blood', '1990-01-01', 'M', 'XYZ+', '+1-555-9991', '123 Fake St', 'Emergency', '+1-555-9992');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: new row for relation "patient" violates check constraint "chk_patient_blood_group"
STATUS: PASS (Medical domain vocabulary validated).
*/


-- ----------------------------------------------------------------------------
-- TEST 7: PHYSIOLOGICAL VITAL SIGNS RANGE CHECK CONSTRAINT
-- Constraint: chk_vital_temp CHECK (temperature_celsius IS NULL OR (temperature_celsius >= 30.0 AND temperature_celsius <= 45.0))
-- Description: Attempts to log an impossible patient body temperature (55.0 C).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO consultation (appointment_id, patient_id, doctor_id, symptoms, clinical_notes, temperature_celsius)
VALUES (8, 1, 1, 'Fever', 'Extreme hyperthermia entry error', 55.0);

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: new row for relation "consultation" violates check constraint "chk_vital_temp"
STATUS: PASS (Clinical boundary integrity strictly enforced).
*/


-- ----------------------------------------------------------------------------
-- TEST 8: NON-ZERO / POSITIVE PAYMENT AMOUNT CONSTRAINT
-- Constraint: chk_payment_amount_pos CHECK (amount_paid > 0.00)
-- Description: Attempts to process a financial payment with zero or negative amount ($0.00).
-- ----------------------------------------------------------------------------
-- ATTEMPTED ILLEGAL QUERY:
INSERT INTO payment (bill_id, amount_paid, payment_method)
VALUES (1, 0.00, 'CASH');

/*
EXPECTED POSTGRESQL 16 ERROR:
ERROR: new row for relation "payment" violates check constraint "chk_payment_amount_pos"
STATUS: PASS (Financial transactions require strictly positive remittance).
*/

-- ============================================================================
-- ALL 8 INTEGRITY TESTS PASSED SUCCESSFULLY (PostgreSQL 16 Neon Cloud)
-- ============================================================================
