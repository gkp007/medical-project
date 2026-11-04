# Labsmart LIS — Digital X-Ray Module Specification

**Specification ID:** `SPEC-05-DIGITAL-XRAY`  
**Module Name:** Digital Radiography Modality Workflow, Exposure Room Tracking, Radiation Safety (AERB), Film Inventory & Structured Findings  
**Target Routes:** `/digital_xray_cases/today`, `/digital_xray_cases`, `/xray_templates`, `/xray_signatures`  
**Source Components:**
- `src/pages/lab/XRayWorklistPage.tsx`
- `src/pages/lab/XRayReportsPage.tsx`
- `src/pages/lab/XRayTemplatesPage.tsx`
- `src/pages/lab/XRaySignaturesPage.tsx`

---

## 1. Executive Summary & Clinical Architecture

The **Digital X-Ray** module manages Computed Radiography (CR) and Direct Digital Radiography (DR) workflows. It addresses specialized radiological challenges:
1. **Radiation Safety & AERB Compliance**: Atomic Energy Regulatory Board (AERB) protocols, radiation warning signs, lead shielding confirmation, and mandatory pregnancy screening for female patients (15-49 years).
2. **Technical Exposure & Quality Factors**: Capture of peak kilovoltage (kVp), milliampere-seconds (mAs), Source-to-Image Distance (SID in cm), and anatomical projections (AP, Lateral, Oblique, PA).
3. **Radiographic Film Inventory Tracking**: Direct consumption deduction for physical optical film sizes ($8\times 10$, $10\times 12$, $11\times 14$, $14\times 17$ inch) with retake/reject logging.
4. **Structured Radiography Reporting**: Anatomical templates (Chest PA, Cervical/Dorsal/Lumbosacral Spine, Extremity Joints, Skull & PNS, Pelvis & Hips, Abdomen Erect).
5. **Authenticated Radiologist Delivery**: Medical Council registration numbers, digital signature seals, and automated delivery to patient via WhatsApp/SMS.

---

## 2. Screen 1: Digital X-Ray Worklist / Today (`/digital_xray_cases/today`)

### 2.1 Header & Top Controls
1. **Page Title**: `Digital X-ray — Today's cases` (`h1`, 24px, font-weight 700).
2. **Regulatory Tag**: Pill badge `AERB Compliant • Radiation Safety Verified` (Green text `#15803d`, background `#dcfce7`).
3. **Sub-text**: `Daily radiography patient queue, exposure room workflow, film inventory, and radiologist reporting.`
4. **Action Buttons**:
   - `+ Register X-Ray Case` (Primary Blue): Opens quick booking modal.
   - `+ New Bill` (Green Outline): Direct shortcut to billing.
   - `Date Step Navigator`: `< Previous Day`, Date Picker (`19/10/2026`), `Next Day >`.
   - `Refresh` button with live case count.

### 2.2 Status Tabs & Filter Controls
- **Queue Status Pills**:
  * `All Cases (Count)`: Total cases booked today.
  * `Waiting for Exposure (Count)`: Patient waiting for exposure room (`#f59e0b` amber badge).
  * `Exposure Captured (Count)`: Radiographic plate exposed and scanned into DR workstation (`#2563eb` blue badge).
  * `Reported & Signed (Count)`: Authorized report (`#10b981` green badge).
  * `Cancelled (Count)`: Voided cases (`#64748b` gray badge).
- **Search Bar**: Instant filter across patient name, token (e.g. `X-01`), Reg No, mobile, or view projection.
- **Radiologist Dropdown Filter**: Filter by assigned reporting doctor (`Dr. S. K. Verma, MD`, `Dr. Neha Agarwal, DMRD`).

---

### 2.3 Case Queue Data Table Structure

