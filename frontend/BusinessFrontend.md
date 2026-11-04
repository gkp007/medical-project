# Labsmart LIS — Business Tab Frontend Specification & Gap Analysis
**Document Version:** 1.0.0  
**Target Application:** Labsmart LIS (Laboratory Information System)  
**Section Audited:** Business Module (`Daily business`, `Expenses`, `Due reports`, `Activities`, `Referral business`, `Case wise report`, `Business analysis`, `Data export`)  
**Reference URL:** `https://app.labsmartlis.com/71122710/business_reports/daily_business`  

---

## 1. Executive Summary

This document provides a comprehensive, field-by-field, interaction-by-interaction specification for the **Business** module of Labsmart LIS. It details every element, button action, modal dialog, calculation formula, filter, table column, and visual layout observed directly in the production Labsmart application, compares it against our current frontend implementation, identifies all discrepancies, and provides the exact blueprints implemented into our code.

---

## 2. Module Navigation Architecture

The **Business** section sits directly under the primary sidebar navigation and contains 8 distinct sub-routes:

| Sub-Route | Production URL Path | Primary Purpose | Badges / Tier |
| :--- | :--- | :--- | :--- |
| **1. Daily business** | `/business_reports/daily_business` | Day-wise income calculation, receipt balancing, transaction audit, cashier reconciliation | Core LIS |
| **2. Expenses** | `/expenses` | Lab operational expense vouchers, categories, monthly tracking, expense analysis | `Premium feature`, `BETA` |
| **3. Due reports** | `/cases/with_due` | Outstanding patient receivables, aging balances, due collection ledger | Core LIS |
| **4. Activities** | `/activities` | Immutable audit log tracking sensitive changes (patient/referrer edits, test modifications) | `Advanced plan feature` |
| **5. Referral business** | `/referrer_wise_business_report/summary` | Doctor referral case volume, incentive statements, period summaries | Core LIS |
| **6. Case wise report** | `/case_wise_business_report/new` | Multi-modality daily case register across 13 medical case types | Core LIS |
| **7. Business analysis** | `/monthly_business_overview` | 31-day payment instrument matrix (UPI, Cash, Card, Insurance) | `BETA` |
| **8. Data export** | `/data_exports/new` | Enterprise bulk data dumps (Bills, Patients, Transactions, TAT, Expenses) | `Premium feature` |

---

## 3. Deep-Dive Page Specifications

---

### Page 1: Daily Business (`/business_reports/daily_business`)

#### 3.1. Header & Navigation Controls
- **Page Title:** `Daily business` (`h1`, 24px semi-bold)
- **Top Actions Bar (Right-aligned):**
  1. `Business Report` (Button/Link): Navigates to `/business_reports/daily_business_report?collection_centre_id=MAIN&date=YYYY-MM-DD`. Opens the comprehensive ledger print format with cashier summaries and case breakdowns.
  2. `Monthly Overview (BETA)` (Button/Link): Navigates to `/monthly_business_overview`.
  3. `Print` (Button): Triggers `window.print()` formatted for day-end financial sheets.
  4. `Email` (Button/Link): Opens dialog/endpoint `/business_reports/email_daily_business?date=YYYY-MM-DD` to email the summary to lab directors.
- **Date Switcher:**
  - `<` (Previous day button - decrements date by 1 day)
  - `[ DD/MM/YYYY ]` (Date input display with calendar picker)
  - `>` (Next day button - increments date by 1 day)

#### 3.2. Net Income Calculation Formula Bar
A prominent summary card rendering the exact business formula:
$$\text{Net Income} = \text{Total Income} + \text{Total Collection Charge} - \text{Expenses}$$

- **Cards Structure:**
  1. **Total Income:** Display value (e.g., `Rs. 0`), expandable toggle button $(\vee / \wedge)$ to reveal the **Total Income Split**:
     - `Cash`: `Rs. 0` (Brown badge icon)
     - `Card`: `Rs. 0` (Pink/Red badge icon)
     - `UPI`: `Rs. 0` (Orange/Yellow badge icon)
     - `Insurance`: `Rs. 0` (Golden badge icon)
  2. `+` Operator separator
  3. **Total collection charge:** Value (e.g., `Rs. 0`), info icon $(i)$
  4. `-` Operator separator
  5. **Expenses:** Value (e.g., `Rs. 0`), info icon $(i)$
  6. `=` Operator separator
  7. **Net income:** Highlighted bold total (e.g., `Rs. 0`)
  8. **Timestamp Display:** `Date - HH:MM AM/PM, DD/MM/YYYY` with `Today` badge.
  9. **Helper Link:** `How collection charges work?` (Opens explanatory tooltip/modal).

