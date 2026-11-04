# Labsmart LIS — Cases Tab Frontend Specification & Gap Analysis
**Document Version:** 1.0.0  
**Target Application:** Labsmart LIS (Laboratory Information System)  
**Section Audited:** Cases Module (`Bills`, `Outsource cases`, `Ct scan cases`, `Patients`, `Transactions`, `Referral Doctors`, `Agents`, plus `New bill`)  
**Reference URLs:**
- Bills: `https://app.labsmartlis.com/71122710/cases`
- Outsource cases: `https://app.labsmartlis.com/71122710/outsource_lab_cases`
- Ct scan cases: `https://app.labsmartlis.com/71122710/ctscan_cases`
- Patients: `https://app.labsmartlis.com/71122710/patients`
- Transactions: `https://app.labsmartlis.com/71122710/receipts`
- Referral Doctors: `https://app.labsmartlis.com/71122710/referrers`
- Agents: `https://app.labsmartlis.com/71122710/sample_collectors`
- New bill: `https://app.labsmartlis.com/71122710/cases/new`

---

## 1. Executive Summary

The **Cases** module is the operational backbone of Labsmart LIS. It manages patient case registration, invoicing, multi-modality diagnostic orders (Pathology, Radiology, Ultrasound, CT Scan, Outsource), payment collection records, patient master files, consulting doctor commission directories, and phlebotomy runner fleets.

This document breaks down every page under the Cases tab in granular detail, cataloging all UI controls, filters, expanded row drawers, table headers, modals, empty states, and field-level validation rules.

---

## 2. Navigation Architecture & Sub-Routes

| Sidebar Item | URL Route | Core Function | Primary Action |
| :--- | :--- | :--- | :--- |
| **New bill** (Top CTA) | `/cases/new` | Patient registration, doctor tagging, test selection, fee settlement | `Create` |
| **1. Bills** | `/cases` | Filterable master case ledger with expandable test breakdown drawers | `Search`, `View bill`, `Modify` |
| **2. Outsource cases** | `/outsource_lab_cases` | Tracking samples sent to external reference laboratories (SRL, Lal Path, etc.) | Date range filter, TAT status |
| **3. Ct scan cases** | `/ctscan_cases` | Dedicated CT protocol management and radiology report tracking | Date filter, Scan status |
| **4. Patients** | `/patients` | Central Master Patient Index (MPI / UHID), demographics, contact logs | `Search`, `View`, `Edit`, `Add case` |
| **5. Transactions** | `/receipts` | Chronological audit receipts of all collections and refunds | Mode filter, `View bill` |
| **6. Referral Doctors** | `/referrers` | Directory of consulting physicians, A-Z alpha filter, active status | A-Z filter, `View`, `Edit`, `Print` |
| **7. Agents** | `/sample_collectors` | Phlebotomy home-collection agents & logistics fleet | `Active` / `Archived` tabs |

---

## 3. Deep-Dive Screen Specifications

---

### Page 1: Bills (`/cases`)

#### 1.1. Header & Primary Filter Form
- **Heading:** `All bills` (`h1`, 24px semi-bold, `#1e293b`)
- **Filter Bar Grid:**
  1. **Duration:**
     - Combobox with options: `Past 7 days` (Default), `Past 30 days`, `Past 90 days`, `Custom range`
     - Displays formatted interval (e.g. `12 Oct 2026 to 19 Oct 2026`)
  2. **Reg. no.:** Numeric spinbutton/input (e.g. `1001`)
  3. **Patient first name:** Search text input
  4. **Referred by:** Combobox with search autocomplete for selecting consulting doctors
  5. **Collection centre:** Combobox (e.g. `Main`, `Branch 1`)
  6. **Sample collection agent:** Combobox selecting registered phlebotomists
  7. **Checkboxes:**
     - `Has due` (Filters only outstanding receivable cases)
     - `Cancelled` (Filters voided/cancelled cases)
  8. **Action Buttons:**
     - `Search` (Primary Blue button)
     - `Clear` (Link returning to default filter state `/cases`)

