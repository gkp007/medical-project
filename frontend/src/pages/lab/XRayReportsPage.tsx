import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Search,
  Download,
  Printer,
  CheckCircle2,
  Edit3,
  Trash2,
  FileText,
  Share2,
  Filter,
  RotateCcw,
  Calendar,
  Eye,
  FileSpreadsheet,
  Zap,
} from 'lucide-react';

export interface XRayArchiveItem {
  id: string;
  caseNo: string;
  regNo: string;
  token: string;
  date: string;
  patientName: string;
  ageGender: string;
  mobile: string;
  uhid: string;
  study: string;
  region: string;
  doctor: string;
  radiologist: string;
  status: 'Reported' | 'Captured' | 'Cancelled';
  exposureDetails: string;
  findings: string;
  impression: string;
}

export const XRayReportsPage: React.FC = () => {
  const [reports, setReports] = useState<XRayArchiveItem[]>([
    {
      id: '1',
      caseNo: 'XR-2026-401',
      regNo: '#1003',
      token: 'X-01',
      date: '17/10/2026',
      patientName: 'Anand Verma',
      ageGender: '42Y / Male',
      mobile: '9812034912',
      uhid: 'UHID-78190',
      study: 'Lumbosacral Spine AP & Lateral',
      region: 'Spine',
      doctor: 'Dr. Sunil Bansal, MS (Ortho)',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Reported',
      exposureDetails: '2 Films (10x12 Carestream) • 82 kVp, 32 mAs',
      findings:
        'Vertebral alignment preserved. Mild anterior marginal osteophytosis noted at L4 and L5 vertebral bodies. Intervertebral disc space is mildly narrowed at L4-L5 level. Pedicles and spinous processes appear intact. No spondylolisthesis or acute bony injury.',
      impression:
        'MILD L4-L5 DEGENERATIVE DISC DISEASE / LUMBAR SPONDYLOSIS. NO EVIDENCE OF LISTHESIS OR ACUTE FRACTURE.',
    },
    {
      id: '2',
      caseNo: 'XR-2026-398',
      regNo: '#1006',
      token: 'X-02',
      date: '16/10/2026',
      patientName: 'Sunil Mathur',
      ageGender: '25Y / Male',
      mobile: '9845129384',
      uhid: 'UHID-78195',
      study: 'Right Knee Joint AP & Lateral',
      region: 'Extremities',
      doctor: 'Dr. Sunil Bansal, MS (Ortho)',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      status: 'Reported',
      exposureDetails: '1 Film (10x12 Fuji DR) • 62 kVp, 10 mAs',
      findings:
        'Tibiofemoral and patellofemoral joint spaces are maintained bilaterally. No bony injury, cortical disruption or joint effusion noted. Soft tissue planes appear unremarkable.',
      impression:
        'NORMAL RADIOGRAPH OF RIGHT KNEE JOINT. NO FRACTURE OR DISLOCATION DETECTED.',
    },
    {
      id: '3',
      caseNo: 'XR-2026-395',
      regNo: '#1009',
      token: 'X-03',
      date: '15/10/2026',
      patientName: 'Kavita Singhal',
      ageGender: '34Y / Female',
      mobile: '9820194821',
      uhid: 'UHID-78201',
      study: 'Chest PA View (Digital DR)',
      region: 'Chest',
      doctor: 'Dr. Rajesh Gupta, MD (Med)',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Reported',
      exposureDetails: '1 Film (14x17 Fuji DR) • 75 kVp, 16 mAs',
      findings:
        'Adequate inspiratory effort. Both lung fields are clear without parenchymal consolidation, nodule or cavitation. Both CP angles and diaphragmatic domes are sharp. CTR is < 0.50. Trachea is central.',
      impression:
        'NORMAL CHEST RADIOGRAPH (PA VIEW). NO EVIDENCE OF ACTIVE CARDIO-PULMONARY INFILTRATE.',
    },
    {
      id: '4',
      caseNo: 'XR-2026-390',
      regNo: '#1014',
      token: 'X-04',
      date: '14/10/2026',
      patientName: 'Sunita Devi',
      ageGender: '38Y / Female',
      mobile: '9718290199',
      uhid: 'UHID-78208',
      study: 'Paranasal Sinuses (Water\'s View)',
      region: 'Skull / PNS',
      doctor: 'Dr. Anil Verma, MS (ENT)',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      status: 'Reported',
      exposureDetails: '1 Film (8x10 Fuji) • 68 kVp, 12 mAs',
      findings:
        'Right maxillary antrum shows prominent mucosal thickening with haziness and an air-fluid level. Left maxillary sinus, frontal, and ethmoidal sinuses appear normally aerated.',
      impression:
        'RIGHT MAXILLARY SINUSITIS WITH AIR-FLUID LEVEL. MILD DEVIATED NASAL SEPTUM.',
    },
    {
      id: '5',
      caseNo: 'XR-2026-384',
      regNo: '#1018',
      token: 'X-05',
      date: '12/10/2026',
      patientName: 'Tarun Malhotra',
      ageGender: '22Y / Male',
      mobile: '9899120485',
      uhid: 'UHID-78215',
      study: 'Right Wrist AP & Lateral',
      region: 'Extremities',
      doctor: 'Dr. Sunil Bansal, MS (Ortho)',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Reported',
      exposureDetails: '1 Film (8x10 Fuji) • 58 kVp, 8 mAs',
      findings:
        'Linear cortical discontinuity seen at the distal radial metaphysis ~1.5 cm proximal to the radiocarpal joint. Dorsal angulation of ~5 degrees. Carpal bones and distal radioulnar joint are congruent.',
      impression:
        'UNDISPLACED FRACTURE OF DISTAL RADIUS METAPHYSIS (COLLES\' TYPE FRACTURE).',
    },
  ]);

  // Filter States (7-Field Filter Grid)
  const [durationPreset, setDurationPreset] = useState('Last 30 days');
  const [fromDate, setFromDate] = useState('19/09/2026');
  const [toDate, setToDate] = useState('19/10/2026');
  const [patientSearch, setPatientSearch] = useState('');
  const [regNoSearch, setRegNoSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refDoctorFilter, setRefDoctorFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Modals
  const [selectedReportForPdf, setSelectedReportForPdf] = useState<XRayArchiveItem | null>(null);
  const [reportToEdit, setReportToEdit] = useState<XRayArchiveItem | null>(null);
  const [reportToDelete, setReportToDelete] = useState<XRayArchiveItem | null>(null);
  const [editImpressionText, setEditImpressionText] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyPreset = (preset: string) => {
    setDurationPreset(preset);
    if (preset === 'Today') {
      setFromDate('19/10/2026');
      setToDate('19/10/2026');
    } else if (preset === 'Yesterday') {
      setFromDate('18/10/2026');
      setToDate('18/10/2026');
    } else if (preset === 'Last 7 days') {
      setFromDate('12/10/2026');
      setToDate('19/10/2026');
    } else if (preset === 'Last 30 days') {
      setFromDate('19/09/2026');
      setToDate('19/10/2026');
    } else if (preset === 'Last 90 days') {
      setFromDate('19/07/2026');
      setToDate('19/10/2026');
    }
    showToast(`Date filter set: ${preset}`);
  };

  const handleResetFilters = () => {
    setDurationPreset('Last 30 days');
    setFromDate('19/09/2026');
    setToDate('19/10/2026');
    setPatientSearch('');
    setRegNoSearch('');
    setStatusFilter('ALL');
    setRefDoctorFilter('ALL');
    setRegionFilter('ALL');
    showToast('Filters reset to default.');
  };

  const handleOpenEdit = (item: XRayArchiveItem) => {
    setReportToEdit(item);
    setEditImpressionText(item.impression);
  };

  const handleSaveEdit = () => {
    if (!reportToEdit) return;
    setReports((prev) =>
      prev.map((r) =>
        r.id === reportToEdit.id ? { ...r, impression: editImpressionText } : r
      )
    );
    showToast(`Updated radiological impression for ${reportToEdit.caseNo}`);
    setReportToEdit(null);
  };

  const handleConfirmDelete = () => {
    if (!reportToDelete) return;
    setReports((prev) => prev.filter((r) => r.id !== reportToDelete.id));
    showToast(`Archived record ${reportToDelete.caseNo} removed.`);
    setReportToDelete(null);
  };

  const filteredReports = reports.filter((r) => {
    // Patient Search
    if (patientSearch.trim()) {
      const q = patientSearch.toLowerCase();
      const match =
        r.patientName.toLowerCase().includes(q) ||
        r.mobile.includes(q) ||
        r.uhid.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Reg # / Case #
    if (regNoSearch.trim()) {
      const q = regNoSearch.toLowerCase();
      const match =
        r.caseNo.toLowerCase().includes(q) ||
        r.regNo.toLowerCase().includes(q) ||
        r.token.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Status
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;

    // Doctor
    if (refDoctorFilter !== 'ALL' && !r.doctor.includes(refDoctorFilter)) return false;

    // Region
    if (regionFilter !== 'ALL' && r.region !== regionFilter) return false;

    return true;
  });

  return (
    <div style={{ maxWidth: '1360px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="h1-title" style={{ margin: 0 }}>
            Digital X-ray — Search Cases Archive
          </h2>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Historical radiography archive, multi-field clinical audit, report revisions, and digital distribution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Button
            variant="secondary"
            icon={<FileSpreadsheet size={16} />}
            onClick={() => showToast('Exporting cases ledger to Excel...')}
          >
            Export to Excel
          </Button>
          <Button
            variant="secondary"
            icon={<RotateCcw size={16} />}
            onClick={handleResetFilters}
          >
            Reset Filters
          </Button>
        </div>
      </div>

      {/* Quick Date Presets Row */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '12px',
        }}
      >
        <span style={{ fontSize: '12px', fontWeight: 700, color: '#64748b' }}>Date Presets:</span>
        {['Today', 'Yesterday', 'Last 7 days', 'Last 30 days', 'Last 90 days'].map((preset) => (
          <button
            key={preset}
            type="button"
            onClick={() => handleApplyPreset(preset)}
            style={{
              padding: '4px 12px',
              borderRadius: '9999px',
              fontSize: '12px',
              fontWeight: durationPreset === preset ? 700 : 500,
              backgroundColor: durationPreset === preset ? '#0284c7' : '#ffffff',
              color: durationPreset === preset ? '#ffffff' : '#475569',
              border: durationPreset === preset ? '1px solid #0284c7' : '1px solid #cbd5e1',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {preset}
          </button>
        ))}
      </div>

      {/* 7-Field Filter Grid Card */}
      <Card style={{ padding: '16px 20px', marginBottom: '20px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '14px',
          }}
        >
          {/* 1. Date Range */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>From Date</label>
            <input
              type="text"
              className="form-input"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>

          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>To Date</label>
            <input
              type="text"
              className="form-input"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              placeholder="DD/MM/YYYY"
            />
          </div>

          {/* 2. Patient Search */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Patient Name / Mobile / UHID</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Anand or 9812..."
              value={patientSearch}
              onChange={(e) => setPatientSearch(e.target.value)}
            />
          </div>

          {/* 3. Reg / Case No */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Reg No. / Token / Case #</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. #1003 or X-01"
              value={regNoSearch}
              onChange={(e) => setRegNoSearch(e.target.value)}
            />
          </div>

          {/* 4. Status */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Case Status</label>
            <select
              className="form-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="ALL">All Statuses</option>
              <option value="Reported">Reported & Signed</option>
              <option value="Captured">Exposure Captured</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          {/* 5. Referring Doctor */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Referring Doctor</label>
            <select
              className="form-select"
              value={refDoctorFilter}
              onChange={(e) => setRefDoctorFilter(e.target.value)}
            >
              <option value="ALL">All Referring Doctors</option>
              <option value="Bansal">Dr. Sunil Bansal, MS (Ortho)</option>
              <option value="Gupta">Dr. Rajesh Gupta, MD (Med)</option>
              <option value="Verma">Dr. Anil Verma, MS (ENT)</option>
            </select>
          </div>

          {/* 6. Anatomical Region */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Anatomical Region</label>
            <select
              className="form-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
            >
              <option value="ALL">All Anatomical Regions</option>
              <option value="Chest">Chest & Thorax</option>
              <option value="Spine">Spine (LS / Cervical)</option>
              <option value="Extremities">Bones & Extremities</option>
              <option value="Skull / PNS">Skull & PNS</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Results Count Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px',
          padding: '0 4px',
        }}
      >
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>
          Showing <strong>{filteredReports.length}</strong> digital radiography records in archive
        </span>
      </div>

      {/* Historical Cases Data Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '130px' }}>Case & Token</th>
              <th style={{ width: '110px' }}>Date</th>
              <th>Patient Profile</th>
              <th>Radiography Examination</th>
              <th>Films & Factors</th>
              <th>Referring Clinician</th>
              <th>Radiological Impression</th>
              <th style={{ textAlign: 'center', width: '110px' }}>Status</th>
              <th style={{ textAlign: 'center', width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No archived radiography reports match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => (
                <tr key={r.id}>
                  {/* Case & Token */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          backgroundColor: '#0284c7',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '10px',
                          padding: '1px 5px',
                          borderRadius: '4px',
                        }}
                      >
                        {r.token}
                      </span>
                      <span className="table-cell-mono" style={{ fontSize: '13px', fontWeight: 700 }}>
                        {r.caseNo}
                      </span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                      Reg: {r.regNo}
                    </div>
                  </td>

                  {/* Date */}
                  <td style={{ fontSize: '13px', color: '#334155' }}>{r.date}</td>

                  {/* Patient Profile */}
                  <td>
                    <div className="table-cell-bold" style={{ fontSize: '14px', color: '#0f172a' }}>
                      {r.patientName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569' }}>
                      {r.ageGender} • {r.mobile}
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{r.uhid}</div>
                  </td>

                  {/* Examination */}
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
                      {r.study}
                    </div>
                    <span
                      style={{
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                        fontSize: '11px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        fontWeight: 600,
                        display: 'inline-block',
                        marginTop: '3px',
                      }}
                    >
                      {r.region}
                    </span>
                  </td>

                  {/* Exposure Details */}
                  <td>
                    <div style={{ fontSize: '12px', color: '#334155', fontWeight: 500 }}>
                      {r.exposureDetails}
                    </div>
                  </td>

                  {/* Referring Clinician */}
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {r.doctor}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Rpt: {r.radiologist}
                    </div>
                  </td>

                  {/* Diagnostic Impression Snippet */}
                  <td style={{ maxWidth: '280px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#0369a1',
                        fontWeight: 600,
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                      title={r.impression}
                    >
                      {r.impression}
                    </div>
                  </td>

                  {/* Status */}
                  <td style={{ textAlign: 'center' }}>
                    <Badge variant={r.status === 'Reported' ? 'success' : 'neutral'}>
                      {r.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={<Eye size={13} />}
                        onClick={() => setSelectedReportForPdf(r)}
                        title="View Official Report PDF"
                      >
                        PDF
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Edit3 size={13} />}
                        onClick={() => handleOpenEdit(r)}
                        title="Revise Diagnosis / Impression"
                      >
                        Edit
                      </Button>

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Share2 size={13} />}
                        onClick={() => showToast(`Report link dispatched via WhatsApp to ${r.mobile}`)}
                        title="Share WhatsApp Link"
                      />

                      <Button
                        variant="secondary"
                        size="sm"
                        style={{ color: '#dc2626' }}
                        icon={<Trash2 size={13} />}
                        onClick={() => setReportToDelete(r)}
                        title="Delete Record"
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: Formatted PDF Report Modal */}
      {selectedReportForPdf && (
        <Modal
          isOpen={!!selectedReportForPdf}
          onClose={() => setSelectedReportForPdf(null)}
          title={`Official Digital Radiography Report — ${selectedReportForPdf.caseNo}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                icon={<Printer size={16} />}
                onClick={() => {
                  window.print();
                  showToast('Sent to laser printer.');
                }}
              >
                Print Report
              </Button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  icon={<Share2 size={16} />}
                  onClick={() => showToast(`Sent to patient WhatsApp: ${selectedReportForPdf.mobile}`)}
                >
                  Share on WhatsApp
                </Button>
                <Button
                  variant="primary"
                  icon={<Download size={16} />}
                  onClick={() => {
                    showToast(`Downloaded ${selectedReportForPdf.caseNo}.pdf`);
                    setSelectedReportForPdf(null);
                  }}
                >
                  Download PDF
                </Button>
              </div>
            </div>
          }
        >
          <div
            style={{
              padding: '24px',
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              fontFamily: 'Inter, system-ui, sans-serif',
            }}
          >
            {/* Letterhead */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #0284c7',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                  LABSMART DIGITAL RADIOGRAPHY & IMAGING CENTRE
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                  AERB LICENSE: AERB/DR/2021/7821 • DEPARTMENT OF RADIODIAGNOSIS
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '12px', color: '#475569' }}>
                <div><strong>Case #:</strong> {selectedReportForPdf.caseNo}</div>
                <div><strong>Date:</strong> {selectedReportForPdf.date}</div>
              </div>
            </div>

            {/* Demographics */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                fontSize: '12px',
                marginBottom: '16px',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '6px',
              }}
            >
              <div><strong>Patient:</strong> {selectedReportForPdf.patientName} ({selectedReportForPdf.ageGender})</div>
              <div><strong>UHID:</strong> {selectedReportForPdf.uhid}</div>
              <div><strong>Referred By:</strong> {selectedReportForPdf.doctor}</div>
              <div><strong>Study:</strong> {selectedReportForPdf.study}</div>
              <div><strong>Exposure:</strong> {selectedReportForPdf.exposureDetails}</div>
              <div><strong>Region:</strong> {selectedReportForPdf.region}</div>
            </div>

            {/* Findings */}
            <div style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#334155', marginBottom: '6px' }}>
                Radiological Findings:
              </h4>
              <p style={{ margin: 0, color: '#1e293b' }}>{selectedReportForPdf.findings}</p>
            </div>

            {/* Bold Impression */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                borderLeft: '4px solid #0284c7',
              }}
            >
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1', margin: '0 0 4px 0' }}>
                IMPRESSION:
              </h4>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#0c4a6e' }}>
                {selectedReportForPdf.impression}
              </p>
            </div>

            {/* Signature Block */}
            <div style={{ marginTop: '28px', textAlign: 'right', fontSize: '12px' }}>
              <div style={{ fontStyle: 'italic', color: '#0284c7', fontWeight: 700, fontSize: '18px' }}>
                {selectedReportForPdf.radiologist.split(',')[0]}
              </div>
              <div style={{ borderTop: '1px solid #cbd5e1', width: '200px', margin: '4px 0 4px auto' }} />
              <strong>{selectedReportForPdf.radiologist}</strong>
              <div style={{ color: '#64748b', fontSize: '11px' }}>Consultant Radiologist • DMC Reg No: 29104</div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 2: Revise Impression Modal */}
      {reportToEdit && (
        <Modal
          isOpen={!!reportToEdit}
          onClose={() => setReportToEdit(null)}
          title={`Revise Radiological Impression: ${reportToEdit.caseNo}`}
          size="md"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setReportToEdit(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveEdit}>
                Save Revised Impression
              </Button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '13px', color: '#475569' }}>
              Patient: <strong>{reportToEdit.patientName}</strong> • {reportToEdit.study}
            </div>
            <label className="form-label" style={{ fontWeight: 700 }}>
              Updated Radiological Impression (UPPERCASE)
            </label>
            <textarea
              className="form-input"
              rows={4}
              value={editImpressionText}
              onChange={(e) => setEditImpressionText(e.target.value)}
              style={{ fontWeight: 600, color: '#0369a1' }}
            />
          </div>
        </Modal>
      )}

      {/* MODAL 3: Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Radiography Archive Record"
        message={`Are you sure you want to permanently delete the archived radiography record ${reportToDelete?.caseNo} for ${reportToDelete?.patientName}? This action cannot be reversed.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
