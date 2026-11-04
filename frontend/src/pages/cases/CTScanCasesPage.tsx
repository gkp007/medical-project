import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Calendar,
  Search,
  Plus,
  CheckCircle2,
  FileText,
  Activity,
  X,
  UserCheck,
  Stethoscope,
  Edit3,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export type CTScanStatus =
  | 'Scheduled'
  | 'Scan in Progress'
  | 'Scanned'
  | 'Radiologist Reporting'
  | 'Finalized';

export interface CTScanCaseItem {
  id: string;
  regNo: string;
  date: string;
  patient: string;
  phone: string;
  investigations: string;
  protocolType?: string;
  radiologist: string;
  creatinineLevel?: string;
  contrastDetails?: string;
  clinicalNotes?: string;
  status: CTScanStatus;
}

const formatDDMMYYYY = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatCurrentTime = () => {
  const now = new Date();
  const dateStr = formatDDMMYYYY(now);
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${dateStr} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
};

const DEFAULT_CASES: CTScanCaseItem[] = [
  {
    id: 'ct-1',
    regNo: '1005',
    date: '04/11/2026 11:15 AM',
    patient: 'Vikram Malhotra (45Y/M)',
    phone: '9811223344',
    investigations: 'CT Brain (Plain / Non-Contrast)',
    protocolType: '128-Slice Plain Axial & Coronal Reconstructions',
    radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
    creatinineLevel: '0.9 mg/dL (Normal)',
    contrastDetails: 'Non-Contrast Protocol',
    clinicalNotes: 'No acute intracranial hemorrhage or midline shift detected.',
    status: 'Scanned'
  },
  {
    id: 'ct-2',
    regNo: '1006',
    date: '03/11/2026 03:40 PM',
    patient: 'Sunita Rao (58Y/F)',
    phone: '9822334455',
    investigations: 'CT High Resolution Chest (HRCT)',
    protocolType: 'Inspiratory Thin-Slice 1.0mm HRCT Protocol',
    radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
    creatinineLevel: '0.8 mg/dL',
    contrastDetails: 'Non-Contrast Chest Protocol',
    clinicalNotes: 'Mild subpleural fibrotic opacities noted in bilateral lower lobes. No active consolidation.',
    status: 'Finalized'
  }
];

