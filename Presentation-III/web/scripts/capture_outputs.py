#!/usr/bin/env python3
"""
HAPCMS — SQL Query Output Capture
Runs key queries and saves formatted output to submissions/outputs/query_outputs.txt
"""

import os
import sys
from pathlib import Path
from datetime import datetime

# ── Load env ──────────────────────────────────────────────────────────────────
ROOT = Path(__file__).parent.parent
sys.path.insert(0, str(ROOT))

from dotenv import load_dotenv
load_dotenv(ROOT / ".env")

import psycopg
from tabulate import tabulate

DATABASE_URL = os.getenv("DATABASE_URL")
OUT_FILE = ROOT / "submissions" / "outputs" / "query_outputs.txt"

# ── Queries ───────────────────────────────────────────────────────────────────
QUERIES = [
    {
        "title": "1. All Departments",
        "sql": "SELECT dept_id, name, location, phone FROM department ORDER BY name;"
    },
    {
        "title": "2. All Doctors with Specialisation",
        "sql": """SELECT d.doctor_id, d.first_name || ' ' || d.last_name AS doctor_name,
                         d.specialisation, dp.name AS department
                  FROM doctor d JOIN department dp ON d.dept_id = dp.dept_id
                  ORDER BY dp.name, d.specialisation;"""
    },
    {
        "title": "3. All Patients (Summary)",
        "sql": """SELECT patient_id, first_name || ' ' || last_name AS patient_name,
                         date_of_birth, gender, blood_group, phone
                  FROM patient ORDER BY last_name LIMIT 20;"""
    },
    {
        "title": "4. Appointments (Latest 20)",
        "sql": """SELECT a.appointment_id,
                         p.first_name || ' ' || p.last_name AS patient,
                         d.first_name || ' ' || d.last_name AS doctor,
                         a.appointment_date, a.appointment_time, a.status
                  FROM appointment a
                  JOIN patient p ON a.patient_id = p.patient_id
                  JOIN doctor d ON a.doctor_id = d.doctor_id
                  ORDER BY a.appointment_date DESC, a.appointment_time DESC
                  LIMIT 20;"""
    },
    {
        "title": "5. Ward & Bed Occupancy Report",
        "sql": """SELECT w.name AS ward_name, w.ward_type,
                         COUNT(b.bed_id) AS total_beds,
                         SUM(CASE WHEN b.status = 'OCCUPIED' THEN 1 ELSE 0 END) AS occupied,
                         SUM(CASE WHEN b.status = 'AVAILABLE' THEN 1 ELSE 0 END) AS available,
                         ROUND(100.0 * SUM(CASE WHEN b.status = 'OCCUPIED' THEN 1 ELSE 0 END)
                               / COUNT(b.bed_id), 1) AS occupancy_pct
                  FROM ward w JOIN bed b ON w.ward_id = b.ward_id
                  GROUP BY w.ward_id, w.name, w.ward_type
                  ORDER BY occupancy_pct DESC;"""
    },
    {
        "title": "6. Doctor Appointment Load",
        "sql": """SELECT d.first_name || ' ' || d.last_name AS doctor,
                         d.specialisation, dp.name AS department,
                         COUNT(a.appointment_id) AS total_appointments,
                         SUM(CASE WHEN a.status = 'COMPLETED' THEN 1 ELSE 0 END) AS completed,
                         SUM(CASE WHEN a.status = 'SCHEDULED' THEN 1 ELSE 0 END) AS scheduled
                  FROM doctor d
                  LEFT JOIN appointment a ON d.doctor_id = a.doctor_id
                  JOIN department dp ON d.dept_id = dp.dept_id
                  GROUP BY d.doctor_id, d.first_name, d.last_name, d.specialisation, dp.name
                  ORDER BY total_appointments DESC;"""
    },
    {
        "title": "7. Billing Summary (Latest 15 Bills)",
        "sql": """SELECT b.bill_id,
                         p.first_name || ' ' || p.last_name AS patient,
                         b.bill_date,
                         b.total_amount,
                         b.amount_paid,
                         b.total_amount - b.amount_paid AS balance_due,
                         b.status
                  FROM bill b JOIN patient p ON b.patient_id = p.patient_id
                  ORDER BY b.bill_date DESC LIMIT 15;"""
    },
    {
        "title": "8. Lab Test Orders & Results",
        "sql": """SELECT to2.order_id, lt.test_name, lt.category,
                         p.first_name || ' ' || p.last_name AS patient,
                         to2.ordered_date, to2.status, to2.result_value, lt.unit
                  FROM test_order to2
                  JOIN lab_test lt ON to2.test_id = lt.test_id
                  JOIN consultation c ON to2.consultation_id = c.consultation_id
                  JOIN appointment a ON c.appointment_id = a.appointment_id
                  JOIN patient p ON a.patient_id = p.patient_id
                  ORDER BY to2.ordered_date DESC LIMIT 20;"""
    },
    {
        "title": "9. Constraint Test — No Duplicate Bookings (should return 0 rows)",
        "sql": """SELECT doctor_id, appointment_date, appointment_time, COUNT(*) AS duplicates
                  FROM appointment
                  GROUP BY doctor_id, appointment_date, appointment_time
                  HAVING COUNT(*) > 1;"""
    },
    {
        "title": "10. Table Row Counts (All 16 Tables)",
        "sql": """SELECT 'department'     AS table_name, COUNT(*) AS row_count FROM department    UNION ALL
                  SELECT 'doctor',                       COUNT(*) FROM doctor         UNION ALL
                  SELECT 'doctor_schedule',              COUNT(*) FROM doctor_schedule UNION ALL
                  SELECT 'patient',                      COUNT(*) FROM patient         UNION ALL
                  SELECT 'appointment',                  COUNT(*) FROM appointment     UNION ALL
                  SELECT 'consultation',                 COUNT(*) FROM consultation    UNION ALL
                  SELECT 'diagnosis',                    COUNT(*) FROM diagnosis       UNION ALL
                  SELECT 'prescription',                 COUNT(*) FROM prescription    UNION ALL
                  SELECT 'prescription_item',            COUNT(*) FROM prescription_item UNION ALL
                  SELECT 'lab_test',                     COUNT(*) FROM lab_test        UNION ALL
                  SELECT 'test_order',                   COUNT(*) FROM test_order      UNION ALL
                  SELECT 'ward',                         COUNT(*) FROM ward            UNION ALL
                  SELECT 'bed',                          COUNT(*) FROM bed             UNION ALL
                  SELECT 'admission',                    COUNT(*) FROM admission       UNION ALL
                  SELECT 'bill',                         COUNT(*) FROM bill            UNION ALL
                  SELECT 'payment',                      COUNT(*) FROM payment
                  ORDER BY row_count DESC;"""
    },
]


