import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { MultiSelectCombobox, MultiSelectOption } from '../../components/atoms/MultiSelectCombobox';
import {
  Printer,
  Download,
  Video,
  FileSpreadsheet,
  Calendar,
  Filter,
  CheckCircle2,
  X,
  UserCheck,
  Search
} from 'lucide-react';

interface ReferrerSummaryRecord {
  sNo: number;
  refId: string;
  name: string;
  contact: string;
  totalCases: number;
  casesInFilter: number;
}

// Master Modalities for MultiSelect
const CASE_TYPE_OPTIONS: MultiSelectOption[] = [
  { label: 'LAB (Pathology)', value: 'LAB', category: 'Laboratory' },
  { label: 'USG (Ultrasound)', value: 'USG', category: 'Radiology' },
  { label: 'DIGITAL XRAY (Digital X-Ray)', value: 'DIGITAL XRAY', category: 'Radiology' },
  { label: 'CT SCAN (Computed Tomography)', value: 'CT SCAN', category: 'Radiology' },
  { label: 'MRI (Magnetic Resonance Imaging)', value: 'MRI', category: 'Radiology' },
  { label: 'ECG (Electrocardiogram)', value: 'ECG', category: 'Cardiology' },
  { label: 'OUTSOURCE LAB (External Processing)', value: 'OUTSOURCE LAB', category: 'Laboratory' },
  { label: 'EPS (Electrophysiology)', value: 'EPS', category: 'Cardiology' },
  { label: 'OPG (Dental Panoramic X-Ray)', value: 'OPG', category: 'Radiology' },
  { label: 'CARDIOLOGY (Cardiac Investigations)', value: 'CARDIOLOGY', category: 'Cardiology' },
  { label: 'EEG (Electroencephalogram)', value: 'EEG', category: 'Neurology' },
  { label: 'MAMMOGRAPHY (Breast Imaging)', value: 'MAMMOGRAPHY', category: 'Radiology' },
  { label: 'XRAY (Conventional X-Ray)', value: 'XRAY', category: 'Radiology' },
];

// Master Referring Doctors for MultiSelect
const REFERRING_DOCTORS_LIST: MultiSelectOption[] = [
  { label: 'Dr. Anil Verma, MBBS MD (Internal Medicine)', value: 'REF-001', category: 'Physician' },
  { label: 'Dr. Priya Sharma, MS (Orthopaedics)', value: 'REF-002', category: 'Surgeon' },
  { label: 'Dr. S. K. Gupta, MD (General Medicine)', value: 'REF-003', category: 'Physician' },
  { label: 'Dr. Sunil Bansal, MS (Orthopaedics)', value: 'REF-004', category: 'Surgeon' },
  { label: 'Dr. Rajesh Khanna, DM (Cardiology)', value: 'REF-005', category: 'Cardiology' },
  { label: 'Dr. Sunita Patil, DGO (Obstetrics & Gynae)', value: 'REF-006', category: 'Gynaecology' },
  { label: 'Dr. Vikram Malhotra, DM (Neurology)', value: 'REF-007', category: 'Neurology' },
  { label: 'Dr. Ramesh Saxena, MD (Paediatrics)', value: 'REF-008', category: 'Paediatrics' },
  { label: 'Dr. Meena Agarwal, MD (Pathology)', value: 'REF-009', category: 'Pathology' },
  { label: 'Self Referral / Walk-in Patient', value: 'SELF', category: 'General' },
];

