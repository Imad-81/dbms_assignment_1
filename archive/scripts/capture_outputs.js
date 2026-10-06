/**
 * Capture SQL query outputs for the submissions/outputs folder.
 * Runs key queries from 03_test_queries.sql and saves results.
 */

const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const OUT_FILE = path.join(__dirname, '..', 'submissions', 'outputs', 'query_outputs.txt');

// Key queries to demonstrate
const QUERIES = [
  {
    title: '1. All Departments',
    sql: `SELECT dept_id, name, location, phone FROM department ORDER BY name;`,
  },
  {
    title: '2. All Doctors with Specialisation',
    sql: `SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS doctor_name,
                 d.specialisation, dp.name AS department
          FROM doctor d JOIN department dp ON d.dept_id = dp.dept_id
          ORDER BY dp.name, d.specialisation;`,
  },
  {
    title: '3. All Patients',
    sql: `SELECT patient_id, first_name || ' ' || last_name AS patient_name,
                 date_of_birth, gender, blood_group, phone
          FROM patient ORDER BY last_name;`,
  },
  {
    title: '4. Upcoming Appointments',
    sql: `SELECT a.appointment_id, p.first_name || ' ' || p.last_name AS patient,
                 d.first_name || ' ' || d.last_name AS doctor,
                 a.appointment_date, a.appointment_time, a.status
          FROM appointment a
          JOIN patient p ON a.patient_id = p.patient_id
          JOIN doctor d ON a.doctor_id = d.doctor_id
          ORDER BY a.appointment_date, a.appointment_time
          LIMIT 20;`,
  },
  {
    title: '5. Ward & Bed Occupancy',
    sql: `SELECT w.name AS ward_name, w.ward_type,
                 COUNT(b.bed_id) AS total_beds,
                 SUM(CASE WHEN b.status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied,
                 SUM(CASE WHEN b.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available,
                 ROUND(100.0 * SUM(CASE WHEN b.status = 'OCCUPIED' THEN 1 ELSE 0 END) / COUNT(b.bed_id), 1) AS occupancy_pct
          FROM ward w JOIN bed b ON w.ward_id = b.ward_id
          GROUP BY w.ward_id, w.name, w.ward_type
          ORDER BY occupancy_pct DESC;`,
  },
  {
    title: '6. Billing Summary',
    sql: `SELECT b.bill_id, p.first_name || ' ' || p.last_name AS patient,
                 b.bill_date, b.total_amount, b.amount_paid,
                 b.total_amount - b.amount_paid AS balance_due, b.status
          FROM bill b JOIN patient p ON b.patient_id = p.patient_id
          ORDER BY b.bill_date DESC LIMIT 15;`,
  },
  {
    title: '7. Doctor Appointment Load',
    sql: `SELECT d.first_name || ' ' || d.last_name AS doctor,
                 d.specialisation, dp.name AS department,
                 COUNT(a.appointment_id) AS total_appointments,
                 SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
                 SUM(CASE WHEN a.status = 'SCHEDULED' THEN 1 ELSE 0 END) AS scheduled
          FROM doctor d
          LEFT JOIN appointment a ON d.doctor_id = a.doctor_id
          JOIN department dp ON d.dept_id = dp.dept_id
          GROUP BY d.doctor_id, d.first_name, d.last_name, d.specialisation, dp.name
          ORDER BY total_appointments DESC;`,
  },
  {
    title: '8. Constraint Test — Duplicate Booking Prevention (should FAIL)',
    sql: `SELECT 'TESTING: If any 2 appointments share same doctor+date+time, constraint is violated:' AS test;
          SELECT doctor_id, appointment_date, appointment_time, COUNT(*) AS duplicates
          FROM appointment
          GROUP BY doctor_id, appointment_date, appointment_time
          HAVING COUNT(*) > 1;`,
  },
];

function formatTable(rows, fields) {
  if (!rows || rows.length === 0) return '  (no rows returned)\n';

  const cols = fields.map(f => f.name);
  const widths = cols.map(c =>
    Math.max(c.length, ...rows.map(r => String(r[c] ?? '').length))
  );

  const sep = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';
  const header = '| ' + cols.map((c, i) => c.padEnd(widths[i])).join(' | ') + ' |';
  const dataRows = rows.map(r =>
    '| ' + cols.map((c, i) => String(r[c] ?? '').padEnd(widths[i])).join(' | ') + ' |'
  );

  return [sep, header, sep, ...dataRows, sep, `  (${rows.length} row${rows.length !== 1 ? 's' : ''})`].join('\n') + '\n';
}

(async () => {
  console.log('\n📊 Capturing SQL Query Outputs...\n');

  const client = new Client({ connectionString: process.env.DATABASE_URL });
  await client.connect();

  let output = `HAPCMS — SQL Query Outputs
Hospital Appointment & Patient Care Management System
Generated: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
Database: PostgreSQL 16 (Neon Cloud)
${'='.repeat(80)}

`;

  for (const q of QUERIES) {
    console.log(`  Running: ${q.title}`);
    output += `\n${'='.repeat(80)}\n`;
    output += `QUERY ${q.title}\n`;
    output += `${'='.repeat(80)}\n\n`;
    output += `SQL:\n${q.sql}\n\n`;
    output += `RESULT:\n`;

    try {
      const res = await client.query(q.sql);
      output += formatTable(res.rows, res.fields);
    } catch (err) {
      output += `  ERROR: ${err.message}\n`;
    }
  }

  output += `\n${'='.repeat(80)}\nEnd of Query Outputs\n`;

  await client.end();

  fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
  fs.writeFileSync(OUT_FILE, output, 'utf8');
  console.log(`\n✅ Query outputs saved: submissions/outputs/query_outputs.txt\n`);
})();
