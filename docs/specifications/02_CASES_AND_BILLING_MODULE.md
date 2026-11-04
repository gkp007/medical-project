# Labsmart LIS — Cases & Billing Module Specification

**Specification ID:** `SPEC-02-CASES-BILLING`  
**Module Name:** Patient Registration, Multi-Modality Diagnostic Ordering, Financial Settlement & Invoicing  
**Target Routes:** `/cases/new`, `/cases`, `/cases/:id/bill`, `/outsource_lab_cases`, `/ctscan_cases`, `/receipts`  
**Source Components:**
- `src/pages/cases/NewBillPage.tsx`
- `src/pages/cases/CasesLedgerPage.tsx`
- `src/pages/cases/PrintableBillPage.tsx`
- `src/pages/cases/OutsourceCasesPage.tsx`
- `src/pages/cases/CTScanCasesPage.tsx`
- `src/pages/cases/TransactionsPage.tsx`
- `src/components/organisms/modals/AcceptDueModal.tsx`
- `src/components/organisms/modals/CancelBillModal.tsx`
- `src/components/organisms/modals/DoctorModal.tsx`
- `src/components/organisms/modals/UpdatePatientDetailsModal.tsx`
- `src/components/organisms/modals/EditReferrerModal.tsx`
- `src/components/organisms/modals/EditTransactionModal.tsx`
- `src/components/organisms/modals/ViewPatientModal.tsx`

---

## 1. Executive Summary & Domain Logic

The **Cases & Billing** module forms the financial and clinical entry point of Labsmart LIS. Every diagnostic event begins here:
1. **Patient Registration & Longitudinal Indexing (UHID)**: De-duplication, age in Years/Months/Days, Aadhaar, clinical history, and contact metadata.
2. **Consulting Physician Tagging & Commission Rules**: Doctor referral linking, specialized percentage commission tracking.
3. **13 Medical Modalities Ordering**: Pathology (LAB), Ultrasound (USG), Digital X-Ray, Plain X-Ray, Outsource Lab, ECG, CT Scan, MRI, EPS, OPG, Cardiology, EEG, and Mammography.
4. **Financial Settlement Engine**: Gross rate summation, flat (₹) vs percentage (%) discounts, discount rationale auditing, advance collection, multi-instrument payments (Cash, UPI, Card, Cheque, NEFT), balance due enforcement, and receipt generation.
5. **Printable Invoicing**: Dual-engine rendering supporting pre-printed letterheads (A4/A5 with top/bottom margin calibration) and thermal point-of-sale receipt slips (80mm / 3-inch roll).

---

## 2. Screen 1: New Bill & Patient Registration (`/cases/new`)

### 2.1 Screen Architecture & Two-Column Layout
- Route: `/cases/new` (Internal ID: `new_bill`)
- Global Shortcut: `Alt + N`
- Grid Layout: 2-column responsive layout (`minmax(360px, 1fr)`). Left column: Patient & Tests (~62%); Right column: Sticky Financial Summary & Till (~38%).

### 2.2 Card 1: Patient Demographics & Identification
1. **Title / Name Prefix Selector** (`Select`, Required):
   - Options (24 prefixes): `Mr`, `Mrs`, `Ms`, `Dr`, `Prof`, `Master`, `Baby`, `Baby of`, `Smt`, `Sri`, `Md`, `Col`, `Major`, `Capt`, `Brig`, `Sister`, `Rev`, `Father`, `Sheikh`, `Advocate`, `Justice`, `Swami`, `Shri`, `Late`.
   - Default: `Mr`
2. **Patient Full Name** (`Input`, Required):
   - Type: Text, min 2 characters.
   - Placeholder: `Enter full name` (e.g. `Rahul Sharma`).
3. **Age & Age Unit Grid**:
   - `Age Value` (`Input`, Required): Numeric spinbutton, integer $\ge 0$.
   - `Age Unit` (`Select`, Required): `Years` (Default), `Months`, `Days`. Enables neonatal and pediatric reference range matching.
4. **Gender Selector** (`PillGroup`, Required):
   - Options: `Male` | `Female` | `Other`.
   - Visual: Distinct pill buttons, active state `#0284c7` background with white text.
5. **Mobile Number** (`Input`, Required):
   - Validation: 10-digit Indian standard phone format (`^[6-9]\d{9}$`).
   - Helper Text: `SMS invoice link will be sent to this number.`
   - Side Effect: Input change triggers auto-lookup in patient master; if existing UHID found, prompts auto-fill banner.
