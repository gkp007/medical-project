import React, { useState, useMemo } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Modal } from '../../components/atoms/Modal';
import { MultiSelectCombobox, MultiSelectOption } from '../../components/atoms/MultiSelectCombobox';
import { PANELS_LIBRARY_DATA, TESTS_LIBRARY_DATA, LibraryItem } from '../lab/InterpretationsLibraryPage';
import {
  Plus,
  HelpCircle,
  Search,
  CheckCircle2,
  Edit2,
  Eye,
  Layers,
  Sparkles,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  Image,
  ExternalLink,
  Copy,
  Check,
  X,
  FileText,
} from 'lucide-react';

interface TestPanelsPageProps {
  onNavigate?: (screen: string) => void;
}

interface TestPanelItem {
  id: string;
  order: number;
  name: string;
  category: string;
  price?: number;
  tests: string[];
  testsCount: number;
  ratelistEntries: string;
  hideInterpretation?: boolean;
  hideMethodInstrument?: boolean;
  interpretation?: string;
}

// Master list of clinical tests available in Labsmart database
const MASTER_TEST_OPTIONS: MultiSelectOption[] = [
  { label: 'Serum Phosphorus', value: 'Serum Phosphorus', category: 'Biochemistry' },
  { label: 'FNAC (Fine Needle Aspiration)', value: 'FNAC (Fine Needle Aspiration)', category: 'Cytology' },
  { label: "Gram's Stain", value: "Gram's Stain", category: 'Microbiology' },
  { label: 'Hemoglobin', value: 'Hemoglobin', category: 'Haematology' },
  { label: 'Widal (Tube Method)', value: 'Widal (Tube Method)', category: 'Serology' },
  { label: 'Total Leukocyte Count (TLC)', value: 'Total Leukocyte Count (TLC)', category: 'Haematology' },
  { label: 'Differential Leucocyte Count (DLC)', value: 'Differential Leucocyte Count (DLC)', category: 'Haematology' },
  { label: 'Platelet Count', value: 'Platelet Count', category: 'Haematology' },
  { label: 'Total RBC Count', value: 'Total RBC Count', category: 'Haematology' },
  { label: 'Hematocrit Value (Hct / PCV)', value: 'Hematocrit Value (Hct / PCV)', category: 'Haematology' },
  { label: 'Mean Corpuscular Volume (MCV)', value: 'Mean Corpuscular Volume (MCV)', category: 'Haematology' },
  { label: 'Mean Cell Haemoglobin (MCH)', value: 'Mean Cell Haemoglobin (MCH)', category: 'Haematology' },
  { label: 'Mean Cell Haemoglobin CON (MCHC)', value: 'Mean Cell Haemoglobin CON (MCHC)', category: 'Haematology' },
  { label: 'Mean Platelet Volume (MPV)', value: 'Mean Platelet Volume (MPV)', category: 'Haematology' },
  { label: 'Erythrocyte Sedimentation Rate (ESR)', value: 'Erythrocyte Sedimentation Rate (ESR)', category: 'Haematology' },
  { label: 'Bleeding Time (BT)', value: 'Bleeding Time (BT)', category: 'Haematology' },
  { label: 'Clotting Time (CT)', value: 'Clotting Time (CT)', category: 'Haematology' },
  { label: 'Prothrombin Time (PT/INR)', value: 'Prothrombin Time (PT/INR)', category: 'Haematology' },
  { label: 'Fasting Blood Sugar (FBS)', value: 'Fasting Blood Sugar (FBS)', category: 'Biochemistry' },
  { label: 'Blood Sugar Post Prandial (PPBS)', value: 'Blood Sugar Post Prandial (PPBS)', category: 'Biochemistry' },
  { label: 'Serum Bilirubin (Total)', value: 'Serum Bilirubin (Total)', category: 'Biochemistry' },
  { label: 'Serum Bilirubin (Direct)', value: 'Serum Bilirubin (Direct)', category: 'Biochemistry' },
  { label: 'Serum Bilirubin (Indirect)', value: 'Serum Bilirubin (Indirect)', category: 'Biochemistry' },
  { label: 'SGOT (AST)', value: 'SGOT (AST)', category: 'Biochemistry' },
  { label: 'SGPT (ALT)', value: 'SGPT (ALT)', category: 'Biochemistry' },
  { label: 'Serum Alkaline Phosphatase (ALP)', value: 'Serum Alkaline Phosphatase (ALP)', category: 'Biochemistry' },
  { label: 'Total Serum Protein', value: 'Total Serum Protein', category: 'Biochemistry' },
  { label: 'Serum Albumin', value: 'Serum Albumin', category: 'Biochemistry' },
  { label: 'Serum Globulin', value: 'Serum Globulin', category: 'Biochemistry' },
  { label: 'A/G Ratio', value: 'A/G Ratio', category: 'Biochemistry' },
  { label: 'Serum Creatinine', value: 'Serum Creatinine', category: 'Biochemistry' },
  { label: 'Serum Urea / BUN', value: 'Serum Urea / BUN', category: 'Biochemistry' },
  { label: 'Serum Uric Acid', value: 'Serum Uric Acid', category: 'Biochemistry' },
  { label: 'Serum Calcium', value: 'Serum Calcium', category: 'Biochemistry' },
  { label: 'Total Cholesterol', value: 'Total Cholesterol', category: 'Biochemistry' },
  { label: 'Serum Triglycerides', value: 'Serum Triglycerides', category: 'Biochemistry' },
  { label: 'HDL Cholesterol', value: 'HDL Cholesterol', category: 'Biochemistry' },
  { label: 'LDL Cholesterol', value: 'LDL Cholesterol', category: 'Biochemistry' },
  { label: 'Thyroid Stimulating Hormone (TSH)', value: 'Thyroid Stimulating Hormone (TSH)', category: 'Endocrinology' },
  { label: 'Free T3 (FT3)', value: 'Free T3 (FT3)', category: 'Endocrinology' },
  { label: 'Free T4 (FT4)', value: 'Free T4 (FT4)', category: 'Endocrinology' },
  { label: 'Urine Routine & Microscopic', value: 'Urine Routine & Microscopic', category: 'Clinical Pathology' },
];

