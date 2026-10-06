# Presentation-II: Schema Hardening, DDL, SQL Queries & Views (Review 2)

**Course:** Database Management Systems (DBMS)  
**Project:** Hospital Appointment & Patient Care Management System (HAPCMS)  
**Student:** Shaik Imaduddin  
**Roll Number:** 25WU0101048  
**Faculty / Instructor:** Dr. Kiran Mayee Adavala  
**Target RDBMS:** PostgreSQL 16 (Neon Cloud)  

---

## 📌 Milestone Overview

Presentation-II hardens the relational foundation through executable DDL, comprehensive seed data, complex multi-table queries, operational views, and live constraint validation:

1. **Normalized Database Schema (3NF):** Hardening 16 entities across 6 functional clusters.
2. **PostgreSQL 16 DDL & Constraints:** Custom ENUM types, unique slot indexes (`uq_doctor_slot`), bed exclusivity rules, and chronological CHECKs.
3. **Comprehensive Seed Data:** Rich medical dataset with realistic patients, doctor rosters, consultations, prescriptions, lab orders, inpatient wards, and invoices.
4. **Analytical SQL Queries:**
   - Multi-table INNER JOIN: Longitudinal Patient History
   - Multi-table LEFT JOIN: Doctor Weekly Roster & Slot Load
   - Correlated Subquery: Unpaid / Partially Paid Invoices & Pending Diagnostic Orders
   - Aggregations with GROUP BY: Revenue by Medical Department
5. **Operational Database Views:** 6 dedicated views (`vw_patient_history`, `vw_doctor_schedule`, `vw_bed_occupancy`, `vw_pending_tests`, `vw_outstanding_bills`, `vw_revenue_by_dept`).
6. **Constraint Integrity Testing:** 8 systematic positive and negative tests verifying ACID transactional rules.

---

## 📂 Deliverables in this Folder

| File | Description | Slides |
|---|---|---|
| [`02_Schema_ERD_Keynote.pdf`](02_Schema_ERD_Keynote.pdf) | In-depth Schema, ERD, 3NF Normalization & DDL Walkthrough | 15 Slides |
| [`03_Review_2_Presentation.pdf`](03_Review_2_Presentation.pdf) | Review 2 Presentation: DDL, Queries, Views, Prototype & Tests | 14 Slides |

---

## 💡 Key Highlights Demonstrated

- **Zero Overlapping Appointments:** Enforced via `UNIQUE (doctor_id, appointment_date, appointment_time)`.
- **Bed Exclusivity & Occupancy:** Handled through status constraints and inpatient admission state checks.
- **Financial Balances:** Automatic billing reconciliation preventing negative payments and ensuring positive balances.