6. **UHID / MRN** (`Input`, Auto-Generated / Editable):
   - Placeholder: `Auto-assigned` (e.g. `35375569` or `UHID-2026-0001`).
   - Helper Text: `Unique health ID for longitudinal medical records.`

---

### 2.3 Card 2: Referral, Logistics & Investigations Picker
1. **Referring Doctor Selector**:
   - Element: Searchable Select Combobox.
   - Default: `Dr. Anil Verma, MBBS MD (Internal Medicine)` (`833120`).
   - Options List: Dynamic from `/api/v1/doctors` + `Self Referral / Walk-in Patient` (`self`).
   - Quick Action Button: `+ Add New` -> triggers `DoctorModal` inline without leaving form.
2. **Collection Centre / Franchise Selector**:
   - Options: `Main Laboratory Branch` (`main`), `City Care Collection Center (AG-102)`, `Sector 56 Phlebotomy Point (AG-105)`.
3. **Sample Collection Agent / Phlebotomist**:
   - Options: `None / Direct Walk-in`, `Ramesh Kumar (North Zone)`, `Suresh Verma (Central Phlebotomy)`, `Amit Patel (South Zone)`.
4. **Collection Date & Time**:
   - Input: `datetime-local`, defaults to current timestamp (`YYYY-MM-DDTHH:MM`).
5. **STAT / Urgent Processing Toggle**:
   - Checkbox: `STAT / Urgent Processing` with red indicator `#dc2626`.
   - Effect: Flags all ordered tests as high priority on laboratory bench worklists.
6. **Modality Department Selector (13 Modalities Horizontal Tabs)**:
   - Pills: `LAB` (Default), `USG`, `DIGITAL XRAY`, `XRAY`, `OUTSOURCE LAB`, `ECG`, `CT SCAN`, `MRI`, `EPS`, `OPG`, `CARDIOLOGY`, `EEG`, `MAMMOGRAPHY`.
   - Behavior: Selecting a tab filters the investigation search catalog to matching diagnostic departments.
7. **Investigation Search & Add Combobox**:
   - Autocomplete dropdown searching 500+ diagnostic tests, panels, and packages.
   - Option Display: `{CODE} — {Name} — ₹{Rate}.00 ({Department})`
   - Selection Event: Immediately adds item to `selectedTests` array with sound/toast notification.
8. **Selected Investigations Table**:
   - Columns:
     * `Test Name`: Bold test name + department subtitle.
     * `Specimen`: Tube / specimen container (e.g. `EDTA Whole Blood`, `Serum`, `Sodium Fluoride Plasma`).
     * `Delivery`: Expected report delivery estimate (e.g. `Today, 11:30 PM`).
     * `Rate (₹)`: MRP rate in bold currency formatting.
     * `Action`: Red trash icon `<Trash2 size={16} />` triggering confirmation modal to prevent accidental test removal.
   - Empty State: `No investigations added. Select tests from the search box above.`

---

### 2.4 Card 3: Financial Summary & Payment Till (Sticky 38%)
1. **Gross Amount Display**:
   $$\text{Gross Amount} = \sum_{i=1}^n \text{Rate}_i$$
   Displayed in bold 15px `#0f172a`.
2. **Discount Controls Grid**:
   - `Discount Type` (`PillGroup`): `₹` (Flat Rupee) vs `%` (Percentage).
   - `Discount Value Input`: Numeric spinbutton.
   - Real-time Discount Calculation:
     $$\text{Discount Amount} = \begin{cases} \text{Value}, & \text{if Type } = \text{₹} \\ \frac{\text{Gross} \times \text{Value}}{100}, & \text{if Type } = \% \end{cases}$$
   - `Discount Reason` (Mandatory if discount > 0):
     * Options: `Doctor Referral Discount`, `Senior Citizen Concession`, `Staff / Relative Concession`, `Special Management Approval`, `Corporate / Camp Package`.
3. **Net Payable Amount**:
   $$\text{Net Payable} = \max(0, \text{Gross Amount} - \text{Discount Amount})$$
   Rendered in large bold blue typography (`22px`, `#1565c0`).
4. **Amount Received / Paid Input**:
   - Default: Pre-filled with `Net Payable`.
   - Input: Numeric spinbutton, formatted in large font.
5. **Payment Mode Selector**:
   - Pills: `Cash` (Default), `UPI`, `Card`, `Cheque`, `NEFT`.
