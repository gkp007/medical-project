# Labsmart LIS — Manage Frontend Specification & Parity Audit

## Executive Summary
This document provides the exhaustive frontend engineering, architectural, and visual specification for the **Manage** module of Labsmart LIS. It covers the complete screen layouts, design tokens, interactive controls, data models, state handlers, permissions matrix, and device security policies across all 3 Manage module screens:
1. **Browser Security** (`/web_browsers`) — Device-level biometric and cookie-bound terminal authorization, remote lockdown, and access enforcement.
2. **Employee Logins** (`/users`) — Staff accounts, credentials, contact verification, role assignments, and granular RBAC (Role-Based Access Control).
3. **Doctor Portal Access** (`/doctor_accesses/invited`, `/doctor_accesses/access_granted`, `/doctor_accesses/access_revoked`) — Referring clinician digital portal licensing, SMS/Email invite links, and patient report access controls.

---

## 1. Global Manage Module Architecture & Navigation

### 1.1 Sidebar Hierarchy & Routing
- **Section Group**: `Manage` (Group 6 in left sidebar)
- **Menu Items**:
  - `Browser security` -> Route: `/71122710/web_browsers` | Internal ID: `browser_security` | Icon: `<Shield size={16} />`
  - `Employee login` -> Route: `/71122710/users` | Internal ID: `employee_logins` | Icon: `<Users size={16} />`
  - `Doctor access` -> Route: `/71122710/doctor_accesses/invited` | Internal ID: `doctor_access` | Icon: `<UserCheck size={16} />`

### 1.2 Common Design Tokens & Badges
- **BETA Tag**: Pink/magenta pill `#fdf2f8`, text `#db2777`, border `#fbcfe8`, font-size `11px`, font-weight `700`, uppercase.
- **Device Security Status**:
  - Active / Guarded: `#15803d` (Green), icon `<ShieldCheck size={16} />`
  - Deactivated / Open: `#dc2626` (Red), icon `<ShieldAlert size={16} />`
- **Verification Status**:
  - Verified: `<CheckCircle2 size={16} color="#16a34a" fill="#dcfce7" />`
  - Pending / Unverified: `<XCircle size={16} color="#dc2626" fill="#fee2e2" />`

---

## 2. Screen 1: Browser Security (`/web_browsers`)

### 2.1 Screen Objective & Security Mechanics
Diagnostic pathology and radiology centers process confidential patient health data (PHI) subject to DISHA and data protection standards. The Browser Security module enforces **Physical Location Security**:
- Prevents staff or unauthorized persons from logging into the diagnostic portal outside laboratory premises.
- Each browser session generates a unique 4-character cryptographic token (`Browser code`, e.g. `123E`, `62F7`).
- When "Browser Security" is enabled, only browsers marked as **Permitted / Allowed** can access billing and patient records. Unregistered devices are redirected to an "Authorization Required" lockdown screen.

### 2.2 Breadcrumb & Header
- **Breadcrumb**: `DASHBOARD / MANAGE BROWSERS` (`font-size: 11px`, `color: #64748b`, `font-weight: 700`, uppercase).
- **Title**: `Browser security` + `<span className="badge badge-info">Beta</span>`
- **Control Card**:
  - **Left Section**:
    - Heading: `Control browser access` (`font-size: 15px`, `font-weight: 700`, `color: #0f172a`)
    - Subtitle: `Block access to browsers not being used inside the laboratory.` (`font-size: 13px`, `color: #64748b`)
  - **Right Section**:
    - Security Status Label: `Security is off` (red) or `Security is ON` (green).
    - Status Graphic: Shield icon with center lock glyph.
    - Toggle Button: `Turn on security` (primary blue) / `Turn off security` (secondary gray).

### 2.3 Terminal Search & Filter Bar
- **Search Input**:
  - Placeholder: `Search by browser code or device name...`
  - Prefix: Search icon `<Search size={16} />`
  - Behavior: Instant substring filter across browser name, user, and 4-digit code.
- **Filter Pills / Dropdown**:
  - `All` (count)
  - `Allowed` (count)
  - `Blocked` (count)
- **Primary Action**: `+ Register New Browser` button to manually authorize a terminal code.

### 2.4 Browser Terminal Cards Grid
Rendered in a 3-column responsive card grid (`display: grid`, `grid-template-columns: repeat(auto-fill, minmax(320px, 1fr))`, `gap: 16px`).
Each card includes:
1. **Header Row**:
   - Device Name (e.g. `Gopalkrishna Pattanaik 's browser` or `Reception Desk Terminal 1`)
   - Pencil Edit Button (`<Edit3 size={14} />`) to trigger Rename Modal.
   - Status Tag: `Current browser` (Green badge `#dcfce7`, text `#15803d`) if the current session matches the device.
