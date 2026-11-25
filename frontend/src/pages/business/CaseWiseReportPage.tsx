import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { casesApi } from '../../services/api';
import {
  Printer,
  Download,
  Calendar,
  Building,
  CheckCircle2,
  Filter,
  FileSpreadsheet,
  ArrowLeft
} from 'lucide-react';

interface CaseRow {
  regNo: string;
  patient: string;
  referredBy: string;
  caseType: string;
  investigations: string;
  totalFee: number;
  discount: number;
  amountPaid: number;
  due: number;
  status: string;
}

export const CaseWiseReportPage: React.FC = () => {
  const [viewState, setViewState] = useState<'form' | 'report'>('form');
  const [excludeCancelled, setExcludeCancelled] = useState(true);
  const [collectionCentre, setCollectionCentre] = useState('Main');
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // 13 Modality Case Types
  const [caseTypes, setCaseTypes] = useState({
    LabCase: true,
    UsgCase: true,
    DigitalXrayCase: true,
    XrayCase: true,
    OutsourceLabCase: true,
    EcgCase: true,
    CtScanCase: true,
    MriCase: true,
    EpsCase: true,
    OpgCase: true,
    CardiologyCase: true,
    EegCase: true,
    MammographyCase: true,
  });

  const caseTypeNames = [
    { id: 'LabCase', label: 'LabCase' },
    { id: 'UsgCase', label: 'UsgCase' },
    { id: 'DigitalXrayCase', label: 'DigitalXrayCase' },
    { id: 'XrayCase', label: 'XrayCase' },
    { id: 'OutsourceLabCase', label: 'OutsourceLabCase' },
    { id: 'EcgCase', label: 'EcgCase' },
    { id: 'CtScanCase', label: 'CtScanCase' },
    { id: 'MriCase', label: 'MriCase' },
    { id: 'EpsCase', label: 'EpsCase' },
    { id: 'OpgCase', label: 'OpgCase' },
    { id: 'CardiologyCase', label: 'CardiologyCase' },
    { id: 'EegCase', label: 'EegCase' },
    { id: 'MammographyCase', label: 'MammographyCase' },
  ];

  const [reportCases, setReportCases] = useState<CaseRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const modalityToCaseType = (mod: string) => {
    const u = (mod || 'LAB').toUpperCase();
    if (u.includes('OUTSOURCE')) return 'OutsourceLabCase';
    if (u.includes('USG')) return 'UsgCase';
    if (u.includes('DIGITAL')) return 'DigitalXrayCase';
    if (u.includes('XRAY') || u.includes('X-RAY')) return 'XrayCase';
    if (u.includes('ECG')) return 'EcgCase';
    if (u.includes('CT')) return 'CtScanCase';
    if (u.includes('MRI')) return 'MriCase';
    if (u.includes('EPS')) return 'EpsCase';
    if (u.includes('OPG')) return 'OpgCase';
    if (u.includes('CARDIOLOGY')) return 'CardiologyCase';
    if (u.includes('EEG')) return 'EegCase';
    if (u.includes('MAMMO')) return 'MammographyCase';
    return 'LabCase';
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await casesApi.listCases({ startDate: selectedDate, endDate: selectedDate, limit: 200 });
      const rows = Array.isArray(res?.data?.cases) ? res.data.cases : [];
      const mapped: CaseRow[] = rows
        .filter((c: any) => !excludeCancelled || c.reportStatus !== 'Cancelled')
        .filter((c: any) => collectionCentre === 'Main' ? (!c.branchId || c.branchId === 'main' || c.branchId === 'Main') : c.branchId === collectionCentre)
        .map((c: any) => ({
          regNo: c.billNumber || c.dailyCode || c.id.slice(0, 8),
          patient: `${c.patient?.fullName || 'Patient'} (${c.patient?.age || '-'}${c.patient?.ageUnit?.[0] || 'Y'}/${c.patient?.gender?.[0] || 'M'})`,
          referredBy: c.doctor?.name || 'Self Referral',
          caseType: modalityToCaseType(c.modality),
          investigations: (c.items || []).map((i: any) => i.testName).join(', ') || '-',
          totalFee: Number(c.grossAmount || 0),
          discount: Number(c.discountAmount || 0),
          amountPaid: Number(c.paidAmount || 0),
          due: Number(c.balanceDue || 0),
          status: c.reportStatus || 'Registered',
        }));
      setReportCases(mapped);
      setViewState('report');
      showToast(`Generated Case Wise Business Report (${mapped.length} cases)`);
    } catch (err: any) {
      showToast(err?.message || 'Unable to generate case wise report.');
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleToggleCaseType = (key: string) => {
    setCaseTypes(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  const handleSelectAll = (select: boolean) => {
    const updated = { ...caseTypes };
    Object.keys(updated).forEach(k => {
      (updated as any)[k] = select;
    });
    setCaseTypes(updated);
  };

  const selectedCaseTypeLabels = caseTypeNames
    .filter(c => caseTypes[c.id as keyof typeof caseTypes])
    .map(c => c.label)
    .join(', ');

  const filteredCases = reportCases.filter(c => caseTypes[c.caseType as keyof typeof caseTypes]);

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

      {/* VIEW 1: GENERATION FILTER FORM */}
      {viewState === 'form' ? (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', marginBottom: '20px' }}>
            Case wise business report
          </h2>

          <Card style={{ padding: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
            <form
              onSubmit={handleGenerateReport}
              style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}
            >
              {/* Exclude Cancelled Cases Checkbox */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={excludeCancelled}
                    onChange={(e) => setExcludeCancelled(e.target.checked)}
                    style={{ width: '16px', height: '16px' }}
                  />
                  <span>Exclude cancelled cases</span>
                </label>
              </div>

              {/* Collection Centre Dropdown */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Collection centre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={collectionCentre}
                  onChange={(e) => setCollectionCentre(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff', color: '#1e293b' }}
                >
                  <option value="Main">Main</option>
                  <option value="Branch 1">Branch 1 (City Centre)</option>
                  <option value="Branch 2">Branch 2 (Hospital Extension)</option>
                </select>
              </div>

              {/* On Date Picker */}
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  On <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="date"
                  required
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                />
              </div>

              {/* Case Types 13-Checkboxes Grid */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Case types <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                    <span onClick={() => handleSelectAll(true)} style={{ color: '#2563eb', cursor: 'pointer', fontWeight: 600 }}>Select all</span>
                    <span style={{ color: '#cbd5e1' }}>|</span>
                    <span onClick={() => handleSelectAll(false)} style={{ color: '#64748b', cursor: 'pointer' }}>Deselect all</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  {caseTypeNames.map(item => (
                    <label key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={(caseTypes as any)[item.id]}
                        onChange={() => handleToggleCaseType(item.id)}
                        style={{ width: '15px', height: '15px' }}
                      />
                      <span>{item.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div style={{ marginTop: '10px' }}>
                <Button variant="primary" size="lg" type="submit" disabled={isLoading} style={{ width: '100%' }}>
                  {isLoading ? 'Generating...' : 'Generate'}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      ) : (
        /* VIEW 2: GENERATED REPORT VIEW */
        <div>
          {/* Breadcrumb & Report Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <button
                onClick={() => setViewState('form')}
                style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px', fontWeight: 600 }}
              >
                <ArrowLeft size={14} />
                Back to Filters
              </button>
              <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                Case Wise Business Report for {collectionCentre}
              </h2>
              <div style={{ fontSize: '13px', color: '#475569', marginTop: '4px' }}>
                Date: <strong>{selectedDate}</strong>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px', maxWidth: '800px', lineHeight: 1.4 }}>
                Case types: {selectedCaseTypeLabels}, Total cases: <strong>{filteredCases.length}</strong>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
                Print Report
              </Button>
              <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => showToast('Exporting case-wise ledger to Excel...')}>
                Export Excel
              </Button>
            </div>
          </div>

          {/* Table */}
          <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                    <th style={{ padding: '12px 16px' }}>REG. NO.</th>
                    <th style={{ padding: '12px 16px' }}>PATIENT</th>
                    <th style={{ padding: '12px 16px' }}>REFERRED BY</th>
                    <th style={{ padding: '12px 16px' }}>CASE TYPE</th>
                    <th style={{ padding: '12px 16px' }}>INVESTIGATIONS</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>TOTAL FEE</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>DISCOUNT</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>AMOUNT PAID</th>
                    <th style={{ padding: '12px 16px', textAlign: 'right' }}>DUE</th>
                    <th style={{ padding: '12px 16px' }}>STATUS</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCases.length === 0 ? (
                    <tr>
                      <td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: '#94a3b8' }}>
                        No cases recorded for the selected modalities and filters on {selectedDate}.
                      </td>
                    </tr>
                  ) : (
                    filteredCases.map(c => (
                      <tr key={c.regNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>{c.regNo}</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{c.patient}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.referredBy}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                            {c.caseType}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#334155' }}>{c.investigations}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Rs.{c.totalFee}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b' }}>Rs.{c.discount}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>Rs.{c.amountPaid}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'right', color: c.due > 0 ? '#ef4444' : '#64748b', fontWeight: 600 }}>Rs.{c.due}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                            {c.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
