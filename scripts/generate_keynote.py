#!/usr/bin/env python3
"""
Generate Native Apple Keynote Presentation (.key) and PDF (.pdf) for HAPCMS DBMS Project.
Focus: Problem Statement and Our Approach to Fix It (5 Focused Slides).
"""

import os
import subprocess
import sys
import tempfile
from pathlib import Path

# Target Paths
WORKSPACE_DIR = Path(__file__).resolve().parent.parent
OUTPUT_KEY = WORKSPACE_DIR / "HAPCMS_Problem_Approach_Presentation.key"
OUTPUT_PDF = WORKSPACE_DIR / "HAPCMS_Problem_Approach_Presentation.pdf"

# 5 Focused Slides Data
SLIDES_DATA = [
    # Slide 1: Title Slide
    {
        "layout": "Title",
        "title": "Hospital Appointment & Patient Care Management System",
        "body": "Problem Statement & Architectural Approach\nDBMS Project Milestone — Review 1\nDatabase Platform: PostgreSQL 16 on Neon Cloud",
        "notes": (
            "Good morning Professor. Today we present our DBMS project: the Hospital Appointment and "
            "Patient Care Management System (HAPCMS). This initial presentation focuses on two core pillars: "
            "first, the acute operational problems plaguing conventional healthcare facilities, and second, "
            "our architectural approach to solving them through a normalized relational database engine."
        ),
    },
    # Slide 2: Problem Statement
    {
        "layout": "Title & Bullets",
        "title": "The Problem: Structural Breakdowns in Healthcare Operations",
        "body": (
            "• Schedule Collisions & Doctor Double-Booking:\n"
            "    - Front desks frequently book overlapping patients into the same consultation slot, leading to long waiting queues and doctor burnout.\n"
            "• Fragmented & Inaccessible Patient Records:\n"
            "    - Clinical history, past diagnoses, lab reports, and medications are stored across disconnected paper slips, preventing a unified longitudinal chart at point-of-care.\n"
            "• Inpatient Bed Allocation Bottlenecks:\n"
            "    - Lack of real-time bed state tracking results in double-allocation of ward beds, admission delays, and unrecorded vacancies.\n"
            "• Uncoordinated Clinical Orders & Revenue Leakage:\n"
            "    - Lab tests and prescriptions are unlinked from billing ledgers, causing untracked dispensing and severe financial leakage."
        ),
        "notes": (
            "Our problem identification reveals that healthcare operational failures are fundamentally database failures. "
            "First, without concurrency controls, doctors get double-booked for the exact same time slot.\n"
            "Second, patient records are deeply fragmented: when a patient sits with a cardiologist, the doctor cannot readily see "
            "past prescriptions or lab tests ordered by other departments.\n"
            "Third, inpatient bed occupancy lacks real-time state tracking, causing admission bottlenecks.\n"
            "And fourth, diagnostic tests and pharmacy items are billed on disconnected slips, creating massive revenue leakage."
        ),
    },
    # Slide 3: Root Cause Analysis
    {
        "layout": "Title & Bullets",
        "title": "Why Existing Systems Fail: Root Cause Analysis",
        "body": (
            "• Absence of Database-Level Concurrency & Integrity Enforcement:\n"
            "    - Legacy systems rely on manual checks or fragile client-side scripts rather than database ACID constraints.\n"
            "• Unnormalized Data Architecture (Anomalies & Redundancy):\n"
            "    - Multi-valued fields (e.g., comma-separated drug lists) violate 1NF, while transitive dependencies create update and deletion anomalies.\n"
            "• Disconnected Departmental Silos:\n"
            "    - Front-desk scheduling, clinical consultations, pathology labs, and billing operate on isolated tables or paper records.\n"
            "• Vulnerability to Invalid Data:\n"
            "    - Negative invoices, overlapping bed occupancies, and invalid physiological bounds are accepted without engine-level rejection."
        ),
        "notes": (
            "When examining the root cause, legacy hospital management systems fail because they push data validation to the front-end "
            "instead of enforcing it at the database storage engine level.\n"
            "Unnormalized schemas cause update anomalies — for instance, if a department moves floors, dozens of doctor records become inconsistent.\n"
            "Crucially, without ACID transactions and composite UNIQUE constraints, two receptionists can simultaneously book the same doctor slot, "
            "corrupting the schedule before any software warning is triggered."
        ),
    },
    # Slide 4: Our Approach
    {
        "layout": "Title & Bullets",
        "title": "Our Approach: Unified Relational Architecture (PostgreSQL & 3NF)",
        "body": (
            "• Centralized Relational Schema (16 Normalized Entities in 6 Clusters):\n"
            "    - Provider Roster | Patient Appointments | Clinical Care & EMR | Diagnostics | Inpatient Wards | Financials & Billing\n"
            "• Strict Third Normal Form (3NF) Normalization:\n"
            "    - 1NF: Atomic line items (prescription_item) eliminate multi-valued repeating groups.\n"
            "    - 2NF & 3NF: Single surrogate keys and isolated lookup tables eliminate partial and transitive functional dependencies.\n"
            "• Engine-Level Defensive Constraints (Active Database Protection):\n"
            "    - UNIQUE(doctor_id, date, time) mathematically prevents appointment double-booking.\n"
            "    - Real-time Bed State Machine (AVAILABLE, OCCUPIED, MAINTENANCE) prevents double-occupancy.\n"
            "    - Domain CHECK bounds enforce positive balances, chronological stay validity, and valid patient vitals."
        ),
        "notes": (
            "Our approach solves these problems at the foundational relational layer. We engineered a centralized schema on PostgreSQL 16 "
            "comprising 16 normalized tables organized into 6 cohesive operational clusters.\n"
            "We normalized the schema strictly to 3NF, decomposing prescriptions into atomic line items and isolating department and ward metadata "
            "to eliminate transitive dependencies.\n"
            "Most importantly, the database engine enforces business integrity directly: composite UNIQUE constraints prevent double-booking, "
            "bed state transitions protect ward capacity, and domain CHECK constraints reject negative balances and corrupted vital records."
        ),
    },
    # Slide 5: Strategic Outcomes
    {
        "layout": "Title & Bullets",
        "title": "Strategic Outcomes: Measurable Operational Impact",
        "body": (
            "• Zero-Collision Scheduling:\n"
            "    - 100% elimination of double-booked consultation slots via engine-enforced uniqueness.\n"
            "• Point-of-Care Longitudinal EMR:\n"
            "    - Clinicians access unified consultation notes, ICD-10 diagnoses, prescribed drugs, and lab results via indexed multi-table joins.\n"
            "• Real-Time Inpatient Bed Visibility:\n"
            "    - Instant bed occupancy percentages across ICU, Semi-Private, and General wards with exclusive occupancy guarantees.\n"
            "• Closed-Loop Financial Reconciliation:\n"
            "    - Itemized bills aggregate consultation, lab investigations, and bed per-diem charges into a single ledger with complete multi-tender audit trails.\n"
            "• Review 1 Foundation:\n"
            "    - Complete conceptual ERD, production PostgreSQL DDL, and realistic seed data ready for Review 2 (Triggers & Views)."
        ),
        "notes": (
            "To summarize our strategic impact: by solving these operational challenges at the database engine level, we guarantee zero-collision "
            "appointment booking, provide doctors with a unified longitudinal medical chart, give bed managers real-time occupancy visibility, "
            "and eliminate hospital revenue leakage with consolidated billing ledgers.\n"
            "Our relational foundation is fully deployed on PostgreSQL 16 on Neon Cloud, verified with integrity tests, and ready for Review 2. "
            "Thank you Professor, and we are ready for your questions."
        ),
    },
]


