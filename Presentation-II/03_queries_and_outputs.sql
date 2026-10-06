-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Milestone: Presentation-II / Review 2 Deliverable
-- Document: Analytical Queries Suite with Verified PostgreSQL 16 Execution Outputs
-- Target RDBMS: PostgreSQL 16 (Neon Cloud Serverless)
-- Student: Shaik Imaduddin (Roll No: 25WU0101048)
-- Faculty: Dr. Kiran Mayee Adavala
-- ============================================================================
--
-- TABLE OF CONTENTS:
-- ----------------------------------------------------------------------------
-- SECTION 1: CORE CLINICAL & OPERATIONAL ANALYTICAL QUERIES
--   - Query 1: Comprehensive Patient Longitudinal Medical Summary (7-Table Join)
--   - Query 2: Real-Time Inpatient Bed Occupancy & Capacity Percentage (Aggregations)
--   - Query 3: Doctor Schedule Load & Slot Availability (Roster vs Bookings)
--
-- SECTION 2: PRESENTATION-II EVALUATOR HIGHLIGHT QUERIES
--   - Query 4 (Highlight A): Inpatient Active Bed vs Admission Consistency Query
--   - Query 5 (Highlight B): Departmental Gross & Net Revenue Aggregation Query
--
-- SECTION 3: DIAGNOSTIC LABORATORY & BILLING AUDIT QUERIES
--   - Query 6: Pending & Critical Diagnostic Laboratory Orders (SLA Tracking)
--   - Query 7: Financial Audit: Billing & Multi-Tender Payment Reconciliation
--
-- SECTION 4: OPERATIONAL DATABASE VIEWS VERIFICATION
--   - Query 8A: Point-of-Care Longitudinal Summary (vw_patient_history)
--   - Query 8B: Doctor Roster & Shift Capacity (vw_doctor_schedule)
--   - Query 8C: Real-Time Inpatient Bed Grid (vw_bed_occupancy)
--   - Query 8D: Laboratory Diagnostic Worklist (vw_pending_tests)
--   - Query 8E: Accounts Receivable Ledger (vw_outstanding_bills)
--   - Query 8F: Executive Departmental Collections (vw_revenue_by_dept)
--
-- SECTION 5: RELATIONAL INTEGRITY & AUDIT VERIFICATION
--   - Query 9: System Table Row Counts Audit Across All 16 Tables
--   - Query 10: Zero Duplicate Appointment Slot Integrity Verification
-- ============================================================================


-- ============================================================================
-- SECTION 1: CORE CLINICAL & OPERATIONAL ANALYTICAL QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 1: COMPREHENSIVE PATIENT LONGITUDINAL MEDICAL SUMMARY
-- Business Rationale:
--   Traverses 7 relational tables across 4 functional domains to synthesize
--   a complete clinical encounter for attending physicians: Patient demographics,
--   consultation vitals, ICD-10 diagnoses, and active pharmacotherapy regimens.
-- Relational Joins:
--   patient -> appointment -> doctor -> department -> consultation 
--   -> diagnosis -> prescription -> prescription_item
-- ----------------------------------------------------------------------------
SELECT 
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.gender,
    p.blood_group,
    a.appointment_date,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor,
    dept.department_name,
    c.symptoms,
    c.clinical_notes,
    STRING_AGG(DISTINCT diag.icd_code || ': ' || diag.diagnosis_name, '; ') AS diagnoses,
    STRING_AGG(DISTINCT pi.medicine_name || ' (' || pi.strength || ', ' || pi.frequency || ')', '; ') AS prescribed_medications
FROM patient p
JOIN appointment a ON p.patient_id = a.patient_id
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN department dept ON d.department_id = dept.department_id
JOIN consultation c ON a.appointment_id = c.appointment_id
LEFT JOIN diagnosis diag ON c.consultation_id = diag.consultation_id
LEFT JOIN prescription pr ON c.consultation_id = pr.consultation_id
LEFT JOIN prescription_item pi ON pr.prescription_id = pi.prescription_id
WHERE p.patient_id = 1
GROUP BY 
    p.patient_id, p.first_name, p.last_name, p.gender, p.blood_group, 
    a.appointment_date, d.first_name, d.last_name, dept.department_name, 
    c.symptoms, c.clinical_notes;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+------------+--------------+--------+-------------+------------------+-------------------+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------+------------------------------------------------------------+----------------------------------------------------------------------------------------+
