# Enterprise Backend Architecture & Implementation Blueprint
## Labsmart LIS (Laboratory Information System & Diagnostic CRM)

> **Document Status:** Approved Architecture & Implementation Blueprint  
> **Target:** Enterprise-Grade, Modular Monolith with Clean / Hexagonal Layering  
> **Technology Stack:** Node.js, TypeScript, Express / Fastify, Prisma ORM, Zod, Winston / Pino, Redis (optional cache/queue)  
> **UI Alignment:** 100% 1-to-1 parity with all 37 screens and modals in the Labsmart LIS frontend.

---

## 1. Architectural Principles for Enterprise Scale & Effortless Debugging

In a mission-critical healthcare application where patient diagnoses, financial transactions, and statutory compliance (NABL / ISO 15189 / DISHA / HIPAA) are at stake, the backend must prioritize:

1. **Domain-Driven Modular Monolith (DDD):**  
   Avoid the "layer-first" trap (putting all controllers in one folder, all models in another). Instead, organize code by **Business Domain** (`billing`, `patients`, `lab-tests`, `pathology-results`, `radiology`, `doctors`, `audit`). When a bug occurs in Results Entry or Billing, 100% of related code is in one isolated directory.
2. **Strict Layered Separation of Concerns:**  
   Inside each module, dependencies flow in one direction:  
   `Route / HTTP -> Controller -> Service (Business Logic) -> Repository (Data Access) -> Database Model`  
   - Controllers never touch the database directly.  
   - Services never touch Express `req` or `res` objects, making them 100% unit-testable.
3. **Fail-Fast Runtime Validation (Zod):**  
   Every request body, query parameter, and route parameter is validated at the gateway before reaching the controller. TypeScript types are automatically inferred from Zod schemas, eliminating runtime `undefined` exceptions.
4. **Comprehensive Error Taxonomy & Traceability:**  
   Every HTTP error carries a unique `traceId` (UUID propagated from request header), timestamp, standard error code (e.g. `ERR_OVERDUE_BALANCE_LIMIT`, `ERR_SPECIMEN_REJECTED`), and developer-friendly details logged via structured JSON logs.
5. **Audited & Immutable Healthcare Records:**  
   Medical results and financial adjustments cannot simply be overwritten. All state transitions (Sample Collected -> Results Entered -> Pathologist Authorized) generate immutable event logs with the acting employee's ID, timestamp, and previous state.

---

## 2. Enterprise-Grade Scalable Folder Structure

Below is the directory hierarchy designed for maximum modularity, clean maintenance, and instantaneous debugging:

