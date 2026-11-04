# Labsmart LIS — Master Modals & Dialogs Catalog Specification

**Specification ID:** `SPEC-09-MODALS-CATALOG`  
**Module Name:** Master Modals, Flyout Drawers, Popovers & Confirmation Dialogs Catalog  
**Document Purpose:** Exhaustive engineering reference cataloging all 32 modal dialogs, drawers, and popovers across the Labsmart LIS application. For every dialog, this specification outlines trigger conditions, DOM properties, form controls, validation rules, state transitions, and backend API contracts.

---

## 1. Catalog Index & Categorization

| # | Modal Name | Component File / Location | Primary Trigger | Target Backend Endpoint |
|---|---|---|---|---|
| 1 | `OmnisearchModal` | `src/components/organisms/OmnisearchModal.tsx` | `Ctrl+K` / Topbar Search | `GET /api/v1/shell/omnisearch` |
| 2 | `AcceptDueModal` | `src/components/organisms/modals/AcceptDueModal.tsx` | Click "Accept Due" / "CreditCard" icon | `POST /api/v1/payments/collect-due` |
| 3 | `CancelBillModal` | `src/components/organisms/modals/CancelBillModal.tsx` | Meatball Menu -> "Cancel Case" | `POST /api/v1/cases/:id/cancel` |
| 4 | `DoctorModal` | `src/components/organisms/modals/DoctorModal.tsx` | Billing -> "+ Add New Doctor" | `POST /api/v1/doctors` |
| 5 | `EditReferrerModal`| `src/components/organisms/modals/EditReferrerModal.tsx` | Printable Bill -> "Edit Doctor" | `PUT /api/v1/doctors/:id` |
| 6 | `UpdatePatientDetailsModal`| `src/components/organisms/modals/UpdatePatientDetailsModal.tsx` | Printable Bill -> "Edit Patient" | `PUT /api/v1/patients/:id` |
| 7 | `ViewPatientModal` | `src/components/organisms/modals/ViewPatientModal.tsx` | Printable Bill -> "View Patient" | `GET /api/v1/patients/:id/summary` |
| 8 | `EditTransactionModal`| `src/components/organisms/modals/EditTransactionModal.tsx`| Receipts -> "Edit Transaction" | `PUT /api/v1/payments/transactions/:id` |
| 9 | `RaiseTicketModal` | `src/components/organisms/modals/RaiseTicketModal.tsx` | Topbar Help -> "Raise Ticket" | `POST /api/v1/support/tickets` |
| 10 | `SmsCreditsModal` | `src/components/organisms/modals/SmsCreditsModal.tsx` | Click "SMS: {n}" topbar pill | `POST /api/v1/billing/recharge-sms` |
| 11 | `ReferModal` | `src/components/organisms/modals/ReferModal.tsx` | Click "Refer Lab" gift button | `POST /api/v1/referrals/invite` |
| 12 | `PrintSettingsGuideModal`| `src/components/organisms/modals/PrintSettingsGuideModal.tsx`| Topbar Help -> "Printer Guide" | N/A (Static Guide) |
| 13 | `ConfirmationModal`| `src/components/organisms/modals/ConfirmationModal.tsx`| Generic delete / discard triggers | Dynamic callback |
| 14 | `AddExpenseModal` | `src/pages/business/DailyBusinessPage.tsx` | "+ Add Expense" button | `POST /api/v1/expenses` |
| 15 | `AddCashierModal` | `src/pages/business/DailyBusinessPage.tsx` | "+ Add cashier" button | `POST /api/v1/business/cashiers` |
| 16 | `BusinessReportModal`| `src/pages/business/DailyBusinessPage.tsx` | "Business Report" button | `GET /api/v1/business/daily-report` |
| 17 | `EmailDailyBusinessModal`| `src/pages/business/DailyBusinessPage.tsx`| "Email" top action button | `POST /api/v1/business/email-report` |
| 18 | `CollectionChargeInfoModal`| `src/pages/business/DailyBusinessPage.tsx`| "How collection charges work?" | N/A (Explanatory modal) |
| 19 | `SpecimenBarcodeModal`| `src/pages/lab/TodayReportsPage.tsx` | Meatball -> "Print Barcode" | `GET /api/v1/cases/:id/barcodes` |
| 20 | `SignOffModal` | `src/pages/lab/EnterResultsPage.tsx` | "Verify & Sign-off" button | `POST /api/v1/pathology/cases/:id/signoff` |
| 21 | `USGEnterFindingsModal`| `src/pages/lab/USGWorklistPage.tsx` | "Enter Findings" on USG queue | `POST /api/v1/usg/cases/:id/findings` |
| 22 | `XRayEnterFindingsModal`| `src/pages/lab/XRayWorklistPage.tsx` | "Enter Findings" on X-Ray queue | `POST /api/v1/xray/cases/:id/findings` |
| 23 | `NewEmployeeModal` | `src/pages/manage/EmployeeLoginsPage.tsx` | "+ New employee" button | `POST /api/v1/security/employees` |
| 24 | `ExistingEmployeeModal`| `src/pages/manage/EmployeeLoginsPage.tsx`| "+ Existing employee" button | `POST /api/v1/security/employees/link` |
| 25 | `EditPermissionsModal`| `src/pages/manage/EmployeeLoginsPage.tsx`| "Permissions" on employee row | `PUT /api/v1/security/employees/:id/permissions` |
| 26 | `ResetPasswordModal`| `src/pages/manage/EmployeeLoginsPage.tsx`| "Reset Password" on employee | `POST /api/v1/security/employees/:id/reset-password` |
| 27 | `BlockEmployeeModal`| `src/pages/manage/EmployeeLoginsPage.tsx`| "Block User" on employee row | `PUT /api/v1/security/employees/:id/status` |
| 28 | `RenameBrowserModal`| `src/pages/manage/BrowserSecurityPage.tsx`| Pencil icon on browser terminal | `PUT /api/v1/security/browsers/:id/rename` |
| 29 | `AddTestMasterModal`| `src/pages/manage/TestMasterPage.tsx` | "+ Add New Test" button | `POST /api/v1/masters/tests` |
| 30 | `AddPackageModal` | `src/pages/manage/PackagesPage.tsx` | "+ Create Package" button | `POST /api/v1/masters/packages` |
| 31 | `AddPanelModal` | `src/pages/manage/TestPanelsPage.tsx` | "+ Create Panel" button | `POST /api/v1/masters/panels` |
| 32 | `SettleCommissionModal`| `src/pages/business/ReferralBusinessPage.tsx`| "Settle Commission" button | `POST /api/v1/doctors/:id/settle-payout` |

