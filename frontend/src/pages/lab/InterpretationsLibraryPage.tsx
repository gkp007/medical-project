import React, { useState, useMemo } from 'react';
import {
  Search,
  Copy,
  Check,
  ChevronRight,
  Sparkles,
  X,
  Bold,
  Italic,
  Underline,
  List,
  AlignLeft,
  Table as TableIcon,
  Headphones,
  CheckCircle2,
  BookmarkPlus,
} from 'lucide-react';
import {
  LibraryItem,
  TESTS_LIBRARY_DATA,
  PANELS_LIBRARY_DATA,
} from './interpretationsLibraryData';
import { RichInterpretationEditor } from './RichInterpretationEditor';

export type { LibraryItem } from './interpretationsLibraryData';
export { TESTS_LIBRARY_DATA, PANELS_LIBRARY_DATA } from './interpretationsLibraryData';

interface InterpretationsLibraryPageProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
  onSelectInterpretation?: (text: string, title: string) => void;
}

export const InterpretationsLibraryPage: React.FC<InterpretationsLibraryPageProps> = ({
  onNavigate,
  onBack,
  onSelectInterpretation,
}) => {
  const [activeTab, setActiveTab] = useState<'tests' | 'panels'>('tests');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [modalHtml, setModalHtml] = useState('');
  const [modalText, setModalText] = useState('');
  const [copiedSuccess, setCopiedSuccess] = useState(false);
  const [savedToMySuccess, setSavedToMySuccess] = useState(false);
  const [viewMode, setViewMode] = useState<'formatted' | 'raw'>('formatted');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter items based on active tab and search query
  const displayedItems = useMemo(() => {
    const list = activeTab === 'panels' ? PANELS_LIBRARY_DATA : TESTS_LIBRARY_DATA;
    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        item.rawText.toLowerCase().includes(q)
    );
  }, [activeTab, searchQuery]);

  const handleCopy = (fallbackText?: string) => {
    const textToCopy = modalText || fallbackText || selectedItem?.rawText || '';
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
    }
    setCopiedSuccess(true);
    showToast('Interpretation copied to clipboard!');
    setTimeout(() => setCopiedSuccess(false), 2200);
  };

  const handleSaveToMyInterpretations = (item: LibraryItem) => {
    try {
      const stored = localStorage.getItem('my_interpretations');
      const existingList = stored ? JSON.parse(stored) : [];
      const alreadyExists = existingList.some((i: any) => i.name === item.name);

      if (!alreadyExists) {
        const newItem = {
          id: `custom-${Date.now()}`,
          sNo: existingList.length + 1,
          name: item.name,
          type: item.type,
          physiologicalBasis: item.rawText,
          increasedIn: '',
          decreasedIn: '',
          comments: item.rawText,
          htmlContent: item.htmlContent,
        };
        existingList.push(newItem);
        localStorage.setItem('my_interpretations', JSON.stringify(existingList));
      }

      setSavedToMySuccess(true);
      showToast(`Added "${item.name}" to My Interpretations!`);
      setTimeout(() => setSavedToMySuccess(false), 2500);
    } catch (e) {
      showToast(`Saved "${item.name}" locally.`);
    }
  };

  return (
    <div
      style={{
        padding: '20px 32px 60px 32px',
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
            animation: 'fadeIn 0.2s ease',
          }}
        >
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb Navigation matching Labsmart: Interpretations > Interpretations Library */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '13px',
          color: '#64748b',
          marginBottom: '14px',
        }}
      >
        <button
          onClick={() => {
            if (onBack) onBack();
            else if (onNavigate) onNavigate('interpretations');
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            fontWeight: 500,
            cursor: 'pointer',
            padding: 0,
            fontSize: '13px',
          }}
        >
          Interpretations
        </button>
        <ChevronRight size={13} color="#94a3b8" />
        <span style={{ color: '#0f172a', fontWeight: 500 }}>Interpretations Library</span>
      </div>

      {/* Header and BETA badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <h1
          style={{
            fontSize: '22px',
            fontWeight: 700,
            color: '#1e293b',
            margin: 0,
            letterSpacing: '-0.01em',
          }}
        >
          Interpretations Library
        </h1>
        <span
          style={{
            backgroundColor: '#fce7f3',
            color: '#db2777',
            border: '1px solid #fbcfe8',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.04em',
            padding: '2px 8px',
            borderRadius: '12px',
            lineHeight: '14px',
          }}
        >
          BETA
        </span>
      </div>

      {/* Feedback text matching Labsmart exact subtext */}
      <p
        style={{
          margin: '0 0 16px 0',
          fontSize: '13px',
          color: '#475569',
          lineHeight: '20px',
        }}
      >
        Please provide your valuable feedback to the support team. Any feedback is appreciated.
      </p>

      {/* Tabs matching Labsmart: Test 111 | Panels 13 */}
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
          onClick={() => setActiveTab('tests')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'tests' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px 10px 4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: activeTab === 'tests' ? 600 : 500,
            color: activeTab === 'tests' ? '#2563eb' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Test</span>
          <span
            style={{
              backgroundColor: activeTab === 'tests' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'tests' ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              minWidth: '22px',
              textAlign: 'center',
            }}
          >
            {TESTS_LIBRARY_DATA.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('panels')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'panels' ? '2px solid #2563eb' : '2px solid transparent',
            padding: '8px 4px 10px 4px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            fontWeight: activeTab === 'panels' ? 600 : 500,
            color: activeTab === 'panels' ? '#2563eb' : '#475569',
            transition: 'all 0.15s ease',
          }}
        >
          <span>Panels</span>
          <span
            style={{
              backgroundColor: activeTab === 'panels' ? '#dbeafe' : '#f1f5f9',
              color: activeTab === 'panels' ? '#1d4ed8' : '#64748b',
              fontSize: '11px',
              fontWeight: 700,
              padding: '1px 7px',
              borderRadius: '10px',
              minWidth: '22px',
              textAlign: 'center',
            }}
          >
            {PANELS_LIBRARY_DATA.length}
          </span>
        </button>
      </div>

      {/* Search Input matching Labsmart "Search in page" */}
      <div style={{ position: 'relative', width: '280px', maxWidth: '100%', marginBottom: '16px' }}>
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
            borderRadius: '5px',
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

      {/* Main Table: Columns exactly matching Labsmart: S. NO. | NAME | VIEW AND COPY */}
      <div
        style={{
          border: '1px solid #e2e8f0',
          borderRadius: '4px',
          overflow: 'hidden',
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
                  width: '80px',
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
                  textAlign: 'right',
                  width: '180px',
                  fontSize: '11px',
                  letterSpacing: '0.04em',
                }}
              >
                VIEW AND COPY
              </th>
            </tr>
          </thead>
          <tbody>
            {displayedItems.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
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
              displayedItems.map((item, idx) => (
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
                  <td
                    style={{
                      padding: '11px 16px',
                      color: '#64748b',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {item.sNo}.
                  </td>
                  <td
                    style={{
                      padding: '11px 16px',
                      color: '#1e293b',
                      fontSize: '13px',
                      fontWeight: 500,
                    }}
                  >
                    {item.name}
                  </td>
                  <td style={{ padding: '11px 16px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        setSelectedItem(item);
                        setModalHtml(item.htmlContent || item.rawText);
                        setModalText(item.rawText);
                        setCopiedSuccess(false);
                        setSavedToMySuccess(false);
                      }}
                      style={{
                        backgroundColor: '#ffffff',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        padding: '4px 12px',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#eff6ff';
                        e.currentTarget.style.borderColor = '#93c5fd';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.borderColor = '#cbd5e1';
                      }}
                    >
                      View and copy
                    </button>
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

      {/* Copy interpretation Modal matching Labsmart live modal */}
      {selectedItem && (
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
              maxHeight: '92vh',
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
                padding: '16px 24px',
                borderBottom: '1px solid #e2e8f0',
                backgroundColor: '#ffffff',
              }}
            >
              <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', margin: 0 }}>
                Copy interpretation
              </h2>
              <button
                onClick={() => setSelectedItem(null)}
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
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div
              style={{
                padding: '20px 24px',
                overflowY: 'auto',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* Subtitle */}
              <div style={{ fontSize: '14px', color: '#334155', fontWeight: 500 }}>
                {selectedItem.type === 'panel' ? 'Panel' : 'Test'}: {selectedItem.name}
              </div>

              {/* COPY button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleCopy()}
                  style={{
                    backgroundColor: copiedSuccess ? '#16a34a' : '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '7px 18px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!copiedSuccess) e.currentTarget.style.backgroundColor = '#1d4ed8';
                  }}
                  onMouseLeave={(e) => {
                    if (!copiedSuccess) e.currentTarget.style.backgroundColor = '#2563eb';
                  }}
                >
                  {copiedSuccess ? <Check size={14} /> : <Copy size={14} />}
                  <span>{copiedSuccess ? 'COPIED!' : 'COPY'}</span>
                </button>
              </div>

              {/* Rich Text Editor Component */}
              <RichInterpretationEditor
                initialValue={modalHtml || modalText}
                onChange={(html, text) => {
                  setModalHtml(html);
                  setModalText(text);
                }}
                minHeight="340px"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterpretationsLibraryPage;
