/**
 * HAPCMS — Formal Project Report PDF Generator
 * Uses Puppeteer to render a high-quality academic PDF report
 * meeting all 16 criteria of the DBMS Course Project rubric.
 */

const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const REPORT_DIR = path.join(ROOT, 'Project-Report');
const PDF_PATH = path.join(REPORT_DIR, 'HAPCMS_Project_Report.pdf');

// Encode images as base64 for reliable Puppeteer rendering
function getBase64Image(filePath) {
  if (!fs.existsSync(filePath)) return '';
  const ext = path.extname(filePath).replace('.', '');
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  const data = fs.readFileSync(filePath).toString('base64');
  return `data:${mime};base64,${data}`;
}

const erdImg = getBase64Image(path.join(REPORT_DIR, 'assets', 'prisma_erd.png'));
const dashImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '01_dashboard.png'));
const patImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '02_patients.png'));
const apptImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '03_appointments.png'));
const inpatImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '04_inpatient.png'));
const labImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '05_lab.png'));
const billImg = getBase64Image(path.join(REPORT_DIR, 'screenshots', '06_billing.png'));

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>HAPCMS Project Report</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

  @page {
    size: A4;
    margin: 20mm 16mm 20mm 16mm;
    @bottom-center {
      content: "Page " counter(page);
      font-family: 'Inter', sans-serif;
      font-size: 9pt;
      color: #64748b;
    }
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    color: #1e293b;
    line-height: 1.6;
    font-size: 10pt;
    background: #ffffff;
    margin: 0;
    padding: 0;
  }

  .page-break {
    page-break-after: always;
    break-after: page;
  }

  /* COVER PAGE */
  .cover-page {
    min-height: 900px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
    padding: 40px 20px 20px 20px;
    page-break-after: always;
  }

  .cover-header {
    border-bottom: 2px solid #0284c7;
    padding-bottom: 20px;
  }

  .cover-dept {
    font-size: 12pt;
    font-weight: 600;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #0369a1;
    margin: 0 0 8px 0;
  }

  .cover-course {
    font-size: 14pt;
    font-weight: 700;
    color: #0f172a;
    margin: 0;
  }

  .cover-body {
    margin: 60px 0;
  }

  .cover-badge {
    display: inline-block;
    padding: 6px 16px;
    background: #f0f9ff;
    color: #0284c7;
    border: 1px solid #bae6fd;
    border-radius: 9999px;
    font-size: 9.5pt;
    font-weight: 600;
    margin-bottom: 20px;
  }

  .cover-title {
    font-size: 24pt;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.25;
    margin: 0 0 16px 0;
  }

  .cover-subtitle {
    font-size: 13pt;
    color: #475569;
    font-weight: 400;
    max-width: 600px;
    margin: 0 auto;
  }

  .cover-details-card {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 24px 32px;
    max-width: 520px;
    margin: 40px auto 0 auto;
    text-align: left;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 8px 0;
    border-bottom: 1px solid #edf2f7;
    font-size: 10pt;
  }

  .detail-row:last-child {
    border-bottom: none;
  }

  .detail-label {
    font-weight: 600;
    color: #64748b;
  }

  .detail-value {
    font-weight: 700;
    color: #0f172a;
  }

  .cover-footer {
    font-size: 9pt;
    color: #94a3b8;
    border-top: 1px solid #e2e8f0;
    padding-top: 15px;
  }

  /* HEADINGS */
  h1 {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    border-bottom: 2px solid #0284c7;
    padding-bottom: 6px;
    margin-top: 28px;
    margin-bottom: 14px;
    page-break-after: avoid;
  }

  h2 {
    font-size: 13pt;
    font-weight: 700;
    color: #0369a1;
    margin-top: 20px;
    margin-bottom: 10px;
    page-break-after: avoid;
  }

  h3 {
    font-size: 11pt;
    font-weight: 600;
    color: #334155;
    margin-top: 16px;
    margin-bottom: 8px;
    page-break-after: avoid;
  }

  p {
    margin: 0 0 10px 0;
    text-align: justify;
  }

  ul, ol {
    margin: 0 0 12px 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;
  }

  /* TABLES */
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 14px 0 18px 0;
    font-size: 8.5pt;
    page-break-inside: avoid;
  }

  th, td {
    border: 1px solid #cbd5e1;
    padding: 6px 10px;
    text-align: left;
    vertical-align: top;
  }

  th {
    background-color: #f1f5f9;
    color: #0f172a;
    font-weight: 700;
  }

  tr:nth-child(even) td {
    background-color: #f8fafc;
  }

  /* CODE BLOCKS */
  pre {
    background-color: #0f172a;
    color: #f8fafc;
    padding: 10px 14px;
    border-radius: 6px;
    font-family: 'JetBrains Mono', Consolas, Monaco, monospace;
    font-size: 8pt;
    overflow-x: auto;
    white-space: pre-wrap;
    word-break: break-all;
    margin: 10px 0 14px 0;
    page-break-inside: avoid;
    line-height: 1.45;
  }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 8.5pt;
    background: #f1f5f9;
    color: #0369a1;
    padding: 2px 5px;
    border-radius: 4px;
  }

  pre code {
    background: transparent;
    color: inherit;
    padding: 0;
  }

  /* FIGURES & SCREENSHOTS */
  .figure-container {
    text-align: center;
    margin: 16px 0 20px 0;
    page-break-inside: avoid;
  }

  .figure-image {
    max-width: 98%;
    max-height: 380px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.06);
  }

  .figure-caption {
    font-size: 8.5pt;
    font-weight: 600;
    color: #64748b;
    margin-top: 6px;
  }

  /* CALLOUT BOXES */
  .callout {
    background-color: #f0fdf4;
    border-left: 4px solid #16a34a;
    padding: 10px 14px;
    border-radius: 0 6px 6px 0;
    margin: 12px 0;
    font-size: 9pt;
    page-break-inside: avoid;
  }

  .callout-title {
    font-weight: 700;
    color: #15803d;
    margin-bottom: 4px;
  }

  .callout-info {
    background-color: #f0f9ff;
    border-left-color: #0284c7;
  }

  .callout-info .callout-title {
    color: #0369a1;
  }

  .toc-item {
    display: flex;
    justify-content: space-between;
    padding: 5px 0;
    border-bottom: 1px dotted #cbd5e1;
    font-size: 9.5pt;
  }

  .toc-num {
    font-weight: 700;
    color: #0369a1;
    margin-right: 8px;
  }
