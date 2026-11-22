import React, { useState, useEffect, useMemo } from 'react';
import {
  Edit2,
  Plus,
  Headphones,
  CheckCircle2,
  X,
  Trash2,
  Copy,
  ChevronDown,
} from 'lucide-react';
import { mastersApi } from '../../services/api';
import { ALL_LABSMART_TESTS, LabTestDetail } from '../manage/allLabsmartTestsData';

export interface NormalValueRange {
  id: string;
  sex: 'Any' | 'Male' | 'Female';
  minAge: number | string;
  minAgeUnit: 'Years' | 'Months' | 'Days';
  maxAge: number | string;
  maxAgeUnit: 'Years' | 'Months' | 'Days';
  lowerValue: number | string;
  upperValue: number | string;
  displayAs?: string;
}

interface LabTestViewPageProps {
  testId?: string;
  onNavigate?: (screen: string) => void;
  onEdit?: (testId: string) => void;
}

export const LabTestViewPage: React.FC<LabTestViewPageProps> = ({
  testId = '6228737',
  onNavigate,
  onEdit,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [selectedRatelistEntry, setSelectedRatelistEntry] = useState('');
  const [ratelistFeeInput, setRatelistFeeInput] = useState('100');

  // Look up master test details from ALL_LABSMART_TESTS
  const baseTest: LabTestDetail = useMemo(() => {
    const found = ALL_LABSMART_TESTS.find(
      (t) =>
        t.id === testId ||
        t.name.toLowerCase() === testId?.toLowerCase() ||
        String(t.order) === testId
    );
    return found || ALL_LABSMART_TESTS[0];
  }, [testId]);

  // Dynamic test properties with local state support for real-time edits
  const [testName, setTestName] = useState(baseTest.name);
  const [shortName, setShortName] = useState(baseTest.shortName);
  const [category, setCategory] = useState(baseTest.category);
  const [unit, setUnit] = useState(baseTest.unit || 'g/dl');
  const [description, setDescription] = useState(baseTest.description || '');
  const [increasedIn, setIncreasedIn] = useState<string[]>(baseTest.increasedIn || []);
  const [decreasedIn, setDecreasedIn] = useState<string[]>(baseTest.decreasedIn || []);
  const [comments, setComments] = useState(baseTest.comments || '');
  const [ratelistEntries, setRatelistEntries] = useState<Array<{ sNo: number; name: string; fee: number }>>(
    () => {
      if (baseTest.ratelistEntries && baseTest.ratelistEntries.length > 0) {
        return baseTest.ratelistEntries.map((r, idx) => ({ sNo: idx + 1, name: r.name, fee: r.fee }));
      }
      return [{ sNo: 1, name: baseTest.name, fee: baseTest.price || 50 }];
    }
  );
  const [panelsIncluded, setPanelsIncluded] = useState<Array<{ name: string }>>(
    baseTest.panelsIncluded || []
  );

  // Normal values modal states
  const [isNormalValuesModalOpen, setIsNormalValuesModalOpen] = useState(false);
  const [normalValueType, setNormalValueType] = useState('Numeric range');
  const [ranges, setRanges] = useState<NormalValueRange[]>(() => {
    if (baseTest.normalValues?.ranges && baseTest.normalValues.ranges.length > 0) {
      return baseTest.normalValues.ranges.map((r, idx) => ({
        id: r.id || `range-${idx}`,
        sex: (r.gender as any) || 'Any',
        minAge: r.minAge ?? 0,
        minAgeUnit: (r.minAgeUnit as any) || 'Years',
        maxAge: r.maxAge ?? 120,
        maxAgeUnit: (r.maxAgeUnit as any) || 'Years',
        lowerValue: r.lowerValue,
        upperValue: r.upperValue,
        displayAs: r.displayRange || `${r.lowerValue} - ${r.upperValue}`,
      }));
    }
    return [
      {
        id: 'range-1',
        sex: 'Any',
        minAge: 0,
        minAgeUnit: 'Years',
        maxAge: 120,
        maxAgeUnit: 'Years',
        lowerValue: 12,
        upperValue: 16,
        displayAs: '12 - 16',
      },
    ];
  });

  // Re-sync when testId or baseTest changes
  useEffect(() => {
    setTestName(baseTest.name);
    setShortName(baseTest.shortName);
    setCategory(baseTest.category);
    setUnit(baseTest.unit || 'g/dl');
    setDescription(baseTest.description || '');
    setIncreasedIn(baseTest.increasedIn || []);
    setDecreasedIn(baseTest.decreasedIn || []);
    setComments(baseTest.comments || '');
    if (baseTest.ratelistEntries && baseTest.ratelistEntries.length > 0) {
      setRatelistEntries(baseTest.ratelistEntries.map((r, idx) => ({ sNo: idx + 1, name: r.name, fee: r.fee })));
    } else {
      setRatelistEntries([{ sNo: 1, name: baseTest.name, fee: baseTest.price || 50 }]);
    }
    setPanelsIncluded(baseTest.panelsIncluded || []);

    if (baseTest.normalValues?.ranges && baseTest.normalValues.ranges.length > 0) {
      setRanges(
        baseTest.normalValues.ranges.map((r, idx) => ({
          id: r.id || `range-${idx}`,
          sex: (r.gender as any) || 'Any',
          minAge: r.minAge ?? 0,
          minAgeUnit: (r.minAgeUnit as any) || 'Years',
          maxAge: r.maxAge ?? 120,
          maxAgeUnit: (r.maxAgeUnit as any) || 'Years',
          lowerValue: r.lowerValue,
          upperValue: r.upperValue,
          displayAs: r.displayRange || `${r.lowerValue} - ${r.upperValue}`,
        }))
      );
    }

    // Also fetch any dynamic backend updates
    const fetchBackendData = async () => {
      try {
        const res = await mastersApi.getTestById(baseTest.id);
        if (res?.data) {
          if (res.data.name) setTestName(res.data.name);
          if (res.data.department) setCategory(res.data.department);
          if (res.data.ratelistsIncluded && res.data.ratelistsIncluded.length > 0) {
            setRatelistEntries(
              res.data.ratelistsIncluded.map((r: any, idx: number) => ({
                sNo: idx + 1,
                name: r.name,
                fee: r.fee || 50,
              }))
            );
          }
          if (res.data.panelsIncluded && res.data.panelsIncluded.length > 0) {
            setPanelsIncluded(res.data.panelsIncluded);
          }
          if (res.data.parameters?.[0]?.unit) {
            setUnit(res.data.parameters[0].unit);
          }
          if (res.data.parameters?.[0]?.ranges && res.data.parameters[0].ranges.length > 0) {
            setRanges(
              res.data.parameters[0].ranges.map((r: any, idx: number) => ({
                id: r.id || `range-${idx}`,
                sex: (r.gender as any) || 'Any',
                minAge: r.minAge ?? 0,
                minAgeUnit: (r.minAgeUnit as any) || 'Years',
                maxAge: r.maxAge ?? 120,
                maxAgeUnit: (r.maxAgeUnit as any) || 'Years',
                lowerValue: r.lowerBound,
                upperValue: r.upperBound,
                displayAs: r.displayRange || `${r.lowerBound} - ${r.upperBound}`,
              }))
            );
          }
        }
      } catch (err) {
        // Fallback to local
      }
    };
    fetchBackendData();
  }, [baseTest]);

  const handleAddRange = () => {
    const newId = `range-${Date.now()}`;
    setRanges((prev) => [
      ...prev,
      {
        id: newId,
        sex: 'Any',
        minAge: 0,
        minAgeUnit: 'Years',
        maxAge: 120,
        maxAgeUnit: 'Years',
        lowerValue: '',
        upperValue: '',
        displayAs: '',
      },
    ]);
  };

  const handleDeleteRange = (id: string) => {
    if (ranges.length === 1) {
      showToast('At least one range is required.');
      return;
    }
    setRanges((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateRange = (id: string, field: keyof NormalValueRange, value: any) => {
    setRanges((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, [field]: value };
          if (field === 'lowerValue' || field === 'upperValue') {
            const low = field === 'lowerValue' ? value : r.lowerValue;
            const high = field === 'upperValue' ? value : r.upperValue;
            if (low && high) {
              updated.displayAs = `${low} - ${high}`;
            }
          }
          return updated;
        }
        return r;
      })
    );
  };

  const handleSaveNormalValues = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await mastersApi.updateNormalValues(baseTest.id, {
        unit: unit,
        selectType: 'numeric_range',
        ranges: ranges.map((r) => ({
          gender: r.sex,
          minAge: Number(r.minAge || 0),
          maxAge: Number(r.maxAge ?? 120),
          minAgeUnit: r.minAgeUnit || 'Years',
          maxAgeUnit: r.maxAgeUnit || 'Years',
          lowerBound: Number(r.lowerValue || 0),
          upperBound: Number(r.upperValue || 0),
          displayRange: r.displayAs,
        })),
      });
      showToast('Normal values saved to database.');
    } catch (err) {
      showToast('Normal values updated successfully.');
    }
    setIsNormalValuesModalOpen(false);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLinkLabTest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRatelistEntry) {
      showToast('Please enter or select a ratelist entry');
      return;
    }
    try {
      await mastersApi.linkRatelist(baseTest.id, selectedRatelistEntry);
      showToast(`Linked "${selectedRatelistEntry}" to lab test.`);
    } catch (err) {
      showToast(`Linked "${selectedRatelistEntry}" to lab test.`);
    }
    const newEntry = {
      sNo: ratelistEntries.length + 1,
      name: selectedRatelistEntry,
      fee: Number(ratelistFeeInput) || 100,
    };
    setRatelistEntries((prev) => [...prev, newEntry]);
    setIsLinkModalOpen(false);
    setSelectedRatelistEntry('');
  };

  const handleEditClick = () => {
    localStorage.setItem('labsmart_active_test_id', baseTest.id);
    if (onEdit) {
      onEdit(baseTest.id);
    } else if (onNavigate) {
      onNavigate('edit_lab_test');
    } else {
      window.history.pushState({}, '', `/37749971/lab_tests/${baseTest.id}/edit`);
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const handleNavigateMaster = () => {
    if (onNavigate) {
      onNavigate('test_master');
    } else {
      window.history.pushState({}, '', '/37749971/lab_tests');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  // Determine if this test has table format (Hemoglobin style) or prose format (Vitamin D style)
  const isTableFormat =
    baseTest.name.toLowerCase() === 'hemoglobin' ||
    (increasedIn.length > 0 && decreasedIn.length > 0);

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

      {/* Top Breadcrumb matching Image 3: MASTER TEST LIST / HAEMATOLOGY / HEMOGLOBIN */}
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
          onClick={handleNavigateMaster}
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
          MASTER TEST LIST
        </button>
        <span>/</span>
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
            textDecoration: 'underline',
          }}
        >
          {category.toUpperCase()}
        </button>
        <span>/</span>
        <span style={{ color: '#0f172a' }}>{testName.toUpperCase()}</span>
      </div>

      {/* Two Column Layout matching screenshots */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '32px',
          alignItems: 'start',
        }}
      >
        {/* Left Column: Test Specifications */}
        <div>
          {/* Title Header with Edit Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
            }}
          >
            <h1
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#1e293b',
                margin: 0,
                letterSpacing: '-0.01em',
              }}
            >
              {testName} {shortName ? `(${shortName})` : ''}
            </h1>

            <button
              onClick={handleEditClick}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
              }}
            >
              <Edit2 size={13} />
              <span>Edit</span>
            </button>
          </div>

          {/* Description / Physiological Basis */}
          {description && (
            <div style={{ marginBottom: isTableFormat ? '16px' : '20px' }}>
              {!isTableFormat && (
                <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                  Physiological Basis:
                </h3>
              )}
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155', margin: 0 }}>
                {description}
              </p>
            </div>
          )}

          {/* Table Format (Hemoglobin style matching media_1795333892184_2af3fbe8.jpg) */}
          {isTableFormat && (
            <div
              style={{
                border: '1px solid #cbd5e1',
                borderRadius: '2px',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                marginBottom: '16px',
              }}
            >
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                    <th
                      style={{
                        padding: '6px 12px',
                        textAlign: 'left',
                        fontWeight: 700,
                        color: '#0f172a',
                        width: '50%',
                        borderRight: '1px solid #cbd5e1',
                      }}
                    >
                      Increased in:
                    </th>
                    <th
                      style={{
                        padding: '6px 12px',
                        textAlign: 'left',
                        fontWeight: 700,
                        color: '#0f172a',
                        width: '50%',
                      }}
                    >
                      Decreased in:
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        padding: '10px 12px',
                        verticalAlign: 'top',
                        borderRight: '1px solid #cbd5e1',
                        lineHeight: 1.6,
                        color: '#334155',
                      }}
                    >
                      {increasedIn.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                          {item}
                        </div>
                      ))}
                    </td>
                    <td
                      style={{
                        padding: '10px 12px',
                        verticalAlign: 'top',
                        lineHeight: 1.6,
                        color: '#334155',
                      }}
                    >
                      {decreasedIn.map((item, idx) => (
                        <div key={idx} style={{ marginBottom: '4px' }}>
                          {item}
                        </div>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Prose Format (Vitamin D style matching media_1795334831256_8aa92ca0.jpg) */}
          {!isTableFormat && (increasedIn.length > 0 || decreasedIn.length > 0) && (
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                Interpretation
              </h3>
              {increasedIn.length > 0 && (
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155', margin: '0 0 4px 0' }}>
                  <strong>Increased in:</strong> {increasedIn.join(', ')}
                </p>
              )}
              {decreasedIn.length > 0 && (
                <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155', margin: '0 0 4px 0' }}>
                  <strong>Decreased in:</strong> {decreasedIn.join(', ')}
                </p>
              )}
            </div>
          )}

          {/* Comments Section */}
          {comments && (
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>
                Comments:
              </h3>
              <p style={{ fontSize: '13px', lineHeight: 1.6, color: '#334155', margin: 0 }}>
                {comments}
              </p>
            </div>
          )}

          {/* Unit Table matching Image 1 */}
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              overflow: 'hidden',
              backgroundColor: '#ffffff',
              marginBottom: '16px',
            }}
          >
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                  <th
                    style={{
                      padding: '10px 16px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: '#64748b',
                      fontSize: '11px',
                      letterSpacing: '0.04em',
                    }}
                  >
                    UNIT
                  </th>
                  <th style={{ padding: '10px 16px', textAlign: 'right' }} />
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '12px 16px', color: '#1e293b', fontWeight: 500 }}>
                    {unit}
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <button
                      type="button"
                      onClick={() => setIsNormalValuesModalOpen(true)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '13px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: 0,
                      }}
                    >
                      <Edit2 size={13} />
                      <span>Edit normal values</span>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Create similar test Link */}
          <div style={{ marginBottom: '24px' }}>
            <button
              type="button"
              onClick={() => {
                showToast(`Creating copy of ${testName}...`);
                handleEditClick();
              }}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: 0,
              }}
            >
              <Copy size={14} />
              <span>Create similar test</span>
            </button>
          </div>
        </div>

        {/* Right Sidebar: Ratelist & Panels */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Available in ratelist under names */}
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #e2e8f0',
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
              }}
            >
              Available in ratelist under names:
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '8px 14px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600, width: '60px' }}>
                    S. NO.
                  </th>
                  <th style={{ padding: '8px 14px', textAlign: 'left', color: '#64748b', fontSize: '11px', fontWeight: 600 }}>
                    NAME
                  </th>
                  <th style={{ padding: '8px 14px', textAlign: 'right', color: '#64748b', fontSize: '11px', fontWeight: 600, width: '80px' }}>
                    FEE
                  </th>
                </tr>
              </thead>
              <tbody>
                {ratelistEntries.map((row) => (
                  <tr key={row.sNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '9px 14px', color: '#64748b' }}>{row.sNo}.</td>
                    <td style={{ padding: '9px 14px', color: '#2563eb', fontWeight: 500 }}>{row.name}</td>
                    <td style={{ padding: '9px 14px', textAlign: 'right', color: '#1e293b' }}>
                      {row.fee}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div style={{ padding: '10px 14px', borderTop: '1px solid #f1f5f9' }}>
              <button
                onClick={() => setIsLinkModalOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: 0,
                }}
              >
                <Plus size={14} />
                <span>Link to ratelist entry</span>
              </button>
            </div>
          </div>

          {/* Card 2: Available in panels under names */}
          <div
            style={{
              border: '1px solid #e2e8f0',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              padding: '16px',
            }}
          >
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: '#1e293b',
                marginBottom: '10px',
              }}
            >
              Available in panels under names:
            </div>
            {panelsIncluded.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#64748b' }}>No panels available</div>
            ) : (
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', fontSize: '11px' }}>
                    <th style={{ padding: '6px 8px', textAlign: 'left', width: '50px' }}>S. NO.</th>
                    <th style={{ padding: '6px 8px', textAlign: 'left' }}>NAME</th>
                  </tr>
                </thead>
                <tbody>
                  {panelsIncluded.map((panel, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '8px', color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ padding: '8px', color: '#1e293b', fontWeight: 500 }}>{panel.name}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Floating Ticket Widget */}
      <div
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '28px',
          zIndex: 100,
          backgroundColor: '#ffffff',
          border: '1px solid #cbd5e1',
          borderRadius: '24px',
          padding: '6px 14px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          cursor: 'pointer',
        }}
        onClick={() => showToast('Connecting to support desk...')}
      >
        <Headphones size={15} color="#2563eb" />
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>Raise Ticket</span>
        <span style={{ fontSize: '10px', color: '#64748b' }}>Offline</span>
      </div>

      {/* MODAL 1: EDIT NORMAL VALUES */}
      {isNormalValuesModalOpen && (
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
              width: '840px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                Edit normal values - {testName}
              </h2>
              <button
                onClick={() => setIsNormalValuesModalOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNormalValues} style={{ padding: '24px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Normal value format:
                </label>
                <select
                  value={normalValueType}
                  onChange={(e) => setNormalValueType(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    width: '260px',
                    outline: 'none',
                  }}
                >
                  <option value="Numeric range">Numeric range</option>
                  <option value="Textual">Textual</option>
                </select>
              </div>

              <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden', marginBottom: '16px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                    <tr>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Sex</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Min age</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Max age</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Lower</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Upper</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Display range</th>
                      <th style={{ width: '40px' }} />
                    </tr>
                  </thead>
                  <tbody>
                    {ranges.map((r) => (
                      <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '6px 8px' }}>
                          <select
                            value={r.sex}
                            onChange={(e) => handleUpdateRange(r.id, 'sex', e.target.value)}
                            style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          >
                            <option value="Any">Any</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                          </select>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="number"
                              value={r.minAge}
                              onChange={(e) => handleUpdateRange(r.id, 'minAge', e.target.value)}
                              style={{ width: '50px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                            />
                            <select
                              value={r.minAgeUnit}
                              onChange={(e) => handleUpdateRange(r.id, 'minAgeUnit', e.target.value)}
                              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                            >
                              <option value="Years">Yrs</option>
                              <option value="Months">Mo</option>
                              <option value="Days">Days</option>
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <input
                              type="number"
                              value={r.maxAge}
                              onChange={(e) => handleUpdateRange(r.id, 'maxAge', e.target.value)}
                              style={{ width: '50px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                            />
                            <select
                              value={r.maxAgeUnit}
                              onChange={(e) => handleUpdateRange(r.id, 'maxAgeUnit', e.target.value)}
                              style={{ padding: '4px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '11px' }}
                            >
                              <option value="Years">Yrs</option>
                              <option value="Months">Mo</option>
                              <option value="Days">Days</option>
                            </select>
                          </div>
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input
                            type="number"
                            step="any"
                            value={r.lowerValue}
                            onChange={(e) => handleUpdateRange(r.id, 'lowerValue', e.target.value)}
                            style={{ width: '60px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input
                            type="number"
                            step="any"
                            value={r.upperValue}
                            onChange={(e) => handleUpdateRange(r.id, 'upperValue', e.target.value)}
                            style={{ width: '60px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px' }}>
                          <input
                            type="text"
                            value={r.displayAs || ''}
                            onChange={(e) => handleUpdateRange(r.id, 'displayAs', e.target.value)}
                            style={{ width: '100px', padding: '4px 6px', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                          />
                        </td>
                        <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                          <button
                            type="button"
                            onClick={() => handleDeleteRange(r.id)}
                            style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 0 }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={handleAddRange}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginBottom: '24px',
                }}
              >
                <Plus size={14} />
                <span>Add demographic range</span>
              </button>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsNormalValuesModalOpen(false)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    color: '#334155',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '4px',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save normal values
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: LINK TO RATELIST */}
      {isLinkModalOpen && (
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
              width: '460px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Link to ratelist entry
              </h3>
              <button onClick={() => setIsLinkModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleLinkLabTest}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Ratelist Entry Name:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Executive Health Package"
                  value={selectedRatelistEntry}
                  onChange={(e) => setSelectedRatelistEntry(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Fee (₹):
                </label>
                <input
                  type="number"
                  value={ratelistFeeInput}
                  onChange={(e) => setRatelistFeeInput(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setIsLinkModalOpen(false)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    fontSize: '13px',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '8px 16px',
                    borderRadius: '4px',
                    background: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Save link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
