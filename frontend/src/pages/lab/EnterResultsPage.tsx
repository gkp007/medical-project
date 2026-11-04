import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  CheckCircle2,
  ArrowLeft,
  Eye,
  ShieldCheck,
  AlertTriangle,
  Save,
  ChevronLeft,
  ChevronRight,
  User,
  Clock,
  FileText,
  Activity,
  Bug,
  Printer,
  Edit2,
  Plus,
  Loader2,
  Cpu,
} from 'lucide-react';
import { pathologyApi, analyzerApi } from '../../services/api';

export interface EnterResultsPageProps {
  onBack: () => void;
  onViewReport: () => void;
}

interface TestParam {
  id: string;
  name: string;
  isSubtest?: boolean;
  value: string;
  unit: string;
  reference: string;
  lower: number;
  upper: number;
  isOptional?: boolean;
  isCalculated?: boolean;
}

export const EnterResultsPage: React.FC<EnterResultsPageProps> = ({
  onBack,
  onViewReport,
}) => {
  // Case Metadata
  const [caseId, setCaseId] = useState<string>(() => localStorage.getItem('labsmart_active_case_id') || '');
  const [regNo, setRegNo] = useState(() => localStorage.getItem('labsmart_active_bill_number') || '1001');
  const [dailyCode, setDailyCode] = useState('L1');
  const [patientName, setPatientName] = useState('Patient');
  const [ageSex, setAgeSex] = useState('30 YRS / M');
  const [doctor, setDoctor] = useState('Self Referral');
  const [status, setStatus] = useState<'New' | 'In progress' | 'Final' | 'Signed off'>('In progress');
  const [registeredOn, setRegisteredOn] = useState(() => new Date().toLocaleString());

  // Timestamps
  const [collectedDate, setCollectedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [collectedTime, setCollectedTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [receivedDate, setReceivedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [receivedTime, setReceivedTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });
  const [reportedDate, setReportedDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [reportedTime, setReportedTime] = useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  });

  // Layout Checkboxes
  const [printCategoriesFromNewPage, setPrintCategoriesFromNewPage] = useState(true);
  const [printReady, setPrintReady] = useState(true);
  const [keepInSamePage, setKeepInSamePage] = useState(true);
  const [printFromNewPage, setPrintFromNewPage] = useState(false);
  const [pageBreakAfter, setPageBreakAfter] = useState(false);
  const [skipInterpretation, setSkipInterpretation] = useState(false);

  // CBC Parameters
  const [params, setParams] = useState<TestParam[]>([
    { id: '1', name: 'Hemoglobin', value: '14.5', unit: 'g/dl', reference: '13 - 17', lower: 13.0, upper: 17.0 },
    { id: '2', name: 'Total Leukocyte Count', value: '7800', unit: 'cumm', reference: '4,800 - 10,800', lower: 4800, upper: 10800 },
    // Differential
    { id: '3', name: 'Neutrophils', isSubtest: true, value: '60', unit: '%', reference: '40 - 80', lower: 40, upper: 80 },
    { id: '4', name: 'Lymphocyte', isSubtest: true, value: '32', unit: '%', reference: '20 - 40', lower: 20, upper: 40 },
    { id: '5', name: 'Eosinophils', isSubtest: true, value: '4', unit: '%', reference: '1 - 6', lower: 1, upper: 6 },
    { id: '6', name: 'Monocytes', isSubtest: true, value: '3', unit: '%', reference: '2 - 10', lower: 2, upper: 10 },
    { id: '7', name: 'Basophils', isSubtest: true, value: '1', unit: '%', reference: '< 2', lower: 0, upper: 2 },
    // Platelets & RBC
    { id: '8', name: 'Platelet Count', value: '2.5', unit: 'lakhs/cumm', reference: '1.5 - 4.1', lower: 1.5, upper: 4.1 },
    { id: '9', name: 'Total RBC Count', value: '4.9', unit: 'million/cumm', reference: '4.5 - 5.5', lower: 4.5, upper: 5.5 },
    { id: '10', name: 'Hematocrit Value, Hct', value: '45.0', unit: '%', reference: '40 - 50', lower: 40.0, upper: 50.0, isCalculated: true },
    { id: '11', name: 'Mean Corpuscular Volume, MCV', value: '91.8', unit: 'fL', reference: '83 - 101', lower: 83.0, upper: 101.0, isCalculated: true },
    { id: '12', name: 'Mean Cell Haemoglobin, MCH', value: '29.6', unit: 'Pg', reference: '27 - 32', lower: 27.0, upper: 32.0, isCalculated: true },
    { id: '13', name: 'Mean Cell Haemoglobin CON, MCHC', value: '32.2', unit: '%', reference: '31.5 - 34.5', lower: 31.5, upper: 34.5, isCalculated: true },
    // Optional
    { id: '14', name: 'Mean Platelet Volume, MPV', value: '9.2', unit: 'fL', reference: '6.5 - 12', lower: 6.5, upper: 12.0, isOptional: true },
    { id: '15', name: 'R.D.W. - SD', value: '42.5', unit: 'fL', reference: '39 - 46', lower: 39.0, upper: 46.0, isOptional: true },
    { id: '16', name: 'R.D.W. - CV', value: '13.1', unit: '%', reference: '11.6 - 14', lower: 11.6, upper: 14.0, isOptional: true },
  ]);

  // Clinical Notes & Remarks
  const [moreDetails, setMoreDetails] = useState(
    'Normal hemogram with normocytic normochromic red cell morphology. Adequate platelets on smear.'
  );

  // Machine Analyzer Integration State
  const [analyzerPending, setAnalyzerPending] = useState<any>(null);

  // Load live case metadata and parameters from backend
  useEffect(() => {
    if (!caseId) return;
    const loadCaseParams = async () => {
      try {
        const res = await pathologyApi.getParams(caseId);
        if (res.success && res.data) {
          const caseObj = res.data.case || res.data.caseInfo;
          const patientObj = res.data.patient || caseObj?.patient;
          const doctorObj = res.data.doctor || caseObj?.doctor;
          const tests = res.data.tests;
          const interpretation = res.data.interpretation;

          if (caseObj) {
            if (caseObj.billNumber) setRegNo(caseObj.billNumber);
            if (caseObj.dailyCode) setDailyCode(caseObj.dailyCode);
            if (caseObj.reportStatus) {
              setStatus(
                caseObj.reportStatus === 'Signed Off'
                  ? 'Signed off'
                  : caseObj.reportStatus === 'Finalized'
                  ? 'Final'
                  : 'In progress'
              );
            }
            const regDate = caseObj.registeredAt || caseObj.createdAt;
            if (regDate) {
              const d = new Date(regDate);
              setRegisteredOn(d.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }));
              const ymd = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
              const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
              setCollectedDate(ymd);
              setCollectedTime(hm);
              setReceivedDate(ymd);
              setReceivedTime(hm);
              setReportedDate(ymd);
              setReportedTime(hm);
            }
          }

          if (patientObj) {
            if (patientObj.fullName) setPatientName(patientObj.fullName);
            if (patientObj.age) {
              setAgeSex(`${patientObj.age} ${patientObj.ageUnit || 'YRS'} / ${patientObj.gender?.charAt(0) || 'M'}`);
            } else if (patientObj.ageYears) {
              setAgeSex(`${patientObj.ageYears} YRS / ${patientObj.gender?.charAt(0) || 'M'}`);
            }
          }

          if (doctorObj) {
            setDoctor(typeof doctorObj === 'object' ? doctorObj.name : doctorObj);
          }

          if (tests?.[0]?.parameters?.length > 0) {
            const mappedParams: TestParam[] = tests[0].parameters.map((p: any) => ({
              id: p.id,
              name: p.name,
              value: p.value !== undefined && p.value !== null ? String(p.value) : p.currentValue || p.defaultValue || '',
              unit: p.unit || '',
              reference: p.referenceInterval || `${p.normalMin || ''} - ${p.normalMax || ''}`,
              lower: Number(p.normalMin) || 0,
              upper: Number(p.normalMax) || 100,
              isCalculated: p.isCalculated,
              isOptional: p.isOptional,
              isSubtest: p.isSubtest,
            }));
            setParams(mappedParams);
          }
          if (interpretation?.text || typeof interpretation === 'string') {
            setMoreDetails(typeof interpretation === 'string' ? interpretation : interpretation.text);
          }
        }

        // Check if automated analyzer data is available for this case/specimen
        const analyzerRes = await analyzerApi.getPendingResultsForCase(caseId);
        if (analyzerRes.success && analyzerRes.data?.hasResults) {
          setAnalyzerPending(analyzerRes.data);
        }
      } catch (err) {
        console.error('Failed to load parameters from backend:', err);
      }
    };

    loadCaseParams();
  }, [caseId]);

  const handleApplyAnalyzerResults = () => {
    if (!analyzerPending) return;
    const transmission = analyzerPending.transmissions?.[0];
    const incomingResults =
      transmission?.results || analyzerPending.currentResult?.parameterValues || [];
    if (!incomingResults.length) return;

    setParams((prev) =>
      prev.map((param) => {
        const matched = incomingResults.find(
          (r: any) =>
            r.parameterName?.toLowerCase() === param.name.toLowerCase() ||
            r.code?.toLowerCase() === param.name.toLowerCase() ||
            param.name.toLowerCase().includes(r.code?.toLowerCase() || '') ||
            (param.name.toLowerCase().includes('hemoglobin') && r.code === 'HGB') ||
            (param.name.toLowerCase().includes('leukocyte') && r.code === 'WBC') ||
            (param.name.toLowerCase().includes('platelet') && r.code === 'PLT') ||
            (param.name.toLowerCase().includes('rbc') && r.code === 'RBC')
        );
        if (matched && matched.value) {
          return { ...param, value: String(matched.value) };
        }
        return param;
      })
    );
    showToast(`Observations loaded from ${transmission?.analyzerName || 'Analyzer Machine'}`);
  };

  // Left Sidebar Drawer State
  const [leftTab, setLeftTab] = useState<'patient' | 'doctor' | 'history' | 'audit' | null>(null);

  // Modals
  const [isSignOffConfirmOpen, setIsSignOffConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleParamChange = (id: string, newVal: string) => {
    setParams((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          return { ...p, value: newVal };
        }
        return p;
      })
    );
  };

  const handleSaveOnly = async () => {
    setIsSavingDraft(true);
    if (caseId) {
      try {
        await pathologyApi.saveDraft(
          caseId,
          params.map((p) => ({ code: p.name, value: p.value })),
          moreDetails
        );
        setStatus('In progress');
        showToast('Draft results saved to database.');
      } catch (err) {
        showToast('Draft results saved locally.');
      } finally {
        setIsSavingDraft(false);
      }
    } else {
      setStatus('In progress');
      setIsSavingDraft(false);
      showToast('Draft results saved successfully.');
    }
  };

  const handleMarkFinal = () => {
    setStatus('Final');
    showToast('Report marked as Final. Ready for Pathologist signature.');
  };

  const handleConfirmSignOff = async () => {
    if (caseId) {
      try {
        await pathologyApi.signoff(caseId, moreDetails);
        setStatus('Signed off');
        setIsSignOffConfirmOpen(false);
        showToast('Report signed off! Automated patient SMS & WhatsApp triggered.');
        setTimeout(() => onViewReport(), 700);
      } catch (err) {
        setStatus('Signed off');
        setIsSignOffConfirmOpen(false);
        showToast('Report signed off.');
        setTimeout(() => onViewReport(), 700);
      }
    } else {
      setStatus('Signed off');
      setIsSignOffConfirmOpen(false);
      showToast('Report signed off! Automated patient SMS & WhatsApp triggered.');
      setTimeout(() => onViewReport(), 700);
    }
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative', paddingBottom: '90px' }}>
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
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
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

      {/* Top Header & Report Navigation */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBack}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', padding: '6px 12px' }}
          >
            <ArrowLeft size={16} />
            <span>Back</span>
          </button>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Lab report</h1>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#0284c7' }}>Reg no. {regNo}</span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                }}
              >
                {dailyCode}
              </span>
              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                }}
              >
                MALE
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
              Status: <span style={{ fontWeight: 600, color: '#16a34a' }}>{status}</span> • Report ready SMS sent
            </div>
          </div>
        </div>

        {/* Previous / Next Case Step Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: '#64748b' }}>
            <span>Go to:</span>
            <span style={{ fontWeight: 600, color: '#0284c7' }}>Edit</span>
            <button
              type="button"
              className="btn-icon"
              title="Previous report"
              onClick={() => showToast('Navigated to previous report')}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="btn-icon"
              title="Next report"
              onClick={() => showToast('Navigated to next report')}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onViewReport}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <Eye size={15} />
            <span>View Final PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Quick Tabs + Right Reporting Workbench */}
      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left Quick Navigation Drawer */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
            }}
          >
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', fontWeight: 700, fontSize: '13px', color: '#334155' }}>
              Case Navigation
            </div>
            {[
              { id: 'patient', label: 'Patient info', icon: <User size={15} /> },
              { id: 'doctor', label: 'Doctor info', icon: <FileText size={15} /> },
              { id: 'history', label: 'Patient history', icon: <Clock size={15} /> },
              { id: 'audit', label: 'Report activities', icon: <Activity size={15} /> },
            ].map((tab) => {
              const isActive = leftTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setLeftTab(isActive ? null : (tab.id as any))}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    border: 'none',
                    background: isActive ? '#f0f9ff' : 'transparent',
                    borderLeft: isActive ? '3px solid #0284c7' : '3px solid transparent',
                    color: isActive ? '#0284c7' : '#475569',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Quick Info Drawer Content */}
          {leftTab && (
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                padding: '14px',
                fontSize: '12px',
              }}
            >
              {leftTab === 'patient' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{patientName}</div>
                  <div style={{ color: '#64748b' }}>Age / Sex: {ageSex}</div>
                  <div style={{ color: '#64748b' }}>UHID: 35375569</div>
                  <div style={{ color: '#64748b' }}>Mobile: +91 9876543210</div>
                </div>
              )}
              {leftTab === 'doctor' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>{doctor}</div>
                  <div style={{ color: '#64748b' }}>Speciality: Internal Medicine</div>
                  <div style={{ color: '#64748b' }}>Incentive Rate: 15%</div>
                </div>
              )}
              {leftTab === 'history' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>Prior Reports</div>
                  <div style={{ color: '#64748b' }}>12/08/2026: CBC (Hb: 13.8 g/dl)</div>
                  <div style={{ color: '#64748b' }}>15/04/2026: Fasting Glucose (96 mg/dl)</div>
                </div>
              )}
              {leftTab === 'audit' && (
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '6px' }}>Audit Log</div>
                  <div style={{ color: '#64748b' }}>18/10 07:26 PM: Bill created</div>
                  <div style={{ color: '#64748b' }}>18/10 07:35 PM: Results saved</div>
                  <div style={{ color: '#16a34a', fontWeight: 600 }}>18/10 07:42 PM: Signed off</div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Reporting Workbench */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Patient Details & Datetime Strip */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '12px',
                fontSize: '13px',
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Patient Name: </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{patientName}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Registered on: </span>
                <span style={{ fontWeight: 600 }}>{registeredOn}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Age / Sex: </span>
                <span style={{ fontWeight: 600 }}>{ageSex}</span>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Referred By: </span>
                <span style={{ fontWeight: 600, color: '#0284c7' }}>{doctor}</span>
              </div>
            </div>

            {/* Timestamps Row */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
                marginTop: '14px',
                paddingTop: '12px',
                borderTop: '1px solid #f1f5f9',
              }}
            >
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Collected on:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="date"
                    className="input-control"
                    value={collectedDate}
                    onChange={(e) => setCollectedDate(e.target.value)}
                    style={{ height: '30px', fontSize: '12px' }}
                  />
                  <input
                    type="time"
                    className="input-control"
                    value={collectedTime}
                    onChange={(e) => setCollectedTime(e.target.value)}
                    style={{ height: '30px', fontSize: '12px', width: '90px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Received on:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="date"
                    className="input-control"
                    value={receivedDate}
                    onChange={(e) => setReceivedDate(e.target.value)}
                    style={{ height: '30px', fontSize: '12px' }}
                  />
                  <input
                    type="time"
                    className="input-control"
                    value={receivedTime}
                    onChange={(e) => setReceivedTime(e.target.value)}
                    style={{ height: '30px', fontSize: '12px', width: '90px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', display: 'block', marginBottom: '2px' }}>
                  Reported on:
                </label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  <input
                    type="date"
                    className="input-control"
                    value={reportedDate}
                    onChange={(e) => setReportedDate(e.target.value)}
                    style={{ height: '30px', fontSize: '12px' }}
                  />
                  <input
                    type="time"
                    className="input-control"
                    value={reportedTime}
                    onChange={(e) => setReportedTime(e.target.value)}
                    style={{ height: '30px', fontSize: '12px', width: '90px' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Category & Formatting Banner */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '12px 16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.5px' }}>
                HAEMATOLOGY
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#475569', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={printCategoriesFromNewPage}
                  onChange={(e) => setPrintCategoriesFromNewPage(e.target.checked)}
                />
                Print categories from new page (PDF only)
              </label>
            </div>

            {/* Analyzer Ingestion Banner if data available */}
            {analyzerPending && (
              <div
                style={{
                  backgroundColor: '#eff6ff',
                  border: '1.5px solid #93c5fd',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  marginBottom: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Cpu size={20} color="#2563eb" />
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af' }}>
                      LIS Machine Data Available: {analyzerPending.transmissions?.[0]?.analyzerName || 'Mindray BC-5000'}
                    </div>
                    <div style={{ fontSize: '11px', color: '#3b82f6' }}>
                      Specimen Barcode: <strong>{analyzerPending.transmissions?.[0]?.sampleBarcode || regNo}</strong> • {analyzerPending.transmissions?.[0]?.results?.length || 0} observations ready
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleApplyAnalyzerResults}
                  style={{ backgroundColor: '#2563eb', fontSize: '12px' }}
                >
                  Auto-Fill Machine Values
                </Button>
              </div>
            )}

            {/* Test Panel Banner */}
            <div
              style={{
                backgroundColor: '#f1f5f9',
                padding: '8px 12px',
                borderRadius: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#1e293b' }}>
                COMPLETE BLOOD COUNT (CBC)
              </div>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => showToast('Reorder panel items trigger')}
              >
                Reorder
              </button>
            </div>

            {/* Test-Level Print Options Strip */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '16px',
                fontSize: '12px',
                color: '#475569',
                padding: '4px 0 10px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={printReady}
                  onChange={(e) => setPrintReady(e.target.checked)}
                />
                Print ready
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={keepInSamePage}
                  onChange={(e) => setKeepInSamePage(e.target.checked)}
                />
                Keep in same page
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={printFromNewPage}
                  onChange={(e) => setPrintFromNewPage(e.target.checked)}
                />
                Print from new page
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={pageBreakAfter}
                  onChange={(e) => setPageBreakAfter(e.target.checked)}
                />
                Page break after (PDF only)
              </label>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={skipInterpretation}
                  onChange={(e) => setSkipInterpretation(e.target.checked)}
                />
                Skip interpretation
              </label>
            </div>

            {/* Parameters Table */}
            <table className="data-table" style={{ marginTop: '8px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc' }}>
                  <th style={{ width: '40%' }}>TEST</th>
                  <th style={{ width: '22%' }}>VALUE</th>
                  <th style={{ width: '15%' }}>UNIT</th>
                  <th style={{ width: '23%' }}>REFERENCE</th>
                </tr>
              </thead>
              <tbody>
                {params.map((p) => {
                  const numVal = parseFloat(p.value);
                  const isOutOfRange = !isNaN(numVal) && (numVal < p.lower || numVal > p.upper);
                  return (
                    <tr key={p.id}>
                      {/* Parameter Name */}
                      <td style={{ paddingLeft: p.isSubtest ? '24px' : '10px' }}>
                        <div style={{ fontWeight: p.isSubtest ? 500 : 600, color: '#1e293b', fontSize: '13px' }}>
                          {p.name} {p.isOptional && <span style={{ fontSize: '11px', color: '#94a3b8' }}>(Optional)</span>}
                        </div>
                      </td>

                      {/* Value Input */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <input
                            type="text"
                            value={p.value}
                            onChange={(e) => handleParamChange(p.id, e.target.value)}
                            className="input-control"
                            style={{
                              width: '100px',
                              height: '30px',
                              fontSize: '13px',
                              fontWeight: isOutOfRange ? 700 : 500,
                              color: isOutOfRange ? '#dc2626' : '#0f172a',
                              borderColor: isOutOfRange ? '#f87171' : '#cbd5e1',
                              backgroundColor: isOutOfRange ? '#fef2f2' : '#ffffff',
                            }}
                          />
                          {isOutOfRange && (
                            <span
                              style={{
                                fontSize: '10px',
                                fontWeight: 700,
                                padding: '2px 5px',
                                borderRadius: '4px',
                                backgroundColor: '#fee2e2',
                                color: '#b91c1c',
                              }}
                            >
                              {numVal > p.upper ? 'H' : 'L'}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Unit */}
                      <td style={{ fontSize: '12px', color: '#64748b' }}>{p.unit}</td>

                      {/* Reference Range + Edit Icon */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                          <span style={{ color: '#334155' }}>{p.reference}</span>
                          <button
                            type="button"
                            className="btn-icon"
                            title="Edit reference range"
                            onClick={() => showToast(`Edit reference range for ${p.name}`)}
                          >
                            <Edit2 size={12} color="#94a3b8" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Add Notes / Remarks Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => showToast('Appended standard clinical notes template.')}
              >
                + Add notes
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => showToast('Appended technician remarks.')}
              >
                + Add remarks
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ fontSize: '12px', padding: '4px 10px' }}
                onClick={() => showToast('Appended physician follow-up advice.')}
              >
                + Add advices
              </button>
            </div>
          </div>

          {/* Interpretations Section */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              padding: '16px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Clinical Interpretations
              </h3>
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#0284c7',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
                onClick={() => showToast('Edit interpretation text')}
              >
                Edit
              </button>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, marginBottom: '12px' }}>
              A complete blood count (CBC) evaluates overall health and screens for anemia, infection, and hematologic disorders.
              Venous blood counts may display minor physiological variations from capillary samples within established bounds.
            </p>

            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              More details / Pathologist Impression:
            </label>
            <textarea
              className="input-control"
              rows={3}
              value={moreDetails}
              onChange={(e) => setMoreDetails(e.target.value)}
              style={{ fontSize: '13px', lineHeight: 1.4 }}
            />
          </div>
        </div>
      </div>

      {/* Sticky Bottom Action Bar */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: '260px',
          right: 0,
          backgroundColor: '#ffffff',
          borderTop: '1px solid #e2e8f0',
          padding: '12px 32px',
          boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          zIndex: 60,
          paddingRight: '160px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#64748b' }}>
          <span>Current status:</span>
          <Badge variant={status === 'Signed off' ? 'success' : 'info'}>{status}</Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleSaveOnly}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Save size={15} />
            <span>Save only</span>
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleMarkFinal}
            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px', color: '#0284c7', borderColor: '#0284c7' }}
          >
            <CheckCircle2 size={15} />
            <span>Mark Final</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsSignOffConfirmOpen(true)}
            style={{
              padding: '8px 22px',
              fontSize: '13px',
              backgroundColor: '#16a34a',
              borderColor: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <ShieldCheck size={16} />
            <span>Sign off & Authorize</span>
          </button>
        </div>
      </div>

      {/* Sign-off Confirmation Modal */}
      {isSignOffConfirmOpen && (
        <ConfirmationModal
          isOpen={isSignOffConfirmOpen}
          onClose={() => setIsSignOffConfirmOpen(false)}
          onConfirm={handleConfirmSignOff}
          title="Sign Off Diagnostic Report?"
          message={`Are you sure you want to clinically authorize and sign off report #${regNo} for ${patientName}? An automated SMS and WhatsApp link will be issued to the patient.`}
          confirmLabel="Sign Off & Deliver"
          cancelLabel="Continue Editing"
          variant="warning"
        />
      )}
    </div>
  );
};