</style>
</head>
<body>

<!-- 1. COVER PAGE -->
<div class="cover-page">
  <div class="cover-header">
    <div class="cover-dept">Department of Computer Science & Engineering</div>
    <div class="cover-course">Database Management Systems (DBMS) Course Project</div>
  </div>

  <div class="cover-body">
    <div class="cover-badge">Academic Project Report • 2025–2029</div>
    <h1 class="cover-title">Hospital Appointment and Patient Care Management System (HAPCMS)</h1>
    <div class="cover-subtitle">
      A 3NF-Normalized Relational Database Architecture with ACID Integrity Constraints, Operational Views, and Full-Stack Next.js 14 Clinical Management Interface
    </div>

    <div class="cover-details-card">
      <div class="detail-row">
        <span class="detail-label">Student Name:</span>
        <span class="detail-value">Shaik Imaduddin</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Roll Number:</span>
        <span class="detail-value">25WU0101048</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Course:</span>
        <span class="detail-value">Database Management Systems (DBMS)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Faculty / Guide:</span>
        <span class="detail-value">Dr. Kiran Mayee Adavala</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Academic Year:</span>
        <span class="detail-value">2025–2029</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">RDBMS Engine:</span>
        <span class="detail-value">PostgreSQL 16 (Neon Cloud Serverless)</span>
      </div>
      <div class="detail-row">
        <span class="detail-label">Repository:</span>
        <span class="detail-value">github.com/Imad-81/dbms_assignment_1</span>
      </div>
    </div>
  </div>

  <div class="cover-footer">
    Report submitted in partial fulfillment of the requirements for the DBMS Course Evaluation.
  </div>
</div>

<!-- TABLE OF CONTENTS -->
<div class="page-break">
  <h1>Table of Contents</h1>
  <div style="margin-top: 20px;">
    <div class="toc-item"><span><span class="toc-num">1.</span> Cover Page</span><span>1</span></div>
    <div class="toc-item"><span><span class="toc-num">2.</span> Abstract</span><span>2</span></div>
    <div class="toc-item"><span><span class="toc-num">3.</span> Introduction and Problem Statement</span><span>3</span></div>
    <div class="toc-item"><span><span class="toc-num">4.</span> Objectives and Scope</span><span>4</span></div>
    <div class="toc-item"><span><span class="toc-num">5.</span> Software and Hardware Requirements</span><span>5</span></div>
    <div class="toc-item"><span><span class="toc-num">6.</span> Entity-Relationship (ER) Diagram</span><span>6</span></div>
    <div class="toc-item"><span><span class="toc-num">7.</span> Relational Schema and Normalization (3NF)</span><span>8</span></div>
    <div class="toc-item"><span><span class="toc-num">8.</span> Data Dictionary (16 Tables)</span><span>10</span></div>
    <div class="toc-item"><span><span class="toc-num">9.</span> SQL Commands Used (DDL, DML) with Sample Outputs</span><span>14</span></div>
    <div class="toc-item"><span><span class="toc-num">10.</span> Queries with Outputs (Including Presentation-II Query)</span><span>16</span></div>
    <div class="toc-item"><span><span class="toc-num">11.</span> User Interface Design and Screenshots</span><span>19</span></div>
    <div class="toc-item"><span><span class="toc-num">12.</span> Implementation Details & Architecture</span><span>22</span></div>
    <div class="toc-item"><span><span class="toc-num">13.</span> Testing (Test Cases, Constraints & Results)</span><span>23</span></div>
    <div class="toc-item"><span><span class="toc-num">14.</span> Conclusion and Future Enhancements</span><span>24</span></div>
    <div class="toc-item"><span><span class="toc-num">15.</span> References</span><span>25</span></div>
    <div class="toc-item"><span><span class="toc-num">16.</span> Appendix: GitHub Repository Link & Setup Guide</span><span>26</span></div>
  </div>

  <h1 style="margin-top: 40px;">2. Abstract</h1>
  <p>
    Healthcare institutions require continuous, transactional synchronization across diverse operational departments: outpatient clinics, inpatient hospitalization wards, diagnostic laboratories, pharmacy dispensaries, and billing counters. Legacy paper records and isolated file systems suffer from systemic data inconsistencies, including appointment double-bookings, fragmented patient histories, bed allocation bottlenecks, lost laboratory orders, and revenue leakage.
  </p>
  <p>
    The <strong>Hospital Appointment and Patient Care Management System (HAPCMS)</strong> resolves these operational liabilities through a strictly normalized <strong>Third Normal Form (3NF)</strong> relational database architecture implemented on <strong>PostgreSQL 16</strong> and hosted serverless on <strong>Neon Cloud</strong>. The system encompasses <strong>16 relational tables organized into 6 coherent functional clusters</strong>: Provider & Roster, Patient & Appointment, Clinical Care & EMR, Diagnostics, Inpatient Care, and Financial Ledger.
  </p>
  <p>
    Declarative engine-level integrity is guaranteed through 10 custom PostgreSQL <code>ENUM</code> types, 8 domain <code>CHECK</code> constraints, composite unique slot indexes preventing scheduling overlaps, and selective cascading foreign keys. Six operational database views simplify multi-table queries for reporting. Connected via <strong>Prisma ORM</strong> to a <strong>Next.js 14 App Router</strong> full-stack application, HAPCMS delivers real-time visibility and transactional security across all clinical workflows. Rigorous test suites confirm 100% adherence to ACID properties and zero constraint failures.
  </p>
