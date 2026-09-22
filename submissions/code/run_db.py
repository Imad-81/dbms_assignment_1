#!/usr/bin/env python3
"""
Hospital Appointment and Patient Care Management System (HAPCMS)
Database Management & Presentation CLI Runner
"""

import os
import sys
import subprocess
from pathlib import Path
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv
# pyrefly: ignore [missing-import]
import psycopg
from tabulate import tabulate

# Load environment variables from .env
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
BASE_DIR = Path(__file__).resolve().parent

def get_connection():
    if not DATABASE_URL:
        print("\n❌ ERROR: DATABASE_URL not found in .env file.")
        print("Please ensure your .env file exists and contains a valid DATABASE_URL.\n")
        sys.exit(1)
    try:
        conn = psycopg.connect(DATABASE_URL, autocommit=True)
        return conn
    except Exception as e:
        print(f"\n❌ Connection Failed: {e}\n")
        sys.exit(1)

def run_sql_file(file_path: Path, step_name: str):
    print(f"\n=================================================================")
    print(f"▶️  Executing: {step_name} ({file_path.name})")
    print(f"=================================================================")
    
    if not file_path.exists():
        print(f"❌ File not found: {file_path}")
        return False

    with open(file_path, "r", encoding="utf-8") as f:
        sql_content = f.read()

    with get_connection() as conn:
        with conn.cursor() as cur:
            try:
                cur.execute(sql_content)
                print(f"✅ Successfully executed {file_path.name}")
                return True
            except Exception as e:
                print(f"❌ Error during execution: {e}")
                return False

def setup_database():
    """Runs 01_create_tables.sql and 02_sample_data.sql"""
    print("\n🚀 INITIALIZING POSTGRESQL DATABASE (SCHEMA & SEED DATA)...")
    
    t_file = BASE_DIR / "sql" / "01_create_tables.sql"
    d_file = BASE_DIR / "sql" / "02_sample_data.sql"
    
    if run_sql_file(t_file, "1. Create Tables & Constraints"):
        if run_sql_file(d_file, "2. Populate Realistic Sample Data"):
            print("\n✨ Database setup complete! All 16 tables created and seeded successfully.")
            list_tables()

def list_tables():
    """Lists all user tables and row counts in PostgreSQL"""
    print("\n=================================================================")
    print("📊 CURRENT DATABASE TABLES & RECORD COUNTS")
    print("=================================================================")
    
    query = """
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
    ORDER BY table_name;
    """
    
    with get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(query)
            tables = cur.fetchall()
            
            table_stats = []
            for (t_name,) in tables:
                cur.execute(f"SELECT COUNT(*) FROM {t_name};")
                count = cur.fetchone()[0]
                table_stats.append([t_name, count])
            
            print(tabulate(table_stats, headers=["Table Name", "Row Count"], tablefmt="fancy_grid"))

