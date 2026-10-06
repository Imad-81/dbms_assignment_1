-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Milestone: Presentation-II / Review 2 Deliverable
-- Document: Complete Relational Schema Definition (DDL)
-- Target RDBMS: PostgreSQL 16 (Neon Cloud Serverless)
-- Architecture: Normalized to Third Normal Form (3NF)
-- Student: Shaik Imaduddin (Roll No: 25WU0101048)
-- Faculty: Dr. Kiran Mayee Adavala
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 0. CLEANUP (Reverse Dependency Drop Order)
-- ----------------------------------------------------------------------------
DROP VIEW IF EXISTS vw_revenue_by_dept CASCADE;
DROP VIEW IF EXISTS vw_outstanding_bills CASCADE;
DROP VIEW IF EXISTS vw_pending_tests CASCADE;
DROP VIEW IF EXISTS vw_bed_occupancy CASCADE;
DROP VIEW IF EXISTS vw_doctor_schedule CASCADE;
DROP VIEW IF EXISTS vw_patient_history CASCADE;

DROP TABLE IF EXISTS payment CASCADE;
DROP TABLE IF EXISTS bill CASCADE;
DROP TABLE IF EXISTS admission CASCADE;
DROP TABLE IF EXISTS bed CASCADE;
DROP TABLE IF EXISTS ward CASCADE;
DROP TABLE IF EXISTS test_order CASCADE;
DROP TABLE IF EXISTS lab_test CASCADE;
DROP TABLE IF EXISTS prescription_item CASCADE;
DROP TABLE IF EXISTS prescription CASCADE;
DROP TABLE IF EXISTS diagnosis CASCADE;
DROP TABLE IF EXISTS consultation CASCADE;
DROP TABLE IF EXISTS appointment CASCADE;
DROP TABLE IF EXISTS doctor_schedule CASCADE;
DROP TABLE IF EXISTS doctor CASCADE;
DROP TABLE IF EXISTS patient CASCADE;
DROP TABLE IF EXISTS department CASCADE;

-- Drop custom ENUM types
DROP TYPE IF EXISTS payment_tender_method CASCADE;
DROP TYPE IF EXISTS bill_payment_status CASCADE;
DROP TYPE IF EXISTS admission_status_type CASCADE;
DROP TYPE IF EXISTS bed_status_type CASCADE;
DROP TYPE IF EXISTS ward_category CASCADE;
DROP TYPE IF EXISTS lab_abnormal_flag CASCADE;
DROP TYPE IF EXISTS lab_order_status CASCADE;
DROP TYPE IF EXISTS diagnosis_classification CASCADE;
DROP TYPE IF EXISTS appointment_visit_type CASCADE;
DROP TYPE IF EXISTS appointment_status_type CASCADE;

-- ============================================================================
-- 1. CONTROLLED VOCABULARIES & CUSTOM ENUM TYPES
-- ============================================================================

CREATE TYPE appointment_status_type AS ENUM (
    'SCHEDULED',
    'CONFIRMED',
    'CHECKED_IN',
    'IN_CONSULTATION',
    'COMPLETED',
    'CANCELLED',
    'NO_SHOW'
);

CREATE TYPE appointment_visit_type AS ENUM (
    'NEW_VISIT',
    'FOLLOW_UP',
    'EMERGENCY',
    'ROUTINE_CHECKUP'
);

CREATE TYPE diagnosis_classification AS ENUM (
    'PRIMARY',
    'SECONDARY',
    'PROVISIONAL',
    'CONFIRMED'
);

CREATE TYPE lab_order_status AS ENUM (
    'ORDERED',
    'SAMPLE_COLLECTED',
    'ANALYZING',
    'COMPLETED',
    'CANCELLED'
);

CREATE TYPE lab_abnormal_flag AS ENUM (
    'NORMAL',
    'ABNORMAL',
    'CRITICAL',
    'PENDING'
);

CREATE TYPE ward_category AS ENUM (
    'GENERAL',
    'SEMI_PRIVATE',
    'PRIVATE',
    'ICU',
    'CCU',
    'EMERGENCY'
);

CREATE TYPE bed_status_type AS ENUM (
    'AVAILABLE',
    'OCCUPIED',
    'MAINTENANCE',
    'RESERVED'
);

