import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Calendar,
  Printer,
  Download,
  TrendingUp,
  CreditCard,
  Banknote,
  Smartphone,
  Shield,
  CheckCircle2
} from 'lucide-react';

interface DayRow {
  day: string;
  upi: number;
  cash: number;
  card: number;
  insurance: number;
  total: number;
}

export const BusinessAnalysisPage: React.FC = () => {
  const [selectedMonth, setSelectedMonth] = useState('October');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2023', '2024', '2025', '2026', '2027'];

  // Generate 31 days data with realistic values for demonstration
  const generateMonthData = (): DayRow[] => {
    const rows: DayRow[] = [];
    for (let i = 1; i <= 31; i++) {
      const dayStr = `${String(i).padStart(2, '0')}-10-2026`;
      let upi = 0;
      let cash = 0;
      let card = 0;
      let insurance = 0;

      if (i === 18) {
        cash = 100;
      } else if (i === 19) {
        cash = 400;
      }

      rows.push({
        day: dayStr,
        upi,
        cash,
        card,
        insurance,
        total: upi + cash + card + insurance
      });
    }
    return rows;
  };

  const [dataRows, setDataRows] = useState<DayRow[]>(generateMonthData());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const totalUPI = dataRows.reduce((a, b) => a + b.upi, 0);
  const totalCash = dataRows.reduce((a, b) => a + b.cash, 0);
  const totalCard = dataRows.reduce((a, b) => a + b.card, 0);
  const totalInsurance = dataRows.reduce((a, b) => a + b.insurance, 0);
  const grandTotal = totalUPI + totalCash + totalCard + totalInsurance;

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
            Monthly Business Overview (BETA)
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
            Print Matrix
          </Button>
          <Button variant="secondary" size="sm" icon={<Download size={14} />} onClick={() => showToast('Exported monthly financial matrix (.xlsx)')}>
            Export Excel
          </Button>
        </div>
      </div>

      {/* Month & Year Selection Bar */}
      <Card style={{ padding: '16px', marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            showToast(`Loaded ${selectedMonth} ${selectedYear} monthly business overview.`);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}
        >
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: '#1e293b', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            {months.map(m => <option key={m} value={m}>{m}</option>)}
          </select>

          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            style={{ padding: '8px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: '#1e293b', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>

          <Button variant="primary" size="sm" type="submit">
            Show
          </Button>
        </form>
      </Card>

      {/* 31-Day Financial Matrix Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto', maxHeight: '650px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #cbd5e1', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '10px 16px', width: '160px' }}>Day</th>
                <th style={{ padding: '10px 16px', textAlign: 'right' }}>UPI (Rs.)</th>
                <th style={{ padding: '10px 16px', textAlign: 'right' }}>Cash (Rs.)</th>
                <th style={{ padding: '10px 16px', textAlign: 'right' }}>Card (Rs.)</th>
                <th style={{ padding: '10px 16px', textAlign: 'right' }}>Insurance (Rs.)</th>
                <th style={{ padding: '10px 16px', textAlign: 'right', width: '160px' }}>Total (Rs.)</th>
              </tr>
            </thead>
            <tbody>
              {dataRows.map((row, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid #f1f5f9',
                    backgroundColor: row.total > 0 ? '#f0fdf4' : idx % 2 === 0 ? '#ffffff' : '#fafafa'
                  }}
                >
                  <td style={{ padding: '9px 16px', fontWeight: 600, color: '#334155' }}>
                    {row.day}
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: row.upi > 0 ? '#c2410c' : '#94a3b8' }}>
                    {row.upi}
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', fontWeight: row.cash > 0 ? 700 : 400, color: row.cash > 0 ? '#92400e' : '#94a3b8' }}>
                    {row.cash}
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: row.card > 0 ? '#be185d' : '#94a3b8' }}>
                    {row.card}
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', color: row.insurance > 0 ? '#047857' : '#94a3b8' }}>
                    {row.insurance}
                  </td>
                  <td style={{ padding: '9px 16px', textAlign: 'right', fontWeight: row.total > 0 ? 800 : 400, color: row.total > 0 ? '#15803d' : '#64748b' }}>
                    {row.total}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot style={{ position: 'sticky', bottom: 0, zIndex: 10 }}>
              <tr style={{ backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 800 }}>
                <td style={{ padding: '12px 16px' }}>Total</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{totalUPI}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{totalCash}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{totalCard}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right' }}>{totalInsurance}</td>
                <td style={{ padding: '12px 16px', textAlign: 'right', color: '#4ade80', fontSize: '15px' }}>{grandTotal}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};
