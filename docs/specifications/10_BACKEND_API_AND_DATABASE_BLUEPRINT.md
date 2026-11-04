# Labsmart LIS — Backend API Architecture, Database Schema & Business Logic Blueprint

**Specification ID:** `SPEC-10-BACKEND-BLUEPRINT`  
**Module Name:** Master Backend Architecture, Relational Database Schema, RESTful API Contracts, State Machines & Business Logic Engines  
**Target Audience:** Backend Software Engineers, System Architects, Database Administrators  
**Document Purpose:** Definitive technical reference for implementing the complete backend server, database schema, transactional integrity, calculation engines, and security middleware for Labsmart LIS.

---

## 1. Architectural Overview & System Stack

The backend architecture is structured around clean modular design, high transaction throughput, and strict regulatory compliance (DISHA, HIPAA-ready auditability, NABL ISO 15189, AERB radiation norms, PC-PNDT):
- **Core Runtime**: Node.js 20+ with TypeScript / Express.js or NestJS / Fastify.
- **ORM & Database Layer**: Prisma ORM with PostgreSQL 15+ (Production) / SQLite (Local development).
- **Authentication & Authorization**: Stateless JWT (Access + Refresh tokens) + Physical Browser Fingerprint Guard.
- **Document Rendering Engine**: Headless Chromium / Puppeteer for pixel-accurate A4/A5/Thermal PDF generation.
- **Messaging & Notifications**: BullMQ / Redis asynchronous job queue for transactional SMS, WhatsApp Cloud API, and automated email dispatches.
- **File Storage**: S3-compatible object storage (MinIO / AWS S3) for digital signatures, clinic logos, and generated report PDFs.

---

## 2. Complete Relational Database Schema (Prisma Schema Reference)

