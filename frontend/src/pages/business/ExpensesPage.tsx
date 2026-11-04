import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { businessApi } from '../../services/api';
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Download,
  FolderCog,
  HelpCircle,
  X,
  CheckCircle2,
  Trash2,
  Edit2,
  BarChart3,
  Calendar,
  Layers,
  ArrowUpDown
} from 'lucide-react';

interface ExpenseRecord {
  id: string;
  name: string;
  amount: number;
  spentOn: string;
  category: string;
  mode: 'Cash' | 'UPI' | 'Card';
  addedBy: string;
  addedOn: string;
  notes: string;
}

// Helper to format current local date-time for datetime-local inputs
const getCurrentLocalDateTime = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const ExpensesPage: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'expenses' | 'analysis'>('expenses');
  const [selectedMonth, setSelectedMonth] = useState<string>(() => new Date().toLocaleString('en-US', { month: 'long' }));
  const [selectedYear, setSelectedYear] = useState<string>(() => String(new Date().getFullYear()));
  const [searchQuery, setSearchQuery] = useState('');
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All categories');
  
  // Modals
  const [isAddExpenseModalOpen, setIsAddExpenseModalOpen] = useState(false);
  const [isManageCategoriesOpen, setIsManageCategoriesOpen] = useState(false);
  const [isHowExpensesWorkOpen, setIsHowExpensesWorkOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New Category State
  const [categories, setCategories] = useState<string[]>([
    'Lab Reagents & Consumables',
    'Staff Salaries & Wages',
    'Rent & Utilities',
    'Courier & Logistics',
    'Bio-waste Disposal'
  ]);
  const [newCatName, setNewCatName] = useState('');
  const [isAddCatModalOpen, setIsAddCatModalOpen] = useState(false);

  // Expense Form State
  const [name, setName] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [mode, setMode] = useState<'Cash' | 'UPI' | 'Card'>('Cash');
  const [category, setCategory] = useState('Lab Reagents & Consumables');
  const [spentOn, setSpentOn] = useState(getCurrentLocalDateTime());
  const [notes, setNotes] = useState('');

  // Live Expenses Data
  const [expensesList, setExpensesList] = useState<ExpenseRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const res = await businessApi.listExpenses();
      if (res.status === 'success' && res.data?.expenses) {
        const mapped: ExpenseRecord[] = res.data.expenses.map((e: any) => ({
          id: e.id,
          name: e.name || e.description || e.category,
          amount: Number(e.amount || 0),
          spentOn: e.date ? new Date(e.date).toLocaleString() : 'Recent',
          category: e.category,
          mode: (e.paymentMode === 'UPI' || e.paymentMode === 'Card') ? e.paymentMode : 'Cash',
          addedBy: e.cashierName || 'Staff',
          addedOn: e.createdAt ? new Date(e.createdAt).toLocaleString() : 'Recent',
          notes: e.description || ''
        }));
        setExpensesList(mapped);
      }
    } catch (err) {
      console.error('Failed to load expenses', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExpenses();
  }, []);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = ['2022', '2023', '2024', '2025', '2026', '2027'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || amount <= 0) return;

    try {
      await businessApi.createExpense({
        name,
        category,
        amount: Number(amount),
        paymentMode: mode,
        notes,
        date: spentOn
      });

      showToast(`Expense "${name}" added successfully.`);
      setIsAddExpenseModalOpen(false);
      setName('');
      setAmount(0);
      setNotes('');
      await loadExpenses();
    } catch (err: any) {
      showToast(err.message || 'Failed to create expense');
    }
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    setCategories([...categories, newCatName.trim()]);
    setNewCatName('');
    setIsAddCatModalOpen(false);
    showToast('Category created.');
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      await businessApi.deleteExpense(id);
      showToast('Expense removed successfully.');
      await loadExpenses();
    } catch (err: any) {
      showToast(err.message || 'Failed to remove expense');
    }
  };

  // Calculations for Analysis
  const totalExpense = expensesList.reduce((acc, curr) => acc + curr.amount, 0);
  const cashSplit = expensesList.filter(e => e.mode === 'Cash').reduce((a, b) => a + b.amount, 0);
  const cardSplit = expensesList.filter(e => e.mode === 'Card').reduce((a, b) => a + b.amount, 0);
  const upiSplit = expensesList.filter(e => e.mode === 'UPI').reduce((a, b) => a + b.amount, 0);

  const filteredExpenses = expensesList.filter(e => {
    const matchesSearch = e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          e.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'All categories' || e.category === selectedCategoryFilter;
    return matchesSearch && matchesCategory;
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

      {/* Header with Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Expenses</h1>
          <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
            Premium feature
          </span>
          <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '4px' }}>
            BETA
          </span>
        </div>

        {/* Right Action Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => showToast('Exporting expense records to Excel/CSV...')}
            style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <Download size={14} />
            Export
          </button>
          <button
            onClick={() => setIsManageCategoriesOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <FolderCog size={14} />
            Manage categories
          </button>
          <button
            onClick={() => setIsHowExpensesWorkOpen(true)}
            style={{ background: 'none', border: 'none', padding: 0, color: '#2563eb', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 500 }}
          >
            <HelpCircle size={14} />
            How expenses work?
          </button>
        </div>
      </div>

      {/* Sub-header Feedback Note */}
      <div style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
        Have feedback to improve expenses? <span style={{ color: '#2563eb', cursor: 'pointer', textDecoration: 'underline' }} onClick={() => showToast('Feedback form dialog opened.')}>Please share it here.</span>
      </div>

      {/* Month & Year Navigator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => {
            const currentIdx = months.indexOf(selectedMonth);
            if (currentIdx > 0) setSelectedMonth(months[currentIdx - 1]);
            else setSelectedMonth(months[11]);
          }}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer' }}
        >
          <ChevronLeft size={16} color="#475569" />
        </button>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: '#1e293b', backgroundColor: '#ffffff', cursor: 'pointer' }}
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>

        <button
          onClick={() => {
            const currentIdx = months.indexOf(selectedMonth);
            if (currentIdx < 11) setSelectedMonth(months[currentIdx + 1]);
            else setSelectedMonth(months[0]);
          }}
          style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer' }}
        >
          <ChevronRight size={16} color="#475569" />
        </button>

        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', fontWeight: 600, color: '#1e293b', backgroundColor: '#ffffff', cursor: 'pointer' }}
        >
          {years.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* Subtabs: Expenses / Analysis */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #cbd5e1', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveSubTab('expenses')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeSubTab === 'expenses' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeSubTab === 'expenses' ? '#2563eb' : '#64748b'
          }}
        >
          Expenses
        </button>
        <button
          onClick={() => setActiveSubTab('analysis')}
          style={{
            padding: '10px 18px',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            border: 'none',
            background: 'none',
            borderBottom: activeSubTab === 'analysis' ? '2px solid #2563eb' : '2px solid transparent',
            color: activeSubTab === 'analysis' ? '#2563eb' : '#64748b'
          }}
        >
          Analysis
        </button>
      </div>

      {/* SUBTAB 1: EXPENSES TABLE VIEW */}
      {activeSubTab === 'expenses' && (
        <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
          {/* Action Header: Add new, Search, Filters button */}
          <div style={{ padding: '16px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={15} />}
                onClick={() => {
                  setSpentOn(getCurrentLocalDateTime());
                  setIsAddExpenseModalOpen(true);
                }}
              >
                Add new
              </Button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ position: 'relative', width: '260px' }}>
                <Search size={15} style={{ position: 'absolute', left: '10px', top: '10px', color: '#94a3b8' }} />
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', padding: '7px 12px 7px 32px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', outline: 'none' }}
                />
              </div>

              <button
                onClick={() => setIsFiltersOpen(!isFiltersOpen)}
                style={{
                  padding: '7px 14px',
                  borderRadius: '6px',
                  border: isFiltersOpen ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: isFiltersOpen ? '#eff6ff' : '#ffffff',
                  color: isFiltersOpen ? '#1d4ed8' : '#475569',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Filter size={14} />
                Filters
              </button>
            </div>
          </div>

          {/* Inline Filter Collapse */}
          {isFiltersOpen && (
            <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#475569' }}>Category:</span>
              <select
                value={selectedCategoryFilter}
                onChange={(e) => setSelectedCategoryFilter(e.target.value)}
                style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
              >
                <option value="All categories">All categories</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button
                onClick={() => setSelectedCategoryFilter('All categories')}
                style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer' }}
              >
                Clear
              </button>
            </div>
          )}

          {/* Data Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>SPENT ON</span>
                      <ArrowUpDown size={12} color="#94a3b8" />
                    </div>
                  </th>
                  <th style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>NAME</span>
                      <ArrowUpDown size={12} color="#94a3b8" />
                    </div>
                  </th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                      <span>AMOUNT</span>
                      <ArrowUpDown size={12} color="#94a3b8" />
                    </div>
                  </th>
                  <th style={{ padding: '12px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span>CATEGORY</span>
                      <ArrowUpDown size={12} color="#94a3b8" />
                    </div>
                  </th>
                  <th style={{ padding: '12px 16px' }}>MODE</th>
                  <th style={{ padding: '12px 16px' }}>ADDED BY</th>
                  <th style={{ padding: '12px 16px' }}>ADDED ON</th>
                  <th style={{ padding: '12px 16px' }}>NOTES</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                      No expense records found for {selectedMonth} {selectedYear}.
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((exp) => (
                    <tr key={exp.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{exp.spentOn}</td>
                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{exp.name}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#ef4444' }}>Rs.{exp.amount}</td>
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
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{exp.addedBy}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{exp.addedOn}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b', fontStyle: 'italic' }}>{exp.notes}</td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button
                          onClick={() => handleDeleteExpense(exp.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                          title="Delete expense"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Pagination Note */}
          <div style={{ padding: '12px 16px', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', fontSize: '12px', color: '#64748b' }}>
            Records in page: {filteredExpenses.length} / {expensesList.length}
          </div>
        </Card>
      )}

      {/* SUBTAB 2: EXPENSES ANALYSIS */}
      {activeSubTab === 'analysis' && (
        <Card style={{ padding: '24px', border: '1px solid #e2e8f0' }}>
          <div style={{ marginBottom: '24px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>
              Total Expense
            </span>
            <div style={{ fontSize: '28px', fontWeight: 800, color: '#ef4444', marginTop: '4px' }}>
              Rs.{totalExpense}
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px', marginBottom: '24px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Total expense split</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', flexWrap: 'wrap' }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Cash</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Rs.{cashSplit}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>Card</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Rs.{cardSplit}</div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b' }}>UPI</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#1e293b' }}>Rs.{upiSplit}</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', marginBottom: '12px' }}>Category wise split:</div>
            {expensesList.length === 0 ? (
              <div style={{ fontSize: '13px', color: '#94a3b8' }}>No data</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '600px' }}>
                {categories.map(cat => {
                  const catSum = expensesList.filter(e => e.category === cat).reduce((a, b) => a + b.amount, 0);
                  if (catSum === 0) return null;
                  const pct = totalExpense > 0 ? Math.round((catSum / totalExpense) * 100) : 0;
                  return (
                    <div key={cat}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, color: '#334155' }}>{cat}</span>
                        <span style={{ fontWeight: 700, color: '#1e293b' }}>Rs.{catSum} ({pct}%)</span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${pct}%`, height: '100%', backgroundColor: '#ef4444' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </Card>
      )}

      {/* MODAL: ADD NEW EXPENSE */}
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
                  placeholder="e.g. Courier charges, Chemical reagents"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
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
                    value={amount || ''}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                    Mode
                  </label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value as any)}
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
                  <span
                    onClick={() => { setIsAddExpenseModalOpen(false); setIsManageCategoriesOpen(true); }}
                    style={{ fontSize: '12px', color: '#2563eb', cursor: 'pointer' }}
                  >
                    Manage categories
                  </span>
                </div>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  <span style={{ color: '#ef4444' }}>*</span> Spent on
                </label>
                <input
                  type="datetime-local"
                  required
                  value={spentOn}
                  onChange={(e) => setSpentOn(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Optional notes or supplier details..."
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

      {/* MODAL: MANAGE CATEGORIES */}
      {isManageCategoriesOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '580px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>EXPENSES / MANAGE CATEGORIES</span>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '2px 0 0 0', color: '#1e293b' }}>Manage categories</h3>
              </div>
              <Button
                variant="primary"
                size="sm"
                icon={<Plus size={14} />}
                onClick={() => setIsAddCatModalOpen(true)}
              >
                Add new
              </Button>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                  <th style={{ padding: '8px 12px', textAlign: 'left' }}>NAME</th>
                  <th style={{ padding: '8px 12px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 12px', fontWeight: 500, color: '#1e293b' }}>{cat}</td>
                    <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                      <button
                        onClick={() => showToast(`Edit category: ${cat}`)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="secondary" size="md" onClick={() => setIsManageCategoriesOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: ADD CATEGORY NAME */}
      {isAddCatModalOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 10000, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '400px', padding: '20px' }}>
            <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 12px 0', color: '#1e293b' }}>New Category</h4>
            <form onSubmit={handleAddCategory}>
              <input
                type="text"
                required
                placeholder="Category name"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', marginBottom: '16px' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button variant="secondary" size="sm" onClick={() => setIsAddCatModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: HOW EXPENSES WORK */}
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
              Expenses help you monitor all laboratory operational cash outflows. When recorded in Cash mode, it subtracts from the daily cash in hand, keeping your cashier drawer balanced during day-end shift closures.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <Button variant="primary" size="sm" onClick={() => setIsHowExpensesWorkOpen(false)}>
                Got it
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
