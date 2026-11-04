# Labsmart LIS — Manage & Masters Module Specification

**Specification ID:** `SPEC-07-MANAGE-MASTERS`  
**Module Name:** Master Patient Index (UHID), Doctor Directory, Logistics Fleet, Diagnostic Masters (Packages, Panels, Categories, Tests), Employee RBAC & Terminal Security  
**Target Routes:**
- `/patients` & `/patients/:id`
- `/referrers`
- `/sample_collectors`
- `/packages`
- `/panels`
- `/categories`
- `/test_master`
- `/users`
- `/doctor_accesses/invited`
- `/web_browsers`  
**Source Components:**
- `src/pages/manage/PatientsPage.tsx`
- `src/pages/manage/PatientProfilePage.tsx`
- `src/pages/manage/DoctorsPage.tsx`
- `src/pages/manage/AgentsPage.tsx`
- `src/pages/manage/PackagesPage.tsx`
- `src/pages/manage/TestPanelsPage.tsx`
- `src/pages/manage/TestCategoriesPage.tsx`
- `src/pages/manage/TestMasterPage.tsx`
- `src/pages/manage/EmployeeLoginsPage.tsx`
- `src/pages/manage/DoctorAccessPage.tsx`
- `src/pages/manage/BrowserSecurityPage.tsx`

---

## 1. Executive Summary & Master Data Architecture

The **Manage & Masters** module defines the data dictionary, clinical knowledge catalog, staff authorizations, and physical terminal security of the laboratory:
1. **Master Patient Index (MPI / UHID)**: Longitudinal patient history, demographic updates, and duplicate record merging.
2. **Referral Doctors & Logistics Directory**: Consulting physicians, individual commission percentages, and home-collection phlebotomy fleets.
3. **Diagnostic Test Masters Hierarchy**:
   - `Packages`: Health checkups combining multiple panels with bundled rate discounting.
   - `Panels`: Ordered groupings of tests (e.g. CBC, LFT, KFT, Lipid Profile).
   - `Categories`: Laboratory sub-disciplines (Haematology, Biochemistry, Microbiology).
   - `Test Database`: 500+ parameter definitions, units, biological reference intervals, and formulas.
4. **Staff Roles & Granular RBAC**: Receptionists, Lab Technicians, Pathologists, Radiologists, and Accountants with restricted permissions.
5. **Physical Terminal Lockdown (Browser Security)**: 4-character cryptographic tokens preventing unauthorized access outside clinic premises.

---

## 2. Screen 1: Master Patient Index & Patient Profile (`/patients` & `/patients/:id`)

### 2.1 Patients Directory (`/patients`)
- **Filter Controls**: Search by UHID, Patient Full Name, Mobile Number, Gender.
- **Data Table Columns**: `UHID`, `PATIENT NAME`, `AGE / SEX`, `PHONE NUMBER`, `TOTAL VISITS`, `LAST VISIT DATE`, `OUTSTANDING BALANCE`, `ACTIONS`.
- **Actions**:
  * `View Profile`: Navigates to `/patients/:id`.
  * `Edit Details`: Opens `UpdatePatientDetailsModal`.
  * `Add Case`: Opens `/cases/new` pre-filled with patient UHID.

### 2.2 Patient Longitudinal Profile Page (`/patients/:id`)
- **Patient Identity Banner**:
  * Name: `Nikash ranjan Bishi` (33Y / Male).
  * UHID: `UHID-2026-0001` (Bold monospace).
  * Contact: Phone, Email, Address, Aadhaar number.
  * Lifetime Statistics: `Total Visits: 4`, `Total Billed: ₹3,200`, `Total Paid: ₹2,800`, `Balance Due: ₹400`.
- **Chronological Case Timeline**:
  * History of all diagnostic cases registered across time.
  * For each case: Bill Number, Registration Date, Ordered Tests, Total Rate, Paid Amount, Due Status, Quick Actions (`View Bill`, `View Official Report`, `Print Barcode`).
- **Profile Utility Actions**:
  * `Edit Profile`: Opens `UpdatePatientDetailsModal`.
  * `Merge Patient`: Opens modal to merge duplicate UHIDs into a single longitudinal record.

---

## 3. Screen 2 & 3: Referral Doctors & Agents Directory

### 3.1 Referral Doctors Directory (`/referrers`)
- **A-Z Alphabetical Filter Tabs**: Quick filter bar (`All`, `A`, `B`, `C` ... `Z`).
- **Search Bar**: Search by doctor name, clinic, speciality, mobile.
- **Doctor Directory Table**:
  * `DOCTOR NAME`: Name with qualification (e.g. `Dr. Anil Verma, MBBS MD`).
  * `SPECIALITY`: Clinical domain (e.g. `Internal Medicine`, `Cardiology`).
  * `CONTACT`: Mobile number and clinic address.
  * `COMMISSION RATE`: Default incentive percentage (e.g. `15%`).
  * `STATUS`: `Active` vs `Archived`.
  * `ACTIONS`: `Edit` (Opens `EditReferrerModal`), `View Cases`, `Print Referral Statement`.