| Column Header | Format & Content |
| :--- | :--- |
| **DAILY TOKEN & REG #** | Token badge (`X-01`, `X-02`) + Reg No link (`#1003`). |
| **TIME & SCHEDULE** | Timestamp (`09:45 AM`) + Date. |
| **PATIENT PROFILE** | Patient Full Name (`Kavita Singhal`), Age/Gender (`34Y / Female`), Mobile, UHID. |
| **RADIOGRAPHIC STUDY & INDICATION** | Examination Name (`Chest PA View`, `LS Spine AP & Lat`) + Indication (`Persistent dry cough`). |
| **TECHNICAL EXPOSURE & FILMS** | Films used (`1 Film (14x17 Fuji DR)`) + Exposure factor (`75 kVp, 16 mAs`). |
| **REPORTING RADIOLOGIST & REFERRER** | Assigned Radiologist (`Dr. S. K. Verma, MD`) + Referring Clinician (`Dr. Rajesh Gupta, MD`). |
| **EXAM STATUS** | Status badge (`Waiting for Exposure`, `Exposure Captured`, `Reported`). |
| **ACTIONS** | Primary: `Enter Findings` / `Edit Findings` (`<Edit3 size={15} />`), Secondary: `View Official Report` (`<Eye size={15} />`), Utility: `Print Slip / Film Jacket Barcode` (`<Printer size={15} />`), `Cancel` (`<Trash2 size={15} />`). |

---

## 3. Screen 2: Enter & Edit Radiography Findings Workspace Modal

Triggered by `Enter Findings` button on any worklist row.

### 3.1 Radiation Safety & Pregnancy Verification (Mandatory for Females 15-49)
- For female patients of reproductive age, an explicit safety questionnaire is enforced:
  * `Pregnancy Screening`: `Negative / Not Pregnant` (Confirmed by patient).
  * `Last Menstrual Period (LMP) Date`: Date input field (`DD/MM/YYYY`).
  * `Gonadal & Abdominal Shielding Used`: Checkbox confirming lead shielding apron applied if pelvic/abdominal exposure.

---

### 3.2 Technical Radiographic Parameters Grid

| Parameter Field | Input Type | Standard Units | Common Anatomical Values | Technical Function |
| :--- | :--- | :--- | :--- | :--- |
| `Peak Kilovoltage (kVp)` | Numeric | `kV` | Chest: `70 - 85 kVp`, Spine: `75 - 90 kVp`, Extremity: `50 - 65 kVp` | Controls beam penetration & optical contrast |
| `Milliampere-Seconds (mAs)`| Numeric | `mAs` | Chest: `10 - 20 mAs`, Spine: `25 - 50 mAs`, Hand/Foot: `4 - 8 mAs` | Controls optical density (quantity of X-ray photons) |
| `Source-to-Image Distance (SID)`| Numeric | `cm` | Chest PA: `180 cm` (72 inches), Spine/Bones: `100 cm` (40 inches) | Minimizes geometric magnification distortion |
| `Projections / Views` | Multiselect| N/A | `PA`, `AP`, `Lateral`, `Right Oblique`, `Left Oblique`, `Flexion`, `Extension` | Anatomical orientation vectors |
| `Physical Film Size Consumed`| Select | `inches` | `14x17` (Chest), `10x12` (Spine/Knee), `8x10` (Extremities), `11x14` (Pelvis/Abdomen) | Automatic optical film inventory deduction |
| `Retake / Reject Count` | Numeric | Integer | `0` (Normal) | Radiation dose monitoring audit |

---

### 3.3 Structured Anatomical Findings Sections

Each radiographic study provides pre-filled normal templates structured by anatomical tissue planes:
1. **Technical Quality & Centering**: Exposure adequacy, inspiratory effort, rotation/tilt, central tracheal alignment.
2. **Bony Thorax & Skeletal Cage**: Ribs, clavicles, scapulae, visualized vertebrae, intervertebral disc spaces, osteophytes, fractures.
3. **Mediastinum & Cardiac Silhouette**: Cardiothoracic ratio (CTR normal $< 0.50$), aortic knuckle, hila, paratracheal stripe.
4. **Diaphragm & Pleural Spaces**: Costophrenic and cardiophrenic angles (clear and sharp vs blunted/effusion), dome contours.
5. **Pulmonary Parenchyma**: Upper, middle, and lower zones; vascular markings; presence/absence of consolidation, infiltrates, cavities, nodules.
6. **Soft Tissues**: Subcutaneous emphysema, chest wall soft tissue swellings.
7. **IMPRESSION (Capitalized Conclusion)**:
   - Summary diagnosis (e.g. `1. NORMAL CHEST RADIOGRAPH (PA VIEW). NO ACTIVE PARENCHYMAL LESION.` or `1. RIGHT LOWER LOBE CONSOLIDATION SUGGESTIVE OF INFECTIVE PNEUMONIA.`).
