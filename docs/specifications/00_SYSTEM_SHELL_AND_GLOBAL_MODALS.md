# Labsmart LIS — Global App Shell, Navigation & System Modals Specification

**Specification ID:** `SPEC-00-SHELL`  
**Module Name:** Master App Shell, Layout, Global Topbar, Sidebar, Keyboard Shortcuts & Global Modals  
**Target Application:** Labsmart Diagnostic LIS & Hospital Information System  
**Document Purpose:** Exhaustive engineering specification detailing every visual element, navigation link, keyboard trigger, system modal, input field, validation rule, and backend API requirement for the global application container.

---

## 1. Module Overview & Shell Architecture

The **Master App Shell** (`MasterAppShell.tsx`) is the top-level persistent layout wrapper that encloses all application screens. It provides:
1. **Top Navbar (`TopNavbar.tsx`)**: Fixed at `top: 0`, height `64px`, managing lab branding, center identification, omnichannel patient/case search (`Ctrl+K`), quick bill registration button (`Alt+N`), SMS credits balance tracker, help desk ticketing, and user profile management.
2. **Left Navigation Sidebar (`LeftSidebar.tsx`)**: Fixed at `left: 0`, width `256px`, containing grouped accordion menus for all diagnostic, clinical, business, and administrative modules with real-time badge counters and collapse/expand controls.
3. **Main Canvas Area**: Responsive canvas (`margin-left: 256px`, `padding: 24px`, background `#f8fafc`) rendering active sub-views, breadcrumbs, and flash notifications.
4. **Global System Modals**: Modals accessible from any screen in the system (`OmnisearchModal`, `RaiseTicketModal`, `SmsCreditsModal`, `ReferModal`, `PrintSettingsGuideModal`, `ConfirmationModal`).
5. **Keyboard Shortcuts Engine**: Global keyboard listeners intercepting shortcut combos across all screens.

---

## 2. Top Navbar (`TopNavbar.tsx`)

### 2.1 Visual Layout & Elements

```
+--------------------------------------------------------------------------------------------------------------------+
| [Logo] Apex Diagnostics | Center: Main Lab [v] | [Search Cases Ctrl+K] | [+ New Bill Alt+N] | SMS: 240 | [?] | [Profile v] |
+--------------------------------------------------------------------------------------------------------------------+
```

#### Left Section: Branding & Location
1. **Brand Identity Logo & Name**:
   - Logo Icon: Medical flask / cross icon or custom uploaded clinic logo (`max-height: 40px`).
   - Lab Name Display: Text `Apex Diagnostic Centre & Imaging Network` (16px, font-weight 700, `#0f172a`).
   - Tagline / Accreditation Badge: Text `NABL Accredited` (11px pill badge, background `#dcfce7`, text `#15803d`, border `1px solid #86efac`).
2. **Collection Centre / Franchise Selector**:
   - Element Type: Dropdown Combobox (`Select`).
   - Current Value: `Main Laboratory Branch` (Default ID `main`).
   - Options:
     * `Main Laboratory Branch` (`main`)
     * `City Care Collection Center (AG-102)` (`ag102`)
     * `Sector 56 Phlebotomy Point (AG-105)` (`ag105`)
     * `+ Add New Branch...` (Triggers navigation to `/settings/branches`)
   - Behavior: Changing branch triggers session context switch; filters all case lists, bills, and cashier reconciliation records to the selected center.

#### Center Section: Omnisearch Trigger
1. **Omnisearch Bar Trigger Button**:
   - Placeholder Text: `Search patients, bill #, mobile, test name...`
   - Leading Icon: Magnifying Glass `<Search size={16} />`.
   - Trailing Badge: Monospace keyboard chip `<kbd>Ctrl+K</kbd>` or `<kbd>⌘K</kbd>`.
   - Behavior: Clicking this button or pressing `Ctrl+K` immediately opens the `OmnisearchModal`.

#### Right Section: Actions & Utilities
1. **Quick New Bill CTA Button**:
   - Label: `+ New Bill`
   - Shortcut Badge: `Alt+N`
   - Styling: Primary Blue Button (`#1565c0`), hover (`#0d47a1`), active (`#0a3875`), border-radius `6px`, font-weight 700.
   - Behavior: Immediately navigates to `/cases/new` (`new_bill` screen).