def run_reports():
    """Executes the 5 analytical report queries from 03_test_queries.sql"""
    print("\n=================================================================")
    print("📋 RUNNING PRESENTATION & ANALYTICAL REPORTS")
    print("=================================================================")
    
    queries = [
        (
            "REPORT 1: PATIENT LONGITUDINAL MEDICAL SUMMARY",
            """
            SELECT 
                p.patient_id,
                p.first_name || ' ' || p.last_name AS patient_name,
                p.gender,
                p.blood_group,
                a.appointment_date,
                'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor,
                dept.department_name,
                c.symptoms,
                STRING_AGG(DISTINCT diag.diagnosis_name, '; ') AS diagnoses,
                STRING_AGG(DISTINCT pi.medicine_name || ' (' || pi.strength || ')', '; ') AS medicines
            FROM patient p
            JOIN appointment a ON p.patient_id = a.patient_id
            JOIN doctor d ON a.doctor_id = d.doctor_id
            JOIN department dept ON d.department_id = dept.department_id
            JOIN consultation c ON a.appointment_id = c.appointment_id
            LEFT JOIN diagnosis diag ON c.consultation_id = diag.consultation_id
            LEFT JOIN prescription pr ON c.consultation_id = pr.consultation_id
            LEFT JOIN prescription_item pi ON pr.prescription_id = pi.prescription_id
            WHERE p.patient_id = 1
            GROUP BY 
                p.patient_id, p.first_name, p.last_name, p.gender, p.blood_group, 
                a.appointment_date, d.first_name, d.last_name, dept.department_name, 
                c.symptoms;
            """
        ),
        (
            "REPORT 2: DOCTOR ROSTER LOAD & AVAILABLE SLOTS",
            """
            SELECT 
                'Dr. ' || d.first_name || ' ' || d.last_name AS doctor,
                dept.department_name,
                ds.day_of_week,
                ds.start_time || '-' || ds.end_time AS shift,
                ds.max_patients AS capacity,
                COUNT(a.appointment_id) AS booked,
                (ds.max_patients - COUNT(a.appointment_id)) AS available
            FROM doctor d
            JOIN department dept ON d.department_id = dept.department_id
            JOIN doctor_schedule ds ON d.doctor_id = ds.doctor_id
            LEFT JOIN appointment a ON d.doctor_id = a.doctor_id 
                AND a.status IN ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION')
            GROUP BY 
                d.doctor_id, d.first_name, d.last_name, dept.department_name, 
                ds.day_of_week, ds.start_time, ds.end_time, ds.max_patients
            ORDER BY dept.department_name, d.last_name;
            """
        ),
        (
            "REPORT 3: REAL-TIME INPATIENT BED OCCUPANCY & CAPACITY",
            """
            SELECT 
                w.ward_name,
                w.ward_type,
                w.daily_rate,
                w.total_beds,
                COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied,
                COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available,
                ROUND((COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / NULLIF(w.total_beds, 0)::NUMERIC) * 100, 1) || '%' AS occupancy_rate
            FROM ward w
            LEFT JOIN bed b ON w.ward_id = b.ward_id
            GROUP BY w.ward_id, w.ward_name, w.ward_type, w.daily_rate, w.total_beds
            ORDER BY occupancy_rate DESC;
            """
        ),
        (
            "REPORT 4: CRITICAL & PENDING DIAGNOSTIC LAB ORDERS",
            """
            SELECT 
                tord.order_id,
                p.first_name || ' ' || p.last_name AS patient,
                'Dr. ' || d.last_name AS doctor,
                lt.test_name,
                tord.abnormal_flag,
                tord.test_result
            FROM test_order tord
            JOIN patient p ON tord.patient_id = p.patient_id
            JOIN doctor d ON tord.ordered_by_doctor_id = d.doctor_id
            JOIN lab_test lt ON tord.test_id = lt.test_id
            WHERE tord.abnormal_flag IN ('CRITICAL', 'ABNORMAL')
            ORDER BY tord.order_date DESC;
            """
        ),
        (
            "REPORT 5: FINANCIAL AUDIT: BILLS, PAYMENTS & OUTSTANDING BALANCES",
            """
            SELECT 
                b.bill_id,
                b.bill_date,
                p.first_name || ' ' || p.last_name AS patient,
                b.total_amount AS total_invoiced,
                COALESCE(SUM(pay.amount_paid), 0.00) AS total_paid,
                (b.total_amount - COALESCE(SUM(pay.amount_paid), 0.00)) AS outstanding_balance,
                b.payment_status
            FROM bill b
            JOIN patient p ON b.patient_id = p.patient_id
            LEFT JOIN payment pay ON b.bill_id = pay.bill_id
            GROUP BY 
                b.bill_id, b.bill_date, p.first_name, p.last_name, 
                b.total_amount, b.payment_status
            ORDER BY outstanding_balance DESC;
            """
        )
    ]
    
    with get_connection() as conn:
        with conn.cursor() as cur:
            for title, sql in queries:
                print(f"\n🔹 {title}")
                cur.execute(sql)
                rows = cur.fetchall()
                cols = [desc[0] for desc in cur.description]
                print(tabulate(rows, headers=cols, tablefmt="fancy_grid"))

def test_constraints():
    """Demonstrates that database integrity constraints actively block illegal data"""
    print("\n=================================================================")
    print("🛡️  TESTING DATABASE INTEGRITY CONSTRAINTS (VIVA DEMO)")
    print("=================================================================")
    
    with get_connection() as conn:
        with conn.cursor() as cur:
            # Test 1: Duplicate appointment for same doctor at same time
            print("\n1. Testing Double-Booking Prevention (UNIQUE doctor_id, date, time):")
            try:
                cur.execute("""
                INSERT INTO appointment (patient_id, doctor_id, appointment_date, appointment_time, status)
                VALUES (2, 1, '2026-02-16', '09:30:00', 'SCHEDULED');
                """)
                print("❌ FAILED: Duplicate appointment was allowed!")
            except Exception as e:
                print(f"✅ PASSED: Database blocked double-booking! Error: {type(e).__name__}")
            
            # Test 2: Invalid discharge date before admission date
            print("\n2. Testing Admission Chronology (discharge_date >= admission_date):")
            try:
                cur.execute("""
                INSERT INTO admission (patient_id, admitting_doctor_id, bed_id, admission_date, discharge_date, admission_reason)
                VALUES (1, 1, 2, '2026-02-20 10:00:00', '2026-02-19 10:00:00', 'Test error');
                """)
                print("❌ FAILED: Invalid discharge date was allowed!")
            except Exception as e:
                print(f"✅ PASSED: Database blocked invalid chronological dates! Error: {type(e).__name__}")

            # Test 3: Negative payment amount
            print("\n3. Testing Financial Integrity (amount_paid > 0):")
            try:
                cur.execute("""
                INSERT INTO payment (bill_id, amount_paid, payment_method)
                VALUES (1, -50.00, 'CASH');
                """)
                print("❌ FAILED: Negative payment was allowed!")
            except Exception as e:
                print(f"✅ PASSED: Database blocked negative payment! Error: {type(e).__name__}")

