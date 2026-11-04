# Digital X-ray Module — Frontend Specification & Audit

> **Live System Reference:** [Labsmart LIS](https://app.labsmartlis.com/71122710) — Digital X-ray & Diagnostic Radiography Module  
> **Document Code:** `DigitalXRayFrontend.md`  
> **Target Base:** `MedicalProject` React + TypeScript SPA  
> **Routing Namespace:** `xray_today`, `xray_reports`, `xray_templates`, `xray_signatures`  

---

## 1. Executive Summary & Architecture Overview

The **Digital X-ray** module in Labsmart LIS is built for Diagnostic Radiography Centers, Imaging Clinics, and Hospital X-ray departments operating Computed Radiography (CR) and Direct Digital Radiography (DR) systems. Unlike automated pathology tests, Radiography workflows encompass:
1. **Radiation Safety & AERB Regulatory Compliance:** Tracking atomic energy regulatory norms, pregnancy screening warnings, radiation protection protocols, and licensed Medical Practitioner authorizations.
2. **Exposure & Technical Parameters Tracking:** Capturing radiographic projection factors (kVp, mAs, SID in cm), anatomical view positions (AP, Lateral, Oblique, PA, Water's, Swimmer's, Flexion-Extension), and optical film inventory consumption (8x10, 10x12, 11x14, 14x17 inch films).
3. **Queue & Room Workflow Flow:** Patient progression from token generation, exposure room positioning, DR plate scan/processing, technologist quality check, draft transcription, and Consultant Radiologist verification.
4. **Standardized Radiography Report Templates:** Ready-to-use clinical reporting templates across major anatomical regions (Chest PA, Cervical/Dorsal/Lumbosacral Spine, Extremity Joints, Skull & PNS, Pelvis & Hips, Abdomen Erect/Supine).
5. **Doctor Signature Authentication & Electronic Delivery:** Legally authenticated digital signature seals with Medical Council registration numbers and instant patient delivery via WhatsApp/SMS link.

---

## 2. Comprehensive Screen-by-Screen Specification

### 2.1 Screen 1: Today's Cases (`/digital_xray_cases/today` / `xray_today`)

#### A. Header & Controls
- **Page Title:** `Digital X-ray — Today's cases`
- **Regulatory Tag:** `AERB Compliant • Radiation Safety Verified` (Green/Blue pill badge)
- **Sub-text:** `Daily radiography patient queue, exposure room workflow, film inventory, and radiologist reporting.`
- **Top Action Bar:**
  - `+ Register X-Ray Case` (Primary Blue Button `#2563eb` with Plus icon) — Opens quick case registration modal.
  - `+ New Bill` (Green Pill Button or Secondary outline) — Redirects to billing.
  - `Date Step Navigator`:
    - `< Previous Day` (IconButton)
    - `Date Picker` (`DD/MM/YYYY`, default Today)
    - `Next Day >` (IconButton)
  - `Refresh` button with live case count indicator.

#### B. Filter Bar & Status Pills
- **Real-Time Status Tabs / Pills:**
  - `All Cases (Count)` — default active
  - `Waiting for Exposure (Count)` — Yellow/amber badge `#f59e0b`
  - `Exposure Captured (Count)` — Blue badge `#2563eb`
  - `Reported & Signed (Count)` — Green badge `#10b981`
  - `Cancelled (Count)` — Neutral gray `#64748b`
- **Search Bar:**
  - Input with magnifying glass icon: `Search patient name, token (X-01, X-02..), Reg #, mobile, or view projection...`
- **Dropdown Filters:**
  - `Radiologist`: (`All Radiologists`, `Dr. S. K. Verma, MD`, `Dr. Neha Agarwal, DMRD`)
  - `Anatomical Region`: (`All Regions`, `Chest & Thorax`, `Spine (Cervical/LS)`, `Extremities & Joints`, `Skull / PNS`, `Pelvis & Abdomen`)

#### C. Case Queue Data Table
Columns:
1. **Daily Token & Reg #:**
   - Daily sequence code badge (e.g., `X-01`, `X-02`, `X-03`)
   - Reg No. `#1003` (Monospace font `#0284c7`)
2. **Time & Schedule:**
   - Time stamp (e.g. `09:45 AM`, `10:30 AM`) + Date
3. **Patient Profile:**
   - Patient Full Name (Bold, 14px `#0f172a`)
   - Age / Gender (e.g. `34Y / Female`, `58Y / Male`)
   - Mobile Number & UHID
4. **Radiographic Study & Clinical Indication:**
   - Examination name (e.g. `Chest PA View`, `Lumbosacral Spine AP & Lateral`, `Right Knee AP & Lat`)
   - Clinical Indication (e.g. `Chronic cough with fever`, `Low backache with sciatica`, `Trauma / Fall`)
5. **Technical Exposure & Films:**
   - Films consumed (e.g., `1 Film (14x17 Fuji)`, `2 Films (10x12 Kodak)`)
   - Exposure factor (e.g., `70 kVp, 12 mAs`)
6. **Reporting Radiologist & Referring Clinician:**
   - Doctor names & qualifications
7. **Exam Status:**
   - Badge matching case status (`Waiting for Exposure`, `Exposure Captured`, `Reported`, `Cancelled`)
8. **Actions:**
   - `Enter Report` / `Edit Findings` (Primary / Secondary with Edit3 icon)
   - `View Official Report` (Secondary with Eye icon)
   - `Print Radiography Slip / Film Jacket Barcode` (Printer icon)
   - `Cancel Case` (Red Trash2 icon with confirmation modal)

---

### 2.2 Screen 2: Search Cases Archive (`/digital_xray_cases` / `xray_reports`)

#### A. Multi-Field Filter Grid (Labsmart 7-Field Layout)
1. **Duration Preset:**
   - Presets: `Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `Last 90 days`, `Custom date range`
2. **Date Range Pickers:**
   - `From Date` & `To Date` (`DD/MM/YYYY`)
3. **Patient Identifier:**
   - `Patient Name / First Name / Mobile / UHID` input
4. **Reg No. / Token / Case #:**
   - Direct numerical code lookup (e.g., `XR-2026-401` or `#1003` or `X-01`)
5. **Case Status:**
   - Dropdown: `All Statuses`, `Reported & Signed`, `Exposure Captured`, `Cancelled`
6. **Referring Doctor:**
   - Searchable doctor dropdown (`All Referring Doctors`, `Dr. Rajesh Gupta`, `Dr. Sunil Bansal`, etc.)
7. **Anatomical System / Region:**
   - `All Anatomical Regions`, `Chest & Thorax`, `Spine`, `Upper Limb / Extremity`, `Lower Limb / Knee`, `Skull / PNS`, `Pelvis / KUB`
- **Action Buttons:**
  - `Apply Filters` (Primary Blue)
  - `Reset Filters` (Secondary RotateCcw)
  - `Export to Excel / CSV` (Secondary FileSpreadsheet)

#### B. Historical Radiography Ledger Table
Columns:
1. **Case Code & Token:** `XR-2026-401` / `X-01`
2. **Exposure Date:** `17/10/2026`
3. **Patient Profile:** Name, Age, Gender, Mobile, UHID
4. **Radiological Examination:** Study name + Projections taken
5. **Referring Doctor:** Clinician name & Hospital
6. **Reporting Radiologist:** Consultant Radiologist + Registration No.
7. **Diagnostic Impression Snippet:** 2-line snippet of final radiological report (e.g., `Mild L4-L5 lumbar spondylosis with disc space narrowing. No fracture.`)
8. **Status:** Badge
9. **Actions:**
   - `Official PDF Report`
   - `Edit / Add Addendum`
   - `Share via WhatsApp`
   - `Delete Record` (with confirmation)

---

### 2.3 Screen 3: Report Templates (`/digital_xray_templates` / `xray_templates`)

#### A. Template Management Header & Search
- **Title:** `Digital X-ray Report Templates`
- **Sub-text:** `Standardized radiological report boilerplate, anatomical checklists, and normal finding templates.`
- **Top Actions:**
  - `+ Add X-Ray Template` (Primary Blue Button)
  - Category Filter Tabs:
    - `All Templates`
    - `Chest & Thorax`
    - `Spine (Cervical, Dorsal, Lumbar)`
    - `Extremities & Joints`
    - `Skull & Facial Bones (PNS)`
    - `Abdomen & Pelvis`
  - Quick Search input: `Filter templates by name or keyword...`

#### B. Template Library Card Grid
Standard templates included:
1. `Chest PA View (Normal Adult)`
2. `Cervical Spine AP & Lateral Views`
3. `Lumbosacral Spine AP & Lateral Views (Lumbar Spondylosis)`
4. `Knee Joint AP & Lateral Views (Bilateral)`
5. `Paranasal Sinuses (Water's View - Maxillary Sinusitis)`
6. `Pelvis with Both Hips (AP View)`
7. `Shoulder Joint AP & Axial / Y-View`
8. `Wrist & Hand AP & Oblique Views (Colles' Fracture Evaluation)`
9. `Ankle & Foot AP & Lateral Views`
10. `Abdomen Erect & Supine (KUB / Obstruction)`

Each card displays:
- Template Title & Category Pill
- Key Radiological Tags (e.g., *Lung fields clear, CTR normal, Costophrenic angles sharp*)
- Diagnostic Impression Preview
- Last updated date
- Controls: `Preview`, `Duplicate (Copy)`, `Edit`, `Delete`

#### C. Add / Edit Template Modal
- **Fields:**
  1. `Template Title`
  2. `Category Dropdown`
  3. `Included Views & Anatomical Tags`
  4. `Default Clinical Indication`
  5. `Detailed Radiographic Findings (Textarea)`:
     - Technical Quality & Centering
     - Bony Framework & Cortical Margins
     - Joint Spaces & Soft Tissue Planes
  6. `Clinical Impression (UPPERCASE)`
  7. `Recommendations / Advice`

---

### 2.4 Screen 4: Radiologist Signatures & Seals (`/digital_xray_signatures` / `xray_signatures`)

#### A. Header & Regulatory Notice
- **Title:** `Digital X-ray Radiologist Signatures & Seals`
- **Sub-text:** `Authorized digital signatures, Medical Council registrations, and official stamps for Consultant Radiologists.`
- **AERB & Medico-Legal Notice:** Displays statutory compliance requirements for Radiologist credential verification on digital film reports.

#### B. Radiologist Profile Cards
Each signatory card includes:
- Doctor Full Name & Qualifications (*MBBS, MD Radiodiagnosis / DMRD*)
- Medical Council Registration Number & State Council (*DMC-29104, Delhi Medical Council*)
- Official Designation (*Chief Consultant Radiologist*)
- Digital Signature & Official Seal Stamp preview canvas
- Status: `Default Signatory` badge
- Controls: `Make Default`, `Preview Seal Layout`, `Change Stamp`, `Remove Signatory`

#### C. Upload / Edit Modal
- Doctor Full Name, Qualifications, Registration Number, State Council, Official Title
- Signature file upload (transparent PNG / JPEG)
- Stamp layout type (`Circular Seal` vs `Standard Linear Stamp`)
- Set as default signatory checkbox

---

### 2.5 Screen 5: Clinical Radiography Reporting Console

Interactive modal/drawer opened when a radiologist clicks **"Enter Report"** or **"Edit Findings"**:

#### A. Case Header
- Patient Name, Age, Gender, Reg #, Token (X-01), Examination, and History.
- **1-Click Template Loader:** Instantly populates normal findings or classic pathology.

#### B. Technical Factors Grid
- Voltage: `kVp` (e.g. 70 kVp)
- Current-Time: `mAs` (e.g. 16 mAs)
- SID / FFD: `100 cm / 180 cm`
- Films Used: `1 Film (14x17 Fuji DR)`
- Contrast / Grid: `Grid Used (Ratio 8:1)`

#### C. Structured Findings
- **Technical Radiographic Quality:** Exposure, inspiratory effort, positioning, motion artifacts.
- **Bony Cage & Skeletal Elements:** Vertebral bodies, rib cage, joint congruity, cortical margins, fractures, osteophytes.
- **Soft Tissues & Visceral Shadows:** Parenchymal aeration, cardiothoracic ratio (CTR), mediastinal contours, soft tissue swelling.

#### D. Diagnostic Impression & Advice
- Highlighted uppercase conclusion box.
- Correlative recommendations (e.g., *Correlate with MRI / CT scan if symptoms persist*).
- Radiologist digital sign-off button.

---

## 3. Comparison: Live Labsmart LIS vs. Current Codebase

| Area / Feature | Live Labsmart LIS Standard | Current Codebase (`MedicalProject`) | Status / Deficiencies | Action Required |
| :--- | :--- | :--- | :--- | :--- |
| **Today's Cases UI** | Daily queue, date navigator (`< Today >`), status tabs (All, Waiting, Captured, Reported), token sequence (`X1`, `X2`), exposure metadata, AERB notice. | Basic table with 2 static rows, rudimentary search, basic status dropdown. | ⚠️ Incomplete | Overhaul [XRayWorklistPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayWorklistPage.tsx): add date navigator, status pills, daily token badges (`X-01`), exposure metadata, 1-click templates, and high-fidelity report preview. |
| **Search Cases Archive** | 7-field filter grid (Duration preset, Date range, Patient name, Reg #, Status, Doctor, Region), historical ledger, and PDF viewer. | 4 basic inputs (`Search`, `Region`, `From`, `To`), minimal columns, no quick presets. | ⚠️ Under-featured | Overhaul [XRayReportsPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayReportsPage.tsx): implement full 7-field filter panel, preset buttons, impression highlights, and PDF export dialog. |
| **Report Templates** | Standard clinical library for Chest PA, Spine, Knee, PNS, Pelvis, Shoulder, Wrist, Ankle, Abdomen; organ section breakdown, one-click load into reporting. | 6 basic text templates with single findings textarea. | ⚠️ Basic | Overhaul [XRayTemplatesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayTemplatesPage.tsx): expand template catalog to 10 standard protocols, category pills, duplicate template action, and rich editor. |
| **Signatures & Seals** | Radiologist profile card with qualifications, Registration Number, signature preview image, default badge, default toggle. | Basic card layout with text representation, limited controls. | ⚠️ Basic | Overhaul [XRaySignaturesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRaySignaturesPage.tsx): enhance with high-fidelity signature stamps, AERB registration badge, qualification tags, and upload modal. |
| **App.tsx Integration** | Seamless navigation from worklist to New Bill or other sections. | `onNavigateNewBill` prop not connected in `xray_today`. | ⚠️ Missing prop | Connect `onNavigateNewBill={() => setActiveScreen('new_bill')}` in [App.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/App.tsx). |

---

## 4. Implementation Plan & Execution Sequence

1. **Update [src/App.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/App.tsx)**:
   - Pass `onNavigateNewBill={() => setActiveScreen('new_bill')}` to `<XRayWorklistPage />`.
2. **Update [src/pages/lab/XRayWorklistPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayWorklistPage.tsx)**:
   - Full Labsmart-styled header with Date Step Navigator (`<`, `Today`, `>`).
   - AERB Radiation Safety Compliance banner.
   - Status counter pills (`All`, `Waiting for Exposure`, `Exposure Captured`, `Reported & Signed`, `Cancelled`).
   - Daily sequence tokens (`X-01`, `X-02`, `X-03`, `X-04`...) with film sizes and exposure factors.
   - Clinical Radiography Reporting Console modal with:
     - Technical exposure inputs (kVp, mAs, SID, films).
     - 1-click template loader.
     - Structured findings (Technical, Bones/Joints, Soft Tissues).
     - Highlighted diagnostic impression.
     - Radiologist sign-off workflow.
   - High-fidelity official report preview modal.
3. **Update [src/pages/lab/XRayReportsPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayReportsPage.tsx)**:
   - Complete 7-field filter grid matching Labsmart's case search.
   - Quick date preset pills (`Today`, `Yesterday`, `Last 7 days`, `Last 30 days`, `Last 90 days`).
   - Rich data table with case tokens, patient demographics, clinical impression snippets, and quick actions.
   - PDF Report Viewer modal with clinic letterhead and doctor seal.
4. **Update [src/pages/lab/XRayTemplatesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRayTemplatesPage.tsx)**:
   - Comprehensive template catalog with 10 standard radiography protocols.
   - Category filter tabs (`All`, `Chest & Thorax`, `Spine`, `Extremities & Joints`, `Skull & Facial Bones`, `Abdomen & Pelvis`).
   - Duplicate, Edit, Preview, and Delete actions with full modal editor.
5. **Update [src/pages/lab/XRaySignaturesPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/lab/XRaySignaturesPage.tsx)**:
   - Radiologist profiles with Medical Council Registration badges.
   - Visual digital signature & clinic stamp previews.
   - Default signatory toggle with radio switch.
   - New signatory upload modal with qualification degrees and registration council picker.
6. **Validation & Build**:
   - Run `npm run build` to verify 0 TypeScript/Vite errors.
   - Verify on local browser via Chrome DevTools MCP on `http://localhost:5173/`.
