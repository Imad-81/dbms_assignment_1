-- ============================================================================
-- HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
-- Analytical Verification & Report Queries (Review 1 Deliverable)
-- Target: PostgreSQL 14+
-- ============================================================================

-- ============================================================================
-- QUERY 1: COMPREHENSIVE PATIENT LONGITUDINAL MEDICAL SUMMARY
-- Fetches full clinical history for a patient (Doctor, Diagnosis, Prescriptions, Lab Tests)
-- ============================================================================
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

-- ============================================================================
-- QUERY 2: DOCTOR SCHEDULE & APPOINTMENT LOAD ANALYSIS
-- Evaluates doctor availability against booked appointments
-- ============================================================================
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

-- ============================================================================
-- QUERY 3: REAL-TIME INPATIENT BED OCCUPANCY & CAPACITY REPORT
-- Aggregates bed utilization per ward
-- ============================================================================
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

-- ============================================================================
-- QUERY 4: PENDING & CRITICAL DIAGNOSTIC LABORATORY ORDERS
-- Highlights critical test results and SLA tracking
-- ============================================================================
SELECT 
    tord.order_id,
    tord.order_date,
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

-- ============================================================================
-- QUERY 5: FINANCIAL AUDIT: BILLING & PAYMENT RECONCILIATION
-- Tracks invoiced amount, total payments, and outstanding patient dues
-- ============================================================================
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
