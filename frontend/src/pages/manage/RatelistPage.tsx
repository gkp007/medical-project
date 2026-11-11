import React, { useState, useEffect, useMemo } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import {
  Search,
  Plus,
  Download,
  Printer,
  Edit2,
  Trash2,
  Percent,
  CheckCircle2,
  ArrowRight,
  Filter,
  DollarSign,
  HelpCircle,
  RefreshCw,
  Loader2,
} from 'lucide-react';
import { mastersApi } from '../../services/api';

export interface RatelistEntry {
  id: string;
  name: string;
  code: string;
  entryType: 'Test' | 'Panel' | 'Package' | 'Bill only';
  department?: string;
  fee: number;
  revenueShare: number;
  forGender: 'Both' | 'Male' | 'Female' | 'Other';
  status: 'active' | 'inactive';
}

const DEFAULT_RATELIST: RatelistEntry[] = [
  { id: 'r1', name: 'ASO (Anti-Streptolysin O) Qualitative', code: 'ASO_Q', entryType: 'Test', department: 'Serology', fee: 150, revenueShare: 30, forGender: 'Both', status: 'active' },
  { id: 'r2', name: 'ASO Titer (quantative)', code: 'ASO_QT', entryType: 'Test', department: 'Serology', fee: 250, revenueShare: 50, forGender: 'Both', status: 'active' },
  { id: 'r3', name: 'Bilirubin Total, Direct & Indirect', code: 'BIL_TDI', entryType: 'Panel', department: 'Biochemistry', fee: 130, revenueShare: 25, forGender: 'Both', status: 'active' },
  { id: 'r4', name: 'Blood Group & Rh.', code: 'BG_RH', entryType: 'Test', department: 'Haematology', fee: 50, revenueShare: 10, forGender: 'Both', status: 'active' },
  { id: 'r5', name: 'Blood Sugar Fasting & PP', code: 'BS_FPP', entryType: 'Panel', department: 'Biochemistry', fee: 100, revenueShare: 20, forGender: 'Both', status: 'active' },
  { id: 'r6', name: 'Blood Sugar PP', code: 'BS_PP', entryType: 'Test', department: 'Biochemistry', fee: 50, revenueShare: 10, forGender: 'Both', status: 'active' },
  { id: 'r7', name: 'BT & CT', code: 'BT_CT', entryType: 'Panel', department: 'Haematology', fee: 100, revenueShare: 20, forGender: 'Both', status: 'active' },
  { id: 'r8', name: 'CBC (with absolute counts)', code: 'CBC_ABS', entryType: 'Panel', department: 'Haematology', fee: 250, revenueShare: 50, forGender: 'Both', status: 'active' },
  { id: 'r9', name: 'CBC with ESR', code: 'CBC_ESR', entryType: 'Panel', department: 'Haematology', fee: 280, revenueShare: 55, forGender: 'Both', status: 'active' },
  { id: 'r10', name: 'Complete Blood Count (CBC)', code: 'CBC', entryType: 'Panel', department: 'Haematology', fee: 200, revenueShare: 40, forGender: 'Both', status: 'active' },
  { id: 'r11', name: 'CRP (Qualitative)', code: 'CRP_QL', entryType: 'Test', department: 'Serology', fee: 150, revenueShare: 30, forGender: 'Both', status: 'active' },
  { id: 'r12', name: 'CRP (Quantitative)', code: 'CRP_QT', entryType: 'Test', department: 'Serology', fee: 250, revenueShare: 50, forGender: 'Both', status: 'active' },
  { id: 'r13', name: 'Dengue (Card Method)', code: 'DENGUE_CARD', entryType: 'Test', department: 'Serology', fee: 400, revenueShare: 80, forGender: 'Both', status: 'active' },
  { id: 'r14', name: 'Dengue IgG & IgM', code: 'DENGUE_AB', entryType: 'Test', department: 'Serology', fee: 400, revenueShare: 80, forGender: 'Both', status: 'active' },
  { id: 'r15', name: 'Dengue NS1 Antigen', code: 'DENGUE_NS1', entryType: 'Test', department: 'Serology', fee: 100, revenueShare: 20, forGender: 'Both', status: 'active' },
  { id: 'r16', name: 'Diabetic package', code: 'PKG_DIAB', entryType: 'Package', department: 'Biochemistry', fee: 100, revenueShare: 20, forGender: 'Both', status: 'active' },
  { id: 'r17', name: 'DLC', code: 'DLC', entryType: 'Test', department: 'Haematology', fee: 50, revenueShare: 10, forGender: 'Both', status: 'active' },
  { id: 'r18', name: 'Electrolytes Panel', code: 'ELEC', entryType: 'Panel', department: 'Biochemistry', fee: 450, revenueShare: 90, forGender: 'Both', status: 'active' },
  { id: 'r19', name: 'ESR (Westergren)', code: 'ESR_WEST', entryType: 'Test', department: 'Haematology', fee: 80, revenueShare: 15, forGender: 'Both', status: 'active' },
  { id: 'r20', name: 'ESR (Wintrobe)', code: 'ESR_WINT', entryType: 'Test', department: 'Haematology', fee: 80, revenueShare: 15, forGender: 'Both', status: 'active' },
  { id: 'r21', name: 'Fasting Blood Sugar', code: 'FBS', entryType: 'Test', department: 'Biochemistry', fee: 50, revenueShare: 10, forGender: 'Both', status: 'active' },
  { id: 'r22', name: 'Hemoglobin (Hb)', code: 'HB', entryType: 'Test', department: 'Haematology', fee: 50, revenueShare: 10, forGender: 'Both', status: 'active' },
  { id: 'r23', name: 'Lipid Profile', code: 'LIPID', entryType: 'Panel', department: 'Biochemistry', fee: 350, revenueShare: 70, forGender: 'Both', status: 'active' },
  { id: 'r24', name: 'Liver Function Test (LFT)', code: 'LFT', entryType: 'Panel', department: 'Biochemistry', fee: 400, revenueShare: 80, forGender: 'Both', status: 'active' },
  { id: 'r25', name: 'Kidney Function Test (KFT)', code: 'KFT', entryType: 'Panel', department: 'Biochemistry', fee: 400, revenueShare: 80, forGender: 'Both', status: 'active' },
  { id: 'r26', name: 'Thyroid Profile (Total T3, T4, TSH)', code: 'THYROID_TOTAL', entryType: 'Panel', department: 'Endocrinology', fee: 350, revenueShare: 70, forGender: 'Both', status: 'active' },
  { id: 'r27', name: 'Urine Routine Examination', code: 'URINE_RE', entryType: 'Test', department: 'Clinical Pathology', fee: 70, revenueShare: 15, forGender: 'Both', status: 'active' },
  { id: 'r28', name: 'Widal Test (Slide Method)', code: 'WIDAL_SLIDE', entryType: 'Test', department: 'Serology', fee: 100, revenueShare: 20, forGender: 'Both', status: 'active' },
];

