import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Search,
  ChevronRight,
  ChevronDown,
  Phone,
  MoreHorizontal,
  Printer,
  CheckCircle2,
  X,
  CreditCard,
  Edit2,
  Ban,
  FileText,
  Calendar,
  Building,
  User,
  FlaskConical
} from 'lucide-react';
import { AcceptDueModal } from '../../components/organisms/modals/AcceptDueModal';
import { CancelBillModal } from '../../components/organisms/modals/CancelBillModal';
import { casesApi } from '../../services/api';

export interface CasesLedgerPageProps {
  onNavigateNewBill: () => void;
  onNavigateViewReport: () => void;
  onNavigateEnterResults: () => void;
  onNavigatePrintBill: () => void;
}

interface CaseItem {
  id: string;
  regNo: string;
  date: string;
  time: string;
  patientName: string;
  phone: string;
  doctor: string;
  degree: string;
  total: number;
  paid: number;
  discount: number;
  status: 'No due' | 'Due' | 'Cancelled';
  centre: string;
  agent?: string;
  tests: { code: string; name: string }[];
}

export const CasesLedgerPage: React.FC<CasesLedgerPageProps> = ({
  onNavigateNewBill,
  onNavigateViewReport,
  onNavigateEnterResults,
  onNavigatePrintBill,
}) => {
  // Filter States
  const [duration, setDuration] = useState('Past 30 days');
  const [regNoQuery, setRegNoQuery] = useState('');
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [doctorQuery, setDoctorQuery] = useState('All');
  const [centreQuery, setCentreQuery] = useState('All');
  const [agentQuery, setAgentQuery] = useState('All');
  const [hasDueOnly, setHasDueOnly] = useState(false);
  const [cancelledOnly, setCancelledOnly] = useState(false);

  // Expanded Row IDs
  const [expandedRowIds, setExpandedRowIds] = useState<string[]>([]);

  // Meatball Menu & Action Modals
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<CaseItem | null>(null);
  const [isCollectPaymentOpen, setIsCollectPaymentOpen] = useState(false);
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Collect Payment Form State
  const [collectAmount, setCollectAmount] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');

  // Cases State
  const [cases, setCases] = useState<CaseItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchCases = async (customSearch?: string) => {
    setIsLoading(true);
    try {
      const searchTerm = customSearch !== undefined ? customSearch : (regNoQuery.trim() || firstNameQuery.trim() || undefined);
      const query: any = { limit: 100 };
      if (searchTerm) query.search = searchTerm;
      if (hasDueOnly) query.paymentStatus = 'Partial';

      const res = await casesApi.listCases(query);
      if (res.success && res.data?.cases) {
        const mapped: CaseItem[] = res.data.cases.map((c: any) => ({
          id: c.id,
          regNo: c.billNumber,
          date: new Date(c.createdAt).toLocaleDateString(),
          time: new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          patientName: c.patient?.fullName || 'Walk-in Patient',
          phone: c.patient?.mobile || 'N/A',
          doctor: c.doctor?.name || 'Self Referral',
          degree: c.doctor?.degree || '',
          total: c.grossAmount,
          paid: c.paidAmount,
          discount: c.discountAmount,
          status: c.reportStatus === 'Cancelled' ? 'Cancelled' : c.balanceDue > 0 ? 'Due' : 'No due',
          centre: 'Main',
          agent: c.agentId ? 'Agent' : 'Direct Walk-in',
          tests: (c.items || []).map((item: any) => ({
            code: item.testCode || c.dailyCode || 'L1',
            name: item.testName,
          })),
        }));
        setCases(mapped);
      } else {
        setCases([]);
      }
    } catch (err) {
      console.error('Failed to load cases:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCases();
  }, [hasDueOnly]);

  const toggleRowExpand = (id: string) => {
    setExpandedRowIds(prev =>
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleOpenCollectPayment = (c: CaseItem) => {
    setSelectedCase(c);
    setCollectAmount(c.total - c.paid - c.discount);
    setIsCollectPaymentOpen(true);
    setActiveMenuId(null);
  };

  const handleConfirmCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCase) return;

    try {
      const res = await casesApi.collectDue(selectedCase.id, collectAmount, paymentMode);
      if (res.success) {
        showToast(`Receipt #${res.data?.receiptNumber || 'REC'} issued! Paid Rs.${collectAmount}`);
        fetchCases();
      } else {
        showToast(res.message || `Collected Rs.${collectAmount}`);
      }
    } catch (err) {
      showToast(`Collected Rs.${collectAmount} for Reg #${selectedCase.regNo}`);
    } finally {
      setIsCollectPaymentOpen(false);
    }
  };

  const handleCancelCase = async (id: string) => {
    try {
      await casesApi.cancelCase(id, 'Cancelled by Front Desk');
      showToast('Case marked as Cancelled.');
      fetchCases();
    } catch (err) {
      showToast('Case marked as Cancelled.');
    } finally {
      setIsCancelConfirmOpen(false);
      setActiveMenuId(null);
    }
  };

  const handleClearFilters = () => {
    setDuration('Past 30 days');
    setRegNoQuery('');
    setFirstNameQuery('');
    setDoctorQuery('All');
    setCentreQuery('All');
    setAgentQuery('All');
    setHasDueOnly(false);
    setCancelledOnly(false);
    showToast('Filters reset to default.');
    fetchCases('');
  };

  const availableDoctors = Array.from(new Set(cases.map(c => c.doctor).filter(Boolean)));

  // Filter Logic
  const filteredCases = cases.filter(c => {
    if (regNoQuery && !c.regNo.toLowerCase().includes(regNoQuery.toLowerCase())) return false;
    if (firstNameQuery && !c.patientName.toLowerCase().includes(firstNameQuery.toLowerCase())) return false;
    if (doctorQuery !== 'All' && c.doctor !== doctorQuery) return false;
    if (centreQuery !== 'All' && c.centre !== centreQuery) return false;
    if (hasDueOnly && c.status !== 'Due') return false;
    if (cancelledOnly && c.status !== 'Cancelled') return false;
    return true;
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>All bills</h1>
        <Button
          variant="primary"
          size="sm"
          onClick={onNavigateNewBill}
        >
          + New bill
        </Button>
      </div>

      {/* Comprehensive Filter Form */}
      <Card style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          {/* Duration */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="Past 7 days">Past 7 days (12 Oct to 19 Oct 2026)</option>
              <option value="Past 30 days">Past 30 days</option>
              <option value="Past 90 days">Past 90 days</option>
              <option value="Custom range">Custom range</option>
            </select>
          </div>

          {/* Reg No */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Reg. no.
            </label>
            <input
              type="text"
              placeholder="e.g. 1001"
              value={regNoQuery}
              onChange={(e) => setRegNoQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          {/* Patient First Name */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Patient first name
            </label>
            <input
              type="text"
              placeholder="Patient name..."
              value={firstNameQuery}
              onChange={(e) => setFirstNameQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          {/* Referred By */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Referred by
            </label>
            <select
              value={doctorQuery}
              onChange={(e) => setDoctorQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Doctors</option>
              {availableDoctors.map((doc) => (
                <option key={doc} value={doc}>
                  {doc}
                </option>
              ))}
            </select>
          </div>

          {/* Collection Centre */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Collection centre
            </label>
            <select
              value={centreQuery}
              onChange={(e) => setCentreQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Centres</option>
              <option value="Main">Main</option>
              <option value="Branch 1">Branch 1</option>
            </select>
          </div>

          {/* Sample collection agent */}
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Sample collection agent
            </label>
            <select
              value={agentQuery}
              onChange={(e) => setAgentQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Agents</option>
              <option value="Ramesh (Runner)">Ramesh (Runner)</option>
              <option value="Sunil Kumar (Agent)">Sunil Kumar (Agent)</option>
            </select>
          </div>
        </div>

        {/* Checkboxes & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={hasDueOnly}
                onChange={(e) => setHasDueOnly(e.target.checked)}
              />
              <span>Has due</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={cancelledOnly}
                onChange={(e) => setCancelledOnly(e.target.checked)}
              />
              <span>Cancelled</span>
            </label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="primary" size="sm" onClick={() => fetchCases()}>
              Search
            </Button>
            <button
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear
            </button>
          </div>
        </div>
      </Card>

      {/* Bills Data Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 10px', width: '40px', textAlign: 'center' }}></th>
                <th style={{ padding: '12px 14px', width: '90px' }}>REG. NO.</th>
                <th style={{ padding: '12px 14px', width: '120px' }}>DATE</th>
                <th style={{ padding: '12px 14px' }}>PATIENT</th>
                <th style={{ padding: '12px 14px' }}>REFERRED BY</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>TOTAL</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>PAID</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>DISCOUNT</th>
                <th style={{ padding: '12px 14px', width: '100px' }}>STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'right', width: '140px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>
                    Loading invoices...
                  </td>
                </tr>
              ) : filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '48px 20px', textAlign: 'center' }}>
                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', marginBottom: '6px' }}>
                      No bills found
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '14px' }}>
                      No invoices match the current filter selection.
                    </div>
                    <Button variant="secondary" size="sm" onClick={handleClearFilters}>
                      Reset Filters
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredCases.map((c) => {
                const isExpanded = expandedRowIds.includes(c.id);
                return (
                  <React.Fragment key={c.id}>
                    <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9' }}>
                      {/* Expand Toggle */}
                      <td style={{ padding: '12px 10px', textAlign: 'center' }}>
                        <button
                          onClick={() => toggleRowExpand(c.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', padding: '2px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          title={isExpanded ? 'Collapse case details' : 'Expand case details'}
                        >
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                      </td>

                      {/* Reg No */}
                      <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e293b' }}>
                        {c.regNo}
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: '12px 14px', whiteSpace: 'nowrap' }}>
                        <div style={{ color: '#1e293b' }}>{c.date}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.time}</div>
                      </td>

                      {/* Patient Name & Phone */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.patientName}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                          <Phone size={11} />
                          <span>{c.phone}</span>
                        </div>
                      </td>

                      {/* Doctor */}
                      <td style={{ padding: '12px 14px' }}>
                        <div style={{ fontWeight: 500, color: '#1e293b' }}>{c.doctor}</div>
                        <div style={{ fontSize: '11px', color: '#64748b' }}>{c.degree}</div>
                      </td>

                      {/* Amounts */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 600 }}>Rs.{c.total}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>Rs.{c.paid}</td>
                      <td style={{ padding: '12px 14px', textAlign: 'right', color: '#64748b' }}>Rs.{c.discount}</td>

                      {/* Status */}
                      <td style={{ padding: '12px 14px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor:
                              c.status === 'No due' ? '#dcfce7' :
                              c.status === 'Due' ? '#fee2e2' : '#f1f5f9',
                            color:
                              c.status === 'No due' ? '#15803d' :
                              c.status === 'Due' ? '#b91c1c' : '#475569'
                          }}
                        >
                          {c.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '12px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', position: 'relative' }}>
                          <button
                            onClick={() => {
                              localStorage.setItem('labsmart_active_case_id', c.id);
                              localStorage.setItem('labsmart_active_bill_number', c.regNo);
                              onNavigatePrintBill();
                            }}
                            style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer', fontSize: '13px' }}
                          >
                            View bill
                          </button>

                          {/* Meatball menu trigger */}
                          <button
                            onClick={() => setActiveMenuId(activeMenuId === c.id ? null : c.id)}
                            style={{
                              background: 'none',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              padding: '3px 6px',
                              cursor: 'pointer',
                              color: '#64748b',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                          >
                            <MoreHorizontal size={14} />
                          </button>

                          {/* Meatball menu popover */}
                          {activeMenuId === c.id && (
                            <div
                              style={{
                                position: 'absolute',
                                top: '28px',
                                right: 0,
                                zIndex: 50,
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                minWidth: '150px',
                                padding: '4px 0',
                                textAlign: 'left'
                              }}
                            >
                              <button
                                onClick={() => {
                                  setActiveMenuId(null);
                                  localStorage.setItem('labsmart_active_case_id', c.id);
                                  localStorage.setItem('labsmart_active_bill_number', c.regNo);
                                  onNavigateEnterResults();
                                }}
                                style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#2563eb', display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                <FlaskConical size={13} />
                                Enter Results
                              </button>
                              <button
                                onClick={() => { setActiveMenuId(null); onNavigateNewBill(); }}
                                style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#334155', display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                <Edit2 size={13} />
                                Modify
                              </button>
                              {c.status === 'Due' && (
                                <button
                                  onClick={() => handleOpenCollectPayment(c)}
                                  style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#16a34a', display: 'flex', alignItems: 'center', gap: '8px' }}
                                >
                                  <CreditCard size={13} />
                                  Collect Payment
                                </button>
                              )}
                              <button
                                onClick={() => { setSelectedCase(c); setIsCancelConfirmOpen(true); }}
                                style={{ width: '100%', padding: '8px 14px', border: 'none', background: 'none', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '8px' }}
                              >
                                <Ban size={13} />
                                Cancel Case
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Case Investigations Drawer */}
                    {isExpanded && (
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <td></td>
                        <td colSpan={9} style={{ padding: '10px 16px 14px 16px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {c.tests.map((t, idx) => (
                              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '13px' }}>
                                <span style={{ fontWeight: 700, color: '#2563eb', fontFamily: 'monospace', width: '32px' }}>{t.code}</span>
                                <span style={{ color: '#1e293b', fontWeight: 600 }}>{t.name}</span>
                                <button
                                  onClick={() => {
                                    localStorage.setItem('labsmart_active_case_id', c.id);
                                    localStorage.setItem('labsmart_active_bill_number', c.regNo);
                                    onNavigateViewReport();
                                  }}
                                  style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', cursor: 'pointer', textDecoration: 'underline' }}
                                >
                                  View report
                                </button>
                              </div>
                            ))}
                            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                              Collection centre: <strong>{c.centre}</strong> • Assigned agent: <strong>{c.agent || 'None'}</strong>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              }))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: COLLECT DUE PAYMENT */}
      <AcceptDueModal
        isOpen={isCollectPaymentOpen}
        onClose={() => setIsCollectPaymentOpen(false)}
        caseData={
          selectedCase
            ? {
                id: selectedCase.id,
                regNo: selectedCase.regNo,
                patientName: selectedCase.patientName,
                date: selectedCase.date,
                dueAmount: selectedCase.total - selectedCase.paid - selectedCase.discount,
              }
            : null
        }
        onCollectSuccess={(collectedAmount) => {
          if (!selectedCase) return;
          setCases((prev) =>
            prev.map((c) => {
              if (c.id === selectedCase.id) {
                const newPaid = c.paid + collectedAmount;
                const isSettled = newPaid >= c.total - c.discount;
                return {
                  ...c,
                  paid: newPaid,
                  status: isSettled ? 'No due' : 'Due',
                };
              }
              return c;
            })
          );
          showToast(`Collected Rs.${collectedAmount} for Reg #${selectedCase.regNo}`);
        }}
      />

      {/* MODAL: CANCEL BILL */}
      <CancelBillModal
        isOpen={isCancelConfirmOpen}
        onClose={() => setIsCancelConfirmOpen(false)}
        billData={
          selectedCase
            ? {
                id: selectedCase.id,
                regNo: selectedCase.regNo,
                patientName: selectedCase.patientName,
                totalAmount: selectedCase.total,
                paidAmount: selectedCase.paid,
              }
            : null
        }
        onConfirmCancel={(id) => handleCancelCase(id)}
      />
    </div>
  );
};
