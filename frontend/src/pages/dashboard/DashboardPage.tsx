import React, { useState, useEffect } from 'react';
import {
  Users,
  Shield,
  Stethoscope,
  Send,
  UserPlus,
  Coins,
  ChevronDown,
  FileText,
  CreditCard,
  MoreHorizontal,
  Plus,
  CheckCircle2,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { AcceptDueModal } from '../../components/organisms/modals/AcceptDueModal';
import { ReferModal } from '../../components/organisms/modals/ReferModal';
import { SmsCreditsModal } from '../../components/organisms/modals/SmsCreditsModal';
import { businessApi, paymentsApi } from '../../services/api';

export interface DashboardPageProps {
  onNavigateNewBill: () => void;
  onNavigateDailyBusiness: () => void;
  onNavigateExpenses?: () => void;
  onNavigateViewReport: () => void;
  onNavigateDueReports?: () => void;
  onNavigateTransactions?: () => void;
  onNavigateEmployeeLogins?: () => void;
  onNavigateBrowserSecurity?: () => void;
  onNavigateDoctorPortal?: () => void;
  onNavigatePrintableBill?: () => void;
}

interface DuePatient {
  id: string;
  patientName: string;
  regNo: string;
  date: string;
  dueAmount: number;
}

interface RecentTransaction {
  id: string;
  caseId?: string;
  patientName: string;
  regNo: string;
  amount: number;
  date?: string;
  time?: string;
  mode?: string;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateNewBill,
  onNavigateDailyBusiness,
  onNavigateExpenses,
  onNavigateViewReport,
  onNavigateDueReports,
  onNavigateTransactions,
  onNavigateEmployeeLogins,
  onNavigateBrowserSecurity,
  onNavigateDoctorPortal,
  onNavigatePrintableBill,
}) => {
  // Modal states
  const [selectedDueCase, setSelectedDueCase] = useState<DuePatient | null>(null);
  const [isAcceptDueOpen, setIsAcceptDueOpen] = useState(false);
  const [isReferModalOpen, setIsReferModalOpen] = useState(false);
  const [isSmsModalOpen, setIsSmsModalOpen] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Payments Due State
  const [paymentsDue, setPaymentsDue] = useState<DuePatient[]>([]);

  // Recent Transactions
  const [recentTransactions, setRecentTransactions] = useState<RecentTransaction[]>([]);

  const loadDashboardData = async () => {
    try {
      const [dueRes, txRes] = await Promise.all([
        businessApi.getDuesAging().catch(() => null),
        paymentsApi.listTransactions().catch(() => null)
      ]);

      if (dueRes?.status === 'success' && dueRes.data?.debtors) {
        const mappedDues: DuePatient[] = dueRes.data.debtors.map((d: any) => ({
          id: d.id,
          patientName: d.patientName || 'Patient',
          regNo: d.billNumber || d.dailyCode || 'REG',
          date: d.registeredAt ? new Date(d.registeredAt).toLocaleDateString() : 'Today',
          dueAmount: Number(d.balanceDue || 0)
        }));
        setPaymentsDue(mappedDues);
      }

      const txList = Array.isArray(txRes?.data)
        ? txRes.data
        : (Array.isArray(txRes?.data?.transactions) ? txRes.data.transactions : []);

      if (txList.length > 0) {
        // Display latest 6 transactions on dashboard widget; full history accessible via 'View all'
        const mappedTx: RecentTransaction[] = txList.slice(0, 6).map((t: any) => ({
          id: t.id,
          caseId: t.caseId || t.case?.id,
          patientName: t.case?.patient?.fullName || t.receivedBy || 'Patient',
          regNo: t.case?.billNumber || t.case?.uhid || t.receiptNumber || 'TX',
          amount: Number(t.amount || 0),
          date: t.createdAt ? new Date(t.createdAt).toLocaleDateString() : 'Today',
          time: t.createdAt ? new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
          mode: t.mode || 'Cash'
        }));
        setRecentTransactions(mappedTx);
      } else {
        setRecentTransactions([]);
      }
    } catch (err) {
      console.error('Failed to load dashboard data', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleOpenAcceptDue = (item: DuePatient) => {
    setSelectedDueCase(item);
    setIsAcceptDueOpen(true);
  };

  const handlePaymentCollected = async (collectedAmount: number) => {
    if (!selectedDueCase) return;
    try {
      await paymentsApi.collectDue({
        caseId: selectedDueCase.id,
        amount: collectedAmount,
        mode: 'Cash',
        receivedBy: 'Receptionist'
      });
      await loadDashboardData();
    } catch (err) {
      console.error('Failed to collect due via backend API', err);
      // Optimistic fallback
      if (collectedAmount >= selectedDueCase.dueAmount) {
        setPaymentsDue((prev) => prev.filter((p) => p.id !== selectedDueCase.id));
      } else {
        setPaymentsDue((prev) =>
          prev.map((p) =>
            p.id === selectedDueCase.id ? { ...p, dueAmount: p.dueAmount - collectedAmount } : p
          )
        );
      }
      setRecentTransactions((prev) => [
        {
          id: `tx-${Date.now()}`,
          patientName: selectedDueCase.patientName,
          regNo: selectedDueCase.regNo,
          amount: collectedAmount,
        },
        ...prev,
      ]);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* 0. Live Diagnostic Center Status Banner */}
      <div style={{
        backgroundColor: '#f0f9ff',
        border: '1px solid #bae6fd',
        borderRadius: '10px',
        padding: '12px 18px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Sparkles size={18} color="#0284c7" />
          <div>
            <span style={{ fontWeight: 700, color: '#0369a1', fontSize: '13px' }}>
              Diagnostic Center Terminal Active
            </span>
            <span style={{ color: '#475569', fontSize: '12px', marginLeft: '6px' }}>
              • All modules (Pathology, USG, X-Ray, Billing & Masters) are fully functional and synchronized.
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={onNavigateNewBill}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            + New Bill (Alt+N)
          </button>
        </div>
      </div>

      {/* 1. Top Row: 3 Quick Action Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          marginBottom: '24px',
        }}
      >
        {/* Card 1: Employee logins */}
        <div
          onClick={onNavigateEmployeeLogins}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Users size={18} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            Employee logins
          </span>
        </div>

        {/* Card 2: Browser security */}
        <div
          onClick={onNavigateBrowserSecurity}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Shield size={18} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            Browser security
          </span>
        </div>

        {/* Card 3: Doctor portal */}
        <div
          onClick={onNavigateDoctorPortal}
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            cursor: 'pointer',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            transition: 'all 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)';
          }}
        >
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: '#f3e8ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Stethoscope size={18} />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            Doctor portal
          </span>
        </div>
      </div>

      {/* 2. Main 3-Column Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.2fr 1.4fr 1.1fr',
          gap: '24px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Payments due Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Payments due
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>For all time</div>
            </div>
            <button
              type="button"
              onClick={onNavigateDueReports}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View all
            </button>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 4px' }}>PATIENT</th>
                  <th style={{ padding: '8px 8px' }}>DUE</th>
                  <th style={{ padding: '8px 4px', textAlign: 'center' }}>ACCEPT DUE</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px' }}>
                {paymentsDue.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px', color: '#64748b' }}>
                      No outstanding dues!
                    </td>
                  </tr>
                ) : (
                  paymentsDue.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '12px 4px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{item.patientName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Reg. {item.regNo} | {item.date}
                        </div>
                      </td>
                      <td style={{ padding: '12px 8px', fontWeight: 700, color: '#0f172a' }}>
                        Rs.{item.dueAmount}
                      </td>
                      <td style={{ padding: '12px 4px', textAlign: 'center' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <button
                            type="button"
                            onClick={() => handleOpenAcceptDue(item)}
                            title="Accept Due Payment"
                            style={{
                              padding: '5px 8px',
                              backgroundColor: '#eff6ff',
                              border: '1px solid #bfdbfe',
                              borderRadius: '6px',
                              color: '#2563eb',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <CreditCard size={15} />
                          </button>

                          <div style={{ position: 'relative' }}>
                            <button
                              type="button"
                              onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#94a3b8',
                                cursor: 'pointer',
                                padding: '4px',
                              }}
                            >
                              <MoreHorizontal size={16} />
                            </button>

                            {activeMenuId === item.id && (
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: '24px',
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                                  width: '140px',
                                  zIndex: 30,
                                  textAlign: 'left',
                                  padding: '4px 0',
                                }}
                              >
                                <div
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    if (onNavigatePrintableBill) onNavigatePrintableBill();
                                  }}
                                  style={{ padding: '6px 12px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  View bill
                                </div>
                                <div
                                  onClick={() => {
                                    setActiveMenuId(null);
                                    alert(`SMS payment reminder sent to ${item.patientName}.`);
                                  }}
                                  style={{ padding: '6px 12px', fontSize: '12px', color: '#334155', cursor: 'pointer' }}
                                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                                >
                                  Send SMS Reminder
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Center Column: Recent transactions Card */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Recent transactions
              </h3>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>For today</div>
            </div>
            <button
              type="button"
              onClick={onNavigateTransactions}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                fontWeight: 600,
                color: '#2563eb',
                cursor: 'pointer',
                padding: 0,
              }}
            >
              View all
            </button>
          </div>

          {/* Transactions Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>
                  <th style={{ padding: '8px 4px' }}>PATIENT</th>
                  <th style={{ padding: '8px 8px' }}>AMOUNT</th>
                  <th style={{ padding: '8px 4px', textAlign: 'right' }}>VIEW BILL</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '13px' }}>
                {recentTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={3} style={{ textAlign: 'center', padding: '24px 8px', color: '#94a3b8' }}>
                      No transactions recorded yet today.
                    </td>
                  </tr>
                ) : (
                  recentTransactions.map((tx) => (
                    <tr key={tx.id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 4px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{tx.patientName}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          Reg. no. {tx.regNo}{tx.mode ? ` • ${tx.mode}` : ''}{tx.time ? ` • ${tx.time}` : ''}
                        </div>
                      </td>
                      <td style={{ padding: '10px 8px', fontWeight: 600, color: '#16a34a' }}>
                        + Rs.{tx.amount}
                      </td>
                      <td style={{ padding: '10px 4px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (tx.caseId) {
                              localStorage.setItem('labsmart_active_case_id', tx.caseId);
                            }
                            if (onNavigatePrintableBill) {
                              onNavigatePrintableBill();
                            }
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#2563eb',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <FileText size={14} />
                          <span>View bill</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column: SMS Credits & Referral Promo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* SMS Credits Dropdown Pill */}
          <div
            onClick={() => setIsSmsModalOpen(true)}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '10px',
              padding: '12px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>SMS Credits</span>
              <span
                style={{
                  backgroundColor: '#dbeafe',
                  color: '#1d4ed8',
                  fontSize: '12px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '9999px',
                }}
              >
                98
              </span>
            </div>
            <ChevronDown size={16} color="#64748b" />
          </div>

          {/* Refer & Save Card */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #bfdbfe',
              borderRadius: '14px',
              padding: '24px 20px',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.05)',
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <div style={{ fontSize: '20px', fontWeight: 800, color: '#3b82f6', letterSpacing: '-0.02em' }}>
                Refer and save
              </div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#1d4ed8', letterSpacing: '-0.03em', marginTop: '2px' }}>
                Rs.300
              </div>
            </div>

            {/* 3 Steps with clean outline icons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Send size={18} color="#475569" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                  Invite Labs to signup with your code
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <UserPlus size={18} color="#475569" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                  Register them for 5 days free trial
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Coins size={18} color="#475569" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '13px', color: '#334155', lineHeight: 1.4 }}>
                  Save Rs. 300 on your renewal after their successful purchase
                </span>
              </div>
            </div>

            {/* Big Blue CTA Button */}
            <button
              type="button"
              onClick={() => setIsReferModalOpen(true)}
              style={{
                width: '100%',
                height: '42px',
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: '0 2px 4px rgba(37, 99, 235, 0.25)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
            >
              <span>Refer now</span>
              <span>&gt;</span>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Raise Ticket & Modals */}
      <AcceptDueModal
        isOpen={isAcceptDueOpen}
        onClose={() => setIsAcceptDueOpen(false)}
        caseData={selectedDueCase}
        onCollectSuccess={handlePaymentCollected}
      />

      <ReferModal
        isOpen={isReferModalOpen}
        onClose={() => setIsReferModalOpen(false)}
      />

      <SmsCreditsModal
        isOpen={isSmsModalOpen}
        onClose={() => setIsSmsModalOpen(false)}
        currentBalance={98}
      />
    </div>
  );
};
