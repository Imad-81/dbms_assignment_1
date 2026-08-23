# Hospital Appointment and Patient Care Management System (HAPCMS)
> **Relational Database Management System (DBMS) Project**  
> **Milestone:** Review 1 (Week 7 — 5 Marks)  
> **Database Engine:** PostgreSQL (v14+)  

---

## 📌 Deliverables Overview for Review 1

| Component | Description | File Location |
| :--- | :--- | :--- |
| **Comprehensive Master Report** | Problem identification, scope, objectives, user stakeholder roles, functional & non-functional requirements, 3NF normalization proofs, relational data dictionary. | [`docs/REVIEW_1_REPORT.md`](docs/REVIEW_1_REPORT.md) |
| **Conceptual Design & ERD** | Conceptual model of 16 entities, Crow's Foot ER diagram, entity attribute dictionary, relationship cardinalities, and dependency tree. | [`docs/ERD_DIAGRAM.md`](docs/ERD_DIAGRAM.md) |
| **Interactive Visual Schema Viewer** | Standalone browser-viewable interactive ERD diagram and 3NF schema explorer with dark-mode cards and business rules matrix. | [`docs/erd_viewer.html`](docs/erd_viewer.html) |
| **Viva & Defense Guide** | 2-minute elevator pitch, 5-mark rubric checklist, top 10 anticipated viva questions with high-scoring model answers, and Review 2 roadmap. | [`docs/REVIEW_1_VIVA_GUIDE.md`](docs/REVIEW_1_VIVA_GUIDE.md) |
| **PostgreSQL DDL Schema** | Production-ready DDL script creating custom ENUM types, 16 3NF-normalized tables, primary keys, foreign keys, domain `CHECK` constraints, and performance indexes. | [`sql/01_create_tables.sql`](sql/01_create_tables.sql) |
| **Realistic Sample Seed Data** | Multi-specialty hospital seed data populating all 16 tables (Departments, Doctors, Schedules, Patients, Appointments, Consultations, Diagnoses, Prescriptions, Lab Tests, Wards, Beds, Admissions, Bills, Payments). | [`sql/02_sample_data.sql`](sql/02_sample_data.sql) |
| **Analytical & Verification Queries** | Multi-table join queries for patient history, doctor load, real-time bed occupancy, pending lab tests, and billing reconciliation. | [`sql/03_test_queries.sql`](sql/03_test_queries.sql) |

---

## 🏗️ Relational Architecture (3NF Entities)

The database models **16 normalized entities** organized into 6 operational clusters:

```text
1. Provider & Roster Cluster
   ├── department (Clinical medical divisions)
   ├── doctor (Medical specialists & physicians)
   └── doctor_schedule (Recurring duty shifts & booking quotas)

2. Patient & Appointment Cluster
   ├── patient (Demographics, blood group, emergency contact)
   └── appointment (Outpatient scheduled visits with collision prevention)

3. Clinical Consultation & Care Cluster
   ├── consultation (Vitals, examination notes, 1:1 with appointment)
   ├── diagnosis (ICD-10 clinical diagnoses per consultation)
   ├── prescription (Electronic prescription header)
   └── prescription_item (Itemized drugs, strength, dosage, duration)

4. Diagnostics & Pathology Cluster
   ├── lab_test (Master catalog of tests, prices, normal reference ranges)
   └── test_order (Ordered diagnostic investigations & observed results)

5. Inpatient Ward & Bed Management Cluster
   ├── ward (Wards categorized by ICU, Semi-Private, General, Emergency)
   ├── bed (Physical beds with real-time occupancy status)
   └── admission (Inpatient stay tracking, bed allocation, discharge summaries)

6. Financial & Accounts Cluster
   ├── bill (Consolidated invoices for OP consultations & IP admissions)
   └── payment (Multi-tender transaction receipts: Cash, Card, UPI, Insurance)
```

---

## 🚀 How to Execute in PostgreSQL

### Prerequisites
- PostgreSQL 14 or higher installed locally or accessible via a hosted instance (e.g. Supabase, Neon, AWS RDS).
- `psql` command-line tool or GUI client (pgAdmin 4, DBeaver, TablePlus, DataGrip).

### Step 1: Create Database
```bash
createdb hospital_db
```

### Step 2: Run DDL Table Creation Script
```bash
psql -d hospital_db -f sql/01_create_tables.sql
```

### Step 3: Populate Realistic Sample Data
```bash
psql -d hospital_db -f sql/02_sample_data.sql
```

### Step 4: Run Verification & Report Queries
```bash
psql -d hospital_db -f sql/03_test_queries.sql
```

---

## 🖥️ Viewing the Interactive ER Diagram
Open `docs/erd_viewer.html` directly in any web browser:
- On macOS: `open docs/erd_viewer.html`
- On Windows: `start docs/erd_viewer.html`
- On Linux: `xdg-open docs/erd_viewer.html`

---

## 📋 Core Business Rules Implemented
- **BR-1 (No Appointment Overlaps):** Enforced via `UNIQUE (doctor_id, appointment_date, appointment_time)`.
- **BR-2 (Exclusive Bed Occupancy):** `bed.status` transitions between `AVAILABLE` and `OCCUPIED`.
- **BR-3 (Chronological Stay Bounds):** `CHECK (discharge_date IS NULL OR discharge_date >= admission_date)`.
- **BR-4 (Positive Financial Balances):** `CHECK (amount_paid > 0.00)` and `CHECK (total_amount >= 0.00)`.
- **BR-5 (Physiological Bounds):** `CHECK (dob <= CURRENT_DATE)`, `CHECK (temperature BETWEEN 30 AND 45)`.
- **BR-6 (1:1 Consultation Integrity):** `consultation.appointment_id INT NOT NULL UNIQUE`.

---

## 🎯 Review 2 & 3 Roadmap
- **Review 2 (Week 10 — 10 Marks):** Complex SQL queries, aggregations, nested queries, relational views (Bed Occupancy, Doctor Schedules, Pending Bills), and PL/pgSQL triggers.
- **Review 3 (Week 12 — 15 Marks):** Front-end application (Python/Java), UI workflows, and final project defense.
# dbms_assignment_1