2. **SMS Credits Counter Badge**:
   - Label: `SMS: 240` (Dynamic integer value).
   - Icon: Message bubble `<MessageSquare size={14} />`.
   - Status Color:
     * Green (`> 100` credits): text `#15803d`, bg `#dcfce7`.
     * Amber (`20 - 100` credits): text `#b45309`, bg `#fef3c7`.
     * Red (`< 20` credits): text `#b91c1c`, bg `#fee2e2`, blinks softly.
   - Behavior: Clicking opens `SmsCreditsModal` for purchasing additional notification credits.
3. **Help & Support Icon Button**:
   - Icon: Question circle `<HelpCircle size={18} />`.
   - Dropdown Menu Options:
     * `Raise Support Ticket`: Opens `RaiseTicketModal`.
     * `Printer Setup Guide`: Opens `PrintSettingsGuideModal`.
     * `User Manual & Video Tutorials`: Opens external documentation link.
     * `WhatsApp Support Desk`: Deep link to WhatsApp support (`https://wa.me/919876543210`).
4. **Refer & Earn Bonus Button**:
   - Icon: Gift box `<Gift size={16} color="#d97706" />`.
   - Label: `Refer Lab` (Hidden on mobile).
   - Behavior: Opens `ReferModal`.
5. **Notification Bell**:
   - Icon: Bell `<Bell size={18} />`.
   - Red unread badge dot when unread critical panic results or device logins occur.
   - Flyout drawer showing:
     * Critical Panic Result Alerts (e.g. `Potassium 7.2 mEq/L for Patient #1004`).
     * Browser security login attempts from unauthorized IP.
     * SMS recharge confirmation.
6. **User Profile & Account Avatar Dropdown**:
   - Displays User Avatar / Initials (e.g. `JD` for Dr. John Doe).
   - User Name & Role: `Dr. John Doe (Admin / Pathologist)`.
   - Dropdown Menu Items:
     * `My Profile`: Displays username, email, phone, role.
     * `Letterhead & Print Settings`: Navigates to `/settings`.
     * `Browser Security Status`: Navigates to `/web_browsers`.
     * `Switch User / Lock Terminal`: Locks current screen requiring PIN.
     * `Logout`: Clears JWT auth tokens, ends session, redirects to `/login`.

---

## 3. Left Navigation Sidebar (`LeftSidebar.tsx`)

### 3.1 Dimensions & Styling
- Width: `256px` (`w-64`), Fixed position: `top: 64px`, `bottom: 0`, `left: 0`.
- Background: `#f9fafb`, Border-right: `1px solid #e2e8f0`.
- Scroll Behavior: `overflow-y: auto`, thin scrollbar.
- Responsive Collapse: On screen width `< 1024px`, collapses into a slide-over mobile drawer triggered by a hamburger icon in the navbar.

### 3.2 Navigation Hierarchy & Menu Items

```
[NAVIGATION SECTIONS]
├── 1. STANDALONE
│   ├── Dashboard (icon: LayoutDashboard, route: /dashboard)
│   ├── Getting Started (icon: CheckCircle2, route: /getting_started)
│   └── New Bill [CTA] (icon: PlusCircle, route: /cases/new, hotkey: Alt+N)
├── 2. CASES
│   ├── Bills (icon: FileText, route: /cases, badge: active count)
│   ├── Outsource Cases (icon: ExternalLink, route: /outsource_lab_cases)
│   ├── CT Scan Cases (icon: Disc, route: /ctscan_cases)
│   ├── Patients (icon: Users, route: /patients)
│   ├── Transactions (icon: Receipt, route: /receipts)
│   ├── Referral Doctors (icon: UserCheck, route: /referrers)
│   └── Agents (icon: Truck, route: /sample_collectors)
├── 3. LAB (PATHOLOGY)
│   ├── Today's Reports (icon: Clock, route: /lab_reports/today, badge: pending)
│   ├── Search Reports (icon: Search, route: /lab_reports)
│   ├── Test Packages (icon: Box, route: /packages)
│   ├── Test Panels (icon: Layers, route: /panels)
│   ├── Test Categories (icon: Grid, route: /categories)
│   ├── Test Master Database (icon: Database, route: /test_master)
│   ├── Interpretations Library (icon: BookOpen, route: /interpretations)
│   └── Test Counts & Workload (icon: BarChart2, route: /lab_test_counts)
├── 4. USG (ULTRASOUND)
│   ├── Today's Worklist (icon: Activity, route: /usg_cases/today)
│   ├── USG Reports Archive (icon: Archive, route: /usg_cases)
│   ├── Organ Templates (icon: FileCode, route: /usg_templates)
│   └── Radiologist Signatures (icon: PenTool, route: /usg_signatures)
├── 5. DIGITAL X-RAY
│   ├── Today's Worklist (icon: Aperture, route: /digital_xray_cases/today)
│   ├── X-Ray Reports Archive (icon: Folder, route: /digital_xray_cases)
│   ├── X-Ray Templates (icon: Copy, route: /xray_templates)
│   └── X-Ray Signatures (icon: Shield, route: /xray_signatures)
├── 6. BUSINESS & FINANCIALS
│   ├── Daily Business (icon: DollarSign, route: /business_reports/daily_business)
│   ├── Expenses (icon: CreditCard, route: /expenses, badge: BETA)
│   ├── Due Reports (icon: AlertCircle, route: /cases/with_due)
│   ├── Activities / Audit Logs (icon: List, route: /activities)
│   ├── Referral Business (icon: Award, route: /referrer_wise_business_report/summary)
│   ├── Case-Wise Report (icon: Table, route: /case_wise_business_report/new)
│   ├── Business Analysis (icon: TrendingUp, route: /monthly_business_overview, badge: BETA)
│   └── Data Export (icon: DownloadCloud, route: /data_exports/new)
├── 7. MANAGE & SECURITY
│   ├── Browser Security (icon: ShieldCheck, route: /web_browsers, badge: BETA)
│   ├── Employee Logins (icon: UserPlus, route: /users)
│   └── Doctor Access Portal (icon: Key, route: /doctor_accesses)
└── 8. SETTINGS
    └── Laboratory Setup & Letterhead (icon: Settings, route: /settings)
```

