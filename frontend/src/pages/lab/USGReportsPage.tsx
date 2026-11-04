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
} from 'lucide-react';

export interface USGArchiveItem {
  id: string;
  caseNo: string;
  regNo: string;
  token: string;
  date: string;
  patientName: string;
  ageGender: string;
  mobile: string;
  uhid: string;
  examination: string;
  category: string;
  doctor: string;
  radiologist: string;
  status: 'Completed' | 'Drafted' | 'Cancelled';
  findings: string;
  impression: string;
}

export const USGReportsPage: React.FC = () => {
  const [reports, setReports] = useState<USGArchiveItem[]>([
    {
      id: '1',
      caseNo: 'USG-2026-098',
      regNo: '#1098',
      token: 'U-01',
      date: '15/10/2026',
      patientName: 'Priya Nair',
      ageGender: '28Y / Female',
      mobile: '9845129381',
      uhid: 'UHID-89190',
      examination: 'Obstetric USG (Growth & Doppler)',
      category: 'Obstetric',
      doctor: 'Dr. Ananya Roy, DGO',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      status: 'Completed',
      findings:
        'Single live intrauterine fetus in cephalic presentation. BPD: 62 mm, FL: 44 mm, AC: 198 mm, HC: 226 mm. Amniotic fluid index (AFI) is 14.5 cm (adequate). Placenta fundal anterior Grade-II. Umbilical artery PI 0.98, RI 0.62 with normal diastolic flow.',
      impression:
        'SINGLE LIVE INTRAUTERINE GESTATION OF 24 WEEKS 4 DAYS WITH NORMAL FETAL ANATOMY, GROWTH VELOCITY & DOPPLER VELOCIMETRY.',
    },
    {
      id: '2',
      caseNo: 'USG-2026-095',
      regNo: '#1095',
      token: 'U-03',
      date: '14/10/2026',
      patientName: 'Harish Chandra',
      ageGender: '61Y / Male',
      mobile: '9811234900',
      uhid: 'UHID-89182',
      examination: 'USG KUB & Prostate with PVR',
      category: 'KUB & Prostate',
      doctor: 'Dr. Sunil Bansal, MS MCh',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Completed',
      findings:
        'Right kidney measures 9.8 x 4.4 cm, Left kidney 10.1 x 4.6 cm with intact corticomedullary differentiation. No renal calculus or hydronephrosis. Urinary bladder well distended with mild wall thickening (4.2 mm). Prostate enlarged (approx 38 cc) with intravesical median lobe protrusion. Post-void residue is 65 ml.',
      impression:
        'GRADE-II BENIGN PROSTATIC HYPERPLASIA (BPH) WITH SIGNIFICANT POST-VOID RESIDUAL URINE (~65 ML). NORMAL BILATERAL KIDNEYS.',
    },
    {
      id: '3',
      caseNo: 'USG-2026-091',
      regNo: '#1091',
      token: 'U-02',
      date: '12/10/2026',
      patientName: 'Sunita Sharma',
      ageGender: '46Y / Female',
      mobile: '9718290123',
      uhid: 'UHID-89174',
      examination: 'USG Whole Abdomen (Gallbladder focus)',
      category: 'Whole Abdomen',
      doctor: 'Dr. Rajesh Gupta, MD (Med)',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Completed',
      findings:
        'Liver shows diffusely increased parenchymal echogenicity with posterior acoustic attenuation, suggestive of Grade-I Fatty Liver. Gallbladder distended with multiple small mobile calculi, largest measuring ~8 mm casting posterior acoustic shadows. Wall thickness 2.5 mm. CBD is 5.0 mm.',
      impression:
        '1. CHOLELITHIASIS — MULTIPLE GALLBLADDER CALCULI WITHOUT CHOLECYSTITIS. 2. GRADE-I HEPATIC STEATOSIS (FATTY LIVER).',
    },
    {
      id: '4',
      caseNo: 'USG-2026-088',
      regNo: '#1088',
      token: 'U-05',
      date: '10/10/2026',
      patientName: 'Vikas Malhotra',
      ageGender: '34Y / Male',
      mobile: '9820194821',
      uhid: 'UHID-89165',
      examination: 'USG KUB (Right flank colic)',
      category: 'KUB & Prostate',
      doctor: 'Dr. R. C. Mathur, MBBS',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      status: 'Completed',
      findings:
        'Right kidney measures 10.5 cm. A distinct echogenic focus measuring ~5.8 mm is noted in the right upper pole renal calyx with posterior acoustic shadowing. Mild fullness of the right renal pelvis. Left kidney is normal without calculus or hydronephrosis. Urinary bladder is normal.',
      impression:
        'RIGHT RENAL CALCULUS (5.8 MM) IN UPPER POLE CALYX WITH MILD CALYCEAL FULLNESS. NO OBSTRUCTIVE URETEROCALCULUS.',
    },
    {
      id: '5',
      caseNo: 'USG-2026-084',
      regNo: '#1084',
      token: 'U-04',
      date: '08/10/2026',
      patientName: 'Ritu Aggarwal',
      ageGender: '39Y / Female',
      mobile: '9873192801',
      uhid: 'UHID-89150',
      examination: 'Thyroid & Neck Ultrasound',
      category: 'Small Parts',
      doctor: 'Dr. Anil Verma, MD',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      status: 'Completed',
      findings:
        'Right thyroid lobe measures 4.2 x 1.6 x 1.5 cm. Left lobe measures 4.0 x 1.5 x 1.4 cm. Isthmus is 3.1 mm. Parenchyma shows uniform echotexture without focal mass, nodule or calcification. Normal vascular flow on color Doppler. No cervical lymphadenopathy.',
      impression:
        'NORMAL HIGH RESOLUTION ULTRASONOGRAPHY OF THYROID GLAND AND BILATERAL CERVICAL CHAINS.',
    },
  ]);

  // Filter States (7-Field Filter Grid)
  const [durationPreset, setDurationPreset] = useState('Last 30 days');
  const [fromDate, setFromDate] = useState('19/09/2026');
  const [toDate, setToDate] = useState('19/10/2026');
  const [patientSearch, setPatientSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [refDoctorFilter, setRefDoctorFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [regNoSearch, setRegNoSearch] = useState('');

  // Modals
  const [selectedReportForPdf, setSelectedReportForPdf] = useState<USGArchiveItem | null>(null);
  const [reportToEdit, setReportToEdit] = useState<USGArchiveItem | null>(null);
  const [reportToDelete, setReportToDelete] = useState<USGArchiveItem | null>(null);
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
    setStatusFilter('ALL');
    setRefDoctorFilter('ALL');
    setCategoryFilter('ALL');
    setRegNoSearch('');
    showToast('Filters reset to default.');
  };

  const handleOpenEdit = (item: USGArchiveItem) => {
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
    showToast(`Updated diagnosis impression for ${reportToEdit.caseNo}`);
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

    // Category
    if (categoryFilter !== 'ALL' && r.category !== categoryFilter) return false;

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
            Ultrasound (USG) — Search Cases Archive
          </h2>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Historical sonography archive, multi-field clinical audit, report revisions, and digital distribution.
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
              backgroundColor: durationPreset === preset ? '#2563eb' : '#ffffff',
              color: durationPreset === preset ? '#ffffff' : '#475569',
              border: durationPreset === preset ? '1px solid #2563eb' : '1px solid #cbd5e1',
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
              placeholder="e.g. Priya or 9845..."
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
              placeholder="e.g. #1098 or U-01"
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
              <option value="Completed">Completed & Signed</option>
              <option value="Drafted">Drafted</option>
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
              <option value="Roy">Dr. Ananya Roy, DGO</option>
              <option value="Bansal">Dr. Sunil Bansal, MS</option>
              <option value="Gupta">Dr. Rajesh Gupta, MD</option>
              <option value="Verma">Dr. Anil Verma, MD</option>
            </select>
          </div>

          {/* 6. Protocol Category */}
          <div>
            <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>Organ Protocol</label>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Organ Systems</option>
              <option value="Whole Abdomen">Whole Abdomen</option>
              <option value="Obstetric">Obstetric & Fetal</option>
              <option value="KUB & Prostate">KUB & Urology</option>
              <option value="Small Parts">Thyroid / Small Parts</option>
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
          Showing <strong>{filteredReports.length}</strong> sonography records in archive
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
              <th>Sonography Examination</th>
              <th>Referring Clinician</th>
              <th>Clinical Impression Snippet</th>
              <th style={{ textAlign: 'center', width: '110px' }}>Status</th>
              <th style={{ textAlign: 'center', width: '180px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No archived sonography reports match your filter criteria.
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
                          backgroundColor: '#2563eb',
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
                      {r.examination}
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
                      {r.category}
                    </span>
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

                  {/* Clinical Impression Snippet */}
                  <td style={{ maxWidth: '280px' }}>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#1e3a8a',
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
                    <Badge variant={r.status === 'Completed' ? 'success' : 'neutral'}>
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
                        title="View & Print Official PDF"
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
          title={`Official Ultrasound Report — ${selectedReportForPdf.caseNo}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                icon={<Printer size={16} />}
                onClick={() => {
                  window.print();
                  showToast('Sent to clinic printer.');
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
            {/* Clinic Letterhead */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                borderBottom: '2px solid #2563eb',
                paddingBottom: '12px',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#1e40af', margin: 0 }}>
                  LABSMART DIAGNOSTIC & ULTRASOUND IMAGING
                </h3>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '2px 0 0 0' }}>
                  DEPARTMENT OF RADIODIAGNOSIS & ULTRASONOGRAPHY • PNDT LICENSED
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
              <div><strong>Study:</strong> {selectedReportForPdf.examination}</div>
            </div>

            {/* Findings */}
            <div style={{ fontSize: '13px', lineHeight: 1.6, marginBottom: '16px' }}>
              <h4 style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', color: '#334155', marginBottom: '6px' }}>
                Detailed Sonographic Findings:
              </h4>
              <p style={{ margin: 0, color: '#1e293b' }}>{selectedReportForPdf.findings}</p>
            </div>

            {/* Bold Impression */}
            <div
              style={{
                padding: '12px 14px',
                backgroundColor: '#eff6ff',
                borderRadius: '6px',
                borderLeft: '4px solid #2563eb',
              }}
            >
              <h4 style={{ fontSize: '12px', fontWeight: 800, color: '#1e40af', margin: '0 0 4px 0' }}>
                IMPRESSION:
              </h4>
              <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#1e3a8a' }}>
                {selectedReportForPdf.impression}
              </p>
            </div>

            {/* Signature Block */}
            <div style={{ marginTop: '28px', textAlign: 'right', fontSize: '12px' }}>
              <div style={{ fontStyle: 'italic', color: '#1e40af', fontWeight: 700, fontSize: '18px' }}>
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
          title={`Revise Clinical Impression: ${reportToEdit.caseNo}`}
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
              Patient: <strong>{reportToEdit.patientName}</strong> • {reportToEdit.examination}
            </div>
            <label className="form-label" style={{ fontWeight: 700 }}>
              Updated Diagnostic Impression (UPPERCASE)
            </label>
            <textarea
              className="form-input"
              rows={4}
              value={editImpressionText}
              onChange={(e) => setEditImpressionText(e.target.value)}
              style={{ fontWeight: 600, color: '#1e3a8a' }}
            />
          </div>
        </Modal>
      )}

      {/* MODAL 3: Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!reportToDelete}
        onClose={() => setReportToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Sonography Archive Record"
        message={`Are you sure you want to permanently delete the archived sonography record ${reportToDelete?.caseNo} for ${reportToDelete?.patientName}? This action cannot be reversed.`}
        confirmLabel="Yes, Delete"
        variant="danger"
      />
    </div>
  );
};
