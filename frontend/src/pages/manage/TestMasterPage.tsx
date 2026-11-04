import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { mastersApi } from '../../services/api';
import {
  Plus,
  Download,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Edit2,
  Eye,
  Filter,
} from 'lucide-react';

interface LabTestMasterItem {
  id: string;
  order: number;
  name: string;
  testType: 'Single parameter' | 'Multi parameter' | 'Document' | 'Formula';
  shortName: string;
  category: string;
}

export const TestMasterPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const CATEGORIES = [
    'All',
    'Haematology',
    'Biochemistry',
    'Serology & Immunology',
    'Clinical Pathology',
    'Cytology',
    'Microbiology',
    'Endocrinology',
    'Histopathology',
    'Others',
    'Miscellaneous',
  ];

  const [tests, setTests] = useState<LabTestMasterItem[]>([
    { id: '7136659', order: 1, name: 'Hemoglobin', testType: 'Single parameter', shortName: 'Hb', category: 'Haematology' },
    { id: '7136660', order: 2, name: 'Total Leukocyte Count', testType: 'Single parameter', shortName: 'TLC', category: 'Haematology' },
    { id: '7136661', order: 3, name: 'Differential Leucocyte Count', testType: 'Multi parameter', shortName: 'DLC', category: 'Haematology' },
    { id: '7136662', order: 4, name: 'Differential Leukocyte Count (Absolute count)', testType: 'Multi parameter', shortName: 'DLC (Abs)', category: 'Haematology' },
    { id: '7136663', order: 5, name: 'Erythrocyte sedimentation rate (Westergren)', testType: 'Single parameter', shortName: 'ESR (Westergren)', category: 'Haematology' },
    { id: '7136664', order: 6, name: 'Erythrocyte Sedimentation Rate (Wintrobe)', testType: 'Single parameter', shortName: 'ESR (Wintrobe)', category: 'Haematology' },
    { id: '7136668', order: 7, name: 'Platelet Count', testType: 'Single parameter', shortName: 'PLT', category: 'Haematology' },
    { id: '7136669', order: 8, name: 'Absolute Eosinophil Count', testType: 'Single parameter', shortName: 'AEC', category: 'Haematology' },
    { id: '7136670', order: 9, name: 'Blood Group & Rh.', testType: 'Multi parameter', shortName: 'BG', category: 'Haematology' },
    { id: '7136671', order: 10, name: 'Bleeding Time', testType: 'Single parameter', shortName: 'BT', category: 'Haematology' },
    { id: '7136672', order: 11, name: 'Clotting Time', testType: 'Single parameter', shortName: 'CT', category: 'Haematology' },
    { id: '7136673', order: 12, name: 'Peripheral Blood Smear', testType: 'Document', shortName: 'PBS / GBP', category: 'Haematology' },
    { id: '7136674', order: 13, name: 'Fasting Blood Sugar', testType: 'Single parameter', shortName: 'FBS', category: 'Biochemistry' },
    { id: '7136675', order: 14, name: 'Blood Sugar Post Prandial', testType: 'Single parameter', shortName: 'PPBS', category: 'Biochemistry' },
    { id: '7136676', order: 15, name: 'Serum Bilirubin Total', testType: 'Single parameter', shortName: 'TBIL', category: 'Biochemistry' },
    { id: '7136677', order: 16, name: 'SGPT / ALT', testType: 'Single parameter', shortName: 'ALT', category: 'Biochemistry' },
    { id: '7136678', order: 17, name: 'Serum Creatinine', testType: 'Single parameter', shortName: 'CREAT', category: 'Biochemistry' },
  ]);

  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedTest, setSelectedTest] = useState<LabTestMasterItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchLiveTests = async () => {
      try {
        const res = await mastersApi.listTests();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: LabTestMasterItem[] = res.data.map((t: any, idx: number) => ({
            id: t.id,
            order: idx + 1,
            name: t.name,
            testType: t.parameters && t.parameters.length > 1 ? 'Multi parameter' : 'Single parameter',
            shortName: t.code || t.name.substring(0, 4).toUpperCase(),
            category: t.department || 'Haematology',
          }));
          setTests(mapped);
        }
      } catch (err) {
        console.error('Failed to load database tests:', err);
      }
    };
    fetchLiveTests();
  }, []);

  // Form states
  const [formName, setFormName] = useState('');
  const [formShortName, setFormShortName] = useState('');
  const [formTestType, setFormTestType] = useState<LabTestMasterItem['testType']>('Single parameter');
  const [formCategory, setFormCategory] = useState('Haematology');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormShortName('');
    setFormTestType('Single parameter');
    setFormCategory('Haematology');
    setModalMode('create');
  };

  const handleOpenEdit = (t: LabTestMasterItem) => {
    setSelectedTest(t);
    setFormName(t.name);
    setFormShortName(t.shortName);
    setFormTestType(t.testType);
    setFormCategory(t.category);
    setModalMode('edit');
  };

  const handleOpenView = (t: LabTestMasterItem) => {
    setSelectedTest(t);
    setModalMode('view');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newTest: LabTestMasterItem = {
        id: String(Date.now()),
        order: tests.length + 1,
        name: formName,
        shortName: formShortName || formName.substring(0, 4).toUpperCase(),
        testType: formTestType,
        category: formCategory,
      };
      setTests([...tests, newTest]);
      showToast(`Added test "${newTest.name}" to database.`);
    } else if (modalMode === 'edit' && selectedTest) {
      setTests((prev) =>
        prev.map((t) =>
          t.id === selectedTest.id
            ? { ...t, name: formName, shortName: formShortName, testType: formTestType, category: formCategory }
            : t
        )
      );
      showToast(`Updated test "${formName}".`);
    }
    setModalMode(null);
  };

  // Filtering
  const filteredTests = tests.filter((t) => {
    const matchesCat = selectedCategory === 'All' || t.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.name.toLowerCase().includes(q) ||
      t.shortName.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test database
        </h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => showToast('Opening Labsmart global test library import...')}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Download size={15} color="#0284c7" />
            <span>Import</span>
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

      {/* Advisory Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '12px 16px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: '13px',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          <strong>Important: </strong> It is required that your laboratory proofreads and updates the provided reference range before using it for printing lab reports.
        </div>
      </div>

      {/* Horizontal Category Filter Strip */}
      <div style={{ marginBottom: '14px' }}>
        <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Filter size={13} />
          <span>Filter by category:</span>
        </div>
        <div
          style={{
            display: 'flex',
            gap: '6px',
            overflowX: 'auto',
            paddingBottom: '4px',
            scrollbarWidth: 'thin',
          }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: '16px',
                  fontSize: '12px',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
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

      {/* Test Database Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '70px' }}>ORDER</th>
              <th>NAME</th>
              <th style={{ width: '160px' }}>TEST TYPE</th>
              <th style={{ width: '140px' }}>SHORT NAME</th>
              <th style={{ width: '180px' }}>CATEGORY</th>
              <th style={{ width: '120px', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No tests found in category "{selectedCategory}".
                </td>
              </tr>
            ) : (
              filteredTests.map((t) => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>{t.order}.</td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                      {t.name}
                    </div>
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: t.testType === 'Single parameter' ? '#eff6ff' : t.testType === 'Multi parameter' ? '#f0fdf4' : '#fef3c7',
                        color: t.testType === 'Single parameter' ? '#1d4ed8' : t.testType === 'Multi parameter' ? '#15803d' : '#b45309',
                      }}
                    >
                      {t.testType}
                    </span>
                  </td>
                  <td style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                    {t.shortName || '-'}
                  </td>
                  <td>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        padding: '2px 8px',
                        borderRadius: '12px',
                        backgroundColor: '#f1f5f9',
                        color: '#475569',
                      }}
                    >
                      {t.category}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(t)}
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
                      <button
                        type="button"
                        onClick={() => handleOpenView(t)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#64748b',
                          fontSize: '13px',
                          cursor: 'pointer',
                        }}
                      >
                        view
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Test Form Modal */}
      {(modalMode === 'create' || modalMode === 'edit') && (
        <Modal
          isOpen={!!modalMode}
          onClose={() => setModalMode(null)}
          title={modalMode === 'create' ? 'Add Investigation Parameter' : `Edit Test: ${selectedTest?.name}`}
          size="md"
        >
          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Test Name <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Hemoglobin"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                className="input-control"
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Short Code / Abbreviation
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hb"
                  value={formShortName}
                  onChange={(e) => setFormShortName(e.target.value)}
                  className="input-control"
                />
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                  Test Type
                </label>
                <select
                  className="select-control"
                  value={formTestType}
                  onChange={(e) => setFormTestType(e.target.value as any)}
                >
                  <option value="Single parameter">Single parameter</option>
                  <option value="Multi parameter">Multi parameter</option>
                  <option value="Document">Document</option>
                  <option value="Formula">Formula</option>
                </select>
              </div>
            </div>

            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600 }}>
                Category
              </label>
              <select
                className="select-control"
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value)}
              >
                {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalMode(null)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                {modalMode === 'create' ? 'Add to Database' : 'Save Changes'}
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* View Modal */}
      {modalMode === 'view' && selectedTest && (
        <Modal
          isOpen={!!selectedTest}
          onClose={() => setModalMode(null)}
          title={`Test Specification: ${selectedTest.name}`}
          size="sm"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px' }}>
            <div>
              <span style={{ color: '#64748b' }}>Category: </span>
              <span style={{ fontWeight: 600 }}>{selectedTest.category}</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Short Code: </span>
              <span style={{ fontWeight: 600 }}>{selectedTest.shortName}</span>
            </div>
            <div>
              <span style={{ color: '#64748b' }}>Test Type: </span>
              <span style={{ fontWeight: 600 }}>{selectedTest.testType}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setModalMode(null)}>
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
