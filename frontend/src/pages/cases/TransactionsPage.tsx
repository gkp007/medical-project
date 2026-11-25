import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { paymentsApi, doctorApi } from '../../services/api';
import {
  Calendar,
  Search,
  Filter,
  CheckCircle2,
  Printer,
  FileText
} from 'lucide-react';

interface TransactionItem {
  id: string;
  regNo: string;
  patientName: string;
  doctor: string;
  date: string;
  time: string;
  dcn: string;
  cc: string;
  amount: number;
  method: 'cash' | 'upi' | 'card' | 'insurance';
  receivedBy: string;
  isRefund?: boolean;
}

interface TransactionsPageProps {
  onNavigatePrintBill?: () => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ onNavigatePrintBill }) => {
  const [duration, setDuration] = useState('Past 7 days');
  const [paymentMode, setPaymentMode] = useState('Select mode');
  const [collectionCentre, setCollectionCentre] = useState('Select collection centre');
  const [transType, setTransType] = useState('Select type');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [referredByFilter, setReferredByFilter] = useState('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [doctorsList, setDoctorsList] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      const [res, docsRes] = await Promise.all([
        paymentsApi.listTransactions(),
        doctorApi.listDoctors().catch(() => ({ success: false, data: [] })),
      ]);
      if (docsRes?.success && Array.isArray(docsRes.data)) {
        setDoctorsList(docsRes.data.map((d: any) => d.name).filter(Boolean));
      }
      const txList = Array.isArray(res.data)
        ? res.data
        : (Array.isArray(res.data?.transactions) ? res.data.transactions : []);

      if (txList.length > 0) {
        const mapped: TransactionItem[] = txList.map((t: any) => {
          const createdAt = t.createdAt ? new Date(t.createdAt) : new Date();
          return {
            id: t.receiptNumber || t.id.substring(0, 8),
            regNo: t.case?.billNumber || t.case?.uhid || '#1001',
            patientName: t.case?.patient?.fullName || 'Walk-in Patient',
            doctor: t.case?.doctor?.name || 'Self Refer',
            date: createdAt.toLocaleDateString('en-GB'),
            time: createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            dcn: t.case?.dailyCode || 'L1',
            cc: t.case?.branchId === 'main' ? 'Main' : (t.case?.branchId || 'Main'),
            amount: Number(t.amount || 0),
            method: (t.mode?.toLowerCase() === 'upi' ? 'upi' : t.mode?.toLowerCase() === 'card' ? 'card' : t.mode?.toLowerCase() === 'insurance' ? 'insurance' : 'cash') as any,
            receivedBy: t.receivedBy || 'Staff',
          };
        });
        setTransactions(mapped);
      } else {
        setTransactions([]);
      }
    } catch (err) {
      console.error('Failed to load transactions', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTransactions();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setDuration('Past 7 days');
    setPaymentMode('Select mode');
    setCollectionCentre('Select collection centre');
    setTransType('Select type');
    setFirstNameFilter('');
    setReferredByFilter('All');
    showToast('Reset transaction filters.');
  };

  const filteredTransactions = transactions.filter(t => {
    if (paymentMode !== 'Select mode' && t.method.toLowerCase() !== paymentMode.toLowerCase()) return false;
    if (collectionCentre !== 'Select collection centre' && t.cc !== collectionCentre) return false;
    if (firstNameFilter && !t.patientName.toLowerCase().includes(firstNameFilter.toLowerCase())) return false;
    if (referredByFilter !== 'All' && !t.doctor.includes(referredByFilter)) return false;
    return true;
  });

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

      {/* Heading */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Transactions</h1>
        <Button variant="secondary" size="sm" icon={<Printer size={14} />} onClick={() => window.print()}>
          Print Receipts
        </Button>
      </div>

      {/* Filter Form Card */}
      <Card style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Duration
            </label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="Past 7 days">Past 7 days (12 Oct 2026 to 19 Oct 2026)</option>
              <option value="Past 30 days">Past 30 days</option>
              <option value="Past 90 days">Past 90 days</option>
              <option value="Custom range">Custom range</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Payment mode
            </label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="Select mode">Select mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Card">Card</option>
              <option value="Insurance">Insurance</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Collection centre
            </label>
            <select
              value={collectionCentre}
              onChange={(e) => setCollectionCentre(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="Select collection centre">Select collection centre</option>
              <option value="Main">Main</option>
              <option value="Branch 1">Branch 1</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
              Type
            </label>
            <select
              value={transType}
              onChange={(e) => setTransType(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="Select type">Select type</option>
              <option value="Income">Income (+ Receipts)</option>
              <option value="Refund">Refund (- Payouts)</option>
            </select>
          </div>
        </div>

        {/* Show More Filters Collapsible Fields */}
        {showMoreFilters && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed #e2e8f0' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Patient first name
              </label>
              <input
                type="text"
                placeholder="Patient name..."
                value={firstNameFilter}
                onChange={(e) => setFirstNameFilter(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>
                Referred by
              </label>
              <select
                value={referredByFilter}
                onChange={(e) => setReferredByFilter(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
              >
                <option value="All">All Doctors</option>
                {doctorsList.map((docName) => (
                  <option key={docName} value={docName}>{docName}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
          >
            {showMoreFilters ? '- Hide extra filters' : '+ Show more filters'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="primary" size="sm" onClick={() => showToast('Applying transaction search...')}>
              Search
            </Button>
            <button
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear
            </button>
          </div>
        </div>
      </Card>

      {/* Receipts Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 14px' }}>ID</th>
                <th style={{ padding: '12px 14px' }}>REG. NO.</th>
                <th style={{ padding: '12px 14px' }}>PATIENT NAME</th>
                <th style={{ padding: '12px 14px' }}>REFERRED BY</th>
                <th style={{ padding: '12px 14px' }}>DATE</th>
                <th style={{ padding: '12px 14px' }}>TIME</th>
                <th style={{ padding: '12px 14px' }}>DCN</th>
                <th style={{ padding: '12px 14px' }}>CC</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>AMOUNT</th>
                <th style={{ padding: '12px 14px' }}>METHOD</th>
                <th style={{ padding: '12px 14px' }}>RECEIVED BY</th>
                <th style={{ padding: '12px 14px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={12} style={{ padding: '28px', textAlign: 'center', color: '#64748b' }}>
                    {isLoading ? 'Loading transactions...' : 'No transactions found.'}
                  </td>
                </tr>
              ) : filteredTransactions.slice((page - 1) * 20, page * 20).map(t => (
                <tr key={t.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 14px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{t.id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 700, color: '#1e293b' }}>{t.regNo}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#1e293b' }}>{t.patientName}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{t.doctor}</td>
                  <td style={{ padding: '12px 14px' }}>{t.date}</td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{t.time}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 600, color: '#475569' }}>{t.dcn}</td>
                  <td style={{ padding: '12px 14px' }}>{t.cc}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right', fontWeight: 700, color: t.amount > 0 ? '#15803d' : '#dc2626' }}>
                    {t.amount > 0 ? `+ Rs.${t.amount}` : `- Rs.${Math.abs(t.amount)}`}
                  </td>
                  <td style={{ padding: '12px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e' }}>
                      {t.method}
                    </span>
                  </td>
                  <td style={{ padding: '12px 14px', color: '#64748b' }}>{t.receivedBy}</td>
                  <td style={{ padding: '12px 14px', textAlign: 'right' }}>
                    <button
                      onClick={() => {
                        localStorage.setItem('labsmart_active_bill_number', t.regNo.replace('#', ''));
                        if (onNavigatePrintBill) onNavigatePrintBill();
                      }}
                      style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}
                    >
                      View bill
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '12px', color: '#64748b' }}>
          <span>Page {page} of {Math.max(1, Math.ceil(filteredTransactions.length / 20))}</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
            <Button variant="secondary" size="sm" disabled={page * 20 >= filteredTransactions.length} onClick={() => setPage((p) => p + 1)}>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};