def escape_applescript(text: str) -> str:
    """Escape text for AppleScript string literal."""
    escaped = text.replace("\\", "\\\\").replace('"', '\\"')
    lines = escaped.split("\n")
    quoted_lines = [f'"{line}"' for line in lines]
    return " & linefeed & ".join(quoted_lines)


def build_applescript() -> str:
    """Generate the AppleScript commands to construct the Keynote presentation."""
    lines = [
        'tell application "Keynote"',
        "    activate",
        '    set d to make new document with properties {document theme:theme "Minimalist Dark"}',
        "    tell d",
    ]

    for idx, slide in enumerate(SLIDES_DATA):
        escaped_title = escape_applescript(slide["title"])
        escaped_body = escape_applescript(slide["body"])
        escaped_notes = escape_applescript(slide["notes"])

        if idx == 0:
            lines.append("        -- Slide 1: Title Slide")
            lines.append("        set s to first slide")
            lines.append(f"        set object text of default title item of s to {escaped_title}")
            lines.append(f"        set object text of default body item of s to {escaped_body}")
            lines.append(f"        set presenter notes of s to {escaped_notes}")
        else:
            lines.append(f"        -- Slide {idx + 1}: {slide['title']}")
            lines.append(
                '        set s to make new slide with properties {base layout:slide layout "Title & Bullets"}'
            )
            lines.append(f"        set object text of default title item of s to {escaped_title}")
            lines.append(f"        set object text of default body item of s to {escaped_body}")
            lines.append(f"        set presenter notes of s to {escaped_notes}")

    key_posix = str(OUTPUT_KEY)
    pdf_posix = str(OUTPUT_PDF)

    lines.extend(
        [
            "    end tell",
            f'    set keyPath to POSIX file "{key_posix}"',
            f'    set pdfPath to POSIX file "{pdf_posix}"',
            "    save d in keyPath",
            "    export d to pdfPath as PDF",
            "    close d saving yes",
            '    return "SUCCESS"',
            "end tell",
        ]
    )

    return "\n".join(lines)