#### 3.3. Lower Content Tabs
Three tab buttons with dynamic counts:
- `Transactions {count}` (Default selected)
- `Bills {count}`
- `Expenses {count}`

##### Tab A: Transactions
- **Controls Bar:**
  - `Search in page` (Text input placeholder)
  - `Previous day bills {count}` (Filter button toggle)
  - `+ Add cashier` (Link to user management `/users/new`)
- **Table Columns:**
  1. `ID` (Receipt sequence number, e.g. `#101`)
  2. `REG. NO.` (Case registration number, e.g. `261019-001`)
  3. `PATIENT NAME` (Patient full name, age, gender)
  4. `REFERRED BY` (Doctor name or Self)
  5. `DATE` (Transaction date)
  6. `TIME` (Time of receipt)
  7. `DCN` (Diagnostic Case Number)
  8. `CC` (Collection Centre / Branch)
  9. `AMOUNT` (Amount collected in Rs.)
  10. `METHOD` (Cash, UPI, Card, Insurance)
  11. `RECEIVED BY` (Cashier username)
- **Footer:** `Total income: Rs. {sum}`

##### Tab B: Bills
- **Controls Bar:**
  - `Search in page` (Text input)
- **Table Columns:**
  1. `REG. NO.`
  2. `DATE`
  3. `PATIENT`
  4. `REFERRED BY`
  5. `TOTAL` (Bill gross total)
  6. `PAID` (Amount paid so far)
  7. `DISCOUNT` (Discount given)
  8. `STATUS` (Paid, Partial, Due, Cancelled)
  9. `ACTIONS` (View, Print, Collect Due)

##### Tab C: Expenses
- **Controls Bar:**
  - `Search in page` (Text input)
  - `+ Add new` (Opens "Add new expense" modal)
  - `How expenses work?` (Info link)
- **Table Columns:**
  1. `ADDED ON` (Timestamp)
  2. `SPENT ON` (Date & Time of actual spend)
  3. `EXPENSE` (Expense item name)
  4. `AMOUNT` (₹ amount)
  5. `CATEGORY` (e.g. Lab Reagents & Consumables)
  6. `MODE` (Cash, UPI, Card)
  7. `CASHIER` (Staff member who logged it)
  8. `NOTES` (Remarks/Voucher details)

#### 3.4. Associated Sub-Screens of Daily Business
1. **Main Business Report (`/business_reports/daily_business_report`):**
   - Breadcrumb: `Daily business / Business report`
   - Title: `Today's Business Report: DD/MM/YYYY (HH:MM AM/PM)`
   - Header details: Collection centre (MAIN), First receipt ID, Last receipt ID
   - Action buttons: `Print`, `Email Today's Business Report`, `Today's Business`
   - Sections:
     - **Accounts report**: Total Income summary, Cashier wise payment summary (`CASHIER`, `INCOME`, `REFUND`, `CASH IN HAND`), Collection charge summary, Dues table, Refunds table, Due collection from previous day cases, Refunds for cases from previous days.
     - **Cases report**: Fully canceled cases list, Cases with discount list (`REG. NO.`, `PATIENT`, `REFERRED BY`, `INVESTIGATIONS`, `TOTAL FEE`, `AMOUNT PAID`, `DISCOUNT`, `DISCOUNT TYPE`, `RECEIVED BY`, `ACTION`).
2. **Add New Expense Modal:**
   - Fields:
     - `* Name` (Text input)
     - `* Amount` (Numeric input)
     - `Mode` (Dropdown: Cash, UPI, Card)
     - `* Expense category` (Dropdown with option "Lab Reagents & Consumables" + link to `Manage categories`)
     - `* Spent on` (Datetime-local picker)
     - `Notes` (Textarea)
   - Button: `Create Expense`

---

### Page 2: Expenses (`/expenses`)

#### 2.1. Header & Quick Actions
- **Title:** `Expenses` with badges: `Premium feature` (Gray rounded badge), `BETA` (Blue badge)
- **Feedback Banner:** "Have feedback to improve expenses? Please share it here."
- **Action Links:**
  - `Export` -> Links to `/data_exports/new?entity=Expense`
  - `Manage categories` -> Links to `/expense_categories`
  - `How expenses work?` -> Informational modal/popover

#### 2.2. Date & Sub-Tab Navigation
- **Month / Year Filter:**
  - `<` (Previous month link)
  - `[ Month Select ]` (Dropdown: January to December)
  - `>` (Next month link)
  - `[ Year Select ]` (Dropdown: 2018 to 2027)
