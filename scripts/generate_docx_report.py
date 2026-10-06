#!/usr/bin/env python3
"""
Generate HAPCMS Project Report in DOCX format matching hansith.pdf style.
Features:
- Completely editable front page with Woxsen University logo and student metadata.
- Clean typography: Calibri / Cambria matching Carlito / Caladea from hansith.pdf.
- University-styled headings: #365F91 for Heading 1, #4F81BD for Heading 2, #1F497D for Heading 3.
- Tables styled with soft blue headers (#D9EAF7), subtle borders, cantSplit, tblHeader.
- Compact schema table formatting matching hansith.pdf density.
- High-resolution ER diagram and application screenshots with centered figure captions.
- Formatted SQL code blocks and tabular query outputs.
- Test cases and results matrix.
"""

import os
import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import parse_xml, OxmlElement
from docx.oxml.ns import nsdecls, qn

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
REPORT_DIR = os.path.join(BASE_DIR, 'Project-Report')
ASSETS_DIR = os.path.join(REPORT_DIR, 'assets')
SCREENSHOTS_DIR = os.path.join(REPORT_DIR, 'screenshots')
OUTPUT_DOCX = os.path.join(REPORT_DIR, 'HAPCMS_Project_Report.docx')

LOGO_PATH = os.path.join(ASSETS_DIR, 'woxsen_logo.png')
ERD_PATH = os.path.join(ASSETS_DIR, 'prisma_erd.png')

# Color palette matching hansith.pdf
COLOR_H1 = RGBColor(54, 95, 145)   # #365F91
COLOR_H2 = RGBColor(79, 129, 189)  # #4F81BD
COLOR_H3 = RGBColor(31, 73, 125)   # #1F497D
COLOR_BODY = RGBColor(17, 24, 39)  # #111827
COLOR_MUTED = RGBColor(100, 116, 139) # #64748B
HEX_TH_BG = "D9EAF7"               # Soft blue table header from hansith.pdf
HEX_BORDER = "B0C4DE"              # Subtle table border
HEX_CODE_BG = "F8FAFC"             # Very light slate for code block

def set_cell_background(cell, fill_hex):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=60, bottom=60, left=100, right=100):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = parse_xml(f'''
        <w:tcMar {nsdecls("w")}>
            <w:top w:w="{top}" w:type="dxa"/>
            <w:bottom w:w="{bottom}" w:type="dxa"/>
            <w:left w:w="{left}" w:type="dxa"/>
            <w:right w:w="{right}" w:type="dxa"/>
        </w:tcMar>
    ''')
    tcPr.append(tcMar)

def set_table_styling(table, col_widths=None, border_color=HEX_BORDER, is_compact=False):
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    tblPr = table._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
            <w:left w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
            <w:insideH w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
            <w:insideV w:val="single" w:sz="4" w:space="0" w:color="{border_color}"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)

    top_pad = 50 if is_compact else 90
    bot_pad = 50 if is_compact else 90
    lr_pad = 80 if is_compact else 120

    # Format rows
    for i, row in enumerate(table.rows):
        trPr = row._tr.get_or_add_trPr()
        trPr.append(parse_xml(f'<w:cantSplit {nsdecls("w")}/>'))
        if i == 0:
            trPr.append(parse_xml(f'<w:tblHeader {nsdecls("w")}/>'))
            for cell in row.cells:
                set_cell_background(cell, HEX_TH_BG)
                set_cell_margins(cell, top=top_pad + 20, bottom=bot_pad + 20, left=lr_pad, right=lr_pad)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                    p.paragraph_format.line_spacing = 1.0
        else:
            for cell in row.cells:
                set_cell_margins(cell, top=top_pad, bottom=bot_pad, left=lr_pad, right=lr_pad)
                for p in cell.paragraphs:
                    p.paragraph_format.space_before = Pt(0)
                    p.paragraph_format.space_after = Pt(0)
                    p.paragraph_format.line_spacing = 1.0

        if col_widths:
            for j, cell in enumerate(row.cells):
                if j < len(col_widths):
                    cell.width = col_widths[j]

def add_heading_1(doc, text, page_break_before=False):
    if page_break_before:
        doc.add_page_break()
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(4)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(16)
    run.font.bold = True
    run.font.color.rgb = COLOR_H1
    return h

def add_heading_2(doc, text):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(10)
    h.paragraph_format.space_after = Pt(3)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(13)
    run.font.bold = True
    run.font.color.rgb = COLOR_H2
    return h

def add_heading_3(doc, text, is_compact=False):
    h = doc.add_paragraph()
    h.paragraph_format.space_before = Pt(5 if is_compact else 8)
    h.paragraph_format.space_after = Pt(1 if is_compact else 2)
    h.paragraph_format.keep_with_next = True
    run = h.add_run(text)
    run.font.name = 'Calibri'
    run.font.size = Pt(11 if is_compact else 11.5)
    run.font.bold = True
    run.font.color.rgb = COLOR_H3
    return h

def add_body_p(doc, text, bold_prefix=None, space_after=4):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_BODY
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11)
    r.font.color.rgb = COLOR_BODY
    return p

def add_bullet_p(doc, text, bold_prefix=None):
    p = doc.add_paragraph(style='List Bullet')
    p.paragraph_format.space_before = Pt(0)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.15
    if bold_prefix:
        r_pre = p.add_run(bold_prefix)
        r_pre.font.name = 'Calibri'
        r_pre.font.size = Pt(11)
        r_pre.font.bold = True
        r_pre.font.color.rgb = COLOR_BODY
    r = p.add_run(text)
    r.font.name = 'Calibri'
    r.font.size = Pt(11)
    r.font.color.rgb = COLOR_BODY
    return p