```
MedicalProject/
├── package.json
├── tsconfig.json
├── vite.config.ts
├── src/                                  # Frontend UI (React + Vite)
└── backend/                              # Backend Core
    ├── package.json                      # Isolated backend dependencies
    ├── tsconfig.json                     # Node/TS target configuration
    ├── prisma/                           # Database Schema, Migrations & Seeds
    │   ├── schema.prisma                 # Declarative multi-table relational schema
    │   ├── migrations/                   # Tracked SQL migration history
    │   └── seed.ts                       # Test investigations, default master data
    │
    ├── src/
    │   ├── server.ts                     # HTTP listener, graceful shutdown handlers
    │   ├── app.ts                        # Express/Fastify application factory & middlewares
    │   │
    │   ├── config/                       # Centralized, validated environment configuration
    │   │   ├── env.config.ts             # Zod-validated process.env (PORT, DB_URL, JWT_SECRET)
    │   │   ├── constants.ts              # Business thresholds (NABL limits, TAT alerts)
    │   │   └── lab.config.ts             # Lab default profile, clinic details, header margins
    │   │
    │   ├── core/                         # Enterprise Infrastructure & Cross-Cutting Concerns
    │   │   ├── errors/                   # Standardized Error Classes
    │   │   │   ├── AppError.ts           # Base domain error
    │   │   │   ├── BadRequestError.ts    # 400
    │   │   │   ├── UnauthorizedError.ts  # 401
    │   │   │   ├── ForbiddenError.ts     # 403
    │   │   │   ├── NotFoundError.ts      # 404
    │   │   │   ├── ConflictError.ts      # 409
    │   │   │   └── ValidationError.ts    # 422 Zod error mapper
    │   │   │
    │   │   ├── logger/                   # Structured JSON Logger
    │   │   │   ├── logger.ts             # Pino / Winston logger instance
    │   │   │   └── requestLogger.ts      # HTTP request correlation ID middleware
    │   │   │
    │   │   ├── middleware/               # Global HTTP Middlewares
    │   │   │   ├── errorHandler.ts       # Global error catcher with traceId response
    │   │   │   ├── validateRequest.ts    # Generic Zod validation pipe
    │   │   │   ├── authenticate.ts       # JWT verification & payload attachment
    │   │   │   ├── authorizeRoles.ts     # RBAC role & granular permission guards
    │   │   │   ├── rateLimiter.ts        # Rate limit protection on public/auth routes
    │   │   │   └── deviceSecurity.ts     # Browser security fingerprint & terminal check
    │   │   │
    │   │   └── database/                 # Database Clients
    │   │       ├── prisma.client.ts      # Singleton PrismaClient instance with query logging
    │   │       └── transaction.ts        # Reusable transactional unit-of-work wrapper
    │   │
    │   ├── shared/                       # Shared Domain Engines & Utilities
    │   │   ├── clinical/                 # Healthcare Formula & Range Engines
    │   │   │   ├── formulaEngine.ts      # Dynamic formula parser (A/G ratio, eGFR, MCV)
    │   │   │   ├── rangeEvaluator.ts     # Age & gender biological reference range checker
    │   │   │   └── deltaChecker.ts       # Comparison against prior patient test history
    │   │   │
    │   │   ├── financial/                # Accounting & Tax Utilities
    │   │   │   ├── currencyInWords.ts    # Indian Rupee words converter (for receipts)
    │   │   │   ├── taxCalculator.ts      # GST / discount calculation rules
    │   │   │   └── commissionEngine.ts   # Doctor referral cut calculation
    │   │   │
    │   │   └── communication/            # External Integration Gateways
    │   │       ├── pdfGenerator.ts       # Headless PDF compiler (Thermal Bill & NABL Report)
    │   │       ├── barcodeService.ts     # Code128 / QR barcode generation
    │   │       └── whatsappService.ts    # WhatsApp Cloud API / Twilio notification mock
    │   │
    │   └── modules/                      # Business Modules (Domain-Driven Architecture)
    │       │
    │       ├── auth/                     # Authentication & User Management
    │       │   ├── auth.routes.ts
    │       │   ├── auth.controller.ts
    │       │   ├── auth.service.ts
    │       │   ├── auth.validation.ts
    │       │   └── auth.types.ts
    │       │
    │       ├── patients/                 # Patient Demographics & Medical History
    │       │   ├── patient.routes.ts
    │       │   ├── patient.controller.ts
    │       │   ├── patient.service.ts
    │       │   ├── patient.repository.ts
    │       │   ├── patient.validation.ts
    │       │   └── patient.types.ts
    │       │
    │       ├── doctors/                  # Referring Doctors & Commission Ledger
    │       │   ├── doctor.routes.ts
    │       │   ├── doctor.controller.ts
    │       │   ├── doctor.service.ts
    │       │   ├── doctor.repository.ts
    │       │   ├── doctor.validation.ts
    │       │   └── doctor.types.ts
    │       │
    │       ├── billing/                  # Bills, Invoicing, Discounts & Till
    │       │   ├── bill.routes.ts
    │       │   ├── bill.controller.ts
    │       │   ├── bill.service.ts
    │       │   ├── bill.repository.ts
    │       │   ├── bill.validation.ts
    │       │   └── bill.types.ts
    │       │
    │       ├── cases/                    # Case Worklist, Modalities & Tracking
    │       │   ├── case.routes.ts
    │       │   ├── case.controller.ts
    │       │   ├── case.service.ts
    │       │   ├── case.repository.ts
    │       │   ├── case.validation.ts
    │       │   └── case.types.ts
    │       │
    │       ├── pathology/                # Lab Results Entry, Authorization & Reports
    │       │   ├── pathology.routes.ts
    │       │   ├── pathology.controller.ts
    │       │   ├── pathology.service.ts
    │       │   ├── pathology.repository.ts
    │       │   ├── pathology.validation.ts
    │       │   └── pathology.types.ts
    │       │
    │       ├── radiology/                # Ultrasound (USG), X-Ray & CT Studies
    │       │   ├── radiology.routes.ts
    │       │   ├── radiology.controller.ts
    │       │   ├── radiology.service.ts
    │       │   ├── radiology.repository.ts
    │       │   ├── radiology.validation.ts
    │       │   └── radiology.types.ts
    │       │
    │       ├── business/                 # Daily Till, Expenses, Referral Payouts & Dues
    │       │   ├── business.routes.ts
    │       │   ├── business.controller.ts
    │       │   ├── business.service.ts
    │       │   ├── business.repository.ts
    │       │   ├── business.validation.ts
    │       │   └── business.types.ts
    │       │
    │       ├── masters/                  # Tests, Panels, Packages, Categories & Agents
    │       │   ├── master.routes.ts
    │       │   ├── master.controller.ts
    │       │   ├── master.service.ts
    │       │   ├── master.repository.ts
    │       │   ├── master.validation.ts
    │       │   └── master.types.ts
    │       │
    │       ├── security/                 # Device Terminals & Browser Whitelist
    │       │   ├── security.routes.ts
    │       │   ├── security.controller.ts
    │       │   ├── security.service.ts
    │       │   ├── security.validation.ts
    │       │   └── security.types.ts
    │       │
    │       └── audit/                    # Immutable System Event Logs
    │           ├── audit.routes.ts
    │           ├── audit.service.ts
    │           └── audit.repository.ts
```

