# Enterprise UI/UX Architecture & Phased Implementation Plan
## Labsmart LIS (Hospital & Laboratory Information Management System)

> **Document Status:** Approved Architecture Plan  
> **Target:** Enterprise-Grade, 100% Scalable, Modular Frontend  
> **Design Methodology:** Atomic Design Pattern (Atoms, Molecules, Organisms, Templates, Pages)  
> **Styling Strategy:** Decoupled Global CSS Tokens & Component-Scoped CSS Files (Zero hardcoded inline styles)

---

## 1. Architectural Principles for Enterprise Scale

To ensure this medical platform is maintainable, scalable to hundreds of screens, and easily themeable, we adhere to 5 core engineering rules:

1. **Single Source of Truth for Tokens:** Every color, font-size, line-height, spacing unit, border-radius, and box-shadow is declared **once** in dedicated global CSS token files. Components only reference CSS variables (e.g., `var(--color-primary)`, `var(--space-4)`).
2. **Strict CSS Separation of Concerns:** No component will have bloated inline styling or CSS written in the same JSX/TSX/HTML file. Every atom, organism, and page has its corresponding `.css` module or stylesheet in a structured `styles/` hierarchy.
3. **Atomic Reusability:** Every repeating UI element (buttons, cards, badge pills, input fields, modals, drawers, select comboboxes, data tables) is extracted as a standalone reusable component with type-safe props.
4. **Resilient Data Typing:** Full TypeScript interfaces for every healthcare entity (`Patient`, `Bill`, `Investigation`, `Parameter`, `Doctor`, `PaymentTill`, `Expense`, `Report`).
5. **Zero UI Omission:** All **24 screens, modals, slide-over drawers, and administration panels** documented in `labsmart_ui_design_spec.md` will be systematically built across 5 phases.

---

## 2. Global CSS Architecture & Design Token System

All styles are organized into a dedicated `src/styles/` directory so colors, fonts, and themes can be updated across the entire platform in a single line.

```
src/styles/
├── tokens/
│   ├── colors.css          # Semantic brand, surface, status, and border CSS variables
│   ├── typography.css      # Font family, type scale (11px to 24px), font weights, tracking
│   ├── spacing.css         # 4px baseline scale, margins, paddings, gutters
│   └── elevation.css       # Box shadows, z-index layers (sticky, modals, drawers, tooltips)
├── base/
│   ├── reset.css           # Modern CSS box-sizing and baseline reset
│   └── global.css          # Root variables import, body canvas background, default text
├── layout/
│   ├── shell.css           # Fixed top navbar (64px), left sidebar (256px), main canvas grid
│   └── grid.css            # Flex utilities, responsive 2-column split (62%/38%)
└── components/
    ├── buttons.css         # Primary (#1565c0), Secondary, Danger, Pill and Icon button variants
    ├── inputs.css          # Text inputs, number steppers, selects, textareas, focus rings
    ├── cards.css           # Card surfaces, card headers, metric KPI card wrappers
    ├── badges.css          # Status pills (Signed off green, pending amber, due red)
    ├── tables.css          # Data table layout, sticky headers, zebra stripes, hover states
    ├── modals.css          # Center dialog overlays, backdrop blur, header/footer borders
    └── drawers.css         # Slide-over flyouts (520px patient drawer, formula builder)
```

### 2.1 Tokens Implementation Preview

#### `src/styles/tokens/colors.css`
```css
:root {
  /* Brand & Action */
  --color-primary: #1565c0;
  --color-primary-hover: #0d47a1;
  --color-primary-active: #0a3875;
  --color-primary-light: #eff6ff;
  --color-primary-link: #2563eb;
  --color-primary-focus: #3b82f6;

  /* Surfaces & Backgrounds */
  --surface-canvas: #f8fafc;
  --surface-sidebar: #f9fafb;
  --surface-card: #ffffff;
  --surface-table-head: #f1f5f9;
  --surface-table-hover: #f8fafc;

  /* Status & Indicators */
  --color-success: #15803d;
  --color-success-bg: #dcfce7;
  --color-success-border: #86efac;

  --color-warning: #b45309;
  --color-warning-bg: #fef3c7;
  --color-warning-border: #fcd34d;

  --color-danger: #b91c1c;
  --color-danger-bg: #fee2e2;
  --color-danger-border: #fca5a5;

  /* Borders & Dividers */
  --border-subtle: #e2e8f0;
  --border-input: #d1d5db;
  --border-focus: #2563eb;

  /* Text & Typography */
  --text-headings: #0f172a;
  --text-section: #334155;
  --text-body: #1e293b;
  --text-secondary: #64748b;
  --text-placeholder: #94a3b8;
}
```

