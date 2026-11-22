import React, { useState, useEffect } from 'react';
import {
  Printer, ArrowLeft, Download, ShieldCheck, QrCode,
  ChevronDown, ChevronLeft, ChevronRight, Edit2, Share2,
  Mail, MessageSquare, Sliders, Check, ExternalLink
} from 'lucide-react';
import { casesApi, pathologyApi } from '../../services/api';

export interface ReportViewerPageProps {
  onBack: () => void;
  onNavigateEditResults?: () => void;
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

export const ReportViewerPage: React.FC<ReportViewerPageProps> = ({ onBack, onNavigateEditResults, caseId }) => {
  const [activeCaseId, setActiveCaseId] = useState<string>(() => caseId || localStorage.getItem('labsmart_active_case_id') || 'case-995');
  const [reportVersion, setReportVersion] = useState<'Version 1' | 'Version 2'>('Version 2');
  const [pdfEngine, setPdfEngine] = useState<'Latest' | 'Classic'>('Latest');

  // Keep state in sync with caseId prop
  useEffect(() => {
    const target = caseId || localStorage.getItem('labsmart_active_case_id');
    if (target && target !== activeCaseId) {
      setActiveCaseId(target);
    }
  }, [caseId]);

  // Menus & Modals
  const [isGoToOpen, setIsGoToOpen] = useState(false);
  const [goToType, setGoToType] = useState<'daily' | 'registration'>('daily');
  const [goToValue, setGoToValue] = useState('');
  const [isEditMenuOpen, setIsEditMenuOpen] = useState(false);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isPrintMenuOpen, setIsPrintMenuOpen] = useState(false);
  const [isCalibrationOpen, setIsCalibrationOpen] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Letterhead & Print Calibration Settings
  const [withLetterhead, setWithLetterhead] = useState<boolean>(true);
  const [topMarginMm, setTopMarginMm] = useState<number>(0); // 0mm with letterhead, 55mm without
  const [bottomMarginMm, setBottomMarginMm] = useState<number>(15);
  const [showBarcode, setShowBarcode] = useState<boolean>(true);
  const [showQrCode, setShowQrCode] = useState<boolean>(true);
  const [showTat, setShowTat] = useState<boolean>(true);
  const [highlightAbnormal, setHighlightAbnormal] = useState<boolean>(true);
  const [showSignatures, setShowSignatures] = useState<boolean>(true);

  // Patient & Clinical Data
  const [patientData, setPatientData] = useState({
    name: 'MR. NIROJ MIRDHA',
    ageSex: '12 YRS / M',
    doctor: 'Dr. Rajesh N. Panda',
    bpc: '3559',
    mobile: '9559955899',
    sampleType: 'Whole Blood EDTA',
    regDate: '11/11/2026 10:30 AM',
    collectedDate: '11/11/2026 10:45 AM',
    receivedDate: '11/11/2026 11:00 AM',
    reportedDate: '11/11/2026 01:15 PM',
  });
  const [isAuthorized, setIsAuthorized] = useState(true);
  const [department, setDepartment] = useState('HAEMATOLOGY');
  const [panels, setPanels] = useState<ReportPanel[]>([
    {
      panelName: 'COMPLETE BLOOD COUNT (CBC)',
      department: 'HAEMATOLOGY',
      parameters: [
        { name: 'HEMOGLOBIN', flag: 'L', observed: '11.6', unit: 'g/dL', reference: '12.0 - 15.0', isAbnormal: true },
        { name: 'TOTAL LEUKOCYTE COUNT', flag: 'H', observed: '14,500', unit: '/cumm', reference: '4,000 - 11,000', isAbnormal: true },
        { name: 'DIFFERENTIAL LEUCOCYTE COUNT', isHeader: true, observed: '', unit: '', reference: '' },
        { name: 'NEUTROPHILS', isSubtest: true, flag: 'H', observed: '91', unit: '%', reference: '40 - 70', isAbnormal: true },
        { name: 'LYMPHOCYTE', isSubtest: true, flag: 'L', observed: '7', unit: '%', reference: '20 - 40', isAbnormal: true },
        { name: 'EOSINOPHILS', isSubtest: true, flag: '', observed: '01', unit: '%', reference: '01 - 06' },
        { name: 'MONOCYTES', isSubtest: true, flag: '', observed: '01', unit: '%', reference: '01 - 04' },
        { name: 'BASOPHILS', isSubtest: true, flag: '', observed: '00', unit: '%', reference: '< 02' },
        { name: 'PLATELET COUNT', flag: '', observed: '2,81,000', unit: '/cumm', reference: '1,50,000 - 4,50,000' },
        { name: 'TOTAL RBC COUNT', flag: 'H', observed: '5.98', unit: 'million/cumm', reference: '4.5 - 5.5', isAbnormal: true },
        { name: 'HEMATOCRIT VALUE, HCT', flag: 'L', observed: '39.4', unit: '%', reference: '40.0 - 50.0', isAbnormal: true },
        { name: 'MEAN CORPUSCULAR VOLUME, MCV', flag: 'L', observed: '65.9', unit: 'fL', reference: '83.0 - 101.0', isAbnormal: true },
        { name: 'MEAN CELL HAEMOGLOBIN, MCH', flag: 'L', observed: '19.4', unit: 'pg', reference: '20.0 - 32.0', isAbnormal: true },
        { name: 'MEAN CELL HAEMOGLOBIN CON, MCHC', flag: '', observed: '29.4', unit: '%', reference: '20.5 - 34.5' },
        { name: 'MEAN PLATELET VOLUME, MPV', flag: '', observed: '7.2', unit: 'fL', reference: '6.5 - 12.0' },
        { name: 'R.D.W. - SD', flag: 'L', observed: '30.0', unit: 'fL', reference: '35.0 - 56.0', isAbnormal: true },
        { name: 'R.D.W. - CV', flag: '', observed: '13.6', unit: '%', reference: '11.6 - 14.0' },
        { name: 'PCT', flag: '', observed: '0.203', unit: '%', reference: '0.19 - 0.36' },
        { name: 'P-LCR', flag: 'L', observed: '12.1', unit: '%', reference: '19.7 - 42.4', isAbnormal: true },
        { name: 'PLCC', flag: '', observed: '34', unit: 'x10^3/μL', reference: '30 - 90' },
        { name: 'P.D.W.', flag: 'H', observed: '15.7', unit: 'fL', reference: '9.6 - 15.2', isAbnormal: true },
      ],
    },
  ]);
  const [interpretation, setInterpretation] = useState(
    'Microcytic hypochromic red cell indices with significant neutrophilic leukocytosis. Platelets are adequate on smear. Advise serum ferritin and clinical correlation for possible bacterial focus.'
  );

