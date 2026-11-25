import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Search, CheckCircle2, AlertCircle, Database, LoaderCircle, Plus, RefreshCw } from 'lucide-react';
import { LIBRARY_LAB_TESTS, LibraryLabTest } from './libraryTestsData';
import { mastersApi } from '../../services/api';

interface LabTestsLibraryPageProps {
  onNavigate?: (screen: string) => void;
  onBack?: () => void;
}

export const LabTestsLibraryPage: React.FC<LabTestsLibraryPageProps> = ({
  onNavigate,
  onBack,
}) => {
  const [existingTestNames, setExistingTestNames] = useState<Set<string>>(new Set());
  const [feeInputs, setFeeInputs] = useState<Record<string, string>>({});
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All categories');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // The database is the only source of truth for library import status.
  const refreshExistingTests = async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await mastersApi.listTests();
      if (!res.success || !Array.isArray(res.data)) {
        throw new Error(res.message || 'The test database could not be loaded.');
      }
      setExistingTestNames(new Set(res.data.map((test: any) => String(test.name || '').trim().toLocaleLowerCase()).filter(Boolean)));
    } catch (err: any) {
      setLoadError(err.message || 'The test database could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshExistingTests();
  }, []);

  const handleAddTest = async (test: LibraryLabTest) => {
    const feeStr = feeInputs[test.libraryId];
    const fee = Number(feeStr);
    if (!feeStr || isNaN(fee) || fee <= 0) {
      showToast('Please enter a valid test fee.', 'error');
      return;
    }

    setAddingId(test.libraryId);
    try {
      const response = await mastersApi.importLibraryTest({
        libraryId: test.libraryId,
        name: test.name,
        department: test.category,
        specimen: test.sampleType || 'Serum',
        rate: fee,
      });
      if (!response.success || !response.data) {
        throw new Error(response.message || 'The test could not be imported.');
      }
      setExistingTestNames((prev) => new Set([...prev, test.name.trim().toLowerCase()]));
      setFeeInputs((prev) => ({ ...prev, [test.libraryId]: '' }));
      showToast(response.data.created ? `Imported "${test.name}" into the test database.` : `"${test.name}" is already present.`);
    } catch (err: any) {
      console.error('Failed to add test from library:', err);
      showToast(err.message || 'The test could not be imported. Nothing was saved.', 'error');
    } finally {
      setAddingId(null);
    }
  };

  const handleNavigateToTestMaster = () => {
    if (onBack) onBack();
    else if (onNavigate) onNavigate('test_master');
    else {
      window.history.pushState({}, '', '/manage/tests');
      window.dispatchEvent(new PopStateEvent('popstate'));
    }
  };

  const filteredTests = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return LIBRARY_LAB_TESTS.filter(
      (t) =>
        (!q || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || String(t.sno).includes(q)) &&
        (categoryFilter === 'All categories' || t.category === categoryFilter)
    );
  }, [categoryFilter, searchQuery]);

  const categories = useMemo(() => ['All categories', ...Array.from(new Set(LIBRARY_LAB_TESTS.map((test) => test.category))).sort()], []);
  const presentCount = useMemo(() => LIBRARY_LAB_TESTS.filter((test) => existingTestNames.has(test.name.trim().toLowerCase())).length, [existingTestNames]);

  return (
    <div className="p-4 md:p-6 bg-slate-50 min-h-screen text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 9999,
            backgroundColor: toastType === 'error' ? '#ef4444' : '#1e293b',
            color: '#ffffff',
            padding: '12px 18px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          {toastType === 'error' ? <AlertCircle size={18} /> : <CheckCircle2 size={18} color="#22c55e" />}
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Breadcrumb matching live Labsmart */}
      <nav className="flex text-sm mb-4">
        <ol className="inline-flex items-center space-x-1 md:space-x-2 ml-0 mb-0">
          <li className="list-none flex">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleNavigateToTestMaster}
                className="text-xs text-blue-600 font-medium hover:text-blue-700 bg-transparent border-0 p-0 cursor-pointer"
              >
                Test database
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            </div>
          </li>
          <li className="list-none flex">
            <div className="flex items-center">
              <button
                type="button"
                onClick={handleNavigateToTestMaster}
                className="text-xs text-blue-600 font-medium hover:text-blue-700 bg-transparent border-0 p-0 cursor-pointer"
              >
                Select type
              </button>
              <ChevronRight className="h-4 w-4 text-gray-400 mx-1" />
            </div>
          </li>
          <li className="list-none inline-flex">
            <div className="text-xs font-medium text-gray-500 leading-5">
              Import tests
            </div>
          </li>
        </ol>
      </nav>

      {/* Title, status and guidance */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-2">
        <div className="inline-flex items-center flex-wrap gap-2">
          <Database size={22} color="#0284c7" />
          <h3 className="text-xl lg:text-lg font-semibold tracking-tight text-gray-800 mb-0">Import tests from library</h3>
          <div className="bg-pink-100 text-pink-600 text-xs font-semibold py-1 px-2 rounded-full leading-3">
          Recommended
          </div>
        </div>
        <button type="button" onClick={() => void refreshExistingTests()} disabled={isLoading} className="btn btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} /> Refresh status
        </button>
      </div>

      {/* Description info */}
      <div className="max-w-4xl mb-6">
        <div className="text-sm text-gray-700 leading-relaxed">
          Library consists of specialized tests which are done on rare basis. If you’re unable to find some tests you can{' '}
          <button
            type="button"
            onClick={handleNavigateToTestMaster}
            className="text-blue-600 hover:text-blue-700 underline bg-transparent border-0 p-0 cursor-pointer text-sm"
          >
            add it manually
          </button>{' '}
          for immediate addition or contact support with sample report and normal values and we will add it in 1-2 working days.
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', maxWidth: '760px', marginBottom: '18px' }}>
        <div style={{ padding: '12px 14px', border: '1px solid #dbeafe', background: '#ffffff', borderRadius: '8px' }}><div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Library catalogue</div><div style={{ color: '#0f172a', fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>{LIBRARY_LAB_TESTS.length} tests</div></div>
        <div style={{ padding: '12px 14px', border: '1px solid #d1fae5', background: '#ffffff', borderRadius: '8px' }}><div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Already present</div><div style={{ color: '#047857', fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>{isLoading ? '—' : presentCount}</div></div>
        <div style={{ padding: '12px 14px', border: '1px solid #e2e8f0', background: '#ffffff', borderRadius: '8px' }}><div style={{ color: '#64748b', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase' }}>Available to import</div><div style={{ color: '#2563eb', fontSize: '20px', fontWeight: 700, marginTop: '2px' }}>{isLoading ? '—' : LIBRARY_LAB_TESTS.length - presentCount}</div></div>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '16px',
        }}
      >
        <div style={{ position: 'relative', width: '300px', maxWidth: '100%' }}>
          <div
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              pointerEvents: 'none',
              color: '#94a3b8',
            }}
          >
            <Search size={15} />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in page..."
            style={{
              width: '100%',
              height: '38px',
              padding: '0 12px 0 36px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              color: '#0f172a',
              backgroundColor: '#ffffff',
              boxSizing: 'border-box',
              outline: 'none',
            }}
          />
        </div>
        <select
          aria-label="Filter library tests by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            width: '220px',
            height: '38px',
            padding: '0 12px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            fontSize: '13px',
            color: '#0f172a',
            backgroundColor: '#ffffff',
            outline: 'none',
            cursor: 'pointer',
          }}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {/* Table matching Labsmart's exact layout */}
      <div className="bg-white shadow-sm mb-8 border border-gray-200 rounded-md overflow-hidden">
        {loadError && (
          <div style={{ margin: '14px', padding: '12px 14px', borderRadius: '7px', color: '#991b1b', background: '#fef2f2', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
            <span><AlertCircle size={16} style={{ display: 'inline', verticalAlign: 'text-bottom', marginRight: '6px' }} />{loadError}</span>
            <button type="button" onClick={() => void refreshExistingTests()} className="btn btn-secondary">Try again</button>
          </div>
        )}
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-16 font-semibold">Sno.</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Specimen</th>
              <th className="px-4 py-3 w-64 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {isLoading ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500"><LoaderCircle size={17} className="animate-spin inline mr-2" />Loading test database status…</td></tr>
            ) : loadError ? null : filteredTests.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">No library tests match the current search or category.</td></tr>
            ) : filteredTests.map((test, index) => {
              const isPresent = existingTestNames.has(test.name.trim().toLowerCase());
              return (
                <tr key={test.libraryId || index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {test.sno}.
                  </td>
                  <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                    {test.name}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {test.category}
                  </td>
                  <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                    {test.sampleType || 'Serum'}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {isPresent ? (
                      <div className="text-gray-500 text-sm font-normal">
                        Already present
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleAddTest(test);
                        }}
                        className="flex items-center gap-2 m-0"
                      >
                        <input
                          type="number"
                          min="0"
                          required
                          placeholder="Fee"
                          value={feeInputs[test.libraryId] || ''}
                          onChange={(e) =>
                            setFeeInputs({ ...feeInputs, [test.libraryId]: e.target.value })
                          }
                          className="w-32 h-8 text-sm bg-white border border-gray-300 rounded px-2 shadow-sm text-gray-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                        <button
                          type="submit"
                          disabled={addingId === test.libraryId || Boolean(loadError)}
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors shadow-sm disabled:opacity-50 inline-flex items-center gap-1"
                        >
                          {addingId === test.libraryId ? <LoaderCircle size={13} className="animate-spin" /> : <Plus size={13} />}
                          {addingId === test.libraryId ? 'Importing...' : 'Add'}
                        </button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LabTestsLibraryPage;
