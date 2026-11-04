# Labsmart LIS — Lab Module Comprehensive Specification & UI Blueprint

**Reference Platform:** Labsmart LIS Cloud Edition (`https://app.labsmartlis.com/71122710/...`)  
**Target File:** `LabFrontend.md`  
**Scope:** All 8 primary pages under the **Lab** navigation accordion + the core **Enter Results** diagnostic workspace.

---

## 1. Overview of the Lab Module Architecture

The **Lab** module is the central engine of the Laboratory Information System (LIS). It handles the full laboratory diagnostic lifecycle:
1. **Specimen receipt & accessioning**
2. **Batch & daily bench worklists** (`Today's reports`)
3. **Historical test records retrieval** (`Search reports`)
4. **Clinical parameter entry, auto-delta calculations, and medical sign-offs** (`Enter results`)
5. **Master test catalogues and hierarchies**:
   - `Test packages` (Multi-profile health checkups with bundled rates)
   - `Test panels` (Ordered groups of tests, e.g. CBC, LFT, KFT, Lipid)
   - `Test categories` (Laboratory sub-specialities: Haematology, Biochemistry, etc.)
   - `Test database` (Individual parameter masters, units, reference intervals, formulas)
6. **Clinical knowledgebase** (`Interpretations` library & custom rules)
7. **Analyzer throughput & workload intelligence** (`Test counts`)

---

## 2. Page-by-Page Comprehensive Specifications

---

### Page 1: Today's Reports (`/lab_reports/today`)

#### 1. Page Header & Navigation Bar
- **Page Title:** `Reports for today` (`<h1>`, font-weight 700)
- **Recent changes Link:** Opens Cloudinary changelog / announcement banner image.
- **Search in page:** Text input with real-time DOM/state filter across patient names, bill numbers, and test names.
- **Date Step Navigator:**
  - `<` (Previous Day button)
  - Date input: `19/10/2026` (Readonly display, clicking opens mini calendar dropdown)
  - `>` (Next Day button)
- **Quick Links:**
  - `Stats` link: Navigates directly to `lab_test_counts` for the selected date.
- **Sort By Dropdown:**
  - Options: `Oldest first` (default) vs `Recent first`.
- **Status Filter Segmented Pills:**
  - `All (n)` — All cases registered for the date.
  - `New (n)` — Registered cases awaiting sample collection or result entry.
  - `In progress (n)` — Tests with partial results entered or pending analyzer sync.
  - `Final (n)` — Technologist verified, pending pathologist signature.
  - `Signed off (n)` — Doctor authorized and ready for patient distribution.
- **Print Tracker:** Displays `X/Y Printed` badge (e.g. `0/1 Printed`) tracking thermal/laser printing.

#### 2. Reports Table Structure
| Column Header | Format & Content |
|---|---|
| **REG. NO.** | `#1001` (primary bold link) + Daily Case Number `L1` (blue badge). |
| **DATE/TIME** | Registration date and timestamp (e.g. `18/10/2026 07:26 PM`). |
| **PATIENT** | Patient Name (`Rahul Sharma`), Age/Sex (`32 YRS/M`), and phone action trigger. |
| **REFERRED BY** | Doctor name with qualifications (`Dr. Anil Verma MBBS, MD`). |
| **TESTS** | Test names breakdown (`Complete Blood Count (CBC)`). |
| **CC** | Collection Centre indicator (`Main` or Franchise tag). |
| **STATUS** | Colored pill badge (`Signed off` = green, `In progress` = amber, `New` = slate). |
| **ACTIONS** | Direct action buttons: `Enter results` (blue primary) or `View` (secondary), plus 3-dot meatball menu (`Modify`, `Cancel`, `Print Barcode`). |

#### 3. Empty State Handling
- When no cases exist:
  - Text: *"No reports to show. Get started by adding a new lab case."*
  - CTA Button: `Add new case` -> routes to `/cases/new`.
  - Secondary CTA: `Search old reports` -> routes to `/lab_reports`.

---

### Page 2: Search Reports (`/lab_reports`)

#### 1. Header & Search Filters
- **Title:** `Search lab reports`
- **Filter Controls Grid:**
  1. `Duration`: Dropdown with presets (`Past 7 days`, `Today`, `Yesterday`, `Past 30 days`, `Custom Range`).
  2. `Patient first name`: Text search input.
  3. `Status`: Dropdown (`All`, `New`, `In progress`, `Final`, `Signed off`).
  4. `Referred by`: Combobox with autocomplete for doctors (`Select referrer`).
  5. `Reg. no.`: Direct integer case search.
  6. `Daily case no.`: Modality-specific daily counter search (`L1`, `L2`).
  7. `UHID`: Longitudinal patient record number search.
  8. `Show all filters` collapsible trigger:
     - `Select test`: Filter cases containing specific investigations (e.g. CBC, Widal).
     - `Collection centre`: Filter by branch/phlebotomy point.