export const TestPanelsPage: React.FC<TestPanelsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const [panels, setPanels] = useState<TestPanelItem[]>([
    {
      id: '1',
      order: 1,
      name: 'Complete Blood Count (CBC)',
      category: 'Haematology',
      price: 350,
      tests: [
        'Hemoglobin',
        'Total Leukocyte Count (TLC)',
        'Differential Leucocyte Count (DLC)',
        'Platelet Count',
        'Total RBC Count',
        'Hematocrit Value (Hct / PCV)',
        'Mean Corpuscular Volume (MCV)',
        'Mean Cell Haemoglobin (MCH)',
        'Mean Cell Haemoglobin CON (MCHC)',
        'Mean Platelet Volume (MPV)',
      ],
      testsCount: 10,
      ratelistEntries: 'CBC with GBP, Complete Blood Count (CBC)',
      hideInterpretation: true,
      hideMethodInstrument: false,
    },
    {
      id: '2',
      order: 2,
      name: 'CBC (with absolute counts)',
      category: 'Haematology',
      price: 450,
      tests: [
        'Hemoglobin',
        'Total Leukocyte Count (TLC)',
        'Differential Leucocyte Count (DLC)',
        'Platelet Count',
        'Total RBC Count',
        'Hematocrit Value (Hct / PCV)',
        'Mean Corpuscular Volume (MCV)',
        'Mean Cell Haemoglobin (MCH)',
        'Mean Platelet Volume (MPV)',
      ],
      testsCount: 9,
      ratelistEntries:
        'Antenatal Package, Cardiac package, CBC (with absolute counts), Dialysis package, Fitness Package',
      hideInterpretation: true,
      hideMethodInstrument: false,
    },
    {
      id: '3',
      order: 3,
      name: 'CBC with ESR',
      category: 'Haematology',
      price: 400,
      tests: [
        'Hemoglobin',
        'Total Leukocyte Count (TLC)',
        'Differential Leucocyte Count (DLC)',
        'Platelet Count',
        'Erythrocyte Sedimentation Rate (ESR)',
      ],
      testsCount: 5,
      ratelistEntries: 'Anemia package, Arthritis Package, CBC with ESR, Fever package',
      hideInterpretation: true,
      hideMethodInstrument: false,
    },
    {
      id: '4',
      order: 4,
      name: 'BT & CT',
      category: 'Haematology',
      price: 150,
      tests: ['Bleeding Time (BT)', 'Clotting Time (CT)'],
      testsCount: 2,
      ratelistEntries: 'BT & CT',
      hideInterpretation: false,
      hideMethodInstrument: false,
    },
    {
      id: '5',
      order: 5,
      name: 'Liver Function Test (LFT)',
      category: 'Biochemistry',
      price: 750,
      tests: [
        'Serum Bilirubin (Total)',
        'Serum Bilirubin (Direct)',
        'Serum Bilirubin (Indirect)',
        'SGOT (AST)',
        'SGPT (ALT)',
        'Serum Alkaline Phosphatase (ALP)',
        'Total Serum Protein',
        'Serum Albumin',
        'Serum Globulin',
        'A/G Ratio',
      ],
      testsCount: 10,
      ratelistEntries: 'Full body checkup, Liver Function Test (LFT)',
      hideInterpretation: false,
      hideMethodInstrument: false,
    },
  ]);

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<TestPanelItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form Fields
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Haematology');
  const [formPrice, setFormPrice] = useState<number | string>(350);
  const [formHideInterpretation, setFormHideInterpretation] = useState(true);
  const [formHideMethod, setFormHideMethod] = useState(false);
  const [formSelectedTests, setFormSelectedTests] = useState<string[]>([]);
  const [formRatelist, setFormRatelist] = useState('');
  const [formInterpretation, setFormInterpretation] = useState('');

  // Interpretation Library Picker Modal State
  const [isLibraryPickerOpen, setIsLibraryPickerOpen] = useState(false);
  const [pickerTab, setPickerTab] = useState<'panels' | 'tests'>('panels');
  const [pickerSearch, setPickerSearch] = useState('');
  const [previewLibraryItem, setPreviewLibraryItem] = useState<LibraryItem | null>(null);

  const filteredPickerItems = useMemo(() => {
    const list = pickerTab === 'panels' ? PANELS_LIBRARY_DATA : TESTS_LIBRARY_DATA;
    if (!pickerSearch.trim()) return list;
    const q = pickerSearch.toLowerCase();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        item.rawText.toLowerCase().includes(q)
    );
  }, [pickerTab, pickerSearch]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormCategory('Haematology');
    setFormPrice(350);
    setFormHideInterpretation(true);
    setFormHideMethod(false);
    setFormSelectedTests([]);
    setFormRatelist('');
    setFormInterpretation('');
    setModalMode('create');
  };

  const handleOpenEdit = (panel: TestPanelItem) => {
    setSelectedPanel(panel);
    setFormName(panel.name);
    setFormCategory(panel.category);
    setFormPrice(panel.price || 350);
    setFormHideInterpretation(panel.hideInterpretation ?? true);
    setFormHideMethod(panel.hideMethodInstrument ?? false);
    setFormSelectedTests(panel.tests);
    setFormRatelist(panel.ratelistEntries);
    setFormInterpretation(panel.interpretation || '');
    setModalMode('edit');
  };

  const handleOpenView = (panel: TestPanelItem) => {
    setSelectedPanel(panel);
    setModalMode('view');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newPanel: TestPanelItem = {
        id: String(Date.now()),
        order: panels.length + 1,
        name: formName,
        category: formCategory,
        price: Number(formPrice) || 0,
        tests: formSelectedTests,
        testsCount: formSelectedTests.length,
        ratelistEntries: formRatelist || formName,
        hideInterpretation: formHideInterpretation,
        hideMethodInstrument: formHideMethod,
        interpretation: formInterpretation,
      };
      setPanels([...panels, newPanel]);
      showToast(`Test panel "${newPanel.name}" added successfully.`);
    } else if (modalMode === 'edit' && selectedPanel) {
      setPanels((prev) =>
        prev.map((p) =>
          p.id === selectedPanel.id
            ? {
                ...p,
                name: formName,
                category: formCategory,
                price: Number(formPrice) || 0,
                tests: formSelectedTests,
                testsCount: formSelectedTests.length,
                ratelistEntries: formRatelist,
                hideInterpretation: formHideInterpretation,
                hideMethodInstrument: formHideMethod,
                interpretation: formInterpretation,
              }
            : p
        )
      );
      showToast(`Test panel "${formName}" updated.`);
    }
    setModalMode(null);
  };

  const filteredPanels = panels.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tests.some((t) => t.toLowerCase().includes(q))
    );
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
          Test panels
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => showToast('Drag & drop panel rows to change their report sequence.')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <HelpCircle size={15} color="#0284c7" />
            <span>How to reorder?</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleOpenCreate}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={16} />
            <span>Add new</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ position: 'relative', maxWidth: '380px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            className="input-control"
            style={{ paddingLeft: '34px', fontSize: '13px' }}
            placeholder="Search panels or component tests..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Panels Table */}
      <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '80px' }}>ORDER</th>
              <th>NAME</th>
              <th>TESTS</th>
              <th>RATELIST ENTRIES</th>
              <th style={{ textAlign: 'center', width: '130px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredPanels.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No test panels match your filter.
                </td>
              </tr>
            ) : (
              filteredPanels.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="table-cell-mono" style={{ color: '#64748b' }}>
                    {p.order}.
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                      {p.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{p.category}</div>
                  </td>
                  <td>
                    <button
                      type="button"
                      onClick={() => handleOpenView(p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontWeight: 600,
                        fontSize: '13px',
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ({p.testsCount} tests)
                    </button>
                  </td>
                  <td style={{ fontSize: '12px', color: '#475569', maxWidth: '350px' }}>
                    {p.ratelistEntries}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenView(p)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Panel Form Modal matching Exact Labsmart UI from user screenshot */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add Test Panel' : `Edit Panel: ${selectedPanel?.name}`}
          size="lg"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveForm}>
                {modalMode === 'create' ? 'Add Panel' : 'Save Changes'}
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Panel Name <span style={{ color: '#dc2626' }}>*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Complete Blood Count (CBC)"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="input-control"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                  Price (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 350"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Category
              </label>
              <select
                className="select-control"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', backgroundColor: '#fff' }}
              >
                <option value="Haematology">Haematology</option>
                <option value="Biochemistry">Biochemistry</option>
                <option value="Serology & Immunology">Serology & Immunology</option>
                <option value="Clinical Pathology">Clinical Pathology</option>
                <option value="Cytology">Cytology</option>
                <option value="Microbiology">Microbiology</option>
                <option value="Endocrinology">Endocrinology</option>
              </select>
            </div>

            {/* Checkboxes matching user screenshot */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formHideInterpretation}
                  onChange={(e) => setFormHideInterpretation(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                />
                <span>Hide individual test interpretation, notes, comments from report.</span>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formHideMethod}
                  onChange={(e) => setFormHideMethod(e.target.checked)}
                  style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
                />
                <span>Hide individual test method and instrument from report.</span>
              </label>
            </div>

            {/* Multi-Select Combobox for Tests matching user screenshot */}
            <MultiSelectCombobox
              label="Tests"
              placeholder="Select tests"
              options={MASTER_TEST_OPTIONS}
              selectedValues={formSelectedTests}
              onChange={setFormSelectedTests}
              helpText="ⓘ Search by typing full test name if not found by short name."
            />

            {/* Pink Callout Banner from Labsmart */}
            <div
              style={{
                backgroundColor: '#fdf2f8',
                border: '1px solid #fbcfe8',
                borderRadius: '6px',
                padding: '8px 12px',
                fontSize: '12px',
                color: '#9d174d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={14} color="#db2777" />
                <span>
                  You can now copy interpretations from{' '}
                  <a
                    href="#interpretations_library"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsLibraryPickerOpen(true);
                    }}
                    style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    Library ↗
                  </a>{' '}
                  to update.{' '}
                  <span
                    style={{
                      backgroundColor: '#f43f5e',
                      color: '#fff',
                      fontSize: '10px',
                      fontWeight: 700,
                      padding: '1px 5px',
                      borderRadius: '4px',
                    }}
                  >
                    NEW
                  </span>
                </span>
              </div>

              {onNavigate && (
                <button
                  type="button"
                  onClick={() => onNavigate('interpretations_library')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#be185d',
                    fontSize: '11px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                  title="Open full Interpretations Library page in Lab"
                >
                  <span>Open Full Library</span>
                  <ExternalLink size={11} />
                </button>
              )}
            </div>

            {/* Interpretation Rich Text Toolbar & Field */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Interpretation
              </label>
              <div style={{ border: '1px solid #cbd5e1', borderRadius: '6px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', backgroundColor: '#f8fafc', borderBottom: '1px solid #cbd5e1' }}>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}><Bold size={14} /></button>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}><Italic size={14} /></button>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}><Underline size={14} /></button>
                  <div style={{ width: '1px', height: '14px', backgroundColor: '#cbd5e1' }} />
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}><List size={14} /></button>
                  <button type="button" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', padding: '2px' }}><AlignLeft size={14} /></button>
                  <div style={{ width: '1px', height: '14px', backgroundColor: '#cbd5e1' }} />
                  <span style={{ fontSize: '11px', color: '#64748b' }}>System Font • 12pt</span>
                </div>
                <textarea
                  rows={3}
                  value={formInterpretation}
                  onChange={(e) => setFormInterpretation(e.target.value)}
                  placeholder="Enter clinical notes, physiological reference values, or specimen guidelines..."
                  style={{ width: '100%', border: 'none', outline: 'none', padding: '10px', fontSize: '13px', resize: 'vertical' }}
                />
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                Ratelist / Package Entries
              </label>
              <input
                type="text"
                value={formRatelist}
                onChange={(e) => setFormRatelist(e.target.value)}
                placeholder="e.g. CBC with GBP, Executive Health Checkup"
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* View Panel Modal */}
      {modalMode === 'view' && selectedPanel && (
        <Modal
          isOpen={!!selectedPanel}
          onClose={() => setModalMode(null)}
          title={`Panel Details: ${selectedPanel.name}`}
          size="md"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontWeight: 600, color: '#64748b' }}>Department Category: </span>
                <span style={{ fontWeight: 700, color: '#0f172a' }}>{selectedPanel.category}</span>
              </div>
              <div>
                <span style={{ fontWeight: 600, color: '#64748b' }}>Standard Price: </span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>₹{selectedPanel.price || 350}.00</span>
              </div>
            </div>

            <div>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Component Parameters ({selectedPanel.testsCount}):</span>
              <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedPanel.tests.map((testName) => (
                  <span
                    key={testName}
                    style={{
                      backgroundColor: '#eff6ff',
                      color: '#1e40af',
                      border: '1px solid #bfdbfe',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                    }}
                  >
                    {testName}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontWeight: 600, color: '#64748b' }}>Associated Ratelist Packages:</span>
              <div style={{ marginTop: '4px', color: '#334155' }}>{selectedPanel.ratelistEntries}</div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
              <Button variant="secondary" onClick={() => setModalMode(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Interpretations Reference Library Picker Modal */}
      {isLibraryPickerOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
            backdropFilter: 'blur(3px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '840px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                  Interpretations Library
                </h3>
                <span
                  style={{
                    backgroundColor: '#fce7f3',
                    color: '#be185d',
                    border: '1px solid #fbcfe8',
                    fontSize: '10px',
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: '10px',
                  }}
                >
                  BETA
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {onNavigate && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsLibraryPickerOpen(false);
                      onNavigate('interpretations_library');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '4px 10px',
                      fontSize: '12px',
                      color: '#2563eb',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span>Full Page View</span>
                    <ExternalLink size={12} />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setIsLibraryPickerOpen(false);
                    setPreviewLibraryItem(null);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    padding: '4px',
                    borderRadius: '4px',
                  }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Sub-header / Tabs & Search */}
            <div
              style={{
                padding: '12px 20px',
                backgroundColor: '#f8fafc',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
              }}
            >
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setPickerTab('panels')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: pickerTab === 'panels' ? '#2563eb' : '#cbd5e1',
                    backgroundColor: pickerTab === 'panels' ? '#2563eb' : '#ffffff',
                    color: pickerTab === 'panels' ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Panels ({PANELS_LIBRARY_DATA.length})
                </button>
                <button
                  type="button"
                  onClick={() => setPickerTab('tests')}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '6px',
                    border: '1px solid',
                    borderColor: pickerTab === 'tests' ? '#2563eb' : '#cbd5e1',
                    backgroundColor: pickerTab === 'tests' ? '#2563eb' : '#ffffff',
                    color: pickerTab === 'tests' ? '#ffffff' : '#475569',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Tests ({TESTS_LIBRARY_DATA.length})
                </button>
              </div>

              <div style={{ position: 'relative', width: '280px' }}>
                <Search
                  size={14}
                  color="#94a3b8"
                  style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                />
                <input
                  type="text"
                  placeholder="Search interpretations..."
                  value={pickerSearch}
                  onChange={(e) => setPickerSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 28px 6px 30px',
                    fontSize: '12px',
                    border: '1px solid #cbd5e1',
                    borderRadius: '6px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
                {pickerSearch && (
                  <button
                    type="button"
                    onClick={() => setPickerSearch('')}
                    style={{
                      position: 'absolute',
                      right: '8px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            {/* Content List / Preview */}
            <div style={{ display: 'flex', flex: 1, minHeight: '360px', maxHeight: '520px', overflow: 'hidden' }}>
              {/* Items List */}
              <div
                style={{
                  width: previewLibraryItem ? '45%' : '100%',
                  borderRight: previewLibraryItem ? '1px solid #e2e8f0' : 'none',
                  overflowY: 'auto',
                }}
              >
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
                  <thead style={{ position: 'sticky', top: 0, backgroundColor: '#f1f5f9', zIndex: 1 }}>
                    <tr>
                      <th style={{ padding: '8px 14px', color: '#475569', fontWeight: 600, width: '45px' }}>#</th>
                      <th style={{ padding: '8px 14px', color: '#475569', fontWeight: 600 }}>Name</th>
                      <th style={{ padding: '8px 14px', color: '#475569', fontWeight: 600, textAlign: 'right' }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPickerItems.map((item, idx) => (
                      <tr
                        key={item.id}
                        style={{
                          borderBottom: '1px solid #f1f5f9',
                          backgroundColor:
                            previewLibraryItem?.id === item.id ? '#eff6ff' : idx % 2 === 0 ? '#fff' : '#fafafa',
                        }}
                      >
                        <td style={{ padding: '10px 14px', color: '#64748b' }}>{idx + 1}.</td>
                        <td style={{ padding: '10px 14px', color: '#0f172a', fontWeight: 600 }}>
                          <div>{item.name}</div>
                          {item.category && (
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{item.category}</span>
                          )}
                        </td>
                        <td style={{ padding: '10px 14px', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '6px' }}>
                            <button
                              type="button"
                              onClick={() => setPreviewLibraryItem(item)}
                              style={{
                                padding: '4px 8px',
                                fontSize: '11px',
                                border: '1px solid #cbd5e1',
                                borderRadius: '4px',
                                backgroundColor: '#ffffff',
                                color: '#475569',
                                cursor: 'pointer',
                              }}
                            >
                              Preview
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setFormInterpretation(item.rawText);
                                setIsLibraryPickerOpen(false);
                                setPreviewLibraryItem(null);
                                showToast(`Copied "${item.name}" interpretation to panel!`);
                              }}
                              style={{
                                padding: '4px 10px',
                                fontSize: '11px',
                                fontWeight: 600,
                                border: 'none',
                                borderRadius: '4px',
                                backgroundColor: '#2563eb',
                                color: '#ffffff',
                                cursor: 'pointer',
                              }}
                            >
                              Copy to Panel
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Preview Pane if item selected */}
              {previewLibraryItem && (
                <div
                  style={{
                    width: '55%',
                    padding: '16px 20px',
                    overflowY: 'auto',
                    backgroundColor: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '12px',
                      borderBottom: '1px solid #f1f5f9',
                      paddingBottom: '8px',
                    }}
                  >
                    <div>
                      <h4 style={{ margin: 0, fontSize: '15px', color: '#0f172a', fontWeight: 700 }}>
                        {previewLibraryItem.name}
                      </h4>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>Clinical Interpretation Preview</span>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          if (navigator.clipboard) {
                            navigator.clipboard.writeText(previewLibraryItem.rawText);
                          }
                          showToast('Copied to clipboard!');
                        }}
                        style={{
                          padding: '4px 8px',
                          fontSize: '11px',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          backgroundColor: '#ffffff',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          color: '#475569',
                        }}
                      >
                        <Copy size={12} />
                        <span>Copy text</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setFormInterpretation(previewLibraryItem.rawText);
                          setIsLibraryPickerOpen(false);
                          setPreviewLibraryItem(null);
                          showToast(`Applied "${previewLibraryItem.name}" interpretation to panel!`);
                        }}
                        style={{
                          padding: '4px 12px',
                          fontSize: '11px',
                          fontWeight: 600,
                          border: 'none',
                          borderRadius: '4px',
                          backgroundColor: '#16a34a',
                          color: '#ffffff',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Check size={12} />
                        <span>Apply to Panel</span>
                      </button>
                    </div>
                  </div>

                  <div
                    style={{ fontSize: '12px', lineHeight: 1.6, color: '#334155', flex: 1, overflowY: 'auto' }}
                    dangerouslySetInnerHTML={{ __html: previewLibraryItem.htmlContent }}
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 20px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#f8fafc',
              }}
            >
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Select an interpretation and click <strong>Copy to Panel</strong> to insert it directly into your panel form.
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsLibraryPickerOpen(false);
                  setPreviewLibraryItem(null);
                }}
                style={{
                  padding: '6px 14px',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  cursor: 'pointer',
                }}
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
