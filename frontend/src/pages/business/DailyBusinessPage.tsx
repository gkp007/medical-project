import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Modal } from '../../components/atoms/Modal';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Mail,
  FileText,
  Calendar,
  HelpCircle,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  UserPlus,
  CheckCircle2,
  X,
  CreditCard,
  Banknote,
  Smartphone,
  Shield,
  Info
} from 'lucide-react';
import { businessApi } from '../../services/api';

interface TransactionItem {
  id: string;
  regNo: string;
  patientName: string;
  referredBy: string;
  date: string;
  time: string;
  dcn: string;
  cc: string;
  amount: number;
  method: 'Cash' | 'Card' | 'UPI' | 'Insurance';
  receivedBy: string;
}

interface BillItem {
  regNo: string;
  date: string;
  patient: string;
  referredBy: string;
  total: number;
  paid: number;
  discount: number;
  status: 'Paid' | 'Partial' | 'Due' | 'Cancelled';
}

interface ExpenseItem {
  id: string;
  addedOn: string;
  spentOn: string;
  expense: string;
  amount: number;
  category: string;
  mode: 'Cash' | 'UPI' | 'Card';
  cashier: string;
  notes: string;
}

interface CashierItem {
  id: string;
  name: string;
  mobile: string;
  counter: string;
  role: string;
  openingFloat: number;
  shift: string;
  active: boolean;
  addedAt: string;
}

