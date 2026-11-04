import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { radiologyApi } from '../../services/api';
import {
  Plus,
  Search,
  CheckCircle2,
  FileText,
  Trash2,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Printer,
  Calendar,
  Clock,
  User,
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
} from 'lucide-react';

export interface USGCase {
  id: string;
  token: string; // e.g. U-01, U-02
  regNo: string;
  date: string;
  time: string;
  patientName: string;
  ageGender: string;
  mobile: string;
  uhid: string;
  investigation: string;
  indication: string;
  sonologist: string;
  refDoctor: string;
  status: 'Waiting for Scan' | 'In Scan' | 'Completed' | 'Cancelled';
  measurements?: {
    liverSpanCm?: string;
    portalVeinMm?: string;
    cbdDiameterMm?: string;
    spleenLengthCm?: string;
    rightKidneyCm?: string;
    leftKidneyCm?: string;
    bladderPvrMl?: string;
    prostateVolumeCc?: string;
  };
  findings?: {
    liver: string;
    gallBladder: string;
    biliaryTree: string;
    spleen: string;
    pancreas: string;
    kidneys: string;
    urinaryBladder: string;
    pelvis: string;
    impression: string;
    recommendations?: string;
  };
}

interface USGWorklistPageProps {
  onNavigateNewBill?: () => void;
}