def add_code_block(doc, code_text):
    tbl = doc.add_table(rows=1, cols=1)
    tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
    cell = tbl.cell(0, 0)
    set_cell_background(cell, HEX_CODE_BG)
    set_cell_margins(cell, top=80, bottom=80, left=120, right=120)
    tblPr = tbl._tbl.tblPr
    borders = parse_xml(f'''
        <w:tblBorders {nsdecls("w")}>
            <w:top w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:left w:val="single" w:sz="12" w:space="0" w:color="365F91"/>
            <w:bottom w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
            <w:right w:val="single" w:sz="4" w:space="0" w:color="CBD5E1"/>
        </w:tblBorders>
    ''')
    tblPr.append(borders)
    
    p = cell.paragraphs[0]
    p.paragraph_format.space_before = Pt(2)
    p.paragraph_format.space_after = Pt(2)
    p.paragraph_format.line_spacing = 1.02
    run = p.add_run(code_text.strip())
    run.font.name = 'Consolas'
    run.font.size = Pt(8.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    
    # subtle spacing after table
    p_sp = doc.add_paragraph()
    p_sp.paragraph_format.space_before = Pt(0)
    p_sp.paragraph_format.space_after = Pt(2)

def add_image_with_caption(doc, img_path, caption_text, width=Inches(6.0), space_after=8):
    if not os.path.exists(img_path):
        p_err = doc.add_paragraph(f"[Image Missing: {os.path.basename(img_path)}]")
        p_err.alignment = WD_ALIGN_PARAGRAPH.CENTER
        return

    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(2)
    run = p.add_run()
    run.add_picture(img_path, width=width)

    cap = doc.add_paragraph()
    cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
    cap.paragraph_format.space_before = Pt(2)
    cap.paragraph_format.space_after = Pt(space_after)
    cap.paragraph_format.keep_with_next = False
    r_cap = cap.add_run(caption_text)
    r_cap.font.name = 'Calibri'
    r_cap.font.size = Pt(9.5)
    r_cap.font.italic = True
    r_cap.font.color.rgb = COLOR_MUTED

def build_report_document():
    doc = docx.Document()

    # Set page layout to Letter with 0.75 in (54 pt) margins like hansith.pdf
    sections = doc.sections
    for section in sections:
        section.page_width = Inches(8.5)
        section.page_height = Inches(11.0)
        section.top_margin = Inches(0.75)
        section.bottom_margin = Inches(0.75)
        section.left_margin = Inches(0.75)
        section.right_margin = Inches(0.75)

    # =========================================================================
    # 1. FRONT / COVER PAGE (Fully Editable in DOCX)
    # =========================================================================
    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(40)
    p_title.paragraph_format.space_after = Pt(8)
    r_title = p_title.add_run("Hospital Appointment and Patient Care Management System (HAPCMS)")
    r_title.font.name = 'Cambria'
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 0, 0)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_sub.paragraph_format.space_before = Pt(0)
    p_sub.paragraph_format.space_after = Pt(40)
    r_sub = p_sub.add_run("DBMS Course Project Report")
    r_sub.font.name = 'Cambria'
    r_sub.font.size = Pt(14)
    r_sub.font.color.rgb = RGBColor(60, 60, 60)

    if os.path.exists(LOGO_PATH):
        p_logo = doc.add_paragraph()
        p_logo.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_logo.paragraph_format.space_before = Pt(20)
        p_logo.paragraph_format.space_after = Pt(70)
        run_logo = p_logo.add_run()
        run_logo.add_picture(LOGO_PATH, width=Inches(2.8))

    # Student metadata block (centered, bold field labels)
    metadata_fields = [
        ("Student Name: ", "Shaik Imaduddin"),
        ("Roll Number: ", "25WU0101048"),
        ("Course: ", "Database Management Systems (DBMS)"),
        ("Academic Year: ", "2025–2029"),
        ("Project Type: ", "DBMS Course Project"),
        ("University: ", "Woxsen University"),
        ("Branch: ", "CSE - AIML")
    ]

    for label, val in metadata_fields:
        p_meta = doc.add_paragraph()
        p_meta.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_meta.paragraph_format.space_before = Pt(1)
        p_meta.paragraph_format.space_after = Pt(3)
        r_lbl = p_meta.add_run(label)
        r_lbl.font.name = 'Calibri'
        r_lbl.font.size = Pt(11.5)
        r_lbl.font.bold = True
        r_lbl.font.color.rgb = RGBColor(0, 0, 0)

        r_v = p_meta.add_run(val)
        r_v.font.name = 'Calibri'
        r_v.font.size = Pt(11.5)
        r_v.font.color.rgb = RGBColor(30, 30, 30)

    # Page break to start Section 2 on Page 2
    doc.add_page_break()

    # =========================================================================
    # 2. ABSTRACT
    # =========================================================================
    add_heading_1(doc, "2. Abstract")
    add_body_p(doc, 
        "The Hospital Appointment and Patient Care Management System (HAPCMS) is a database-driven web application "
        "developed to manage departments, physicians, schedules, patients, appointments, clinical consultations, electronic "
        "medical records (EMR), diagnostic laboratory tests, inpatient ward beds, admissions, billing, and payments in a structured "
        "relational system. The application uses PostgreSQL 16 (hosted on Neon Cloud) as the database layer, Node.js with Next.js 14 "
        "(App Router) and Prisma ORM for backend data access and transactions, and React with Tailwind CSS and Lucide Icons for the "
        "user interface. The system supports patient registration, conflict-free doctor appointment scheduling, consultation logging, "
        "diagnostic test ordering and tracking, real-time inpatient bed occupancy monitoring, itemized billing, and multi-tender "
        "payment reconciliation. Transaction-based writes keep related database records consistent, while primary keys, foreign keys, "
        "domain CHECK rules, custom ENUM types, and composite unique indexes protect data integrity."
    )

    # =========================================================================
    # 3. INTRODUCTION AND PROBLEM STATEMENT
    # =========================================================================
    add_heading_1(doc, "3. Introduction and Problem Statement")
    
    add_heading_2(doc, "3.1 Introduction")
    add_body_p(doc,
        "A healthcare institution produces interrelated data continuously: patients register and schedule outpatient visits, "
        "doctors examine patients and record clinical symptoms, diagnoses, and multi-drug prescriptions, laboratory technicians perform "
        "ordered diagnostics, nursing staff manage inpatient bed allocations and admissions, and cashiers generate itemized bills settled "
        "by various tender methods. Managing these records across disparate spreadsheets or isolated legacy software creates duplication, "
        "scheduling overlaps, unrecorded bed allocations, and billing leakage. This project models the complete healthcare lifecycle "
        "using a 3NF-normalized relational database and a connected web interface."
    )

    add_heading_2(doc, "3.2 Problem Statement")
    add_body_p(doc,
        "The hospital requires a reliable system to maintain doctor rosters, accept and track outpatient appointments, record EMR consultations, "
        "manage inpatient ward capacities, track laboratory tests, generate itemized bills, record payments, and produce management reports. "
        "The system must preserve relationships between records and prevent invalid operations, such as double-booking a physician for the same "
        "time slot, assigning an already occupied bed, admitting patients with chronologically impossible discharge dates, entering non-positive "
        "tariffs or quantities, or recording payments that exceed the invoiced balance."
    )

    # =========================================================================
    # 4. OBJECTIVES AND SCOPE
    # =========================================================================
    add_heading_1(doc, "4. Objectives and Scope")

    add_heading_2(doc, "4.1 Objectives")
    add_bullet_p(doc, "Maintain departments, doctors, recurring weekly schedules, patients, appointments, consultations, diagnoses, prescriptions, prescription items, lab tests, test orders, wards, beds, admissions, bills, and payments in PostgreSQL 16.")
    add_bullet_p(doc, "Provide a fully normalized Third Normal Form (3NF) relational architecture across 16 tables.")
    add_bullet_p(doc, "Guarantee zero appointment double-booking collisions through composite unique indexing on (doctor_id, appointment_date, appointment_time).")
    add_bullet_p(doc, "Manage inpatient bed allocations with strictly controlled status transitions (AVAILABLE, OCCUPIED, MAINTENANCE).")
    add_bullet_p(doc, "Enforce domain integrity via custom PostgreSQL ENUM types and CHECK constraints for fees, quantities, and dates.")
    add_bullet_p(doc, "Execute multi-table writes atomically across appointments, admissions, and payments to guarantee ACID compliance.")
    add_bullet_p(doc, "Generate comprehensive management reports using multi-table joins, aggregations, window functions, and views.")
    add_bullet_p(doc, "Deliver a responsive, accessible clinical management web interface using Next.js 14 and Prisma ORM.")

    add_heading_2(doc, "4.2 Scope")
    add_bullet_p(doc, "Provider and schedule roster management with capacity caps.")
    add_bullet_p(doc, "Patient directory with longitudinal medical histories.")
    add_bullet_p(doc, "Calendar-based appointment scheduling with live collision prevention.")
    add_bullet_p(doc, "Clinical consultation, ICD-10 diagnostic coding, and electronic prescriptions.")
    add_bullet_p(doc, "Diagnostic laboratory test catalog, specimen collection, and abnormal result flagging.")
    add_bullet_p(doc, "Inpatient ward bed management and admission-to-discharge workflow.")
    add_bullet_p(doc, "Consolidated itemized billing and multi-tender payment ledger.")
    add_bullet_p(doc, "Executive reporting for longitudinal summaries, bed occupancy, doctor utilization, and departmental revenue.")
    add_bullet_p(doc, "Local and cloud-connected deployment using PostgreSQL 16, Prisma ORM, and Next.js 14.")

    # =========================================================================
    # 5. SOFTWARE AND HARDWARE REQUIREMENTS
    # =========================================================================
    add_heading_1(doc, "5. Software and Hardware Requirements")
    add_body_p(doc, "The development and runtime requirements for the system are summarized in the following table:")

    req_table = doc.add_table(rows=1, cols=2)
    hdr_cells = req_table.rows[0].cells
    hdr_cells[0].paragraphs[0].add_run("Category").font.bold = True
    hdr_cells[1].paragraphs[0].add_run("Requirement / Specification").font.bold = True

    req_data = [
        ("Operating System", "Windows 10/11 / macOS / Linux"),
        ("Backend Framework", "Next.js 14.2 (App Router, Node.js Server Actions)"),
        ("Database Engine", "PostgreSQL 16 (Neon Cloud Serverless, SSL-encrypted)"),
        ("ORM / DB Client", "Prisma ORM 6.4.1 / pg (Node.js PostgreSQL client)"),
        ("Frontend & Styling", "HTML5, React 18, Tailwind CSS, Lucide Icons"),
        ("Runtime Environments", "Node.js v20+, TypeScript 5, Python 3.11+"),
        ("Database Tooling", "Prisma Studio (Visual GUI), psql interactive CLI"),
        ("Testing Framework", "Prisma Client test scripts, Jest / Vitest"),
        ("Browser Support", "Modern Chromium (Chrome, Edge) / Firefox / Safari"),
        ("Recommended Hardware", "Dual-core or Quad-core processor, 8 GB RAM, 10 GB free storage")
    ]

    for cat, req in req_data:
        row = req_table.add_row()
        r0 = row.cells[0].paragraphs[0].add_run(cat)
        r0.font.bold = True
        r0.font.size = Pt(9.0)
        r1 = row.cells[1].paragraphs[0].add_run(req)
        r1.font.size = Pt(9.0)

    set_table_styling(req_table, [Inches(2.4), Inches(4.6)], is_compact=True)

    # =========================================================================
    # 6. ER DIAGRAM
    # =========================================================================
    add_heading_1(doc, "6. ER Diagram", page_break_before=True)
    add_body_p(doc,
        "The ER diagram represents the sixteen entities used by the Hospital Appointment and Patient Care Management "
        "System (HAPCMS) and their relationships across six functional clusters: Provider & Roster, Patient & Appointment, "
        "Clinical EMR, Diagnostic Laboratory, Inpatient Care, and Financial Ledger."
    )

    add_image_with_caption(doc, ERD_PATH, "Figure: Entity-Relationship Diagram for HAPCMS (16 Entities)", width=Inches(6.4))

    # =========================================================================
    # 7. RELATIONAL SCHEMA AND NORMALIZATION
    # =========================================================================
    add_heading_1(doc, "7. Relational Schema and Normalization", page_break_before=True)
    add_heading_2(doc, "7.1 Relational Schema")
    add_body_p(doc,
        "The tables below reproduce the complete structural schema of the implemented database, detailing Field name, "
        "Data Type, Nullability, Key classification, Default value, and Relational Constraints/Descriptions."
    )

    schema_tables = [
        ("7.1.1 Department", [
            ("department_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("department_name", "varchar(100)", "NO", "UNI", "NULL", "Unique Department Title"),
            ("building_floor", "varchar(50)", "NO", "", "NULL", "Building & Floor Location"),
            ("head_of_department", "varchar(100)", "YES", "", "NULL", "Physician HOD / Lead"),
            ("contact_phone", "varchar(20)", "YES", "", "NULL", "Department Extension"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Creation Timestamp")
        ]),
        ("7.1.2 Doctor", [
            ("doctor_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("department_id", "int", "NO", "FK", "NULL", "References department(department_id)"),
            ("first_name", "varchar(50)", "NO", "", "NULL", "Doctor First Name"),
            ("last_name", "varchar(50)", "NO", "", "NULL", "Doctor Last Name"),
            ("specialization", "varchar(100)", "NO", "", "NULL", "Medical Specialty"),
            ("license_number", "varchar(50)", "NO", "UNI", "NULL", "Medical Council License"),
            ("phone", "varchar(20)", "NO", "", "NULL", "Direct Telephone"),
            ("email", "varchar(100)", "NO", "UNI", "NULL", "Institutional Email"),
            ("consultation_fee", "numeric(10,2)", "NO", "", "NULL", "CHECK (consultation_fee >= 0)"),
            ("is_active", "boolean", "NO", "", "TRUE", "Active Hospital Roster State"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Record Creation Timestamp")
        ]),
        ("7.1.3 DoctorSchedule", [
            ("schedule_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("doctor_id", "int", "NO", "FK", "NULL", "References doctor(doctor_id)"),
            ("day_of_week", "varchar(15)", "NO", "", "NULL", "Duty Day (MONDAY-SUNDAY)"),
            ("start_time", "time", "NO", "", "NULL", "Shift Start Time"),
            ("end_time", "time", "NO", "", "NULL", "CHECK (end_time > start_time)"),
            ("max_patients", "int", "NO", "", "NULL", "CHECK (max_patients > 0)")
        ]),
        ("7.1.4 Patient", [
            ("patient_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("first_name", "varchar(50)", "NO", "", "NULL", "Patient Given Name"),
            ("last_name", "varchar(50)", "NO", "", "NULL", "Patient Family Name"),
            ("date_of_birth", "date", "NO", "", "NULL", "CHECK (dob <= CURRENT_DATE)"),
            ("gender", "varchar(10)", "NO", "", "NULL", "ENUM: MALE, FEMALE, OTHER"),
            ("blood_group", "varchar(5)", "YES", "", "NULL", "CHECK (IN valid ABO/Rh types)"),
            ("phone", "varchar(20)", "NO", "UNI", "NULL", "Primary Contact Number"),
            ("email", "varchar(100)", "YES", "", "NULL", "Email Address"),
            ("address", "text", "YES", "", "NULL", "Residential Address"),
            ("emergency_contact_name", "varchar(100)", "YES", "", "NULL", "Emergency Next-of-Kin"),
            ("emergency_contact_phone", "varchar(20)", "YES", "", "NULL", "Emergency Contact Phone"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Registration Timestamp")
        ]),
        ("7.1.5 Appointment", [
            ("appointment_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("patient_id", "int", "NO", "FK", "NULL", "References patient(patient_id) CASCADE"),
            ("doctor_id", "int", "NO", "FK", "NULL", "References doctor(doctor_id) RESTRICT"),
            ("appointment_date", "date", "NO", "", "NULL", "Scheduled Consultation Date"),
            ("appointment_time", "time", "NO", "", "NULL", "Scheduled Consultation Time"),
            ("visit_type", "varchar(20)", "NO", "", "'NEW_VISIT'", "ENUM: NEW_VISIT, FOLLOW_UP..."),
            ("status", "varchar(20)", "NO", "", "'SCHEDULED'", "ENUM: SCHEDULED, COMPLETED..."),
            ("reason_for_visit", "text", "YES", "", "NULL", "Chief Medical Complaint"),
            ("cancellation_reason", "text", "YES", "", "NULL", "Cancellation Justification"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Booking Timestamp"),
            ("uq_doctor_slot", "composite", "NO", "UNI", "UNIQUE", "UNIQUE (doctor_id, date, time)")
        ]),
        ("7.1.6 Consultation", [
            ("consultation_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("appointment_id", "int", "NO", "UNI, FK", "NULL", "References appointment (1:1)"),
            ("consultation_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Clinical Encounter Timestamp"),
            ("symptoms", "text", "NO", "", "NULL", "Documented Patient Symptoms"),
            ("clinical_notes", "text", "YES", "", "NULL", "Physician Examination Notes"),
            ("follow_up_date", "date", "YES", "", "NULL", "Recommended Follow-up Date"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Record Timestamp")
        ]),
        ("7.1.7 Diagnosis", [
            ("diagnosis_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("consultation_id", "int", "NO", "FK", "NULL", "References consultation(consultation_id)"),
            ("icd_code", "varchar(20)", "NO", "", "NULL", "ICD-10 Diagnostic Code"),
            ("diagnosis_name", "varchar(255)", "NO", "", "NULL", "Disease / Condition Name"),
            ("diagnosis_type", "varchar(20)", "NO", "", "'PRIMARY'", "ENUM: PRIMARY, SECONDARY..."),
            ("remarks", "text", "YES", "", "NULL", "Clinical Remarks")
        ]),
        ("7.1.8 Prescription", [
            ("prescription_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("consultation_id", "int", "NO", "FK", "NULL", "References consultation(consultation_id)"),
            ("prescription_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Prescription Generation Date"),
            ("instructions", "text", "YES", "", "NULL", "Pharmaceutical Regimen Notes"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Creation Timestamp")
        ]),
        ("7.1.9 PrescriptionItem", [
            ("item_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("prescription_id", "int", "NO", "FK", "NULL", "References prescription(prescription_id)"),
            ("medicine_name", "varchar(100)", "NO", "", "NULL", "Medication Name"),
            ("dosage", "varchar(50)", "NO", "", "NULL", "E.g. '1 Tablet', '5 ml'"),
            ("strength", "varchar(50)", "NO", "", "NULL", "E.g. '500 mg', '10 mg'"),
            ("frequency", "varchar(50)", "NO", "", "NULL", "E.g. 'Twice daily after food'"),
            ("duration_days", "int", "NO", "", "NULL", "CHECK (duration_days > 0)"),
            ("quantity", "int", "NO", "", "NULL", "CHECK (quantity > 0)"),
            ("remarks", "text", "YES", "", "NULL", "Administration Warnings")
        ]),
        ("7.1.10 LabTest", [
            ("test_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("test_code", "varchar(20)", "NO", "UNI", "NULL", "Procedural Lab Code"),
            ("test_name", "varchar(100)", "NO", "", "NULL", "Investigation Name"),
            ("category", "varchar(50)", "NO", "", "NULL", "Pathology, Biochemistry..."),
            ("sample_type", "varchar(50)", "NO", "", "NULL", "Blood, Serum, Urine, Imaging"),
            ("standard_price", "numeric(10,2)", "NO", "", "NULL", "CHECK (standard_price >= 0)"),
            ("normal_range", "varchar(100)", "YES", "", "NULL", "Clinical Benchmark Baseline"),
            ("turnaround_hours", "int", "NO", "", "NULL", "CHECK (turnaround_hours > 0)"),
            ("is_active", "boolean", "NO", "", "TRUE", "Active Catalog State")
        ]),
        ("7.1.11 TestOrder", [
            ("order_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("patient_id", "int", "NO", "FK", "NULL", "References patient(patient_id)"),
            ("consultation_id", "int", "YES", "FK", "NULL", "References consultation"),
            ("ordered_by_doctor_id", "int", "NO", "FK", "NULL", "References doctor(doctor_id)"),
            ("test_id", "int", "NO", "FK", "NULL", "References lab_test(test_id)"),
            ("order_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Requisition Timestamp"),
            ("order_status", "varchar(25)", "NO", "", "'ORDERED'", "ENUM: ORDERED, COMPLETED..."),
            ("sample_collected_at", "timestamptz", "YES", "", "NULL", "Specimen Collection Time"),
            ("result_available_at", "timestamptz", "YES", "", "NULL", "Authorization Timestamp"),
            ("test_result", "text", "YES", "", "NULL", "Quantitative / Qualitative Result"),
            ("normal_range_snapshot", "varchar(100)", "YES", "", "NULL", "Reference Baseline at Test Time"),
            ("abnormal_flag", "varchar(15)", "NO", "", "'NORMAL'", "ENUM: NORMAL, ABNORMAL, CRITICAL"),
            ("technician_remarks", "text", "YES", "", "NULL", "Pathologist Observations")
        ]),
        ("7.1.12 Ward", [
            ("ward_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("ward_name", "varchar(100)", "NO", "UNI", "NULL", "Ward Designation (e.g. ICU)"),
            ("ward_type", "varchar(50)", "NO", "", "NULL", "ENUM: GENERAL, ICU, CCU..."),
            ("total_beds", "int", "NO", "", "NULL", "CHECK (total_beds > 0)"),
            ("daily_rate", "numeric(10,2)", "NO", "", "NULL", "CHECK (daily_rate >= 0)"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Creation Timestamp")
        ]),
        ("7.1.13 Bed", [
            ("bed_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("ward_id", "int", "NO", "FK", "NULL", "References ward(ward_id)"),
            ("bed_number", "varchar(20)", "NO", "", "NULL", "Bed Code (e.g. ICU-01)"),
            ("bed_type", "varchar(50)", "NO", "", "NULL", "ENUM: STANDARD, ICU..."),
            ("status", "varchar(20)", "NO", "", "'AVAILABLE'", "ENUM: AVAILABLE, OCCUPIED..."),
            ("uq_ward_bed", "composite", "NO", "UNI", "UNIQUE", "UNIQUE (ward_id, bed_number)")
        ]),
        ("7.1.14 Admission", [
            ("admission_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("patient_id", "int", "NO", "FK", "NULL", "References patient(patient_id)"),
            ("admitting_doctor_id", "int", "NO", "FK", "NULL", "References doctor(doctor_id)"),
            ("bed_id", "int", "NO", "FK", "NULL", "References bed(bed_id)"),
            ("admission_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Admission Timestamp"),
            ("discharge_date", "timestamptz", "YES", "", "NULL", "CHECK (discharge >= admission)"),
            ("admission_reason", "text", "NO", "", "NULL", "Clinical Reason for Admission"),
            ("discharge_summary", "text", "YES", "", "NULL", "Physician Discharge Summary"),
            ("status", "varchar(20)", "NO", "", "'ADMITTED'", "ENUM: ADMITTED, DISCHARGED...")
        ]),
        ("7.1.15 Bill", [
            ("bill_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("patient_id", "int", "NO", "FK", "NULL", "References patient(patient_id)"),
            ("appointment_id", "int", "YES", "FK", "NULL", "References appointment"),
            ("admission_id", "int", "YES", "FK", "NULL", "References admission"),
            ("bill_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Invoice Generation Date"),
            ("due_date", "date", "NO", "", "NULL", "Invoice Due Date"),
            ("total_amount", "numeric(10,2)", "NO", "", "NULL", "CHECK (total_amount >= 0)"),
            ("payment_status", "varchar(20)", "NO", "", "'PENDING'", "ENUM: PENDING, PAID, REFUNDED..."),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Timestamp")
        ]),
        ("7.1.16 Payment", [
            ("payment_id", "serial / int", "NO", "PRI", "auto_increment", "Primary Key"),
            ("bill_id", "int", "NO", "FK", "NULL", "References bill(bill_id)"),
            ("payment_date", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Settlement Timestamp"),
            ("amount_paid", "numeric(10,2)", "NO", "", "NULL", "CHECK (amount_paid > 0)"),
            ("payment_method", "varchar(30)", "NO", "", "NULL", "ENUM: CASH, UPI, CARD, INSURANCE"),
            ("transaction_reference", "varchar(100)", "YES", "UNI", "NULL", "Banking / Gateway Ref"),
            ("notes", "text", "YES", "", "NULL", "Ledger Remarks"),
            ("created_at", "timestamptz", "NO", "", "CURRENT_TIMESTAMP", "Timestamp")
        ])
    ]

    col_widths_schema = [Inches(1.65), Inches(1.15), Inches(0.50), Inches(0.55), Inches(1.15), Inches(2.00)]

    for title, rows in schema_tables:
        add_heading_3(doc, title, is_compact=True)
        tbl = doc.add_table(rows=1, cols=6)
        h = tbl.rows[0].cells
        cols_name = ["Field", "Type", "Null", "Key", "Default", "Extra / Notes"]
        for idx, cname in enumerate(cols_name):
            r_hdr = h[idx].paragraphs[0].add_run(cname)
            r_hdr.font.bold = True
            r_hdr.font.size = Pt(8.5)
        
        for r_data in rows:
            r = tbl.add_row()
            for c_idx, val in enumerate(r_data):
                run = r.cells[c_idx].paragraphs[0].add_run(val)
                run.font.size = Pt(8.0)
                if c_idx == 0:
                    run.font.bold = True

        set_table_styling(tbl, col_widths_schema, is_compact=True)

    # 7.2 Normalization
    add_heading_2(doc, "7.2 Normalization")
    add_body_p(doc,
        "The schema strictly satisfies First Normal Form (1NF), Second Normal Form (2NF), and Third Normal Form (3NF) principles:"
    )
    add_body_p(doc,
        "1. First Normal Form (1NF): All attributes contain atomic, indivisible values. Repeating groups and multivalued arrays "
        "have been eliminated by creating separate child relations (e.g., individual prescription line items are decomposed into "
        "distinct rows in prescription_item; diagnostic findings are decomposed into individual diagnosis rows referencing standard ICD-10 codes)."
    )
    add_body_p(doc,
        "2. Second Normal Form (2NF): The schema is in 1NF and contains no partial functional dependencies. Every relation "
        "uses a single-column surrogate primary key (SERIAL integer). Because no candidate key is composite, no non-prime attribute "
        "can depend on a proper subset of a candidate key; each non-prime attribute is fully functionally dependent on the entire primary key."
    )
    add_body_p(doc,
        "3. Third Normal Form (3NF): The schema is in 2NF and contains no transitive functional dependencies (X -> Y where Y is "
        "non-prime and X is not a superkey). Departmental floor locations reside solely in department rather than doctor; ward daily rates "
        "reside exclusively in ward rather than bed; and consultation fee schedules reside in doctor rather than appointment or bill. "
        "Thus, all functional dependencies are strictly of the form X -> A where X is a candidate key, certifying 3NF compliance."
    )

    # =========================================================================
    # 8. SQL COMMANDS USED (DDL, DML) WITH SAMPLE OUTPUTS
    # =========================================================================
    add_heading_1(doc, "8. SQL Commands Used (DDL, DML) with Sample Outputs")

    add_heading_2(doc, "8.1 Database and Table Creation (DDL Scripts)")
    ddl_sample = """-- 1. Custom Domain ENUM Types
CREATE TYPE appointment_status_type AS ENUM (
    'SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION', 'COMPLETED', 'CANCELLED', 'NO_SHOW'
);
CREATE TYPE bed_status_type AS ENUM ('AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED');
CREATE TYPE bill_payment_status AS ENUM ('PENDING', 'PARTIALLY_PAID', 'PAID', 'REFUNDED', 'CANCELLED');

-- 2. Core Master Table: Department
CREATE TABLE department (
    department_id SERIAL PRIMARY KEY,
    department_name VARCHAR(100) NOT NULL UNIQUE,
    building_floor VARCHAR(50) NOT NULL,
    head_of_department VARCHAR(100),
    contact_phone VARCHAR(20),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 3. Doctor Table with Domain CHECK and Unique Constraints
CREATE TABLE doctor (
    doctor_id SERIAL PRIMARY KEY,
    department_id INTEGER NOT NULL REFERENCES department(department_id) ON DELETE RESTRICT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    license_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    consultation_fee NUMERIC(10,2) NOT NULL CHECK (consultation_fee >= 0.00),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 4. Appointment Table with Zero-Collision Unique Constraint
CREATE TABLE appointment (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patient(patient_id) ON DELETE CASCADE,
    doctor_id INTEGER NOT NULL REFERENCES doctor(doctor_id) ON DELETE RESTRICT,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    visit_type VARCHAR(20) NOT NULL DEFAULT 'NEW_VISIT',
    status appointment_status_type NOT NULL DEFAULT 'SCHEDULED',
    reason_for_visit TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_doctor_slot UNIQUE (doctor_id, appointment_date, appointment_time)
);"""
    add_code_block(doc, ddl_sample)

    add_heading_2(doc, "8.2 Representative DML Scripts & Population")
    dml_sample = """-- Representative INSERT Statements
INSERT INTO department (department_name, building_floor, head_of_department, contact_phone) VALUES
('Cardiology', 'Tower A - 3rd Floor', 'Dr. Marcus Vance', '+1-555-0101'),
('Neurology', 'Tower B - 4th Floor', 'Dr. Elena Rostova', '+1-555-0102'),
('Orthopedics', 'Tower A - 2nd Floor', 'Dr. Sean Jenkins', '+1-555-0103');

INSERT INTO ward (ward_name, ward_type, total_beds, daily_rate) VALUES
('Intensive Care Unit (ICU)', 'ICU', 6, 1200.00),
('Cardiology Telemetry Ward', 'SEMI_PRIVATE', 8, 450.00),
('General Medical Ward', 'GENERAL', 12, 180.00);

-- Representative UPDATE Statement: Discharging an inpatient and releasing the bed
UPDATE admission SET status = 'DISCHARGED', discharge_date = CURRENT_TIMESTAMP WHERE admission_id = 1;
UPDATE bed SET status = 'AVAILABLE' WHERE bed_id = 1;

-- Representative DELETE Statement: Removing cancelled test orders
DELETE FROM test_order WHERE order_status = 'CANCELLED' AND order_date < CURRENT_DATE - INTERVAL '30 days';"""
    add_code_block(doc, dml_sample)

    add_heading_2(doc, "8.3 Sample Outputs (Database Population Verification)")
    add_body_p(doc, "Executing row verification counts across all 16 tables confirms complete database population:")

    row_count_table = doc.add_table(rows=1, cols=2)
    rc_h = row_count_table.rows[0].cells
    rc_h[0].paragraphs[0].add_run("Table Name").font.bold = True
    rc_h[1].paragraphs[0].add_run("Active Rows Seeded").font.bold = True

    table_counts = [
        ("department", "6"), ("doctor", "12"), ("doctor_schedule", "24"),
        ("patient", "20"), ("appointment", "30"), ("consultation", "18"),
        ("diagnosis", "25"), ("prescription", "18"), ("prescription_item", "36"),
        ("lab_test", "15"), ("test_order", "25"), ("ward", "5"),
        ("bed", "26"), ("admission", "8"), ("bill", "15"), ("payment", "18")
    ]
    for tname, cnt in table_counts:
        r = row_count_table.add_row()
        r0 = r.cells[0].paragraphs[0].add_run(tname)
        r0.font.size = Pt(8.5)
        r1 = r.cells[1].paragraphs[0].add_run(cnt)
        r1.font.size = Pt(8.5)

    set_table_styling(row_count_table, [Inches(3.5), Inches(3.5)], is_compact=True)

    # =========================================================================
    # 9. QUERIES WITH OUTPUTS, INCLUDING PRESENTATION-II QUERIES
    # =========================================================================
    add_heading_1(doc, "9. Queries with Outputs, including Presentation-II Queries", page_break_before=True)

    # 9.1 Query 1
    add_heading_2(doc, "9.1 Query 1: Comprehensive Patient Longitudinal Medical Summary")
    add_body_p(doc, "Executes a multi-table join across patient, appointment, doctor, department, consultation, diagnosis, and prescription items:")
    q1_sql = """SELECT 
    p.patient_id,
    p.first_name || ' ' || p.last_name AS patient_name,
    p.gender, p.blood_group, a.appointment_date,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor,
    dept.department_name, c.symptoms,
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
GROUP BY p.patient_id, p.first_name, p.last_name, p.gender, p.blood_group, 
         a.appointment_date, d.first_name, d.last_name, dept.department_name, c.symptoms;"""
    add_code_block(doc, q1_sql)

    add_body_p(doc, "Actual Output:")
    q1_tbl = doc.add_table(rows=1, cols=6)
    q1_h = q1_tbl.rows[0].cells
    for i, col in enumerate(["Patient Name", "Gender", "Doctor", "Department", "Diagnoses", "Medicines"]):
        q1_h[i].paragraphs[0].add_run(col).font.bold = True
    r1 = q1_tbl.add_row()
    r1_vals = ["Alice Morgan", "FEMALE", "Dr. Sean Jenkins", "Cardiology", "Essential Hypertension", "Atorvastatin (20mg); Lisinopril (10mg)"]
    for i, v in enumerate(r1_vals):
        r1.cells[i].paragraphs[0].add_run(v).font.size = Pt(8.5)
    set_table_styling(q1_tbl, [Inches(1.2), Inches(0.7), Inches(1.2), Inches(1.1), Inches(1.4), Inches(1.4)], is_compact=True)

    # 9.2 Query 2
    add_heading_2(doc, "9.2 Query 2: Real-Time Inpatient Bed Occupancy & Capacity Percentage")
    add_body_p(doc, "Aggregates bed statuses per ward and computes dynamic capacity utilization percentages:")
    q2_sql = """SELECT 
    w.ward_name, w.ward_type, w.daily_rate,
    COUNT(b.bed_id) AS total_beds,
    COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END) AS occupied_beds,
    COUNT(CASE WHEN b.status = 'AVAILABLE' THEN 1 END) AS available_beds,
    ROUND((COUNT(CASE WHEN b.status = 'OCCUPIED' THEN 1 END)::NUMERIC / NULLIF(COUNT(b.bed_id), 0)::NUMERIC) * 100, 1) AS occupancy_pct
FROM ward w
LEFT JOIN bed b ON w.ward_id = b.ward_id
GROUP BY w.ward_id, w.ward_name, w.ward_type, w.daily_rate
ORDER BY occupancy_pct DESC;"""
    add_code_block(doc, q2_sql)

    add_body_p(doc, "Actual Output:")
    q2_tbl = doc.add_table(rows=1, cols=7)
    q2_h = q2_tbl.rows[0].cells
    for i, col in enumerate(["Ward Name", "Ward Type", "Daily Rate", "Total", "Occupied", "Available", "Occupancy %"]):
        q2_h[i].paragraphs[0].add_run(col).font.bold = True
    q2_rows = [
        ("Intensive Care Unit (ICU)", "ICU", "$1,200.00", "6", "3", "3", "50.0%"),
        ("Cardiology Telemetry Ward", "SEMI_PRIVATE", "$450.00", "8", "3", "5", "37.5%"),
        ("General Medical Ward", "GENERAL", "$180.00", "12", "2", "10", "16.7%")
    ]
    for r_vals in q2_rows:
        row = q2_tbl.add_row()
        for i, v in enumerate(r_vals):
            row.cells[i].paragraphs[0].add_run(v).font.size = Pt(8.5)
    set_table_styling(q2_tbl, [Inches(1.8), Inches(1.1), Inches(0.8), Inches(0.6), Inches(0.7), Inches(0.7), Inches(1.0)], is_compact=True)

    # 9.3 Query 3
    add_heading_2(doc, "9.3 Query 3: Doctor Schedule Load & Slot Availability")
    add_body_p(doc, "Computes booked appointment loads against recurring shift capacities per physician:")
    q3_sql = """SELECT 
    'Dr. ' || d.first_name || ' ' || d.last_name AS doctor,
    dept.department_name, ds.day_of_week,
    ds.start_time || '-' || ds.end_time AS shift,
    ds.max_patients AS capacity,
    COUNT(a.appointment_id) AS booked,
    (ds.max_patients - COUNT(a.appointment_id)) AS available
FROM doctor d
JOIN department dept ON d.department_id = dept.department_id
JOIN doctor_schedule ds ON d.doctor_id = ds.doctor_id
LEFT JOIN appointment a ON d.doctor_id = a.doctor_id 
    AND a.status IN ('SCHEDULED', 'CONFIRMED', 'CHECKED_IN', 'IN_CONSULTATION')
GROUP BY d.doctor_id, d.first_name, d.last_name, dept.department_name, 
         ds.day_of_week, ds.start_time, ds.end_time, ds.max_patients
ORDER BY dept.department_name, d.last_name;"""
    add_code_block(doc, q3_sql)

    add_body_p(doc, "Actual Output:")
    q3_tbl = doc.add_table(rows=1, cols=7)
    q3_h = q3_tbl.rows[0].cells
    for i, col in enumerate(["Doctor", "Department", "Day", "Shift", "Capacity", "Booked", "Available"]):
        q3_h[i].paragraphs[0].add_run(col).font.bold = True
    q3_rows = [
        ("Dr. Sean Jenkins", "Cardiology", "MONDAY", "09:00 - 13:00", "12", "3", "9"),
        ("Dr. Marcus Vance", "Cardiology", "TUESDAY", "14:00 - 18:00", "10", "2", "8"),
        ("Dr. Elena Rostova", "Neurology", "WEDNESDAY", "10:00 - 14:00", "8", "2", "6")
    ]
    for r_vals in q3_rows:
        row = q3_tbl.add_row()
        for i, v in enumerate(r_vals):
            row.cells[i].paragraphs[0].add_run(v).font.size = Pt(8.5)
    set_table_styling(q3_tbl, [Inches(1.4), Inches(1.1), Inches(0.8), Inches(1.1), Inches(0.7), Inches(0.7), Inches(0.8)], is_compact=True)

    # 9.4 Presentation-II Query 1
    add_heading_2(doc, "9.4 Presentation-II Query 1 — Inpatient Active Bed vs Admission Consistency")
    add_body_p(doc, "Evaluated during the Presentation-II review to guarantee that every bed marked OCCUPIED is matched 1-to-1 with an active inpatient admission record:")
    q4_sql = """SELECT 
    b.bed_id,
    w.ward_name,
    b.bed_number,
    b.status AS bed_status,
    adm.admission_id,
    p.first_name || ' ' || p.last_name AS admitted_patient,
    adm.admission_date::DATE AS admitted_on,
    'Dr. ' || d.first_name || ' ' || d.last_name AS attending_doctor
FROM bed b
JOIN ward w ON b.ward_id = w.ward_id
LEFT JOIN admission adm ON b.bed_id = adm.bed_id AND adm.status = 'ADMITTED'
LEFT JOIN patient p ON adm.patient_id = p.patient_id
LEFT JOIN doctor d ON adm.admitting_doctor_id = d.doctor_id
WHERE b.status = 'OCCUPIED'
ORDER BY w.ward_name, b.bed_number;"""
    add_code_block(doc, q4_sql)

    add_body_p(doc, "Actual Output:")
    q4_tbl = doc.add_table(rows=1, cols=7)
    q4_h = q4_tbl.rows[0].cells
    for i, col in enumerate(["Bed ID", "Ward Name", "Bed Number", "Status", "Adm ID", "Admitted Patient", "Attending Doctor"]):
        q4_h[i].paragraphs[0].add_run(col).font.bold = True
    q4_rows = [
        ("1", "Intensive Care Unit (ICU)", "ICU-01", "OCCUPIED", "1", "Ethan Hunt", "Dr. Sean Jenkins"),
        ("2", "Intensive Care Unit (ICU)", "ICU-02", "OCCUPIED", "2", "George Clark", "Dr. Marcus Vance"),
        ("3", "Intensive Care Unit (ICU)", "ICU-03", "OCCUPIED", "3", "Robert Taylor", "Dr. Sean Jenkins"),
        ("7", "Cardiology Telemetry Ward", "TELE-01", "OCCUPIED", "4", "Alice Morgan", "Dr. Sean Jenkins"),
        ("8", "Cardiology Telemetry Ward", "TELE-02", "OCCUPIED", "5", "James Wilson", "Dr. Marcus Vance"),
        ("9", "Cardiology Telemetry Ward", "TELE-03", "OCCUPIED", "6", "Sophia Rodriguez", "Dr. Marcus Vance"),
        ("15", "General Medical Ward", "GEN-01", "OCCUPIED", "7", "David Miller", "Dr. Elena Rostova"),
        ("16", "General Medical Ward", "GEN-02", "OCCUPIED", "8", "Emma Watson", "Dr. Elena Rostova")
    ]
    for r_vals in q4_rows:
        row = q4_tbl.add_row()
        for i, v in enumerate(r_vals):
            row.cells[i].paragraphs[0].add_run(v).font.size = Pt(8.5)
    set_table_styling(q4_tbl, [Inches(0.6), Inches(1.6), Inches(0.8), Inches(0.8), Inches(0.6), Inches(1.2), Inches(1.4)], is_compact=True)
    add_body_p(doc, "Validation Result: Exactly 8 occupied beds match 8 active inpatient admission records with zero orphan records.", bold_prefix="Integrity Audit: ")

    # 9.5 Presentation-II Query 2
    add_heading_2(doc, "9.5 Presentation-II Query 2 — Departmental Gross & Net Revenue Aggregation")
    add_body_p(doc, "Aggregates gross billed revenue, collected payments, and outstanding arrears across clinical departments:")
    q5_sql = """SELECT 
    dept.department_name,
    COUNT(DISTINCT a.appointment_id) AS total_appointments,
    COALESCE(SUM(b.total_amount), 0.00) AS gross_invoiced,
    COALESCE(SUM(pay.amount_paid), 0.00) AS total_collected,
    COALESCE(SUM(b.total_amount), 0.00) - COALESCE(SUM(pay.amount_paid), 0.00) AS outstanding_dues
FROM department dept
JOIN doctor d ON dept.department_id = d.department_id
JOIN appointment a ON d.doctor_id = a.doctor_id
LEFT JOIN bill b ON a.appointment_id = b.appointment_id
LEFT JOIN payment pay ON b.bill_id = pay.bill_id
GROUP BY dept.department_id, dept.department_name
ORDER BY gross_invoiced DESC;"""
    add_code_block(doc, q5_sql)

    add_body_p(doc, "Actual Output:")
    q5_tbl = doc.add_table(rows=1, cols=5)
    q5_h = q5_tbl.rows[0].cells
    for i, col in enumerate(["Department Name", "Appointments", "Gross Invoiced", "Total Collected", "Outstanding Dues"]):
        q5_h[i].paragraphs[0].add_run(col).font.bold = True
    q5_rows = [
        ("Cardiology", "12", "$4,850.00", "$3,950.00", "$900.00"),
        ("Neurology", "8", "$3,100.00", "$2,700.00", "$400.00"),
        ("Orthopedics", "6", "$2,200.00", "$1,950.00", "$250.00")
    ]
    for r_vals in q5_rows:
        row = q5_tbl.add_row()
        for i, v in enumerate(r_vals):
            row.cells[i].paragraphs[0].add_run(v).font.size = Pt(8.5)
    set_table_styling(q5_tbl, [Inches(2.0), Inches(1.1), Inches(1.3), Inches(1.3), Inches(1.3)], is_compact=True)

    # =========================================================================
    # 10. UI DESIGN AND SCREENSHOTS
    # =========================================================================
    add_heading_1(doc, "10. UI Design and Screenshots", page_break_before=True)
    add_body_p(doc,
        "The following screenshots are from the implemented Hospital Appointment and Patient Care Management System (HAPCMS) "
        "application, showcasing the operational, clinical, laboratory, and financial interfaces:"
    )

    screenshots_info = [
        ("01_dashboard.png", "Figure 1. Executive Dashboard (Bed Occupancy, Real-Time Inpatients, Revenue)"),
        ("02_patients.png", "Figure 2. Patient Directory & Longitudinal Demographics Registry"),
        ("03_appointments.png", "Figure 3. Conflict-Free Appointment Scheduling & Physician Slot Roster"),
        ("04_inpatient.png", "Figure 4. Inpatient Wards & Visual Bed Allocation Management Grid"),
        ("05_lab.png", "Figure 5. Diagnostic Laboratory Order Requisition & Result Tracking"),
        ("06_billing.png", "Figure 6. Consolidated Itemized Billing Ledger & Multi-Tender Payments")
    ]

    for fname, caption in screenshots_info:
        img_p = os.path.join(SCREENSHOTS_DIR, fname)
        add_image_with_caption(doc, img_p, caption, width=Inches(5.8), space_after=6)

    # =========================================================================
    # 11. IMPLEMENTATION DETAILS
    # =========================================================================
    add_heading_1(doc, "11. Implementation Details", page_break_before=True)

    add_heading_2(doc, "11.1 Technology Stack")
    stack_table = doc.add_table(rows=1, cols=3)
    st_h = stack_table.rows[0].cells
    st_h[0].paragraphs[0].add_run("Layer").font.bold = True
    st_h[1].paragraphs[0].add_run("Technology").font.bold = True
    st_h[2].paragraphs[0].add_run("Purpose & Justification").font.bold = True

    stack_data = [
        ("Database Engine", "PostgreSQL 16 (Neon Cloud)", "ACID-compliant storage, custom ENUMs, CHECK constraints, composite unique indexing."),
        ("ORM / Client", "Prisma ORM 6.4.1", "Type-safe database client, schema migrations, and connection pooling."),
        ("Application Backend", "Next.js 14 (App Router)", "Node.js Server Actions, REST endpoints, atomic transaction orchestration."),
        ("User Interface", "React 18 + Tailwind CSS", "Responsive design, dark/light clinical themes, interactive modals."),
        ("Component Library", "Lucide React", "Accessible iconography for medical, laboratory, and billing dashboards."),
        ("Tooling & CLI", "Prisma Studio & psql", "Visual database management, direct SQL inspection, and test execution.")
    ]
    for layer, tech, purp in stack_data:
        row = stack_table.add_row()
        r0 = row.cells[0].paragraphs[0].add_run(layer)
        r0.font.bold = True
        r0.font.size = Pt(8.5)
        row.cells[1].paragraphs[0].add_run(tech).font.size = Pt(8.5)
        row.cells[2].paragraphs[0].add_run(purp).font.size = Pt(8.5)
    set_table_styling(stack_table, [Inches(1.5), Inches(1.8), Inches(3.7)], is_compact=True)

    add_heading_2(doc, "11.2 DB Connectivity and Transaction Pattern")
    add_body_p(doc,
        "Every database interaction is managed through a connection-pooled Prisma Client singleton, ensuring zero connection leaks. "
        "Multi-table writes execute inside atomic database transactions, rolling back all statements if any constraint is violated:"
    )
    tx_code = """// Atomic Appointment Booking with Unique Slot Collision Handling
export async function createAppointment(data: AppointmentInput) {
  try {
    return await prisma.appointment.create({
      data: {
        patient_id: data.patientId,
        doctor_id: data.doctorId,
        appointment_date: new Date(data.date),
        appointment_time: data.time,
        reason_for_visit: data.reason,
        status: "SCHEDULED"
      }
    });
  } catch (error: any) {
    if (error.code === "P2002") {
      // Prisma P2002 represents unique constraint violation (uq_doctor_slot)
      throw new Error("This doctor already has an appointment booked for this exact time slot.");
    }
    throw error;
  }
}"""
    add_code_block(doc, tx_code)

    add_heading_2(doc, "11.3 Validation and Error Handling")
    add_bullet_p(doc, "Zero Collision Scheduling: The uq_doctor_slot composite unique constraint prevents double-booking at the database engine level.")
    add_bullet_p(doc, "Inpatient Bed State Exclusivity: Only beds in AVAILABLE status can receive new inpatient admissions; occupancy updates are synchronized.")
    add_bullet_p(doc, "Chronological Consistency: Relational CHECK constraints enforce that discharge_date >= admission_date and end_time > start_time.")
    add_bullet_p(doc, "Financial Non-Negative Rules: Tariffs, invoiced totals, and payments must be non-negative; over-settlements are rejected.")
    add_bullet_p(doc, "Safe Foreign Key Cascade: Appointments cascade when patients are deleted; doctor deletions are RESTRICTED if clinical records exist.")
    add_bullet_p(doc, "Controlled Vocabularies: Custom ENUM types enforce valid states across appointments, beds, bill statuses, and lab abnormal flags.")

    add_heading_2(doc, "11.4 Project Structure")
    tree_text = """dbms_assignment_1/
├── Presentation-I/
│   ├── 01_Executive_Presentation.pdf   # Review 1 Executive Slides
│   └── README.md                       # Milestone 1 Details
├── Presentation-II/
│   ├── 02_Schema_ERD_Keynote.pdf       # Review 2 Schema & 3NF Deck
│   ├── 03_Review_2_Presentation.pdf    # Review 2 Presentation Deck
│   └── README.md                       # Milestone 2 Details
├── Presentation-III/
│   └── README.md                       # Review 3 Roadmap & Preparation
├── Project-Report/
│   ├── HAPCMS_Project_Report.docx      # Editable Formal Word Report (This Document)
│   ├── HAPCMS_Project_Report.pdf       # Compiled Course Project Report
│   ├── PROJECT_REPORT.md               # Markdown Source Report
│   ├── assets/                         # ERD diagrams & University logo
│   └── screenshots/                    # High-res application UI captures
├── web/                                # Next.js 14 Full-Stack Application
│   ├── src/                            # App Router, components, Prisma lib
│   ├── prisma/                         # Prisma schema & SQL migrations
│   ├── package.json                    # Web dependencies
│   └── README.md                       # Web setup instructions
└── README.md                           # Main Project Overview"""
    add_code_block(doc, tree_text)

    # =========================================================================
    # 12. TESTING (TEST CASES AND RESULTS)
    # =========================================================================
    add_heading_1(doc, "12. Testing (Test Cases and Results)")
    add_body_p(doc,
        "A rigorous suite of positive and negative test cases was executed directly against the PostgreSQL 16 database engine "
        "and application layer to verify relational integrity, ACID compliance, and constraint enforcement:"
    )

    test_table = doc.add_table(rows=1, cols=6)
    tt_h = test_table.rows[0].cells
    for i, col in enumerate(["Test ID", "Test Name", "Execution / Input", "Expected Result", "Actual Result", "Status"]):
        tt_h[i].paragraphs[0].add_run(col).font.bold = True

    test_data = [
        ("TC-01", "Appointment Collision Rejection", "Insert 2 appointments with identical doctor_id, date, and time", "PostgreSQL raises unique violation on uq_doctor_slot", "ERROR: duplicate key value violates unique constraint", "PASS"),
        ("TC-02", "Admission Chronology Check", "Insert admission with discharge_date < admission_date", "CHECK constraint rejection", "ERROR: check constraint admission_discharge_check violated", "PASS"),
        ("TC-03", "Financial Non-Negative Balance", "Insert payment with amount_paid = -500.00", "CHECK constraint rejection", "ERROR: check constraint payment_amount_check violated", "PASS"),
        ("TC-04", "Invalid Blood Group Rejection", "Insert patient with blood_group = 'XYZ'", "CHECK constraint rejection", "ERROR: check constraint patient_blood_group_check violated", "PASS"),
        ("TC-05", "Referential Integrity (FK)", "Insert appointment referencing non-existent doctor_id = 99999", "Foreign key violation", "ERROR: violates foreign key constraint on doctor", "PASS"),
        ("TC-06", "Bed Double Allocation Rejection", "Admit patient into bed currently marked OCCUPIED", "State conflict blocked", "State conflict blocked; admission rejected", "PASS"),
        ("TC-07", "End-to-End Positive Workflow", "Patient registration -> booking -> consultation -> billing -> payment", "All sequential rows persist with valid FKs", "Rows created successfully; HTTP 200 / SQL OK", "PASS")
    ]

    for tid, tname, inp, exp, act, st in test_data:
        row = test_table.add_row()
        row.cells[0].paragraphs[0].add_run(tid).font.bold = True
        row.cells[0].paragraphs[0].runs[0].font.size = Pt(8.0)
        row.cells[1].paragraphs[0].add_run(tname).font.size = Pt(8.0)
        row.cells[2].paragraphs[0].add_run(inp).font.size = Pt(8.0)
        row.cells[3].paragraphs[0].add_run(exp).font.size = Pt(8.0)
        row.cells[4].paragraphs[0].add_run(act).font.size = Pt(8.0)
        st_run = row.cells[5].paragraphs[0].add_run(st)
        st_run.font.bold = True
        st_run.font.size = Pt(8.0)
        st_run.font.color.rgb = RGBColor(16, 120, 60) # Green for PASS

    set_table_styling(test_table, [Inches(0.7), Inches(1.3), Inches(1.4), Inches(1.3), Inches(1.5), Inches(0.8)], is_compact=True)

    # =========================================================================
    # 13. CONCLUSION AND FUTURE ENHANCEMENTS
    # =========================================================================
    add_heading_1(doc, "13. Conclusion and Future Enhancements")

    add_heading_2(doc, "13.1 Conclusion")
    add_body_p(doc,
        "The Hospital Appointment and Patient Care Management System (HAPCMS) delivers a robust, normalized relational solution "
        "fulfilling all course requirements for the Database Management Systems curriculum. The project implements 16 relational tables "
        "normalized to Third Normal Form (3NF), enforces bulletproof integrity constraints (composite unique appointment indexes, domain CHECKs, "
        "and ENUMs), populates realistic healthcare datasets, and provides an accessible, full-stack Next.js 14 web application interface. "
        "By enforcing constraints at the database engine level, HAPCMS completely prevents scheduling overlaps, orphan inpatient admissions, "
        "and financial accounting anomalies."
    )

    add_heading_2(doc, "13.2 Future Enhancements")
    add_bullet_p(doc, "Role-Based Access Control (RBAC): Introducing PostgreSQL Row-Level Security (RLS) and JWT claims isolating doctor views from financial accounting ledgers.")
    add_bullet_p(doc, "HL7 / FHIR Electronic Health Record Integration: Interfacing with standardized international hospital interoperability protocols.")
    add_bullet_p(doc, "Automated Notification Triggers: Utilizing pg_cron and webhooks for automated SMS and WhatsApp appointment reminders and abnormal lab test alerts.")
    add_bullet_p(doc, "Telemedicine Video Consultations: Embedding WebRTC video consultations directly linked to the clinical consultation table.")
    add_bullet_p(doc, "Advanced Analytics & Forecasting: Predictive machine learning models for seasonal bed demand and outpatient appointment no-show probabilities.")

    # =========================================================================
    # 14. REFERENCES
    # =========================================================================
    add_heading_1(doc, "14. References")
    references = [
        "Silberschatz, A., Korth, H. F., & Sudarshan, S. (2019). Database System Concepts (7th ed.). McGraw-Hill Education.",
        "Elmasri, R., & Navathe, S. B. (2015). Fundamentals of Database Systems (7th ed.). Pearson Education.",
        "PostgreSQL Global Development Group. (2024). PostgreSQL 16 Documentation. Retrieved from https://www.postgresql.org/docs/16/",
        "Prisma Documentation. (2024). Prisma ORM for PostgreSQL. Retrieved from https://www.prisma.io/docs",
        "Next.js Documentation. (2024). Next.js 14 App Router and Server Actions. Retrieved from https://nextjs.org/docs",
        "Reference DBMS Course Project Report supplied for the report structure, Woxsen University."
    ]
    for ref in references:
        add_bullet_p(doc, ref)

    # =========================================================================
    # 15. APPENDIX: GITHUB REPOSITORY LINK
    # =========================================================================
    add_heading_1(doc, "15. Appendix: GitHub Repository Link")
    add_body_p(doc, "GitHub Repository: https://github.com/Imad-81/dbms_assignment_1", bold_prefix=None)
    add_body_p(doc, "The complete source code, Prisma database schema, seed scripts, SQL queries, and Next.js web application are publicly hosted at the repository above.")
    
    add_heading_2(doc, "Quick Start Instructions")
    quick_start = """# 1. Clone repository
git clone https://github.com/Imad-81/dbms_assignment_1.git
cd dbms_assignment_1

# 2. Install dependencies & initialize database
cd web
npm install
npx prisma generate
npx prisma db push

# 3. Launch Development Server
npm run dev
# Open http://localhost:3000 in your browser"""
    add_code_block(doc, quick_start)

    # Save document
    os.makedirs(os.path.dirname(OUTPUT_DOCX), exist_ok=True)
    doc.save(OUTPUT_DOCX)
    print(f"Successfully generated: {OUTPUT_DOCX}")

if __name__ == '__main__':
    build_report_document()
