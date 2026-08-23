# Hospital Appointment and Patient Care Management System (HAPCMS)
> **Relational Database Management System (DBMS) Project**  
> **Milestone:** Review 1 (Week 7 — 5 Marks)  
> **Database Engine:** PostgreSQL 16 (Connected to Neon Cloud)  

---

## 🌟 Quick Start for Review Presentation

| Goal | Action |
| :--- | :--- |
| 🎓 **Complete Presentation & Viva Guide** | Read **[`docs/PROFESSOR_PRESENTATION_GUIDE.md`](docs/PROFESSOR_PRESENTATION_GUIDE.md)** for full fundamentals (PK, FK, 3NF), live query demos, and top 15 viva Q&As. |
| 📊 **View Interactive ER Diagram** | Open **[`docs/erd_viewer.html`](docs/erd_viewer.html)** in any browser (`open docs/erd_viewer.html`). |
| 💻 **Run Live Interactive SQL Prompt** | Run `./run_db.sh shell` in your terminal to type and test any SQL queries on your live database. |
| 📋 **Run All Analytical Reports** | Run `./run_db.sh reports` to execute the 5 clinical & financial reports. |
| 🛡️ **Run Constraint Integrity Tests** | Run `./run_db.sh test` to prove database double-booking and negative-balance rejection. |

---

## 📌 Deliverables Overview for Review 1

| Component | Description | File Location |
| :--- | :--- | :--- |
| **Professor Presentation & Viva Guide** | Complete guide from basics (PK, FK, Candidate Keys, Constraints, 3NF proofs) to live demo queries, 5-minute presentation script, and top 15 viva Q&As. | [`docs/PROFESSOR_PRESENTATION_GUIDE.md`](docs/PROFESSOR_PRESENTATION_GUIDE.md) |
| **Comprehensive Master Report** | Problem identification, SMART objectives, 7 user roles & CRUD matrix, functional requirements (FR-1 to FR-7), 3NF normalization analysis, and relational data dictionary. | [`docs/REVIEW_1_REPORT.md`](docs/REVIEW_1_REPORT.md) |
| **Conceptual Design & ERD** | Conceptual model of 16 entities, Crow's Foot ER diagram, entity attribute dictionary, relationship cardinalities, and dependency tree. | [`docs/ERD_DIAGRAM.md`](docs/ERD_DIAGRAM.md) |
| **Interactive Visual Schema Viewer** | Browser-viewable interactive ERD with dynamic pan/zoom, subsystem filters, 3NF table cards, and business rules matrix. | [`docs/erd_viewer.html`](docs/erd_viewer.html) |
| **PostgreSQL DDL Schema** | Production-ready DDL script creating custom ENUM types, 16 3NF tables, primary keys, foreign keys, domain `CHECK` constraints, and performance indexes. | [`sql/01_create_tables.sql`](sql/01_create_tables.sql) |
| **Realistic Sample Seed Data** | Multi-specialty hospital seed data populating all 16 tables (Departments, Doctors, Schedules, Patients, Appointments, Consultations, Diagnoses, Prescriptions, Lab Tests, Wards, Beds, Admissions, Bills, Payments). | [`sql/02_sample_data.sql`](sql/02_sample_data.sql) |
| **Analytical & Verification Queries** | Multi-table join queries for patient history, doctor load, real-time bed occupancy %, pending lab tests, and billing reconciliation. | [`sql/03_test_queries.sql`](sql/03_test_queries.sql) |

---

## 🏗️ Relational Architecture (16 Normalized Entities in 3NF)

The database models **16 normalized entities** organized into 6 operational clusters:

```text
1. Provider & Roster Cluster
   ├── department (Clinical medical divisions)
   ├── doctor (Medical specialists & physicians)
   └── doctor_schedule (Recurring duty shifts & booking quotas)

2. Patient & Appointment Cluster
   ├── patient (Demographics, blood group, emergency contact)
   └── appointment (Outpatient scheduled visits with collision prevention)

3. Clinical Care & EMR Cluster
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

## ⚡ How to Run Queries Live

### Method 1: Using the Terminal CLI Runner (Easiest)
```bash
# 1. Reset and re-seed database
./run_db.sh setup

# 2. View all tables and row counts
./run_db.sh tables

# 3. Run presentation reports
./run_db.sh reports

# 4. Run constraint validation test
./run_db.sh test

# 5. Open live SQL prompt
./run_db.sh shell
```

### Method 2: In Neon Cloud Web Console
1. Log into [console.neon.tech](https://console.neon.tech).
2. Go to your active project $\to$ Click **"SQL Editor"** on the left menu.
3. Paste any SQL query from [`docs/PROFESSOR_PRESENTATION_GUIDE.md`](docs/PROFESSOR_PRESENTATION_GUIDE.md#7-live-sql-queries-to-demo-in-front-of-the-professor).
4. Click **Run** to view live results.

---

## 📋 Core Business Rules Implemented
- **BR-1 (No Appointment Overlaps):** Enforced via `UNIQUE (doctor_id, appointment_date, appointment_time)`.
- **BR-2 (Exclusive Bed Occupancy):** `bed.status` transitions between `AVAILABLE` and `OCCUPIED`.
- **BR-3 (Chronological Stay Bounds):** `CHECK (discharge_date IS NULL OR discharge_date >= admission_date)`.
- **BR-4 (Positive Financial Balances):** `CHECK (amount_paid > 0.00)` and `CHECK (total_amount >= 0.00)`.
- **BR-5 (Physiological Bounds):** `CHECK (date_of_birth <= CURRENT_DATE)`, `CHECK (temperature BETWEEN 30 AND 45)`.
- **BR-6 (1:1 Consultation Integrity):** `consultation.appointment_id INT NOT NULL UNIQUE`.
