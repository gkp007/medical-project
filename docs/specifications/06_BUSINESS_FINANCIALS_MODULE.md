# Labsmart LIS — Business & Financials Module Specification

**Specification ID:** `SPEC-06-BUSINESS-FINANCIALS`  
**Module Name:** Daily Cashier Reconciliation, Net Income Calculation, Operational Expenses, Accounts Receivable (Dues), Doctor Referral Payouts & Bulk Data Export  
**Target Routes:**
- `/business_reports/daily_business`
- `/expenses`
- `/cases/with_due`
- `/activities`
- `/referrer_wise_business_report/summary`
- `/case_wise_business_report/new`
- `/monthly_business_overview`
- `/data_exports/new`  
**Source Components:**
- `src/pages/business/DailyBusinessPage.tsx`
- `src/pages/business/ExpensesPage.tsx`
- `src/pages/business/DueReportsPage.tsx`
- `src/pages/business/ActivitiesPage.tsx`
- `src/pages/business/ReferralBusinessPage.tsx`
- `src/pages/business/CaseWiseReportPage.tsx`
- `src/pages/business/BusinessAnalysisPage.tsx`
- `src/pages/business/DataExportPage.tsx`

---

## 1. Executive Summary & Financial Architecture

The **Business & Financials** module governs the accounting, revenue assurance, and profit analytics of the diagnostic enterprise. It provides:
1. **Mathematical Day-End Reconciliation**: Evaluates Net Income across all cash registers via the formula:
   $$\text{Net Income} = \text{Total Income} + \text{Total Collection Charge} - \text{Expenses}$$
2. **Multi-Instrument Payment Split**: Granular tracking across Cash, Card (POS), UPI (PhonePe, GooglePay, Paytm QR), and Corporate Insurance.
3. **Expense Voucher Controls**: Operational categorization (Reagents, Salary, Rent, Courier, Bio-waste) with digital bill invoice uploads.
4. **Accounts Receivable & Due Recovery**: Aging debt buckets (0-7, 8-30, 31-60, >60 days overdue) with one-click collection.
5. **Doctor Referral Commission Statements**: Automated percentage/flat incentives calculation, period summaries, and settlement payouts.
6. **Immutable Audit Trails & Data Portability**: Tamper-evident activity logs and enterprise CSV/Excel dumps for Tally/ERP accounting.

---

## 2. Screen 1: Daily Business & Cashier Reconciliation (`/business_reports/daily_business`)

### 2.1 Header & Top Action Controls
1. **Page Title**: `Daily business` (`h1`, 24px semi-bold).
2. **Date Step Navigator**:
   - `<` Previous Day Button (decrements date by 1 day)
   - Date Display: `[ YYYY-MM-DD ]` (Calendar picker)
   - `>` Next Day Button (increments date by 1 day)
3. **Top Utility Actions Bar**:
   - `Business Report`: Opens comprehensive printable day-end ledger modal with cashier hand-over summary.
   - `Monthly Overview (BETA)`: Navigates to `/monthly_business_overview`.
   - `Print`: Formatted print layout for day-end reconciliation.
   - `Email`: Opens modal to dispatch automated daily summary PDF to lab directors.

---

### 2.2 Mathematical Net Income Calculation Formula Bar

Renders a prominent high-contrast mathematical card:

$$\boxed{\text{Net Income} = \text{Total Income} + \text{Total Collection Charge} - \text{Expenses}}$$

#### Formula Components:
1. **Total Income Card**:
   - Display: `Rs. {totalIncome}` (e.g. `Rs. 14,500`).
   - Expandable Toggle $(\vee / \wedge)$ revealing the **Payment Instrument Split**:
     * `Cash`: `Rs. 8,200` (Brown badge icon `<Banknote size={14} />`)
     * `Card`: `Rs. 2,100` (Pink/Red badge icon `<CreditCard size={14} />`)
     * `UPI`: `Rs. 4,200` (Orange badge icon `<Smartphone size={14} />`)
     * `Insurance`: `Rs. 0` (Golden badge icon `<Shield size={14} />`)