### 3.3 Menu States & Interactions
- **Active Menu Item**: Background `#eff6ff` (blue-50), Text `#1565c0` (blue-700), Font-weight 700, Left border accent `4px solid #1565c0`.
- **Hover State**: Background `#f1f5f9` (slate-100), Text `#0f172a`.
- **Accordion Toggle**: Clicking group header (e.g. `CASES`, `LAB`) toggles collapse/expand of child links with smooth CSS transition.
- **Badge Indicators**:
  * `BETA`: Pink pill (`#fdf2f8`, text `#db2777`, border `#fbcfe8`).
  * Counts: Numeric pill displaying pending cases or due counts.

---

## 4. Global System Modals Specifications

### 4.1 Omnisearch Modal (`OmnisearchModal.tsx`)
- **Trigger**: Click top search bar OR press `Ctrl+K` / `⌘K`.
- **Modal Dimensions**: Max-width `680px`, centered, backdrop `#0f172a` with `backdrop-filter: blur(4px)`.
- **Search Input Field**:
  * Placeholder: `Type patient name, phone number, UHID, Reg No, or test name...`
  * Prefix: `<Search size={20} color="#64748b" />`
  * Instant Debounce: 150ms keystroke debounce.
- **Keyboard Navigation**:
  * `Down Arrow (↓)` / `Up Arrow (↑)`: Highlight item in results list.
  * `Enter`: Select item and navigate.
  * `Escape (Esc)`: Dismiss modal.
- **Results Categories Displayed**:
  1. **Patients Group**: Name, Age/Sex, Mobile, UHID, link to Patient Profile.
  2. **Cases & Bills Group**: Reg No, Bill Date, Total Amount, Due Status, link to Bill or Report.
  3. **Diagnostic Tests Group**: Test Name, Code, Dept, MRP Rate, link to Test Master.
  4. **Referring Doctors Group**: Doctor Name, Speciality, Clinic, link to Doctor Profile.
  5. **Quick Navigation Commands**:
     * `Go to New Bill` -> `/cases/new`
     * `Go to Daily Business` -> `/business_reports/daily_business`
     * `Go to Today's Lab Reports` -> `/lab_reports/today`
     * `Go to Browser Security` -> `/web_browsers`

