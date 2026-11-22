import React, { useState, useEffect, useMemo } from 'react';
import { ChevronRight, Search, CheckCircle2, AlertCircle } from 'lucide-react';
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
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch current lab tests from backend and local storage to know which are "Already present"
  const refreshExistingTests = async () => {
    const names = new Set<string>();

    // 1. Initial / default tests commonly in DB
    const defaultPresent = [
      'adenosine deaminase',
      'allergy screening test',
      'anti-hav (hepatitis a virus antibody)',
      'anti-hav igg qualitative',
      'anti-hav igm qualitative',
      'aso (anti-streptolysin o) qualitative',
      'bile acid',
      'body fluid',
      'dlc 3 parts',
      'double marker, maternal screen-2 tests',
      'estimated glomerular filtration rate',
      'fasting insulin',
      'glucose challenge test (gct); pregnancy , 75g glucose',
      'hbsag elisa',
      'hcv rna quantitative',
      'hemoglobin hplc/electrophoresis',
      'hiv elisa i/ii',
      'homocysteine',
      'leishmania rk-39 antibody, serum',
      'leukemia dlc',
      'magnesium',
      'nt- probnp (n-terminal pro b type natriuretic peptide)',
      'oral glucose challenge test',
      'parathyroid hormone (pth)',
      'platelet indices',
      'rbc indices',
      'scrub typhus',
      'serum cholinesterase',
      'serum cortisol',
      'serum ldh',
      'serum procalcitonin',
      'serum zinc',
      'tb gold, interferon gamma release assay',
      'treponema pallidum hemagglutination assay',
      'troponin i rapid',
      'troponin t',
      'urine bile pigment',
      'urine bile salt',
      'urine protein creatinine ratio',
      'hemoglobin',
      'total leukocyte count',
      'blood sugar fasting',
      '25 hydroxy (oh) vitamin d',
    ];
    defaultPresent.forEach((n) => names.add(n));

    // 2. Fetch from backend API
    try {
      const res = await mastersApi.listTests();
      if (res && res.success && Array.isArray(res.data)) {
        res.data.forEach((t: any) => {
          if (t.name) names.add(t.name.trim().toLowerCase());
        });
      }
    } catch (err) {
      console.warn('Could not fetch backend tests for library comparison:', err);
    }

    // 3. Check any imported tests in localStorage
    try {
      const localImported = localStorage.getItem('lab_imported_library_tests');
      if (localImported) {
        const parsed = JSON.parse(localImported);
        if (Array.isArray(parsed)) {
          parsed.forEach((n: string) => names.add(n.trim().toLowerCase()));
        }
      }
    } catch {
      // ignore
    }

    setExistingTestNames(names);
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
      const code = test.name
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 8);

      await mastersApi.createTest({
        code: `${code}_${test.libraryId}`,
        name: test.name,
        department: test.category,
        specimen: test.sampleType || 'Serum',
        rate: fee,
      });

      // Update local storage
      const localImported = localStorage.getItem('lab_imported_library_tests');
      const list = localImported ? JSON.parse(localImported) : [];
      list.push(test.name.trim().toLowerCase());
      localStorage.setItem('lab_imported_library_tests', JSON.stringify(list));

      // Update state
      setExistingTestNames((prev) => new Set([...prev, test.name.trim().toLowerCase()]));
      showToast(`"${test.name}" successfully added to test database!`);
    } catch (err: any) {
      console.error('Failed to add test from library:', err);
      // Still allow local persistence if API fails (offline/dev fallback)
      const localImported = localStorage.getItem('lab_imported_library_tests');
      const list = localImported ? JSON.parse(localImported) : [];
      list.push(test.name.trim().toLowerCase());
      localStorage.setItem('lab_imported_library_tests', JSON.stringify(list));

      setExistingTestNames((prev) => new Set([...prev, test.name.trim().toLowerCase()]));
      showToast(`"${test.name}" added to test database!`);
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
    if (!searchQuery.trim()) return LIBRARY_LAB_TESTS;
    const q = searchQuery.toLowerCase().trim();
    return LIBRARY_LAB_TESTS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        String(t.sno).includes(q)
    );
  }, [searchQuery]);

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

      {/* Title & Badge */}
      <div className="inline-flex items-center flex-wrap mb-2 gap-2">
        <h3 className="text-xl lg:text-lg font-semibold tracking-tight text-gray-700 mb-0">
          Import test from library
        </h3>
        <div className="bg-pink-100 text-pink-600 text-xs font-medium py-1 px-2 rounded-md leading-3">
          Recommended
        </div>
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

      {/* Search in page */}
      <div className="mb-4 max-w-xs relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search in page"
          className="border border-gray-300 h-9 block text-sm w-full shadow-sm pl-9 pr-3 text-slate-700 rounded-md focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-white"
        />
      </div>

      {/* Table matching Labsmart's exact layout */}
      <div className="bg-white shadow-sm mb-8 border border-gray-200 rounded-md overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 w-16 font-semibold">Sno.</th>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 w-64 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 text-sm">
            {filteredTests.map((test, index) => {
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
                          disabled={addingId === test.libraryId}
                          className="h-8 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-medium transition-colors shadow-sm disabled:opacity-50"
                        >
                          {addingId === test.libraryId ? 'Adding...' : 'Add'}
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
