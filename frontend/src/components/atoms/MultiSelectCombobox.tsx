import React, { useState, useRef, useEffect } from 'react';
import { X, Search, Check, ChevronDown } from 'lucide-react';

export interface MultiSelectOption {
  label: string;
  value: string;
  category?: string;
}

interface MultiSelectComboboxProps {
  label?: string;
  rightLabel?: React.ReactNode;
  placeholder?: string;
  options: MultiSelectOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  helpText?: string;
  disabled?: boolean;
}

export const MultiSelectCombobox: React.FC<MultiSelectComboboxProps> = ({
  label,
  rightLabel,
  placeholder = 'Select options...',
  options,
  selectedValues,
  onChange,
  helpText,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggleOption = (val: string) => {
    if (selectedValues.includes(val)) {
      onChange(selectedValues.filter((v) => v !== val));
    } else {
      onChange([...selectedValues, val]);
    }
  };

  const handleRemoveChip = (e: React.MouseEvent, val: string) => {
    e.stopPropagation();
    onChange(selectedValues.filter((v) => v !== val));
  };

  const filteredOptions = options.filter(
    (opt) =>
      opt.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opt.value.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', position: 'relative' }} ref={containerRef}>
      {(label || rightLabel) && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {label && (
            <label style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
              {label}
            </label>
          )}
          {rightLabel}
        </div>
      )}

      {/* Main Combobox Input Area */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setTimeout(() => searchInputRef.current?.focus(), 50);
          }
        }}
        style={{
          minHeight: '40px',
          padding: '4px 8px',
          borderRadius: '6px',
          border: isOpen ? '2px solid #3b82f6' : '1px solid #cbd5e1',
          backgroundColor: disabled ? '#f8fafc' : '#ffffff',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '6px',
          transition: 'border-color 0.15s ease',
          boxShadow: isOpen ? '0 0 0 3px rgba(59, 130, 246, 0.15)' : 'none',
        }}
      >
        {selectedValues.length === 0 && !isOpen && (
          <span style={{ fontSize: '13px', color: '#94a3b8', padding: '4px 6px' }}>
            {placeholder}
          </span>
        )}

        {/* Selected Chips matching Labsmart UI */}
        {selectedValues.map((val) => {
          const opt = options.find((o) => o.value === val);
          const displayLabel = opt ? opt.label : val;
          return (
            <span
              key={val}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                backgroundColor: '#f1f5f9',
                color: '#334155',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '3px 8px',
                fontSize: '13px',
                fontWeight: 500,
              }}
            >
              <button
                type="button"
                onClick={(e) => handleRemoveChip(e, val)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  color: '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                }}
                title="Remove"
              >
                <X size={13} />
              </button>
              <span>{displayLabel}</span>
            </span>
          );
        })}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', padding: '4px' }}>
          <ChevronDown size={14} color="#94a3b8" />
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 4px)',
            left: 0,
            right: 0,
            backgroundColor: '#ffffff',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
            zIndex: 1000,
            maxHeight: '260px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Quick Search Box */}
          <div style={{ padding: '8px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f8fafc' }}>
            <Search size={14} color="#94a3b8" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Type to filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                border: 'none',
                outline: 'none',
                backgroundColor: 'transparent',
                fontSize: '12px',
                color: '#1e293b',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 0 }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Options List */}
          <div style={{ overflowY: 'auto', flex: 1, padding: '4px 0' }}>
            {filteredOptions.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' }}>
                No matching tests found.
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <div
                    key={opt.value}
                    onClick={() => handleToggleOption(opt.value)}
                    style={{
                      padding: '8px 12px',
                      fontSize: '13px',
                      color: isSelected ? '#ffffff' : '#334155',
                      backgroundColor: isSelected ? '#3b82f6' : 'transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background-color 0.1s ease',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = '#f1f5f9';
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <Check size={14} color="#ffffff" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {helpText && (
        <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
          {helpText}
        </span>
      )}
    </div>
  );
};
