# Labsmart LIS — Settings & System Configurations Specification

**Specification ID:** `SPEC-08-SETTINGS`  
**Module Name:** Laboratory Profile Setup, Letterhead Margin Designer, Notification Gateways, Barcode Labeling, RBAC Roles & IP Security  
**Target Route:** `/settings`  
**Source Component:** `src/pages/settings/SettingsPage.tsx`  
**Document Purpose:** Exhaustive specification of the central configuration engine for laboratory profile, pre-printed letterheads, SMS/WhatsApp integration, thermal barcodes, and cloud subscription.

---

## 1. Executive Summary & Architecture

The **Settings & System Configurations** module acts as the control panel for the diagnostic institution. It is partitioned into 7 dedicated configuration submodules accessible via a 2-column layout (Left: Navigation Tabs; Right: Submodule Canvas):
1. **Center Details**: Diagnostic center branding, official licensing, NABL registration, and physical clinic contact data.
2. **Letterhead Designer**: Precise millimeter margin calibration (Top mm / Bottom mm) for pre-printed stationery, center watermarks, and verification QR code embedding.
3. **SMS & WhatsApp Gateway**: DLT template configurations, Sender ID (`LABSMT`), and WhatsApp Cloud API token credentials.
4. **Barcode Tracking Setup**: Code 128 symbology, thermal roll label dimensions ($50\text{mm} \times 25\text{mm}$), and auto-print triggers.
5. **Staff Logins & Role Matrix**: Overview of active licenses and high-level role restrictions.
6. **Browser Security & Broadband IP Whitelist**: Static IP enforcement restricting staff logins to clinic premises.
7. **Cloud Plan & Billing**: SaaS tier licensing, case capacity, and renewal expiration dates.

---

## 2. Screen Architecture & Submodules

```
+--------------------------------------------------------------------------------------------------------------------+
| [260px Vertical Submodule Tabs]   | [Right Submodule Canvas]                                                       |
|                                   |                                                                                |
| 1. Center Details (Active)        | Diagnostic Center & Branch Profile                                            |
| 2. Letterhead Designer            | - Center Name: Metropolis Diagnostics & Research Center                        |
| 3. SMS & WhatsApp                 | - License / Registration No: DL-GGM-LAB-98102                                  |
| 4. Barcode Tracking               | - Reception Phone: +91 98765 43210                                             |
| 5. Staff Logins & Roles           | - Physical Address: 104, Medical Enclave, Sector 14, Gurugram                  |
| 6. Browser Security & IP          | - Upload Brand Logo & Clinic Seal [File Input]                                 |
| 7. Cloud Plan & Billings          | [ Save Branch Profile Button ]                                                 |
+--------------------------------------------------------------------------------------------------------------------+
```

---

## 3. Deep-Dive Submodule Specifications

### 3.1 Submodule 1: Center Details (`activeTab === 'branch'`)
- **Fields**:
  1. `Official Diagnostic Center Name` (`Input`, Required):
     * Value: `Metropolis Diagnostics & Research Center`
     * Validation: Min 3 characters.
  2. `Clinical Registration / License No.` (`Input`, Required):
     * Value: `DL-GGM-LAB-98102` (Mandatory on official patient invoices).
  3. `NABL Accreditation Certificate No.` (`Input`, Optional):
     * Value: `MC-4921-ISO15189` (Enables NABL logo print).
  4. `Official Reception Phone Number` (`Input`, Required):
     * Value: `+91 98765 43210`
  5. `Official Email Address` (`Input`, Required):
     * Value: `reports@metropolisdiagnostics.com`
  6. `Center Physical Address` (`Textarea` / `Input`, Required):
     * Value: `104, Medical Enclave, Sector 14, Gurugram, Haryana - 122001`
  7. `GSTIN / Tax ID` (`Input`, Optional):
     * Value: `07AAAAA0000A1Z5`
  8. `Upload Brand Logo & Official Stamp`:
     * File inputs accepting `.png`, `.jpg` (Max 2MB).
