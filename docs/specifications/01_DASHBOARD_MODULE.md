# Labsmart LIS — Dashboard Module Specification

**Specification ID:** `SPEC-01-DASHBOARD`  
**Module Name:** Executive Dashboard, Real-Time Financials, Due Alerts, Recent Transactions & Referral Hub  
**Target Route:** `/dashboard`  
**Source Component:** `src/pages/dashboard/DashboardPage.tsx`  
**Document Purpose:** Exhaustive engineering specification detailing all KPI metrics, card grids, action menus, modals, state management, and backend requirements for the executive dashboard.

---

## 1. Executive Summary & Architecture

The **Dashboard** is the first operational viewport presented to laboratory directors, administrators, and chief receptionists upon authentication. It serves four critical clinical and financial functions:
1. **Administrative Quick Actions**: Instant shortcuts to staff authentication management, terminal browser lockdown status, and clinician web access portal.
2. **Accounts Receivable & Due Recovery Feed**: Real-time list of all patient cases with pending balances, offering 1-click payment collection and automated SMS payment reminders.
3. **Cash Counter Audit Ledger**: Live chronological register of all payments collected today across all till cashiers with direct links to printable bill receipts.
4. **Communication & Referral Growth Widget**: Direct visibility into SMS messaging credit balances and referral program engagement with one-click referral sharing.

---

## 2. Visual Layout Architecture

```
+--------------------------------------------------------------------------------------------------------------------+
| [ TOP QUICK ACTION CARDS (3-COLUMN RESPONSIVE GRID) ]                                                              |
| +-----------------------------+ +-----------------------------+ +-----------------------------+                    |
| | [Users] Employee logins     | | [Shield] Browser security   | | [Stethoscope] Doctor portal |                    |
| +-----------------------------+ +-----------------------------+ +-----------------------------+                    |
|                                                                                                                    |
| [ MAIN OPERATIONAL 3-COLUMN WORKSPACE (Grid: 1.2fr | 1.4fr | 1.1fr) ]                                              |
| +-----------------------------+ +-----------------------------+ +-----------------------------+                    |
| | PAYMENTS DUE (ALL TIME)     | | RECENT TRANSACTIONS (TODAY) | | SMS CREDITS & REFERRAL HUB  |                    |
| | Subtitle: "For all time"    | | Subtitle: "For today"       | | [SMS: 98 Credits [v]]       |                    |
| | Header CTA: "View all"      | | Header CTA: "View all"      | |                             |                    |
| |                             | |                             | | +-------------------------+ |                    |
| | Table:                      | | Table:                      | | | Refer and save Rs.300   | |                    |
| | - Patient (Name, Reg, Date) | | - Patient (Name, Reg No)    | | | 1. Invite Labs with code| |                    |
| | - Due Amount (Rs. 280)      | | - Amount (+ Rs. 500)        | | | 2. 5-day free trial     | |                    |
| | - Accept Due Action (Card)  | | - View Bill Action (Icon)   | | | 3. Save Rs.300 renewal  | |                    |
| | - Meatball Menu (3-dot)     | |                             | | | [Refer now > Button]    | |                    |
| |   * View Bill               | |                             | | +-------------------------+ |                    |
| |   * Send SMS Reminder       | |                             | |                             |                    |
| +-----------------------------+ +-----------------------------+ +-----------------------------+                    |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Screen Specifications & Micro-Features

### 3.1 Section 1: Top Administrative Action Cards

Rendered in a 3-column grid (`display: grid`, `grid-template-columns: repeat(3, 1fr)`, `gap: 20px`, `margin-bottom: 24px`):

#### 1. Employee Logins Card
- **Icon**: `<Users size={18} />` inside a circular badge (`width: 36px`, `height: 36px`, `bg: #dcfce7`, `color: #16a34a`).
- **Label**: `Employee logins` (14px, font-weight 600, color `#1e293b`).
- **Card Background**: `#ffffff`, border `1px solid #e2e8f0`, border-radius `10px`, padding `16px 20px`.
- **Hover State**: Border `#cbd5e1`, shadow `0 4px 6px -1px rgba(0,0,0,0.06)`.
- **Interaction**: Clicking navigates to `/users` (`employee_login` screen).

#### 2. Browser Security Card
- **Icon**: `<Shield size={18} />` inside circular badge (`bg: #eff6ff`, `color: #2563eb`).
- **Label**: `Browser security` (14px, font-weight 600, color `#1e293b`).
- **Interaction**: Clicking navigates to `/web_browsers` (`browser_security` screen).

#### 3. Doctor Portal Card
- **Icon**: `<Stethoscope size={18} />` inside circular badge (`bg: #f3e8ff`, `color: #9333ea`).
- **Label**: `Doctor portal` (14px, font-weight 600, color `#1e293b`).
- **Interaction**: Clicking navigates to `/doctor_accesses/invited` (`doctor_access` screen).

