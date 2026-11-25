import React, { useEffect, useMemo, useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Download,
  CheckCircle2,
  PieChart,
  BarChart2,
  Search,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
} from 'lucide-react';
import { pathologyApi } from '../../services/api';

interface TestCountRow {
  id: string;
  sNo: number;
  testName: string;
  department: string;
  count: number;
  revenue: number;
  percentage: number;
}

export const TestCountsPage: React.FC = () => {
  const [dateRange, setDateRange] = useState(() => {
    const end = new Date();
    const start = new Date(end);
    start.setDate(end.getDate() - 30);
    const format = (date: Date) => date.toLocaleDateString('en-GB');
    return `${format(start)} - ${format(end)}`;
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [testRows, setTestRows] = useState<TestCountRow[]>([]);
  const [previousTotalTests, setPreviousTotalTests] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  const parseRange = (value: string) => {
    const [start, end] = value.split('-').map((part) => part.trim());
    const parseDate = (part?: string) => {
      if (!part) return undefined;
      const [day, month, year] = part.split('/');
      return day && month && year ? `${year}-${month}-${day}` : undefined;
    };
    return { startDate: parseDate(start), endDate: parseDate(end) };
  };

  const getPreviousRange = (startDate?: string, endDate?: string) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return null;
    const spanMs = Math.max(24 * 60 * 60 * 1000, end.getTime() - start.getTime() + 24 * 60 * 60 * 1000);
    const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
    const prevStart = new Date(prevEnd.getTime() - spanMs + 24 * 60 * 60 * 1000);
    const toIso = (d: Date) => d.toISOString().slice(0, 10);
    return { startDate: toIso(prevStart), endDate: toIso(prevEnd) };
  };

  const loadCounts = async (range = dateRange) => {
    setIsLoading(true);
    try {
      const parsed = parseRange(range);
      const prevRange = getPreviousRange(parsed.startDate, parsed.endDate);
      const [response, prevResponse] = await Promise.all([
        pathologyApi.getTestCounts(parsed),
        prevRange ? pathologyApi.getTestCounts(prevRange).catch(() => ({ success: false, data: [] })) : Promise.resolve({ success: false, data: [] }),
      ]);
      if (!response.success) throw new Error(response.message || 'Unable to load workload analytics');
      const rows = (response.data || []).map((row: any, index: number) => ({
        id: row.code || `${index}`,
        sNo: index + 1,
        testName: row.name || row.testName || 'Unnamed test',
        department: row.department || 'Uncategorised',
        count: Number(row.count || 0),
        revenue: Number(row.revenue || 0),
        percentage: 0,
      }));
      const total = rows.reduce((sum: number, row: TestCountRow) => sum + row.count, 0);
      setTestRows(rows.map((row: TestCountRow) => ({ ...row, percentage: total ? Math.round((row.count / total) * 100) : 0 })));
      const prevTotal = prevResponse?.success && Array.isArray(prevResponse.data)
        ? prevResponse.data.reduce((sum: number, row: any) => sum + Number(row.count || 0), 0)
        : 0;
      setPreviousTotalTests(prevTotal);
    } catch (error: any) {
      setTestRows([]);
      setPreviousTotalTests(0);
      showToast(error?.message || 'Could not load test workload analytics.');
    } finally { setIsLoading(false); }
  };

  useEffect(() => { loadCounts(); }, []);

  const totalTests = testRows.reduce((acc, r) => acc + r.count, 0);
  const totalRevenue = testRows.reduce((acc, r) => acc + r.revenue, 0);
  const avgPerTest = totalTests > 0 ? Math.round(totalRevenue / totalTests) : 0;
  const periodChangePct = previousTotalTests > 0
    ? Math.round(((totalTests - previousTotalTests) / previousTotalTests) * 100)
    : totalTests > 0 ? 100 : 0;

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    loadCounts();
  };

  const handleExport = () => {
    const csv = ['Test,Department,Sample count,Revenue', ...filteredRows.map((row) => [row.testName, row.department, row.count, row.revenue].map((value) => `"${String(value).replace(/"/g, '""')}"`).join(','))].join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url; link.download = 'test-workload.csv'; link.click(); URL.revokeObjectURL(url);
    showToast('Downloaded workload analytics CSV.');
  };

  const filteredRows = useMemo(() => testRows.filter((r) => {
    const q = searchQuery.toLowerCase();
    return r.testName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  }), [testRows, searchQuery]);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Test counts
        </h1>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleExport}
          style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <FileSpreadsheet size={15} color="#16a34a" />
          <span>Export workload</span>
        </button>
      </div>

      {/* Preview Banner */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          borderRadius: '8px',
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          color: '#1e40af',
          fontSize: '13px',
          marginBottom: '16px',
        }}
      >
        <AlertCircle size={18} color="#2563eb" style={{ flexShrink: 0 }} />
        <div>
          This feature provides cumulative analytics and specimen volume distribution for your laboratory workload.
        </div>
      </div>

      {/* Date Range & Search Form */}
      <form onSubmit={handleApplyFilter}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '14px 18px',
            marginBottom: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Calendar size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
              <input
                type="text"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                placeholder="Set date range, Last 30 days selected by default"
                className="input-control"
                style={{ paddingLeft: '32px', height: '36px', fontSize: '13px' }}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '8px 18px', fontSize: '13px' }}
            >
              Show
            </button>
          </div>

          <div style={{ position: 'relative', width: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
            <input
              type="text"
              placeholder="Search in page..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-control"
              style={{ paddingLeft: '32px', height: '36px', fontSize: '13px' }}
            />
          </div>
        </div>
      </form>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TOTAL TESTS PROCESSED</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '4px' }}>
            {totalTests}
          </div>
          <div
            style={{
              fontSize: '11px',
              color: periodChangePct > 0 ? '#16a34a' : periodChangePct < 0 ? '#dc2626' : '#64748b',
              marginTop: '4px',
              fontWeight: 500,
            }}
          >
            {previousTotalTests === 0 && totalTests === 0
              ? 'No tests in current or previous period'
              : previousTotalTests === 0 && totalTests > 0
                ? `${totalTests} tests (0 in previous period)`
                : `${periodChangePct > 0 ? '↑' : periodChangePct < 0 ? '↓' : '→'} ${Math.abs(periodChangePct)}% vs previous period (${previousTotalTests})`}
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>TOTAL REVENUE GENERATED</div>
          <div style={{ fontSize: '24px', fontWeight: 700, color: '#0284c7', marginTop: '4px' }}>
            ₹{totalRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            Avg ₹{avgPerTest.toLocaleString()} per test
          </div>
        </div>
      </div>

      {/* Workload Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '70px' }}>S. NO.</th>
              <th>TEST / INVESTIGATION</th>
              <th style={{ width: '180px' }}>DEPARTMENT</th>
              <th style={{ width: '140px', textAlign: 'right' }}>SAMPLE COUNT</th>
              <th style={{ width: '150px', textAlign: 'right' }}>REVENUE (₹)</th>
              <th style={{ width: '180px' }}>% OF TOTAL WORKLOAD</th>
            </tr>
          </thead>
          <tbody>
            {filteredRows.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '28px', color: '#64748b', fontSize: '13px' }}>
                  {isLoading ? 'Loading workload analytics...' : 'No test workload recorded for this date range.'}
                </td>
              </tr>
            ) : (
              filteredRows.map((r, idx) => (
              <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ fontSize: '13px', color: '#64748b' }}>{idx + 1}.</td>
                <td>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                    {r.testName}
                  </div>
                </td>
                <td>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                    }}
                  >
                    {r.department}
                  </span>
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                  {r.count}
                </td>
                <td style={{ textAlign: 'right', fontWeight: 600, color: '#0284c7', fontSize: '13px' }}>
                  ₹{r.revenue.toLocaleString()}
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        flex: 1,
                        height: '6px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '3px',
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${r.percentage}%`,
                          height: '100%',
                          backgroundColor: '#0284c7',
                        }}
                      />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', width: '32px' }}>
                      {r.percentage}%
                    </span>
                  </div>
                </td>
              </tr>
            ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