---

## 3. Relational Data Models & Schema Design (Prisma)

The clinical and financial data models map directly to the frontend's needs:

```prisma
// Sample schema overview:

model Patient {
  id            String      @id @default(uuid())
  uhid          String      @unique // UHID-2026-0001
  prefix        String      // Mr, Mrs, Baby, etc.
  fullName      String
  age           Int
  ageUnit       String      @default("Years")
  gender        String      // Male, Female, Other
  mobile        String      @index
  email         String?
  address       String?
  bloodGroup    String?
  cases         Case[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
  isArchived    Boolean     @default(false)
}

model Doctor {
  id            String      @id @default(uuid())
  name          String
  specialty     String
  mobile        String
  email         String?
  commissionPct Float       @default(0.0)
  degree        String?
  isActive      Boolean     @default(true)
  hasPortalAccess Boolean   @default(false)
  portalPassword String?
  cases         Case[]
  payouts       DoctorPayout[]
  createdAt     DateTime    @default(now())
}

model Case {
  id            String      @id @default(uuid())
  billNumber    String      @unique // BL-2026-0001
  uhid          String
  patientId     String
  patient       Patient     @relation(fields: [patientId], references: [id])
  doctorId      String
  doctor        Doctor      @relation(fields: [doctorId], references: [id])
  modality      String      // LAB, USG, X-RAY, CT SCAN
  reportStatus  String      // Registered, Sample Collected, In Process, Results Entered, Signed Off
  paymentStatus String      // Paid, Partial, Due
  sampleStatus  String      @default("Pending") // Pending, Collected, Rejected
  
  // Financials
  grossAmount   Float
  discountType  String      @default("fixed") // percentage | fixed
  discountValue Float       @default(0.0)
  discountAmount Float      @default(0.0)
  discountReason String?
  netPayable    Float
  paidAmount    Float
  balanceDue    Float
  paymentMode   String      // Cash, UPI, Card, Cheque
  
  items         CaseItem[]
  payments      PaymentTransaction[]
  clinicalResults ClinicalResult?
  radiologyReport RadiologyReport?
  
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model CaseItem {
  id            String      @id @default(uuid())
  caseId        String
  case          Case        @relation(fields: [caseId], references: [id], onDelete: Cascade)
  testId        String
  testCode      String
  testName      String
  department    String
  specimen      String
  rate          Float
  discount      Float       @default(0.0)
  netAmount     Float
  deliveryTime  DateTime?
}

model PaymentTransaction {
  id            String      @id @default(uuid())
  caseId        String
  case          Case        @relation(fields: [caseId], references: [id])
  receiptNumber String      @unique // REC-2026-0001
  amount        Float
  mode          String      // Cash, UPI, Card, Cheque
  receivedBy    String
  note          String?
  isRefunded    Boolean     @default(false)
  refundReason  String?
  createdAt     DateTime    @default(now())
}

model ClinicalResult {
  id            String      @id @default(uuid())
  caseId        String      @unique
  case          Case        @relation(fields: [caseId], references: [id], onDelete: Cascade)
  parameters    Json        // Array of parameter values, flags (Normal, High, Low, Critical)
  isAuthorized  Boolean     @default(false)
  authorizedBy  String?
  authorizedAt  DateTime?
  pathologistNotes String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model RadiologyReport {
  id            String      @id @default(uuid())
  caseId        String      @unique
  case          Case        @relation(fields: [caseId], references: [id], onDelete: Cascade)
  modality      String      // USG, X-RAY, CT SCAN
  findings      Json        // Organ findings (Liver, Gallbladder, Spleen, etc.)
  impression    String
  clinicalHistory String?
  radiologistId String?
  isAuthorized  Boolean     @default(false)
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}
```

