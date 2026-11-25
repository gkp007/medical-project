import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Headphones,
  CheckCircle2,
  X,
  XCircle,
  ExternalLink,
} from 'lucide-react';
import { mastersApi } from '../../services/api';
import { ALL_LABSMART_TESTS, LabTestDetail } from '../manage/allLabsmartTestsData';
import { RichInterpretationEditor } from './RichInterpretationEditor';

interface LabTestEditPageProps {
  testId?: string;
  onNavigate?: (screen: string) => void;
  onSaved?: () => void;
}

export const LabTestEditPage: React.FC<LabTestEditPageProps> = ({
  testId = '6228737',
  onNavigate,
  onSaved,
}) => {
  const [activeTab, setActiveTab] = useState<'more' | 'format'>('more');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Look up master test details from ALL_LABSMART_TESTS only when an actual match exists
  const baseTest: LabTestDetail = useMemo(() => {
    const normalized = (testId || '').trim().toLowerCase();
    const found = ALL_LABSMART_TESTS.find(
      (t) =>
        t.id === testId ||
        t.name.toLowerCase() === normalized ||
        (t.shortName && t.shortName.toLowerCase() === normalized) ||
        String(t.order) === testId
    );
    if (found) return found;
    return {
      id: testId || 'unknown',
      order: 0,
      name: testId && !/^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(testId) ? testId : 'Loading test...',
      shortName: '',
      category: 'Haematology',
      testType: 'Single parameter',
      unit: '',
      price: 0,
      description: '',
      increasedIn: [],
      decreasedIn: [],
      comments: '',
      ratelistEntries: [],
      panelsIncluded: [],
      normalValues: { selectType: 'numeric_range', ranges: [] },
    } as LabTestDetail;
  }, [testId]);

  const activeTestId = testId || baseTest.id;

  // Form states matching media_1795333880694_4e171475.png
  const [name, setName] = useState(baseTest.name);
  const [shortName, setShortName] = useState(baseTest.shortName || '');
  const [category, setCategory] = useState(baseTest.category || 'Haematology');
  const [unit, setUnit] = useState(baseTest.unit || 'g/dl');
  const [inputType, setInputType] = useState(
    baseTest.testType === 'Single parameter'
      ? 'Numeric'
      : baseTest.testType === 'Document'
        ? 'Document'
        : 'Single Line'
  );
  const [defaultResult, setDefaultResult] = useState(baseTest.defaultResultText || '');
  const [isOptional, setIsOptional] = useState(false);
  const [method, setMethod] = useState(baseTest.method || '');
  const [instrument, setInstrument] = useState(baseTest.instrument || '');
  const [alwaysBold, setAlwaysBold] = useState(baseTest.isAlwaysBold || false);
  const [printLineAfter, setPrintLineAfter] = useState(baseTest.printLineAfter || false);

  // Unit modal & custom units
  const [isAddUnitModalOpen, setIsAddUnitModalOpen] = useState(false);
  const [newUnitValue, setNewUnitValue] = useState('');
  const [unitOptions, setUnitOptions] = useState<string[]>(() => {
    const defaults = [
      'g/dl',
      'ng/mL',
      'mg/dL',
      '/cumm',
      '/mcL',
      '%',
      'U/L',
      'pg/mL',
      'mIU/mL',
      'mmol/L',
      'µmol/L',
      'µg/dL',
      'cells/cumm',
      'fl',
      'pg',
      'mm/hr',
      'Minutes',
      'Seconds',
      'Index',
      'Ratio',
    ];
    try {
      const saved = localStorage.getItem('lab_custom_units');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return Array.from(new Set([...defaults, ...parsed]));
        }
      }
    } catch { }
    return defaults;
  });

  // Interpretation text
  const [interpretationText, setInterpretationText] = useState(() => {
    if (baseTest.interpretation) return baseTest.interpretation;
    const parts: string[] = [];
    if (baseTest.description) parts.push(`Physiological Basis:\n${baseTest.description}`);
    if (baseTest.increasedIn && baseTest.increasedIn.length > 0) {
      parts.push(`Increased in:\n${baseTest.increasedIn.join('\n')}`);
    }
    if (baseTest.decreasedIn && baseTest.decreasedIn.length > 0) {
      parts.push(`Decreased in:\n${baseTest.decreasedIn.join('\n')}`);
    }
    if (baseTest.comments) parts.push(`Comments:\n${baseTest.comments}`);
    return parts.join('\n\n');
  });

  // Re-sync when baseTest updates
  useEffect(() => {
    setName(baseTest.name);
    setShortName(baseTest.shortName || '');
    setCategory(baseTest.category || 'Haematology');
    setUnit(baseTest.unit || 'g/dl');
    setInputType(
      baseTest.testType === 'Single parameter'
        ? 'Numeric'
        : baseTest.testType === 'Document'
          ? 'Document'
          : 'Single Line'
    );
    setDefaultResult(baseTest.defaultResultText || '');
    setMethod(baseTest.method || '');
    setInstrument(baseTest.instrument || '');
    setAlwaysBold(baseTest.isAlwaysBold || false);
    setPrintLineAfter(baseTest.printLineAfter || false);

    const parts: string[] = [];
    if (baseTest.description) parts.push(`Physiological Basis:\n${baseTest.description}`);
    if (baseTest.increasedIn && baseTest.increasedIn.length > 0) {
      parts.push(`Increased in:\n${baseTest.increasedIn.join('\n')}`);
    }
    if (baseTest.decreasedIn && baseTest.decreasedIn.length > 0) {
      parts.push(`Decreased in:\n${baseTest.decreasedIn.join('\n')}`);
    }
    if (baseTest.comments) parts.push(`Comments:\n${baseTest.comments}`);
    setInterpretationText(parts.join('\n\n') || baseTest.interpretation || '');

    // Fetch from backend API if available using actual testId
    const fetchBackend = async () => {
      try {
        const [res, unitsRes] = await Promise.all([
          mastersApi.getTestById(activeTestId),
          mastersApi.listUnits().catch(() => ({ success: false, data: [] })),
        ]);
        if (unitsRes?.success && Array.isArray(unitsRes.data) && unitsRes.data.length > 0) {
          setUnitOptions((prev) => Array.from(new Set([...prev, ...unitsRes.data.map((u: any) => u.name)])));
        }
        if (res?.data) {
          if (res.data.name) setName(res.data.name);
          if (res.data.shortName !== undefined) setShortName(res.data.shortName || '');
          if (res.data.department || res.data.category) setCategory(res.data.department || res.data.category);
          if (res.data.parameters?.[0]?.unit) setUnit(res.data.parameters[0].unit);
          if (res.data.interpretation !== undefined) setInterpretationText(res.data.interpretation || '');
        }
      } catch (err) { }
    };
    fetchBackend();
  }, [baseTest, activeTestId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveNewUnit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newUnitValue.trim();
    if (!trimmed) {
      showToast('Please enter a unit name');
      return;
    }
    try {
      await mastersApi.createUnit(trimmed);
    } catch {
      // keep local option if already exists
    }
    if (!unitOptions.includes(trimmed)) {
      const updated = [...unitOptions, trimmed];
      setUnitOptions(updated);
      try {
        localStorage.setItem('lab_custom_units', JSON.stringify(updated));
      } catch { }
    }
    setUnit(trimmed);
    setNewUnitValue('');
    setIsAddUnitModalOpen(false);
    showToast(`Added unit "${trimmed}"`);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mastersApi.updateTest(activeTestId, {
        name,
        shortName,
        department: category,
        unit,
        method,
        instrument,
        interpretation: interpretationText,
        alwaysBold,
        printLineAfter,
      });
      showToast('Saved test specifications successfully in database!');
    } catch (err: any) {
      showToast(err?.message || 'Failed to save test specifications.');
      return;
    }

    // Update in-memory ALL_LABSMART_TESTS object
    baseTest.name = name;
    baseTest.shortName = shortName;
    baseTest.category = category;
    baseTest.unit = unit;
    baseTest.method = method;
    baseTest.instrument = instrument;
    baseTest.interpretation = interpretationText;

    setTimeout(() => {
      localStorage.setItem('labsmart_active_test_id', activeTestId);
      if (onSaved) {
        onSaved();
      } else if (onNavigate) {
        onNavigate('view_lab_test');
      } else {
        window.history.pushState({}, '', `/37749971/lab_tests/${activeTestId}`);
        window.dispatchEvent(new PopStateEvent('popstate'));
      }
    }, 500);
  };

  const handleCancel = () => {
    localStorage.setItem('labsmart_active_test_id', activeTestId);
    if (onNavigate) {
      onNavigate('view_lab_test');
    } else {
      window.history.pushState({}, '', `/37749971/lab_tests/${activeTestId}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  return (
    <div
      style={{
        padding: '24px 32px 80px 32px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            zIndex: 10000,
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb matching media_1795333880694_4e171475.png: HAEMATOLOGY / HEMOGLOBIN / EDIT */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#64748b',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          marginBottom: '20px',
        }}
      >
        <button
          onClick={() => {
            if (onNavigate) onNavigate('test_categories');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
            fontSize: '11px',
          }}
        >
          {category.toUpperCase()}
        </button>
        <span>/</span>
        <button
          onClick={handleCancel}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 700,
            cursor: 'pointer',
            padding: 0,
            fontSize: '11px',
          }}
        >
          {name.toUpperCase()}
        </button>
        <span>/</span>
        <span style={{ color: '#0f172a' }}>EDIT</span>
      </div>

      {/* Title & Subtitle */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
          {name}
        </h1>
        <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>
          Test details
        </div>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} style={{ maxWidth: '820px' }}>
        {/* Row 1: Name & Short name */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
              Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
              Short name
            </label>
            <input
              type="text"
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
              }}
            />
          </div>
        </div>

        {/* Row 2: Category */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              boxSizing: 'border-box',
              outline: 'none',
              backgroundColor: '#ffffff',
            }}
          >
            <option value="Haematology">Haematology</option>
            <option value="Biochemistry">Biochemistry</option>
            <option value="Serology & Immunology">Serology & Immunology</option>
            <option value="Clinical Pathology">Clinical Pathology</option>
            <option value="Cytology">Cytology</option>
            <option value="Microbiology">Microbiology</option>
            <option value="Endocrinology">Endocrinology</option>
            <option value="Histopathology">Histopathology</option>
            <option value="Others">Others</option>
            <option value="Miscellaneous">Miscellaneous</option>
          </select>
        </div>

        {/* Row 3: Unit with + Add new & Input type */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '16px' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <label style={{ fontSize: '13px', color: '#475569', margin: 0 }}>
                Unit
              </label>
              <button
                type="button"
                onClick={() => setIsAddUnitModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '3px',
                }}
              >
                <Plus size={13} />
                <span>Add new</span>
              </button>
            </div>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              {unitOptions.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
              Input type
            </label>
            <select
              value={inputType}
              onChange={(e) => setInputType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '4px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                boxSizing: 'border-box',
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="Numeric">Numeric</option>
              <option value="Single Line">Single Line</option>
              <option value="Multiline">Multiline</option>
              <option value="Document">Document</option>
              <option value="Formula">Formula</option>
            </select>
          </div>
        </div>

        {/* Row 4: Default result */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
            Default result
          </label>
          <textarea
            rows={3}
            value={defaultResult}
            onChange={(e) => setDefaultResult(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              boxSizing: 'border-box',
              outline: 'none',
              fontFamily: 'inherit',
            }}
          />
        </div>

        {/* Row 5: Optional Checkbox */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#475569', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isOptional}
              onChange={(e) => setIsOptional(e.target.checked)}
              style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
            />
            <span>Optional</span>
          </label>
        </div>

        {/* Tabs: More details | Format options */}
        <div style={{ display: 'flex', gap: '20px', borderBottom: '1px solid #e2e8f0', marginBottom: '20px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('more')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'more' ? '2px solid #2563eb' : '2px solid transparent',
              padding: '8px 4px 10px 4px',
              fontSize: '13px',
              fontWeight: activeTab === 'more' ? 600 : 500,
              color: activeTab === 'more' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
            }}
          >
            More details
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('format')}
            style={{
              background: 'none',
              border: 'none',
              borderBottom: activeTab === 'format' ? '2px solid #2563eb' : '2px solid transparent',
              padding: '8px 4px 10px 4px',
              fontSize: '13px',
              fontWeight: activeTab === 'format' ? 600 : 500,
              color: activeTab === 'format' ? '#2563eb' : '#64748b',
              cursor: 'pointer',
            }}
          >
            Format options
          </button>
        </div>

        {/* Tab 1: More details */}
        {activeTab === 'more' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  Method
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spectrophotometry / Cyanmethemoglobin"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  Instrument
                </label>
                <input
                  type="text"
                  placeholder="e.g. Fully Automated Cell Counter"
                  value={instrument}
                  onChange={(e) => setInstrument(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Pink callout banner matching Image 4 */}
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
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <span>
                You can now copy interpretations from{' '}
                <a
                  href="#interpretations_library"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('interpretations_library');
                    else window.location.href = '/37749971/interpretations_library';
                  }}
                  style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer' }}
                >
                  Library ↗
                </a>{' '}
                to update.{' '}
                <span
                  style={{
                    backgroundColor: '#f43f5e',
                    color: '#ffffff',
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

            {/* Interpretation rich editor */}
            <div style={{ marginBottom: '28px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                  Interpretation
                </label>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Use <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Shift</kbd> + <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Enter</kbd> key to go to new line.
                </span>
              </div>
              <RichInterpretationEditor
                key={baseTest.id}
                initialValue={interpretationText}
                onChange={(html) => setInterpretationText(html)}
                minHeight="260px"
                placeholder="Enter clinical notes, possible causes of abnormal parameters, etc."
              />
            </div>
          </div>
        )}

        {/* Tab 2: Format options */}
        {activeTab === 'format' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={alwaysBold}
                onChange={(e) => setAlwaysBold(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
              />
              <span>Always print in bold</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={printLineAfter}
                onChange={(e) => setPrintLineAfter(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: '#2563eb' }}
              />
              <span>Print a horizontal divider line after this test</span>
            </label>
          </div>
        )}

        {/* Footer Buttons: Save | Cancel */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 24px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleCancel}
            style={{
              backgroundColor: '#ffffff',
              color: '#334155',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              padding: '8px 20px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      {/* MODAL: ADD NEW UNIT (matching media_1795335436725_3162d98e.jpg) */}
      {isAddUnitModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '480px',
              maxWidth: '96vw',
              padding: '24px 28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '18px',
              }}
            >
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Add new unit
              </h3>
              <button
                type="button"
                onClick={() => setIsAddUnitModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '2px',
                  display: 'flex',
                  alignItems: 'center',
                  color: '#64748b',
                }}
              >
                <XCircle size={19} />
              </button>
            </div>
            <form onSubmit={handleSaveNewUnit}>
              <div style={{ marginBottom: '20px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '13px',
                    fontWeight: 500,
                    color: '#334155',
                    marginBottom: '6px',
                  }}
                >
                  * Unit
                </label>
                <input
                  type="text"
                  autoFocus
                  required
                  value={newUnitValue}
                  onChange={(e) => setNewUnitValue(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #3b82f6',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    outline: 'none',
                    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.15)',
                  }}
                />
              </div>
              <div>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '7px 22px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
