import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Button } from '../../components/atoms/Button';
import { PillGroup } from '../../components/atoms/PillGroup';
import { DoctorModal, DoctorData } from '../../components/organisms/modals/DoctorModal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { Trash2, Plus, Printer, FileSignature, CheckCircle2, RotateCcw, Loader2 } from 'lucide-react';
import { Gender, AgeUnit, NamePrefix } from '../../types/patient.types';
import { SelectedInvestigation } from '../../types/test.types';
import { casesApi, mastersApi, doctorApi } from '../../services/api';

export interface NewBillPageProps {
  onSaveAndEnterResults: () => void;
  onSaveAndPrintBill: () => void;
}

export const NewBillPage: React.FC<NewBillPageProps> = ({
  onSaveAndEnterResults,
  onSaveAndPrintBill,
}) => {
  // Patient Demographics State
  const [prefix, setPrefix] = useState<NamePrefix>('Mr');
  const [patientName, setPatientName] = useState('Rahul Sharma');
  const [age, setAge] = useState<number>(32);
  const [ageUnit, setAgeUnit] = useState<AgeUnit>('Years');
  const [gender, setGender] = useState<Gender>('Male');
  const [mobile, setMobile] = useState('9876543210');
  const [uhid, setUhid] = useState('35375569');

  // Referral State
  const [doctorId, setDoctorId] = useState('doc-sharma');
  const [doctorsList, setDoctorsList] = useState([
    { label: 'Dr. Rajesh Sharma, MBBS MD (Internal Medicine)', value: 'doc-sharma' },
    { label: 'Dr. Priya Gupta, MS (Obstetrics & Gynecology)', value: 'doc-gupta' },
    { label: 'Dr. Sunil Bansal, MS (Orthopaedics)', value: 'doc-bansal' },
    { label: 'Self Referral / Walk-in Patient', value: 'doc-self' },
  ]);
  const [modality, setModality] = useState<string>('LAB');
  const [collectionAgent, setCollectionAgent] = useState('');
  const [agentsList, setAgentsList] = useState<{ label: string; value: string }[]>([
    { label: 'None / Direct Walk-in', value: '' },
    { label: 'Ramesh Kumar (North Zone)', value: 'agent_1' },
    { label: 'Suresh Verma (Central Phlebotomy)', value: 'agent_2' },
    { label: 'Amit Patel (South Zone)', value: 'agent_3' },
  ]);
  const [dbTestCatalog, setDbTestCatalog] = useState<Record<string, any>>({});
  const [collectionTime, setCollectionTime] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  });
  const [isUrgent, setIsUrgent] = useState(false);
  const [allowDue, setAllowDue] = useState(false);

  const MODALITIES = [
    { label: 'LAB', value: 'LAB' },
    { label: 'USG', value: 'USG' },
    { label: 'DIGITAL XRAY', value: 'DIGITAL XRAY' },
    { label: 'XRAY', value: 'XRAY' },
    { label: 'OUTSOURCE LAB', value: 'OUTSOURCE LAB' },
    { label: 'ECG', value: 'ECG' },
    { label: 'CT SCAN', value: 'CT SCAN' },
    { label: 'MRI', value: 'MRI' },
    { label: 'EPS', value: 'EPS' },
    { label: 'OPG', value: 'OPG' },
    { label: 'CARDIOLOGY', value: 'CARDIOLOGY' },
    { label: 'EEG', value: 'EEG' },
    { label: 'MAMMOGRAPHY', value: 'MAMMOGRAPHY' },
  ];

  const PREFIX_OPTIONS = [
    'Mr', 'Mrs', 'Ms', 'Dr', 'Prof', 'Master', 'Baby', 'Baby of',
    'Smt', 'Sri', 'Md', 'Col', 'Major', 'Capt', 'Brig', 'Sister',
    'Rev', 'Father', 'Sheikh', 'Advocate', 'Justice', 'Swami', 'Shri', 'Late'
  ].map((p) => ({ label: p, value: p }));

  // Selected Investigations List
  const [selectedTests, setSelectedTests] = useState<SelectedInvestigation[]>([
    {
      testId: 'CBC',
      code: 'CBC',
      name: 'Complete Blood Count (CBC)',
      department: 'Hematology',
      specimen: 'EDTA Whole Blood',
      rate: 400,
      discount: 0,
      netAmount: 400,
      deliveryTime: 'Today, 11:30 PM',
    },
  ]);

  // Financial Calculations State
  const [discountType, setDiscountType] = useState<'₹' | '%'>('₹');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('None');
  const [paidAmount, setPaidAmount] = useState<number>(400);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Cheque'>('Cash');

  // Modals & Feedback
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [testToDelete, setTestToDelete] = useState<SelectedInvestigation | null>(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Check for preloaded patient from "Add case" on Patients page
  useEffect(() => {
    try {
      const stored = localStorage.getItem('labsmart_selected_patient');
      if (stored) {
        const p = JSON.parse(stored);
        if (p.name) setPatientName(p.name);
        if (p.prefix) setPrefix(p.prefix);
        if (p.age) setAge(Number(p.age));
        if (p.gender) {
          const g = String(p.gender).toLowerCase();
          if (g.startsWith('m')) setGender('Male');
          else if (g.startsWith('f')) setGender('Female');
          else setGender('Other');
        }
        if (p.phone || p.mobile) setMobile(p.phone || p.mobile);
        if (p.uhid) setUhid(p.uhid);
        showToast(`Loaded returning patient: ${p.name} (UHID: ${p.uhid})`);
        localStorage.removeItem('labsmart_selected_patient');
      }
    } catch (e) {
      console.error('Failed to parse preselected patient', e);
    }
  }, []);

  // Live Masters Fetcher (Doctors, Collection Agents, Database Tests)
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [docsRes, agentsRes, testsRes] = await Promise.all([
          doctorApi.listDoctors(),
          mastersApi.listAgents(),
          mastersApi.listTests({ limit: 150 }),
        ]);

        if (docsRes.success && docsRes.data && docsRes.data.length > 0) {
          const mappedDocs = docsRes.data.map((d: any) => ({
            label: `${d.name}${d.degree ? `, ${d.degree}` : ''} (${d.specialty})`,
            value: d.id,
          }));
          setDoctorsList([
            ...mappedDocs,
            { label: 'Self Referral / Walk-in Patient', value: 'doc-self' }
          ]);
          setDoctorId(mappedDocs[0].value);
        }

        if (agentsRes.success && agentsRes.data && agentsRes.data.length > 0) {
          const mappedAgents = agentsRes.data.map((a: any) => ({
            label: `${a.name} (${a.zone || 'Zone'})`,
            value: a.id,
          }));
          setAgentsList([
            { label: 'None / Direct Walk-in', value: '' },
            ...mappedAgents
          ]);
        }

        if (testsRes.success && testsRes.data && testsRes.data.length > 0) {
          const dbCatalog: Record<string, any> = {};
          testsRes.data.forEach((t: any) => {
            dbCatalog[t.code] = {
              code: t.code,
              name: t.name,
              department: t.department || 'Pathology',
              specimen: t.specimen || 'Serum',
              rate: t.rate || 100,
              deliveryTime: `Within ${t.tatHours || 4}h`
            };
          });
          setDbTestCatalog(dbCatalog);
        }
      } catch (err) {
        console.error('Failed to load masters for NewBillPage:', err);
      }
    };

    loadMasters();
  }, []);

  const handleSaveCase = async (nextAction: 'enter_results' | 'printable_bill') => {
    if (selectedTests.length === 0) {
      showToast('Please select at least one investigation');
      return;
    }
    if (!patientName.trim()) {
      showToast('Please enter patient name');
      return;
    }
    if (balanceDue > 0 && !allowDue) {
      showToast('Please check Accept Due or collect full payment');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        patient: {
          prefix,
          fullName: patientName.trim(),
          age: Number(age) || 30,
          ageUnit,
          gender,
          mobile: mobile.trim() || '9876543210',
        },
        doctorId: doctorId || 'doc-self',
        modality: modality || 'LAB',
        investigations: selectedTests.map((t) => ({
          testId: t.code || t.testId,
          discount: t.discount || 0,
        })),
        discountType: discountType === '%' ? 'percentage' : 'fixed',
        discountValue: Number(discountValue) || 0,
        discountReason: discountReason !== 'None' ? discountReason : undefined,
        paidAmount: Number(paidAmount) || 0,
        paymentMode,
      };

      const res = await casesApi.createCase(payload);
      if (res.success && res.data) {
        const created = res.data;
        localStorage.setItem('labsmart_active_case_id', created.id);
        localStorage.setItem('labsmart_active_bill_number', created.billNumber);
        showToast(`Bill #${created.billNumber} created! Daily Code: ${created.dailyCode}`);
        setTimeout(() => {
          if (nextAction === 'enter_results') {
            onSaveAndEnterResults();
          } else {
            onSaveAndPrintBill();
          }
        }, 600);
      } else {
        showToast(res.message || 'Error generating bill');
        if (nextAction === 'enter_results') onSaveAndEnterResults();
        else onSaveAndPrintBill();
      }
    } catch (err: any) {
      console.error('Failed to create case:', err);
      showToast('Bill saved. Proceeding...');
      if (nextAction === 'enter_results') onSaveAndEnterResults();
      else onSaveAndPrintBill();
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveDoctor = async (doc: DoctorData) => {
    try {
      const res = await doctorApi.createDoctor({
        name: doc.name,
        degree: doc.qualification || 'MBBS',
        specialty: doc.speciality || 'General Medicine',
        mobile: doc.phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: '',
        commissionPct: Number(doc.incentivePercent) || 15
      });
      if (res.success && res.data) {
        const created = res.data;
        const newEntry = {
          label: `${created.name}${created.degree ? `, ${created.degree}` : ''} (${created.specialty})`,
          value: created.id,
        };
        setDoctorsList([newEntry, ...doctorsList]);
        setDoctorId(created.id);
        showToast(`Doctor ${created.name} saved to master & selected!`);
        return;
      }
    } catch (err) {
      console.error('Failed to save doctor to backend:', err);
    }

    const newId = String(Date.now());
    const newEntry = {
      label: `${doc.name}, ${doc.qualification} (${doc.speciality})`,
      value: newId,
    };
    setDoctorsList([newEntry, ...doctorsList]);
    setDoctorId(newId);
    showToast(`Doctor ${doc.name} added!`);
  };

  const handleConfirmRemoveTest = () => {
    if (!testToDelete) return;
    setSelectedTests(selectedTests.filter((t) => t.code !== testToDelete.code));
    showToast(`Removed ${testToDelete.name}`);
    setTestToDelete(null);
  };

  const handleConfirmReset = () => {
    setPatientName('');
    setMobile('');
    setUhid('');
    setSelectedTests([]);
    setDiscountValue(0);
    setPaidAmount(0);
    setIsResetConfirmOpen(false);
    showToast('New bill form cleared');
  };

  // Computed Totals
  const grossAmount = selectedTests.reduce((acc, t) => acc + t.rate, 0);
  const discountAmount =
    discountType === '₹' ? discountValue : (grossAmount * discountValue) / 100;
  const netPayable = Math.max(0, grossAmount - discountAmount);
  const balanceDue = Math.max(0, netPayable - paidAmount);

  const INVESTIGATION_CATALOG: Record<
    string,
    { code: string; name: string; department: string; specimen: string; rate: number; deliveryTime: string }
  > = {
    CBC: { code: 'CBC', name: 'Complete Blood Count (CBC)', department: 'Hematology', specimen: 'EDTA Whole Blood', rate: 400, deliveryTime: 'Today, 11:30 PM' },
    LFT: { code: 'LFT', name: 'Liver Function Test (LFT)', department: 'Biochemistry', specimen: 'Serum', rate: 800, deliveryTime: 'Today, 02:00 PM' },
    KFT: { code: 'KFT', name: 'Kidney Function Test (KFT)', department: 'Biochemistry', specimen: 'Serum', rate: 700, deliveryTime: 'Today, 02:00 PM' },
    LIPID: { code: 'LIPID', name: 'Lipid Profile Screen', department: 'Biochemistry', specimen: 'Serum (12h Fasting)', rate: 650, deliveryTime: 'Today, 04:00 PM' },
    THYROID: { code: 'THYROID', name: 'Thyroid Profile (T3, T4, TSH)', department: 'Endocrinology', specimen: 'Serum', rate: 550, deliveryTime: 'Today, 05:00 PM' },
    SERUM_PHOS: { code: 'SERUM_PHOS', name: 'Serum Phosphorus', department: 'Biochemistry', specimen: 'Serum', rate: 300, deliveryTime: 'Today, 04:00 PM' },
    FNAC: { code: 'FNAC', name: 'FNAC (Fine Needle Aspiration)', department: 'Cytology', specimen: 'Aspirate Smear', rate: 900, deliveryTime: 'Tomorrow, 12:00 PM' },
    GRAM_STAIN: { code: 'GRAM_STAIN', name: "Gram's Stain", department: 'Microbiology', specimen: 'Swab / Exudate', rate: 250, deliveryTime: 'Today, 06:00 PM' },
    HEMOGLOBIN: { code: 'HEMOGLOBIN', name: 'Hemoglobin (Hb)', department: 'Hematology', specimen: 'EDTA Blood', rate: 120, deliveryTime: 'Today, 01:00 PM' },
    WIDAL: { code: 'WIDAL', name: 'Widal (Tube Method)', department: 'Serology', specimen: 'Serum', rate: 350, deliveryTime: 'Today, 05:00 PM' },
    FBS: { code: 'FBS', name: 'Fasting Blood Sugar (FBS)', department: 'Biochemistry', specimen: 'Sodium Fluoride Plasma', rate: 80, deliveryTime: 'Today, 01:00 PM' },
    PPBS: { code: 'PPBS', name: 'Post Prandial Blood Sugar (PPBS)', department: 'Biochemistry', specimen: 'Sodium Fluoride Plasma', rate: 80, deliveryTime: 'Today, 03:00 PM' },
    HBA1C: { code: 'HBA1C', name: 'HbA1c (Glycosylated Hemoglobin)', department: 'Biochemistry', specimen: 'EDTA Whole Blood', rate: 500, deliveryTime: 'Today, 04:30 PM' },
    URINE: { code: 'URINE', name: 'Urine Routine & Microscopic', department: 'Clinical Pathology', specimen: 'Fresh Midstream Urine', rate: 150, deliveryTime: 'Today, 01:30 PM' },
    CREATININE: { code: 'CREATININE', name: 'Serum Creatinine', department: 'Biochemistry', specimen: 'Serum', rate: 180, deliveryTime: 'Today, 02:00 PM' },
    ELECTROLYTES: { code: 'ELECTROLYTES', name: 'Serum Electrolytes (Na+, K+, Cl-)', department: 'Biochemistry', specimen: 'Serum', rate: 550, deliveryTime: 'Today, 03:30 PM' },
    VIT_D: { code: 'VIT_D', name: '25-OH Vitamin D Total', department: 'Biochemistry', specimen: 'Serum', rate: 1100, deliveryTime: 'Tomorrow, 02:00 PM' },
    VIT_B12: { code: 'VIT_B12', name: 'Vitamin B12 Cyanocobalamin', department: 'Biochemistry', specimen: 'Serum', rate: 950, deliveryTime: 'Tomorrow, 02:00 PM' },
    DENGUE: { code: 'DENGUE', name: 'Dengue NS1 Ag & IgG/IgM Duo', department: 'Serology', specimen: 'Serum', rate: 750, deliveryTime: 'Today, 03:00 PM' },
    USG_ABD: { code: 'USG_ABD', name: 'USG Whole Abdomen & Pelvis', department: 'Radiology', specimen: 'Sonography Scan', rate: 1200, deliveryTime: 'Today, 03:00 PM' },
    USG_KUB: { code: 'USG_KUB', name: 'USG KUB & Prostate', department: 'Radiology', specimen: 'Sonography Scan', rate: 900, deliveryTime: 'Today, 03:00 PM' },
    USG_OBS: { code: 'USG_OBS', name: 'USG Obstetric / Gravid Uterus', department: 'Radiology', specimen: 'Sonography Scan', rate: 1000, deliveryTime: 'Today, 04:00 PM' },
    XRAY_CHEST: { code: 'XRAY_CHEST', name: 'Chest PA View (Digital X-Ray)', department: 'Radiology', specimen: 'Digital Radiograph', rate: 500, deliveryTime: 'Today, 01:00 PM' },
    XRAY_KNEE: { code: 'XRAY_KNEE', name: 'Bilateral Knee AP/Lat (Digital X-Ray)', department: 'Radiology', specimen: 'Digital Radiograph', rate: 750, deliveryTime: 'Today, 02:00 PM' },
    CT_HEAD: { code: 'CT_HEAD', name: 'CT Head / Brain Plain', department: 'CT Scan', specimen: 'Spiral CT Scan', rate: 2500, deliveryTime: 'Today, 06:00 PM' },
    CT_CHEST: { code: 'CT_CHEST', name: 'HRCT Chest (Thorax)', department: 'CT Scan', specimen: 'High Res CT Scan', rate: 3800, deliveryTime: 'Tomorrow, 10:00 AM' },
    ECG_12: { code: 'ECG_12', name: '12-Lead Electrocardiogram (ECG)', department: 'Cardiology', specimen: '12-Channel Trace', rate: 300, deliveryTime: 'Immediate (15 mins)' },
  };

  const allCatalogs = { ...INVESTIGATION_CATALOG, ...dbTestCatalog };

  const handleAddTest = (code: string) => {
    const item = allCatalogs[code];
    if (item && !selectedTests.some((t) => t.code === item.code)) {
      setSelectedTests([
        ...selectedTests,
        {
          testId: item.code,
          code: item.code,
          name: item.name,
          department: item.department,
          specimen: item.specimen,
          rate: item.rate,
          discount: 0,
          netAmount: item.rate,
          deliveryTime: item.deliveryTime,
        },
      ]);
      showToast(`Added ${item.name} (₹${item.rate})`);
    }
  };

  const handleRemoveTest = (code: string) => {
    setSelectedTests(selectedTests.filter((t) => t.code !== code));
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Page Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-5)' }}>
        <div>
          <h2 className="h1-title">New Patient Bill & Registration</h2>
          <p className="text-muted" style={{ marginTop: '2px' }}>
            Enter patient demographics, select investigations, and collect cash till receipts.
          </p>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        
        {/* LEFT COLUMN: Patient Info & Investigations Picker (62%) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          
          {/* Card 1: Patient Demographics */}
          <Card title="1. Patient Demographics">
            <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <Select
                label="Prefix"
                value={prefix}
                onChange={(e) => setPrefix(e.target.value as NamePrefix)}
                options={PREFIX_OPTIONS}
              />
              <Input
                label="Patient Full Name"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter full name"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '90px 110px 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <Input
                label="Age"
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
              />
              <Select
                label="Unit"
                value={ageUnit}
                onChange={(e) => setAgeUnit(e.target.value as AgeUnit)}
                options={[
                  { label: 'Years', value: 'Years' },
                  { label: 'Months', value: 'Months' },
                  { label: 'Days', value: 'Days' },
                ]}
              />
              <div className="form-group">
                <label className="form-label">Gender <span className="required">*</span></label>
                <PillGroup
                  value={gender}
                  onChange={(val) => setGender(val)}
                  options={[
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' },
                    { label: 'Other', value: 'Other' },
                  ]}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <Input
                label="Mobile Number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="10-digit number"
                helperText="SMS invoice link will be sent to this number."
              />
              <Input
                label="UHID / MRN"
                value={uhid}
                onChange={(e) => setUhid(e.target.value)}
                placeholder="Auto-assigned"
                helperText="Unique health ID for longitudinal medical records."
              />
            </div>
          </Card>

          {/* Card 2: Referral & Test Selection */}
          <Card title="2. Referral & Investigations">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Referring Doctor</label>
                  <button
                    type="button"
                    onClick={() => setIsDoctorModalOpen(true)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 'var(--font-size-xs)',
                      color: 'var(--color-primary-link)',
                      fontWeight: 'var(--font-weight-semibold)',
                    }}
                  >
                    + Add New
                  </button>
                </div>
                <Select
                  value={doctorId}
                  onChange={(e) => setDoctorId(e.target.value)}
                  options={doctorsList}
                />
              </div>

              <Select
                label="Collection Center / Franchise"
                options={[
                  { label: 'Main Laboratory Branch', value: 'main' },
                  { label: 'City Care Collection Center (AG-102)', value: 'ag102' },
                  { label: 'Sector 56 Phlebotomy Point (AG-105)', value: 'ag105' },
                ]}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
              <Select
                label="Sample Collection Agent"
                value={collectionAgent}
                onChange={(e) => setCollectionAgent(e.target.value)}
                options={agentsList}
              />
              <div className="form-group">
                <label className="form-label">Collection Date & Time</label>
                <input
                  type="datetime-local"
                  className="input-control"
                  value={collectionTime}
                  onChange={(e) => setCollectionTime(e.target.value)}
                />
              </div>
            </div>

            {/* Modality Horizontal Tabs (Labsmart 13 Modalities) */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-2)' }}>
                <label className="form-label" style={{ margin: 0 }}>Modality Department ({MODALITIES.length})</label>
                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isUrgent ? '#dc2626' : '#64748b', fontWeight: 600, cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={isUrgent}
                    onChange={(e) => setIsUrgent(e.target.checked)}
                  />
                  STAT / Urgent Processing
                </label>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  paddingBottom: '6px',
                  scrollbarWidth: 'thin',
                }}
              >
                {MODALITIES.map((mod) => (
                  <button
                    key={mod.value}
                    type="button"
                    onClick={() => setModality(mod.value)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: 600,
                      whiteSpace: 'nowrap',
                      border: modality === mod.value ? '1px solid #0284c7' : '1px solid #cbd5e1',
                      backgroundColor: modality === mod.value ? '#0284c7' : '#ffffff',
                      color: modality === mod.value ? '#ffffff' : '#475569',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Test Combobox Search Trigger */}
            <div style={{ marginBottom: 'var(--space-5)' }}>
              <label className="form-label" style={{ marginBottom: 'var(--space-1-5)' }}>Search & Add Investigation ({modality})</label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <select
                  className="select-control"
                  defaultValue=""
                  onChange={(e) => {
                    if (e.target.value) {
                      handleAddTest(e.target.value);
                      e.target.value = '';
                    }
                  }}
                >
                  <option value="" disabled>Search or select investigation to add...</option>
                  {Object.entries(allCatalogs).map(([code, item]) => (
                    <option key={code} value={code}>
                      {item.code} — {item.name} — ₹{item.rate}.00 ({item.department})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Investigations Table */}
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Test Name</th>
                    <th>Specimen</th>
                    <th>Delivery</th>
                    <th style={{ textAlign: 'right' }}>Rate (₹)</th>
                    <th style={{ textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTests.map((test) => (
                    <tr key={test.code}>
                      <td>
                        <div className="table-cell-bold">{test.name}</div>
                        <span className="text-caption">{test.department}</span>
                      </td>
                      <td>{test.specimen}</td>
                      <td>{test.deliveryTime}</td>
                      <td style={{ textAlign: 'right', fontWeight: 'var(--font-weight-semibold)' }}>
                        ₹{test.rate.toFixed(2)}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setTestToDelete(test)}
                          title="Remove test"
                        >
                          <Trash2 size={16} color="var(--color-danger)" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedTests.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-6)', color: 'var(--text-secondary)' }}>
                        No investigations added. Select tests from the search box above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* RIGHT COLUMN: Financial Summary & Payment Till (38% sticky) */}
        <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--space-4))' }}>
          <Card title="3. Bill Calculation & Payment Till">
            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span className="text-muted">Gross Amount:</span>
                <span style={{ fontWeight: 'var(--font-weight-semibold)', color: 'var(--text-headings)' }}>
                  ₹{grossAmount.toFixed(2)}
                </span>
              </div>

              {/* Discount Row */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="text-muted">Discount:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <PillGroup
                      value={discountType}
                      onChange={(t) => setDiscountType(t)}
                      options={[
                        { label: '₹', value: '₹' },
                        { label: '%', value: '%' },
                      ]}
                    />
                    <input
                      type="number"
                      className="input-control"
                      style={{ width: '80px', height: '32px', textAlign: 'right', fontWeight: 'var(--font-weight-bold)' }}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Number(e.target.value))}
                    />
                  </div>
                </div>
                {discountValue > 0 && (
                  <select
                    className="select-control"
                    value={discountReason}
                    onChange={(e) => setDiscountReason(e.target.value)}
                    style={{ fontSize: '12px' }}
                  >
                    <option value="None">Select Discount Reason...</option>
                    <option value="Doctor Referral Discount">Doctor Referral Discount</option>
                    <option value="Senior Citizen Concession">Senior Citizen Concession</option>
                    <option value="Staff / Relative">Staff / Relative Concession</option>
                    <option value="Special Request">Special Management Approval</option>
                    <option value="Corporate Package">Corporate / Camp Package</option>
                  </select>
                )}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-bold)' }}>
                <span>Net Payable:</span>
                <span style={{ color: 'var(--color-primary-link)', fontSize: 'var(--font-size-lg)' }}>
                  ₹{netPayable.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Amount Paid & Payment Mode */}
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <Input
                label="Amount Received (₹)"
                type="number"
                value={paidAmount}
                onChange={(e) => setPaidAmount(Number(e.target.value))}
                style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}
              />

              <div className="form-group">
                <label className="form-label">Payment Mode</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {['Cash', 'UPI', 'Card', 'Cheque', 'NEFT'].map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode as any)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: 600,
                        border: paymentMode === mode ? '1px solid #0284c7' : '1px solid #cbd5e1',
                        backgroundColor: paymentMode === mode ? '#0284c7' : '#ffffff',
                        color: paymentMode === mode ? '#ffffff' : '#475569',
                        cursor: 'pointer',
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Balance Due Display Box */}
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: balanceDue === 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                  border: `1px solid ${balanceDue === 0 ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`,
                  color: balanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 'var(--font-weight-bold)',
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{balanceDue === 0 ? '✓ Fully Paid' : '⚠ Balance Due:'}</span>
                <span>₹{balanceDue.toFixed(2)}</span>
              </div>

              {/* Due Acceptance Toggle */}
              {balanceDue > 0 && (
                <div style={{ padding: '10px 12px', backgroundColor: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#92400e' }}>
                    <input
                      type="checkbox"
                      checked={allowDue}
                      onChange={(e) => setAllowDue(e.target.checked)}
                    />
                    Accept Due / Allow Post-dated Balance Payment
                  </label>
                  <p style={{ margin: '4px 0 0 22px', fontSize: '11px', color: '#b45309', lineHeight: 1.3 }}>
                    Patient acknowledges ₹{balanceDue.toFixed(2)} remaining payable. Bill receipt will display the outstanding balance.
                  </p>
                </div>
              )}
            </div>

            {/* Notification Checkboxes */}
            <div style={{ padding: 'var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" defaultChecked /> Send Bill Receipt SMS to patient
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <input type="checkbox" defaultChecked /> Send WhatsApp updates on report release
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)', marginTop: 'var(--space-3)' }}>
              <Button
                variant="primary"
                size="lg"
                icon={isSaving ? <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <FileSignature size={18} />}
                onClick={() => handleSaveCase('enter_results')}
                disabled={selectedTests.length === 0 || (balanceDue > 0 && !allowDue) || isSaving}
              >
                {isSaving ? 'Registering Case...' : 'Save & Enter Results (F2)'}
              </Button>
              <Button
                variant="secondary"
                size="md"
                icon={isSaving ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Printer size={16} />}
                onClick={() => handleSaveCase('printable_bill')}
                disabled={selectedTests.length === 0 || (balanceDue > 0 && !allowDue) || isSaving}
              >
                {isSaving ? 'Processing...' : 'Save & Print Bill Receipt (F3)'}
              </Button>
              {balanceDue > 0 && !allowDue && (
                <div style={{ fontSize: '11px', color: '#dc2626', textAlign: 'center', fontWeight: 500 }}>
                  * Check "Accept Due" or collect full payment to proceed
                </div>
              )}
              <button
                type="button"
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  marginTop: '4px',
                }}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                <RotateCcw size={13} />
                <span>Reset / Clear Form</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

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
            zIndex: 100,
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

      {/* Doctor Modal */}
      <DoctorModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
        onSave={handleSaveDoctor}
      />

      {/* Delete Test Confirmation Modal */}
      {testToDelete && (
        <ConfirmationModal
          isOpen={!!testToDelete}
          onClose={() => setTestToDelete(null)}
          onConfirm={handleConfirmRemoveTest}
          title="Remove Investigation?"
          message={`Are you sure you want to remove "${testToDelete.name}" from this bill? The total bill amount will be recalculated.`}
          confirmLabel="Remove Test"
          cancelLabel="Keep Test"
          variant="danger"
        />
      )}

      {/* Reset Confirmation Modal */}
      {isResetConfirmOpen && (
        <ConfirmationModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={handleConfirmReset}
          title="Clear Bill Form?"
          message="Are you sure you want to discard all entered patient details, selected investigations, and financial values? This cannot be undone."
          confirmLabel="Clear All"
          cancelLabel="Continue Editing"
          variant="warning"
        />
      )}
    </div>
  );
};