#### `src/styles/tokens/typography.css`
```css
:root {
  --font-family-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;

  /* Font Sizes */
  --font-size-xs: 11px;
  --font-size-sm: 13px;
  --font-size-base: 14px;
  --font-size-md: 15px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;

  /* Line Heights */
  --line-height-tight: 16px;
  --line-height-base: 20px;
  --line-height-relaxed: 24px;
  --line-height-heading: 28px;

  /* Font Weights */
  --font-weight-regular: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  --font-weight-black: 900;
}
```

---

## 3. Enterprise Project Directory Hierarchy

```
MedicalProject/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   └── barcode-sample.png
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/
│   │   └── AppRouter.tsx           # Type-safe client-side routing for all 24 views
│   ├── styles/                     # Complete decoupled CSS system (described above)
│   ├── types/                      # Domain entity interfaces
│   │   ├── patient.types.ts
│   │   ├── case.types.ts
│   │   ├── test.types.ts
│   │   ├── report.types.ts
│   │   ├── doctor.types.ts
│   │   └── financial.types.ts
│   ├── context/ or store/          # Global state management
│   │   ├── CaseRegistrationStore.ts
│   │   ├── AuthUserStore.ts
│   │   └── LabReportEditorStore.ts
│   ├── components/
│   │   ├── atoms/                  # Smallest indestructible UI primitives
│   │   │   ├── Button/             # Primary, Secondary, Outline, Danger, Pill variants
│   │   │   ├── Input/              # Styled text, number, date inputs with error states
│   │   │   ├── Select/             # Custom & native selects with caret icons
│   │   │   ├── Badge/              # Status badge pills with variant colors
│   │   │   ├── Checkbox/           # Accessible custom check controls
│   │   │   ├── RadioGroup/         # Segmented radio button pills (Gender, Modality)
│   │   │   └── Tooltip/
│   │   ├── molecules/              # Assemblies of atoms
│   │   │   ├── FormField/          # Label + Input + Validation helper text
│   │   │   ├── SearchInput/        # Input with prefix search icon and clear button
│   │   │   ├── KPICard/            # Metric card with title, large value, and delta pill
│   │   │   ├── TabGroup/           # Horizontal navigation pills/tabs
│   │   │   ├── Pagination/         # Page selector with rows-per-page dropdown
│   │   │   └── Combobox/           # Autocomplete Select2-like investigation search
│   │   ├── organisms/              # Complex domain components
│   │   │   ├── TopNavbar/          # Fixed 64px header, logo, search trigger, profile
│   │   │   ├── LeftSidebar/        # Fixed 256px menu with 5 grouped navigation sections
│   │   │   ├── OmnisearchModal/    # Ctrl+K modal dialog with real-time indexing
│   │   │   ├── InvestigationCart/  # Test table in New Bill with trash actions & discounts
│   │   │   ├── PaymentTillCard/    # Gross, discount toggle, net, paid, and balance due
│   │   │   ├── ParameterGrid/      # Lab results table with formula calculation triggers
│   │   │   ├── PatientDrawer/      # 520px right slide-over patient history timeline
│   │   │   └── CashierBalancing/   # Drawer for opening cash, cash in/out, and discrepancy
│   │   └── layouts/
│   │       ├── MasterAppShell/     # Navbar + Sidebar + Canvas wrapper
│   │       └── PrintableReport/    # A4/A5 print CSS container
│   ├── pages/                      # All 24 Screen components
│   │   ├── dashboard/DashboardPage.tsx
│   │   ├── cases/
│   │   │   ├── NewBillPage.tsx
│   │   │   ├── PrintableBillPage.tsx
│   │   │   ├── CasesLedgerPage.tsx
│   │   │   ├── OutsourceCasesPage.tsx
│   │   │   └── CTScanCasesPage.tsx
│   │   ├── lab/
│   │   │   ├── EnterResultsPage.tsx
│   │   │   ├── ReportViewerPage.tsx
│   │   │   ├── TodayReportsPage.tsx
│   │   │   ├── SearchReportsPage.tsx
│   │   │   ├── USGReportingPage.tsx
│   │   │   └── XRayReportingPage.tsx
│   │   ├── business/
│   │   │   ├── DailyBusinessPage.tsx
│   │   │   ├── ExpensesPage.tsx
│   │   │   ├── ReferralBusinessPage.tsx
│   │   │   └── DuesRecoveryPage.tsx
│   │   ├── manage/
│   │   │   ├── PatientsPage.tsx
│   │   │   ├── DoctorsPage.tsx
│   │   │   ├── AgentsPage.tsx
│   │   │   ├── TestMasterPage.tsx
│   │   │   ├── PackagesPage.tsx
│   │   │   └── InterpretationsPage.tsx
│   │   └── settings/SettingsPage.tsx
│   └── utils/
│       ├── calculations.ts         # Medical formulas (MCV, MCH, MCHC, PCV)
│       ├── currencyFormatter.ts    # Indian Rupee (₹) formatting & words conversion
│       └── dateUtils.ts            # Formatting timestamps (DD-MMM-YYYY hh:mm A)
```

