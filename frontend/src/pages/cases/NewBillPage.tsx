import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Card } from '../../components/atoms/Card';
import { Input } from '../../components/atoms/Input';
import { Select } from '../../components/atoms/Select';
import { Button } from '../../components/atoms/Button';
import { PillGroup } from '../../components/atoms/PillGroup';
import { Modal } from '../../components/atoms/Modal';
import { DoctorModal, DoctorData } from '../../components/organisms/modals/DoctorModal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Trash2,
  Plus,
  Printer,
  FileSignature,
  CheckCircle2,
  RotateCcw,
  Loader2,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { Gender, AgeUnit, NamePrefix } from '../../types/patient.types';
import { SelectedInvestigation } from '../../types/test.types';
import { casesApi, mastersApi, doctorApi, patientApi } from '../../services/api';

export interface NewBillPageProps {
  onSaveAndEnterResults: () => void;
  onSaveAndPrintBill: () => void;
}

interface CatalogEntry {
  key: string;
  id: string;
  itemType: 'test' | 'panel' | 'package';
  code: string;
  name: string;
  department: string;
  specimen: string;
  rate: number;
  deliveryTime: string;
}

const FEMALE_PREFIXES = new Set([
  'Mrs.', 'Mrs', 'Smt.', 'Smt', 'Kumari', 'Miss.', 'Miss', 'Ms.', 'Ms',
  'Miss./Mrs.', 'Selvi', 'Wife of', 'Mother of', 'Daughter of', 'Sister',
]);

const MALE_PREFIXES = new Set([
  'Mr.', 'Mr', 'Shri.', 'Shri', 'Sri', 'Master', 'Mohd.', 'Son of', 'Father',
]);

const PREFIX_OPTIONS = [
  'Mr.', 'Mrs.', 'Smt.', 'Kumari', 'Shri.', 'Miss.', 'Master', 'Mohd.',
  'Baby', 'Baby of', 'Wife of', 'Mother of', 'Son of', 'Daughter of',
  'Ms.', 'Miss./Mrs.', 'Selvi', 'Sk.', 'PROF', 'Dr.', 'Child', 'Md.', 'Mx.',
].map((p) => ({ label: p, value: p }));

const MODALITIES = [
  { label: 'LAB', value: 'LAB' },
  { label: 'OUTSOURCE LAB', value: 'OUTSOURCE LAB' },
  { label: 'USG', value: 'USG' },
  { label: 'DIGITAL XRAY', value: 'DIGITAL XRAY' },
  { label: 'XRAY', value: 'XRAY' },
  { label: 'ECG', value: 'ECG' },
  { label: 'CT SCAN', value: 'CT SCAN' },
  { label: 'MRI', value: 'MRI' },
  { label: 'EPS', value: 'EPS' },
  { label: 'OPG', value: 'OPG' },
  { label: 'CARDIOLOGY', value: 'CARDIOLOGY' },
  { label: 'EEG', value: 'EEG' },
  { label: 'MAMMOGRAPHY', value: 'MAMMOGRAPHY' },
];

const FALLBACK_TESTS: CatalogEntry[] = [
  { key: 'test:CBC', id: 'CBC', itemType: 'test', code: 'CBC', name: 'Complete Blood Count (CBC)', department: 'Haematology', specimen: 'EDTA Whole Blood', rate: 400, deliveryTime: 'Within 4h' },
  { key: 'test:LFT', id: 'LFT', itemType: 'test', code: 'LFT', name: 'Liver Function Test (LFT)', department: 'Biochemistry', specimen: 'Serum', rate: 800, deliveryTime: 'Within 4h' },
  { key: 'test:KFT', id: 'KFT', itemType: 'test', code: 'KFT', name: 'Kidney Function Test (KFT)', department: 'Biochemistry', specimen: 'Serum', rate: 700, deliveryTime: 'Within 4h' },
  { key: 'test:LIPID', id: 'LIPID', itemType: 'test', code: 'LIPID', name: 'Lipid Profile Screen', department: 'Biochemistry', specimen: 'Serum (12h Fasting)', rate: 650, deliveryTime: 'Within 4h' },
  { key: 'test:THYROID', id: 'THYROID', itemType: 'test', code: 'THYROID', name: 'Thyroid Profile (T3, T4, TSH)', department: 'Endocrinology', specimen: 'Serum', rate: 550, deliveryTime: 'Within 6h' },
  { key: 'test:HEMOGLOBIN', id: 'HEMOGLOBIN', itemType: 'test', code: 'HEMOGLOBIN', name: 'Hemoglobin (Hb)', department: 'Haematology', specimen: 'EDTA Blood', rate: 120, deliveryTime: 'Within 2h' },
  { key: 'test:FBS', id: 'FBS', itemType: 'test', code: 'FBS', name: 'Fasting Blood Sugar (FBS)', department: 'Biochemistry', specimen: 'Sodium Fluoride Plasma', rate: 80, deliveryTime: 'Within 2h' },
  { key: 'test:PPBS', id: 'PPBS', itemType: 'test', code: 'PPBS', name: 'Post Prandial Blood Sugar (PPBS)', department: 'Biochemistry', specimen: 'Sodium Fluoride Plasma', rate: 80, deliveryTime: 'Within 2h' },
  { key: 'test:HBA1C', id: 'HBA1C', itemType: 'test', code: 'HBA1C', name: 'HbA1c (Glycosylated Hemoglobin)', department: 'Biochemistry', specimen: 'EDTA Whole Blood', rate: 500, deliveryTime: 'Within 4h' },
  { key: 'test:URINE', id: 'URINE', itemType: 'test', code: 'URINE', name: 'Urine Routine & Microscopic', department: 'Clinical Pathology', specimen: 'Fresh Midstream Urine', rate: 150, deliveryTime: 'Within 2h' },
];