- **Action Buttons:**
  - `Search` button (Primary blue).
  - `Clear` button (Resets all inputs to default).

#### 2. Results Ledger
- Displays matching historical reports with:
  - `REG. NO.` (`#1001`, `L1`)
  - `DATE/TIME`
  - `PATIENT` (Name, Age/Sex, contact icon)
  - `REFERRED BY`
  - `TESTS`
  - `CC`
  - `STATUS`
  - `ACTIONS` (`Enter results`, `View`, and 3-dot dropdown menu).

---

### Page 3: Enter Results Workspace (`/lab_reports/:id/edit`)

This is the core diagnostic reporting workbench utilized by medical technologists and pathologists.

#### 1. Collapsible Left Quick-Nav Drawer
- Toggles between collapsed icon bar and expanded drawer containing:
  - `Patient info`: Direct modal/route to edit patient demographics.
  - `Doctor info`: Referring clinician profile.
  - `Patient history`: Previous diagnostic results and longitudinal trends.
  - `Recent lab reports`: Patient's prior reports within the lab.
  - `Report activities`: Audit log of edits, result entries, and timestamped sign-offs.
  - `Debug info`: Raw analyzer transmission logs.

#### 2. Clinical Header & Case Metadata
- Case title: `Lab report` with Reg No. (`1001`), Daily Code (`L1`), Gender (`MALE`).
- Step navigation: Previous / Next report buttons for rapid sequential batch entry (`Go to Edit < >`, `View < >`).
- Current Status: `Status: Signed off` / `Report ready SMS sent` badge.
- Metadata Grid:
  - `Patient Name`: Readonly display.
  - `Registered on`: Date & Time stamp (`18/10/2026 07:26 PM`).
  - `Age / Sex`: `32 YRS / M`.
  - `Collected on`: Date picker + Time picker (editable).
  - `Referred By`: Doctor Name (`Dr. Anil Verma, MBBS, MD`).
  - `Received on`: Sample lab arrival datetime picker.
  - `Reported on`: Result release datetime picker.

#### 3. Report Layout & PDF Formatting Options
- Global toggle: `Print categories from new page (PDF only)` (Checkbox).
- Category Header banner (e.g. `HAEMATOLOGY`) with `Reorder` action.
- Test Panel Header banner (e.g. `COMPLETE BLOOD COUNT (CBC)`) with `Reorder` action.
- Test Level Formatting Checkboxes:
  - `Print ready` (Checked by default).
  - `Keep in same page` (Prevents orphan parameter splits in PDF).
  - `Print from new page` (Forces page break before this test).
  - `Page break after (PDF only)` (Forces page break after this test).
  - `Skip interpretation` (Excludes clinical notes from final patient printout).

#### 4. Diagnostic Parameters Table
| Column | Functionality |
|---|---|
| **TEST** | Parameter name (e.g. `Hemoglobin`, `Total Leukocyte Count`, indented `Neutrophils`). Includes sub-test badges and `(Optional)` flags. |
| **VALUE** | Editable text/numeric input box. When value is outside the reference range, text turns bold/red with high/low badges (`H` / `L`). Formula parameters (e.g. PCV, MCV, MCH, MCHC) auto-compute as dependencies update. |
| **UNIT** | Standard SI units (e.g. `g/dl`, `cumm`, `%`, `lakhs/cumm`, `fL`, `pg`). |
| **REFERENCE** | Demographic-specific normal range (e.g. `13 - 17`, `4,800 - 10,800`, `40 - 80`). Includes quick pencil icon to edit reference range on the fly. |

#### 5. Interpretations, Clinical Remarks & Add-ons
- Pre-filled clinical notes accordion:
  - `Clinical Notes:` (Diagnostic significance and physiological overview).
  - `Possible causes of abnormal parameters:` Markdown or rich table breakdown showing high vs low differentials.
  - `More details`: Multiline text area for free-form pathologist impressions.
- Action triggers:
  - `Add notes` button.
  - `Add remarks` button.
  - `Add advices` button.
  - `Edit` button for inline interpretation refinement.

#### 6. Bottom Sticky Action Bar
- `Sign off` (Green `#16a34a` primary): Clinically signs report with digital signature, marks status as Signed Off, and triggers automated SMS/WhatsApp dispatch.
- `Final` (Blue `#2563eb` secondary): Technologist verification mark, ready for doctor review.
- `Save only` (Slate `#64748b` neutral): Saves draft inputs without altering report state.
- `FAQs` menu link: Troubleshooting guidance.

---

### Page 4: Test Packages (`/test_packages`)

#### 1. Header & Actions
- **Title:** `Test packages`
- **Actions:**
  - `Add new` button (Opens package builder modal).
  - `How it works?` / `Watch Video` help trigger.
