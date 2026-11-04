import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, User, Stethoscope, FlaskConical, Loader2, ArrowRight } from 'lucide-react';
import { shellApi } from '../../services/api';

export interface OmnisearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (type: string, id: string, extraData?: any) => void;
}

export const OmnisearchModal: React.FC<OmnisearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'bills' | 'patients' | 'doctors' | 'tests'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<{
    cases: any[];
    patients: any[];
    tests: any[];
    doctors: any[];
  }>({ cases: [], patients: [], tests: [], doctors: [] });

  const inputRef = useRef<HTMLInputElement>(null);

  // Global Keydown Listeners (Ctrl+K to toggle, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setSearchTerm('');
      setResults({ cases: [], patients: [], tests: [], doctors: [] });
    }
  }, [isOpen]);

  // Debounced API Omnisearch Call
  useEffect(() => {
    if (!isOpen) return;
    const term = searchTerm.trim();
    if (!term) {
      setResults({ cases: [], patients: [], tests: [], doctors: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await shellApi.omnisearch(term, 12);
        if (res.success && res.data) {
          setResults({
            cases: res.data.cases || [],
            patients: res.data.patients || [],
            tests: res.data.tests || [],
            doctors: res.data.doctors || [],
          });
        }
      } catch (err) {
        console.error('Omnisearch failed:', err);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm, isOpen]);

  if (!isOpen) return null;

  const totalResults =
    (activeCategory === 'all' || activeCategory === 'bills' ? results.cases.length : 0) +
    (activeCategory === 'all' || activeCategory === 'patients' ? results.patients.length : 0) +
    (activeCategory === 'all' || activeCategory === 'tests' ? results.tests.length : 0) +
    (activeCategory === 'all' || activeCategory === 'doctors' ? results.doctors.length : 0);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          maxWidth: '680px',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh',
          border: '1px solid #e2e8f0',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#ffffff',
          }}
        >
          {isLoading ? (
            <Loader2 size={20} color="#2563eb" style={{ animation: 'spin 1s linear infinite' }} />
          ) : (
            <Search size={20} color="#2563eb" />
          )}
          <input
            ref={inputRef}
            type="text"
            placeholder="Search patients, UHID, mobile #, bill #1001, test name, or doctor..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '15px',
              color: '#0f172a',
              background: 'transparent',
              fontWeight: 500,
            }}
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              style={{
                border: 'none',
                background: '#f1f5f9',
                color: '#64748b',
                cursor: 'pointer',
                borderRadius: '50%',
                width: '24px',
                height: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <X size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '12px',
              padding: '4px 8px',
              borderRadius: '4px',
            }}
          >
            <kbd style={{ fontFamily: 'monospace', fontSize: '11px', background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '2px 5px', borderRadius: '3px' }}>
              ESC
            </kbd>
          </button>
        </div>

        {/* Category Pills Bar */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            padding: '10px 20px',
            backgroundColor: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
          }}
        >
          {(['all', 'bills', 'patients', 'tests', 'doctors'] as const).map((cat) => {
            const isSelected = activeCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: '4px 12px',
                  fontSize: '12px',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected ? '#1d4ed8' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#475569',
                  borderRadius: '9999px',
                  border: isSelected ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                  cursor: 'pointer',
                  textTransform: 'capitalize',
                  transition: 'all 0.15s ease',
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Results Container */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '12px 16px',
            backgroundColor: '#ffffff',
          }}
        >
          {!searchTerm.trim() ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#94a3b8' }}>
              <Search size={36} color="#cbd5e1" style={{ margin: '0 auto 12px' }} />
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#64748b' }}>
                Search Labsmart Global Database
              </div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                Quickly locate Patient Records, Invoices, Diagnostic Investigations, or Consulting Doctors.
              </div>
            </div>
          ) : totalResults === 0 && !isLoading ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '15px', fontWeight: 600 }}>No results found for &ldquo;{searchTerm}&rdquo;</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
                Try searching with a patient mobile number, UHID, or investigation name.
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Cases / Bills Section */}
              {(activeCategory === 'all' || activeCategory === 'bills') && results.cases.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                    Bills &amp; Invoices ({results.cases.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.cases.map((c) => (
                      <div
                        key={c.id}
                        onClick={() => {
                          onSelectResult('bill', c.id, c);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#eff6ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#dbeafe', color: '#1d4ed8' }}>
                            <FileText size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                              #{c.billNumber} &bull; {c.patient?.fullName || 'Unknown Patient'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              Code: <strong>{c.dailyCode || 'L1'}</strong> &bull; Status: {c.reportStatus}
                            </div>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '13px', fontWeight: 700, color: c.balanceDue > 0 ? '#b91c1c' : '#15803d' }}>
                            ₹{c.netPayable} {c.balanceDue > 0 ? `(Due ₹${c.balanceDue})` : '(Paid)'}
                          </div>
                          <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                            {new Date(c.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Patients Section */}
              {(activeCategory === 'all' || activeCategory === 'patients') && results.patients.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                    Patients ({results.patients.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.patients.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => {
                          onSelectResult('patient', p.id, p);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#fef3c7')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#fef3c7', color: '#b45309' }}>
                            <User size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                              {p.fullName} ({p.ageYears ? `${p.ageYears}Y` : ''} / {p.gender})
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              UHID: {p.uhid} &bull; Mob: {p.mobile || 'N/A'}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="#94a3b8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tests Section */}
              {(activeCategory === 'all' || activeCategory === 'tests') && results.tests.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                    Diagnostic Tests ({results.tests.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.tests.map((t) => (
                      <div
                        key={t.id}
                        onClick={() => {
                          onSelectResult('test', t.id, t);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0fdf4')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#dcfce7', color: '#15803d' }}>
                            <FlaskConical size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                              {t.name} [{t.code}]
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              Dept: {t.department} &bull; Specimen: {t.specimen || 'Serum'}
                            </div>
                          </div>
                        </div>
                        <div style={{ fontSize: '14px', fontWeight: 700, color: '#1d4ed8' }}>
                          ₹{t.rate}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Doctors Section */}
              {(activeCategory === 'all' || activeCategory === 'doctors') && results.doctors.length > 0 && (
                <div>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '4px' }}>
                    Referring Doctors ({results.doctors.length})
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {results.doctors.map((d) => (
                      <div
                        key={d.id}
                        onClick={() => {
                          onSelectResult('doctor', d.id, d);
                          onClose();
                        }}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          border: '1px solid #f1f5f9',
                          backgroundColor: '#f8fafc',
                          cursor: 'pointer',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#faf5ff')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ padding: '8px', borderRadius: '6px', backgroundColor: '#f3e8ff', color: '#7e22ce' }}>
                            <Stethoscope size={18} />
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '13px', color: '#0f172a' }}>
                              {d.name}
                            </div>
                            <div style={{ fontSize: '12px', color: '#64748b' }}>
                              {d.specialty || 'General Physician'}
                            </div>
                          </div>
                        </div>
                        <ArrowRight size={16} color="#94a3b8" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div
          style={{
            padding: '10px 20px',
            backgroundColor: '#f8fafc',
            borderTop: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '12px',
            color: '#64748b',
          }}
        >
          <div>Press <strong>ESC</strong> to dismiss</div>
          <div>{totalResults} items available</div>
        </div>
      </div>
    </div>
  );
};
