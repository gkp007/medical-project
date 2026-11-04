# Labsmart LIS — Comprehensive UI/UX Design System & Screen Recreation Specification

> **Specification Version:** 1.0.0  
> **Source Platform:** Labsmart Laboratory Information Management System (`https://app.labsmartlis.com`)  
> **Target Audience:** UI/UX Designers, Front-End Engineers, Design System Developers  
> **Purpose:** Pixel-accurate, exhaustive reference containing every design token, DOM structure, component state, layout grid, typography rule, and screen blueprint required to build an exact 1:1 replica of the Labsmart LIS application.

---

## 1. Global Design Tokens & Foundation

### 1.1 Color Palette & Tokens

#### Brand & Action Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `color-primary` | `#1565c0` | `rgb(21, 101, 192)` | `blue-700` (Material 800) | Primary CTA buttons ("New Bill", "Save Results", "Pay Now") |
| `color-primary-hover` | `#0d47a1` | `rgb(13, 71, 161)` | `blue-900` | Button hover state |
| `color-primary-active` | `#0a3875` | `rgb(10, 56, 117)` | `blue-950` | Button active / pressed state |
| `color-primary-link` | `#2563eb` | `rgb(37, 99, 235)` | `blue-600` | Hyperlinks, active sidebar navigation icons, tab borders |
| `color-primary-focus` | `#3b82f6` | `rgb(59, 130, 246)` | `blue-500` | Focus ring outline on inputs (`ring-2 ring-blue-500`) |
| `color-primary-light` | `#eff6ff` | `rgb(239, 246, 255)` | `blue-50` | Active menu background, table row highlight, info banners |

#### Success & Status Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `color-success` | `#15803d` | `rgb(21, 128, 61)` | `green-700` | Fully paid badge, "No due" badge, completed test status |
| `color-success-bg` | `#dcfce7` | `rgb(220, 252, 231)` | `green-100` | Success badge background, "Setup" button background |
| `color-success-border`| `#86efac` | `rgb(134, 239, 172)` | `green-300` | Success badge border |

#### Warning & Pending Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `color-warning` | `#b45309` | `rgb(180, 83, 9)` | `amber-700` | Pending report badge, partial payment badge |
| `color-warning-bg` | `#fef3c7` | `rgb(254, 243, 199)` | `amber-100` | Warning badge background, trial expiry alert banner |
| `color-warning-border`| `#fcd34d` | `rgb(252, 211, 77)` | `amber-300` | Warning badge border |

#### Danger & Due Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `color-danger` | `#b91c1c` | `rgb(185, 28, 28)` | `red-700` | Payment due text, abnormal/critical test value highlight |
| `color-danger-bg` | `#fee2e2` | `rgb(254, 226, 226)` | `red-100` | Payment due badge background, critical alert background |
| `color-danger-border`| `#fca5a5` | `rgb(252, 165, 165)` | `red-300` | Danger badge border, abnormal input border |

#### Neutral & Surface Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `surface-canvas` | `#f8fafc` | `rgb(248, 250, 252)` | `slate-50` | Main application background beneath cards |
| `surface-sidebar` | `#f9fafb` | `rgb(249, 250, 251)` | `gray-50` | Left navigation sidebar background |
| `surface-card` | `#ffffff` | `rgb(255, 255, 255)` | `white` | Cards, modals, tables, top navbar surface |
| `surface-table-head`| `#f1f5f9` | `rgb(241, 245, 249)` | `slate-100` | Data table header background |
| `surface-table-hover`| `#f8fafc` | `rgb(248, 250, 252)` | `slate-50` | Data table row hover background |

#### Border & Divider Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `border-subtle` | `#e2e8f0` | `rgb(226, 232, 240)` | `slate-200` | Navbar divider, card borders, table row borders |
| `border-input` | `#d1d5db` | `rgb(209, 213, 219)` | `gray-300` | Form field borders (inputs, selects, textareas) |
| `border-focus` | `#2563eb` | `rgb(37, 99, 235)` | `blue-600` | Focused input border |

#### Typography Colors
| Semantic Token | Hex Code | RGB | Tailwind Equivalent | Usage / Application |
| :--- | :--- | :--- | :--- | :--- |
| `text-headings` | `#0f172a` | `rgb(15, 23, 42)` | `slate-900` | Page main titles (H1), modal headings |
| `text-section` | `#334155` | `rgb(51, 65, 85)` | `slate-700` | Section headers (H2), card titles, table headers |
| `text-body` | `#1e293b` | `rgb(30, 41, 59)` | `slate-800` | Standard body text, form input value, table cells |
| `text-secondary`| `#64748b` | `rgb(100, 116, 139)` | `slate-500` | Helper text, field labels, metadata stamps |
| `text-placeholder`| `#94a3b8` | `rgb(148, 163, 184)` | `slate-400` | Input placeholder text, disabled states |

---

### 1.2 Typography System

**Primary Font Family:**  
`font-sans: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`  
**Monospace Font Family (Barcodes, Tokens, Numeric IDs):**  
`font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`

#### Type Scale Specification
| Role | Size | Line Height | Font Weight | Letter Spacing | CSS / Tailwind Equivalent |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Page Title (H1)** | `20px` (1.25rem) | `28px` (1.75rem) | `700` (Bold) | `-0.015em` | `text-xl font-bold tracking-tight text-slate-900` |
| **Section Title (H2)**| `14px` (0.875rem) | `20px` (1.25rem) | `700` (Bold) | `0.05em` (Caps) | `text-sm font-bold uppercase tracking-wider text-slate-700` |
| **Card Header (H3)** | `15px` (0.9375rem)| `22px` (1.375rem) | `600` (SemiBold) | `-0.01em` | `text-[15px] font-semibold text-slate-800` |
| **Form Label** | `13px` (0.8125rem)| `18px` (1.125rem) | `500` (Medium) | `0.01em` | `text-[13px] font-medium text-slate-700` |
| **Body / Input Value**| `14px` (0.875rem) | `20px` (1.25rem) | `400` (Regular) | `0` | `text-sm font-normal text-slate-800` |
| **Table Header Cell**| `12px` (0.75rem) | `16px` (1rem) | `600` (SemiBold) | `0.04em` (Caps) | `text-xs font-semibold uppercase tracking-wider text-slate-600` |
| **Table Body Cell** | `13px` (0.8125rem)| `18px` (1.125rem) | `400` (Regular) | `0` | `text-[13px] text-slate-800` |
| **Badge / Tag** | `11px` (0.6875rem)| `14px` (0.875rem) | `600` (SemiBold) | `0.02em` | `text-[11px] font-semibold tracking-wide` |
| **Caption / Timestamp**| `12px` (0.75rem) | `16px` (1rem) | `400` (Regular) | `0` | `text-xs text-slate-500` |

---

### 1.3 Spacing, Borders & Shadows

#### Layout Dimensions
- **Top Navbar Height:** `64px` (`4rem` / `h-16`)
- **Left Navigation Sidebar Width:** `256px` (`16rem` / `w-64`)
- **Content Area Margin Left:** `256px` (`ml-64`) on screens $\ge$ 1024px
- **Trial / Announcement Banner Height:** `32px` (`2rem` / `h-8`)
- **Main Container Max Width:** Fluid responsive (`w-full`), with `px-6 py-6` padding
- **Form Row Gutter:** `16px` (`gap-4` or `space-y-4`)

#### Border Radii
- **Input Fields & Select Boxes:** `6px` (`rounded-md`)
- **Buttons (CTAs & Secondary):** `6px` (`rounded-md`)
- **Special Setup Button:** `8px` (`rounded-lg`)
- **Cards & Data Tables:** `8px` (`rounded-lg`)
- **Modals & Flyout Drawers:** `12px` (`rounded-xl`)
- **Status Badges & Pill Buttons:** `9999px` (`rounded-full`)

