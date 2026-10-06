# Hospital Appointment and Patient Care Management System (HAPCMS)

**Student Name:** Shaik Imaduddin  
**Roll Number:** 25WU0101048  
**Project Title:** Hospital Appointment and Patient Care Management System (HAPCMS)  
**One-Line Description:** A 3NF-normalized relational database management system and full-stack clinical platform built with PostgreSQL 16, Prisma ORM, and Next.js 14 to eliminate appointment collisions, prevent inpatient bed bottlenecks, coordinate diagnostic lab orders, and ensure financial ledger integrity.  
**Course:** Database Management Systems (DBMS)  
**Faculty / Instructor:** Dr. Kiran Mayee Adavala  
**Academic Year:** 2025–2026  
**Database Engine:** PostgreSQL 16 (Neon Cloud Serverless)  
**GitHub Repository:** [https://github.com/Imad-81/dbms_assignment_1](https://github.com/Imad-81/dbms_assignment_1)  

---

## 📁 Repository Structure (Submission Organization)

Organized according to the DBMS Course Project submission requirements:

```
DBMS-Course-Project/
│
├── 📂 Presentation-I/                     ← 📌 Review 1 Deliverables
│   ├── 01_Executive_Presentation.pdf      ← Full Review 1 executive presentation (14 slides)
│   └── README.md                          ← Review 1 conceptual design & scope overview
│
├── 📂 Presentation-II/                    ← 📌 Review 2 Deliverables
│   ├── 02_Schema_ERD_Keynote.pdf          ← In-depth schema, ERD & 3NF normalization keynote (15 slides)
│   ├── 03_Review_2_Presentation.pdf       ← Review 2 DDL, queries, views & tests (14 slides)
│   └── README.md                          ← Review 2 schema hardening & query review
│
├── 📂 Presentation-III/                   ← 📌 Review 3 Deliverables (Upcoming / Final)
│   └── README.md                          ← Final milestone roadmap, UI integration & viva prep
│
├── 📂 Project-Report/                     ← 📄 Official Project Report (5 Marks)
│   ├── HAPCMS_Project_Report.pdf          ← Complete 22-page formal PDF report (all 16 sections)
│   ├── PROJECT_REPORT.md                  ← Markdown report source with full SQL listings
│   ├── assets/                            ← High-resolution ER diagrams (Crow's Foot notation)
│   ├── screenshots/                       ← High-resolution UI captures of all 6 web modules
│   └── README.md                          ← Report contents checklist & section directory
│
├── 📂 web/                                ← 🌐 Full-Stack Web Application (Next.js 14 + Prisma)
│   ├── src/app/                           ← App Router pages (Dashboard, Patients, Appointments, etc.)
│   ├── src/components/                    ← Reusable UI modal dialogs and data tables
│   ├── prisma/schema.prisma               ← Type-safe Prisma schema matching PostgreSQL
│   ├── package.json                       ← Frontend dependencies & scripts
│   └── README.md                          ← Local setup and module documentation
│
├── 📂 sql/                                ← 🗄️ Core PostgreSQL DDL & DML Scripts
│   ├── 01_create_tables.sql               ← Schema DDL, custom ENUMs, domain CHECKs, indexes
│   ├── 02_sample_data.sql                 ← Realistic clinical seed data across all 16 tables
│   └── 03_test_queries.sql                ← Analytical and multi-table verification queries
│
├── 📂 scripts/                            ← 🛠️ Database CLI & PDF Generation Automation
│   ├── seed_realistic.ts                  ← TypeScript database seeder
│   └── generate_pdf_report.js             ← Puppeteer academic PDF report builder
│
├── run_db.py                              ← 🐍 Interactive Python CLI runner (tests, reports, shell)
├── package.json                           ← Root delegation scripts for npm commands
└── README.md                              ← Main project documentation (this file)
```

---

## 🗄️ Relational Database Architecture (16 Tables in 3NF)

The database schema is partitioned into **6 cohesive functional clusters** normalized to **Third Normal Form (3NF)**:

| Cluster | Tables | Key Constraints & Business Integrity Rules |
|---|---|---|
| **1. Provider & Roster** | `department`, `doctor`, `doctor_schedule` | Shift start/end chronological validation, maximum patient capacity per slot, unique license numbers. |
| **2. Patient & Appointment** | `patient`, `appointment` | Unique slot booking `UNIQUE(doctor_id, appointment_date, appointment_time)` preventing double-bookings. |
| **3. Clinical Care & EMR** | `consultation`, `diagnosis`, `prescription`, `prescription_item` | 1:1 encounter binding, ICD-10 standardized diagnostic classifications, multi-drug atomic line items. |
| **4. Diagnostics** | `lab_test`, `test_order` | Diagnostic catalog tariffs, specimen tracking, automated `NORMAL / ABNORMAL / CRITICAL` flagging. |
| **5. Inpatient Care** | `ward`, `bed`, `admission` | Exclusive bed occupancy (`AVAILABLE`, `OCCUPIED`), chronological stay check `CHECK (discharge_date >= admission_date)`. |
| **6. Financial Ledger** | `bill`, `payment` | Non-negative invoice balances `CHECK (total_amount >= 0)`, positive payments `CHECK (amount_paid > 0)`, multi-tender tracking. |

---

## 🖥️ Full-Stack Clinical Application Modules (`web/`)

Built on **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Prisma ORM**:

1. **Executive Dashboard (`/`):** Real-time hospital metrics including active inpatients, available beds, today's appointments, revenue, and recent patient activity.
2. **Patient Directory (`/patients`):** Complete patient profiles, medical history linkages, contact info, blood groups, and quick registration.
3. **Appointment Scheduling (`/appointments`):** Interactive booking calendar enforcing conflict-free doctor time slots and status workflows.
4. **Inpatient Ward Management (`/inpatient`):** Visual bed allocation matrix, ward occupancy percentages, and active inpatient records.
5. **Diagnostic Laboratory (`/lab`):** Test catalog, diagnostic requisitions, abnormal biomarker tracking, and turnaround monitoring.
6. **Billing & Ledger (`/billing`):** Itemized fee invoicing, multi-tender transactions (Cash, UPI, Card, Insurance), and outstanding dues audit.

---

## ▶️ Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18.0 or later
- **Python:** v3.10 or later
- **PostgreSQL Database:** PostgreSQL 14+ or Neon Cloud connection string

### 2. Setup & Installation
```bash
# Clone the repository
git clone https://github.com/Imad-81/dbms_assignment_1.git
cd dbms_assignment_1

# Install Node dependencies
npm install

# Setup Python virtual environment
python3 -m venv .venv
source .venv/bin/activate
pip install psycopg[binary] python-dotenv tabulate
```

### 3. Configure Database URL
Create a `.env` file in the project root:
```env
DATABASE_URL="postgresql://username:password@ep-sample.neon.tech/hapcms?sslmode=require"
```

### 4. Run Database Tests & Analytical Reports
```bash
# Run database constraint integrity tests (TC-01 to TC-07)
npm run db:test

# Run analytical reports (Patient summary, bed occupancy, doctor roster, financial audit)
npm run db:reports
```

### 5. Launch the Web Application
```bash
# Start Next.js development server (runs web/ on port 3000)
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 6. Visual Database Explorer (Prisma Studio)
```bash
# Launch Prisma Studio GUI (opens on port 5555)
npm run studio
```

---

## 🧪 Database Constraint Verification (Sample Test Output)

```
=================================================================
🛡️  TESTING DATABASE INTEGRITY CONSTRAINTS (VIVA DEMO)
=================================================================

1. Testing Double-Booking Prevention (UNIQUE doctor_id, date, time):
   SQL: INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time)
   Result: Blocked with UniqueViolation on "uq_doctor_slot"
   Status: ✅ PASSED