---

## 4. Phase-by-Phase Implementation Roadmap

---

### Phase 1: Core Foundation, Global Tokens & Master Application Shell
> **Goal:** Establish the complete design system, global CSS variables, atomic reusable components, and responsive layout shell with full navigation routing.

- **Step 1.1: Project Setup & Tooling**
  - Initialize React 18+ with TypeScript and Vite.
  - Setup ESLint, Prettier, and path aliases (`@/components`, `@/styles`, `@/types`).
- **Step 1.2: Global CSS Design Tokens**
  - Implement `colors.css`, `typography.css`, `spacing.css`, and `elevation.css`.
  - Implement CSS reset and base canvas styles in `global.css`.
- **Step 1.3: Reusable Atomic Component Library**
  - Build `Button` (Primary `#1565c0`, Secondary, Danger, Setup Green `#dcfce7`).
  - Build `Input`, `NumberInput`, `Select`, `Textarea` with focus states.
  - Build `Badge` (Pill variants: Signed off green, Pending amber, Due red, Neutral gray).
  - Build `Card` and `KPICard` with consistent border, elevation, and paddings.
  - Build `Modal` (Centered with backdrop blur) and `Drawer` (Slide-over right panel).
- **Step 1.4: Master Application Shell**
  - Build `TopNavbar` (Fixed 64px height, branding, global search trigger, "+ New Bill" CTA, "Setup" button, User avatar dropdown).
  - Build `LeftSidebar` (Fixed 256px width, 5 collapsible navigation sections, active blue indicators `border-l-4 border-[#2563eb]`).
  - Implement client-side routing structure for all 24 screens.
  - **Deliverable Milestone:** Working application shell with interactive navigation, tokenized CSS, and atomic primitives preview.

---

### Phase 2: Patient Registration, Billing Engine & Financial Ledger
> **Goal:** Deliver the mission-critical transactional flow where patients are registered, tests are added, invoices are calculated, receipts are printed, and cases are tracked.

- **Step 2.1: Screen 1 — New Bill / Case Registration (`/cases/new`)**
  - Responsive 2-column split (62% left / 38% right sticky).
  - Patient demographic card with title prefix, age/years/months, gender radio pills, mobile prefix `+91`.
  - Referring doctor and collection center Select2 combobox with quick "+ Add Doctor" trigger.
  - Modality tabs (`LAB`, `USG`, `X-RAY`, `CT SCAN`).
  - Autocomplete test search picker with department and pricing preview.
  - Selected test items cart table with rate, discount, and remove action.
  - Right summary till: Gross amount, discount toggle (`₹` or `%`), net payable, paid input, payment mode segmented pills (`Cash`, `UPI`, `Card`, `Cheque`), and balance due calculator.