export const CTScanCasesPage: React.FC = () => {
  const [dateRange] = useState(() => {
    const now = new Date();
    const past = new Date(Date.now() - 30 * 86400000);
    return `${formatDDMMYYYY(past)} - ${formatDDMMYYYY(now)}`;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCaseForStatus, setSelectedCaseForStatus] = useState<CTScanCaseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cases state with localStorage persistence
  const [cases, setCases] = useState<CTScanCaseItem[]>(() => {
    try {
      const saved = localStorage.getItem('labsmart_ct_cases');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CASES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('labsmart_ct_cases', JSON.stringify(cases));
    } catch (e) {
      console.error(e);
    }
  }, [cases]);

  // New CT Case State
  const [regNo, setRegNo] = useState('');
  const [patient, setPatient] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [investigations, setInvestigations] = useState('CT Head / Brain (Plain)');
  const [protocolType, setProtocolType] = useState('Plain Non-Contrast 128-Slice Scan');
  const [radiologist, setRadiologist] = useState('Dr. S. K. Verma, MD Radiodiagnosis');

  // Status Edit Modal State
  const [editStatus, setEditStatus] = useState<CTScanStatus>('Scheduled');
  const [editRadiologist, setEditRadiologist] = useState('');
  const [editProtocolType, setEditProtocolType] = useState('');
  const [editCreatinine, setEditCreatinine] = useState('');
  const [editContrast, setEditContrast] = useState('');
  const [editNotes, setEditNotes] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenStatusModal = (c: CTScanCaseItem) => {
    setSelectedCaseForStatus(c);
    setEditStatus(c.status);
    setEditRadiologist(c.radiologist);
    setEditProtocolType(c.protocolType || 'Standard CT Protocol');
    setEditCreatinine(c.creatinineLevel || '0.9 mg/dL');
    setEditContrast(c.contrastDetails || 'Non-Contrast');
    setEditNotes(c.clinicalNotes || '');
  };

  const handleSaveStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForStatus) return;

    setCases(prev =>
      prev.map(c =>
        c.id === selectedCaseForStatus.id
          ? {
              ...c,
              status: editStatus,
              radiologist: editRadiologist,
              protocolType: editProtocolType,
              creatinineLevel: editCreatinine,
              contrastDetails: editContrast,
              clinicalNotes: editNotes
            }
          : c
      )
    );

    showToast(`Updated CT Protocol & Status to "${editStatus}" for Case #${selectedCaseForStatus.regNo}`);
    setSelectedCaseForStatus(null);
  };

  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim() || !patient.trim()) return;

    const newItem: CTScanCaseItem = {
      id: `ct-${Date.now()}`,
      regNo: regNo.trim(),
      date: formatCurrentTime(),
      patient: patient.trim(),
      phone: phone.trim() || '9877665544',
      investigations,
      protocolType,
      radiologist,
      creatinineLevel: 'Pending Verification',
      contrastDetails: protocolType.includes('CECT') ? '60ml Non-Ionic IV Contrast Planned' : 'Non-Contrast',
      status: 'Scheduled'
    };

    setCases([newItem, ...cases]);
    setIsAddModalOpen(false);
    setRegNo('');
    setPatient('');
    showToast(`Registered CT Protocol for Case #${newItem.regNo}`);
  };

  const getStatusBadge = (status: CTScanStatus) => {
    switch (status) {
      case 'Scheduled':
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
      case 'Scan in Progress':
        return { bg: '#fef3c7', text: '#b45309', border: '#fde68a' };
      case 'Scanned':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      case 'Radiologist Reporting':
        return { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' };
      case 'Finalized':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  const filteredCases = cases.filter(c =>
    c.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.investigations.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.radiologist.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Ct scan cases</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Manage Multi-slice CT protocols, patient positioning, DICOM acquisition, and consultant radiologist reporting.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setIsAddModalOpen(true)}>
          New CT Protocol
        </Button>
      </div>

      {/* Date Range Selector & Search */}
      <Card style={{ padding: '16px', marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '320px' }}>
            <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
            <input
              type="text"
              readOnly
              value={dateRange}
              title="Set date range, Last 30 days selected by default"
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          <div style={{ position: 'relative', width: '320px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search CT case, protocol, radiologist..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '100px' }}>Reg no.</th>
                <th style={{ padding: '12px 16px', width: '180px' }}>Date</th>
                <th style={{ padding: '12px 16px', width: '220px' }}>Patient</th>
                <th style={{ padding: '12px 16px' }}>Investigations & Radiologist</th>
                <th style={{ padding: '12px 16px', width: '190px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    No CT scan cases found for the selected interval.
                  </td>
                </tr>
              ) : (
                filteredCases.map(c => {
                  const badge = getStatusBadge(c.status);
                  return (
                    <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#2563eb', fontFamily: 'monospace' }}>
                        #{c.regNo}
                      </td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>
                        {c.date}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.patient}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{c.phone}</div>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 600, color: '#1e293b' }}>{c.investigations}</div>
                        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                          <Stethoscope size={12} color="#2563eb" />
                          <span>{c.radiologist}</span>
                        </div>
                        {c.protocolType && (
                          <div style={{ fontSize: '11px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Sliders size={11} />
                            <span>Protocol: {c.protocolType}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => handleOpenStatusModal(c)}
                          title="Click to update status and protocol"
                          style={{
                            padding: '4px 10px',
                            borderRadius: '12px',
                            fontSize: '11px',
                            fontWeight: 700,
                            backgroundColor: badge.bg,
                            color: badge.text,
                            border: `1px solid ${badge.border}`,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease'
                          }}
                        >
                          <span>{c.status}</span>
                          <Edit3 size={11} />
                        </button>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Edit3 size={12} />}
                          onClick={() => handleOpenStatusModal(c)}
                        >
                          Update
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: UPDATE CT STATUS & PROTOCOL */}
      {selectedCaseForStatus && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '540px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                  Update CT Protocol & Status - #{selectedCaseForStatus.regNo}
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '13px', color: '#64748b' }}>
                  {selectedCaseForStatus.patient} • {selectedCaseForStatus.investigations}
                </p>
              </div>
              <button onClick={() => setSelectedCaseForStatus(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveStatus} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Scanning & Reporting Workflow Status *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as CTScanStatus)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, backgroundColor: '#ffffff' }}
                >
                  <option value="Scheduled">1. Scheduled (Patient Booked, Preparing Gantry)</option>
                  <option value="Scan in Progress">2. Scan in Progress (Patient on CT Couch / Table)</option>
                  <option value="Scanned">3. Scanned (DICOM Series Acquired & Pushed to PACS)</option>
                  <option value="Radiologist Reporting">4. Radiologist Reporting (Reviewing Slices)</option>
                  <option value="Finalized">5. Finalized (Signed Off & Available for Print/Portal)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Assigned Consultant Radiologist *
                </label>
                <select
                  value={editRadiologist}
                  onChange={(e) => setEditRadiologist(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                >
                  <option value="Dr. S. K. Verma, MD Radiodiagnosis">Dr. S. K. Verma, MD Radiodiagnosis (Senior Consultant)</option>
                  <option value="Dr. Ananya Roy, DNB Radiodiagnosis">Dr. Ananya Roy, DNB Radiodiagnosis (Cross-sectional Fellow)</option>
                  <option value="Dr. Rajesh Sharma, MBBS MD (Internal Medicine)">Dr. Rajesh Sharma, MBBS MD (Attending Physician)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  CT Acquisition Protocol
                </label>
                <select
                  value={editProtocolType}
                  onChange={(e) => setEditProtocolType(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                >
                  <option value="128-Slice Plain Axial & Coronal Reconstructions">128-Slice Plain Axial & Coronal Reconstructions</option>
                  <option value="Inspiratory Thin-Slice 1.0mm HRCT Protocol">Inspiratory Thin-Slice 1.0mm HRCT Protocol</option>
                  <option value="CECT Triple Phase (Arterial, Venous, Delayed)">CECT Triple Phase (Arterial, Venous, Delayed)</option>
                  <option value="CT Angiography with 3D MPR / VR Reconstruction">CT Angiography with 3D MPR / VR Reconstruction</option>
                  <option value="Plain CT KUB (Kidney, Ureter, Bladder) Non-Contrast">Plain CT KUB (Kidney, Ureter, Bladder) Non-Contrast</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Serum Creatinine Safety Check
                  </label>
                  <input
                    type="text"
                    value={editCreatinine}
                    onChange={(e) => setEditCreatinine(e.target.value)}
                    placeholder="e.g. 0.9 mg/dL"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    IV Contrast Dosage / Type
                  </label>
                  <input
                    type="text"
                    value={editContrast}
                    onChange={(e) => setEditContrast(e.target.value)}
                    placeholder="e.g. 60ml Iohexol 350 / Non-Contrast"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Radiologist Impression & Scan Findings
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Slices reviewed. No acute hemorrhage, fracture, or focal lesion observed."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <Button variant="secondary" size="sm" type="button" onClick={() => setSelectedCaseForStatus(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Changes
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: NEW CT PROTOCOL */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '500px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Register New CT Scan Protocol</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateCase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Reg No. *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 1007"
                  value={regNo}
                  onChange={(e) => setRegNo(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Patient Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Chandra (52Y/M)"
                  value={patient}
                  onChange={(e) => setPatient(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Patient Mobile</label>
                <input
                  type="tel"
                  placeholder="10-digit mobile"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>CT Scan Investigation *</label>
                <select
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="CT Head / Brain (Plain)">CT Head / Brain (Plain)</option>
                  <option value="CT High Resolution Chest (HRCT)">CT High Resolution Chest (HRCT)</option>
                  <option value="CECT Whole Abdomen & Pelvis">CECT Whole Abdomen & Pelvis</option>
                  <option value="CT Pulmonary Angiography">CT Pulmonary Angiography</option>
                  <option value="CT Cervical / Lumbar Spine">CT Cervical / Lumbar Spine</option>
                  <option value="CT Paranasal Sinuses (PNS)">CT Paranasal Sinuses (PNS)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Reporting Radiologist</label>
                <select
                  value={radiologist}
                  onChange={(e) => setRadiologist(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="Dr. S. K. Verma, MD Radiodiagnosis">Dr. S. K. Verma, MD Radiodiagnosis</option>
                  <option value="Dr. Ananya Roy, DNB Radiodiagnosis">Dr. Ananya Roy, DNB Radiodiagnosis</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Queue CT Scan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
