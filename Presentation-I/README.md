# Presentation-I: Conceptual Design & Relational Schema (Review 1)

**Course:** Database Management Systems (DBMS)  
**Project:** Hospital Appointment & Patient Care Management System (HAPCMS)  
**Student:** Shaik Imaduddin  
**Roll Number:** 25WU0101048  
**Faculty / Instructor:** Dr. Kiran Mayee Adavala  
**Target RDBMS:** PostgreSQL 16 (Neon Cloud)  

---

## 📌 Milestone Overview

Presentation-I covers the foundational architecture of HAPCMS presented for **Review 1** assessment:

1. **Problem Statement & Background:** Operational failures in conventional healthcare tracking (double bookings, bed bottlenecks, fragmented longitudinal charts, invoice leakage).
2. **System Scope & SMART Objectives:** Scope covering 7 functional hospital clusters and explicit exclusion boundaries.
3. **Conceptual ER Modeling:** Complete Entity-Relationship design across 16 core entities with Crow's Foot cardinalities.
4. **Relational Schema & 3NF Normalization:** Systematic proof showing absence of 1NF multi-valued attributes, 2NF partial dependencies, and 3NF transitive dependencies.
5. **Database Integrity Enforcements:** Primary keys, foreign key cascading strategies, CHECK constraints, and native custom PostgreSQL ENUM types.

---

## 📂 Deliverables in this Folder

| File | Description | Slides |
|---|---|---|
| [`01_Executive_Presentation.pdf`](01_Executive_Presentation.pdf) | Review 1 Executive Presentation Slide Deck | 14 Slides |

---

## 🎯 Key Design Metrics

- **Total Entities:** 16 Relational Tables
- **Controlled Vocabularies:** 10 Custom PostgreSQL `ENUM` types
- **Domain CHECK Constraints:** 8 Integrity constraints (chronology, positive balance, blood groups)
- **Primary / Foreign Keys:** 16 Primary Keys, 19 Foreign Key integrity relationships