2. Testing Admission Chronology (discharge_date >= admission_date):
   SQL: INSERT INTO admission (admission_date, discharge_date, ...)
   Result: Blocked with CheckViolation on "admission_discharge_date_check"
   Status: ✅ PASSED

3. Testing Financial Integrity (amount_paid > 0):
   SQL: INSERT INTO payment (amount_paid = -250.00, ...)
   Result: Blocked with CheckViolation on "payment_amount_check"
   Status: ✅ PASSED
```

---

## 📑 Project Report (16 Rubric Contents)

The complete formal PDF report is located at [`Project-Report/HAPCMS_Project_Report.pdf`](Project-Report/HAPCMS_Project_Report.pdf):
- **Section 1:** Cover Page
- **Section 2:** Abstract
- **Section 3:** Introduction & Problem Statement
- **Section 4:** Objectives & Scope (SMART)
- **Section 5:** Software & Hardware Requirements
- **Section 6:** Entity-Relationship (ER) Diagram
- **Section 7:** Relational Schema & 3NF Normalization Analysis
- **Section 8:** Data Dictionary (16 tables)
- **Section 9:** SQL Commands (DDL, DML) with sample outputs
- **Section 10:** Queries with outputs (including Presentation-II Active Bed query)
- **Section 11:** UI Design & Screenshots (6 full-color annotated figures)
- **Section 12:** Implementation Details & Architecture (3-tier, Prisma ORM)
- **Section 13:** Testing (Test matrix TC-01 through TC-07)
- **Section 14:** Conclusion & Future Enhancements
- **Section 15:** References & Bibliography
- **Section 16:** Appendix (GitHub repository link & directory layout)

---

## 👥 Project Information & Acknowledgements

- **Student:** Shaik Imaduddin (`25WU0101048`)
- **Faculty / Course Instructor:** Dr. Kiran Mayee Adavala
- **Department:** Computer Science & Engineering
- **Academic Year:** 2025–2026