2. `+` Operator Separator.
3. **Total Collection Charge**:
   - Display: `Rs. {collectionCharge}` (e.g. `Rs. 350`), Info icon tooltip `How collection charges work?`.
4. `-` Operator Separator.
5. **Expenses**:
   - Display: `Rs. {totalExpenses}` (e.g. `Rs. 1,200`), Info icon tooltip.
6. `=` Operator Separator.
7. **Net Income (Highlighted Emerald Total)**:
   - Value: `Rs. 13,650` (Rendered in bold 22px `#15803d`).
   - Timestamp Badge: `Today, 19 Oct 2026 - 11:30 PM`.

---

### 2.3 3-Tab Content Ledger

#### Tab A: Transactions Ledger (`Transactions {count}`)
- **Header Controls**: `Search in page` text input, `Previous day bills {count}` toggle filter, `+ Add cashier` button.
- **Columns**:
  1. `ID`: Receipt sequential number (`#101`).
  2. `REG. NO.`: Case registration link (`#1001`).
  3. `PATIENT NAME`: Full name, age, gender.
  4. `REFERRED BY`: Doctor name or Self.
  5. `DATE`: Date of transaction.
  6. `TIME`: Time of receipt.
  7. `DCN`: Daily Case Number (`L1`, `U1`).
  8. `CC`: Collection Centre (`Main`).
  9. `AMOUNT`: Net collection amount.
  10. `METHOD`: Badge (`Cash`, `UPI`, `Card`, `Insurance`).
  11. `RECEIVED BY`: Staff cashier username.
- **Footer**: `Total income: Rs. {sum}`

#### Tab B: Bills Ledger (`Bills {count}`)
- **Columns**: `REG. NO.`, `DATE`, `PATIENT`, `REFERRED BY`, `TOTAL`, `PAID`, `DISCOUNT`, `STATUS` (`Paid`, `Partial`, `Due`).
- **Footer**: `Gross Total: Rs.{gross}`, `Total Received: Rs.{paid}`, `Outstanding Due: Rs.{due}`.

#### Tab C: Expenses Ledger (`Expenses {count}`)
- **Header Controls**: `+ Add Expense` button.
- **Columns**: `ID`, `EXPENSE NAME`, `AMOUNT`, `CATEGORY`, `PAID ON`, `PAYMENT MODE`, `PAID BY`, `NOTES`.
- **Footer**: `Total expenses for date: Rs. {sum}`.

---

### 2.4 Cashier Shift Management & Till Drawer Reconciliation
- **Add Cashier Modal (`AddCashierModal`)**:
  * `Cashier Full Name` (Input, Required)
  * `Mobile Number` (Input, Required)
  * `Assigned Counter`: Dropdown (`Counter 1 (Main Reception)`, `Counter 2 (Emergency)`, `Counter 3 (Radiology)`)
  * `Opening Float Cash (₹)`: Starting physical cash in till drawer (e.g. `₹1,000.00`)
  * `Shift Timing`: `Morning (08:00 AM - 02:00 PM)`, `Evening (02:00 PM - 08:00 PM)`, `Night (08:00 PM - 08:00 AM)`
  * `Shift Hand-Over Settlement`: Automatically calculates:
    $$\text{Expected Drawer Cash} = \text{Opening Float} + \text{Cash Collected Today} - \text{Cash Expenses Disbursed}$$
    $$\text{Cashier Discrepancy} = \text{Physical Count} - \text{Expected Drawer Cash}$$

---

## 3. Screen 2: Expenses Management (`/expenses`)

### 3.1 Sub-Tabs & Filtering
- Sub-tabs: `Expenses List` vs `Monthly Expense Analysis`.
- Date Controls: Month selector (`October`), Year selector (`2026`).
- Category Filter: `All categories`, `Lab Reagents & Consumables`, `Staff Salaries & Wages`, `Rent & Utilities`, `Courier & Logistics`, `Bio-waste Disposal`, `Equipment Maintenance`.
- Search Bar: Search by expense name, vendor, notes.