---

## 2. Exhaustive Specifications of Critical Modals

---

### Modal 1: Omnisearch Modal (`OmnisearchModal.tsx`)
- **Trigger**: Click top search bar OR press `Ctrl+K` / `Cmd+K`.
- **Dimensions**: Centered overlay, max-width `680px`, backdrop `#0f172a` with blur.
- **Controls**:
  1. `Search Query Input`:
     * Placeholder: `Type patient name, phone number, UHID, Reg No, or test name...`
     * Prefix: Search icon `<Search size={20} />`
     * Auto-focus on mount.
     * Debounce: 150ms.
- **Keyboard Listeners**: `ArrowDown` (select next item), `ArrowUp` (select prev item), `Enter` (navigate to selected item), `Escape` (close modal).
- **Results Groups**:
  * Patients (Name, Mobile, UHID)
  * Cases (Bill No, Patient, Date, Status)
  * Tests (Test Name, Department, MRP Rate)
  * Doctors (Doctor Name, Speciality, Clinic)
  * Quick Navigation Shortcuts (New Bill, Daily Business, Today's Reports)
- **API Contract**: `GET /api/v1/shell/omnisearch?q={query}&limit=15`

---

### Modal 2: Accept Due Payment Modal (`AcceptDueModal.tsx`)
- **Trigger**: Click `Accept Due` button on Dashboard, Cases Ledger, or Due Reports.
- **Header**: Title `Accept Patient Due Payment`, max-width `540px`.
- **Pre-loaded Case Context Card**:
  * Patient Full Name (Bold 15px)
  * Reg No & Registration Date
  * Current Due Amount: Displayed in large red font (`Rs. {dueAmount}`)
- **Form Controls**:
  1. `Amount to Collect (₹)` (`Input type="number"`, Required):
     * Default: Pre-filled with total outstanding due.
     * Validation: Must be $> 0$ and $\le \text{dueAmount}$.
  2. `Payment Mode Selector` (`PillGroup`, Required):
     * Options: `Cash` | `UPI` | `Card` | `Cheque`.
     * Default: `Cash`.
  3. `Transaction / Cheque / UTR Reference No` (`Input`, Optional):
     * Placeholder: `e.g. UPI-981029482` (Required if Mode = UPI or Card).
  4. `Print Receipt Immediately` (`Checkbox`, Default: Checked).
  5. `Send Confirmation SMS to Patient` (`Checkbox`, Default: Checked).
- **Dynamic Calculation Box**:
  * Renders: `Remaining Balance after this payment: Rs. {dueAmount - amount}`.
- **Actions**:
  * `Cancel Button` (Secondary gray)
  * `Collect & Save Payment Button` (Primary Blue, icon `<CreditCard size={16} />`)
- **Success State**: Replaces form with green checkmark `<CheckCircle2 size={40} />` and text: `Payment Collected Successfully! Receipt of Rs. {amount} recorded.` Closes after 1200ms.
- **API Contract**: `POST /api/v1/payments/collect-due`

---

### Modal 3: Cancel & Void Bill Modal (`CancelBillModal.tsx`)
- **Trigger**: Cases Ledger -> Row Meatball Menu -> `Cancel Case`.
- **Header**: Title `Cancel & Void Case Bill`, max-width `500px`.
- **Warning Alert Box**: Red alert box explaining that cancelling will immediately void the invoice and remove ordered tests from laboratory worklists.
- **Form Controls**:
  1. `Reason for Cancellation` (`Select`, Required):
     * Options:
       - `Patient cancelled test / Left without giving sample`
       - `Duplicate bill registered by mistake`
       - `Wrong investigations selected`
       - `Specimen rejected / Hemolyzed (No re-collection)`
       - `Billing clerical error / Price adjustment`
       - `Other reason`
  2. `Additional Remarks` (`Textarea`, Optional):
     * Rows: 2, Placeholder: `Add specific notes for audit records...`
  3. `Issue Cash Refund Toggle` (`Checkbox`, Default: Checked if `paidAmount > 0`):
     * Label: `Refund Rs. {paidAmount} to patient`
     * Note: Reverses cash till accounting ledger.
- **Actions**:
  * `Keep Bill Active` (Secondary gray)
  * `Void & Cancel Bill` (Danger Red button, icon `<Ban size={16} />`)
- **API Contract**: `POST /api/v1/cases/:id/cancel`

---

### Modal 4: Add Referring Doctor Modal (`DoctorModal.tsx`)
- **Trigger**: New Bill Screen -> Referring Doctor Combobox -> `+ Add New`.
- **Header**: Title `Add New Referring Doctor`, size `Medium (md)`.
- **Form Controls**:
  1. `Doctor Full Name` (`Input`, Required):
     * Placeholder: `e.g. Dr. Anil Verma`
     * Validation: Min 3 chars.
  2. `Degree / Qualification` (`Input`, Required):
     * Default: `MBBS, MD`
     * Placeholder: `e.g. MBBS, MD, MS, DGO`
  3. `Medical Speciality` (`Input`, Required):
     * Default: `General Medicine`
     * Placeholder: `e.g. Internal Medicine, Orthopaedics`
  4. `Mobile Number` (`Input`, Optional):
     * 10-digit phone format.
  5. `Clinic / Hospital Address` (`Input`, Optional):
     * Placeholder: `e.g. Verma Clinic, Sector 14`
  6. `Default Incentive / Commission %` (`Input type="number"`, Required):
     * Default: `15%` (Range: `0 - 100%`).
- **Actions**:
  * `Cancel` (Secondary)
  * `Save Doctor` (Primary Blue)
- **Side Effect**: On save, new doctor is prepended to the billing doctor dropdown and automatically selected.
- **API Contract**: `POST /api/v1/doctors`

---

### Modal 5: Edit Referring Doctor Modal (`EditReferrerModal.tsx`)
- **Trigger**: Printable Bill Page -> Sidebar -> `Edit Doctor`.
- **Header**: Title `Edit Case Referring Doctor & Commission Rules`.
- **Extended Form Controls**:
  * Name, Degree, Speciality, Phone, Clinic Address.
  * Department-specific Commission Rule Matrix:
    - `Pathology %` (e.g. `20%`)
    - `Ultrasound (USG) %` (e.g. `25%`)
    - `Digital X-Ray %` (e.g. `30%`)
    - `CT Scan %` (e.g. `15%`)
    - `Outsource Lab %` (e.g. `10%`)
- **API Contract**: `PUT /api/v1/doctors/:id`

---

### Modal 6: Update Patient Details Modal (`UpdatePatientDetailsModal.tsx`)
- **Trigger**: Printable Bill Page -> Sidebar -> `Edit Patient Profile`.
- **Form Controls**:
  1. `Title` (`Select`): `Mr.`, `Mrs.`, `Ms.`, `Master`, `Baby`, `Dr.`.
  2. `First Name` (`Input`, Required): Text.
  3. `Last Name` (`Input`, Optional): Text.
  4. `Gender` (`PillGroup`, Required): `MALE` | `FEMALE` | `OTHER`.
  5. `Age Split` (`Grid 3 Inputs`): `Years`, `Months`, `Days`.
  6. `Mobile Number` (`Input`, Required): 10-digit number.
  7. `Online Report Requested` (`Checkbox`): Enables patient SMS notification link.
  8. `Expandable Optional Fields`:
     * `[+] Add Email`: Email address input.
     * `[+] Add Address`: Residential address textarea.
     * `[+] Add Aadhaar Number`: 12-digit UIDAI number.
     * `[+] Add Patient Medical History`: Clinical history notes.
- **API Contract**: `PUT /api/v1/patients/:id`

---

### Modal 7: Edit Transaction Modal (`EditTransactionModal.tsx`)
- **Trigger**: Receipts / Transactions Ledger -> Row Action -> `Edit`.
- **Header**: Title `Modify Transaction Details (Manager Audit)`.
- **Form Controls**:
  1. `Transaction ID` & `Receipt No`: Readonly labels.
  2. `Amount Collected (₹)`: Readonly value (prevents financial tampering).
  3. `Payment Instrument Method` (`Select`, Required):
     * Options: `Cash` | `UPI` | `Card` | `Insurance` | `Cheque`.
  4. `Bank / UTR Reference Number` (`Input`): UTR transaction string.
  5. `Reason for Modification` (`Textarea`, Required): Mandatory audit explanation (e.g. `Patient mistakenly recorded as Cash, paid via GPay QR`).
- **API Contract**: `PUT /api/v1/payments/transactions/:id`

---

### Modal 8: Add Expense Voucher Modal (`AddExpenseModal`)
- **Trigger**: Daily Business / Expenses Page -> `+ Add Expense` button.
- **Header**: Title `Record Operational Expense Voucher`.
- **Form Controls**:
  1. `Expense Name / Item` (`Input`, Required): e.g. `Sysmex Cleaning Solution 5L`.
  2. `Amount Disbursed (₹)` (`Input type="number"`, Required): $> 0$.
  3. `Category` (`Select`, Required): `Lab Reagents & Consumables`, `Staff Salaries`, `Rent & Utilities`, `Bio-waste Disposal`, `Logistics & Fuel`, `Repairs & Maintenance`, `Tea & Refreshments`, `Miscellaneous`.
  4. `Payment Instrument Mode` (`PillGroup`, Required): `Cash` (Deducts from till) | `UPI` | `Card`.
  5. `Spent On Timestamp` (`datetime-local`, Required): Default current time.
  6. `Vendor / Payee Name` (`Input`): e.g. `Transasia Bio-Medicals`.
  7. `Voucher Reference / Bill No` (`Input`): e.g. `BILL-89102`.
  8. `Upload Bill Photo / Invoice PDF` (`FileInput`): Max 5MB.
  9. `Remarks / Accounting Notes` (`Textarea`).
- **API Contract**: `POST /api/v1/expenses`

---

### Modal 9: Add Cashier Modal (`AddCashierModal`)
- **Trigger**: Daily Business Page -> `+ Add cashier` button.
- **Header**: Title `Assign Front Desk Cashier & Counter Till`.
- **Form Controls**:
  1. `Cashier Staff Name` (`Input`, Required).
  2. `Staff Mobile Number` (`Input`, Required).
  3. `Assigned Counter Desk` (`Select`): `Counter 1 (Main Reception)`, `Counter 2 (Emergency)`, `Counter 3 (Radiology Desk)`.
  4. `Assigned Shift` (`Select`): `Morning (08:00 AM - 02:00 PM)`, `Evening (02:00 PM - 08:00 PM)`, `Night (08:00 PM - 08:00 AM)`.
  5. `Opening Float Cash (₹)` (`Input type="number"`, Required): e.g. `₹1,000.00`.
- **API Contract**: `POST /api/v1/business/cashiers`

---

### Modal 10: New Employee Onboarding Modal (`NewEmployeeModal`)
- **Trigger**: Manage -> Employee Logins -> `+ New employee`.
- **Form Controls**:
  1. `First Name` & `Last Name` (`Inputs`, Required).
  2. `Mobile Number` (`Input`, Required): 10-digit phone.
  3. `Email Address` (`Input`, Required): Corporate email.
  4. `Role` (`Select`, Required):
     * `Super Admin / Lab Director`
     * `Consulting Pathologist`
     * `Consulting Radiologist`
     * `Medical Lab Technologist (MLT)`
     * `Receptionist & Billing Desk`
     * `Phlebotomist / Runner`
     * `Accountant`
  5. `Initial Password` (`Input type="password"`, Required).
  6. `Confirm Password` (`Input type="password"`, Required).
- **API Contract**: `POST /api/v1/security/employees`

---

### Modal 11: Edit Permissions Matrix Modal (`EditPermissionsModal`)
- **Trigger**: Employee Logins -> Employee Card -> `Permissions`.
- **Header**: Title `Granular Security Access Controls for {EmployeeName}`.
- **Toggles (6 Core Permissions)**:
  1. `[x] canEditRates`: Overriding test MRP rates at cash till.
  2. `[ ] canDeleteBills`: Canceling cases and voiding registered invoices.
  3. `[x] canSignOffReports`: Digitally authorizing laboratory and imaging reports.
  4. `[ ] canViewLedger`: Viewing executive financial revenue, turnover, and margins.
  5. `[ ] canManageExpenses`: Recording and editing operational expense vouchers.
  6. `[ ] canIssueRefunds`: Reimbursing cash from till drawer for voided cases.
- **API Contract**: `PUT /api/v1/security/employees/:id/permissions`

---

### Modal 12: Rename Browser Terminal Modal (`RenameBrowserModal`)
- **Trigger**: Browser Security -> Device Card -> Pencil Edit Icon.
- **Header**: Title `Rename Authorized Diagnostic Terminal`.
- **Form Controls**:
  1. `Browser Device Label` (`Input`, Required):
     * e.g. `Counter 1 (Dell Inspiron All-in-One - Billing Desk)`.
- **API Contract**: `PUT /api/v1/security/browsers/:id/rename`

---

### Modal 13: Settle Doctor Commission Modal (`SettleCommissionModal`)
- **Trigger**: Referral Business -> Doctor Ledger -> `Settle Commission`.
- **Header**: Title `Disburse Doctor Referral Commission Payout`.
- **Pre-Loaded Ledger**:
  * Doctor Name, Case Count, Accrued Commission (e.g. `Rs. 4,500.00`).
- **Form Controls**:
  1. `Disbursement Amount (₹)` (`Input type="number"`, Required): Must be $\le$ accrued balance.
  2. `Settlement Payment Mode` (`Select`, Required): `NEFT / RTGS`, `Cheque`, `UPI`, `Cash`.
  3. `Bank UTR / Cheque Reference Number` (`Input`, Required).
  4. `Accounting Notes / Statement Month` (`Input`).
- **API Contract**: `POST /api/v1/doctors/:id/settle-payout`

---

## 3. Global Modal Behavior & Accessibility Rules

1. **Focus Trap**: Active modal traps keyboard focus inside dialog container.
2. **Backdrop Click / Escape Key**: Clicking dark backdrop or pressing `Esc` dismisses modal unless form contains unsaved dirty state (in which case a warning prompt displays).
3. **Double Submission Guard**: Submit buttons enter loading spinner state (`disabled={isSubmitting}`) to prevent duplicate transaction records.
4. **Toast Feedback**: Every successful modal action triggers a bottom-right snackbar toast message for 3000ms.
