import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Calendar,
  Building2,
  FileText,
  Upload,
  CheckCircle2,
  Search,
  Plus,
  X,
  Truck,
  Edit3,
  ExternalLink,
  Clock
} from 'lucide-react';

export type OutsourceStatus =
  | 'Sample Collected'
  | 'Sent to Reference Lab'
  | 'Processing at Partner Lab'
  | 'Result Received'
  | 'Delivered to Patient';

export interface OutsourceCaseItem {
  id: string;
  regNo: string;
  date: string;
  patient: string;
  phone: string;
  investigations: string;
  partnerLab: string;
  courierName?: string;
  trackingNo?: string;
  labSampleId?: string;
  notes?: string;
  status: OutsourceStatus;
  reportUrl?: string;
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

const DEFAULT_CASES: OutsourceCaseItem[] = [
  {
    id: 'out-1',
    regNo: '1003',
    date: '04/11/2026 04:30 PM',
    patient: 'Meena Gupta (48Y/F)',
    phone: '9871100223',
    investigations: 'Skin Biopsy Histopathology & IHC',
    partnerLab: 'SRL Central Reference Laboratory',
    courierName: 'Blue Dart Express',
    trackingNo: 'BLD-98112034',
    labSampleId: 'SRL-MUM-84920',
    notes: 'Specimen in 10% formalin jar dispatched with cold chain pack.',
    status: 'Sent to Reference Lab'
  },
  {
    id: 'out-2',
    regNo: '1004',
    date: '03/11/2026 11:15 AM',
    patient: 'Vikram Roy (35Y/M)',
    phone: '9822334455',
    investigations: 'HLA B27 PCR DNA Testing',
    partnerLab: 'Thyrocare Technologies',
    courierName: 'Thyrocare Direct Courier',
    trackingNo: 'THY-44829',
    labSampleId: 'THY-PCR-38291',
    notes: 'Report received via portal: Negative for HLA-B27.',
    status: 'Result Received',
    reportUrl: '#'
  }
];

export const OutsourceCasesPage: React.FC = () => {
  const [dateRange] = useState(() => {
    const now = new Date();
    const past = new Date(Date.now() - 30 * 86400000);
    return `${formatDDMMYYYY(past)} - ${formatDDMMYYYY(now)}`;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCaseForStatus, setSelectedCaseForStatus] = useState<OutsourceCaseItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cases state with localStorage persistence
  const [cases, setCases] = useState<OutsourceCaseItem[]>(() => {
    try {
      const saved = localStorage.getItem('labsmart_outsource_cases');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_CASES;
  });

  useEffect(() => {
    try {
      localStorage.setItem('labsmart_outsource_cases', JSON.stringify(cases));
    } catch (e) {
      console.error(e);
    }
  }, [cases]);

  // New Outsource Form
  const [regNo, setRegNo] = useState('');
  const [patient, setPatient] = useState('');
  const [phone, setPhone] = useState('9876543210');
  const [investigations, setInvestigations] = useState('');
  const [partnerLab, setPartnerLab] = useState('SRL Central Reference Laboratory');
  const [courierName, setCourierName] = useState('Blue Dart Express');
  const [trackingNo, setTrackingNo] = useState('');

  // Status Edit Form State
  const [editStatus, setEditStatus] = useState<OutsourceStatus>('Sent to Reference Lab');
  const [editPartnerLab, setEditPartnerLab] = useState('');
  const [editCourier, setEditCourier] = useState('');
  const [editTrackingNo, setEditTrackingNo] = useState('');
  const [editSampleId, setEditSampleId] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editReportUrl, setEditReportUrl] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenStatusModal = (item: OutsourceCaseItem) => {
    setSelectedCaseForStatus(item);
    setEditStatus(item.status);
    setEditPartnerLab(item.partnerLab);
    setEditCourier(item.courierName || '');
    setEditTrackingNo(item.trackingNo || '');
    setEditSampleId(item.labSampleId || '');
    setEditNotes(item.notes || '');
    setEditReportUrl(item.reportUrl || '');
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
              partnerLab: editPartnerLab,
              courierName: editCourier,
              trackingNo: editTrackingNo,
              labSampleId: editSampleId,
              notes: editNotes,
              reportUrl: editReportUrl || (editStatus === 'Result Received' || editStatus === 'Delivered to Patient' ? '#' : undefined)
            }
          : c
      )
    );