### 3.2 Add Expense Modal (`AddExpenseModal`)
- **Inputs**:
  1. `Expense Name / Description` (Input, Required, e.g. `Sysmex Cellpack Reagent 20L`)
  2. `Amount (₹)` (Numeric input, Required)
  3. `Payment Mode` (PillGroup: `Cash` | `UPI` | `Card`)
  4. `Category` (Select with `+ Add New Category` trigger)
  5. `Date & Time Spent` (`datetime-local`)
  6. `Vendor / Payee Name` (Input)
  7. `Invoice / Voucher Reference No` (Input)
  8. `Upload Invoice Photo / PDF` (File input, max 5MB)
  9. `Remarks / Accounting Notes` (Textarea)
- **Action**: Persists voucher, generates `EXP-2026-XXXX`, deducts from day's Net Income.

---

## 4. Screen 3: Due Reports / Accounts Receivable (`/cases/with_due`)

### 4.1 Debt Aging Analysis Cards
Displays 4 aging brackets:
1. `0 - 7 Days`: Current receivables (Low risk)
2. `8 - 30 Days`: Pending recovery (Moderate risk)
3. `31 - 60 Days`: Overdue (High risk)
4. `> 60 Days`: Critical overdue / Bad debt risk

### 4.2 Dues Data Table
- Columns: `REG. NO.`, `DATE`, `PATIENT NAME`, `MOBILE`, `REFERRED BY`, `TOTAL AMOUNT`, `PAID AMOUNT`, `BALANCE DUE`, `ACTIONS`.
- Actions:
  * `Accept Due`: Opens `AcceptDueModal` for immediate settlement.
  * `Send SMS Reminder`: Dispatches instant payment link via SMS.
  * `Send WhatsApp Reminder`: Opens WhatsApp Web API with pre-formatted invoice breakdown.

---

## 5. Screen 4: Activities & Immutable Audit Logs (`/activities`)

- **Objective**: Regulatory audit trail tracking all clinical and financial alterations.
- **Tracked Event Types**:
  * `CASE_CREATED`: Patient bill registered.
  * `CASE_MODIFIED`: Test added/removed or demographics altered.
  * `DISCOUNT_APPLIED`: Concession granted with mandatory reason.
  * `PAYMENT_COLLECTED`: Advance or due collected.
  * `RESULTS_ENTERED`: Laboratory parameter values recorded.
  * `REPORT_AUTHORIZED`: Pathologist digital sign-off.
  * `CASE_CANCELLED`: Bill voided and refund issued.
  * `DEVICE_LOGIN`: New terminal browser authorization.
- **Columns**: `TIMESTAMP`, `ACTION TYPE`, `ACTOR (USER)`, `PATIENT / REG NO`, `CHANGES LOG (BEFORE vs AFTER)`, `IP ADDRESS / BROWSER`.

---

## 6. Screen 5 & 6: Referral Business & Case-Wise Reports

### 6.1 Referral Business & Doctor Commission (`/referrer_wise_business_report/summary`)
- **Objective**: Manage consulting clinician referral incentives and monthly payouts.
- **Commission Calculation Models**:
  * `Department-wise Percentage`: e.g. 20% on Pathology, 25% on Ultrasound, 30% on Digital X-Ray.
  * `Flat Rate per Test`: e.g. ₹50 per CBC, ₹200 per Whole Abdomen USG.
- **Doctor Ledger Columns**:
  1. `DOCTOR NAME`: Clinician name and degree.
  2. `CASE COUNT`: Total patients referred in period.
  3. `GROSS BILLING`: Total gross billing value generated.
  4. `DISCOUNTS ABSORBED`: Total concessions granted to referred patients.
  5. `NET QUALIFYING AMOUNT`: $\text{Gross} - \text{Discounts}$.
  6. `COMMISSION ACCRUED`: Gross incentive calculated.
  7. `SETTLED PAYOUTS`: Amount already disbursed.
  8. `OUTSTANDING PAYABLE`: Remaining doctor balance.
  9. `ACTIONS`: `Settle Commission` (Opens `SettleCommissionModal`), `Print Referral Statement`, `Export to Excel`.