// Helper date-time formatters for inputs
const getCurrentLocalDate = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const getCurrentLocalDateTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const DailyBusinessPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(getCurrentLocalDate());
  const [activeTab, setActiveTab] = useState<'transactions' | 'bills' | 'expenses'>('transactions');
  const [showIncomeSplit, setShowIncomeSplit] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterPrevDayBills, setFilterPrevDayBills] = useState<boolean>(false);

  // Modals
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isBusinessReportModalOpen, setIsBusinessReportModalOpen] = useState(false);
  const [isMonthlyOverviewModalOpen, setIsMonthlyOverviewModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isCollectionChargeInfoOpen, setIsCollectionChargeInfoOpen] = useState(false);
  const [isHowExpensesWorkOpen, setIsHowExpensesWorkOpen] = useState(false);
  const [isAddCashierModalOpen, setIsAddCashierModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [recipientEmail, setRecipientEmail] = useState<string>('directors@metropolisdiagnostics.com');
  const [isSendingEmail, setIsSendingEmail] = useState<boolean>(false);

  const handleSendEmailReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientEmail.trim()) return;
    setIsSendingEmail(true);
    try {
      const res = await businessApi.emailDailyReport(selectedDate, recipientEmail.trim());
      if (res.success) {
        showToast(`Day-end settlement report for ${selectedDate} dispatched to ${recipientEmail}`);
        setIsEmailModalOpen(false);
      } else {
        showToast(res.message || 'Failed to dispatch email.');
      }
    } catch {
      showToast('Network communication error sending email.');
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Cashier Setup State
  const [cashiers, setCashiers] = useState<CashierItem[]>([
    {
      id: 'c-01',
      name: 'Admin Demo',
      mobile: '+91 98765 43210',
      counter: 'Counter 1 (Main Reception)',
      role: 'Receptionist & Cashier',
      openingFloat: 1000,
      shift: 'Morning Shift (08:00 AM - 02:00 PM)',
      active: true,
      addedAt: new Date().toLocaleDateString() + ' 08:00 AM'
    }
  ]);
  const [cashierName, setCashierName] = useState('');
  const [cashierMobile, setCashierMobile] = useState('');
  const [cashierCounter, setCashierCounter] = useState('Counter 1 (Main Reception)');
  const [cashierRole, setCashierRole] = useState('Receptionist & Cashier');
  const [cashierOpeningFloat, setCashierOpeningFloat] = useState<number>(1000);
  const [cashierShift, setCashierShift] = useState('Morning Shift (08:00 AM - 02:00 PM)');
  const [cashierNotes, setCashierNotes] = useState('');

  // Add Expense Form State
  const [newExpName, setNewExpName] = useState('');
  const [newExpAmount, setNewExpAmount] = useState<number>(0);
  const [newExpMode, setNewExpMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [newExpCategory, setNewExpCategory] = useState('Lab Reagents & Consumables');
  const [newExpSpentOn, setNewExpSpentOn] = useState(getCurrentLocalDateTime());
  const [newExpNotes, setNewExpNotes] = useState('');

  const handleSaveCashier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cashierName.trim()) return;

    const newC: CashierItem = {
      id: 'c-' + Date.now(),
      name: cashierName,
      mobile: cashierMobile || '+91 98000 00000',
      counter: cashierCounter,
      role: cashierRole,
      openingFloat: Number(cashierOpeningFloat) || 0,
      shift: cashierShift,
      active: true,
      addedAt: new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setCashiers([...cashiers, newC]);
    setIsAddCashierModalOpen(false);
    setCashierName('');
    setCashierMobile('');
    setCashierOpeningFloat(1000);
    setCashierNotes('');
    showToast(`Cashier "${newC.name}" assigned to ${newC.counter} with float Rs.${newC.openingFloat}`);
  };

  // Sample Data initialized empty, populated from live database
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [bills, setBills] = useState<BillItem[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load real financial transactions, bills & expenses from backend API
  useEffect(() => {
    const fetchReport = async () => {
      try {
        const rep = await businessApi.getDailyReport(selectedDate);
        if (rep.success && rep.data) {
          if (rep.data.transactions && rep.data.transactions.length > 0) {
            const mappedTrans: TransactionItem[] = rep.data.transactions.map((t: any) => {
              const txDate = t.time || t.createdAt || new Date();
              return {
                id: t.receiptNumber || t.id,
                regNo: t.billNumber || t.case?.billNumber || 'BL-001',
                patientName: t.patientName || t.case?.patient?.fullName || 'Walk-in Patient',
                referredBy: t.referredBy || t.case?.doctor?.name || 'Self Referral',
                date: new Date(txDate).toLocaleDateString(),
                time: new Date(txDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                dcn: t.dailyCode || t.case?.dailyCode || 'L1',
                cc: 'MAIN',
                amount: t.amount,
                method: t.mode === 'Card' ? 'Card' : t.mode === 'UPI' ? 'UPI' : 'Cash',
                receivedBy: t.receivedBy || 'Admin Demo',
              };
            });
            setTransactions(mappedTrans);
          } else {
            setTransactions([]);
          }

          if (rep.data.expenses && rep.data.expenses.length > 0) {
            const mappedExp: ExpenseItem[] = rep.data.expenses.map((e: any) => {
              const expDate = e.date || e.createdAt || new Date();
              return {
                id: e.id,
                addedOn: new Date(expDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                spentOn: new Date(expDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
                expense: e.name || e.description || e.category,
                amount: e.amount,
                category: e.category,
                mode: (e.paymentMode || e.mode) === 'Card' ? 'Card' : (e.paymentMode || e.mode) === 'UPI' ? 'UPI' : 'Cash',
                cashier: e.cashierName || e.approvedBy || 'Admin Demo',
                notes: e.description || '',
              };
            });
            setExpenses(mappedExp);
          } else {
            setExpenses([]);
          }

          if (rep.data.cases && rep.data.cases.length > 0) {
            const mappedBills: BillItem[] = rep.data.cases.map((c: any) => ({
              regNo: c.regNo,
              date: new Date(c.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              patient: c.patient,
              referredBy: c.referredBy,
              total: c.total,
              paid: c.paid,
              discount: c.discount,
              status: c.status === 'Full' || c.status === 'Paid' ? 'Paid' : c.status === 'Partial' ? 'Partial' : c.status === 'Cancelled' ? 'Cancelled' : 'Due'
            }));
            setBills(mappedBills);
          } else {
            setBills([]);
          }
        }
      } catch (err) {
        console.error('Failed to load daily report:', err);
      }
    };

    fetchReport();
  }, [selectedDate]);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpName || newExpAmount <= 0) return;

    try {
      const res = await businessApi.createExpense({
        category: newExpCategory,
        amount: Number(newExpAmount),
        description: newExpName,
        mode: newExpMode,
      });

      const item: ExpenseItem = {
        id: res.data?.id || String(Date.now()),
        addedOn: 'Today ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        spentOn: newExpSpentOn.replace('T', ' '),
        expense: newExpName,
        amount: Number(newExpAmount),
        category: newExpCategory,
        mode: newExpMode,
        cashier: 'Admin Demo',
        notes: newExpNotes,
      };

      setExpenses([item, ...expenses]);
      setIsAddExpenseModalOpen(false);
      setNewExpName('');
      setNewExpAmount(0);
      setNewExpNotes('');
      showToast(`Created expense "${item.expense}" for Rs.${item.amount}`);
    } catch (err) {
      showToast('Error saving expense to server.');
    }
  };

  // Calculations
  const totalIncome = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalCollectionCharge = 0;
  const totalExpenses = expenses.reduce((acc, e) => acc + e.amount, 0);
  const netIncome = totalIncome + totalCollectionCharge - totalExpenses;

  const cashSplit = transactions.filter(t => t.method === 'Cash').reduce((a, b) => a + b.amount, 0);
  const cardSplit = transactions.filter(t => t.method === 'Card').reduce((a, b) => a + b.amount, 0);
  const upiSplit = transactions.filter(t => t.method === 'UPI').reduce((a, b) => a + b.amount, 0);
  const insuranceSplit = transactions.filter(t => t.method === 'Insurance').reduce((a, b) => a + b.amount, 0);

  const filteredTransactions = transactions.filter(t =>
    t.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.referredBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBills = bills.filter(b =>
    b.patient.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.regNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.referredBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredExpenses = expenses.filter(e =>
    e.expense.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.cashier.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

      {/* Top Header Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Daily business</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="secondary"
            size="sm"
            icon={<FileText size={15} />}
            onClick={() => setIsBusinessReportModalOpen(true)}
          >
            Business Report
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsMonthlyOverviewModalOpen(true)}
          >
            Monthly Overview (BETA)
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Printer size={15} />}
            onClick={() => window.print()}
          >
            Print
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={<Mail size={15} />}
            onClick={() => setIsEmailModalOpen(true)}
          >
            Email
          </Button>
        </div>
      </div>

      {/* Date Switcher Bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() - 1);
            setSelectedDate(d.toISOString().split('T')[0]);
          }}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          <ChevronLeft size={16} />
        </button>

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
          <Calendar size={16} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '6px 12px 6px 34px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: 500,
              color: '#334155',
              backgroundColor: '#ffffff',
              outline: 'none',
              cursor: 'pointer'
            }}
          />
        </div>

        <button
          onClick={() => {
            const d = new Date(selectedDate);
            d.setDate(d.getDate() + 1);
            setSelectedDate(d.toISOString().split('T')[0]);
          }}
          style={{
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            backgroundColor: '#ffffff',
            cursor: 'pointer',
            color: '#475569'
          }}
        >
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Net Income Summary Card & Formula Bar */}
      <Card style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          {/* Formula calculation equation */}
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
            {/* 1. Total Income */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total Income
                </span>
                <button
                  onClick={() => setShowIncomeSplit(!showIncomeSplit)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  title="Toggle income split"
                >
                  {showIncomeSplit ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                Rs.{totalIncome}
              </div>
            </div>

            <span style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8' }}>+</span>

            {/* 2. Collection Charge */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Total collection charge
                </span>
                <HelpCircle
                  size={14}
                  style={{ color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setIsCollectionChargeInfoOpen(true)}
                />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', marginTop: '2px' }}>
                Rs.{totalCollectionCharge}
              </div>
            </div>

            <span style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8' }}>-</span>

            {/* 3. Expenses */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
                  Expenses
                </span>
                <HelpCircle
                  size={14}
                  style={{ color: '#94a3b8', cursor: 'pointer' }}
                  onClick={() => setIsHowExpensesWorkOpen(true)}
                />
              </div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444', marginTop: '2px' }}>
                Rs.{totalExpenses}
              </div>
            </div>

            <span style={{ fontSize: '18px', fontWeight: 600, color: '#94a3b8' }}>=</span>

            {/* 4. Net Income */}
            <div style={{ backgroundColor: '#f0fdf4', padding: '6px 14px', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
              <span style={{ fontSize: '12px', color: '#166534', fontWeight: 600, textTransform: 'uppercase' }}>
                Net income
              </span>
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#15803d', marginTop: '2px' }}>
                Rs.{netIncome}
              </div>
            </div>
          </div>

          {/* Date & Today Badge */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'flex-end' }}>
              <span style={{ fontSize: '12px', color: '#64748b' }}>Date - {selectedDate}</span>
              {selectedDate === getCurrentLocalDate() && (
                <span
                  style={{
                    backgroundColor: '#38bdf8',
                    color: '#ffffff',
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '4px'
                  }}
                >
                  Today
                </span>
              )}
            </div>
            <button
              onClick={() => setIsCollectionChargeInfoOpen(true)}
              style={{
                background: 'none',
                border: 'none',
                padding: 0,
                color: '#2563eb',
                fontSize: '12px',
                cursor: 'pointer',
                marginTop: '6px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <HelpCircle size={13} />
              How collection charges work?
            </button>
          </div>
        </div>

        {/* Collapsible Income Split */}
        {showIncomeSplit && (
          <div
            style={{
              marginTop: '16px',
              paddingTop: '16px',
              borderTop: '1px solid #f1f5f9',
              display: 'flex',
              alignItems: 'center',
              gap: '24px',
              flexWrap: 'wrap'
            }}
          >
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Total income split:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#92400e' }} />
              <span style={{ fontSize: '13px', color: '#64748b' }}>Cash:</span>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>Rs.{cashSplit}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#be185d' }} />
              <span style={{ fontSize: '13px', color: '#64748b' }}>Card:</span>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>Rs.{cardSplit}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#c2410c' }} />
              <span style={{ fontSize: '13px', color: '#64748b' }}>UPI:</span>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>Rs.{upiSplit}</strong>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#047857' }} />
              <span style={{ fontSize: '13px', color: '#64748b' }}>Insurance:</span>
              <strong style={{ fontSize: '13px', color: '#1e293b' }}>Rs.{insuranceSplit}</strong>
            </div>
          </div>
        )}
      </Card>

      {/* Tabs Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('transactions')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'transactions' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'transactions' ? '#2563eb' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Transactions</span>
          <span style={{ backgroundColor: activeTab === 'transactions' ? '#dbeafe' : '#f1f5f9', color: activeTab === 'transactions' ? '#1d4ed8' : '#64748b', padding: '1px 7px', borderRadius: '12px', fontSize: '12px' }}>
            {transactions.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('bills')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'bills' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'bills' ? '#2563eb' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Bills</span>
          <span style={{ backgroundColor: activeTab === 'bills' ? '#dbeafe' : '#f1f5f9', color: activeTab === 'bills' ? '#1d4ed8' : '#64748b', padding: '1px 7px', borderRadius: '12px', fontSize: '12px' }}>
            {bills.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('expenses')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeTab === 'expenses' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeTab === 'expenses' ? '#2563eb' : '#64748b',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <span>Expenses</span>
          <span style={{ backgroundColor: activeTab === 'expenses' ? '#dbeafe' : '#f1f5f9', color: activeTab === 'expenses' ? '#1d4ed8' : '#64748b', padding: '1px 7px', borderRadius: '12px', fontSize: '12px' }}>
            {expenses.length}
          </span>
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS */}
      {activeTab === 'transactions' && (
        <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {/* Table Controls Bar */}
          <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search in page"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <button
                onClick={() => setFilterPrevDayBills(!filterPrevDayBills)}
                style={{
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: filterPrevDayBills ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: filterPrevDayBills ? '#eff6ff' : '#ffffff',
                  color: filterPrevDayBills ? '#1d4ed8' : '#475569',
                  fontSize: '13px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Previous day bills (0)
              </button>

              <button
                onClick={() => setIsAddCashierModalOpen(true)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '6px',
                  border: '1px solid #bfdbfe',
                  backgroundColor: '#eff6ff',
                  color: '#2563eb',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <UserPlus size={15} />
                Add cashier ({cashiers.length})
              </button>
            </div>
          </div>

          {/* Active Cashier Status Bar */}
          <div style={{ padding: '8px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', fontSize: '12px' }}>
            <span style={{ fontWeight: 600, color: '#475569' }}>Active Shift Cashiers:</span>
            {cashiers.map(c => (
              <span
                key={c.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '3px 10px',
                  borderRadius: '16px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #cbd5e1',
                  color: '#1e293b',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                }}
              >
                <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#22c55e' }} />
                <strong>{c.name}</strong>
                <span style={{ color: '#64748b' }}>({c.counter.split(' ')[0]})</span>
                <span style={{ color: '#047857', fontWeight: 600 }}>Float: Rs.{c.openingFloat}</span>
              </span>
            ))}
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>ID</th>
                  <th style={{ padding: '12px 16px' }}>REG. NO.</th>
                  <th style={{ padding: '12px 16px' }}>PATIENT NAME</th>
                  <th style={{ padding: '12px 16px' }}>REFERRED BY</th>
                  <th style={{ padding: '12px 16px' }}>DATE</th>
                  <th style={{ padding: '12px 16px' }}>TIME</th>
                  <th style={{ padding: '12px 16px' }}>DCN</th>
                  <th style={{ padding: '12px 16px' }}>CC</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>AMOUNT</th>
                  <th style={{ padding: '12px 16px' }}>METHOD</th>
                  <th style={{ padding: '12px 16px' }}>RECEIVED BY</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#2563eb' }}>{tx.id}</td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace' }}>{tx.regNo}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{tx.patientName}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{tx.referredBy}</td>
                    <td style={{ padding: '12px 16px' }}>{tx.date}</td>
                    <td style={{ padding: '12px 16px' }}>{tx.time}</td>
                    <td style={{ padding: '12px 16px' }}>{tx.dcn}</td>
                    <td style={{ padding: '12px 16px' }}>{tx.cc}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#1e293b' }}>
                      Rs.{tx.amount}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e' }}>
                        {tx.method}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{tx.receivedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer Total Income */}
          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#475569' }}>Total income:</span>
            <span style={{ fontSize: '16px', fontWeight: 800, color: '#1e293b' }}>Rs. {totalIncome}</span>
          </div>
        </Card>
      )}

      {/* TAB 2: BILLS */}
      {activeTab === 'bills' && (
        <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search in page"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>REG. NO.</th>
                  <th style={{ padding: '12px 16px' }}>DATE</th>
                  <th style={{ padding: '12px 16px' }}>PATIENT</th>
                  <th style={{ padding: '12px 16px' }}>REFERRED BY</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>TOTAL</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>PAID</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>DISCOUNT</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((b) => (
                  <tr key={b.regNo} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>{b.regNo}</td>
                    <td style={{ padding: '12px 16px' }}>{b.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{b.patient}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{b.referredBy}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700 }}>Rs.{b.total}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#16a34a', fontWeight: 600 }}>Rs.{b.paid}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', color: '#64748b' }}>Rs.{b.discount}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: '#dcfce7', color: '#15803d', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>
                        {b.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                      <Button variant="secondary" size="sm" onClick={() => showToast(`Printing bill ${b.regNo}`)}>
                        Print
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: EXPENSES */}
      {activeTab === 'expenses' && (
        <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
              <input
                type="text"
                placeholder="Search in page"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '13px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={15} />}
                onClick={() => {
                  setNewExpSpentOn(getCurrentLocalDateTime());
                  setIsAddExpenseModalOpen(true);
                }}
              >
                Add new
              </Button>
              <button
                onClick={() => setIsHowExpensesWorkOpen(true)}
                style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', fontSize: '13px', cursor: 'pointer' }}
              >
                How expenses work?
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>ADDED ON</th>
                  <th style={{ padding: '12px 16px' }}>SPENT ON</th>
                  <th style={{ padding: '12px 16px' }}>EXPENSE</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>AMOUNT</th>
                  <th style={{ padding: '12px 16px' }}>CATEGORY</th>
                  <th style={{ padding: '12px 16px' }}>MODE</th>
                  <th style={{ padding: '12px 16px' }}>CASHIER</th>
                  <th style={{ padding: '12px 16px' }}>NOTES</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => (
                  <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{exp.addedOn}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{exp.spentOn}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{exp.expense}</td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>
                      Rs.{exp.amount}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ backgroundColor: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 500 }}>
                        {exp.category}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600, backgroundColor: '#fef3c7', color: '#92400e' }}>
                        {exp.mode}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#475569' }}>{exp.cashier}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>{exp.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL 1: ADD NEW EXPENSE */}
      {isAddExpenseModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>Add new expense</h3>
              <button onClick={() => setIsAddExpenseModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateExpense} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>*</span> Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Centrifuge Repair, Paper Roll"
                  value={newExpName}
                  onChange={(e) => setNewExpName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444' }}>*</span> Amount (Rs.)
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newExpAmount || ''}
                    onChange={(e) => setNewExpAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Mode
                  </label>
                  <select
                    value={newExpMode}
                    onChange={(e) => setNewExpMode(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                  >
                    <option value="Cash">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="Card">Card</option>
                  </select>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>
                    <span style={{ color: '#ef4444' }}>*</span> Expense category
                  </label>
                  <span style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}>Manage categories</span>
                </div>
                <select
                  value={newExpCategory}
                  onChange={(e) => setNewExpCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  <option value="Lab Reagents & Consumables">Lab Reagents & Consumables</option>
                  <option value="Staff Salaries & Wages">Staff Salaries & Wages</option>
                  <option value="Rent & Facility Utilities">Rent & Facility Utilities</option>
                  <option value="Sample Delivery & Logistics">Sample Delivery & Logistics</option>
                  <option value="Equipment Maintenance (AMC)">Equipment Maintenance (AMC)</option>
                  <option value="Tea, Refreshments & Office Pantry">Tea, Refreshments & Office Pantry</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>*</span> Spent on
                </label>
                <input
                  type="datetime-local"
                  required
                  value={newExpSpentOn}
                  onChange={(e) => setNewExpSpentOn(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={newExpNotes}
                  onChange={(e) => setNewExpNotes(e.target.value)}
                  placeholder="Optional voucher or bill remarks..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <Button variant="secondary" size="md" onClick={() => setIsAddExpenseModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Create Expense
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: BUSINESS REPORT (PRINT / AUDIT VIEW) */}
      {isBusinessReportModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: '28px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>Daily Business / Business Report</span>
                <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '4px 0 0 0', color: '#1e293b' }}>
                  Business Report: {selectedDate}
                </h2>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Collection centre: <strong>MAIN</strong> • First receipt ID: <strong>{transactions.length > 0 ? transactions[0].id : 'N/A'}</strong> • Last receipt ID: <strong>{transactions.length > 0 ? transactions[transactions.length - 1].id : 'N/A'}</strong>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Button variant="secondary" size="sm" icon={<Printer size={15} />} onClick={() => window.print()}>
                  Print
                </Button>
                <button onClick={() => setIsBusinessReportModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Accounts Report Section */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Accounts report</h3>
            <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '6px', marginBottom: '16px', fontSize: '14px', fontWeight: 600 }}>
              Total Income - Rs.{totalIncome} + Rs.{totalCollectionCharge} (collection charge)
            </div>

            {/* Cashier Table */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>Cashier wise payment summary:</div>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f1f5f9' }}>
                    <th style={{ padding: '8px 12px', textAlign: 'left' }}>CASHIER</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>INCOME</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>REFUND</th>
                    <th style={{ padding: '8px 12px', textAlign: 'right' }}>CASH IN HAND</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Admin Demo</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {totalIncome}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. 0</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>Rs. {cashSplit - totalExpenses}</td>
                  </tr>
                  <tr style={{ backgroundColor: '#f8fafc', fontWeight: 700 }}>
                    <td style={{ padding: '8px 12px' }}>Total:</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. {totalIncome}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>Rs. 0</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a' }}>Rs. {cashSplit - totalExpenses}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Cases report */}
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Cases report</h3>
            <div style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic', marginBottom: '16px' }}>
              No fully cancelled cases or unauthorized discount overrides recorded today.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
              <Button variant="primary" size="md" onClick={() => setIsBusinessReportModalOpen(false)}>
                Close Report
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: MONTHLY OVERVIEW (BETA) */}
      {isMonthlyOverviewModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '20px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                Monthly Business Overview (BETA) - October 2026
              </h2>
              <button onClick={() => setIsMonthlyOverviewModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>Day</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>UPI (Rs.)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Cash (Rs.)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Card (Rs.)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Insurance (Rs.)</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>Total (Rs.)</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { day: selectedDate, upi: upiSplit, cash: cashSplit, card: cardSplit, ins: insuranceSplit, total: totalIncome },
                ].map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.day}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>{row.upi}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>{row.cash}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>{row.card}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>{row.ins}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>{row.total}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: '#f8fafc', fontWeight: 800 }}>
                  <td style={{ padding: '8px 12px' }}>Total</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{upiSplit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{cashSplit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{cardSplit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>{insuranceSplit}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right', color: '#16a34a' }}>{totalIncome}</td>
                </tr>
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="primary" size="md" onClick={() => setIsMonthlyOverviewModalOpen(false)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}


      {/* MODAL 5: HOW COLLECTION CHARGES WORK */}
      {isCollectionChargeInfoOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1e293b' }}>How collection charges work?</h3>
              <button onClick={() => setIsCollectionChargeInfoOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Collection charges represent doorstep home visit fees or phlebotomy handling charges levied on patient bills. These charges are added to gross collections when balancing the cashier drawer, ensuring sample pickup commissions are audited separately from diagnostic investigation revenue.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="primary" size="sm" onClick={() => setIsCollectionChargeInfoOpen(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 6: HOW EXPENSES WORK */}
      {isHowExpensesWorkOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#1e293b' }}>How expenses work?</h3>
              <button onClick={() => setIsHowExpensesWorkOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={18} />
              </button>
            </div>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6 }}>
              Expenses entered here directly deduct from your daily cash drawer if logged with 'Cash' mode. They provide transparency on operational outflows such as reagent procurement, emergency repairs, and daily courier fees before shift handover.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="primary" size="sm" onClick={() => setIsHowExpensesWorkOpen(false)}>
                Understood
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 7: ADD CASHIER SETUP */}
      {isAddCashierModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)', padding: '16px' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', width: '100%', maxWidth: '540px', padding: '24px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <UserPlus size={20} color="#2563eb" />
                  Add Cashier & Drawer Setup
                </h3>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0 0' }}>
                  Configure shift operator, counter station, and initial cash float balance.
                </p>
              </div>
              <button
                onClick={() => setIsAddCashierModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveCashier} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>*</span> Cashier / Operator Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar or Sunita Rao"
                  value={cashierName}
                  onChange={(e) => setCashierName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Mobile Number / Login
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={cashierMobile}
                    onChange={(e) => setCashierMobile(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    <span style={{ color: '#ef4444' }}>*</span> Shift Opening Float (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={cashierOpeningFloat}
                    onChange={(e) => setCashierOpeningFloat(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Counter Station / Desk
                </label>
                <select
                  value={cashierCounter}
                  onChange={(e) => setCashierCounter(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                >
                  <option value="Counter 1 (Main Reception)">Counter 1 (Main Reception & Patient Intake)</option>
                  <option value="Counter 2 (Billing & Cash Desk)">Counter 2 (Billing & Cash Collection Desk)</option>
                  <option value="Counter 3 (Sample Collection & Phlebotomy)">Counter 3 (Sample Collection & Phlebotomy)</option>
                  <option value="Counter 4 (Emergency & Night Duty Desk)">Counter 4 (Emergency & Night Duty Desk)</option>
                  <option value="Counter 5 (Radiology & Imaging Reception)">Counter 5 (Radiology & Imaging Reception)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Cashier Role & Authority
                  </label>
                  <select
                    value={cashierRole}
                    onChange={(e) => setCashierRole(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    <option value="Receptionist & Cashier">Receptionist & Cashier (Standard)</option>
                    <option value="Billing Operator & Accountant">Billing Operator & Accountant</option>
                    <option value="Head Cashier & Shift Supervisor">Head Cashier & Shift Supervisor</option>
                    <option value="Phlebotomist & Counter Cashier">Phlebotomist & Counter Cashier</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Shift Timings
                  </label>
                  <select
                    value={cashierShift}
                    onChange={(e) => setCashierShift(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
                  >
                    <option value="Morning Shift (08:00 AM - 02:00 PM)">Morning Shift (08:00 AM - 02:00 PM)</option>
                    <option value="Evening Shift (02:00 PM - 09:00 PM)">Evening Shift (02:00 PM - 09:00 PM)</option>
                    <option value="General Day Shift (09:00 AM - 06:00 PM)">General Day Shift (09:00 AM - 06:00 PM)</option>
                    <option value="Night Emergency Shift (09:00 PM - 08:00 AM)">Night Emergency Shift (09:00 PM - 08:00 AM)</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Handover Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes for till verification or cash handover..."
                  value={cashierNotes}
                  onChange={(e) => setCashierNotes(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <Button variant="secondary" size="md" type="button" onClick={() => setIsAddCashierModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="md" type="submit">
                  Save Cashier & Start Shift
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Email Daily Business Report Modal */}
      {isEmailModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px',
          zIndex: 1000
        }}>
          <div style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '18px 24px',
              borderBottom: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#0f172a', fontWeight: 700, fontSize: '16px' }}>
                <Mail size={18} color="#0284c7" />
                <span>Dispatch Daily Business Summary</span>
              </div>
              <button
                onClick={() => setIsEmailModalOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSendEmailReport} style={{ padding: '24px' }}>
              <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b', lineHeight: 1.5 }}>
                Email the Day-End Settlement & Financial Closing Digest for <strong>{selectedDate}</strong> directly to laboratory management.
              </p>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Recipient Email Address
                </label>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="director@apexdiagnostics.com"
                  required
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#0f172a'
                  }}
                />
              </div>

              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px 14px',
                fontSize: '12px',
                color: '#475569',
                marginBottom: '20px'
              }}>
                <div><strong>Gross Revenue:</strong> ₹{totalIncome.toLocaleString()}</div>
                <div><strong>Total Expenses:</strong> ₹{totalExpenses.toLocaleString()}</div>
                <div><strong>Net Income:</strong> ₹{netIncome.toLocaleString()}</div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <Button
                  variant="secondary"
                  size="md"
                  type="button"
                  onClick={() => setIsEmailModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type="submit"
                  disabled={isSendingEmail}
                >
                  {isSendingEmail ? 'Dispatching...' : 'Dispatch Email Report'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