### 4.2 Raise Ticket Modal (`RaiseTicketModal.tsx`)
- **Trigger**: Topbar Help Dropdown -> `Raise Support Ticket`.
- **Modal Header**: Title `Raise Support Ticket`, Subtitle `Our technical team usually responds within 15 minutes.`
- **Form Fields**:
  1. `Issue Category` (`Select`, Required):
     * `Billing & Receipt Inquiries`
     * `Analyzer Integration & Machine Interface`
     * `Report Letterhead & Margin Formatting`
     * `SMS / WhatsApp Gateway Delivery`
     * `Doctor Portal Login Issues`
     * `Backup & Data Export Request`
     * `Other Technical Issue`
  2. `Subject` (`Input`, Required):
     * Placeholder: `Brief summary of the issue...`
     * Validation: Min 5 characters.
  3. `Severity Level` (`PillGroup`, Required):
     * `Low (General inquiry)`
     * `Medium (Feature impaired)`
     * `High (Billing or results blocked)`
     * `Critical (System down)`
  4. `Detailed Description` (`Textarea`, Required):
     * Rows: 4
     * Placeholder: `Describe the error encountered, patient bill numbers involved, or error message shown...`
  5. `Attach Screenshot / Error Log` (`File Input`, Optional):
     * Accepts: `.png`, `.jpg`, `.pdf`, `.log` (Max 10MB).
  6. `Contact Callback Number` (`Input`, Required):
     * Default: Pre-filled with logged-in user mobile.
- **Action Buttons**:
  * `Cancel`: Closes modal without saving.
  * `Submit Ticket`: Dispatches ticket to support API; displays success toast with Ticket ID (e.g. `TKT-89211`).

### 4.3 SMS Credits Modal (`SmsCreditsModal.tsx`)
- **Trigger**: Click `SMS: {count}` badge in top navbar.
- **Modal Header**: Title `Purchase SMS & WhatsApp Credits`, Subtitle `Current Balance: {count} Credits`.
- **Credit Recharge Packages Grid**:
  1. **Starter Pack**: `1,000 SMS` @ `₹250` (₹0.25 / SMS) + 18% GST = `₹295.00`
  2. **Popular Pack**: `5,000 SMS` @ `₹1,000` (₹0.20 / SMS) + 18% GST = `₹1,180.00` [Best Value Badge]
  3. **High Volume Pack**: `25,000 SMS` @ `₹4,250` (₹0.17 / SMS) + 18% GST = `₹5,015.00`
  4. **WhatsApp Message Addon**: `2,000 WhatsApp Messages` @ `₹700` (₹0.35 / Msg).
- **Payment Gateway Trigger**:
  * Button: `Proceed to Pay ₹{total}`
  * Triggers Razorpay / UPI checkout modal.
  * Instant auto-credit webhook upon payment success.

### 4.4 Refer Lab Modal (`ReferModal.tsx`)
- **Trigger**: Click `Refer Lab` gift button in top navbar.
- **Modal Header**: Title `Refer a Diagnostic Center or Clinic`, Subtitle `Earn 1,000 Free SMS Credits for every active referral.`
- **Content Elements**:
  1. Unique Referral Code Display: Text `APEX-REF-2026` with one-click `Copy Code` button.
  2. Unique Referral URL: `https://app.labsmartlis.com/signup?ref=APEX-REF-2026` with `Copy Link` button.
  3. Quick Share Triggers:
     * `Share on WhatsApp` button: Deep link to WhatsApp with pre-crafted referral text.
     * `Share via Email` button: `mailto:` trigger.
  4. Referral Progress Tracker: Displays `Invited: 3`, `Signed Up: 2`, `Credits Earned: 2,000`.

### 4.5 Print Settings Guide Modal (`PrintSettingsGuideModal.tsx`)
- **Trigger**: Topbar Help Dropdown -> `Printer Setup Guide`.
- **Modal Header**: Title `How to Configure Laser & Thermal Printers`.
- **Tabbed Instructions**:
  * **Tab 1: A4/A5 Pre-Printed Letterhead**: Explains how to calibrate `Header Margin (mm)` in `/settings` so test results print below pre-printed lab letterhead.
  * **Tab 2: Plain Paper Printing**: Explains how to enable digital lab header, NABL logo, and clinic address.
  * **Tab 3: 80mm / 3-inch Thermal Cash Printer**: Explains setting paper size to `Roll - 80mm`, disabling browser headers/footers in Chrome print dialog, and setting margins to `None`.

### 4.6 Universal Confirmation Modal (`ConfirmationModal.tsx`)
- **Trigger**: System-wide delete, discard, reset, or cancel actions.
- **Props**:
  * `isOpen: boolean`
  * `title: string` (e.g. `Clear New Bill Form?`, `Delete Investigation?`)
  * `message: string` (Explanatory confirmation text)
  * `confirmLabel: string` (Default `Confirm`, e.g. `Yes, Delete`)
  * `cancelLabel: string` (Default `Cancel`)
  * `variant: 'danger' | 'warning' | 'primary'`
  * `onConfirm: () => void`
  * `onCancel: () => void`

