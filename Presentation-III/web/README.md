# HAPCMS — Full-Stack Web Application

**Hospital Appointment & Patient Care Management System (HAPCMS)**  
**Framework:** Next.js 14 (App Router)  
**Language:** TypeScript  
**Styling:** Tailwind CSS + Lucide Icons  
**Database ORM:** Prisma ORM 6.4 + PostgreSQL 16 (Neon Cloud)  
**Developer:** Shaik Imaduddin (25WU0101048)  

---

## 🚀 Overview

The `web/` module contains the complete production-grade full-stack web application for HAPCMS. It interacts directly with the 16 normalized tables in PostgreSQL to deliver real-time operational interfaces for clinical and administrative staff.

---

## 🖥️ Application Modules & Routes

| Route | Module | Purpose |
|---|---|---|
| `/` | **Executive Dashboard** | Real-time KPIs: active inpatients, available beds, today's appointments, revenue, and recent patient activity. |
| `/patients` | **Patient Records** | Longitudinal patient registry with full demographics, contact information, blood groups, and history links. |
| `/appointments` | **Appointments & Roster** | Doctor appointment scheduling, time slot collision prevention, and consultation status management. |
| `/inpatient` | **Wards & Inpatient Beds** | Ward capacity tracking, bed occupancy rates, active admissions, and bed status updates. |
| `/lab` | **Diagnostic Laboratory** | Lab test catalog, diagnostic test ordering, abnormal/critical result tracking, and turnaround monitoring. |
| `/billing` | **Financial & Invoicing** | Comprehensive itemized billing, multi-tender payments (Cash, UPI, Card, Insurance), and outstanding dues audit. |

---

## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Ensure `.env` contains your PostgreSQL connection string:
```env
DATABASE_URL="postgresql://user:password@neon.tech/hapcms?sslmode=require"
```

### 3. Generate Prisma Client
```bash
npx prisma generate
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 5. Launch Prisma Studio (Visual Table Explorer)
```bash
npm run studio
```
Opens visual database management UI at [http://localhost:5555](http://localhost:5555).