- **Segmented Filter Tabs:**
  - `In ratelist (n)` (Active packages available for billing).
  - `Not in ratelist (n)` (Archived/draft packages).
- **Search:** `Search in page` filter.

#### 2. Packages Table
| Column | Description |
|---|---|
| **S. NO.** | Sequential index (`1.`, `2.`, `3.`). |
| **NAME** | Package title (e.g. `Anemia package`, `Full body checkup (Female)`, `Fever package`, `Diabetic package`). |
| **FEE** | Package price (e.g. `Rs.100`, `Rs.1499`). |
| **FOR GENDER** | Target cohort: `Both`, `Male`, `Female`. |
| **INCLUDED TESTS AND PANELS** | Comma-separated list of child investigations. |
| **ACTION** | `Edit` link and 3-dot dropdown menu (`Delete`, `Remove from Ratelist`). |

---

### Page 5: Test Panels (`/lab_test_panels`)

#### 1. Header & Actions
- **Title:** `Test panels`
- **Actions:**
  - `Add new` button (Opens panel builder modal).
  - `How to reorder?` guidance tooltip.
- **Search:** `Search in page` input.

#### 2. Panels Table
| Column | Description |
|---|---|
| **ORDER** | Display order integer (`1.`, `2.`, `3.`). |
| **NAME** | Panel name (e.g. `Complete Blood Count (CBC)`, `Liver Function Test (LFT)`, `Kidney Function Test (KFT)`). |
| **CATEGORY** | Department classification (`Haematology`, `Biochemistry`, etc.). |
| **TESTS** | List of component parameters + test count pill (e.g. `(14 tests)`, `(11 tests)`). |
| **RATELIST ENTRIES** | Associated packages/billable items referencing this panel. |
| **ACTION** | `Edit` and `View` links. |

---

### Page 6: Test Categories (`/lab_test_categories`)

#### 1. Header & Actions
- **Title:** `Test categories`
- **Actions:**
  - `Add new` button.
  - `How to reorder?` action.

#### 2. Categories Table
| Column | Description |
|---|---|
| **ORDER** | Department sequence number (`1`, `2`, `3` ... `10`). |
| **NAME** | Standard categories: `Haematology`, `Biochemistry`, `Serology & Immunology`, `Clinical Pathology`, `Cytology`, `Microbiology`, `Endocrinology`, `Histopathology`, `Others`, `Miscellaneous`. |
| **ACTION** | `Edit` link and `View tests` link (filters Test Database by category ID). |

---

### Page 7: Test Database (`/lab_tests`)

#### 1. Header & Controls
- **Title:** `Test database`
- **Actions:**
  - `Add new` (`/lab_tests/select_type`): Select Single parameter, Multi parameter, Document, or Formula test.
  - `Import` (`/lab_tests_library`): Import standardized test definitions from global Labsmart LIS master.
- **Advisory Banner:**
  - *"Important: It is required that your laboratory proofreads and updates the provided reference range before using it for printing lab reports."*
- **Horizontal Category Filter Bar:**
  - `All`, `Haematology`, `Biochemistry`, `Serology & Immunology`, `Clinical Pathology`, `Cytology`, `Microbiology`, `Endocrinology`, `Histopathology`, `Others`, `Miscellaneous`.
- **Search in page:** Instant parameter name/code search.

#### 2. Test Catalog Table
| Column | Description |
|---|---|
| **ORDER** | Integer order (`1.`, `2.`, `3.` ...). |
| **NAME** | Full test title (e.g. `Hemoglobin`, `Total Leukocyte Count`, `Platelet Count`). |
| **TEST TYPE** | Badge indicator: `Single parameter`, `Multi parameter`, `Document`, `Formula`. |
| **SHORT NAME** | Abbreviation (e.g. `Hb`, `TLC`, `DLC`, `AEC`, `ESR`). |
| **CATEGORY** | Category badge (`Haematology`, `Biochemistry`). |
| **ACTION** | `Edit` link (opens parameter ranges & formula builder) and `view` link. |

---

### Page 8: Interpretations (`/interpretations`)

#### 1. Header & Library Banner
- **Title:** `Interpretations`
- **Banner:** *"You can now copy interpretations from Library to update. NEW"*
- **Segmented Tabs:**
  - `Test (116)` (Interpretations tied to specific single tests).
  - `Panels (13)` (Interpretations tied to composite panels like Lipid or CBC).
- **Search:** `Search in page` input.
- **Add Action:** `Add new` button.

#### 2. Interpretations Table
| Column | Description |
|---|---|
| **S. NO.** | Sequential number (`1.`, `2.`, `3.` ...). |
| **NAME** | Test or Panel name (e.g. `25 Hydroxy (OH) Vitamin D`, `Absolute Eosinophil Count`, `Acid - Fast Bacilli`, `APTT`, `Alfa Fetoprotein`). |
| **INTERPRETATION** | Formatted clinical notes text containing: Physiological basis, Interpretation rules (Increased in / Decreased in), and Comments. Includes `View all` expansion toggle. |
| **ACTION** | `Edit` button and meatball menu. |