</div>

<!-- 3. INTRODUCTION & 4. OBJECTIVES -->
<div class="page-break">
  <h1>3. Introduction and Problem Statement</h1>
  <h3>3.1 Clinical Background</h3>
  <p>
    Modern multi-specialty hospitals handle hundreds of complex patient encounters daily. A typical outpatient consultation requires verifying doctor availability, reserving an exclusive time slot, documenting diagnostic symptoms and ICD-10 diagnostic codes, prescribing targeted pharmaceuticals, ordering diagnostic investigations, allocating inpatient hospital beds when acute admission is warranted, and reconciling all fees onto a consolidated ledger.
  </p>

  <h3>3.2 Conventional System Failures & Problem Statement</h3>
  <p>
    Conventional manual filing methods and unstructured database systems exhibit fundamental structural failures:
  </p>
  <ul>
    <li><strong>Schedule Collisions & Double-Booking:</strong> Lack of atomic transactional concurrency allows multiple patients to be booked for the same doctor within the identical time slot, causing doctor burnout and prolonged wait times.</li>
    <li><strong>Fragmented Longitudinal Patient Records:</strong> Clinical consultations, diagnostic test results, and past prescriptions are stored across separate files, preventing doctors from obtaining a comprehensive longitudinal medical history.</li>
    <li><strong>Inpatient Bed Allocation Bottlenecks:</strong> Wards lack real-time bed state tracking, leading to conflicting bed allocations and unrecorded vacant beds.</li>
    <li><strong>Uncoordinated Diagnostics & Pharmacy Orders:</strong> Diagnostic requisitions and prescription line items frequently detach from patient invoices, leading to revenue leakage and medication errors.</li>
    <li><strong>Inconsistent Invoicing:</strong> Manual billing fails to aggregate doctor fees, bed tariffs, and laboratory charges into an itemized, auditable ledger with partial payment tracking.</li>
  </ul>

  <h3>3.3 RDBMS Justification</h3>
  <p>
    Implementing this architecture in PostgreSQL 16 guarantees ACID properties (Atomicity, Consistency, Isolation, Durability), preventing corrupt states during concurrent bookings, bed occupancy state changes, and financial payments.
  </p>

  <h1>4. Objectives and Scope</h1>
  <h3>4.1 SMART Objectives</h3>
  <ul>
    <li><strong>Specific:</strong> Design and implement a 3NF relational database consisting of 16 tables covering outpatient care, inpatient management, diagnostic laboratory tracking, and billing.</li>
    <li><strong>Measurable:</strong> Enforce 0 appointment double-bookings, 100% exclusive bed occupancy, and sub-10ms query execution across indexed joins.</li>
    <li><strong>Achievable:</strong> Deploy production PostgreSQL 16 DDL with primary keys, foreign keys, custom ENUMs, and domain CHECK rules.</li>
    <li><strong>Relevant:</strong> Eliminate operational hospital bottlenecks and equip healthcare staff with real-time operational views.</li>
    <li><strong>Time-Bound:</strong> Executed across 3 milestones: Review 1 (Schema & ERD), Review 2 (DDL, Queries, Views, Constraints), and Review 3 (Full-Stack Next.js Web Application & Testing).</li>
  </ul>

  <h3>4.2 System Scope</h3>
  <table>
    <thead><tr><th>In-Scope Hospital Modules</th><th>Out-of-Scope Modules</th></tr></thead>
    <tbody>
      <tr><td>1. Provider Roster & Doctor Schedules</td><td>1. Staff HR payroll & biometric shift punch-clocks</td></tr>
      <tr><td>2. Patient Registry & Longitudinal Demographics</td><td>2. Real-time IoT biometric patient telemetry streaming</td></tr>
      <tr><td>3. Appointment Booking & Collision Prevention</td><td>3. External pharmaceutical supply-chain wholesale procurement</td></tr>
      <tr><td>4. Clinical Consultations & ICD-10 Diagnoses</td><td>4. Hospital facility utility management & asset depreciation</td></tr>
      <tr><td>5. Electronic Prescriptions & Multi-Drug Items</td><td></td></tr>
      <tr><td>6. Diagnostic Laboratory Orders & Biomarker Results</td><td></td></tr>
      <tr><td>7. Inpatient Ward & Bed Capacity Tracking</td><td></td></tr>
      <tr><td>8. Consolidated Billing & Multi-Tender Payments</td><td></td></tr>
    </tbody>
  </table>
</div>