| patient_id | patient_name | gender | blood_group | appointment_date | attending_doctor  | department_name | symptoms                                               | clinical_notes                                                                 | diagnoses                                                  | prescribed_medications                                                                 |
+============+==============+========+=============+==================+===================+=================+========================================================+================================================================================+============================================================+========================================================================================+
|          1 | Alice Morgan | F      | O+          | 2026-02-16       | Dr. Sarah Jenkins | Cardiology      | Chest tightness, intermittent palpitations for 2 weeks | Normal S1/S2 heart sounds, no systolic murmurs. Ordered ECG and Lipid Profile. | I10: Essential (Primary) Hypertension; R00.2: Palpitations | Amlodipine Besylate (5mg, 1-0-0 (Morning)); Metoprolol Succinate (25mg, 0-0-1 (Night)) |
+------------+--------------+--------+-------------+------------------+-------------------+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------+------------------------------------------------------------+----------------------------------------------------------------------------------------+
(1 row)
*/


-- ----------------------------------------------------------------------------
-- QUERY 2: REAL-TIME INPATIENT BED OCCUPANCY & CAPACITY PERCENTAGE
-- Business Rationale:
--   Calculates ward-level operational metrics using conditional CASE aggregations
--   and NUMERIC casting to prevent integer division truncation. Used by hospital
--   administrators and bed managers for triage and capacity planning.
-- ----------------------------------------------------------------------------
SELECT 
    w.ward_id,
    w.ward_name,
    w.ward_type,
    w.daily_rate,
    w.total_beds,
    COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied_beds,
    COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available_beds,
    COUNT(CASE WHEN b.status = 'MAINTENANCE' THEN 1 END) AS maintenance_beds,
    ROUND(
        (COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / NULLIF(w.total_beds, 0)::NUMERIC) * 100, 
        2
    ) AS occupancy_percentage