def main():
    print(f"Generating Apple Keynote presentation for HAPCMS ({len(SLIDES_DATA)} slides)...")
    print(f"Focus: Problem Statement & Proposed Approach")
    script_content = build_applescript()

    with tempfile.NamedTemporaryFile("w", suffix=".applescript", delete=False) as f:
        f.write(script_content)
        temp_script_path = f.name

    try:
        print("Executing AppleScript via osascript...")
        result = subprocess.run(
            ["osascript", temp_script_path],
            capture_output=True,
            text=True,
            check=True,
        )
        print("AppleScript execution output:", result.stdout.strip())
    except subprocess.CalledProcessError as e:
        print("Error executing AppleScript:", file=sys.stderr)
        print("STDOUT:", e.stdout, file=sys.stderr)
        print("STDERR:", e.stderr, file=sys.stderr)
        sys.exit(1)
    finally:
        if os.path.exists(temp_script_path):
            os.remove(temp_script_path)

    # Verify outputs
    if OUTPUT_KEY.exists():
        key_size = OUTPUT_KEY.stat().st_size
        print(f"✅ Generated Keynote file: {OUTPUT_KEY} ({key_size / 1024:.1f} KB)")
    else:
        print(f"❌ Keynote file not found at {OUTPUT_KEY}", file=sys.stderr)
        sys.exit(1)

    if OUTPUT_PDF.exists():
        pdf_size = OUTPUT_PDF.stat().st_size
        print(f"✅ Generated PDF file: {OUTPUT_PDF} ({pdf_size / 1024:.1f} KB)")
    else:
        print(f"❌ PDF file not found at {OUTPUT_PDF}", file=sys.stderr)
        sys.exit(1)

    print("\n🎉 Presentation generated successfully!")
    print(f"👉 Open Keynote: open '{OUTPUT_KEY}'")
    print(f"👉 Open PDF: open '{OUTPUT_PDF}'")


if __name__ == "__main__":
    main()