def main():
    print("\n📊  Capturing SQL Query Outputs...\n")

    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with psycopg.connect(DATABASE_URL) as conn:
        lines = []
        header = (
            "HAPCMS — SQL Query Outputs\n"
            "Hospital Appointment & Patient Care Management System\n"
            f"Generated : {datetime.now().strftime('%d %B %Y, %I:%M %p')} IST\n"
            "Database  : PostgreSQL 16 (Neon Cloud)\n"
            "=" * 80 + "\n"
        )
        lines.append(header)

        for q in QUERIES:
            print(f"  Running: {q['title']}")
            lines.append(f"\n{'=' * 80}")
            lines.append(f"QUERY {q['title']}")
            lines.append("=" * 80)
            lines.append(f"\nSQL:\n{q['sql'].strip()}\n")
            lines.append("RESULT:")

            try:
                with conn.cursor() as cur:
                    cur.execute(q["sql"])
                    rows = cur.fetchall()
                    col_names = [desc[0] for desc in cur.description]

                    if rows:
                        table = tabulate(rows, headers=col_names, tablefmt="grid")
                        lines.append(table)
                        lines.append(f"  ({len(rows)} row{'s' if len(rows) != 1 else ''})")
                    else:
                        lines.append("  (no rows returned — constraint is working correctly)")
            except Exception as e:
                lines.append(f"  ERROR: {e}")

        lines.append(f"\n{'=' * 80}\nEnd of Query Outputs\n")

        OUT_FILE.write_text("\n".join(lines), encoding="utf-8")

    print(f"\n✅ Saved: submissions/outputs/query_outputs.txt\n")


if __name__ == "__main__":
    main()
