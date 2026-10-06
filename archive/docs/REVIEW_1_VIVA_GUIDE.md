# REVIEW 1 — VIVA & PRESENTATION DEFENSE GUIDE
## Hospital Appointment & Patient Care Management System (HAPCMS)

**Target Milestone:** Review 1 (Week 7 — 5 Marks)  
**Deliverable Focus:** Problem Statement, Scope, User Roles, Functional Requirements, ER Diagram, Relational Schema (3NF), Integrity Constraints.  

---

## 1. 120-SECOND ELEVATOR PITCH (HOW TO OPEN YOUR PRESENTATION)

> *"Respected Evaluators, our project is the **Design and Implementation of a Relational Database Management System for a Hospital Appointment and Patient Care Management System (HAPCMS)**.*
> 
> *In contemporary healthcare management, disconnected systems lead to schedule collisions, uncoordinated bed allocations, fragmented longitudinal patient records, and revenue leakage. Our system solves these critical operational bottlenecks using an enterprise-grade, 3NF-normalized PostgreSQL database.*
> 
> *For Review 1, we have completed the problem definition, user access matrix, detailed functional requirements across 7 modules, a 16-entity conceptual ER model in Crow's Foot notation, a fully normalized relational schema up to 3NF, and implemented production-grade DDL scripts with comprehensive domain and business integrity constraints."*

---

## 2. REVIEW 1 RUBRIC CHECKLIST (5 MARKS ALLOCATION)

| Evaluation Component | Marks | Key Evidence in Our Submission |
| :--- | :---: | :--- |
| **Problem Identification, Scope & Objectives** | 1.0 | Clear analysis of schedule conflicts, fragmented medical records, and bed bottlenecks; SMART objectives defined; in-scope/out-of-scope boundaries established. |
| **User Stakeholder Roles & Requirements** | 1.0 | 7 distinct user roles (Patient, Doctor, Nurse, Receptionist, Pathologist, Billing Officer, Admin) with granular CRUD matrices and 7 Functional Requirement modules (FR-1 to FR-7). |
| **Conceptual ER Modeling & Design** | 1.5 | 16 entities modeled with Crow's Foot ERD, cardinalities (1:1, 1:N, M:N resolved), entity attribute dictionary, and dependency hierarchies. |
| **Relational Schema, 3NF Proofs & Constraints** | 1.5 | Formal relational schema, step-by-step UNF $\to$ 1NF $\to$ 2NF $\to$ 3NF normalization proofs, PostgreSQL DDL with PK, FK, UNIQUE, NOT NULL, and domain CHECK constraints. |

---

## 3. ANTICIPATED VIVA QUESTIONS & MODEL ANSWERS

### Q1: Why did you choose PostgreSQL as the RDBMS for this healthcare system?
**Model Answer:**  
> *"We selected PostgreSQL because healthcare applications demand strict ACID compliance, advanced data integrity controls, and robust concurrency handling. PostgreSQL provides:*
> 1. *Comprehensive declarative `CHECK` and `EXCLUDE` constraint capabilities.*
> 2. *Native custom `ENUM` types for controlled clinical vocabularies.*
> 3. *High-performance indexing (B-Tree, GiST) for rapid search on patient phone, appointment dates, and bed statuses.*
> 4. *Reliable transaction isolation levels to prevent race conditions during concurrent appointment bookings and bed allocations."*

---

### Q2: How does your database guarantee that a doctor is never double-booked for the same time slot?
**Model Answer:**  
> *"We enforce this at the schema layer through a composite `UNIQUE` constraint on the `appointment` table:*
> ```sql
> CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time);
> ```
> *If a concurrent transaction attempts to insert an appointment for the same doctor on the same date and time, PostgreSQL immediately raises a unique violation error, preventing double booking at the database engine level."*

---

### Q3: Explain how the 1:1 relationship between `appointment` and `consultation` is enforced.
**Model Answer:**  
> *"In the `consultation` table, `appointment_id` is defined as a Foreign Key referencing `appointment(appointment_id)` with a `UNIQUE` constraint:*
> ```sql
> appointment_id INT NOT NULL UNIQUE REFERENCES appointment(appointment_id);
> ```
> *The `UNIQUE` constraint guarantees that each scheduled appointment can lead to at most one clinical consultation encounter, enforcing an exact $1 : (0..1)$ relationship."*

---

### Q4: Walk us through the normalization of `prescription` and `prescription_item`. Why not store medicines as a JSON array or comma-separated list?
**Model Answer:**  
> *"Storing multiple medicines in a single prescription record violates **First Normal Form (1NF)** because attributes must be atomic, and multi-valued repeating groups are forbidden.*
> *If stored as comma-separated values or JSON:*
> 1. *We cannot enforce foreign keys or check constraints on individual drug dosage, frequency, or course duration.*
> 2. *Querying patient allergy interactions or pharmacy dispensing histories would require expensive full-table text scans.*
> 
> *Therefore, we decomposed the model into a 3NF structure:*
> - *`prescription` (Header): Contains `prescription_id`, `consultation_id`, `patient_id`, `doctor_id`, `issue_date`.*
> - *`prescription_item` (Line items): Contains `item_id`, `prescription_id` (FK), `medicine_name`, `dosage_form`, `strength`, `frequency`, `duration_days`.*
> *This structure eliminates repeating groups (1NF), ensures full functional dependency on `item_id` (2NF), and eliminates transitive dependencies (3NF)."*

