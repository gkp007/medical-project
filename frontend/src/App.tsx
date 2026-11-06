import React, { useState, useEffect } from 'react';
import './styles/base/global.css';
import { MasterAppShell } from './components/layouts/MasterAppShell';

// Standalone & Core Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NewBillPage } from './pages/cases/NewBillPage';
import { PrintableBillPage } from './pages/cases/PrintableBillPage';
import { CasesLedgerPage } from './pages/cases/CasesLedgerPage';
import { EnterResultsPage } from './pages/lab/EnterResultsPage';
import { ReportViewerPage } from './pages/lab/ReportViewerPage';
import { SettingsPage } from './pages/settings/SettingsPage';

// Business Pages
import { DailyBusinessPage } from './pages/business/DailyBusinessPage';
import { ExpensesPage } from './pages/business/ExpensesPage';
import { DueReportsPage } from './pages/business/DueReportsPage';
import { ActivitiesPage } from './pages/business/ActivitiesPage';
import { ReferralBusinessPage } from './pages/business/ReferralBusinessPage';
import { CaseWiseReportPage } from './pages/business/CaseWiseReportPage';
import { BusinessAnalysisPage } from './pages/business/BusinessAnalysisPage';
import { DataExportPage } from './pages/business/DataExportPage';

// Cases Pages
import { OutsourceCasesPage } from './pages/cases/OutsourceCasesPage';
import { CTScanCasesPage } from './pages/cases/CTScanCasesPage';
import { PatientsPage } from './pages/manage/PatientsPage';
import { PatientProfilePage } from './pages/manage/PatientProfilePage';
import { TransactionsPage } from './pages/cases/TransactionsPage';
import { DoctorsPage } from './pages/manage/DoctorsPage';
import { AgentsPage } from './pages/manage/AgentsPage';

// Lab Pages
import { TodayReportsPage } from './pages/lab/TodayReportsPage';
import { SearchReportsPage } from './pages/lab/SearchReportsPage';
import { PackagesPage } from './pages/manage/PackagesPage';
import { TestPanelsPage } from './pages/manage/TestPanelsPage';
import { TestCategoriesPage } from './pages/manage/TestCategoriesPage';
import { TestMasterPage } from './pages/manage/TestMasterPage';
import { InterpretationsPage } from './pages/lab/InterpretationsPage';
import { InterpretationsLibraryPage } from './pages/lab/InterpretationsLibraryPage';
import { TestCountsPage } from './pages/lab/TestCountsPage';
import { AnalyzersPage } from './pages/lab/AnalyzersPage';

// USG Pages
import { USGWorklistPage } from './pages/lab/USGWorklistPage';
import { USGReportsPage } from './pages/lab/USGReportsPage';
import { USGTemplatesPage } from './pages/lab/USGTemplatesPage';
import { USGSignaturesPage } from './pages/lab/USGSignaturesPage';

// Digital X-Ray Pages
import { XRayWorklistPage } from './pages/lab/XRayWorklistPage';
import { XRayReportsPage } from './pages/lab/XRayReportsPage';
import { XRayTemplatesPage } from './pages/lab/XRayTemplatesPage';
import { XRaySignaturesPage } from './pages/lab/XRaySignaturesPage';

// Manage Pages
import { BrowserSecurityPage } from './pages/manage/BrowserSecurityPage';
import { EmployeeLoginsPage } from './pages/manage/EmployeeLoginsPage';
import { DoctorAccessPage } from './pages/manage/DoctorAccessPage';

// Atoms & Security
import { Card } from './components/atoms/Card';
import { Button } from './components/atoms/Button';
import { CheckCircle2 } from 'lucide-react';
import { LoginPage } from './pages/auth/LoginPage';
import { LandingPage } from './pages/public/LandingPage';
import { TerminalLockModal } from './components/organisms/modals/TerminalLockModal';
import { authApi, getAuthToken, clearAuthToken } from './services/api';

