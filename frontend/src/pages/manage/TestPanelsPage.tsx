import React, { useState, useEffect, useMemo } from 'react';
import { MultiSelectCombobox, MultiSelectOption } from '../../components/atoms/MultiSelectCombobox';
import { PANELS_LIBRARY_DATA, TESTS_LIBRARY_DATA, LibraryItem } from '../lab/InterpretationsLibraryPage';
import { RichInterpretationEditor } from '../lab/RichInterpretationEditor';
import { ALL_LABSMART_TESTS } from './allLabsmartTestsData';
import { ALL_LABSMART_PANELS, LabPanelDetail } from './allLabsmartPanelsData';
import { mastersApi } from '../../services/api';
import {
  Plus,
  HelpCircle,
  Search,
  CheckCircle2,
  Edit2,
  Eye,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  X,
  Play,
  Info,
  ChevronDown,
  ArrowUpDown,
} from 'lucide-react';

interface TestPanelsPageProps {
  onNavigate?: (screen: string) => void;
}

export interface TestPanelItem {
  id: string;
  order: number;
  name: string;
  category: string;
  price?: number;
  tests: string[];
  testsCount: number;
  ratelistEntries: Array<{ sNo: number; name: string; fee: number }>;
  ratelistSummary?: string;
  hideInterpretation?: boolean;
  hideMethodInstrument?: boolean;
  noteHtml?: string;
  interpretation?: string;
}

// Master list of all 252 clinical tests available in Labsmart database
const MASTER_TEST_OPTIONS: MultiSelectOption[] = ALL_LABSMART_TESTS.map((t) => ({
  label: t.name,
  value: t.name,
  category: t.category,
}));

