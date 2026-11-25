import React, { useState, useEffect } from 'react';
import {
  Edit2,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  FileText,
} from 'lucide-react';
import { PatientDetailsData } from '../../components/organisms/modals/UpdatePatientDetailsModal';
import { casesApi, patientApi } from '../../services/api';

export interface PatientProfilePageProps {
  patient?: PatientDetailsData;
  patientId?: string;
  regNo?: string;
  onBack?: () => void;
  onEditProfile?: () => void;
  onAddCase?: () => void;
  onViewBill?: (caseId?: string) => void;
  onViewReport?: (caseId?: string) => void;
}

interface PatientCaseSummary {
  id: string;
  billNumber: string;
  date: string;
  time: string;
  doctorName: string;
  doctorDegree: string;
  totalAmount: number;
  paidAmount: number;
  discount: number;
  dueAmount: number;
  reportStatus: string;
  modality: string;
  items: { id: string; testName: string; price: number }[];
}

export const PatientProfilePage: React.FC<PatientProfilePageProps> = ({
  patient = {
    title: 'Mr.',
    firstName: 'Patient',
    lastName: '',
    sex: 'MALE',
    ageYears: 0,
    ageMonths: 0,
    ageDays: 0,
    mobile: 'Not Available',
    onlineReportRequested: false,
    email: '',
    address: '',
    aadhaar: '',
    patientHistory: '',
  },
  patientId,
  regNo = '',
  onBack,
  onEditProfile,
  onAddCase,
  onViewBill,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cases' | 'activities' | 'sms' | 'reports' | 'usg' | 'xray'>('cases');
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(null);
  const [activeActionMenuId, setActiveActionMenuId] = useState<string | null>(null);
  const [patientCases, setPatientCases] = useState<PatientCaseSummary[]>([]);

  const patientFullName = `${patient.title} ${patient.firstName} ${patient.lastName}`.trim();
  const genderLetter = patient.sex === 'MALE' ? 'M' : patient.sex === 'FEMALE' ? 'F' : 'O';

  useEffect(() => {
    let cancelled = false;
    const mapCase = (c: any): PatientCaseSummary => {
      const dt = c.createdAt ? new Date(c.createdAt) : new Date();
      const total = Number(c.netPayable ?? c.totalAmount ?? 0);
      const paid = Number(c.paidAmount ?? 0);
      const discount = Number(c.discount ?? 0);
      return {
        id: c.id,
        billNumber: String(c.billNumber || regNo || ''),
        date: dt.toLocaleDateString('en-GB'),
        time: dt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        doctorName: c.doctor?.name || 'Self Referral',
        doctorDegree: c.doctor?.degree || '',
        totalAmount: total,
        paidAmount: paid,
        discount,
        dueAmount: Math.max(0, total - paid),
        reportStatus: c.reportStatus || 'Pending',
        modality: (c.modality || 'LAB').toUpperCase(),
        items: (c.items || []).map((i: any, idx: number) => ({
          id: i.id || String(idx),
          testName: i.testName || i.name || 'Investigation',
          price: Number(i.price ?? i.rate ?? 0),
        })),
      };
    };

    const load = async () => {
      try {
        if (patientId) {
          const histRes = await patientApi.getMedicalHistory(patientId);
          const histCases = histRes?.data?.cases;
          if (!cancelled && Array.isArray(histCases)) {
            setPatientCases(histCases.map(mapCase));
            return;
          }
        }
        const searchKey = regNo || `${patient.firstName} ${patient.lastName}`.trim();
        if (searchKey) {
          const res = await casesApi.listCases({ search: searchKey, limit: 25 });
          const rows = res?.data?.cases || res?.data || [];
          if (!cancelled && Array.isArray(rows)) {
            setPatientCases(rows.map(mapCase));
          }
        }
      } catch {
        // leave empty on error
      }
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [patientId, regNo, patient.firstName, patient.lastName]);

  const labCases = patientCases.filter((c) => c.modality !== 'USG' && c.modality !== 'XRAY');
  const usgCases = patientCases.filter((c) => c.modality === 'USG');
  const xrayCases = patientCases.filter((c) => c.modality === 'XRAY');

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', color: '#0f172a' }}>
      {/* Breadcrumb matching Screenshot */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: 500 }}
        >
          Patients
        </button>
        <span>&gt;</span>
        <span style={{ color: '#64748b' }}>Profile</span>
      </div>

      {/* Heading & Top Right Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          {patientFullName} ({patient.ageYears} YRS/{genderLetter})
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={onEditProfile}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Edit2 size={14} color="#64748b" />
            <span>Edit profile</span>
          </button>

          <button
            type="button"
            onClick={onAddCase}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 16px',
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
              boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
            }}
          >
            <Plus size={15} color="#64748b" />
            <span>Add case</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
        {[
          { id: 'profile', label: 'Profile', count: null },
          { id: 'cases', label: 'Cases', count: patientCases.length },
          { id: 'activities', label: 'Activities', count: 0 },
          { id: 'sms', label: 'SMS messages', count: 0 },
          { id: 'reports', label: 'Lab reports', count: labCases.length },
          { id: 'usg', label: 'USG cases', count: usgCases.length },
          { id: 'xray', label: 'Digital X-ray cases', count: xrayCases.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '10px 14px',
                background: 'none',
                border: 'none',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                color: isActive ? '#2563eb' : '#64748b',
                fontWeight: isActive ? 600 : 500,
                fontSize: '14px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span
                  style={{
                    backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
                    color: isActive ? '#1d4ed8' : '#64748b',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '1px 7px',
                    borderRadius: '10px',
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB CONTENT: CASES */}
      {activeTab === 'cases' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 10px', width: '36px' }}></th>
                <th style={{ padding: '12px 14px' }}>REG. NO.</th>
                <th style={{ padding: '12px 14px' }}>DATE</th>
                <th style={{ padding: '12px 14px' }}>PATIENT</th>
                <th style={{ padding: '12px 14px' }}>REFERRED BY</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>TOTAL</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>PAID</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>DISCOUNT</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {patientCases.length === 0 ? (
                <tr>
                  <td colSpan={10} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                    No cases found for this patient.
                  </td>
                </tr>
              ) : (
                patientCases.map((c) => {
                  const isExpanded = expandedCaseId === c.id;
                  const isMenuOpen = activeActionMenuId === c.id;
                  return (
                    <React.Fragment key={c.id}>
                      <tr style={{ borderBottom: isExpanded ? 'none' : '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                          >
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </button>
                        </td>
                        <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1e293b' }}>{c.billNumber}</td>
                        <td style={{ padding: '14px 14px', color: '#1e293b' }}>
                          <div>{c.date}</div>
                          <div style={{ fontSize: '11px', color: '#64748b' }}>{c.time}</div>
                        </td>
                        <td style={{ padding: '14px 14px', color: '#1e293b' }}>{patientFullName}</td>
                        <td style={{ padding: '14px 14px' }}>
                          <div style={{ color: '#1e293b' }}>{c.doctorName}</div>
                          {c.doctorDegree && <div style={{ fontSize: '11px', color: '#64748b' }}>{c.doctorDegree}</div>}
                        </td>
                        <td style={{ padding: '14px 14px', textAlign: 'right', color: '#1e293b' }}>Rs.{c.totalAmount}</td>
                        <td style={{ padding: '14px 14px', textAlign: 'right', color: '#1e293b' }}>Rs.{c.paidAmount}</td>
                        <td style={{ padding: '14px 14px', textAlign: 'right', color: '#64748b' }}>Rs.{c.discount}</td>
                        <td style={{ padding: '14px 14px' }}>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 700,
                              backgroundColor: c.dueAmount > 0 ? '#dc2626' : '#1d4ed8',
                              color: '#ffffff',
                            }}
                          >
                            {c.dueAmount > 0 ? `Due Rs.${c.dueAmount}` : 'No due'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                            <button
                              type="button"
                              onClick={() => onViewBill?.(c.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#2563eb',
                                fontSize: '13px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                padding: 0,
                              }}
                            >
                              View bill
                            </button>
                            <button
                              type="button"
                              onClick={() => setActiveActionMenuId(isMenuOpen ? null : c.id)}
                              style={{
                                background: 'none',
                                border: 'none',
                                color: '#64748b',
                                cursor: 'pointer',
                                padding: '2px',
                                display: 'flex',
                                alignItems: 'center',
                              }}
                            >
                              <MoreHorizontal size={18} />
                            </button>
                            {isMenuOpen && (
                              <div
                                style={{
                                  position: 'absolute',
                                  top: '100%',
                                  right: 0,
                                  backgroundColor: '#ffffff',
                                  border: '1px solid #e2e8f0',
                                  borderRadius: '6px',
                                  boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                                  minWidth: '160px',
                                  zIndex: 50,
                                  overflow: 'hidden',
                                  textAlign: 'left',
                                }}
                              >
                                <button
                                  type="button"
                                  onClick={() => { setActiveActionMenuId(null); onViewBill?.(c.id); }}
                                  style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'block', textAlign: 'left' }}
                                >
                                  View Bill Receipt
                                </button>
                                <button
                                  type="button"
                                  onClick={() => { setActiveActionMenuId(null); onViewReport?.(c.id); }}
                                  style={{ width: '100%', padding: '8px 12px', border: 'none', background: 'none', fontSize: '13px', color: '#1e293b', cursor: 'pointer', display: 'block', textAlign: 'left' }}
                                >
                                  Enter / View Report
                                </button>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                          <td colSpan={10} style={{ padding: '14px 20px 18px 48px' }}>
                            <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                              INVESTIGATIONS INCLUDED IN THIS CASE:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxWidth: '520px' }}>
                              {c.items.map((item, idx) => (
                                <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px' }}>
                                  <strong style={{ color: '#0f172a' }}>{idx + 1}. {item.testName}</strong>
                                  <span style={{ fontWeight: 700, color: '#15803d' }}>Rs. {item.price}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '24px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '16px', color: '#1e293b' }}>
            Demographics &amp; Contact Details
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', fontSize: '13px' }}>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Title &amp; Full Name</span>
              <strong style={{ fontSize: '14px', color: '#1e293b' }}>{patientFullName}</strong>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Gender &amp; Age</span>
              <span style={{ fontSize: '14px', color: '#1e293b' }}>{patient.sex} &bull; {patient.ageYears} Y {patient.ageMonths} M</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Mobile Number</span>
              <span style={{ fontSize: '14px', color: '#1e293b' }}>{patient.mobile || 'Not Available'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
              <span style={{ fontSize: '14px', color: '#1e293b' }}>{patient.email || 'Not Available'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Aadhaar / National ID</span>
              <span style={{ fontSize: '14px', color: '#1e293b' }}>{patient.aadhaar || 'Not Available'}</span>
            </div>
            <div>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Online Reports</span>
              <span style={{ fontSize: '14px', color: patient.onlineReportRequested ? '#15803d' : '#64748b' }}>
                {patient.onlineReportRequested ? 'Opted In' : 'Not Opted'}
              </span>
            </div>
          </div>

          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Residential Address</span>
            <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#1e293b' }}>{patient.address || 'Not Available'}</p>
          </div>

          {patient.patientHistory && (
            <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ display: 'block', color: '#64748b', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Clinical Remarks / History</span>
              <div style={{ marginTop: '6px', padding: '12px 14px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', fontSize: '13px', color: '#92400e' }}>
                {patient.patientHistory}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB CONTENT: LAB REPORTS */}
      {activeTab === 'reports' && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>
                <th style={{ padding: '12px 14px' }}>REG. NO.</th>
                <th style={{ padding: '12px 14px' }}>DATE</th>
                <th style={{ padding: '12px 14px' }}>INVESTIGATION</th>
                <th style={{ padding: '12px 14px' }}>STATUS</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {labCases.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px 16px', textAlign: 'center', color: '#64748b' }}>
                    No lab reports found for this patient.
                  </td>
                </tr>
              ) : (
                labCases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 14px', fontWeight: 600 }}>{c.billNumber}</td>
                    <td style={{ padding: '14px 14px' }}>{c.date}</td>
                    <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1e293b' }}>
                      {c.items.map((i) => i.testName).join(', ') || 'Lab Investigation'}
                    </td>
                    <td style={{ padding: '14px 14px' }}>
                      <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>
                        {c.reportStatus}
                      </span>
                    </td>
                    <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => onViewReport?.(c.id)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                      >
                        View report
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB CONTENT: EMPTY STATES FOR REMAINING TABS */}
      {['activities', 'sms', 'usg', 'xray'].includes(activeTab) && (
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '48px 16px', textAlign: 'center', color: '#64748b' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
            <FileText size={20} color="#94a3b8" />
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
            No records found
          </div>
          <p style={{ fontSize: '12px', margin: '4px 0 0 0' }}>
            There are no {activeTab === 'activities' ? 'recent audit activities' : activeTab === 'sms' ? 'SMS notification dispatches' : activeTab === 'usg' ? 'Ultrasound (USG) case registrations' : 'Digital X-ray registrations'} recorded for this patient.
          </p>
        </div>
      )}
    </div>
  );
};