const pathToScreen: Record<string, string> = {
  '/': 'landing',
  '/home': 'landing',
  '/landing': 'landing',
  '/login': 'login',
  '/dashboard': 'dashboard',
  '/business/daily': 'daily_business',
  '/business/expenses': 'expenses',
  '/business/due-reports': 'due_reports',
  '/business/activities': 'activities',
  '/business/referral': 'referral_business',
  '/business/case-wise': 'case_wise_report',
  '/business/analysis': 'business_analysis',
  '/business/export': 'data_export',
  '/cases/new': 'new_bill',
  '/cases/bills': 'cases_ledger',
  '/cases/ledger': 'cases_ledger',
  '/cases/outsource': 'outsource',
  '/cases/ct-scan': 'ct_scan',
  '/manage/patients': 'patients',
  '/cases/transactions': 'transactions',
  '/manage/doctors': 'doctors',
  '/manage/agents': 'agents',
  '/lab/today': 'today_reports',
  '/lab/search': 'search_reports',
  '/manage/packages': 'packages',
  '/manage/panels': 'test_panels',
  '/manage/categories': 'test_categories',
  '/manage/tests': 'test_master',
  '/lab/interpretations': 'interpretations',
  '/lab/interpretations/library': 'interpretations_library',
  '/lab/test-counts': 'test_counts',
  '/lab/analyzers': 'analyzers',
  '/usg/today': 'usg_today',
  '/usg/search': 'usg_reports',
  '/usg/templates': 'usg_templates',
  '/usg/signatures': 'usg_signatures',
  '/xray/today': 'xray_today',
  '/xray/search': 'xray_reports',
  '/xray/templates': 'xray_templates',
  '/xray/signatures': 'xray_signatures',
  '/manage/security': 'browser_security',
  '/manage/employees': 'employee_login',
  '/manage/doctor-access': 'doctor_access',
  '/cases/bill-print': 'printable_bill',
  '/lab/report-view': 'report_viewer',
  '/lab/enter-results': 'enter_results',
  '/settings': 'settings',
};

const screenToPath: Record<string, string> = {
  landing: '/',
  login: '/login',
  dashboard: '/dashboard',
  daily_business: '/business/daily',
  expenses: '/business/expenses',
  due_reports: '/business/due-reports',
  activities: '/business/activities',
  referral_business: '/business/referral',
  case_wise_report: '/business/case-wise',
  business_analysis: '/business/analysis',
  data_export: '/business/export',
  new_bill: '/cases/new',
  cases_ledger: '/cases/bills',
  outsource: '/cases/outsource',
  ct_scan: '/cases/ct-scan',
  patients: '/manage/patients',
  transactions: '/cases/transactions',
  doctors: '/manage/doctors',
  agents: '/manage/agents',
  today_reports: '/lab/today',
  search_reports: '/lab/search',
  packages: '/manage/packages',
  test_panels: '/manage/panels',
  test_categories: '/manage/categories',
  test_master: '/manage/tests',
  interpretations: '/lab/interpretations',
  interpretations_library: '/lab/interpretations/library',
  test_counts: '/lab/test-counts',
  analyzers: '/lab/analyzers',
  usg_today: '/usg/today',
  usg_reports: '/usg/search',
  usg_templates: '/usg/templates',
  usg_signatures: '/usg/signatures',
  xray_today: '/xray/today',
  xray_reports: '/xray/search',
  xray_templates: '/xray/templates',
  xray_signatures: '/xray/signatures',
  browser_security: '/manage/security',
  employee_login: '/manage/employees',
  doctor_access: '/manage/doctor-access',
  printable_bill: '/cases/bill-print',
  report_viewer: '/lab/report-view',
  enter_results: '/lab/enter-results',
  settings: '/settings',
};