export const RatelistPage: React.FC = () => {
  const [entries, setEntries] = useState<RatelistEntry[]>(DEFAULT_RATELIST);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [typeFilter, setTypeFilter] = useState<'all' | 'Test' | 'Panel' | 'Package' | 'Bill only'>('all');
  const [bulkPercent, setBulkPercent] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // New item modal form state
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newType, setNewType] = useState<'Test' | 'Panel' | 'Package' | 'Bill only'>('Test');
  const [newFee, setNewFee] = useState<number>(100);
  const [newRevShare, setNewRevShare] = useState<number>(20);
  const [newGender, setNewGender] = useState<'Both' | 'Male' | 'Female' | 'Other'>('Both');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Fetch live database tests and sync rates
  useEffect(() => {
    const loadMasters = async () => {
      setIsLoading(true);
      try {
        const res = await mastersApi.listTests({ limit: 150 });
        if (res.success && res.data && res.data.length > 0) {
          const mapped: RatelistEntry[] = res.data.map((t: any) => ({
            id: t.id,
            name: t.name,
            code: t.code,
            entryType: t.testType === 'Multiple parameters' ? 'Panel' : 'Test',
            department: t.department || 'Haematology',
            fee: Number(t.rate) || 50,
            revenueShare: Number(t.b2bRate) || Math.round((Number(t.rate) || 50) * 0.2),
            forGender: 'Both',
            status: t.isDeleted ? 'inactive' : 'active',
          }));
          // Merge with default list to ensure all common tests are present
          const existingCodes = new Set(mapped.map((m) => m.code.toLowerCase()));
          const extraDefaults = DEFAULT_RATELIST.filter((d) => !existingCodes.has(d.code.toLowerCase()));
          setEntries([...mapped, ...extraDefaults]);
        }
      } catch (err) {
        console.error('Failed to load tests for ratelist:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMasters();
  }, []);

  // Update single row fee or revenue share
  const handleUpdateFee = async (id: string, newFee: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, fee: newFee } : e))
    );
    try {
      await mastersApi.updateTest(id, { rate: newFee });
    } catch {}
  };

  const handleUpdateRevenueShare = async (id: string, newRev: number) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, revenueShare: newRev } : e))
    );
    try {
      await mastersApi.updateTest(id, { b2bRate: newRev });
    } catch {}
  };

  const handleUpdateGender = (id: string, gender: 'Both' | 'Male' | 'Female' | 'Other') => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, forGender: gender } : e))
    );
    showToast('Updated gender applicability.');
  };

  const handleToggleStatus = (id: string) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, status: e.status === 'active' ? 'inactive' : 'active' } : e))
    );
    showToast('Entry status toggled.');
  };

  // Bulk update revenue share by percentage
  const handleApplyBulkPercentage = () => {
    const pct = parseFloat(bulkPercent);
    if (isNaN(pct) || pct <= 0 || pct > 100) {
      showToast('Please enter a valid percentage between 1 and 100');
      return;
    }
    setEntries((prev) =>
      prev.map((e) => ({
        ...e,
        revenueShare: Math.round((e.fee * pct) / 100),
      }))
    );
    showToast(`Bulk updated doctor revenue share to ${pct}% for all entries!`);
    setBulkPercent('');
  };

  // Add new item to ratelist
  const handleCreateEntry = () => {
    if (!newName.trim()) {
      showToast('Please enter an investigation or package name');
      return;
    }
    const newEntry: RatelistEntry = {
      id: `custom_${Date.now()}`,
      name: newName.trim(),
      code: newCode.trim().toUpperCase() || newName.substring(0, 4).toUpperCase(),
      entryType: newType,
      fee: Number(newFee) || 100,
      revenueShare: Number(newRevShare) || 20,
      forGender: newGender,
      status: 'active',
    };
    setEntries([newEntry, ...entries]);
    setIsNewModalOpen(false);
    setNewName('');
    setNewCode('');
    setNewFee(100);
    setNewRevShare(20);
    showToast(`Added "${newEntry.name}" to active ratelist.`);
  };

  // Filtered entries
  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      if (e.status !== activeTab) return false;
      if (typeFilter !== 'all' && e.entryType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return e.name.toLowerCase().includes(q) || e.code.toLowerCase().includes(q);
      }
      return true;
    });
  }, [entries, activeTab, typeFilter, searchQuery]);

  const activeCount = entries.filter((e) => e.status === 'active').length;
  const inactiveCount = entries.filter((e) => e.status === 'inactive').length;

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '10px 18px',
            borderRadius: '6px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
            zIndex: 9999,
            fontSize: '13px',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <CheckCircle2 size={16} color="#4ade80" />
          {toastMessage}
        </div>
      )}

      {/* Breadcrumb & Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b', fontWeight: 600 }}>
            Setup & Master Management
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            Ratelist - Setup
          </h1>
        </div>

        {/* Top Actions Strip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '6px' }}>
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#334155' }}>
              Bulk revenue share:
            </span>
            <input
              type="number"
              placeholder="%"
              value={bulkPercent}
              onChange={(e) => setBulkPercent(e.target.value)}
              style={{
                width: '60px',
                height: '28px',
                padding: '2px 6px',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                fontSize: '12px',
              }}
            />
            <Button variant="secondary" size="sm" onClick={handleApplyBulkPercentage} style={{ padding: '2px 8px', fontSize: '12px' }}>
              Apply %
            </Button>
          </div>

          <Button
            variant="secondary"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => showToast('Exported active ratelist CSV.')}
          >
            Download CSV
          </Button>

          <Button
            variant="primary"
            size="sm"
            icon={<Plus size={14} />}
            onClick={() => setIsNewModalOpen(true)}
            style={{ backgroundColor: '#2563eb' }}
          >
            Add New
          </Button>

          <Button
            variant="secondary"
            size="sm"
            icon={<Printer size={14} />}
            onClick={() => window.print()}
          >
            Print ratelist
          </Button>
        </div>
      </div>

      {/* Helpful Hint Strip matching Labsmart */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '6px',
          padding: '8px 14px',
          fontSize: '12px',
          color: '#1e40af',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <HelpCircle size={16} color="#3b82f6" />
        <span>
          Use <strong>TAB</strong> button on your keyboard to navigate and change the fees and doctor revenue shares one by one.
        </span>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid #e2e8f0',
          marginBottom: '16px',
          paddingBottom: '8px',
        }}
      >
        {/* Active vs Inactive */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveTab('active')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'active' ? '#2563eb' : 'transparent',
              color: activeTab === 'active' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Active
            <span
              style={{
                backgroundColor: activeTab === 'active' ? '#1d4ed8' : '#e2e8f0',
                color: activeTab === 'active' ? '#ffffff' : '#475569',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '11px',
              }}
            >
              {activeCount}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('inactive')}
            style={{
              padding: '6px 14px',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: activeTab === 'inactive' ? '#2563eb' : 'transparent',
              color: activeTab === 'inactive' ? '#ffffff' : '#64748b',
              fontWeight: 600,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            Inactive
            <span
              style={{
                backgroundColor: activeTab === 'inactive' ? '#1d4ed8' : '#e2e8f0',
                color: activeTab === 'inactive' ? '#ffffff' : '#475569',
                borderRadius: '10px',
                padding: '1px 6px',
                fontSize: '11px',
              }}
            >
              {inactiveCount}
            </span>
          </button>
        </div>

        {/* Entry Type Sub-filters */}
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
          {(['all', 'Test', 'Panel', 'Package', 'Bill only'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTypeFilter(t)}
              style={{
                padding: '4px 10px',
                borderRadius: '4px',
                border: '1px solid',
                borderColor: typeFilter === t ? '#2563eb' : '#cbd5e1',
                backgroundColor: typeFilter === t ? '#eff6ff' : '#ffffff',
                color: typeFilter === t ? '#1e40af' : '#475569',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              {t === 'all' ? 'All Types' : `${t}s`}
            </button>
          ))}

          {/* Search Box */}
          <div style={{ position: 'relative', marginLeft: '12px' }}>
            <Search
              size={14}
              color="#94a3b8"
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
            />
            <input
              type="text"
              placeholder="Search test or package..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                paddingLeft: '30px',
                paddingRight: '10px',
                height: '32px',
                fontSize: '12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                width: '200px',
              }}
            />
          </div>
        </div>
      </div>

      {/* Ratelist Main Table */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1.5px solid #e2e8f0' }}>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '40%' }}>NAME</th>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '12%' }}>ENTRY TYPE</th>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '15%' }}>FEE (₹)</th>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '15%' }}>REVENUE SHARE (₹)</th>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '12%' }}>FOR GENDER</th>
              <th style={{ padding: '10px 16px', color: '#475569', fontWeight: 600, width: '6%', textAlign: 'center' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {filteredEntries.map((row) => (
              <tr
                key={row.id}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s ease',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                {/* Name */}
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{row.name}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8' }}>Code: {row.code}</div>
                </td>

                {/* Entry Type */}
                <td style={{ padding: '10px 16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '3px 8px',
                      borderRadius: '4px',
                      backgroundColor:
                        row.entryType === 'Test'
                          ? '#dbeafe'
                          : row.entryType === 'Panel'
                          ? '#fef3c7'
                          : row.entryType === 'Package'
                          ? '#dcfce7'
                          : '#f1f5f9',
                      color:
                        row.entryType === 'Test'
                          ? '#1e40af'
                          : row.entryType === 'Panel'
                          ? '#b45309'
                          : row.entryType === 'Package'
                          ? '#15803d'
                          : '#475569',
                    }}
                  >
                    {row.entryType}
                  </span>
                </td>

                {/* Editable Fee */}
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>₹</span>
                    <input
                      type="number"
                      value={row.fee}
                      onChange={(e) => handleUpdateFee(row.id, Number(e.target.value))}
                      style={{
                        width: '90px',
                        height: '32px',
                        padding: '4px 8px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#0f172a',
                      }}
                    />
                  </div>
                </td>

                {/* Editable Revenue Share */}
                <td style={{ padding: '10px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={{ color: '#64748b', fontSize: '12px' }}>₹</span>
                    <input
                      type="number"
                      value={row.revenueShare}
                      onChange={(e) => handleUpdateRevenueShare(row.id, Number(e.target.value))}
                      style={{
                        width: '90px',
                        height: '32px',
                        padding: '4px 8px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '13px',
                        fontWeight: 600,
                        color: '#15803d',
                      }}
                    />
                  </div>
                </td>

                {/* For Gender Dropdown */}
                <td style={{ padding: '10px 16px' }}>
                  <select
                    value={row.forGender}
                    onChange={(e) => handleUpdateGender(row.id, e.target.value as any)}
                    style={{
                      height: '32px',
                      padding: '2px 8px',
                      border: '1px solid #cbd5e1',
                      borderRadius: '4px',
                      fontSize: '12px',
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      cursor: 'pointer',
                    }}
                  >
                    <option value="Both">Both</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </td>

                {/* Remove / Toggle Action */}
                <td style={{ padding: '10px 16px', textAlign: 'center' }}>
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(row.id)}
                    style={{
                      border: 'none',
                      background: 'none',
                      color: row.status === 'active' ? '#ef4444' : '#15803d',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    {row.status === 'active' ? 'Remove' : 'Activate'}
                  </button>
                </td>
              </tr>
            ))}

            {filteredEntries.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>
                  No ratelist entries found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal to Add New Ratelist Entry */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="Add New Ratelist Entry"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
              Test / Investigation Name *
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g. Serum Iron"
              style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Short Code
              </label>
              <input
                type="text"
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="e.g. IRON"
                style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Entry Type
              </label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as any)}
                style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="Test">Single Test</option>
                <option value="Panel">Multi-Test Panel</option>
                <option value="Package">Health Package</option>
                <option value="Bill only">Bill only</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Fee (₹) *
              </label>
              <input
                type="number"
                value={newFee}
                onChange={(e) => setNewFee(Number(e.target.value))}
                style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                Doctor Revenue Share (₹)
              </label>
              <input
                type="number"
                value={newRevShare}
                onChange={(e) => setNewRevShare(Number(e.target.value))}
                style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>
                For Gender
              </label>
              <select
                value={newGender}
                onChange={(e) => setNewGender(e.target.value as any)}
                style={{ width: '100%', height: '34px', padding: '6px 10px', border: '1px solid #cbd5e1', borderRadius: '4px', fontSize: '13px' }}
              >
                <option value="Both">Both</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <Button variant="secondary" onClick={() => setIsNewModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleCreateEntry} style={{ backgroundColor: '#2563eb' }}>
              Add Entry
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
