# Presentation-II: SQL Commands, Analytical Queries & Views Reference Guide

**Course:** Database Management Systems (DBMS)  
**Project:** Hospital Appointment & Patient Care Management System (HAPCMS)  
**Student:** Shaik Imaduddin  
**Roll Number:** 25WU0101048  
**Faculty / Instructor:** Dr. Kiran Mayee Adavala  
**Target RDBMS:** PostgreSQL 16 (Neon Cloud Serverless)  
**Deliverable Scope:** Review 2 — Schema Hardening, DDL, Constraints, Queries & Views  

---

## 📌 Executive Summary

This folder contains the complete, production-grade relational database scripts for **Review 2 (Presentation-II)** of the HAPCMS project. The system models the clinical, administrative, and financial lifecycle of an acute-care general hospital, normalized to **Third Normal Form (3NF)** and hardened with database-level integrity constraints, indexes, views, and seed datasets.

### 📂 Directory Files Index

| File | Purpose | Description |
|---|---|---|
| [`01_schema_ddl.sql`](01_schema_ddl.sql) | Schema DDL | 10 custom ENUM types, 16 normalized tables (3NF), primary & foreign keys, domain checks, composite unique constraints, 17 indexes, and 6 views |
| [`02_sample_data_dml.sql`](02_sample_data_dml.sql) | Seed DML | Realistic clinical seed dataset populating all 16 tables (25 patients, 8 doctors, 28 beds, appointments, vitals, prescriptions, lab tests, bills) and sequence resets |
| [`03_queries_and_outputs.sql`](03_queries_and_outputs.sql) | Analytical Queries | 10 verified complex multi-table SQL queries with live ASCII execution outputs from PostgreSQL 16 |
| [`04_constraint_validation_tests.sql`](04_constraint_validation_tests.sql) | Constraint Tests | 8 positive and negative test cases verifying database-level constraint enforcement and ACID transactional rules |
| [`02_Schema_ERD_Keynote.pdf`](02_Schema_ERD_Keynote.pdf) | Slide Deck | Detailed 15-slide technical walkthrough of 3NF schema, ERD, and constraints |
| [`03_Review_2_Presentation.pdf`](03_Review_2_Presentation.pdf) | Presentation | Review 2 slide deck covering schema design, complex joins, views, and live evaluation |
| [`prisma_erd.png`](prisma_erd.png) | ERD Diagram | High-resolution entity relationship diagram generated via Prisma ORM |

---

## 🏗️ Relational Architecture & Normalization (3NF)

The database schema comprises **16 normalized tables** grouped into 6 functional clusters:

```mermaid
erDiagram
    DEPARTMENT ||--o{ DOCTOR : employs
    DOCTOR ||--o{ DOCTOR_SCHEDULE : maintains
    DOCTOR ||--o{ APPOINTMENT : attends
    PATIENT ||--o{ APPOINTMENT : books
    APPOINTMENT ||--|| CONSULTATION : records
    CONSULTATION ||--o{ DIAGNOSIS : classifies
    CONSULTATION ||--|| PRESCRIPTION : issues
    PRESCRIPTION ||--o{ PRESCRIPTION_ITEM : contains
    CONSULTATION ||--o{ TEST_ORDER : orders
    LAB_TEST ||--o{ TEST_ORDER : specifies
    WARD ||--o{ BED : contains
    BED ||--o{ ADMISSION : accommodates
    PATIENT ||--o{ ADMISSION : admits
    DOCTOR ||--o{ ADMISSION : oversees
    PATIENT ||--o{ BILL : billed_to
    APPOINTMENT ||--o| BILL : bills_for
    ADMISSION ||--o| BILL : bills_for
    BILL ||--o{ PAYMENT : settles
```

### Functional Clusters:
1. **Administrative Master:** `department`, `doctor`, `doctor_schedule`
2. **Patient Registry:** `patient`
3. **Outpatient Encounters:** `appointment`, `consultation`
4. **Clinical Findings & Pharmacotherapy:** `diagnosis`, `prescription`, `prescription_item`
5. **Diagnostic Laboratory:** `lab_test`, `test_order`
6. **Inpatient Ward & Bed Subsystem:** `ward`, `bed`, `admission`
7. **Billing & Financial Settlement:** `bill`, `payment`

---

## 🔍 Core Analytical Queries & Execution Outputs

### Query 1: Comprehensive Patient Longitudinal Medical Summary
*Multi-table join across 7 tables synthesizing the complete clinical encounter for attending physicians.*

```sql
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
```