---

### Q5: How did you eliminate Transitive Dependencies to achieve 3NF across the schema?
**Model Answer:**  
> *"Third Normal Form requires that no non-prime attribute is transitively dependent on the primary key ($X \to Y \to Z$). We resolved several key transitive dependencies:*
> 1. *In Doctor Records:* `doctor_id` $\to$ `department_id` $\to$ `department_name`, `building_floor`. We isolated `department` into its own master table and stored only `department_id` in `doctor`.*
> 2. *In Inpatient Beds:* `admission_id` $\to$ `bed_id` $\to$ `ward_id` $\to$ `daily_rate`. We decomposed this into `ward`, `bed`, and `admission`.*
> 3. *In Lab Diagnostics:* `order_id` $\to$ `test_id` $\to$ `test_name`, `standard_price`. We created a `lab_test` catalog and a `test_order` transaction table.*
> *As a result, modifying a department's name or a ward's daily rate requires updating exactly one row in one table, eliminating update anomalies."*

---

### Q6: How do you enforce exclusive bed occupancy (only one active patient per bed)?
**Model Answer:**  
> *"We enforce this through two synchronized mechanisms:*
> 1. *The `bed` table maintains a state attribute `status` with values `('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED')`.*
> 2. *When an admission is created, the system checks that the selected bed is currently `'AVAILABLE'` and updates the bed status to `'OCCUPIED'`.*
> 3. *Upon discharge (`discharge_date` recorded and status set to `'DISCHARGED'`), the bed status is transitioned back to `'AVAILABLE'`.*
> 4. *In Review 2, we will augment this with a PL/pgSQL row-level trigger that automatically updates bed status and prevents allocating any bed whose status is not `'AVAILABLE'`."*

---

### Q7: How does your `bill` table accommodate both Outpatient and Inpatient visits?
**Model Answer:**  
> *"Our `bill` table uses optional (nullable) foreign keys to `appointment_id` (for outpatient visits) and `admission_id` (for inpatient stays):*
> ```sql
> appointment_id INT UNIQUE REFERENCES appointment(appointment_id) ON DELETE SET NULL,
> admission_id INT UNIQUE REFERENCES admission(admission_id) ON DELETE SET NULL,
> ```
> *The bill captures itemized charge buckets (`consultation_charges`, `test_charges`, `bed_charges`, `pharmacy_charges`, `other_charges`), along with `discount_amount`, `tax_amount`, and `total_amount`. Payments are recorded in a separate `payment` table ($1 : N$), allowing partial payments, multiple installments, and diverse payment methods (Cash, Card, UPI, Insurance)."*

---

### Q8: What business rules did you enforce via domain `CHECK` constraints?
**Model Answer:**  
> *"We embedded key business rules directly into the DDL:*
> - *`chk_admission_dates`: `CHECK (discharge_date IS NULL OR discharge_date >= admission_date)`*
> - *`chk_patient_dob`: `CHECK (date_of_birth <= CURRENT_DATE)`*
> - *`chk_vital_temp`: `CHECK (temperature_celsius BETWEEN 30.0 AND 45.0)`*
> - *`chk_vital_spo2`: `CHECK (spo2_percent BETWEEN 0.0 AND 100.0)`*
> - *`chk_schedule_time_bounds`: `CHECK (start_time < end_time)`*
> - *`chk_item_duration_positive`: `CHECK (duration_days > 0)`*
> - *`chk_payment_amount_pos`: `CHECK (amount_paid > 0.00)`*
> - *`chk_doctor_fee_positive`: `CHECK (consultation_fee >= 0.00)`"*

---

## 4. REVIEW 2 & REVIEW 3 FORWARD PLAN

When the evaluators ask: *"What are your next steps for Review 2?"*, answer:
> *"For Review 2 (Week 10), we will implement:*
> 1. *Complex multi-table analytical SQL queries, subqueries, and window functions for clinical and financial KPIs.*
> 2. *Automated relational views for daily bed occupancy, doctor roster utilization, and pending revenue reconciliation.*
> 3. *PostgreSQL PL/pgSQL stored procedures and triggers to automate bed state transitions and enforce appointment slot locking.*
> 4. *Index benchmarking and query plan (`EXPLAIN ANALYZE`) optimization.*
> 
> *For Review 3 (Week 12), we will develop the front-end application in Python (Flask/FastAPI/Streamlit) or Java to provide role-based interfaces for patients, doctors, lab technicians, and front-desk staff."*