2. **Metadata Body**:
   - `Last login : [Staff Member Name], [Timestamp]` (e.g. `19 Oct 26, 11:37 AM`)
   - `Browser code: [CODE]` (e.g. `123E`, displayed in bold monospace text)
   - `Status`: Allowed (`#16a34a`) or Blocked (`#dc2626`)
3. **Card Footer**:
   - Block / Unblock toggle button:
     - When active: Red-tinted button `Block` (`bg: #fee2e2`, `color: #dc2626`, `border: 1px solid #fecaca`)
     - When blocked: Secondary button `Unblock` (`bg: #ffffff`, `color: #2563eb`, `border: 1px solid #cbd5e1`)

### 2.5 Modals & Dialogs
1. **Rename Browser Modal**:
   - Input: `Browser device name` (e.g. `Billing Counter #1 (Dell Inspiron)`)
   - Submit: `Save Name`
2. **Toggle Security Confirmation Modal**:
   - Explains that enabling security will immediately restrict access to unregistered devices.
   - Action: `Activate Terminal Lockdown` / `Deactivate Security`
3. **Block Browser Confirmation Modal**:
   - Warning that active sessions on this browser will be terminated immediately.

---

## 3. Screen 2: Employee Logins (`/users`)

### 3.1 Screen Objective & User Roles
Diagnostic operations require multi-tier authorization for receptionists, phlebotomists, lab technicians, pathologists, radiologists, and center accountants. The Employee Logins module handles onboarding, credential issuance, and permission gating.

### 3.2 Header & Action Bar
- **Header**: `Manage employee logins` (`font-size: 20px`, `font-weight: 700`, `color: #0f172a`)
- **Video Guide Button**: `Watch Video` (`font-size: 13px`, `color: #2563eb`, with play icon)
- **Action Buttons**:
  - `+ New employee` (Primary blue button `#2563eb`, user-plus icon)
  - `+ Existing employee` (Secondary button with plus-circle icon, border `#cbd5e1`)

### 3.3 Status Tabs
- `Active (N)` (active blue underline)
- `Blocked (N)`

### 3.4 Staff Accounts Ledger Table
| Column Name | Content & Data Format | Styling / Behavior |
| :--- | :--- | :--- |
| **S. NO.** | `1.`, `2.` | Monospace bold |
| **NAME** | Employee full name + role subtitle | Font size 14px bold, text `#0f172a` |
| **MOBILE NUMBER** | `+91 7752058263` | Standard phone format |
| **STATUS (Mobile)** | Verified checkmark or pending warning | `<CheckCircle2 size={16} color="#16a34a" />` |
| **EMAIL** | `gkpattanaik001@gmail.com` | Font size 13px, text `#334155` |
| **STATUS (Email)** | Verified checkmark or red unverified cross | `<CheckCircle2 color="#16a34a" />` / `<XCircle color="#dc2626" />` |
| **REG. ON** | `18/10/2026` | Date formatted string |
| **PERMISSIONS** | `Account owner`, `Receptionist & Billing`, `Chief Pathologist`, `Technician` | Role badge or text |
| **ACTIONS** | Three-dot meatball menu button | Dropdown menu: `Permissions`, `Reset Password`, `Block Login`, `Delete` |

### 3.5 Modals & Sub-Flows
1. **Add New Employee (`/users/new`)**:
   - Form Fields:
     - `* First name` (Text input)
     - `Last name` (Text input)
     - `* Email` (Email input)
     - `* Mobile number` (Prefix `+91`, 10-digit number)
     - `* Password` (Masked with eye toggle)
     - `* Password confirmation`
     - `Designation & Role`: Dropdown (`Receptionist & Billing Desk`, `Lab Technician`, `Pathologist / Radiologist`, `Accountant & Manager`)
     - `Granular Permissions Matrix`:
       - `Can edit retail & referral rates` (Checkbox)
       - `Can cancel or delete bills` (Checkbox)
       - `Can authorize and digitally sign clinical reports` (Checkbox)
       - `Can view financial ledgers & business analytics` (Checkbox)
       - `Can record expenses and manage categories` (Checkbox)
       - `Can issue bill refunds and discount overrides` (Checkbox)
   - Submit: `Add Employee` (Primary blue button)

2. **Add Existing Employee (`/users/new_existing_user`)**:
   - Warning Notice (Yellow Box `#fefce8`, border `#fef08a`):
     - `Note:`
     - `• Employee details must be edited from the user's profile page by the employees themselves.`
     - `• Please verify email carefully before adding. Permissions need to be configured again for the added employee.`
   - Field: `Employee email`
   - Submit: `Add Employee`

3. **Configure Permissions Modal**:
   - Displays employee name and current role.
   - Interactive switch/checkbox list of all 6 operational permissions.
   - Submit: `Save Permissions`

4. **Reset Password Modal**:
   - New password and confirm password inputs with complexity guidelines.

5. **Block / Unblock Staff Confirmation Modal**:
   - Revokes immediate access to laboratory terminals while preserving historical activity audit trails.