---

## 5. Keyboard Shortcuts System Engine

The application intercepts the following global keyboard combinations:

| Key Combination | Action Description | Target Route / Action |
| :--- | :--- | :--- |
| `Alt + N` | Open New Bill Registration form | Navigates to `/cases/new` |
| `Ctrl + K` / `⌘ + K` | Open Omnisearch Modal | Opens `OmnisearchModal` |
| `Escape (Esc)` | Dismiss open modal or clear search | Closes topmost active modal |
| `Alt + D` | Quick jump to Daily Business | Navigates to `/business_reports/daily_business` |
| `Alt + L` | Quick jump to Today's Lab Reports | Navigates to `/lab_reports/today` |
| `Ctrl + P` (on view screens)| Print current active bill or diagnostic report | Triggers configured print layout |

---

## 6. Backend API Specifications & Architecture

### 6.1 Endpoints Supporting App Shell

#### 1. GET `/api/v1/shell/context`
- **Purpose**: Fetches active session info, branch list, unread alerts, and SMS credits on app initialization.
- **Headers**: `Authorization: Bearer <jwt_token>`
- **Response JSON (200 OK)**:
```json
{
  "user": {
    "id": "usr-83192",
    "username": "dr_john",
    "fullName": "Dr. John Doe",
    "role": "ADMIN",
    "permissions": {
      "canBilling": true,
      "canResultsEntry": true,
      "canAuthorize": true,
      "canDoctorPayouts": true,
      "canAuditMaster": true
    }
  },
  "clinic": {
    "id": "clinic-001",
    "name": "Apex Diagnostic Centre & Imaging Network",
    "tagline": "NABL Accredited Referral Laboratory",
    "activeBranch": {
      "id": "main",
      "name": "Main Laboratory Branch"
    },
    "availableBranches": [
      { "id": "main", "name": "Main Laboratory Branch" },
      { "id": "ag102", "name": "City Care Collection Center (AG-102)" },
      { "id": "ag105", "name": "Sector 56 Phlebotomy Point (AG-105)" }
    ]
  },
  "credits": {
    "smsBalance": 240,
    "whatsappBalance": 180
  },
  "unreadAlertsCount": 2
}
```

#### 2. POST `/api/v1/shell/switch-branch`
- **Purpose**: Switches active branch context for the current user session.
- **Request Body**:
```json
{
  "branchId": "ag102"
}
```
- **Response (200 OK)**: Sets HTTP-only branch cookie and returns updated context.

#### 3. GET `/api/v1/shell/omnisearch`
- **Purpose**: Substring autocomplete query across patients, cases, doctors, and tests.
- **Query Parameters**: `q={searchQuery}&limit=15`
- **Response JSON (200 OK)**:
```json
{
  "patients": [
    {
      "id": "pat-1001",
      "uhid": "35375569",
      "fullName": "Rahul Sharma",
      "age": 32,
      "gender": "Male",
      "mobile": "9876543210"
    }
  ],
  "cases": [
    {
      "id": "case-991",
      "billNumber": "BL-2026-1001",
      "patientName": "Rahul Sharma",
      "date": "2026-10-19T09:30:00Z",
      "total": 400.0,
      "paymentStatus": "Paid"
    }
  ],
  "tests": [
    {
      "id": "test-cbc",
      "code": "CBC",
      "name": "Complete Blood Count (CBC)",
      "department": "Hematology",
      "rate": 400.0
    }
  ],
  "doctors": [
    {
      "id": "doc-833120",
      "name": "Dr. Anil Verma",
      "specialty": "Internal Medicine"
    }
  ]
}
```

#### 4. POST `/api/v1/support/tickets`
- **Purpose**: Creates technical support ticket.
- **Request Body (Multipart or JSON)**:
```json
{
  "category": "Analyzer Integration",
  "subject": "Sysmex XN-350 ASTM interface not syncing results",
  "severity": "High",
  "description": "Error timeout on port 5100 when pushing CBC differential counts.",
  "callbackPhone": "9876543210",
  "attachmentUrl": "https://storage.labsmart.internal/tickets/err_log_102.png"
}
```
- **Response (201 Created)**: Returns ticket tracking number `{"ticketId": "TKT-89211", "status": "OPEN"}`.