**Live Execution Output:**
| patient_id | patient_name | gender | blood_group | appointment_date | attending_doctor | department_name | symptoms | clinical_notes | diagnoses | prescribed_medications |
|:---:|:---|:---:|:---:|:---:|:---|:---|:---|:---|:---|:---|
| 1 | Alice Morgan | F | O+ | 2026-02-16 | Dr. Sarah Jenkins | Cardiology | Chest tightness, intermittent palpitations for 2 weeks | Normal S1/S2 heart sounds, no systolic murmurs. Ordered ECG and Lipid Profile. | I10: Essential (Primary) Hypertension; R00.2: Palpitations | Amlodipine Besylate (5mg, 1-0-0 (Morning)); Metoprolol Succinate (25mg, 0-0-1 (Night)) |

---

### Query 2: Real-Time Inpatient Bed Occupancy & Capacity Percentage
*Calculates ward-level bed allocation metrics using conditional CASE aggregations and NUMERIC precision casting.*

```sql
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
```

**Live Execution Output:**
| ward_id | ward_name | ward_type | daily_rate | total_beds | occupied_beds | available_beds | maintenance_beds | occupancy_percentage |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Cardiac Intensive Care Unit (CICU) | ICU | $600.00 | 6 | 2 | 3 | 1 | 33.33% |
| 2 | Orthopedic Inpatient Ward | GENERAL | $120.00 | 10 | 2 | 7 | 1 | 20.00% |
| 3 | Executive Medical Suite Ward | PRIVATE | $350.00 | 6 | 1 | 5 | 0 | 16.67% |
| 4 | Acute Emergency Stabilization Bay | EMERGENCY | $400.00 | 6 | 1 | 5 | 0 | 16.67% |

---

### Query 3: Doctor Schedule Load & Slot Availability
*Computes shift capacity thresholds against active bookings to expose real-time booking availability.*

```sql
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
```

**Live Execution Output (Representative Sample):**
| doctor_name | department_name | specialization | day_of_week | working_shift | slot_capacity | booked | available |
|:---|:---|:---|:---|:---:|:---:|:---:|:---:|
| Dr. Sarah Jenkins | Cardiology | Interventional Cardiology | Monday | 09:00 - 13:00 | 8 | 2 | 6 |
| Dr. Sarah Jenkins | Cardiology | Interventional Cardiology | Friday | 14:00 - 18:00 | 8 | 2 | 6 |
| Dr. Alan Turing | Cardiology | Electrophysiology & Arrhythmia | Tuesday | 10:00 - 14:00 | 12 | 1 | 11 |
| Dr. David Miller | General Medicine | Internal Medicine & Geriatrics | Monday | 08:00 - 14:00 | 24 | 2 | 22 |
| Dr. Robert Chen | Neurology | Stroke & Neurocritical Care | Monday | 10:00 - 16:00 | 12 | 1 | 11 |
| Dr. Marcus Vance | Orthopedics | Trauma & Joint Replacement | Tuesday | 08:30 - 12:30 | 12 | 1 | 11 |
| Dr. Emily Watson | Pediatrics | General Pediatrics & Neonatology | Monday | 09:00 - 15:00 | 18 | 2 | 16 |

---

## 🎯 Presentation-II Evaluator Review Highlights

During the **Presentation-II evaluation review**, the evaluators investigated cross-cluster consistency and financial aggregations:

### Highlight A: Inpatient Active Bed vs Admission Consistency Query
*Ensures every bed marked `OCCUPIED` is rigorously linked to an active inpatient admission (`ADMITTED`), the exact patient, and the attending physician.*

```sql
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
```

**Live Execution Output:**
| bed_id | ward_name | bed_number | bed_status | admission_id | admitted_patient | admitted_on | attending_doctor |
|:---:|:---|:---:|:---:|:---:|:---|:---:|:---|
| 23 | Acute Emergency Stabilization Bay | EMRG-01 | OCCUPIED | 6 | Lucas Dubois | 2026-02-26 | Dr. David Miller |
| 1 | Cardiac Intensive Care Unit (CICU) | CICU-01 | OCCUPIED | 1 | Ethan Hunt | 2026-02-18 | Dr. Sarah Jenkins |
| 3 | Cardiac Intensive Care Unit (CICU) | CICU-03 | OCCUPIED | 3 | Marcus Aurelius | 2026-02-22 | Dr. Robert Chen |
| 20 | Executive Medical Suite Ward | EXEC-04 | OCCUPIED | 5 | Samuel Adebayo | 2026-02-25 | Dr. David Miller |
| 7 | Orthopedic Inpatient Ward | ORTH-01 | OCCUPIED | 4 | Dev Kapoor | 2026-02-24 | Dr. Marcus Vance |
| 10 | Orthopedic Inpatient Ward | ORTH-04 | OCCUPIED | 7 | Benjamin Franklin | 2026-02-21 | Dr. Vikram Patel |