```prisma
datasource db {
  provider = "postgresql" // or "sqlite" for local dev
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. AUTHENTICATION & RBAC ROLES
// ==========================================

enum UserRole {
  SUPER_ADMIN
  PATHOLOGIST
  RADIOLOGIST
  LAB_TECHNICIAN
  RECEPTIONIST
  PHLEBOTOMIST
  ACCOUNTANT
}

model User {
  id               String       @id @default(uuid())
  username         String       @unique
  fullName         String
  email            String       @unique
  mobile           String       @unique
  passwordHash     String
  role             UserRole     @default(RECEPTIONIST)
  isOwner          Boolean      @default(false)
  isActive         Boolean      @default(true)
  isBlocked        Boolean      @default(false)
  
  // Granular Permissions Matrix
  canEditRates     Boolean      @default(false)
  canDeleteBills   Boolean      @default(false)
  canSignOffReports Boolean     @default(false)
  canViewLedger    Boolean      @default(false)
  canManageExpenses Boolean     @default(false)
  canIssueRefunds  Boolean      @default(false)

  allowedBranches  String       @default("[\"main\"]") // JSON array of branch IDs
  lastLoginAt      DateTime?
  createdAt        DateTime     @default(now())
  updatedAt        DateTime     @updatedAt

  auditLogs        AuditLog[]
}

// ==========================================
// 2. PATIENT MASTER (MPI / UHID)
// ==========================================

model Patient {
  id                    String      @id @default(uuid())
  uhid                  String      @unique // e.g. UHID-2026-0001 or 35375569
  title                 String      @default("Mr.")
  firstName             String
  lastName              String?
  fullName              String
  gender                String      // MALE, FEMALE, OTHER
  ageYears              Int         @default(0)
  ageMonths             Int         @default(0)
  ageDays               Int         @default(0)
  mobile                String      @index
  email                 String?
  address               String?
  aadhaar               String?
  bloodGroup            String?
  medicalHistory        String?
  onlineReportRequested Boolean     @default(true)
  totalVisits           Int         @default(1)
  lastVisitDate         DateTime    @default(now())
  isArchived            Boolean     @default(false)

  cases                 Case[]
  createdAt             DateTime    @default(now())
  updatedAt             DateTime    @updatedAt
}

// ==========================================
// 3. REFERRALS & LOGISTICS
// ==========================================

model Doctor {
  id                   String         @id @default(uuid())
  name                 String
  degree               String?        // MBBS, MD, MS
  specialty            String         // Internal Medicine, Cardiology
  mobile               String
  email                String?
  address              String?
  defaultCommissionPct Float          @default(15.0)
  pathologyCommission  Float          @default(20.0)
  usgCommission        Float          @default(25.0)
  xrayCommission       Float          @default(30.0)
  ctCommission         Float          @default(15.0)
  outsourceCommission  Float          @default(10.0)
  isActive             Boolean        @default(true)
  hasPortalAccess      Boolean        @default(false)
  portalPasswordHash   String?

  cases                Case[]
  payouts              DoctorPayout[]
  createdAt            DateTime       @default(now())
  updatedAt            DateTime       @updatedAt
}

model CollectionAgent {
  id               String      @id @default(uuid())
  name             String
  phone            String
  zone             String      // North Zone, South Zone
  vehicleNo        String?
  feePerCollection Float       @default(100.0)
  activeCasesCount Int         @default(0)
  totalCollected   Float       @default(0.0)
  isActive         Boolean     @default(true)

  cases            Case[]
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

// ==========================================
// 4. DIAGNOSTIC MASTERS CATALOG
// ==========================================

model TestCategory {
  id          String   @id @default(uuid())
  name        String   @unique // Haematology, Biochemistry, etc.
  code        String   @unique
  department  String
  description String?
  testCount   Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model TestPanel {
  id          String   @id @default(uuid())
  name        String   @unique // Complete Blood Count, LFT, KFT
  code        String   @unique
  category    String
  testIds     String   // JSON array of test parameter codes
  subheadings String?  // JSON serialized section groupings
  panelPrice  Float
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model HealthPackage {
  id            String   @id @default(uuid())
  code          String   @unique // PKG-EXEC-01
  name          String
  category      String
  testsIncluded String   // JSON array of test codes/panel IDs
  retailPrice   Float    // Sum of MRPs
  packagePrice  Float    // Discounted price
  discountPct   Float
  fastingNotes  String?
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
}

model Investigation {
  id          String           @id @default(uuid())
  code        String           @unique // CBC, LFT, CREAT
  name        String
  department  String
  testType    String           @default("Single parameter") // Single, Multi, Document, Formula
  specimen    String           // EDTA Whole Blood, Serum, Fluoride Plasma
  container   String           // Lavender EDTA, Yellow SST Gel, Grey Fluoride
  rate        Float
  b2bRate     Float?
  tatHours    Int              @default(4)
  isDeleted   Boolean          @default(false)

  parameters  TestParameter[]
  caseItems   CaseItem[]
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt
}

model TestParameter {
  id              String           @id @default(uuid())
  investigationId String
  investigation   Investigation    @relation(fields: [investigationId], references: [id], onDelete: Cascade)
  code            String
  name            String
  unit            String
  method          String?
  formula         String?
  isCalculated    Boolean          @default(false)
  isOptional      Boolean          @default(false)
  sortOrder       Int              @default(0)

  ranges          ParameterRange[]
}

model ParameterRange {
  id            String        @id @default(uuid())
  parameterId   String
  parameter     TestParameter @relation(fields: [parameterId], references: [id], onDelete: Cascade)
  gender        String        @default("All") // All, Male, Female
  minAge        Int           @default(0)
  maxAge        Int           @default(120)
  lowerBound    Float
  upperBound    Float
  panicLower    Float?
  panicUpper    Float?
  textualNormal String?
}

// ==========================================
// 5. CASES, BILLING & DIAGNOSTIC SAMPLES
// ==========================================

enum CaseStatus {
  REGISTERED
  SAMPLE_COLLECTED
  IN_PROCESS
  RESULTS_ENTERED
  SIGNED_OFF
  CANCELLED
}

enum PaymentStatus {
  PAID
  PARTIAL
  DUE
  REFUNDED
}

model Case {
  id             String               @id @default(uuid())
  billNumber     String               @unique // BL-2026-0001
  dailyCode      String?              // L1, U1, X1
  uhid           String
  patientId      String
  patient        Patient              @relation(fields: [patientId], references: [id])
  doctorId       String
  doctor         Doctor               @relation(fields: [doctorId], references: [id])
  agentId        String?
  agent          CollectionAgent?     @relation(fields: [agentId], references: [id])
  branchId       String               @default("main")
  modality       String               // LAB, USG, XRAY, CT SCAN, ECG, OUTSOURCE
  isUrgent       Boolean              @default(false) // STAT priority
  
  reportStatus   CaseStatus           @default(REGISTERED)
  paymentStatus  PaymentStatus        @default(PAID)
  
  // Financial Ledger
  grossAmount    Float
  discountType   String               @default("fixed") // fixed, percentage
  discountValue  Float                @default(0.0)
  discountAmount Float                @default(0.0)
  discountReason String?
  netPayable     Float
  paidAmount     Float
  balanceDue     Float
  allowDue       Boolean              @default(false)

  collectedAt    DateTime?
  receivedAt     DateTime?
  reportedAt     DateTime?
  signedOffBy    String?
  cancellationReason String?
  
  items          CaseItem[]
  payments       PaymentTransaction[]
  clinicalResult ClinicalResult?
  radiologyStudy RadiologyReport?
  createdAt      DateTime             @default(now())
  updatedAt      DateTime             @updatedAt

  @@index([billNumber])
  @@index([uhid])
  @@index([reportStatus])
  @@index([paymentStatus])
  @@index([createdAt])
}

model CaseItem {
  id           String        @id @default(uuid())
  caseId       String
  case         Case          @relation(fields: [caseId], references: [id], onDelete: Cascade)
  testId       String
  test         Investigation @relation(fields: [testId], references: [id])
  testCode     String
  testName     String
  department   String
  specimen     String
  rate         Float
  discount     Float         @default(0.0)
  netAmount    Float
  deliveryTime DateTime?
}

model PaymentTransaction {
  id            String   @id @default(uuid())
  caseId        String
  case          Case     @relation(fields: [caseId], references: [id], onDelete: Cascade)
  receiptNumber String   @unique // REC-2026-0001
  amount        Float
  mode          String   // Cash, UPI, Card, Cheque, Insurance
  referenceNo   String?  // UTR, Card Auth Code, Cheque No
  receivedBy    String   // Cashier Username
  counterDesk   String?  // Counter 1
  isRefund      Boolean  @default(false)
  refundReason  String?
  createdAt     DateTime @default(now())

  @@index([receiptNumber])
  @@index([createdAt])
}

// ==========================================
// 6. CLINICAL RESULTS & RADIOLOGY REPORTS
// ==========================================

model ClinicalResult {
  id               String    @id @default(uuid())
  caseId           String    @unique
  case             Case      @relation(fields: [caseId], references: [id], onDelete: Cascade)
  parameterValues  String    // JSON serialized array of parameter codes, observed values, flags
  interpretation   String?   // Rich-text clinical notes
  technologistNote String?
  isAuthorized     Boolean   @default(false)
  authorizedBy     String?
  authorizedAt     DateTime?
  pdfUrl           String?
  qrVerificationId String    @unique @default(cuid())
  createdAt        DateTime  @default(now())
  updatedAt        DateTime  @updatedAt
}

model RadiologyReport {
  id              String    @id @default(uuid())
  caseId          String    @unique
  case            Case      @relation(fields: [caseId], references: [id], onDelete: Cascade)
  modality        String    // USG, XRAY, CT SCAN
  measurements    String?   // JSON serialized biometric parameters
  findings        String    // JSON serialized organ/anatomical findings
  impression      String
  clinicalHistory String?
  technicalKvp    String?
  technicalMas    String?
  filmsConsumed   String?   // e.g. 1 Film (14x17)
  pndtConfirmed   Boolean   @default(false)
  pregnancyScreen Boolean   @default(false)
  radiologistName String?
  isAuthorized    Boolean   @default(false)
  authorizedAt    DateTime?
  pdfUrl          String?
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

model ClinicalInterpretation {
  id         String   @id @default(uuid())
  title      String
  testCode   String
  department String
  content    String   // Markdown / HTML template with replacement tokens
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model RadiologyTemplate {
  id         String   @id @default(uuid())
  title      String
  modality   String   // USG, XRAY, CT SCAN
  organType  String?
  content    String   // Pre-built clinical description
  isNormal   Boolean  @default(true)
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}

model DigitalSignature {
  id             String   @id @default(uuid())
  doctorName     String
  designation    String
  degree         String
  registrationNo String
  signatureUrl   String?
  stampUrl       String?
  isDefault      Boolean  @default(false)
  modality       String   @default("PATHOLOGY") // PATHOLOGY, RADIOLOGY, USG
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}

// ==========================================
// 7. FINANCIAL EXPENSES & AUDIT
// ==========================================

model ExpenseVoucher {
  id            String   @id @default(uuid())
  voucherNumber String   @unique // EXP-2026-0001
  date          DateTime @default(now())
  name          String
  amount        Float
  category      String
  paymentMode   String   // Cash, UPI, Card
  vendor        String?
  invoiceNo     String?
  invoiceUrl    String?
  notes         String?
  cashierName   String
  isVoid        Boolean  @default(false)
  createdAt     DateTime @default(now())

  @@index([voucherNumber])
  @@index([date])
}

model DoctorPayout {
  id              String   @id @default(uuid())
  payoutNumber    String   @unique // PAY-2026-0001
  doctorId        String
  doctor          Doctor   @relation(fields: [doctorId], references: [id])
  periodStart     DateTime
  periodEnd       DateTime
  totalCommission Float
  paidAmount      Float
  paymentMode     String
  transactionRef  String?
  createdAt       DateTime @default(now())
}

model BrowserDevice {
  id                String    @id @default(uuid())
  deviceFingerprint String    @unique // 4-char browser code e.g. 123E
  deviceName        String
  browser           String
  operatingSystem   String
  lastIpAddress     String
  isApproved        Boolean   @default(true)
  isBlocked         Boolean   @default(false)
  lastSeenAt        DateTime  @default(now())
  createdAt         DateTime  @default(now())
}

model AuditLog {
  id         String   @id @default(uuid())
  timestamp  DateTime @default(now())
  action     String   // CASE_CREATED, RESULTS_AUTHORIZED, DUE_COLLECTED, CASE_CANCELLED
  entityType String   // Case, Patient, Result, Payment, Doctor, Expense
  entityId   String
  actorId    String
  actor      User     @relation(fields: [actorId], references: [id])
  actorName  String
  changes    String?  // JSON stringified diff
  ipAddress  String?
}

model ClinicSetting {
  id                  String   @id @default("clinic_default")
  clinicName          String   @default("Metropolis Diagnostics & Research Center")
  tagline             String   @default("ISO 15189:2012 Certified • NABL Accredited Laboratory")
  registrationNo      String   @default("DL-GGM-LAB-98102")
  nablCertificateNo   String   @default("MC-4921-ISO15189")
  phone               String   @default("+91 98765 43210")
  email               String   @default("reports@metropolisdiagnostics.com")
  address             String   @default("104, Medical Enclave, Sector 14, Gurugram, India")
  gstin               String?
  headerMarginMm      Int      @default(45)
  footerMarginMm      Int      @default(30)
  leftMarginMm        Int      @default(15)
  rightMarginMm       Int      @default(15)
  watermarkEnabled    Boolean  @default(true)
  qrCodeEnabled       Boolean  @default(true)
  smsSenderId         String   @default("LABSMT")
  dltPrincipalId      String   @default("1101489102830")
  allowedIp           String   @default("182.74.22.105")
  ipLockdownEnabled   Boolean  @default(false)
  updatedAt           DateTime @updatedAt
}
```