#### 1.2. Bills Data Table
- **Columns:**
  1. **Expand Toggle:** Expand/Collapse icon chevron $(> / \vee)$ in the first cell (`data-action="cases#toggleExpandCollase"`)
  2. `REG. NO.` (e.g. `1001`)
  3. `DATE` (Date in primary text `18/10/2026` + Time in muted text `07:26 PM`)
  4. `PATIENT` (Patient full name `Rahul Sharma` + phone number with phone icon `9876543210`)
  5. `REFERRED BY` (Doctor Name `Dr. Anil Verma` + Degree/Speciality in muted text `MBBS, MD`)
  6. `TOTAL` (Gross bill amount, e.g. `Rs.100`)
  7. `PAID` (Amount received, e.g. `Rs.100`)
  8. `DISCOUNT` (e.g. `Rs.0`)
  9. `STATUS` (Badge: `No due` [Green], `Due` [Orange/Red], `Cancelled` [Gray])
  10. `ACTIONS`:
      - `View bill` (Link to `/cases/:id/bill`)
      - **Three-Dot Meatball Menu:** Trigger button displaying:
        - `Modify` (Link to `/cases/:id/edit`)
        - `Collect Payment` (Opens payment modal if due balance > 0)
        - `Cancel Case` (Opens void case dialog)

#### 1.3. Expandable Row Drawer Content
Clicking the chevron toggle on any row expands an inline nested view showing:
- **Investigation Items:** Test code (e.g. `L1`), Investigation title (e.g. `Complete Blood Count (CBC)`), and `View report` link.
- **Center Tag:** `Collection centre: Main`.

---

### Page 2: Outsource Cases (`/outsource_lab_cases`)

#### 2.1. Header & Controls
- **Heading:** `Outsource cases` (`h1`)
- **Date Range Input:** `Set date range, Last 30 days selected by default` (e.g. `19/09/2026 - 19/10/2026`) with calendar picker.
- **Status Filter:** All, In Transit, Sent to Reference Lab, Result Received, Completed.

#### 2.2. Table Columns
1. `Reg no.` (e.g. `#1003`)
2. `Date` (e.g. `18/10/2026 04:30 PM`)
3. `Patient` (Name, Age, Gender, Contact)
4. `Investigations` (e.g. `Histopathology Skin Biopsy`, `Thyroid Antibodies Anti-TPO`)
5. `Status` (Badge: `Sent to Reference Lab`, `In Transit`, `Report Received`, `Completed`)
6. `Actions` (Upload Partner PDF, View Details)

---

### Page 3: CT Scan Cases (`/ctscan_cases`)

#### 3.1. Header & Controls
- **Heading:** `Ct scan cases` (`h1`)
- **Date Range Input:** `Set date range, Last 30 days selected by default` (e.g. `19/09/2026 - 19/10/2026`).

#### 3.2. Table Columns
1. `Reg no.` (e.g. `CT-1002`)
2. `Date` (e.g. `18/10/2026 11:15 AM`)
3. `Patient` (Name, Age, Sex, Phone)
4. `Investigations` (Protocol: `CT Head / Brain Plain`, `CT Chest High Resolution HRCT`, `CECT Abdomen`)
5. `Status` (Badge: `Scheduled`, `Scanned`, `Reporting`, `Finalized`)
6. `Actions` (Radiology Report Editor, Print DICOM Sheet)

---

### Page 4: Patients (`/patients`)

#### 4.1. Header & Filter Form
- **Heading:** `Patients` (`h1`)
- **Comprehensive Search Grid:**
  1. `UHID`: Input for searching Unique Healthcare ID
  2. `First name`: Search input
  3. `Last name`: Search input
  4. `Mobile number`: Search input
  5. `ID`: Patient database primary key
  6. `From`: Registration start date
  7. `To`: Registration end date
  8. `Search` (Button)
  9. `Clear` (Link returning to full list)

#### 4.2. Patients Master Table
- **Columns:**
  1. `ID` (e.g. `35375569`)
  2. `NAME` (Formatted with age and sex: `Rahul Sharma (32 YRS/M)`)
  3. `ADDRESS` (Clinic catchment address)
  4. `MOBILE NUMBER` (e.g. `9876543210`)
  5. `REGISTERED ON` (e.g. `18/10/2026`)
  6. `ACTIONS`:
     - `View` (Link to patient profile `/patients/:id`)
     - `Edit` (Link to edit demographics `/patients/:id/edit`)
     - `Add case` (Quick CTA `/cases/new?patient_id=:id` pre-populating patient data)

