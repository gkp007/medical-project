# USG (Ultrasound) Module — Frontend Specification & Audit

> **Live System Reference:** [Labsmart LIS](https://app.labsmartlis.com/71122710) — USG Imaging & Sonography Module  
> **Document Code:** `USGFrontend.md`  
> **Target Base:** `MedicalProject` React + TypeScript SPA  
> **Routing Namespace:** `usg_today`, `usg_reports`, `usg_templates`, `usg_signatures`  

---

## 1. Executive Summary & Architecture Overview

The **USG (Ultrasound)** module in Labsmart LIS is designed specifically for Diagnostic Imaging Centers, Sonography Clinics, and Radiology departments. Unlike general clinical pathology which is quantitative and automated, Sonography reports are **narrative, organ-structured, qualitative, and operator-dependent**, requiring:
1. **Queue Management:** Real-time patient flow tracking through patient reception, sonologist scan room preparation, scan in-progress, draft transcription, and final radiologist sign-off.
2. **Standardized Organ Scanning Protocols:** Ready-to-use clinical ultrasound templates (Whole Abdomen, KUB & Prostate, Obstetric Anomaly, Pelvic TVS, Thyroid, Breast, Scrotal Doppler, Musculoskeletal).
3. **Structured Sonographic Findings & Measurements:** Quantitative biometric inputs (liver span, renal dimensions, cortical thickness, prostate volume, gestational biometry: BPD/FL/AC/HC/AFI) alongside qualitative organ parenchymal descriptions.
4. **Radiologist Signature & Medico-Legal Authentication:** PNDT-compliant reporting with mandatory Doctor Medical Council Registration number, qualification degrees, digital signature seal, and clinical indication history.

---

## 2. Comprehensive Screen-by-Screen Specification

### 2.1 Screen 1: Today's Cases (`/usg_cases/today` / `usg_today`)

#### A. Header & Controls
- **Page Title:** `Ultrasound (USG) — Today's Cases`
- **Breadcrumb / Sub-text:** `Daily sonography patient queue, room status, scan protocol, and radiologist reporting.`
- **Top Action Bar:**
  - `+ Register USG Case` (Primary Blue Button `#2563eb` with Plus icon) — Opens quick USG registration modal.
  - `+ New Bill` (Green Pill Button or Secondary outline) — Redirects to full billing workflow.
  - `Date Step Navigator`:
    - `< Previous Day` (IconButton)
    - `Date Picker` (`DD/MM/YYYY`, default Today)
    - `Next Day >` (IconButton)
  - `Refresh` button with live case count indicator.

#### B. Filter Bar & Status Pills
- **Real-Time Status Tabs / Pills:**
  - `All Cases (Count)` — default active
  - `Waiting for Scan (Count)` — Yellow/amber badge `#f59e0b`
  - `In Scan Room (Count)` — Blue badge `#2563eb`
  - `Draft / Pending Review (Count)` — Purple badge `#8b5cf6`
  - `Completed & Signed (Count)` — Green badge `#10b981`
  - `Cancelled (Count)` — Neutral gray `#64748b`
- **Search Bar:**
  - Input with magnifying glass icon: `Search patient name, Daily Token (U1, U2..), Reg #, mobile, or organ scan...`
- **Radiologist Filter Dropdown:**
  - Filter by assigned Sonologist (`All Doctors`, `Dr. S. K. Verma, MD`, `Dr. Neha Agarwal, DMRD`, etc.)

#### C. Case Queue Data Table
Columns:
1. **Daily Token / Reg No.:**
   - Daily case sequence badge (e.g., `U-01`, `U-02`, `U-03`)
   - Reg No. `#1045` (Monospace font `#0284c7`)
2. **Time & Appointment:**
   - Scan scheduled time (e.g. `10:30 AM`, `11:15 AM`)
   - Waiting duration counter (e.g., `Waiting 12 mins`)
3. **Patient Details:**
   - Full Name (Bold, 14px `#0f172a`)
   - Age / Gender (e.g. `45 Y / Male`, `28 Y / Female`)
   - Mobile Number & UHID
4. **Examination / Protocol:**
   - Scan name (e.g., `USG Whole Abdomen & Pelvis`, `Obstetric II Trimester Anomaly`, `USG KUB & Prostate`)
   - Clinical Indication / Clinical History (e.g., `Acute right iliac fossa pain`, `Hematuria`)
5. **Sonologist / Radiologist:**
   - Assigned Radiologist with credentials
6. **Status Badge:**
   - Pill badge matching status (`Waiting for Scan`, `In Scan`, `Drafted`, `Completed`, `Cancelled`)
7. **Action Buttons:**
   - `Enter Findings` / `Edit Report` (Primary or Secondary outline with Edit3 icon)
   - `View PDF Report` (Secondary with Eye icon)
   - `Print Worklist / Barcode` (Secondary with Printer icon)
   - `Status Quick-Toggle` (Mark In Scan / Mark Complete)
   - `Cancel Case` (Red Trash2 icon with confirmation modal)

---

### 2.2 Screen 2: Search Cases Archive (`/usg_cases` / `usg_reports`)

#### A. Multi-Field Filter Grid (Labsmart 7-Field Layout)
1. **Duration Preset:**
   - Options: `Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `Last 90 days`, `This month`, `Custom date range`
2. **Date Range Pickers:**
   - `From Date` & `To Date` (`DD/MM/YYYY`)
3. **Patient Identifier:**
   - `Patient Name / First Name` input
4. **Case Status:**
   - Dropdown: `All Statuses`, `Completed`, `Drafted`, `Cancelled`
5. **Referred By (Doctor):**
   - Searchable doctor dropdown (`All Referring Doctors`, `Self`, `Dr. Rajesh Gupta`, etc.)
6. **Study / Protocol Category:**
   - `All Organs`, `Whole Abdomen`, `Pelvis`, `KUB & Prostate`, `Obstetric & Fetal Doppler`, `Small Parts (Thyroid/Scrotum/Breast)`, `Musculoskeletal`
7. **Reg No. / Daily Token / UHID:**
   - Direct numerical code lookup
- **Action Buttons:**
  - `Apply Filters` (Primary Blue)
  - `Reset Filters` (Ghost / Secondary)
  - `Export to Excel / CSV` (Green button with Download icon)

#### B. Historical Sonography Ledger Table
Columns:
1. **Case Code & Reg #:** `USG-2026-098` / `#1098`
2. **Scan Date & Time:** `15-Oct-2026, 04:30 PM`
3. **Patient Profile:** Name, Age, Sex, Contact, UHID
4. **Study Performed:** Examination name + Scan tags
5. **Referring Clinician:** Doctor name + Clinic/Hospital
6. **Reporting Sonologist:** Consultant Radiologist + Registration No.
7. **Clinical Impression Summary:** 2-line snippet of the final diagnosis (e.g. `Grade-I Fatty Liver; Cholelithiasis (single 8mm calculus) without cholecystitis.`)
8. **Actions:**
   - `View & Print PDF`
   - `Edit Impression / Add Addendum`
   - `Send WhatsApp / Email`
   - `Delete Record` (with confirmation)

---

### 2.3 Screen 3: Report Templates (`/usg_templates`)

#### A. Template Management Header & Search
- **Title:** `USG Report Templates`
- **Sub-text:** `Pre-configured clinical ultrasound report templates, organ descriptions, and standard normal finding templates.`
- **Top Actions:**
  - `+ Add USG Template` (Primary Blue Button)
  - Category Filter Tabs:
    - `All Templates`
    - `Abdomen & Pelvis`
    - `Obstetrics & Gynecology`
    - `Renal & KUB`
    - `Superficial & Small Parts (Thyroid, Scrotum, Breast)`
    - `Vascular Doppler`
  - Quick Search input: `Filter templates by name or keyword...`

#### B. Template Library Card Grid / Table
Each template record displays:
- **Title:** (e.g., `USG Whole Abdomen (Normal - Male)`, `Obstetric II Trimester Anomaly Scan`, `KUB & Prostate with Post-Void Residual`)
- **Category Badge:** `Abdomen`, `Obstetric`, `Urology`, `Endocrine`
- **Key Organs Covered:** Tags showing organ sections (`Liver`, `Gallbladder`, `Pancreas`, `Spleen`, `Kidneys`, `Bladder`, `Prostate`)
- **Impression Template Preview:** The standardized conclusion text.
- **Last Modified:** Date & timestamp
- **Action Buttons:**
  - `Edit Template` (opens full rich-text organ editor)
  - `Preview Sample Report` (renders formatted sample report)
  - `Duplicate Template` (creates copy for fast customization)
  - `Delete Template`

#### C. Comprehensive Add / Edit Template Modal
- **Fields:**
  1. `Template Title` (e.g., "Normal Female Pelvis Sonography")
  2. `Category / Organ System` (Dropdown)
  3. `Clinical Indication Default` (e.g., "Routine health screening / Pelvic pain")
  4. `Structured Organ Sections`:
     - Liver parenchymal appearance & span
     - Gallbladder wall thickness & lumen
     - Common Bile Duct (CBD) diameter
     - Pancreas & Spleen
     - Bilateral Kidneys (corticomedullary distinction, size)
     - Urinary bladder & wall thickness
     - Pelvis / Reproductive organs (Uterus, Endometrium thickness, bilateral ovaries, Adnexa, Pouch of Douglas)
  5. `Standard Impression / Conclusion Textarea`
  6. `Recommendations / Advice Textarea`
  7. `Footer Buttons:` `Save Template`, `Cancel`

---

### 2.4 Screen 4: Radiologist Signatures & Seals (`/usg_signatures`)

#### A. Header & Information
- **Title:** `USG Radiologist Signatures & Doctor Seals`
- **Sub-text:** `Manage authorized digital signatures, Medical Council registrations, and official stamps for Consultant Radiologists and Sonologists.`
- **Top Action:**
  - `+ Upload New Signature` (Primary Blue Button)

#### B. Radiologist Profile Cards
Each signatory card includes:
- **Doctor Full Name:** e.g. `Dr. S. K. Verma`
- **Degrees & Qualifications:** `MBBS, MD (Radiodiagnosis), FNVIR`
- **Medical Registration Number:** `DMC-29104 (Delhi Medical Council)`
- **Department / Designation:** `Chief Consultant Radiologist & Head of Sonography`
- **Default Signatory Indicator:** `★ Default Signatory` green badge
- **Digital Signature Preview:** High-resolution transparent background signature canvas / graphic.
- **Official Seal / Stamp Preview:** Circular or rectangular clinic stamp with Doctor Registration details.
- **Controls:**
  - `Set as Default Signatory` (Radio toggle)
  - `Edit Details`
  - `Re-upload Signature Image`
  - `Delete Signatory`

#### C. Add / Edit Signature Modal
- **Inputs:**
  1. `Doctor Name` (with Dr. prefix)
  2. `Qualifications` (e.g. MBBS, DMRD / MD Radiodiagnosis)
  3. `Medical Council Registration No.` (Mandatory for PNDT compliance)
  4. `Designation / Title` (e.g. Consultant Radiologist)
  5. `Signature Upload or Pad`:
     - File dropzone (`PNG / JPEG with transparent background`)
     - Or interactive digital drawing pad (`Clear`, `Undo`)
  6. `Checkbox`: `Set as default signatory on all new USG reports`
  7. `Buttons`: `Save Signature`, `Cancel`

---

### 2.5 Screen 5: Sonography Reporting & Structured Findings Console

When a radiologist clicks **"Enter Findings"** or **"Edit Report"** from Today's Cases or Search Cases, a high-productivity clinical reporting console opens:

#### A. Patient Case Header Bar
- Patient Name, Age, Gender, Reg #, Daily Token, Ref Doctor, Examination Date.
- `Quick Load Template` dropdown: instantly populates all organ sections from saved templates.

#### B. Structured Organ Findings Tabs / Accordions
1. **Upper Abdomen:**
   - **Liver:** Size (cm), Echo pattern (Normal / Grade-I fatty / Grade-II fatty / Cirrhotic), Focal lesions, Intrahepatic biliary radicles.
   - **Gallbladder:** Distension, Wall thickness (mm), Calculi (Single / Multiple / Solitary, size in mm), Sludge, Pericholecystic fluid.
   - **Biliary Ducts:** CBD diameter (normal < 6mm).
   - **Pancreas:** Visualized portions, Echogenicity, Pancreatic duct diameter.
   - **Spleen:** Size in bipolar length (cm), Parenchymal texture, Splenic hilum.
2. **Renal & Urinary Tract (KUB):**
   - **Right Kidney:** Size (Length x Width in cm), Cortical thickness (mm), CMD (Preserved / Blunted), Calculi, Hydronephrosis (Nil / Mild / Moderate / Severe).
   - **Left Kidney:** Size (Length x Width in cm), Cortical thickness (mm), CMD, Calculi, Hydronephrosis.
   - **Urinary Bladder:** Distension, Wall thickness, Intraluminal mass / calculi, Pre-void volume (ml), Post-void residual (PVR ml).
3. **Pelvis & Reproductive:**
   - **Male (Prostate):** Dimensions, Volume (cc), Median lobe enlargement, Parenchymal echotexture.
   - **Female (Pelvis):** Uterus position (Anteverted / Retroverted), Dimensions, Endometrial thickness (mm), Myometrium (Fibroid / Normal), Right Ovary (Dimensions / Follicles / Cyst), Left Ovary, Pouch of Douglas (Free fluid / Clear).
4. **Obstetric Biometry (if Obstetric study selected):**
   - Gestational sac, Fetal pole, CRL, BPD, HC, AC, FL, Estimated Fetal Weight (EFW in grams), Liquor / AFI (cm), Placenta location and maturity grade, Fetal Heart Rate (bpm).
5. **Impression & Recommendations (Highlighted Box):**
   - Rich conclusion text box with uppercase summary.
   - Differential diagnosis / Correlative advice (e.g. `Correlate with serum amylase and follow up scan in 4 weeks`).
6. **Signatory Selection:**
   - Radiologist dropdown with signature stamp preview.
7. **Action Bar:**
   - `Save as Draft`
   - `Verify & Sign Off`
   - `Print / Preview PDF`
   - `Close / Cancel`

---

## 3. Comparison: Live Labsmart LIS vs. Current Codebase

| Area / Feature | Live Labsmart LIS Standard | Current Codebase (`MedicalProject`) | Status / Deficiencies | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Today's Cases UI** | Daily case queue, date navigator (`< Today >`), status tabs (All, Waiting, In Scan, Completed), token sequence (`U1`, `U2`), radiologist assignment, PNDT compliance tag. | Basic table with 2 static rows, rudimentary search, basic status dropdown. | ⚠️ Incomplete | Overhaul [USGWorklistPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGWorklistPage.tsx): add date navigator, real-time status pills, daily token badges (`U-01`, `U-02`), organ scan categories, comprehensive mock cases, and PNDT notice. |
| **Search Cases Archive** | 7-field filter grid (Duration preset, Date range, Patient name, Status, Ref Doctor, Organ Category, Reg #), historical ledger, and PDF viewer. | 4 basic inputs (`Search`, `Organ`, `From`, `To`), minimal columns, no quick presets. | ⚠️ Under-featured | Overhaul [USGReportsPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGReportsPage.tsx): implement full 7-field filter panel, preset buttons, impression highlights, and PDF export dialog. |
| **Report Templates** | Standard clinical library for Whole Abdomen, KUB, Obstetric, Thyroid, Scrotum, TVS, Breast; organ section breakdown, one-click load into reporting. | 6 basic text templates with single findings textarea. | ⚠️ Basic | Overhaul [USGTemplatesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGTemplatesPage.tsx): expand template catalog with complete organ checklists, category pills, duplicate template action, and rich organ editor. |
| **Signatures & Seals** | Radiologist profile card with qualifications, Registration Number, signature preview image, default badge, default toggle. | Basic card layout with text representation, limited controls. | ⚠️ Basic | Overhaul [USGSignaturesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGSignaturesPage.tsx): enhance with high-fidelity signature stamps, PNDT registration badge, qualification tags, and file/pad upload modal. |
| **Reporting / Findings Console** | Multi-organ findings entry with quantitative measurement inputs (liver span, kidney sizes, bladder volume, prostate cc) and 1-click template insertion. | Simple modal with 5 raw text inputs. | ⚠️ Under-featured | Implement structured Sonography Reporting Console in [USGWorklistPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGWorklistPage.tsx) with organ accordion, quantitative measurements, quick-template selector, and sign-off workflow. |

---

## 4. Implementation Plan & Execution Sequence

1. **Update [src/pages/lab/USGWorklistPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGWorklistPage.tsx)**:
   - Full Labsmart-styled header with Date Step Navigator (`<`, `Today`, `>`).
   - Status counter pills (`All`, `Waiting for Scan`, `In Scan Room`, `Completed & Signed`, `Cancelled`).
   - Daily sequence tokens (`U-01`, `U-02`, `U-03`, `U-04`...) with modality indicators.
   - Full Sonography Reporting Drawer / Modal with:
     - Organ accordion (Liver, Gallbladder, Spleen, Pancreas, Kidneys, Bladder, Pelvis/Prostate/Uterus).
     - Biometric inputs (Liver span in cm, Renal measurements, PVR, Prostate volume).
     - 1-click template loading.
     - Radiologist sign-off and live status update.
   - PNDT statutory compliance indicator.
   - Rich Preview modal for formatted sonography report.

2. **Update [src/pages/lab/USGReportsPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGReportsPage.tsx)**:
   - Implement complete 7-field filter grid matching Labsmart's case search.
   - Quick date preset pills (`Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `This month`).
   - Rich data table with case tokens, patient demographics, clinical impression snippets, and quick actions.
   - PDF Report Viewer modal with letterhead and doctor seal.

3. **Update [src/pages/lab/USGTemplatesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGTemplatesPage.tsx)**:
   - Comprehensive organ template catalog:
     1. Whole Abdomen & Pelvis (Male)
     2. Whole Abdomen & Pelvis (Female)
     3. KUB & Urinary Bladder with PVR
     4. Obstetric II Trimester Anomaly Scan
     5. Obstetric Early Pregnancy / I Trimester
     6. Pelvic Sonography (Transvaginal / TVS)
     7. Thyroid & Neck Soft Tissue
     8. Scrotal & Testicular Doppler
     9. Bilateral Breast Sonography (BIRADS)
   - Category filter tabs (`All`, `Abdomen & Pelvis`, `Obstetric & Gynae`, `Renal / KUB`, `Small Parts`, `Doppler`).
   - Duplicate, Edit, Preview, and Delete actions with full modal editor.

4. **Update [src/pages/lab/USGSignaturesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/USGSignaturesPage.tsx)**:
   - Radiologist profiles with Medical Council Registration badges.
   - Visual digital signature & clinic stamp previews.
   - Default signatory toggle with radio switch.
   - New signatory upload modal with qualification degrees and registration council picker.

5. **Validation & Build**:
   - Run `npm run build` to verify 0 TypeScript/Vite errors.
   - Verify on local browser via Chrome DevTools MCP.
