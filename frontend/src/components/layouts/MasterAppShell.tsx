import React, { useState, useEffect } from 'react';
import { TopNavbar } from '../organisms/TopNavbar';
import { LeftSidebar } from '../organisms/LeftSidebar';
import { OmnisearchModal } from '../organisms/OmnisearchModal';
import { EmailVerificationBanner } from '../atoms/EmailVerificationBanner';
import { RaiseTicketModal } from '../organisms/modals/RaiseTicketModal';
import { SmsCreditsModal } from '../organisms/modals/SmsCreditsModal';
import { ReferModal } from '../organisms/modals/ReferModal';
import { PrintSettingsGuideModal } from '../organisms/modals/PrintSettingsGuideModal';
import { Headphones } from 'lucide-react';
import { authApi, shellApi, getAuthToken } from '../../services/api';

export interface MasterAppShellProps {
  children: React.ReactNode;
  activeScreen: string;
  onNavigate: (screenId: string) => void;
  onLogout?: () => void;
  onLockTerminal?: () => void;
  currentUser?: any;
}

export const MasterAppShell: React.FC<MasterAppShellProps> = ({
  children,
  activeScreen,
  onNavigate,
  onLogout,
  onLockTerminal,
  currentUser,
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [isSmsOpen, setIsSmsOpen] = useState(false);
  const [isReferOpen, setIsReferOpen] = useState(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);

  // Shell context state
  const [activeBranch, setActiveBranch] = useState<string>(
    () => localStorage.getItem('labsmart_active_branch') || 'main'
  );
  const [clinicName, setClinicName] = useState('Apex Diagnostic Centre');
  const [userName, setUserName] = useState(currentUser?.fullName || 'Dr. Sameer Verma, MD');
  const [userRole, setUserRole] = useState(currentUser?.role || 'Super Admin');
  const [smsBalance, setSmsBalance] = useState(240);

  // Sync with currentUser changes
  useEffect(() => {
    if (currentUser?.fullName) setUserName(currentUser.fullName);
    if (currentUser?.role) setUserRole(currentUser.role);
  }, [currentUser]);

  // Initial Shell context sync
  useEffect(() => {
    const initShell = async () => {
      try {
        const token = getAuthToken();
        if (!token) return;

        const contextRes = await shellApi.getContext(activeBranch);
        if (contextRes.success && contextRes.data) {
          const { clinic, user, credits } = contextRes.data;
          if (clinic?.name) setClinicName(clinic.name);
          if (user?.fullName) setUserName(user.fullName);
          if (user?.role) setUserRole(user.role);
          if (credits?.smsBalance !== undefined) setSmsBalance(credits.smsBalance);
        }
      } catch (err) {
        console.error('Failed to initialize shell context:', err);
      }
    };

    initShell();
  }, [activeBranch]);


  // Global Keyboard Shortcuts (Ctrl+K for search, Alt+N for new bill, Esc to close modals)
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.altKey && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        onNavigate('new_bill');
      } else if (e.key === 'Escape') {
        if (isSearchOpen) setIsSearchOpen(false);
        if (isTicketOpen) setIsTicketOpen(false);
        if (isSmsOpen) setIsSmsOpen(false);
        if (isReferOpen) setIsReferOpen(false);
        if (isPrintGuideOpen) setIsPrintGuideOpen(false);
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [isSearchOpen, isTicketOpen, isSmsOpen, isReferOpen, isPrintGuideOpen, onNavigate]);

  const handleBranchChange = async (branchId: string) => {
    setActiveBranch(branchId);
    localStorage.setItem('labsmart_active_branch', branchId);
    try {
      const res = await shellApi.getContext(branchId);
      if (res.success && res.data?.clinic?.name) {
        setClinicName(res.data.clinic.name);
      }
    } catch (err) {
      console.error('Failed to change branch context:', err);
    }
  };

  return (
    <div className="app-container" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      {/* Top Navbar */}
      <TopNavbar
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateNewBill={() => onNavigate('new_bill')}
        onNavigateSettings={() => onNavigate('settings')}
        onOpenTicketModal={() => setIsTicketOpen(true)}
        onOpenSmsModal={() => setIsSmsOpen(true)}
        onOpenReferModal={() => setIsReferOpen(true)}
        onOpenPrintGuideModal={() => setIsPrintGuideOpen(true)}
        smsBalance={smsBalance}
        activeBranch={activeBranch}
        onSelectBranch={handleBranchChange}
        clinicName={clinicName}
        userName={userName}
        userRole={userRole}
        onLogout={onLogout}
        onLockTerminal={onLockTerminal}
      />

      {/* Left Sidebar Navigation */}
      <LeftSidebar activeScreen={activeScreen} onNavigate={onNavigate} />

      {/* Main Content Area */}
      <main
        className="app-main"
        style={{
          marginTop: '64px',
          marginLeft: '240px',
          minHeight: 'calc(100vh - 64px)',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#f8fafc',
          padding: 0,
        }}
      >
        {/* Email Verification Pending Warning Banner */}
        <EmailVerificationBanner
          userEmail={currentUser?.email || 'gkpattanaik001@gmail.com'}
          isVerified={currentUser?.isEmailVerified}
        />


        {/* Dynamic Page Screen Canvas */}
        <div style={{ padding: '24px', flex: 1 }}>
          {children}
        </div>

        {/* Global Footer with Social Channels */}
        <footer
          style={{
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
            padding: '16px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <div>
            &copy; 2026 Labsmart LIS Cloud. All rights reserved. &bull; <span style={{ color: '#16a34a', fontWeight: 600 }}>System Healthy (Online)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span>Follow us on:</span>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#ef4444', display: 'flex', alignItems: 'center' }}
              title="YouTube"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#1877f2', display: 'flex', alignItems: 'center' }}
              title="Facebook"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: '#e1306c', display: 'flex', alignItems: 'center' }}
              title="Instagram"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>
          </div>
        </footer>
      </main>

      {/* Bottom Right Floating Widget: Raise Ticket */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 40,
        }}
      >
        <button
          type="button"
          onClick={() => setIsTicketOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 18px',
            backgroundColor: '#ffffff',
            border: '1px solid #bfdbfe',
            borderRadius: '9999px',
            color: '#1e3a8a',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(37, 99, 235, 0.16)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 18px rgba(37, 99, 235, 0.22)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(37, 99, 235, 0.16)';
          }}
        >
          <div
            style={{
              width: '26px',
              height: '26px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Headphones size={15} />
          </div>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 700, lineHeight: 1.1 }}>Raise Ticket</div>
            <div style={{ fontSize: '10px', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#16a34a' }} />
              Desk Online
            </div>
          </div>
        </button>
      </div>

      {/* Omnisearch Modal Dialog */}
      <OmnisearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectResult={(type, id, extra) => {
          if (type === 'bill') {
            onNavigate('printable_bill');
          } else if (type === 'patient') {
            onNavigate('patients');
          } else if (type === 'test') {
            onNavigate('test_master');
          } else if (type === 'doctor') {
            onNavigate('doctors');
          }
        }}
      />

      {/* Raise Ticket Modal Dialog */}
      <RaiseTicketModal
        isOpen={isTicketOpen}
        onClose={() => setIsTicketOpen(false)}
      />

      {/* SMS Credits Modal Dialog */}
      <SmsCreditsModal
        isOpen={isSmsOpen}
        onClose={() => setIsSmsOpen(false)}
        currentBalance={smsBalance}
        onRechargeSuccess={(newBalance) => setSmsBalance(newBalance)}
      />

      {/* Refer & Earn Bonus Modal Dialog */}
      <ReferModal
        isOpen={isReferOpen}
        onClose={() => setIsReferOpen(false)}
        referralCode="LAB3774"
      />

      {/* Print Settings Guide Modal */}
      <PrintSettingsGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
      />
    </div>
  );
};