---

## 3. Comprehensive RESTful API Endpoints Catalog

Every endpoint requires `Authorization: Bearer <JWT>` header unless specified public.

### 3.1 Authentication & Terminal Security (`/api/v1/auth`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/auth/login` | Public | Staff username/password authentication; validates browser code header. |
| `POST` | `/api/v1/auth/refresh-token` | Public | Exchanges HTTP-only refresh cookie for fresh access token. |
| `POST` | `/api/v1/auth/logout` | Authenticated | Revokes session and clears auth cookies. |
| `GET` | `/api/v1/auth/me` | Authenticated | Returns logged in user profile, branch context, permissions. |
| `POST` | `/api/v1/auth/switch-branch` | Authenticated | Switches current session active branch. |
| `POST` | `/api/v1/auth/verify-browser` | Public | Intercepts 4-char browser code; verifies permitted terminal state. |

---

### 3.2 Cases & Billing Engine (`/api/v1/cases`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/cases` | Receptionist, Admin | Creates patient bill, auto-generates UHID if new, records advance payment. |
| `GET` | `/api/v1/cases` | Authenticated | Queries ledger with multi-column filters (duration, doctor, center, due). |
| `GET` | `/api/v1/cases/:id` | Authenticated | Retrieves complete case breakdown, itemized investigations, payments. |
| `PUT` | `/api/v1/cases/:id` | Receptionist, Admin | Modifies bill demographics or investigations (Requires `canEditRates`). |
| `POST` | `/api/v1/cases/:id/cancel`| Admin, Receptionist | Cancels bill, voiding tests and issuing cash till refund (Requires `canDeleteBills`). |
| `GET` | `/api/v1/cases/:id/bill-pdf`| Authenticated | Generates dynamic printable invoice PDF (A4/A5 or 80mm thermal). |
| `GET` | `/api/v1/cases/:id/barcodes`| Authenticated | Generates Code 128 thermal sticker assets for specimen tubes. |

