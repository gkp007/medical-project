# Labsmart LIS (Laboratory & Hospital Information System)

**Labsmart LIS** is an enterprise-grade Laboratory Information System (LIS) and Radiology Information System (RIS) designed for Diagnostic Pathology Laboratories, Ultrasound Clinics, and Digital X-Ray Diagnostic Centers.

---

## 📚 Complete Screen, Feature & Backend Engineering Specifications

An exhaustive, field-by-field, modal-by-modal specification suite has been authored under [`docs/specifications/`](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/) to drive backend API development, database schema modeling, and business logic execution:

1. **[Master Specification Index & Backend Developer Roadmap](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/00_MASTER_INDEX.md)** (`00_MASTER_INDEX.md`) — Executive directory linking all 11 modules and phase-by-phase backend implementation roadmap.
2. **[System Shell, Global Navigation & Modals](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/00_SYSTEM_SHELL_AND_GLOBAL_MODALS.md)** (`00_SYSTEM_SHELL_AND_GLOBAL_MODALS.md`) — Top navbar, left sidebar, Omnisearch (`Ctrl+K`), quick bill (`Alt+N`), support ticketing, SMS balance, and profile security.
3. **[Executive Dashboard Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/01_DASHBOARD_MODULE.md)** (`01_DASHBOARD_MODULE.md`) — Real-time KPI cards, overdue receivables feed, cash counter receipts, SMS recharge, and referral widget.
4. **[Cases & Billing Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/02_CASES_AND_BILLING_MODULE.md)** (`02_CASES_AND_BILLING_MODULE.md`) — Patient registration, 13 modalities ordering, financial settlement engine, bills ledger, printable A4/A5/Thermal invoices, outsource cases, and CT scan worklists.
5. **[Lab (Pathology) Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/03_LAB_PATHOLOGY_MODULE.md)** (`03_LAB_PATHOLOGY_MODULE.md`) — Bench worklists, specimen barcode tracking, parameter entry matrix, auto-formulas, critical panic alerts, delta checks, pathologist authorization, and 500+ clinical interpretations.
6. **[USG (Ultrasound) Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/04_USG_ULTRASOUND_MODULE.md)** (`04_USG_ULTRASOUND_MODULE.md`) — Daily sonography room queue, quantitative biometric inputs (liver span, prostate volume, PVR), structured organ findings, and PC-PNDT statutory compliance.
7. **[Digital X-Ray Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/05_DIGITAL_XRAY_MODULE.md)** (`05_DIGITAL_XRAY_MODULE.md`) — Radiography exposure room queue, peak kilovoltage (kVp) & mAs logging, physical optical film inventory deduction, and AERB radiation safety compliance.
8. **[Business & Financials Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/06_BUSINESS_FINANCIALS_MODULE.md)** (`06_BUSINESS_FINANCIALS_MODULE.md`) — Day-End Net Income formula calculation, cash counter till drawer reconciliation, operational expense vouchers, debt aging, doctor referral commission settlements, and bulk data exports.
9. **[Manage & Masters Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/07_MANAGE_MASTERS_MODULE.md)** (`07_MANAGE_MASTERS_MODULE.md`) — Master Patient Index (UHID), referral doctors directory, phlebotomist logistics fleet, test packages, panels, categories, 500+ test catalog, staff RBAC, and terminal browser security.
10. **[Settings & Configurations Module](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/08_SETTINGS_MODULE.md)** (`08_SETTINGS_MODULE.md`) — Diagnostic center profile, millimeter letterhead margin designer (top/bottom mm), DLT SMS/WhatsApp gateways, barcode thermal printers, and IP whitelisting.
11. **[Master Modals & Dialogs Catalog](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/09_MODALS_AND_DIALOGS_CATALOG.md)** (`09_MODALS_AND_DIALOGS_CATALOG.md`) — Exhaustive encyclopedia cataloging all 32 dialogs across the entire application with every input field, validation rule, and API trigger.
12. **[Backend API & Database Architecture Blueprint](file:///c:/Users/hp/Desktop/MedicalProject/docs/specifications/10_BACKEND_API_AND_DATABASE_BLUEPRINT.md)** (`10_BACKEND_API_AND_DATABASE_BLUEPRINT.md`) — Complete Prisma database schema (24 models), 80+ REST API endpoints catalog, mathematical formula algorithms, delta checking, and security middleware.

---

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, Vanilla CSS Design System (`global.css`, tokens).
- **Backend**: Node.js, Express / Fastify, Prisma ORM, PostgreSQL / SQLite.
- **Security & Printing**: Browser Device Fingerprinting, Headless Chromium PDF Generator, WebSockets.