---

### 3.2 Section 2: Payments Due Card (`Left Column - 1.2fr`)

- **Card Container**: White background `#ffffff`, border `1px solid #e2e8f0`, border-radius `12px`, padding `20px`.
- **Card Header**:
  * Title: `Payments due` (`h3`, 17px, font-weight 700, `#1e293b`).
  * Subtitle: `For all time` (12px, `#64748b`).
  * Header Action: `View all` link button (`color: #2563eb`, font-weight 600, 13px) -> triggers navigation to `/cases/with_due`.
- **Data Table Columns**:
  1. `PATIENT` (Width ~55%):
     * Patient Full Name (Bold, 13px `#1e293b`, e.g. `Miss. Himashree Majhi`).
     * Secondary Meta: `Reg. {regNo} | {date}` (11px `#64748b`, e.g. `Reg. 3276 | 21/10/2026`).
  2. `DUE` (Width ~25%):
     * Value formatted with currency prefix: `Rs.{dueAmount}` (13px, font-weight 700, color `#0f172a`, e.g. `Rs.280`).
  3. `ACCEPT DUE` (Width ~20%, text-align center):
     * Direct Collection Button: Icon `<CreditCard size={15} />`, styled with background `#eff6ff`, border `1px solid #bfdbfe`, text `#2563eb`, border-radius `6px`, padding `5px 8px`. Clicking opens `AcceptDueModal` with patient context pre-loaded.
     * Meatball Menu Button: 3-dot icon `<MoreHorizontal size={16} color="#94a3b8" />`.
     * Dropdown Popover (Toggled on click):
       - `View bill`: Navigates to `/cases/:id/bill` (`printable_bill` screen).
       - `Send SMS Reminder`: Triggers automated payment reminder SMS; displays feedback alert `SMS payment reminder sent to {patientName}.`
- **Empty State**:
  * If `paymentsDue.length === 0`: Displays centered row with text `No outstanding dues!`.

---

### 3.3 Section 3: Recent Transactions Card (`Center Column - 1.4fr`)

- **Card Container**: White background `#ffffff`, border `1px solid #e2e8f0`, border-radius `12px`, padding `20px`.
- **Card Header**:
  * Title: `Recent transactions` (`h3`, 17px, font-weight 700, `#1e293b`).
  * Subtitle: `For today` (12px, `#64748b`).
  * Header Action: `View all` link button -> triggers navigation to `/receipts` (`transactions` screen).
- **Data Table Columns**:
  1. `PATIENT` (Width ~50%):
     * Patient Full Name (Bold, 13px `#1e293b`, e.g. `Mr. Nikash ranjan Bishi`).
     * Secondary Meta: `Reg. no. {regNo}` (11px `#64748b`, e.g. `Reg. no. 3391`).
  2. `AMOUNT` (Width ~25%):
     * Green collection pill text: `+ Rs.{amount}` (13px, font-weight 600, color `#16a34a`, e.g. `+ Rs.200`).
  3. `VIEW BILL` (Width ~25%, text-align right):
     * Action Button: Text `View bill` with leading icon `<FileText size={14} />` (12px, color `#2563eb`, font-weight 600).
     * Behavior: Navigates directly to printable invoice receipt `/cases/:id/bill`.
- **Empty State**:
  * If no transactions recorded today: Displays `No payments collected today.` with link `Create new bill`.

---

### 3.4 Section 4: SMS Credits & Referral Hub (`Right Column - 1.1fr`)

#### Component A: SMS Credits Dropdown Pill
- **Container**: White card, border `1px solid #e2e8f0`, border-radius `10px`, padding `12px 18px`, pointer cursor.
- **Left Content**: Label `SMS Credits` (14px, font-weight 600) + Badge pill with current integer count `98` (bg `#dbeafe`, text `#1d4ed8`, font-weight 700, font-size 12px, rounded-full).
- **Right Content**: Down chevron `<ChevronDown size={16} color="#64748b" />`.
- **Interaction**: Clicking triggers opening of `SmsCreditsModal`.

#### Component B: Refer and Save Promotional Card
- **Container**: Card with blue-tinted border `1px solid #bfdbfe`, border-radius `14px`, padding `24px 20px`, soft glow shadow `0 2px 4px rgba(37, 99, 235, 0.05)`.
- **Header**:
  * Title: `Refer and save` (20px, font-weight 800, color `#3b82f6`).
  * Monetary Incentive Value: `Rs.300` (32px, font-weight 900, color `#1d4ed8`).
- **3-Step Explanatory Process**:
  1. Step 1: Icon `<Send size={18} color="#475569" />` + Text: `Invite Labs to signup with your code`.
  2. Step 2: Icon `<UserPlus size={18} color="#475569" />` + Text: `Register them for 5 days free trial`.
  3. Step 3: Icon `<Coins size={18} color="#475569" />` + Text: `Save Rs. 300 on your renewal after their successful purchase`.