---

### 3.3 Payments & Cashier Till (`/api/v1/payments`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `POST` | `/api/v1/payments/collect-due` | Receptionist, Admin | Collects partial or full outstanding due balance against a case. |
| `GET` | `/api/v1/payments/transactions` | Authenticated | Queries chronological receipt audit log with payment method split. |
| `PUT` | `/api/v1/payments/transactions/:id`| Admin, Accountant | Modifies payment method or logs UTR reference with mandatory audit reason. |
| `POST` | `/api/v1/payments/cashier-shift/start`| Receptionist | Opens cashier drawer with opening float cash. |
| `POST` | `/api/v1/payments/cashier-shift/close`| Receptionist, Admin| Reconciles drawer cash count, logs variance discrepancy. |

---

### 3.4 Lab (Pathology) Diagnostics (`/api/v1/pathology`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/pathology/worklist/today` | MLT, Pathologist, Admin| Returns real-time bench reports queue for selected date. |
| `GET` | `/api/v1/pathology/cases/:id/params`| MLT, Pathologist | Loads test parameter grid, normal ranges, and historical delta checks. |
| `POST` | `/api/v1/pathology/cases/:id/draft` | MLT, Pathologist | Saves draft parameter results without authorizing (`In Progress`). |
| `POST` | `/api/v1/pathology/cases/:id/signoff`| Pathologist | Verifies results, checks panic values, stamps signature, triggers WhatsApp PDF. |
| `GET` | `/api/v1/pathology/cases/:id/report-pdf`| Public (Signed) | Streams encrypted medical report PDF with QR stamp. |
| `GET` | `/api/v1/pathology/interpretations` | Authenticated | Queries 500+ interpretation templates library. |
| `GET` | `/api/v1/pathology/test-counts` | Admin, Pathologist | Aggregates daily/monthly throughput counts per test and analyzer. |