export const USGWorklistPage: React.FC<USGWorklistPageProps> = ({ onNavigateNewBill }) => {
  const [selectedDate, setSelectedDate] = useState('19/10/2026');
  const [activeTab, setActiveTab] = useState<'ALL' | 'WAITING' | 'IN_SCAN' | 'COMPLETED' | 'CANCELLED'>('ALL');

  const [cases, setCases] = useState<USGCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWorklist = async () => {
    setIsLoading(true);
    try {
      const res = await radiologyApi.getUsgWorklist();
      if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: USGCase[] = res.data.map((c: any) => ({
          id: c.id,
          token: c.dailyCode || 'U-01',
          regNo: c.billNumber,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Today',
          time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
          patientName: c.patient?.fullName || 'Walk-in Patient',
          ageGender: `${c.patient?.ageYears || 30}Y / ${c.patient?.gender || 'Male'}`,
          mobile: c.patient?.mobile || '9876543210',
          uhid: c.uhid || c.patient?.uhid || 'UHID-89201',
          investigation: c.items?.[0]?.testName || 'USG Whole Abdomen & Pelvis',
          indication: c.radiologyStudy?.clinicalHistory || 'Routine Health Check',
          sonologist: c.radiologyStudy?.sonologist || 'Dr. S. K. Verma, MD Radiodiagnosis',
          refDoctor: c.doctor?.name || 'Self Referral',
          status: c.reportStatus === 'Signed Off' ? 'Completed' : c.reportStatus === 'In Progress' ? 'In Scan' : 'Waiting for Scan',
          measurements: c.radiologyStudy?.measurements || {},
          findings: c.radiologyStudy?.findings || {
            liver: 'Normal in size and parenchymal echogenicity. No focal lesion.',
            gallBladder: 'Normal distension and wall thickness. No calculus.',
            biliaryTree: 'CBD normal in caliber.',
            spleen: 'Normal size and echotexture.',
            pancreas: 'Normal appearance.',
            kidneys: 'Normal bilateral kidneys with intact CMD.',
            urinaryBladder: 'Normal distended bladder.',
            pelvis: 'Normal pelvic organs.',
            impression: 'NORMAL SONOGRAPHIC STUDY.',
            recommendations: 'Clinical correlation.',
          }
        }));
        setCases(mapped);
      }
    } catch (err) {
      console.error('Failed to load USG worklist', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorklist();
  }, []);

  const [initialCases] = useState<USGCase[]>([
    {
      id: '1',
      token: 'U-01',
      regNo: '#1001',
      date: '19/10/2026',
      time: '09:30 AM',
      patientName: 'Suresh Mehta',
      ageGender: '52Y / Male',
      mobile: '9823412091',
      uhid: 'UHID-89201',
      investigation: 'USG Whole Abdomen & Pelvis',
      indication: 'Upper abdominal discomfort, dysuria',
      sonologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Rajesh Gupta, MD (Med)',
      status: 'Completed',
      measurements: {
        liverSpanCm: '14.2',
        portalVeinMm: '10.5',
        cbdDiameterMm: '4.2',
        spleenLengthCm: '10.1',
        rightKidneyCm: '10.4 x 4.6',
        leftKidneyCm: '10.7 x 4.8',
        bladderPvrMl: '18',
        prostateVolumeCc: '22',
      },
      findings: {
        liver: 'Normal in size (14.2 cm). Smooth surface contour, homogeneous parenchymal echotexture. No focal mass lesion or intrahepatic biliary dilatation.',
        gallBladder: 'Well distended, wall thickness normal (2.3 mm). No intraluminal calculus, polyp or pericholecystic collection.',
        biliaryTree: 'CBD measures 4.2 mm, within normal limits. Portal vein caliber is normal (10.5 mm).',
        spleen: 'Normal in size (bipolar length 10.1 cm) with homogeneous echotexture. Splenic vein is normal.',
        pancreas: 'Visualized head, body and tail show normal size and parenchymal echogenicity. MPD is not dilated.',
        kidneys: 'Both kidneys are normal in size, shape and location with preserved corticomedullary differentiation. Right kidney: 10.4 x 4.6 cm, Left kidney: 10.7 x 4.8 cm. No calculus, hydronephrosis or cyst.',
        urinaryBladder: 'Well distended with thin, smooth walls (2.6 mm). No intraluminal mass or calculus. Post-void residual urine volume is 18 ml (insignificant).',
        pelvis: 'Prostate is normal in size and echotexture (approx 22 cc). Median lobe is not enlarged.',
        impression: 'NORMAL ULTRASONOGRAPHIC STUDY OF WHOLE ABDOMEN & PELVIS.',
        recommendations: 'Clinical correlation recommended.',
      },
    },
    {
      id: '2',
      token: 'U-02',
      regNo: '#1003',
      date: '19/10/2026',
      time: '10:15 AM',
      patientName: 'Priya Sharma',
      ageGender: '28Y / Female',
      mobile: '9845129381',
      uhid: 'UHID-89208',
      investigation: 'Obstetric USG (Growth & Doppler)',
      indication: 'Routine antenatal scan, 24 weeks gestation',
      sonologist: 'Dr. Neha Agarwal, DMRD',
      refDoctor: 'Dr. Ananya Roy, DGO',
      status: 'Completed',
      measurements: {
        liverSpanCm: 'N/A',
        portalVeinMm: 'N/A',
        cbdDiameterMm: 'N/A',
        spleenLengthCm: 'N/A',
        rightKidneyCm: 'N/A',
        leftKidneyCm: 'N/A',
        bladderPvrMl: 'N/A',
        prostateVolumeCc: 'N/A',
      },
      findings: {
        liver: 'N/A - Obstetric focus.',
        gallBladder: 'N/A.',
        biliaryTree: 'N/A.',
        spleen: 'N/A.',
        pancreas: 'N/A.',
        kidneys: 'N/A.',
        urinaryBladder: 'N/A.',
        pelvis: 'Single live intrauterine fetus in cephalic presentation. Adequate amniotic fluid (AFI: 14.2 cm). Placenta is fundal anterior, Grade-II maturity. Fetal Heart Rate is 144 bpm, regular. Biometry corresponds to 24 weeks 4 days.',
        impression: 'SINGLE LIVE INTRAUTERINE GESTATION OF APPROXIMATELY 24 WEEKS 4 DAYS WITH NORMAL DOPPLER PARAMETERS & ADEQUATE LIQUOR.',
        recommendations: 'Follow up scan for growth around 32-34 weeks or as clinically advised.',
      },
    },
    {
      id: '3',
      token: 'U-03',
      regNo: '#1005',
      date: '19/10/2026',
      time: '11:00 AM',
      patientName: 'Harish Chandra',
      ageGender: '63Y / Male',
      mobile: '9811234900',
      uhid: 'UHID-89215',
      investigation: 'USG KUB & Prostate with PVR',
      indication: 'Poor urinary stream, nocturia, lower back pain',
      sonologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Sunil Bansal, MS MCh',
      status: 'In Scan',
      measurements: {
        liverSpanCm: '',
        portalVeinMm: '',
        cbdDiameterMm: '',
        spleenLengthCm: '',
        rightKidneyCm: '10.2 x 4.5',
        leftKidneyCm: '10.5 x 4.8',
        bladderPvrMl: '65',
        prostateVolumeCc: '42',
      },
      findings: {
        liver: 'N/A - KUB protocol.',
        gallBladder: 'N/A.',
        biliaryTree: 'N/A.',
        spleen: 'N/A.',
        pancreas: 'N/A.',
        kidneys: 'Both kidneys show normal cortical thickness and preserved CMD. No renal calculus or hydronephrosis bilaterally.',
        urinaryBladder: 'Pre-void volume is 320 ml. Bladder wall shows mild trabeculation (wall thickness 4.2 mm). Post-void residual urine volume is 65 ml (significant).',
        pelvis: 'Prostate is moderately enlarged with intravesical median lobe protrusion. Volume measures approx 42 cc.',
        impression: 'GRADE-II BENIGN PROSTATIC HYPERPLASIA (BPH) WITH SIGNIFICANT POST-VOID RESIDUAL URINE (65 ML). NORMAL BILATERAL KIDNEYS.',
        recommendations: 'Urological consultation and PSA serum correlation.',
      },
    },
    {
      id: '4',
      token: 'U-04',
      regNo: '#1008',
      date: '19/10/2026',
      time: '11:45 AM',
      patientName: 'Kavita Joshi',
      ageGender: '35Y / Female',
      mobile: '9712039485',
      uhid: 'UHID-89222',
      investigation: 'USG Upper Abdomen (Gallbladder focus)',
      indication: 'Post-prandial right hypochondriac pain, nausea',
      sonologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Rajesh Gupta, MD (Med)',
      status: 'Waiting for Scan',
      measurements: {
        liverSpanCm: '15.2',
        portalVeinMm: '11.0',
        cbdDiameterMm: '5.1',
        spleenLengthCm: '9.8',
        rightKidneyCm: '10.1 x 4.3',
        leftKidneyCm: '10.3 x 4.4',
        bladderPvrMl: '',
        prostateVolumeCc: '',
      },
      findings: {
        liver: 'Mildly enlarged (15.2 cm) with diffusely increased parenchymal echogenicity and fine attenuation, suggestive of Grade-I Fatty Infiltration.',
        gallBladder: 'Distended. A single, mobile, hyperechoic intraluminal calculus measuring ~9.5 mm is noted in the neck/body junction casting distinct posterior acoustic shadow. Gallbladder wall is not thickened (2.4 mm). No pericholecystic fluid.',
        biliaryTree: 'CBD caliber is 5.1 mm (normal). No calculus in the visualized CBD.',
        spleen: 'Normal in size and parenchymal echogenicity.',
        pancreas: 'Visualized parts appear normal.',
        kidneys: 'Both kidneys are normal.',
        urinaryBladder: 'Normal distension and wall.',
        pelvis: 'Normal pelvic scan.',
        impression: '1. CHOLELITHIASIS — SINGLE 9.5 MM GALLBLADDER CALCULUS WITHOUT SONOGRAPHIC EVIDENCE OF ACUTE CHOLECYSTITIS. 2. GRADE-I FATTY LIVER.',
        recommendations: 'Surgical evaluation and periodic surveillance.',
      },
    },
    {
      id: '5',
      token: 'U-05',
      regNo: '#1012',
      date: '19/10/2026',
      time: '12:30 PM',
      patientName: 'Amit Saxena',
      ageGender: '41Y / Male',
      mobile: '9899120481',
      uhid: 'UHID-89230',
      investigation: 'Thyroid & Neck Soft Tissue',
      indication: 'Palpable anterior neck fullness',
      sonologist: 'Dr. Neha Agarwal, DMRD',
      refDoctor: 'Self / Direct Walk-in',
      status: 'Waiting for Scan',
      measurements: {
        liverSpanCm: '',
        portalVeinMm: '',
        cbdDiameterMm: '',
        spleenLengthCm: '',
        rightKidneyCm: '',
        leftKidneyCm: '',
        bladderPvrMl: '',
        prostateVolumeCc: '',
      },
      findings: {
        liver: 'N/A - Thyroid focus.',
        gallBladder: 'N/A.',
        biliaryTree: 'N/A.',
        spleen: 'N/A.',
        pancreas: 'N/A.',
        kidneys: 'N/A.',
        urinaryBladder: 'N/A.',
        pelvis: 'Both thyroid lobes and isthmus are normal in size and parenchymal echogenicity. No discrete cystic or solid thyroid nodule seen. Vascularity on color Doppler is normal. No pathologically enlarged cervical lymph nodes.',
        impression: 'NORMAL HIGH-RESOLUTION ULTRASONOGRAPHY OF THYROID GLAND AND BILATERAL NECK SPACES.',
        recommendations: 'Serum T3, T4, TSH correlation.',
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sonologistFilter, setSonologistFilter] = useState('ALL');
  const [protocolFilter, setProtocolFilter] = useState('ALL');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<USGCase | null>(null);
  const [previewCase, setPreviewCase] = useState<USGCase | null>(null);
  const [caseToCancel, setCaseToCancel] = useState<USGCase | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Case Register Form
  const [regPatientName, setRegPatientName] = useState('');
  const [regAge, setRegAge] = useState('42');
  const [regGender, setRegGender] = useState('Male');
  const [regMobile, setRegMobile] = useState('');
  const [regInvestigation, setRegInvestigation] = useState('USG Whole Abdomen & Pelvis');
  const [regIndication, setRegIndication] = useState('Routine Health Check');
  const [regSonologist, setRegSonologist] = useState('Dr. S. K. Verma, MD Radiodiagnosis');
  const [regRefDoctor, setRegRefDoctor] = useState('Self / Walk-in');

  // Reporting Console Form State
  const [formLiver, setFormLiver] = useState('');
  const [formGB, setFormGB] = useState('');
  const [formCBD, setFormCBD] = useState('');
  const [formSpleen, setFormSpleen] = useState('');
  const [formPancreas, setFormPancreas] = useState('');
  const [formKidneys, setFormKidneys] = useState('');
  const [formBladder, setFormBladder] = useState('');
  const [formPelvis, setFormPelvis] = useState('');
  const [formImpression, setFormImpression] = useState('');
  const [formRecommendations, setFormRecommendations] = useState('');

  // Biometrics
  const [mLiverSpan, setMLiverSpan] = useState('');
  const [mPV, setMPV] = useState('');
  const [mCBD, setMCBD] = useState('');
  const [mSpleen, setMSpleen] = useState('');
  const [mRK, setMRK] = useState('');
  const [mLK, setMLK] = useState('');
  const [mPVR, setMPVR] = useState('');
  const [mProstate, setMProstate] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenRegister = () => {
    setRegPatientName('');
    setRegMobile('');
    setRegIndication('Abdominal pain / Routine scan');
    setIsRegisterOpen(true);
  };

  const handleSaveRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPatientName.trim()) return;

    const nextTokenNum = cases.length + 1;
    const tokenStr = `U-${nextTokenNum < 10 ? '0' : ''}${nextTokenNum}`;
    const newCase: USGCase = {
      id: String(Date.now()),
      token: tokenStr,
      regNo: `#${1000 + nextTokenNum * 3}`,
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patientName: regPatientName,
      ageGender: `${regAge}Y / ${regGender}`,
      mobile: regMobile || '9876543210',
      uhid: `UHID-${89200 + nextTokenNum}`,
      investigation: regInvestigation,
      indication: regIndication,
      sonologist: regSonologist,
      refDoctor: regRefDoctor,
      status: 'Waiting for Scan',
      measurements: {
        liverSpanCm: '14.0',
        portalVeinMm: '10.2',
        cbdDiameterMm: '4.0',
        spleenLengthCm: '9.8',
        rightKidneyCm: '10.2 x 4.5',
        leftKidneyCm: '10.4 x 4.6',
        bladderPvrMl: '15',
        prostateVolumeCc: '20',
      },
      findings: {
        liver: 'Normal in size and parenchymal echogenicity. No focal lesion.',
        gallBladder: 'Normal distension and wall thickness. No calculus.',
        biliaryTree: 'CBD normal in caliber.',
        spleen: 'Normal size and echotexture.',
        pancreas: 'Normal appearance.',
        kidneys: 'Normal bilateral kidneys with intact CMD.',
        urinaryBladder: 'Normal distended bladder.',
        pelvis: 'Normal pelvic organs.',
        impression: 'NORMAL SONOGRAPHIC STUDY.',
        recommendations: 'Clinical correlation.',
      },
    };

    setCases([newCase, ...cases]);
    setIsRegisterOpen(false);
    showToast(`USG Case registered: ${tokenStr} for ${newCase.patientName}`);
  };

  const handleOpenReportingConsole = (c: USGCase) => {
    setActiveCase(c);
    setFormLiver(c.findings?.liver || 'Normal size, smooth margins, homogeneous parenchymal echotexture.');
    setFormGB(c.findings?.gallBladder || 'Well distended, wall thickness normal. No calculus or sludge.');
    setFormCBD(c.findings?.biliaryTree || 'CBD caliber normal. No dilation.');
    setFormSpleen(c.findings?.spleen || 'Normal size and echotexture.');
    setFormPancreas(c.findings?.pancreas || 'Normal size and echogenicity.');
    setFormKidneys(c.findings?.kidneys || 'Both kidneys normal in size and position with preserved CMD.');
    setFormBladder(c.findings?.urinaryBladder || 'Well distended, smooth thin wall. Insignificant post-void residue.');
    setFormPelvis(c.findings?.pelvis || 'Normal pelvic examination.');
    setFormImpression(c.findings?.impression || 'NORMAL ULTRASONOGRAPHY STUDY.');
    setFormRecommendations(c.findings?.recommendations || 'Clinical correlation recommended.');

    setMLiverSpan(c.measurements?.liverSpanCm || '14.2');
    setMPV(c.measurements?.portalVeinMm || '10.5');
    setMCBD(c.measurements?.cbdDiameterMm || '4.2');
    setMSpleen(c.measurements?.spleenLengthCm || '10.1');
    setMRK(c.measurements?.rightKidneyCm || '10.4 x 4.6');
    setMLK(c.measurements?.leftKidneyCm || '10.7 x 4.8');
    setMPVR(c.measurements?.bladderPvrMl || '18');
    setMProstate(c.measurements?.prostateVolumeCc || '22');

    setIsConsoleOpen(true);
  };

  const handleLoadTemplatePreset = (presetKey: string) => {
    if (presetKey === 'normal_abdomen') {
      setFormLiver('Normal size (14.2 cm), smooth capsular surface, homogeneous parenchymal echotexture. No focal mass lesion or intrahepatic biliary radicle dilatation.');
      setFormGB('Well distended, normal wall thickness (2.3 mm). No intraluminal calculus, mass or pericholecystic collection.');
      setFormCBD('CBD measures 4.2 mm, within normal limits. Portal vein is normal in caliber.');
      setFormSpleen('Normal in size (10.1 cm) with homogeneous echotexture.');
      setFormPancreas('Visualized head, body and tail show normal parenchymal echogenicity. MPD is not dilated.');
      setFormKidneys('Both kidneys are normal in size, shape and location with preserved corticomedullary differentiation. No calculus or hydronephrosis.');
      setFormBladder('Well distended with thin walls. No intraluminal lesion.');
      setFormPelvis('Pelvic organs appear normal for age.');
      setFormImpression('NORMAL ULTRASONOGRAPHIC STUDY OF WHOLE ABDOMEN & PELVIS.');
      setFormRecommendations('Routine follow-up as clinically indicated.');
      showToast('Loaded: Normal Whole Abdomen Template');
    } else if (presetKey === 'fatty_liver_stones') {
      setFormLiver('Mildly enlarged (15.4 cm) with diffusely increased acoustic echogenicity, mild acoustic attenuation, and decreased visualization of peripheral portal venous walls, consistent with Grade-II Fatty Liver.');
      setFormGB('Distended. Multiple small mobile echogenic foci are seen within the lumen, largest measuring ~7.2 mm, casting acoustic shadows. No wall thickening or tenderness.');
      setFormCBD('CBD measures 5.4 mm (normal).');
      setFormSpleen('Normal in size and texture.');
      setFormPancreas('Normal appearance.');
      setFormKidneys('Bilateral normal kidneys.');
      setFormBladder('Normal.');
      setFormPelvis('Normal.');
      setFormImpression('1. CHOLELITHIASIS (MULTIPLE GALLBLADDER CALCULI) WITHOUT CHOLECYSTITIS. 2. GRADE-II HEPATIC STEATOSIS (FATTY LIVER).');
      setFormRecommendations('Surgical opinion for cholelithiasis. Dietary and lifestyle management for fatty liver.');
      showToast('Loaded: Cholelithiasis + Fatty Liver Template');
    } else if (presetKey === 'kub_prostate') {
      setFormKidneys('Right kidney measures 10.3 x 4.5 cm, Left kidney 10.6 x 4.7 cm. Cortical thickness preserved bilaterally. No calculus, hydronephrosis or perinephric collection.');
      setFormBladder('Pre-void volume ~350 ml. Bladder wall thickened (4.5 mm) with fine trabeculation. Post-void residual urine volume is 72 ml (significant).');
      setFormPelvis('Prostate gland is enlarged (volume approx 44 cc) with intravesical median lobe protrusion.');
      setFormImpression('GRADE-II BENIGN PROSTATIC HYPERPLASIA (BPH) WITH SIGNIFICANT POST-VOID RESIDUAL URINE (~72 ML). NORMAL BILATERAL KIDNEYS.');
      setFormRecommendations('Urological evaluation and serum PSA test.');
      showToast('Loaded: KUB & Prostate Template');
    }
  };

  const handleSaveFindings = async (statusToSet: 'Completed' | 'In Scan') => {
    if (!activeCase) return;

    try {
      await radiologyApi.saveUsgFindings(activeCase.id, {
        findings: {
          liver: formLiver,
          gallBladder: formGB,
          biliaryTree: formCBD,
          spleen: formSpleen,
          pancreas: formPancreas,
          kidneys: formKidneys,
          urinaryBladder: formBladder,
          pelvis: formPelvis,
          impression: formImpression,
          recommendations: formRecommendations,
        },
        measurements: {
          liverSpanCm: mLiverSpan,
          portalVeinMm: mPV,
          cbdDiameterMm: mCBD,
          spleenLengthCm: mSpleen,
          rightKidneyCm: mRK,
          leftKidneyCm: mLK,
          bladderPvrMl: mPVR,
          prostateVolumeCc: mProstate,
        },
        status: statusToSet === 'Completed' ? 'Signed Off' : 'In Progress'
      });
      await loadWorklist();
    } catch (err) {
      console.error('Failed to save USG findings to backend API', err);
    }

    setCases((prev) =>
      prev.map((c) =>
        c.id === activeCase.id
          ? {
              ...c,
              status: statusToSet,
              measurements: {
                liverSpanCm: mLiverSpan,
                portalVeinMm: mPV,
                cbdDiameterMm: mCBD,
                spleenLengthCm: mSpleen,
                rightKidneyCm: mRK,
                leftKidneyCm: mLK,
                bladderPvrMl: mPVR,
                prostateVolumeCc: mProstate,
              },
              findings: {
                liver: formLiver,
                gallBladder: formGB,
                biliaryTree: formCBD,
                spleen: formSpleen,
                pancreas: formPancreas,
                kidneys: formKidneys,
                urinaryBladder: formBladder,
                pelvis: formPelvis,
                impression: formImpression,
                recommendations: formRecommendations,
              },
            }
          : c
      )
    );

    setIsConsoleOpen(false);
    showToast(
      statusToSet === 'Completed'
        ? `USG Report finalized & digitally signed for ${activeCase.patientName}`
        : `Draft findings saved for ${activeCase.patientName}`
    );
    setActiveCase(null);
  };

  const handleConfirmCancel = () => {
    if (!caseToCancel) return;
    setCases((prev) =>
      prev.map((c) => (c.id === caseToCancel.id ? { ...c, status: 'Cancelled' } : c))
    );
    showToast(`Case ${caseToCancel.token} cancelled.`);
    setCaseToCancel(null);
  };

  // Counts
  const countAll = cases.length;
  const countWaiting = cases.filter((c) => c.status === 'Waiting for Scan').length;
  const countInScan = cases.filter((c) => c.status === 'In Scan').length;
  const countCompleted = cases.filter((c) => c.status === 'Completed').length;
  const countCancelled = cases.filter((c) => c.status === 'Cancelled').length;

  const filteredCases = cases.filter((c) => {
    // Tab filter
    if (activeTab === 'WAITING' && c.status !== 'Waiting for Scan') return false;
    if (activeTab === 'IN_SCAN' && c.status !== 'In Scan') return false;
    if (activeTab === 'COMPLETED' && c.status !== 'Completed') return false;
    if (activeTab === 'CANCELLED' && c.status !== 'Cancelled') return false;

    // Doctor filter
    if (sonologistFilter !== 'ALL' && !c.sonologist.includes(sonologistFilter)) return false;

    // Protocol filter
    if (protocolFilter !== 'ALL' && !c.investigation.toLowerCase().includes(protocolFilter.toLowerCase()))
      return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        c.patientName.toLowerCase().includes(q) ||
        c.token.toLowerCase().includes(q) ||
        c.regNo.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.investigation.toLowerCase().includes(q);
      if (!match) return false;
    }

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

      {/* Top Header & Date Navigation */}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 className="h1-title" style={{ margin: 0 }}>
              Ultrasound (USG) — Today's cases
            </h2>
            <span
              style={{
                backgroundColor: '#eff6ff',
                color: '#2563eb',
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                border: '1px solid #bfdbfe',
              }}
            >
              PNDT Compliant
            </span>
          </div>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Daily sonography patient queue, examination room flow, biometric measurements, and radiologist sign-off.
          </p>
        </div>

        {/* Date Navigator & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '2px',
            }}
          >
            <button
              type="button"
              onClick={() => showToast('Switched to previous day queue')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#475569',
              }}
              title="Previous Day"
            >
              <ChevronLeft size={16} />
            </button>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '0 8px',
                fontSize: '13px',
                fontWeight: 700,
                color: '#1e293b',
              }}
            >
              <Calendar size={14} color="#2563eb" />
              <span>{selectedDate}</span>
            </div>
            <button
              type="button"
              onClick={() => showToast('Switched to next day queue')}
              style={{
                border: 'none',
                background: 'transparent',
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#475569',
              }}
              title="Next Day"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<RefreshCw size={14} />}
            onClick={() => showToast('Ultrasound queue refreshed')}
          >
            Refresh
          </Button>

          {onNavigateNewBill && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onNavigateNewBill}
              style={{ borderColor: '#22c55e', color: '#15803d' }}
            >
              + New Bill
            </Button>
          )}

          <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenRegister}>
            + Register USG Case
          </Button>
        </div>
      </div>

      {/* Status Filter Tab Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          overflowX: 'auto',
          paddingBottom: '12px',
          marginBottom: '16px',
        }}
      >
        {[
          { key: 'ALL', label: 'All Cases', count: countAll, color: '#334155', bg: '#f1f5f9' },
          { key: 'WAITING', label: 'Waiting for Scan', count: countWaiting, color: '#b45309', bg: '#fef3c7' },
          { key: 'IN_SCAN', label: 'In Scan Room', count: countInScan, color: '#1d4ed8', bg: '#dbeafe' },
          { key: 'COMPLETED', label: 'Completed & Signed', count: countCompleted, color: '#15803d', bg: '#dcfce7' },
          { key: 'CANCELLED', label: 'Cancelled', count: countCancelled, color: '#64748b', bg: '#f1f5f9' },
        ].map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '9999px',
                fontSize: '13px',
                fontWeight: isActive ? 700 : 500,
                border: isActive ? `2px solid ${tab.color}` : '1px solid #e2e8f0',
                backgroundColor: isActive ? tab.bg : '#ffffff',
                color: isActive ? tab.color : '#475569',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: isActive ? tab.color : '#e2e8f0',
                  color: isActive ? '#ffffff' : '#475569',
                  borderRadius: '9999px',
                  padding: '1px 6px',
                  fontSize: '11px',
                  fontWeight: 700,
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter / Search Card */}
      <Card style={{ padding: '14px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search
              size={16}
              style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}
            />
            <input
              type="text"
              placeholder="Search by Patient name, token U1, Reg #, Mobile, or organ scan..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Sonologist:</span>
            <select
              className="form-select"
              value={sonologistFilter}
              onChange={(e) => setSonologistFilter(e.target.value)}
              style={{ width: '210px', fontSize: '13px' }}
            >
              <option value="ALL">All Sonologists</option>
              <option value="Verma">Dr. S. K. Verma, MD</option>
              <option value="Agarwal">Dr. Neha Agarwal, DMRD</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Protocol:</span>
            <select
              className="form-select"
              value={protocolFilter}
              onChange={(e) => setProtocolFilter(e.target.value)}
              style={{ width: '180px', fontSize: '13px' }}
            >
              <option value="ALL">All Studies</option>
              <option value="Abdomen">Whole Abdomen</option>
              <option value="KUB">KUB & Prostate</option>
              <option value="Obstetric">Obstetric / Fetal</option>
              <option value="Thyroid">Thyroid / Small Parts</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Cases Queue Table */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '110px' }}>Token & Reg #</th>
              <th style={{ width: '130px' }}>Time / Status</th>
              <th>Patient Details</th>
              <th>Sonography Protocol & Indication</th>
              <th>Reporting Sonologist</th>
              <th style={{ textAlign: 'center', width: '130px' }}>Exam Status</th>
              <th style={{ textAlign: 'center', width: '270px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No ultrasound cases found matching the specified filters.
                </td>
              </tr>
            ) : (
              filteredCases.map((c) => (
                <tr key={c.id}>
                  {/* Token & Reg */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          fontWeight: 800,
                          fontSize: '11px',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {c.token}
                      </span>
                      <span className="table-cell-mono" style={{ fontSize: '13px' }}>
                        {c.regNo}
                      </span>
                    </div>
                  </td>

                  {/* Time & Clock */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      <Clock size={13} color="#64748b" />
                      <span>{c.time}</span>
                    </div>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>{c.date}</span>
                  </td>

                  {/* Patient Details */}
                  <td>
                    <div className="table-cell-bold" style={{ fontSize: '14px', color: '#0f172a' }}>
                      {c.patientName}
                    </div>
                    <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                      {c.ageGender} • <span>{c.mobile}</span>
                    </div>
                    <div style={{ fontSize: '11px', color: '#94a3b8' }}>{c.uhid}</div>
                  </td>

                  {/* Protocol */}
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
                      {c.investigation}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      Indication: {c.indication}
                    </div>
                  </td>

                  {/* Sonologist */}
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {c.sonologist}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Ref: {c.refDoctor}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ textAlign: 'center' }}>
                    <Badge
                      variant={
                        c.status === 'Completed'
                          ? 'success'
                          : c.status === 'Waiting for Scan'
                          ? 'warning'
                          : c.status === 'In Scan'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>

                  {/* Action Buttons */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                      <Button
                        variant={c.status === 'Completed' ? 'secondary' : 'primary'}
                        size="sm"
                        icon={<Edit3 size={13} />}
                        onClick={() => handleOpenReportingConsole(c)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {c.status === 'Completed' ? 'Edit Findings' : 'Enter Report'}
                      </Button>

                      {c.status === 'Completed' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Eye size={13} />}
                          onClick={() => setPreviewCase(c)}
                          title="View Formatted Report"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          View
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Printer size={13} />}
                        onClick={() => showToast(`Printed Sonography Slip for ${c.patientName}`)}
                        title="Print Barcode / Slip"
                        style={{ minWidth: '32px', padding: '0 8px', flexShrink: 0 }}
                      />

                      {c.status !== 'Cancelled' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          style={{ color: '#dc2626', minWidth: '32px', padding: '0 8px', flexShrink: 0 }}
                          icon={<Trash2 size={13} />}
                          onClick={() => setCaseToCancel(c)}
                          title="Cancel Case"
                        />
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PNDT Compliance Notice Footer */}
      <div
        style={{
          marginTop: '20px',
          padding: '12px 16px',
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '12px',
          color: '#64748b',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <ShieldCheck size={16} color="#15803d" />
          <span>
            <strong>Pre-Natal Diagnostic Techniques (PC-PNDT) Act Compliance:</strong> Sex determination is strictly prohibited and punishable by law. Form-F electronic declarations are auto-archived.
          </span>
        </div>
        <span style={{ fontWeight: 600 }}>Active Radiologist: Dr. S. K. Verma (DMC-29104)</span>
      </div>

      {/* MODAL 1: Register New USG Case */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register Ultrasound (USG) Examination"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRegister}>
              Add to Ultrasound Queue
            </Button>
          </div>
        }
      >
        <form onSubmit={handleSaveRegister} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <Input
            label="Patient Full Name"
            placeholder="e.g. Ramesh Chandra"
            value={regPatientName}
            onChange={(e) => setRegPatientName(e.target.value)}
            required
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Age (Years)"
              type="number"
              value={regAge}
              onChange={(e) => setRegAge(e.target.value)}
              required
            />
            <Select
              label="Gender"
              value={regGender}
              onChange={(e) => setRegGender(e.target.value)}
              options={[
                { label: 'Male', value: 'Male' },
                { label: 'Female', value: 'Female' },
                { label: 'Other', value: 'Other' },
              ]}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Input
              label="Contact Mobile #"
              placeholder="e.g. 9823412091"
              value={regMobile}
              onChange={(e) => setRegMobile(e.target.value)}
            />
            <Select
              label="Study Modality"
              value={regInvestigation}
              onChange={(e) => setRegInvestigation(e.target.value)}
              options={[
                { label: 'USG Whole Abdomen & Pelvis', value: 'USG Whole Abdomen & Pelvis' },
                { label: 'USG KUB & Prostate', value: 'USG KUB & Prostate' },
                { label: 'Obstetric USG (Growth & Doppler)', value: 'Obstetric USG (Growth & Doppler)' },
                { label: 'Thyroid & Neck Soft Tissue', value: 'Thyroid & Neck Soft Tissue' },
                { label: 'Scrotal Ultrasound Doppler', value: 'Scrotal Ultrasound Doppler' },
                { label: 'Bilateral Breast Sonography', value: 'Bilateral Breast Sonography' },
              ]}
            />
          </div>

          <Input
            label="Clinical Indication / History"
            placeholder="e.g. Pain in right lower quadrant, nausea"
            value={regIndication}
            onChange={(e) => setRegIndication(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Consulting Sonologist"
              value={regSonologist}
              onChange={(e) => setRegSonologist(e.target.value)}
              options={[
                { label: 'Dr. S. K. Verma, MD Radiodiagnosis', value: 'Dr. S. K. Verma, MD Radiodiagnosis' },
                { label: 'Dr. Neha Agarwal, DMRD', value: 'Dr. Neha Agarwal, DMRD' },
              ]}
            />
            <Input
              label="Referring Doctor"
              placeholder="e.g. Dr. Rajesh Gupta"
              value={regRefDoctor}
              onChange={(e) => setRegRefDoctor(e.target.value)}
            />
          </div>
        </form>
      </Modal>

      {/* MODAL 2: High-Productivity Sonography Reporting Console */}
      {activeCase && (
        <Modal
          isOpen={isConsoleOpen}
          onClose={() => setIsConsoleOpen(false)}
          title={`USG Diagnostic Reporting Console: ${activeCase.patientName} (${activeCase.token})`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Reporting Doctor: <strong>{activeCase.sonologist}</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="secondary" onClick={() => handleSaveFindings('In Scan')}>
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  icon={<CheckCircle2 size={16} />}
                  onClick={() => handleSaveFindings('Completed')}
                >
                  Verify & Sign Off Report
                </Button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '6px' }}>
            {/* Patient Header Banner */}
            <div
              style={{
                backgroundColor: '#f8fafc',
                border: '1px solid #e2e8f0',
                padding: '12px 16px',
                borderRadius: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div>
                <span style={{ fontWeight: 700, fontSize: '15px', color: '#0f172a' }}>
                  {activeCase.patientName}
                </span>{' '}
                <span style={{ color: '#64748b', fontSize: '13px' }}>
                  ({activeCase.ageGender} • {activeCase.regNo} • {activeCase.token})
                </span>
                <div style={{ fontSize: '12px', color: '#334155', marginTop: '2px' }}>
                  <strong>Study:</strong> {activeCase.investigation} | <strong>History:</strong> {activeCase.indication}
                </div>
              </div>

              {/* Template Quick Loader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#2563eb" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#1e40af' }}>1-Click Template:</span>
                <select
                  className="form-select"
                  onChange={(e) => {
                    if (e.target.value) handleLoadTemplatePreset(e.target.value);
                  }}
                  defaultValue=""
                  style={{ width: '220px', fontSize: '12px', padding: '4px 8px' }}
                >
                  <option value="" disabled>
                    Select Normal Template...
                  </option>
                  <option value="normal_abdomen">Normal Whole Abdomen (Male/Female)</option>
                  <option value="fatty_liver_stones">Grade-II Fatty Liver + Cholelithiasis</option>
                  <option value="kub_prostate">KUB & BPH with Post-Void Residue</option>
                </select>
              </div>
            </div>

            {/* Quantitative Biometric Measurements Grid */}
            <div
              style={{
                backgroundColor: '#eff6ff',
                border: '1px solid #bfdbfe',
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#1e40af', marginBottom: '8px' }}>
                Key Biometric Dimensions & Volumetry
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Liver Span (cm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mLiverSpan}
                    onChange={(e) => setMLiverSpan(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>CBD Caliber (mm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mCBD}
                    onChange={(e) => setMCBD(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Spleen Length (cm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mSpleen}
                    onChange={(e) => setMSpleen(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Right Kidney (cm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mRK}
                    onChange={(e) => setMRK(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Left Kidney (cm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mLK}
                    onChange={(e) => setMLK(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>PVR Volume (ml)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mPVR}
                    onChange={(e) => setMPVR(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Prostate Vol (cc)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mProstate}
                    onChange={(e) => setMProstate(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
              </div>
            </div>

            {/* Organ Sections Accordion / Grid */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                  1. Liver (Parenchyma, Capsular Margin, Vascularity)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={formLiver}
                  onChange={(e) => setFormLiver(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    2. Gall Bladder (Wall, Lumen, Calculus)
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formGB}
                    onChange={(e) => setFormGB(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    3. Biliary Ducts & Portal Vein
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formCBD}
                    onChange={(e) => setFormCBD(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    4. Spleen & Splenic Vein
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formSpleen}
                    onChange={(e) => setFormSpleen(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    5. Pancreas & Pancreatic Duct
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formPancreas}
                    onChange={(e) => setFormPancreas(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                  6. Kidneys (Bilateral Corticomedullary Distinction, Pelvicalyceal System)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={formKidneys}
                  onChange={(e) => setFormKidneys(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    7. Urinary Bladder (Pre/Post Void)
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formBladder}
                    onChange={(e) => setFormBladder(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
                <div>
                  <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                    8. Pelvis / Reproductive Organs / Retroperitoneum
                  </label>
                  <textarea
                    className="form-input"
                    rows={2}
                    value={formPelvis}
                    onChange={(e) => setFormPelvis(e.target.value)}
                    style={{ fontSize: '13px' }}
                  />
                </div>
              </div>

              {/* Highlighted Clinical Impression Box */}
              <div
                style={{
                  backgroundColor: '#fefce8',
                  border: '1px solid #fef08a',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <label className="form-label" style={{ fontWeight: 800, color: '#854d0e', fontSize: '13px' }}>
                  CLINICAL IMPRESSION & DIAGNOSIS (UPPERCASE)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ borderColor: '#fde047', fontWeight: 700, color: '#713f12', fontSize: '13px' }}
                  value={formImpression}
                  onChange={(e) => setFormImpression(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>
                  Recommendations / Suggested Follow-up
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={formRecommendations}
                  onChange={(e) => setFormRecommendations(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: High-Fidelity Formatted Sonography Report Preview */}
      {previewCase && (
        <Modal
          isOpen={!!previewCase}
          onClose={() => setPreviewCase(null)}
          title={`Diagnostic Sonography Report — ${previewCase.patientName}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                icon={<Printer size={15} />}
                onClick={() => showToast('Printing clinical report...')}
              >
                Print Official Report
              </Button>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button
                  variant="secondary"
                  icon={<Download size={15} />}
                  onClick={() => showToast('Report PDF downloaded.')}
                >
                  Download PDF
                </Button>
                <Button variant="primary" onClick={() => setPreviewCase(null)}>
                  Close
                </Button>
              </div>
            </div>
          }
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              padding: '24px',
              fontFamily: 'Inter, system-ui, sans-serif',
              color: '#0f172a',
            }}
          >
            {/* Report Letterhead Header */}
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#1e3a8a' }}>
                  METROPOLITAN DIAGNOSTIC IMAGING & SONOGRAPHY CENTRE
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  PNDT Reg: DL-PNDT/2019/914 • ISO 9001:2015 Certified Center
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                <div>24/7 Helpline: +91 11 4982 0000</div>
                <div>support@metroscan.com</div>
              </div>
            </div>

            {/* Patient Demographic Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                backgroundColor: '#f8fafc',
                padding: '10px 14px',
                borderRadius: '6px',
                fontSize: '12px',
                gap: '6px',
                marginBottom: '16px',
              }}
            >
              <div><strong>Patient Name:</strong> {previewCase.patientName}</div>
              <div><strong>Reg No / Token:</strong> {previewCase.regNo} ({previewCase.token})</div>
              <div><strong>Age / Gender:</strong> {previewCase.ageGender}</div>
              <div><strong>Exam Date & Time:</strong> {previewCase.date} {previewCase.time}</div>
              <div><strong>Referred By:</strong> {previewCase.refDoctor}</div>
              <div><strong>Examination:</strong> {previewCase.investigation}</div>
            </div>

            {/* Structured Findings */}
            <div style={{ fontSize: '13px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div><strong>LIVER:</strong> {previewCase.findings?.liver}</div>
              <div><strong>GALLBLADDER:</strong> {previewCase.findings?.gallBladder}</div>
              <div><strong>BILIARY SYSTEM:</strong> {previewCase.findings?.biliaryTree}</div>
              <div><strong>SPLEEN:</strong> {previewCase.findings?.spleen}</div>
              <div><strong>PANCREAS:</strong> {previewCase.findings?.pancreas}</div>
              <div><strong>KIDNEYS:</strong> {previewCase.findings?.kidneys}</div>
              <div><strong>URINARY BLADDER:</strong> {previewCase.findings?.urinaryBladder}</div>
              <div><strong>PELVIS:</strong> {previewCase.findings?.pelvis}</div>

              {/* Bold Impression */}
              <div
                style={{
                  backgroundColor: '#f0f9ff',
                  borderLeft: '4px solid #0284c7',
                  padding: '12px',
                  borderRadius: '4px',
                  marginTop: '10px',
                }}
              >
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#0369a1' }}>IMPRESSION:</div>
                <div style={{ fontWeight: 700, color: '#0c4a6e', marginTop: '2px' }}>
                  {previewCase.findings?.impression}
                </div>
                {previewCase.findings?.recommendations && (
                  <div style={{ fontSize: '12px', color: '#0369a1', marginTop: '4px' }}>
                    <strong>Note:</strong> {previewCase.findings?.recommendations}
                  </div>
                )}
              </div>
            </div>

            {/* Doctor Seal & Signature Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginTop: '28px',
                borderTop: '1px solid #e2e8f0',
                paddingTop: '14px',
              }}
            >
              <div style={{ fontSize: '10px', color: '#94a3b8', maxWidth: '300px' }}>
                This is a digitally verified sonography report under Medical Council norms. Sonography findings are operator dependent and represent observations at the time of scan.
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Caveat, cursive, Brush Script MT, sans-serif',
                    fontSize: '22px',
                    color: '#1e3a8a',
                    fontWeight: 700,
                  }}
                >
                  Dr. S. K. Verma
                </div>
                <div style={{ borderTop: '1px solid #0f172a', width: '180px', margin: '4px auto' }} />
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                  Dr. S. K. Verma, MD
                </div>
                <div style={{ fontSize: '11px', color: '#475569' }}>
                  DMC Reg No: 29104 • Chief Radiologist
                </div>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!caseToCancel}
        onClose={() => setCaseToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Cancel Sonography Case"
        message={`Are you sure you want to cancel the ultrasound case for ${caseToCancel?.patientName} (${caseToCancel?.token})?`}
        confirmLabel="Yes, Cancel Case"
        variant="danger"
      />
    </div>
  );
};