### 6.2 Case-Wise Detailed Register (`/case_wise_business_report/new`)
- Granular breakdown of every patient order across all 13 medical modalities.
- Columns: `Reg No`, `Date`, `Patient`, `Doctor`, `Modality`, `Tests Ordered`, `Gross Rate`, `Discount`, `Net Bill`, `Paid`, `Balance Due`, `Reagent Cost`, `Estimated Profit Margin %`.

---

## 7. Screen 7 & 8: Business Analysis & Data Export

### 7.1 Business Analysis & 31-Day Matrix (`/monthly_business_overview`)
- Day-by-day table of the entire calendar month (Days 1 to 31).
- Columns: `Date`, `Total Cases`, `Gross Revenue`, `Cash Collected`, `UPI Collected`, `Card Collected`, `Dues Accumulated`, `Expenses`, `Net Profit`.
- Visual Charts: Modality revenue share pie chart, top 10 referring doctors bar chart.

### 7.2 Enterprise Data Export Engine (`/data_exports/new`)
- Selectable Datasets:
  * `All Cases & Bills`
  * `Master Patient Index (Demographics)`
  * `Financial Receipts & Payments`
  * `Diagnostic Test Results & Parameters`
  * `Expense Vouchers`
  * `Doctor Commission Ledgers`
- Options: Date range interval, format (`CSV` or `Excel .xlsx`), branch filter.
- Triggers instant streaming file download.

---

## 8. Backend API Specifications & Architecture

### 8.1 Endpoints Required by Business & Financials

#### 1. GET `/api/v1/business/daily-summary`
- **Purpose**: Calculates mathematical net income, instrument split, and tabs for a specific date.
- **Query Parameters**: `date=2026-10-19&branchId=main`
- **Response JSON (200 OK)**:
```json
{
  "date": "2026-10-19",
  "formula": {
    "totalIncome": 14500.0,
    "incomeSplit": {
      "cash": 8200.0,
      "card": 2100.0,
      "upi": 4200.0,
      "insurance": 0.0
    },
    "totalCollectionCharge": 350.0,
    "totalExpenses": 1200.0,
    "netIncome": 13650.0
  },
  "counts": {
    "transactions": 14,
    "bills": 12,
    "expenses": 3
  }
}
```

#### 2. POST `/api/v1/expenses`
- **Purpose**: Creates an expense voucher.
- **Request Body JSON**:
```json
{
  "name": "Sysmex Cellpack Reagent 20L",
  "amount": 2500.0,
  "category": "Lab Reagents & Consumables",
  "paymentMode": "UPI",
  "spentOn": "2026-10-19T14:30:00Z",
  "vendor": "Transasia Bio-Medicals Ltd",
  "invoiceNumber": "INV-89102",
  "notes": "Emergency buffer pack for automated hematology analyzer"
}
```
- **Response JSON (201 Created)**:
```json
{
  "voucherId": "exp-0091",
  "voucherNumber": "EXP-2026-0042",
  "amount": 2500.0,
  "status": "RECORDED"
}
```

#### 3. POST `/api/v1/doctors/:id/settle-payout`
- **Purpose**: Records commission payout settlement to referring doctor.
- **Request Body JSON**:
```json
{
  "periodStart": "2026-10-01",
  "periodEnd": "2026-10-31",
  "paidAmount": 4500.0,
  "paymentMode": "NEFT",
  "transactionRef": "NEFT-HDFC-9021938"
}
```
- **Response JSON (201 Created)**:
```json
{
  "payoutNumber": "PAY-2026-0014",
  "doctorId": "doc-833120",
  "settledAmount": 4500.0,
  "remainingBalance": 0.0
}
```