- **Sub-Tabs:**
  - `Expenses` (Active table view)
  - `Analysis` (Links to `/expenses/analysis?month=MM&year=YYYY`)

#### 2.3. Expenses Table View
- **Controls Bar:**
  - `+ Add new` (Button, opens modal)
  - `Search` (Search input)
  - `Filters` (Toggle button)
- **Inline Collapsible Filter Panel:**
  - `Category` dropdown (Default: `All categories`, options: dynamic categories)
  - `Clear` link (Resets filters)
  - `Apply filters` button
- **Table Columns with Sort Indicators (``):**
  1. `SPENT ON `
  2. `NAME `
  3. `AMOUNT `
  4. `CATEGORY `
  5. `MODE`
  6. `ADDED BY`
  7. `ADDED ON`
  8. `NOTES`
  9. `ACTIONS` (Edit, Delete)
- **Footer:** `Records in page: X / Y`

#### 2.4. Expenses Analysis Sub-Tab (`/expenses/analysis`)
- **Summary Cards:**
  - `Total Expense`: Large bold figure (e.g. `Rs. 0`)
  - `Total expense split`:
    - `Cash`: `Rs. 0`
    - `Card`: `Rs. 0`
    - `UPI`: `Rs. 0`
- **Category Wise Split:**
  - List / Progress bar / Pie breakdown of expenses grouped by category or `No data` placeholder.

#### 2.5. Manage Categories (`/expense_categories`)
- **Breadcrumb:** `EXPENSES / MANAGE CATEGORIES`
- **Heading:** `Manage categories`
- **Action:** `+ Add new` button (Opens modal to create a category name)
- **Table:**
  - `NAME` (e.g. "Lab Reagents & Consumables", "Rent & Utilities", "Staff Salaries")
  - `ACTIONS` (`Edit`, `Delete`)

---

### Page 3: Due Reports (`/cases/with_due`)

#### 3.1. Header & Controls
- **Title:** `Due report` (`h1`)
- **Date Range Picker:**
  - Input field: `Set date range, Last 30 days selected by default` (e.g. `19/09/2026 - 19/10/2026`)
  - Quick presets: `Today`, `Last 7 Days`, `Last 30 Days`, `This Month`
- **Empty State:**
  - Text: `All dues are cleared.`
  - Subtext / clean illustration indicating no pending patient balances in the selected interval.

#### 3.2. Populated State (Due Records Ledger)
- **Summary KPIs:**
  - Total Outstanding Dues (₹)
  - Overdue Cases Count
  - Highest Pending Account
- **Table Columns:**
  1. `REG. NO.`
  2. `DATE`
  3. `PATIENT` (Name, Age/Gender, Contact Phone)
  4. `REFERRED BY` (Doctor Name)
  5. `TOTAL AMOUNT`
  6. `PAID AMOUNT`
  7. `DUE BALANCE`
  8. `ACTIONS`:
     - `Collect Payment` (Opens Collect Due modal)
     - `WhatsApp Reminder` (Opens pre-filled message draft)
     - `Print Invoice`

---

### Page 4: Activities (`/activities`)

#### 4.1. Header & Security Disclaimer
- **Title:** `Activities` with badge: `Advanced plan feature` (Purple badge)
- **How Does This Work Box (Bordered Info Card):**
  - Text: *"Activities sensitive to business are monitored and logged. Summary of the activity, activity owner and timestamp of activity is logged in plain text and cannot be changed in future. Only listed activities are monitored."*
  - Monitored Events List:
    1. Patient first name and last name change.
    2. Referrer first name and last name change.
    3. Referrer change on case.
    4. Investigations changed on case.

#### 4.2. Date & Filter Controls
- **Date Switcher:** `<` [ `DD/MM/YYYY` ] `>`
- **Filter Dropdown:**
  - `All Activities`
  - `Patient first name and last name change`
  - `Referrer first name and last name change`
  - `Referrer change on case`
  - `Investigations changed on case`

#### 4.3. Audit Trail Ledger
- **Table Columns:**
  1. `TIME` (e.g., `12:24 PM`)
  2. `LOGGED BY` (Cashier / Lab Tech / Admin Name)
  3. `EVENT TYPE` (Color-coded badge)
  4. `SUMMARY / DIFF` (e.g., `Changed Patient name from 'Ramesh' to 'Ramesh Kumar' on Bill #1002`)
  5. `CASE / REG NO.` (Clickable link to bill)

---

### Page 5: Referral Business (`/referrer_wise_business_report/summary`)

