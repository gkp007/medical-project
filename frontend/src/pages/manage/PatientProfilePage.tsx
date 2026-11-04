import React, { useState } from 'react';
import {
  Edit2,
  Plus,
  ChevronRight,
  ChevronDown,
  MoreHorizontal,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Clock,
  Printer,
  CheckCircle2,
  ArrowLeft,
  X,
} from 'lucide-react';
import { PatientDetailsData } from '../../components/organisms/modals/UpdatePatientDetailsModal';

export interface PatientProfilePageProps {
  patient?: PatientDetailsData;
  regNo?: string;
  onBack?: () => void;
  onEditProfile?: () => void;
  onAddCase?: () => void;
  onViewBill?: () => void;
  onViewReport?: () => void;
}

export const PatientProfilePage: React.FC<PatientProfilePageProps> = ({
  patient = {
    title: 'Mr.',
    firstName: 'Nikash ranjan',
    lastName: 'Bishi',
    sex: 'MALE',
    ageYears: 33,
    ageMonths: 0,
    ageDays: 0,
    mobile: 'Not Available',
    onlineReportRequested: false,
    email: '',
    address: '',
    aadhaar: '',
    patientHistory: '28/10/2026 - Initial checkup.',
  },
  regNo = '3391',
  onBack,
  onEditProfile,
  onAddCase,
  onViewBill,
  onViewReport,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'cases' | 'activities' | 'sms' | 'reports' | 'usg' | 'xray'>('cases');
  const [isCaseRowExpanded, setIsCaseRowExpanded] = useState(false);
  const [activeActionMenu, setActiveActionMenu] = useState(false);

  const patientFullName = `${patient.title} ${patient.firstName} ${patient.lastName}`.trim();
  const genderLetter = patient.sex === 'MALE' ? 'M' : patient.sex === 'FEMALE' ? 'F' : 'O';

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
          { id: 'cases', label: 'Cases', count: 1 },
          { id: 'activities', label: 'Activities', count: 0 },
          { id: 'sms', label: 'SMS messages', count: 0 },
          { id: 'reports', label: 'Lab reports', count: 1 },
          { id: 'usg', label: 'USG cases', count: 0 },
          { id: 'xray', label: 'Digital X-ray cases', count: 0 },
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

      {/* TAB CONTENT: CASES (1) - Matches User's Screenshot Exactly */}
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
              <tr style={{ borderBottom: isCaseRowExpanded ? 'none' : '1px solid #f1f5f9' }}>
                {/* Expand Toggle */}
                <td style={{ padding: '14px 10px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => setIsCaseRowExpanded(!isCaseRowExpanded)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}
                  >
                    {isCaseRowExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                </td>

                {/* Reg No */}
                <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1e293b' }}>
                  {regNo}
                </td>

                {/* Date */}
                <td style={{ padding: '14px 14px', color: '#1e293b' }}>
                  <div>28/10/2026</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>11:54 AM</div>
                </td>

                {/* Patient */}
                <td style={{ padding: '14px 14px', color: '#1e293b' }}>
                  {patientFullName}
                </td>

                {/* Referred by */}
                <td style={{ padding: '14px 14px' }}>
                  <div style={{ color: '#1e293b' }}>Dr. Drx. Pramod Ku.P...</div>
                  <div style={{ fontSize: '11px', color: '#64748b' }}>Pharmacist</div>
                </td>

                {/* Total */}
                <td style={{ padding: '14px 14px', textAlign: 'right', color: '#1e293b' }}>
                  Rs.200
                </td>

                {/* Paid */}
                <td style={{ padding: '14px 14px', textAlign: 'right', color: '#1e293b' }}>
                  Rs.200
                </td>

                {/* Discount */}
                <td style={{ padding: '14px 14px', textAlign: 'right', color: '#64748b' }}>
                  Rs.0
                </td>

                {/* Status */}
                <td style={{ padding: '14px 14px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 10px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: 700,
                      backgroundColor: '#1d4ed8',
                      color: '#ffffff',
                    }}
                  >
                    No due
                  </span>
                </td>

                {/* Actions */}
                <td style={{ padding: '14px 14px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', position: 'relative' }}>
                    <button
                      type="button"
                      onClick={onViewBill}
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
                      onClick={() => setActiveActionMenu(!activeActionMenu)}
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

                    {/* Meatball Context Menu */}
                    {activeActionMenu && (
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
                          onClick={() => { setActiveActionMenu(false); onViewBill?.(); }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'block',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          View Bill Receipt
                        </button>
                        <button
                          type="button"
                          onClick={() => { setActiveActionMenu(false); onViewReport?.(); }}
                          style={{
                            width: '100%',
                            padding: '8px 12px',
                            border: 'none',
                            background: 'none',
                            fontSize: '13px',
                            color: '#1e293b',
                            cursor: 'pointer',
                            display: 'block',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          Enter / View Report
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>

              {/* Expanded Row for Investigations */}
              {isCaseRowExpanded && (
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <td colSpan={10} style={{ padding: '14px 20px 18px 48px' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>
                      INVESTIGATIONS INCLUDED IN THIS CASE:
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', maxWidth: '520px' }}>
                      <div>
                        <strong style={{ color: '#0f172a' }}>1. Complete Blood Count (CBC)</strong>
                        <div style={{ color: '#64748b', fontSize: '11px' }}>Department: Hematology &bull; Sample: EDTA Whole Blood</div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#15803d' }}>Rs. 200</span>
                    </div>
                  </td>
                </tr>
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

      {/* TAB CONTENT: LAB REPORTS (1) */}
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
              <tr>
                <td style={{ padding: '14px 14px', fontWeight: 600 }}>{regNo}</td>
                <td style={{ padding: '14px 14px' }}>28/10/2026</td>
                <td style={{ padding: '14px 14px', fontWeight: 600, color: '#1e293b' }}>Complete Blood Count (CBC)</td>
                <td style={{ padding: '14px 14px' }}>
                  <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700, backgroundColor: '#dcfce7', color: '#15803d' }}>
                    Completed
                  </span>
                </td>
                <td style={{ padding: '14px 14px', textAlign: 'right' }}>
                  <button
                    type="button"
                    onClick={onViewReport}
                    style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, cursor: 'pointer' }}
                  >
                    View report
                  </button>
                </td>
              </tr>
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
