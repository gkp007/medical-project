import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronDown,
  Check,
  Undo2,
  Redo2,
  Bold,
  Italic,
  Table as TableIcon,
  MoreHorizontal,
  List,
  ListOrdered,
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Underline,
  Strikethrough,
  Minus,
} from 'lucide-react';

interface RichInterpretationEditorProps {
  initialValue: string;
  onChange: (html: string, text: string) => void;
  minHeight?: string | number;
  placeholder?: string;
}

export const RichInterpretationEditor: React.FC<RichInterpretationEditorProps> = ({
  initialValue,
  onChange,
  minHeight = '280px',
  placeholder = 'Type interpretation here...',
}) => {
  const editorRef = useRef<HTMLDivElement | null>(null);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<'font' | 'block' | 'size' | 'insert' | 'more' | null>(null);

  // Formatting state
  const [currentBlock, setCurrentBlock] = useState<'Paragraph' | 'Header 3' | 'Header 4'>('Paragraph');
  const [currentFont, setCurrentFont] = useState<string>('System Font');
  const [currentSize, setCurrentSize] = useState<string>('12pt');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);

  // Initialize editor content once or when initialValue changes drastically
  useEffect(() => {
    if (editorRef.current) {
      // If initialValue contains HTML, set as innerHTML; if plain text, convert newlines to <p>
      let formattedHtml = initialValue || '';
      if (!formattedHtml.includes('<p>') && !formattedHtml.includes('<div>') && !formattedHtml.includes('<br>')) {
        const paragraphs = formattedHtml
          .split('\n\n')
          .map((para) => {
            if (!para.trim()) return '';
            // Detect lines like "Physiological Basis:", "Interpretation", "Comments:"
            let inner = para.replace(/\n/g, '<br/>');
            inner = inner.replace(
              /^(Physiological Basis:|Interpretation for [^:]+:|Interpretation|Comments:)/gm,
              '<strong>$1</strong>'
            );
            inner = inner.replace(/^(Increased in:|Decreased in:)/gm, '<strong>$1</strong>');
            return `<p style="margin: 0 0 10px 0;">${inner}</p>`;
          })
          .filter(Boolean)
          .join('');
        formattedHtml = paragraphs || `<p style="margin: 0 0 10px 0;">${formattedHtml}</p>`;
      }

      if (editorRef.current.innerHTML !== formattedHtml) {
        editorRef.current.innerHTML = formattedHtml;
      }
    }
  }, [initialValue]);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.editor-toolbar-dropdown')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const triggerChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      const text = editorRef.current.innerText || editorRef.current.textContent || '';
      onChange(html, text);
    }
  };

  const updateFormatStates = () => {
    try {
      setIsBold(document.queryCommandState('bold'));
      setIsItalic(document.queryCommandState('italic'));

      // Detect block tag
      const selection = window.getSelection();
      if (selection && selection.anchorNode) {
        let parent: HTMLElement | null =
          selection.anchorNode.nodeType === 3
            ? selection.anchorNode.parentElement
            : (selection.anchorNode as HTMLElement);

        while (parent && parent !== editorRef.current) {
          const tagName = parent.tagName?.toLowerCase();
          if (tagName === 'h3') {
            setCurrentBlock('Header 3');
            break;
          } else if (tagName === 'h4') {
            setCurrentBlock('Header 4');
            break;
          } else if (tagName === 'p') {
            setCurrentBlock('Paragraph');
            break;
          }
          parent = parent.parentElement;
        }
      }
    } catch (e) {
      // ignore
    }
  };

  const exec = (command: string, value: string | undefined = undefined) => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
    document.execCommand(command, false, value);
    triggerChange();
    updateFormatStates();
  };

  // Clear format Tx
  const handleClearFormat = () => {
    exec('removeFormat');
    // Also strip inline tags from selection
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const text = range.toString();
      if (text) {
        range.deleteContents();
        range.insertNode(document.createTextNode(text));
      }
    }
    triggerChange();
  };

  // Block format
  const handleSelectBlock = (block: 'Paragraph' | 'Header 3' | 'Header 4') => {
    setCurrentBlock(block);
    setOpenDropdown(null);
    if (block === 'Header 3') {
      exec('formatBlock', '<h3>');
    } else if (block === 'Header 4') {
      exec('formatBlock', '<h4>');
    } else {
      exec('formatBlock', '<p>');
    }
  };

  // Font family
  const handleSelectFont = (font: string) => {
    setCurrentFont(font);
    setOpenDropdown(null);
    if (font === 'System Font') {
      exec('fontName', '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif');
    } else {
      exec('fontName', font);
    }
  };

  // Font size
  const handleSelectSize = (size: string) => {
    setCurrentSize(size);
    setOpenDropdown(null);
    // Approximate mapping for document.execCommand fontSize (1-7)
    const map: Record<string, string> = {
      '10pt': '1',
      '11pt': '2',
      '12pt': '3',
      '14pt': '4',
      '16pt': '5',
      '18pt': '6',
    };
    exec('fontSize', map[size] || '3');
  };

  // Insert Table
  const handleInsertTable = () => {
    const tableHtml = `
      <table style="width: 100%; border-collapse: collapse; margin: 12px 0; font-size: 13px;" border="1" cellpadding="6">
        <thead style="background-color: #f8fafc;">
          <tr>
            <th style="width: 50%; color: #b91c1c; text-align: left; padding: 6px 10px; border: 1px solid #cbd5e1;">Increased in:</th>
            <th style="width: 50%; color: #1d4ed8; text-align: left; padding: 6px 10px; border: 1px solid #cbd5e1;">Decreased in:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="vertical-align: top; padding: 6px 10px; border: 1px solid #cbd5e1;">• Condition / Finding 1</td>
            <td style="vertical-align: top; padding: 6px 10px; border: 1px solid #cbd5e1;">• Condition / Finding 2</td>
          </tr>
        </tbody>
      </table>
      <p style="margin: 0 0 10px 0;"><br></p>
    `;
    exec('insertHTML', tableHtml);
    setOpenDropdown(null);
  };

  return (
    <div
      style={{
        border: '1px solid #cbd5e1',
        borderRadius: '4px',
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Rich Editor Toolbar matching user screenshots media_1795328852369_42e42cf8.jpg and media_1795328868411_41e6f901.jpg */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '6px 10px',
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          fontSize: '12px',
          color: '#334155',
          flexWrap: 'wrap',
          userSelect: 'none',
        }}
      >
        {/* Tx (Clear Formatting) */}
        <button
          type="button"
          title="Clear formatting"
          onClick={handleClearFormat}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '3px 6px',
            borderRadius: '3px',
            fontSize: '13px',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          T<sub style={{ fontSize: '9px', fontWeight: 700 }}>x</sub>
        </button>

        {/* Insert Table / Image Dropdown */}
        <div className="editor-toolbar-dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            title="Insert Table / Image"
            onClick={() => setOpenDropdown(openDropdown === 'insert' ? null : 'insert')}
            style={{
              background: openDropdown === 'insert' ? '#e2e8f0' : 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              padding: '3px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
            }}
            onMouseEnter={(e) => {
              if (openDropdown !== 'insert') e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (openDropdown !== 'insert') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>Insert Table / Image</span>
            <ChevronDown size={12} color="#64748b" />
          </button>

          {openDropdown === 'insert' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                minWidth: '170px',
                padding: '4px 0',
              }}
            >
              <button
                type="button"
                onClick={handleInsertTable}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <TableIcon size={14} color="#64748b" />
                <span>Insert Table (2x2)</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exec('insertUnorderedList');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <List size={14} color="#64748b" />
                <span>Bullet List</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exec('insertOrderedList');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <ListOrdered size={14} color="#64748b" />
                <span>Numbered List</span>
              </button>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

        {/* System Font Dropdown */}
        <div className="editor-toolbar-dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'font' ? null : 'font')}
            style={{
              background: openDropdown === 'font' ? '#e2e8f0' : 'none',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              padding: '3px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) => {
              if (openDropdown !== 'font') e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (openDropdown !== 'font') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{currentFont}</span>
            <ChevronDown size={12} color="#64748b" />
          </button>

          {openDropdown === 'font' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                minWidth: '140px',
                padding: '4px 0',
              }}
            >
              {['System Font', 'Arial', 'Helvetica', 'Georgia', 'Times New Roman', 'Courier New'].map((font) => (
                <button
                  key={font}
                  type="button"
                  onClick={() => handleSelectFont(font)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontFamily: font === 'System Font' ? 'inherit' : font }}>{font}</span>
                  {currentFont === font && <Check size={13} color="#2563eb" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Paragraph Dropdown matching image media_1795328868411_41e6f901.jpg */}
        <div className="editor-toolbar-dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'block' ? null : 'block')}
            style={{
              background: openDropdown === 'block' ? '#e2e8f0' : 'none',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              padding: '3px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) => {
              if (openDropdown !== 'block') e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (openDropdown !== 'block') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{currentBlock}</span>
            <ChevronDown size={12} color="#64748b" />
          </button>

          {openDropdown === 'block' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                minWidth: '130px',
                padding: '4px 0',
              }}
            >
              {(['Paragraph', 'Header 3', 'Header 4'] as const).map((block) => (
                <button
                  key={block}
                  type="button"
                  onClick={() => handleSelectBlock(block)}
                  style={{
                    width: '100%',
                    padding: '6px 14px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{ fontWeight: block.startsWith('Header') ? 600 : 400 }}>{block}</span>
                  {currentBlock === block && <Check size={14} color="#1e293b" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 12pt Size Dropdown */}
        <div className="editor-toolbar-dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={() => setOpenDropdown(openDropdown === 'size' ? null : 'size')}
            style={{
              background: openDropdown === 'size' ? '#e2e8f0' : 'none',
              border: 'none',
              color: '#334155',
              cursor: 'pointer',
              padding: '3px 6px',
              borderRadius: '3px',
              fontSize: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
            onMouseEnter={(e) => {
              if (openDropdown !== 'size') e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (openDropdown !== 'size') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <span>{currentSize}</span>
            <ChevronDown size={12} color="#64748b" />
          </button>

          {openDropdown === 'size' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                minWidth: '90px',
                padding: '4px 0',
              }}
            >
              {['10pt', '11pt', '12pt', '14pt', '16pt', '18pt'].map((sz) => (
                <button
                  key={sz}
                  type="button"
                  onClick={() => handleSelectSize(sz)}
                  style={{
                    width: '100%',
                    padding: '6px 12px',
                    background: 'none',
                    border: 'none',
                    textAlign: 'left',
                    fontSize: '12px',
                    color: '#1e293b',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{sz}</span>
                  {currentSize === sz && <Check size={13} color="#2563eb" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ width: '1px', height: '16px', backgroundColor: '#cbd5e1', margin: '0 4px' }} />

        {/* Undo */}
        <button
          type="button"
          title="Undo"
          onClick={() => exec('undo')}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '3px 5px',
            borderRadius: '3px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Undo2 size={13} />
        </button>

        {/* Redo */}
        <button
          type="button"
          title="Redo"
          onClick={() => exec('redo')}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '3px 5px',
            borderRadius: '3px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <Redo2 size={13} />
        </button>

        {/* Bold Button (highlighted when active) */}
        <button
          type="button"
          title="Bold"
          onClick={() => exec('bold')}
          style={{
            background: isBold ? '#e2e8f0' : 'none',
            border: 'none',
            color: '#1e293b',
            cursor: 'pointer',
            padding: '3px 7px',
            borderRadius: '3px',
            fontWeight: 700,
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            if (!isBold) e.currentTarget.style.backgroundColor = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            if (!isBold) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          B
        </button>

        {/* Italic Button */}
        <button
          type="button"
          title="Italic"
          onClick={() => exec('italic')}
          style={{
            background: isItalic ? '#e2e8f0' : 'none',
            border: 'none',
            color: '#1e293b',
            cursor: 'pointer',
            padding: '3px 7px',
            borderRadius: '3px',
            fontStyle: 'italic',
            fontSize: '13px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => {
            if (!isItalic) e.currentTarget.style.backgroundColor = '#e2e8f0';
          }}
          onMouseLeave={(e) => {
            if (!isItalic) e.currentTarget.style.backgroundColor = 'transparent';
          }}
        >
          I
        </button>

        {/* Direct Table Icon */}
        <button
          type="button"
          title="Insert Table"
          onClick={handleInsertTable}
          style={{
            background: 'none',
            border: 'none',
            color: '#475569',
            cursor: 'pointer',
            padding: '3px 5px',
            borderRadius: '3px',
            display: 'inline-flex',
            alignItems: 'center',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e2e8f0')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <TableIcon size={14} />
        </button>

        {/* More Actions ••• */}
        <div className="editor-toolbar-dropdown" style={{ position: 'relative' }}>
          <button
            type="button"
            title="More Options"
            onClick={() => setOpenDropdown(openDropdown === 'more' ? null : 'more')}
            style={{
              background: openDropdown === 'more' ? '#e2e8f0' : 'none',
              border: 'none',
              color: '#475569',
              cursor: 'pointer',
              padding: '3px 5px',
              borderRadius: '3px',
              display: 'inline-flex',
              alignItems: 'center',
            }}
            onMouseEnter={(e) => {
              if (openDropdown !== 'more') e.currentTarget.style.backgroundColor = '#e2e8f0';
            }}
            onMouseLeave={(e) => {
              if (openDropdown !== 'more') e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <MoreHorizontal size={14} />
          </button>

          {openDropdown === 'more' && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                backgroundColor: '#ffffff',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                zIndex: 100,
                minWidth: '150px',
                padding: '4px 0',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  exec('underline');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Underline size={13} color="#64748b" />
                <span>Underline</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exec('strikeThrough');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <Strikethrough size={13} color="#64748b" />
                <span>Strikethrough</span>
              </button>

              <div style={{ height: '1px', backgroundColor: '#e2e8f0', margin: '4px 0' }} />

              <button
                type="button"
                onClick={() => {
                  exec('justifyLeft');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <AlignLeft size={13} color="#64748b" />
                <span>Align Left</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exec('justifyCenter');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <AlignCenter size={13} color="#64748b" />
                <span>Align Center</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  exec('justifyRight');
                  setOpenDropdown(null);
                }}
                style={{
                  width: '100%',
                  padding: '6px 12px',
                  background: 'none',
                  border: 'none',
                  textAlign: 'left',
                  fontSize: '12px',
                  color: '#1e293b',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <AlignRight size={13} color="#64748b" />
                <span>Align Right</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Editable Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={triggerChange}
        onKeyUp={updateFormatStates}
        onMouseUp={updateFormatStates}
        data-placeholder={placeholder}
        style={{
          minHeight,
          maxHeight: '450px',
          overflowY: 'auto',
          padding: '12px 14px',
          outline: 'none',
          fontSize: '13px',
          lineHeight: '1.6',
          color: '#1e293b',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
          cursor: 'text',
        }}
      />

      {/* Status Bar matching live Labsmart TinyMCE */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '4px 10px',
          borderTop: '1px solid #f1f5f9',
          backgroundColor: '#fafafa',
          fontSize: '10px',
          color: '#94a3b8',
          userSelect: 'none',
        }}
      >
        <span style={{ fontFamily: 'monospace' }}>p</span>
        <span style={{ letterSpacing: '0.04em', fontWeight: 600 }}>POWERED BY TINY</span>
      </div>
    </div>
  );
};