    showToast(`Status updated to "${editStatus}" for Case #${selectedCaseForStatus.regNo}`);
    setSelectedCaseForStatus(null);
  };

  const handleAddCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regNo.trim() || !patient.trim() || !investigations.trim()) return;

    const newItem: OutsourceCaseItem = {
      id: `out-${Date.now()}`,
      regNo: regNo.trim(),
      date: formatCurrentTime(),
      patient: patient.trim(),
      phone: phone.trim() || '9876543210',
      investigations: investigations.trim(),
      partnerLab,
      courierName: courierName || 'Direct Phlebotomy Runner',
      trackingNo: trackingNo.trim() || `TRK-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Sent to Reference Lab'
    };

    setCases([newItem, ...cases]);
    setIsAddModalOpen(false);
    setRegNo('');
    setPatient('');
    setInvestigations('');
    setTrackingNo('');
    showToast(`Registered outsource dispatch for Case #${newItem.regNo}`);
  };

  const getStatusBadge = (status: OutsourceStatus) => {
    switch (status) {
      case 'Sample Collected':
        return { bg: '#fef3c7', text: '#92400e', border: '#fde68a' };
      case 'Sent to Reference Lab':
        return { bg: '#ffedd5', text: '#c2410c', border: '#fed7aa' };
      case 'Processing at Partner Lab':
        return { bg: '#f3e8ff', text: '#7e22ce', border: '#e9d5ff' };
      case 'Result Received':
        return { bg: '#e0f2fe', text: '#0369a1', border: '#bae6fd' };
      case 'Delivered to Patient':
        return { bg: '#dcfce7', text: '#15803d', border: '#bbf7d0' };
      default:
        return { bg: '#f1f5f9', text: '#475569', border: '#cbd5e1' };
    }
  };

  const filteredCases = cases.filter(c =>
    c.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.investigations.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.partnerLab.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Outsource cases</h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#64748b' }}>
            Manage sample dispatches, partner lab turnaround times, courier tracking, and report handovers.
          </p>
        </div>
        <Button variant="primary" size="sm" icon={<Plus size={14} />} onClick={() => setIsAddModalOpen(true)}>
          New Outsource Order
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
              placeholder="Search case, test, partner lab, status..."
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
                <th style={{ padding: '12px 16px' }}>Investigations & Reference Lab</th>
                <th style={{ padding: '12px 16px', width: '190px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCases.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    No outsource cases found matching the criteria.
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
                        <div style={{ fontSize: '12px', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                          <Building2 size={12} />
                          <span>{c.partnerLab}</span>
                        </div>
                        {c.trackingNo && (
                          <div style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                            <Truck size={11} />
                            <span>{c.courierName || 'Courier'}: {c.trackingNo}</span>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <button
                          onClick={() => handleOpenStatusModal(c)}
                          title="Click to change status"
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

      {/* MODAL: UPDATE OUTSOURCE STATUS */}
      {selectedCaseForStatus && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                  Update Outsource Status - #{selectedCaseForStatus.regNo}
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
                  Workflow Status *
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as OutsourceStatus)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, backgroundColor: '#ffffff' }}
                >
                  <option value="Sample Collected">1. Sample Collected (Packaged at Lab)</option>
                  <option value="Sent to Reference Lab">2. Sent to Reference Lab (In Courier Transit)</option>
                  <option value="Processing at Partner Lab">3. Processing at Partner Lab (Specimen Acknowledged)</option>
                  <option value="Result Received">4. Result Received (Report Available)</option>
                  <option value="Delivered to Patient">5. Delivered to Patient (Complete)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Partner Reference Laboratory *
                </label>
                <select
                  value={editPartnerLab}
                  onChange={(e) => setEditPartnerLab(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                >
                  <option value="SRL Central Reference Laboratory">SRL Central Reference Laboratory</option>
                  <option value="Thyrocare Technologies">Thyrocare Technologies</option>
                  <option value="Dr. Lal PathLabs National Reference Lab">Dr. Lal PathLabs National Reference Lab</option>
                  <option value="Metropolis Healthcare">Metropolis Healthcare</option>
                  <option value="Suburban Diagnostics">Suburban Diagnostics</option>
                  <option value="Oncquest Laboratories">Oncquest Laboratories</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Courier / Delivery Partner
                  </label>
                  <input
                    type="text"
                    value={editCourier}
                    onChange={(e) => setEditCourier(e.target.value)}
                    placeholder="e.g. Blue Dart, DTDC"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Airway Bill / Tracking #
                  </label>
                  <input
                    type="text"
                    value={editTrackingNo}
                    onChange={(e) => setEditTrackingNo(e.target.value)}
                    placeholder="e.g. BLD-98112034"
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Partner Lab Barcode / Sample ID
                </label>
                <input
                  type="text"
                  value={editSampleId}
                  onChange={(e) => setEditSampleId(e.target.value)}
                  placeholder="e.g. SRL-MUM-84920"
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Reference Lab Findings / Internal Remarks
                </label>
                <textarea
                  rows={2}
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="e.g. Biopsy specimen confirmed clear margins; report signed off by pathologist."
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

      {/* MODAL: NEW OUTSOURCE ORDER */}
      {isAddModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>New Outsource Case Order</h3>
              <button onClick={() => setIsAddModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddCase} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
                  placeholder="e.g. Anand Sen (42Y/M)"
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
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Specialized Investigation *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anti-Nuclear Antibody (ANA) Profile"
                  value={investigations}
                  onChange={(e) => setInvestigations(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Reference Laboratory Partner</label>
                <select
                  value={partnerLab}
                  onChange={(e) => setPartnerLab(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="SRL Central Reference Laboratory">SRL Central Reference Laboratory</option>
                  <option value="Thyrocare Technologies">Thyrocare Technologies</option>
                  <option value="Dr. Lal PathLabs National Reference Lab">Dr. Lal PathLabs National Reference Lab</option>
                  <option value="Metropolis Healthcare">Metropolis Healthcare</option>
                  <option value="Suburban Diagnostics">Suburban Diagnostics</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Courier Partner</label>
                  <input
                    type="text"
                    value={courierName}
                    onChange={(e) => setCourierName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Tracking # / AWB</label>
                  <input
                    type="text"
                    value={trackingNo}
                    placeholder="Auto or custom"
                    onChange={(e) => setTrackingNo(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <Button variant="secondary" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Dispatch Sample
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