export const NewBillPage: React.FC<NewBillPageProps> = ({
  onSaveAndEnterResults,
  onSaveAndPrintBill,
}) => {
  // Top bar metadata
  const [lastRegNo, setLastRegNo] = useState<string>('');

  // Patient Demographics State
  const [selectedPatientId, setSelectedPatientId] = useState<string | undefined>(undefined);
  const [prefix, setPrefix] = useState<NamePrefix>('Mr.' as NamePrefix);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ageYears, setAgeYears] = useState<number | string>('');
  const [ageMonths, setAgeMonths] = useState<number | string>(0);
  const [ageDays, setAgeDays] = useState<number | string>(0);
  const [age, setAge] = useState<number>(0);
  const [ageUnit, setAgeUnit] = useState<AgeUnit>('Years');
  const [gender, setGender] = useState<Gender>('Male');
  const [mobile, setMobile] = useState('');
  const [uhid, setUhid] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [patientHistory, setPatientHistory] = useState('');
  const [onlineReportRequested, setOnlineReportRequested] = useState(false);

  // Expandable Optional Patient Fields
  const [showEmail, setShowEmail] = useState(false);
  const [showAddress, setShowAddress] = useState(false);
  const [showAadhaar, setShowAadhaar] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showSampleCollectedAt, setShowSampleCollectedAt] = useState(false);

  // Patient Lookup State
  const [patientMatches, setPatientMatches] = useState<any[]>([]);
  const [isSearchingPatients, setIsSearchingPatients] = useState(false);

  // Referral & Case Details State
  const [doctorId, setDoctorId] = useState('doc-self');
  const [doctorsList, setDoctorsList] = useState<{ label: string; value: string }[]>([
    { label: 'Self Referral / Walk-in Patient', value: 'doc-self' },
  ]);
  const [modality, setModality] = useState<string>('LAB');
  const [branchId, setBranchId] = useState('main');
  const [collectionAgent, setCollectionAgent] = useState('');
  const [agentsList, setAgentsList] = useState<{ label: string; value: string }[]>([
    { label: 'None / Direct Walk-in', value: '' },
  ]);
  const [sampleCollectedAt, setSampleCollectedAt] = useState('');
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

  // Catalog (Tests + Panels + Packages) & Searchable Picker
  const [catalogEntries, setCatalogEntries] = useState<CatalogEntry[]>(FALLBACK_TESTS);
  const [investigationSearch, setInvestigationSearch] = useState('');
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Selected Investigations List
  const [selectedTests, setSelectedTests] = useState<SelectedInvestigation[]>([]);

  // Financial Calculations State
  const [discountType, setDiscountType] = useState<'₹' | '%'>('₹');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [discountReason, setDiscountReason] = useState('None');
  const [collectionCharge, setCollectionCharge] = useState<number>(0);
  const [paidAmount, setPaidAmount] = useState<number>(0);
  const [isPaidManuallyEdited, setIsPaidManuallyEdited] = useState(false);
  const [allowDue, setAllowDue] = useState(false);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Insurance' | 'Cheque' | 'NEFT'>('Cash');
  const [remarks, setRemarks] = useState('');
  const [sendSms, setSendSms] = useState(true);
  const [sendWhatsapp, setSendWhatsapp] = useState(true);

  // Settings Modal (Default Discount Type)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [defaultDiscountType, setDefaultDiscountType] = useState<string>(() =>
    localStorage.getItem('labsmart_default_discount_type') || 'Centre discount'
  );

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

  // Close investigation dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setIsPickerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load returning patient from localStorage if navigated from PatientsPage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('labsmart_selected_patient');
      if (stored) {
        const p = JSON.parse(stored);
        applySelectedPatient(p);
        localStorage.removeItem('labsmart_selected_patient');
      }
    } catch (e) {
      console.error('Failed to parse preselected patient', e);
    }
  }, []);

  const applySelectedPatient = (p: any) => {
    if (p.id) setSelectedPatientId(p.id);
    const full = String(p.fullName || p.name || '').trim();
    const parts = full.split(/\s+/);
    setFirstName(parts[0] || '');
    setLastName(parts.slice(1).join(' '));
    if (p.prefix) setPrefix(p.prefix);
    if (p.ageYears || p.age) {
      setAgeYears(Number(p.ageYears || p.age) || '');
      setAge(Number(p.ageYears || p.age) || 0);
    }
    if (p.ageMonths) setAgeMonths(Number(p.ageMonths));
    if (p.ageDays) setAgeDays(Number(p.ageDays));
    if (p.gender) {
      const g = String(p.gender).toLowerCase();
      if (g.startsWith('m')) setGender('Male');
      else if (g.startsWith('f')) setGender('Female');
      else setGender('Other');
    }
    if (p.phone || p.mobile) setMobile(String(p.phone || p.mobile).replace(/^\+91/, ''));
    if (p.uhid) setUhid(p.uhid);
    if (p.email) { setEmail(p.email); setShowEmail(true); }
    if (p.address) { setAddress(p.address); setShowAddress(true); }
    if (p.aadhaar) { setAadhaar(p.aadhaar); setShowAadhaar(true); }
    if (p.medicalHistory) { setPatientHistory(p.medicalHistory); setShowHistory(true); }
    showToast(`Loaded patient: ${full}${p.uhid ? ` (${p.uhid})` : ''}`);
    setPatientMatches([]);
  };

  // Load Masters: Doctors, Agents, Tests, Panels, Packages, Latest Reg No.
  useEffect(() => {
    const loadMasters = async () => {
      try {
        const [docsRes, agentsRes, testsRes, panelsRes, pkgsRes, casesRes] = await Promise.all([
          doctorApi.listDoctors().catch(() => ({ success: false, data: [] })),
          mastersApi.listAgents().catch(() => ({ success: false, data: [] })),
          mastersApi.listTests({ limit: 500 }).catch(() => ({ success: false, data: [] })),
          mastersApi.listPanels().catch(() => ({ success: false, data: [] })),
          mastersApi.listPackages().catch(() => ({ success: false, data: [] })),
          casesApi.listCases({ limit: 1 }).catch(() => ({ success: false, data: { cases: [] } })),
        ]);

        if (casesRes?.success && casesRes?.data?.cases?.[0]?.billNumber) {
          setLastRegNo(casesRes.data.cases[0].billNumber);
        }

        if (docsRes.success && Array.isArray(docsRes.data) && docsRes.data.length > 0) {
          const mappedDocs = docsRes.data.map((d: any) => ({
            label: `${d.name}${d.degree ? `, ${d.degree}` : ''} (${d.specialty})`,
            value: d.id,
          }));
          setDoctorsList([
            ...mappedDocs,
            { label: 'Self Referral / Walk-in Patient', value: 'doc-self' },
          ]);
          setDoctorId(mappedDocs[0].value);
        }

        if (agentsRes.success && Array.isArray(agentsRes.data)) {
          const mappedAgents = agentsRes.data.map((a: any) => ({
            label: `${a.name}${a.zone ? ` (${a.zone})` : ''}`,
            value: a.id,
          }));
          setAgentsList([{ label: 'None / Direct Walk-in', value: '' }, ...mappedAgents]);
        }

        const merged: CatalogEntry[] = [];
        if (testsRes.success && Array.isArray(testsRes.data) && testsRes.data.length > 0) {
          testsRes.data.forEach((t: any) => {
            merged.push({
              key: `test:${t.id || t.code}`,
              id: t.id || t.code,
              itemType: 'test',
              code: t.code || t.id,
              name: t.name,
              department: t.department || t.category || 'Pathology',
              specimen: t.specimen || 'Serum',
              rate: Number(t.rate ?? t.price ?? 100),
              deliveryTime: `Within ${t.tatHours || 4}h`,
            });
          });
        } else {
          merged.push(...FALLBACK_TESTS);
        }

        if (panelsRes.success && Array.isArray(panelsRes.data)) {
          panelsRes.data.forEach((p: any) => {
            merged.push({
              key: `panel:${p.id}`,
              id: p.id,
              itemType: 'panel',
              code: p.name,
              name: p.name,
              department: p.department || p.category || 'Panel',
              specimen: 'Panel Group',
              rate: Number(p.panelPrice || 200),
              deliveryTime: 'Within 6h',
            });
          });
        }

        if (pkgsRes.success && Array.isArray(pkgsRes.data)) {
          pkgsRes.data.forEach((pkg: any) => {
            merged.push({
              key: `package:${pkg.id}`,
              id: pkg.id,
              itemType: 'package',
              code: pkg.code || pkg.id,
              name: pkg.name,
              department: 'Package',
              specimen: 'Package Bundle',
              rate: Number(pkg.packagePrice || pkg.retailPrice || 500),
              deliveryTime: 'Within 12h',
            });
          });
        }

        setCatalogEntries(merged);
      } catch (err) {
        console.error('Failed to load masters for NewBillPage:', err);
      }
    };

    loadMasters();
  }, []);

  // Computed Totals
  const grossAmount = selectedTests.reduce((acc, t) => acc + Math.max(0, t.rate - (t.discount || 0)), 0);
  const discountAmount =
    discountType === '₹' ? discountValue : (grossAmount * discountValue) / 100;
  const netPayable = Math.max(0, grossAmount - discountAmount + (Number(collectionCharge) || 0));
  const balanceDue = Math.max(0, netPayable - paidAmount);

  // Auto-sync paidAmount to netPayable whenever tests/discount/collectionCharge change unless manually edited
  useEffect(() => {
    if (!isPaidManuallyEdited) {
      setPaidAmount(Math.round(netPayable * 100) / 100);
      setAllowDue(false);
    }
  }, [netPayable, isPaidManuallyEdited]);

  const handlePrefixChange = (val: string) => {
    setPrefix(val as NamePrefix);
    if (FEMALE_PREFIXES.has(val)) setGender('Female');
    else if (MALE_PREFIXES.has(val)) setGender('Male');
  };

  const handleSearchPatientByMobile = async () => {
    const query = mobile.trim() || firstName.trim();
    if (!query) {
      showToast('Enter mobile number or name to search existing patients');
      return;
    }
    setIsSearchingPatients(true);
    try {
      const res = await patientApi.listPatients({ search: query, limit: 8 });
      const rows = res?.data?.patients || [];
      setPatientMatches(rows);
      if (rows.length === 0) showToast('No matching returning patient found');
    } catch {
      showToast('Unable to search patients right now');
    } finally {
      setIsSearchingPatients(false);
    }
  };

  const isEntryForModality = (item: CatalogEntry, activeModality: string) => {
    if (item.itemType === 'panel' || item.itemType === 'package') {
      return activeModality === 'LAB';
    }
    const searchable = `${item.code} ${item.name} ${item.department}`.toUpperCase();
    const matches = (pattern: RegExp) => pattern.test(searchable);
    switch (activeModality) {
      case 'LAB':
        return !matches(/USG|ULTRASOUND|SONOGRAPHY|XRAY|X-RAY|RADIOGRAPH|CT SCAN|\bCT\b|\bMRI\b|\bECG\b|ELECTROCARDIOGRAM|\bEEG\b|MAMMOGRAPH|\bOPG\b|ORTHOPANTOMOGRAM/);
      case 'OUTSOURCE LAB':
        return true;
      case 'USG':
        return matches(/USG|ULTRASOUND|SONOGRAPHY/);
      case 'DIGITAL XRAY':
      case 'XRAY':
        return matches(/XRAY|X-RAY|RADIOGRAPH/);
      case 'ECG':
        return matches(/\bECG\b|ELECTROCARDIOGRAM/);
      case 'CT SCAN':
        return matches(/CT SCAN|\bCT\b|COMPUTED TOMOGRAPH/);
      case 'MRI':
        return matches(/\bMRI\b|MAGNETIC RESONANCE/);
      case 'EPS':
        return matches(/\bEPS\b|ELECTROPHYSIOLOG/);
      case 'OPG':
        return matches(/\bOPG\b|ORTHOPANTOMOGRAM/);
      case 'CARDIOLOGY':
        return matches(/CARDIOLOGY|ECHOCARDIO|\bTMT\b|HOLTER/);
      case 'EEG':
        return matches(/\bEEG\b|ELECTROENCEPHALOGRAM/);
      case 'MAMMOGRAPHY':
        return matches(/MAMMOGRAPH|\bMAMMO\b/);
      default:
        return true;
    }
  };

  const filteredCatalog = useMemo(() => {
    const q = investigationSearch.trim().toLowerCase();
    return catalogEntries.filter((entry) => {
      if (!isEntryForModality(entry, modality)) return false;
      if (!q) return true;
      return (
        entry.name.toLowerCase().includes(q) ||
        entry.code.toLowerCase().includes(q) ||
        entry.department.toLowerCase().includes(q)
      );
    });
  }, [catalogEntries, modality, investigationSearch]);

  const handleAddCatalogEntry = (entry: CatalogEntry) => {
    if (selectedTests.some((t) => t.testId === entry.id || t.code === entry.code)) {
      showToast(`${entry.name} is already added`);
      return;
    }
    setSelectedTests((prev) => [
      ...prev,
      {
        testId: entry.id,
        itemType: entry.itemType,
        code: entry.code,
        name: entry.name,
        department: entry.department,
        specimen: entry.specimen,
        rate: entry.rate,
        discount: 0,
        netAmount: entry.rate,
        deliveryTime: entry.deliveryTime,
      },
    ]);
    setInvestigationSearch('');
    setIsPickerOpen(false);
    showToast(`Added ${entry.name} (₹${entry.rate})`);
  };

  const handleSaveCase = async (nextAction: 'enter_results' | 'printable_bill') => {
    if (selectedTests.length === 0) {
      showToast('Please select at least one investigation, panel, or package');
      return;
    }
    const combinedName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (combinedName.length < 2) {
      showToast('Please enter patient first name');
      return;
    }
    const cleanMobile = mobile.trim();
    if (cleanMobile && !/^\d{10}$/.test(cleanMobile)) {
      showToast('Mobile number must be 10 digits (or leave blank)');
      return;
    }
    if (balanceDue > 0 && !allowDue) {
      showToast('Please click "Accept Due" or collect full payment');
      return;
    }

    setIsSaving(true);
    try {
      const parsedYears = Number(ageYears) || 0;
      const parsedMonths = Number(ageMonths) || 0;
      const parsedDays = Number(ageDays) || 0;
      let effectiveAge = Number(age) || 30;
      let effectiveUnit = ageUnit;
      if (parsedYears > 0) { effectiveAge = parsedYears; effectiveUnit = 'Years'; }
      else if (parsedMonths > 0) { effectiveAge = parsedMonths; effectiveUnit = 'Months'; }
      else if (parsedDays > 0) { effectiveAge = parsedDays; effectiveUnit = 'Days'; }

      const payload = {
        patient: {
          id: selectedPatientId,
          prefix,
          fullName: combinedName,
          age: effectiveAge,
          ageYears: parsedYears,
          ageMonths: parsedMonths,
          ageDays: parsedDays,
          ageUnit: effectiveUnit,
          gender,
          mobile: cleanMobile,
          email: email.trim() || undefined,
          address: address.trim() || undefined,
          aadhaar: aadhaar.trim() || undefined,
          medicalHistory: patientHistory.trim() || undefined,
          onlineReportRequested,
        },
        doctorId: doctorId || 'doc-self',
        agentId: collectionAgent || null,
        branchId,
        modality: modality || 'LAB',
        isUrgent,
        collectionTime,
        sampleCollectedAt: sampleCollectedAt.trim() || undefined,
        investigations: selectedTests.map((t) => ({
          testId: t.testId || t.code,
          itemType: t.itemType || 'test',
          name: t.name,
          rate: t.rate,
          department: t.department,
          discount: t.discount || 0,
        })),
        discountType: discountType === '%' ? 'percentage' : 'fixed',
        discountValue: Number(discountValue) || 0,
        discountReason: discountReason !== 'None' ? discountReason : defaultDiscountType,
        collectionCharge: Number(collectionCharge) || 0,
        paidAmount: Number(paidAmount) || 0,
        paymentMode,
        allowDue,
        sendSms,
        sendWhatsapp,
        notes: remarks.trim() || undefined,
      };

      const res = await casesApi.createCase(payload);
      if (res.success && res.data) {
        const created = res.data;
        localStorage.setItem('labsmart_active_case_id', created.id);
        localStorage.setItem('labsmart_active_bill_number', created.billNumber);
        setLastRegNo(created.billNumber);
        showToast(`Bill #${created.billNumber} created! Daily Code: ${created.dailyCode}`);
        setTimeout(() => {
          if (nextAction === 'enter_results') onSaveAndEnterResults();
          else onSaveAndPrintBill();
        }, 500);
      } else {
        showToast(res.message || 'Error generating bill');
      }
    } catch (err: any) {
      console.error('Failed to create case:', err);
      showToast(err?.message || 'Could not create the bill. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Keyboard shortcuts: F2 = Save & Enter Results, F3 = Save & Print Bill
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'F2') {
        e.preventDefault();
        if (!isSaving) handleSaveCase('enter_results');
      } else if (e.key === 'F3') {
        e.preventDefault();
        if (!isSaving) handleSaveCase('printable_bill');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleSaveDoctor = async (doc: DoctorData) => {
    try {
      const res = await doctorApi.createDoctor({
        name: doc.name,
        degree: doc.qualification || 'MBBS',
        specialty: doc.speciality || 'General Medicine',
        mobile: doc.phone || `9${Math.floor(100000000 + Math.random() * 900000000)}`,
        email: '',
        commissionPct: Number(doc.incentivePercent) || 15,
      });
      if (res.success && res.data) {
        const created = res.data;
        const newEntry = {
          label: `${created.name}${created.degree ? `, ${created.degree}` : ''} (${created.specialty})`,
          value: created.id,
        };
        setDoctorsList((prev) => [newEntry, ...prev]);
        setDoctorId(created.id);
        showToast(`Doctor ${created.name} saved & selected!`);
        return;
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to save doctor');
    }
  };

  const handleConfirmRemoveTest = () => {
    if (!testToDelete) return;
    setSelectedTests((prev) => prev.filter((t) => t.code !== testToDelete.code));
    showToast(`Removed ${testToDelete.name}`);
    setTestToDelete(null);
  };

  const handleConfirmReset = () => {
    setSelectedPatientId(undefined);
    setPrefix('Mr.' as NamePrefix);
    setFirstName('');
    setLastName('');
    setAgeYears('');
    setAgeMonths(0);
    setAgeDays(0);
    setAge(0);
    setAgeUnit('Years');
    setGender('Male');
    setMobile('');
    setUhid('');
    setAadhaar('');
    setEmail('');
    setAddress('');
    setPatientHistory('');
    setShowEmail(false);
    setShowAddress(false);
    setShowAadhaar(false);
    setShowHistory(false);
    setShowSampleCollectedAt(false);
    setOnlineReportRequested(false);
    setDoctorId('doc-self');
    setModality('LAB');
    setBranchId('main');
    setCollectionAgent('');
    setSampleCollectedAt('');
    setIsUrgent(false);
    setAllowDue(false);
    setIsPaidManuallyEdited(false);
    setSelectedTests([]);
    setDiscountValue(0);
    setDiscountReason('None');
    setCollectionCharge(0);
    setPaidAmount(0);
    setPaymentMode('Cash');
    setRemarks('');
    setIsResetConfirmOpen(false);
    showToast('New bill form cleared');
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Sub-Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 className="h1-title">+ New bill</h2>
          <p className="text-muted" style={{ marginTop: '2px' }}>
            Register a patient, add tests/panels/packages, and collect payment in one workflow.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {lastRegNo && (
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155', backgroundColor: '#f1f5f9', padding: '6px 12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
              Last Reg. no. <strong>{lastRegNo}</strong>
            </span>
          )}
          <Button
            variant="secondary"
            size="sm"
            icon={<Settings size={14} />}
            onClick={() => setIsSettingsOpen(true)}
          >
            Settings
          </Button>
        </div>
      </div>

      {/* 2-Column Responsive Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 'var(--space-5)', alignItems: 'start' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
          {/* Card 1: Patient Details */}
          <Card title="1. Patient details">
            {/* Mobile Lookup Row */}
            <div style={{ marginBottom: 'var(--space-4)', position: 'relative' }}>
              <label className="form-label">Mobile number <span style={{ fontWeight: 400, color: '#64748b' }}>(Optional)</span></label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ padding: '8px 10px', backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#475569' }}>
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  className="input-control"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="10-digit mobile (search or enter new)"
                  style={{ flex: 1 }}
                />
                <button
                  type="button"
                  onClick={handleSearchPatientByMobile}
                  disabled={isSearchingPatients}
                  title="Search returning patient"
                  style={{
                    height: '38px',
                    padding: '0 14px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#f8fafc',
                    color: '#0284c7',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 600,
                  }}
                >
                  {isSearchingPatients ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <Search size={15} />}
                  <span>Lookup</span>
                </button>
              </div>
              {patientMatches.length > 0 && (
                <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 40, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 20px rgba(15,23,42,0.12)', marginTop: '4px', maxHeight: '220px', overflowY: 'auto' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 12px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '11px', fontWeight: 700, color: '#475569' }}>
                    <span>Select Returning Patient</span>
                    <button type="button" onClick={() => setPatientMatches([])} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                      <X size={14} />
                    </button>
                  </div>
                  {patientMatches.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => applySelectedPatient(p)}
                      style={{ width: '100%', textAlign: 'left', padding: '8px 12px', border: 'none', borderBottom: '1px solid #f1f5f9', backgroundColor: '#ffffff', cursor: 'pointer', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}
                    >
                      <span><strong>{p.prefix} {p.fullName}</strong> ({p.age}{p.ageUnit?.[0] || 'Y'}/{p.gender?.[0]})</span>
                      <span style={{ color: '#64748b', fontSize: '12px' }}>{p.mobile || p.uhid}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title*, First Name*, Last Name */}
            <div style={{ display: 'grid', gridTemplateColumns: '110px 1fr 1fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <Select
                label="Title *"
                value={prefix}
                onChange={(e) => handlePrefixChange(e.target.value)}
                options={PREFIX_OPTIONS}
              />
              <Input
                label="First name"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
              />
              <Input
                label="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name (optional)"
              />
            </div>

            {/* Age Triple-Field (Years, Months, Days) & Sex* */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1.6fr', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'start' }}>
              <Input
                label="Years"
                type="number"
                placeholder="Years"
                value={ageYears}
                onChange={(e) => {
                  const val = e.target.value;
                  setAgeYears(val);
                  if (Number(val) > 0) { setAge(Number(val)); setAgeUnit('Years'); }
                }}
              />
              <Input
                label="Months"
                type="number"
                placeholder="Months"
                value={ageMonths}
                onChange={(e) => {
                  const val = e.target.value;
                  setAgeMonths(val);
                  if (Number(ageYears) === 0 && Number(val) > 0) { setAge(Number(val)); setAgeUnit('Months'); }
                }}
              />
              <Input
                label="Days"
                type="number"
                placeholder="Days"
                value={ageDays}
                onChange={(e) => {
                  const val = e.target.value;
                  setAgeDays(val);
                  if (Number(ageYears) === 0 && Number(ageMonths) === 0 && Number(val) > 0) { setAge(Number(val)); setAgeUnit('Days'); }
                }}
              />
              <div className="form-group">
                <label className="form-label">Sex <span className="required">*</span></label>
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

            {/* Online Report Requested */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: 'var(--space-3)' }}>
              <input
                type="checkbox"
                id="onlineReport"
                checked={onlineReportRequested}
                onChange={(e) => setOnlineReportRequested(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px' }}
              />
              <label htmlFor="onlineReport" style={{ fontSize: '13px', color: 'var(--color-text-secondary)', cursor: 'pointer' }}>
                Online report requested
              </label>
            </div>

            {/* Expandable Optional Field Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: (showEmail || showAddress || showAadhaar || showHistory) ? 'var(--space-3)' : 0 }}>
              {!showEmail && (
                <button type="button" onClick={() => setShowEmail(true)} style={pillBtnStyle}>+ Email</button>
              )}
              {!showAddress && (
                <button type="button" onClick={() => setShowAddress(true)} style={pillBtnStyle}>+ Address</button>
              )}
              {!showAadhaar && (
                <button type="button" onClick={() => setShowAadhaar(true)} style={pillBtnStyle}>+ Aadhaar</button>
              )}
              {!showHistory && (
                <button type="button" onClick={() => setShowHistory(true)} style={pillBtnStyle}>+ Patient history</button>
              )}
            </div>

            {/* Expanded Optional Fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              {showEmail && (
                <div style={optionalFieldWrapper}>
                  <div style={optionalFieldHeader}>
                    <span className="form-label" style={{ margin: 0 }}>Email <span style={optionalBadge}>Optional</span></span>
                    <button type="button" onClick={() => { setShowEmail(false); setEmail(''); }} style={removeLinkBtn}>× Remove</button>
                  </div>
                  <input type="email" className="input-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patient@example.com" />
                </div>
              )}
              {showAadhaar && (
                <div style={optionalFieldWrapper}>
                  <div style={optionalFieldHeader}>
                    <span className="form-label" style={{ margin: 0 }}>Aadhaar Number (12 Digits) <span style={optionalBadge}>Optional</span></span>
                    <button type="button" onClick={() => { setShowAadhaar(false); setAadhaar(''); }} style={removeLinkBtn}>× Remove</button>
                  </div>
                  <input type="text" maxLength={12} className="input-control" value={aadhaar} onChange={(e) => setAadhaar(e.target.value)} placeholder="12-digit Aadhaar number" />
                </div>
              )}
              {showAddress && (
                <div style={optionalFieldWrapper}>
                  <div style={optionalFieldHeader}>
                    <span className="form-label" style={{ margin: 0 }}>Address <span style={optionalBadge}>Optional</span></span>
                    <button type="button" onClick={() => { setShowAddress(false); setAddress(''); }} style={removeLinkBtn}>× Remove</button>
                  </div>
                  <textarea rows={2} className="input-control" style={{ height: 'auto', padding: '8px 10px' }} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Patient residential address" />
                </div>
              )}
              {showHistory && (
                <div style={optionalFieldWrapper}>
                  <div style={optionalFieldHeader}>
                    <span className="form-label" style={{ margin: 0 }}>Patient history <span style={optionalBadge}>Optional</span></span>
                    <button type="button" onClick={() => { setShowHistory(false); setPatientHistory(''); }} style={removeLinkBtn}>× Remove</button>
                  </div>
                  <textarea rows={2} className="input-control" style={{ height: 'auto', padding: '8px 10px' }} value={patientHistory} onChange={(e) => setPatientHistory(e.target.value)} placeholder="Relevant clinical history / notes" />
                </div>
              )}
            </div>
          </Card>

          {/* Card 2: Case Details & Investigations */}
          <Card title="2. Case details">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1-5)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <label className="form-label">Referred By *</label>
                  <button
                    type="button"
                    onClick={() => setIsDoctorModalOpen(true)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 'var(--font-size-xs)', color: 'var(--color-primary-link)', fontWeight: 600 }}
                  >
                    + Add New
                  </button>
                </div>
                <Select value={doctorId} onChange={(e) => setDoctorId(e.target.value)} options={doctorsList} />
              </div>

              <Select
                label="Collection centre *"
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                options={[
                  { label: 'Main', value: 'main' },
                  { label: 'City Care Collection Center (AG-102)', value: 'ag102' },
                  { label: 'Sector 56 Phlebotomy Point (AG-105)', value: 'ag105' },
                ]}
              />

              <Select
                label="Sample collection agent"
                value={collectionAgent}
                onChange={(e) => setCollectionAgent(e.target.value)}
                options={agentsList}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'var(--space-3)', marginBottom: 'var(--space-4)', alignItems: 'end' }}>
              <div className="form-group">
                <label className="form-label">Collection Date & Time</label>
                <input type="datetime-local" className="input-control" value={collectionTime} onChange={(e) => setCollectionTime(e.target.value)} />
              </div>
              <label style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: isUrgent ? '#dc2626' : '#64748b', fontWeight: 600, cursor: 'pointer', paddingBottom: '8px' }}>
                <input type="checkbox" checked={isUrgent} onChange={(e) => setIsUrgent(e.target.checked)} />
                STAT / Urgent
              </label>
            </div>

            {/* Modality Selector */}
            <div style={{ marginBottom: 'var(--space-4)' }}>
              <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>Department / Case Type</label>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '6px' }}>
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
                    }}
                  >
                    {mod.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Searchable Multi-Select Combobox (Tests + Panels + Packages) */}
            <div ref={pickerRef} style={{ marginBottom: 'var(--space-4)', position: 'relative' }}>
              <label className="form-label" style={{ marginBottom: '6px', display: 'block' }}>
                Lab Investigations ({modality} — Tests, Panels & Packages)
              </label>
              <div style={{ position: 'relative' }}>
                <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  className="input-control"
                  style={{ paddingLeft: '32px' }}
                  placeholder="Type to search tests, panels, or packages (e.g. CBC, Lipid, Full Body)..."
                  value={investigationSearch}
                  onFocus={() => setIsPickerOpen(true)}
                  onChange={(e) => {
                    setInvestigationSearch(e.target.value);
                    setIsPickerOpen(true);
                  }}
                />
              </div>

              {isPickerOpen && (
                <div style={{ position: 'absolute', left: 0, right: 0, top: '100%', zIndex: 50, backgroundColor: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '8px', boxShadow: '0 10px 25px rgba(15, 23, 42, 0.14)', marginTop: '4px', maxHeight: '260px', overflowY: 'auto' }}>
                  {filteredCatalog.length === 0 ? (
                    <div style={{ padding: '14px', fontSize: '13px', color: '#64748b', textAlign: 'center' }}>
                      No matching tests, panels, or packages found for {modality}.
                    </div>
                  ) : (
                    filteredCatalog.slice(0, 60).map((entry) => {
                      const alreadyAdded = selectedTests.some((t) => t.testId === entry.id || t.code === entry.code);
                      return (
                        <button
                          key={entry.key}
                          type="button"
                          disabled={alreadyAdded}
                          onClick={() => handleAddCatalogEntry(entry)}
                          style={{
                            width: '100%',
                            textAlign: 'left',
                            padding: '9px 12px',
                            border: 'none',
                            borderBottom: '1px solid #f1f5f9',
                            backgroundColor: alreadyAdded ? '#f8fafc' : '#ffffff',
                            color: alreadyAdded ? '#94a3b8' : '#0f172a',
                            cursor: alreadyAdded ? 'default' : 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '13px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{
                              fontSize: '10px',
                              fontWeight: 700,
                              padding: '1px 6px',
                              borderRadius: '4px',
                              textTransform: 'uppercase',
                              backgroundColor: entry.itemType === 'package' ? '#fef3c7' : entry.itemType === 'panel' ? '#e0e7ff' : '#e0f2fe',
                              color: entry.itemType === 'package' ? '#b45309' : entry.itemType === 'panel' ? '#4338ca' : '#0369a1',
                            }}>
                              {entry.itemType}
                            </span>
                            <span style={{ fontWeight: 500 }}>{entry.name}</span>
                          </div>
                          <span style={{ fontWeight: 600, color: '#0284c7' }}>Rs.{entry.rate}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Selected Chips */}
            {selectedTests.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: 'var(--space-3)' }}>
                {selectedTests.map((t) => (
                  <span
                    key={t.code}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '4px 10px',
                      borderRadius: '16px',
                      backgroundColor: '#eff6ff',
                      border: '1px solid #bfdbfe',
                      fontSize: '12px',
                      fontWeight: 600,
                      color: '#1e40af',
                    }}
                  >
                    <span>{t.name} (Rs.{t.rate})</span>
                    <button
                      type="button"
                      onClick={() => setTestToDelete(t)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1e40af', padding: 0, display: 'flex' }}
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Selected Investigations Table */}
            <div className="table-container" style={{ marginBottom: 'var(--space-3)' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Investigation</th>
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
                      <td style={{ textAlign: 'right', fontWeight: 600 }}>₹{test.rate.toFixed(2)}</td>
                      <td style={{ textAlign: 'center' }}>
                        <button type="button" className="btn-icon" onClick={() => setTestToDelete(test)} title="Remove">
                          <Trash2 size={16} color="var(--color-danger)" />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {selectedTests.length === 0 && (
                    <tr>
                      <td colSpan={5} style={{ textAlign: 'center', padding: 'var(--space-5)', color: 'var(--text-secondary)' }}>
                        No investigations added. Search tests, panels, or packages above.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Expandable + Sample collected at */}
            {!showSampleCollectedAt ? (
              <button type="button" onClick={() => setShowSampleCollectedAt(true)} style={pillBtnStyle}>
                + Sample collected at
              </button>
            ) : (
              <div style={optionalFieldWrapper}>
                <div style={optionalFieldHeader}>
                  <span className="form-label" style={{ margin: 0 }}>Sample Collected At <span style={optionalBadge}>Optional</span></span>
                  <button type="button" onClick={() => { setShowSampleCollectedAt(false); setSampleCollectedAt(''); }} style={removeLinkBtn}>× Remove</button>
                </div>
                <input type="text" className="input-control" value={sampleCollectedAt} onChange={(e) => setSampleCollectedAt(e.target.value)} placeholder="Home / Ward / Collection Point" />
              </div>
            )}
          </Card>
        </div>

        {/* RIGHT COLUMN: Payment Details */}
        <div style={{ position: 'sticky', top: 'calc(var(--topbar-height) + var(--space-4))' }}>
          <Card title="3. Payment details">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-sm)' }}>
                <span className="text-muted">Total:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-headings)' }}>Rs. {grossAmount.toFixed(2)}</span>
              </div>

              {/* Discount */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="text-muted">Discount:</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                    <PillGroup
                      value={discountType}
                      onChange={(t) => setDiscountType(t)}
                      options={[{ label: '₹', value: '₹' }, { label: '%', value: '%' }]}
                    />
                    <input
                      type="number"
                      min={0}
                      className="input-control"
                      style={{ width: '80px', height: '32px', textAlign: 'right', fontWeight: 700 }}
                      value={discountValue}
                      onChange={(e) => setDiscountValue(Math.max(0, Number(e.target.value)))}
                    />
                  </div>
                </div>
                {discountValue > 0 && (
                  <select className="select-control" value={discountReason} onChange={(e) => setDiscountReason(e.target.value)} style={{ fontSize: '12px' }}>
                    <option value="None">Default ({defaultDiscountType})</option>
                    <option value="Doctor Referral Discount">Doctor Referral Discount</option>
                    <option value="Senior Citizen Concession">Senior Citizen Concession</option>
                    <option value="Staff / Relative">Staff / Relative Concession</option>
                    <option value="Special Request">Special Management Approval</option>
                    <option value="Corporate Package">Corporate / Camp Package</option>
                  </select>
                )}
              </div>

              {/* Collection Charge */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="text-muted">Collection Charge (₹):</span>
                <input
                  type="number"
                  min={0}
                  className="input-control"
                  style={{ width: '96px', height: '32px', textAlign: 'right', fontWeight: 600 }}
                  value={collectionCharge}
                  onChange={(e) => setCollectionCharge(Math.max(0, Number(e.target.value)))}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'var(--font-size-base)', fontWeight: 700 }}>
                <span>Net Payable:</span>
                <span style={{ color: 'var(--color-primary-link)', fontSize: 'var(--font-size-lg)' }}>Rs. {netPayable.toFixed(2)}</span>
              </div>
            </div>

            {/* Amount Received & Payment Mode */}
            <div style={{ padding: 'var(--space-4) 0', borderBottom: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Amount received (₹) *</label>
                  {isPaidManuallyEdited && (
                    <button
                      type="button"
                      onClick={() => { setIsPaidManuallyEdited(false); setPaidAmount(Math.round(netPayable * 100) / 100); setAllowDue(false); }}
                      style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '11px', fontWeight: 600, cursor: 'pointer' }}
                    >
                      Pay Full
                    </button>
                  )}
                </div>
                <input
                  type="number"
                  min={0}
                  className="input-control"
                  value={paidAmount}
                  onChange={(e) => {
                    setIsPaidManuallyEdited(true);
                    setPaidAmount(Math.max(0, Number(e.target.value)));
                  }}
                  style={{ fontSize: 'var(--font-size-lg)', fontWeight: 700, color: 'var(--color-primary)' }}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mode</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {(['Cash', 'UPI', 'Card', 'Insurance', 'Cheque', 'NEFT'] as const).map((mode) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setPaymentMode(mode)}
                      style={{
                        padding: '6px 12px',
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

              <Input
                label="Remarks"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Optional billing remarks"
              />

              {/* Balance Display */}
              <div
                style={{
                  padding: 'var(--space-3)',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: balanceDue === 0 ? 'var(--color-success-bg)' : 'var(--color-danger-bg)',
                  border: `1px solid ${balanceDue === 0 ? 'var(--color-success-border)' : 'var(--color-danger-border)'}`,
                  color: balanceDue === 0 ? 'var(--color-success)' : 'var(--color-danger)',
                  fontSize: 'var(--font-size-sm)',
                  fontWeight: 700,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <span>{balanceDue === 0 ? '✓ Fully Paid' : '⚠ Balance Due:'}</span>
                <span>Rs. {balanceDue.toFixed(2)}</span>
              </div>

              {balanceDue > 0 && (
                <div style={{ padding: '10px 12px', backgroundColor: '#fffbeb', borderRadius: '6px', border: '1px solid #fde68a' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: '#92400e' }}>
                    <input type="checkbox" checked={allowDue} onChange={(e) => setAllowDue(e.target.checked)} />
                    Accept Due (₹{balanceDue.toFixed(2)} balance)
                  </label>
                </div>
              )}
            </div>

            {/* Notification Checkboxes */}
            <div style={{ padding: 'var(--space-3) 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', fontSize: 'var(--font-size-xs)', color: 'var(--text-secondary)' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={sendSms} onChange={(e) => setSendSms(e.target.checked)} /> Send Bill Receipt SMS to patient
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', cursor: 'pointer' }}>
                <input type="checkbox" checked={sendWhatsapp} onChange={(e) => setSendWhatsapp(e.target.checked)} /> Send WhatsApp updates on report release
              </label>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2-5)', marginTop: 'var(--space-2)' }}>
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
              <button
                type="button"
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '12px', fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '4px' }}
                onClick={() => setIsResetConfirmOpen(true)}
              >
                <RotateCcw size={13} />
                <span>Reset / Clear Form</span>
              </button>
            </div>
          </Card>
        </div>
      </div>

      {/* Settings Modal */}
      <Modal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} title="Billing Settings" size="sm">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <Select
            label="Choose default discount type"
            value={defaultDiscountType}
            onChange={(e) => setDefaultDiscountType(e.target.value)}
            options={[
              { label: 'Centre discount', value: 'Centre discount' },
              { label: 'Referrer discount', value: 'Referrer discount' },
              { label: 'Equal split discount', value: 'Equal split discount' },
            ]}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <Button variant="secondary" onClick={() => setIsSettingsOpen(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={() => {
                localStorage.setItem('labsmart_default_discount_type', defaultDiscountType);
                setIsSettingsOpen(false);
                showToast(`Default discount type saved: ${defaultDiscountType}`);
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Toast Notification */}
      {toastMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', zIndex: 100, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <DoctorModal isOpen={isDoctorModalOpen} onClose={() => setIsDoctorModalOpen(false)} onSave={handleSaveDoctor} />

      {testToDelete && (
        <ConfirmationModal
          isOpen={!!testToDelete}
          onClose={() => setTestToDelete(null)}
          onConfirm={handleConfirmRemoveTest}
          title="Remove Investigation?"
          message={`Are you sure you want to remove "${testToDelete.name}" from this bill?`}
          confirmLabel="Remove"
          cancelLabel="Keep"
          variant="danger"
        />
      )}

      {isResetConfirmOpen && (
        <ConfirmationModal
          isOpen={isResetConfirmOpen}
          onClose={() => setIsResetConfirmOpen(false)}
          onConfirm={handleConfirmReset}
          title="Clear Bill Form?"
          message="Are you sure you want to discard all entered patient details, selected investigations, and financial values?"
          confirmLabel="Clear All"
          cancelLabel="Continue Editing"
          variant="warning"
        />
      )}
    </div>
  );
};

const pillBtnStyle: React.CSSProperties = {
  padding: '5px 12px',
  borderRadius: '16px',
  border: '1px dashed #94a3b8',
  backgroundColor: '#f8fafc',
  color: '#0284c7',
  fontSize: '12px',
  fontWeight: 600,
  cursor: 'pointer',
};

const optionalFieldWrapper: React.CSSProperties = {
  padding: '10px 12px',
  borderRadius: '8px',
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const optionalFieldHeader: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const optionalBadge: React.CSSProperties = {
  fontSize: '10px',
  fontWeight: 600,
  padding: '1px 6px',
  borderRadius: '4px',
  backgroundColor: '#e2e8f0',
  color: '#475569',
  marginLeft: '6px',
};

const removeLinkBtn: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: '#dc2626',
  fontSize: '11px',
  fontWeight: 600,
  cursor: 'pointer',
};