6. **Balance Due & Due Acceptance Box**:
   $$\text{Balance Due} = \max(0, \text{Net Payable} - \text{Amount Received})$$
   - When `Balance Due == 0`: Green success card `✓ Fully Paid`.
   - When `Balance Due > 0`: Red alert card `⚠ Balance Due: ₹{balanceDue}`.
   - `Accept Due Checkbox`: Must be checked by receptionist if saving a case with outstanding balance. Includes explanatory disclaimer: `Patient acknowledges ₹{balanceDue} remaining payable.`
7. **Communication Dispatch Checkboxes**:
   - `[x] Send Bill Receipt SMS to patient`
   - `[x] Send WhatsApp Download Link when report is ready`
8. **Primary Form Action Buttons**:
   - `Save & Enter Results` (Primary Blue): Persists bill and immediately opens `/lab_reports/:id/results`.
   - `Save & Print Bill` (Secondary Green): Persists bill and opens `/cases/:id/bill`.
   - `Reset Form` (Outline Danger): Opens `ConfirmationModal` before clearing state.

---

## 3. Screen 2: All Bills Ledger (`/cases`)

### 3.1 Primary Filter Form
- **Filter Grid Controls**:
  1. `Duration`: Combobox (`Past 7 days` [Default], `Today`, `Yesterday`, `Past 30 days`, `Past 90 days`, `Custom Range`).
  2. `Reg. no.`: Direct integer case search.
  3. `Patient first name`: Instant text search.
  4. `Referred by`: Combobox with autocomplete for doctors (`All`, `Dr. Anil Verma`, etc.).
  5. `Collection centre`: Filter by branch (`All`, `Main`, `Branch 1`).
  6. `Sample collection agent`: Phlebotomist filter.
  7. `Has due` Checkbox: Filters only cases where `balanceDue > 0`.
  8. `Cancelled` Checkbox: Filters voided bills.
  9. Action Buttons: `Search` (Primary Blue) & `Clear` (Resets filters).

### 3.2 Bills Master Table
Columns:
1. `( > / v )` Expand Chevron: Toggles inline drawer.
2. `REG. NO.`: Monospace bold link (e.g. `#1001`).
3. `DATE & TIME`: Primary text `18/10/2026` + muted text `07:26 PM`.
4. `PATIENT`: Patient Name + Phone icon and number (`9876543210`).
5. `REFERRED BY`: Doctor name (`Dr. Anil Verma`) + Degree (`MBBS, MD`).
6. `TOTAL`: Gross bill amount (e.g. `Rs.100`).
7. `PAID`: Amount collected (e.g. `Rs.100`).
8. `DISCOUNT`: Concession deducted (e.g. `Rs.0`).
9. `STATUS`: Badges:
   * `No due`: Green pill (`bg: #dcfce7`, `text: #15803d`).
   * `Due`: Red/Orange pill (`bg: #fee2e2`, `text: #b91c1c`).
   * `Cancelled`: Gray pill (`bg: #f1f5f9`, `text: #64748b`).
10. `ACTIONS`:
    * `View bill`: Navigates to `/cases/:id/bill`.
    * 3-Dot Meatball Menu:
      - `Modify`: Opens `/cases/:id/edit`.
      - `Collect Payment`: Opens `AcceptDueModal` if due balance > 0.
      - `Cancel Case`: Opens `CancelBillModal`.
      - `Print Barcode`: Triggers specimen tube barcode label printing.

### 3.3 Expandable Row Drawer Content
Clicking chevron on any row expands an inline nested view showing:
- **Investigation Items**: Test code (e.g. `L1`), Full Name (e.g. `Complete Blood Count (CBC)`), and `View report` link.
- **Specimen & Routing**: `Collection centre: Main`, `Specimen: EDTA Whole Blood (Lavender Tube)`.
- **Payment History Ledger**: Date, time, mode, cashier name, receipt number.

---

## 4. Screen 3: Printable Bill / Invoice & Receipt (`/cases/:id/bill`)

### 4.1 Sub-Views & Configuration Toolbar
- **Sub-Views**:
  * `bill` (Default printable invoice layout)
  * `update_patient` (Inline form via `UpdatePatientDetailsModal`)
  * `edit_referrer` (Inline doctor reassignment via `EditReferrerModal`)
  * `patient_profile` (Deep link to historical patient records)
- **Top Print Configuration Bar**:
  * `Version`: `Version 1` vs `Version 2`.
  * `Page Size`: `A5` | `A4` | `Thermal (80mm)`.
  * `Orientation`: `Portrait` | `Landscape`.
  * Actions: `Print` (triggers browser print), `Download PDF`, `Share on WhatsApp`, `Send SMS`.