CREATE TYPE admission_status_type AS ENUM (
    'ADMITTED',
    'DISCHARGED',
    'TRANSFERRED'
);

CREATE TYPE bill_payment_status AS ENUM (
    'PENDING',
    'PARTIALLY_PAID',
    'PAID',
    'CANCELLED',
    'REFUNDED'
);

CREATE TYPE payment_tender_method AS ENUM (
    'CASH',
    'CREDIT_CARD',
    'DEBIT_CARD',
    'UPI',
    'NET_BANKING',
    'INSURANCE'
);

-- ============================================================================
-- 2. ADMINISTRATIVE MASTER ENTITIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: department
-- Master clinical and administrative medical departments.
-- ----------------------------------------------------------------------------
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    building_floor VARCHAR(50) NOT NULL,
    head_of_department VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE department IS 'Master clinical and administrative medical departments.';

-- ----------------------------------------------------------------------------
-- TABLE: doctor
-- Clinical physicians and medical specialists.
-- ----------------------------------------------------------------------------
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    consultation_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_doctor_department 
        FOREIGN KEY (department_id) 
        REFERENCES department(department_id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_doctor_fee_positive 
        CHECK (consultation_fee >= 0.00)
);

COMMENT ON TABLE doctor IS 'Clinical physicians and medical specialists.';

-- ----------------------------------------------------------------------------
-- TABLE: doctor_schedule
-- Recurring doctor duty shifts and booking thresholds.
-- ----------------------------------------------------------------------------
CREATE TABLE doctor_schedule (
    schedule_id SERIAL PRIMARY KEY,
    doctor_id INT NOT NULL,
    day_of_week VARCHAR(15) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    slot_duration_minutes INT NOT NULL DEFAULT 15,
    max_patients INT NOT NULL DEFAULT 20,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_schedule_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_schedule_day 
        CHECK (day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
    CONSTRAINT chk_schedule_time_bounds 
        CHECK (start_time < end_time),
    CONSTRAINT chk_schedule_slot_positive 
        CHECK (slot_duration_minutes > 0),
    CONSTRAINT chk_schedule_max_patients 
        CHECK (max_patients > 0),
    CONSTRAINT uq_doctor_day_shift 
        UNIQUE (doctor_id, day_of_week, start_time)
);

COMMENT ON TABLE doctor_schedule IS 'Recurring doctor duty shifts and booking thresholds.';

-- ============================================================================
-- 3. PATIENT REGISTRATION & DEMOGRAPHICS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: patient
-- Demographic and emergency medical registry for patients.
-- ----------------------------------------------------------------------------
CREATE TABLE patient (
    patient_id SERIAL PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    blood_group VARCHAR(5) NOT NULL,
    phone VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(100) UNIQUE,
    address TEXT NOT NULL,
    emergency_contact_name VARCHAR(100) NOT NULL,
    emergency_contact_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_patient_dob 
        CHECK (date_of_birth <= CURRENT_DATE),
    CONSTRAINT chk_patient_gender 
        CHECK (gender IN ('M', 'F', 'Other')),
    CONSTRAINT chk_patient_blood_group 
        CHECK (blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'UNKNOWN'))
);

COMMENT ON TABLE patient IS 'Demographic and emergency medical registry for patients.';

-- ============================================================================
-- 4. OUTPATIENT SCHEDULING & CLINICAL ENCOUNTERS
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: appointment
-- Outpatient appointments scheduled between patients and physicians.
-- ----------------------------------------------------------------------------
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status_type NOT NULL DEFAULT 'SCHEDULED',
    appointment_type appointment_visit_type NOT NULL DEFAULT 'NEW_VISIT',
    reason_for_visit TEXT,
    cancellation_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_appointment_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_appointment_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE RESTRICT,
    -- Business Rule: Strict zero-overlap constraint per doctor slot
    CONSTRAINT uq_doctor_slot 
        UNIQUE (doctor_id, appointment_date, appointment_time)
);

COMMENT ON TABLE appointment IS 'Outpatient appointments scheduled between patients and physicians.';