#### 5.1. Header & Actions Bar
- **Title:** `Referral business summary` (`h1`)
- **Actions Bar:**
  - `Watch Video` (Tutorial helper)
  - `Referral doctor wise report` (Link to `/referrer_wise_business_report/new`)
  - `Download cases data` (Link to `/data_exports/new`)
  - `Print` (Print view)

#### 5.2. Filter by Period Pills
A horizontal pill group:
- `Today`
- `Yesterday`
- `Last Week`
- `October` (Current month)
- `September` (Last month)
- `August` (2 months ago)
- `Custom` (Navigates to `/referrer_wise_business_report/new`)

#### 5.3. Summary Table
- **Columns:**
  1. `S. NO.`
  2. `REFERRER ID`
  3. `NAME` (Doctor Name & Speciality)
  4. `CONTACT` (Phone number)
  5. `TOTAL CASES` (All time)
  6. `CASES (PATIENTS) IN FILTER` (Count in current selected period)
  7. `PRINT BUSINESS` (Button to generate & print individual doctor commission sheet)

#### 5.4. Sub-Form: Referrer Wise Business Report (`/referrer_wise_business_report/new`)
- **Heading:** `Referrer wise business report`
- **Fields:**
  - `* From:` (Date input, required)
  - `* To:` (Date input, required)
  - `Hide cancelled cases` (Checkbox, default checked)
  - `Show cases hidden` (Checkbox, default unchecked)
  - `Case types` (Multi-select dropdown / searchbox)
  - `Ref. by` (Doctor auto-complete searchbox)
  - `Generate Detailed Business Report` (Submit button)

---

### Page 6: Case Wise Report (`/case_wise_business_report/new`)

#### 6.1. Generation Form
- **Heading:** `Case wise business report`
- **Fields:**
  - `Exclude cancelled cases` (Checkbox, default checked)
  - `Collection centre` (Dropdown, e.g. `Main`)
  - `On` (Date picker, default today)
  - **Case types** (13 Individual checkboxes, all checked by default):
    1. `LabCase` (Pathology / Biochemistry / Hematology)
    2. `UsgCase` (Ultrasound Sonography)
    3. `DigitalXrayCase` (Digital Radiography)
    4. `XrayCase` (Conventional X-Ray)
    5. `OutsourceLabCase` (Sent to external reference lab)
    6. `EcgCase` (Electrocardiogram)
    7. `CtScanCase` (Computed Tomography)
    8. `MriCase` (Magnetic Resonance Imaging)
    9. `EpsCase` (Electrophysiology)
    10. `OpgCase` (Orthopantomogram / Dental X-Ray)
    11. `CardiologyCase` (Echocardiogram / TMT)
    12. `EegCase` (Electroencephalogram)
    13. `MammographyCase` (Breast Imaging)
  - `Generate` (Primary Action Button)

#### 6.2. Generated Report Display
- **Breadcrumb:** `Case wise business report / Report`
- **Header:** `Case Wise Business Report for Main`
- **Sub-header:** `Date: DD/MM/YYYY | Case types: ..., Total cases: N`
- **Actions:** `Print`, `Export to Excel`, `Back to Filters`
- **Table Columns:**
  1. `REG. NO.`
  2. `PATIENT`
  3. `REFERRED BY`
  4. `CASE TYPE`
  5. `INVESTIGATIONS / TESTS`
  6. `TOTAL FEE`
  7. `DISCOUNT`
  8. `AMOUNT PAID`
  9. `DUE`
  10. `STATUS`

---

### Page 7: Business Analysis (`/monthly_business_overview`)

#### 7.1. Header & Filters
- **Title:** `Monthly Business Overview (BETA)`
- **Filter Form:**
  - `[ Month ]` Dropdown (January to December)
  - `[ Year ]` Dropdown (2026, etc.)
  - `Show` Button

#### 7.2. 31-Day Financial Matrix Table
The definitive revenue grid mapping every day of the month against payment methods:
- **Columns:**
  1. `Day` (Format: `01-10-2026` to `31-10-2026`)
  2. `UPI` (₹)
  3. `Cash` (₹)
  4. `Card` (₹)
  5. `Insurance` (₹)
  6. `Total` (₹ sum for the day)
- **Footer Row:**
  - `Total` summary summing each column for the entire month.
- **Analytics Widgets:**
  - Monthly Gross Total
  - Realization Ratio (UPI vs Cash vs Card)
  - Highest Earning Day

---

### Page 8: Data Export (`/data_exports/new`)

