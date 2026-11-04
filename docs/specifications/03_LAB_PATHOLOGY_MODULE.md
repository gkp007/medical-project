# Labsmart LIS — Lab (Pathology) Module Specification

**Specification ID:** `SPEC-03-LAB-PATHOLOGY`  
**Module Name:** Laboratory Diagnostics Lifecycle, Worklists, Clinical Parameter Entry, Auto-Formulas, Delta Checks, Report Verification & Interpretations  
**Target Routes:** `/lab_reports/today`, `/lab_reports`, `/lab_reports/:id/results`, `/lab_reports/:id/viewer`, `/interpretations`, `/interpretations_library`, `/lab_test_counts`  
**Source Components:**
- `src/pages/lab/TodayReportsPage.tsx`
- `src/pages/lab/SearchReportsPage.tsx`
- `src/pages/lab/EnterResultsPage.tsx`
- `src/pages/lab/ReportViewerPage.tsx`
- `src/pages/lab/InterpretationsPage.tsx`
- `src/pages/lab/InterpretationsLibraryPage.tsx`
- `src/pages/lab/TestCountsPage.tsx`

---

## 1. Executive Summary & Diagnostic Lifecycle

The **Lab (Pathology)** module is the core clinical engine of the laboratory information system. It orchestrates the four primary phases of laboratory medicine:
1. **Pre-Analytical Phase**: Specimen receipt, barcode tube labeling, accessioning, and bench worklist assignment (`Today's reports`).
2. **Analytical Phase**: Parameter entry, automated calculations (e.g. MCV, MCH, MCHC, eGFR, Globulin, A/G Ratio), abnormal value highlighting, panic range flags, and analyzer interfacing (`Enter results`).
3. **Post-Analytical Phase**: Pathologist clinical interpretation assignment, delta checks against patient longitudinal history, digital signature authorization, and NABL-compliant report generation (`Report viewer`).
4. **Knowledgebase & Throughput Analytics**: 500+ clinical interpretation templates (`Interpretations library`) and instrument throughput tracking (`Test counts`).

---

## 2. Screen 1: Today's Reports Bench (`/lab_reports/today`)

### 2.1 Header & Worklist Controls
1. **Page Title**: `Reports for today` (`h1`, 24px, font-weight 700).
2. **Date Step Navigator**:
   - `<` Previous Day Button
   - Date Display: `19/10/2026` (Clicking opens calendar picker)
   - `>` Next Day Button
   - Quick jump: `Stats` link button (navigates directly to `/lab_test_counts` for the selected date).
3. **Sort By Combobox**:
   - Options: `Oldest first` (Default - FIFO queue) vs `Recent first`.
4. **Status Filter Segmented Pills (with live counters)**:
   - `All (3)`: All cases booked for selected date.
   - `New (1)`: Registered cases awaiting phlebotomy or result entry (`#64748b` gray badge).
   - `In progress (1)`: Samples in analyzer processing or partial results saved (`#b45309` amber badge).
   - `Final (0)`: Technologist verified, pending pathologist authorization.
   - `Signed off (1)`: Doctor authorized, ready for distribution (`#15803d` green badge).
5. **Print Tracker Badge**:
   - Metric: `X/Y Printed` (e.g. `1/3 Printed` with `<Printer size={14} />`).
6. **Real-time Page Search Input**:
   - Placeholder: `Search patient name, reg no, test name...` (filters table in real-time).

### 2.2 Reports Table Structure
Columns:
1. `REG. NO. & DAILY CODE`:
   - Reg No: `#1001` (Primary bold link).
   - Daily Counter: `L1` (Blue monospace badge).
2. `DATE/TIME`: Registration timestamp (e.g. `19/10/2026 09:30 AM`).
3. `PATIENT`:
   - Full Name (Bold, e.g. `Rahul Sharma`).
   - Demographics: `32 YRS/M`.
   - Contact: Phone trigger (`9876543210`).
4. `REFERRED BY`: Doctor name (`Dr. Anil Verma`) + Degree (`MBBS, MD`).
5. `TESTS`: Investigations ordered (e.g. `Complete Blood Count (CBC)`).
6. `CC`: Collection Centre indicator (`Main` or `City Care AG-102`).
7. `STATUS`: Status pill badge (`Signed off`, `In progress`, `New`).
8. `ACTIONS`:
   - Primary Action Button:
     * If `New` or `In progress`: `Enter results` (Primary Blue button).
     * If `Signed off`: `View report` (Secondary outline button).
   - 3-Dot Meatball Menu:
     * `Modify Case`: Opens edit bill.
     * `Cancel Case`: Opens `CancelBillModal`.
     * `Print Specimen Barcode`: Opens barcode thermal preview dialog.