- **Action**: `Save Branch Profile` (Persists to database, displays success toast).

---

### 3.2 Submodule 2: Letterhead Margin Designer (`activeTab === 'letterhead'`)
Designed specifically for diagnostic clinics using **pre-printed doctor stationery** where clinic logos are already litho-printed on physical sheets:
- **Margin Controls (in Millimeters)**:
  1. `Header Top Margin (mm)` (`Input type="number"`, Required):
     * Default: `45 mm` (Range: `0 - 100 mm`).
     * Purpose: Forces the diagnostic test results table to begin exactly below the pre-printed header graphic.
  2. `Footer Bottom Margin (mm)` (`Input type="number"`, Required):
     * Default: `30 mm` (Range: `0 - 80 mm`).
     * Purpose: Reserves clearance above pre-printed clinic address footers and doctor signature stamps.
  3. `Left Margin (mm)` & `Right Margin (mm)`:
     * Defaults: `15 mm` and `15 mm`.
- **Formatting Toggles**:
  * `[x] Print faint center security watermark in background of diagnostic report` (Displays translucent clinic monogram).
  * `[x] Include dynamic authentication QR code on patient report footer` (Enables digital authenticity scanning).
  * `[x] Include NABL Accreditation logo and certificate badge`
  * `[ ] Hide digital header (Enable when using pre-printed paper)`
- **Interactive Visual Preview**:
  * Live A4 paper mockup rendering shaded margin boundaries reflecting millimeter changes in real-time.

---

### 3.3 Submodule 3: SMS & WhatsApp Notification Gateway (`activeTab === 'sms'`)
Governs automated patient and doctor communication via Telecom Regulatory Authority of India (TRAI) DLT compliance:
- **DLT Gateway Configuration**:
  1. `Sender ID / Header`: `LABSMT` (6-character alphanumeric DLT approved header).
  2. `DLT Entity Principal ID`: `1101489102830` (Enterprise DLT registration number).
  3. `SMS Gateway API Provider`: Dropdown (`Fast2SMS`, `MSG91`, `Twilio`, `Custom HTTP REST Gateway`).
  4. `API Key / Secret Token`: Secure password input field.
- **WhatsApp Cloud API Configuration**:
  1. `WhatsApp Business Phone Number ID`: Numeric string.
  2. `System Access Token`: Bearer token for WhatsApp Cloud API.
  3. `Approved Template Namespace`: `labsmart_report_dispatch`.
- **Event-Driven Dispatch Toggles**:
  * `[x] Send Bill Receipt SMS upon Case Registration`
  * `[x] Send WhatsApp message with Download Link when Report is Signed Off`
  * `[x] Send Balance Due Reminder SMS automatically 3 days after billing`
  * `[x] Send Doctor Notification WhatsApp message when critical panic result is logged`

---

### 3.4 Submodule 4: Barcode Tracking Setup (`activeTab === 'barcodes'`)
- **Parameters**:
  1. `Barcode Symbology`: `Code 128` (High-density alphanumeric format).
  2. `Label Roll Dimensions`: `50mm x 25mm (Thermal)` (Standard phlebotomy tube sticker size).
  3. `Barcode Content Formula`: Choice between:
     * `Reg No only` (e.g. `1001`)
     * `Reg No + Daily Code` (e.g. `1001-L1`)
     * `Reg No + Tube Color Code` (e.g. `1001-EDTA`, `1001-SST`, `1001-FLUOR`)
  4. `Auto-Print Behavior`:
     * `[x] Auto-trigger barcode printing immediately upon bill registration (Alt+N)`
     * `[x] Print separate barcode labels for each unique tube specimen container`

---

