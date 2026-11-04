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
  ShieldCheck,
  Download,
  Share2,
  Sparkles,
  Zap,
  Layers,
} from 'lucide-react';

export interface XRayCase {
  id: string;
  token: string; // e.g. X-01, X-02
  regNo: string;
  date: string;
  time: string;
  patientName: string;
  ageGender: string;
  mobile: string;
  uhid: string;
  viewRegion: string;
  indication: string;
  filmsUsed: string;
  exposureFactor: string;
  radiologist: string;
  refDoctor: string;
  status: 'Waiting for Exposure' | 'Exposure Captured' | 'Reported' | 'Cancelled';
  technical?: {
    kvp: string;
    mas: string;
    sidCm: string;
    projections: string;
    filmsCount: string;
  };
  findings?: {
    technical: string;
    bonyCage: string;
    softTissues: string;
    impression: string;
    recommendations?: string;
  };
}

interface XRayWorklistPageProps {
  onNavigateNewBill?: () => void;
}

export const XRayWorklistPage: React.FC<XRayWorklistPageProps> = ({ onNavigateNewBill }) => {
  const [selectedDate, setSelectedDate] = useState('19/10/2026');
  const [activeTab, setActiveTab] = useState<'ALL' | 'WAITING' | 'CAPTURED' | 'REPORTED' | 'CANCELLED'>('ALL');

  const [cases, setCases] = useState<XRayCase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadWorklist = async () => {
    setIsLoading(true);
    try {
      const res = await radiologyApi.getXrayWorklist();
      if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: XRayCase[] = res.data.map((c: any) => ({
          id: c.id,
          token: c.dailyCode || 'X-01',
          regNo: c.billNumber,
          date: c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Today',
          time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '09:00 AM',
          patientName: c.patient?.fullName || 'Walk-in Patient',
          ageGender: `${c.patient?.ageYears || 30}Y / ${c.patient?.gender || 'Male'}`,
          mobile: c.patient?.mobile || '9876543210',
          uhid: c.uhid || c.patient?.uhid || 'UHID-78190',
          viewRegion: c.items?.[0]?.testName || 'Chest PA View',
          indication: c.radiologyStudy?.clinicalHistory || 'Routine Checkup',
          filmsUsed: '1 Film (14x17 Fuji DR)',
          exposureFactor: '75 kVp, 16 mAs',
          radiologist: c.radiologyStudy?.sonologist || 'Dr. S. K. Verma, MD Radiodiagnosis',
          refDoctor: c.doctor?.name || 'Self Referral',
          status: c.reportStatus === 'Signed Off' ? 'Reported' : c.reportStatus === 'In Progress' ? 'Exposure Captured' : 'Waiting for Exposure',
          technical: {
            kvp: '75',
            mas: '16',
            sidCm: '180',
            projections: c.items?.[0]?.testName || 'Posteroanterior (PA) View',
            filmsCount: '1 (14x17 inch)'
          },
          findings: c.radiologyStudy?.findings || {
            technical: 'Posteroanterior radiograph demonstrates adequate inspiratory effort and exposure.',
            bonyCage: 'Both lung fields are clear. No active infiltration. Bilateral CP angles clear.',
            softTissues: 'Cardiac silhouette and CTR are within normal limits. Mediastinum unremarkable.',
            impression: 'NORMAL CHEST RADIOGRAPH. NO EVIDENCE OF ACTIVE CARDIO-PULMONARY LESION.',
            recommendations: 'Clinical correlation recommended.'
          }
        }));
        setCases(mapped);
      }
    } catch (err) {
      console.error('Failed to load X-Ray worklist', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWorklist();
  }, []);

  const [initialCases] = useState<XRayCase[]>([
    {
      id: '1',
      token: 'X-01',
      regNo: '#1003',
      date: '19/10/2026',
      time: '09:45 AM',
      patientName: 'Kavita Singhal',
      ageGender: '34Y / Female',
      mobile: '9812034912',
      uhid: 'UHID-78190',
      viewRegion: 'Chest PA View',
      indication: 'Routine pre-employment checkup, persistent dry cough',
      filmsUsed: '1 Film (14x17 Fuji DR)',
      exposureFactor: '75 kVp, 16 mAs',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Rajesh Gupta, MD (Med)',
      status: 'Reported',
      technical: {
        kvp: '75',
        mas: '16',
        sidCm: '180',
        projections: 'Posteroanterior (PA) View',
        filmsCount: '1 (14x17 inch)',
      },
      findings: {
        technical: 'Posteroanterior radiograph of the chest demonstrates adequate inspiratory effort and exposure centering. Trachea is central.',
        bonyCage: 'Both lung fields are normally aerated and clear. No focal parenchymal consolidation, cavitation, nodule or active Koch infiltrate seen. Both costophrenic angles and dome of diaphragms are clear and sharp.',
        softTissues: 'Cardiac silhouette is normal in shape and size with cardiothoracic ratio (CTR) within normal limits (< 0.50). Mediastinal contours and hila appear normal. Rib cage and thoracic spine are unremarkable.',
        impression: 'NORMAL CHEST RADIOGRAPH (PA VIEW). NO EVIDENCE OF ACTIVE CARDIO-PULMONARY LESION.',
        recommendations: 'Clinical correlation recommended.',
      },
    },
    {
      id: '2',
      token: 'X-02',
      regNo: '#1006',
      date: '19/10/2026',
      time: '10:30 AM',
      patientName: 'Mohan Lal',
      ageGender: '55Y / Male',
      mobile: '9845129384',
      uhid: 'UHID-78195',
      viewRegion: 'Lumbosacral Spine AP & Lateral (2 Views)',
      indication: 'Low back pain radiating to left gluteal region, stiffness',
      filmsUsed: '2 Films (10x12 Carestream)',
      exposureFactor: '82 kVp, 32 mAs',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Sunil Bansal, MS (Ortho)',
      status: 'Reported',
      technical: {
        kvp: '82',
        mas: '32',
        sidCm: '100',
        projections: 'Anteroposterior & Lateral',
        filmsCount: '2 (10x12 inch)',
      },
      findings: {
        technical: 'Digital radiography projections of lumbosacral spine show preserved vertebral alignment without curvature tilt.',
        bonyCage: 'Mild anterior marginal osteophytes noted at L4 and L5 vertebral bodies. Intervertebral disc space is mildly reduced at L4-L5 level. Pedicles, spinous processes, and sacroiliac joints are intact. No spondylolysis or spondylolisthesis.',
        softTissues: 'Paravertebral soft tissue shadows are normal. Psoas muscle margins are well visualized.',
        impression: 'LUMBAR SPONDYLOSIS WITH MILD L4-L5 INTERVERTEBRAL DISC SPACE NARROWING. NO LISTHESIS OR ACUTE BONY INJURY.',
        recommendations: 'Physiotherapy and MRI correlation if radicular neurological deficits progress.',
      },
    },
    {
      id: '3',
      token: 'X-03',
      regNo: '#1009',
      date: '19/10/2026',
      time: '11:15 AM',
      patientName: 'Rajesh Kumar',
      ageGender: '42Y / Male',
      mobile: '9820194821',
      uhid: 'UHID-78201',
      viewRegion: 'Right Knee Joint AP & Lateral',
      indication: 'Right knee pain, mild crepitus upon squatting',
      filmsUsed: '1 Film (10x12 Fuji DR)',
      exposureFactor: '62 kVp, 10 mAs',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      refDoctor: 'Dr. Sunil Bansal, MS (Ortho)',
      status: 'Exposure Captured',
      technical: {
        kvp: '62',
        mas: '10',
        sidCm: '100',
        projections: 'AP & Lateral Projections',
        filmsCount: '1 (10x12 inch)',
      },
      findings: {
        technical: 'Standard non-weight bearing digital projections of the right knee.',
        bonyCage: 'Mild reduction of the medial tibiofemoral joint space. Lateral joint space and patellofemoral articulation appear preserved. Subtle tibial spine sharpening noted. No discrete fracture, subchondral cyst, or loose body.',
        softTissues: 'No significant suprapatellar pouch effusion or periarticular soft tissue calcification.',
        impression: 'EARLY PRIMARY OSTEOARTHRITIS RIGHT KNEE JOINT (GRADE-I/II KELLGREN-LAWRENCE). NO FRACTURE.',
        recommendations: 'Weight-bearing views and clinical correlation.',
      },
    },
    {
      id: '4',
      token: 'X-04',
      regNo: '#1014',
      date: '19/10/2026',
      time: '12:00 PM',
      patientName: 'Sunita Devi',
      ageGender: '38Y / Female',
      mobile: '9718290199',
      uhid: 'UHID-78208',
      viewRegion: 'Paranasal Sinuses (PNS Water\'s View)',
      indication: 'Facial fullness, morning headache, purulent rhinorrhea',
      filmsUsed: '1 Film (8x10 Fuji)',
      exposureFactor: '68 kVp, 12 mAs',
      radiologist: 'Dr. Neha Agarwal, DMRD',
      refDoctor: 'Dr. Anil Verma, MS (ENT)',
      status: 'Waiting for Exposure',
      technical: {
        kvp: '68',
        mas: '12',
        sidCm: '100',
        projections: 'Water\'s (Occipitomental) View',
        filmsCount: '1 (8x10 inch)',
      },
      findings: {
        technical: 'Standard Water\'s projection of paranasal sinuses.',
        bonyCage: 'Right maxillary antrum shows mucosal thickening and diffuse haziness with an air-fluid level. Left maxillary sinus is normally aerated. Frontal and ethmoidal sinuses appear clear without mucosal hypertrophy.',
        softTissues: 'Nasal septum shows mild deviation to the left. Nasal turbinates are hypertrophied on the right.',
        impression: 'RIGHT MAXILLARY SINUSITIS WITH FLUID LEVEL. MILD DEVIATED NASAL SEPTUM (DNS TO LEFT).',
        recommendations: 'ENT consultation and medical management.',
      },
    },
    {
      id: '5',
      token: 'X-05',
      regNo: '#1018',
      date: '19/10/2026',
      time: '12:45 PM',
      patientName: 'Tarun Malhotra',
      ageGender: '22Y / Male',
      mobile: '9899120485',
      uhid: 'UHID-78215',
      viewRegion: 'Right Wrist & Forearm AP & Lateral',
      indication: 'Fall while playing cricket, painful swollen right wrist',
      filmsUsed: '1 Film (8x10 Fuji)',
      exposureFactor: '58 kVp, 8 mAs',
      radiologist: 'Dr. S. K. Verma, MD Radiodiagnosis',
      refDoctor: 'Dr. Sunil Bansal, MS (Ortho)',
      status: 'Waiting for Exposure',
      technical: {
        kvp: '58',
        mas: '8',
        sidCm: '100',
        projections: 'AP & Lateral',
        filmsCount: '1 (8x10 inch)',
      },
      findings: {
        technical: 'AP and Lateral radiographs of the right wrist.',
        bonyCage: 'Linear cortical breach noted at the distal metaphyseal region of the radius ~1.5 cm proximal to the articular surface. Minimal dorsal tilt (~5 degrees). Radiocarpal and distal radioulnar joints are congruent. Scaphoid and carpal bones intact.',
        softTissues: 'Pronator fat stripe is obliterated with prominent dorsal soft tissue swelling.',
        impression: 'UNDISPLACED FRACTURE OF DISTAL RADIUS METAPHYSIS (COLLES\' TYPE FRACTURE). NO CARPAL DISLOCATION.',
        recommendations: 'Orthopedic reduction/splinting and follow-up radiograph.',
      },
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [radiologistFilter, setRadiologistFilter] = useState('ALL');
  const [regionFilter, setRegionFilter] = useState('ALL');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<XRayCase | null>(null);
  const [previewCase, setPreviewCase] = useState<XRayCase | null>(null);
  const [caseToCancel, setCaseToCancel] = useState<XRayCase | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Case Register Form
  const [regPatientName, setRegPatientName] = useState('');
  const [regAge, setRegAge] = useState('32');
  const [regGender, setRegGender] = useState('Male');
  const [regMobile, setRegMobile] = useState('');
  const [regViewRegion, setRegViewRegion] = useState('Chest PA View');
  const [regIndication, setRegIndication] = useState('Routine screening / Chest discomfort');
  const [regFilms, setRegFilms] = useState('1 Film (14x17 Fuji DR)');
  const [regRadiologist, setRegRadiologist] = useState('Dr. S. K. Verma, MD Radiodiagnosis');
  const [regRefDoctor, setRegRefDoctor] = useState('Self / Walk-in');

  // Reporting Console Form State
  const [editTechnical, setEditTechnical] = useState('');
  const [editBonyCage, setEditBonyCage] = useState('');
  const [editSoftTissues, setEditSoftTissues] = useState('');
  const [editImpression, setEditImpression] = useState('');
  const [editRecommendations, setEditRecommendations] = useState('');

  // Exposure inputs
  const [mKvp, setMKvp] = useState('75');
  const [mMas, setMMas] = useState('16');
  const [mSid, setMSid] = useState('180');
  const [mFilmsCount, setMFilmsCount] = useState('1 Film (14x17)');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenRegister = () => {
    setRegPatientName('');
    setRegMobile('');
    setRegIndication('Chest pain / Trauma / Cough');
    setIsRegisterOpen(true);
  };

  const handleSaveRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regPatientName.trim()) return;

    const nextTokenNum = cases.length + 1;
    const tokenStr = `X-${nextTokenNum < 10 ? '0' : ''}${nextTokenNum}`;
    const newCase: XRayCase = {
      id: String(Date.now()),
      token: tokenStr,
      regNo: `#${1000 + nextTokenNum * 4}`,
      date: selectedDate,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      patientName: regPatientName,
      ageGender: `${regAge}Y / ${regGender}`,
      mobile: regMobile || '9876543210',
      uhid: `UHID-${78200 + nextTokenNum}`,
      viewRegion: regViewRegion,
      indication: regIndication,
      filmsUsed: regFilms,
      exposureFactor: `${mKvp} kVp, ${mMas} mAs`,
      radiologist: regRadiologist,
      refDoctor: regRefDoctor,
      status: 'Waiting for Exposure',
      technical: {
        kvp: mKvp,
        mas: mMas,
        sidCm: mSid,
        projections: regViewRegion,
        filmsCount: regFilms,
      },
      findings: {
        technical: 'Standard digital radiography projections with adequate exposure factors.',
        bonyCage: 'Bony architecture is preserved. No fracture, dislocation or focal osteolytic lesion.',
        softTissues: 'Surrounding soft tissue shadow is within normal limits.',
        impression: 'NORMAL RADIOGRAPHIC STUDY.',
        recommendations: 'Clinical correlation recommended.',
      },
    };

    setCases([newCase, ...cases]);
    setIsRegisterOpen(false);
    showToast(`X-Ray Case registered: ${tokenStr} for ${newCase.patientName}`);
  };

  const handleOpenReportingConsole = (c: XRayCase) => {
    setActiveCase(c);
    setEditTechnical(c.findings?.technical || 'Digital radiography projection demonstrates adequate exposure and centering.');
    setEditBonyCage(c.findings?.bonyCage || 'Skeletal framework appears intact. No fracture or focal bone lesion.');
    setEditSoftTissues(c.findings?.softTissues || 'Surrounding soft tissue shadow is normal.');
    setEditImpression(c.findings?.impression || 'NORMAL RADIOGRAPHIC STUDY.');
    setEditRecommendations(c.findings?.recommendations || 'Clinical correlation recommended.');

    setMKvp(c.technical?.kvp || '75');
    setMMas(c.technical?.mas || '16');
    setMSid(c.technical?.sidCm || '180');
    setMFilmsCount(c.technical?.filmsCount || '1 Film (14x17)');

    setIsConsoleOpen(true);
  };

  const handleLoadTemplatePreset = (presetKey: string) => {
    if (presetKey === 'chest_normal') {
      setEditTechnical('Posteroanterior radiograph of the chest demonstrates adequate inspiratory effort and exposure centering. Trachea is midline.');
      setEditBonyCage('Both lung fields are clear and normally aerated. No focal consolidation, nodule, cavitation or pleural thickening. Both costophrenic angles and hemidiaphragms are sharp.');
      setEditSoftTissues('Cardiothoracic ratio (CTR) is normal (< 0.50). Mediastinal contours, hila and aortic knob appear normal. Bony thorax and soft tissues are unremarkable.');
      setEditImpression('NORMAL CHEST RADIOGRAPH (PA VIEW). NO ACTIVE CARDIOPULMONARY DISEASE.');
      setEditRecommendations('Routine follow-up.');
      showToast('Loaded: Normal Chest PA Template');
    } else if (presetKey === 'ls_spine_spondylosis') {
      setEditTechnical('AP and Lateral digital radiographs of the lumbosacral spine.');
      setEditBonyCage('Normal lumbar lordosis is maintained. Mild anterior marginal osteophytosis is seen at L4 and L5 vertebral bodies. Intervertebral disc space is mildly narrowed at L4-L5 level. Pedicles and posterior elements are intact. No listhesis or compression fracture.');
      setEditSoftTissues('Paravertebral soft tissues are normal. Sacroiliac joints appear preserved.');
      setEditImpression('MILD LUMBAR SPONDYLOSIS WITH L4-L5 DISC SPACE NARROWING. NO SPONDYLOLISTHESIS.');
      setEditRecommendations('Physiotherapy and clinical correlation.');
      showToast('Loaded: LS Spine Spondylosis Template');
    } else if (presetKey === 'knee_osteoarthritis') {
      setEditTechnical('Anteroposterior and Lateral digital projections of the knee.');
      setEditBonyCage('Narrowing of the medial tibiofemoral joint space is noted with subtle subchondral sclerosis. Lateral joint space is maintained. Sharp tibial spines. Patellofemoral alignment is normal. No fracture or loose body.');
      setEditSoftTissues('No significant joint effusion.');
      setEditImpression('GRADE-II OSTEOARTHRITIS OF THE KNEE JOINT WITH MEDIAL COMPARTMENT PREDOMINANCE.');
      setEditRecommendations('Weight bearing views and orthopedic consultation.');
      showToast('Loaded: Knee Joint OA Template');
    } else if (presetKey === 'pns_sinusitis') {
      setEditTechnical('Standard Water\'s (Occipitomental) view of paranasal sinuses.');
      setEditBonyCage('Maxillary sinus demonstrates mucosal thickening and diffuse opacity with an air-fluid level. Frontal and ethmoidal air cells appear clear. Orbital margins are intact.');
      setEditSoftTissues('Nasal septum shows mild deviation.');
      setEditImpression('MAXILLARY SINUSITIS WITH AIR-FLUID LEVEL. MILD DEVIATED NASAL SEPTUM.');
      setEditRecommendations('ENT evaluation.');
      showToast('Loaded: PNS Sinusitis Template');
    }
  };

  const handleSaveReport = async (statusToSet: 'Reported' | 'Exposure Captured') => {
    if (!activeCase) return;

    try {
      await radiologyApi.saveXrayFindings(activeCase.id, {
        findings: {
          technical: editTechnical,
          bonyCage: editBonyCage,
          softTissues: editSoftTissues,
          impression: editImpression,
          recommendations: editRecommendations,
        },
        technical: {
          kvp: mKvp,
          mas: mMas,
          sidCm: mSid,
          projections: activeCase.viewRegion,
          filmsCount: mFilmsCount,
        },
        status: statusToSet === 'Reported' ? 'Signed Off' : 'In Progress'
      });
      await loadWorklist();
    } catch (err) {
      console.error('Failed to save X-Ray findings to backend API', err);
    }

    setCases((prev) =>
      prev.map((c) =>
        c.id === activeCase.id
          ? {
              ...c,
              status: statusToSet,
              technical: {
                kvp: mKvp,
                mas: mMas,
                sidCm: mSid,
                projections: c.viewRegion,
                filmsCount: mFilmsCount,
              },
              findings: {
                technical: editTechnical,
                bonyCage: editBonyCage,
                softTissues: editSoftTissues,
                impression: editImpression,
                recommendations: editRecommendations,
              },
            }
          : c
      )
    );

    setIsConsoleOpen(false);
    showToast(
      statusToSet === 'Reported'
        ? `X-Ray Report finalized & signed off for ${activeCase.patientName}`
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
  const countWaiting = cases.filter((c) => c.status === 'Waiting for Exposure').length;
  const countCaptured = cases.filter((c) => c.status === 'Exposure Captured').length;
  const countReported = cases.filter((c) => c.status === 'Reported').length;
  const countCancelled = cases.filter((c) => c.status === 'Cancelled').length;

  const filteredCases = cases.filter((c) => {
    // Tab filter
    if (activeTab === 'WAITING' && c.status !== 'Waiting for Exposure') return false;
    if (activeTab === 'CAPTURED' && c.status !== 'Exposure Captured') return false;
    if (activeTab === 'REPORTED' && c.status !== 'Reported') return false;
    if (activeTab === 'CANCELLED' && c.status !== 'Cancelled') return false;

    // Radiologist filter
    if (radiologistFilter !== 'ALL' && !c.radiologist.includes(radiologistFilter)) return false;

    // Region filter
    if (regionFilter !== 'ALL' && !c.viewRegion.toLowerCase().includes(regionFilter.toLowerCase()))
      return false;

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const match =
        c.patientName.toLowerCase().includes(q) ||
        c.token.toLowerCase().includes(q) ||
        c.regNo.toLowerCase().includes(q) ||
        c.mobile.includes(q) ||
        c.viewRegion.toLowerCase().includes(q);
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
              Digital X-ray — Today's cases
            </h2>
            <span
              style={{
                backgroundColor: '#f0fdf4',
                color: '#15803d',
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '9999px',
                border: '1px solid #bbf7d0',
              }}
            >
              AERB Compliant • DR / CR
            </span>
          </div>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Daily radiography patient queue, exposure room workflow, film inventory, and radiologist reporting.
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
            onClick={() => showToast('Radiography queue refreshed')}
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
            + Register X-Ray Case
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
          { key: 'WAITING', label: 'Waiting for Exposure', count: countWaiting, color: '#b45309', bg: '#fef3c7' },
          { key: 'CAPTURED', label: 'Exposure Captured', count: countCaptured, color: '#1d4ed8', bg: '#dbeafe' },
          { key: 'REPORTED', label: 'Reported & Signed', count: countReported, color: '#15803d', bg: '#dcfce7' },
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
              placeholder="Search by Patient name, token X1, Reg #, Mobile, or view projection..."
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ paddingLeft: '36px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Radiologist:</span>
            <select
              className="form-select"
              value={radiologistFilter}
              onChange={(e) => setRadiologistFilter(e.target.value)}
              style={{ width: '210px', fontSize: '13px' }}
            >
              <option value="ALL">All Radiologists</option>
              <option value="Verma">Dr. S. K. Verma, MD</option>
              <option value="Agarwal">Dr. Neha Agarwal, DMRD</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>Region:</span>
            <select
              className="form-select"
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              style={{ width: '180px', fontSize: '13px' }}
            >
              <option value="ALL">All Regions</option>
              <option value="Chest">Chest & Thorax</option>
              <option value="Spine">Spine (LS/Cervical)</option>
              <option value="Knee">Extremities & Joints</option>
              <option value="PNS">Skull & PNS</option>
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
              <th>Patient Profile</th>
              <th>Radiographic View & Indication</th>
              <th>Films & Factors</th>
              <th>Reporting Radiologist</th>
              <th style={{ textAlign: 'center', width: '130px' }}>Exam Status</th>
              <th style={{ textAlign: 'center', width: '270px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCases.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No digital x-ray cases found matching the specified filters.
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
                          backgroundColor: '#0284c7',
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

                  {/* View Region & Indication */}
                  <td>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '13px' }}>
                      {c.viewRegion}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', fontStyle: 'italic', marginTop: '2px' }}>
                      Indication: {c.indication}
                    </div>
                  </td>

                  {/* Films & Exposure */}
                  <td>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
                      {c.filmsUsed}
                    </div>
                    <div style={{ fontSize: '11px', color: '#0284c7', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Zap size={11} />
                      <span>{c.exposureFactor}</span>
                    </div>
                  </td>

                  {/* Radiologist */}
                  <td>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                      {c.radiologist}
                    </div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>
                      Ref: {c.refDoctor}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td style={{ textAlign: 'center' }}>
                    <Badge
                      variant={
                        c.status === 'Reported'
                          ? 'success'
                          : c.status === 'Waiting for Exposure'
                          ? 'warning'
                          : c.status === 'Exposure Captured'
                          ? 'info'
                          : 'neutral'
                      }
                    >
                      {c.status}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', alignItems: 'center', flexWrap: 'nowrap' }}>
                      <Button
                        variant={c.status === 'Reported' ? 'secondary' : 'primary'}
                        size="sm"
                        icon={<Edit3 size={13} />}
                        onClick={() => handleOpenReportingConsole(c)}
                        style={{ whiteSpace: 'nowrap' }}
                      >
                        {c.status === 'Reported' ? 'Edit Findings' : 'Enter Report'}
                      </Button>

                      {c.status === 'Reported' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<Eye size={13} />}
                          onClick={() => setPreviewCase(c)}
                          title="View Official Radiograph Report"
                          style={{ whiteSpace: 'nowrap' }}
                        >
                          View
                        </Button>
                      )}

                      <Button
                        variant="secondary"
                        size="sm"
                        icon={<Printer size={13} />}
                        onClick={() => showToast(`Printed Film Jacket Barcode for ${c.patientName}`)}
                        title="Print Film Envelope Barcode"
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

      {/* AERB Compliance Footer */}
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
            <strong>Atomic Energy Regulatory Board (AERB) Radiation Safety Compliance:</strong> X-ray equipment licensed under e-LORA (AERB/DR/2021/7821). Periodic QA calibration and personal TLD badge monitoring active.
          </span>
        </div>
        <span style={{ fontWeight: 600 }}>Radiation Safety Officer: Dr. S. K. Verma</span>
      </div>

      {/* MODAL 1: Register New X-Ray Case */}
      <Modal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        title="Register Digital Radiography (X-Ray) Case"
        size="md"
        footer={
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" onClick={() => setIsRegisterOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveRegister}>
              Add to X-Ray Queue
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
              label="Radiographic View / Examination"
              value={regViewRegion}
              onChange={(e) => setRegViewRegion(e.target.value)}
              options={[
                { label: 'Chest PA View', value: 'Chest PA View' },
                { label: 'Chest AP View (Portable/Erect)', value: 'Chest AP View (Portable)' },
                { label: 'Lumbosacral Spine AP & Lateral (2 Views)', value: 'Lumbosacral Spine AP & Lateral' },
                { label: 'Cervical Spine AP & Lateral (2 Views)', value: 'Cervical Spine AP & Lateral' },
                { label: 'Knee Joint AP & Lateral Views', value: 'Knee Joint AP & Lateral' },
                { label: 'Paranasal Sinuses (PNS Water\'s View)', value: 'Paranasal Sinuses (Water\'s View)' },
                { label: 'Pelvis with Both Hips (AP View)', value: 'Pelvis with Both Hips (AP)' },
                { label: 'Wrist & Hand AP & Oblique Views', value: 'Wrist & Hand AP & Oblique' },
                { label: 'Ankle & Foot AP & Lateral Views', value: 'Ankle & Foot AP & Lateral' },
                { label: 'Abdomen Erect & Supine (KUB)', value: 'Abdomen Erect & Supine (KUB)' },
              ]}
            />
          </div>

          <Input
            label="Clinical Indication / History of Trauma"
            placeholder="e.g. Persistent cough / Fall injury / Low backache"
            value={regIndication}
            onChange={(e) => setRegIndication(e.target.value)}
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <Select
              label="Films Consumed (Size & Brand)"
              value={regFilms}
              onChange={(e) => setRegFilms(e.target.value)}
              options={[
                { label: '1 Film (14x17 Fuji DR)', value: '1 Film (14x17 Fuji DR)' },
                { label: '2 Films (10x12 Carestream)', value: '2 Films (10x12 Carestream)' },
                { label: '1 Film (10x12 Fuji DR)', value: '1 Film (10x12 Fuji DR)' },
                { label: '1 Film (8x10 Fuji)', value: '1 Film (8x10 Fuji)' },
                { label: '2 Films (8x10 Kodak)', value: '2 Films (8x10 Kodak)' },
              ]}
            />
            <Select
              label="Reporting Radiologist"
              value={regRadiologist}
              onChange={(e) => setRegRadiologist(e.target.value)}
              options={[
                { label: 'Dr. S. K. Verma, MD Radiodiagnosis', value: 'Dr. S. K. Verma, MD Radiodiagnosis' },
                { label: 'Dr. Neha Agarwal, DMRD', value: 'Dr. Neha Agarwal, DMRD' },
              ]}
            />
          </div>

          <Input
            label="Referring Doctor"
            placeholder="e.g. Dr. Rajesh Gupta"
            value={regRefDoctor}
            onChange={(e) => setRegRefDoctor(e.target.value)}
          />
        </form>
      </Modal>

      {/* MODAL 2: Clinical Radiography Reporting Console */}
      {activeCase && (
        <Modal
          isOpen={isConsoleOpen}
          onClose={() => setIsConsoleOpen(false)}
          title={`Digital X-Ray Reporting Console: ${activeCase.patientName} (${activeCase.token})`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Reporting Radiologist: <strong>{activeCase.radiologist}</strong>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Button variant="secondary" onClick={() => handleSaveReport('Exposure Captured')}>
                  Save Draft
                </Button>
                <Button
                  variant="primary"
                  icon={<CheckCircle2 size={16} />}
                  onClick={() => handleSaveReport('Reported')}
                >
                  Verify & Sign Off Radiograph
                </Button>
              </div>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', maxHeight: '72vh', overflowY: 'auto', paddingRight: '6px' }}>
            {/* Case Header */}
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
                  <strong>Examination:</strong> {activeCase.viewRegion} | <strong>Indication:</strong> {activeCase.indication}
                </div>
              </div>

              {/* Template Quick Loader */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="#0284c7" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#0369a1' }}>1-Click Template:</span>
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
                  <option value="chest_normal">Chest PA View (Normal)</option>
                  <option value="ls_spine_spondylosis">LS Spine Spondylosis</option>
                  <option value="knee_osteoarthritis">Knee Joint Osteoarthritis</option>
                  <option value="pns_sinusitis">PNS Maxillary Sinusitis</option>
                </select>
              </div>
            </div>

            {/* Technical Exposure Metadata Grid */}
            <div
              style={{
                backgroundColor: '#f0f9ff',
                border: '1px solid #bae6fd',
                borderRadius: '8px',
                padding: '12px 16px',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 700, color: '#0369a1', marginBottom: '8px' }}>
                Radiographic Exposure & Film Parameters
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Tube Voltage (kVp)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mKvp}
                    onChange={(e) => setMKvp(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Exposure (mAs)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mMas}
                    onChange={(e) => setMMas(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>SID / FFD (cm)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mSid}
                    onChange={(e) => setMSid(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', color: '#475569', fontWeight: 600 }}>Films Consumed</label>
                  <input
                    type="text"
                    className="form-input"
                    value={mFilmsCount}
                    onChange={(e) => setMFilmsCount(e.target.value)}
                    style={{ fontSize: '12px', padding: '4px 8px' }}
                  />
                </div>
              </div>
            </div>

            {/* Structured Findings Textareas */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                  1. Technical Quality, Exposure & Centering
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  value={editTechnical}
                  onChange={(e) => setEditTechnical(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                  2. Skeletal Architecture, Bone Contours & Joint Alignments
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editBonyCage}
                  onChange={(e) => setEditBonyCage(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 700, fontSize: '12px', color: '#1e293b' }}>
                  3. Visceral Shadows, Parenchymal Aeration & Soft Tissue Planes
                </label>
                <textarea
                  className="form-input"
                  rows={3}
                  value={editSoftTissues}
                  onChange={(e) => setEditSoftTissues(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>

              {/* Highlighted Impression Box */}
              <div
                style={{
                  backgroundColor: '#fefce8',
                  border: '1px solid #fef08a',
                  borderRadius: '8px',
                  padding: '12px',
                }}
              >
                <label className="form-label" style={{ fontWeight: 800, color: '#854d0e', fontSize: '13px' }}>
                  RADIOLOGICAL IMPRESSION & CONCLUSION (UPPERCASE)
                </label>
                <textarea
                  className="form-input"
                  rows={2}
                  style={{ borderColor: '#fde047', fontWeight: 700, color: '#713f12', fontSize: '13px' }}
                  value={editImpression}
                  onChange={(e) => setEditImpression(e.target.value)}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontWeight: 600, fontSize: '12px' }}>
                  Clinical Recommendations / Correlative Advice
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={editRecommendations}
                  onChange={(e) => setEditRecommendations(e.target.value)}
                  style={{ fontSize: '13px' }}
                />
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: High-Fidelity Formatted Official Radiography Report Preview */}
      {previewCase && (
        <Modal
          isOpen={!!previewCase}
          onClose={() => setPreviewCase(null)}
          title={`Official Digital Radiography Report — ${previewCase.patientName}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button
                variant="secondary"
                icon={<Printer size={15} />}
                onClick={() => showToast('Printing radiography report...')}
              >
                Print Radiograph Report
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
            {/* Letterhead Header */}
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
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: '#0369a1' }}>
                  METROPOLITAN DIGITAL RADIOGRAPHY & IMAGING CENTRE
                </h3>
                <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: '#64748b' }}>
                  AERB Licence No: AERB/DR/2021/7821 • High Frequency Direct Digital Radiography (DR)
                </p>
              </div>
              <div style={{ textAlign: 'right', fontSize: '11px', color: '#64748b' }}>
                <div>24/7 Radiography Helpdesk: +91 11 4982 1100</div>
                <div>support@metrorad.com</div>
              </div>
            </div>

            {/* Demographics Grid */}
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
              <div><strong>Examination:</strong> {previewCase.viewRegion}</div>
              <div><strong>Films Used:</strong> {previewCase.filmsUsed}</div>
              <div><strong>Exposure Factors:</strong> {previewCase.exposureFactor}</div>
            </div>

            {/* Detailed Radiological Findings */}
            <div style={{ fontSize: '13px', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <strong style={{ color: '#334155' }}>TECHNICAL QUALITY:</strong> {previewCase.findings?.technical}
              </div>
              <div>
                <strong style={{ color: '#334155' }}>SKELETAL & BONY ELEMENTS:</strong> {previewCase.findings?.bonyCage}
              </div>
              <div>
                <strong style={{ color: '#334155' }}>SOFT TISSUES & VISCERAL OUTLINES:</strong> {previewCase.findings?.softTissues}
              </div>

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
                Digitally verified radiograph report. Radiography findings represent radiological manifestations and require clinical, laboratory, and anatomical correlation.
              </div>

              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    fontFamily: 'Caveat, cursive, Brush Script MT, sans-serif',
                    fontSize: '22px',
                    color: '#0369a1',
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
        title="Cancel Radiography Case"
        message={`Are you sure you want to cancel the X-ray case for ${caseToCancel?.patientName} (${caseToCancel?.token})?`}
        confirmLabel="Yes, Cancel Case"
        variant="danger"
      />
    </div>
  );
};
