# Labsmart LIS — USG (Ultrasound) Module Specification

**Specification ID:** `SPEC-04-USG-ULTRASOUND`  
**Module Name:** Ultrasound Modality Workflow, Room Queue Management, Structured Organ Findings, Quantitative Biometry & PNDT Compliance  
**Target Routes:** `/usg_cases/today`, `/usg_cases`, `/usg_templates`, `/usg_signatures`  
**Source Components:**
- `src/pages/lab/USGWorklistPage.tsx`
- `src/pages/lab/USGReportsPage.tsx`
- `src/pages/lab/USGTemplatesPage.tsx`
- `src/pages/lab/USGSignaturesPage.tsx`

---

## 1. Executive Summary & Clinical Architecture

Ultrasound (Sonography) is operator-dependent and produces narrative, organ-structured, qualitative examinations paired with quantitative biometry. The **USG Module** manages:
1. **Patient Queue Progression**: Patient arrival -> room preparation -> active scan -> draft transcription -> consultant radiologist electronic authorization.
2. **Standardized Organ Protocols**: Pre-defined diagnostic templates for Whole Abdomen, KUB & Prostate, Obstetric Anomaly (Level II), Pelvic TVS, Thyroid, Scrotum, and Musculoskeletal.
3. **Structured Biometric Measurements**: Specific numeric metrics (e.g. liver span, cortical thickness, prostate volume, gestational biometrics) saved alongside descriptive organ texts.
4. **PNDT Statutory Compliance**: Indian PC-PNDT Act compliance preventing prenatal sex determination, mandatory registration numbers, Form F audit trail generation, and statutory disclaimers.

---

## 2. Screen 1: USG Worklist / Today (`/usg_cases/today`)

### 2.1 Header & Top Controls
1. **Page Title**: `Ultrasound (USG) — Today's Cases` (`h1`, 24px, font-weight 700).
2. **Sub-text**: `Daily sonography patient queue, room status, scan protocol, and radiologist reporting.`
3. **PNDT Compliance Badge**: Green/Blue pill badge: `PC-PNDT Compliant • Form F Registry Active`.
4. **Action Buttons**:
   - `+ Register USG Case` (Primary Blue): Opens quick USG booking modal.
   - `+ New Bill` (Green Outline): Direct shortcut to general billing.
   - `Date Step Navigator`: `< Previous Day`, Date Picker (`19/10/2026`), `Next Day >`.
   - `Refresh` button with live queue counter.

### 2.2 Status Tabs & Filter Controls
- **Queue Status Pills**:
  * `All Cases (Count)`: Total booked today.
  * `Waiting for Scan (Count)`: Patient registered, waiting in lounge (`#f59e0b` amber badge).
  * `In Scan Room (Count)`: Patient positioned on sonography couch (`#2563eb` blue badge).
  * `Completed & Signed (Count)`: Authorized report (`#10b981` green badge).
  * `Cancelled (Count)`: Voided cases (`#64748b` gray badge).
- **Search Bar**: Instant filter across patient name, token (e.g. `U-01`), Reg No, mobile, or organ study.
- **Sonologist Filter Dropdown**: Filter by assigned Radiologist (`Dr. S. K. Verma, MD`, `Dr. Neha Agarwal, DMRD`, etc.).

---

### 2.3 Case Queue Data Table Structure

| Column Header | Format & Content |
| :--- | :--- |
| **DAILY TOKEN & REG #** | Token badge (`U-01`, `U-02`) + Reg No link (`#1001`). |
| **TIME & APPOINTMENT** | Scheduled time (`09:30 AM`) + Waiting duration timer (`Waiting 15 mins`). |
| **PATIENT DETAILS** | Full Name (`Suresh Mehta`), Age/Gender (`52Y / Male`), Mobile, UHID. |
| **EXAMINATION & PROTOCOL**| Scan name (`USG Whole Abdomen & Pelvis`) + Clinical Indication (`Upper abdominal discomfort, dysuria`). |
| **SONOLOGIST & REFERRER** | Assigned Radiologist (`Dr. S. K. Verma, MD`) + Ref Doctor (`Dr. Rajesh Gupta, MD`). |
| **EXAM STATUS** | Status badge (`Waiting for Scan`, `In Scan`, `Completed`). |
| **ACTIONS** | Primary: `Enter Findings` / `Edit Findings` (`<Edit3 size={15} />`), Secondary: `View PDF Report` (`<Eye size={15} />`), Utility: `Print Worklist / Barcode` (`<Printer size={15} />`), `Cancel` (`<Trash2 size={15} />`). |