### 2.3 Specimen Tube Barcode Modal
- Displays 2x1 inch barcode sticker with:
  * Patient Name & Age/Sex
  * Barcode Symbol (Code 128) encoding `REGNO-TESTCODE` (e.g. `1001-EDTA`)
  * Sample Container Color Tag (Lavender for EDTA, Yellow for SST Gel, Grey for Fluoride)

---

## 3. Screen 2: Search Reports Archive (`/lab_reports`)

### 3.1 8-Field Advanced Filter Grid
1. `Duration`: Presets (`Past 7 days` [Default], `Today`, `Yesterday`, `Past 30 days`, `Past 90 days`, `Custom Range`).
2. `Patient first name`: Substring search.
3. `Status`: Dropdown (`All`, `New`, `In progress`, `Final`, `Signed off`).
4. `Referred by`: Combobox with search autocomplete for consulting clinicians.
5. `Reg. no.`: Direct integer case search.
6. `Daily case no.`: Modality daily code search (`L1`, `L2`).
7. `UHID`: Patient Master Health ID lookup.
8. `Collapsible Advanced Filters`:
   - `Select test`: Filter cases containing specific investigations (e.g. CBC, Widal).
   - `Collection centre`: Filter by branch.

---

## 4. Screen 3: Enter Results Diagnostic Workspace (`/lab_reports/:id/results`)

### 4.1 Header Banner & Specimen Timestamps
- **Patient Context Banner**:
  * Reg No `#1001`, Daily Code `L1`, Patient `Rahul Sharma (32 YRS / M)`, Referred By `Dr. Anil Verma (MBBS, MD)`.
  * Status Badge: `Signed off` | `In progress` | `New`.
- **Pre-Analytical Audit Timestamps**:
  * `Sample Collected`: Date & Time (`2026-10-18 19:00`).
  * `Sample Received in Lab`: Date & Time (`2026-10-18 19:15`).
  * `Report Authorized`: Date & Time (`2026-10-18 19:26`).

### 4.2 Print Layout Configuration Toggles
- `[x] Print categories from new page`
- `[x] Print ready`
- `[x] Keep in same page`
- `[ ] Print from new page`
- `[ ] Page break after`
- `[ ] Skip clinical interpretation`

---

### 4.3 Diagnostic Parameter Entry Matrix

Parameters are organized hierarchically with subtests indented under primary profiles.

| S.No | Parameter Name | Hierarchy | Data Type | Default Unit | Biological Reference Interval | Lower Bound | Upper Bound | Formula / Calculation |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| 1 | **Hemoglobin (Hb)** | Parent | Numeric | `g/dL` | `13.0 - 17.0` | 13.0 | 17.0 | Direct analyzer / Manual |
| 2 | **Total Leukocyte Count (TLC)**| Parent | Numeric | `cumm` | `4,800 - 10,800`| 4800 | 10800 | Direct analyzer |
| 3 | **Neutrophils** | Subtest (DLC)| Numeric | `%` | `40 - 80` | 40.0 | 80.0 | DLC count |
| 4 | **Lymphocytes** | Subtest (DLC)| Numeric | `%` | `20 - 40` | 20.0 | 40.0 | DLC count |
| 5 | **Eosinophils** | Subtest (DLC)| Numeric | `%` | `1 - 6` | 1.0 | 6.0 | DLC count |
| 6 | **Monocytes** | Subtest (DLC)| Numeric | `%` | `2 - 10` | 2.0 | 10.0 | DLC count |
| 7 | **Basophils** | Subtest (DLC)| Numeric | `%` | `< 2` | 0.0 | 2.0 | DLC count |
| 8 | **Platelet Count** | Parent | Numeric | `lakhs/cumm` | `1.5 - 4.1` | 1.5 | 4.1 | Direct analyzer |
| 9 | **Total RBC Count** | Parent | Numeric | `million/cumm`| `4.5 - 5.5` | 4.5 | 5.5 | Direct analyzer |
| 10 | **Hematocrit (PCV / Hct)** | Calculated | Numeric | `%` | `40.0 - 50.0` | 40.0 | 50.0 | $\text{Hct} = \frac{\text{RBC} \times \text{MCV}}{10}$ or $\text{Hb} \times 3$ |
| 11 | **MCV** | Calculated | Numeric | `fL` | `83.0 - 101.0` | 83.0 | 101.0 | $\text{MCV} = \frac{\text{Hct} \times 10}{\text{RBC}}$ |
| 12 | **MCH** | Calculated | Numeric | `pg` | `27.0 - 32.0` | 27.0 | 32.0 | $\text{MCH} = \frac{\text{Hb} \times 10}{\text{RBC}}$ |
| 13 | **MCHC** | Calculated | Numeric | `%` | `31.5 - 34.5` | 31.5 | 34.5 | $\text{MCHC} = \frac{\text{Hb} \times 100}{\text{Hct}}$ |
| 14 | **RDW-CV** | Optional | Numeric | `%` | `11.6 - 14.0` | 11.6 | 14.0 | Analyzer index |
| 15 | **RDW-SD** | Optional | Numeric | `fL` | `39.0 - 46.0` | 39.0 | 46.0 | Analyzer index |

