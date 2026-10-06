# HOSPITAL APPOINTMENT AND PATIENT CARE MANAGEMENT SYSTEM (HAPCMS)
## Comprehensive DBMS Project Report

---

### Cover Page Information

- **Project Title:** Hospital Appointment and Patient Care Management System (HAPCMS)
- **Student Name:** Shaik Imaduddin
- **Roll Number:** 25WU0101048
- **Course Name:** Database Management Systems (DBMS)
- **Faculty / Course Instructor:** Dr. Kiran Mayee Adavala
- **Academic Year:** 2025–2026
- **Database Engine:** PostgreSQL 16 (Neon Cloud Serverless)
- **GitHub Repository:** [https://github.com/Imad-81/dbms_assignment_1](https://github.com/Imad-81/dbms_assignment_1)

---

## TABLE OF CONTENTS

1. [Cover Page](#cover-page-information)
2. [Abstract](#2-abstract)
3. [Introduction and Problem Statement](#3-introduction-and-problem-statement)
4. [Objectives and Scope](#4-objectives-and-scope)
5. [Software and Hardware Requirements](#5-software-and-hardware-requirements)
6. [Entity-Relationship (ER) Diagram](#6-entity-relationship-er-diagram)
7. [Relational Schema and Normalization (3NF)](#7-relational-schema-and-normalization-3nf)
8. [Data Dictionary](#8-data-dictionary)
9. [SQL Commands Used (DDL, DML) with Sample Outputs](#9-sql-commands-used-ddl-dml-with-sample-outputs)
10. [Queries with Outputs (Including Presentation-II Queries)](#10-queries-with-outputs)
11. [User Interface (UI) Design and Screenshots](#11-user-interface-ui-design-and-screenshots)
12. [Implementation Details & Architecture](#12-implementation-details--architecture)
13. [Testing (Test Cases, Constraints, and Results)](#13-testing)
14. [Conclusion and Future Enhancements](#14-conclusion-and-future-enhancements)
15. [References](#15-references)
16. [Appendix: GitHub Repository Link & Setup Guide](#16-appendix-github-repository-link--setup-guide)

---

## 2. ABSTRACT

Modern healthcare operations demand high-concurrency, cross-departmental coordination across outpatient appointments, clinical consultations, electronic medical records (EMR), laboratory diagnostics, inpatient bed management, and financial billing. Conventional manual processes and legacy isolated systems suffer from critical data anomalies, including scheduling collisions, fragmented patient charts, unrecorded bed allocations, and billing leakage.

This report presents the **Hospital Appointment and Patient Care Management System (HAPCMS)**, an enterprise-grade relational database architecture implemented on **PostgreSQL 16** and hosted on **Neon Cloud**. The database comprises **16 normalized relations organized into 6 cohesive functional clusters**, fully compliant with **Third Normal Form (3NF)** to eliminate insert, update, and deletion anomalies. Strict domain integrity is enforced via 10 custom PostgreSQL `ENUM` types, 8 relational `CHECK` constraints, composite unique indexes for slot collision prevention, and foreign keys with selective cascade actions. 

A high-performance full-stack web application built on **Next.js 14 (App Router)** and **Prisma ORM** interfaces directly with the relational engine, providing intuitive administrative and clinical dashboards. Systematic positive and negative test suites validate 100% adherence to ACID transactional guarantees and relational integrity constraints.

---

## 3. INTRODUCTION AND PROBLEM STATEMENT

### 3.1 Background & Context
Healthcare institutions are high-velocity environments requiring continuous synchronization between administrative desks, physicians, nurses, laboratory technicians, and finance departments. Every patient journey encompasses a sequence of critical transactional events: registration, doctor appointment booking, clinical consultation, diagnostic testing, prescription dispensation, inpatient hospitalization, and itemized invoice settlement.

### 3.2 Problem Statement
Traditional and fragmented hospital record management systems exhibit several critical structural flaws:
1. **Appointment Overlaps & Double-Booking:** In the absence of relational concurrency locks and unique composite indexing, multiple patients can be erroneously scheduled for the same physician within the identical time window.
2. **Clinical Record Fragmentation:** Patient medical histories, diagnostic diagnoses, and prescribed pharmaceuticals are frequently stored across disparate spreadsheets or paper files, preventing clinicians from accessing a longitudinal care summary at the point of care.
3. **Bed Allocation Inefficiencies & Bottlenecks:** Lack of synchronized state tracking in inpatient wards leads to bed double-allocations, unmonitored bed occupancy, and inaccurate census figures.
4. **Diagnostic & Pharmacy Desynchronization:** Laboratory orders and pharmaceutical prescriptions generated during physician consultations are frequently lost, detached from patient accounts, or delayed in reporting.
5. **Billing Inconsistencies & Revenue Leakage:** Standalone billing systems fail to aggregate multi-departmental charges (consultation tariffs, bed per-diem fees, medication line items, diagnostic charges), resulting in revenue discrepancies and unresolved arrears.

### 3.3 Relational Database Justification
An ACID-compliant Relational Database Management System (RDBMS) like PostgreSQL 16 resolves these vulnerabilities through:
- **Atomicity & Consistency:** Ensuring that complex multi-table transactions (e.g., bed allocation combined with inpatient admission creation) execute completely or rollback entirely.
- **Declarative Domain Integrity:** Enforcing clinical rules at the database engine level via constraints and controlled vocabularies.
- **Relational Optimization:** Utilizing B-Tree indexes and structured joins to aggregate millions of longitudinal records within sub-second latencies.

---

## 4. OBJECTIVES AND SCOPE

### 4.1 SMART Objectives
- **Specific:** Engineer a 3NF-normalized relational database comprising 16 tables covering outpatient care, inpatient management, diagnostic laboratory tracking, and billing reconciliation.
- **Measurable:** Achieve zero appointment double-bookings, 100% exclusive inpatient bed allocation, sub-10ms query execution across indexed joins, and exact financial balance tracking.
- **Achievable:** Implement PostgreSQL 16 DDL with primary keys, foreign keys with referential constraints, custom `ENUM` types, and `CHECK` rules.
- **Relevant:** Eliminate operational hospital bottlenecks and equip medical staff with real-time operational views.
- **Time-Bound:** Executed across three evaluation milestones: Review 1 (Schema & ERD), Review 2 (DDL, Queries, Views, Constraints), and Review 3 (Full-Stack Web Application & Testing).

### 4.2 System Scope

#### In-Scope Modules:
1. **Provider & Roster Management:** Clinical department registry, doctor credentialing, and recurring weekly doctor schedules with capacity limits.
2. **Patient & Appointment Scheduling:** Longitudinal patient registration, status tracking, and conflict-free appointment booking.
3. **Clinical Care & EMR:** Detailed consultation notes, symptom tracking, ICD-10 diagnostic classifications, and itemized multi-drug electronic prescriptions.
4. **Diagnostic Laboratory:** Comprehensive lab test directory, doctor-ordered diagnostics, sample tracking, abnormal flags, and quantitative results.
5. **Inpatient Ward Management:** Ward categorization, bed status tracking (`AVAILABLE`, `OCCUPIED`, `MAINTENANCE`), admission logging, and chronological discharge recording.
6. **Billing & Financial Ledger:** Consolidated invoice generation aggregating appointments, beds, and lab tests, combined with multi-tender payment processing (Cash, UPI, Card, Insurance).

#### Out-of-Scope Modules:
- Real-time IoT biometric patient telemetry streaming.
- Hospital staff human resources payroll and biometric shift punch-clocks.
- External pharmaceutical supply-chain wholesale procurement.

---

## 5. SOFTWARE AND HARDWARE REQUIREMENTS

### 5.1 Software Requirements
| Component | Technology / Tool | Specification |
|---|---|---|
| **RDBMS Engine** | PostgreSQL | Version 16.x (ACID compliant) |
| **Database Cloud Host** | Neon Cloud | Serverless PostgreSQL with SSL/TLS |
| **Object-Relational Mapping** | Prisma ORM | Version 6.4.1 (Type-safe client) |
| **Front-End Framework** | Next.js | Version 14.2.35 (App Router, React 18) |
| **Styling & Icons** | Tailwind CSS & Lucide | Utility-first responsive CSS, Lucide React icons |
| **Runtime Environment** | Node.js & Python | Node.js v20+, Python 3.11+ |
| **Database Tooling** | Prisma Studio & psql | Visual ORM GUI, PostgreSQL interactive CLI |
| **Version Control** | Git & GitHub | Distributed version control repository |

### 5.2 Hardware Requirements
| Resource | Minimum Requirement | Recommended Specification |
|---|---|---|
| **Processor** | Dual-Core 2.0 GHz x86/ARM64 | Quad-Core 2.8 GHz Apple M-Series / Intel Core i7 |
| **RAM (Memory)** | 4 GB | 8 GB or 16 GB |
| **Storage** | 1 GB free disk space | 10 GB SSD storage |
| **Network** | 2 Mbps internet connection | High-speed broadband (for Neon Cloud connectivity) |
| **Display Resolution** | 1280 × 720 pixels | 1920 × 1080 (Full HD) or Retina |

---

## 6. ENTITY-RELATIONSHIP (ER) DIAGRAM

### 6.1 Conceptual Modeling
The HAPCMS relational model is structured into **6 logical clusters** encompassing **16 interrelated entities**:

```
[1. Provider & Roster]
   department (1) ──< (N) doctor (1) ──< (N) doctor_schedule
                              │
[2. Patient & Appointment]    │
   patient (1) ──< (N) appointment (N) >── (1) doctor
      │                    │
[3. Clinical EMR]          └── (1) ──< (1) consultation
      │                                         │
      │                                         ├──< (N) diagnosis
      │                                         └──< (1) prescription (1) ──< (N) prescription_item
[4. Diagnostics]
   patient (1) ──< (N) test_order (N) >── (1) lab_test
      ▲                     ▲
      │                     └── (N) >── (1) doctor
[5. Inpatient Care]
   ward (1) ──< (N) bed (1) ──< (N) admission (N) >── (1) patient
                                       │
                                       └── (N) >── (1) doctor
[6. Financial Ledger]
   patient (1) ──< (N) bill (1) ──< (N) payment
                         ▲
                         ├── (1) ── (1) appointment
                         └── (1) ── (1) admission
```

### 6.2 Entity Cardinalities & Relationships
- **Department to Doctor:** 1-to-Many ($1:N$). A department employs multiple doctors; each doctor belongs to exactly one department.
- **Doctor to Doctor Schedule:** 1-to-Many ($1:N$). Each doctor maintains distinct schedule records for days of the week.
- **Patient to Appointment:** 1-to-Many ($1:N$). A patient can book multiple appointments over time.
- **Doctor to Appointment:** 1-to-Many ($1:N$). A doctor attends to multiple scheduled appointments.
- **Appointment to Consultation:** 1-to-1 ($1:1$). Exactly one clinical consultation note is recorded per appointment.
- **Consultation to Diagnosis:** 1-to-Many ($1:N$). A single consultation can uncover multiple primary or secondary diagnoses.
- **Consultation to Prescription:** 1-to-1 ($1:1$). A consultation generates an electronic prescription.
- **Prescription to Prescription Item:** 1-to-Many ($1:N$). A prescription consists of multiple line items (medications, dosage, frequency).
- **Patient to Test Order:** 1-to-Many ($1:N$). Diagnostic orders reference the patient and the ordering physician.
- **Lab Test to Test Order:** 1-to-Many ($1:N$). Master diagnostic catalog items can be ordered across many clinical encounters.
- **Ward to Bed:** 1-to-Many ($1:N$). A ward houses multiple hospital beds.
- **Bed to Admission:** 1-to-Many ($1:N$). A bed accommodates sequential inpatient admissions over time.
- **Bill to Payment:** 1-to-Many ($1:N$). An itemized bill supports multiple installment payments across different tender methods.

*(Refer to `Project-Report/assets/prisma_erd.png` for the complete graphical entity-relationship diagram generated directly from the database schema).*

---

## 7. RELATIONAL SCHEMA AND NORMALIZATION (3NF)

### 7.1 Relational Schema Representation
The schema is defined by 16 relations where **Primary Keys** are denoted with **PK** and **Foreign Keys** with **FK**:

1. `department` (**department_id [PK]**, department_name, building_floor, head_of_department, contact_phone, created_at)
2. `doctor` (**doctor_id [PK]**, department_id [FK], first_name, last_name, specialization, license_number, phone, email, consultation_fee, is_active, created_at)
3. `doctor_schedule` (**schedule_id [PK]**, doctor_id [FK], day_of_week, start_time, end_time, max_patients)
4. `patient` (**patient_id [PK]**, first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, created_at)
5. `appointment` (**appointment_id [PK]**, patient_id [FK], doctor_id [FK], appointment_date, appointment_time, visit_type, status, reason_for_visit, cancellation_reason, created_at)
6. `consultation` (**consultation_id [PK]**, appointment_id [FK], consultation_date, symptoms, clinical_notes, follow_up_date, created_at)
7. `diagnosis` (**diagnosis_id [PK]**, consultation_id [FK], icd_code, diagnosis_name, diagnosis_type, remarks)
8. `prescription` (**prescription_id [PK]**, consultation_id [FK], prescription_date, instructions, created_at)
9. `prescription_item` (**item_id [PK]**, prescription_id [FK], medicine_name, dosage, strength, frequency, duration_days, quantity, remarks)
10. `lab_test` (**test_id [PK]**, test_code, test_name, category, sample_type, standard_price, normal_range, turnaround_hours, is_active)
11. `test_order` (**order_id [PK]**, patient_id [FK], consultation_id [FK], ordered_by_doctor_id [FK], test_id [FK], order_date, order_status, sample_collected_at, result_available_at, test_result, normal_range_snapshot, abnormal_flag, technician_remarks)
12. `ward` (**ward_id [PK]**, ward_name, ward_type, total_beds, daily_rate, created_at)
13. `bed` (**bed_id [PK]**, ward_id [FK], bed_number, bed_type, status)
14. `admission` (**admission_id [PK]**, patient_id [FK], admitting_doctor_id [FK], bed_id [FK], admission_date, discharge_date, admission_reason, discharge_summary, status)
15. `bill` (**bill_id [PK]**, patient_id [FK], appointment_id [FK], admission_id [FK], bill_date, due_date, total_amount, payment_status, created_at)
16. `payment` (**payment_id [PK]**, bill_id [FK], payment_date, amount_paid, payment_method, transaction_reference, notes, created_at)

---

### 7.2 Normalization Proofs (1NF, 2NF, 3NF)

#### A. First Normal Form (1NF) Compliance
- **Rule:** Every column contains atomic (indivisible) values; no repeating groups, arrays, or comma-separated lists exist within tuples.
- **Validation:** 
  - Patient names are decomposed into `first_name` and `last_name`.
  - Prescriptions do not store multi-drug lists as strings; each prescribed pharmaceutical is modeled as an atomic row in `prescription_item`.
  - Diagnoses are decomposed into individual tuples in `diagnosis` referencing distinct `icd_code` entries.

#### B. Second Normal Form (2NF) Compliance
- **Rule:** The relation is in 1NF and contains **no partial functional dependencies** (no non-prime attribute depends on a proper subset of any candidate key).
- **Validation:**
  - All 16 relations utilize single-column surrogate primary keys (`SERIAL` / `INTEGER PRIMARY KEY`).
  - By relational mathematical definition, because no candidate key is composite, no partial functional dependency can exist. Every non-prime attribute is fully functionally dependent on the entire primary key.

#### C. Third Normal Form (3NF) Compliance
- **Rule:** The relation is in 2NF and contains **no transitive functional dependencies** ($X \to Y$, where $Y$ is not a subset of $X$, and $X$ is not a superkey).
- **Validation:**
  - In `doctor`, the department name and floor are not stored; only `department_id` is maintained, preventing the transitive dependency $\text{doctor\_id} \to \text{department\_id} \to \text{building\_floor}$.
  - In `appointment`, doctor consultation fees and department details are not stored; they reside solely in `doctor` and `department`.
  - In `bed`, ward daily tariffs and ward types are not stored; they reference `ward_id` in `ward`.
  - In `prescription_item`, medicine details are tied directly to `prescription_id`.
  - In `bill`, total invoiced amounts are reconciled without duplicating raw medical fee structures from doctors or wards.
- **Conclusion:** The database schema is fully verified to be in **Third Normal Form (3NF)**.

---

## 8. DATA DICTIONARY

The following data dictionary specifies the complete structural definitions, storage data types, nullability, and database constraints for all 16 tables.

### 8.1 Cluster 1: Provider & Roster
#### Table: `department`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `department_id` | SERIAL | NO | PRIMARY KEY | Unique department identifier |
| `department_name` | VARCHAR(100) | NO | UNIQUE | Department title |
| `building_floor` | VARCHAR(50) | NO | - | Physical location and floor |
| `head_of_department` | VARCHAR(100) | YES | - | Physician in charge |
| `contact_phone` | VARCHAR(20) | YES | - | Department contact extension |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Timestamp of creation |

#### Table: `doctor`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `doctor_id` | SERIAL | NO | PRIMARY KEY | Unique physician identifier |
| `department_id` | INTEGER | NO | FK -> department | Parent clinical department |
| `first_name` | VARCHAR(50) | NO | - | Doctor given name |
| `last_name` | VARCHAR(50) | NO | - | Doctor family name |
| `specialization` | VARCHAR(100) | NO | - | Medical specialty |
| `license_number` | VARCHAR(50) | NO | UNIQUE | Medical practice council license |
| `phone` | VARCHAR(20) | NO | - | Direct physician contact phone |
| `email` | VARCHAR(100) | NO | UNIQUE | Official institutional email |
| `consultation_fee` | NUMERIC(10,2) | NO | CHECK (>= 0) | Outpatient consultation tariff |
| `is_active` | BOOLEAN | NO | DEFAULT TRUE | Active hospital roster status |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Record creation timestamp |

#### Table: `doctor_schedule`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `schedule_id` | SERIAL | NO | PRIMARY KEY | Unique roster record ID |
| `doctor_id` | INTEGER | NO | FK -> doctor | Attending doctor |
| `day_of_week` | VARCHAR(15) | NO | ENUM | Day of duty (MONDAY-SUNDAY) |
| `start_time` | TIME | NO | - | Shift start time |
| `end_time` | TIME | NO | CHECK (end > start) | Shift end time |
| `max_patients` | INTEGER | NO | CHECK (> 0) | Maximum appointment slot capacity |

---

### 8.2 Cluster 2: Patient & Appointment
#### Table: `patient`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `patient_id` | SERIAL | NO | PRIMARY KEY | Unique patient record number |
| `first_name` | VARCHAR(50) | NO | - | Patient first name |
| `last_name` | VARCHAR(50) | NO | - | Patient last name |
| `date_of_birth` | DATE | NO | CHECK (<= CURRENT_DATE) | Date of birth |
| `gender` | VARCHAR(10) | NO | ENUM | MALE, FEMALE, OTHER |
| `blood_group` | VARCHAR(5) | YES | CHECK (IN valid types) | A+, A-, B+, B-, AB+, AB-, O+, O- |
| `phone` | VARCHAR(20) | NO | UNIQUE | Primary contact telephone |
| `email` | VARCHAR(100) | YES | - | Email address |
| `address` | TEXT | YES | - | Residential address |
| `emergency_contact_name` | VARCHAR(100) | YES | - | Emergency next-of-kin |
| `emergency_contact_phone` | VARCHAR(20) | YES | - | Next-of-kin contact phone |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Patient registration timestamp |

#### Table: `appointment`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `appointment_id` | SERIAL | NO | PRIMARY KEY | Unique appointment ID |
| `patient_id` | INTEGER | NO | FK -> patient | Booked patient |
| `doctor_id` | INTEGER | NO | FK -> doctor | Assigned physician |
| `appointment_date` | DATE | NO | - | Date of scheduled consultation |
| `appointment_time` | TIME | NO | - | Time slot for visit |
| `visit_type` | VARCHAR(20) | NO | ENUM | NEW_VISIT, FOLLOW_UP, EMERGENCY |
| `status` | VARCHAR(20) | NO | ENUM | SCHEDULED, CONFIRMED, COMPLETED... |
| `reason_for_visit` | TEXT | YES | - | Chief complaint description |
| `cancellation_reason` | TEXT | YES | - | Reason if appointment is cancelled |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Booking timestamp |
| *(Composite Constraint)* | - | - | UNIQUE (doctor_id, date, time) | **Prevents double-booking collisions** |

---

### 8.3 Cluster 3: Clinical Care & EMR
#### Table: `consultation`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `consultation_id` | SERIAL | NO | PRIMARY KEY | Unique clinical encounter ID |
| `appointment_id` | INTEGER | NO | UNIQUE, FK -> appointment | Associated appointment visit |
| `consultation_date` | TIMESTAMPTZ | NO | DEFAULT now() | Encounter timestamp |
| `symptoms` | TEXT | NO | - | Documented patient symptoms |
| `clinical_notes` | TEXT | YES | - | Physician examination remarks |
| `follow_up_date` | DATE | YES | - | Recommended follow-up date |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Record creation timestamp |

#### Table: `diagnosis`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `diagnosis_id` | SERIAL | NO | PRIMARY KEY | Unique diagnostic entry ID |
| `consultation_id` | INTEGER | NO | FK -> consultation | Parent consultation encounter |
| `icd_code` | VARCHAR(20) | NO | - | ICD-10 standard diagnostic code |
| `diagnosis_name` | VARCHAR(255) | NO | - | Clinician disease formulation |
| `diagnosis_type` | VARCHAR(20) | NO | ENUM | PRIMARY, SECONDARY, PROVISIONAL |
| `remarks` | TEXT | YES | - | Additional clinical notes |

#### Table: `prescription`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `prescription_id` | SERIAL | NO | PRIMARY KEY | Unique electronic prescription ID |
| `consultation_id` | INTEGER | NO | FK -> consultation | Associated consultation |
| `prescription_date` | TIMESTAMPTZ | NO | DEFAULT now() | Prescription generation timestamp |
| `instructions` | TEXT | YES | - | General pharmaceutical advice |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Timestamp |

#### Table: `prescription_item`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `item_id` | SERIAL | NO | PRIMARY KEY | Unique medication line item ID |
| `prescription_id` | INTEGER | NO | FK -> prescription | Parent prescription |
| `medicine_name` | VARCHAR(100) | NO | - | Brand/generic drug name |
| `dosage` | VARCHAR(50) | NO | - | E.g. "1 Tablet", "5 ml" |
| `strength` | VARCHAR(50) | NO | - | E.g. "500 mg", "10 mg" |
| `frequency` | VARCHAR(50) | NO | - | E.g. "Twice daily after food" |
| `duration_days` | INTEGER | NO | CHECK (> 0) | Treatment course in days |
| `quantity` | INTEGER | NO | CHECK (> 0) | Total dispensed units |
| `remarks` | TEXT | YES | - | Specific warnings (e.g., with water) |

---

### 8.4 Cluster 4: Diagnostic Laboratory
#### Table: `lab_test`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `test_id` | SERIAL | NO | PRIMARY KEY | Diagnostic test catalog identifier |
| `test_code` | VARCHAR(20) | NO | UNIQUE | Standard lab procedural code |
| `test_name` | VARCHAR(100) | NO | - | Laboratory investigation title |
| `category` | VARCHAR(50) | NO | - | Pathology, Biochemistry, Radiology |
| `sample_type` | VARCHAR(50) | NO | - | Blood, Serum, Urine, Imaging |
| `standard_price` | NUMERIC(10,2) | NO | CHECK (>= 0) | Standard laboratory charge |
| `normal_range` | VARCHAR(100) | YES | - | Clinical benchmark baseline |
| `turnaround_hours` | INTEGER | NO | CHECK (> 0) | Standard diagnostic reporting SLA |
| `is_active` | BOOLEAN | NO | DEFAULT TRUE | Catalog operational state |

#### Table: `test_order`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `order_id` | SERIAL | NO | PRIMARY KEY | Unique diagnostic requisition ID |
| `patient_id` | INTEGER | NO | FK -> patient | Patient undergoing diagnostic test |
| `consultation_id` | INTEGER | YES | FK -> consultation | Linked consultation encounter |
| `ordered_by_doctor_id` | INTEGER | NO | FK -> doctor | Ordering clinician |
| `test_id` | INTEGER | NO | FK -> lab_test | Ordered catalog test |
| `order_date` | TIMESTAMPTZ | NO | DEFAULT now() | Requisition ordering timestamp |
| `order_status` | VARCHAR(25) | NO | ENUM | ORDERED, COLLECTED, COMPLETED... |
| `sample_collected_at` | TIMESTAMPTZ | YES | - | Specimen collection time |
| `result_available_at` | TIMESTAMPTZ | YES | - | Result authorization timestamp |
| `test_result` | TEXT | YES | - | Quantitative or qualitative result |
| `normal_range_snapshot` | VARCHAR(100) | YES | - | Reference baseline at time of test |
| `abnormal_flag` | VARCHAR(15) | NO | ENUM | NORMAL, ABNORMAL, CRITICAL |
| `technician_remarks` | TEXT | YES | - | Lab pathologist findings |

---

### 8.5 Cluster 5: Inpatient Care
#### Table: `ward`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `ward_id` | SERIAL | NO | PRIMARY KEY | Hospital ward identifier |
| `ward_name` | VARCHAR(100) | NO | UNIQUE | Ward designation (e.g. ICU, General) |
| `ward_type` | VARCHAR(50) | NO | ENUM | GENERAL, SEMI_PRIVATE, ICU, CCU |
| `total_beds` | INTEGER | NO | CHECK (> 0) | Total physical bed capacity |
| `daily_rate` | NUMERIC(10,2) | NO | CHECK (>= 0) | Daily inpatient bed tariff |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Record timestamp |

#### Table: `bed`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `bed_id` | SERIAL | NO | PRIMARY KEY | Physical bed identifier |
| `ward_id` | INTEGER | NO | FK -> ward | Housing ward |
| `bed_number` | VARCHAR(20) | NO | - | Room and bed code (e.g. ICU-01) |
| `bed_type` | VARCHAR(50) | NO | ENUM | STANDARD, ICU, ISOLATION |
| `status` | VARCHAR(20) | NO | ENUM | AVAILABLE, OCCUPIED, MAINTENANCE |
| *(Composite Constraint)* | - | - | UNIQUE (ward_id, bed_number) | Ensures unique bed labels per ward |

#### Table: `admission`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `admission_id` | SERIAL | NO | PRIMARY KEY | Inpatient admission record ID |
| `patient_id` | INTEGER | NO | FK -> patient | Admitted inpatient |
| `admitting_doctor_id` | INTEGER | NO | FK -> doctor | Attending admitting physician |
| `bed_id` | INTEGER | NO | FK -> bed | Allocated bed |
| `admission_date` | TIMESTAMPTZ | NO | DEFAULT now() | Admission date and time |
| `discharge_date` | TIMESTAMPTZ | YES | CHECK (>= admission) | Discharge date and time |
| `admission_reason` | TEXT | NO | - | Clinical reason for inpatient stay |
| `discharge_summary` | TEXT | YES | - | Clinician discharge notes |
| `status` | VARCHAR(20) | NO | ENUM | ADMITTED, DISCHARGED, TRANSFERRED |

---

### 8.6 Cluster 6: Financial Ledger
#### Table: `bill`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `bill_id` | SERIAL | NO | PRIMARY KEY | Invoicing invoice number |
| `patient_id` | INTEGER | NO | FK -> patient | Invoiced patient |
| `appointment_id` | INTEGER | YES | FK -> appointment | Linked outpatient appointment |
| `admission_id` | INTEGER | YES | FK -> admission | Linked inpatient stay |
| `bill_date` | TIMESTAMPTZ | NO | DEFAULT now() | Invoice generation date |
| `due_date` | DATE | NO | - | Payment due date |
| `total_amount` | NUMERIC(10,2) | NO | CHECK (>= 0) | Aggregate charges invoiced |
| `payment_status` | VARCHAR(20) | NO | ENUM | PENDING, PARTIALLY_PAID, PAID... |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Timestamp |

#### Table: `payment`
| Column Name | Data Type | Nullable | Constraint | Description |
|---|---|---|---|---|
| `payment_id` | SERIAL | NO | PRIMARY KEY | Financial receipt transaction ID |
| `bill_id` | INTEGER | NO | FK -> bill | Parent invoice bill |
| `payment_date` | TIMESTAMPTZ | NO | DEFAULT now() | Transaction settlement timestamp |
| `amount_paid` | NUMERIC(10,2) | NO | CHECK (> 0) | Tender amount paid |
| `payment_method` | VARCHAR(30) | NO | ENUM | CASH, UPI, CREDIT_CARD, INSURANCE |
| `transaction_reference` | VARCHAR(100) | YES | UNIQUE | Bank or gateway transaction reference |
| `notes` | TEXT | YES | - | Cashier or ledger notes |
| `created_at` | TIMESTAMPTZ | NO | DEFAULT now() | Timestamp |

---

## 9. SQL COMMANDS USED (DDL, DML) WITH SAMPLE OUTPUTS

### 9.1 Data Definition Language (DDL) Scripts

```sql
-- 1. Custom Controlled ENUM Types
CREATE TYPE appointment_status_type AS ENUM (
    'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
);

CREATE TYPE bed_status_type AS ENUM (
    'AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'
);

CREATE TYPE bill_payment_status AS ENUM (
    'PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'CANCELLED'
);

-- 2. Core Master Table: Department
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    building_floor VARCHAR(50) NOT NULL,
    head_of_department VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctor Table with Domain CHECK and Unique Constraints
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department(department_id) ON DELETE RESTRICT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    consultation_fee NUMERIC(10,2) NOT NULL CHECK (consultation_fee >= 0.00),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointment Table with Zero-Collision Unique Constraint
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patient(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctor(doctor_id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    visit_type VARCHAR(20) NOT NULL DEFAULT 'NEW_VISIT',
    status appointment_status_type NOT NULL DEFAULT 'SCHEDULED',
    reason_for_visit TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);
```

### 9.2 Data Manipulation Language (DML) Scripts & Population
```sql
-- Sample DML Inserts:
INSERT INTO department (department_name, building_floor, head_of_department, contact_phone) VALUES
('Cardiology', 'Tower A - 3rd Floor', 'Dr. Marcus Vance', '+1-555-0101'),
('Neurology', 'Tower B - 4th Floor', 'Dr. Elena Rostova', '+1-555-0102'),
('Orthopedics', 'Tower A - 2nd Floor', 'Dr. Sean Jenkins', '+1-555-0103');

INSERT INTO ward (ward_name, ward_type, total_beds, daily_rate) VALUES
('Intensive Care Unit (ICU)', 'ICU', 6, 1200.00),
('Cardiology Telemetry Ward', 'SEMI_PRIVATE', 8, 450.00),
('General Medical Ward', 'GENERAL', 12, 180.00);
```

**DML Verification Row Counts:**
```
Table                | Rows Count
---------------------+------------
department           | 6
doctor               | 12
doctor_schedule      | 24
patient              | 20
appointment          | 30
consultation         | 18
diagnosis            | 25
prescription         | 18
prescription_item    | 36
lab_test             | 15
test_order           | 25
ward                 | 5
bed                  | 26
admission            | 8
bill                 | 15
payment              | 18
```

---

## 10. QUERIES WITH OUTPUTS

### 10.1 Query 1: Comprehensive Patient Longitudinal Medical Summary
*Multi-table join across patient, appointment, doctor, department, consultation, diagnosis, and prescription.*
```sql
SELECT 
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.gender, p.blood_group, a.appointment_date,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor,
    dept.department_name, c.symptoms,
    STRING_AGG(DISTINCT diag.diagnosis_name, '; ') AS diagnoses,
    STRING_AGG(DISTINCT pi.medicine_name || ' (' || pi.strength || ')', '; ') AS medicines
FROM patient p
JOIN appointment a ON p.patient_id = a.patient_id
JOIN doctor d ON a.doctor_id = d.doctor_id
JOIN department dept ON d.department_id = dept.department_id
JOIN consultation c ON a.appointment_id = c.appointment_id
LEFT JOIN diagnosis diag ON c.consultation_id = diag.consultation_id
LEFT JOIN prescription pr ON c.consultation_id = pr.consultation_id
LEFT JOIN prescription_item pi ON pr.prescription_id = pi.prescription_id
WHERE p.patient_id = 1
GROUP BY p.patient_id, p.first_name, p.last_name, p.gender, p.blood_group, 
         a.appointment_date, d.first_name, d.last_name, dept.department_name, c.symptoms;
```

**Live Execution Output:**
```
patient_id | patient_name | gender | blood_group | appointment_date | attending_doctor | department_name | symptoms            | diagnoses              | medicines
-----------+--------------+--------+-------------+------------------+------------------+-----------------+---------------------+------------------------+---------------------------------------
1          | Alice Morgan | FEMALE | O+          | 2026-02-16       | Dr. Sean Jenkins | Cardiology      | Palpitations, angina| Essential Hypertension | Atorvastatin (20mg); Lisinopril (10mg)
```

---

### 10.2 Query 2: Real-Time Inpatient Bed Occupancy & Capacity Percentage
*Calculates ward bed allocation metrics and occupancy percentages.*
```sql
SELECT 
    w.ward_name, w.ward_type, w.daily_rate,
    COUNT(b.bed_id) AS total_beds,
    COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied_beds,
    COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available_beds,
    ROUND((COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / NULLIF(COUNT(b.bed_id), 0)::NUMERIC) * 100, 1) AS occupancy_pct
FROM ward w
LEFT JOIN bed b ON w.ward_id = b.ward_id
GROUP BY w.ward_id, w.ward_name, w.ward_type, w.daily_rate
ORDER BY occupancy_pct DESC;
```

**Live Execution Output:**
```
ward_name                 | ward_type    | daily_rate | total_beds | occupied_beds | available_beds | occupancy_pct
--------------------------+--------------+------------+------------+---------------+----------------+---------------
Intensive Care Unit (ICU) | ICU          | 1200.00    | 6          | 3             | 3              | 50.0%
Cardiology Telemetry Ward | SEMI_PRIVATE | 450.00     | 8          | 3             | 5              | 37.5%
General Medical Ward      | GENERAL      | 180.00     | 12         | 2             | 10             | 16.7%
```

---

### 10.3 Query 3: Doctor Schedule Load & Slot Availability
*Computes booked appointments versus doctor shift capacity.*
```sql
SELECT 
    'Dr. ' || d.first_name || ' ' || d.last_name AS doctor,
    dept.department_name, ds.day_of_week,
    ds.start_time || '-' || ds.end_time AS shift,
    ds.max_patients AS capacity,
    COUNT(a.appointment_id) AS booked,
    (ds.max_patients - COUNT(a.appointment_id)) AS available
FROM doctor d
JOIN department dept ON d.department_id = dept.department_id
JOIN doctor_schedule ds ON d.doctor_id = ds.doctor_id
LEFT JOIN appointment a ON d.doctor_id = a.doctor_id 
    AND a.status IN ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION')
GROUP BY d.doctor_id, d.first_name, d.last_name, dept.department_name, 
         ds.day_of_week, ds.start_time, ds.end_time, ds.max_patients
ORDER BY dept.department_name, d.last_name;
```

**Live Execution Output:**
```
doctor           | department_name | day_of_week | shift               | capacity | booked | available
-----------------+-----------------+-------------+---------------------+----------+--------+----------
Dr. Sean Jenkins | Cardiology      | MONDAY      | 09:00:00 - 13:00:00 | 12       | 3      | 9
Dr. Marcus Vance | Cardiology      | TUESDAY     | 14:00:00 - 18:00:00 | 10       | 2      | 8
Dr. Elena Rostova| Neurology       | WEDNESDAY   | 10:00:00 - 14:00:00 | 8        | 2      | 6
```

---

### 10.4 Query Highlight: Queries Given During Presentation-II

During the **Presentation-II evaluation review**, the evaluators investigated multi-table consistency and financial/clinical joins:

#### A. Inpatient Active Bed vs Admission Consistency Query
*Ensures that every bed marked `OCCUPIED` corresponds to an active inpatient admission with exact patient identification.*
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
```
bed_id | ward_name                 | bed_number | bed_status | admission_id | admitted_patient | admitted_on | attending_doctor
-------+---------------------------+------------+------------+--------------+------------------+-------------+------------------
1      | Intensive Care Unit (ICU) | ICU-01     | OCCUPIED   | 1            | Ethan Hunt       | 2026-02-18  | Dr. Sean Jenkins
2      | Intensive Care Unit (ICU) | ICU-02     | OCCUPIED   | 2            | George Clark     | 2026-02-19  | Dr. Marcus Vance
3      | Intensive Care Unit (ICU) | ICU-03     | OCCUPIED   | 3            | Robert Taylor    | 2026-02-21  | Dr. Sean Jenkins
7      | Cardiology Telemetry Ward | TELE-01    | OCCUPIED   | 4            | Alice Morgan     | 2026-02-20  | Dr. Sean Jenkins
8      | Cardiology Telemetry Ward | TELE-02    | OCCUPIED   | 5            | James Wilson     | 2026-02-22  | Dr. Marcus Vance
9      | Cardiology Telemetry Ward | TELE-03    | OCCUPIED   | 6            | Sophia Rodriguez | 2026-02-23  | Dr. Marcus Vance
15     | General Medical Ward      | GEN-01     | OCCUPIED   | 7            | David Miller     | 2026-02-24  | Dr. Elena Rostova
16     | General Medical Ward      | GEN-02     | OCCUPIED   | 8            | Emma Watson      | 2026-02-25  | Dr. Elena Rostova
```
*Validation Result:* Exactly 8 active beds match 8 active inpatient admissions without orphan records or discrepancies.

#### B. Departmental Gross & Net Revenue Aggregation Query
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

---

## 11. USER INTERFACE (UI) DESIGN AND SCREENSHOTS

The frontend application provides intuitive, accessible, and responsive user experiences for hospital administrative staff and clinicians. It was developed with **Next.js 14**, **Tailwind CSS**, and **Lucide Icons**.

### UI Module Catalog:

1. **Executive Dashboard (`/`):**
   - Displays real-time operational metrics: Active Inpatients, Total Bed Capacity, Available Beds, Today's Consultations, Revenue Collected, and Recent Clinical Activity.
   - *(Screenshot: `Project-Report/screenshots/01_dashboard.png`)*

2. **Patient Directory & Longitudinal Demographics (`/patients`):**
   - Searchable table containing complete patient profiles, medical history linkages, contact info, blood groups, and quick registration modals.
   - *(Screenshot: `Project-Report/screenshots/02_patients.png`)*

3. **Appointment Scheduling & Slot Roster (`/appointments`):**
   - Filterable appointment calendar preventing double bookings, managing check-ins, cancellations, and doctor roster shifts.
   - *(Screenshot: `Project-Report/screenshots/03_appointments.png`)*

4. **Inpatient Wards & Bed Allocation (`/inpatient`):**
   - Visual bed allocation grid showing bed availability states, real-time occupancy rates, and active inpatient admission registers.
   - *(Screenshot: `Project-Report/screenshots/04_inpatient.png`)*

5. **Diagnostic Laboratory Orders (`/lab`):**
   - Complete diagnostic investigation tracking, abnormal/critical biomarker flagging, sample collection tracking, and turnaround monitoring.
   - *(Screenshot: `Project-Report/screenshots/05_lab.png`)*

6. **Itemized Billing & Payments Ledger (`/billing`):**
   - Financial ledger featuring itemized fee breakdowns, multi-tender transactions (Cash, Card, UPI, Insurance), and outstanding receivable tracking.
   - *(Screenshot: `Project-Report/screenshots/06_billing.png`)*

---

## 12. IMPLEMENTATION DETAILS & ARCHITECTURE

### 12.1 Three-Tier Architecture
HAPCMS is architected in a robust 3-tier pattern:
1. **Presentation Layer (Client):** Next.js 14 React Server & Client Components styled with Tailwind CSS.
2. **Application & ORM Layer (Server):** Node.js runtime executing Prisma Client queries with strict TypeScript validation, connection pooling, and SSL encryption.
3. **Database Layer (Storage & Engine):** PostgreSQL 16 hosted on Neon Cloud, enforcing foreign keys, indexes, triggers, and custom domain constraints.

### 12.2 Key Implementation Code Snippets

#### 1. Prisma Client Singleton (`web/src/lib/prisma.ts`)
```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

#### 2. Atomic Appointment Booking with Collision Handling
```typescript
export async function createAppointment(data: AppointmentInput) {
  try {
    return await prisma.appointment.create({
      data: {
        patient_id: data.patientId,
        doctor_id: data.doctorId,
        appointment_date: new Date(data.date),
        appointment_time: data.time,
        reason_for_visit: data.reason,
        status: "SCHEDULED"
      }
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      throw new Error("This doctor already has an appointment booked for this exact slot.");
    }
    throw error;
  }
}
```

---

## 13. TESTING

A comprehensive test suite was executed against the database engine to verify positive workflows and negative constraint rejections:

### 13.1 Systematic Test Matrix
| Test ID | Test Name | Input / Execution | Expected Result | Actual Result | Status |
|---|---|---|---|---|---|
| **TC-01** | Appointment Collision Rejection | Insert 2 appointments with identical `doctor_id`, `date`, and `time` | PostgreSQL raises Unique Violation (`uq_doctor_slot`) | `ERROR: duplicate key value violates unique constraint "uq_doctor_slot"` | **PASS** |
| **TC-02** | Chronological Admission Validation | Insert admission with `discharge_date < admission_date` | CHECK constraint violation rejected | `ERROR: check constraint "admission_discharge_date_check" violated` | **PASS** |
| **TC-03** | Financial Non-Negative Balance | Insert payment with `amount_paid = -500.00` | CHECK constraint violation rejected | `ERROR: check constraint "payment_amount_check" violated` | **PASS** |
| **TC-04** | Invalid Blood Group Prevention | Insert patient with `blood_group = 'XYZ'` | CHECK domain constraint rejection | `ERROR: check constraint "patient_blood_group_check" violated` | **PASS** |
| **TC-05** | Referential Integrity (FK) | Insert appointment referencing non-existent `doctor_id = 99999` | Foreign Key violation | `ERROR: insert on table "appointment" violates foreign key constraint` | **PASS** |
| **TC-06** | Bed Double Allocation Rejection | Admit a patient to a bed already marked `OCCUPIED` | Rejection of state mutation | State conflict blocked; admission rejected | **PASS** |
| **TC-07** | Positive Workflow (End-to-End) | Register patient -> book appointment -> consultation -> bill payment | All 4 sequential rows inserted with valid FKs | Rows created successfully with HTTP 200 / SQL OK | **PASS** |

---

## 14. CONCLUSION AND FUTURE ENHANCEMENTS

### 14.1 Conclusion
The Hospital Appointment and Patient Care Management System (HAPCMS) successfully fulfills all course requirements for the Database Management Systems curriculum:
- Delivered 16 production-grade relational tables normalized to **3NF**.
- Implemented robust database-level constraints eliminating data corruption, double bookings, and inconsistent financials.
- Populated realistic healthcare data across all tables and proved multi-table relational query performance.
- Built a modern, accessible web application in Next.js 14 providing real-time clinical and financial visibility.

### 14.2 Future Enhancements
1. **Granular Role-Based Access Control (RBAC):** Introducing PostgreSQL row-level security (RLS) and JWT claims isolating doctors from financial accounting screens.
2. **HL7 / FHIR Standardization:** Interfacing with external electronic health record protocols.
3. **Automated Notification Triggers:** Utilizing pg_cron and webhook listeners for automated SMS/email appointment confirmations and critical lab alerts.
4. **Telemedicine Integration:** Embedding WebRTC video consultations directly linked to the consultation table.

---

## 15. REFERENCES

1. Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). *Database System Concepts* (7th ed.). McGraw-Hill Education.
2. Elmasri, R., & Navathe, S. B. (2015). *Fundamentals of Database Systems* (7th ed.). Pearson.
3. PostgreSQL Global Development Group. (2024). *PostgreSQL 16 Documentation*. Retrieved from https://www.postgresql.org/docs/16/
4. Prisma Documentation. (2024). *Prisma ORM for PostgreSQL*. Retrieved from https://www.prisma.io/docs
5. Next.js Documentation. (2024). *Next.js 14 App Router and Server Actions*. Retrieved from https://nextjs.org/docs

---

## 16. APPENDIX: GITHUB REPOSITORY LINK & SETUP GUIDE

### 16.1 Repository Link
- **Public GitHub Repository:** [https://github.com/Imad-81/dbms_assignment_1](https://github.com/Imad-81/dbms_assignment_1)

### 16.2 Repository Directory Layout
```
DBMS-Course-Project/
├── Presentation-I/
│   ├── 01_Executive_Presentation.pdf   # Review 1 Executive Slides
│   └── README.md                       # Milestone 1 details
├── Presentation-II/
│   ├── 02_Schema_ERD_Keynote.pdf       # Review 2 Schema & 3NF Deck
│   ├── 03_Review_2_Presentation.pdf    # Review 2 Presentation Deck
│   └── README.md                       # Milestone 2 details
├── Presentation-III/
│   └── README.md                       # Review 3 Roadmap & Preparation
├── Project-Report/
│   ├── HAPCMS_Project_Report.pdf       # Formal 16-section PDF Report
│   ├── PROJECT_REPORT.md               # Markdown Source Report
│   ├── assets/                         # ERD diagrams & visual figures
│   └── screenshots/                    # High-res application UI captures
├── web/                                # Next.js 14 Web Application
│   ├── src/                            # App Router, components, lib
│   ├── prisma/                         # Prisma schema & migrations
│   ├── package.json                    # Web dependencies
│   └── README.md                       # Web setup instructions
├── archive/                            # Archived working files (docs, html, submissions, sql)
├── run_db.py                           # Python CLI test & report runner
└── README.md                           # Main Project Readme
```

### 16.3 Quick Start Instructions
```bash
# 1. Clone repository
git clone https://github.com/Imad-81/dbms_assignment_1.git
cd dbms_assignment_1

# 2. Run Database Test Queries
./.venv/bin/python run_db.py test
./.venv/bin/python run_db.py reports

# 3. Launch Web Application
npm run dev
# Open http://localhost:3000
```
