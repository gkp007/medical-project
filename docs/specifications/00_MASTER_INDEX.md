# Labsmart LIS — Master Specification Index & Backend Developer Roadmap

**Document Version:** `2.0.0 Enterprise Edition`  
**Target Application:** Labsmart Diagnostic Laboratory & Hospital Information System (LIS / HIS)  
**Location:** `docs/specifications/`  
**Purpose:** Central executive index and developer navigation guide cataloging all 11 modular specification documents. Every feature, tab, modal dialog, mathematical calculation, validation rule, relational database model, and RESTful API endpoint is systematically indexed here.

---

## 1. Specification Suite Directory

```
docs/specifications/
├── 00_MASTER_INDEX.md                           # Master navigation index & backend roadmap (This document)
├── 00_SYSTEM_SHELL_AND_GLOBAL_MODALS.md         # Top navbar, sidebar, shell, global search & help modals
├── 01_DASHBOARD_MODULE.md                       # KPI cards, real-time receivables, recent receipts, referral widget
├── 02_CASES_AND_BILLING_MODULE.md               # Patient registration, 13 modalities, financial till, bills ledger
├── 03_LAB_PATHOLOGY_MODULE.md                   # Bench worklists, parameter entry, formulas, delta checks, interpretations
├── 04_USG_ULTRASOUND_MODULE.md                  # Sonography queue, structured organ findings, biometry, PNDT compliance
├── 05_DIGITAL_XRAY_MODULE.md                    # Radiography queue, exposure logging, film inventory, AERB safety
├── 06_BUSINESS_FINANCIALS_MODULE.md             # Net income formula, expenses, dues aging, doctor commission, exports
├── 07_MANAGE_MASTERS_MODULE.md                  # Master Patient Index, doctors, agents, test database, staff RBAC
├── 08_SETTINGS_MODULE.md                        # Clinic profile, letterhead designer (mm), SMS/WhatsApp, thermal printers
├── 09_MODALS_AND_DIALOGS_CATALOG.md             # Complete encyclopedia of all 32 modals, fields & API triggers
└── 10_BACKEND_API_AND_DATABASE_BLUEPRINT.md     # Prisma relational schema (24 models), 80+ REST APIs, business engines
```

---

## 2. Module Mapping Matrix

| Specification Document | Navigation Routes Covered | Key UI Components | Essential Modals Integrated | Primary Database Entities |
| :--- | :--- | :--- | :--- | :--- |
| [`00_SYSTEM_SHELL_AND_GLOBAL_MODALS.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/00_SYSTEM_SHELL_AND_GLOBAL_MODALS.md) | Global Wrapper, `Ctrl+K`, `Alt+N` | `TopNavbar`, `LeftSidebar`, `MasterAppShell` | `OmnisearchModal`, `RaiseTicketModal`, `SmsCreditsModal`, `ReferModal`, `PrintSettingsGuideModal` | `User`, `ClinicSetting`, `AuditLog` |
| [`01_DASHBOARD_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/01_DASHBOARD_MODULE.md) | `/dashboard` | `DashboardPage`, Quick action cards, Due patient feed, Recent transactions | `AcceptDueModal`, `ReferModal`, `SmsCreditsModal` | `Case`, `PaymentTransaction`, `Patient` |
| [`02_CASES_AND_BILLING_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/02_CASES_AND_BILLING_MODULE.md) | `/cases/new`, `/cases`, `/cases/:id/bill`, `/outsource_lab_cases`, `/ctscan_cases`, `/receipts` | `NewBillPage`, `CasesLedgerPage`, `PrintableBillPage`, `TransactionsPage` | `DoctorModal`, `CancelBillModal`, `AcceptDueModal`, `UpdatePatientDetailsModal`, `EditTransactionModal` | `Case`, `CaseItem`, `Patient`, `Doctor`, `PaymentTransaction` |
| [`03_LAB_PATHOLOGY_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/03_LAB_PATHOLOGY_MODULE.md) | `/lab_reports/today`, `/lab_reports`, `/lab_reports/:id/results`, `/lab_reports/:id/viewer`, `/interpretations`, `/lab_test_counts` | `TodayReportsPage`, `EnterResultsPage`, `ReportViewerPage`, `InterpretationsLibraryPage` | `SpecimenBarcodeModal`, `SignOffModal`, `ConfirmationModal` | `ClinicalResult`, `TestParameter`, `ParameterRange`, `ClinicalInterpretation` |
| [`04_USG_ULTRASOUND_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/04_USG_ULTRASOUND_MODULE.md) | `/usg_cases/today`, `/usg_cases`, `/usg_templates`, `/usg_signatures` | `USGWorklistPage`, `USGReportsPage`, `USGTemplatesPage`, `USGSignaturesPage` | `USGEnterFindingsModal`, `QuickRegisterUSGModal`, `PNDTDeclarationModal` | `RadiologyReport`, `RadiologyTemplate`, `DigitalSignature` |
| [`05_DIGITAL_XRAY_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/05_DIGITAL_XRAY_MODULE.md) | `/digital_xray_cases/today`, `/digital_xray_cases`, `/xray_templates`, `/xray_signatures` | `XRayWorklistPage`, `XRayReportsPage`, `XRayTemplatesPage`, `XRaySignaturesPage` | `XRayEnterFindingsModal`, `RadiationSafetyModal`, `BarcodeModal` | `RadiologyReport`, `RadiologyTemplate`, `DigitalSignature` |
| [`06_BUSINESS_FINANCIALS_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/06_BUSINESS_FINANCIALS_MODULE.md) | `/business_reports/daily_business`, `/expenses`, `/cases/with_due`, `/activities`, `/referrer_wise_business_report/summary`, `/data_exports/new` | `DailyBusinessPage`, `ExpensesPage`, `DueReportsPage`, `ReferralBusinessPage`, `ActivitiesPage` | `AddExpenseModal`, `AddCashierModal`, `BusinessReportModal`, `EmailDailyBusinessModal`, `SettleCommissionModal` | `ExpenseVoucher`, `DoctorPayout`, `PaymentTransaction`, `AuditLog` |
| [`07_MANAGE_MASTERS_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/07_MANAGE_MASTERS_MODULE.md) | `/patients`, `/referrers`, `/sample_collectors`, `/packages`, `/panels`, `/categories`, `/test_master`, `/users`, `/web_browsers` | `PatientsPage`, `DoctorsPage`, `TestMasterPage`, `EmployeeLoginsPage`, `BrowserSecurityPage` | `NewEmployeeModal`, `EditPermissionsModal`, `RenameBrowserModal`, `AddTestMasterModal`, `AddPackageModal` | `Patient`, `Doctor`, `CollectionAgent`, `Investigation`, `TestPanel`, `HealthPackage`, `BrowserDevice` |
| [`08_SETTINGS_MODULE.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/08_SETTINGS_MODULE.md) | `/settings` | `SettingsPage`, 7-tab submodule vertical layout | `PrintSettingsGuideModal` | `ClinicSetting`, `User` |
| [`09_MODALS_AND_DIALOGS_CATALOG.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/09_MODALS_AND_DIALOGS_CATALOG.md) | Global (All screens) | Dedicated encyclopedia of 32 dialogs with form controls, validation rules & actions | All 32 modal definitions | References all schemas |
| [`10_BACKEND_API_AND_DATABASE_BLUEPRINT.md`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/10_BACKEND_API_AND_DATABASE_BLUEPRINT.md) | All API namespaces (`/api/v1/*`) | Complete Prisma ORM schema (24 models), 80+ REST API endpoints, business logic engines | Connects all modal actions to API payloads | Master Schema & Endpoints |

