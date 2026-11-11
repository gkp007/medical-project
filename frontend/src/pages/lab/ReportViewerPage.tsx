import React, { useState, useEffect } from 'react';
import { Button } from '../../components/atoms/Button';
import { Printer, ArrowLeft, Download, ShieldCheck, QrCode } from 'lucide-react';
import { casesApi, pathologyApi } from '../../services/api';

export interface ReportViewerPageProps {
  onBack: () => void;
  caseId?: string;
}

interface ReportTestParam {
  name: string;
  isSubtest?: boolean;
  isHeader?: boolean;
  flag?: string; // 'L' | 'H' | ''
  observed: string;
  unit: string;
  reference: string;
  isAbnormal?: boolean;
}

interface ReportPanel {
  panelName: string;
  department: string;
  parameters: ReportTestParam[];
}

export const ReportViewerPage: React.FC<ReportViewerPageProps> = ({ onBack, caseId }) => {
  const [activeCaseId] = useState<string>(() => caseId || localStorage.getItem('labsmart_active_case_id') || '');
  const [patientData, setPatientData] = useState({
    name: 'Niroj Mirdha',
    ageSex: '12 YRS / M',
    doctor: 'Mr. DRx Bimal Meher (Pharmacist )',
    bpc: '3559',
    regDate: '11/11/2026',
    collectedDate: '11/11/2026',
    receivedDate: '11/11/2026',
    reportedDate: '11/11/2026',
  });
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [department, setDepartment] = useState('HAEMATOLOGY');
  const [panels, setPanels] = useState<ReportPanel[]>([
    {
      panelName: 'COMPLETE BLOOD COUNT (CBC)',
      department: 'HAEMATOLOGY',
      parameters: [
        { name: 'HEMOGLOBIN', flag: 'L', observed: '11.6', unit: 'g/dl', reference: '12-15', isAbnormal: true },
        { name: 'TOTAL LEUKOCYTE COUNT', flag: 'H', observed: '14,500', unit: 'cumm', reference: '4,000 - 11,000', isAbnormal: true },
        { name: 'DIFFERENTIAL LEUCOCYTE COUNT', isHeader: true, observed: '', unit: '', reference: '' },
        { name: 'NEUTROPHILS', isSubtest: true, flag: 'H', observed: '91', unit: '%', reference: '40 - 70', isAbnormal: true },
        { name: 'LYMPHOCYTE', isSubtest: true, flag: 'L', observed: '7', unit: '%', reference: '20 - 40', isAbnormal: true },
        { name: 'EOSINOPHILS', isSubtest: true, flag: '', observed: '01', unit: '%', reference: '1 - 6' },
        { name: 'MONOCYTES', isSubtest: true, flag: '', observed: '01', unit: '%', reference: '1 - 4' },
        { name: 'BASOPHILS', isSubtest: true, flag: '', observed: '00', unit: '%', reference: '< 2' },
        { name: 'PLATELET COUNT', flag: '', observed: '2,81,000', unit: 'lakhs/cumm', reference: '1,50,000 - 4,50,000' },
        { name: 'TOTAL RBC COUNT', flag: 'H', observed: '5.98', unit: 'million/cumm', reference: '4.5 - 5.5', isAbnormal: true },
        { name: 'HEMATOCRIT VALUE, HCT', flag: 'L', observed: '39.4', unit: '%', reference: '40 - 50', isAbnormal: true },
        { name: 'MEAN CORPUSCULAR VOLUME, MCV', flag: 'L', observed: '65.9', unit: 'fL', reference: '83 - 101', isAbnormal: true },
        { name: 'MEAN CELL HAEMOGLOBIN, MCH', flag: 'L', observed: '19.4', unit: 'Pg', reference: '20 - 32', isAbnormal: true },
        { name: 'MEAN CELL HAEMOGLOBIN CON, MCHC', flag: '', observed: '29.4', unit: '%', reference: '20.5 - 34.5' },
        { name: 'MEAN PLATELET VOLUME, MPV', flag: '', observed: '7.2', unit: 'fL', reference: '6.5 - 12' },
        { name: 'R.D.W. - SD', flag: 'L', observed: '30.0', unit: 'fL', reference: '35 - 56', isAbnormal: true },
        { name: 'R.D.W. - CV', flag: '', observed: '13.6', unit: '%', reference: '11.6 - 14' },
        { name: 'PCT', flag: '', observed: '0.203', unit: '%', reference: '0.19 - 0.36' },
        { name: 'P-LCR', flag: 'L', observed: '12.1', unit: '%', reference: '19.7 - 42.4', isAbnormal: true },
        { name: 'PLCC', flag: '', observed: '34', unit: 'x10^3/μL', reference: '30 - 90' },
        { name: 'P.D.W.', flag: 'H', observed: '15.7', unit: 'fL', reference: '9.6 - 15.2', isAbnormal: true },
      ],
    },
  ]);
  const [interpretation, setInterpretation] = useState('');

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
          const regDateStr = new Date(c.createdAt).toLocaleDateString();
          setPatientData({
            name: c.patient?.fullName || 'Niroj Mirdha',
            ageSex: `${c.patient?.age || c.patient?.ageYears || 12} ${c.patient?.ageUnit || 'YRS'} / ${(c.patient?.gender || 'M').charAt(0).toUpperCase()}`,
            doctor: typeof c.doctor === 'object' ? c.doctor?.name : c.doctor || 'Self Referral',
            bpc: c.billNumber || c.dailyCode || '3559',
            regDate: regDateStr,
            collectedDate: regDateStr,
            receivedDate: regDateStr,
            reportedDate: regDateStr,
          });
          setIsAuthorized(c.reportStatus === 'Signed Off' || c.reportStatus === 'Finalized' || c.status === 'Signed Off');
        }

        if (paramsRes.success && paramsRes.data) {
          const pData = paramsRes.data;
          if (pData.tests && pData.tests.length > 0) {
            setDepartment(pData.tests[0].department?.toUpperCase() || 'HAEMATOLOGY');
            const loadedPanels: ReportPanel[] = pData.tests.map((t: any) => {
              const mappedParams: ReportTestParam[] = [];
              let addedDlcHeader = false;

              (t.parameters || []).forEach((p: any) => {
                const isDiff = ['NEUT', 'LYMPH', 'EOS', 'MONO', 'BASO'].includes(p.code?.toUpperCase());
                if (isDiff && !addedDlcHeader) {
                  mappedParams.push({
                    name: 'DIFFERENTIAL LEUCOCYTE COUNT',
                    isHeader: true,
                    observed: '',
                    unit: '',
                    reference: '',
                  });
                  addedDlcHeader = true;
                }

                const flagStr = p.flag === 'FLAG_HIGH' || p.flag === 'HIGH' ? 'H' : p.flag === 'FLAG_LOW' || p.flag === 'LOW' ? 'L' : '';
                mappedParams.push({
                  name: p.name.toUpperCase(),
                  isSubtest: isDiff,
                  flag: flagStr,
                  observed: p.value !== undefined && p.value !== null && p.value !== '' ? String(p.value) : p.currentValue || '—',
                  unit: p.unit || '',
                  reference: p.displayRange || p.referenceInterval || (p.normalMin && p.normalMax ? `${p.normalMin} - ${p.normalMax}` : '—'),
                  isAbnormal: !!flagStr,
                });
              });

              return {
                panelName: t.testName?.toUpperCase() || t.name?.toUpperCase() || 'INVESTIGATION REPORT',
                department: t.department?.toUpperCase() || 'HAEMATOLOGY',
                parameters: mappedParams,
              };
            });
            setPanels(loadedPanels);
          }

          if (pData.case?.interpretation || pData.interpretation?.text) {
            setInterpretation(pData.case?.interpretation || pData.interpretation?.text);
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
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      {/* Top Action Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }} className="no-print">
        <Button variant="secondary" size="sm" icon={<ArrowLeft size={16} />} onClick={onBack}>
          Enter results
        </Button>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" icon={<Download size={16} />} onClick={handleDownloadPdf}>
            Download PDF
          </Button>
          <Button variant="primary" size="sm" icon={<Printer size={16} />} onClick={() => window.print()} style={{ backgroundColor: '#2563eb' }}>
            Browser print
          </Button>
        </div>
      </div>

      {/* Official Diagnostic Report Paper Sheet */}
      <div
        id="official-report"
        style={{
          backgroundColor: '#ffffff',
          padding: '36px 44px',
          borderRadius: '4px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
          color: '#0f172a',
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
          minHeight: '1050px',
        }}
      >
        {/* Labsmart v2 Header Format */}
        <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1.2fr 0.8fr', gap: '12px', alignItems: 'start', fontSize: '13px' }}>
            {/* Left: Patient Demographics */}
            <div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', marginBottom: '6px' }}>
                {patientData.name}
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
                <span style={{ color: '#475569', minWidth: '85px', fontWeight: 600 }}>Age / Sex</span>
                <span style={{ fontWeight: 600 }}>: {patientData.ageSex}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '3px' }}>
                <span style={{ color: '#475569', minWidth: '85px', fontWeight: 600 }}>Referred by</span>
                <span style={{ fontWeight: 600 }}>: {patientData.doctor}</span>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ color: '#475569', minWidth: '85px', fontWeight: 600 }}>BPC</span>
                <span style={{ fontWeight: 700 }}>: {patientData.bpc}</span>
              </div>
            </div>

            {/* Center: Barcode Graphic */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div
                style={{
                  height: '38px',
                  width: '120px',
                  backgroundColor: '#000000',
                  maskImage: 'repeating-linear-gradient(to right, black 0px, black 2px, transparent 2px, transparent 4px, black 4px, black 7px, transparent 7px, transparent 9px)',
                  WebkitMaskImage: 'repeating-linear-gradient(to right, black 0px, black 2px, transparent 2px, transparent 4px, black 4px, black 7px, transparent 7px, transparent 9px)',
                  marginBottom: '2px',
                }}
              />
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '2px' }}>
                {patientData.bpc}
              </span>
            </div>

            {/* Right: Specimen & Registration Dates */}
            <div style={{ fontSize: '12px' }}>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                <span style={{ color: '#475569', minWidth: '95px' }}>Registered on</span>
                <span>: {patientData.regDate}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                <span style={{ color: '#475569', minWidth: '95px' }}>Collected on</span>
                <span>: {patientData.collectedDate}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '3px' }}>
                <span style={{ color: '#475569', minWidth: '95px' }}>Received on</span>
                <span>: {patientData.receivedDate}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ color: '#475569', minWidth: '95px' }}>Reported on</span>
                <span>: {patientData.reportedDate}</span>
              </div>
            </div>

            {/* Far Right: QR Code for live report verification */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ padding: '4px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                <QrCode size={46} color="#0f172a" />
              </div>
              <span style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', textAlign: 'center' }}>
                Scan to download
              </span>
            </div>
          </div>
        </div>

        {/* Test Panels */}
        {panels.map((panel, pIdx) => (
          <div key={pIdx} style={{ marginBottom: '20px' }}>
            {/* Category & Panel Headings */}
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.05em', marginBottom: '2px' }}>
              {panel.department}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em', marginBottom: '8px' }}>
              {panel.panelName}
            </div>

            {/* Labsmart 5-Column Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '14px' }}>
              <thead>
                <tr style={{ borderTop: '1px solid #0f172a', borderBottom: '1px solid #0f172a', backgroundColor: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '6px 8px', fontWeight: 800, width: '40%' }}>TEST</th>
                  <th style={{ padding: '6px 8px', fontWeight: 800, width: '8%', textAlign: 'center' }}>FLAG</th>
                  <th style={{ padding: '6px 8px', fontWeight: 800, width: '20%' }}>VALUE</th>
                  <th style={{ padding: '6px 8px', fontWeight: 800, width: '14%' }}>UNIT</th>
                  <th style={{ padding: '6px 8px', fontWeight: 800, width: '18%' }}>REFERENCE</th>
                </tr>
              </thead>
              <tbody>
                {panel.parameters.map((param, idx) => {
                  if (param.isHeader) {
                    return (
                      <tr key={idx} style={{ backgroundColor: '#ffffff' }}>
                        <td colSpan={5} style={{ padding: '8px 8px 4px 8px', fontWeight: 800, color: '#0f172a', fontSize: '12px' }}>
                          {param.name}
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Test Name */}
                      <td style={{ padding: '5px 8px', paddingLeft: param.isSubtest ? '20px' : '8px', color: '#0f172a', fontWeight: param.isSubtest ? 500 : 700 }}>
                        {param.name}
                      </td>

                      {/* FLAG (L or H) */}
                      <td style={{ padding: '5px 8px', textAlign: 'center', fontWeight: 800, color: param.flag ? '#dc2626' : 'transparent' }}>
                        {param.flag || ''}
                      </td>

                      {/* Observed Value */}
                      <td style={{ padding: '5px 8px', fontWeight: 700, color: param.isAbnormal ? '#0f172a' : '#0f172a' }}>
                        {param.observed}
                      </td>

                      {/* Unit */}
                      <td style={{ padding: '5px 8px', color: '#334155' }}>
                        {param.unit}
                      </td>

                      {/* Reference Interval (displayRange) */}
                      <td style={{ padding: '5px 8px', color: '#334155', fontWeight: 500 }}>
                        {param.reference}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Clinical Notes & Interpretations if present */}
        {interpretation && (
          <div style={{ marginTop: '14px', padding: '10px 14px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: '2px', color: '#1e293b' }}>Clinical Interpretation:</strong>
            <p style={{ margin: 0, color: '#334155' }}>{interpretation}</p>
          </div>
        )}

        {/* Labsmart Centered End Marker */}
        <div style={{ textAlign: 'center', fontSize: '12px', fontWeight: 600, color: '#475569', margin: '28px 0 36px 0', letterSpacing: '0.05em' }}>
          ~~~ End of report ~~~
        </div>

        {/* Signatures Block */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '16px', borderTop: '1px solid #cbd5e1' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'cursive', color: '#0369a1', fontSize: '18px' }}>K. Sharma</span>
            </div>
            <div style={{ borderTop: '1px solid #475569', width: '160px', paddingTop: '4px' }}>
              <strong style={{ fontSize: '11px', display: 'block' }}>K. Sharma, DMLT</strong>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Medical Technologist</span>
            </div>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'cursive', color: '#1565c0', fontSize: '20px', fontWeight: 'bold' }}>Dr. S. K. Mukherjee</span>
            </div>
            <div style={{ borderTop: '1px solid #475569', width: '190px', paddingTop: '4px' }}>
              <strong style={{ fontSize: '11px', display: 'block' }}>Dr. S. K. Mukherjee, MD</strong>
              <span style={{ fontSize: '10px', color: '#64748b' }}>Consulting Pathologist (KMC 48192)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