---

### 3.5 USG (Ultrasound) & Radiology (`/api/v1/usg` & `/api/v1/xray`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/usg/worklist` | Radiologist, Admin | Retrieves daily sonography patient queue with room status. |
| `POST` | `/api/v1/usg/cases/:id/findings`| Radiologist | Saves organ findings, biometrics, enforces PC-PNDT confirmation. |
| `GET` | `/api/v1/xray/worklist` | Radiologist, Admin | Retrieves digital radiography queue with exposure status. |
| `POST` | `/api/v1/xray/cases/:id/findings`| Radiologist | Saves radiographic report, logs kVp/mAs, deducts optical film stock. |
| `GET` | `/api/v1/radiology/templates` | Radiologist, Admin | Lists structured organ findings templates. |
| `GET` | `/api/v1/radiology/signatures` | Radiologist, Admin | Retrieves radiologist digital signatures and credentials. |

---

### 3.6 Business, Expenses & Reporting (`/api/v1/business`)

| Method | Endpoint Path | Role Allowed | Purpose |
|---|---|---|---|
| `GET` | `/api/v1/business/daily-summary`| Admin, Accountant | Calculates Net Income formula and instrument split for selected date. |
| `GET` | `/api/v1/business/daily-report` | Admin, Accountant | Generates printable comprehensive day-end settlement sheet. |
| `POST` | `/api/v1/business/email-report` | Admin | Dispatches encrypted day-end summary PDF to clinic directors. |
| `GET` | `/api/v1/business/expenses` | Admin, Accountant | Queries expense vouchers with category breakdowns. |
| `POST` | `/api/v1/business/expenses` | Admin, Accountant | Records expense voucher with uploaded receipt invoice. |
| `GET` | `/api/v1/business/dues-aging` | Admin, Receptionist | Computes accounts receivable in aging buckets (0-7, 8-30, 31-60, >60 days). |
| `GET` | `/api/v1/business/referral-statements`| Admin, Accountant| Evaluates doctor referral commission accruals and balances. |
| `POST` | `/api/v1/business/doctors/:id/settle`| Admin, Accountant| Disburses doctor commission payout with bank reference. |
| `POST` | `/api/v1/business/export` | Admin | Streams enterprise CSV / Excel dump of bills, patients, or results. |