---

## 3. Backend Implementation Checklist & Roadmap

Use this checklist when building the backend services:

### Phase 1: Database & Foundation
- [ ] Initialize PostgreSQL database and apply Prisma schema from `10_BACKEND_API_AND_DATABASE_BLUEPRINT.md`.
- [ ] Run seed script (`seed.ts`) populating:
  * Default clinic profile (`ClinicSetting`).
  * 500+ diagnostic test parameters (`Investigation`, `TestParameter`, `ParameterRange`).
  * Standard test panels (CBC, LFT, KFT, Lipid Profile) and categories.
  * Super Admin account with hashed credentials.
- [ ] Configure JWT authentication middleware with cookie parser and role-based permissions matrix guard (`UserRole`).
- [ ] Implement physical terminal browser security guard checking `X-Browser-Code` and client broadband IP.

### Phase 2: Core Patient & Billing Services
- [ ] Implement Patient Master Index (`MPI`) auto-assigning sequential UHID and supporting deduplication lookups by phone.
- [ ] Implement Case registration service with atomic transaction handling:
  * Generates sequential bill number `BL-YYYY-XXXX`.
  * Computes gross rate, discount validation, and net payable.
  * Enforces `allowDue` validation if unpaid balance exists.
  * Creates first `PaymentTransaction` with sequential receipt number `REC-YYYY-XXXX`.
  * Asynchronously logs `AuditLog` event.
- [ ] Implement A4/A5 and 80mm thermal receipt PDF rendering service with dynamic QR code generation.

### Phase 3: Diagnostic Laboratory (Pathology) Engine
- [ ] Build `/api/v1/pathology/worklist/today` with real-time status filtering (`New`, `In Progress`, `Final`, `Signed Off`).
- [ ] Implement diagnostic parameter entry and automated clinical formula evaluator (`MCV`, `MCH`, `MCHC`, `Hct`, `eGFR`, `ANC`, `Globulin`, `A/G Ratio`).
- [ ] Build abnormal value flagging and Critical Panic Alert SMS/WhatsApp dispatch service.
- [ ] Implement Delta Check engine calculating 90-day parameter shift variance percentage.
- [ ] Implement Pathologist electronic sign-off service with transparent signature stamp affixation.

### Phase 4: Radiology & Imaging Modalities (USG & Digital X-Ray)
- [ ] Build USG daily worklist and structured organ findings persistence (`RadiologyReport`).
- [ ] Enforce statutory PC-PNDT anti-sex determination confirmation validation for obstetric scans.
- [ ] Build Digital X-Ray worklist logging peak kilovoltage (kVp), mAs, SID, and optical film stock deduction.

### Phase 5: Business Intelligence, Expenses & Cash Till Reconciliation
- [ ] Implement Day-End Net Income formula computation:
  $$\text{Net Income} = \text{Total Income} + \text{Total Collection Charge} - \text{Expenses}$$
- [ ] Implement Multi-instrument payment separation (Cash, UPI, Card, Insurance).
- [ ] Implement Cashier shift drawer opening float and closing physical variance reconciliation.
- [ ] Implement Operational expense voucher management (`ExpenseVoucher`) with receipt photo uploads.
- [ ] Implement Accounts Receivable aging engine (0-7, 8-30, 31-60, >60 days overdue) with SMS reminder trigger.
- [ ] Implement Doctor referral commission accrual and payout settlement engine (`DoctorPayout`).
- [ ] Implement streaming enterprise CSV / Excel data export service for accounting/Tally integrations.