#### 8.1. Header & History
- **Title:** `Data export` with badge `Premium feature`
- **Notice Alert:** *"Please utilize the available files from Data export history before exporting more data."*
- **Data Export History Section:**
  - Displays generated downloadable CSV / XLSX exports.
  - Empty state: *"No data export history - New files will appear here"*

#### 8.2. Export Request Form
- **Fields:**
  - `Entity` (Select dropdown with exact options):
    1. `Select` (Placeholder)
    2. `Bill (Case)`
    3. `Patient`
    4. `Transaction`
    5. `Lab report TAT`
    6. `Expense`
    7. `Lab report PDF links`
    8. `Lab Ratelist`
    9. `Referrer`
  - `From *` (Date input)
  - `To *` (Date input)
  - **Max Duration Limits Info Box:**
    - For `Bill (Case)`: 31 days.
    - For `Patient`: 365 days.
    - For `Transaction`: 31 days.
    - For `Lab report TAT`: 31 days.
    - For `Expense`: 365 days.
    - For `Lab report PDF links`: 31 days.
  - `Run export` (Button that initiates file generation)

---

## 4. Gap Analysis: Labsmart LIS vs Our Previous Code

| Feature / Screen | Labsmart LIS Reality | Our Previous Code | Gap Status & Remediation |
| :--- | :--- | :--- | :--- |
| **Daily Business Layout** | Net income formula bar (`Total Income + Collection Charge - Expenses = Net Income`) with split dropdown for Cash, Card, UPI, Insurance | Generic "Cashier Balancing Till" dashboard with custom float calculation | **CRITICAL GAP:** Replaced entire layout with Labsmart formula bar, date navigator, and 3 lower tabs (`Transactions`, `Bills`, `Expenses`). |
| **Daily Business Actions** | "Business Report", "Monthly Overview (BETA)", "Print", "Email" | "Refresh Till", "Export Day Sheet" | **FIXED:** Added exact buttons with functional modal views. |
| **Expenses Module** | Full month/year navigation, `Expenses` and `Analysis` sub-tabs, `Manage categories`, inline collapsible filter | Single table with hardcoded items and delete modal | **FIXED:** Implemented sub-tabs, Month/Year selector, category manager, and inline filter drawer. |
| **Due Reports** | Clean date range filter, "All dues are cleared" empty state, with detailed collection action | Custom card with static records | **FIXED:** Implemented exact date range picker, cleared dues state, and complete payment modal. |
| **Activities Audit Trail** | Security notice with 4 explicit monitored actions, immutable text log, date switcher, event type filter | Generic system event log | **FIXED:** Implemented exact Labsmart disclaimer card, 4 tracked change categories, and date navigator. |
| **Referral Business** | Period pills (`Today`, `Yesterday`, `Last Week`, `October`, `September`, `August`, `Custom`), `Watch Video`, summary table | Doctor commission payout table | **FIXED:** Added exact period pills, summary table, and "Referral doctor wise report" sub-generator. |
| **Case Wise Report** | Multi-modality filter with 13 checkboxes (LabCase, UsgCase, DigitalXrayCase, etc.) and date selector | Static table of 4 cases | **FIXED:** Implemented generation form with 13 modality checkboxes and resulting detailed ledger report. |
| **Business Analysis** | 31-day daily grid with `Day`, `UPI`, `Cash`, `Card`, `Insurance`, `Total` | Custom monthly target percentage gauge | **FIXED:** Implemented exact 31-day table with month/year selector and totals row. |
| **Data Export** | 8 specific entities (`Bill`, `Patient`, `Transaction`, `TAT`, `Expense`, `PDF links`, `Ratelist`, `Referrer`), duration limits box, history list | Simple dataset dropdown with 4 options | **FIXED:** Implemented exact 8 entities, history list with downloads, and duration limits warning box. |

---

## 5. UI/UX Design System Guidelines

- **Primary Colors:**
  - Brand Blue: `#2563eb` (Hover: `#1d4ed8`)
  - Canvas Background: `#f8fafc` / `#ffffff`
  - Text Primary: `#1e293b`
  - Text Muted: `#64748b`
  - Border: `#e2e8f0`
- **Method Badge Colors:**
  - Cash: `#92400e` (bg: `#fef3c7`)
  - UPI: `#c2410c` (bg: `#ffedd5`)
  - Card: `#be185d` (bg: `#fce7f3`)
  - Insurance: `#047857` (bg: `#d1fae5`)
- **Typography:** Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif.
- **Micro-Interactions:** Smooth expand/collapse for the Income Split bar, responsive inline filter drawers, modal backdrop fades, and instant feedback toasts.
