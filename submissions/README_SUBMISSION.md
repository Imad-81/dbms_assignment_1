# HAPCMS — Submission Package

**Hospital Appointment & Patient Care Management System**
**Course:** Database Management Systems (DBMS)
**Student:** Imad
**Database Engine:** PostgreSQL 16 (Neon Cloud)
**GitHub:** [Imad-81/dbms_assignment_1](https://github.com/Imad-81/dbms_assignment_1)

---

## 📁 What's in This Folder

```
submissions/
├── HAPCMS_Combined_Presentations.pdf     ← All presentations merged into one PDF
│
├── presentations/
│   ├── 00_Problem_Approach_Presentation.pdf   ← Problem & approach overview
│   ├── 00_Problem_Approach_Presentation.key   ← Original Keynote file
│   ├── 01_Executive_Presentation.pdf          ← Full Review 1 executive presentation
│   ├── 02_Schema_ERD_Keynote.pdf              ← Schema, ERD & 3NF keynote
│   └── 03_Review_2_Presentation.pdf           ← Review 2 presentation
│
├── outputs/
│   ├── query_outputs.txt     ← Live SQL query results from the database
│   └── prisma_erd.png        ← Auto-generated Entity-Relationship Diagram
│
└── code/
    ├── 01_create_tables.sql  ← DDL: creates all 16 tables, ENUMs, constraints
    ├── 02_sample_data.sql    ← Seed data for all 16 tables
    ├── 03_test_queries.sql   ← Analytical & constraint test queries
    ├── schema.prisma         ← Prisma ORM schema (mirrors PostgreSQL)
    ├── run_db.py             ← Main CLI runner (queries, reports, tests)
    ├── prisma_demo.js        ← Prisma ORM client demo
    └── generate_keynote.py   ← Presentation generation script
```

---

## 🗄️ Database Design

**16 normalized tables in 3NF**, organized into 6 clusters:

| Cluster | Tables |
|---|---|
| Provider & Roster | `department`, `doctor`, `doctor_schedule` |
| Patient & Appointment | `patient`, `appointment` |
| Clinical Care & EMR | `consultation`, `diagnosis`, `prescription`, `prescription_item` |
| Diagnostics | `lab_test`, `test_order` |
| Inpatient Management | `ward`, `bed`, `admission` |
| Financial | `bill`, `payment` |

---

## ▶️ How to Run

### Prerequisites
```bash
# Clone the repo
git clone https://github.com/Imad-81/dbms_assignment_1.git
cd dbms_assignment_1

# Install Node dependencies
npm install

# Install Python dependencies
python -m venv .venv && source .venv/bin/activate
pip install psycopg[binary] python-dotenv tabulate

# Add your database credentials
cp .env.example .env   # then fill in DATABASE_URL
```

### Run Commands
```bash
# Visual table explorer (opens http://localhost:5555)
npm run studio

# Run all analytical reports
python run_db.py reports

# Run constraint integrity tests
python run_db.py test

# Run Prisma ORM demo queries
npm run prisma:demo

# Open interactive SQL shell
python run_db.py shell
```

---

## 🔑 Key Business Rules Enforced

| Rule | Constraint |
|---|---|
| No appointment overlaps | `UNIQUE (doctor_id, appointment_date, appointment_time)` |
| Exclusive bed occupancy | `bed.status` ∈ `{AVAILABLE, OCCUPIED}` |
| Chronological stay | `CHECK (discharge_date >= admission_date)` |
| Positive payments | `CHECK (amount_paid > 0.00)` |
| Valid vitals | `CHECK (temperature BETWEEN 30 AND 45)` |
| 1-to-1 consultation | `consultation.appointment_id UNIQUE NOT NULL` |