### 4.2 Bill Document Layout (A4/A5 Engine)
1. **Header Section**:
   - Lab Logo (Left), Clinic Name, NABL accreditation certificate number, Full Address, Contact phone, Email, GSTIN.
   - Receipt Title: `TAX INVOICE & CASH RECEIPT`.
2. **Patient & Referral Meta Grid**:
   - Left Column: `Patient Name`, `Age / Sex`, `UHID`, `Mobile Number`, `Patient Address`.
   - Right Column: `Bill No / Reg No`, `Bill Date & Time`, `Referred By Doctor`, `Collection Centre`.
3. **Itemized Billing Table**:
   - Headers: `S.No`, `Investigation Description`, `Department`, `Rate (₹)`, `Discount (₹)`, `Net Amount (₹)`.
4. **Financial Settlement Breakdown**:
   - `Gross Subtotal`: ₹{gross}
   - `Total Discount`: -₹{discount}
   - `CGST / SGST`: ₹0.00 (Healthcare diagnostic exemption under HSN 9993)
   - `Net Bill Amount`: ₹{net}
   - `Amount Paid`: ₹{paid}
   - `Balance Due`: ₹{due}
5. **Payment Audit Footnote**:
   - Receipt number, payment instrument (Cash/UPI/Card), Cashier signature line, Patient signature line.
6. **QR Code Verification**:
   - QR code encoding secure URL: `https://reports.labsmart.in/view/{token}` allowing patient or doctor to download official digital report.

### 4.3 Thermal Receipt Format (80mm Point-of-Sale)
- Width: `80mm` (`3.15in`), Continuous feed paper.
- Compact typography: Lab Name, Reg No, Patient Name, Test list, Total, Paid, Balance, Cashier name, Barcode, Return/Disclaimer text.

---

## 5. Screen 4 & 5: Outsource & CT Scan Cases

### 5.1 Outsource Cases (`/outsource_lab_cases`)
- **Objective**: Track biological specimens sent to external tertiary reference labs (e.g. SRL, Dr. Lal PathLabs, Oncquest).
- **Table Columns**: `Reg no.`, `Date`, `Patient`, `Investigations`, `Reference Lab Name`, `Outsource Cost (B2B)`, `Patient Charge (MRP)`, `Courier / Docket No`, `Status` (`In Transit`, `Processing at Lab`, `Result Uploaded`), `Actions` (`Upload External PDF`, `Mark Completed`).

### 5.2 CT Scan Cases (`/ctscan_cases`)
- **Objective**: Manage computerized tomography imaging worklists.
- **Specialized Fields**:
  * `Protocol`: `CT Head Plain`, `HRCT Thorax`, `CECT Whole Abdomen`, `CT Angiography`.
  * `Contrast Safety Check`: Serum Creatinine level check ($\le 1.4\text{ mg/dL}$ required for IV non-ionic iodinated contrast), Allergy history.
  * `Scan Status`: `Scheduled`, `Scanned`, `Reporting`, `Authorized`.

---

## 6. Screen 6: Transactions Ledger (`/receipts`)

- **Objective**: Immutable chronological receipt audit of every payment and refund transaction.
- **Filter Controls**: `Duration` (`Past 7 days`), `Payment Mode` (`All`, `Cash`, `UPI`, `Card`, `Insurance`), `Collection Centre`, `Transaction Type` (`Collection`, `Refund`), `Search Patient Name`.
- **Table Columns**:
  1. `RECEIPT ID`: Sequential ID (e.g. `42135866` / `REC-2026-0001`).
  2. `REG. NO.`: Associated case link (`#1001`).
  3. `PATIENT NAME`: Patient Name.
  4. `REFERRED BY`: Doctor.
  5. `DATE & TIME`: Transaction timestamp.
  6. `DCN`: Daily Case Number badge (`L1`, `U1`).
  7. `CC`: Collection Center (`Main`).
  8. `AMOUNT`: Net collection amount in green or refund in red.
  9. `METHOD`: Badge (`Cash`, `UPI`, `Card`, `Insurance`).
  10. `RECEIVED BY`: Username of cashier who logged transaction.
  11. `ACTIONS`: `View bill`, `Edit Transaction` (Opens `EditTransactionModal` for authorized managers to change payment mode or add audit notes).

---

## 7. Modals Catalog for Cases & Billing