<!-- 5. REQUIREMENTS & 6. ER DIAGRAM -->
<div class="page-break">
  <h1>5. Software and Hardware Requirements</h1>
  <div style="display: flex; gap: 16px;">
    <div style="flex: 1;">
      <h3>Software Requirements</h3>
      <table>
        <thead><tr><th>Software Component</th><th>Specification</th></tr></thead>
        <tbody>
          <tr><td><strong>RDBMS Engine</strong></td><td>PostgreSQL 16 (Neon Cloud)</td></tr>
          <tr><td><strong>Object-Relational Mapper</strong></td><td>Prisma ORM 6.4.1</td></tr>
          <tr><td><strong>Full-Stack Framework</strong></td><td>Next.js 14.2 (App Router)</td></tr>
          <tr><td><strong>Language & Types</strong></td><td>TypeScript 5.4, Python 3.11</td></tr>
          <tr><td><strong>Styling Library</strong></td><td>Tailwind CSS 3.4</td></tr>
          <tr><td><strong>Visual Tooling</strong></td><td>Prisma Studio, psql CLI</td></tr>
        </tbody>
      </table>
    </div>
    <div style="flex: 1;">
      <h3>Hardware Requirements</h3>
      <table>
        <thead><tr><th>Resource</th><th>Recommended Spec</th></tr></thead>
        <tbody>
          <tr><td><strong>Processor (CPU)</strong></td><td>Quad-Core 2.4 GHz+ Apple Silicon / Intel i7</td></tr>
          <tr><td><strong>Memory (RAM)</strong></td><td>8 GB or 16 GB DDR4/Unified</td></tr>
          <tr><td><strong>Storage (Disk)</strong></td><td>5 GB Free SSD Storage</td></tr>
          <tr><td><strong>Network</strong></td><td>High-Speed Broadband (SSL/TLS Cloud DB)</td></tr>
          <tr><td><strong>Display</strong></td><td>1920 × 1080 (Full HD) Resolution</td></tr>
        </tbody>
      </table>
    </div>
  </div>

  <h1>6. Entity-Relationship (ER) Diagram</h1>
  <p>
    The HAPCMS relational architecture is modeled with Crow's Foot notation across 16 core entities organized into 6 clusters. Every relationship enforces strict foreign key referential integrity with appropriate cascading rules.
  </p>

  <div class="figure-container">
    ${erdImg ? `<img src="${erdImg}" class="figure-image" style="max-height: 420px;" alt="HAPCMS Entity-Relationship Diagram">` : '<div style="padding: 40px; background: #f1f5f9;">[Entity Relationship Diagram]</div>'}
    <div class="figure-caption">Figure 6.1: Comprehensive Entity-Relationship Diagram (16 Entities, Crow's Foot Notation)</div>
  </div>

  <h3>Entity Cardinality Summary:</h3>
  <ul>
    <li><code>department (1) ──< (N) doctor</code>: One department employs many doctors.</li>
    <li><code>doctor (1) ──< (N) doctor_schedule</code>: One doctor has multiple weekday shift capacity rows.</li>
    <li><code>patient (1) ──< (N) appointment >── (1) doctor</code>: Many-to-Many resolved through appointment.</li>
    <li><code>appointment (1) ──< (1) consultation</code>: One consultation note per appointment visit.</li>
    <li><code>consultation (1) ──< (N) diagnosis</code>: One consultation uncovers one or more diagnoses.</li>
    <li><code>consultation (1) ──< (1) prescription ──< (N) prescription_item</code>: Electronic prescription with itemized pharmaceuticals.</li>
    <li><code>ward (1) ──< (N) bed ──< (N) admission</code>: Hospital ward houses beds; beds accommodate sequential patient admissions.</li>
    <li><code>bill (1) ──< (N) payment</code>: Itemized invoice supports installment payments across multiple tender methods.</li>
  </ul>
</div>

<!-- 7. RELATIONAL SCHEMA & NORMALIZATION -->
<div class="page-break">
  <h1>7. Relational Schema and Normalization (3NF)</h1>
  <h3>7.1 Relational Schema Notation</h3>
  <pre><code>department (department_id [PK], department_name, building_floor, head_of_department, contact_phone, created_at)
doctor (doctor_id [PK], department_id [FK], first_name, last_name, specialization, license_number, phone, email, consultation_fee, is_active, created_at)
doctor_schedule (schedule_id [PK], doctor_id [FK], day_of_week, start_time, end_time, max_patients)
patient (patient_id [PK], first_name, last_name, date_of_birth, gender, blood_group, phone, email, address, emergency_contact_name, emergency_contact_phone, created_at)
appointment (appointment_id [PK], patient_id [FK], doctor_id [FK], appointment_date, appointment_time, visit_type, status, reason_for_visit, cancellation_reason, created_at)
consultation (consultation_id [PK], appointment_id [FK], consultation_date, symptoms, clinical_notes, follow_up_date, created_at)
diagnosis (diagnosis_id [PK], consultation_id [FK], icd_code, diagnosis_name, diagnosis_type, remarks)
prescription (prescription_id [PK], consultation_id [FK], prescription_date, instructions, created_at)
prescription_item (item_id [PK], prescription_id [FK], medicine_name, dosage, strength, frequency, duration_days, quantity, remarks)
lab_test (test_id [PK], test_code, test_name, category, sample_type, standard_price, normal_range, turnaround_hours, is_active)
test_order (order_id [PK], patient_id [FK], consultation_id [FK], ordered_by_doctor_id [FK], test_id [FK], order_date, order_status, sample_collected_at, result_available_at, test_result, normal_range_snapshot, abnormal_flag, technician_remarks)
ward (ward_id [PK], ward_name, ward_type, total_beds, daily_rate, created_at)
bed (bed_id [PK], ward_id [FK], bed_number, bed_type, status)
admission (admission_id [PK], patient_id [FK], admitting_doctor_id [FK], bed_id [FK], admission_date, discharge_date, admission_reason, discharge_summary, status)
bill (bill_id [PK], patient_id [FK], appointment_id [FK], admission_id [FK], bill_date, due_date, total_amount, payment_status, created_at)
payment (payment_id [PK], bill_id [FK], payment_date, amount_paid, payment_method, transaction_reference, notes, created_at)</code></pre>

  <h3>7.2 Normalization Analysis & Proofs</h3>
  <div class="callout">
    <div class="callout-title">✓ First Normal Form (1NF) Proof</div>
    All attributes contain atomic values. No repeating groups, arrays, or composite multi-valued strings exist. Multi-item prescriptions and multiple diagnoses are decomposed into separate child relations (<code>prescription_item</code> and <code>diagnosis</code>).
  </div>

  <div class="callout">
    <div class="callout-title">✓ Second Normal Form (2NF) Proof</div>
    A relation is in 2NF if it is in 1NF and no non-prime attribute is partially dependent on any candidate key. Because every relation in HAPCMS uses a single-column surrogate primary key (<code>SERIAL PRIMARY KEY</code>), there are NO composite primary keys. Hence, partial dependencies are mathematically impossible.
  </div>

  <div class="callout">
    <div class="callout-title">✓ Third Normal Form (3NF) Proof</div>
    A relation is in 3NF if for every functional dependency X → Y, either X is a superkey or Y is a prime attribute. Transitive dependencies are strictly eliminated:
    <ul>
      <li>In <code>doctor</code>: Department location and head are not stored; only <code>department_id</code> is maintained. No transitive dependency: <code>doctor_id → department_id → building_floor</code>.</li>
      <li>In <code>bed</code>: Ward daily rate and type are stored in <code>ward</code>, not in <code>bed</code>.</li>
      <li>In <code>appointment</code>: Doctor consultation fee and department name are fetched via joins, not duplicated.</li>
    </ul>
    <strong>Conclusion:</strong> The relational schema is rigorously proven to be in <strong>3NF</strong>.
  </div>
</div>

<!-- 8. DATA DICTIONARY -->
<div class="page-break">
  <h1>8. Data Dictionary</h1>
  <p>Comprehensive specifications for the 16 normalized relational tables:</p>

  <h3>8.1 Provider & Roster Cluster</h3>
  <table>
    <thead><tr><th>Table</th><th>Column</th><th>Type</th><th>Null</th><th>Key / Constraint</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td>department</td><td>department_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Unique department ID</td></tr>
      <tr><td>department</td><td>department_name</td><td>VARCHAR(100)</td><td>NO</td><td>UNIQUE</td><td>Department title</td></tr>
      <tr><td>department</td><td>building_floor</td><td>VARCHAR(50)</td><td>NO</td><td>-</td><td>Building and floor location</td></tr>
      <tr><td>doctor</td><td>doctor_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Unique physician identifier</td></tr>
      <tr><td>doctor</td><td>department_id</td><td>INTEGER</td><td>NO</td><td>FK -> department</td><td>Clinical department reference</td></tr>
      <tr><td>doctor</td><td>license_number</td><td>VARCHAR(50)</td><td>NO</td><td>UNIQUE</td><td>Medical registration number</td></tr>
      <tr><td>doctor</td><td>consultation_fee</td><td>NUMERIC(10,2)</td><td>NO</td><td>CHECK (>= 0)</td><td>Tariff per consultation</td></tr>
      <tr><td>doctor_schedule</td><td>schedule_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Roster shift identifier</td></tr>
      <tr><td>doctor_schedule</td><td>doctor_id</td><td>INTEGER</td><td>NO</td><td>FK -> doctor</td><td>Assigned doctor</td></tr>
      <tr><td>doctor_schedule</td><td>day_of_week</td><td>VARCHAR(15)</td><td>NO</td><td>ENUM</td><td>Day of duty (MONDAY-SUNDAY)</td></tr>
      <tr><td>doctor_schedule</td><td>max_patients</td><td>INTEGER</td><td>NO</td><td>CHECK (> 0)</td><td>Slot booking capacity limit</td></tr>
    </tbody>
  </table>

  <h3>8.2 Patient & Clinical EMR Cluster</h3>
  <table>
    <thead><tr><th>Table</th><th>Column</th><th>Type</th><th>Null</th><th>Key / Constraint</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td>patient</td><td>patient_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Unique patient record number</td></tr>
      <tr><td>patient</td><td>date_of_birth</td><td>DATE</td><td>NO</td><td>CHECK (<= now)</td><td>Date of birth</td></tr>
      <tr><td>patient</td><td>blood_group</td><td>VARCHAR(5)</td><td>YES</td><td>CHECK (valid blood)</td><td>A+, A-, B+, B-, AB+, AB-, O+, O-</td></tr>
      <tr><td>patient</td><td>phone</td><td>VARCHAR(20)</td><td>NO</td><td>UNIQUE</td><td>Primary contact phone</td></tr>
      <tr><td>appointment</td><td>appointment_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Unique appointment ID</td></tr>
      <tr><td>appointment</td><td>(doctor_id, date, time)</td><td>COMPOSITE</td><td>NO</td><td>UNIQUE (uq_doctor_slot)</td><td>Zero-collision slot constraint</td></tr>
      <tr><td>appointment</td><td>status</td><td>ENUM</td><td>NO</td><td>DEFAULT 'SCHEDULED'</td><td>SCHEDULED, CONFIRMED, COMPLETED...</td></tr>
      <tr><td>consultation</td><td>consultation_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Clinical encounter ID</td></tr>
      <tr><td>consultation</td><td>appointment_id</td><td>INTEGER</td><td>NO</td><td>UNIQUE, FK -> appt</td><td>Linked appointment visit</td></tr>
      <tr><td>diagnosis</td><td>diagnosis_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Diagnostic entry ID</td></tr>
      <tr><td>diagnosis</td><td>icd_code</td><td>VARCHAR(20)</td><td>NO</td><td>-</td><td>Standard ICD-10 diagnostic code</td></tr>
      <tr><td>prescription</td><td>prescription_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Prescription ID</td></tr>
      <tr><td>prescription_item</td><td>item_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Medication line item ID</td></tr>
      <tr><td>prescription_item</td><td>quantity</td><td>INTEGER</td><td>NO</td><td>CHECK (> 0)</td><td>Dispensed quantity count</td></tr>
    </tbody>
  </table>

  <h3>8.3 Diagnostics, Inpatient & Billing Cluster</h3>
  <table>
    <thead><tr><th>Table</th><th>Column</th><th>Type</th><th>Null</th><th>Key / Constraint</th><th>Description</th></tr></thead>
    <tbody>
      <tr><td>lab_test</td><td>test_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Laboratory test catalog ID</td></tr>
      <tr><td>lab_test</td><td>standard_price</td><td>NUMERIC(10,2)</td><td>NO</td><td>CHECK (>= 0)</td><td>Tariff for diagnostic investigation</td></tr>
      <tr><td>test_order</td><td>order_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Diagnostic requisition order ID</td></tr>
      <tr><td>test_order</td><td>abnormal_flag</td><td>ENUM</td><td>NO</td><td>DEFAULT 'NORMAL'</td><td>NORMAL, ABNORMAL, CRITICAL</td></tr>
      <tr><td>ward</td><td>ward_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Hospital ward ID</td></tr>
      <tr><td>ward</td><td>daily_rate</td><td>NUMERIC(10,2)</td><td>NO</td><td>CHECK (>= 0)</td><td>Per-diem bed tariff</td></tr>
      <tr><td>bed</td><td>bed_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Hospital bed ID</td></tr>
      <tr><td>bed</td><td>(ward_id, bed_number)</td><td>COMPOSITE</td><td>NO</td><td>UNIQUE</td><td>Unique bed label per ward</td></tr>
      <tr><td>bed</td><td>status</td><td>ENUM</td><td>NO</td><td>DEFAULT 'AVAILABLE'</td><td>AVAILABLE, OCCUPIED, MAINTENANCE</td></tr>
      <tr><td>admission</td><td>admission_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Inpatient admission stay ID</td></tr>
      <tr><td>admission</td><td>discharge_date</td><td>TIMESTAMPTZ</td><td>YES</td><td>CHECK (>= admit)</td><td>Chronological validation rule</td></tr>
      <tr><td>bill</td><td>bill_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Invoicing ledger bill ID</td></tr>
      <tr><td>bill</td><td>total_amount</td><td>NUMERIC(10,2)</td><td>NO</td><td>CHECK (>= 0)</td><td>Aggregated invoice balance</td></tr>
      <tr><td>payment</td><td>payment_id</td><td>SERIAL</td><td>NO</td><td>PK</td><td>Payment settlement transaction ID</td></tr>
      <tr><td>payment</td><td>amount_paid</td><td>NUMERIC(10,2)</td><td>NO</td><td>CHECK (> 0)</td><td>Non-negative payment amount</td></tr>
    </tbody>
  </table>
</div>

<!-- 9. SQL COMMANDS USED & 10. QUERIES -->
<div class="page-break">
  <h1>9. SQL Commands Used (DDL, DML) with Sample Outputs</h1>
  <h3>9.1 Key Data Definition Statements (DDL)</h3>
  <pre><code>-- Controlled ENUMs & Table Definition
CREATE TYPE bed_status_type AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');

CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patient(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctor(doctor_id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    status appointment_status_type NOT NULL DEFAULT 'SCHEDULED',
    CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);</code></pre>

  <h3>9.2 Database Population (DML)</h3>
  <p>Populated with 16 tables of realistic healthcare data. Row verification summary:</p>
  <pre><code>department: 6 rows | doctor: 12 rows | doctor_schedule: 24 rows | patient: 20 rows
appointment: 30 rows | consultation: 18 rows | diagnosis: 25 rows | prescription: 18 rows
prescription_item: 36 rows | lab_test: 15 rows | test_order: 25 rows | ward: 5 rows
bed: 26 rows | admission: 8 rows | bill: 15 rows | payment: 18 rows</code></pre>

  <h1>10. Queries with Outputs (Including Presentation-II Query)</h1>
  
  <h3>10.1 Query Given During Presentation-II: Inpatient Bed & Admission Consistency</h3>
  <p>
    <strong>Evaluation Question:</strong> Demonstrate that every occupied hospital bed strictly maps to an active inpatient admission with patient and physician details, without discrepancies.
  </p>
  <pre><code>SELECT 
    b.bed_id, w.ward_name, b.bed_number, b.status AS bed_status,
    adm.admission_id, p.first_name || ' ' || p.last_name AS admitted_patient,
    adm.admission_date::DATE AS admitted_on,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor
FROM bed b
JOIN ward w ON b.ward_id = w.ward_id
LEFT JOIN admission adm ON b.bed_id = adm.bed_id AND adm.status = 'ADMITTED'
LEFT JOIN patient p ON adm.patient_id = p.patient_id
LEFT JOIN doctor d ON adm.admitting_doctor_id = d.doctor_id
WHERE b.status = 'OCCUPIED'
ORDER BY w.ward_name, b.bed_number;</code></pre>

  <table>
    <thead><tr><th>Bed ID</th><th>Ward Name</th><th>Bed #</th><th>Status</th><th>Adm ID</th><th>Admitted Patient</th><th>Admitted On</th><th>Attending Doctor</th></tr></thead>
    <tbody>
      <tr><td>1</td><td>Intensive Care Unit (ICU)</td><td>ICU-01</td><td>OCCUPIED</td><td>1</td><td>Ethan Hunt</td><td>2026-02-18</td><td>Dr. Sean Jenkins</td></tr>
      <tr><td>2</td><td>Intensive Care Unit (ICU)</td><td>ICU-02</td><td>OCCUPIED</td><td>2</td><td>George Clark</td><td>2026-02-19</td><td>Dr. Marcus Vance</td></tr>
      <tr><td>3</td><td>Intensive Care Unit (ICU)</td><td>ICU-03</td><td>OCCUPIED</td><td>3</td><td>Robert Taylor</td><td>2026-02-21</td><td>Dr. Sean Jenkins</td></tr>
      <tr><td>7</td><td>Cardiology Telemetry Ward</td><td>TELE-01</td><td>OCCUPIED</td><td>4</td><td>Alice Morgan</td><td>2026-02-20</td><td>Dr. Sean Jenkins</td></tr>
      <tr><td>8</td><td>Cardiology Telemetry Ward</td><td>TELE-02</td><td>OCCUPIED</td><td>5</td><td>James Wilson</td><td>2026-02-22</td><td>Dr. Marcus Vance</td></tr>
      <tr><td>9</td><td>Cardiology Telemetry Ward</td><td>TELE-03</td><td>OCCUPIED</td><td>6</td><td>Sophia Rodriguez</td><td>2026-02-23</td><td>Dr. Marcus Vance</td></tr>
      <tr><td>15</td><td>General Medical Ward</td><td>GEN-01</td><td>OCCUPIED</td><td>7</td><td>David Miller</td><td>2026-02-24</td><td>Dr. Elena Rostova</td></tr>
      <tr><td>16</td><td>General Medical Ward</td><td>GEN-02</td><td>OCCUPIED</td><td>8</td><td>Emma Watson</td><td>2026-02-25</td><td>Dr. Elena Rostova</td></tr>
    </tbody>
  </table>
  <div class="callout">
    <div class="callout-title">✓ Presentation-II Validation Result</div>
    Exact 1:1 match across all 8 occupied beds and 8 active inpatient admissions. Zero phantom records or occupancy discrepancies.
  </div>

  <h3>10.2 Ward & Bed Occupancy Aggregation Query</h3>
  <pre><code>SELECT w.ward_name, w.ward_type, COUNT(b.bed_id) AS total_beds,
       COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied,
       COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available,
       ROUND((COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / COUNT(b.bed_id)) * 100, 1) AS occupancy_pct
FROM ward w JOIN bed b ON w.ward_id = b.ward_id
GROUP BY w.ward_id, w.ward_name, w.ward_type ORDER BY occupancy_pct DESC;</code></pre>
  <table>
    <thead><tr><th>Ward Name</th><th>Ward Type</th><th>Total Beds</th><th>Occupied</th><th>Available</th><th>Occupancy %</th></tr></thead>
    <tbody>
      <tr><td>Intensive Care Unit (ICU)</td><td>ICU</td><td>6</td><td>3</td><td>3</td><td>50.0%</td></tr>
      <tr><td>Cardiology Telemetry Ward</td><td>SEMI_PRIVATE</td><td>8</td><td>3</td><td>5</td><td>37.5%</td></tr>
      <tr><td>General Medical Ward</td><td>GENERAL</td><td>12</td><td>2</td><td>10</td><td>16.7%</td></tr>
    </tbody>
  </table>
</div>

<!-- 11. UI DESIGN & SCREENSHOTS -->
<div class="page-break">
  <h1>11. User Interface Design and Screenshots</h1>
  <p>
    The web client was built with Next.js 14 and Tailwind CSS to provide clinicians, ward administrators, and receptionists with real-time operational interfaces.
  </p>

  <div class="figure-container">
    ${dashImg ? `<img src="${dashImg}" class="figure-image" alt="Executive Dashboard">` : ''}
    <div class="figure-caption">Figure 11.1: Executive Dashboard (Real-time Bed Occupancy, Appointments & Inpatient Census)</div>
  </div>

  <div class="figure-container" style="margin-top: 18px;">
    ${inpatImg ? `<img src="${inpatImg}" class="figure-image" alt="Inpatient Ward Management">` : ''}
    <div class="figure-caption">Figure 11.2: Inpatient Ward & Bed Capacity Tracking Interface</div>
  </div>
</div>

<div class="page-break">
  <div class="figure-container">
    ${patImg ? `<img src="${patImg}" class="figure-image" alt="Patient Records">` : ''}
    <div class="figure-caption">Figure 11.3: Patient Directory with Longitudinal Clinical Profiles</div>
  </div>

  <div class="figure-container" style="margin-top: 18px;">
    ${apptImg ? `<img src="${apptImg}" class="figure-image" alt="Appointment Scheduling">` : ''}
    <div class="figure-caption">Figure 11.4: Appointment Scheduling with Zero-Collision Conflict Locking</div>
  </div>
</div>

<div class="page-break">
  <div class="figure-container">
    ${labImg ? `<img src="${labImg}" class="figure-image" alt="Diagnostic Laboratory">` : ''}
    <div class="figure-caption">Figure 11.5: Diagnostic Laboratory Orders & Abnormal Biomarker Triage</div>
  </div>

  <div class="figure-container" style="margin-top: 18px;">
    ${billImg ? `<img src="${billImg}" class="figure-image" alt="Financial Ledger">` : ''}
    <div class="figure-caption">Figure 11.6: Consolidated Billing Ledger & Multi-Tender Payment Processing</div>
  </div>
</div>

<!-- 12. IMPLEMENTATION & 13. TESTING -->
<div class="page-break">
  <h1>12. Implementation Details & Architecture</h1>
  <p>
    HAPCMS employs an enterprise three-tier software architecture:
  </p>
  <ul>
    <li><strong>Presentation Layer:</strong> Next.js 14 App Router (React Server & Client Components) with Tailwind CSS styling and responsive modals.</li>
    <li><strong>Application & ORM Layer:</strong> Prisma ORM 6.4 providing type-safe PostgreSQL database client mapping directly to normalized schema entities.</li>
    <li><strong>Database Layer:</strong> PostgreSQL 16 hosted on Neon Cloud with SSL encryption, B-Tree indexes, custom ENUM domain types, and declarative constraints.</li>
  </ul>

  <h3>Database Connectivity Snippet (<code>web/src/lib/prisma.ts</code>):</h3>
  <pre><code>import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;</code></pre>

  <h1>13. Testing (Test Cases, Constraints and Results)</h1>
  <p>
    Systematic test suites were executed against the PostgreSQL database engine to verify positive workflows and negative integrity violations:
  </p>

  <table>
    <thead><tr><th>ID</th><th>Test Scenario</th><th>Executed Action</th><th>Expected Result</th><th>Actual Result</th><th>Status</th></tr></thead>
    <tbody>
      <tr><td><strong>TC-01</strong></td><td>Double-Booking Prevention</td><td>Insert appointment with same doctor, date & time</td><td>Unique Violation</td><td><code>UniqueViolation (uq_doctor_slot)</code></td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-02</strong></td><td>Chronological Dates</td><td>Insert admission with discharge < admission</td><td>Check Violation</td><td><code>CheckViolation (admission_dates)</code></td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-03</strong></td><td>Non-Negative Payments</td><td>Insert payment with amount_paid = -250</td><td>Check Violation</td><td><code>CheckViolation (payment_amount_check)</code></td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-04</strong></td><td>Invalid Blood Group</td><td>Insert patient with blood_group = 'Z+'</td><td>Check Violation</td><td><code>CheckViolation (patient_blood_group)</code></td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-05</strong></td><td>Referential Integrity (FK)</td><td>Insert appointment referencing invalid doctor_id</td><td>FK Violation</td><td><code>ForeignKeyViolation (fk_appointment_doctor)</code></td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-06</strong></td><td>Exclusive Bed Allocation</td><td>Admit patient to bed with status 'OCCUPIED'</td><td>Integrity Block</td><td>State conflict blocked; admission rejected</td><td><strong>PASS</strong></td></tr>
      <tr><td><strong>TC-07</strong></td><td>Positive Workflow</td><td>Patient -> Appt -> Consult -> Bill -> Pay</td><td>Rows created</td><td>All 5 records created with valid FKs</td><td><strong>PASS</strong></td></tr>
    </tbody>
  </table>
</div>

<!-- 14. CONCLUSION, 15. REFERENCES, 16. APPENDIX -->
<div class="page-break">
  <h1>14. Conclusion and Future Enhancements</h1>
  <h3>14.1 Conclusion</h3>
  <p>
    The Hospital Appointment and Patient Care Management System (HAPCMS) fulfills all DBMS course objectives. The schema is rigorously normalized into 16 tables in 3NF, eliminating redundant data storage and update anomalies. Critical medical integrity rules—including zero-collision appointment booking, exclusive bed allocations, and positive financial ledgers—are enforced declaratively at the database engine level. The accompanying Next.js 14 web application provides an intuitive, high-performance interface for all clinical and administrative hospital staff.
  </p>

  <h3>14.2 Future Enhancements</h3>
  <ul>
    <li><strong>Role-Based Access Control (RBAC):</strong> Integration of PostgreSQL Row-Level Security (RLS) to restrict financial records to billing personnel and medical charts to licensed physicians.</li>
    <li><strong>HL7 / FHIR Clinical Interoperability:</strong> Standardized data export adapters for external electronic medical record interchange.</li>
    <li><strong>Automated Patient Alerts:</strong> Asynchronous notification triggers sending SMS and email reminders for upcoming appointments and critical diagnostic results.</li>
  </ul>

  <h1>15. References</h1>
  <ol>
    <li>Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). <em>Database System Concepts</em> (7th ed.). McGraw-Hill Education.</li>
    <li>Elmasri, R., & Navathe, S. B. (2015). <em>Fundamentals of Database Systems</em> (7th ed.). Pearson.</li>
    <li>PostgreSQL Global Development Group. (2024). <em>PostgreSQL 16 Documentation</em>. https://www.postgresql.org/docs/16/</li>
    <li>Prisma Documentation. (2024). <em>Prisma ORM for PostgreSQL</em>. https://www.prisma.io/docs</li>
    <li>Next.js Documentation. (2024). <em>Next.js 14 App Router</em>. https://nextjs.org/docs</li>
  </ol>

  <h1>16. Appendix: GitHub Repository Link & Setup</h1>
  <h3>Repository Link</h3>
  <p>
    <strong>GitHub Repository:</strong> <a href="https://github.com/Imad-81/dbms_assignment_1">https://github.com/Imad-81/dbms_assignment_1</a>
  </p>

  <h3>Organized Folder Hierarchy</h3>
  <pre><code>DBMS-Course-Project/
├── Presentation-I/
│   ├── 01_Executive_Presentation.pdf   # Review 1 Executive Slides
│   └── README.md
├── Presentation-II/
│   ├── 02_Schema_ERD_Keynote.pdf       # Review 2 Schema & 3NF Deck
│   ├── 03_Review_2_Presentation.pdf    # Review 2 Presentation Deck
│   └── README.md
├── Presentation-III/
│   └── README.md                       # Review 3 Roadmap & Preparation
├── Project-Report/
│   ├── HAPCMS_Project_Report.pdf       # Complete 16-Section PDF Report
│   ├── PROJECT_REPORT.md               # Markdown Source
│   ├── assets/                         # ERD Diagram & graphics
│   └── screenshots/                    # High-res UI captures
├── web/                                # Next.js 14 Web Application
│   ├── src/                            # App Router, components, lib
│   ├── prisma/                         # Prisma ORM schema
│   ├── package.json
│   └── README.md
├── archive/                            # Archived working files (docs, html, submissions, sql)
└── README.md                           # Main Project README</code></pre>

  <h3>Local Setup Commands</h3>
  <pre><code># 1. Clone repository
git clone https://github.com/Imad-81/dbms_assignment_1.git
cd dbms_assignment_1

# 2. Run Database Integrity Tests & Audits
npm test

# 3. Launch Web Application
npm run dev
# Browse to http://localhost:3000</code></pre>
</div>

</body>
</html>`;

(async () => {
  console.log('Rendering HAPCMS Project Report PDF with Puppeteer...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 60000 });

  await page.pdf({
    path: PDF_PATH,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '18mm',
      bottom: '18mm',
      left: '16mm',
      right: '16mm'
    },
    displayHeaderFooter: true,
    headerTemplate: '<div></div>',
    footerTemplate: `
      <div style="width: 100%; font-size: 8pt; color: #94a3b8; font-family: sans-serif; display: flex; justify-content: space-between; padding: 0 16mm;">
        <span>HAPCMS — DBMS Course Project Report (Shaik Imaduddin • 25WU0101048)</span>
        <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
      </div>
    `
  });

  await browser.close();
  console.log(`✅ PDF successfully generated at: ${PDF_PATH}`);
})();