- **Doctor Modal (`DoctorModal.tsx` / `EditReferrerModal.tsx`)**:
  * Full Name (Required)
  * Degree / Qualifications (e.g. `MBBS, MD, MS, DGO`)
  * Speciality (e.g. `General Surgery & Orthopaedics`)
  * Phone Number & Email
  * Clinic / Hospital Name & Address
  * Department Commission Matrix:
    - Pathology Commission `%` (e.g. `20%`)
    - Ultrasound Commission `%` (e.g. `25%`)
    - Digital X-Ray Commission `%` (e.g. `30%`)
    - CT Scan Commission `%` (e.g. `15%`)
    - Outsource Lab Commission `%` (e.g. `10%`)

### 3.2 Sample Collection Agents (`/sample_collectors`)
- Phlebotomists and field runner fleet directory.
- Fields: Agent Full Name, Mobile Number, Assigned Logistics Zone (e.g. `North Zone`), Vehicle Number, Active Case Count, Home Collection Fee per case (e.g. `₹100`).

---

## 4. Screen 4, 5, 6 & 7: Diagnostic Masters Hierarchy

### 4.1 Test Packages Master (`/packages`)
- **Purpose**: Multi-profile health checkups (e.g. `Executive Master Health Checkup`, `Senior Citizen Diabetic Profile`).
- **Package Builder Modal**:
  * Package Name & Unique Code (e.g. `PKG-EXEC-01`).
  * Department Category.
  * Included Tests & Panels Selector (with multi-select autocomplete).
  * Cumulative MRP Rate (Automatically sums rates of all included tests, e.g. `₹3,400`).
  * Special Package Rate (Discounted bundled rate, e.g. `₹1,999`).
  * Calculated Savings % (e.g. `41% Discount`).
  * Fasting / Specimen Preparation Instructions (e.g. `12 hours overnight fasting mandatory`).

### 4.2 Test Panels Master (`/panels`)
- **Purpose**: Ordered multi-test profiles (e.g. `Complete Blood Count`, `Liver Function Test`, `Lipid Profile`).
- **Panel Builder Modal**:
  * Panel Title & Short Name.
  * Department Category.
  * Test Parameters Sequencing Grid: Drag-and-drop parameter re-ordering.
  * Section Headers / Subheadings (e.g. `Differential Leukocyte Count (DLC)`, `Red Blood Cell Indices`).
  * Fixed Panel MRP Rate.

### 4.3 Test Categories Master (`/categories`)
- Standard Laboratory Disciplines:
  1. `Haematology`
  2. `Clinical Biochemistry`
  3. `Serology & Immunology`
  4. `Clinical Pathology & Urinalysis`
  5. `Microbiology & Culture Sensitivity`
  6. `Cytology & Smear Examinations`
  7. `Histopathology & Biopsy`
  8. `Endocrinology & Immunoassays`
- Fields: Category Name, Short Code, Department Head, Specimen Storage Protocols.

### 4.4 Test Master Database (`/test_master`)
- 500+ parameter clinical catalog.
- Filter by Category and Search by test name/code/tube.
- **Add / Edit Test Master Modal**:
  1. `Test Name` (e.g. `Serum Creatinine`)
  2. `Short Code / Parameter Code` (e.g. `CREAT`)
  3. `Test Type`: `Single parameter` | `Multi parameter` | `Document / Rich Text` | `Formula / Calculated`
  4. `Category / Department`: Select from categories.
  5. `Specimen Tube / Container`:
     * `Lavender (EDTA Whole Blood)`
     * `Yellow / Gold (SST Gel Clot Activator Serum)`
     * `Grey (Sodium Fluoride Plasma)`
     * `Plain Red (Serum)`
     * `Light Blue (Sodium Citrate Plasma)`
     * `Sterile Urine Container`
  6. `Analytical Methodology`: e.g. `Jaffe Kinetic Method`, `Enzymatic Colorimetric`, `CLIA`, `Flow Cytometry`.
  7. `Measurement Units`: e.g. `mg/dL`, `g/dL`, `U/L`, `fL`, `pg`, `cumm`.
  8. `Turnaround Time (TAT)`: Expected completion hours.
  9. `Default MRP Rate (₹)` & `B2B Franchise Rate (₹)`.
  10. **Biological Reference Intervals Matrix**:
      - Multi-row sub-range builder:
        * Age Min & Max (e.g. `0 - 1 Years`, `1 - 12 Years`, `12 - 60 Years`, `> 60 Years`).
        * Gender: `All` | `Male` | `Female`.
        * Normal Lower Bound & Normal Upper Bound.
        * Critical Panic Lower Bound & Critical Panic Upper Bound.
        * Textual Normal Description (for qualitative tests, e.g. `Non-Reactive`, `Negative`).
  11. `Automated Formula Expression`: (If calculated, e.g. `[Total Protein] - [Albumin]`).