export const TestPanelsPage: React.FC<TestPanelsPageProps> = ({ onNavigate }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize with all 24 live Labsmart panels
  const [panels, setPanels] = useState<TestPanelItem[]>(() => {
    return ALL_LABSMART_PANELS.map((p, idx) => ({
      id: p.id || String(idx + 1),
      order: p.order || idx + 1,
      name: p.name,
      category: p.category,
      price: p.ratelistEntries?.[0]?.fee || 200,
      tests: p.tests,
      testsCount: p.tests.length,
      ratelistEntries: p.ratelistEntries,
      ratelistSummary: p.ratelistEntries.map((r) => r.name).join(', '),
      hideInterpretation: p.hideInterpretation ?? true,
      hideMethodInstrument: p.hideMethodInstrument ?? false,
      noteHtml: p.noteHtml,
      interpretation: p.noteHtml,
    }));
  });

  // Modal State
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<TestPanelItem | null>(null);
  const [isHowToReorderOpen, setIsHowToReorderOpen] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  // Form Fields for Create / Edit
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

  // Fetch panels from backend API on mount
  useEffect(() => {
    const fetchBackendPanels = async () => {
      try {
        const res = await mastersApi.listPanels();
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          const backendPanels: TestPanelItem[] = res.data.map((bp: any, idx: number) => {
            let testsList: string[] = [];
            try {
              testsList = JSON.parse(bp.testIds || '[]');
            } catch {
              testsList = [];
            }

            let meta: any = {};
            try {
              meta = JSON.parse(bp.subheadings || '{}');
            } catch {
              meta = {};
            }

            return {
              id: bp.id,
              order: meta.order || idx + 1,
              name: bp.name,
              category: bp.category || bp.department || 'Biochemistry',
              price: bp.panelPrice || 200,
              tests: testsList,
              testsCount: testsList.length,
              ratelistEntries: meta.ratelistEntries || [{ sNo: 1, name: bp.name, fee: bp.panelPrice || 200 }],
              ratelistSummary: (meta.ratelistEntries || [{ name: bp.name }]).map((r: any) => r.name).join(', '),
              hideInterpretation: meta.hideInterpretation ?? true,
              hideMethodInstrument: meta.hideMethodInstrument ?? false,
              noteHtml: meta.noteHtml || '',
              interpretation: meta.noteHtml || '',
            };
          });

          // Merge: prioritize backend records
          setPanels((prev) => {
            const map = new Map<string, TestPanelItem>();
            prev.forEach((p) => map.set(p.name.toLowerCase(), p));
            backendPanels.forEach((p) => map.set(p.name.toLowerCase(), p));
            return Array.from(map.values()).sort((a, b) => a.order - b.order);
          });
        }
      } catch (err) {
        // Fallback to local ALL_LABSMART_PANELS
      }
    };
    fetchBackendPanels();
  }, []);

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
    setFormRatelist(panel.ratelistSummary || panel.ratelistEntries.map((r) => r.name).join(', '));
    setFormInterpretation(panel.noteHtml || panel.interpretation || '');
    setModalMode('edit');
  };

  const handleOpenView = (panel: TestPanelItem) => {
    setSelectedPanel(panel);
    setIsHowToReorderOpen(false);
    setModalMode('view');
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      showToast('Please enter a panel name');
      return;
    }

    const ratelistNames = formRatelist
      ? formRatelist.split(',').map((s) => s.trim()).filter(Boolean)
      : [formName.trim()];

    const rateEntries = ratelistNames.map((n, idx) => ({
      sNo: idx + 1,
      name: n,
      fee: Number(formPrice) || 200,
    }));

    if (modalMode === 'create') {
      const payload = {
        name: formName.trim(),
        category: formCategory,
        department: formCategory,
        testCount: formSelectedTests.length,
        testIds: JSON.stringify(formSelectedTests),
        subheadings: JSON.stringify({
          order: panels.length + 1,
          hideInterpretation: formHideInterpretation,
          hideMethodInstrument: formHideMethod,
          noteHtml: formInterpretation,
          ratelistEntries: rateEntries,
        }),
        panelPrice: Number(formPrice) || 200,
      };
      try {
        const res = await mastersApi.createPanel(payload);
        const newPanel: TestPanelItem = {
          id: res?.data?.id || `panel-${Date.now()}`,
          order: panels.length + 1,
          name: formName.trim(),
          category: formCategory,
          price: Number(formPrice) || 200,
          tests: formSelectedTests,
          testsCount: formSelectedTests.length,
          ratelistEntries: rateEntries,
          ratelistSummary: rateEntries.map((r) => r.name).join(', '),
          hideInterpretation: formHideInterpretation,
          hideMethodInstrument: formHideMethod,
          noteHtml: formInterpretation,
          interpretation: formInterpretation,
        };
        setPanels((prev) => [...prev, newPanel]);
        showToast(`Test panel "${newPanel.name}" added successfully.`);
      } catch (err: any) {
        showToast(err?.message || 'Unable to save panel to server.');
        return;
      }
    } else if (modalMode === 'edit' && selectedPanel) {
      const updatedPanel: TestPanelItem = {
        ...selectedPanel,
        name: formName.trim(),
        category: formCategory,
        price: Number(formPrice) || 200,
        tests: formSelectedTests,
        testsCount: formSelectedTests.length,
        ratelistEntries: rateEntries,
        ratelistSummary: rateEntries.map((r) => r.name).join(', '),
        hideInterpretation: formHideInterpretation,
        hideMethodInstrument: formHideMethod,
        noteHtml: formInterpretation,
        interpretation: formInterpretation,
      };

      try {
        const payload = {
          name: updatedPanel.name,
          category: updatedPanel.category,
          department: updatedPanel.category,
          testCount: updatedPanel.tests.length,
          testIds: JSON.stringify(updatedPanel.tests),
          subheadings: JSON.stringify({
            order: updatedPanel.order,
            hideInterpretation: updatedPanel.hideInterpretation,
            hideMethodInstrument: updatedPanel.hideMethodInstrument,
            noteHtml: updatedPanel.noteHtml,
            ratelistEntries: updatedPanel.ratelistEntries,
          }),
          panelPrice: updatedPanel.price,
        };
        const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-/i.test(selectedPanel.id);
        if (isUuid) {
          await mastersApi.updatePanel(selectedPanel.id, payload);
        } else {
          const created = await mastersApi.createPanel(payload);
          if (created?.data?.id) updatedPanel.id = created.data.id;
        }
        setPanels((prev) =>
          prev.map((p) => (p.id === selectedPanel.id ? updatedPanel : p))
        );
        showToast(`Test panel "${formName}" updated.`);
      } catch (err: any) {
        showToast(err?.message || 'Unable to update panel on server.');
        return;
      }
    }

    setModalMode(null);
  };

  const filteredPanels = panels.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tests.some((t) => t.toLowerCase().includes(q)) ||
      (p.ratelistSummary && p.ratelistSummary.toLowerCase().includes(q))
    );
  });

  return (
    <div
      style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '24px 32px 80px 32px',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
      }}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '6px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header matching media_1795334831256_8aa92ca0.jpg */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '16px',
        }}
      >
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test panels
        </h1>
        <button
          type="button"
          onClick={handleOpenCreate}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            padding: '7px 16px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Plus size={16} />
          <span>Add new</span>
        </button>
      </div>

      {/* Advisory Bar / Reorder Accordion info matching live Labsmart */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          backgroundColor: '#f8fafc',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        <div
          onClick={() => setIsHowToReorderOpen(!isHowToReorderOpen)}
          style={{
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <HelpCircle size={16} color="#64748b" />
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
              How to reorder?
            </span>
          </div>
          <ChevronDown
            size={16}
            color="#64748b"
            style={{
              transform: isHowToReorderOpen ? 'rotate(180deg)' : 'none',
              transition: 'transform 0.2s ease',
            }}
          />
        </div>

        {isHowToReorderOpen && (
          <div style={{ padding: '16px 20px', borderTop: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '12px' }}>
              Drag and drop rows using the handle icon (<ArrowUpDown size={13} style={{ display: 'inline', verticalAlign: 'middle' }} />) to reorder panels in printable lab reports.
            </div>
            <div style={{ maxWidth: '420px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #e2e8f0', marginBottom: '12px' }}>
              <img
                src="https://res.cloudinary.com/dgk7g7obu/image/upload/v1692697734/ls_software/how_it_works/Reorder_tests_within_this_panel_ocjmyf.gif"
                alt="How to reorder"
                style={{ width: '100%', display: 'block' }}
              />
            </div>
            <button
              type="button"
              onClick={() => setIsHowToReorderOpen(false)}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '4px',
                padding: '5px 14px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              I understand
            </button>
          </div>
        )}
      </div>

      {/* Panels Table matching screenshot: ORDER | NAME | CATEGORY | TESTS | RATELIST ENTRIES | ACTION */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '80px', padding: '10px 14px', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                ORDER
              </th>
              <th style={{ width: '240px', padding: '10px 14px', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                NAME
              </th>
              <th style={{ width: '150px', padding: '10px 14px', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                CATEGORY
              </th>
              <th style={{ padding: '10px 14px', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                TESTS
              </th>
              <th style={{ width: '280px', padding: '10px 14px', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                RATELIST ENTRIES
              </th>
              <th style={{ width: '130px', padding: '10px 14px', textAlign: 'center', fontWeight: 600, color: '#64748b', fontSize: '11px', letterSpacing: '0.04em' }}>
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPanels.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No test panels found matching "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredPanels.map((p, idx) => (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa')
                  }
                >
                  {/* ORDER with Drag Handle */}
                  <td style={{ padding: '12px 14px', color: '#64748b', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ArrowUpDown size={13} color="#94a3b8" style={{ cursor: 'grab' }} />
                      <span>{p.order}.</span>
                    </div>
                  </td>

                  {/* NAME */}
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#0f172a' }}>
                    {p.name}
                  </td>

                  {/* CATEGORY */}
                  <td style={{ padding: '12px 14px', color: '#475569' }}>
                    {p.category}
                  </td>

                  {/* TESTS */}
                  <td style={{ padding: '12px 14px', color: '#334155', lineHeight: 1.5 }}>
                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '2px' }}>
                      {p.tests.slice(0, 5).join(', ')}
                      {p.tests.length > 5 ? '...' : ''}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleOpenView(p)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#2563eb',
                        fontSize: '12px',
                        fontWeight: 600,
                        cursor: 'pointer',
                        padding: 0,
                      }}
                    >
                      ({p.testsCount || p.tests.length} tests) ▾
                    </button>
                  </td>

                  {/* RATELIST ENTRIES */}
                  <td style={{ padding: '12px 14px', color: '#475569', fontSize: '12px', lineHeight: 1.5 }}>
                    {p.ratelistSummary || p.ratelistEntries.map((r) => r.name).join(', ')}
                  </td>

                  {/* ACTION: Edit | View */}
                  <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
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
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleOpenView(p)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '13px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: 0,
                        }}
                      >
                        <Eye size={13} />
                        <span>View</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =========================================================================
          VIEW TEST PANEL MODAL (EXACT 1:1 REPLICA OF LIVE LABSMART MODAL)
          ========================================================================= */}
      {modalMode === 'view' && selectedPanel && (
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
              width: '940px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Modal Header Bar with Title and Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 24px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>
                View test panel
              </div>
              <button
                type="button"
                onClick={() => setModalMode(null)}
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

            {/* Modal Body matching live Labsmart HTML exactly */}
            <div
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                fontSize: '13px',
                color: '#1e293b',
              }}
            >
              {/* Header inside body: Panel Title + Watch Video Button */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px',
                }}
              >
                <h1
                  style={{
                    fontSize: '22px',
                    fontWeight: 700,
                    color: '#0f172a',
                    margin: 0,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {selectedPanel.name}
                </h1>

                <button
                  type="button"
                  onClick={() => setIsVideoModalOpen(true)}
                  style={{
                    backgroundColor: '#dbeafe',
                    color: '#1d4ed8',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '6px 12px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Play size={14} fill="#1d4ed8" />
                  <span>Watch Video</span>
                </button>
              </div>

              {/* Informational lines matching live Labsmart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
                  <Info size={14} color="#64748b" />
                  <span>
                    Individual test interpretation, notes, comments are{' '}
                    <strong>{selectedPanel.hideInterpretation ? 'hidden' : 'displayed'}</strong>.
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
                  <Info size={14} color="#64748b" />
                  <span>
                    Individual test method and instrument are{' '}
                    <strong>{selectedPanel.hideMethodInstrument ? 'hidden' : 'displayed'}</strong>.
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#0f172a', fontWeight: 600, fontSize: '13px' }}>
                  <Info size={14} color="#0f172a" />
                  <span>Category: {selectedPanel.category}</span>
                </div>
              </div>

              {/* Two Column Layout: Tests Table (left) & How to reorder (right) */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 340px',
                  gap: '24px',
                  alignItems: 'start',
                  marginBottom: '24px',
                }}
              >
                {/* Left: Lab Tests Table with Order */}
                <div
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ width: '70px', padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                          Order
                        </th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                          Lab Tests
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPanel.tests.map((testName, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px', color: '#64748b' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <ArrowUpDown size={12} color="#94a3b8" style={{ cursor: 'grab' }} />
                              <span>{i + 1}.</span>
                            </div>
                          </td>
                          <td style={{ padding: '8px 12px', color: '#0f172a', fontWeight: 500 }}>
                            {testName}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Right: How to reorder accordion */}
                <div
                  style={{
                    borderRadius: '6px',
                    backgroundColor: '#f1f5f9',
                    padding: '14px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    onClick={() => setIsHowToReorderOpen(!isHowToReorderOpen)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <HelpCircle size={15} color="#475569" />
                      <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                        How to reorder?
                      </span>
                    </div>
                    <ChevronDown
                      size={15}
                      color="#64748b"
                      style={{
                        transform: isHowToReorderOpen ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </div>

                  {isHowToReorderOpen && (
                    <div style={{ marginTop: '12px' }}>
                      <img
                        src="https://res.cloudinary.com/dgk7g7obu/image/upload/v1692697734/ls_software/how_it_works/Reorder_tests_within_this_panel_ocjmyf.gif"
                        alt="Reorder animation"
                        style={{ width: '100%', borderRadius: '6px', border: '1px solid #cbd5e1', marginBottom: '10px' }}
                      />
                      <button
                        type="button"
                        onClick={() => setIsHowToReorderOpen(false)}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '4px',
                          padding: '5px 12px',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        I understand
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Note / Clinical Interpretation Box */}
              {(selectedPanel.noteHtml || selectedPanel.interpretation) && (
                <div style={{ marginBottom: '24px' }}>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                    Note:
                  </div>
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '14px',
                      fontSize: '13px',
                      lineHeight: '1.6',
                      color: '#334155',
                      overflowX: 'auto',
                    }}
                    dangerouslySetInnerHTML={{
                      __html: selectedPanel.noteHtml || selectedPanel.interpretation || '',
                    }}
                  />
                </div>
              )}

              {/* Available in ratelist under names Table */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '8px' }}>
                  Available in ratelist under names:
                </div>
                <div
                  style={{
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    overflow: 'hidden',
                    maxWidth: '560px',
                    backgroundColor: '#ffffff',
                  }}
                >
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #cbd5e1' }}>
                        <th style={{ width: '60px', padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                          S. no.
                        </th>
                        <th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                          Name
                        </th>
                        <th style={{ width: '90px', padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#475569', fontSize: '12px' }}>
                          Fee
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPanel.ratelistEntries.map((row, idx) => (
                        <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 12px', color: '#64748b' }}>{row.sNo || idx + 1}.</td>
                          <td style={{ padding: '8px 12px', color: '#0f172a', fontWeight: 500 }}>{row.name}</td>
                          <td style={{ padding: '8px 12px', textAlign: 'right', color: '#0f172a', fontWeight: 600 }}>
                            {row.fee}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                padding: '12px 24px',
                borderTop: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <button
                type="button"
                onClick={() => setModalMode(null)}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '6px 18px',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          CREATE / EDIT TEST PANEL MODAL
          ========================================================================= */}
      {(modalMode === 'create' || modalMode === 'edit') && (
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
              width: '780px',
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
                {modalMode === 'create' ? 'Add Test Panel' : `Edit Panel: ${selectedPanel?.name}`}
              </h2>
              <button
                type="button"
                onClick={() => setModalMode(null)}
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

            <form
              onSubmit={handleSaveForm}
              style={{
                padding: '24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Panel Name <span style={{ color: '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Complete Blood Count (CBC)"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
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
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    Price (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 350"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
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

              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
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
                </select>
              </div>

              {/* Checkboxes matching live Labsmart */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

              {/* MultiSelectCombobox for component tests */}
              <div>
                <MultiSelectCombobox
                  label="Tests"
                  placeholder="Select component tests..."
                  options={MASTER_TEST_OPTIONS}
                  selectedValues={formSelectedTests}
                  onChange={setFormSelectedTests}
                  helpText="ⓘ Search from all 252 clinical tests."
                />
              </div>

              {/* Associated Ratelist Packages */}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Associated Ratelist Packages (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Complete Blood Count (CBC), CBC with GBP"
                  value={formRatelist}
                  onChange={(e) => setFormRatelist(e.target.value)}
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

              {/* Pink callout banner */}
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
                    to update.
                  </span>
                </div>
              </div>

              {/* Panel Interpretation */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    Panel Interpretation / Note
                  </label>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Use <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Shift</kbd> + <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Enter</kbd> key to go to new line.
                  </span>
                </div>
                <RichInterpretationEditor
                  key={`${selectedPanel?.id || 'new'}-${modalMode}`}
                  initialValue={formInterpretation}
                  onChange={(html) => setFormInterpretation(html)}
                  minHeight="220px"
                  placeholder="Enter clinical notes, possible causes of abnormal parameters, etc."
                />
              </div>

              {/* Form Actions */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', paddingTop: '10px', borderTop: '1px solid #e2e8f0' }}>
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
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
                    padding: '8px 20px',
                    borderRadius: '4px',
                    border: 'none',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {modalMode === 'create' ? 'Add Panel' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Library Reference Picker Modal */}
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
              borderRadius: '8px',
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Interpretations Library
              </h3>
              <button
                type="button"
                onClick={() => setIsLibraryPickerOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ padding: '12px 20px', borderBottom: '1px solid #e2e8f0', display: 'flex', gap: '8px' }}>
              <button
                type="button"
                onClick={() => setPickerTab('panels')}
                style={{
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: pickerTab === 'panels' ? '#2563eb' : '#f1f5f9',
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
                  padding: '5px 12px',
                  borderRadius: '4px',
                  border: 'none',
                  backgroundColor: pickerTab === 'tests' ? '#2563eb' : '#f1f5f9',
                  color: pickerTab === 'tests' ? '#ffffff' : '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Tests ({TESTS_LIBRARY_DATA.length})
              </button>
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto', padding: '12px 20px' }}>
              {filteredPickerItems.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid #f1f5f9',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>{item.category}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormInterpretation(item.htmlContent || item.rawText);
                      setIsLibraryPickerOpen(false);
                      showToast(`Applied "${item.name}" interpretation!`);
                    }}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Copy to Panel
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Video Modal matching live Labsmart "Watch Video" */}
      {isVideoModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              width: '720px',
              maxWidth: '96vw',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e2e8f0' }}>
              <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                How to manage test panels
              </div>
              <button
                type="button"
                onClick={() => setIsVideoModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '0', backgroundColor: '#000000' }}>
              <video
                src="https://d33hv1py9n6skn.cloudfront.net/public/Manage%20panels.mp4"
                controls
                autoPlay
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