---

## 4. Critical Business Logic & Calculation Engines

### 4.1 Automated Bill Settlement Calculation
When a new bill is created:
1. Gross Calculation:
   $$\text{Gross} = \sum_{i=1}^n \text{Rate}_i$$
2. Discount Evaluation:
   $$\text{Discount} = \begin{cases} \text{Value}, & \text{if Fixed} \\ \frac{\text{Gross} \times \text{Value}}{100}, & \text{if Percentage} \end{cases}$$
   *Validation Rule*: If `Discount > 0`, `discountReason` must be non-empty. If user role is `RECEPTIONIST`, discount capped at maximum configured threshold (e.g. 15%).
3. Net Payable:
   $$\text{Net} = \max(0, \text{Gross} - \text{Discount})$$
4. Balance Due:
   $$\text{Due} = \max(0, \text{Net} - \text{Paid})$$
   *Validation Rule*: If `Due > 0`, `allowDue` flag must be explicitly set to `true`.
5. Payment Status State Machine:
   $$\text{Status} = \begin{cases} \text{PAID}, & \text{if Due } = 0 \\ \text{PARTIAL}, & \text{if Paid } > 0 \text{ and Due } > 0 \\ \text{DUE}, & \text{if Paid } = 0 \end{cases}$$

---

### 4.2 Panic Range & Delta Check Alerting Algorithm
Upon submission of diagnostic parameter results:
1. **Biological Range Evaluation**:
   - Queries `ParameterRange` matching patient `gender` and `ageYears`.
   - If `value < lowerBound`: flags with `FLAG_LOW`.
   - If `value > upperBound`: flags with `FLAG_HIGH`.
2. **Critical Panic Value Evaluation**:
   - If `panicLower` is defined and `value <= panicLower`, OR `panicUpper` is defined and `value >= panicUpper`:
     * Marks result as `CRITICAL_PANIC`.
     * Logs urgent event in `AuditLog`.
     * Automatically dispatches immediate STAT SMS / WhatsApp alert to the referring physician mobile:
       `"CRITICAL ALERT: Patient {name} (Reg #{regNo}) observed {paramName} = {value} {unit} at Apex Diagnostics."`
3. **Delta Check Comparison**:
   - Fetches the patient's most recent prior result for the same parameter code within the last 90 days.
   - Calculates percentage variance:
     $$\Delta\% = \frac{|\text{Current Value} - \text{Previous Value}|}{\text{Previous Value}} \times 100$$
   - If $\Delta\% > 25\%$, attaches warning badge on enter results workspace prompting technician to re-verify specimen integrity.

---

### 4.3 Physical Terminal Browser Code Security Guard
1. Client browser computes cryptographic device fingerprint from hardware concurrency, user agent, canvas hash, and UUID in localStorage:
   $$\text{Code} = \text{SHA256}(\text{Fingerprint})[0..3] \quad (\text{e.g. } \text{"123E"})$$
2. In HTTP requests, client passes `X-Browser-Code: 123E`.
3. Middleware checks `ClinicSetting.ipLockdownEnabled`:
   - If `false`, allows request.
   - If `true`:
     * Checks client IP against `ClinicSetting.allowedIp`.
     * Queries `BrowserDevice` where `deviceFingerprint == "123E"`.
     * If device not found or `isBlocked == true`, returns `HTTP 403 Forbidden` with payload:
       `{"error": "DEVICE_NOT_AUTHORIZED", "browserCode": "123E", "message": "Terminal must be authorized by clinic administrator."}`
