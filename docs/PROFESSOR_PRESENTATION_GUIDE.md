# COMPLETE PROFESSOR PRESENTATION & VIVA MASTER GUIDE
## Hospital Appointment & Patient Care Management System (HAPCMS)

**Milestone:** Review 1 (Week 7 — 5 Marks)  
**Target Database:** PostgreSQL 16 (Hosted on Neon Cloud)  

---

## 📑 TABLE OF CONTENTS
1. [Core Database Fundamentals (The Basics Explained)](#1-core-database-fundamentals-the-basics-explained)
2. [Hospital Domain & System Architecture](#2-hospital-domain--system-architecture)
3. [The 16 Normalized Entities (Cluster by Cluster)](#3-the-16-normalized-entities-cluster-by-cluster)
4. [3NF Normalization Explained with Real Examples](#4-3nf-normalization-explained-with-real-examples)
5. [Business Integrity Rules (How the Database Protects Itself)](#5-business-integrity-rules-how-the-database-protects-itself)
6. [Where & How to Run Queries (Neon Web Console & Terminal)](#6-where--how-to-run-queries-neon-web-console--terminal)
7. [Live SQL Queries to Demo in Front of the Professor](#7-live-sql-queries-to-demo-in-front-of-the-professor)
8. [Step-by-Step 5-Minute Presentation Script](#8-step-by-step-5-minute-presentation-script)
9. [Top 15 Viva Questions & Bulletproof Answers](#9-top-15-viva-questions--bulletproof-answers)

---

## 1. CORE DATABASE FUNDAMENTALS (THE BASICS EXPLAINED)

When your professor asks basic theoretical questions, here is how you define each concept clearly and confidently:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATABASE BUILDING BLOCKS                          │
├───────────────────┬─────────────────────────────────────────────────────────┤
│ Concept           │ Definition & Hospital Example                           │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Entity**        │ A real-world object or concept about which data is      │
│                   │ stored. (e.g., `PATIENT`, `DOCTOR`, `APPOINTMENT`).     │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Attribute**     │ A property or characteristic describing an entity.      │
│                   │ (e.g., `first_name`, `date_of_birth`, `phone`).         │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Tuple / Row**   │ A single recorded instance of an entity.                │
│                   │ (e.g., Row 1: Alice Morgan, O+, +1-555-2001).           │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Relation /      │ A two-dimensional grid of rows (tuples) and columns     │
│ Table**           │ (attributes) adhering to relational theory.             │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Primary Key     │ An attribute (or combination) that uniquely and         │
│ (PK)**            │ uniquely identifies every row in a table. It cannot be  │
│                   │ NULL. (e.g., `patient_id` in `patient`).                │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Foreign Key     │ An attribute in one table that references the Primary   │
│ (FK)**            │ Key of another table, establishing a relationship and   │
│                   │ enforcing Referential Integrity.                        │
│                   │ (e.g., `doctor.department_id` references `department`). │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Surrogate Key** │ A system-generated unique integer identifier (`SERIAL`) │
│                   │ with no intrinsic medical meaning, used for efficiency. │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Candidate Key** │ Any attribute that could qualify as a primary key.      │
│                   │ (e.g., `license_number` or `doctor_id` in `doctor`).    │
├───────────────────┼─────────────────────────────────────────────────────────┤
│ **Cardinality**   │ The numerical relationship between entities:            │
│                   │ • **1 : 1** (One Appointment $\to$ One Consultation)   │
│                   │ • **1 : N** (One Doctor $\to$ Many Appointments)        │
│                   │ • **M : N** (Doctors $\leftrightarrow$ Patients via     │
│                   │             `APPOINTMENT` associative table).           │
└───────────────────┴─────────────────────────────────────────────────────────┘
```

---

## 2. HOSPITAL DOMAIN & SYSTEM ARCHITECTURE

### The Problem We Solved
In traditional hospital management:
1. **Schedule Collisions:** Doctors get double-booked for the same time slot.
2. **Disconnected Records:** A doctor cannot see past diagnoses, lab reports, and prescriptions during a visit.
3. **Bed Allocation Conflicts:** Multiple patients get assigned to the same ward bed.
4. **Billing Inconsistencies:** Consultation fees, lab tests, and room charges are billed on disconnected paper slips with revenue leakage.

### Our Solution Architecture
We engineered a **centralized relational schema with 16 tables** hosted on **PostgreSQL (Neon Cloud)**, normalized to **3NF**, enforcing ACID transaction boundaries and zero-collision business rules.

---

## 3. THE 16 NORMALIZED ENTITIES (CLUSTER BY CLUSTER)

Our database is structured into **6 logical operational clusters**:

```
                                  ┌────────────────────────┐
                                  │       DEPARTMENT       │
                                  └───────────┬────────────┘
                                              │ 1:N
                     ┌────────────────────────┴────────────────────────┐
                     ▼                                                 ▼
        ┌─────────────────────────┐                       ┌─────────────────────────┐
        │         DOCTOR          │                       │          WARD           │
        └────────────┬────────────┘                       └────────────┬────────────┘
                     │ 1:N                                             │ 1:N
         ┌───────────┴───────────┐                         ┌───────────┴───────────┐
         ▼                       ▼                         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐       ┌─────────────────┐     ┌─────────────────┐
│ DOCTOR_SCHEDULE │     │   APPOINTMENT   │       │       BED       │     │    LAB_TEST     │
└─────────────────┘     └────────┬────────┘       └────────┬────────┘     └────────┬────────┘
                                 │                         │                       │
                                 ▼ 1:1                     ▼ 1:N                   │
                        ┌─────────────────┐       ┌─────────────────┐              │
                        │  CONSULTATION   │       │    ADMISSION    │              │
                        └────────┬────────┘       └────────┬────────┘              │
                                 │                         │                       │
            ┌────────────────────┼────────────────────┐    │                       │
            ▼                    ▼                    ▼    │                       │
   ┌─────────────────┐  ┌─────────────────┐  ┌─────────────┴───┐                   │
   │    DIAGNOSIS    │  │  PRESCRIPTION   │  │   TEST_ORDER    │◄──────────────────┘
   └─────────────────┘  └────────┬────────┘  └─────────────────┘
                                 │ 1:N
                        ┌────────┴────────┐
                        │PRESCRIPTION_ITEM│
                        └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐ 1:N   ┌─────────────────┐
                        │      BILL       ├──────►│     PAYMENT     │
                        └─────────────────┘       └─────────────────┘
```

### Table Breakdown:
1. **`department`**: Master hospital divisions (Cardiology, Neurology, Pediatrics, General Medicine).
2. **`doctor`**: Clinicians linked to a department with consultation fee and license number.
3. **`doctor_schedule`**: Duty days, shift hours, and patient quotas for each doctor.
4. **`patient`**: Patient demographics, emergency contact, date of birth, blood group.
5. **`appointment`**: Scheduled outpatient encounters (`SCHEDULED`, `COMPLETED`, `CANCELLED`).
6. **`consultation`**: Physical examination notes, vitals (Blood Pressure, Heart Rate, Temperature, SpO2).
7. **`diagnosis`**: ICD-10 standardized diagnostic codes assigned during consultation.
8. **`prescription`**: Prescription header issued by the attending physician.
9. **`prescription_item`**: Individual medicines, dosages, frequencies, and durations in days.
10. **`lab_test`**: Catalog of diagnostic tests, standard costs, and normal reference ranges.
11. **`test_order`**: Diagnostic test instance ordered by a doctor with observed lab results.
12. **`ward`**: Inpatient wards categorized by care level (ICU, Semi-Private, General, Emergency).
13. **`bed`**: Individual physical beds with real-time status (`AVAILABLE`, `OCCUPIED`, `MAINTENANCE`).
14. **`admission`**: Inpatient stay tracking with admitting doctor, allocated bed, and discharge date.
15. **`bill`**: Consolidated invoice aggregating consultation, lab tests, bed per-diem, and medicine charges.
16. **`payment`**: Transaction receipts settling bills (Cash, Credit Card, UPI, Insurance).

---

## 4. 3NF NORMALIZATION EXPLAINED WITH REAL EXAMPLES

If the professor asks: *"How did you normalize your schema to 3NF?"*, use these concrete examples:

### Step 1: First Normal Form (1NF) — "No Repeating Groups & Atomic Values"
- **Violation in Unnormalized Data:** If a doctor writes 3 medicines for a patient, storing `"Amlodipine 5mg, Metoprolol 25mg, Aspirin 75mg"` in one row violates 1NF because the value is not atomic (multi-valued attribute).
- **Our 1NF Solution:** We separated medicines into discrete rows in the `prescription_item` table. Each row stores exactly one atomic medicine name, dosage form, strength, and duration.

### Step 2: Second Normal Form (2NF) — "No Partial Functional Dependencies"
- **Rule:** The table must be in 1NF, and every non-key column must depend on the **entire** primary key (not just a part of a composite key).
- **Our 2NF Solution:** All our tables use single-attribute surrogate primary keys (`item_id`, `doctor_id`, `patient_id`). Because no table has a multi-part composite primary key with dependent sub-attributes, **partial dependencies cannot exist**.

### Step 3: Third Normal Form (3NF) — "No Transitive Dependencies ($X \to Y \to Z$)"
- **Rule:** The table must be in 2NF, and no non-key column may depend on another non-key column.
- **Example 1 (Doctor & Department):**
  - *Transitive Dependency:* `doctor_id` $\to$ `department_id` $\to$ `department_name`, `building_floor`.
  - *If kept in one table:* Updating the Cardiology floor would require updating 50 doctor records (Update Anomaly).
  - *Our 3NF Fix:* We isolated `department` into its own table and only store `department_id` in `doctor`.
- **Example 2 (Admission, Bed & Ward):**
  - *Transitive Dependency:* `admission_id` $\to$ `bed_id` $\to$ `ward_id` $\to$ `daily_rate`.
  - *Our 3NF Fix:* `admission` references `bed_id`, which references `ward_id`. Room daily rates are maintained in exactly one place in `ward`.

---

## 5. BUSINESS INTEGRITY RULES (HOW THE DATABASE PROTECTS ITSELF)

Show the professor that your database actively prevents invalid data:

| Business Rule | Database Enforcement Mechanism | Anomaly Prevented |
| :--- | :--- | :--- |
| **BR-1: No Overlapping Appointments** | `UNIQUE (doctor_id, appointment_date, appointment_time)` | A doctor can never be double-booked for two patients at the same time. |
| **BR-2: Exclusive Bed Occupancy** | `bed.status = 'OCCUPIED'` during active admission | Two admitted patients cannot be placed in the same physical bed. |
| **BR-3: Chronological Stay Validity** | `CHECK (discharge_date IS NULL OR discharge_date >= admission_date)` | Prevents negative hospitalization durations and billing errors. |
| **BR-4: Positive Financial Balances** | `CHECK (amount_paid > 0.00)` and `CHECK (total_amount >= 0.00)` | Prevents negative invoices and corrupt accounting ledgers. |
| **BR-5: Biological Bounds** | `CHECK (date_of_birth <= CURRENT_DATE)` and `CHECK (temp BETWEEN 30 AND 45)` | Rejects impossible dates of birth and invalid physiological vitals. |
| **BR-6: Strict 1:1 Consultation** | `consultation.appointment_id INT NOT NULL UNIQUE` | Guarantees an appointment can generate at most one clinical consultation. |

---

## 6. WHERE & HOW TO RUN QUERIES (NEON WEB CONSOLE & TERMINAL)

You have **two seamless ways** to run queries live:

---

### METHOD A: In the Neon Cloud Web Console (Visual & Interactive)

1. Open your browser and log into [console.neon.tech](https://console.neon.tech).
2. Select your project: **`ep-morning-art-ay2es6n7`** (or your active project).
3. On the left sidebar, click **"SQL Editor"**.
4. You will see a query editor box. Type or paste any SQL query from Section 7 below.
5. Click the blue **"Run"** button (or press `Cmd + Enter` / `Ctrl + Enter`).
6. The query results will appear immediately in a table grid with column headers and row counts!

---

### METHOD B: In Your Mac Terminal (Using the CLI Runner)

Open your terminal in the project directory (`/Users/imadmac/school/assignments/dbms_1`):

1. **Launch the Live Interactive SQL Prompt:**
   ```bash
   ./run_db.sh shell
   ```
   *Now you can type any SQL query directly, like:*
   ```sql
   SELECT doctor_id, first_name, last_name, specialization, consultation_fee FROM doctor;
   ```
   *Type `exit` when done.*

2. **Run all 5 Analytical Report Queries with 1 command:**
   ```bash
   ./run_db.sh reports
   ```

3. **Run the Live Constraint Integrity Test (Viva Demo):**
   ```bash
   ./run_db.sh test
   ```

4. **Display all 16 Tables and current row counts:**
   ```bash
   ./run_db.sh tables
   ```

---

## 7. LIVE SQL QUERIES TO DEMO IN FRONT OF THE PROFESSOR

Copy-paste these queries into **Neon SQL Editor** or `./run_db.sh shell` during your presentation:

---

### LEVEL 1: BASIC QUERIES (Selection, Projection & Filtering)

#### Query 1.1: List all active doctors with their consultation fees
```sql
SELECT doctor_id, first_name, last_name, specialization, consultation_fee, phone
FROM doctor
WHERE is_active = TRUE
ORDER BY consultation_fee DESC;
```
*Purpose:* Shows basic `SELECT`, `WHERE`, and `ORDER BY`.

---

#### Query 1.2: View all available beds ready for patient admission
```sql
SELECT b.bed_id, w.ward_name, w.ward_type, b.bed_number, w.daily_rate, b.status
FROM bed b
JOIN ward w ON b.ward_id = w.ward_id
WHERE b.status = 'AVAILABLE'
ORDER BY w.daily_rate ASC;
```
*Purpose:* Shows 2-table `INNER JOIN` and filtering on bed availability.

---

### LEVEL 2: INTERMEDIATE QUERIES (Multi-Table Joins & Clinical History)

#### Query 2.1: Full Outpatient Consultation Record with Diagnosis
```sql
SELECT 
    a.appointment_id,
    a.appointment_date,
    p.first_name || ' ' || p.last_name AS patient_name,
    'Dr. ' || d.first_name || ' ' || d.last_name AS doctor_name,
    c.blood_pressure,
    c.temperature_celsius AS temp_c,
    c.symptoms,
    diag.icd_code,
    diag.diagnosis_name
FROM appointment a
JOIN patient p ON a.patient_id = p.patient_id
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN consultation c ON a.appointment_id = c.appointment_id
JOIN diagnosis diag ON c.consultation_id = diag.consultation_id
WHERE a.status = 'COMPLETED';
```
*Purpose:* Demonstrates a 5-table relational join connecting administrative booking to clinical findings.

---

#### Query 2.2: Prescription Itemization for a Consultation
```sql
SELECT 
    pr.prescription_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    'Dr. ' || d.last_name AS doctor_name,
    pi.medicine_name,
    pi.dosage_form,
    pi.strength,
    pi.frequency,
    pi.duration_days,
    pi.route
FROM prescription pr
JOIN patient p ON pr.patient_id = p.patient_id
JOIN doctor d ON pr.doctor_id = d.doctor_id
JOIN prescription_item pi ON pr.prescription_id = pi.prescription_id
WHERE pr.prescription_id = 1;
```
*Purpose:* Shows 1NF/3NF decomposed prescription header and line-items.

---

### LEVEL 3: ADVANCED AGGREGATE & REPORTING QUERIES (GROUP BY & KPIs)

#### Query 3.1: Real-Time Ward Bed Occupancy Percentage
```sql
SELECT 
    w.ward_name,
    w.ward_type,
    w.daily_rate,
    w.total_beds,
    COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied_beds,
    COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available_beds,
    ROUND(
        (COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / NULLIF(w.total_beds, 0)::NUMERIC) * 100, 
        1
    ) AS occupancy_percentage
FROM ward w
LEFT JOIN bed b ON w.ward_id = b.ward_id
GROUP BY w.ward_id, w.ward_name, w.ward_type, w.daily_rate, w.total_beds
ORDER BY occupancy_percentage DESC;
```
*Purpose:* Demonstrates `CASE WHEN` aggregation, `LEFT JOIN`, `GROUP BY`, and rate calculation.

---

#### Query 3.2: Financial Audit: Invoiced Charges, Paid Amounts & Pending Dues
```sql
SELECT 
    b.bill_id,
    b.bill_date,
    p.first_name || ' ' || p.last_name AS patient_name,
    b.consultation_charges,
    b.test_charges,
    b.bed_charges,
    b.total_amount AS total_invoiced,
    COALESCE(SUM(pay.amount_paid), 0.00) AS total_paid,
    (b.total_amount - COALESCE(SUM(pay.amount_paid), 0.00)) AS outstanding_balance,
    b.payment_status
FROM bill b
JOIN patient p ON b.patient_id = p.patient_id
LEFT JOIN payment pay ON b.bill_id = pay.bill_id
GROUP BY 
    b.bill_id, b.bill_date, p.first_name, p.last_name, 
    b.consultation_charges, b.test_charges, b.bed_charges, b.total_amount, b.payment_status
ORDER BY outstanding_balance DESC;
```
*Purpose:* Demonstrates multi-tender payment aggregation and outstanding balance computation.

---

#### Query 3.3: Critical & Abnormal Diagnostic Lab Test Results
```sql
SELECT 
    tord.order_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    'Dr. ' || d.last_name AS ordering_doctor,
    lt.test_name,
    lt.sample_type,
    tord.abnormal_flag,
    tord.test_result,
    tord.technician_remarks
FROM test_order tord
JOIN patient p ON tord.patient_id = p.patient_id
JOIN doctor d ON tord.ordered_by_doctor_id = d.doctor_id
JOIN lab_test lt ON tord.test_id = lt.test_id
WHERE tord.abnormal_flag IN ('CRITICAL', 'ABNORMAL')
ORDER BY tord.order_date DESC;
```
*Purpose:* Shows clinical triage and SLA result filtering.

---

### LEVEL 4: CONSTRAINT INTEGRITY TESTS (PROVING DATABASE DEFENSE)

#### Test 4.1: Attempt to Double-Book a Doctor (Should FAIL)
```sql
-- Doctor 1 already has an appointment on 2026-02-16 at 09:30:00.
-- Running this query will trigger a UNIQUE violation error!
INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status)
VALUES (2, 1, '2026-02-16', '09:30:00', 'SCHEDULED');
```
*Expected Database Response:*  
`ERROR: duplicate key value violates unique constraint "uq_doctor_slot"`  
*(Explain to the prof: "The database engine automatically rejected the conflicting appointment.")*

---

#### Test 4.2: Attempt to Insert Negative Payment (Should FAIL)
```sql
-- Attempting to record a negative payment amount:
INSERT INTO payment (bill_id, amount_paid, payment_method)
VALUES (1, -100.00, 'CASH');
```
*Expected Database Response:*  
`ERROR: new row for relation "payment" violates check constraint "chk_payment_amount_pos"`  
*(Explain to the prof: "Domain CHECK constraint ensures accounting integrity.")*

---

## 8. STEP-BY-STEP 5-MINUTE PRESENTATION SCRIPT

Follow this exact script when presenting:

### Minute 1: The Introduction & Problem Statement
> *"Good morning Professor. Today we present Review 1 for the **Hospital Appointment and Patient Care Management System (HAPCMS)** implemented on **PostgreSQL**.*
> 
> *Our goal is to resolve major hospital operational challenges: schedule collisions, disconnected longitudinal medical charts, bed allocation bottlenecks, and fragmented billing. We designed a fully normalized relational schema containing **16 entities** organized into 6 operational clusters."*

### Minute 2: Show the ER Diagram in Browser
*(Open `docs/erd_viewer.html` in your browser)*
> *"Here is our interactive ER Diagram in Crow's Foot notation. As you can see, we have:*
> - *Provider Roster: Department, Doctor, Schedule*
> - *Patient & Appointments: Patient, Appointment*
> - *Clinical Care: Consultation, Diagnosis, Prescription, Prescription Items*
> - *Diagnostics: Lab Test Catalog, Test Orders*
> - *Inpatient: Ward, Bed, Admission*
> - *Financials: Bill, Payments*
> *We have also provided subsystem filters to zoom into specific workflows."*

### Minute 3: Explain 3NF Normalization
> *"Our entire schema adheres strictly to Third Normal Form (3NF):*
> - *1NF: We eliminated repeating groups by isolating medicine items into `prescription_item`.*
> - *2NF: Every entity has a single surrogate primary key, eliminating partial dependencies.*
> - *3NF: We eliminated transitive dependencies. For example, Doctor references `department_id` so department metadata isn't duplicated, and Admission references `bed_id` so daily ward rates are maintained strictly in `ward`."*

### Minute 4: Live Query Demonstration
*(Open Neon SQL Editor or `./run_db.sh shell`)*
> *"Let me show you live queries on our PostgreSQL database hosted on Neon Cloud:*
> 1. *Here is our **Real-time Bed Occupancy report** showing ICU and ward occupancy percentages.*
> 2. *Here is the **Longitudinal Patient Summary** joining appointment, consultation vitals, ICD-10 diagnoses, and prescribed drugs.*
> 3. *And here is our **Billing vs Payment Reconciliation** computing outstanding dues."*

### Minute 5: Show Constraint Enforcement & Conclusion
*(Run the constraint test in Neon or `./run_db.sh test`)*
> *"Finally, we enforce business rules at the database engine level. If I attempt to book two patients for Dr. Jenkins at the exact same time slot, PostgreSQL immediately blocks it with a `UniqueViolation`.*
> 
> *All deliverables for Review 1 are complete, and we are ready to proceed with Review 2 (complex views, PL/pgSQL triggers, and transactions). Thank you!"*

---

## 9. TOP 15 VIVA QUESTIONS & BULLETPROOF ANSWERS

#### Q1: What is Third Normal Form (3NF) in simple terms?
**Answer:** *"A table is in 3NF if it is in 2NF and contains no transitive functional dependencies — meaning every non-key column must depend on the primary key, the whole primary key, and nothing but the primary key."*

#### Q2: What is the difference between a Candidate Key and a Primary Key?
**Answer:** *"A Candidate Key is any column or set of columns that uniquely identifies a row (e.g., `doctor_id` and `license_number`). The Primary Key is the specific candidate key chosen by the database designer as the principal identifier for that table."*

#### Q3: Why use surrogate keys (`SERIAL`) instead of natural keys like national ID or license number?
**Answer:** *"Surrogate integer keys provide faster B-Tree indexing, lower storage overhead in foreign key references, and immunity to changes in real-world identifying attributes."*

#### Q4: How is the 1:1 relationship between `appointment` and `consultation` enforced?
**Answer:** *"In the `consultation` table, `appointment_id` is defined as a Foreign Key with a `UNIQUE` constraint. This guarantees that an appointment can generate at most one clinical consultation record."*

#### Q5: How do you handle appointments that are cancelled?
**Answer:** *"The `appointment` table uses an ENUM status: `'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'`. When cancelled, the status is updated to `'CANCELLED'` and a `cancellation_reason` is recorded without deleting historical data."*

#### Q6: What does `ON DELETE RESTRICT` vs `ON DELETE CASCADE` do in your schema?
**Answer:** *"We use `ON DELETE RESTRICT` for vital master records (like patients and doctors) to prevent accidental deletion if medical records reference them. We use `ON DELETE CASCADE` for parent-child dependent entities (e.g., deleting a prescription automatically cascades to its `prescription_item` line items)."*

#### Q7: How does your database ensure exclusive bed occupancy?
**Answer:** *"The `bed` table maintains a state: `'AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'`. During admission, only available beds can be assigned, and the bed status transitions to `'OCCUPIED'` until discharge."*

#### Q8: How does your schema support both Outpatient (OP) and Inpatient (IP) bills?
**Answer:** *"The `bill` table contains nullable foreign keys to `appointment_id` (for OP visits) and `admission_id` (for IP stays). It aggregates consultation, diagnostic tests, bed per-diem rates, and pharmacy charges into a single unified invoice."*

#### Q9: What is the purpose of the `doctor_schedule` table?
**Answer:** *"It models doctor roster availability by day of the week, shift hours, slot durations, and maximum patient capacity, preventing doctors from being scheduled outside their working hours."*

#### Q10: Why did you separate `lab_test` and `test_order`?
**Answer:** *"To satisfy 3NF. `lab_test` is the master catalog containing test names, sample types, and standard prices. `test_order` records individual patient test instances, sample collection times, and observed results."*

#### Q11: What indexes did you create and why?
**Answer:** *"We created B-Tree indexes on foreign keys (`patient_id`, `doctor_id`, `department_id`, `bill_id`) and search columns (`phone`, `appointment_date`, `status`) to ensure sub-millisecond query response times during joins and lookups."*

#### Q12: How are multi-tender payments handled?
**Answer:** *"The `payment` table has a $1 : N$ relationship with `bill`. A patient can settle a bill in installments or split payments across Cash, Credit Card, UPI, and Health Insurance."*

#### Q13: What happens if a patient's date of birth is entered as a future date?
**Answer:** *"The domain check constraint `CHECK (date_of_birth <= CURRENT_DATE)` immediately rejects the insert."*

#### Q14: What is the difference between `CHAR`, `VARCHAR`, and `TEXT` in PostgreSQL?
**Answer:** *"In PostgreSQL, all three use the same underlying storage. `VARCHAR(n)` enforces a maximum length limit, `CHAR(n)` pads with spaces, and `TEXT` allows unlimited length strings. We use `VARCHAR` for bounded fields (names, phones) and `TEXT` for open notes and symptoms."*

#### Q15: What are your milestones for Review 2?
**Answer:** *"In Review 2 (Week 10), we will implement complex analytical views (Bed Occupancy Dashboard, Doctor Workload, Unpaid Invoices), PL/pgSQL stored procedures, and triggers for automated bed status switching and appointment slot concurrency locking."*