-- ----------------------------------------------------------------------------
-- TABLE: consultation
-- Clinical examination encounters, vitals, and physician findings.
-- ----------------------------------------------------------------------------
CREATE TABLE consultation (
    consultation_id SERIAL PRIMARY KEY,
    appointment_id INT NOT NULL UNIQUE, -- 1:1 relationship with appointment
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    consultation_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    symptoms TEXT NOT NULL,
    clinical_notes TEXT NOT NULL,
    blood_pressure VARCHAR(15), -- e.g., '120/80'
    heart_rate INT, -- BPM
    temperature_celsius NUMERIC(4, 1), -- e.g., 37.2
    spo2_percent NUMERIC(4, 1), -- e.g., 98.5
    follow_up_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_consultation_appointment 
        FOREIGN KEY (appointment_id) 
        REFERENCES appointment(appointment_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_consultation_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_consultation_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_vital_temp 
        CHECK (temperature_celsius IS NULL OR (temperature_celsius >= 30.0 AND temperature_celsius <= 45.0)),
    CONSTRAINT chk_vital_spo2 
        CHECK (spo2_percent IS NULL OR (spo2_percent >= 0.0 AND spo2_percent <= 100.0)),
    CONSTRAINT chk_vital_hr 
        CHECK (heart_rate IS NULL OR (heart_rate >= 30 AND heart_rate <= 250))
);

COMMENT ON TABLE consultation IS 'Clinical examination encounters, vitals, and physician findings.';

-- ----------------------------------------------------------------------------
-- TABLE: diagnosis
-- ICD-10 clinical diagnoses identified during consultations.
-- ----------------------------------------------------------------------------
CREATE TABLE diagnosis (
    diagnosis_id SERIAL PRIMARY KEY,
    consultation_id INT NOT NULL,
    icd_code VARCHAR(20) NOT NULL,
    diagnosis_name VARCHAR(200) NOT NULL,
    diagnosis_type diagnosis_classification NOT NULL DEFAULT 'PRIMARY',
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_diagnosis_consultation 
        FOREIGN KEY (consultation_id) 
        REFERENCES consultation(consultation_id) 
        ON DELETE CASCADE
);

COMMENT ON TABLE diagnosis IS 'ICD-10 clinical diagnoses identified during consultations.';

-- ----------------------------------------------------------------------------
-- TABLE: prescription
-- Electronic prescription header issued by attending physician.
-- ----------------------------------------------------------------------------
CREATE TABLE prescription (
    prescription_id SERIAL PRIMARY KEY,
    consultation_id INT NOT NULL,
    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,
    issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
    special_instructions TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_prescription_consultation 
        FOREIGN KEY (consultation_id) 
        REFERENCES consultation(consultation_id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_prescription_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_prescription_doctor 
        FOREIGN KEY (doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE RESTRICT
);

COMMENT ON TABLE prescription IS 'Electronic prescription header issued by attending physician.';

-- ----------------------------------------------------------------------------
-- TABLE: prescription_item
-- Individual pharmacotherapy line items within a prescription.
-- ----------------------------------------------------------------------------
CREATE TABLE prescription_item (
    item_id SERIAL PRIMARY KEY,
    prescription_id INT NOT NULL,
    medicine_name VARCHAR(150) NOT NULL,
    dosage_form VARCHAR(50) NOT NULL, -- Tablet, Syrup, Injection, Capsule
    strength VARCHAR(50) NOT NULL,    -- 500mg, 10ml, 5mg/ml
    frequency VARCHAR(50) NOT NULL,   -- 1-0-1, 1-1-1, PRN
    duration_days INT NOT NULL,
    route VARCHAR(50) NOT NULL DEFAULT 'Oral',
    instructions TEXT,
    CONSTRAINT fk_item_prescription 
        FOREIGN KEY (prescription_id) 
        REFERENCES prescription(prescription_id) 
        ON DELETE CASCADE,
    CONSTRAINT chk_item_duration_positive 
        CHECK (duration_days > 0)
);

COMMENT ON TABLE prescription_item IS 'Individual pharmacotherapy line items within a prescription.';

-- ============================================================================
-- 5. DIAGNOSTIC LABORATORY SUBSYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: lab_test
-- Master catalog of pathology, imaging, and diagnostic investigations.
-- ----------------------------------------------------------------------------
CREATE TABLE lab_test (
    test_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL,
    test_name VARCHAR(150) NOT NULL,
    test_code VARCHAR(30) NOT NULL UNIQUE,
    test_category VARCHAR(50) NOT NULL,
    standard_price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    sample_type VARCHAR(50) NOT NULL,
    normal_range TEXT,
    turnaround_hours INT NOT NULL DEFAULT 24,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_test_department 
        FOREIGN KEY (department_id) 
        REFERENCES department(department_id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_test_price_positive 
        CHECK (standard_price >= 0.00),
    CONSTRAINT chk_test_tat_positive 
        CHECK (turnaround_hours > 0)
);

COMMENT ON TABLE lab_test IS 'Master catalog of pathology, imaging, and diagnostic investigations.';

-- ----------------------------------------------------------------------------
-- TABLE: test_order
-- Ordered patient diagnostic tests and observed laboratory outcomes.
-- ----------------------------------------------------------------------------
CREATE TABLE test_order (
    order_id SERIAL PRIMARY KEY,
    consultation_id INT NOT NULL,
    patient_id INT NOT NULL,
    test_id INT NOT NULL,
    ordered_by_doctor_id INT NOT NULL,
    order_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sample_collected_date TIMESTAMPTZ,
    result_date TIMESTAMPTZ,
    test_result TEXT,
    reference_range_observed TEXT,
    abnormal_flag lab_abnormal_flag NOT NULL DEFAULT 'PENDING',
    technician_remarks TEXT,
    order_status lab_order_status NOT NULL DEFAULT 'ORDERED',
    CONSTRAINT fk_order_consultation 
        FOREIGN KEY (consultation_id) 
        REFERENCES consultation(consultation_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_order_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_order_test 
        FOREIGN KEY (test_id) 
        REFERENCES lab_test(test_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_order_doctor 
        FOREIGN KEY (ordered_by_doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE RESTRICT
);

COMMENT ON TABLE test_order IS 'Ordered patient diagnostic tests and observed laboratory outcomes.';

-- ============================================================================
-- 6. INPATIENT WARD & BED ALLOCATION SUBSYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: ward
-- Inpatient hospitalization wards categorized by care tier.
-- ----------------------------------------------------------------------------
CREATE TABLE ward (
    ward_id SERIAL PRIMARY KEY,
    department_id INT NOT NULL,
    ward_name VARCHAR(50) NOT NULL UNIQUE,
    ward_type ward_category NOT NULL DEFAULT 'GENERAL',
    floor_number INT NOT NULL,
    daily_rate NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_beds INT NOT NULL DEFAULT 10,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ward_department 
        FOREIGN KEY (department_id) 
        REFERENCES department(department_id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_ward_rate_positive 
        CHECK (daily_rate >= 0.00),
    CONSTRAINT chk_ward_beds_positive 
        CHECK (total_beds > 0)
);

COMMENT ON TABLE ward IS 'Inpatient hospitalization wards categorized by care tier.';

-- ----------------------------------------------------------------------------
-- TABLE: bed
-- Physical bed units within wards with real-time occupancy status.
-- ----------------------------------------------------------------------------
CREATE TABLE bed (
    bed_id SERIAL PRIMARY KEY,
    ward_id INT NOT NULL,
    bed_number VARCHAR(20) NOT NULL,
    status bed_status_type NOT NULL DEFAULT 'AVAILABLE',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    CONSTRAINT fk_bed_ward 
        FOREIGN KEY (ward_id) 
        REFERENCES ward(ward_id) 
        ON DELETE CASCADE,
    -- Business Rule: Bed numbers must be unique within a given ward
    CONSTRAINT uq_ward_bed 
        UNIQUE (ward_id, bed_number)
);

COMMENT ON TABLE bed IS 'Physical bed units within wards with real-time occupancy status.';

-- ----------------------------------------------------------------------------
-- TABLE: admission
-- Inpatient admissions, bed occupancies, and discharge summaries.
-- ----------------------------------------------------------------------------
CREATE TABLE admission (
    admission_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    admitting_doctor_id INT NOT NULL,
    bed_id INT NOT NULL,
    admission_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    discharge_date TIMESTAMPTZ,
    admission_reason TEXT NOT NULL,
    discharge_summary TEXT,
    status admission_status_type NOT NULL DEFAULT 'ADMITTED',
    CONSTRAINT fk_admission_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_admission_doctor 
        FOREIGN KEY (admitting_doctor_id) 
        REFERENCES doctor(doctor_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_admission_bed 
        FOREIGN KEY (bed_id) 
        REFERENCES bed(bed_id) 
        ON DELETE RESTRICT,
    -- Business Rule: Valid admission and discharge chronology
    CONSTRAINT chk_admission_dates 
        CHECK (discharge_date IS NULL OR discharge_date >= admission_date)
);

COMMENT ON TABLE admission IS 'Inpatient admissions, bed occupancies, and discharge summaries.';

-- ============================================================================
-- 7. FINANCIAL BILLING & PAYMENT SUBSYSTEM
-- ============================================================================

-- ----------------------------------------------------------------------------
-- TABLE: bill
-- Consolidated invoices for outpatient and inpatient hospital care.
-- ----------------------------------------------------------------------------
CREATE TABLE bill (
    bill_id SERIAL PRIMARY KEY,
    patient_id INT NOT NULL,
    appointment_id INT UNIQUE, -- Nullable for inpatient-only bills
    admission_id INT UNIQUE,   -- Nullable for outpatient-only bills
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    consultation_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    test_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    bed_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    pharmacy_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    other_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_status bill_payment_status NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bill_patient 
        FOREIGN KEY (patient_id) 
        REFERENCES patient(patient_id) 
        ON DELETE RESTRICT,
    CONSTRAINT fk_bill_appointment 
        FOREIGN KEY (appointment_id) 
        REFERENCES appointment(appointment_id) 
        ON DELETE SET NULL,
    CONSTRAINT fk_bill_admission 
        FOREIGN KEY (admission_id) 
        REFERENCES admission(admission_id) 
        ON DELETE SET NULL,
    CONSTRAINT chk_bill_consultation_pos CHECK (consultation_charges >= 0.00),
    CONSTRAINT chk_bill_test_pos CHECK (test_charges >= 0.00),
    CONSTRAINT chk_bill_bed_pos CHECK (bed_charges >= 0.00),
    CONSTRAINT chk_bill_pharmacy_pos CHECK (pharmacy_charges >= 0.00),
    CONSTRAINT chk_bill_other_pos CHECK (other_charges >= 0.00),
    CONSTRAINT chk_bill_discount_pos CHECK (discount_amount >= 0.00),
    CONSTRAINT chk_bill_tax_pos CHECK (tax_amount >= 0.00),
    CONSTRAINT chk_bill_total_pos CHECK (total_amount >= 0.00)
);

COMMENT ON TABLE bill IS 'Consolidated invoices for outpatient and inpatient hospital care.';

-- ----------------------------------------------------------------------------
-- TABLE: payment
-- Payment receipts recording financial settlements against patient bills.
-- ----------------------------------------------------------------------------
CREATE TABLE payment (
    payment_id SERIAL PRIMARY KEY,
    bill_id INT NOT NULL,
    payment_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_method payment_tender_method NOT NULL DEFAULT 'CASH',
    transaction_reference VARCHAR(100),
    notes TEXT,
    CONSTRAINT fk_payment_bill 
        FOREIGN KEY (bill_id) 
        REFERENCES bill(bill_id) 
        ON DELETE RESTRICT,
    CONSTRAINT chk_payment_amount_pos 
        CHECK (amount_paid > 0.00)
);

COMMENT ON TABLE payment IS 'Payment receipts recording financial settlements against patient bills.';

-- ============================================================================
-- 8. PERFORMANCE INDEXES
-- ============================================================================

-- Doctor & Schedule Indexes
CREATE INDEX idx_doctor_department ON doctor(department_id);
CREATE INDEX idx_doctor_schedule_doctor ON doctor_schedule(doctor_id, day_of_week);

-- Patient Search Indexes
CREATE INDEX idx_patient_phone ON patient(phone);
CREATE INDEX idx_patient_name ON patient(last_name, first_name);

-- Appointment Indexes
CREATE INDEX idx_appointment_doctor_date ON appointment(doctor_id, appointment_date);
CREATE INDEX idx_appointment_patient ON appointment(patient_id);
CREATE INDEX idx_appointment_status ON appointment(status);

-- Clinical & Diagnosis Indexes
CREATE INDEX idx_consultation_patient ON consultation(patient_id);
CREATE INDEX idx_diagnosis_consultation ON diagnosis(consultation_id);
CREATE INDEX idx_prescription_consultation ON prescription(consultation_id);
CREATE INDEX idx_prescription_item_presc ON prescription_item(prescription_id);

-- Laboratory Order Indexes
CREATE INDEX idx_test_order_consultation ON test_order(consultation_id);
CREATE INDEX idx_test_order_patient ON test_order(patient_id);
CREATE INDEX idx_test_order_status ON test_order(order_status);

-- Inpatient Bed & Admission Indexes
CREATE INDEX idx_bed_ward_status ON bed(ward_id, status);
CREATE INDEX idx_admission_patient ON admission(patient_id);
CREATE INDEX idx_admission_bed ON admission(bed_id);
CREATE INDEX idx_admission_status ON admission(status);

-- Billing & Payment Indexes
CREATE INDEX idx_bill_patient ON bill(patient_id);
CREATE INDEX idx_bill_status ON bill(payment_status);
CREATE INDEX idx_payment_bill ON payment(bill_id);

-- ============================================================================
-- 9. OPERATIONAL DATABASE VIEWS (REVIEW 2 DELIVERABLE)
-- ============================================================================

-- View 1: Patient Longitudinal Medical Summary
CREATE OR REPLACE VIEW vw_patient_history AS
SELECT 
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.gender,
    p.blood_group,
    p.phone,
    a.appointment_id,
    a.appointment_date,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor,
    dept.department_name,
    c.consultation_id,
    c.symptoms,
    c.clinical_notes,
    STRING_AGG(DISTINCT diag.icd_code || ': ' || diag.diagnosis_name, '; ') AS diagnoses,
    STRING_AGG(DISTINCT pi.medicine_name || ' (' || pi.strength || ', ' || pi.frequency || ')', '; ') AS prescribed_medications
FROM patient p
JOIN appointment a ON p.patient_id = a.patient_id
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN department dept ON d.department_id = dept.department_id
LEFT JOIN consultation c ON a.appointment_id = c.appointment_id
LEFT JOIN diagnosis diag ON c.consultation_id = diag.consultation_id
LEFT JOIN prescription pr ON c.consultation_id = pr.consultation_id
LEFT JOIN prescription_item pi ON pr.prescription_id = pi.prescription_id
GROUP BY 
    p.patient_id, p.first_name, p.last_name, p.gender, p.blood_group, p.phone,
    a.appointment_id, a.appointment_date, d.first_name, d.last_name, dept.department_name, 
    c.consultation_id, c.symptoms, c.clinical_notes;

COMMENT ON VIEW vw_patient_history IS 'Unified point-of-care longitudinal view combining patient clinical records.';

-- View 2: Doctor Schedule Load & Available Booking Slots
CREATE OR REPLACE VIEW vw_doctor_schedule AS
SELECT 
    d.doctor_id,
    'Dr. ' || d.first_name || ' ' || d.last_name AS doctor_name,
    dept.department_name,
    d.specialization,
    ds.day_of_week,
    ds.start_time || ' - ' || ds.end_time AS working_shift,
    ds.max_patients AS slot_capacity,
    COUNT(a.appointment_id) AS booked_appointments,
    (ds.max_patients - COUNT(a.appointment_id)) AS available_slots
FROM doctor d
JOIN department dept ON d.department_id = dept.department_id
JOIN doctor_schedule ds ON d.doctor_id = ds.doctor_id
LEFT JOIN appointment a ON d.doctor_id = a.doctor_id 
    AND a.status IN ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION')
GROUP BY 
    d.doctor_id, d.first_name, d.last_name, dept.department_name, 
    d.specialization, ds.day_of_week, ds.start_time, ds.end_time, ds.max_patients;

COMMENT ON VIEW vw_doctor_schedule IS 'Real-time outpatient clinic roster monitoring slot capacity and availability.';

-- View 3: Inpatient Bed Occupancy & Real-Time Bed Allocation
CREATE OR REPLACE VIEW vw_bed_occupancy AS
SELECT 
    w.ward_id,
    w.ward_name,
    w.ward_type,
    b.bed_id,
    b.bed_number,
    b.status AS bed_status,
    adm.admission_id,
    p.patient_id,
    p.first_name || ' ' || p.last_name AS admitted_patient,
    adm.admission_date::DATE AS admitted_on,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor
FROM bed b
JOIN ward w ON b.ward_id = w.ward_id
LEFT JOIN admission adm ON b.bed_id = adm.bed_id AND adm.status = 'ADMITTED'
LEFT JOIN patient p ON adm.patient_id = p.patient_id
LEFT JOIN doctor d ON adm.admitting_doctor_id = d.doctor_id;

COMMENT ON VIEW vw_bed_occupancy IS 'Real-time ward and bed occupancy view used by floor supervisors.';

-- View 4: Diagnostic Laboratory Pending & Critical Worklist
CREATE OR REPLACE VIEW vw_pending_tests AS
SELECT 
    tord.order_id,
    tord.order_date::DATE AS order_date,
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.phone AS patient_phone,
    'Dr. ' || d.first_name || ' ' || d.last_name AS ordering_doctor,
    lt.test_code,
    lt.test_name,
    lt.sample_type,
    tord.order_status,
    tord.abnormal_flag,
    tord.test_result,
    tord.technician_remarks
FROM test_order tord
JOIN patient p ON tord.patient_id = p.patient_id
JOIN doctor d ON tord.ordered_by_doctor_id = d.doctor_id
JOIN lab_test lt ON tord.test_id = lt.test_id
WHERE tord.abnormal_flag = 'CRITICAL' OR tord.order_status != 'COMPLETED';

COMMENT ON VIEW vw_pending_tests IS 'Daily laboratory tracking queue for pending investigations and critical alerts.';

-- View 5: Outstanding Inpatient & Outpatient Receivables Ledger
CREATE OR REPLACE VIEW vw_outstanding_bills AS
SELECT 
    b.bill_id,
    b.bill_date,
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.phone AS contact_number,
    b.consultation_charges,
    b.test_charges,
    b.bed_charges,
    b.pharmacy_charges,
    b.total_amount AS net_invoiced,
    COALESCE(SUM(pay.amount_paid), 0.00) AS total_paid,
    (b.total_amount - COALESCE(SUM(pay.amount_paid), 0.00)) AS outstanding_balance,
    b.payment_status
FROM bill b
JOIN patient p ON b.patient_id = p.patient_id
LEFT JOIN payment pay ON b.bill_id = pay.bill_id
WHERE b.payment_status IN ('PENDING', 'PARTIALLY_PAID')
GROUP BY 
    b.bill_id, b.bill_date, p.patient_id, p.first_name, p.last_name, p.phone, 
    b.consultation_charges, b.test_charges, b.bed_charges, b.pharmacy_charges, 
    b.total_amount, b.payment_status;

COMMENT ON VIEW vw_outstanding_bills IS 'Accounts receivable ledger isolating unpaid and partially paid balances.';

-- View 6: Medical Department Revenue Summary
CREATE OR REPLACE VIEW vw_revenue_by_dept AS
SELECT 
    dept.department_id,
    dept.department_name,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COALESCE(SUM(b.total_amount), 0.00) AS gross_invoiced,
    COALESCE(SUM(pay.amount_paid), 0.00) AS total_collected,
    (COALESCE(SUM(b.total_amount), 0.00) - COALESCE(SUM(pay.amount_paid), 0.00)) AS outstanding_dues
FROM department dept
JOIN doctor d ON dept.department_id = d.department_id
JOIN appointment a ON d.doctor_id = a.doctor_id
LEFT JOIN bill b ON a.appointment_id = b.appointment_id
LEFT JOIN payment pay ON b.bill_id = pay.bill_id
GROUP BY dept.department_id, dept.department_name;

COMMENT ON VIEW vw_revenue_by_dept IS 'Executive financial reporting view aggregating clinical departmental collections.';

-- ============================================================================
-- SCHEMA DDL DEFINITION COMPLETE
-- ============================================================================