- **Step 2.2: Screen 2 — Printable Bill & Cash Receipt (`/cases/:id/bill`)**
  - Exact A5/A4 printable layout with print stylesheets (`@media print`).
  - Header branding, clinic registration, 2-column patient metadata.
  - Itemized investigation table, financial summary, words conversion ("Rupees Four Hundred Only").
  - Verification QR code, Code128 barcode, cashier signature line.
- **Step 2.3: Screen 5 — Cases & Bills Management Ledger (`/cases`)**
  - Date range filters, modality filters, payment status filters, text search.
  - High-density data table with patient details, ref doctor, total/paid/due, status badges.
  - Contextual action dropdown (`View Report`, `Edit Bill`, `Enter Results`, `Collect Due`, `WhatsApp`).
- **Step 2.4: Screen 8 — Global Omnisearch Modal (`Ctrl + K`)**
  - Fast overlay with category filters (`All`, `Bills`, `Patients`, `Doctors`, `Tests`) and arrow key navigation.
  - **Deliverable Milestone:** End-to-end billing workflow functional with print receipts and case ledger.

---

### Phase 3: Clinical Laboratory Operations & Diagnostic Reporting
> **Goal:** Build the scientific diagnostic engine where parameters are entered, mathematical formulas auto-calculate, reports are formatted, verified, and issued.

- **Step 3.1: Screen 3 — Enter Lab Results (`/lab_reports/:id/edit`)**
  - Sticky patient summary bar.
  - Results formatting options toolbar (show normal ranges, auto-flag abnormals, letterhead toggle).
  - Investigation parameter grid with inputs, units, reference intervals.
  - **Auto-calculation engine:** Live formula evaluation for hematology indices (e.g. `PCV = Hb * 3`, `MCV = (PCV/RBC)*10`, `MCH = (Hb/RBC)*10`, `MCHC = (Hb/PCV)*100`).
  - Out-of-range value validation: Automatic `#b91c1c` red border and "HIGH"/"LOW" alert pill.
  - Clinical interpretation rich-text box.
- **Step 3.2: Screen 4 — Verified Report Viewer (`/lab_reports/:id/v2`)**
  - Clean medical diagnostic report layout with NABL accreditation badges.
  - Borderless patient demographic table, observed values with asterisks for abnormals.
  - Dual signature blocks (Medical Technologist & Consulting Pathologist) with digital signature stamps.
  - Authentication QR code linking to digital report verification URL.
- **Step 3.3: Screen 12 — Today's Reports Worklist (`/lab_reports/today`)**
  - Live status tabs (`Pending Collection`, `In Process`, `Pending Sign-off`, `Signed Off`).
  - Auto-refresh countdown (30s), bulk barcode label printing, bulk WhatsApp report distribution.
- **Step 3.4: Screen 13 — Historical Search Reports Archive (`/lab_reports/search`)**
  - Multi-parameter historical search card, archived reports table, bulk export.
- **Step 3.5: Screen 14 & 15 — Specialized USG & Digital X-Ray Modules**
  - Ultrasound organ-by-organ template selector with normal findings macros.
  - Digital X-Ray view selector (Chest PA, Spine) and radiologist impression composer.
  - **Deliverable Milestone:** Complete pathology and radiology diagnostic reporting pipeline.

---

### Phase 4: Financial Management, Cashier Till & Operations Hub
> **Goal:** Provide administrative transparency over clinic cash inflow, daily expenses, outsourced cases, and doctor incentives.

- **Step 4.1: Screen 6 — Daily Business & Cashier Reconciliation Till (`/business_reports/daily_business`)**
  - 4 top KPI cards (Gross Revenue, Discounts Given, Net Collections, Dues Receivable).
  - Mode of payment breakdown card (Cash, UPI, Card, Bank transfer).
  - Cashier balancing drawer: Opening cash + cash in - cash expenses = expected closing cash in till.