---

### Page 9: Test Counts (`/lab_test_counts`)

#### 1. Header & Controls
- **Title:** `Test counts`
- **Notice Banner:** *"This feature is available for preview. Cumulative statistics for all processed tests."*
- **Date Range Selector:** Default 30 days (`19/10/2026 - 19/10/2026`) with `Show` button.
- **Search:** `Search in page` text input.
- **Export Action:** `Export Workload` (Excel/PDF download).

#### 2. Workload & Throughput Table
| Column | Description |
|---|---|
| **DEPARTMENT / TEST** | Test name or department group. |
| **TOTAL SAMPLE COUNT** | Number of specimens processed in the interval. |
| **GROSS VALUE (₹)** | Revenue attributable to this test. |
| **% OF WORKLOAD** | Visual progress bar showing department proportion. |

---

## 3. Gap Analysis & Codebase Alignment Plan

| Screen | Existing State in Our Codebase | Missing Elements to Implement |
|---|---|---|
| **Today's reports** (`/lab_reports/today`) | Basic table with status dropdown | • Date navigator (`<` `19/10/2026` `>`)<br>• Link to `Stats`<br>• Sort by dropdown (`Oldest first`, `Recent first`)<br>• Status pill counters (`All`, `New`, `In progress`, `Final`, `Signed off`)<br>• Print tracker (`0/0 Printed`)<br>• Action buttons: `Enter results`, `View`, and 3-dot menu. |
| **Search reports** (`/lab_reports`) | Basic 4-field search | • Exact 7+ field filter grid (`Duration: Past 7 days`, `Patient first name`, `Status`, `Referred by`, `Reg. no.`, `Daily case no.`, `UHID`, `Show all filters`)<br>• Detailed reports table with DCN badges (`L1`). |
| **Enter results** (`/lab_reports/:id/edit`) | Fixed form with only a few CBC fields | • Header with Reg no., DCN, navigation links (`Go to Edit < >`, `View < >`)<br>• Left drawer for patient info, history, and audit log<br>• Checkboxes for page breaks & skip interpretation<br>• Sub-tests & indented parameters with `(Optional)` flags<br>• Out-of-range red/bold auto flags<br>• Action bar: `Sign off`, `Final`, `Save only`. |
| **Test packages** (`/test_packages`) | Basic modal with custom price | • Segmented tabs: `In ratelist` vs `Not in ratelist`<br>• "Search in page" input<br>• Gender column (`Both`, `Male`, `Female`)<br>• Comma-separated list of included tests/panels. |
| **Test panels** (`/lab_test_panels`) | 4 hardcoded items | • Exact columns: `ORDER`, `NAME`, `CATEGORY`, `TESTS` with test count badge `(14 tests)`, `RATELIST ENTRIES`, `ACTION` (`Edit`, `View`).<br>• Reorder guidance and builder modal. |
| **Test categories** (`/lab_test_categories`) | Simple card list | • Exact 10 standard laboratory categories<br>• `View tests` direct filter links<br>• Reorder controls. |
| **Test database** (`/lab_tests`) | Simple master table | • Advisory notice banner<br>• Category horizontal filter bar with 11 category filters<br>• Columns: `ORDER`, `NAME`, `TEST TYPE` (Single parameter, Multi parameter, Document, Formula), `SHORT NAME`, `CATEGORY`, `ACTION`. |
| **Interpretations** (`/interpretations`) | Basic summary list | • Banner: "Copy interpretations from Library to update"<br>• Segmented tabs: `Test (116)` vs `Panels (13)`<br>• Structured sections: Physiological basis, Increased in, Decreased in, Comments with `View all` toggle. |
| **Test counts** (`/lab_test_counts`) | Fixed department cards | • Exact 30-day date range filter bar with `Show` button<br>• Workload metrics table with count and revenue distribution. |

---

## 4. Design Standards & Aesthetics Checklist
- **Color Palette:**
  - Primary Action / Selection: `#0284c7` (Sky blue) / `#2563eb` (Blue).
  - Medical Sign-off: `#16a34a` (Green) / `#15803d`.
  - Alert / Abnormal High: `#dc2626` (Red).
  - Backgrounds: Neutral slate `#f8fafc` with subtle borders `#e2e8f0`.
- **Typography:**
  - Monospace font for DCN codes (`L1`), test codes, and barcodes.
  - Inter / Outfit font for crisp medical labels.
- **Micro-interactions:**
  - Instant out-of-range value highlighting.
  - Live search filtering without reloading.
  - Smooth modal drawers for test definitions and patient info.