#### Real-Time Input Evaluation & Flagging Rules:
1. **Normal Range**: If $\text{Lower} \le \text{Value} \le \text{Upper}$, renders in neutral `#1e293b`.
2. **Abnormal Alert**: If $\text{Value} < \text{Lower}$ or $\text{Value} > \text{Upper}$, input border turns `#f87171` with bold red badge:
   - `L` (Low) badge for sub-normal values.
   - `H` (High) badge for elevated values.
3. **Critical Panic Range Alert**:
   - Triggers modal alert if value enters life-threatening threshold (e.g. Potassium $< 2.5$ or $> 6.5\text{ mEq/L}$, Hemoglobin $< 6.0\text{ g/dL}$, Platelets $< 20,000\text{ cumm}$).
   - Prompts technologist to perform immediate repeat verification and log physician notification call.

### 4.4 Automated Clinical Formulas Engine
The backend and frontend execute the following standard diagnostic formulas:
1. **Absolute Neutrophil Count (ANC)**:
   $$\text{ANC} = \frac{\text{TLC} \times \text{Neutrophils \%}}{100}$$
2. **Total Globulin**:
   $$\text{Globulin} = \text{Total Protein} - \text{Albumin}$$
3. **A/G Ratio**:
   $$\text{A/G Ratio} = \frac{\text{Albumin}}{\text{Globulin}}$$
4. **Indirect (Unconjugated) Bilirubin**:
   $$\text{Indirect Bilirubin} = \text{Total Bilirubin} - \text{Direct Bilirubin}$$
5. **eGFR (CKD-EPI 2021 Creatinine Formula)**:
   $$\text{eGFR} = 142 \times \min(S_{cr}/\kappa, 1)^\alpha \times \max(S_{cr}/\kappa, 1)^{-1.200} \times 0.9938^{\text{Age}} \times [1.012 \text{ if Female}]$$

### 4.5 Left Drawer Clinical Utilities
- **Patient Tab**: Displays UHID, DOB, Blood Group, Emergency Contact, Address.
- **Doctor Tab**: Consulting Doctor qualifications, clinic, phone.
- **History (Delta Checks) Tab**: Side-by-side chronological comparison of the patient's previous 5 test results. Highlights sudden variance ($> 20\%$ shift) indicating sample mix-up or acute clinical decompensation.
- **Audit Tab**: Time and staff username for every keystroke and value change.

### 4.6 Verification & Sign-Off Actions
1. `Save Draft`: Keeps status as `In progress`.
2. `Mark as Final`: Status becomes `Final` (Technologist verification).
3. `Verify & Sign-Off`: Opens `ConfirmationModal`. On confirmation:
   - Status updates to `Signed off`.
   - Affixes Pathologist digital signature seal and MCI registration number.
   - Triggers automated WhatsApp / SMS delivery of secure PDF download link.
   - Redirects to `/lab_reports/:id/viewer`.

---

## 5. Screen 4: Report Viewer & Letterhead Calibration (`/lab_reports/:id/viewer`)

### 5.1 Official Diagnostic Report Paper Sheet Layout
- **Page Canvas**: Rendered in standard A4 (`210mm x 297mm`) format.
- **Header Section**:
  * Lab Name: `Metropolis Diagnostics & Research Center` (22px bold).
  * Accreditation: `ISO 15189:2012 Certified • NABL Accredited Laboratory`.
  * Address & Helpline.
  * Verified & Authorized Green Stamp.
- **Patient Demographics Grid (4-Column Layout)**:
  * Patient Name, Age / Gender, Referring Doctor, Case / Bill No, Sample Collected, Sample Reported.
- **Observation Results Table**:
  * Columns: `Test Description`, `Value Observed`, `Units`, `Biological Reference Interval`.
  * Abnormal values rendered in bold with explicit `(High)` or `(Low)` markers.
- **Clinical Remarks & Interpretation**:
  * Smear morphology notes (e.g. `RBCs are predominantly normocytic and normochromic`).
  * Full pathology interpretation text.
- **Digital Signatures & Authentication**:
  * Left: Medical Laboratory Technologist (MLT).
  * Right: Consultant Pathologist (MD Pathology) with digital signature image, qualification, and Medical Council registration number.