- **Step 4.2: Screen 7 — Expenses & Outflow Tracker (`/expenses`)**
  - Modal to log new expense voucher (category, paid to, amount, payment mode, receipt attachment).
  - Categorized outflow expense ledger.
- **Step 4.3: Screen 9 — Main Operations Dashboard (`/dashboard`)**
  - Daily summary KPIs, clinical workflow funnel progress visualization, recent registrations feed.
- **Step 4.4: Screen 10 & 11 — Outsource Cases & CT Scan Workflows**
  - Outsource partner laboratory tracking (SRL, Thyrocare), sample dispatch manifests, B2B cost reconciliation.
  - CT scan contrast study pre-checks and DICOM link attachments.
- **Step 4.5: Screen 22 & 23 — Referral Business & Dues Recovery Desk**
  - Doctor referral business volume, commission percentage calculation, payout voucher logger.
  - Aging dues recovery table (0-7 days, 8-30 days, >30 days) and automated WhatsApp payment reminder link generator.
  - **Deliverable Milestone:** Full financial and operations control suite operating in real time.

---

### Phase 5: Master Data Management, Configuration & System Administration
> **Goal:** Empower lab administrators to configure tests, normal ranges, health packages, doctor tariffs, staff permissions, and branding letterheads.

- **Step 5.1: Screen 16 — Patients Directory & Medical History Drawer (`/patients`)**
  - Patient search table and 520px slide-over patient profile drawer with visit history and longitudinal parameter trend charts.
- **Step 5.2: Screen 17 & 18 — Doctors & Collection Centers Masters**
  - Doctor directory, Add Doctor modal, Commission tariff matrix (flat percentage or department-wise).
  - Franchise collection center master, B2B pricing tiers, credit limit rules.
- **Step 5.3: Screen 19 — Test Master & Parameter Formula Builder (`/tests`)**
  - Test master catalog table and drawer to configure test code, department, specimen, turnaround time.
  - Sub-parameter builder with age-specific and gender-specific biological reference intervals.
  - Mathematical formula expression builder.
- **Step 5.4: Screen 20 & 21 — Packages & Clinical Interpretations**
  - Preventive health checkup package builder with savings percentage calculator.
  - Medical opinion and pathology interpretation snippet library.
- **Step 5.5: Screen 24 — Comprehensive Lab Setup Hub (`/settings`)**
  - 7 configuration submodules:
    1. Branch Profile & Logo Upload.
    2. Letterhead & Print Margin Designer (Header/Footer sliders).
    3. SMS & WhatsApp Gateway Settings (DLT templates & automated triggers).
    4. Sample Tracking & Barcode Configuration (Code128 format & thermal printer settings).
    5. Staff Accounts, Roles & Permissions (Admin, Receptionist, Lab Tech, Pathologist).
    6. Browser Security & IP Whitelist (Broadband IP restriction & auto-logout).
    7. Subscription & Pricing Plans.
  - **Deliverable Milestone:** Fully completed, enterprise-grade, 24-screen Labsmart LIS replica ready for production deployment.

---

## 5. Verification & Quality Assurance Matrix

| Quality Gate | Requirement / Standard | Verification Method |
| :--- | :--- | :--- |
| **Color Fidelity** | All primary actions match `#1565c0`, links `#2563eb`, surfaces `#f8fafc` | Computed CSS variable inspection |
| **CSS Modularity** | Zero inline style tags; tokens referenced via `var(--token)` | Linter rule prohibiting inline `style={...}` |
| **Typography Scale** | Standardized on `Inter` from 11px micro-copy to 20px page headers | Typography regression audit |
| **Keyboard Accessibility** | `Ctrl+K` (Omnisearch), `Alt+N` (New Bill), `F2` (Save & Enter Results), `Tab` through grid | Automated & manual keyboard navigation tests |
| **Formula Accuracy** | MCV, MCH, MCHC, and PCV accurately calculate from entered Hb & RBC | Unit test suite covering hematology calculations |
| **Print Output** | A5 & A4 printouts fit page boundaries with crisp barcodes and signatures | Headless Chromium print-to-PDF validation |
| **Screen Completeness** | All 24 screens, modals, and drawers from specification exist and function | 100% route and component inventory check |