FROM ward w
LEFT JOIN bed b ON w.ward_id = b.ward_id
GROUP BY w.ward_id, w.ward_name, w.ward_type, w.daily_rate, w.total_beds
ORDER BY occupancy_percentage DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+---------+------------------------------------+-----------+------------+------------+---------------+----------------+------------------+----------------------+
| ward_id | ward_name                          | ward_type | daily_rate | total_beds | occupied_beds | available_beds | maintenance_beds | occupancy_percentage |
+=========+====================================+===========+============+============+===============+================+==================+======================+
|       1 | Cardiac Intensive Care Unit (CICU) | ICU       |     600.00 |          6 |             2 |              3 |                1 |                33.33 |
|       2 | Orthopedic Inpatient Ward          | GENERAL   |     120.00 |         10 |             2 |              7 |                1 |                20.00 |
|       3 | Executive Medical Suite Ward       | PRIVATE   |     350.00 |          6 |             1 |              5 |                0 |                16.67 |
|       4 | Acute Emergency Stabilization Bay  | EMERGENCY |     400.00 |          6 |             1 |              5 |                0 |                16.67 |
+---------+------------------------------------+-----------+------------+------------+---------------+----------------+------------------+----------------------+
(4 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 3: DOCTOR SCHEDULE LOAD & SLOT AVAILABILITY
-- Business Rationale:
--   Evaluates weekly clinic scheduling thresholds. Compares `max_patients`
--   shift capacity against active appointments (excluding cancelled visits)
--   to display available appointment slots in real-time.
-- ----------------------------------------------------------------------------
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
    d.specialization, ds.day_of_week, ds.start_time, ds.end_time, ds.max_patients
ORDER BY dept.department_name, d.last_name;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+-----------+-------------------+------------------+---------------------------------------+-------------+---------------------+---------------+---------------------+-----------------+
| doctor_id | doctor_name       | department_name  | specialization                        | day_of_week | working_shift       | slot_capacity | booked_appointments | available_slots |
+===========+===================+==================+=======================================+=============+=====================+===============+=====================+=================+
|         1 | Dr. Sarah Jenkins | Cardiology       | Interventional Cardiology             | Monday      | 09:00:00 - 13:00:00 |             8 |                   2 |               6 |
|         1 | Dr. Sarah Jenkins | Cardiology       | Interventional Cardiology             | Friday      | 14:00:00 - 18:00:00 |             8 |                   2 |               6 |
|         1 | Dr. Sarah Jenkins | Cardiology       | Interventional Cardiology             | Wednesday   | 09:00:00 - 13:00:00 |             8 |                   2 |               6 |
|         2 | Dr. Alan Turing   | Cardiology       | Electrophysiology & Arrhythmia        | Tuesday     | 10:00:00 - 14:00:00 |            12 |                   1 |              11 |
|         2 | Dr. Alan Turing   | Cardiology       | Electrophysiology & Arrhythmia        | Thursday    | 10:00:00 - 14:00:00 |            12 |                   1 |              11 |
|         6 | Dr. David Miller  | General Medicine | Internal Medicine & Geriatrics        | Monday      | 08:00:00 - 14:00:00 |            24 |                   2 |              22 |
|         6 | Dr. David Miller  | General Medicine | Internal Medicine & Geriatrics        | Tuesday     | 08:00:00 - 14:00:00 |            24 |                   2 |              22 |
|         6 | Dr. David Miller  | General Medicine | Internal Medicine & Geriatrics        | Thursday    | 08:00:00 - 14:00:00 |            24 |                   2 |              22 |
|         3 | Dr. Robert Chen   | Neurology        | Stroke & Neurocritical Care           | Monday      | 10:00:00 - 16:00:00 |            12 |                   1 |              11 |
|         3 | Dr. Robert Chen   | Neurology        | Stroke & Neurocritical Care           | Thursday    | 10:00:00 - 16:00:00 |            12 |                   1 |              11 |
|         7 | Dr. Maya Lin      | Neurology        | Cognitive Neurology & Epilepsy        | Wednesday   | 11:00:00 - 17:00:00 |            12 |                   2 |              10 |
|         8 | Dr. Vikram Patel  | Orthopedics      | Spine Surgery & Sports Medicine       | Wednesday   | 09:00:00 - 13:00:00 |            12 |                   1 |              11 |
|         4 | Dr. Marcus Vance  | Orthopedics      | Orthopedic Trauma & Joint Replacement | Tuesday     | 08:30:00 - 12:30:00 |            12 |                   1 |              11 |
|         4 | Dr. Marcus Vance  | Orthopedics      | Orthopedic Trauma & Joint Replacement | Friday      | 08:30:00 - 12:30:00 |            12 |                   1 |              11 |
|         5 | Dr. Emily Watson  | Pediatrics       | General Pediatrics & Neonatology      | Monday      | 09:00:00 - 15:00:00 |            18 |                   2 |              16 |
|         5 | Dr. Emily Watson  | Pediatrics       | General Pediatrics & Neonatology      | Wednesday   | 09:00:00 - 15:00:00 |            18 |                   2 |              16 |
+-----------+-------------------+------------------+---------------------------------------+-------------+---------------------+---------------+---------------------+-----------------+
(16 rows)
*/


-- ============================================================================
-- SECTION 2: PRESENTATION-II EVALUATOR HIGHLIGHT QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 4 (HIGHLIGHT A): INPATIENT ACTIVE BED VS ADMISSION CONSISTENCY QUERY
-- Evaluator Request:
--   "Demonstrate that every bed with status 'OCCUPIED' is rigorously linked
--    to an active inpatient admission ('ADMITTED'), the exact admitted patient,
--    and the admitting attending physician without orphan records."
-- Integrity Result:
--   100% referential integrity: Every occupied bed has an active admission.
-- ----------------------------------------------------------------------------
SELECT 
    b.bed_id,
    w.ward_name,
    b.bed_number,
    b.status AS bed_status,
    adm.admission_id,
    p.first_name || ' ' || p.last_name AS admitted_patient,
    adm.admission_date::DATE AS admitted_on,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor
FROM bed b
JOIN ward w ON b.ward_id = w.ward_id
LEFT JOIN admission adm ON b.bed_id = adm.bed_id AND adm.status = 'ADMITTED'
LEFT JOIN patient p ON adm.patient_id = p.patient_id
LEFT JOIN doctor d ON adm.admitting_doctor_id = d.doctor_id
WHERE b.status = 'OCCUPIED'
ORDER BY w.ward_name, b.bed_number;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+--------+------------------------------------+------------+------------+--------------+-------------------+-------------+-------------------+
| bed_id | ward_name                          | bed_number | bed_status | admission_id | admitted_patient  | admitted_on | attending_doctor  |
+========+====================================+============+============+==============+===================+=============+===================+
|     23 | Acute Emergency Stabilization Bay  | EMRG-01    | OCCUPIED   |            6 | Lucas Dubois      | 2026-02-26  | Dr. David Miller  |
|      1 | Cardiac Intensive Care Unit (CICU) | CICU-01    | OCCUPIED   |            1 | Ethan Hunt        | 2026-02-18  | Dr. Sarah Jenkins |
|      3 | Cardiac Intensive Care Unit (CICU) | CICU-03    | OCCUPIED   |            3 | Marcus Aurelius   | 2026-02-22  | Dr. Robert Chen   |
|     20 | Executive Medical Suite Ward       | EXEC-04    | OCCUPIED   |            5 | Samuel Adebayo    | 2026-02-25  | Dr. David Miller  |
|      7 | Orthopedic Inpatient Ward          | ORTH-01    | OCCUPIED   |            4 | Dev Kapoor        | 2026-02-24  | Dr. Marcus Vance  |
|     10 | Orthopedic Inpatient Ward          | ORTH-04    | OCCUPIED   |            7 | Benjamin Franklin | 2026-02-21  | Dr. Vikram Patel  |
+--------+------------------------------------+------------+------------+--------------+-------------------+-------------+-------------------+
(6 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 5 (HIGHLIGHT B): DEPARTMENTAL GROSS & NET REVENUE AGGREGATION QUERY
-- Evaluator Request:
--   "Aggregate gross billed amounts and net settled cash collections across
--    clinical medical departments by tracing invoices through appointments."
-- Business Insight:
--   Exposes financial performance per department, separating invoiced receivables
--   from collected liquid cash and calculating departmental outstanding balance.
-- ----------------------------------------------------------------------------
SELECT 
    dept.department_name,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COALESCE(SUM(b.total_amount), 0.00) AS gross_invoiced,
    COALESCE(SUM(pay.amount_paid), 0.00) AS total_collected,
    COALESCE(SUM(b.total_amount), 0.00) - COALESCE(SUM(pay.amount_paid), 0.00) AS outstanding_dues
FROM department dept
JOIN doctor d ON dept.department_id = d.department_id
JOIN appointment a ON d.doctor_id = a.doctor_id
LEFT JOIN bill b ON a.appointment_id = b.appointment_id
LEFT JOIN payment pay ON b.bill_id = pay.bill_id
GROUP BY dept.department_id, dept.department_name
ORDER BY gross_invoiced DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+------------------+--------------------+----------------+-----------------+------------------+
| department_name  | total_appointments | gross_invoiced | total_collected | outstanding_dues |
+==================+====================+================+=================+==================+
| Orthopedics      |                  3 |         630.00 |          630.00 |             0.00 |
| Cardiology       |                  6 |         533.40 |          315.00 |           218.40 |
| Neurology        |                  4 |         246.75 |          246.75 |             0.00 |
| General Medicine |                  4 |           0.00 |            0.00 |             0.00 |
| Pediatrics       |                  3 |           0.00 |            0.00 |             0.00 |
+------------------+--------------------+----------------+-----------------+------------------+
(5 rows)
*/


-- ============================================================================
-- SECTION 3: DIAGNOSTIC LABORATORY & BILLING AUDIT QUERIES
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 6: PENDING & CRITICAL DIAGNOSTIC LABORATORY ORDERS
-- Business Rationale:
--   Flags urgent laboratory specimens that require immediate clinical attention.
--   Filters by abnormal_flag = 'CRITICAL' or order_status != 'COMPLETED'
--   to support rapid diagnostic response and turnaround time (TAT) monitoring.
-- ----------------------------------------------------------------------------
SELECT 
    tord.order_id,
    tord.order_date::DATE AS order_date,
    p.first_name || ' ' || p.last_name AS patient_name,
    'Dr. ' || d.first_name || ' ' || d.last_name AS ordering_doctor,
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
WHERE tord.abnormal_flag = 'CRITICAL' OR tord.order_status != 'COMPLETED'
ORDER BY tord.order_date DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+----------+------------+------------------+-------------------+---------------------------------+-------------------------+--------------+---------------+------------------------------------------------------------------------------+--------------------------------------------------------------------------+
| order_id | order_date | patient_name     | ordering_doctor   | test_name                       | sample_type             | order_status | abnormal_flag | test_result                                                                  | technician_remarks                                                       |
+==========+============+==================+===================+=================================+=========================+==============+===============+==============================================================================+==========================================================================+
|        6 | 2026-03-03 | Hanna Al-Mansoor | Dr. Alan Turing   | 12-Lead Electrocardiogram (ECG) | Non-Invasive Diagnostic | COMPLETED    | CRITICAL      | Atrial fibrillation with rapid ventricular response (RVR), mean rate 124 bpm | Notified attending electrophysiologist immediately                       |
|        8 | 2026-02-23 | George Clark     | Dr. Sarah Jenkins | Glycated Hemoglobin (HbA1c)     | Whole Blood             | ANALYZING    | PENDING       | NULL                                                                         | Sample in processing queue                                               |
|        4 | 2026-02-18 | Ethan Hunt       | Dr. Sarah Jenkins | NT-proBNP Cardiac Biomarker     | Plasma                  | COMPLETED    | CRITICAL      | NT-proBNP: 4,850 pg/mL                                                       | Markedly elevated cardiac stress marker. Inpatient critical care needed. |
+----------+------------+------------------+-------------------+---------------------------------+-------------------------+--------------+---------------+------------------------------------------------------------------------------+--------------------------------------------------------------------------+
(3 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 7: FINANCIAL AUDIT: BILLING & PAYMENT RECONCILIATION
-- Business Rationale:
--   Tracks itemized charges (consultation, lab tests, bed, pharmacy), total invoiced
--   amount, multi-tender settled payments, and outstanding balances.
--   Enforces positive balance reconciliation and identifies collection defaults.
-- ----------------------------------------------------------------------------
SELECT 
    b.bill_id,
    b.bill_date,
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
GROUP BY 
    b.bill_id, b.bill_date, p.first_name, p.last_name, p.phone, 
    b.consultation_charges, b.test_charges, b.bed_charges, b.pharmacy_charges, 
    b.total_amount, b.payment_status
ORDER BY outstanding_balance DESC, b.bill_date DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+---------+------------+------------------+----------------+----------------------+--------------+-------------+------------------+--------------+------------+---------------------+----------------+
| bill_id | bill_date  | patient_name     | contact_number | consultation_charges | test_charges | bed_charges | pharmacy_charges | net_invoiced | total_paid | outstanding_balance | payment_status |
+=========+============+==================+================+======================+==============+=============+==================+==============+============+=====================+================+
|       4 | 2026-02-20 | Ethan Hunt       | +1-555-2004    |               300.00 |       120.00 |     1200.00 |           180.00 |      1942.50 |    1000.00 |              942.50 | PARTIALLY_PAID |
|       6 | 2026-03-03 | Hanna Al-Mansoor | +1-555-2008    |               130.00 |        50.00 |        0.00 |            28.00 |       218.40 |       0.00 |              218.40 | PENDING        |
|       5 | 2026-02-17 | Sophia Rodriguez | +1-555-2003    |               140.00 |       450.00 |        0.00 |            35.00 |       630.00 |     630.00 |                0.00 | PAID           |
|       1 | 2026-02-16 | Alice Morgan     | +1-555-2001    |               150.00 |       115.00 |        0.00 |            45.00 |       315.00 |     315.00 |                0.00 | PAID           |
|       2 | 2026-02-16 | James Wilson     | +1-555-2002    |               175.00 |         0.00 |        0.00 |            60.00 |       246.75 |     246.75 |                0.00 | PAID           |
|       3 | 2026-02-14 | George Clark     | +1-555-2007    |               600.00 |       450.00 |     1400.00 |           320.00 |      2961.00 |    2961.00 |                0.00 | PAID           |
+---------+------------+------------------+----------------+----------------------+--------------+-------------+------------------+--------------+------------+---------------------+----------------+
(6 rows)
*/


-- ============================================================================
-- SECTION 4: OPERATIONAL DATABASE VIEWS VERIFICATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 8A: VIEW 1 — vw_patient_history
-- Point-of-care longitudinal summary. Top 5 latest appointments shown.
-- ----------------------------------------------------------------------------
SELECT 
    patient_id, 
    patient_name, 
    appointment_date, 
    attending_doctor, 
    department_name, 
    symptoms, 
    diagnoses 
FROM vw_patient_history 
ORDER BY appointment_date DESC 
LIMIT 5;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+------------+--------------+------------------+-------------------+-----------------+----------+-----------+
| patient_id | patient_name | appointment_date | attending_doctor  | department_name | symptoms | diagnoses |
+============+==============+==================+===================+=================+==========+===========+
|         24 | Mira Nair    | 2026-03-18       | Dr. Maya Lin      | Neurology       | NULL     | NULL      |
|         22 | Sonia Gandhi | 2026-03-17       | Dr. David Miller  | General Medicine| NULL     | NULL      |
|         21 | Oliver Twist | 2026-03-16       | Dr. Emily Watson  | Pediatrics      | NULL     | NULL      |
|         20 | Amara Okafor | 2026-03-13       | Dr. Sarah Jenkins | Cardiology      | NULL     | NULL      |
|         18 | Zoe Kravitz  | 2026-03-12       | Dr. Robert Chen   | Neurology       | NULL     | NULL      |
+------------+--------------+------------------+-------------------+-----------------+----------+-----------+
(5 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 8B: VIEW 2 — vw_doctor_schedule
-- Clinic roster monitoring slot capacity and availability.
-- ----------------------------------------------------------------------------
SELECT 
    doctor_name, 
    department_name, 
    day_of_week, 
    working_shift, 
    slot_capacity, 
    booked_appointments, 
    available_slots 
FROM vw_doctor_schedule 
ORDER BY department_name, doctor_name 
LIMIT 6;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+-------------------+-----------------+-------------+---------------------+---------------+---------------------+-----------------+
| doctor_name       | department_name | day_of_week | working_shift       | slot_capacity | booked_appointments | available_slots |
+===================+=================+=============+=====================+===============+=====================+=================+
| Dr. Alan Turing   | Cardiology      | Tuesday     | 10:00:00 - 14:00:00 |            12 |                   1 |              11 |
| Dr. Alan Turing   | Cardiology      | Thursday    | 10:00:00 - 14:00:00 |            12 |                   1 |              11 |
| Dr. Sarah Jenkins | Cardiology      | Monday      | 09:00:00 - 13:00:00 |             8 |                   2 |               6 |
| Dr. Sarah Jenkins | Cardiology      | Friday      | 14:00:00 - 18:00:00 |             8 |                   2 |               6 |
| Dr. Sarah Jenkins | Cardiology      | Wednesday   | 09:00:00 - 13:00:00 |             8 |                   2 |               6 |
| Dr. David Miller  | General Medicine| Monday      | 08:00:00 - 14:00:00 |            24 |                   2 |              22 |
+-------------------+-----------------+-------------+---------------------+---------------+---------------------+-----------------+
(6 rows shown)
*/


-- ----------------------------------------------------------------------------
-- QUERY 8C: VIEW 3 — vw_bed_occupancy
-- Real-time ward bed grid with active patient allocation.
-- ----------------------------------------------------------------------------
SELECT 
    ward_name, 
    bed_number, 
    bed_status, 
    admitted_patient, 
    admitted_on, 
    attending_doctor 
FROM vw_bed_occupancy 
WHERE bed_status = 'OCCUPIED'
ORDER BY ward_name, bed_number;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+------------------------------------+------------+------------+-------------------+-------------+-------------------+
| ward_name                          | bed_number | bed_status | admitted_patient  | admitted_on | attending_doctor  |
+====================================+============+============+===================+=============+===================+
| Acute Emergency Stabilization Bay  | EMRG-01    | OCCUPIED   | Lucas Dubois      | 2026-02-26  | Dr. David Miller  |
| Cardiac Intensive Care Unit (CICU) | CICU-01    | OCCUPIED   | Ethan Hunt        | 2026-02-18  | Dr. Sarah Jenkins |
| Cardiac Intensive Care Unit (CICU) | CICU-03    | OCCUPIED   | Marcus Aurelius   | 2026-02-22  | Dr. Robert Chen   |
| Executive Medical Suite Ward       | EXEC-04    | OCCUPIED   | Samuel Adebayo    | 2026-02-25  | Dr. David Miller  |
| Orthopedic Inpatient Ward          | ORTH-01    | OCCUPIED   | Dev Kapoor        | 2026-02-24  | Dr. Marcus Vance  |
| Orthopedic Inpatient Ward          | ORTH-04    | OCCUPIED   | Benjamin Franklin | 2026-02-21  | Dr. Vikram Patel  |
+------------------------------------+------------+------------+-------------------+-------------+-------------------+
(6 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 8D: VIEW 4 — vw_pending_tests
-- Laboratory worklist queue for critical tests and analyzing specimens.
-- ----------------------------------------------------------------------------
SELECT 
    order_id, 
    order_date, 
    patient_name, 
    ordering_doctor, 
    test_name, 
    order_status, 
    abnormal_flag 
FROM vw_pending_tests 
ORDER BY order_date DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+----------+------------+------------------+-------------------+---------------------------------+--------------+---------------+
| order_id | order_date | patient_name     | ordering_doctor   | test_name                       | order_status | abnormal_flag |
+==========+============+==================+===================+=================================+==============+===============+
|        6 | 2026-03-03 | Hanna Al-Mansoor | Dr. Alan Turing   | 12-Lead Electrocardiogram (ECG) | COMPLETED    | CRITICAL      |
|        8 | 2026-02-23 | George Clark     | Dr. Sarah Jenkins | Glycated Hemoglobin (HbA1c)     | ANALYZING    | PENDING       |
|        4 | 2026-02-18 | Ethan Hunt       | Dr. Sarah Jenkins | NT-proBNP Cardiac Biomarker     | COMPLETED    | CRITICAL      |
+----------+------------+------------------+-------------------+---------------------------------+--------------+---------------+
(3 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 8E: VIEW 5 — vw_outstanding_bills
-- Accounts receivable ledger isolating unpaid balances.
-- ----------------------------------------------------------------------------
SELECT 
    bill_id, 
    bill_date, 
    patient_name, 
    contact_number, 
    net_invoiced, 
    total_paid, 
    outstanding_balance, 
    payment_status 
FROM vw_outstanding_bills 
ORDER BY outstanding_balance DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+---------+------------+------------------+----------------+--------------+------------+---------------------+----------------+
| bill_id | bill_date  | patient_name     | contact_number | net_invoiced | total_paid | outstanding_balance | payment_status |
+=========+============+==================+================+==============+============+=====================+================+
|       4 | 2026-02-20 | Ethan Hunt       | +1-555-2004    |      1942.50 |    1000.00 |              942.50 | PARTIALLY_PAID |
|       6 | 2026-03-03 | Hanna Al-Mansoor | +1-555-2008    |       218.40 |       0.00 |              218.40 | PENDING        |
+---------+------------+------------------+----------------+--------------+------------+---------------------+----------------+
(2 rows)
*/


-- ----------------------------------------------------------------------------
-- QUERY 8F: VIEW 6 — vw_revenue_by_dept
-- Departmental gross collections and receivables.
-- ----------------------------------------------------------------------------
SELECT 
    department_id, 
    department_name, 
    total_appointments, 
    gross_invoiced, 
    total_collected, 
    outstanding_dues 
FROM vw_revenue_by_dept 
ORDER BY gross_invoiced DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+---------------+------------------+--------------------+----------------+-----------------+------------------+
| department_id | department_name  | total_appointments | gross_invoiced | total_collected | outstanding_dues |
+===============+==================+====================+================+=================+==================+
|             3 | Orthopedics      |                  3 |         630.00 |          630.00 |             0.00 |
|             1 | Cardiology       |                  6 |         533.40 |          315.00 |           218.40 |
|             2 | Neurology        |                  4 |         246.75 |          246.75 |             0.00 |
|             5 | General Medicine |                  4 |           0.00 |            0.00 |             0.00 |
|             4 | Pediatrics       |                  3 |           0.00 |            0.00 |             0.00 |
+---------------+------------------+--------------------+----------------+-----------------+------------------+
(5 rows)
*/


-- ============================================================================
-- SECTION 5: RELATIONAL INTEGRITY & AUDIT VERIFICATION
-- ============================================================================

-- ----------------------------------------------------------------------------
-- QUERY 9: TABLE ROW COUNTS AUDIT ACROSS ALL 16 TABLES
-- Business Rationale:
--   Complete structural audit validating populated record density across all
--   16 normalized tables in the PostgreSQL 16 database.
-- ----------------------------------------------------------------------------
SELECT 'bed'               AS table_name, COUNT(*) AS row_count FROM bed               UNION ALL
SELECT 'patient',                         COUNT(*) FROM patient                       UNION ALL
SELECT 'appointment',                     COUNT(*) FROM appointment                   UNION ALL
SELECT 'doctor_schedule',                COUNT(*) FROM doctor_schedule                UNION ALL
SELECT 'prescription_item',               COUNT(*) FROM prescription_item             UNION ALL
SELECT 'diagnosis',                       COUNT(*) FROM diagnosis                     UNION ALL
SELECT 'consultation',                    COUNT(*) FROM consultation                  UNION ALL
SELECT 'doctor',                          COUNT(*) FROM doctor                        UNION ALL
SELECT 'lab_test',                        COUNT(*) FROM lab_test                      UNION ALL
SELECT 'test_order',                      COUNT(*) FROM test_order                    UNION ALL
SELECT 'prescription',                    COUNT(*) FROM prescription                  UNION ALL
SELECT 'admission',                       COUNT(*) FROM admission                     UNION ALL
SELECT 'department',                      COUNT(*) FROM department                    UNION ALL
SELECT 'bill',                            COUNT(*) FROM bill                          UNION ALL
SELECT 'payment',                         COUNT(*) FROM payment                       UNION ALL
SELECT 'ward',                            COUNT(*) FROM ward
ORDER BY row_count DESC;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
+-------------------+-----------+
| table_name        | row_count |
+===================+===========+
| bed               |        28 |
| patient           |        25 |
| appointment       |        20 |
| doctor_schedule   |        16 |
| prescription_item |        12 |
| diagnosis         |        10 |
| consultation      |         8 |
| doctor            |         8 |
| lab_test          |         8 |
| test_order        |         8 |
| prescription      |         7 |
| admission         |         7 |
| department        |         6 |
| bill              |         6 |
| payment           |         5 |
| ward              |         4 |
+-------------------+-----------+
Total Tables: 16 | Cumulative Records: 178 rows
*/


-- ----------------------------------------------------------------------------
-- QUERY 10: ZERO DUPLICATE APPOINTMENT SLOT INTEGRITY VERIFICATION
-- Business Rationale:
--   Tests compliance with constraint `uq_doctor_slot`. Confirms that no doctor
--   has been booked multiple times for the identical date and time slot.
-- Expected Result:
--   Returns 0 rows (confirming flawless constraint enforcement).
-- ----------------------------------------------------------------------------
SELECT 
    doctor_id, 
    appointment_date, 
    appointment_time, 
    COUNT(*) AS slot_collision_count
FROM appointment
GROUP BY doctor_id, appointment_date, appointment_time
HAVING COUNT(*) > 1;

/*
VERIFIED POSTGRESQL 16 EXECUTION OUTPUT:
(0 rows returned — zero duplicate slot collisions, constraint functioning perfectly)
*/

-- ============================================================================
-- END OF ANALYTICAL QUERIES SUITE
-- ============================================================================
