# Presentation-II: Schema Hardening, DDL, SQL Queries & Views (Review 2)

**Course:** Database Management Systems (DBMS)  
**Project:** Hospital Appointment & Patient Care Management System (HAPCMS)  
**Student:** Shaik Imaduddin  
**Roll Number:** 25WU0101048  
**Faculty / Instructor:** Dr. Kiran Mayee Adavala  
**Target RDBMS:** PostgreSQL 16 (Neon Cloud Serverless)  

---

## 📌 Milestone Overview

Presentation-II hardens the relational foundation through executable DDL, comprehensive seed data, complex multi-table queries, operational views, and live constraint validation:

1. **Normalized Database Schema (3NF):** Hardening 16 entities across 6 functional clusters.
2. **PostgreSQL 16 DDL & Constraints:** 10 custom ENUM types, unique slot index (`uq_doctor_slot`), bed exclusivity rules (`uq_ward_bed`), and chronological CHECKs.
3. **Comprehensive Seed Data:** Rich medical dataset with 25 realistic patients, 8 doctor rosters, 20 appointments, clinical consultations, prescriptions, lab orders, 28 inpatient beds, and multi-tender bills.
4. **Analytical SQL Queries:**
   - Multi-table 7-table JOIN: Longitudinal Patient History
   - Multi-table LEFT JOIN: Doctor Weekly Roster & Slot Load
   - Conditional CASE Aggregation: Real-Time Inpatient Bed Occupancy
   - Evaluator Query A: Inpatient Active Bed vs Admission Consistency
   - Evaluator Query B: Departmental Gross & Net Revenue Aggregation
   - Laboratory Worklist: Critical Biomarker Alerts & SLA Tracking
   - Financial Ledger: Billing & Multi-Tender Reconciliation
5. **Operational Database Views:** 6 dedicated views (`vw_patient_history`, `vw_doctor_schedule`, `vw_bed_occupancy`, `vw_pending_tests`, `vw_outstanding_bills`, `vw_revenue_by_dept`).
6. **Constraint Integrity Testing:** 8 systematic positive and negative tests verifying ACID transactional rules.

---

## 📂 Deliverables in this Folder

| File | Type | Description |
|---|---|---|
| [`01_schema_ddl.sql`](01_schema_ddl.sql) | SQL Script | Complete DDL: 10 ENUM types, 16 tables (3NF), constraints, 17 B-Tree indexes, and 6 views |
| [`02_sample_data_dml.sql`](02_sample_data_dml.sql) | SQL Script | Comprehensive seed dataset populating all 16 tables with sequence synchronization |
| [`03_queries_and_outputs.sql`](03_queries_and_outputs.sql) | SQL Script | 10 executable analytical queries with verified PostgreSQL 16 live terminal outputs |
| [`04_constraint_validation_tests.sql`](04_constraint_validation_tests.sql) | SQL Script | 8 negative and positive constraint validation tests with expected engine error messages |
| [`QUERIES_AND_COMMANDS.md`](QUERIES_AND_COMMANDS.md) | Markdown Guide | Complete academic documentation guide with query rationale, syntax, and markdown tables |
| [`02_Schema_ERD_Keynote.pdf`](02_Schema_ERD_Keynote.pdf) | Slide Deck | In-depth Schema, ERD, 3NF Normalization & DDL Walkthrough (15 Slides) |
| [`03_Review_2_Presentation.pdf`](03_Review_2_Presentation.pdf) | Slide Deck | Review 2 Presentation: DDL, Queries, Views, Prototype & Tests (14 Slides) |
| [`prisma_erd.png`](prisma_erd.png) | ERD Diagram | High-resolution entity relationship diagram generated via Prisma ORM |

---

## 💡 Key Highlights Demonstrated

- **Zero Overlapping Appointments:** Enforced via `UNIQUE (doctor_id, appointment_date, appointment_time)`.
- **Bed Exclusivity & Occupancy:** Handled through status constraints, `UNIQUE (ward_id, bed_number)`, and inpatient admission state checks.
- **Financial Balances:** Automatic billing reconciliation preventing negative payments and ensuring positive balances.
- **Role-Based Views:** 6 pre-built views simplifying application-level queries without exposing raw schema details.
