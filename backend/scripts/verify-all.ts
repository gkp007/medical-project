import { createApp } from '../src/app.js';
import { prisma } from '../src/core/database/prisma.client.js';

async function runVerification() {
  console.log('🚀 Starting Labsmart LIS Backend Verification Test Suite...\n');

  const app = createApp();
  const PORT = 5099;
  const server = app.listen(PORT);
  const BASE_URL = `http://localhost:${PORT}/api/v1`;

  const results: { test: string; status: 'PASS' | 'FAIL'; details?: string }[] = [];

  function record(test: string, passed: boolean, details?: string) {
    results.push({ test, status: passed ? 'PASS' : 'FAIL', details });
    console.log(`[${passed ? '✔ PASS' : '❌ FAIL'}] ${test} ${details ? '(' + details + ')' : ''}`);
  }

  let authToken = '';

  try {
    // 1. Health check
    const healthRes = await fetch(`http://localhost:${PORT}/health`);
    const healthJson = await healthRes.json();
    record('Health Check Endpoint', healthRes.status === 200 && healthJson.status === 'UP');

    // 2. Auth Login
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: 'LabSmart@2026' })
    });
    const loginJson = await loginRes.json();
    if (loginJson.success && loginJson.data?.token) {
      authToken = loginJson.data.token;
      record('Auth Staff Login', true, `Token received for ${loginJson.data.user.fullName}`);
    } else {
      record('Auth Staff Login', false, JSON.stringify(loginJson));
      throw new Error('Login failed, aborting remaining authenticated tests');
    }

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    };

    // 3. Shell Service: Context & Omnisearch
    const shellContextRes = await fetch(`${BASE_URL}/shell/context`, { headers: authHeaders });
    const shellContextJson = await shellContextRes.json();
    record('Shell Context Retrieval', shellContextRes.status === 200 && shellContextJson.data.user.username === 'admin', `Role: ${shellContextJson.data?.user?.role}`);

    const searchRes = await fetch(`${BASE_URL}/shell/omnisearch?q=Sharma`, { headers: authHeaders });
    const searchJson = await searchRes.json();
    record('Shell Omnisearch (Query: Sharma)', searchRes.status === 200 && Array.isArray(searchJson.data?.patients), `Found ${searchJson.data?.patients?.length} matching patients`);

    // 4. Test Masters Query
    const testsRes = await fetch(`${BASE_URL}/masters/tests`, { headers: authHeaders });
    const testsJson = await testsRes.json();
    const cbcTest = testsJson.data?.find((t: any) => t.code === 'CBC');
    record('Masters Investigations Catalog', testsRes.status === 200 && !!cbcTest, `Found CBC with ${cbcTest?.parameters?.length} parameters`);

    // 5. Cases & Billing Engine: Create Bill
    const doctor = await prisma.doctor.findFirst();
    const newCaseRes = await fetch(`${BASE_URL}/cases`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        patient: {
          prefix: 'Mrs',
          fullName: 'Kavita Verma',
          age: 42,
          ageUnit: 'Years',
          gender: 'Female',
          mobile: '9812345670',
          address: 'Sector 56, Gurugram'
        },
        doctorId: doctor?.id,
        modality: 'LAB',
        investigations: [
          { testId: cbcTest.id, discount: 50.0 }
        ],
        discountType: 'fixed',
        discountValue: 50.0,
        discountReason: 'Senior Citizen Clinic Concession',
        paidAmount: 150.0,
        paymentMode: 'UPI',
        allowDue: true
      })
    });
    const newCaseJson = await newCaseRes.json();
    const createdCase = newCaseJson.data;
    record(
      'Cases Billing: Create Patient Bill',
      newCaseRes.status === 201 && !!createdCase?.billNumber,
      `Bill: ${createdCase?.billNumber}, DailyCode: ${createdCase?.dailyCode}, Net: ₹${createdCase?.netPayable}, Paid: ₹${createdCase?.paidAmount}, Due: ₹${createdCase?.balanceDue}`
    );

    // 6. Barcodes Specimen Stickers
    const barcodeRes = await fetch(`${BASE_URL}/cases/${createdCase.id}/barcodes`, { headers: authHeaders });
    const barcodeJson = await barcodeRes.json();
    record(
      'Specimen Barcodes Generation',
      barcodeRes.status === 200 && Array.isArray(barcodeJson.data?.barcodes) && barcodeJson.data.barcodes.length > 0,
      `Generated ${barcodeJson.data?.totalTubes} tube sticker(s)`
    );

    // 7. Printable Bill Invoice (A4 & Thermal Layouts)
    const billPdfRes = await fetch(`${BASE_URL}/cases/${createdCase.id}/bill-pdf?layout=thermal`, { headers: authHeaders });
    const billPdfJson = await billPdfRes.json();
    record(
      'Printable Bill Invoice (Thermal 80mm & A4)',
      billPdfRes.status === 200 && billPdfJson.data?.financialSummary?.grossAmount > 0,
      `AmountInWords: "${billPdfJson.data?.amountInWords}"`
    );

    // 8. Payment Collection & Dues Settlement
    const collectDueRes = await fetch(`${BASE_URL}/payments/collect-due`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        caseId: createdCase.id,
        amount: createdCase.balanceDue,
        mode: 'Cash',
        note: 'Full settlement of outstanding dues'
      })
    });
    const collectDueJson = await collectDueRes.json();
    record(
      'Payment Engine: Collect Due Balance',
      collectDueRes.status === 200 && collectDueJson.data?.balanceDue === 0,
      `Updated PaymentStatus: ${collectDueJson.data?.paymentStatus}, New Balance: ₹${collectDueJson.data?.balanceDue}`
    );

    // 9. Cashier Shift Start & Close Reconciliation
    const shiftStartRes = await fetch(`${BASE_URL}/payments/cashier-shift/start`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ counterDesk: 'Counter 1', openingFloat: 2000.0 })
    });
    record('Cashier Shift Start (Float: ₹2000)', shiftStartRes.status === 200);

    const shiftCloseRes = await fetch(`${BASE_URL}/payments/cashier-shift/close`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ closingCashCount: 2000.0 + (createdCase.balanceDue || 0) })
    });
    const shiftCloseJson = await shiftCloseRes.json();
    record(
      'Cashier Shift Close & Reconciliation',
      shiftCloseRes.status === 200 && shiftCloseJson.data?.shift?.reconciliationStatus !== undefined,
      `Reconciliation: ${shiftCloseJson.data?.shift?.reconciliationStatus}, Variance: ₹${shiftCloseJson.data?.shift?.variance}`
    );

    // 10. Pathology: Today Worklist with Stats
    const pathWorklistRes = await fetch(`${BASE_URL}/pathology/today`, { headers: authHeaders });
    const pathWorklistJson = await pathWorklistRes.json();
    record(
      'Pathology Bench Worklist',
      pathWorklistRes.status === 200 && pathWorklistJson.data?.stats?.totalCases > 0,
      `Total Cases Today: ${pathWorklistJson.data?.stats?.totalCases}, InProcess: ${pathWorklistJson.data?.stats?.inProcess}`
    );

    // 11. Pathology: Enter Parameter Results & Formula Engine
    const paramsRes = await fetch(`${BASE_URL}/pathology/cases/${createdCase.id}/params`, { headers: authHeaders });
    const paramsJson = await paramsRes.json();
    record('Pathology Worksheet Retrieval', paramsRes.status === 200 && Array.isArray(paramsJson.data?.tests));

    const saveDraftRes = await fetch(`${BASE_URL}/pathology/cases/${createdCase.id}/draft`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        parameters: [
          { code: 'HB', value: '13.5' },
          { code: 'RBC', value: '4.8' },
          { code: 'PCV', value: '41.0' },
          { code: 'TLC', value: '7500' },
          { code: 'PLT', value: '250000' }
        ],
        interpretation: 'CBC parameters are within normal biological physiological reference limits.'
      })
    });
    const saveDraftJson = await saveDraftRes.json();
    const calculatedMcv = saveDraftJson.data?.parameters?.find((p: any) => p.code === 'MCV');
    record(
      'Pathology Clinical Formula Engine',
      saveDraftRes.status === 200 && !!calculatedMcv?.value,
      `Auto-calculated MCV: ${calculatedMcv?.value} fL, Flag: ${calculatedMcv?.flag}`
    );

    // 12. Pathology: Sign-Off & QR Verification
    const signoffRes = await fetch(`${BASE_URL}/pathology/cases/${createdCase.id}/signoff`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ pathologistNotes: 'Verified and authorized on Sysmex XN-350 analyzer.' })
    });
    const signoffJson = await signoffRes.json();
    record(
      'Pathology Sign-Off & Digital Authorization',
      signoffRes.status === 200 && !!signoffJson.data?.qrVerificationId,
      `QR Verification: ${signoffJson.data?.qrVerificationId}`
    );

    // 13. Pathology: NABL Medical Report PDF Payload
    const reportPdfRes = await fetch(`${BASE_URL}/pathology/cases/${createdCase.id}/report-pdf`, { headers: authHeaders });
    const reportPdfJson = await reportPdfRes.json();
    record(
      'Pathology NABL Compliant Report',
      reportPdfRes.status === 200 && reportPdfJson.data?.isAuthorized === true,
      `AuthorizedBy: ${reportPdfJson.data?.authorizedBy}, RegNo: ${reportPdfJson.data?.signatureStamp?.registrationNo}`
    );

    // 14. Interpretations Library & Test Counts
    const interpRes = await fetch(`${BASE_URL}/pathology/interpretations`, { headers: authHeaders });
    const interpJson = await interpRes.json();
    record('Clinical Interpretations Library', interpRes.status === 200 && Array.isArray(interpJson.data) && interpJson.data.length > 0, `Templates Loaded: ${interpJson.data.length}`);

    // 15. USG & PC-PNDT Enforcement
    const usgWorklistRes = await fetch(`${BASE_URL}/usg/worklist`, { headers: authHeaders });
    record('USG Daily Worklist', usgWorklistRes.status === 200);

    // 16. Digital X-Ray Worklist
    const xrayWorklistRes = await fetch(`${BASE_URL}/xray/worklist`, { headers: authHeaders });
    record('Digital X-Ray Worklist', xrayWorklistRes.status === 200);

    // 17. Business: Net Income Formula Verification
    const dailyBusRes = await fetch(`${BASE_URL}/business/daily-summary`, { headers: authHeaders });
    const dailyBusJson = await dailyBusRes.json();
    record(
      'Business: Day-End Net Income Formula',
      dailyBusRes.status === 200 && dailyBusJson.data?.financials?.netIncome !== undefined,
      `NetIncome: ₹${dailyBusJson.data?.financials?.netIncome}, NetCollected: ₹${dailyBusJson.data?.financials?.netIncomeCollected}, DrawerCash: ₹${dailyBusJson.data?.financials?.netCashInDrawer}`
    );

    // 18. Business: Dues Aging Buckets
    const duesAgingRes = await fetch(`${BASE_URL}/business/dues-aging`, { headers: authHeaders });
    const duesAgingJson = await duesAgingRes.json();
    record(
      'Business: 4-Bucket Debt Aging Analysis',
      duesAgingRes.status === 200 && duesAgingJson.data?.buckets !== undefined,
      `0-7d: ₹${duesAgingJson.data?.buckets?.bucket0to7}, 8-30d: ₹${duesAgingJson.data?.buckets?.bucket8to30}, 31-60d: ₹${duesAgingJson.data?.buckets?.bucket31to60}, >60d: ₹${duesAgingJson.data?.buckets?.bucketOver60}`
    );

    // 19. Business: Doctor Referral Statements & Settlement
    const refStatementsRes = await fetch(`${BASE_URL}/business/referral-statements`, { headers: authHeaders });
    const refStatementsJson = await refStatementsRes.json();
    record(
      'Business: Doctor Referral Commission Statements',
      refStatementsRes.status === 200 && Array.isArray(refStatementsJson.data) && refStatementsJson.data.length > 0,
      `Audited ${refStatementsJson.data.length} doctors`
    );

    const docToSettle = refStatementsJson.data?.[0];
    if (docToSettle) {
      const settleRes = await fetch(`${BASE_URL}/business/doctors/${docToSettle.doctorId}/settle`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          amount: 500.0,
          paymentMode: 'NEFT',
          transactionRef: 'NEFT-AXIS-91823'
        })
      });
      const settleJson = await settleRes.json();
      record('Business: Doctor Commission Disbursement Payout', settleRes.status === 200 && !!settleJson.data?.payoutNumber, `Voucher: ${settleJson.data?.payoutNumber}`);
    }

    // 20. Business: Data Export CSV
    const exportRes = await fetch(`${BASE_URL}/business/export?type=cases`, { headers: authHeaders });
    const exportText = await exportRes.text();
    record('Business: Enterprise CSV Export Dump', exportRes.status === 200 && exportText.includes('Bill Number'), `Exported ${exportText.split('\n').length} CSV lines`);

    // 21. Settings: Profile, Letterhead Margins & DLT SMS
    const settingsRes = await fetch(`${BASE_URL}/settings`, { headers: authHeaders });
    const settingsJson = await settingsRes.json();
    record(
      'Clinic Settings & Margins',
      settingsRes.status === 200 && settingsJson.data?.clinicName !== undefined,
      `HeaderMargin: ${settingsJson.data?.headerMarginMm}mm, FooterMargin: ${settingsJson.data?.footerMarginMm}mm`
    );

    const testSmsRes = await fetch(`${BASE_URL}/settings/test-sms`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ mobile: '9876543210' })
    });
    const testSmsJson = await testSmsRes.json();
    record('DLT SMS Gateway Simulation', testSmsRes.status === 200, `SenderID: ${testSmsJson.data?.senderId}`);

    // 22. Settings: Test Email Gateway Dispatch
    const testEmailRes = await fetch(`${BASE_URL}/settings/test-email`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ email: 'director@apexdiagnostics.com' })
    });
    const testEmailJson = await testEmailRes.json();
    record('Email Gateway Dispatch: Settings Test Email', testEmailRes.status === 200 && testEmailJson.data?.success === true, `MessageId: ${testEmailJson.data?.messageId}`);

    // 23. Auth: Session Me & Profile Inspection
    const meRes = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
    const meJson = await meRes.json();
    record('Auth: Profile Inspection (/auth/me)', meRes.status === 200 && meJson.data?.username === 'admin', `Verified: ${meJson.data?.isEmailVerified}`);

    // 24. Auth: Email Verification Dispatch & Verification
    const sendVerifyRes = await fetch(`${BASE_URL}/auth/send-verification-email`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ email: 'gkpattanaik001@gmail.com' })
    });
    const sendVerifyJson = await sendVerifyRes.json();
    record('Auth: Dispatch Verification Email', sendVerifyRes.status === 200 && sendVerifyJson.data?.success === true, sendVerifyJson.data?.email);

    // Fetch the token directly from database to test verification
    const userInDb = await prisma.user.findFirst({ where: { username: 'admin' } });
    if (userInDb?.emailVerificationToken) {
      const verifyRes = await fetch(`${BASE_URL}/auth/verify-email?token=${userInDb.emailVerificationToken}`);
      const verifyJson = await verifyRes.json();
      record('Auth: Token Verification Endpoint', verifyRes.status === 200 && verifyJson.data?.success === true, `Email marked verified: ${verifyJson.data?.email}`);
    }

    // 25. Auth: Support Ticket Creation & Notification Alert
    const ticketRes = await fetch(`${BASE_URL}/auth/support-ticket`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        category: 'BILLING_QUERY',
        subject: 'Printer margin adjustment for NABL letterhead',
        description: 'Need assistance setting 30mm header margin on thermal printer.',
        priority: 'HIGH'
      })
    });
    const ticketJson = await ticketRes.json();
    record('Auth: Support Desk Ticket Creation & Email Alert', ticketRes.status === 201 && !!ticketJson.data?.ticketNo, `Ticket: ${ticketJson.data?.ticketNo}`);

    // 26. Auth: Terminal Lock & Unlock
    const lockRes = await fetch(`${BASE_URL}/auth/lock-terminal`, {
      method: 'POST',
      headers: authHeaders
    });
    const lockJson = await lockRes.json();
    record('Auth: Terminal Screen Lock', lockRes.status === 200 && lockJson.data?.isTerminalLocked === true);

    const unlockRes = await fetch(`${BASE_URL}/auth/unlock-terminal`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ pin: '1234' })
    });
    const unlockJson = await unlockRes.json();
    record('Auth: Terminal Screen PIN Unlock', unlockRes.status === 200 && unlockJson.data?.isTerminalLocked === false);

    // 27. Business: Email Daily Closing Digest
    const emailReportRes = await fetch(`${BASE_URL}/business/email-report`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ email: 'directors@metropolisdiagnostics.com' })
    });
    const emailReportJson = await emailReportRes.json();
    record('Business: Dispatch Daily Closing Digest Email', emailReportRes.status === 200 && emailReportJson.data?.success === true, emailReportJson.data?.dispatchedTo);

    // 28. Pathology: Email Patient Report
    if (createdCase?.id) {
      const emailReportCaseRes = await fetch(`${BASE_URL}/pathology/cases/${createdCase.id}/email-report`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({ email: 'patient@example.com' })
      });
      const emailReportCaseJson = await emailReportCaseRes.json();
      record('Pathology: Patient Report PDF Delivery Email', emailReportCaseRes.status === 200 && emailReportCaseJson.data?.success === true, emailReportCaseJson.data?.recipient);
    }

    // 29. Security: Browser Code Verification (POST /auth/verify-browser)
    const browserVerifyRes = await fetch(`${BASE_URL}/auth/verify-browser`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ browserCode: 'TERM-TEST-01' })
    });
    const browserVerifyJson = await browserVerifyRes.json();
    record('Security: Physical Terminal Browser Verification', browserVerifyRes.status === 200 && browserVerifyJson.data?.allowed === true, browserVerifyJson.data?.message);

    // Create a fresh active case for edge case & financial validation
    const freshCaseRes = await fetch(`${BASE_URL}/cases`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        patient: {
          prefix: 'Mr',
          fullName: 'Arjun K. Verma',
          age: 34,
          gender: 'Male',
          mobile: '9876543210'
        },
        doctorId: doctor?.id,
        modality: 'LAB',
        investigations: [{ testId: cbcTest.id, discount: 0 }],
        paidAmount: 50.0,
        allowDue: true,
        paymentMode: 'Cash'
      })
    });
    const freshCaseJson = await freshCaseRes.json();
    const activeCase = freshCaseJson.data;

    // 30. Security/Ledger: Negative Payment Collection Rejection
    const negPayRes = await fetch(`${BASE_URL}/cases/${activeCase.id}/payments`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ amount: -100, paymentMode: 'Cash' })
    });
    record('Financial Security: Negative Payment Rejection (HTTP 400/422)', [400, 422].includes(negPayRes.status), 'Shielded financial ledger from negative balance injection');

    // 31. Case Engine: Update Case Demographics & Doctor (PUT /cases/:id)
    const updateCaseRes = await fetch(`${BASE_URL}/cases/${activeCase.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        patient: {
          fullName: 'Arjun K. Verma (Updated)',
          mobile: '9876543299',
          address: '42 Marine Drive, Mumbai'
        },
        isUrgent: true,
        notes: 'Updated priority by QA test suite'
      })
    });
    const updateCaseJson = await updateCaseRes.json();
    record('Case Engine: Demographic & Priority Update (PUT /cases/:id)', updateCaseRes.status === 200 && updateCaseJson.data?.patient?.mobile === '9876543299', `Updated Name: ${updateCaseJson.data?.patient?.fullName}`);

    // 32. Case Engine: Sample Status Transition (PATCH /cases/:id/sample-status)
    const sampleStatusRes = await fetch(`${BASE_URL}/cases/${activeCase.id}/sample-status`, {
      method: 'PATCH',
      headers: authHeaders,
      body: JSON.stringify({ sampleStatus: 'Collected' })
    });
    const sampleStatusJson = await sampleStatusRes.json();
    record('Case Engine: Sample Status Transition (PATCH /cases/:id/sample-status)', sampleStatusRes.status === 200 && sampleStatusJson.data?.sampleStatus === 'Collected', `Sample: ${sampleStatusJson.data?.sampleStatus}`);

    // 33. Business: Waive Due Balance (POST /business/due-reports/:caseId/waive)
    const waiveRes = await fetch(`${BASE_URL}/business/due-reports/${activeCase.id}/waive`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ reason: 'Executive VIP Compassionate Waiver' })
    });
    const waiveJson = await waiveRes.json();
    record('Business: Waive Due Balance & Audit Log', waiveRes.status === 200 && waiveJson.data?.balanceDue === 0, `Waived Balance: ₹${activeCase.balanceDue} -> ₹${waiveJson.data?.balanceDue}`);

    // 34. Masters: Health Package CRUD (PUT & DELETE)
    const pkgRes = await fetch(`${BASE_URL}/masters/packages`, { headers: authHeaders });
    const pkgJson = await pkgRes.json();
    const testPkg = pkgJson.data?.[0];
    if (testPkg) {
      const updatePkgRes = await fetch(`${BASE_URL}/masters/packages/${testPkg.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ packagePrice: testPkg.packagePrice + 50 })
      });
      record('Masters: Health Package Update (PUT /packages/:id)', updatePkgRes.status === 200);

      const delPkgRes = await fetch(`${BASE_URL}/masters/packages/${testPkg.id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      record('Masters: Health Package Deactivation (DELETE /packages/:id)', delPkgRes.status === 200);
    }

    // 35. Masters: Test Panel CRUD (PUT & DELETE)
    const panelRes = await fetch(`${BASE_URL}/masters/panels`, { headers: authHeaders });
    const panelJson = await panelRes.json();
    const testPanel = panelJson.data?.[0];
    if (testPanel) {
      const updatePanelRes = await fetch(`${BASE_URL}/masters/panels/${testPanel.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ panelPrice: 999.0 })
      });
      record('Masters: Test Panel Update (PUT /panels/:id)', updatePanelRes.status === 200);

      const delPanelRes = await fetch(`${BASE_URL}/masters/panels/${testPanel.id}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      record('Masters: Test Panel Deletion (DELETE /panels/:id)', delPanelRes.status === 200);
    }

    // 36. Pathology: Clinical Interpretations Library CRUD
    const createInterpRes = await fetch(`${BASE_URL}/pathology/interpretations`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Elevated Serum Ferritin Interpretation',
        testCode: 'FERRITIN',
        department: 'Biochemistry',
        content: 'Hyperferritinemia indicates iron overload or acute phase inflammatory reaction.'
      })
    });
    const createInterpJson = await createInterpRes.json();
    const interpId = createInterpJson.data?.id;
    record('Pathology: Create Clinical Interpretation Template', createInterpRes.status === 201 && !!interpId, `Created template ID: ${interpId}`);

    if (interpId) {
      const updateInterpRes = await fetch(`${BASE_URL}/pathology/interpretations/${interpId}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({ content: 'Updated clinical guidance for hyperferritinemia.' })
      });
      record('Pathology: Update Clinical Interpretation Template', updateInterpRes.status === 200);

      const delInterpRes = await fetch(`${BASE_URL}/pathology/interpretations/${interpId}`, {
        method: 'DELETE',
        headers: authHeaders
      });
      record('Pathology: Delete Clinical Interpretation Template', delInterpRes.status === 200);
    }

    // 37. Analyzer: List Connected Equipment (GET /analyzers)
    const listAnalyzersRes = await fetch(`${BASE_URL}/analyzers`, { headers: authHeaders });
    const listAnalyzersJson = await listAnalyzersRes.json();
    const analyzersList = listAnalyzersJson.data || [];
    const mindray = analyzersList.find((a: any) => a.model === 'BC-5000');
    const cobas = analyzersList.find((a: any) => a.model === 'Cobas c311');
    record('Analyzer: List Connected LIS Analyzers', listAnalyzersRes.status === 200 && analyzersList.length >= 2, `Found ${analyzersList.length} analyzers (Mindray & Cobas online)`);

    // 38. Analyzer: ASTM E1381/E1394 Mindray Simulation & Auto-Matching with Case
    if (mindray && activeCase) {
      const astmSimRes = await fetch(`${BASE_URL}/analyzers/simulate`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          analyzerId: mindray.id,
          sampleBarcode: activeCase.billNumber,
          scenario: 'NORMAL'
        })
      });
      const astmSimJson = await astmSimRes.json();
      record('Analyzer: ASTM E1381/E1394 Auto-Ingestion & Barcode Match', astmSimRes.status === 200 && astmSimJson.data?.status === 'MATCHED', `Matched Bill #${astmSimJson.data?.billNumber} (${astmSimJson.data?.parametersCount} parameters)`);
    }

    // 39. Analyzer: HL7 v2.5 MLLP Roche Cobas Simulation
    if (cobas && activeCase) {
      const hl7SimRes = await fetch(`${BASE_URL}/analyzers/simulate`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          analyzerId: cobas.id,
          sampleBarcode: `${activeCase.billNumber}-T2`,
          scenario: 'ABNORMAL'
        })
      });
      const hl7SimJson = await hl7SimRes.json();
      record('Analyzer: HL7 v2.5 MLLP Ingestion & Abnormal Flags', hl7SimRes.status === 200 && hl7SimJson.data?.status === 'MATCHED', `Matched Tube #${activeCase.billNumber}-T2`);
    }

    // 40. Analyzer: Pending Results Query for Case (GET /analyzers/pending/:caseId)
    if (activeCase) {
      const pendingRes = await fetch(`${BASE_URL}/analyzers/pending/${activeCase.id}`, { headers: authHeaders });
      const pendingJson = await pendingRes.json();
      record('Analyzer: Pending Results Worklist Query', pendingRes.status === 200 && pendingJson.data?.hasResults === true, `Found ${pendingJson.data?.transmissions?.length} machine runs`);
    }

    // 41. Analyzer: Real-Time Transmission Audit Stream (GET /analyzers/transmissions)
    const transRes = await fetch(`${BASE_URL}/analyzers/transmissions?limit=10`, { headers: authHeaders });
    const transJson = await transRes.json();
    record('Analyzer: NABL ISO 15189 Equipment Audit Trail', transRes.status === 200 && (transJson.data?.length || 0) >= 1, `Audit log contains ${transJson.data?.length} packet records`);

    // 42. Auth: Logout
    const logoutRes = await fetch(`${BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: authHeaders
    });
    const logoutJson = await logoutRes.json();
    record('Auth: Staff Session Logout Audit', logoutRes.status === 200 && logoutJson.data?.success === true);


  } catch (err: any) {
    console.error('❌ Verification Exception:', err.message);
  } finally {
    server.close();
    await prisma.$disconnect();
    console.log('\n======================================================');
    const passCount = results.filter(r => r.status === 'PASS').length;
    const failCount = results.filter(r => r.status === 'FAIL').length;
    console.log(`TOTAL TESTS: ${results.length} | PASS: ${passCount} | FAIL: ${failCount}`);
    if (failCount > 0) {
      console.log('FAILED TESTS:');
      results.filter(r => r.status === 'FAIL').forEach(f => {
        console.log(` - ${f.test}: ${f.details || 'Assertion failed'}`);
      });
    }
    console.log('======================================================');
  }
}

runVerification();