---

## 4. UI-to-API Contract Mapping (Every Single Screen & Modal)

| UI Screen / Modal | HTTP Method | API Endpoint | Description |
| :--- | :--- | :--- | :--- |
| **Dashboard** | `GET` | `/api/v1/dashboard/metrics` | Returns live KPI tiles, urgent TAT bars, modality revenue breakdown |
| **New Bill** | `POST` | `/api/v1/cases` | Registers patient (if new), creates invoice, assigns tests, calculates discount, records initial payment |
| **New Bill** (Doctor Modal) | `POST` | `/api/v1/doctors` | Creates new doctor with commission percentage |
| **Cases Ledger** | `GET` | `/api/v1/cases` | Paginated case ledger with date, modality, payment, and report status filters |
| **Cases Ledger** (Collect Due) | `POST` | `/api/v1/cases/:id/payments` | Records partial or full settlement of due balance |
| **Cases Ledger** (Cancel Case) | `POST` | `/api/v1/cases/:id/cancel` | Voids bill, updates status to Cancelled, records refund transaction |
| **Printable Bill** | `GET` | `/api/v1/cases/:id/bill` | Returns printable invoice data with thermal/A4 formats & numbers-to-words |
| **Enter Results** | `GET` | `/api/v1/pathology/cases/:caseId/worklist` | Fetches test parameters, prior history (delta check), and biological ranges |
| **Enter Results** (Save Draft) | `POST` | `/api/v1/pathology/cases/:caseId/draft` | Persists unapproved parameter values |
| **Enter Results** (Authorize) | `POST` | `/api/v1/pathology/cases/:caseId/authorize`| Pathologist digital sign-off, locks results from tampering |
| **Report Viewer** | `GET` | `/api/v1/pathology/cases/:caseId/report` | Returns formatted medical report JSON / PDF stream with digital signature |
| **Report Viewer** (WhatsApp) | `POST` | `/api/v1/pathology/cases/:caseId/whatsapp` | Triggers patient WhatsApp message with PDF download link |
| **Today's Reports** | `GET` | `/api/v1/pathology/today` | Real-time worklist of today's laboratory investigations |
| **Today's Reports** (Status) | `PATCH` | `/api/v1/pathology/samples/:id/status` | Updates bench status (Collected, In Process, Rejected) |
| **Interpretations** | `GET` / `POST`| `/api/v1/masters/interpretations` | CRUD for clinical diagnostic interpretation guidelines |
| **USG Worklist** | `GET` | `/api/v1/radiology/worklist?modality=USG` | Sonography appointment and bench queue |
| **USG Findings Modal** | `POST` | `/api/v1/radiology/reports/:caseId` | Saves organ-by-organ sonography findings & impressions |
| **X-Ray Worklist** | `GET` | `/api/v1/radiology/worklist?modality=X-RAY` | Radiography queue |
| **X-Ray Report Modal** | `POST` | `/api/v1/radiology/reports/:caseId` | Saves radiologist findings and impression |
| **Radiology Templates** | `GET` / `POST`| `/api/v1/radiology/templates` | Normal and pathology report templates |
| **Radiology Signatures** | `GET` / `POST`| `/api/v1/radiology/signatures` | Radiologist digital stamp and signature upload |
| **Daily Business** | `GET` | `/api/v1/business/daily` | Cash drawer reconciliation, Till sheet summary |
| **Due Reports** | `GET` | `/api/v1/business/dues` | Outstanding patient dues list with aging metrics |
| **Due Reports** (Waive) | `POST` | `/api/v1/business/dues/:caseId/waive` | Waives outstanding due with admin authorization note |
| **Expenses** | `GET` / `POST`| `/api/v1/business/expenses` | CRUD for clinic operating expenses and vouchers |
| **Referral Business** | `GET` | `/api/v1/business/referrals` | Doctor-wise sales and pending commission ledger |
| **Referral Business** (Payout)| `POST` | `/api/v1/business/referrals/payout` | Records commission payout voucher |
| **Activities Audit** | `GET` | `/api/v1/audit/logs` | Immutable audit trail of system events |
| **Data Export** | `POST` | `/api/v1/business/export` | Generates CSV / Excel files for demographics, bills, or tests |
| **Browser Security** | `GET` / `POST`| `/api/v1/security/devices` | Terminal whitelist, device approval, security toggle |
| **Employee Logins** | `GET` / `POST`| `/api/v1/auth/employees` | Staff user accounts with 5 granular permission toggles |
| **Doctor Access** | `GET` / `POST`| `/api/v1/doctors/access` | Doctor portal login activation, invitation, and revocation |
| **Test Master** | `GET` / `POST`| `/api/v1/masters/tests` | Investigation catalog with rates, TAT, parameters & ranges |
| **Packages Master** | `GET` / `POST`| `/api/v1/masters/packages` | Health package bundles and discount rules |
| **Settings** | `GET` / `PUT` | `/api/v1/settings` | Lab profile, letterhead margins, digital clinic stamp |

