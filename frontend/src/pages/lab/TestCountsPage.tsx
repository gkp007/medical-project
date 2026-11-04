import React, { useState } from 'react';
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
  const [dateRange, setDateRange] = useState('19/09/2026 - 19/10/2026');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [testRows] = useState<TestCountRow[]>([
    { id: '1', sNo: 1, testName: 'Complete Blood Count (CBC)', department: 'Haematology', count: 184, revenue: 73600, percentage: 38 },
    { id: '2', sNo: 2, testName: 'Liver Function Test (LFT)', department: 'Biochemistry', count: 96, revenue: 76800, percentage: 20 },
    { id: '3', sNo: 3, testName: 'Kidney Function Test (KFT)', department: 'Biochemistry', count: 82, revenue: 57400, percentage: 17 },
    { id: '4', sNo: 4, testName: 'Fasting Blood Sugar (FBS)', department: 'Biochemistry', count: 74, revenue: 7400, percentage: 15 },
    { id: '5', sNo: 5, testName: 'Lipid Profile Standard', department: 'Biochemistry', count: 48, revenue: 31200, percentage: 10 },
  ]);

  const totalTests = testRows.reduce((acc, r) => acc + r.count, 0);
  const totalRevenue = testRows.reduce((acc, r) => acc + r.revenue, 0);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleApplyFilter = (e: React.FormEvent) => {
    e.preventDefault();
    showToast(`Loaded test count analytics for: ${dateRange}`);
  };

  const handleExport = () => {
    showToast('Exported test workload analytics spreadsheet (.xlsx)');
  };

  const filteredRows = testRows.filter((r) => {
    const q = searchQuery.toLowerCase();
    return r.testName.toLowerCase().includes(q) || r.department.toLowerCase().includes(q);
  });

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
          <div style={{ fontSize: '11px', color: '#16a34a', marginTop: '4px', fontWeight: 500 }}>
            ↑ 14% vs previous 30-day period
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
            Avg ₹{Math.round(totalRevenue / totalTests)} per test
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
            {filteredRows.map((r, idx) => (
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