---

## 5. Screen 8: Employee Logins & RBAC (`/users`)

### 5.1 Staff Directory & Active / Blocked Tabs
- Lists all diagnostic center staff accounts.
- Columns: `NAME`, `CONTACT (PHONE/EMAIL)`, `VERIFIED STATUS`, `ROLE`, `PERMISSIONS CHIPS`, `ACTIONS`.

### 5.2 Add Employee Modal (`NewEmployeeModal`)
- **Inputs**:
  * First Name, Last Name
  * Mobile Number (with SMS OTP verification trigger)
  * Email Address
  * Initial Password & Confirmation
  * Role Dropdown:
    - `Super Admin / Lab Director`
    - `Consultant Pathologist`
    - `Consultant Radiologist`
    - `Medical Lab Technologist (MLT)`
    - `Receptionist & Billing Desk`
    - `Phlebotomist / Runner`
    - `Accountant & Cashier`
  * Allowed Branches / Collection Centers (Multiselect)

### 5.3 Granular Permissions Matrix Modal (`EditPermissionsModal`)
Configures 6 critical security toggles per employee:
1. `canEditRates`: Authorizes overriding test MRP rates during billing.
2. `canDeleteBills`: Authorizes voiding registered bills and canceling cases.
3. `canSignOffReports`: Authorizes signing diagnostic pathology and radiology reports.
4. `canViewLedger`: Authorizes viewing executive turnover, net income, and business reports.
5. `canManageExpenses`: Authorizes recording and editing operational expense vouchers.
6. `canIssueRefunds`: Authorizes cash till disbursement for canceled bills.

---

## 6. Screen 9 & 10: Doctor Portal & Browser Security

### 6.1 Doctor Access Portal (`/doctor_accesses/invited`)
- **Purpose**: Referring physician digital web portal management.
- **Tabs**: `Invited (Count)`, `Access Granted (Count)`, `Access Revoked (Count)`.
- **Invite Doctor Modal**:
  * Select Doctor from directory.
  * Enter clinician mobile / email.
  * Sends SMS invite link with temporary login PIN.
  * Portal lets doctors view patient results, test histories, and referral commission statements in real time.

---

### 6.2 Browser Security & Physical Terminal Lockdown (`/web_browsers`)
- **Purpose**: Physical location security preventing staff from logging in outside the clinic.
- **Global Security Toggle**:
  * `Turn on security` (Primary Blue): Activates physical lockdown.
  * `Turn off security`: Disables terminal restriction.
- **Cryptographic Browser Code Generation**:
  * Every device generates a unique 4-character cryptographic code (e.g. `123E`, `62F7`) derived from browser canvas fingerprint, hardware concurrency, and local storage seed.
- **Terminal Cards Grid**:
  * Terminal Name (e.g. `Reception Desk Terminal 1 (Dell Inspiron)`).
  * Status Badge: `Current browser` (Green badge) if active session matches device.
  * Metadata: `Last login: Gopalkrishna Pattanaik, 19 Oct 26 11:37 AM`.
  * Browser Code: `123E` (Bold monospace).
  * Status: `Allowed` (Green `#16a34a`) vs `Blocked` (Red `#dc2626`).
  * Action Buttons:
    - `Rename`: Opens modal to update device label.
    - `Block / Unblock`: Remotely revokes terminal authorization. Unregistered devices are redirected to lockdown error page.

---

## 7. Backend API Specifications & Architecture

### 7.1 Endpoints Required by Manage & Masters

#### 1. POST `/api/v1/masters/tests`
- **Purpose**: Creates an individual test parameter in the master database.
- **Request Body JSON**:
```json
{
  "code": "CREAT",
  "name": "Serum Creatinine",
  "department": "Biochemistry",
  "specimen": "Serum",
  "container": "Yellow Gel Clot Activator",
  "rate": 180.0,
  "b2bRate": 90.0,
  "tatHours": 4,
  "parameters": [
    {
      "code": "CREAT",
      "name": "Serum Creatinine",
      "unit": "mg/dL",
      "method": "Modified Jaffe Kinetic",
      "ranges": [
        { "gender": "Male", "minAge": 18, "maxAge": 120, "lowerBound": 0.7, "upperBound": 1.3 },
        { "gender": "Female", "minAge": 18, "maxAge": 120, "lowerBound": 0.5, "upperBound": 1.1 }
      ]
    }
  ]
}
```
- **Response JSON (201 Created)**: Returns persisted test record.

#### 2. PUT `/api/v1/security/browsers/:id/status`
- **Purpose**: Remotely permits or blocks a browser terminal.
- **Request Body JSON**:
```json
{
  "isApproved": true,
  "isBlocked": false
}
```
- **Response JSON (200 OK)**:
```json
{
  "deviceFingerprint": "123E",
  "isApproved": true,
  "isBlocked": false,
  "updatedAt": "2026-10-30T10:45:00Z"
}
```
