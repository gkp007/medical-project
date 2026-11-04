import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { businessApi, paymentsApi } from '../../services/api';
import {
  Calendar,
  CreditCard,
  MessageCircle,
  Printer,
  CheckCircle2,
  X,
  Search,
  AlertCircle,
  FileText
} from 'lucide-react';

interface DueInvoice {
  id: string;
  regNo: string;
  date: string;
  patientName: string;
  phone: string;
  referredBy: string;
  totalAmount: number;
  paidAmount: number;
  dueBalance: number;
}

export const DueReportsPage: React.FC = () => {
  const [dateRangeText, setDateRangeText] = useState(() => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  });
  const [selectedPreset, setSelectedPreset] = useState<'30days' | '7days' | 'today' | 'all'>('30days');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modals & Popups
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<DueInvoice | null>(null);
  const [selectedInvoiceForWhatsApp, setSelectedInvoiceForWhatsApp] = useState<DueInvoice | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Collect Payment Form
  const [amountPaying, setAmountPaying] = useState<number>(0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [paymentRef, setPaymentRef] = useState('');

  const [invoices, setInvoices] = useState<DueInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadDues = async () => {
    setIsLoading(true);
    try {
      const res = await businessApi.getDuesAging();
      if (res.status === 'success' && res.data?.debtors) {
        const mapped: DueInvoice[] = res.data.debtors.map((d: any) => ({
          id: d.id,
          regNo: d.billNumber || d.dailyCode || 'REG',
          date: d.registeredAt ? new Date(d.registeredAt).toLocaleString() : 'Recent',
          patientName: d.patientName || 'Patient',
          phone: d.mobile || '—',
          referredBy: d.doctorName || 'Self',
          totalAmount: Number(d.netPayable || 0),
          paidAmount: Number(d.paidAmount || 0),
          dueBalance: Number(d.balanceDue || 0)
        }));
        setInvoices(mapped);
      }
    } catch (err) {
      console.error('Failed to load dues', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDues();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenCollect = (inv: DueInvoice) => {
    setSelectedInvoiceForPayment(inv);
    setAmountPaying(inv.dueBalance);
    setPaymentMode('Cash');
    setPaymentRef('');
  };

  const handleConfirmCollect = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoiceForPayment) return;

    const collected = Number(amountPaying);
    try {
      await paymentsApi.collectDue({
        caseId: selectedInvoiceForPayment.id,
        amount: collected,
        mode: paymentMode,
        receivedBy: 'Billing Desk'
      });
      showToast(`Collected Rs.${collected} via ${paymentMode} for Reg #${selectedInvoiceForPayment.regNo}`);
      setSelectedInvoiceForPayment(null);
      await loadDues();
    } catch (err: any) {
      showToast(err.message || 'Failed to record payment');
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inv.phone.includes(searchQuery)
  );

  const totalOutstanding = filteredInvoices.reduce((a, b) => a + b.dueBalance, 0);

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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Due report</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" size="sm" icon={<Printer size={15} />} onClick={() => window.print()}>
            Print Report
          </Button>
        </div>
      </div>

      {/* Date Range Selector Box */}
      <Card style={{ padding: '16px', marginBottom: '20px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', width: '300px' }}>
            <Calendar size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#64748b' }} />
            <input
              type="text"
              readOnly
              value={dateRangeText}
              title="Set date range, Last 30 days selected by default"
              style={{
                width: '100%',
                padding: '7px 12px 7px 32px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e293b',
                backgroundColor: '#ffffff'
              }}
            />
          </div>

          {/* Quick preset filters */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[
              { id: 'today', label: 'Today', range: '19/10/2026 - 19/10/2026' },
              { id: '7days', label: 'Last 7 Days', range: '12/10/2026 - 19/10/2026' },
              { id: '30days', label: 'Last 30 Days (Default)', range: '19/09/2026 - 19/10/2026' },
            ].map(preset => (
              <button
                key={preset.id}
                onClick={() => { setSelectedPreset(preset.id as any); setDateRangeText(preset.range); }}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: selectedPreset === preset.id ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: selectedPreset === preset.id ? '#eff6ff' : '#ffffff',
                  color: selectedPreset === preset.id ? '#1d4ed8' : '#475569',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Main Content Area */}
      {filteredInvoices.length === 0 ? (
        <Card style={{ padding: '60px 20px', textAlign: 'center', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
          <CheckCircle2 size={44} color="#16a34a" style={{ margin: '0 auto 12px auto' }} />
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>All dues are cleared.</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            There are no outstanding patient balances for the selected date interval.
          </p>
        </Card>
      ) : (
        <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {/* Controls Bar */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search patient, phone, reg no..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <div style={{ fontSize: '14px', fontWeight: 700, color: '#dc2626' }}>
              Total Outstanding: Rs.{totalOutstanding}
            </div>
          </div>

          {/* Dues Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>REG. NO.</th>
                  <th style={{ padding: '12px 16px' }}>DATE</th>
                  <th style={{ padding: '12px 16px' }}>PATIENT</th>
                  <th style={{ padding: '12px 16px' }}>PHONE</th>
                  <th style={{ padding: '12px 16px' }}>REFERRED BY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>TOTAL</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>PAID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>DUE BALANCE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>{inv.regNo}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{inv.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{inv.patientName}</td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{inv.phone}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{inv.referredBy}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600 }}>Rs.{inv.totalAmount}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>Rs.{inv.paidAmount}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                      Rs.{inv.dueBalance}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<CreditCard size={13} />}
                          onClick={() => handleOpenCollect(inv)}
                        >
                          Collect
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          icon={<MessageCircle size={13} />}
                          onClick={() => {
                            setSelectedInvoiceForWhatsApp(inv);
                            showToast(`WhatsApp reminder drafted for ${inv.patientName}`);
                          }}
                        >
                          Remind
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: COLLECT DUE PAYMENT */}
      {selectedInvoiceForPayment && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Collect Due Payment</h3>
              <button onClick={() => setSelectedInvoiceForPayment(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Patient:</span>
                <span style={{ fontWeight: 600, color: '#1e293b' }}>{selectedInvoiceForPayment.patientName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: '#64748b' }}>Reg. Number:</span>
                <span style={{ fontWeight: 600, color: '#2563eb' }}>{selectedInvoiceForPayment.regNo}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Current Due Balance:</span>
                <span style={{ fontWeight: 700, color: '#ef4444' }}>Rs.{selectedInvoiceForPayment.dueBalance}</span>
              </div>
            </div>

            <form onSubmit={handleConfirmCollect} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Amount Paying Now (Rs.)
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max={selectedInvoiceForPayment.dueBalance}
                  value={amountPaying}
                  onChange={(e) => setAmountPaying(Number(e.target.value))}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Payment Mode
                </label>
                <select
                  value={paymentMode}
                  onChange={(e) => setPaymentMode(e.target.value as any)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Card">Card</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Reference / Transaction Note
                </label>
                <input
                  type="text"
                  placeholder="Optional receipt notes..."
                  value={paymentRef}
                  onChange={(e) => setPaymentRef(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <Button variant="secondary" size="md" onClick={() => setSelectedInvoiceForPayment(null)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Confirm Collection
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