---

## 4. Screen 3: Doctor Access (`/doctor_accesses/invited`)

### 4.1 Screen Objective & Clinician Portal
The Labsmart Doctor Portal empowers referring doctors to:
- Securely view patient pathology and radiology reports in real-time from their smartphone or PC.
- Track referred investigations and patient test progress without requiring phone calls to the lab.
- Download branded diagnostic PDFs and DICOM X-ray files directly.

### 4.2 Header & Plan Limitation Callout
- **Header**: `Manage Labsmart Doctor Portal Access` + `<span className="badge badge-info">BETA</span>`
- **Plan Limit Alert Box** (`bg: #f0fdf4`, `border: #bbf7d0`, `color: #166534`):
  - `(i) Invite and access limit: 5 doctors — Upgrade to premium plan to increase this limit.`
  - `Grant live access to investigations and reports to doctors. Doctor can signup with the invite link and will use the same login as labs.`

### 4.3 Invite Clinician Control Box
- Card container with inline form:
  - Label: `Select Doctor to Invite:`
  - Doctor Select Dropdown: Pre-populated from `Referral Doctors` master (e.g. `ID: 3, Dr. Priya Sharma (MS General Surgery)`, `ID: 2, Dr. Anil Verma (MBBS, MD)`, `ID: 4, Dr. Ramesh Saxena (MD Peds)`).
  - Button: `Invite` (Primary blue, with `<Send size={16} />` icon).

### 4.4 Status Navigation Tabs
- `Invited (count)` — Invitations sent where the clinician has not yet created their password.
- `Access Granted (count)` — Clinicians actively using the Doctor Portal.
- `Access Revoked (count)` — Clinicians whose portal privileges have been temporarily suspended.

### 4.5 Doctor Access Ledger Table
| Column Name | Content & Data Format | Action Controls |
| :--- | :--- | :--- |
| **S. NO.** | `1.`, `2.` | Numerical counter |
| **ID** | `#2`, `#3` | Referral master ID |
| **REFERRER** | Doctor name + degree + clinic address | Bold name with speciality badge |
| **ADDRESS** | Clinic or hospital street address | Standard text |
| **INVITED ON** | `18/10/2026` or `Today` | Date string |
| **STATUS** | `Invited` (blue), `Access Granted` (green), `Access Revoked` (gray) | Pill badge |
| **RESEND / ACTION** | • In `Invited`: `Resend Invite` button (triggers SMS & Email dispatch)<br>• In `Access Granted`: `Revoke Access` button<br>• In `Access Revoked`: `Restore Access` button | Secondary action buttons with tooltips |

### 4.6 Doctor Invitation Modal & Notification Dispatch
- Pre-fills doctor name, mobile, and email.
- Displays the personalized invitation SMS message:
  > *"Dear [Doctor Name], Labsmart Diagnostics has invited you to access your patients' digital pathology and radiology reports online. Click here to activate your doctor portal: https://labsmartlis.com/dr/[token]"*
- Action: `Send Portal Invitation Link`

---

## 5. Technical Implementation Details & Codebase Parity

### 5.1 Component Inventory
| Screen ID | File Path | Status |
| :--- | :--- | :--- |
| `browser_security` | [BrowserSecurityPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/manage/BrowserSecurityPage.tsx) | **Full 1:1 Parity**: Responsive 3-column card grid, large shield status graphic, code search, rename modal, block/unblock, and security lock confirmation. |
| `employee_logins` | [EmployeeLoginsPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/manage/EmployeeLoginsPage.tsx) | **Full 1:1 Parity**: Active/Blocked tabs, verified badges, meatball dropdown menu, Add new employee modal, Add existing employee with Labsmart yellow note banner, and granular RBAC permissions editor. |
| `doctor_access` | [DoctorAccessPage.tsx](file:///c:/Users/hp/Desktop/MedicalProject/src/pages/manage/DoctorAccessPage.tsx) | **Full 1:1 Parity**: 5-doctor tier quota badge, inline doctor selector, 3 status tabs (Invited, Granted, Revoked), Resend SMS/Email invite, Revoke/Restore portal actions, and empty states. |

### 5.2 Verification Checklist
- [x] Live Labsmart navigation inspected (`/web_browsers`, `/users`, `/users/new`, `/users/new_existing_user`, `/doctor_accesses/invited`, `/doctor_accesses/access_granted`, `/doctor_accesses/access_revoked`).
- [x] UI design tokens match Labsmart typography, padding, pill tags, and action buttons.
- [x] All modal workflows (Rename Browser, Add Employee, Add Existing Employee, Configure Permissions, Reset Password, Invite Doctor, Revoke Access) implemented with high visual fidelity.
- [x] TypeScript validation clean (`tsc -b && vite build` exit code 0).
- [x] Verified in live browser on `http://localhost:5173/`.
