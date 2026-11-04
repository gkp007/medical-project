import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Settings,
  ChevronDown,
  Headphones,
  HelpCircle,
  Bell,
  User,
  PlusCircle,
  MessageSquare,
  Gift,
  Building2,
  Printer,
  ShieldCheck,
  LogOut,
  Sliders,
  FileText,
  Lock,
  ExternalLink,
  MessageCircle,
  Phone
} from 'lucide-react';

export interface TopNavbarProps {
  onOpenSearch: () => void;
  onNavigateNewBill: () => void;
  onNavigateSettings: () => void;
  onOpenTicketModal?: () => void;
  onOpenSmsModal?: () => void;
  onOpenReferModal?: () => void;
  onOpenPrintGuideModal?: () => void;
  smsBalance?: number;
  activeBranch?: string;
  onSelectBranch?: (branchId: string) => void;
  clinicName?: string;
  userName?: string;
  userRole?: string;
  onLogout?: () => void;
  onLockTerminal?: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  onOpenSearch,
  onNavigateNewBill,
  onNavigateSettings,
  onOpenTicketModal,
  onOpenSmsModal,
  onOpenReferModal,
  onOpenPrintGuideModal,
  smsBalance = 240,
  activeBranch = 'main',
  onSelectBranch,
  clinicName = 'Apex Diagnostic Centre & Imaging Network',
  userName = 'Dr. Sameer Verma, MD',
  userRole = 'Super Admin',
  onLogout,
  onLockTerminal,
}) => {

  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState(activeBranch);

  const helpRef = useRef<HTMLDivElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setIsHelpOpen(false);
      if (branchRef.current && !branchRef.current.contains(e.target as Node)) setIsBranchOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setIsProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const branchOptions = [
    { id: 'main', label: 'Main Laboratory Branch', code: 'HQ' },
    { id: 'ag102', label: 'City Care Collection Center', code: 'AG-102' },
    { id: 'ag105', label: 'Sector 56 Phlebotomy Point', code: 'AG-105' },
  ];

  const currentBranchLabel = branchOptions.find((b) => b.id === selectedBranch)?.label || 'Main Laboratory Branch';

  // Dynamic SMS Balance Pill color
  const smsColor =
    smsBalance > 100
      ? { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' }
      : smsBalance > 20
      ? { bg: '#fef3c7', text: '#b45309', border: '#fde68a' }
      : { bg: '#fee2e2', text: '#b91c1c', border: '#fecaca' };

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '64px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        zIndex: 50,
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        boxShadow: '0 1px 3px rgba(0,0,0,0.03)',
      }}
    >
      {/* ------------------------------------------------------------- */}
      {/* 1. Left Section: Branding & Center Selector                   */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        {/* Lab Brand & Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none',
          }}
          onClick={() => (window.location.hash = '#/dashboard')}
        >
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #1d4ed8 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 2px 6px rgba(29, 78, 216, 0.25)',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {clinicName}
              </span>
              <span
                style={{
                  fontSize: '10px',
                  fontWeight: 700,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #86efac',
                  padding: '1px 6px',
                  borderRadius: '9999px',
                }}
              >
                NABL ISO 15189
              </span>
            </div>
            <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 500 }}>
              Diagnostic Laboratory & RIS Cloud
            </span>
          </div>
        </div>

        {/* Collection Centre / Franchise Selector Combobox */}
        <div style={{ position: 'relative' }} ref={branchRef}>
          <button
            type="button"
            onClick={() => setIsBranchOpen(!isBranchOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '34px',
              padding: '0 10px',
              backgroundColor: '#f8fafc',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#334155',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            title="Switch Collection Centre / Branch"
          >
            <Building2 size={14} color="#64748b" />
            <span style={{ maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {currentBranchLabel}
            </span>
            <ChevronDown size={13} color="#94a3b8" />
          </button>

          {isBranchOpen && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                left: 0,
                width: '260px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 20px -3px rgba(0,0,0,0.1)',
                padding: '6px 0',
                zIndex: 60,
              }}
            >
              <div style={{ padding: '6px 14px', fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                Active Centre / Branch
              </div>
              {branchOptions.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setSelectedBranch(b.id);
                    setIsBranchOpen(false);
                    localStorage.setItem('labsmart_active_branch', b.id);
                    if (onSelectBranch) onSelectBranch(b.id);
                  }}
                  style={{
                    padding: '8px 14px',
                    fontSize: '12px',
                    color: selectedBranch === b.id ? '#1d4ed8' : '#1e293b',
                    fontWeight: selectedBranch === b.id ? 700 : 500,
                    backgroundColor: selectedBranch === b.id ? '#eff6ff' : 'transparent',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => {
                    if (selectedBranch !== b.id) e.currentTarget.style.backgroundColor = '#f8fafc';
                  }}
                  onMouseLeave={(e) => {
                    if (selectedBranch !== b.id) e.currentTarget.style.backgroundColor = 'transparent';
                  }}
                >
                  <span>{b.label}</span>
                  <span style={{ fontSize: '10px', color: '#64748b', padding: '1px 5px', backgroundColor: '#e2e8f0', borderRadius: '4px' }}>
                    {b.code}
                  </span>
                </div>
              ))}
              <div
                onClick={() => {
                  setIsBranchOpen(false);
                  onNavigateSettings();
                }}
                style={{
                  padding: '8px 14px',
                  fontSize: '12px',
                  color: '#2563eb',
                  fontWeight: 600,
                  cursor: 'pointer',
                  borderTop: '1px solid #f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>+ Manage Centres & Franchises</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2. Center Section: Omnisearch Trigger                         */}
      {/* ------------------------------------------------------------- */}
      <div
        onClick={onOpenSearch}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          width: '360px',
          height: '38px',
          padding: '0 14px',
          backgroundColor: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '8px',
          color: '#64748b',
          fontSize: '13px',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#94a3b8';
          e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.06)';
          e.currentTarget.style.backgroundColor = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#cbd5e1';
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.backgroundColor = '#f8fafc';
        }}
        title="Open Global Omnisearch (Ctrl+K)"
      >
        <Search size={16} color="#64748b" />
        <span style={{ flex: 1, color: '#64748b' }}>Search patients, bill #, mobile, test...</span>
        <kbd
          style={{
            fontSize: '11px',
            fontWeight: 700,
            fontFamily: 'monospace',
            backgroundColor: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '4px',
            padding: '2px 6px',
            color: '#475569',
            boxShadow: '0 1px 1px rgba(0,0,0,0.05)',
          }}
        >
          Ctrl+K
        </kbd>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 3. Right Section: CTA Button, Utilities & Profile            */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* + New Bill CTA Button (Alt+N) */}
        <button
          type="button"
          onClick={onNavigateNewBill}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            height: '36px',
            padding: '0 14px',
            backgroundColor: '#1d4ed8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(29, 78, 216, 0.25)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e40af')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          title="Create New Patient Bill (Alt+N)"
        >
          <PlusCircle size={15} />
          <span>New Bill</span>
          <span
            style={{
              fontSize: '10px',
              fontWeight: 700,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              padding: '1px 5px',
              borderRadius: '4px',
              letterSpacing: '0.02em',
            }}
          >
            Alt+N
          </span>
        </button>

        {/* SMS Credits Status Badge */}
        <button
          type="button"
          onClick={() => {
            if (onOpenSmsModal) onOpenSmsModal();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '32px',
            padding: '0 10px',
            backgroundColor: smsColor.bg,
            border: `1px solid ${smsColor.border}`,
            color: smsColor.text,
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.02)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          title="SMS & WhatsApp Notification Balance - Click to Recharge"
        >
          <MessageSquare size={13} />
          <span>SMS: {smsBalance}</span>
        </button>

        {/* Refer & Earn Bonus Button */}
        <button
          type="button"
          onClick={() => {
            if (onOpenReferModal) onOpenReferModal();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            height: '32px',
            padding: '0 10px',
            backgroundColor: '#fffbeb',
            border: '1px solid #fde68a',
            color: '#b45309',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
          title="Refer another laboratory and get ₹1000 credit bonus"
        >
          <Gift size={14} color="#d97706" />
          <span>Refer Lab</span>
        </button>

        {/* Help & Support ▾ */}
        <div style={{ position: 'relative' }} ref={helpRef}>
          <button
            type="button"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              height: '32px',
              padding: '0 10px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '9999px',
              color: '#2563eb',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Headphones size={13} />
            <span>Help</span>
            <ChevronDown size={13} />
          </button>

          {isHelpOpen && (
            <div
              style={{
                position: 'absolute',
                top: '40px',
                right: 0,
                width: '230px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 20px -3px rgba(0,0,0,0.1)',
                padding: '6px 0',
                zIndex: 60,
              }}
            >
              <div
                onClick={() => {
                  setIsHelpOpen(false);
                  if (onOpenTicketModal) onOpenTicketModal();
                }}
                style={{ padding: '8px 14px', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Headphones size={15} color="#2563eb" />
                <span>Raise Support Ticket</span>
              </div>
              <div
                onClick={() => {
                  setIsHelpOpen(false);
                  if (onOpenPrintGuideModal) onOpenPrintGuideModal();
                }}
                style={{ padding: '8px 14px', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Printer size={15} color="#0891b2" />
                <span>Printer Setup Guide</span>
              </div>
              <div
                onClick={() => {
                  setIsHelpOpen(false);
                  window.open('https://api.whatsapp.com/send?phone=919876543210', '_blank');
                }}
                style={{ padding: '8px 14px', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <MessageCircle size={15} color="#16a34a" />
                <span>WhatsApp Support Desk</span>
              </div>
              <div
                onClick={() => {
                  setIsHelpOpen(false);
                  alert('Labsmart 24x7 Emergency Support Helpline: +91 98765 43210');
                }}
                style={{ padding: '8px 14px', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Phone size={15} color="#d97706" />
                <span>Call Helpline (+91 98765 43210)</span>
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div style={{ position: 'relative' }} ref={notifRef}>
          <button
            type="button"
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              border: 'none',
              backgroundColor: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#475569',
              cursor: 'pointer',
              position: 'relative',
            }}
            title="Notifications & Alerts"
          >
            <Bell size={17} />
            <span
              style={{
                position: 'absolute',
                top: '5px',
                right: '5px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#ef4444',
                border: '2px solid #ffffff',
              }}
            />
          </button>

          {isNotificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '320px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 20px -3px rgba(0,0,0,0.1)',
                padding: '12px',
                zIndex: 60,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>Live System Alerts</span>
                <span style={{ fontSize: '10px', color: '#15803d', fontWeight: 600, backgroundColor: '#dcfce7', padding: '1px 6px', borderRadius: '4px' }}>
                  Realtime
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ padding: '8px', backgroundColor: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', fontSize: '12px', color: '#991b1b' }}>
                  <strong>STAT Critical Alert:</strong> Potassium 7.2 mEq/L recorded for Patient Kavita Verma.
                </div>
                <div style={{ padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '12px', color: '#334155' }}>
                  <strong>SMS Balance:</strong> {smsBalance} SMS credits remaining. Automated dispatches active.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar Dropdown */}
        <div style={{ position: 'relative' }} ref={profileRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '4px 8px 4px 4px',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              backgroundColor: '#f8fafc',
              cursor: 'pointer',
            }}
            title="User Profile Menu"
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '12px',
                fontWeight: 700,
              }}
            >
              {userName.split(' ').map((n) => n[0]).slice(0, 2).join('')}
            </div>
            <div style={{ textAlign: 'left', lineHeight: 1.1 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>{userName}</div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>{userRole}</div>
            </div>
            <ChevronDown size={12} color="#94a3b8" />
          </button>

          {isProfileOpen && (
            <div
              style={{
                position: 'absolute',
                top: '42px',
                right: 0,
                width: '230px',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                boxShadow: '0 10px 20px -3px rgba(0,0,0,0.1)',
                padding: '8px 0',
                zIndex: 60,
              }}
            >
              <div style={{ padding: '8px 16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>{userName}</div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>Role: {userRole}</div>
              </div>
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  onNavigateSettings();
                }}
                style={{ padding: '8px 16px', fontSize: '13px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Sliders size={14} color="#64748b" />
                <span>Letterhead & Margins</span>
              </div>
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  onNavigateSettings();
                }}
                style={{ padding: '8px 16px', fontSize: '13px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ShieldCheck size={14} color="#64748b" />
                <span>Browser Device Security</span>
              </div>
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLockTerminal) onLockTerminal();
                }}
                style={{ padding: '8px 16px', fontSize: '13px', color: '#334155', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Lock size={14} color="#64748b" />
                <span>Lock Terminal Screen</span>
              </div>
              <div
                onClick={() => {
                  setIsProfileOpen(false);
                  if (onLogout) onLogout();
                }}
                style={{ padding: '8px 16px', fontSize: '13px', color: '#dc2626', cursor: 'pointer', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '8px' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef2f2')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <LogOut size={14} color="#dc2626" />
                <span>Sign Out</span>
              </div>
            </div>

          )}
        </div>
      </div>
    </header>
  );
};