export const ReferralBusinessPage: React.FC = () => {
  const [activePeriod, setActivePeriod] = useState<string>('Today');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isDetailedReportModalOpen, setIsDetailedReportModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Detailed Report Form State
  const [fromDate, setFromDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [toDate, setToDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [hideCancelled, setHideCancelled] = useState(true);
  const [showHidden, setShowHidden] = useState(false);
  const [selectedCaseTypes, setSelectedCaseTypes] = useState<string[]>(['LAB', 'USG']);
  const [selectedDoctors, setSelectedDoctors] = useState<string[]>([]);

  const [referrers, setReferrers] = useState<ReferrerSummaryRecord[]>([
    {
      sNo: 1,
      refId: 'REF-001',
      name: 'Dr. Anil Verma, MBBS MD',
      contact: '+91 98987 11223',
      totalCases: 14,
      casesInFilter: 1
    },
    {
      sNo: 2,
      refId: 'REF-002',
      name: 'Dr. Priya Sharma, MS (Ortho)',
      contact: '+91 98112 33445',
      totalCases: 8,
      casesInFilter: 0
    },
    {
      sNo: 3,
      refId: 'REF-003',
      name: 'Dr. S. K. Gupta, MD (Medicine)',
      contact: '+91 99887 55667',
      totalCases: 22,
      casesInFilter: 0
    },
    {
      sNo: 4,
      refId: 'REF-004',
      name: 'Dr. Sunil Bansal, MS (Ortho)',
      contact: '+91 97123 44556',
      totalCases: 19,
      casesInFilter: 2
    },
    {
      sNo: 5,
      refId: 'REF-005',
      name: 'Dr. Rajesh Khanna, DM (Cardiology)',
      contact: '+91 98223 55667',
      totalCases: 31,
      casesInFilter: 1
    },
    {
      sNo: 6,
      refId: 'REF-006',
      name: 'Dr. Sunita Patil, DGO (Gynae)',
      contact: '+91 98334 66778',
      totalCases: 17,
      casesInFilter: 0
    },
    {
      sNo: 7,
      refId: 'REF-007',
      name: 'Dr. Vikram Malhotra, DM (Neuro)',
      contact: '+91 98445 77889',
      totalCases: 12,
      casesInFilter: 1
    }
  ]);

  const periods = ['Today', 'Yesterday', 'Last Week', 'October', 'September', 'August', 'Custom'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredReferrers = referrers.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.refId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.contact.includes(searchQuery)
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

      {/* Top Header & Actions Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Referral business summary ({filteredReferrers.length})
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={<Video size={14} />}
            onClick={() => showToast('Playing referral setup tutorial...')}
          >
            Watch Video
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsDetailedReportModalOpen(true)}
          >
            Referral doctor wise report
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => showToast('Downloading referral cases dataset (.xlsx)...')}
          >
            Download cases data
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer size={14} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </div>

      {/* Filter by Period Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Filter size={14} />
          Filter by period:
        </span>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {periods.map(period => (
            <button
              key={period}
              onClick={() => {
                setActivePeriod(period);
                if (period === 'Custom') setIsDetailedReportModalOpen(true);
              }}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: activePeriod === period ? '1px solid #2563eb' : '1px solid #cbd5e1',
                backgroundColor: activePeriod === period ? '#2563eb' : '#ffffff',
                color: activePeriod === period ? '#ffffff' : '#475569',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Search & Summary Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ position: 'relative', width: '280px' }}>
            <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search doctor or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
            />
          </div>
          <span style={{ fontSize: '13px', color: '#64748b' }}>
            Showing <strong>{filteredReferrers.length}</strong> referring doctors
          </span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '80px' }}>S. NO.</th>
                <th style={{ padding: '12px 16px', width: '130px' }}>REFERRER ID</th>
                <th style={{ padding: '12px 16px' }}>NAME</th>
                <th style={{ padding: '12px 16px' }}>CONTACT</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>TOTAL CASES</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>CASES (PATIENTS) IN FILTER</th>
                <th style={{ padding: '12px 16px', textAlign: 'center' }}>PRINT BUSINESS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrers.map((ref) => (
                <tr key={ref.sNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{ref.sNo}</td>
                  <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{ref.refId}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{ref.name}</td>
                  <td style={{ padding: '12px 16px', color: '#475569' }}>{ref.contact}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600 }}>{ref.totalCases}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: 700,
                        backgroundColor: ref.casesInFilter > 0 ? '#dcfce7' : '#f1f5f9',
                        color: ref.casesInFilter > 0 ? '#15803d' : '#94a3b8'
                      }}
                    >
                      {ref.casesInFilter}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Printer size={13} />}
                      onClick={() => showToast(`Printing incentive statement for ${ref.name}`)}
                    >
                      Print Statement
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL / GENERATOR: REFERRER WISE BUSINESS REPORT */}
      {isDetailedReportModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '580px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Referrer wise business report</h2>
              <button onClick={() => setIsDetailedReportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsDetailedReportModalOpen(false);
                showToast(`Generated Detailed Referral Report for ${fromDate} to ${toDate}`);
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444' }}>*</span> From:
                  </label>
                  <input
                    type="date"
                    required
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444' }}>*</span> To:
                  </label>
                  <input
                    type="date"
                    required
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={hideCancelled}
                    onChange={(e) => setHideCancelled(e.target.checked)}
                  />
                  <span>Hide cancelled cases</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={showHidden}
                    onChange={(e) => setShowHidden(e.target.checked)}
                  />
                  <span>Show cases hidden</span>
                </label>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Case types</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Optional</span>
                </div>
                <MultiSelectCombobox
                  placeholder="Select modalities (e.g. LAB, USG, X-Ray)..."
                  options={CASE_TYPE_OPTIONS}
                  selectedValues={selectedCaseTypes}
                  onChange={setSelectedCaseTypes}
                  helpText="Select one or more modalities to include in this report. Items appear as removable chips."
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Ref. by (Doctors)</label>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>Optional</span>
                </div>
                <MultiSelectCombobox
                  placeholder="Select referring doctors..."
                  options={REFERRING_DOCTORS_LIST}
                  selectedValues={selectedDoctors}
                  onChange={setSelectedDoctors}
                  helpText="Leave empty to include all doctors, or choose specific doctors to filter."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
                <Button variant="secondary" size="md" onClick={() => setIsDetailedReportModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Generate Detailed Business Report
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
