# Hospital Appointment & Patient Care Management System (HAPCMS)

> **DBMS Assignment** · PostgreSQL 16 · Neon Cloud  
> **GitHub:** [Imad-81/dbms_assignment_1](https://github.com/Imad-81/dbms_assignment_1)

---

## 📦 Submission

All submission-ready files are in the [`submissions/`](submissions/) folder:

| File | Description |
|---|---|
| [`submissions/HAPCMS_Combined_Presentations.pdf`](submissions/HAPCMS_Combined_Presentations.pdf) | **All presentations merged into one PDF** |
| [`submissions/presentations/`](submissions/presentations/) | Individual presentation PDFs + Keynote |
| [`submissions/outputs/`](submissions/outputs/) | Live SQL query results & ERD diagram |
| [`submissions/code/`](submissions/code/) | All SQL scripts & source code |
| [`submissions/README_SUBMISSION.md`](submissions/README_SUBMISSION.md) | Clean guide for the professor |

---

## 🗄️ Database Design — 16 Tables in 3NF

```
1. Provider & Roster     → department, doctor, doctor_schedule
2. Patient & Appointment → patient, appointment
3. Clinical EMR          → consultation, diagnosis, prescription, prescription_item
4. Diagnostics           → lab_test, test_order
5. Inpatient             → ward, bed, admission
6. Financial             → bill, payment
```

---

## ▶️ Quick Start

```bash
# 1. Install dependencies
npm install
pip install psycopg[binary] python-dotenv tabulate

# 2. Configure database
cp .env.example .env   # add your DATABASE_URL

# 3. Visual table explorer (http://localhost:5555)
npm run studio

# 4. Run reports & tests
python run_db.py reports
python run_db.py test
```

---

## 📁 Project Structure

```
dbms_1/
├── submissions/          ← 📦 SUBMISSION PACKAGE (start here)
├── html/                 ← Presentation HTML source files
│   ├── presentation.html
│   ├── schema_keynote.html
│   ├── review_2.html
│   └── erd_viewer.html
├── sql/                  ← PostgreSQL DDL & seed data
│   ├── 01_create_tables.sql
│   ├── 02_sample_data.sql
│   └── 03_test_queries.sql
├── prisma/               ← Prisma ORM schema
│   └── schema.prisma
├── scripts/              ← Utility scripts
│   ├── prisma_demo.js
│   └── generate_keynote.py
├── docs/                 ← Reports, guides & ERD
├── run_db.py             ← Main CLI runner
├── .env.example          ← Environment template
└── README.md
```
