import React, { useState } from 'react';
import {
  CheckCircle2,
  Home,
  BarChart2,
  ClipboardList,
  Microscope,
  Radio,
  Film,
  Settings2,
  Plus,
  ChevronDown,
  ChevronUp,
  Calendar,
  Wallet,
  Clock,
  Bell,
  UserCheck,
  FileSpreadsheet,
  LineChart,
  Download,
  Users,
  CreditCard,
  FileCheck,
  Layers,
  FolderTree,
  Database,
  BookOpen,
  PieChart,
  Shield,
  UserPlus,
  Cpu
} from 'lucide-react';

export interface LeftSidebarProps {
  activeScreen: string;
  onNavigate: (screenId: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({ activeScreen, onNavigate }) => {
  // Accordion open/close state for all 6 sections (Business open by default as in screenshot)
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({
    business: true,
    cases: true,
    lab: true,
    usg: true,
    xray: true,
    manage: true,
  });

  // Automatically keep parent section open if a sub-screen is active
  React.useEffect(() => {
    if (['daily_business', 'expenses', 'due_reports', 'activities', 'referral_business', 'case_wise_report', 'business_analysis', 'data_export'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, business: true }));
    } else if (['cases_ledger', 'outsource', 'ct_scan', 'patients', 'transactions', 'doctors', 'agents'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, cases: true }));
    } else if (['today_reports', 'search_reports', 'packages', 'test_panels', 'test_categories', 'test_master', 'interpretations', 'interpretations_library', 'test_counts', 'analyzers'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, lab: true }));
    } else if (['usg_today', 'usg_reports', 'usg_templates', 'usg_signatures'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, usg: true }));
    } else if (['xray_today', 'xray_reports', 'xray_templates', 'xray_signatures'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, xray: true }));
    } else if (['browser_security', 'employee_login', 'doctor_access'].includes(activeScreen)) {
      setOpenSections((prev) => ({ ...prev, manage: true }));
    }
  }, [activeScreen]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <aside
      className="app-sidebar"
      style={{
        width: '240px',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e2e8f0',
        padding: '12px 8px 32px 8px',
        overflowY: 'auto',
      }}
    >
      {/* Brand Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '4px 8px 16px 8px',
          cursor: 'pointer',
          userSelect: 'none',
        }}
        onClick={() => onNavigate('dashboard')}
      >
        <div style={{ color: '#2563eb' }}>
          <Microscope size={28} strokeWidth={2.5} />
        </div>
        <span style={{ fontSize: '20px', fontWeight: 800, color: '#1e293b', letterSpacing: '-0.02em' }}>
          Labsmart
        </span>
      </div>

      {/* Prominent Pill CTA: + New bill */}
      <div style={{ padding: '0 4px 12px 4px' }}>
        <button
          type="button"
          onClick={() => onNavigate('new_bill')}
          style={{
            width: '100%',
            height: '40px',
            backgroundColor: '#2563eb',
            color: '#ffffff',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <Plus size={18} strokeWidth={2.5} />
          <span>New bill</span>
        </button>
      </div>

      {/* Standalone Item 1: Getting Started */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '9px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 500,
          color: activeScreen === 'getting_started' ? '#2563eb' : '#334155',
          backgroundColor: activeScreen === 'getting_started' ? '#eff6ff' : 'transparent',
          marginBottom: '4px',
        }}
        onClick={() => onNavigate('getting_started')}
      >
        <CheckCircle2 size={18} color={activeScreen === 'getting_started' ? '#2563eb' : '#475569'} />
        <span>Getting Started</span>
      </div>

      {/* Standalone Item 2: Dashboard */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '9px 12px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          color: activeScreen === 'dashboard' ? '#2563eb' : '#334155',
          backgroundColor: activeScreen === 'dashboard' ? '#eff6ff' : 'transparent',
          marginBottom: '6px',
        }}
        onClick={() => onNavigate('dashboard')}
      >
        <Home size={18} color={activeScreen === 'dashboard' ? '#2563eb' : '#475569'} />
        <span>Dashboard</span>
      </div>

      {/* Group 1: Business (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.business ? '#2563eb' : '#334155',
            backgroundColor: openSections.business ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('business')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart2 size={18} />
            <span>Business</span>
          </div>
          {openSections.business ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.business && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'daily_business', label: 'Daily business', icon: <Calendar size={16} /> },
              { id: 'expenses', label: 'Expenses', icon: <Wallet size={16} /> },
              { id: 'due_reports', label: 'Due reports', icon: <Clock size={16} /> },
              { id: 'activities', label: 'Activities', icon: <Bell size={16} /> },
              { id: 'referral_business', label: 'Referral business', icon: <UserCheck size={16} /> },
              { id: 'case_wise_report', label: 'Case wise report', icon: <FileSpreadsheet size={16} /> },
              { id: 'business_analysis', label: 'Business analysis', icon: <LineChart size={16} /> },
              { id: 'data_export', label: 'Data export', icon: <Download size={16} /> },
            ].map((sub) => {
              const isActive = activeScreen === sub.id;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 2: Cases (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.cases ? '#2563eb' : '#334155',
            backgroundColor: openSections.cases ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('cases')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ClipboardList size={18} />
            <span>Cases</span>
          </div>
          {openSections.cases ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.cases && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'cases_ledger', label: 'Bills', icon: <FileCheck size={16} /> },
              { id: 'outsource', label: 'Outsource cases', icon: <Microscope size={16} /> },
              { id: 'ct_scan', label: 'Ct scan cases', icon: <Radio size={16} /> },
              { id: 'patients', label: 'Patients', icon: <Users size={16} /> },
              { id: 'transactions', label: 'Transactions', icon: <CreditCard size={16} /> },
              { id: 'doctors', label: 'Referral Doctors', icon: <UserCheck size={16} /> },
              { id: 'agents', label: 'Sample collection agents', icon: <UserPlus size={16} /> },
            ].map((sub) => {
              const isActive = activeScreen === sub.id;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 3: Lab (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.lab ? '#2563eb' : '#334155',
            backgroundColor: openSections.lab ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('lab')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Microscope size={18} />
            <span>Lab</span>
          </div>
          {openSections.lab ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.lab && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'today_reports', label: "Today's reports", icon: <Calendar size={16} /> },
              { id: 'search_reports', label: 'Search reports', icon: <FileCheck size={16} /> },
              { id: 'packages', label: 'Test packages', icon: <Layers size={16} /> },
              { id: 'test_panels', label: 'Test panels', icon: <FolderTree size={16} /> },
              { id: 'test_categories', label: 'Test categories', icon: <FolderTree size={16} /> },
              { id: 'test_master', label: 'Test database', icon: <Database size={16} /> },
              { id: 'interpretations', label: 'Interpretations', icon: <BookOpen size={16} /> },
              { id: 'test_counts', label: 'Test counts', icon: <PieChart size={16} /> },
              { id: 'analyzers', label: 'Analyzer interfacing', icon: <Cpu size={16} /> },
            ].map((sub) => {
              const isActive =
                activeScreen === sub.id ||
                (sub.id === 'interpretations' && activeScreen === 'interpretations_library');
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 4: USG (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.usg ? '#2563eb' : '#334155',
            backgroundColor: openSections.usg ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('usg')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Radio size={18} />
            <span>USG</span>
          </div>
          {openSections.usg ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.usg && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'usg_today', label: "Today's cases", icon: <Calendar size={16} /> },
              { id: 'usg_reports', label: 'Search cases', icon: <FileCheck size={16} /> },
              { id: 'usg_templates', label: 'Report templates', icon: <BookOpen size={16} /> },
              { id: 'usg_signatures', label: 'Signatures', icon: <UserCheck size={16} /> },
            ].map((sub) => {
              const isActive = activeScreen === sub.id;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 5: Digital X-ray (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.xray ? '#2563eb' : '#334155',
            backgroundColor: openSections.xray ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('xray')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Film size={18} />
            <span>Digital X-ray</span>
          </div>
          {openSections.xray ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.xray && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'xray_today', label: "Today's cases", icon: <Calendar size={16} /> },
              { id: 'xray_reports', label: 'Search cases', icon: <FileCheck size={16} /> },
              { id: 'xray_templates', label: 'Report templates', icon: <BookOpen size={16} /> },
              { id: 'xray_signatures', label: 'Signatures', icon: <UserCheck size={16} /> },
            ].map((sub) => {
              const isActive = activeScreen === sub.id;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 6: Manage (Accordion) */}
      <div style={{ marginBottom: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '9px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 600,
            color: openSections.manage ? '#2563eb' : '#334155',
            backgroundColor: openSections.manage ? '#f0f7ff' : 'transparent',
          }}
          onClick={() => toggleSection('manage')}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Settings2 size={18} />
            <span>Manage</span>
          </div>
          {openSections.manage ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>

        {openSections.manage && (
          <div style={{ marginLeft: '18px', paddingLeft: '12px', borderLeft: '1px solid #cbd5e1', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {[
              { id: 'browser_security', label: 'Browser security', icon: <Shield size={16} /> },
              { id: 'employee_login', label: 'Employee login', icon: <Users size={16} /> },
              { id: 'doctor_access', label: 'Doctor access', icon: <UserPlus size={16} /> },
            ].map((sub) => {
              const isActive = activeScreen === sub.id;
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    color: isActive ? '#2563eb' : '#475569',
                    backgroundColor: isActive ? '#eff6ff' : 'transparent',
                  }}
                  onClick={() => onNavigate(sub.id)}
                >
                  <span style={{ color: isActive ? '#2563eb' : '#64748b' }}>{sub.icon}</span>
                  <span>{sub.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};