---

## 3. Screen 2: Enter & Edit USG Findings Workspace Modal

Triggered by `Enter Findings` button on any worklist row.

### 3.1 Patient Context & Indication
- Displays Patient Name, UHID, Reg No, Age/Sex, Clinical Indication.
- Preset Selector: Dropdown to insert pre-configured template (e.g. `Normal Whole Abdomen (Male)`, `Normal KUB & Prostate`, `Fatty Liver Grade 1`, `Cholelithiasis`).

### 3.2 Quantitative Biometry Input Grid

| Measurement Field | Input Type | Default Unit | Normal Adult Reference Range | Clinical Significance |
| :--- | :--- | :--- | :--- | :--- |
| `Liver Span` | Numeric | `cm` | `12.0 - 15.5 cm` | Hepatomegaly screening |
| `Portal Vein Caliber` | Numeric | `mm` | `8.0 - 12.0 mm` | Portal hypertension screening |
| `Common Bile Duct (CBD)`| Numeric | `mm` | `3.0 - 6.0 mm` | Biliary obstruction (> 7mm dilated) |
| `Spleen Bipolar Length` | Numeric | `cm` | `8.0 - 12.0 cm` | Splenomegaly screening |
| `Right Kidney Dimensions`| Text | `cm` | `9.0 - 12.0 x 4.0 - 6.0` | Renal size and cortical atrophy |
| `Left Kidney Dimensions` | Text | `cm` | `9.0 - 12.5 x 4.0 - 6.0` | Renal size symmetry |
| `Bladder PVR Volume` | Numeric | `mL` | `< 30 mL` | Post-void residual urinary retention |
| `Prostate Volume` | Numeric | `cc / g` | `15.0 - 25.0 cc` | Benign Prostatic Hyperplasia (BPH) |

---

### 3.3 Structured Organ Findings Textareas

Each anatomical organ has an independent rich-text section initialized with normal anatomical descriptions:
1. **Liver**: Surface contour, parenchymal echogenicity, focal lesions, hepatic veins.
2. **Gallbladder**: Distension, wall thickness (normal $< 3\text{ mm}$), calculi, sludge, acoustic shadowing.
3. **Biliary Tree**: Intrahepatic biliary radicles (IHBR), common hepatic duct, CBD caliber.
4. **Spleen**: Size, echotexture, splenic hilum vessels.
5. **Pancreas**: Visualized head, uncinate process, body, tail, main pancreatic duct (MPD).
6. **Kidneys**: Corticomedullary differentiation, central sinus echo complex, hydronephrosis (pelvicalyceal separation), calculi, cysts.
7. **Urinary Bladder**: Wall contour, pre-void volume, post-void residual (PVR) volume.
8. **Pelvis (Male / Female)**:
   - Male: Prostate gland size, parenchymal echotexture, median lobe enlargement.
   - Female: Uterus dimensions, orientation (Anteverted/Retroverted), myometrial echotexture, endometrial stripe thickness (mm), right & left ovaries (dimensions, follicles).
9. **Peritoneal Cavity**: Presence of free fluid (ascites) in Morison's pouch, pelvis, or paracolic gutters.
10. **IMPRESSION (Capitalized Conclusion)**:
    - Summary diagnosis (e.g. `1. NORMAL ULTRASONOGRAPHIC STUDY OF WHOLE ABDOMEN & PELVIS.` or `1. GRADE-1 FATTY LIVER INFILTRATION. 2. CHOLELITHIASIS (SINGLE 8 MM CALCULUS).`).
11. **Recommendations / Advice**: Follow-up advice (e.g. `Correlate clinically and with LFT`).

---

### 3.4 PNDT Mandatory Declaration Checkbox
- When saving Obstetric / Antenatal USG, a mandatory statutory confirmation is enforced:
  `[x] Statutory Declaration: I, Dr. {RadiologistName}, hereby declare that I have neither detected nor disclosed the sex of the fetus to the patient or any relative, as per the PC-PNDT Act, 1994.`