*Validation Result:* Exactly 6 active occupied beds match 6 active admissions with zero orphan beds or discrepancies.

---

### Highlight B: Departmental Gross & Net Revenue Aggregation Query
*Aggregates gross billed amounts and net settled cash collections across clinical medical departments by tracing invoices through outpatient visits.*

```sql
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
```

**Live Execution Output:**
| department_name | total_appointments | gross_invoiced | total_collected | outstanding_dues |
|:---|:---:|:---:|:---:|:---:|
| Orthopedics | 3 | $630.00 | $630.00 | $0.00 |
| Cardiology | 6 | $533.40 | $315.00 | $218.40 |
| Neurology | 4 | $246.75 | $246.75 | $0.00 |
| General Medicine | 4 | $0.00 | $0.00 | $0.00 |
| Pediatrics | 3 | $0.00 | $0.00 | $0.00 |

---

## 📊 Operational Database Views

The schema deploys **6 operational database views** encapsulating critical multi-table joins for end-user applications:

1. **`vw_patient_history`**: Longitudinal point-of-care history per patient.
2. **`vw_doctor_schedule`**: Outpatient clinic queue and real-time available slots.
3. **`vw_bed_occupancy`**: Live inpatient ward bed occupancy and admitted patient status.
4. **`vw_pending_tests`**: Laboratory worklist prioritizing critical results and pending turnaround tests.
5. **`vw_outstanding_bills`**: Accounts receivable ledger tracking pending patient balances.
6. **`vw_revenue_by_dept`**: Departmental collections and financial performance summary.

---

## 🛡️ Constraint Enforcement & ACID Integrity Tests

The following 8 negative test cases from [`04_constraint_validation_tests.sql`](04_constraint_validation_tests.sql) confirm database-level protection against corrupt or duplicate entries:

| Test Case | Target Constraint | Injected Illegal Data | PostgreSQL 16 Action |
|---|---|---|---|
| **1. Double Booking** | `uq_doctor_slot` | Second appointment for same doctor at same date & time | `ERROR: duplicate key value violates unique constraint "uq_doctor_slot"` |
| **2. Duplicate Bed** | `uq_ward_bed` | Inserting existing bed number in the same ward | `ERROR: duplicate key value violates unique constraint "uq_ward_bed"` |
| **3. Chronological Inversion** | `chk_admission_dates` | Discharge date preceding admission date | `ERROR: new row violates check constraint "chk_admission_dates"` |
| **4. Negative Fee** | `chk_doctor_fee_positive` | Consultation fee = `-$50.00` | `ERROR: new row violates check constraint "chk_doctor_fee_positive"` |
| **5. Orphan Record** | `fk_appointment_patient` | Appointment for `patient_id = 99999` | `ERROR: insert on table "appointment" violates foreign key constraint "fk_appointment_patient"` |
| **6. Invalid Blood Group** | `chk_patient_blood_group` | Blood group = `'XYZ+'` | `ERROR: new row violates check constraint "chk_patient_blood_group"` |
| **7. Physiological Vitals** | `chk_vital_temp` | Body temperature = `55.0°C` | `ERROR: new row violates check constraint "chk_vital_temp"` |
| **8. Non-Zero Payment** | `chk_payment_amount_pos` | Payment amount = `$0.00` | `ERROR: new row violates check constraint "chk_payment_amount_pos"` |

---

## 🚀 How to Execute the Scripts

### Option A: Using Neon Cloud Web SQL Editor
1. Log in to the [Neon Cloud Console](https://console.neon.tech).
2. Select your project and navigate to the **SQL Editor**.
3. Copy and run the files in sequence:
   - Run [`01_schema_ddl.sql`](01_schema_ddl.sql) to build the schema, indexes, and views.
   - Run [`02_sample_data_dml.sql`](02_sample_data_dml.sql) to load realistic sample seed data.
   - Run [`03_queries_and_outputs.sql`](03_queries_and_outputs.sql) to execute and view all analytical queries.
   - Run [`04_constraint_validation_tests.sql`](04_constraint_validation_tests.sql) to verify constraint integrity.

### Option B: Using PostgreSQL CLI (`psql`)
```bash
# Connect using the Neon Connection URI
export DATABASE_URL="postgresql://neondb_owner:npg_iMy1GnpK7hrW@ep-morning-art-ay2es6n7.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Execute schema creation
psql "$DATABASE_URL" -f Presentation-II/01_schema_ddl.sql

# Execute seed data population
psql "$DATABASE_URL" -f Presentation-II/02_sample_data_dml.sql

# Run analytical queries
psql "$DATABASE_URL" -f Presentation-II/03_queries_and_outputs.sql
```

---
*End of Presentation-II SQL Commands & Queries Documentation*
