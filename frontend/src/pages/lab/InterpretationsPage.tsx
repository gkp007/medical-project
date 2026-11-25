import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Plus,
  ExternalLink,
  Edit2,
  MoreVertical,
  CheckCircle2,
  FileText,
  X,
  XCircle,
  Trash2,
  Copy,
  Headphones,
  ChevronDown,
  Check,
} from 'lucide-react';
import {
  TESTS_LIBRARY_DATA,
  PANELS_LIBRARY_DATA,
  LibraryItem,
} from './interpretationsLibraryData';
import { RichInterpretationEditor } from './RichInterpretationEditor';
import { pathologyApi, mastersApi } from '../../services/api';
import { ALL_LABSMART_TESTS } from '../manage/allLabsmartTestsData';

export interface InterpretationItem {
  id: string;
  sNo: number;
  name: string;
  testCode?: string;
  type: 'test' | 'panel';
  physiologicalBasis: string;
  increasedIn?: string;
  decreasedIn?: string;
  comments: string;
  htmlContent?: string;
}

interface InterpretationsPageProps {
  onNavigate?: (screen: string) => void;
}

export const InterpretationsPage: React.FC<InterpretationsPageProps> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState<'test' | 'panel'>('panel'); // Default to 'panel' matching user screenshot
  const [searchQuery, setSearchQuery] = useState('');
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view' | null>(null);
  const [selectedItem, setSelectedItem] = useState<InterpretationItem | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formType, setFormType] = useState<'test' | 'panel'>('panel');
  const [formPhysiology, setFormPhysiology] = useState('');
  const [formIncreased, setFormIncreased] = useState('');
  const [formDecreased, setFormDecreased] = useState('');
  const [formComments, setFormComments] = useState('');
  const [editorHtml, setEditorHtml] = useState('');
  const [editorText, setEditorText] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [itemSearchQuery, setItemSearchQuery] = useState('');

  const menuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [dropdownFilter, setDropdownFilter] = useState<'all' | 'panel' | 'test'>('all');

  // Close popup menu & dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenuId(null);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Build the 13 Panels matching the screenshot exactly
  const initialPanels: InterpretationItem[] = useMemo(() => {
    return PANELS_LIBRARY_DATA.map((p, idx) => ({
      id: `panel-${idx + 1}`,
      sNo: idx + 1,
      name: p.name,
      type: 'panel',
      physiologicalBasis: p.rawText.split('\n\n')[1] || p.rawText,
      increasedIn: '',
      decreasedIn: '',
      comments: p.rawText,
      htmlContent: p.htmlContent,
    }));
  }, []);

  // Build the 116 Tests matching live Labsmart exactly
  const initialTests: InterpretationItem[] = useMemo(() => {
    return TESTS_LIBRARY_DATA.map((t, idx) => ({
      id: t.id || `test-${idx + 1}`,
      sNo: idx + 1,
      name: t.name,
      type: 'test',
      physiologicalBasis: t.rawText.split('\n\n')[1] || t.rawText,
      increasedIn: '',
      decreasedIn: '',
      comments: t.rawText,
      htmlContent: t.htmlContent,
    }));
  }, []);

  // State holding both panels and tests
  const [items, setItems] = useState<InterpretationItem[]>([]);

  const testCount = useMemo(() => items.filter((i) => i.type === 'test').length, [items]);
  const panelCount = useMemo(() => items.filter((i) => i.type === 'panel').length, [items]);

  const filteredItems = useMemo(() => {
    const list = items.filter((i) => i.type === activeTab);
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.physiologicalBasis.toLowerCase().includes(q) ||
        (item.comments && item.comments.toLowerCase().includes(q))
    );
  }, [items, activeTab, searchQuery]);

  const getItemInitialContent = (item: InterpretationItem): string => {
    if (item.htmlContent) return item.htmlContent;
    if (item.comments && item.comments.includes('Interpretation for')) {
      return item.comments;
    }
    const blocks: string[] = [];
    if (item.physiologicalBasis) {
      blocks.push(`Physiological Basis:\n${item.physiologicalBasis}`);
    }
    if (item.increasedIn || item.decreasedIn) {
      let intBlock = 'Interpretation\n';
      if (item.increasedIn) intBlock += `Increased in: ${item.increasedIn}\n`;
      if (item.decreasedIn) intBlock += `Decreased in: ${item.decreasedIn}`;
      blocks.push(intBlock.trim());
    }
    if (item.comments) {
      blocks.push(`Comments:\n${item.comments}`);
    }
    return blocks.length > 0 ? blocks.join('\n\n') : (item.comments || item.physiologicalBasis || '');
  };

  const handleOpenCreate = () => {
    setFormName('');
    setFormType(activeTab);
    setDropdownFilter(activeTab === 'panel' ? 'all' : 'test');
    setFormPhysiology('');
    setFormIncreased('');
    setFormDecreased('');
    setFormComments('');
    setEditorHtml('');
    setEditorText('');
    setSelectedItem(null);
    setIsDropdownOpen(false);
    setItemSearchQuery('');
    setModalMode('create');
  };

  const handleOpenEdit = (item: InterpretationItem) => {
    setSelectedItem(item);
    setFormName(item.name);
    setFormType(item.type);
    setFormPhysiology(item.physiologicalBasis);
    setFormIncreased(item.increasedIn || '');
    setFormDecreased(item.decreasedIn || '');
    setFormComments(item.comments);
    const initialText = getItemInitialContent(item);
    setEditorHtml(initialText);
    setEditorText(initialText);
    setModalMode('edit');
    setActiveMenuId(null);
  };

  const handleOpenView = (item: InterpretationItem) => {
    setSelectedItem(item);
    setModalMode('view');
    setActiveMenuId(null);
  };

  const [backendTests, setBackendTests] = useState<any[]>([]);

  useEffect(() => {
    const fetchBackendInterpretations = async () => {
      try {
        const [res, testsRes] = await Promise.all([
          pathologyApi.getInterpretations(),
          mastersApi.listTests().catch(() => ({ success: false, data: [] })),
        ]);
        if (testsRes?.success && Array.isArray(testsRes.data)) {
          setBackendTests(testsRes.data);
        }
        if (res?.data && Array.isArray(res.data)) {
          const backendItems: InterpretationItem[] = res.data.map((bi: any, index: number) => ({
            id: bi.id,
            sNo: index + 1,
            name: bi.title,
            testCode: bi.testCode,
            type: bi.department === 'Panel' || bi.testCode?.startsWith('PANEL-') ? 'panel' : 'test',
            physiologicalBasis: bi.content?.slice(0, 300) || '',
            increasedIn: '',
            decreasedIn: '',
            comments: bi.content || '',
            htmlContent: bi.content || '',
          }));

          setItems(backendItems.sort((a, b) => a.name.localeCompare(b.name)));
        }
      } catch (err) {
        // Fallback to local
      }
    };
    fetchBackendInterpretations();
  }, []);

  const handleDeleteItem = async (id: string, name: string) => {
    try {
      const response = await pathologyApi.deleteInterpretation(id);
      if (!response.success) throw new Error(response.message || 'Unable to delete interpretation');
      setItems((prev) => prev.filter((i) => i.id !== id));
      showToast(`Deleted interpretation for "${name}".`);
    } catch (error: any) { showToast(error?.message || 'Unable to delete interpretation.'); }
    setActiveMenuId(null);
  };

  const handleDuplicateItem = async (item: InterpretationItem) => {
    const duplicate: InterpretationItem = {
      ...item,
      id: `item-${Date.now()}`,
      sNo: items.filter((i) => i.type === item.type).length + 1,
      name: `${item.name} (Copy)`,
    };
    try {
      const response = await pathologyApi.createInterpretation({
        title: duplicate.name,
        testCode: duplicate.type === 'panel' ? `PANEL-${duplicate.name.replace(/\s+/g, '-').toUpperCase()}` : duplicate.name.replace(/\s+/g, '-').toUpperCase(),
        department: duplicate.type === 'panel' ? 'Panel' : 'Biochemistry',
        content: duplicate.htmlContent || duplicate.comments,
      });
      if (!response.success) throw new Error(response.message || 'Unable to duplicate interpretation');
      duplicate.id = response.data.id;
      setItems((prev) => [...prev, duplicate]);
      showToast(`Duplicated "${item.name}".`);
    } catch (error: any) { showToast(error?.message || 'Unable to duplicate interpretation.'); }
    setActiveMenuId(null);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (modalMode === 'create') {
      const newItem: InterpretationItem = {
        id: `custom-${Date.now()}`,
        sNo: items.filter((i) => i.type === formType).length + 1,
        name: formName.trim(),
        type: formType,
        physiologicalBasis: editorText.slice(0, 300),
        increasedIn: formIncreased.trim(),
        decreasedIn: formDecreased.trim(),
        comments: editorText.trim(),
        htmlContent: editorHtml,
      };
      try {
        const response = await pathologyApi.createInterpretation({
          title: formName.trim(),
          testCode:
            formType === 'panel'
              ? `PANEL-${formName.trim().replace(/\s+/g, '-').toUpperCase()}`
              : formName.trim().replace(/\s+/g, '-').toUpperCase(),
          department: formType === 'panel' ? 'Panel' : 'Biochemistry',
          content: editorHtml || editorText,
        });
        if (!response.success) throw new Error(response.message || 'Unable to save interpretation');
        newItem.id = response.data.id;
        setItems((prev) => [...prev, newItem]);
        showToast(`Added interpretation for "${formName}".`);
      } catch (error: any) { showToast(error?.message || 'Unable to save interpretation.'); return; }
    } else if (modalMode === 'edit' && selectedItem) {
      const updated = items.map((i) =>
        i.id === selectedItem.id
          ? {
              ...i,
              name: formName.trim(),
              type: formType,
              physiologicalBasis: editorText.slice(0, 300),
              comments: editorText.trim(),
              htmlContent: editorHtml,
            }
          : i
      );
      try {
        const response = await pathologyApi.updateInterpretation(selectedItem.id, {
          title: formName.trim(),
          content: editorHtml || editorText,
        });
        if (!response.success) throw new Error(response.message || 'Unable to save interpretation');
        setItems(updated);
        showToast(`Updated interpretation for "${formName}".`);
      } catch (error: any) { showToast(error?.message || 'Unable to save interpretation.'); return; }
    }
    setModalMode(null);
  };

  // Formatter for interpretation preview snippet
  const renderInterpretationSnippet = (item: InterpretationItem) => {
    const rawText = item.physiologicalBasis || item.comments || '';
    const text = rawText.replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    if (item.name.toLowerCase().includes('bilirubin')) {
      return (
        <span>
          <strong>Physiological basis</strong>
        </span>
      );
    }
    if (item.name.toLowerCase().includes('blood sugar')) {
      return (
        <span>
          <strong>Clinical Notes</strong>
        </span>
      );
    }
    if (item.name.toLowerCase().includes('bt & ct')) {
      return (
        <span>
          The <strong>bleeding time</strong> test assesses primary hemostasis (vascular and platelet
          components) and is
        </span>
      );
    }
    if (item.name.toLowerCase().includes('cbc') || item.name.toLowerCase().includes('complete blood')) {
      return (
        <span>
          <strong>Clinical Notes:</strong>
        </span>
      );
    }
    if (item.name.toLowerCase().includes('iron studies')) {
      return (
        <span>
          <strong>Physiological basis</strong>
        </span>
      );
    }
    if (item.name.toLowerCase().includes('kft')) {
      return (
        <span>
          <strong>Creatinine</strong> is a nitrogenous waste product formed in muscle from creatine
          phosphate. Endogenous
        </span>
      );
    }
    if (item.name.toLowerCase().includes('lipid')) {
      return (
        <span>
          Abnormalities of lipids are associated with increased risk of coronary artery disease (CAD) in
          patients
        </span>
      );
    }
    if (text.startsWith('Physiological basis:')) {
      return (
        <span>
          <strong>Physiological basis:</strong> {text.replace('Physiological basis:', '').slice(0, 100)}...
        </span>
      );
    }
    if (text.startsWith('Clinical Notes:')) {
      return (
        <span>
          <strong>Clinical Notes:</strong> {text.replace('Clinical Notes:', '').slice(0, 100)}...
        </span>
      );
    }
    return <span>{text.slice(0, 110)}...</span>;
  };

  return (
    <div
      style={{
        padding: '24px 32px 60px 32px',
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

      {/* Title */}
      <h1
        style={{
          fontSize: '22px',
          fontWeight: 700,
          color: '#1e293b',
          margin: '0 0 14px 0',
          letterSpacing: '-0.01em',
        }}
      >
        Interpretations
      </h1>

      {/* Pink Announcement Banner matching Labsmart exact screenshot */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          borderRadius: '6px',
          backgroundColor: '#fdf2f8',
          border: '1px solid #fbcfe8',
          color: '#9d174d',
          fontSize: '13px',
          marginBottom: '16px',
        }}
      >
        <span style={{ color: '#db2777', display: 'flex', alignItems: 'center' }}>
          <FileText size={15} />
        </span>
        <span>You can now copy interpretations from</span>
        <a
          href="#interpretations_library"
          onClick={(e) => {
            e.preventDefault();
            if (onNavigate) onNavigate('interpretations_library');
          }}
          style={{
            color: '#2563eb',
            fontWeight: 500,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            cursor: 'pointer',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.textDecoration = 'underline')}
          onMouseLeave={(e) => (e.currentTarget.style.textDecoration = 'none')}
        >
          <span>Library</span>
          <ExternalLink size={12} />
        </a>
        <span>to update.</span>
        <span
          style={{
            backgroundColor: '#f43f5e',
            color: '#ffffff',
            fontSize: '10px',
            fontWeight: 700,
            padding: '1px 6px',
            borderRadius: '4px',
            letterSpacing: '0.04em',
            marginLeft: '2px',
          }}
        >
          NEW
        </span>
      </div>

      {/* Tabs: Test 116 | Panels 13 */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '24px',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        <button
          onClick={() => setActiveTab('test')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'test' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px 10px 4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: activeTab === 'test' ? 600 : 500,
            color: activeTab === 'test' ? '#2563eb' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Test</span>
          <span
            style={{
              backgroundColor: activeTab === 'test' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'test' ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              minWidth: '22px',
              textAlign: 'center',
            }}
          >
            {testCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('panel')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'panel' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px 10px 4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: activeTab === 'panel' ? 600 : 500,
            color: activeTab === 'panel' ? '#2563eb' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Panels</span>
          <span
            style={{
              backgroundColor: activeTab === 'panel' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'panel' ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              minWidth: '22px',
              textAlign: 'center',
            }}
          >
            {panelCount}
          </span>
        </button>
      </div>

      {/* Row with Search in page on left and + Add new on right */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          gap: '16px',
        }}
      >
        {/* Search in page */}
        <div style={{ position: 'relative', width: '280px', maxWidth: '100%' }}>
          <Search
            size={15}
            color="#94a3b8"
            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search in page"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '7px 28px 7px 32px',
              borderRadius: '4px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '13px',
              color: '#1e293b',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              style={{
                position: 'absolute',
                right: '8px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                padding: '2px',
              }}
            >
              <X size={13} />
            </button>
          )}
        </div>

        {/* + Add new Button */}
        <button
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
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1d4ed8')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#2563eb')}
        >
          <Plus size={15} />
          <span>Add new</span>
        </button>
      </div>

      {/* Main Table: S. NO. | NAME | INTERPRETATION | ACTION */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          overflow: 'visible',
          backgroundColor: '#ffffff',
        }}
      >
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '13px',
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: '#ffffff',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <th
                style={{
                  padding: '10px 16px',
                  fontWeight: 600,
                  color: '#64748b',
                  width: '70px',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                S. NO.
              </th>
              <th
                style={{
                  padding: '10px 16px',
                  fontWeight: 600,
                  color: '#64748b',
                  width: '260px',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                NAME
              </th>
              <th
                style={{
                  padding: '10px 16px',
                  fontWeight: 600,
                  color: '#64748b',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                INTERPRETATION
              </th>
              <th
                style={{
                  padding: '10px 16px',
                  fontWeight: 600,
                  color: '#64748b',
                  textAlign: 'right',
                  width: '180px',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                ACTION
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: '36px',
                    textAlign: 'center',
                    color: '#64748b',
                    fontSize: '13px',
                  }}
                >
                  No matching interpretations found for "{searchQuery}".
                </td>
              </tr>
            ) : (
              filteredItems.map((item, idx) => (
                <tr
                  key={item.id}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: idx % 2 === 0 ? '#ffffff' : '#fafafa',
                    transition: 'background-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#ffffff' : '#fafafa')
                  }
                >
                  {/* S. NO. */}
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 500,
                      verticalAlign: 'middle',
                    }}
                  >
                    {idx + 1}.
                  </td>

                  {/* NAME */}
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500,
                      verticalAlign: 'middle',
                    }}
                  >
                    {item.name}
                  </td>

                  {/* INTERPRETATION Preview */}
                  <td
                    style={{
                      padding: '12px 16px',
                      color: '#475569',
                      fontSize: '13px',
                      lineHeight: '1.5',
                      verticalAlign: 'middle',
                    }}
                  >
                    {renderInterpretationSnippet(item)}
                  </td>

                  {/* ACTION: View all | Edit | ... */}
                  <td
                    style={{
                      padding: '12px 16px',
                      textAlign: 'right',
                      verticalAlign: 'middle',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '12px',
                      }}
                    >
                      {/* View all Button */}
                      <button
                        onClick={() => handleOpenView(item)}
                        style={{
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '3px 10px',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: '#334155',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#f1f5f9';
                          e.currentTarget.style.borderColor = '#94a3b8';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = '#ffffff';
                          e.currentTarget.style.borderColor = '#cbd5e1';
                        }}
                      >
                        View all
                      </button>

                      {/* Edit Button */}
                      <button
                        onClick={() => handleOpenEdit(item)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#2563eb',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          padding: 0,
                        }}
                      >
                        <Edit2 size={13} />
                        <span>Edit</span>
                      </button>

                      {/* Three Dots Menu Button */}
                      <div style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                          onClick={() => setActiveMenuId(activeMenuId === item.id ? null : item.id)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#64748b',
                            cursor: 'pointer',
                            padding: '4px',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                          }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {/* Dropdown Menu matching Image 2 */}
                        {activeMenuId === item.id && (
                          <div
                            ref={menuRef}
                            style={{
                              position: 'absolute',
                              right: 0,
                              ...(idx >= filteredItems.length - 1 && filteredItems.length > 1
                                ? { bottom: '100%', marginBottom: '4px' }
                                : { top: '100%', marginTop: '4px' }),
                              backgroundColor: '#ffffff',
                              border: '1px solid #cbd5e1',
                              borderRadius: '4px',
                              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.12)',
                              zIndex: 100,
                              minWidth: '120px',
                              padding: '4px 0',
                              textAlign: 'left',
                            }}
                          >
                            <button
                              onClick={() => {
                                const normalized = item.name.trim().toLowerCase();
                                const matchedBackend = backendTests.find(
                                  (t: any) =>
                                    t.name?.trim().toLowerCase() === normalized ||
                                    (item.testCode && t.code?.trim().toLowerCase() === item.testCode.trim().toLowerCase())
                                );
                                const matchedLocal = ALL_LABSMART_TESTS.find(
                                  (t) =>
                                    t.name.trim().toLowerCase() === normalized ||
                                    t.shortName?.trim().toLowerCase() === normalized
                                );
                                const targetId = matchedBackend?.id || matchedLocal?.id || item.name;
                                localStorage.setItem('labsmart_active_test_id', targetId);
                                window.open(`/lab_tests/${encodeURIComponent(targetId)}`, '_blank');
                                setActiveMenuId(null);
                              }}
                              style={{
                                width: '100%',
                                padding: '8px 14px',
                                background: 'none',
                                border: 'none',
                                textAlign: 'left',
                                fontSize: '13px',
                                color: '#1e293b',
                                cursor: 'pointer',
                                display: 'block',
                                transition: 'background-color 0.1s ease',
                              }}
                              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                            >
                              View test
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

      {/* Floating Raise Ticket offline widget matching Labsmart bottom right */}
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
        onClick={() => showToast('Support is currently offline. You can contact support via email.')}
      >
        <div
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            backgroundColor: '#eff6ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#2563eb',
          }}
        >
          <Headphones size={15} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#1e293b', lineHeight: '14px' }}>
            Raise Ticket
          </span>
          <span
            style={{
              fontSize: '11px',
              color: '#64748b',
              lineHeight: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: '#94a3b8',
                display: 'inline-block',
              }}
            />
            Offline
          </span>
        </div>
      </div>

      {/* View All Modal matching Image 2 */}
      {modalMode === 'view' && selectedItem && (
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
              width: '700px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
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
                padding: '16px 24px',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Interpreation
              </h2>
              <button
                onClick={() => setModalMode(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  cursor: 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <XCircle size={18} />
              </button>
            </div>

            {/* Content matching Image 2 */}
            <div
              style={{
                padding: '20px 24px 28px 24px',
                overflowY: 'auto',
                flex: 1,
                fontSize: '13px',
                lineHeight: 1.6,
                color: '#1e293b',
              }}
            >
              {/* Test / Panel Name */}
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '2px' }}>
                  {selectedItem.type === 'panel' ? 'Panel name:' : 'Test name:'}
                </div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>
                  {selectedItem.name}
                </div>
              </div>

              {/* Interpretation Label */}
              <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '8px' }}>
                Interpretation:
              </div>

              {/* Structured Typography View */}
              <div style={{ fontSize: '13px', lineHeight: 1.65, color: '#1e293b' }}>
                {selectedItem.htmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: selectedItem.htmlContent }} />
                ) : (
                  <>
                    {selectedItem.physiologicalBasis && (
                      <div style={{ marginBottom: '14px' }}>
                        <strong>Physiological Basis:</strong><br />
                        {selectedItem.physiologicalBasis.replace(/^Interpretation for [^:]+:\s*/i, '')}
                      </div>
                    )}

                    {(selectedItem.increasedIn || selectedItem.decreasedIn) && (
                      <div style={{ marginBottom: '14px' }}>
                        <strong>Interpretation</strong><br />
                        {selectedItem.increasedIn && (
                          <div><strong>Increased in:</strong> {selectedItem.increasedIn}</div>
                        )}
                        {selectedItem.decreasedIn && (
                          <div><strong>Decreased in:</strong> {selectedItem.decreasedIn}</div>
                        )}
                      </div>
                    )}

                    {selectedItem.comments && !selectedItem.comments.includes('Possible causes') && (
                      <div style={{ marginBottom: '14px' }}>
                        <strong>Comments:</strong><br />
                        {selectedItem.comments}
                      </div>
                    )}

                    {!selectedItem.physiologicalBasis && !selectedItem.increasedIn && !selectedItem.comments && (
                      <div>No interpretation text available for this test.</div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Modal matching Image 1 */}
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
              width: '740px',
              maxWidth: '96vw',
              maxHeight: '90vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
            }}
          >
            {/* Modal Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              <h2 style={{ fontSize: '17px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                {modalMode === 'create'
                  ? formType === 'panel'
                    ? 'Add panel interpretation'
                    : 'Add test interpretation'
                  : 'Edit interpretation'}
              </h2>
              <button
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

            {/* Form Body matching Image 1 & 3 */}
            <form
              onSubmit={handleSaveForm}
              style={{
                padding: '20px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Test / Panel Name with Searchable Dropdown matching Image 3 */}
              <div style={{ position: 'relative' }}>
                <label style={{ display: 'block', fontSize: '13px', color: '#475569', marginBottom: '6px' }}>
                  {formType === 'panel' ? 'Panel name' : 'Test name'}
                </label>
                {modalMode === 'edit' ? (
                  <div style={{ fontSize: '15px', fontWeight: 600, color: '#1e293b' }}>
                    {formName}
                  </div>
                ) : (
                  <div ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        borderRadius: '4px',
                        border: '1px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        textAlign: 'left',
                        fontSize: '13px',
                        color: formName ? '#1e293b' : '#64748b',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <span>{formName || (formType === 'panel' ? 'Select a panel' : 'Select a test')}</span>
                      <ChevronDown size={14} color="#64748b" />
                    </button>

                    {isDropdownOpen && (
                      <div
                        style={{
                          position: 'absolute',
                          top: '100%',
                          left: 0,
                          right: 0,
                          marginTop: '4px',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.12)',
                          zIndex: 1000,
                          overflow: 'hidden',
                        }}
                      >
                        {/* Tab Switcher inside Dropdown: All | Panels | Tests */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '4px',
                            padding: '6px 8px',
                            backgroundColor: '#f1f5f9',
                            borderBottom: '1px solid #e2e8f0',
                          }}
                        >
                          <button
                            type="button"
                            onClick={() => setDropdownFilter('all')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: 'none',
                              backgroundColor: dropdownFilter === 'all' ? '#2563eb' : 'transparent',
                              color: dropdownFilter === 'all' ? '#ffffff' : '#64748b',
                            }}
                          >
                            All ({PANELS_LIBRARY_DATA.length + TESTS_LIBRARY_DATA.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setDropdownFilter('panel')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: 'none',
                              backgroundColor: dropdownFilter === 'panel' ? '#2563eb' : 'transparent',
                              color: dropdownFilter === 'panel' ? '#ffffff' : '#64748b',
                            }}
                          >
                            Panels ({PANELS_LIBRARY_DATA.length})
                          </button>
                          <button
                            type="button"
                            onClick={() => setDropdownFilter('test')}
                            style={{
                              padding: '3px 10px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: 600,
                              cursor: 'pointer',
                              border: 'none',
                              backgroundColor: dropdownFilter === 'test' ? '#2563eb' : 'transparent',
                              color: dropdownFilter === 'test' ? '#ffffff' : '#64748b',
                            }}
                          >
                            Tests ({TESTS_LIBRARY_DATA.length})
                          </button>
                        </div>

                        {/* Search Input inside Dropdown matching Image 3 */}
                        <div style={{ padding: '8px', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search panel or test by name..."
                            value={itemSearchQuery}
                            onChange={(e) => setItemSearchQuery(e.target.value)}
                            style={{
                              width: '100%',
                              padding: '6px 10px',
                              borderRadius: '4px',
                              border: '1px solid #cbd5e1',
                              fontSize: '12px',
                              outline: 'none',
                              boxSizing: 'border-box',
                            }}
                          />
                        </div>

                        {/* Scrollable List */}
                        <div style={{ maxHeight: '220px', overflowY: 'auto' }}>
                          {(() => {
                            let sourceList: Array<{ id: string; name: string; kind: 'panel' | 'test'; item: any }> = [];
                            if (dropdownFilter === 'all' || dropdownFilter === 'panel') {
                              PANELS_LIBRARY_DATA.forEach((p) =>
                                sourceList.push({ id: p.id, name: p.name, kind: 'panel', item: p })
                              );
                            }
                            if (dropdownFilter === 'all' || dropdownFilter === 'test') {
                              TESTS_LIBRARY_DATA.forEach((t) =>
                                sourceList.push({ id: t.id, name: t.name, kind: 'test', item: t })
                              );
                            }
                            const q = itemSearchQuery.toLowerCase().trim();
                            const filtered = q
                              ? sourceList.filter((x) => x.name.toLowerCase().includes(q))
                              : sourceList;

                            if (filtered.length === 0) {
                              return (
                                <div style={{ padding: '12px 14px' }}>
                                  <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                                    No item found matching "{itemSearchQuery}".
                                  </div>
                                  {itemSearchQuery.trim() && (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setFormName(itemSearchQuery.trim());
                                        setIsDropdownOpen(false);
                                        setItemSearchQuery('');
                                      }}
                                      style={{
                                        background: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderRadius: '4px',
                                        padding: '4px 10px',
                                        color: '#2563eb',
                                        fontSize: '12px',
                                        cursor: 'pointer',
                                        fontWeight: 500,
                                      }}
                                    >
                                      Use "{itemSearchQuery.trim()}" as {formType} name
                                    </button>
                                  )}
                                </div>
                              );
                            }
                            return filtered.map((entry) => (
                              <div
                                key={`${entry.kind}-${entry.id}`}
                                onClick={() => {
                                  setFormName(entry.name);
                                  setFormType(entry.kind);
                                  setEditorHtml(entry.item.htmlContent || entry.item.rawText);
                                  setEditorText(entry.item.rawText);
                                  setIsDropdownOpen(false);
                                  setItemSearchQuery('');
                                }}
                                style={{
                                  padding: '8px 14px',
                                  fontSize: '13px',
                                  color: formName === entry.name ? '#2563eb' : '#1e293b',
                                  backgroundColor: formName === entry.name ? '#eff6ff' : 'transparent',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  transition: 'background-color 0.1s ease',
                                }}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                                onMouseLeave={(e) =>
                                  (e.currentTarget.style.backgroundColor =
                                    formName === entry.name ? '#eff6ff' : 'transparent')
                                }
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span>{entry.name}</span>
                                  <span
                                    style={{
                                      fontSize: '10px',
                                      fontWeight: 600,
                                      padding: '1px 6px',
                                      borderRadius: '4px',
                                      backgroundColor: entry.kind === 'panel' ? '#f3e8ff' : '#e0f2fe',
                                      color: entry.kind === 'panel' ? '#7e22ce' : '#0369a1',
                                    }}
                                  >
                                    {entry.kind === 'panel' ? 'Panel' : 'Test'}
                                  </span>
                                </div>
                                {formName === entry.name && <Check size={14} color="#2563eb" />}
                              </div>
                            ));
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Pink Banner */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  backgroundColor: '#fdf2f8',
                  border: '1px solid #fbcfe8',
                  color: '#9d174d',
                  fontSize: '12px',
                }}
              >
                <FileText size={14} color="#db2777" />
                <span>You can now copy interpretations from</span>
                <a
                  href="#interpretations_library"
                  onClick={(e) => {
                    e.preventDefault();
                    if (onNavigate) onNavigate('interpretations_library');
                  }}
                  style={{
                    color: '#2563eb',
                    fontWeight: 500,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '2px',
                    cursor: 'pointer',
                    textDecoration: 'none',
                  }}
                >
                  <span>Library</span>
                  <ExternalLink size={11} />
                </a>
                <span>to update.</span>
                <span
                  style={{
                    backgroundColor: '#f43f5e',
                    color: '#ffffff',
                    fontSize: '9px',
                    fontWeight: 700,
                    padding: '1px 5px',
                    borderRadius: '3px',
                    letterSpacing: '0.04em',
                  }}
                >
                  NEW
                </span>
              </div>

              {/* Interpretation Label & Rich Editor Toolbar */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={{ fontSize: '13px', color: '#475569', fontWeight: 600 }}>
                    Interpretation
                  </label>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    Use <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Shift</kbd> + <kbd style={{ padding: '1px 4px', border: '1px solid #cbd5e1', borderRadius: '3px', fontSize: '10px' }}>Enter</kbd> key to go to new line.
                  </span>
                </div>
                <RichInterpretationEditor
                  key={formName || modalMode || 'editor'}
                  initialValue={editorHtml || editorText}
                  onChange={(html, text) => {
                    setEditorHtml(html);
                    setEditorText(text);
                  }}
                  minHeight="260px"
                />
              </div>

              {/* Form Footer */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                  gap: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid #e2e8f0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '6px 14px',
                    fontSize: '12px',
                    color: '#475569',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: '#2563eb',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '7px 20px',
                    fontSize: '13px',
                    fontWeight: 600,
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {modalMode === 'create' ? 'Add' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterpretationsPage;