- **QR Code Verification**:
  * Scannable QR code linking to digital validation URL: `https://verify.labsmart.in/rep/1001-CBC-AUTH`.

---

## 6. Screen 5 & 6: Interpretations & Test Counts

### 6.1 Clinical Interpretations Library (`/interpretations_library`)
- Contains 500+ standard clinical interpretations across:
  * Haematology (Anemias, Leukocytosis, Thrombocytopenia)
  * Biochemistry (Liver disorders, Renal impairment, Diabetic profiles, Dyslipidemia)
  * Serology (Typhoid Widal interpretation table, Dengue NS1/IgM/IgG stage interpretation)
  * Endocrinology (Thyroid T3/T4/TSH subclinical vs overt matrix)
- **Editor Controls**: Rich-text WYSIWYG editor supporting bold, italic, bullet points, tables, and auto-tokens (`{PATIENT_NAME}`, `{AGE}`, `{OBSERVED_VALUE}`, `{REF_RANGE}`).

### 6.2 Test Counts & Workload Intelligence (`/lab_test_counts`)
- Daily & monthly test volume aggregation.
- Filter by date range, department, and collection center.
- Provides reagent consumption estimates based on test throughput.

---

## 7. Backend API Specifications & Architecture

### 7.1 Endpoints Required by Lab Pathology

#### 1. GET `/api/v1/pathology/worklist/today`
- **Purpose**: Returns today's laboratory bench queue.
- **Query Parameters**: `date=2026-10-19&status=All&sortBy=oldest`
- **Response JSON (200 OK)**:
```json
[
  {
    "caseId": "case-30583846",
    "regNo": "1001",
    "dailyCode": "L1",
    "dateTime": "2026-10-19T09:30:00Z",
    "patient": {
      "name": "Rahul Sharma",
      "age": 32,
      "gender": "Male",
      "phone": "9876543210"
    },
    "doctor": "Dr. Anil Verma, MBBS MD",
    "tests": ["Complete Blood Count (CBC)"],
    "centre": "Main",
    "status": "Signed off",
    "isPrinted": true,
    "barcode": "1001-EDTA"
  }
]
```

#### 2. GET `/api/v1/pathology/cases/:id/parameters`
- **Purpose**: Loads test parameters, reference intervals, historical delta check values for entry.
- **Response JSON (200 OK)**:
```json
{
  "caseId": "case-30583846",
  "regNo": "1001",
  "patient": {
    "name": "Rahul Sharma",
    "age": 32,
    "gender": "Male"
  },
  "timestamps": {
    "collectedAt": "2026-10-18T19:00:00Z",
    "receivedAt": "2026-10-18T19:15:00Z",
    "reportedAt": "2026-10-18T19:26:00Z"
  },
  "parameters": [
    {
      "id": "param-hb",
      "name": "Hemoglobin",
      "value": "14.5",
      "unit": "g/dL",
      "reference": "13 - 17",
      "lower": 13.0,
      "upper": 17.0,
      "isCalculated": false,
      "deltaHistory": [
        { "date": "2026-08-14", "value": "14.2" },
        { "date": "2026-04-10", "value": "13.9" }
      ]
    }
  ],
  "interpretation": "Normal hemogram with normocytic normochromic red cell morphology."
}
```

#### 3. POST `/api/v1/pathology/cases/:id/results`
- **Purpose**: Saves parameter results and updates report status.
- **Request Body JSON**:
```json
{
  "status": "Signed off",
  "parameterValues": [
    { "paramId": "param-hb", "value": "14.5" },
    { "paramId": "param-tlc", "value": "7800" },
    { "paramId": "param-plt", "value": "2.5" }
  ],
  "interpretation": "Normal hemogram with normocytic normochromic red cell morphology.",
  "technologistNotes": "Slide examined under 100x oil immersion.",
  "signatureId": "sig-path-01",
  "dispatchNotifications": true
}
```
- **Business Logic Execution**:
  1. Validates numeric values and auto-evaluates formulas (`MCV`, `MCH`, `MCHC`, `Hct`).
  2. Flags values exceeding lower/upper bounds.
  3. Updates `ClinicalResult` table with serialized parameter values and authorizer timestamp.
  4. Updates `Case.reportStatus = 'Signed Off'`.
  5. Generates encrypted PDF report file and saves to object store.
  6. Dispatches WhatsApp notification containing signed download token.
- **Response JSON (200 OK)**:
```json
{
  "caseId": "case-30583846",
  "reportStatus": "Signed off",
  "pdfUrl": "https://storage.labsmart.internal/reports/BL-2026-1001-CBC.pdf",
  "qrVerificationCode": "1001-CBC-AUTH",
  "notificationStatus": {
    "smsDispatched": true,
    "whatsappDispatched": true
  }
}
```
