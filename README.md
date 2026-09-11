# Hospital Appointment and Patient Care Management System (HAPCMS)
> **Relational Database Management System (DBMS) Project**  
> **Milestone:** Review 1 (Week 7 — 5 Marks)  
> **Database Engine:** PostgreSQL 16 (Connected to Neon Cloud)  

---

## 🌟 Quick Start for Review Presentation

| Goal | Action |
| :--- | :--- |
| 📽️ **View Schema & ERD Keynote Deck** | Open **[`schema_keynote.html`](schema_keynote.html)** (`open schema_keynote.html`) for the dedicated Apple Keynote deck on 16 table specifications, 3NF proofs, and Crow's Foot ERD. |
| 🚀 **Launch Prisma Studio (Visual Tables)** | Run `npm run studio` or `./run_db.sh studio` to browse and edit all 16 tables on [`http://localhost:5555`](http://localhost:5555). |
| 📊 **View Interactive ER Diagram & Hub** | Open **[`docs/erd_viewer.html`](docs/erd_viewer.html)** in any browser (`open docs/erd_viewer.html`). |
| 📐 **View Vector Prisma Schema ERD** | Open **[`docs/prisma_erd.svg`](docs/prisma_erd.svg)** for the vector entity-relationship diagram compiled directly from Prisma. |
| 🏥 **Run Prisma ORM Client Demo** | Run `./run_db.sh prisma-demo` or `npm run prisma:demo` to test deep graph traversal queries using `@prisma/client`. |
| 🎓 **Complete Presentation & Viva Guide** | Read **[`docs/PROFESSOR_PRESENTATION_GUIDE.md`](docs/PROFESSOR_PRESENTATION_GUIDE.md)** for full fundamentals (PK, FK, 3NF), live query demos, and top 15 viva Q&As. |
| 💻 **Run Live Interactive SQL Prompt** | Run `./run_db.sh shell` in your terminal to type and test any SQL queries on your live database. |
| 📋 **Run All Analytical Reports** | Run `./run_db.sh reports` to execute the 5 clinical & financial reports. |
| 🛡️ **Run Constraint Integrity Tests** | Run `./run_db.sh test` to prove database double-booking and negative-balance rejection. |

---

## 📌 Deliverables Overview for Review 1

| Component | Description | File Location |
| :--- | :--- | :--- |
| **Relational Schema & ERD Keynote** | Dedicated Apple Keynote-style presentation covering 16 table specifications, Crow's Foot ERD, referential actions, and 3NF proofs. | [`schema_keynote.html`](schema_keynote.html) |
| **Executive Project Presentation** | Complete problem-approach-solution Keynote presentation with speaker scripts and slide overview grid. | [`presentation.html`](presentation.html) |
| **Prisma Studio Web GUI** | Visual data explorer for all 16 relational tables with live filtering, sorting, and relational foreign-key navigation. | [`http://localhost:5555`](http://localhost:5555) (`./run_db.sh studio`) |
| **Prisma ORM Schema** | Type-safe schema introspected directly from Neon PostgreSQL, modeling all 16 tables, 10 custom ENUMs, and relations. | [`prisma/schema.prisma`](prisma/schema.prisma) |
| **Prisma Vector ERD Diagram** | Automated high-resolution SVG diagram generated directly from `schema.prisma`. | [`docs/prisma_erd.svg`](docs/prisma_erd.svg) |
| **Prisma ORM Client Demo** | Node.js verification script executing longitudinal patient traversals and bed aggregations via `@prisma/client`. | [`scripts/prisma_demo.js`](scripts/prisma_demo.js) |
| **Professor Presentation & Viva Guide** | Complete guide from basics (PK, FK, Candidate Keys, Constraints, 3NF proofs) to live demo queries, 5-minute presentation script, and top 15 viva Q&As. | [`docs/PROFESSOR_PRESENTATION_GUIDE.md`](docs/PROFESSOR_PRESENTATION_GUIDE.md) |
| **Comprehensive Master Report** | Problem identification, SMART objectives, 7 user roles & CRUD matrix, functional requirements (FR-1 to FR-7), 3NF normalization analysis, and relational data dictionary. | [`docs/REVIEW_1_REPORT.md`](docs/REVIEW_1_REPORT.md) |
| **Conceptual Design & ERD** | Conceptual model of 16 entities, Crow's Foot ER diagram, entity attribute dictionary, relationship cardinalities, and dependency tree. | [`docs/ERD_DIAGRAM.md`](docs/ERD_DIAGRAM.md) |
| **Interactive Visual Schema Viewer** | Browser-viewable interactive ERD with dynamic pan/zoom, subsystem filters, 3NF table cards, and Prisma Studio integration. | [`docs/erd_viewer.html`](docs/erd_viewer.html) |
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
# 1. Launch Prisma Studio visual table explorer (Opens on http://localhost:5555)
./run_db.sh studio
# or: npm run studio

# 2. Run Prisma ORM client demonstration queries (Longitudinal & Bed Analytics)
./run_db.sh prisma-demo
# or: npm run prisma:demo

# 3. Regenerate schema ER diagram from Prisma schema
./run_db.sh erd
# or: npm run db:generate

# 4. View all database tables and record counts
./run_db.sh tables

# 5. Run raw SQL presentation analytical reports
./run_db.sh reports

# 6. Run constraint integrity validation tests (Viva double-booking test)
./run_db.sh test

# 7. Open live interactive SQL shell prompt
./run_db.sh shell
```

---

## 🌐 Visual Schema Exploration with Prisma Studio

Prisma Studio gives you and the professor a visual GUI for exploring the live database:

1. **Start Studio**:
   ```bash
   ./run_db.sh studio
   ```
2. **Access Web GUI**: Open [http://localhost:5555](http://localhost:5555).
3. **Features**:
   - **All 16 Tables**: Instant tabular browsing of `patient`, `doctor`, `appointment`, `consultation`, `ward`, `bed`, `bill`, etc.
   - **Foreign Key Traversal**: Click directly on foreign key badges to drill down into related records (e.g. from an appointment directly to the doctor or patient).
   - **Multi-Field Filtering & Sorting**: Filter by dates, ENUM statuses (`ADMITTED`, `SCHEDULED`, `PAID`), or search clinical notes.
   - **Vector ERD Diagram**: View [`docs/prisma_erd.svg`](docs/prisma_erd.svg) or explore the interactive ERD in [`docs/erd_viewer.html`](docs/erd_viewer.html).

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