### 7.1 Accept Due Modal (`AcceptDueModal.tsx`)
- **Inputs**: Amount to collect, Payment mode (`Cash`, `UPI`, `Card`, `Cheque`), Transaction reference #, Print receipt checkbox, Send SMS checkbox.
- **Action**: Persists `PaymentTransaction`, updates `Case.balanceDue`, prints cash slip.

### 7.2 Cancel Bill Modal (`CancelBillModal.tsx`)
- **Inputs**: Mandatory Cancellation Reason dropdown (`Patient cancelled / Left without giving sample`, `Duplicate bill registered`, `Wrong investigations selected`, `Specimen rejected / Hemolyzed`, `Clerical billing error`, `Other`), Additional audit remarks, Issue Refund toggle (`Refund ₹{paid}`).
- **Action**: Marks `Case.reportStatus = 'Cancelled'`, voids transactions, triggers notification.

### 7.3 Doctor Modal (`DoctorModal.tsx`)
- **Inputs**: Full Name, Degree/Qualification, Medical Speciality, Mobile, Address/Clinic, Incentive/Commission %.
- **Action**: Creates `Doctor` record and auto-selects in current billing dropdown.

### 7.4 Update Patient Details Modal (`UpdatePatientDetailsModal.tsx`)
- **Inputs**: Title, First Name, Last Name, Sex, Age (Y/M/D), Mobile, Online Report Requested, Email, Address, Aadhaar number, Patient medical history notes.
- **Action**: Updates `Patient` master record and cascades to all linked cases.

---

## 8. Backend API Specifications & Architecture

### 8.1 RESTful Endpoints

#### 1. POST `/api/v1/cases`
- **Purpose**: Registers a new diagnostic case bill.
- **Headers**: `Authorization: Bearer <jwt>`, `X-Branch-Id: <branch_id>`
- **Request Body JSON**:
```json
{
  "patient": {
    "uhid": "35375569",
    "prefix": "Mr",
    "fullName": "Rahul Sharma",
    "age": 32,
    "ageUnit": "Years",
    "gender": "Male",
    "mobile": "9876543210",
    "email": "rahul.sharma@example.com",
    "address": "B-42 Nirman Vihar, Delhi"
  },
  "doctorId": "833120",
  "centreId": "main",
  "agentId": null,
  "modality": "LAB",
  "isUrgent": false,
  "collectedAt": "2026-10-19T10:30:00Z",
  "items": [
    {
      "testId": "CBC",
      "testCode": "CBC",
      "testName": "Complete Blood Count (CBC)",
      "department": "Hematology",
      "specimen": "EDTA Whole Blood",
      "rate": 400.0,
      "discount": 0.0,
      "netAmount": 400.0
    }
  ],
  "financials": {
    "grossAmount": 400.0,
    "discountType": "fixed",
    "discountValue": 0.0,
    "discountAmount": 0.0,
    "discountReason": null,
    "netPayable": 400.0,
    "paidAmount": 400.0,
    "balanceDue": 0.0,
    "paymentMode": "Cash",
    "transactionRef": null
  },
  "notifications": {
    "sendSmsReceipt": true,
    "sendWhatsAppReport": true
  }
}
```
- **Response JSON (201 Created)**:
```json
{
  "caseId": "case-90214",
  "billNumber": "BL-2026-1001",
  "uhid": "35375569",
  "receiptNumber": "REC-2026-0843",
  "paymentStatus": "Paid",
  "reportStatus": "Registered",
  "barcodes": [
    { "tube": "EDTA Whole Blood", "barcodeNumber": "1001-CBC", "color": "Lavender" }
  ]
}
```

#### 2. GET `/api/v1/cases`
- **Purpose**: Queries bills ledger with multi-column filtering and pagination.
- **Query Parameters**: `duration=past_7_days&regNo=1001&patientName=Rahul&hasDue=false&page=1&limit=25`
- **Response JSON (200 OK)**: Returns paginated array of cases matching schema.

#### 3. POST `/api/v1/cases/:id/cancel`
- **Purpose**: Voids a registered case bill.
- **Request Body**:
```json
{
  "reason": "Duplicate bill registered by mistake",
  "notes": "Patient billed twice at reception desk",
  "issueRefund": true,
  "refundAmount": 400.0
}
```
- **Response JSON (200 OK)**:
```json
{
  "caseId": "case-90214",
  "status": "Cancelled",
  "refundReceiptNumber": "REF-2026-0012",
  "auditTimestamp": "2026-10-30T10:35:00Z"
}
```