export function App() {
  const [activeScreen, setActiveScreenState] = useState<string>(() => {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    return pathToScreen[path] || 'landing';
  });

  const setActiveScreen = (screen: string) => {
    setActiveScreenState(screen);
    const targetPath = screenToPath[screen] || '/';
    if (window.location.pathname !== targetPath) {
      window.history.pushState({}, '', targetPath);
    }
  };

  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname.replace(/\/$/, '') || '/';
      setActiveScreenState(pathToScreen[path] || 'landing');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAuthToken());
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isLocked, setIsLocked] = useState<boolean>(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  // Authenticated user session validation & URL token handling
  useEffect(() => {
    const checkSession = async () => {
      // 1. Check for email verification token in URL
      const urlParams = new URLSearchParams(window.location.search);
      const verifyToken = urlParams.get('verify_token');
      if (verifyToken) {
        try {
          const verifyRes = await authApi.verifyEmail(verifyToken);
          if (verifyRes.success) {
            alert('Your email address has been successfully verified! You can now receive reports and notifications.');
            window.history.replaceState({}, document.title, window.location.pathname);
          }
        } catch (err) {
          console.error('Email verification check failed:', err);
        }
      }

      // 2. Validate session token with backend /auth/me
      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        setIsCheckingAuth(false);
        return;
      }

      try {
        const meRes = await authApi.me();
        if (meRes.success && meRes.data) {
          setCurrentUser(meRes.data);
          setIsAuthenticated(true);
          setIsLocked(meRes.data.isTerminalLocked || false);
        } else {
          clearAuthToken();
          setIsAuthenticated(false);
          setCurrentUser(null);
        }
      } catch (err) {
        console.error('Session validation error:', err);
        clearAuthToken();
        setIsAuthenticated(false);
        setCurrentUser(null);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkSession();
  }, []);

  const handleLoginSuccess = (user: any, _token: string) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsLocked(user.isTerminalLocked || false);
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // ignore
    } finally {
      clearAuthToken();
      setIsAuthenticated(false);
      setCurrentUser(null);
      setIsLocked(false);
    }
  };

  const handleLockTerminal = async () => {
    try {
      await authApi.lockTerminal();
    } catch {
      // fallback
    }
    setIsLocked(true);
  };

  const handleUnlockTerminal = () => {
    setIsLocked(false);
  };

  // Keyboard shortcut listener: Alt+N for New Bill
  useEffect(() => {
    const handleGlobalKeys = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setActiveScreen('new_bill');
      }
    };
    window.addEventListener('keydown', handleGlobalKeys);
    return () => window.removeEventListener('keydown', handleGlobalKeys);
  }, []);


  const renderActiveScreen = () => {
    switch (activeScreen) {
      // 0. PUBLIC SCREENS
      case 'landing':
        return (
          <LandingPage
            onOpenLogin={() => setActiveScreen('login')}
            onOpenDashboard={() => setActiveScreen('dashboard')}
            currentUser={currentUser}
          />
        );

      // 1. STANDALONE SCREENS
      case 'dashboard':
        return (
          <DashboardPage
            onNavigateNewBill={() => setActiveScreen('new_bill')}
            onNavigateDailyBusiness={() => setActiveScreen('daily_business')}
            onNavigateExpenses={() => setActiveScreen('expenses')}
            onNavigateViewReport={() => setActiveScreen('report_viewer')}
            onNavigateDueReports={() => setActiveScreen('due_reports')}
            onNavigateTransactions={() => setActiveScreen('transactions')}
            onNavigateEmployeeLogins={() => setActiveScreen('employee_login')}
            onNavigateBrowserSecurity={() => setActiveScreen('browser_security')}
            onNavigateDoctorPortal={() => setActiveScreen('doctor_access')}
            onNavigatePrintableBill={() => setActiveScreen('printable_bill')}
          />
        );

      case 'new_bill':
        return (
          <NewBillPage
            onSaveAndEnterResults={() => setActiveScreen('enter_results')}
            onSaveAndPrintBill={() => setActiveScreen('printable_bill')}
          />
        );

      case 'getting_started':
        return (
          <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <h2 className="h1-title" style={{ marginBottom: '8px' }}>Getting Started with Labsmart</h2>
            <p className="text-muted" style={{ marginBottom: '24px' }}>
              Welcome to Labsmart LIS Cloud Edition. Follow these 4 quick steps to configure your laboratory.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                { title: '1. Configure Laboratory Profile & Letterhead', desc: 'Add clinic address, registration number, and custom letterhead margins.', completed: true, action: 'Edit Setup', target: 'settings' },
                { title: '2. Register Referring Doctors', desc: 'Add local consulting doctors and set referral incentive percentages.', completed: true, action: 'View Doctors', target: 'doctors' },
                { title: '3. Review Diagnostic Test Database', desc: 'Verify test prices, sample tube containers, and normal ranges for your region.', completed: true, action: 'Open Test Master', target: 'test_master' },
                { title: '4. Register Your First Patient Bill', desc: 'Create a case, add Complete Blood Count (CBC), and print an invoice receipt.', completed: true, action: 'Create New Bill', target: 'new_bill' },
              ].map((step, idx) => (
                <Card key={idx} style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <CheckCircle2 size={24} color="#15803d" />
                      <div>
                        <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{step.title}</h3>
                        <p className="text-muted" style={{ fontSize: '13px', marginTop: '2px', marginBottom: 0 }}>{step.desc}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" onClick={() => setActiveScreen(step.target)}>
                      {step.action}
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      // 2. BUSINESS GROUP
      case 'daily_business':
        return <DailyBusinessPage />;

      case 'expenses':
        return <ExpensesPage />;

      case 'due_reports':
        return <DueReportsPage />;

      case 'activities':
        return <ActivitiesPage />;

      case 'referral_business':
        return <ReferralBusinessPage />;

      case 'case_wise_report':
        return <CaseWiseReportPage />;

      case 'business_analysis':
        return <BusinessAnalysisPage />;

      case 'data_export':
        return <DataExportPage />;

      // 3. CASES GROUP
      case 'cases_ledger':
        return (
          <CasesLedgerPage
            onNavigateNewBill={() => setActiveScreen('new_bill')}
            onNavigateViewReport={() => setActiveScreen('report_viewer')}
            onNavigateEnterResults={() => setActiveScreen('enter_results')}
            onNavigatePrintBill={() => setActiveScreen('printable_bill')}
          />
        );

      case 'outsource':
        return <OutsourceCasesPage />;

      case 'ct_scan':
        return <CTScanCasesPage />;

      case 'patients':
        return <PatientsPage onNavigateNewBill={() => setActiveScreen('new_bill')} />;

      case 'transactions':
        return <TransactionsPage onNavigatePrintBill={() => setActiveScreen('printable_bill')} />;

      case 'doctors':
        return <DoctorsPage />;

      case 'agents':
        return <AgentsPage />;

      // 4. LAB GROUP
      case 'today_reports':
        return (
          <TodayReportsPage
            onNavigateEnterResults={() => setActiveScreen('enter_results')}
            onNavigateViewReport={() => setActiveScreen('report_viewer')}
            onNavigateNewBill={() => setActiveScreen('new_bill')}
            onNavigateSearchReports={() => setActiveScreen('search_reports')}
            onNavigateTestCounts={() => setActiveScreen('test_counts')}
          />
        );

      case 'search_reports':
        return (
          <SearchReportsPage
            onNavigateViewReport={() => setActiveScreen('report_viewer')}
            onNavigateEnterResults={() => setActiveScreen('enter_results')}
          />
        );

      case 'packages':
        return <PackagesPage onNavigate={(screen) => setActiveScreen(screen)} />;

      case 'test_panels':
        return <TestPanelsPage onNavigate={(screen) => setActiveScreen(screen)} />;

      case 'test_categories':
        return <TestCategoriesPage />;

      case 'test_master':
        return <TestMasterPage />;

      case 'interpretations':
        return <InterpretationsPage onNavigate={(screen) => setActiveScreen(screen)} />;

      case 'interpretations_library':
        return (
          <InterpretationsLibraryPage
            onNavigate={(screen) => setActiveScreen(screen)}
            onBack={() => setActiveScreen('interpretations')}
          />
        );

      case 'test_counts':
        return <TestCountsPage />;

      case 'analyzers':
        return <AnalyzersPage />;

      // 5. USG GROUP
      case 'usg_today':
        return <USGWorklistPage onNavigateNewBill={() => setActiveScreen('new_bill')} />;

      case 'usg_reports':
        return <USGReportsPage />;

      case 'usg_templates':
        return <USGTemplatesPage />;

      case 'usg_signatures':
        return <USGSignaturesPage />;

      // 6. DIGITAL X-RAY GROUP
      case 'xray_today':
        return <XRayWorklistPage onNavigateNewBill={() => setActiveScreen('new_bill')} />;

      case 'xray_reports':
        return <XRayReportsPage />;

      case 'xray_templates':
        return <XRayTemplatesPage />;

      case 'xray_signatures':
        return <XRaySignaturesPage />;

      // 7. MANAGE GROUP
      case 'browser_security':
        return <BrowserSecurityPage />;

      case 'employee_login':
        return <EmployeeLoginsPage />;

      case 'doctor_access':
        return <DoctorAccessPage />;

      case 'settings':
        return <SettingsPage />;

      // CORE SUB-VIEWS
      case 'printable_bill':
        return (
          <PrintableBillPage
            onBack={() => setActiveScreen('new_bill')}
            onNavigateModifyBill={() => setActiveScreen('new_bill')}
            onNavigateEnterResults={() => setActiveScreen('enter_results')}
          />
        );

      case 'patient_profile':
        return (
          <PatientProfilePage
            onBack={() => setActiveScreen('patients')}
            onEditProfile={() => setActiveScreen('printable_bill')}
            onAddCase={() => setActiveScreen('new_bill')}
            onViewBill={() => setActiveScreen('printable_bill')}
            onViewReport={() => setActiveScreen('report_viewer')}
          />
        );

      case 'enter_results':
        return (
          <EnterResultsPage
            onBack={() => setActiveScreen('cases_ledger')}
            onViewReport={() => setActiveScreen('report_viewer')}
          />
        );

      case 'report_viewer':
        return <ReportViewerPage onBack={() => setActiveScreen('enter_results')} />;

      default:
        return (
          <Card title="Laboratory Information System">
            <p className="text-muted">Screen active and verified.</p>
          </Card>
        );
    }
  };

  // Loading check
  if (isCheckingAuth) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b1329',
        color: '#ffffff',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>Aastha Polyclinic & Diagnostic Centre</div>
          <div style={{ fontSize: '13px', color: '#94a3b8' }}>Loading clinical session...</div>
        </div>
      </div>
    );
  }

  // 1. Landing Page (Publicly accessible to everyone)
  if (activeScreen === 'landing') {
    return (
      <LandingPage
        onOpenLogin={() => setActiveScreen('login')}
        onOpenDashboard={() => setActiveScreen('dashboard')}
        currentUser={currentUser}
      />
    );
  }

  // 2. Login Page
  if (activeScreen === 'login') {
    return (
      <LoginPage
        onLoginSuccess={(user, token) => {
          handleLoginSuccess(user, token);
          setActiveScreen('dashboard');
        }}
        onBackToHome={() => setActiveScreen('landing')}
      />
    );
  }

  // 3. Unauthenticated access to protected LIS routes
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLoginSuccess={(user, token) => {
          handleLoginSuccess(user, token);
          setActiveScreen('dashboard');
        }}
        onBackToHome={() => setActiveScreen('landing')}
      />
    );
  }

  return (
    <>
      <MasterAppShell
        activeScreen={activeScreen}
        onNavigate={(id) => setActiveScreen(id)}
        onLogout={handleLogout}
        onLockTerminal={handleLockTerminal}
        currentUser={currentUser}
      >
        {renderActiveScreen()}
      </MasterAppShell>

      {/* Terminal Lock Overlay Modal */}
      {isLocked && (
        <TerminalLockModal
          user={currentUser}
          onUnlock={handleUnlockTerminal}
          onSignOut={handleLogout}
        />
      )}
    </>
  );
}


export default App;