- Without checking this box, report authorization is strictly blocked.

---

## 4. Screen 3 & 4: USG Templates & Radiologist Signatures

### 4.1 USG Templates Master (`/usg_templates`)
- Pre-configured diagnostic templates:
  * `Normal Whole Abdomen & Pelvis (Male)`
  * `Normal Whole Abdomen & Pelvis (Female)`
  * `Normal KUB & Prostate`
  * `Obstetric Scan (First Trimester 6-10 Weeks)`
  * `Obstetric Scan (Level II / Target Anomaly 18-20 Weeks)`
  * `Transvaginal Sonography (TVS) Pelvis`
  * `Thyroid & Parathyroid High Resolution Sonogram`
  * `Scrotal & Testicular Doppler`
- Template builder allows editing normal boilerplate text, tokens, and organ sub-sections.

### 4.2 Radiologist Signatures & Credentials (`/usg_signatures`)
- Radiologist Profile:
  * Full Name: `Dr. S. K. Verma`
  * Qualifications: `MBBS, MD (Radiodiagnosis)`
  * State Medical Council Reg No: `DMC-R-49102`
  * PNDT Registration No: `PNDT-DL-2022-891`
  * Digital Signature Image: Transparent `.png` signature asset with verification seal.
  * Setting as default reporting radiologist.

---

## 5. Backend API Specifications & Architecture

### 5.1 Endpoints Supporting USG Modality

#### 1. GET `/api/v1/usg/worklist`
- **Purpose**: Retrieves daily ultrasound worklist.
- **Query Parameters**: `date=2026-10-19&status=ALL`
- **Response JSON (200 OK)**:
```json
[
  {
    "id": "case-usg-001",
    "token": "U-01",
    "regNo": "1001",
    "patientName": "Suresh Mehta",
    "ageGender": "52Y / Male",
    "uhid": "UHID-89201",
    "investigation": "USG Whole Abdomen & Pelvis",
    "indication": "Upper abdominal discomfort, dysuria",
    "sonologist": "Dr. S. K. Verma, MD Radiodiagnosis",
    "status": "Completed"
  }
]
```

#### 2. POST `/api/v1/usg/cases/:id/findings`
- **Purpose**: Persists structured organ findings and biometric measurements.
- **Request Body JSON**:
```json
{
  "status": "Completed",
  "measurements": {
    "liverSpanCm": "14.2",
    "portalVeinMm": "10.5",
    "cbdDiameterMm": "4.2",
    "spleenLengthCm": "10.1",
    "rightKidneyCm": "10.4 x 4.6",
    "leftKidneyCm": "10.7 x 4.8",
    "bladderPvrMl": "18",
    "prostateVolumeCc": "22"
  },
  "findings": {
    "liver": "Normal in size (14.2 cm). Smooth contour, homogeneous echotexture.",
    "gallBladder": "Well distended, wall thickness normal (2.3 mm). No calculus.",
    "biliaryTree": "CBD measures 4.2 mm, within normal limits.",
    "spleen": "Normal size (10.1 cm).",
    "pancreas": "Visualized portions normal.",
    "kidneys": "Both kidneys normal in size, shape, and cortical thickness.",
    "urinaryBladder": "Normal distension. PVR volume 18 ml.",
    "pelvis": "Prostate normal in size (22 cc).",
    "impression": "NORMAL ULTRASONOGRAPHIC STUDY OF WHOLE ABDOMEN & PELVIS.",
    "recommendations": "Clinical correlation recommended."
  },
  "signatureId": "sig-usg-01",
  "pndtConfirmed": true
}
```
- **Business Logic Execution**:
  1. If obstetric scan, validates `pndtConfirmed == true`.
  2. Stores serialized findings in `RadiologyReport` database table.
  3. Updates parent `Case.reportStatus = 'Signed Off'`.
  4. Generates PDF with digital radiologist stamp and sends WhatsApp notification link.
- **Response JSON (200 OK)**:
```json
{
  "reportId": "rep-usg-001",
  "status": "Completed",
  "pdfUrl": "https://storage.labsmart.internal/radiology/USG-1001.pdf"
}
```
