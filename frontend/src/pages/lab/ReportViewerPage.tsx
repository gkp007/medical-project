import React, { useState, useEffect } from 'react';
import { Button } from '../../components/atoms/Button';
import { Printer, ArrowLeft, Download, ShieldCheck, QrCode } from 'lucide-react';
import { casesApi, pathologyApi } from '../../services/api';

export interface ReportViewerPageProps {
  onBack: () => void;
  caseId?: string;
}

export const ReportViewerPage: React.FC<ReportViewerPageProps> = ({ onBack, caseId }) => {
  const [activeCaseId] = useState<string>(() => caseId || localStorage.getItem('labsmart_active_case_id') || '');
  const [patientData, setPatientData] = useState({
    name: 'MR. RAHUL SHARMA',
    ageGender: '32 YRS / MALE',
    doctor: 'DR. ANIL VERMA, MD',
    billNumber: '#1001',
    regDate: '18-Oct-2026 10:30 PM',
    sampleDate: '18-Oct-2026 10:45 PM',
  });
  const [department, setDepartment] = useState('Department of Hematology');
  const [testTitle, setTestTitle] = useState('COMPLETE BLOOD COUNT (CBC) REPORT');
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [interpretation, setInterpretation] = useState('');
  const [parameters, setParameters] = useState<any[]>([
    { name: 'Hemoglobin (Hb)', observed: '13.5', unit: 'g/dL', reference: '13.0 - 17.0', isAbnormal: false },
    { name: 'Total RBC Count', observed: '4.5', unit: 'mil/cumm', reference: '4.5 - 5.5', isAbnormal: false },
    { name: 'Packed Cell Volume (PCV)', observed: '40.5', unit: '%', reference: '40.0 - 50.0', isAbnormal: false },
    { name: 'Mean Corpuscular Volume (MCV)', observed: '90.0', unit: 'fL', reference: '83.0 - 101.0', isAbnormal: false },
    { name: 'Total Leucocyte Count (TLC)', observed: '11,500', unit: '/cumm', reference: '4,000 - 11,000', isAbnormal: true },
    { name: 'Platelet Count', observed: '2.5', unit: 'lakhs/cumm', reference: '1.5 - 4.5', isAbnormal: false },
  ]);

  useEffect(() => {
    if (!activeCaseId) return;

    const loadData = async () => {
      try {
        const [caseRes, paramsRes] = await Promise.all([
          casesApi.getCaseById(activeCaseId),
          pathologyApi.getParams(activeCaseId),
        ]);

        if (caseRes.success && caseRes.data) {
          const c = caseRes.data;
          setPatientData({
            name: c.patient?.fullName ? c.patient.fullName.toUpperCase() : 'WALK-IN PATIENT',
            ageGender: `${c.patient?.age || 30} YRS / ${(c.patient?.gender || 'MALE').toUpperCase()}`,
            doctor: c.doctor?.name ? `DR. ${c.doctor.name.toUpperCase()}` : 'SELF / WALK-IN',
            billNumber: c.billNumber || c.dailyCode || '#1001',
            regDate: new Date(c.createdAt).toLocaleString(),
            sampleDate: new Date(c.createdAt).toLocaleString(),
          });
          setIsAuthorized(c.status === 'Signed Off' || c.status === 'Final' || c.status === 'COMPLETED');
        }

        if (paramsRes.success && paramsRes.data) {
          const pData = paramsRes.data;
          if (pData.tests && pData.tests.length > 0) {
            const firstTest = pData.tests[0];
            setTestTitle(`${firstTest.name.toUpperCase()} REPORT`);
            setDepartment(firstTest.department ? `Department of ${firstTest.department}` : 'Department of Laboratory Medicine');
            if (firstTest.parameters && firstTest.parameters.length > 0) {
              const mapped = firstTest.parameters.map((p: any) => ({
                name: p.name,
                observed: p.currentValue || p.defaultValue || '—',
                unit: p.unit || '',
                reference: p.normalMin && p.normalMax ? `${p.normalMin} - ${p.normalMax}` : '—',
                isAbnormal: p.flag === 'FLAG_HIGH' || p.flag === 'FLAG_LOW' || p.flag === 'CRITICAL_PANIC'
              }));
              setParameters(mapped);
            }
          }
          if (pData.interpretation?.text) {
            setInterpretation(pData.interpretation.text);
          }
        }
      } catch (err) {
        console.error('Failed to load report data:', err);
      }
    };

    loadData();
  }, [activeCaseId]);

  const handleDownloadPdf = () => {
    if (activeCaseId) {
      window.open(`/api/v1/pathology/cases/${activeCaseId}/report-pdf`, '_blank');
    } else {
      window.print();
    }
  };

  return (
    <div style={{ maxWidth: '860px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
        <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={onBack}>
          Back to Results
        </Button>
        <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
          <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button variant="primary" size="sm" icon={<Printer size={16} />} onClick={() => window.print()}>
            Print Diagnostic Report
          </Button>
        </div>
      </div>

      {/* Official Diagnostic Report Paper Sheet */}
      <div
        id="official-report"
        style={{
          backgroundColor: '#ffffff',
          padding: '40px 48px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-md)',
          color: '#0f172a',
          fontFamily: 'var(--font-family-sans)',
        }}
      >
        {/* Lab Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px', borderBottom: '2px solid #1e293b' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontWeight: 900, textTransform: 'uppercase', color: '#0f172a', letterSpacing: '-0.02em' }}>
              Apex Diagnostics & Research Center
            </h1>
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              ISO 15189:2012 Certified • NABL Accredited Laboratory
            </p>
            <p style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
              104 Medical Enclave, Sector 14 • Helpline: +91 98765 43210
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{
              fontSize: '10px',
              fontWeight: 700,
              padding: '3px 8px',
              backgroundColor: isAuthorized ? '#dcfce7' : '#fef3c7',
              color: isAuthorized ? '#15803d' : '#b45309',
              borderRadius: '4px',
              textTransform: 'uppercase'
            }}>
              {isAuthorized ? 'Verified & Authorized' : 'Draft Report / Under Review'}
            </span>
          </div>
        </div>

        {/* Patient Demographics 4-Column Borderless Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '16px', margin: '16px 0', padding: '12px 0', borderBottom: '1px solid #cbd5e1', fontSize: '12px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong style={{ color: '#64748b' }}>Patient Name:</strong> <span style={{ fontWeight: 700 }}>{patientData.name}</span></div>
            <div><strong style={{ color: '#64748b' }}>Age / Gender:</strong> {patientData.ageGender}</div>
            <div><strong style={{ color: '#64748b' }}>Referring Doctor:</strong> {patientData.doctor}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong style={{ color: '#64748b' }}>Case / Bill No:</strong> <span style={{ fontWeight: 700, color: '#1565c0' }}>{patientData.billNumber}</span></div>
            <div><strong style={{ color: '#64748b' }}>Registered Date:</strong> {patientData.regDate}</div>
            <div><strong style={{ color: '#64748b' }}>Sample Collected:</strong> {patientData.sampleDate}</div>
          </div>
        </div>

        {/* Department Title */}
        <div style={{ textAlign: 'center', margin: '14px 0' }}>
          <h2 style={{ fontSize: '14px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {department}
          </h2>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
            {testTitle}
          </span>
        </div>

        {/* Observation Results Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '20px' }}>
          <thead>
            <tr style={{ borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a', backgroundColor: '#f8fafc', textAlign: 'left' }}>
              <th style={{ padding: '8px' }}>Test Description</th>
              <th style={{ padding: '8px' }}>Value Observed</th>
              <th style={{ padding: '8px' }}>Units</th>
              <th style={{ padding: '8px' }}>Biological Reference Interval</th>
            </tr>
          </thead>
          <tbody>
            {parameters.map((param, idx) => (
              <tr
                key={idx}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  backgroundColor: param.isAbnormal ? '#fef2f2' : 'transparent',
                }}
              >
                <td style={{ padding: '7px 8px', fontWeight: param.isAbnormal ? 700 : 600, color: param.isAbnormal ? '#b91c1c' : '#0f172a' }}>
                  {param.name}
                </td>
                <td style={{ padding: '7px 8px', fontWeight: 700, color: param.isAbnormal ? '#b91c1c' : '#0f172a' }}>
                  {param.observed} {param.isAbnormal ? ' *' : ''}
                </td>
                <td style={{ padding: '7px 8px' }}>{param.unit}</td>
                <td style={{ padding: '7px 8px' }}>{param.reference}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Interpretation Clinical Notes (if available) */}
        {interpretation && (
          <div style={{ marginTop: '16px', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '12px' }}>
            <strong style={{ display: 'block', marginBottom: '4px', color: '#1e293b' }}>Clinical Interpretation:</strong>
            <p style={{ margin: 0, color: '#475569', lineHeight: 1.5 }}>{interpretation}</p>
          </div>
        )}


        <p style={{ fontSize: '11px', color: '#64748b', fontStyle: 'italic', marginBottom: '14px' }}>
          * Note: Observed values flagged with an asterisk (*) are outside biological reference interval.
        </p>

        {/* Clinical Impression Block */}
        <div style={{ backgroundColor: '#f8fafc', padding: '12px 16px', borderRadius: '6px', borderLeft: '4px solid #1565c0', marginBottom: '24px' }}>
          <strong style={{ fontSize: '12px', textTransform: 'uppercase', color: '#1565c0' }}>Clinical Impression:</strong>
          <p style={{ fontSize: '12px', marginTop: '4px', color: '#334155' }}>
            Mild leukocytosis with relative neutrophilia noted. Please correlate clinically with systemic infection or inflammatory focus.
          </p>
        </div>

        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', margin: '20px 0', letterSpacing: '0.1em' }}>
          *** END OF DIAGNOSTIC REPORT ***
        </div>

        {/* Signatures & Authentication Stamp */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '20px', borderTop: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '6px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
              <QrCode size={40} color="#1e293b" />
            </div>
            <div style={{ fontSize: '10px', color: '#64748b' }}>
              <strong>NABL Verified Record</strong><br />
              Scan QR to download original<br />
              tamper-proof digital certificate.
            </div>
          </div>

          <div style={{ display: 'flex', gap: '48px', textAlign: 'center' }}>
            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', color: '#0369a1', fontSize: '18px' }}>K. Sharma</span>
              </div>
              <div style={{ borderTop: '1px solid #334155', width: '150px', paddingTop: '4px' }}>
                <strong style={{ fontSize: '11px', display: 'block' }}>K. Sharma, DMLT</strong>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Medical Technologist</span>
              </div>
            </div>

            <div>
              <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', color: '#1565c0', fontSize: '20px', fontWeight: 'bold' }}>Dr. S. K. Mukherjee</span>
              </div>
              <div style={{ borderTop: '1px solid #334155', width: '170px', paddingTop: '4px' }}>
                <strong style={{ fontSize: '11px', display: 'block' }}>Dr. S. K. Mukherjee, MD</strong>
                <span style={{ fontSize: '10px', color: '#64748b' }}>Consulting Pathologist (KMC 48192)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