#### Elevation & Box Shadows
- **Card Default:** `box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)` (`shadow-sm`)
- **Card Hover:** `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.06)` (`shadow`)
- **Omnisearch & Dropdown Menus:** `box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)` (`shadow-lg`)
- **Center Dialog Modals:** `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)` (`shadow-xl`)
- **Input Field Rest:** `box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Input Field Focus:** `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18)`

---

## 2. Core Layout Architecture & Master Shell

```
+---------------------------------------------------------------------------------------------------------------+
| TOP NAVBAR (Fixed: top-0, left-0, right-0, height: 64px, z-index: 40, bg-white, border-b: #e2e8f0)            |
| [Lab Logo] [Search Cases Ctrl+K]                                  [+ New Bill] [Setup] [Profile ▾]            |
+---------------------------------------------------+-----------------------------------------------------------+
| LEFT SIDEBAR (Fixed: top-16, left-0, bottom-0)    | MAIN CONTENT CANVAS (overflow-y: auto, bg: #f8fafc)       |
| Width: 256px, bg: #f9fafb, border-r: #e2e8f0      | Margin-left: 256px, Padding: 24px                         |
|                                                   |                                                           |
|  BUSINESS                                         |  [Breadcrumbs: Cases > New Bill]                          |
|  - Dashboard                                      |  [Page Header Title]                                      |
|  - Daily Business                                 |                                                           |
|  - Expenses                                       |  +-----------------------------+ +---------------------+  |
|  - Referral Business                              |  | Left Form Card (65%)        | | Right Summary (35%) |  |
|                                                   |  | Patient Info, Tests Picker  | | Net, Paid, Due      |  |
|  CASES                                            |  |                             | | Payment Modes       |  |
|  - New Bill (Active)                              |  |                             | | Save & Print CTA    |  |
|  - Bills Table                                    |  +-----------------------------+ +---------------------+  |
|  - Outsource Cases                                |                                                           |
|  - CT Scan Cases                                  |                                                           |
|                                                   |                                                           |
|  LAB                                              |                                                           |
|  - Today's Reports                                |                                                           |
|  - Search Reports                                 |                                                           |
|  - Enter Results                                  |                                                           |
|                                                   |                                                           |
|  MANAGE                                           |                                                           |
|  - Patients, Doctors, Agents                      |                                                           |
|  - Test Database, Interpretations                 |                                                           |
+---------------------------------------------------+-----------------------------------------------------------+
```

### 2.1 Top Navbar HTML & CSS Blueprint

```html
<header class="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 z-40 px-4 flex items-center justify-between">
  <!-- Left Section: Logo & Center Identity -->
  <div class="flex items-center space-x-6">
    <div class="flex items-center space-x-3 cursor-pointer">
      <!-- Blue Flask / Medical Cross Icon SVG -->
      <div class="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
        L
      </div>
      <div>
        <h1 class="text-base font-bold text-slate-800 leading-none">Labsmart LIS</h1>
        <span class="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">Cloud Edition</span>
      </div>
    </div>

    <!-- Global Omnisearch Trigger -->
    <button type="button" class="hidden md:flex items-center space-x-3 w-80 h-9 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md text-xs text-slate-500 transition-colors">
      <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
      </svg>
      <span class="flex-1 text-left">Search Patient, Bill #, Phone...</span>
      <kbd class="px-1.5 py-0.5 text-[10px] font-semibold bg-white border border-slate-300 rounded text-slate-500 shadow-2xs">Ctrl K</kbd>
    </button>
  </div>

  <!-- Right Section: CTAs & Profile -->
  <div class="flex items-center space-x-3">
    <!-- Quick New Bill CTA -->
    <a href="/cases/new" class="inline-flex items-center h-9 px-3.5 bg-[#1565c0] hover:bg-[#0d47a1] text-white text-xs font-semibold rounded-md shadow-sm transition-all focus:ring-2 focus:ring-blue-400">
      <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
      </svg>
      New Bill
    </a>

    <!-- Setup / Configuration Pill -->
    <a href="/settings" class="inline-flex items-center h-9 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold rounded-lg transition-colors">
      <svg class="w-3.5 h-3.5 mr-1 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
      </svg>
      Setup
    </a>

    <!-- User Profile Dropdown Trigger -->
    <div class="flex items-center pl-2 border-l border-slate-200">
      <button type="button" class="flex items-center space-x-2 text-left p-1 rounded-md hover:bg-slate-100 transition-colors">
        <div class="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs">
          AD
        </div>
        <div class="hidden xl:block">
          <p class="text-xs font-semibold text-slate-800 leading-tight">Admin Demo</p>
          <p class="text-[10px] text-slate-500 leading-tight">Branch #7112</p>
        </div>
        <svg class="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>
  </div>
</header>
```

---

### 2.2 Left Sidebar Navigation Architecture

#### CSS & Layout Parameters
- `position: fixed; top: 64px; left: 0; bottom: 0; width: 256px;`
- `background-color: #f9fafb;`
- `border-right: 1px solid #e2e8f0;`
- `overflow-y: auto;`
- `padding: 16px 0 24px 0;`

#### Active Item State
- Left accent border: `border-l-4 border-[#2563eb]`
- Background: `bg-blue-50/70` (`rgba(239, 246, 255, 0.7)`)
- Text: `text-[#2563eb] font-semibold`
- Icon Color: `text-[#2563eb]`

#### Inactive Item State
- Left border: `border-l-4 border-transparent`
- Background: `transparent hover:bg-slate-100/70`
- Text: `text-slate-600 hover:text-slate-900 font-medium`
- Icon Color: `text-slate-400 group-hover:text-slate-600`

#### Authoritative 100% Sidebar Navigation Hierarchy (37 Screens Across 6 Accordions & Standalone Items)

The sidebar is built with persistent accordions, chevron toggles, and vertical visual guide lines (`border-l border-slate-300 ml-4 pl-2`) for sub-menus:

```markdown
TOP PRIMARY ACTION:
- [Pill Button] + New bill                        -> /cases/new

STANDALONE ITEMS:
- [Icon: CheckCircle2] Getting Started            -> /getting_started
- [Icon: Home] Dashboard                          -> /dashboard (or root /)

ACCORDION GROUP 1: BUSINESS (BarChart2)
- 1. Daily business                               -> /business_reports/daily_business
- 2. Expenses                                     -> /expenses
- 3. Due reports                                  -> /cases/with_due
- 4. Activities                                   -> /activities
- 5. Referral business                            -> /referrer_wise_business_report/summary
- 6. Case wise report                             -> /case_wise_business_report/new
- 7. Business analysis                            -> /business_analysis/monthly_business_overview
- 8. Data export                                  -> /data_exports/new

ACCORDION GROUP 2: CASES (ClipboardList)
- 9. Bills (Cases Ledger)                         -> /cases
- 10. Outsource cases                             -> /outsource_lab_cases
- 11. Ct scan cases                               -> /ctscan_cases
- 12. Patients                                    -> /patients
- 13. Transactions                                -> /receipts
- 14. Referral Doctors                            -> /referrers
- 15. Agents (Sample Collectors)                  -> /sample_collectors

ACCORDION GROUP 3: LAB (Microscope)
- 16. Today's reports                             -> /lab_reports/today
- 17. Search reports                              -> /lab_reports
- 18. Test packages                               -> /test_packages
- 19. Test panels                                 -> /lab_test_panels
- 20. Test categories                             -> /lab_test_categories
- 21. Test database                               -> /lab_tests
- 22. Interpretations                             -> /interpretations
- 23. Test counts                                 -> /lab_test_counts

ACCORDION GROUP 4: USG (Ultrasound) (Radio)
- 24. Today's cases                               -> /usg_cases/today
- 25. Search cases                                -> /usg_cases
- 26. Report templates                            -> /usg_templates
- 27. Signatures                                  -> /usg_signatures

ACCORDION GROUP 5: DIGITAL X-RAY (Film)
- 28. Today's cases                               -> /digital_xray_cases/today
- 29. Search cases                                -> /digital_xray_cases
- 30. Report templates                            -> /digital_xray_templates
- 31. Signatures                                  -> /digital_xray_signatures

ACCORDION GROUP 6: MANAGE (Settings2)
- 32. Browser security                            -> /web_browsers
- 33. Employee login                              -> /users
- 34. Doctor access                               -> /doctor_accesses/invited

BOTTOM SYSTEM STATUS & ACTIONS:
- Raise Ticket (Modal)
- Offline / Online Sync Indicator
- Promo / License Banner ("Your trial ends in 5 days" / Upgrade CTA)
```

---

## 3. Screen-by-Screen Pixel-Accurate Blueprints

---

### Screen 1: New Bill / Case Registration (`/cases/new`)

This is the central transactional screen of Labsmart. It allows rapid data entry via keyboard with responsive split layout.

#### Layout Split
- **Desktop ($\ge$ 1024px):** 2 Columns (Left Column: `62%` width; Right Column: `38%` width sticky).
- **Mobile (< 1024px):** Single column stack.

```
+-------------------------------------------------------------+---------------------------------------+
| LEFT COLUMN (Width: 62%, gap: 16px)                         | RIGHT COLUMN (Width: 38%, sticky)     |
|                                                             |                                       |
| CARD 1: PATIENT DEMOGRAPHICS                                | CARD 3: BILL SUMMARY & PAYMENT TILL   |
| [Prefix ▾] [Patient Full Name                     ]         |                                       |
| [Age: 32 ] [Years ▾] [Gender: (•) M ( ) F ( ) O   ]         | Gross Amount:                 ₹400.00 |
| [Mobile: +91 9876543210       ] [UHID: Auto-gen  ]         | Discount: [ ₹ ][ 0 ] Reason: None     |
| [Address / Notes (Collapsible)                   ]         | ------------------------------------- |
|                                                             | Net Payable:                  ₹400.00 |
| CARD 2: REFERRAL & INVESTIGATIONS                           |                                       |
| [Ref Doctor Select2 ▾] [ + Add Doctor Button ]             | Amount Received:              ₹400.00 |
| [Collection Center / Agent ▾]                              |                                       |
|                                                             | Payment Mode Pill Selector:           |
| MODALITY SELECTOR TABS:                                     | [ (•) Cash ] [ ( ) UPI ] [ ( ) Card ] |
| [ LAB (Active) ] [ USG ] [ X-RAY ] [ CT ]                   |                                       |
|                                                             | Balance Due:                    ₹0.00 |
| TEST SEARCH COMBOBOX:                                       |                                       |
| [ Type Test Name or Code...                        ]        | [ ] Send Bill SMS to Patient          |
|                                                             | [ ] Send WhatsApp Notification        |
| SELECTED INVESTIGATIONS LIST:                               |                                       |
| +---------------------------------------------------------+ | ACTION BUTTONS:                       |
| | Test Name     | Sample | Rate  | Disc | Net  | Trash    | | [ Cancel / Reset (Gray)             ] |
| |---------------+--------+-------+------+------+----------| | [ Save & Enter Results (Primary)    ] |
| | CBC (Complete)| EDTA   | ₹400  |  ₹0  | ₹400 |   🗑     | | [ Save & Print Bill (Dark Blue)     ] |
| +---------------------------------------------------------+ +---------------------------------------+
```

#### Detailed DOM & CSS Specifications for New Bill

1. **Card 1: Patient Demographics Container**
   - Container: `bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4`
   - Title: `<h2 class="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">1. Patient Details</h2>`
   - Row 1 (Grid: 1fr 3fr):
     - `Prefix`: Select element (`Mr`, `Mrs`, `Ms`, `Master`, `Baby`, `Dr`). Width: `100px`. Height: `38px`. Border: `1px solid #d1d5db`.
     - `Full Name`: Text Input. Placeholder: `Enter patient name`. Font: `14px font-medium`.
   - Row 2 (Grid: 1fr 1fr 2fr):
     - `Age`: Number input. Width: `80px`. Height: `38px`.
     - `Age Unit`: Select (`Years`, `Months`, `Days`). Default: `Years`.
     - `Gender Radio Pills`: Segmented button control with 3 options:
       - Selected pill: `bg-blue-600 text-white font-semibold shadow-xs`
       - Unselected pill: `bg-slate-100 text-slate-600 hover:bg-slate-200`
   - Row 3 (Grid: 2fr 1fr):
     - `Mobile Number`: Tel input with static prefix tag `+91`.
     - `UHID / MRN`: Readonly / Editable text input with placeholder `Auto (Leave blank)`.

2. **Card 2: Referral & Test Selection Container**
   - Doctor Select2 Dropdown:
     - Searchable select box with placeholder `Search referring doctor...`
     - Suffix icon button: Quick "+ Add Doctor" opening a modal without leaving the page.
   - Modality Horizontal Pill Tabs:
     - Container: `flex space-x-2 border-b border-slate-200 pb-2`
     - Active Tab (`LAB`): `px-3.5 py-1.5 rounded-md bg-blue-600 text-white text-xs font-bold shadow-xs`
     - Inactive Tabs: `px-3.5 py-1.5 rounded-md bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200`
   - Test Search Combobox:
     - Autocomplete drop-down trigger with search icon and keyboard shortcuts.
     - Dropdown item format:  
       `[Test Name] — [Department: Hematology] — [Sample: Whole Blood EDTA] — [Price: ₹400.00]`

3. **Selected Tests Table (`table-auto w-full text-left text-xs`)**
   - `<thead>`: Background `#f8fafc`, text color `#64748b`, uppercase 11px tracking-wider, `py-2.5 px-3`.
   - `<tbody>`: Row height `44px`, border bottom `1px solid #f1f5f9`.
   - Delete Button: Red trash icon `text-slate-400 hover:text-red-600 p-1 rounded hover:bg-red-50`.

4. **Card 3: Right Financial Summary Till**
   - Container: `bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 sticky top-20`
   - Price Breakdown:
     - Gross Amount: `text-sm text-slate-600`, Value: `text-sm font-semibold text-slate-900`
     - Discount Row:
       - Currency/Percentage toggle switch (`₹` or `%`)
       - Numeric input (`w-20 h-8 text-right font-medium border-slate-300 rounded`)
       - Discount Reason dropdown: `Doctor Referral`, `Staff Discount`, `Camp Patient`, `Round-off`
     - Net Payable: `text-base font-bold text-slate-900`, Value: `text-lg font-black text-blue-700`
     - Paid Amount: Number input with large clear digits: `h-10 text-base font-bold text-slate-900 border-blue-400 focus:ring-blue-500`
     - Payment Mode Segmented Grid (`grid grid-cols-3 gap-2 mt-2`):
       - Buttons for `Cash`, `UPI / GPay`, `Debit/Credit Card`, `Cheque`, `Credit`, `Insurance`
     - Balance Display:
       - If `0`: `bg-emerald-50 text-emerald-800 border border-emerald-200 p-2.5 rounded-md text-xs font-bold flex items-center justify-between` -> "Full Payment Received"
       - If `> 0`: `bg-rose-50 text-rose-800 border border-rose-200 p-2.5 rounded-md text-xs font-bold flex items-center justify-between` -> "Balance Due: ₹..."
   - Primary Submit Button:
     - `w-full h-11 bg-[#1565c0] hover:bg-[#0d47a1] text-white text-sm font-bold rounded-md shadow-md transition-all`
     - Label: `Save & Enter Results (F2)`

---

### Screen 2: Printable Patient Bill & Receipt (`/cases/:id/bill`)

This view must render cleanly on screen and print identically on standard **A5 (Portrait/Landscape)** and **A4 paper**.

```
+---------------------------------------------------------------------------------------------------+
|  [LAB LOGO]              METROPOLIS DIAGNOSTICS & RESEARCH CENTER             Ph: +91 98765 43210 |
|                          104, Medical Enclave, Sector 14, Gurugram, India     Email: info@lab.com |
+---------------------------------------------------------------------------------------------------+
|                                     CASH RECEIPT / INVOICE                                        |
+---------------------------------------------------------------------------------------------------+
| Bill No:       #1001                              | Date & Time:   18-Oct-2026 10:30 PM           |
| Patient ID:    35375569                           | Age / Gender:  32 Y / Male                    |
| Patient Name:  MR. RAHUL SHARMA                   | Contact:       +91 9876543210                 |
| Ref. Doctor:   DR. ANIL VERMA (MBBS, MD)          | Sample Status: Collected                      |
+---------------------------------------------------------------------------------------------------+
| S.No | Investigation Name               | Specimen       | Delivery Date       | Net Amount (₹)   |
+------+----------------------------------+----------------+---------------------+------------------+
| 1.   | Complete Blood Count (CBC)       | Whole Blood    | 18-Oct-2026 11:30 PM|           400.00 |
+--------------------------------------------------------------------------------+------------------+
| Total Items: 1                                              Total Amount:      |           400.00 |
| Amount in Words: Rupees Four Hundred Only                   Discount:          |             0.00 |
| Payment Mode: Cash                                          Net Payable:       |           400.00 |
|                                                             Amount Received:   |           400.00 |
|                                                             Balance Due:       |             0.00 |
+--------------------------------------------------------------------------------+------------------+
|                                                                                                   |
|  [ QR Code ] Scan to download                                    _____________________________    |
|  Online Test Report & Receipt                                    Authorized Cashier Signature     |
|                                                                                                   |
+---------------------------------------------------------------------------------------------------+
```

#### Exact Print CSS Tokens
```css
@media print {
  @page {
    size: A5 portrait;
    margin: 10mm 12mm 10mm 12mm;
  }
  body {
    background-color: #ffffff !important;
    color: #000000 !important;
    font-family: 'Inter', Helvetica, Arial, sans-serif;
  }
  .no-print {
    display: none !important;
  }
  .receipt-table th {
    background-color: #f1f5f9 !important;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
}
```

---

### Screen 3: Enter Lab Results Screen (`/lab_reports/:id/edit`)

This screen is where lab technicians and pathologists record and validate biological parameters. It requires immediate visual feedback for abnormal values and formula recalculations.

```
+---------------------------------------------------------------------------------------------------+
| STICKY PATIENT SUMMARY BAR (Height: 48px, bg: #f1f5f9, border-b: #cbd5e1, px-4)                  |
| Patient: Rahul Sharma (32Y/M) | Bill: #1001 | Ref: Dr. Anil Verma | Registered: 18-Oct 10:30 PM    |
+---------------------------------------------------------------------------------------------------+
| RESULT FORMATTING TOOLBAR:                                                                        |
| [✓] Show Reference Ranges  [✓] Auto-flag Abnormals  [✓] Include Interpretation  [ Letterhead ▾ ] |
+---------------------------------------------------------------------------------------------------+
| INVESTIGATION: COMPLETE BLOOD COUNT (CBC) — HEMATOLOGY                                            |
| Method: Automated 5-Part Cell Counter                                                             |
+---------------------------------------------------------------------------------------------------+
| Parameter Name        | Value Input       | Unit      | Biological Ref. Range | Flag / Alert      |
+-----------------------+-------------------+-----------+-----------------------+-------------------+
| Hemoglobin (Hb)       | [ 13.5          ] | g/dL      | 13.0 - 17.0           | [ Normal        ] |
| Total RBC Count       | [ 4.5           ] | mil/cumm  | 4.5 - 5.5             | [ Normal        ] |
| Packed Cell Volume(PCV| [ 40.5          ] | %         | 40.0 - 50.0           | [ Auto-derived  ] |
| Mean Corp. Vol (MCV)  | [ 90.0          ] | fL        | 83.0 - 101.0          | [ Auto-derived  ] |
| Mean Corp. Hb (MCH)   | [ 30.0          ] | pg        | 27.0 - 32.0           | [ Auto-derived  ] |
| MCHC                  | [ 33.3          ] | g/dL      | 31.5 - 34.5           | [ Auto-derived  ] |
| Total Leucocyte Count | [ 11500         ] | /cumm     | 4000 - 11000          | [ ⚠ HIGH (Red)  ] |
| Neutrophils           | [ 72            ] | %         | 40 - 70               | [ ⚠ HIGH (Red)  ] |
| Lymphocytes           | [ 22            ] | %         | 20 - 40               | [ Normal        ] |
| Platelet Count        | [ 250000        ] | /cumm     | 150000 - 450000       | [ Normal        ] |
+---------------------------------------------------------------------------------------------------+
| CLINICAL INTERPRETATION / PATHOLOGY NOTES:                                                        |
| +-----------------------------------------------------------------------------------------------+ |
| | Mild leukocytosis with relative neutrophilia. Clinical correlation is recommended.            | |
| +-----------------------------------------------------------------------------------------------+ |
|                                                                                                   |
| BOTTOM ACTION BAR (Sticky bottom: 0, bg: white, border-t: #e2e8f0, py-3 px-6 flex justify-between)|
| [ Cancel ]                            [ Save Draft ]  [ Save & Preview ]  [ Sign Off & Authorize ]|
+---------------------------------------------------------------------------------------------------+
```

#### Field-Level Styling & Interaction Rules
1. **Normal Value Input:**
   - Background: `#ffffff`, Border: `1px solid #d1d5db`, Text: `#1e293b font-semibold`.
2. **Abnormal Value Input (Triggered on blur or live calculation):**
   - If `value > max` or `value < min`:
   - Border: `2px solid #b91c1c` (`red-700`)
   - Background: `#fef2f2` (`red-50`)
   - Text: `#b91c1c font-bold`
   - Flag Pill: `bg-rose-100 text-rose-800 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase` ("HIGH" or "LOW")
3. **Auto-Calculated Formula Parameters (e.g. MCV, MCH, MCHC, PCV):**
   - Background: `#f8fafc`, Border: `1px dashed #94a3b8`, Cursor: `not-allowed` or `readonly` (with override toggle icon).
   - Tooltip: `Formula: (PCV / RBC) * 10`.

---

### Screen 4: Verified Laboratory Report Viewer (`/lab_reports/:id/v2`)

The official patient report rendered in high fidelity. Includes medical headers, parameter tables, NABL compliance badges, doctor sign-offs, and dynamic security QR code.

```
+---------------------------------------------------------------------------------------------------+
|                                 ALPHA CLINICAL REFERENCE LAB                                      |
|                             An ISO 15189:2012 & NABL Accredited Lab                               |
|                     100 Innovation Park, Tech Zone, Bengaluru - 560100                            |
+---------------------------------------------------------------------------------------------------+
| PATIENT DEMOGRAPHIC TABLE (Clean 4-column borderless layout)                                      |
| Patient Name : MR. RAHUL SHARMA               PID / Case ID : #1001                               |
| Age / Gender : 32 YRS / MALE                  Registered On : 18-Oct-2026 10:30 PM                |
| Ref By Doctor: DR. ANIL VERMA, MD             Sample Drawn  : 18-Oct-2026 10:45 PM                |
+---------------------------------------------------------------------------------------------------+
|                               DEPARTMENT OF HEMATOLOGY                                            |
|                            COMPLETE BLOOD COUNT (CBC) REPORT                                      |
+---------------------------------------------------------------------------------------------------+
| TEST DESCRIPTION                 | VALUE OBSERVED | UNITS       | REFERENCE INTERVAL              |
+----------------------------------+----------------+-------------+---------------------------------+
| Hemoglobin (Hb)                  | 13.5           | g/dL        | 13.0 - 17.0                     |
| Total RBC Count                  | 4.5            | mil/cumm    | 4.5 - 5.5                       |
| Packed Cell Volume (PCV)         | 40.5           | %           | 40.0 - 50.0                     |
| Mean Corpuscular Volume (MCV)    | 90.0           | fL          | 83.0 - 101.0                    |
| Mean Corpuscular Hemoglobin (MCH)| 30.0           | pg          | 27.0 - 32.0                     |
| MCHC                             | 33.3           | g/dL        | 31.5 - 34.5                     |
| Total Leucocyte Count (TLC)      | 11,500 *       | /cumm       | 4,000 - 11,000                  |
| DIFFERENTIAL LEUCOCYTE COUNT     |                |             |                                 |
| - Neutrophils                    | 72 *           | %           | 40 - 70                         |
| - Lymphocytes                    | 22             | %           | 20 - 40                         |
| - Monocytes                      | 04             | %           | 02 - 10                         |
| - Eosinophils                    | 02             | %           | 01 - 06                         |
| - Basophils                      | 00             | %           | 00 - 02                         |
| Platelet Count                   | 250,000        | /cumm       | 150,000 - 450,000               |
+----------------------------------+----------------+-------------+---------------------------------+
| Note: Values marked with an asterisk (*) are outside the biological reference interval.           |
|                                                                                                   |
| INTERPRETATION:                                                                                   |
| Leukocytosis observed. Correlate clinically with infection/inflammatory etiology.                 |
|                                                                                                   |
| ------------------------------------ END OF REPORT --------------------------------------------- |
|                                                                                                   |
| [ QR CODE ]                          [ SIGNATURE STAMP 1 ]            [ SIGNATURE STAMP 2 ]       |
| Verified Digital Report              Medical Technologist             Dr. S. K. Mukherjee, MD Path|
| Scan to authenticate                 Registration: MLT-48192          Chief Consulting Pathologist|
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 5: Bills & Cases Table View (`/cases`)

The operations hub where receptionists and managers filter, search, print receipts, and track clinical workflows.

```
+---------------------------------------------------------------------------------------------------+
| CASES & BILLING LEDGER                                                       [ + New Bill Button ]|
+---------------------------------------------------------------------------------------------------+
| FILTER BAR (Flex wrap, items-center, gap-3, bg: white, p-3, rounded-lg, border: #e2e8f0):         |
| [ Date Range: Today (18-Oct) ▾ ] [ Department: All ▾ ] [ Status: All ▾ ] [ Paid Status: All ▾ ]    |
| [ Search by Name, Bill #, Phone...                                                ] [ Reset (↺) ] |
+---------------------------------------------------------------------------------------------------+
| KPI SUMMARY PILLS:                                                                                |
| Total Cases: 1  |  Total Billed: ₹400.00  |  Collected: ₹400.00  |  Due Balance: ₹0.00            |
+---------------------------------------------------------------------------------------------------+
| DATA TABLE:                                                                                       |
| [✓] | Bill # | Date/Time | Patient Name | Ref Doctor | Tests | Total | Paid | Due | Status | Action |
|-----+--------+-----------+--------------+------------+-------+-------+------+-----+--------+--------|
| [ ] | #1001  | 10:30 PM  | Rahul Sharma | Dr. A.Verma| CBC   | ₹400  | ₹400 | ₹0  | [Signed| [••• ▾]|
|     |        |           | 32Y / M      |            |       |       |      |     |  Off ] |        |
+---------------------------------------------------------------------------------------------------+
| PAGINATION & DENSITY BAR:                                                                         |
| Showing 1 to 1 of 1 cases                          Rows per page: [ 25 ▾ ]  < Previous [ 1 ] Next >|
+---------------------------------------------------------------------------------------------------+
```

#### Status Badge CSS Mapping
- **Status: Signed Off / Completed:**  
  `bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full`
- **Status: Pending Results:**  
  `bg-amber-50 text-amber-700 border border-amber-200 text-[11px] font-bold px-2 py-0.5 rounded-full`
- **Status: Partial / In Progress:**  
  `bg-sky-50 text-sky-700 border border-sky-200 text-[11px] font-bold px-2 py-0.5 rounded-full`
- **Due Badge (Balance > 0):**  
  `bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold px-2 py-0.5 rounded-full`
- **Paid Badge (Balance == 0):**  
  `bg-slate-100 text-slate-600 text-[11px] font-medium px-2 py-0.5 rounded-full`

#### Action Dropdown Menu Items (`[••• ▾]`)
1. `View Report (PDF)`
2. `Enter / Edit Results`
3. `Print Bill Receipt`
4. `Collect Due Payment`
5. `Send WhatsApp / SMS Link`
6. `Cancel / Refund Bill`

---

### Screen 6: Daily Business & Cashier Till Reconciliation (`/business_reports/daily_business`)

Provides real-time business health, breakdown across payment modes, and cashier shift handover calculations.

#### Top Metric Cards (Grid: 4 Equal Columns)
```
+--------------------+ +--------------------+ +--------------------+ +--------------------+
| GROSS REVENUE      | | DISCOUNTS GIVEN    | | NET COLLECTIONS    | | DUES RECEIVABLE    |
| ₹400.00            | | ₹0.00              | | ₹400.00            | | ₹0.00              |
| 1 Total Cases      | | 0% Discount Rate   | | 100% Realized      | | All settled        |
+--------------------+ +--------------------+ +--------------------+ +--------------------+
```

#### Card Style
- Background: `#ffffff`, Border: `1px solid #e2e8f0`, Radius: `8px`, Padding: `20px`.
- Heading: `text-xs font-bold uppercase tracking-wider text-slate-500`.
- Number: `text-2xl font-black text-slate-900 mt-1`.
- Footnote: `text-xs text-slate-400 mt-1`.

#### Payment Mode Breakdown Card
| Payment Mode | Total Collections (₹) | Transaction Count | % Share |
| :--- | :--- | :--- | :--- |
| **Cash** | `₹400.00` | 1 | 100% |
| **UPI / QR (PhonePe / GPay)** | `₹0.00` | 0 | 0% |
| **Debit / Credit Card** | `₹0.00` | 0 | 0% |
| **Cheque / Bank Transfer** | `₹0.00` | 0 | 0% |

#### Cashier Balancing Drawer
- **Opening Cash Balance:** Input field (e.g. `₹1,000.00`)
- **+ Cash Collected Today:** `₹400.00`
- **- Cash Expenses Paid Out:** `₹30.00` (e.g. Diluent purchase)
- **= Expected Physical Cash in Till:** `₹1,370.00`
- **Physical Cash Counted:** Cashier input field
- **Discrepancy (Over / Short):** Calculated badge (`₹0.00 Balanced`)

---

### Screen 7: Expenses & Outflow Tracker (`/expenses`)

Tracks daily operational clinic expenses (reagents, courier, tea/snacks, staff advance) to calculate true net margin.

#### Add Expense Modal Blueprint
```
+---------------------------------------------------------------------------------------------------+
| RECORD NEW EXPENSE                                                                            [✕]|
+---------------------------------------------------------------------------------------------------+
| Expense Category:   [ Select Category (e.g. Lab Consumables, Courier, Rent) ▾ ]                  |
| Amount Paid (₹):    [ 30.00                                                   ]                  |
| Paid To / Vendor:   [ Transasia Bio-Medicals Ltd                              ]                  |
| Payment Mode:       [ (•) Cash   ( ) UPI   ( ) Cheque   ( ) Card              ]                  |
| Expense Date:       [ 18-Oct-2026                                             ]                  |
| Description:        [ Diluent pack & hematology cleaner pack                  ]                  |
| Attach Receipt:     [ Drag and drop invoice or click to browse (Max 5MB)      ]                  |
+---------------------------------------------------------------------------------------------------+
| [ Cancel ]                                                                [ Save Expense Voucher ]|
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 8: Global Omnisearch Modal (`Ctrl + K`)

A high-speed modal that allows jumping to any patient, bill, doctor, or test in fewer than 2 keystrokes.

```
+---------------------------------------------------------------------------------------------------+
| [ Search Icon ]  Type a patient name, phone, bill number, or doctor...            [ Esc to Close ]|
+---------------------------------------------------------------------------------------------------+
| FILTERS: [ All (Active) ] [ Bills ] [ Patients ] [ Doctors ] [ Tests ]                            |
+---------------------------------------------------------------------------------------------------+
| RECENT RESULTS:                                                                                   |
|                                                                                                   |
| [ Case Icon ]  #1001 — Rahul Sharma (32Y / M)                                     [ 18-Oct-2026 ] |
|                Complete Blood Count (CBC) • Dr. Anil Verma • ₹400 (Paid)                          |
|                                                                                                   |
| [ Patient ]    Rahul Sharma (+91 9876543210)                                      [ 1 Total Case]|
|                UHID: 35375569 • Gurugram                                                          |
|                                                                                                   |
| [ Doctor ]     Dr. Anil Verma (MBBS, MD)                                          [ Active Ref ]  |
|                1 Referred Case • Gurugram                                                         |
|                                                                                                   |
| [ Test ]       Complete Blood Count (CBC)                                         [ ₹400.00 ]     |
|                Department: Hematology • Specimen: EDTA Whole Blood                                |
+---------------------------------------------------------------------------------------------------+
| Navigation: [ ↑ ][ ↓ ] to navigate    [ ↵ ] to select    [ Esc ] to dismiss                       |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 9: Main Operations Dashboard (`/dashboard` or `/71122710`)

The executive dashboard provides real-time situational awareness of today's patient volume, financial intake, lab turnaround progress, and urgent clinical alerts.

```
+---------------------------------------------------------------------------------------------------+
| DASHBOARD — TODAY (18-OCT-2026)                                              [ + New Bill Button ]|
+---------------------------------------------------------------------------------------------------+
| 4-COLUMN KPI METRIC CARDS ROW:                                                                    |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
| | TOTAL CASES TODAY  | | TODAY'S REVENUE    | | PENDING REPORTS    | | DUES RECEIVABLE    |       |
| | 1                  | | ₹400.00            | | 0                  | | ₹0.00              |       |
| | +100% vs yesterday | | 100% Cash Realized | | 1 Signed Off (100%)| | All accounts clear |       |
| +--------------------+ +--------------------+ +--------------------+ +--------------------+       |
+---------------------------------------------------------------------------------------------------+
| 2-COLUMN MAIN BODY GRID (65% Left / 35% Right):                                                   |
|                                                                                                   |
| LEFT CARD: TODAY'S CLINICAL WORKFLOW FUNNEL          | RIGHT CARD: QUICK ACTIONS & SHORTCUTS      |
| +--------------------------------------------------+ | +----------------------------------------+ |
| | Registered / Billed       | 1 Patient (100%)    | | | [ + Register Walk-in Patient (Alt+N)  ] | |
| | Sample Collected          | 1 Sample  (100%)    | | | [ 🔍 Omnisearch Record (Ctrl+K)       ] | |
| | Processing / Analyzers    | 0 In Queue          | | | [ 💸 Record Daily Expense             ] | |
| | Results Entered           | 1 Pending Sign-off  | | | [ 🖨 Batch Print Barcode Labels      ] | |
| | Signed Off & Delivered    | 1 Complete (100%)   | | | [ 📊 View Daily Business Report       ] | |
| +--------------------------------------------------+ | +----------------------------------------+ |
|                                                      |                                            |
| RECENT REGISTRATIONS (LATEST 5 CASES):               | TODAY'S COLLECTION BREAKDOWN:              |
| +--------------------------------------------------+ | +----------------------------------------+ |
| | #1001 | Rahul Sharma | CBC | ₹400 | Signed Off   | | | Cash:        ₹400.00  (100%)           | |
| +--------------------------------------------------+ | | UPI / Digital:   ₹0.00    (0%)           | |
| [ View All Cases in Ledger → ]                       | | Card:            ₹0.00    (0%)           | |
|                                                      | +----------------------------------------+ |
+------------------------------------------------------+--------------------------------------------+
```

#### CSS & Layout Parameters
- **Top Metric Cards:** `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6`
- **Funnel Progress Bar:** `h-2 rounded-full bg-slate-100 overflow-hidden flex` with `bg-blue-600` fill.
- **Quick Action Buttons:** `w-full h-10 px-3.5 bg-slate-50 hover:bg-blue-50 hover:text-blue-700 border border-slate-200 rounded-md text-xs font-semibold flex items-center transition-colors mb-2`

---

### Screen 10: Outsource Cases Management Hub (`/cases/outsource`)

Used to track specialized tests (e.g. Biopsy, Genetic karyotyping, RT-PCR) sent to external B2B partner laboratories (Thyrocare, Dr. Lal PathLabs, SRL).

```
+---------------------------------------------------------------------------------------------------+
| OUTSOURCED INVESTIGATIONS WORKLIST                                      [ + Dispatch Manifest ]   |
+---------------------------------------------------------------------------------------------------+
| FILTER BAR:                                                                                       |
| [ Partner Lab: All Labs ▾ ] [ Dispatch Status: Sent ▾ ] [ Date Range: Last 7 Days ▾ ] [ Search... ]|
+---------------------------------------------------------------------------------------------------+
| DATA TABLE:                                                                                       |
| [✓] | Bill # | Patient Name | Outsource Test | Partner Lab | Sample Sent Date | B2B Cost | Status   |
|-----+--------+--------------+----------------+-------------+------------------+----------+----------|
| [ ] | #0998  | Meena Gupta  | Biopsy Skin    | SRL Labs    | 16-Oct 04:00 PM  | ₹650.00  | [In Lab] |
| [ ] | #0992  | Vikram Roy   | HLA B27 PCR    | Thyrocare   | 15-Oct 11:30 AM  | ₹850.00  | [Result ]|
|     |        |              |                |             |                  |          | [Recvd ] |
+---------------------------------------------------------------------------------------------------+
| BOTTOM ACTION TILL:                                                                               |
| Selected: 0 Cases | Total B2B Payable: ₹0.00       [ Upload Partner Report PDF ] [ Mark Received ]|
+---------------------------------------------------------------------------------------------------+
```

#### Outsource Modal: Record Outsource Dispatch
- **Fields:** `Partner Lab Select2 Dropdown`, `Courier / Delivery Boy Name`, `Tracking / AWB Number`, `Estimated Report Date`, `B2B Negotiated Cost (₹)`.

---

### Screen 11: CT Scan & Specialized Radiology Cases (`/cases/ct_scan`)

A dedicated workflow for advanced radiology imaging requiring DICOM routing, contrast tracking, and specialized radiologist assignments.

```
+---------------------------------------------------------------------------------------------------+
| CT SCAN & ADVANCED RADIOLOGY REGISTRATION                                                         |
+---------------------------------------------------------------------------------------------------+
| 2-COLUMN SPLIT:                                                                                   |
| LEFT: CASE & SCAN PROTOCOL SPECIFICATION             | RIGHT: RADIOLOGIST ASSIGNMENT & PACS       |
| [ Scan Modality: CT Scan (Computed Tomography)  ]    | [ Reporting Radiologist Select ▾ ]         |
| [ Protocol / Anatomy: (•) Brain ( ) Chest ( ) Abdo ] | [ TAT Priority: ( ) Normal  (•) Urgent ]   |
| [ Contrast Study: [✓] IV Contrast Administered     ] | [ DICOM Study UID / Accession: Auto      ] |
| [ Creatinine Value Pre-check: [ 0.9 ] mg/dL        ] | [ Attach DICOM CD / Files Link           ] |
| [ Clinical History: Headache, rule out trauma      ] | [ Print Work Order / Patient Consent Form] |
+------------------------------------------------------+--------------------------------------------+
| [ Cancel ]                                                  [ Register Case & Generate Barcode ]  |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 12: Today's Reports Worklist (`/lab_reports/today`)

The real-time operations screen used inside the laboratory by sample handlers, technicians, and pathologists.

```
+---------------------------------------------------------------------------------------------------+
| TODAY'S LABORATORY WORKLIST                                              Auto-Refresh: [ 30s ▾ ]  |
+---------------------------------------------------------------------------------------------------+
| WORKLIST STATUS TABS (Horizontal bar with live count badges):                                     |
| [ All (1) ]  [ Pending Collection (0) ]  [ In Process (0) ]  [ Pending Sign-off (0) ]  [ Signed (1)]|
+---------------------------------------------------------------------------------------------------+
| BULK ACTION TOOLBAR (Appears when rows selected):                                                 |
| [ Select All ] | [ 🖨 Bulk Print Barcodes ] | [ 🖨 Bulk Print Reports ] | [ 💬 WhatsApp All Signed ]|
+---------------------------------------------------------------------------------------------------+
| WORKLIST TABLE:                                                                                   |
| [✓] | Barcode | Bill # | Patient Name | Department  | Test Name | Collected | Results | Action    |
|-----+---------+--------+--------------+-------------+-----------+-----------+---------+-----------|
| [✓] | 1001-01 | #1001  | Rahul Sharma | Hematology  | CBC       | [✓] 10:45 | [✓] Done| [View/PDF]|
|     |         |        | 32Y / M      |             |           |           |         | [Re-Sign ]|
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 13: Historical Search Reports Archive (`/lab_reports/search`)

Allows searching through years of patient test records using any combination of medical or personal parameters.

```
+---------------------------------------------------------------------------------------------------+
| ARCHIVED REPORTS SEARCH ENGINE                                                                    |
+---------------------------------------------------------------------------------------------------+
| SEARCH FILTER CARD (Grid 3-columns with border):                                                  |
| From Date:    [ 01-Jan-2026 ]        To Date:      [ 18-Oct-2026 ]        Modality:   [ All     ▾ ]|
| Patient Name: [             ]        Mobile No:    [             ]        Ref Doctor: [ All     ▾ ]|
| Test Name:    [ Select Test ▾]       Barcode ID:   [             ]        UHID / MRN: [             ]|
| [ Reset All Filters ]                                                     [ 🔍 Search Archives   ]|
+---------------------------------------------------------------------------------------------------+
| RESULTS FOUND (1 RECORD):                                                                         |
| Bill # | Date      | Patient Details | Test Profiles | Ref Doctor | Verified By | Actions         |
|--------+-----------+-----------------+---------------+------------+-------------+-----------------|
| #1001  | 18-Oct-26 | Rahul Sharma 32M| CBC           | Dr.A.Verma | Dr.S.K.MD   | [PDF] [WhatsApp]|
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 14: USG (Ultrasound) Reporting Module (`/usg_reports` or edit)

A specialized text and macro-driven report editor for Sonologists with pre-built organ templates.

```
+---------------------------------------------------------------------------------------------------+
| ULTRASOUND (USG) REPORT GENERATOR — CASE #1002                                                    |
+---------------------------------------------------------------------------------------------------+
| TEMPLATE SELECTOR:                                                                                |
| [ Select Organ / Study Template: USG Whole Abdomen & Pelvis (Male) ▾ ] [ Load Standard Normal ]  |
+---------------------------------------------------------------------------------------------------+
| RICH TEXT ORGAN-BY-ORGAN EDITOR:                                                                  |
| +-----------------------------------------------------------------------------------------------+ |
| | LIVER: Normal in size (14.2 cm), regular margins and uniform parenchymal echotexture. No focal  | |
| | lesion or intrahepatic biliary radicle dilatation (IHBRD) seen. Vascular architecture normal.| |
| |                                                                                               | |
| | GALL BLADDER: Well distended, lumen is anechoic. Wall thickness is normal (2.2 mm). No stone. | |
| |                                                                                               | |
| | SPLEEN: Normal in size (9.8 cm) with homogenous echotexture.                                  | |
| |                                                                                               | |
| | KIDNEYS: Both kidneys are normal in size, shape, and position. Corticomedullary distinction   | |
| | is well maintained. Right Kidney: 10.4 cm, Left Kidney: 10.8 cm. No calculus or hydronephrosis| |
| |                                                                                               | |
| | URINARY BLADDER: Well distended, walls normal. Pre-void vol: 320 ml, Post-void: 15 ml.        | |
| |                                                                                               | |
| | IMPRESSION:                                                                                   | |
| | NORMAL STUDY OF WHOLE ABDOMEN. NO SIGNIFICANT SONOLOGICAL ABNORMALITY DETECTED.               | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| [ Attach Ultrasound Image Captures (Max 6) ]               [ Save Draft ]  [ Sign & Finalize ]    |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 15: Digital X-Ray Reporting Module (`/xray_reports`)

Standardized radiographic reporting screen with anatomical views and radiation safety disclaimers.

```
+---------------------------------------------------------------------------------------------------+
| DIGITAL X-RAY REPORT EDITOR — CASE #1003                                                          |
+---------------------------------------------------------------------------------------------------+
| EXAMINATION: [ X-RAY CHEST PA VIEW ▾ ] [ Load Normal Chest Template ]                            |
+---------------------------------------------------------------------------------------------------+
| CLINICAL FINDINGS EDITOR:                                                                         |
| +-----------------------------------------------------------------------------------------------+ |
| | - Both lung fields are clear. No active parenchymal lesion, consolidation or infiltration.    | |
| | - Bronchovascular markings are normal.                                                        | |
| | - Costophrenic and cardiophrenic angles are clear on both sides.                              | |
| | - Cardiac size and configuration are within normal limits (Cardiothoracic ratio < 50%).        | |
| | - Hilar shadows appear normal. Dome of diaphragm is smooth and normal in contour.             | |
| | - Bony thorax and soft tissues show no significant abnormality.                               | |
| |                                                                                               | |
| | IMPRESSION: NORMAL CHEST RADIOGRAPH.                                                          | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
| [ Cancel ]                                                    [ Save & Preview ] [ Sign Off ]     |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 16: Patients Directory & Medical History Drawer (`/patients`)

Master directory of all registered patients with longitudinal health records, cumulative trends, and billing history.

```
+---------------------------------------------------------------------------------------------------+
| PATIENT REGISTRY & CLINICAL DOSSIERS                                      [ + Register Patient ]  |
+---------------------------------------------------------------------------------------------------+
| SEARCH & FILTERS:                                                                                 |
| [ Search by Name, Mobile Number, UHID / Aadhaar...                                              ] |
+---------------------------------------------------------------------------------------------------+
| PATIENT CARDS TABLE:                                                                              |
| UHID      | Full Name    | Age/Sex | Mobile Number  | Total Visits | Last Visit Date | Action     |
|-----------+--------------+---------+----------------+--------------+-----------------+------------|
| 35375569  | Rahul Sharma | 32Y / M | +91 9876543210 | 1 Case       | 18-Oct-2026     | [View File]|
+---------------------------------------------------------------------------------------------------+
```

#### Slide-Over Patient History Drawer (Opens on clicking `[View File]`):
- **Width:** `520px` right slide-over (`fixed inset-y-0 right-0 z-50 bg-white shadow-2xl`).
- **Header:** Patient Name, Avatar, Age/Sex, Blood Group, Mobile, Address.
- **Tab 1: Visits & Bills Timeline:** Chronological list of all bills, total spent, outstanding dues.
- **Tab 2: Cumulative Lab Trends:** Trend chart showing parameter changes over time (e.g. Blood Sugar FBS/PPBS or Hemoglobin plotted across months).
- **Tab 3: Attached Documents:** Uploaded doctor prescription photos, previous external reports.

---

### Screen 17: Referring Doctors Master & Commission Setup (`/doctors`)

Manages referral doctors, their qualification credentials, contact information, and automated commission sharing tariffs.

```
+---------------------------------------------------------------------------------------------------+
| REFERRING DOCTOR DIRECTORY & COMMISSION CONFIGURATION                      [ + Add New Doctor ]   |
+---------------------------------------------------------------------------------------------------+
| Search Doctor: [ Search name, clinic, speciality... ]                                             |
+---------------------------------------------------------------------------------------------------+
| DOCTORS TABLE:                                                                                    |
| Doctor Name              | Speciality     | Mobile / Email | Referred Cases | Comm. Type | Action |
|--------------------------+----------------+----------------+----------------+------------+--------|
| Dr. Anil Verma, MBBS, MD | Internal Med.  | +91 9811223344 | 1 Case (₹400)  | Percentage | [Edit] |
|                          | Verma Clinic   | anil@doc.com   |                | [ 15% ]    | [Incent|
+---------------------------------------------------------------------------------------------------+
```

#### Add / Edit Doctor Modal Form
- **Inputs:** `Doctor Prefix (Dr.)`, `Full Name`, `Qualifications (e.g. MBBS, MD, MS)`, `Medical Council Reg. No.`, `Speciality Dropdown`, `Clinic / Hospital Name`, `Mobile Number`, `Email`, `Bank Account Details (for automated incentive payouts)`.
- **Incentive Rule:**
  - Flat Percentage across all tests (e.g. `15%`).
  - Department-wise breakdown: `Hematology: 15%`, `Biochemistry: 15%`, `Microbiology: 20%`, `USG: 25%`, `X-Ray: 20%`.
  - Excluded tests checklist (e.g., outsourced tests excluded from commission).

---

### Screen 18: Collection Centers & B2B Agents Master (`/agents`)

Configures external sample collection phlebotomy points, franchise centers, and B2B client pricing.

```
+---------------------------------------------------------------------------------------------------+
| COLLECTION CENTERS & FRANCHISE AGENTS                                       [ + Add Center ]      |
+---------------------------------------------------------------------------------------------------+
| AGENTS TABLE:                                                                                     |
| Center / Agent Name    | Code   | Contact Person | Phone Number | Pricing Tier | Balance | Action |
|------------------------+--------+----------------+--------------+--------------+---------+--------|
| City Care Collection   | AG-102 | Rajesh Kumar   | 9871100223   | B2B Rate B   | ₹1,200  | [Edit] |
| Sector 56 Branch       | AG-105 | Pooja Mehra    | 9810099881   | Standard     | ₹0 (Nil)| [Ledger|
+---------------------------------------------------------------------------------------------------+
```

#### Agent Configuration Parameters
- **Credit Limit:** Maximum allowed outstanding bill amount before automatic registration block.
- **Portal Access:** Checkbox `[✓] Allow Web Login` with auto-generated Username & Password.
- **Reporting Rule:** `[✓] Hide lab pricing on final patient report generated by this center`.

---

### Screen 19: Test Master & Biological Parameter Formula Builder (`/tests`)

The central scientific database of the laboratory. Defines every diagnostic test, sub-parameters, units, reference intervals, and auto-calculation expressions.

```
+---------------------------------------------------------------------------------------------------+
| TEST MASTER DATABASE & PARAMETER CATALOG                                    [ + Add New Test ]    |
+---------------------------------------------------------------------------------------------------+
| SEARCH & FILTER:                                                                                  |
| [ Department: Hematology ▾ ] [ Sample Type: All ▾ ] [ Search test name or short code...         ] |
+---------------------------------------------------------------------------------------------------+
| CATALOG TABLE:                                                                                    |
| Short Code | Test Investigation Name   | Department | Specimen / Tube | Base Rate | Sub-Params | Edit |
|------------+---------------------------+------------+-----------------+-----------+------------+------|
| CBC        | Complete Blood Count      | Hematology | EDTA Whole Blood| ₹400.00   | 18 params  | [✏️] |
| LFT        | Liver Function Test       | Biochem    | Plain Serum     | ₹800.00   | 11 params  | [✏️] |
| KFT / RFT  | Kidney Function Test      | Biochem    | Plain Serum     | ₹700.00   | 8 params   | [✏️] |
| LIPID      | Lipid Profile             | Biochem    | Fasting Serum   | ₹650.00   | 7 params   | [✏️] |
+---------------------------------------------------------------------------------------------------+
```

#### Test Configuration Slide-Over Drawer (Editing CBC)
- **General Tab:**
  - `Test Name`: `Complete Blood Count`
  - `Short Code`: `CBC`
  - `Department`: `Hematology`
  - `Specimen / Container`: `Whole Blood / Lavender (EDTA) Top Tube`
  - `Standard Turnaround Time (TAT)`: `2 Hours`
  - `Retail Price (₹)`: `400.00` | `B2B Price (₹)`: `220.00`
- **Sub-Parameters & Biological Reference Ranges Grid:**
  - Parameter row: `[ Parameter Name ] [ Unit ] [ Min Age ] [ Max Age ] [ Gender ] [ Lower Bound ] [ Upper Bound ]`
  - Example: `Hemoglobin | g/dL | 18 | 65 | Male | 13.0 | 17.0`
  - Example: `Hemoglobin | g/dL | 18 | 65 | Female | 12.0 | 15.0`
- **Formula Builder Accordion:**
  - Auto-calculated parameters configure mathematical relations:
    - `PCV`: Expression = `(Hb * 3)`
    - `MCV`: Expression = `(PCV / RBC) * 10`
    - `MCH`: Expression = `(Hb / RBC) * 10`
    - `MCHC`: Expression = `(Hb / PCV) * 100`

---

### Screen 20: Test Packages & Health Checkup Profiles (`/packages`)

Bundles multiple individual diagnostic tests into marketable preventive health packages with discounted pricing.

```
+---------------------------------------------------------------------------------------------------+
| HEALTH PACKAGES & PROFILES                                                  [ + Create Package ]  |
+---------------------------------------------------------------------------------------------------+
| PACKAGES GRID:                                                                                    |
| +-----------------------------------------------+ +-----------------------------------------------+ |
| | EXECUTIVE HEALTH CHECKUP                      | | BASIC FEVER PROFILE                           | |
| | Includes 4 Profiles (62 Parameters):          | | Includes 3 Tests (24 Parameters):             | |
| | - Complete Blood Count (CBC)                  | | - Complete Blood Count (CBC)                  | |
| | - Liver Function Test (LFT)                   | | - Widal Slide Agglutination                   | |
| | - Kidney Function Test (KFT)                  | | - Malarial Antigen (Card)                     | |
| | - Lipid Profile                               | |                                               | |
| | Total Test Value: ₹2,550.00                   | | Total Test Value: ₹950.00                     | |
| | Package Price:    ₹1,499.00  (Save 41%)       | | Package Price:    ₹699.00  (Save 26%)         | |
| | [ Edit Package ] [ Duplicate ]                | | [ Edit Package ] [ Duplicate ]                | |
| +-----------------------------------------------+ +-----------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 21: Clinical Interpretations Library (`/interpretations`)

A rich knowledge base of standardized medical impressions, clinical correlations, and pathology notes that automatically attach to reports when certain diseases are diagnosed.

```
+---------------------------------------------------------------------------------------------------+
| CLINICAL INTERPRETATION & OPINION LIBRARY                                   [ + Add New Snippet ] |
+---------------------------------------------------------------------------------------------------+
| Search Snippet: [ Search by disease name, tag, or keyword...                                    ] |
+---------------------------------------------------------------------------------------------------+
| LIBRARY TABLE:                                                                                    |
| Title / Diagnosis Tag        | Department | Associated Tests | Preview Content             | Edit |
|------------------------------+------------+------------------+-----------------------------+------|
| Microcytic Hypochromic Anemia| Hematology | CBC, Ferritin    | Suggestive of iron deficien | [✏️] |
| Dengue Serology Positive     | Serology   | Dengue NS1 / IgM | Presence of Dengue NS1 anti | [✏️] |
| Diabetic Glycemic Dysregulati| Biochem    | HbA1c, FBS, PPBS | Poor glycemic control with  | [✏️] |
| Urinary Tract Infection      | Micro      | Urine R/M        | Marked pyuria and bacteriuri| [✏️] |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 22: Referral Business & Doctor Incentive Ledger (`/business_reports/referral_business`)

Enables lab administrators to track business generated by external medical practitioners and reconcile monthly referral payouts.

```
+---------------------------------------------------------------------------------------------------+
| REFERRAL BUSINESS & INCENTIVE LEDGER                                        [ 📥 Export Excel ]   |
+---------------------------------------------------------------------------------------------------+
| FILTERS: Date Range: [ Current Month (01-Oct to 18-Oct) ▾ ] [ Doctor: All Doctors ▾ ]             |
+---------------------------------------------------------------------------------------------------+
| KPI METRICS:                                                                                      |
| Total Referred Cases: 1 | Billed Volume: ₹400.00 | Net Incentive Calculated: ₹60.00 | Paid: ₹0.00 |
+---------------------------------------------------------------------------------------------------+
| LEDGER TABLE:                                                                                     |
| Doctor Name    | Total Patients | Gross Revenue | Discount | Net Billed | Comm % | Incentive | Pay|
|----------------+----------------+---------------+----------+------------+--------+-----------+----|
| Dr. Anil Verma | 1 Case         | ₹400.00       | ₹0.00    | ₹400.00    | 15%    | ₹60.00    |[Pay|
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 23: Dues & Credit Receivables Recovery (`/dues` or `/cases?payment_status=due`)

Dedicated financial collection desk to track and recover unsettled patient bills.

```
+---------------------------------------------------------------------------------------------------+
| DUES & RECEIVABLES RECOVERY DESK                                                                  |
+---------------------------------------------------------------------------------------------------+
| AGING BUCKETS PILLS:                                                                              |
| [ All Dues (₹0.00) ]  [ 0-7 Days (₹0.00) ]  [ 8-30 Days (₹0.00) ]  [ > 30 Days Overdue (₹0.00) ]  |
+---------------------------------------------------------------------------------------------------+
| DUES TABLE:                                                                                       |
| Bill # | Bill Date | Patient Name | Phone Number | Total Bill | Paid | Due Balance | Action       |
|--------+-----------+--------------+--------------+------------+------+-------------+--------------|
| (No overdue accounts pending. All current patient bills are settled in full.)                     |
+---------------------------------------------------------------------------------------------------+
```

#### One-Click Payment Reminder Modal (When Due > 0)
- Sends automated WhatsApp / SMS payment link with integrated UPI QR code directly to the patient's phone.

---

### Screen 24: Comprehensive Lab Setup & Administration Hub (`/settings`)

The system configuration cockpit containing 7 core submodules accessible via vertical tabs.

```
+---------------------------------------------------------------------------------------------------+
| LAB SMART CONFIGURATION & SYSTEM PREFERENCES                                                      |
+---------------------------------------------------+-----------------------------------------------+
| SUBMODULE TABS (Left Width: 240px)                | CONFIGURATION CANVAS                          |
|                                                   |                                               |
| [•] 1. Center & Branch Details                    | CENTER & BRANCH PROFILE                       |
| [ ] 2. Letterhead & Print Designer                |                                               |
| [ ] 3. SMS & WhatsApp Notifications               | Laboratory Name:                              |
| [ ] 4. Sample Tracking & Barcodes                 | [ Metropolis Diagnostics & Research Center  ] |
| [ ] 5. Staff Accounts & Permissions               |                                               |
| [ ] 6. Browser Security & IP Whitelist            | Branch Registration / License Number:         |
| [ ] 7. Subscription & Pricing Plan                | [ DL-GGM-LAB-2024-98102                     ] |
|                                                   |                                               |
|                                                   | Address Line 1:                               |
|                                                   | [ 104, Medical Enclave, Sector 14           ] |
|                                                   |                                               |
|                                                   | City, State, Pincode:                         |
|                                                   | [ Gurugram, Haryana, 122001                 ] |
|                                                   |                                               |
|                                                   | Official Contact Phone:                       |
|                                                   | [ +91 98765 43210                           ] |
|                                                   |                                               |
|                                                   | Lab Brand Logo (PNG / JPG):                   |
|                                                   | [ Choose File ] current_logo.png (180x60 px)  |
|                                                   |                                               |
|                                                   | [ Save Branch Settings ]                      |
+---------------------------------------------------+-----------------------------------------------+
```

#### 24.2 Letterhead & Print Layout Designer Submodule
- **Header Margin:** Slider / Number input `0 mm` to `60 mm` (Set to `45 mm` if printing on pre-printed doctor letterhead).
- **Footer Margin:** Slider `0 mm` to `50 mm` for doctor signatures and accreditation logos.
- **Watermark Toggle:** `[✓] Print faint laboratory logo in background of report`.
- **QR Code Toggle:** `[✓] Print report authentication QR code on bottom left`.

#### 24.3 SMS & WhatsApp Messaging Gateway Submodule
- **DLT Gateway Credentials:** PE ID, Sender ID (e.g. `LABSMT`), Template ID.
- **Automated Event Triggers (Checkboxes):**
  - `[✓] Send Bill Receipt SMS upon Case Registration`
  - `[✓] Send WhatsApp message with Download Link when Report is Signed Off`
  - `[✓] Send Payment Due Reminder SMS after 48 hours`

#### 24.4 Sample Tracking & Barcode Generation Submodule
- **Barcode Format:** `Code128` / `Code39`.
- **Barcode Content:** `Bill No + Sample Type Code` (e.g. `1001-EDTA`).
- **Printer Type:** `Standard Desktop (A4 24-in-1 sticker)` vs `Thermal Barcode Printer (50mm x 25mm roll)`.

#### 24.5 Staff Logins, Roles & Granular Permissions Submodule
| Role Name | Access Permissions |
| :--- | :--- |
| **Super Admin / Owner** | Full unrestricted access to all screens, financial ledgers, and master settings |
| **Receptionist / Front Desk** | Create bills, collect money, search patient files. Restricted from editing test masters |
| **Lab Technologist** | Enter test values, run machine interfaces. Restricted from deleting bills or seeing profits |
| **Consulting Pathologist** | Verify, edit, sign off and authorize clinical test reports. Digital signature enabled |

#### 24.6 Browser Security & Restrictive Access Submodule
- **Authorized IP Whitelist:** Restricts staff logins only to laboratory broadband Wi-Fi router IP.
- **Session Auto-Logout:** Idle timeout dropdown (`15 mins`, `30 mins`, `1 Hour`, `Never`).
- **Device Fingerprint Binding:** Requires 2-factor OTP authorization when logging in from a new computer.

#### 24.7 Subscription & Pricing Plans Submodule
- Displays current active plan (`Labsmart Cloud Professional`), remaining subscription days, SMS pack credits balance, and tax invoices.

---

### Screen 25: System Activities & Audit Trail (`/activities`)

Chronological security and operational audit trail logging every interaction across all laboratory terminals.

```
+---------------------------------------------------------------------------------------------------+
| ACTIVITIES & OPERATIONAL AUDIT TRAIL                                                              |
+---------------------------------------------------------------------------------------------------+
| SEARCH & FILTERS:                                                                                 |
| [ Search user, bill #, IP...                                ] [ Event Type: All Events ▾ ] [ Today ▾ ]|
+---------------------------------------------------------------------------------------------------+
| AUDIT TABLE:                                                                                      |
| Timestamp       | Staff Member        | Event Type      | Details / Description        | Client IP|
|-----------------+---------------------+-----------------+------------------------------+----------|
| 19-Oct 12:13 AM | Gopalkrishna P.     | Report Signed   | Report signed for Bill #1001 | 182.74.. |
| 18-Oct 10:35 PM | Gopalkrishna P.     | Result Entered  | Saved CBC parameters         | 182.74.. |
| 18-Oct 10:30 PM | Gopalkrishna P.     | Case Registered | Created Bill #1001 (Rahul)   | 182.74.. |
| 18-Oct 06:51 PM | Gopalkrishna P.     | Session Login   | Terminal authorized [123E]   | 182.74.. |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 26: Case Wise Detailed Business Report (`/case_wise_business_report/new`)

Comprehensive itemized accounting report with multi-modality filtering.

```
+---------------------------------------------------------------------------------------------------+
| CASE WISE BUSINESS REPORT GENERATOR                                                               |
+---------------------------------------------------------------------------------------------------+
| CONFIGURATION FORM:                                                                               |
| [✓] Exclude cancelled cases                                                                       |
| Collection centre: [ Main ▾ ]                   On Date: [ 19/10/2026 📅 ]                        |
|                                                                                                   |
| SELECT CASE TYPES (Checkboxes):                                                                   |
| [✓] LabCase           [✓] UsgCase           [✓] DigitalXrayCase   [✓] XrayCase                    |
| [✓] OutsourceLabCase  [✓] EcgCase           [✓] CtScanCase        [✓] MriCase                     |
| [✓] EpsCase           [✓] OpgCase           [✓] CardiologyCase    [✓] EegCase                     |
| [✓] MammographyCase                                                                               |
|                                                                                                   |
| [ Generate Case Wise Report (Primary Button) ]                                                    |
+---------------------------------------------------------------------------------------------------+
| REPORT RESULTS TABLE:                                                                             |
| Bill # | Date       | Patient Name         | Ref Doctor     | Tests Included | Rate | Disc | Net  |
|--------+------------+----------------------+----------------+----------------+------+------+------|
| #1001  | 18-10-2026 | Rahul Sharma (32Y/M) | Dr. Anil Verma | CBC            | ₹400 | ₹0   | ₹400 |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 27: Business Growth & Monthly Analysis (`/business_analysis/monthly_business_overview`)

Macro analytics suite charting revenue trends, department breakdowns, and month-over-month growth.

```
+---------------------------------------------------------------------------------------------------+
| BUSINESS ANALYSIS & MONTHLY OVERVIEW                                        [ Month: October 2026 ]|
+----------------------------------------------------+----------------------------------------------+
| MODALITY REVENUE SHARE                             | MONTHLY RUN-RATE PROJECTION                  |
| Pathology / Clinical Lab: 100% (₹400.00)           | Target Revenue: ₹50,000.00                   |
| [████████████████████████████████████████]         | Current Total:  ₹400.00 (0.8%)               |
| Ultrasound (USG): 0% (₹0.00)                       | Projected Total: ₹45,200.00                  |
| [                                        ]         | Daily Average:   ₹400.00 / day               |
| Digital X-Ray: 0% (₹0.00)                          | Active Days:     18 days elapsed             |
+----------------------------------------------------+----------------------------------------------+
```

---

### Screen 28: Outsourced Investigations Worklist (`/outsource_lab_cases`)

Manages clinical investigations referred to external partner laboratory networks.

```
+---------------------------------------------------------------------------------------------------+
| OUTSOURCE LAB CASES                                                                               |
+---------------------------------------------------------------------------------------------------+
| Reg no. | Date       | Patient Name         | Investigations       | Reference Lab   | Status     |
|---------+------------+----------------------+----------------------+-----------------+------------|
| #0998   | 16-10-2026 | Meena Gupta (48Y/F)  | Histopathology Biopsy| SRL Diagnostics | Dispatched |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 29: CT Scan Radiology Worklist (`/ctscan_cases`)

Dedicated scheduling and tracking desk for Computed Tomography scan investigations.

```
+---------------------------------------------------------------------------------------------------+
| CT SCAN CASES                                                               [ + Register CT Case ]|
+---------------------------------------------------------------------------------------------------+
| Reg no. | Date       | Patient Name         | Investigations       | Contrast | Status | Actions  |
|---------+------------+----------------------+----------------------+----------+--------+----------|
| CT-102  | 18-10-2026 | Vikram Malhotra(45Y) | CT Head (Non-Contrast| Plain    | Done   | [Report] |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 30: Patient Payment Receipts & Transactions Ledger (`/receipts`)

Financial audit journal recording every cashier collection, payment gateway settlement, and refund.

```
+---------------------------------------------------------------------------------------------------+
| TRANSACTIONS & PAYMENT RECEIPTS                                                                   |
+---------------------------------------------------------------------------------------------------+
| FILTERS BAR:                                                                                      |
| Duration: [ Past 7 days ▾ ]    Payment Mode: [ All Modes ▾ ]    Centre: [ Main ▾ ]                |
| Type: [ Income ▾ ]             [ Search Transactions Button ]   [ Clear Filters ]                 |
+---------------------------------------------------------------------------------------------------+
| TRANSACTIONS TABLE:                                                                               |
| ID       | Reg No | Patient Name | Ref By         | Date       | Time     | CC   | Amount | Method|
|----------+--------+--------------+----------------+------------+----------+------+--------+-------|
| 42135866 | #1001  | Rahul        | Dr. Anil Verma | 18/10/2026 | 07:26 PM | Main | +₹100  | cash  |
| 42135865 | #1001  | Rahul        | Dr. Anil Verma | 18/10/2026 | 07:26 PM | Main | +₹300  | cash  |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 31: Sample Collection Agents Master (`/sample_collectors`)

Manages external phlebotomists, field runners, and collection franchises.

```
+---------------------------------------------------------------------------------------------------+
| SAMPLE COLLECTION AGENTS                                                                          |
+---------------------------------------------------------------------------------------------------+
| [ℹ️ HOW DOES THIS WORK?]                                                                           |
| - Add and edit agents directly from the New Bill case registration page.                          |
| - Agent name is tagged to bills, daily business reports, and case filters.                        |
+---------------------------------------------------------------------------------------------------+
| TABS: [ Active (0) ]  [ Archived (0) ]                                                            |
| AGENT ID | AGENT FULL NAME        | REGISTERED ON | ASSIGNED ROUTE / CENTER | ACTIONS             |
|----------+------------------------+---------------+-------------------------+---------------------|
| (No collection agents registered yet. Create agents during bill entry.)                            |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 32: Test Panels Master (`/lab_test_panels`)

Manages composite diagnostic profiles (e.g., CBC, LFT, KFT, Lipid Profile) and their parameters.

```
+---------------------------------------------------------------------------------------------------+
| TEST PANELS MASTER                                             [ How to reorder? ] [ + Add new ]  |
+---------------------------------------------------------------------------------------------------+
| ORDER | NAME                       | CATEGORY    | TESTS INCLUDED           | RATELIST ENTRIES    |
|-------+----------------------------+-------------+--------------------------+---------------------|
| 1.    | Complete Blood Count (CBC) | Haematology | Hb, TLC, DLC, Platelets, | CBC with GBP, CBC   |
|       |                            |             | RBC, PCV, MCV, MCH (14)  | [Edit] [View]       |
| 2.    | Liver Function Test (LFT)  | Biochemistry| Bilirubin, SGOT, SGPT,   | LFT Standard        |
|       |                            |             | Alk Phos, Protein, Albumin[Edit] [View]       |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 33: Biological Test Categories (`/lab_test_categories`)

Defines departmental classifications for laboratory reporting order and specimen management.

```
+---------------------------------------------------------------------------------------------------+
| TEST CATEGORIES                                                [ How to reorder? ] [ + Add new ]  |
+---------------------------------------------------------------------------------------------------+
| ORDER | CATEGORY NAME                 | ACTIONS                                                   |
|-------+-------------------------------+-----------------------------------------------------------|
| 1     | Haematology                   | [Edit] [View tests]                                       |
| 2     | Biochemistry                  | [Edit] [View tests]                                       |
| 3     | Serology & Immunology         | [Edit] [View tests]                                       |
| 4     | Clinical Pathology            | [Edit] [View tests]                                       |
| 5     | Cytology                      | [Edit] [View tests]                                       |
| 6     | Microbiology                  | [Edit] [View tests]                                       |
| 7     | Endocrinology                 | [Edit] [View tests]                                       |
| 8     | Histopathology                | [Edit] [View tests]                                       |
| 9     | Others                        | [Edit] [View tests]                                       |
| 10    | Miscellaneous                 | [Edit] [View tests]                                       |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 34: Test Workload Counts & Reagent Audit (`/lab_test_counts`)

Workload utilization matrix calculating total parameter processing for reagent replenishment.

```
+---------------------------------------------------------------------------------------------------+
| TEST WORKLOAD COUNTS                                      Date Range: [ 18/10/2026 - 18/10/2026 ]|
+---------------------------------------------------------------------------------------------------+
| S.NO. | BILL ENTRY / TEST NAME                                | COUNT PERFORMED                   |
|-------+-------------------------------------------------------+-----------------------------------|
| 1.    | Complete Blood Count (CBC)                            | 1                                 |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 35: Ultrasound (USG) Worklist, Templates & Signatures (`/usg_cases`, `/usg_templates`, `/usg_signatures`)

Radiology sub-system for Sonography reporting, image archiving, and digital sign-offs.

```
+---------------------------------------------------------------------------------------------------+
| ULTRASOUND (USG) RADIOLOGY SUITE                                                                  |
+---------------------------------------------------------------------------------------------------+
| SUB-NAVIGATION: [ Today's Cases ] [ Search Cases ] [ Report Templates ] [ Signatures ]             |
+---------------------------------------------------------------------------------------------------+
| USG TEMPLATE EDITOR CANVAS:                                                                       |
| Template Name: [ Whole Abdomen & Pelvis (Male)                                                  ] |
|                                                                                                   |
| FINDINGS WYSIWYG EDITOR:                                                                          |
| LIVER: Normal in size (14.2 cm), regular smooth borders, uniform parenchymal echotexture.         |
| GALL BLADDER: Well distended, lumen is anechoic, wall thickness normal (2.2 mm). No calculus.      |
| PANCREAS: Visualized portions normal in size and parenchymal echotexture. No focal lesion.        |
| SPLEEN: Normal in size (9.8 cm), uniform echotexture. No splenomegaly.                            |
| KIDNEYS: Both kidneys normal in size, shape and position. Normal corticomedullary ratio.          |
| URINARY BLADDER: Adequately distended, thin smooth walls. No intraluminal lesion.                 |
| PROSTATE: Normal in size (22 cc), homogenous echotexture.                                         |
|                                                                                                   |
| IMPRESSION: NORMAL ULTRASOUND STUDY OF WHOLE ABDOMEN AND PELVIS.                                  |
|                                                                                                   |
| [ Upload USG Image Prints ] [ Attach Sonologist Digital Signature ▾ ] [ Save & Authorize ]        |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 36: Digital X-Ray Worklist, Templates & Signatures (`/digital_xray_cases`, `/digital_xray_templates`, `/digital_xray_signatures`)

Digital radiograph analysis with standard positioning templates and DICOM viewer links.

```
+---------------------------------------------------------------------------------------------------+
| DIGITAL RADIOGRAPHY (X-RAY) SUITE                                                                 |
+---------------------------------------------------------------------------------------------------+
| SUB-NAVIGATION: [ Today's Cases ] [ Search Cases ] [ Report Templates ] [ Signatures ]             |
+---------------------------------------------------------------------------------------------------+
| TEMPLATE: CHEST PA VIEW REPORT                                                                    |
| - Lung fields appear clear and well aerated. No active focal infiltration or consolidation.       |
| - Both costophrenic and cardiophrenic angles are clear and sharp.                                 |
| - Cardiac silhouette is normal in shape and transverse diameter within limits (CTR < 0.50).       |
| - Bony thoracic cage and soft tissue planes show normal radiographic appearance.                  |
|                                                                                                   |
| IMPRESSION: NO ACTIVE CARDIOPULMONARY LESION DETECTED.                                            |
|                                                                                                   |
| [ Upload DICOM / JPEG Exposure ] [ Assign Radiologist Signature ] [ Save & Authorize ]            |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 37: Browser Security & Terminal Whitelisting (`/web_browsers`)

Security guard module preventing off-premise unauthorized access to patient health data.

```
+---------------------------------------------------------------------------------------------------+
| BROWSER SECURITY (BETA)                                                                           |
+---------------------------------------------------------------------------------------------------+
| CONTROL BROWSER ACCESS:                                                                           |
| Block access to browsers not being used inside the laboratory.                                    |
| [ Switch: Security is OFF ]  ->  [ Turn on Security (Enforce Laboratory Router Binding) ]         |
+---------------------------------------------------------------------------------------------------+
| REGISTERED TERMINALS & BROWSERS:                                                                  |
| +-----------------------------------------------------------------------------------------------+ |
| | Gopalkrishna Pattanaik's Browser                             [ CURRENT BROWSER (Active) ]     | |
| | Last login: Gopalkrishna Pattanaik, 19 Oct 26, 12:13 AM      Browser code: 8210               | |
| | [ Rename Browser ]                                           [ Block Browser (Red Button) ]   | |
| +-----------------------------------------------------------------------------------------------+ |
| | Reception Desk Terminal 2                                                                     | |
| | Last login: Gopalkrishna Pattanaik, 18 Oct 26, 06:51 PM      Browser code: 123E               | |
| | [ Rename Browser ]                                           [ Block Browser (Red Button) ]   | |
| +-----------------------------------------------------------------------------------------------+ |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 38: Employee Logins, Roles & Multi-User Access (`/users`)

Role-based access control (RBAC) cockpit managing staff logins and security permissions.

```
+---------------------------------------------------------------------------------------------------+
| MANAGE EMPLOYEE LOGINS                                      [ + New employee ] [ Existing staff ] |
+---------------------------------------------------------------------------------------------------+
| TABS: [ Active (1) ]  [ Blocked (0) ]                                                             |
+---------------------------------------------------------------------------------------------------+
| S.NO | NAME                   | MOBILE NUMBER  | EMAIL                    | REG. ON    | PERMISSION|
|------+------------------------+----------------+--------------------------+------------+-----------|
| 1.   | Gopalkrishna Pattanaik | +91 7752058263 | gkpattanaik001@gmail.com | 18/10/2026 | Owner     |
|      |                        | (Active)       | (Verified)               |            | [Edit]    |
+---------------------------------------------------------------------------------------------------+
```

---

### Screen 39: Doctor Portal Access Management (`/doctor_accesses/invited`)

Doctor relationship hub granting external referring physicians web portal access to review their patients' reports.

```
+---------------------------------------------------------------------------------------------------+
| MANAGE LABSMART DOCTOR PORTAL ACCESS (BETA)                                                       |
+---------------------------------------------------------------------------------------------------+
| Invite Limit: 5 Doctors (Free Tier) - Upgrade to increase capacity.                               |
| Grant live access to patient reports. Doctors sign up with link and receive automated notifications|
|                                                                                                   |
| QUICK INVITE BAR:                                                                                 |
| Select Doctor: [ ID: 2, Dr. Anil Verma (MBBS, MD) ▾ ]             [ Send Portal Invite Button ]   |
+---------------------------------------------------------------------------------------------------+
| STATUS TABS: [ Invited (0) ]  [ Access Granted (0) ]  [ Access Revoked (0) ]                      |
| S. NO. | ID | REFERRER DOCTOR | CLINIC ADDRESS | INVITED ON | RESEND INVITE | REVOKE ACCESS       |
|--------+----+------------------+----------------+------------+---------------+---------------------|
| (No pending doctor invitations. Select a doctor above to dispatch a portal onboarding invite.)    |
+---------------------------------------------------------------------------------------------------+
```

---

## 4. Reusable Component Atoms & HTML Snippets

### 4.1 Form Input Field (Standard)
```html
<div class="space-y-1">
  <label for="patient_name" class="block text-[13px] font-medium text-slate-700">
    Patient Full Name <span class="text-rose-500">*</span>
  </label>
  <input
    type="text"
    id="patient_name"
    name="patient_name"
    placeholder="e.g. Rahul Sharma"
    class="w-full h-9 px-3 text-sm text-slate-800 bg-white border border-slate-300 rounded-md shadow-2xs placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
  />
  <p class="text-[11px] text-slate-500">Enter first and last name as per Aadhaar/Govt ID.</p>
</div>
```

### 4.2 Primary Action Button
```html
<button
  type="button"
  class="inline-flex items-center justify-center h-10 px-4 bg-[#1565c0] hover:bg-[#0d47a1] active:bg-[#0a3875] text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
>
  <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
  </svg>
  Save & Enter Results
</button>
```

### 4.3 Data Table Template
```html
<div class="overflow-x-auto bg-white rounded-lg border border-slate-200 shadow-sm">
  <table class="w-full text-left border-collapse">
    <thead>
      <tr class="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-600">
        <th class="py-3 px-4">Bill #</th>
        <th class="py-3 px-4">Patient Name</th>
        <th class="py-3 px-4">Investigation</th>
        <th class="py-3 px-4 text-right">Net (₹)</th>
        <th class="py-3 px-4 text-center">Status</th>
        <th class="py-3 px-4 text-right">Action</th>
      </tr>
    </thead>
    <tbody class="divide-y divide-slate-100 text-xs text-slate-700">
      <tr class="hover:bg-slate-50/80 transition-colors">
        <td class="py-3.5 px-4 font-mono font-bold text-blue-600">#1001</td>
        <td class="py-3.5 px-4">
          <div class="font-semibold text-slate-900">Rahul Sharma</div>
          <div class="text-[11px] text-slate-400">32Y / Male • +91 9876543210</div>
        </td>
        <td class="py-3.5 px-4">Complete Blood Count (CBC)</td>
        <td class="py-3.5 px-4 text-right font-semibold">₹400.00</td>
        <td class="py-3.5 px-4 text-center">
          <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Signed Off
          </span>
        </td>
        <td class="py-3.5 px-4 text-right">
          <button class="text-slate-400 hover:text-slate-700 p-1 rounded hover:bg-slate-100">
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"/>
            </svg>
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 5. Keyboard Navigation & Accessibility (a11y) Shortcuts

| Keystroke | Scope / Screen | Action Triggered |
| :--- | :--- | :--- |
| `Ctrl + K` / `Cmd + K` | Global (Anywhere) | Open Omnisearch dialog modal |
| `Alt + N` | Global (Anywhere) | Navigate immediately to `/cases/new` (New Bill) |
| `F2` | New Bill Screen | Save Case & immediately jump to Enter Results |
| `F3` | New Bill Screen | Save Case & open printable cash receipt bill |
| `Tab` | Enter Results Grid | Advance to next biological parameter value input |
| `Shift + Tab` | Enter Results Grid | Return to previous biological parameter value input |
| `Esc` | Modals & Drawers | Close active modal, cancel selection, or dismiss dropdown |

---

## 6. Verification Checklist for 100% Exact Recreation

- [x] Primary Action Blue matches `#1565c0` (`rgb(21, 101, 192)`).
- [x] Active Link Blue matches `#2563eb` with `bg-blue-50` background tint.
- [x] Topbar height fixed at `64px` (`h-16`) with border-bottom `#e2e8f0`.
- [x] Left navigation sidebar fixed at `256px` (`w-64`) with `#f9fafb` background.
- [x] Input fields have `0.8px` to `1px` border in `#d1d5db` and radius `6px`.
- [x] Abnormal test parameter inputs highlight with `#b91c1c` border and `#fef2f2` background.
- [x] Auto-calculated test parameters (MCV, MCH, MCHC, PCV) display in dashed readonly inputs.
- [x] Printable receipt adheres strictly to A5/A4 printable specifications with barcode and signature blocks.
- [x] Font typography scale follows Inter starting from 11px micro-copy up to 20px page headings.
- [x] Real-time cashier till reconciliation reflects gross revenue minus expenses to yield cash-in-drawer balance.