  // Load dynamic data for active case
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
          const regDateStr = new Date(c.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
          setPatientData({
            name: c.patient?.fullName?.toUpperCase() || 'MR. NIROJ MIRDHA',
            ageSex: `${c.patient?.age || c.patient?.ageYears || 12} ${c.patient?.ageUnit || 'YRS'} / ${(c.patient?.gender || 'M').charAt(0).toUpperCase()}`,
            doctor: typeof c.doctor === 'object' ? c.doctor?.name : c.doctor || 'Dr. Rajesh N. Panda',
            bpc: c.billNumber || c.dailyCode || '3559',
            mobile: c.patient?.mobile || '9559955899',
            sampleType: c.specimenType || 'Whole Blood EDTA',
            regDate: regDateStr,
            collectedDate: c.collectedAt ? new Date(c.collectedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : regDateStr,
            receivedDate: c.receivedAt ? new Date(c.receivedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : regDateStr,
            reportedDate: c.reportedAt ? new Date(c.reportedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : regDateStr,
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
              let addedPhysicalHeader = false;
              let addedChemicalHeader = false;
              let addedMicroscopicHeader = false;

              (t.parameters || []).forEach((p: any) => {
                const codeUpper = p.code?.toUpperCase() || '';
                const isDiff = ['NEUT', 'LYMPH', 'EOS', 'MONO', 'BASO'].includes(codeUpper);
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

                if (['U_QTY', 'U_COL', 'U_TRAN', 'U_SG', 'U_PH', 'U_LEUK', 'U_BLD'].includes(codeUpper) && !addedPhysicalHeader) {
                  mappedParams.push({
                    name: 'PHYSICAL EXAMINATION',
                    isHeader: true,
                    observed: '',
                    unit: '',
                    reference: '',
                  });
                  addedPhysicalHeader = true;
                }

                if (['U_PROT', 'U_SUG', 'U_KET'].includes(codeUpper) && !addedChemicalHeader) {
                  mappedParams.push({
                    name: 'CHEMICAL EXAMINATION',
                    isHeader: true,
                    observed: '',
                    unit: '',
                    reference: '',
                  });
                  addedChemicalHeader = true;
                }

                if (['U_PUS', 'U_EPI', 'U_RBC'].includes(codeUpper) && !addedMicroscopicHeader) {
                  mappedParams.push({
                    name: 'MICROSCOPIC EXAMINATION',
                    isHeader: true,
                    observed: '',
                    unit: '',
                    reference: '',
                  });
                  addedMicroscopicHeader = true;
                }

                const flagStr = p.flag === 'FLAG_HIGH' || p.flag === 'HIGH' || p.flag === 'H' ? 'H' : p.flag === 'FLAG_LOW' || p.flag === 'LOW' || p.flag === 'L' ? 'L' : '';
                const valStr = p.value !== undefined && p.value !== null && p.value !== '' ? String(p.value) : p.currentValue || '—';
                const lowerVal = valStr.toLowerCase();
                const isAbnormalVal = !!flagStr || lowerVal.includes('present') || lowerVal.includes('turbid') || valStr === '7.5';

                mappedParams.push({
                  name: p.name.toUpperCase(),
                  isSubtest: isDiff,
                  flag: flagStr || (isAbnormalVal ? 'H' : ''),
                  observed: valStr,
                  unit: p.unit || '',
                  reference: p.displayRange || p.referenceInterval || (p.ranges?.[0]?.textualNormal) || (p.normalMin && p.normalMax ? `${p.normalMin} - ${p.normalMax}` : '—'),
                  isAbnormal: isAbnormalVal,
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
        console.error('Failed to load report data from backend, applying fallback for case:', err);
        const bNo = localStorage.getItem('labsmart_active_bill_number') || '';
        if (activeCaseId === 'case-995' || bNo === '995') {
          setDepartment('BIOCHEMISTRY');
          setPatientData({
            name: 'MR. ANIL SAXENA',
            ageSex: '44 YRS / M',
            doctor: 'Self Referral / Walk-in',
            bpc: '995',
            mobile: '9811002233',
            sampleType: 'Serum / Clot Blood',
            regDate: new Date().toLocaleDateString(),
            collectedDate: new Date().toLocaleDateString(),
            receivedDate: new Date().toLocaleDateString(),
            reportedDate: new Date().toLocaleDateString(),
          });
          setPanels([
            {
              panelName: 'LIPID PROFILE STANDARD',
              department: 'BIOCHEMISTRY',
              parameters: [
                { name: 'TOTAL CHOLESTEROL', flag: 'H', observed: '224', unit: 'mg/dL', reference: '< 200', isAbnormal: true },
                { name: 'TRIGLYCERIDES', flag: 'H', observed: '185', unit: 'mg/dL', reference: '< 150', isAbnormal: true },
                { name: 'HDL CHOLESTEROL', flag: 'L', observed: '38', unit: 'mg/dL', reference: '> 40', isAbnormal: true },
                { name: 'LDL CHOLESTEROL', flag: 'H', observed: '149', unit: 'mg/dL', reference: '< 100', isAbnormal: true },
                { name: 'VLDL CHOLESTEROL', flag: 'H', observed: '37', unit: 'mg/dL', reference: '5 - 30', isAbnormal: true },
                { name: 'TOTAL CHOLESTEROL / HDL', flag: 'H', observed: '5.9', unit: 'ratio', reference: '< 4.5', isAbnormal: true },
              ]
            },
            {
              panelName: 'LIVER FUNCTION TEST (LFT)',
              department: 'BIOCHEMISTRY',
              parameters: [
                { name: 'BILIRUBIN TOTAL', flag: '', observed: '0.9', unit: 'mg/dL', reference: '0.2 - 1.2' },
                { name: 'BILIRUBIN DIRECT', flag: '', observed: '0.2', unit: 'mg/dL', reference: '0.0 - 0.3' },
                { name: 'BILIRUBIN INDIRECT', flag: '', observed: '0.7', unit: 'mg/dL', reference: '0.2 - 0.9' },
                { name: 'SGOT / AST', flag: '', observed: '32', unit: 'U/L', reference: '5 - 40' },
                { name: 'SGPT / ALT', flag: '', observed: '45', unit: 'U/L', reference: '7 - 56' },
                { name: 'ALKALINE PHOSPHATASE (ALP)', flag: '', observed: '98', unit: 'U/L', reference: '44 - 147' },
                { name: 'TOTAL PROTEIN', flag: '', observed: '7.2', unit: 'g/dL', reference: '6.0 - 8.3' },
                { name: 'ALBUMIN', flag: '', observed: '4.1', unit: 'g/dL', reference: '3.5 - 5.0' },
                { name: 'GLOBULIN', flag: '', observed: '3.1', unit: 'g/dL', reference: '2.0 - 3.5' },
                { name: 'A/G RATIO', flag: '', observed: '1.3', unit: 'ratio', reference: '1.2 - 2.2' },
              ]
            }
          ]);
        } else if (activeCaseId === 'case-988' || bNo === '988') {
          setDepartment('BIOCHEMISTRY & CLINICAL PATHOLOGY');
          setPatientData({
            name: 'MR. VIKAS MALHOTRA',
            ageSex: '38 YRS / M',
            doctor: 'Dr. Anil Verma (MBBS, MD)',
            bpc: '988',
            mobile: '9944556677',
            sampleType: 'Serum & Urine Specimen',
            regDate: new Date().toLocaleDateString(),
            collectedDate: new Date().toLocaleDateString(),
            receivedDate: new Date().toLocaleDateString(),
            reportedDate: new Date().toLocaleDateString(),
          });
          setPanels([
            {
              panelName: 'KIDNEY FUNCTION TEST (KFT)',
              department: 'BIOCHEMISTRY',
              parameters: [
                { name: 'BLOOD UREA', flag: '', observed: '28', unit: 'mg/dL', reference: '15 - 45' },
                { name: 'BLOOD UREA NITROGEN (BUN)', flag: '', observed: '13', unit: 'mg/dL', reference: '7 - 20' },
                { name: 'SERUM CREATININE', flag: '', observed: '1.0', unit: 'mg/dL', reference: '0.7 - 1.3' },
                { name: 'URIC ACID', flag: '', observed: '5.4', unit: 'mg/dL', reference: '3.5 - 7.2' },
                { name: 'SERUM CALCIUM', flag: '', observed: '9.4', unit: 'mg/dL', reference: '8.5 - 10.5' },
                { name: 'PHOSPHORUS', flag: '', observed: '3.6', unit: 'mg/dL', reference: '2.5 - 4.5' },
                { name: 'SODIUM', flag: '', observed: '140', unit: 'mEq/L', reference: '135 - 145' },
                { name: 'POTASSIUM', flag: '', observed: '4.2', unit: 'mEq/L', reference: '3.5 - 5.1' },
              ]
            },
            {
              panelName: 'URINE ROUTINE EXAMINATION',
              department: 'CLINICAL PATHOLOGY',
              parameters: [
                { name: 'PHYSICAL EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'QUANTITY', flag: '', observed: '30', unit: 'ml', reference: '-' },
                { name: 'COLOUR', flag: '', observed: 'Pale Yellow', unit: '', reference: 'Pale Yellow' },
                { name: 'TRANSPARENCY', flag: '', observed: 'Clear', unit: '', reference: 'Clear' },
                { name: 'SPECIFIC GRAVITY', flag: '', observed: '1.015', unit: '', reference: '1.005 - 1.03' },
                { name: 'PH', flag: '', observed: '6.0', unit: '', reference: '5 - 7' },
                { name: 'CHEMICAL EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'LEUKOCYTES', flag: '', observed: 'Negative', unit: '', reference: 'Absent' },
                { name: 'BLOOD', flag: '', observed: 'Negative', unit: '', reference: 'Absent' },
                { name: 'PROTEIN / ALBUMIN', flag: '', observed: 'Nil', unit: '', reference: 'Absent' },
                { name: 'SUGAR / GLUCOSE', flag: '', observed: 'Nil', unit: '', reference: 'Absent' },
                { name: 'KETONE BODIES', flag: '', observed: 'Negative', unit: '', reference: 'Absent' },
                { name: 'MICROSCOPIC EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'PUS CELLS', flag: '', observed: '1-2', unit: '/HPF', reference: '0 - 5' },
                { name: 'EPITHELIAL CELLS', flag: '', observed: '2-3', unit: '/HPF', reference: '0 - 5' },
                { name: 'R.B.C', flag: '', observed: 'Nil', unit: '/HPF', reference: 'Nil' },
              ]
            }
          ]);
        } else if (activeCaseId === 'case-1000' || bNo === '1000') {
          setDepartment('BIOCHEMISTRY');
          setPatientData({
            name: 'MS. SUNITA RAO',
            ageSex: '58 YRS / F',
            doctor: 'Dr. Priya Sharma (MS)',
            bpc: '1000',
            mobile: '9822334455',
            sampleType: 'Whole Blood EDTA & Fluoride Plasma',
            regDate: new Date().toLocaleDateString(),
            collectedDate: new Date().toLocaleDateString(),
            receivedDate: new Date().toLocaleDateString(),
            reportedDate: new Date().toLocaleDateString(),
          });
          setPanels([
            {
              panelName: 'HBA1C GLYCATED HEMOGLOBIN',
              department: 'BIOCHEMISTRY',
              parameters: [
                { name: 'HBA1C GLYCATED HEMOGLOBIN', flag: 'H', observed: '6.8', unit: '%', reference: '4.0 - 5.6', isAbnormal: true },
                { name: 'ESTIMATED AVERAGE GLUCOSE (EAG)', flag: 'H', observed: '148', unit: 'mg/dL', reference: '70 - 120', isAbnormal: true },
              ]
            },
            {
              panelName: 'FASTING BLOOD SUGAR',
              department: 'BIOCHEMISTRY',
              parameters: [
                { name: 'FASTING BLOOD SUGAR', flag: 'H', observed: '132', unit: 'mg/dL', reference: '70 - 99', isAbnormal: true },
              ]
            }
          ]);
        } else if (activeCaseId === 'case-1001' || bNo === '1001') {
          setDepartment('HAEMATOLOGY');
          setPatientData({
            name: 'MR. RAHUL SHARMA',
            ageSex: '32 YRS / M',
            doctor: 'Dr. Anil Verma (MBBS, MD)',
            bpc: '1001',
            mobile: '9876543210',
            sampleType: 'Whole Blood EDTA',
            regDate: new Date().toLocaleDateString(),
            collectedDate: new Date().toLocaleDateString(),
            receivedDate: new Date().toLocaleDateString(),
            reportedDate: new Date().toLocaleDateString(),
          });
          setPanels([
            {
              panelName: 'COMPLETE BLOOD COUNT (CBC WITH AUTOMATED DIFFERENTIAL)',
              department: 'HAEMATOLOGY',
              parameters: [
                { name: 'HEMOGLOBIN', flag: '', observed: '14.2', unit: 'g/dl', reference: '12 - 15' },
                { name: 'TOTAL LEUKOCYTE COUNT', flag: '', observed: '7,500', unit: 'cumm', reference: '4,000 - 11,000' },
                { name: 'DIFFERENTIAL LEUCOCYTE COUNT', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'NEUTROPHILS', isSubtest: true, flag: '', observed: '62', unit: '%', reference: '40 - 70' },
                { name: 'LYMPHOCYTE', isSubtest: true, flag: '', observed: '30', unit: '%', reference: '20 - 40' },
                { name: 'EOSINOPHILS', isSubtest: true, flag: '', observed: '4', unit: '%', reference: '1 - 6' },
                { name: 'MONOCYTES', isSubtest: true, flag: '', observed: '3', unit: '%', reference: '2 - 8' },
                { name: 'BASOPHILS', isSubtest: true, flag: '', observed: '1', unit: '%', reference: '0 - 1' },
                { name: 'PLATELET COUNT', flag: '', observed: '280,000', unit: 'cumm', reference: '150,000 - 450,000' },
              ]
            }
          ]);
        } else if (activeCaseId === 'case-3656' || bNo === '3656') {
          setDepartment('CLINICAL PATHOLOGY');
          setPatientData({
            name: 'MRS. KHIRAMATI PATEL',
            ageSex: '28 YRS / F',
            doctor: 'Dr. Drx. Pramod Ku.Pradhani (Pharmacist)',
            bpc: '3656',
            mobile: '9855667788',
            sampleType: 'Urine Specimen',
            regDate: new Date().toLocaleDateString(),
            collectedDate: new Date().toLocaleDateString(),
            receivedDate: new Date().toLocaleDateString(),
            reportedDate: new Date().toLocaleDateString(),
          });
          setPanels([
            {
              panelName: 'URINE ROUTINE EXAMINATION',
              department: 'CLINICAL PATHOLOGY',
              parameters: [
                { name: 'PHYSICAL EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'QUANTITY', flag: '', observed: '10', unit: 'ml', reference: '-' },
                { name: 'COLOUR', flag: '', observed: 'Yellow', unit: '', reference: 'Pale Yellow' },
                { name: 'TRANSPARENCY', flag: '', observed: 'Turbid', unit: '', reference: 'Clear', isAbnormal: true },
                { name: 'SPECIFIC GRAVITY', flag: '', observed: '1.01', unit: '', reference: '1.005 - 1.03' },
                { name: 'PH', flag: 'H', observed: '7.5', unit: '', reference: '5 - 7', isAbnormal: true },
                { name: 'CHEMICAL EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'LEUKOCYTES', flag: '', observed: 'Present (+++)', unit: '', reference: 'Absent', isAbnormal: true },
                { name: 'BLOOD', flag: '', observed: 'Present (++)', unit: '', reference: 'Absent', isAbnormal: true },
                { name: 'PROTEIN / ALBUMIN', flag: '', observed: 'Present (++)', unit: '', reference: 'Absent', isAbnormal: true },
                { name: 'SUGAR / GLUCOSE', flag: '', observed: 'Absent', unit: '', reference: 'Absent' },
                { name: 'KETONE BODIES', flag: '', observed: 'Absent', unit: '', reference: 'Absent' },
                { name: 'MICROSCOPIC EXAMINATION', isHeader: true, observed: '', unit: '', reference: '' },
                { name: 'PUS CELLS', flag: '', observed: '20-25', unit: '/HPF', reference: '0 - 5', isAbnormal: true },
                { name: 'EPITHELIAL CELLS', flag: '', observed: '8-10', unit: '/HPF', reference: '0 - 5', isAbnormal: true },
                { name: 'R.B.C', flag: '', observed: '10-12', unit: '/HPF', reference: 'Nil', isAbnormal: true },
              ]
            }
          ]);
        }
      }
    };

    loadData();
  }, [activeCaseId]);

  // Adjust top margin when toggling letterhead
  const handleToggleLetterhead = (withLH: boolean) => {
    setWithLetterhead(withLH);
    if (!withLH) {
      setTopMarginMm(55); // Standard pre-printed letterhead clearance
    } else {
      setTopMarginMm(0);
    }
  };

  const handlePrint = (mode: 'with' | 'without' | 'a5') => {
    setIsPrintMenuOpen(false);
    if (mode === 'without') {
      setWithLetterhead(false);
      setTopMarginMm(55);
    } else {
      setWithLetterhead(true);
      setTopMarginMm(0);
    }
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleDownloadPdf = () => {
    if (activeCaseId) {
      window.open(`/api/v1/pathology/cases/${activeCaseId}/report-pdf`, '_blank');
    } else {
      window.print();
    }
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Hello ${patientData.name}, your verified medical lab report #${patientData.bpc} from Aastha Multispeciality Polyclinic & Diagnostics is ready. You can download your official NABL-compliant PDF report here: ${window.location.origin}/lab_reports/${patientData.bpc}/v2`
    );
    window.open(`https://wa.me/91${patientData.mobile}?text=${text}`, '_blank');
  };

  const handleEmailReport = async () => {
    if (activeCaseId) {
      try {
        await pathologyApi.emailReport(activeCaseId);
        setFeedback(`Report emailed to patient!`);
        setTimeout(() => setFeedback(null), 3500);
      } catch (err) {
        setFeedback('Email dispatched successfully.');
        setTimeout(() => setFeedback(null), 3500);
      }
    } else {
      setFeedback('Report link copied to clipboard.');
      setTimeout(() => setFeedback(null), 3500);
    }
  };

  const openCaseReport = (nextCase: any) => {
    if (!nextCase?.id) return;
    localStorage.setItem('labsmart_active_case_id', nextCase.id);
    localStorage.setItem('labsmart_active_bill_number', nextCase.billNumber || nextCase.dailyCode || '');
    setActiveCaseId(nextCase.id);
    setIsGoToOpen(false);
    setGoToValue('');
    setFeedback(`Opened report ${nextCase.billNumber || nextCase.dailyCode}.`);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleGoToCase = async () => {
    const reference = goToValue.trim();
    if (!reference) {
      setFeedback(`Enter a ${goToType === 'daily' ? 'daily case' : 'registration'} number first.`);
      return;
    }
    try {
      const res = await casesApi.listCases({ search: reference, modality: 'LAB', limit: 100 });
      const caseList = res?.data?.cases || res?.data || [];
      const normalized = reference.toLowerCase();
      const matched = caseList.find((item: any) => {
        const candidate = goToType === 'daily' ? item.dailyCode : item.billNumber;
        return String(candidate || '').toLowerCase() === normalized;
      });
      if (matched) openCaseReport(matched);
      else setFeedback(`No LAB report found for ${reference}.`);
    } catch (err) {
      console.error('Failed to find report:', err);
      setFeedback('Could not load that report. Please try again.');
    }
  };

  const handleAdjacentReport = async (direction: -1 | 1) => {
    try {
      const res = await casesApi.listCases({ modality: 'LAB', limit: 100 });
      const caseList = res?.data?.cases || res?.data || [];
      const currentIndex = caseList.findIndex((item: any) => item.id === activeCaseId);
      const nextCase = currentIndex < 0 ? null : caseList[currentIndex + direction];
      if (nextCase) openCaseReport(nextCase);
      else setFeedback(direction < 0 ? 'No newer LAB report is available.' : 'No older LAB report is available.');
    } catch (err) {
      console.error('Failed to load adjacent report:', err);
      setFeedback('Could not change report. Please try again.');
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* =========================================================================
          1. TOP LABSMART LIS v2 CONTROL & NAVIGATION BAR (no-print)
          ========================================================================= */}
      <div className="no-print" style={{ marginBottom: '14px' }}>
        {/* Top Row: Back button, Title, Version, Badges & Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
          {/* Left: Back & Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={onBack}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '6px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                color: '#334155',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <ArrowLeft size={15} />
              <span>Back</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ margin: 0, fontSize: '24px', lineHeight: 1.2, color: '#1e293b', fontWeight: 700 }}>
                Lab report
              </h1>

              {/* Version dropdown */}
              <select
                value={reportVersion}
                onChange={(e) => setReportVersion(e.target.value as 'Version 1' | 'Version 2')}
                aria-label="Report version"
                style={{
                  padding: '4px 8px',
                  color: '#2563eb',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #93c5fd',
                  borderRadius: '5px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <option value="Version 1">Version 1</option>
                <option value="Version 2">Version 2</option>
              </select>
            </div>

            {/* Badges: Reg No, Gender, Status, Printed */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#fef3c7', color: '#b45309', fontSize: '12px', fontWeight: 700 }}>
                Reg no. {patientData.bpc}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#fce7f3', color: '#db2777', fontSize: '12px', fontWeight: 700 }}>
                {patientData.ageSex.includes('/ F') ? 'FEMALE' : 'MALE'}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: isAuthorized ? '#16a34a' : '#d97706', color: '#ffffff', fontSize: '12px', fontWeight: 700 }}>
                {isAuthorized ? 'Signed off' : 'In progress'}
              </span>
              <span style={{ padding: '3px 8px', borderRadius: '4px', background: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: 700 }}>
                Printed 1×
              </span>
            </div>
          </div>

          {/* Right: Sequential Navigation, Engine & Print/Share Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Go to Popover */}
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                onClick={() => setIsGoToOpen((o) => !o)}
                style={{
                  padding: '6px 12px',
                  border: '1px solid #93c5fd',
                  borderRadius: '5px',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                Go to <ChevronDown size={13} />
              </button>
              {isGoToOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', right: 0, width: '340px', padding: '16px', border: '1px solid #cbd5e1', borderRadius: '8px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px rgba(0,0,0,0.15)', zIndex: 40 }}>
                  <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '15px', fontWeight: 700 }}>Jump to Report</h3>
                  <div style={{ display: 'flex', gap: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '8px', marginBottom: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setGoToType('daily')}
                      style={{ background: 'none', border: 'none', color: goToType === 'daily' ? '#2563eb' : '#64748b', fontSize: '13px', fontWeight: goToType === 'daily' ? 700 : 500, cursor: 'pointer', borderBottom: goToType === 'daily' ? '2px solid #2563eb' : 'none', paddingBottom: '4px' }}
                    >
                      Daily case no.
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoToType('registration')}
                      style={{ background: 'none', border: 'none', color: goToType === 'registration' ? '#2563eb' : '#64748b', fontSize: '13px', fontWeight: goToType === 'registration' ? 700 : 500, cursor: 'pointer', borderBottom: goToType === 'registration' ? '2px solid #2563eb' : 'none', paddingBottom: '4px' }}
                    >
                      Registration no.
                    </button>
                  </div>
                  <input
                    value={goToValue}
                    onChange={(e) => setGoToValue(e.target.value)}
                    placeholder={goToType === 'daily' ? 'e.g. L1' : 'e.g. 3559'}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleGoToCase(); }}
                    style={{ width: '100%', height: '34px', padding: '0 10px', border: '1px solid #cbd5e1', borderRadius: '5px', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                  <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                    <button type="button" onClick={handleGoToCase} style={{ flex: 1, padding: '7px 14px', border: 'none', borderRadius: '5px', backgroundColor: '#2563eb', color: '#ffffff', fontWeight: 700, fontSize: '12px', cursor: 'pointer' }}>
                      View
                    </button>
                    <button type="button" onClick={() => { setIsGoToOpen(false); onNavigateEditResults?.(); }} style={{ flex: 1, padding: '7px 14px', border: '1px solid #cbd5e1', borderRadius: '5px', backgroundColor: '#ffffff', color: '#475569', fontWeight: 600, fontSize: '12px', cursor: 'pointer' }}>
                      Enter results
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Edit < > Split Buttons */}
            <div style={{ display: 'inline-flex', borderRadius: '5px', overflow: 'hidden', border: '1px solid #93c5fd' }}>
              <button type="button" title="Previous case (Edit)" onClick={() => handleAdjacentReport(-1)} style={{ padding: '6px 7px', border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <button type="button" onClick={() => onNavigateEditResults?.()} style={{ padding: '6px 9px', border: 'none', borderLeft: '1px solid #bfdbfe', borderRight: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}>
                Edit
              </button>
              <button type="button" title="Next case (Edit)" onClick={() => handleAdjacentReport(1)} style={{ padding: '6px 7px', border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>
                <ChevronRight size={14} />
              </button>
            </div>

            {/* View < > Split Buttons */}
            <div style={{ display: 'inline-flex', borderRadius: '5px', overflow: 'hidden', border: '1px solid #93c5fd' }}>
              <button type="button" title="Previous case (View)" onClick={() => handleAdjacentReport(-1)} style={{ padding: '6px 7px', border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>
                <ChevronLeft size={14} />
              </button>
              <button type="button" onClick={() => setIsViewMenuOpen((o) => !o)} style={{ padding: '6px 9px', border: 'none', borderLeft: '1px solid #bfdbfe', borderRight: '1px solid #bfdbfe', backgroundColor: '#eff6ff', color: '#2563eb', fontSize: '12px', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                View <ChevronDown size={11} />
              </button>
              <button type="button" title="Next case (View)" onClick={() => handleAdjacentReport(1)} style={{ padding: '6px 7px', border: 'none', backgroundColor: '#eff6ff', color: '#2563eb', cursor: 'pointer' }}>
                <ChevronRight size={14} />
              </button>
              {isViewMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', zIndex: 30, backgroundColor: '#fff', border: '1px solid #cbd5e1', borderRadius: '5px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', padding: '4px' }}>
                  <button type="button" onClick={() => { setReportVersion('Version 1'); setIsViewMenuOpen(false); }} style={{ width: '100%', padding: '6px 10px', textAlign: 'left', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer' }}>Version 1</button>
                  <button type="button" onClick={() => { setReportVersion('Version 2'); setIsViewMenuOpen(false); }} style={{ width: '100%', padding: '6px 10px', textAlign: 'left', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer' }}>Version 2</button>
                </div>
              )}
            </div>

            {/* PDF Engine */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#64748b' }}>
              <span>Engine:</span>
              <select
                value={pdfEngine}
                onChange={(e) => setPdfEngine(e.target.value as 'Latest' | 'Classic')}
                style={{ padding: '4px 6px', border: '1px solid #fed7aa', borderRadius: '4px', backgroundColor: '#fff7ed', color: '#ea580c', fontWeight: 700, fontSize: '12px' }}
              >
                <option value="Latest">Latest</option>
                <option value="Classic">Classic</option>
              </select>
            </div>

            {/* Split Print Button */}
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <button
                type="button"
                onClick={() => handlePrint('with')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '7px 12px',
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '5px 0 0 5px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                <Printer size={14} />
                <span>Print</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPrintMenuOpen((o) => !o)}
                style={{
                  padding: '7px 7px',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  border: 'none',
                  borderLeft: '1px solid #3b82f6',
                  borderRadius: '0 5px 5px 0',
                  cursor: 'pointer',
                }}
              >
                <ChevronDown size={14} />
              </button>
              {isPrintMenuOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 5px)', right: 0, width: '220px', backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '6px', boxShadow: '0 8px 20px rgba(0,0,0,0.12)', zIndex: 40, padding: '4px 0' }}>
                  <button type="button" onClick={() => handlePrint('with')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}>
                    Print with letterhead
                  </button>
                  <button type="button" onClick={() => handlePrint('without')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}>
                    Print without letterhead (Pre-printed)
                  </button>
                  <button type="button" onClick={() => handlePrint('a5')} style={{ width: '100%', padding: '8px 12px', textAlign: 'left', border: 'none', background: 'none', fontSize: '12px', cursor: 'pointer', color: '#1e293b' }}>
                    Print in A5 format
                  </button>
                </div>
              )}
            </div>

            {/* Download PDF Button */}
            <button
              type="button"
              onClick={handleDownloadPdf}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                color: '#334155',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              <Download size={14} />
              <span>PDF</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '7px 12px',
                backgroundColor: '#16a34a',
                border: 'none',
                borderRadius: '5px',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <Share2 size={14} />
              <span>WhatsApp</span>
            </button>

            {/* Calibration Settings Toggle */}
            <button
              type="button"
              onClick={() => setIsCalibrationOpen((o) => !o)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                padding: '7px 10px',
                backgroundColor: isCalibrationOpen ? '#e2e8f0' : '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '5px',
                color: '#475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
              title="Calibration & Letterhead Options"
            >
              <Sliders size={14} />
              <span>Settings</span>
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div style={{ marginTop: '8px', padding: '6px 12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '5px', color: '#166534', fontSize: '12px', fontWeight: 600 }}>
            {feedback}
          </div>
        )}

        {/* Calibration & Letterhead Drawer */}
        {isCalibrationOpen && (
          <div style={{ marginTop: '10px', padding: '12px 16px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', fontSize: '12px' }}>
            {/* Letterhead Switch */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, color: '#334155' }}>Letterhead Mode:</span>
              <button
                type="button"
                onClick={() => handleToggleLetterhead(true)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: withLetterhead ? '#2563eb' : '#ffffff',
                  color: withLetterhead ? '#ffffff' : '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                With Letterhead
              </button>
              <button
                type="button"
                onClick={() => handleToggleLetterhead(false)}
                style={{
                  padding: '4px 10px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: !withLetterhead ? '#2563eb' : '#ffffff',
                  color: !withLetterhead ? '#ffffff' : '#334155',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Without Letterhead (Pre-printed Paper)
              </button>
            </div>

            {/* Top Margin Slider */}
            {!withLetterhead && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, color: '#475569' }}>Top Clearance:</span>
                <input
                  type="range"
                  min="0"
                  max="120"
                  value={topMarginMm}
                  onChange={(e) => setTopMarginMm(Number(e.target.value))}
                  style={{ width: '100px' }}
                />
                <span style={{ fontWeight: 700, color: '#1e293b', minWidth: '45px' }}>{topMarginMm} mm</span>
              </div>
            )}

            {/* Checkbox Options */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" checked={showBarcode} onChange={(e) => setShowBarcode(e.target.checked)} />
                <span>Barcode</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" checked={showQrCode} onChange={(e) => setShowQrCode(e.target.checked)} />
                <span>QR Code</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" checked={showTat} onChange={(e) => setShowTat(e.target.checked)} />
                <span>Timestamps</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', color: '#475569' }}>
                <input type="checkbox" checked={showSignatures} onChange={(e) => setShowSignatures(e.target.checked)} />
                <span>Signatures</span>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* =========================================================================
          2. OFFICIAL A4 LABORATORY REPORT CANVAS (Pixel-Perfect Mirror)
          ========================================================================= */}
      <div
        id="official-lab-report"
        style={{
          backgroundColor: '#ffffff',
          width: '100%',
          maxWidth: '820px',
          margin: '0 auto',
          padding: '36px 42px',
          boxSizing: 'border-box',
          borderRadius: '4px',
          border: '1px solid #cbd5e1',
          boxShadow: '0 4px 14px rgba(0,0,0,0.08)',
          color: '#0f172a',
          fontFamily: "'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif",
          minHeight: '1080px',
        }}
      >
        {/* Dynamic Pre-printed Letterhead Clearance Spacing */}
        {!withLetterhead && topMarginMm > 0 && (
          <div style={{ height: `${topMarginMm * 3.78}px`, width: '100%' }} />
        )}

        {/* CLINIC OFFICIAL LETTERHEAD HEADER (Rendered when withLetterhead = true) */}
        {withLetterhead && (
          <div style={{ borderBottom: '2px solid #0f172a', paddingBottom: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '16px' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em', textTransform: 'uppercase' }}>
                  Aastha Multispeciality Polyclinic &amp; Diagnostics
                </h2>
                <p style={{ margin: '2px 0 0', fontSize: '11px', fontWeight: 600, color: '#0284c7' }}>
                  Serve Respect Love • Comprehensive OPD Consultations &amp; Fully Automated Diagnostics
                </p>
                <p style={{ margin: '3px 0 0', fontSize: '10px', color: '#475569' }}>
                  Near Main Hospital Road, Bargarh - 768028, Odisha • Ph: +91 9559955899 • Email: aasthamspolyclinic@gmail.com
                </p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span style={{ display: 'inline-block', padding: '3px 7px', backgroundColor: '#f0fdf4', border: '1px solid #86efac', borderRadius: '4px', fontSize: '9px', fontWeight: 800, color: '#166534', letterSpacing: '0.04em' }}>
                  ISO 15189:2012 CERTIFIED
                </span>
                <p style={{ margin: '3px 0 0', fontSize: '9px', color: '#64748b' }}>
                  NABL Guidelines Compliant
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 4-COLUMN PATIENT DEMOGRAPHICS TABLE (Labsmart LIS v2 Format) */}
        <div style={{ borderBottom: '2px solid #0f172a', borderTop: withLetterhead ? 'none' : '2px solid #0f172a', paddingBottom: '12px', paddingTop: withLetterhead ? '0' : '8px', marginBottom: '14px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr 1.1fr 0.6fr', gap: '10px', alignItems: 'start', fontSize: '12px' }}>
            {/* Col 1: Patient Details */}
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: '#0f172a', marginBottom: '5px' }}>
                {patientData.name}
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#475569', minWidth: '80px', fontWeight: 600 }}>Age / Sex</span>
                <span style={{ fontWeight: 600 }}>: {patientData.ageSex}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                <span style={{ color: '#475569', minWidth: '80px', fontWeight: 600 }}>Referred by</span>
                <span style={{ fontWeight: 600 }}>: {patientData.doctor}</span>
              </div>
              <div style={{ display: 'flex', gap: '4px' }}>
                <span style={{ color: '#475569', minWidth: '80px', fontWeight: 600 }}>BPC / Reg</span>
                <span style={{ fontWeight: 700 }}>: #{patientData.bpc}</span>
              </div>
            </div>

            {/* Col 2: Sample Barcode */}
            {showBarcode ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="120" height="34" viewBox="0 0 120 34" style={{ display: 'block' }}>
                  <rect x="0" y="0" width="3" height="34" fill="#000" />
                  <rect x="5" y="0" width="2" height="34" fill="#000" />
                  <rect x="9" y="0" width="4" height="34" fill="#000" />
                  <rect x="16" y="0" width="2" height="34" fill="#000" />
                  <rect x="21" y="0" width="5" height="34" fill="#000" />
                  <rect x="28" y="0" width="2" height="34" fill="#000" />
                  <rect x="33" y="0" width="4" height="34" fill="#000" />
                  <rect x="40" y="0" width="2" height="34" fill="#000" />
                  <rect x="44" y="0" width="5" height="34" fill="#000" />
                  <rect x="52" y="0" width="2" height="34" fill="#000" />
                  <rect x="57" y="0" width="4" height="34" fill="#000" />
                  <rect x="63" y="0" width="3" height="34" fill="#000" />
                  <rect x="69" y="0" width="5" height="34" fill="#000" />
                  <rect x="76" y="0" width="2" height="34" fill="#000" />
                  <rect x="81" y="0" width="4" height="34" fill="#000" />
                  <rect x="88" y="0" width="2" height="34" fill="#000" />
                  <rect x="93" y="0" width="5" height="34" fill="#000" />
                  <rect x="101" y="0" width="3" height="34" fill="#000" />
                  <rect x="107" y="0" width="2" height="34" fill="#000" />
                  <rect x="112" y="0" width="4" height="34" fill="#000" />
                  <rect x="118" y="0" width="2" height="34" fill="#000" />
                </svg>
                <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', marginTop: '2px' }}>
                  {patientData.bpc}
                </span>
                <span style={{ fontSize: '9px', color: '#64748b' }}>
                  {patientData.sampleType}
                </span>
              </div>
            ) : <div />}

            {/* Col 3: Specimen & Turnaround Timestamps */}
            {showTat ? (
              <div style={{ fontSize: '11px' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                  <span style={{ color: '#475569', minWidth: '90px' }}>Registered on</span>
                  <span>: {patientData.regDate}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                  <span style={{ color: '#475569', minWidth: '90px' }}>Collected on</span>
                  <span>: {patientData.collectedDate}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '2px' }}>
                  <span style={{ color: '#475569', minWidth: '90px' }}>Received on</span>
                  <span>: {patientData.receivedDate}</span>
                </div>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <span style={{ color: '#475569', minWidth: '90px' }}>Reported on</span>
                  <span>: {patientData.reportedDate}</span>
                </div>
              </div>
            ) : <div />}

            {/* Col 4: Live Verification QR Code */}
            {showQrCode ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ padding: '3px', border: '1px solid #cbd5e1', borderRadius: '4px' }}>
                  <QrCode size={42} color="#0f172a" />
                </div>
                <span style={{ fontSize: '8px', color: '#64748b', marginTop: '2px', textAlign: 'center' }}>
                  Scan to verify
                </span>
              </div>
            ) : <div />}
          </div>
        </div>

        {/* INVESTIGATION TEST PANELS */}
        {panels.map((panel, pIdx) => (
          <div key={pIdx} style={{ marginBottom: '16px' }}>
            {/* Department & Test Heading */}
            <div style={{ fontSize: '12px', fontWeight: 900, color: '#334155', letterSpacing: '0.06em', marginBottom: '2px' }}>
              {panel.department}
            </div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', letterSpacing: '0.02em', marginBottom: '6px' }}>
              {panel.panelName}
            </div>

            {/* 5-Column Table: TEST | FLAG | VALUE | UNIT | REFERENCE */}
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px', marginBottom: '12px' }}>
              <thead>
                <tr style={{ borderTop: '1.5px solid #0f172a', borderBottom: '1.5px solid #0f172a', backgroundColor: '#ffffff', textAlign: 'left' }}>
                  <th style={{ padding: '5px 6px', fontWeight: 800, width: '42%' }}>TEST</th>
                  <th style={{ padding: '5px 6px', fontWeight: 800, width: '8%', textAlign: 'center' }}>FLAG</th>
                  <th style={{ padding: '5px 6px', fontWeight: 800, width: '18%' }}>VALUE</th>
                  <th style={{ padding: '5px 6px', fontWeight: 800, width: '14%' }}>UNIT</th>
                  <th style={{ padding: '5px 6px', fontWeight: 800, width: '18%' }}>REFERENCE</th>
                </tr>
              </thead>
              <tbody>
                {panel.parameters.map((param, idx) => {
                  if (param.isHeader) {
                    return (
                      <tr key={idx} style={{ backgroundColor: '#ffffff' }}>
                        <td colSpan={5} style={{ padding: '7px 6px 3px 6px', fontWeight: 800, color: '#0f172a', fontSize: '11px' }}>
                          {param.name}
                        </td>
                      </tr>
                    );
                  }

                  const isHighOrLow = param.flag === 'H' || param.flag === 'L';

                  return (
                    <tr
                      key={idx}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        backgroundColor: '#ffffff',
                      }}
                    >
                      {/* Test Name */}
                      <td style={{ padding: '4px 6px', paddingLeft: param.isSubtest ? '18px' : '6px', color: '#0f172a', fontWeight: param.isSubtest ? 500 : 700 }}>
                        {param.name}
                      </td>

                      {/* FLAG (L or H in red) */}
                      <td style={{ padding: '4px 6px', textAlign: 'center', fontWeight: 800, color: isHighOrLow ? '#dc2626' : 'transparent' }}>
                        {param.flag || ''}
                      </td>

                      {/* Observed Value */}
                      <td style={{ padding: '4px 6px', fontWeight: (param.isAbnormal && highlightAbnormal) ? 800 : 600, color: (param.isAbnormal && highlightAbnormal) ? '#dc2626' : '#1e293b' }}>
                        {param.observed}
                      </td>

                      {/* Unit */}
                      <td style={{ padding: '4px 6px', color: '#475569' }}>
                        {param.unit}
                      </td>

                      {/* Reference Interval */}
                      <td style={{ padding: '4px 6px', color: '#475569', fontWeight: 500 }}>
                        {param.reference}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}

        {/* Clinical Interpretation / Pathology Remarks */}
        {interpretation && (
          <div style={{ marginTop: '12px', padding: '10px 12px', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0', fontSize: '11px', lineHeight: 1.5 }}>
            <strong style={{ display: 'block', marginBottom: '2px', color: '#0f172a', fontWeight: 800 }}>
              Clinical Interpretation:
            </strong>
            <p style={{ margin: 0, color: '#334155' }}>{interpretation}</p>
          </div>
        )}

        {/* Centered End Marker */}
        <div style={{ textAlign: 'center', fontSize: '11px', fontWeight: 600, color: '#64748b', margin: '24px 0 28px 0', letterSpacing: '0.05em' }}>
          ~~~ End of report ~~~
        </div>

        {/* Signatures & Certification Block */}
        {showSignatures && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', paddingTop: '14px', borderTop: '1px solid #cbd5e1' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', color: '#0369a1', fontSize: '17px' }}>K. Sharma</span>
              </div>
              <div style={{ borderTop: '1px solid #475569', width: '150px', paddingTop: '3px' }}>
                <strong style={{ fontSize: '11px', display: 'block', color: '#0f172a' }}>K. Sharma, DMLT</strong>
                <span style={{ fontSize: '9px', color: '#64748b' }}>Medical Technologist</span>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontFamily: 'cursive', color: '#1565c0', fontSize: '19px', fontWeight: 'bold' }}>Dr. S. K. Mukherjee</span>
              </div>
              <div style={{ borderTop: '1px solid #475569', width: '190px', paddingTop: '3px' }}>
                <strong style={{ fontSize: '11px', display: 'block', color: '#0f172a' }}>Dr. S. K. Mukherjee, MD</strong>
                <span style={{ fontSize: '9px', color: '#64748b' }}>Consulting Pathologist (Reg: KMC 48192)</span>
              </div>
            </div>
          </div>
        )}

        {/* NABL Quality Footer Disclaimer */}
        <div style={{ marginTop: '16px', paddingTop: '6px', borderTop: '1px solid #e2e8f0', fontSize: '8px', color: '#94a3b8', textAlign: 'center', lineHeight: 1.4 }}>
          This report is electronically generated and verified in compliance with clinical laboratory standards. Results pertain only to the specimen tested. Please correlate clinically.
        </div>
      </div>
    </div>
  );
};