---

## 5. Phased Implementation Roadmap

---

### Phase 1: Foundation, Infrastructure & Core Setup
- Initialize `backend/` package with TypeScript, ESLint, and modern configuration.
- Configure Prisma ORM with SQLite (for instant local zero-dependency execution) and PostgreSQL compatibility.
- Implement Centralized Error Taxonomy (`AppError`, `errorHandler`), Request Logger (Pino / Winston) with `traceId`.
- Setup Zod validation pipe (`validateRequest`).
- Seed initial database with diagnostic master tests (Complete Blood Count, Lipid Profile, Liver Function Test, Fasting Blood Sugar, USG Abdomen, Chest X-Ray).

### Phase 2: Authentication, Security & Master Catalogs
- Implement JWT Authentication (Login, Refresh, Logout) and User models.
- Implement Granular RBAC Permissions Middleware (Billing, Results Entry, Doctor Commission, Master Edit).
- Implement Device / Browser Security Fingerprinting API (Register terminal, whitelist/block).
- Implement Master APIs:
  - Test Master & Parameter Biological Ranges (Age Min/Max, Gender).
  - Health Packages & Test Panels.
  - Doctor Master & Commission Settings.
  - Phlebotomist / Collection Agent Master.

### Phase 3: Patient Registration & High-Throughput Billing Engine
- Auto-generating sequences: UHID generator (`UHID-YYYY-XXXX`) and Bill generator (`BL-YYYY-XXXX`).
- Patient deduplication and registration service.
- Billing Engine:
  - Line-item calculations (retail vs. B2B rates).
  - Percentage & Fixed Discount validations.
  - Payment tenders (Cash, UPI, Card, Cheque, Credit).
  - Due tracking and partial settlement ledger.
- Printable Bill API: A4 and 3-inch Thermal receipt formats with amount-in-words converter.

### Phase 4: Clinical Laboratory & Pathology Engine
- Today's Worklist and Sample Accessioning (Pending -> Collected -> Received -> In Process -> Rejected).
- Clinical Results Entry:
  - Automatic Biological Reference Range Evaluation (Low, Normal, High, Critical Panic flags).
  - Formula Engine (e.g. Globulin = Total Protein - Albumin; A/G Ratio = Albumin / Globulin).
  - Delta Check Engine (comparing current values with patient's historical visit records).
- Pathologist Authorization & Sign-Off (locking result fields, applying digital signature).
- NABL-Compliant Medical Report Generation & WhatsApp notification dispatch mock.

### Phase 5: Radiology Engine & Ultrasound / X-Ray Modules
- Ultrasound (USG) Worklist & Findings Service (organ-by-organ structured data: Liver, Gallbladder, Spleen, Kidneys, Pelvis, Impression).
- Digital X-Ray Reporting Service (findings, impression, DICOM viewer integration readiness).
- Radiologist Digital Signatures and Reporting Templates repository.

### Phase 6: Financial Accounting, Audit Logging & End-to-End Integration
- Daily Business & Till Sheet Reconciliation (Opening cash, Cash in/out, Closing balance).
- Due Recovery & Waive Approval Engine.
- Referral Business & Doctor Commission Payouts.
- Clinic Operating Expenses (Voucher generation, categorization).
- Immutable Activities Audit Trail (logging every result change, discount override, and cancellation).
- Connect Frontend React Services / Axios / Fetch client to live backend endpoints.