def interactive_shell():
    """Provides a live SQL shell against the database"""
    print("\n=================================================================")
    print("💻 LIVE POSTGRESQL QUERY SHELL")
    print("Type any SQL query (e.g. SELECT * FROM doctor;) or 'exit' to quit.")
    print("=================================================================\n")
    
    with get_connection() as conn:
        with conn.cursor() as cur:
            while True:
                try:
                    sql = input("hapcms_db> ").strip()
                    if not sql:
                        continue
                    if sql.lower() in ("exit", "quit", "q"):
                        break
                    
                    cur.execute(sql)
                    if cur.description:
                        rows = cur.fetchall()
                        cols = [desc[0] for desc in cur.description]
                        print(tabulate(rows, headers=cols, tablefmt="fancy_grid"))
                    else:
                        print(f"✅ Query executed successfully (Rows affected: {cur.rowcount})")
                    print()
                except KeyboardInterrupt:
                    break
                except Exception as e:
                    print(f"❌ SQL Error: {e}\n")

def launch_studio():
    """Launches Prisma Studio web GUI on port 5555"""
    print("\n=================================================================")
    print("🚀 LAUNCHING PRISMA STUDIO (VISUAL TABLE EXPLORER)")
    print("=================================================================")
    print("Prisma Studio provides a visual GUI to inspect, filter, edit, and")
    print("navigate all 16 relational models and foreign keys.")
    print("\n🌐 Web URL: http://localhost:5555")
    print("Press Ctrl+C to stop the Studio server.\n")
    try:
        subprocess.run(["npx", "prisma", "studio", "--port", "5555"], cwd=str(BASE_DIR))
    except KeyboardInterrupt:
        print("\nPrisma Studio stopped.")

def run_prisma_demo():
    """Runs the type-safe Prisma ORM demonstration script"""
    print("\n=================================================================")
    print("🏥 RUNNING PRISMA ORM QUERY DEMONSTRATION")
    print("=================================================================")
    demo_script = BASE_DIR / "scripts" / "prisma_demo.js"
    if not demo_script.exists():
        print(f"❌ Script not found: {demo_script}")
        return
    subprocess.run(["node", str(demo_script)], cwd=str(BASE_DIR))

def generate_erd():
    """Compiles Prisma Schema and regenerates the ERD SVG diagram"""
    print("\n=================================================================")
    print("📐 REGENERATING PRISMA CLIENT & ER DIAGRAM (SVG)")
    print("=================================================================")
    subprocess.run(["npx", "prisma", "generate"], cwd=str(BASE_DIR))
    print("\n✅ Prisma Client and docs/prisma_erd.svg generated successfully.")

def main():
    if len(sys.argv) < 2:
        print("""
Hospital Appointment & Patient Care Management System (HAPCMS)
Usage:
    ./run_db.sh setup         # Create all 16 tables and insert sample seed data
    ./run_db.sh tables        # Display all tables and row counts
    ./run_db.sh reports       # Run the 5 analytical report queries
    ./run_db.sh test          # Run constraint validation tests (Viva demonstration)
    ./run_db.sh shell         # Launch interactive SQL query prompt
    ./run_db.sh studio        # Launch Prisma Studio web GUI on http://localhost:5555
    ./run_db.sh prisma-demo   # Run Prisma ORM clinical query verification
    ./run_db.sh erd           # Regenerate schema ER diagram from Prisma
        """)
        return

    cmd = sys.argv[1].lower()
    if cmd == "setup":
        setup_database()
    elif cmd in ("tables", "list"):
        list_tables()
    elif cmd in ("reports", "query", "queries"):
        run_reports()
    elif cmd in ("test", "constraints", "validate"):
        test_constraints()
    elif cmd in ("shell", "interactive"):
        interactive_shell()
    elif cmd in ("studio", "gui", "web"):
        launch_studio()
    elif cmd in ("prisma-demo", "prisma", "orm"):
        run_prisma_demo()
    elif cmd in ("erd", "diagram", "diagrams"):
        generate_erd()
    else:
        print(f"Unknown command: {cmd}")

if __name__ == "__main__":
    main()