8. **Recommendations**: `Correlate clinically and with microbiological sputum analysis.`

---

## 4. Screen 3 & 4: X-Ray Templates & Radiologist Signatures

### 4.1 X-Ray Templates Master (`/xray_templates`)
- Pre-built reporting templates:
  * `Chest PA View (Normal Adult)`
  * `Chest PA View (Infective Consolidation / Pneumonia)`
  * `Cervical Spine AP & Lateral (Cervical Spondylosis)`
  * `Lumbosacral Spine AP & Lateral (Lumbar Spondylosis / Disc Space Narrowing)`
  * `Right / Left Knee AP & Lateral (Osteoarthritis Kellegren-Lawrence Grading)`
  * `Paranasal Sinuses (PNS) Water's View (Maxillary Sinusitis)`
  * `Pelvis with Both Hips AP View`
  * `Abdomen Erect & Supine (Air-Fluid Levels / Perforation Exclusion)`

### 4.2 Radiologist Signatures & Radiation Safety Officer (RSO) (`/xray_signatures`)
- Radiologist Profile:
  * Name: `Dr. S. K. Verma`
  * Designation: `Consultant Radiologist & Radiation Safety Officer (RSO)`
  * Qualifications: `MBBS, MD (Radiodiagnosis)`
  * Medical Council Reg No: `DMC-R-49102`
  * AERB Registration / License Number: `AERB-RAD-2021-9014`
  * Digital signature image with hospital credential stamp.

---

## 5. Backend API Specifications & Architecture

### 5.1 Endpoints Supporting Digital X-Ray Modality

#### 1. GET `/api/v1/xray/worklist`
- **Purpose**: Returns daily digital radiography worklist.
- **Query Parameters**: `date=2026-10-19&status=ALL`
- **Response JSON (200 OK)**:
```json
[
  {
    "id": "case-xr-001",
    "token": "X-01",
    "regNo": "1003",
    "patientName": "Kavita Singhal",
    "ageGender": "34Y / Female",
    "uhid": "UHID-78190",
    "viewRegion": "Chest PA View",
    "indication": "Routine pre-employment checkup",
    "filmsUsed": "1 Film (14x17 Fuji DR)",
    "exposureFactor": "75 kVp, 16 mAs",
    "status": "Reported"
  }
]
```

#### 2. POST `/api/v1/xray/cases/:id/findings`
- **Purpose**: Saves radiographic findings, technical factors, and automatically deducts film inventory.
- **Request Body JSON**:
```json
{
  "status": "Reported",
  "technical": {
    "kvp": "75",
    "mas": "16",
    "sidCm": "180",
    "projections": "Posteroanterior (PA) View",
    "filmsSize": "14x17",
    "filmsCount": 1,
    "retakeCount": 0
  },
  "findings": {
    "technical": "Adequate inspiratory effort and centering.",
    "bonyCage": "Both lung fields normally aerated. Costophrenic angles clear.",
    "softTissues": "Cardiac silhouette normal. Mediastinum unremarkable.",
    "impression": "NORMAL CHEST RADIOGRAPH (PA VIEW).",
    "recommendations": "Clinical correlation recommended."
  },
  "safetyCheck": {
    "pregnancyScreened": true,
    "lmpDate": "2026-10-05",
    "leadShieldingUsed": true
  },
  "signatureId": "sig-xr-01"
}
```
- **Business Logic Execution**:
  1. Validates mandatory findings and safety confirmation for female patients.
  2. Creates / updates `RadiologyReport` entry with modality `X-RAY`.
  3. Updates parent `Case.reportStatus = 'Signed Off'`.
  4. Deducts 1 unit of `14x17` physical optical film from clinic consumables inventory.
  5. Compiles official PDF report with digital signature and dispatches WhatsApp notification.
- **Response JSON (200 OK)**:
```json
{
  "reportId": "rep-xr-001",
  "status": "Reported",
  "inventoryDeducted": { "item": "Film 14x17 Fuji", "quantity": 1 },
  "pdfUrl": "https://storage.labsmart.internal/radiology/XR-1003.pdf"
}
```