---

### Page 5: Transactions (`/receipts`)

#### 5.1. Header & Filters
- **Heading:** `Transactions` (`h1`)
- **Filter Form:**
  - `Duration`: Combobox (`Past 7 days`, `Past 30 days`, `Past 90 days`, `Custom range`)
  - `Payment mode`: Combobox (`Select mode`, `Cash`, `Card`, `UPI`, `Insurance`)
  - `Collection centre`: Combobox (`Select collection centre`, `Main`)
  - `Type`: Combobox (`Select type`, `Income`, `Refund`)
  - `Show more filters` button: Expands `Patient first name` and `Referred by`
  - `Search` (Button)
  - `Clear` (Link)

#### 5.2. Receipts Ledger Table
- **Columns:**
  1. `ID` (Receipt #, e.g. `42135866`)
  2. `REG. NO.` (Case #, e.g. `#1001`)
  3. `PATIENT NAME` (e.g. `Rahul`)
  4. `REFERRED BY` (Doctor with degree, e.g. `Dr. Anil Verma (MBBS, MD)`)
  5. `DATE` (e.g. `18/10/2026`)
  6. `TIME` (e.g. `07:26 PM`)
  7. `DCN` (Diagnostic Case Number, e.g. `L1`)
  8. `CC` (Collection Centre, e.g. `Main`)
  9. `AMOUNT` (Format: `+ Rs.100` in green for collections, `- Rs.100` in red for refunds)
  10. `METHOD` (Badge: `cash`, `upi`, `card`, `insurance`)
  11. `RECEIVED BY` (Cashier username)
  12. `ACTIONS`: `View bill` link

---

### Page 6: Referral Doctors (`/referrers`)

#### 6.1. Header & A-Z Quick Index Bar
- **Heading:** `Referral Doctors` (`h1`)
- **Alphabet Selector:** `Name starts with:` `A` `B` `C` `D` `E` `F` `G` `H` `I` `J` `K` `L` `M` `N` `O` `P` `Q` `R` `S` `T` `U` `V` `W` `X` `Y` `Z`
- **Filter Form:**
  - `First name`: Search input
  - `Contact number`: Search input
  - `Active`: Combobox (`All`, `Active`, `Inactive`)
  - `Show more filters` button
  - `Search` button
  - `Clear` link
- **Advisory:** *"Inactive referrers will not appear in patient registration page."*
- **Action Link:** `Download active referrers` (CSV/XLSX export)

#### 6.2. Referral Doctors Directory Table
- **Columns:**
  1. `ID` (Doctor ID, e.g. `2`)
  2. `REG. ON ` (Sortable, e.g. `18/10/2026`)
  3. `ACTIVE` (Checkmark badge icon)
  4. `REFERRER ` (Doctor Name `Dr. Anil Verma (MBBS, MD)` + phone with phone icon `9811122233`)
  5. `ADDRESS ` (Clinic / Hospital address)
  6. `PRINT BUSINESS`: `Select` button (Prints doctor financial summary)
  7. `ACTIONS`:
     - `View` (Opens `/referrers_profile/:id/profile`)
     - `Edit` (Opens `/referrers/:id/edit`)

---

### Page 7: Sample Collection Agents (`/sample_collectors`)

#### 7.1. Header & Work Instructions
- **Heading:** `Sample collection agents` (`h1`)
- **Info Card (How does this work?):**
  - *"You can add and edit agents from new case page."*
  - *"Agent name will be displayed on cases page and daily business page."*
  - *"You can filter cases by agent name on cases page."*
- **Tab Buttons:** `Active {count}` and `Archived {count}`

#### 7.2. Agents Table
- **Columns:**
  1. `AGENT ID` (e.g. `AG-01`)
  2. `NAME` (e.g. `Ramesh Phlebotomy Runner`)
  3. `REGISTERED ON` (e.g. `18/10/2026`)
  4. `ACTIONS` (Archive / Restore, Edit phone/area)

---

### Sub-Module: New Bill (`/cases/new`)

#### 1. Top Status Banner
- `New bill` heading
- `Last Reg. no. 1001`
- `Courtesy limit: 200 patients/day`

#### 2. Section 1: Patient details
- `Mobile number` (+91 input)
- `Title *` (Mr., Mrs., Smt., Kumari, Shri., Miss., Master, Mohd., Baby, Baby of, Wife of, Mother of, Son of, Daughter of, Ms., Dr., Child, Mx.)
- `First name *`
- `Last name`
- `Sex *` (Segmented buttons: `MALE`, `FEMALE`, `OTHER`)
- `Age *` (3 inputs: `Years`, `Months`, `Days`)
- Checkbox: `Online report requested`
- Secondary Demographic Buttons: `Email`, `Address`, `Aadhaar`, `Patient history`

#### 3. Section 2: Case details
- `* Referred By` combobox + `+ Add New` + `Edit` + `Manage referrers` link
- `* Collection centre` combobox (Default: `Main`)
- `Sample collection agent` combobox + `Add new` + `Edit`
- **Modality Navigation Bar:** `LAB`, `USG`, `DIGITAL XRAY`, `XRAY`, `OUTSOURCE LAB`, `ECG`, `CT SCAN`, `MRI`, `EPS`, `OPG`, `CARDIOLOGY`, `EEG`, `MAMMOGRAPHY`
- Investigation search auto-complete & test selection tray.

#### 4. Section 3: Payment Details
- `Total: Rs. X`
- `Discount:` input + percentage/fixed toggle
- `Amount received:` required input
- `Balance: Rs. Y`
- `Accept Due` button
- `Mode:` (Cash, UPI, Card, Insurance)
- `Remarks:` textarea
- `Create` primary submit button + `Settings` button

---

## 4. Gap Analysis: Labsmart LIS vs Our Codebase

| Screen / Feature | Labsmart LIS Reality | Our Codebase Before Upgrade | Status & Remediation |
| :--- | :--- | :--- | :--- |
| **All bills (CasesLedger)** | Filter grid with Duration (`Past 7 days`), Reg no, Patient name, Referred by, Collection centre, Agent, `Has due`, `Cancelled`. Expandable rows with test codes (`L1`), test titles, and metadata. | Generic cases table without expandable drawer, missing agent and collection centre filters. | **FIXED:** Added exact filter form, row expander chevrons, nested investigation drawer, and 3-dot modify menu. |
| **Outsource cases** | Date range picker (`Set date range, Last 30 days selected by default`), status badges for Reference Lab TAT. | Static list with custom cost calculator. | **FIXED:** Added exact 30-day default date range picker and 5-column table structure. |
| **Ct scan cases** | Protocol tracker with 30-day date range picker and scan status. | Accession registry with creatinine checks. | **FIXED:** Added exact 30-day date range picker and Labsmart CT column layouts. |
| **Patients** | Search by UHID, First name, Last name, Phone, ID, From/To dates. Columns: ID, Name (Age/Sex), Address, Phone, Registered On, Actions (`View`, `Edit`, `Add case`). | Basic search without UHID and date range filters. | **FIXED:** Added all 7 filter fields and `Add case` direct link. |
| **Transactions** | Receipts ledger with Duration, Mode, CC, Type, `Show more filters`. Table has green `+ Rs.` and red `- Rs.`, DCN (`L1`), and CC. | Simple transactions list without DCN or expandable filters. | **FIXED:** Added exact filter bar with expandable fields, DCN codes, and color-coded amounts. |
| **Referral Doctors** | Alphabet index filter bar (`A` through `Z`), Active checkbox, Download link, `Print Business` (Select button). | Doctor modal without A-Z filter and download link. | **FIXED:** Added A-Z alphabet quick filter bar, active referrers download link, and print business action. |
| **Agents** | "How does this work?" info banner, `Active` / `Archived` tabs, table with Agent ID, Name, Registered On. | Custom delivery area manager. | **FIXED:** Added exact Labsmart instructions banner, tabs, and agent directory layout. |
| **New bill** | 3-step structured form with 24 patient titles, Years/Months/Days age split, 13 modality order tabs, and payment settlement. | Simplified billing form with limited titles. | **FIXED:** Implemented 13 modality tabs, age units, and payment settlement actions. |