- **Primary CTA Button**:
  * Label: `Refer now >`
  * Styling: Full-width, height `42px`, background `#2563eb`, color `#ffffff`, font-size 14px, font-weight 700, border-radius `8px`.
  * Interaction: Opens `ReferModal`.

---

## 4. Modals Integrated on Dashboard

### 4.1 Accept Due Modal (`AcceptDueModal.tsx`)
- **Props**:
  * `isOpen: boolean`
  * `onClose: () => void`
  * `caseData: { id: string, regNo: string, patientName: string, date: string, dueAmount: number }`
  * `onCollectSuccess: (collectedAmount: number, paymentMode: string) => void`
- **Fields in Modal**:
  * Amount to collect input (Pre-filled with `dueAmount`).
  * Payment Mode Selector: `Cash` | `UPI` | `Card` | `Cheque`.
  * Transaction / Reference ID input.
  * Print receipt checkbox (Default checked).
  * Send confirmation SMS checkbox (Default checked).
- **State Transition**:
  * Submitting updates local `paymentsDue` (removes row if fully paid or decrements due balance).
  * Automatically prepends new payment item into `recentTransactions`.

### 4.2 Refer Modal (`ReferModal.tsx`)
- Displays unique referral code, copy-link button, WhatsApp share trigger.

### 4.3 SMS Credits Modal (`SmsCreditsModal.tsx`)
- Displays current balance (`98`), recharge tiers, Razorpay payment trigger.

---

## 5. Backend API Specifications & Architecture

### 5.1 Endpoints Required by Dashboard

#### 1. GET `/api/v1/dashboard/summary`
- **Purpose**: Fetches real-time dashboard data in a single optimized payload.
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response JSON (200 OK)**:
```json
{
  "kpi": {
    "todayCasesCount": 24,
    "todayRevenue": 14500.0,
    "totalOutstandingDue": 12850.0,
    "pendingReportsCount": 7,
    "smsCreditsBalance": 98
  },
  "paymentsDue": [
    {
      "id": "case-3276",
      "regNo": "3276",
      "patientName": "Miss. Himashree Majhi",
      "date": "21/10/2026",
      "dueAmount": 280.0,
      "mobile": "9876543210"
    },
    {
      "id": "case-3270",
      "regNo": "3270",
      "patientName": "Mr. Rakesh Jena",
      "date": "20/10/2026",
      "dueAmount": 450.0,
      "mobile": "9123456789"
    }
  ],
  "recentTransactions": [
    {
      "id": "tx-101",
      "caseId": "case-3391",
      "regNo": "3391",
      "patientName": "Mr. Nikash ranjan Bishi",
      "amount": 200.0,
      "mode": "Cash",
      "timestamp": "2026-10-30T10:14:00Z"
    },
    {
      "id": "tx-102",
      "caseId": "case-3390",
      "regNo": "3390",
      "patientName": "Mr. Gouranga Patel",
      "amount": 500.0,
      "mode": "UPI",
      "timestamp": "2026-10-30T10:02:00Z"
    }
  ]
}
```

#### 2. POST `/api/v1/payments/collect-due`
- **Purpose**: Records partial or full payment against an existing case with an outstanding balance.
- **Request Body**:
```json
{
  "caseId": "case-3276",
  "amount": 280.0,
  "paymentMode": "UPI",
  "referenceNumber": "UPI-892110293",
  "printReceipt": true,
  "sendSms": true
}
```
- **Business Logic Execution**:
  1. Validates `amount > 0` and `amount <= current due balance`.
  2. Creates new `PaymentTransaction` record with sequential receipt number (`REC-2026-XXXX`).
  3. Updates parent `Case`:
     * `paidAmount = paidAmount + amount`
     * `balanceDue = balanceDue - amount`
     * If `balanceDue == 0`, updates `paymentStatus = 'Paid'`, else `'Partial'`.
  4. Deducts 1 SMS credit and triggers DLT-approved payment confirmation SMS to patient mobile.
  5. Creates immutable `AuditLog` entry.
- **Response JSON (201 Created)**:
```json
{
  "receiptNumber": "REC-2026-0842",
  "collectedAmount": 280.0,
  "remainingBalance": 0.0,
  "paymentStatus": "Paid",
  "timestamp": "2026-10-30T10:25:00Z"
}
```

#### 3. POST `/api/v1/notifications/send-due-reminder`
- **Purpose**: Dispatches SMS notification requesting patient settle outstanding balance.
- **Request Body**:
```json
{
  "caseId": "case-3276"
}
```
- **Response (200 OK)**:
```json
{
  "status": "SENT",
  "patientMobile": "9876543210",
  "messagePreview": "Dear Miss. Himashree Majhi, balance of Rs. 280 is pending for bill #3276 at Apex Diagnostics. Pay online: https://pay.labsmart.in/3276"
}
```
