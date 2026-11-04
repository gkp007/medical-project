import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { MultiSelectCombobox, MultiSelectOption } from '../../components/atoms/MultiSelectCombobox';
import {
  Plus,
  Edit3,
  Search,
  CheckCircle2,
  HelpCircle,
  MoreVertical,
  PlayCircle,
} from 'lucide-react';

interface TestPackageItem {
  id: string;
  sNo: number;
  name: string;
  fee: number;
  forGender: 'Both' | 'Male' | 'Female';
  includedTests: string;
  includedPanels?: string;
  inRatelist: boolean;
  hideInterpretation?: boolean;
  hideMethodInstrument?: boolean;
}

// Master list of individual clinical tests
const MASTER_PACKAGE_TEST_OPTIONS: MultiSelectOption[] = [
  { label: 'Differential Leucocyte Count', value: 'Differential Leucocyte Count', category: 'Haematology' },
  { label: 'Hemoglobin', value: 'Hemoglobin', category: 'Haematology' },
  { label: 'Total Leukocyte Count', value: 'Total Leukocyte Count', category: 'Haematology' },
  { label: 'Erythrocyte Sedimentation Rate (ESR)', value: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Haematology' },
  { label: 'Platelet Count', value: 'Platelet Count', category: 'Haematology' },
  { label: 'Fasting Blood Sugar (FBS)', value: 'Fasting Blood Sugar (FBS)', category: 'Biochemistry' },
  { label: 'Post Prandial Blood Sugar (PPBS)', value: 'Post Prandial Blood Sugar (PPBS)', category: 'Biochemistry' },
  { label: 'Random Blood Sugar (RBS)', value: 'Random Blood Sugar (RBS)', category: 'Biochemistry' },
  { label: 'Serum Creatinine', value: 'Serum Creatinine', category: 'Biochemistry' },
  { label: 'Serum Urea / BUN', value: 'Serum Urea / BUN', category: 'Biochemistry' },
  { label: 'Serum Uric Acid', value: 'Serum Uric Acid', category: 'Biochemistry' },
  { label: 'Serum Bilirubin (Total & Direct)', value: 'Serum Bilirubin (Total & Direct)', category: 'Biochemistry' },
  { label: 'SGPT (ALT)', value: 'SGPT (ALT)', category: 'Biochemistry' },
  { label: 'SGOT (AST)', value: 'SGOT (AST)', category: 'Biochemistry' },
  { label: 'Serum Alkaline Phosphatase (ALP)', value: 'Serum Alkaline Phosphatase (ALP)', category: 'Biochemistry' },
  { label: 'Serum Calcium', value: 'Serum Calcium', category: 'Biochemistry' },
  { label: 'Serum Phosphorus', value: 'Serum Phosphorus', category: 'Biochemistry' },
  { label: 'Serum Ferritin', value: 'Serum Ferritin', category: 'Biochemistry' },
  { label: 'Vitamin B12 (Cyanocobalamin)', value: 'Vitamin B12 (Cyanocobalamin)', category: 'Biochemistry' },
  { label: '25-Hydroxy Vitamin D (Total)', value: '25-Hydroxy Vitamin D (Total)', category: 'Biochemistry' },
  { label: 'HbA1c (Glycosylated Hemoglobin)', value: 'HbA1c (Glycosylated Hemoglobin)', category: 'Biochemistry' },
  { label: 'Urine Routine Examination', value: 'Urine Routine Examination', category: 'Clinical Pathology' },
  { label: 'C-Reactive Protein (CRP Quantitative)', value: 'C-Reactive Protein (CRP Quantitative)', category: 'Serology' },
  { label: 'Thyroid-Stimulating Hormone, TSH', value: 'Thyroid-Stimulating Hormone, TSH', category: 'Endocrinology' },
  { label: 'Blood Group & Rh.', value: 'Blood Group & Rh.', category: 'Haematology' },
  { label: 'Bleeding Time & Clotting Time (BT/CT)', value: 'Bleeding Time & Clotting Time (BT/CT)', category: 'Haematology' },
  { label: 'Peripheral Blood Smear (GBP)', value: 'Peripheral Blood Smear (GBP)', category: 'Haematology' },
];

// Master list of composite test panels (multi-test groups)
const MASTER_PACKAGE_PANEL_OPTIONS: MultiSelectOption[] = [
  { label: 'Blood Sugar Fasting & PP', value: 'Blood Sugar Fasting & PP', category: 'Biochemistry' },
  { label: 'Complete Blood Count (CBC)', value: 'Complete Blood Count (CBC)', category: 'Haematology' },
  { label: 'CBC with ESR', value: 'CBC with ESR', category: 'Haematology' },
  { label: 'Liver Function Test (LFT)', value: 'Liver Function Test (LFT)', category: 'Biochemistry' },
  { label: 'Lipid Profile Screen', value: 'Lipid Profile Screen', category: 'Biochemistry' },
  { label: 'Kidney Function Test (KFT)', value: 'Kidney Function Test (KFT)', category: 'Biochemistry' },
  { label: 'Thyroid Function Test (T3, T4, TSH)', value: 'Thyroid Function Test (T3, T4, TSH)', category: 'Endocrinology' },
  { label: 'Serum Electrolytes (Na+, K+, Cl-)', value: 'Serum Electrolytes (Na+, K+, Cl-)', category: 'Biochemistry' },
  { label: 'Iron Studies / Iron Profile', value: 'Iron Studies / Iron Profile', category: 'Biochemistry' },
  { label: 'Coagulation Profile (PT/INR, APTT)', value: 'Coagulation Profile (PT/INR, APTT)', category: 'Haematology' },
  { label: 'Widal Test Panel', value: 'Widal Test Panel', category: 'Serology' },
  { label: 'Fever Profile (Malaria, Typhoid, Dengue)', value: 'Fever Profile (Malaria, Typhoid, Dengue)', category: 'Serology' },
  { label: 'Torch Profile', value: 'Torch Profile', category: 'Serology' },
  { label: 'Viral Markers Screen (HIV, HBsAg, HCV)', value: 'Viral Markers Screen (HIV, HBsAg, HCV)', category: 'Serology' },
];

interface PackagesPageProps {
  onNavigate?: (screen: string) => void;
}

export const PackagesPage: React.FC<PackagesPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'in_ratelist' | 'not_in_ratelist'>('in_ratelist');
  const [searchQuery, setSearchQuery] = useState('');

  const [packages, setPackages] = useState<TestPackageItem[]>([
    {
      id: '0',
      sNo: 1,
      name: 'HB, TLC, DLC',
      fee: 150,
      forGender: 'Both',
      includedTests: 'Differential Leucocyte Count, Hemoglobin, Total Leukocyte Count',
      includedPanels: 'Blood Sugar Fasting & PP',
      inRatelist: true,
    },
    {
      id: '1',
      sNo: 2,
      name: 'Anemia package',
      fee: 1200,
      forGender: 'Both',
      includedTests:
        'C-Reactive Protein, CRP (Quantitative), Folic Acid, Vitamin B12, Transferrin Saturation, Total Iron Binding Capacity (TIBC), Reticulocyte Count, Iron, Ferritin',
      includedPanels: 'CBC with ESR',
      inRatelist: true,
    },
    {
      id: '2',
      sNo: 2,
      name: 'Antenatal Package',
      fee: 1500,
      forGender: 'Female',
      includedTests:
        'Urine Routine Examination, Thyroid-Stimulating Hormone, TSH, Random Blood Sugar, Prolactin, Blood Group & Rh., Viral Marker, CBC (with absolute counts)',
      inRatelist: true,
    },
    {
      id: '3',
      sNo: 3,
      name: 'Arthritis Package',
      fee: 1800,
      forGender: 'Both',
      includedTests:
        'C-Reactive Protein, CRP (Quantitative), C3 Complement, Anti Nuclear Antibody (ANA) by ELISA, Urine Routine Examination, Total Iron Binding Capacity (TIBC), TSH, Serum Uric Acid, Rheumatoid Factor, RA, ASO Titer, Vitamin D, CBC with ESR',
      inRatelist: true,
    },
    {
      id: '4',
      sNo: 4,
      name: 'Bad Obstetric History (BOH) Package',
      fee: 3500,
      forGender: 'Female',
      includedTests:
        'Thyroid-Stimulating Hormone, TSH, Lupus Anticoagulant (DRVVT), Beta 2 Glycoprotein 1, IgM, Beta 2 Glycoprotein 1, IgG, Anti Phospholipid IgM, Anti Phospholipid IgG, ANA by ELISA, Torch Profile',
      inRatelist: true,
    },
    {
      id: '5',
      sNo: 5,
      name: 'CBC with GBP',
      fee: 550,
      forGender: 'Both',
      includedTests: 'Peripheral Blood Smear, Complete Blood Count (CBC)',
      inRatelist: true,
    },
    {
      id: '6',
      sNo: 6,
      name: 'Cardiac package',
      fee: 2200,
      forGender: 'Both',
      includedTests:
        'CK-MB, Myoglobin, High-Sensitivity C-Reactive Protein, Creatine Kinase, HbA1c (Glycosylated Hemoglobin), Lipid Profile, CBC (with absolute counts)',
      inRatelist: true,
    },
    {
      id: '7',
      sNo: 7,
      name: 'Diabetic package',
      fee: 999,
      forGender: 'Both',
      includedTests:
        'Urine Routine Examination, Serum Uric Acid, Serum Urea, Serum Creatinine, HbA1c (Glycosylated Hemoglobin), Lipid Profile, Blood Sugar Fasting & PP',
      inRatelist: true,
    },
    {
      id: '8',
      sNo: 8,
      name: 'Dialysis package',
      fee: 1400,
      forGender: 'Both',
      includedTests:
        'Urine Routine Examination, Serum Urea, Serum Sodium, Serum Potassium, Serum Creatinine, Serum Chloride, Random Blood Sugar, iCalcium, BUN, CBC',
      inRatelist: true,
    },
    {
      id: '9',
      sNo: 9,
      name: 'Fever package',
      fee: 850,
      forGender: 'Both',
      includedTests:
        'Urine Routine Examination, Typhidot Antibodies, Malaria Antigen, Dengue (Card Method), CBC with ESR',
      inRatelist: true,
    },
    {
      id: '10',
      sNo: 10,
      name: 'Fitness Package',
      fee: 2100,
      forGender: 'Both',
      includedTests:
        'Vitamin B12, Urine Routine Examination, Random Blood Sugar, HbA1c, 25 Hydroxy (OH) Vitamin D, Thyroid Function Test (TFT), Liver Function Test (LFT), Lipid Profile, Kidney Function Test (KFT), Iron Studies, CBC',
      inRatelist: true,
    },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [selectedPkg, setSelectedPkg] = useState<TestPackageItem | null>(null);
  const [pkgToDelete, setPkgToDelete] = useState<TestPackageItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('HB, TLC, DLC');
  const [formFee, setFormFee] = useState<number>(150);
  const [formGender, setFormGender] = useState<'Both' | 'Male' | 'Female'>('Both');
  const [formTests, setFormTests] = useState<string[]>([
    'Differential Leucocyte Count',
    'Hemoglobin',
    'Total Leukocyte Count',
  ]);
  const [formPanels, setFormPanels] = useState<string[]>(['Blood Sugar Fasting & PP']);
  const [hideInterpretation, setHideInterpretation] = useState<boolean>(true);
  const [hideMethodInstrument, setHideMethodInstrument] = useState<boolean>(false);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormFee(150);
    setFormGender('Both');
    setFormTests(['Differential Leucocyte Count', 'Hemoglobin', 'Total Leukocyte Count']);
    setFormPanels(['Blood Sugar Fasting & PP']);
    setHideInterpretation(true);
    setHideMethodInstrument(false);
    setModalMode('create');
  };

  const handleOpenEdit = (pkg: TestPackageItem) => {
    setSelectedPkg(pkg);
    setFormName(pkg.name);
    setFormFee(pkg.fee);
    setFormGender(pkg.forGender);
    const parsedTests = pkg.includedTests ? pkg.includedTests.split(',').map((s) => s.trim()).filter(Boolean) : [];
    const parsedPanels = pkg.includedPanels ? pkg.includedPanels.split(',').map((s) => s.trim()).filter(Boolean) : [];
    setFormTests(parsedTests);
    setFormPanels(parsedPanels);
    setHideInterpretation(pkg.hideInterpretation ?? true);
    setHideMethodInstrument(pkg.hideMethodInstrument ?? false);
    setModalMode('edit');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const joinedTests = formTests.join(', ');
    const joinedPanels = formPanels.join(', ');

    if (modalMode === 'create') {
      const newPkg: TestPackageItem = {
        id: String(Date.now()),
        sNo: packages.length + 1,
        name: formName,
        fee: Number(formFee) || 0,
        forGender: formGender,
        includedTests: joinedTests,
        includedPanels: joinedPanels,
        inRatelist: true,
        hideInterpretation,
        hideMethodInstrument,
      };
      setPackages([...packages, newPkg]);
      showToast(`Package "${newPkg.name}" added successfully.`);
    } else if (modalMode === 'edit' && selectedPkg) {
      setPackages((prev) =>
        prev.map((p) =>
          p.id === selectedPkg.id
            ? {
                ...p,
                name: formName,
                fee: Number(formFee),
                forGender: formGender,
                includedTests: joinedTests,
                includedPanels: joinedPanels,
                hideInterpretation,
                hideMethodInstrument,
              }
            : p
        )
      );
      showToast(`Package "${formName}" updated.`);
    }
    setModalMode(null);
  };

  const handleConfirmDelete = () => {
    if (!pkgToDelete) return;
    setPackages((prev) => prev.filter((p) => p.id !== pkgToDelete.id));
    showToast(`Package "${pkgToDelete.name}" deleted.`);
    setPkgToDelete(null);
  };

  const handleToggleRatelist = (pkg: TestPackageItem) => {
    setPackages((prev) =>
      prev.map((p) => (p.id === pkg.id ? { ...p, inRatelist: !p.inRatelist } : p))
    );
    showToast(`Moved package "${pkg.name}" to ${pkg.inRatelist ? 'Not in ratelist' : 'In ratelist'}.`);
  };

  // Filtered packages
  const inRatelistCount = packages.filter((p) => p.inRatelist).length;
  const notInRatelistCount = packages.filter((p) => !p.inRatelist).length;

  const filteredPackages = packages.filter((p) => {
    const matchesTab = activeTab === 'in_ratelist' ? p.inRatelist : !p.inRatelist;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.includedTests.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
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

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test packages
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => showToast('Opening test packages tutorial...')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <PlayCircle size={15} color="#0284c7" />
            <span>How it works?</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* Segmented Tabs & Search */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('in_ratelist')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'in_ratelist' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'in_ratelist' ? '#0284c7' : '#ffffff',
              color: activeTab === 'in_ratelist' ? '#ffffff' : '#475569',
            }}
          >
            In ratelist {inRatelistCount}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('not_in_ratelist')}
            style={{
              padding: '6px 16px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              border: activeTab === 'not_in_ratelist' ? '1px solid #0284c7' : '1px solid #cbd5e1',
              backgroundColor: activeTab === 'not_in_ratelist' ? '#0284c7' : '#ffffff',
              color: activeTab === 'not_in_ratelist' ? '#ffffff' : '#475569',
            }}
          >
            Not in ratelist {notInRatelistCount}
          </button>
        </div>

        {/* Search in page */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
          />
        </div>
      </div>

      {/* Packages Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '70px' }}>S. NO.</th>
              <th style={{ width: '220px' }}>NAME</th>
              <th style={{ width: '110px' }}>FEE</th>
              <th style={{ width: '120px' }}>FOR GENDER</th>
              <th>INCLUDED TESTS AND PANELS</th>
              <th style={{ width: '110px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No test packages matching current view.
                </td>
              </tr>
            ) : (
              filteredPackages.map((p, idx) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{idx + 1}.</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                      {p.name}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600, color: '#334155', fontSize: '13px' }}>
                    Rs.{p.fee}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: p.forGender === 'Both' ? '#f1f5f9' : p.forGender === 'Female' ? '#fdf2f8' : '#eff6ff',
                        color: p.forGender === 'Both' ? '#475569' : p.forGender === 'Female' ? '#db2777' : '#2563eb',
                      }}
                    >
                      {p.forGender}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5 }}>
                    <div>{p.includedTests}</div>
                    {p.includedPanels && (
                      <div style={{ color: '#0284c7', fontWeight: 600, marginTop: '2px' }}>
                        <span style={{ color: '#64748b', fontWeight: 500 }}>Panels: </span>
                        {p.includedPanels}
                      </div>
                    )}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#0284c7',
                          fontSize: '13px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>

                      {/* Dropdown Menu */}
                      <div style={{ position: 'relative' }}>
                        <button
                          type="button"
                          className="btn-icon"
                          onClick={() => setActiveMenuId(activeMenuId === p.id ? null : p.id)}
                          title="Actions"
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuId === p.id && (
                          <div
                            style={{
                              position: 'absolute',
                              right: 0,
                              top: '100%',
                              marginTop: '4px',
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '6px',
                              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                              zIndex: 50,
                              minWidth: '160px',
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '4px 0',
                              textAlign: 'left',
                            }}
                          >
                            <button
                              type="button"
                              style={{
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#334155',
                              }}
                              onClick={() => {
                                setActiveMenuId(null);
                                handleToggleRatelist(p);
                              }}
                            >
                              {p.inRatelist ? 'Remove from Ratelist' : 'Add to Ratelist'}
                            </button>
                            <button
                              type="button"
                              style={{
                                padding: '8px 12px',
                                background: 'none',
                                border: 'none',
                                fontSize: '12px',
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: '#dc2626',
                                borderTop: '1px solid #f1f5f9',
                              }}
                              onClick={() => {
                                setActiveMenuId(null);
                                setPkgToDelete(p);
                              }}
                            >
                              Delete Package
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Package Form Modal matching exact Labsmart live screen */}
      {modalMode && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add test package' : 'Edit test panel'}
          maxWidth="640px"
        >
          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                A test package is made up of individual tests and panels. If you find any tests or panels missing, please add them before creating the package.
              </p>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '14px 0 0 0' }} />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                Name
              </label>
              <input
                type="text"
                required
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                Fee
              </label>
              <input
                type="number"
                value={formFee}
                onChange={(e) => setFormFee(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#334155', marginBottom: '6px' }}>
                Bill only for gender
              </label>
              <select
                value={formGender}
                onChange={(e) => setFormGender(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  fontSize: '14px',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  boxSizing: 'border-box',
                }}
              >
                <option value="Both">Both</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div>
              <MultiSelectCombobox
                label="Tests"
                rightLabel={
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        setModalMode(null);
                        onNavigate('test_master');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    View all ↗
                  </button>
                }
                placeholder="Select tests..."
                options={MASTER_PACKAGE_TEST_OPTIONS}
                selectedValues={formTests}
                onChange={setFormTests}
              />
            </div>

            <div>
              <MultiSelectCombobox
                label="Panels"
                rightLabel={
                  <button
                    type="button"
                    onClick={() => {
                      if (onNavigate) {
                        setModalMode(null);
                        onNavigate('test_panels');
                      }
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '13px',
                      fontWeight: 500,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    View all ↗
                  </button>
                }
                placeholder="Select panels..."
                options={MASTER_PACKAGE_PANEL_OPTIONS}
                selectedValues={formPanels}
                onChange={setFormPanels}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '8px' }}>
              <button
                type="submit"
                style={{
                  backgroundColor: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '9px 22px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setModalMode(null)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '9px 20px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Delete Confirmation Modal */}
      {pkgToDelete && (
        <ConfirmationModal
          isOpen={!!pkgToDelete}
          onClose={() => setPkgToDelete(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Test Package?"
          message={`Are you sure you want to permanently delete the package "${pkgToDelete.name}"? This will not affect previously generated historical patient bills.`}
          confirmLabel="Delete Package"
          cancelLabel="Keep Package"
          variant="danger"
        />
      )}
    </div>
  );
};