### 3.5 Submodule 5: Staff Roles & Permissions Overview (`activeTab === 'roles'`)
- Displays an enterprise overview table of system roles and active seat allocations:
  * `Super Admin / Owner`: Unrestricted control over financials, employee setup, and test rates (Active: 1 User).
  * `Receptionist / Front Desk`: Patient registration, cash till collection, receipt reprints; restricted from viewing overall clinic profit (Active: 2 Users).
  * `Consulting Pathologist`: Parameter result entry, clinical interpretation editing, digital sign-off (Active: 1 User).
  * `Consulting Radiologist`: USG / X-Ray worklists, organ findings transcription, PNDT compliance sign-off (Active: 1 User).
  * `Medical Lab Technologist (MLT)`: Analyzer result syncing, draft result saving (Active: 2 Users).

---

### 3.6 Submodule 6: Browser Security & Broadband IP Whitelist (`activeTab === 'security'`)
- **Static Broadband IP Whitelisting**:
  * Input: `Allowed Clinic IP Address` (e.g. `182.74.22.105 (Airtel Broadband)`).
  * Checkbox: `[x] Restrict staff logins exclusively to clinic Wi-Fi IP address`.
  * Behavior: If enabled, login attempts from mobile cellular data or home IP addresses are rejected with HTTP 403 Forbidden: `Clinic IP Lockdown Active. Login must be initiated from laboratory Wi-Fi network.`
- **Session Auto-Logout Timeout**:
  * Dropdown: `15 Minutes`, `30 Minutes`, `1 Hour`, `Never (Disable)`.

---

### 3.7 Submodule 7: Cloud Plan & Billings (`activeTab === 'plan'`)
- **Subscription Card**:
  * Current Tier: `Labsmart Cloud Professional (Enterprise Multi-Branch)`.
  * Status Badge: `Active Enterprise Plan` (Green).
  * Capabilities: Unlimited Patient Cases, Multi-Branch Synchronization, NABL ISO 15189 Formats, WhatsApp PDF Delivery.
  * Remaining License Duration: `365 Days` (Renews October 30, 2027).
  * Quick Actions: `Renew Subscription`, `Upgrade Branch Capacity`, `Download Tax Invoices`.

---

## 4. Backend API Specifications & Architecture

### 4.1 Endpoints Required by Settings Module

#### 1. GET `/api/v1/settings/clinic`
- **Purpose**: Retrieves all clinic profile and print calibration settings.
- **Headers**: `Authorization: Bearer <jwt>`
- **Response JSON (200 OK)**:
```json
{
  "clinicName": "Metropolis Diagnostics & Research Center",
  "tagline": "ISO 15189:2012 Certified • NABL Accredited Laboratory",
  "registrationNo": "DL-GGM-LAB-98102",
  "nablCertificateNo": "MC-4921-ISO15189",
  "phone": "+91 98765 43210",
  "email": "reports@metropolisdiagnostics.com",
  "address": "104, Medical Enclave, Sector 14, Gurugram, Haryana - 122001",
  "gstin": "07AAAAA0000A1Z5",
  "margins": {
    "headerMarginMm": 45,
    "footerMarginMm": 30,
    "leftMarginMm": 15,
    "rightMarginMm": 15
  },
  "flags": {
    "watermark": true,
    "qrCode": true,
    "nablLogo": true,
    "hideDigitalHeader": false
  },
  "gateways": {
    "smsSenderId": "LABSMT",
    "dltPrincipalId": "1101489102830",
    "sendBillSms": true,
    "sendReportWhatsapp": true
  },
  "security": {
    "allowedIp": "182.74.22.105",
    "ipLockdownEnabled": true,
    "sessionTimeoutMinutes": 30
  }
}
```

#### 2. PUT `/api/v1/settings/clinic`
- **Purpose**: Updates laboratory setup, letterhead margins, or communication credentials.
- **Request Body JSON**: Matches the structure of the GET endpoint.
- **Business Logic**:
  1. Validates that current user role is `ADMIN` or `OWNER`.
  2. Ensures margins are within valid boundary ranges ($0 \le \text{margin} \le 120\text{ mm}$).
  3. Updates `ClinicSetting` database singleton table.
  4. Flushes cached report generation templates.
- **Response JSON (200 OK)**:
```json
{
  "status": "SUCCESS",
  "updatedAt": "2026-10-30T10:50:00Z"
}
```
