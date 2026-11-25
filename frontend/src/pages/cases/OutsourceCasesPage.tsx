import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { casesApi } from '../../services/api';
import {
  Calendar,
  Building2,
  CheckCircle2,
  Search,
  X,
  Edit3,
  Loader2,
} from 'lucide-react';

export type OutsourceStatus = 'Pending' | 'Collected' | 'Processing' | 'Final' | 'Authorized';

export interface OutsourceCaseItem {
  id: string;
  regNo: string;
  date: string;
  patient: string;
  phone: string;
  investigations: string;
  notes?: string;
  status: string;
}

const formatDDMMYYYY = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const OutsourceCasesPage: React.FC = () => {
  const [startDate, setStartDate] = useState(() => {
    const past = new Date(Date.now() - 30 * 86400000);
    return past.toISOString().slice(0, 10);
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCaseForStatus, setSelectedCaseForStatus] = useState<OutsourceCaseItem | null>(null);
  const [newStatus, setNewStatus] = useState('Collected');
  const [notesInput, setNotesInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cases, setCases] = useState<OutsourceCaseItem[]>([]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchOutsourceCases = async () => {
    setIsLoading(true);
    try {
      const res = await casesApi.listCases({
        modality: 'OUTSOURCE LAB',
        startDate,
        endDate,
        search: searchQuery.trim() || undefined,
        limit: 100,
      });
      if (res.success && Array.isArray(res.data?.cases)) {
        const mapped: OutsourceCaseItem[] = res.data.cases.map((c: any) => ({
          id: c.id,
          regNo: c.billNumber,
          date: `${formatDDMMYYYY(new Date(c.createdAt))} ${new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          patient: `${c.patient?.fullName || 'Patient'} (${c.patient?.age || '-'}${c.patient?.ageUnit?.[0] || 'Y'}/${c.patient?.gender?.[0] || 'M'})`,
          phone: c.patient?.mobile || '',
          investigations: (c.items || []).map((i: any) => i.testName).join(', ') || 'Outsource Investigation',
          notes: c.notes || '',
          status: c.sampleStatus || c.reportStatus || 'Pending',
        }));
        setCases(mapped);
      } else {
        setCases([]);
      }
    } catch (err: any) {
      showToast(err?.message || 'Unable to load outsource cases.');
      setCases([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOutsourceCases();
  }, [startDate, endDate]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCaseForStatus) return;
    try {
      await casesApi.updateSampleStatus(selectedCaseForStatus.id, newStatus);
      if (notesInput.trim()) {
        await casesApi.updateCase(selectedCaseForStatus.id, { notes: notesInput.trim() });
      }
      showToast(`Updated status for ${selectedCaseForStatus.regNo} to ${newStatus}`);
      setSelectedCaseForStatus(null);
      await fetchOutsourceCases();
    } catch (err: any) {
      showToast(err?.message || 'Failed to update outsource status');
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', position: 'relative' }}>
      {toastMessage && (
        <div style={{ position: 'fixed', top: '80px', right: '24px', backgroundColor: '#0f172a', color: '#ffffff', padding: '12px 20px', borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)', zIndex: 9999, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 500 }}>
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Outsource cases</h1>
        <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Building2 size={14} />
          <span>Create outsource cases from <strong>+ New bill</strong> under <strong>OUTSOURCE LAB</strong></span>
        </div>
      </div>

      <Card style={{ padding: '16px 20px', marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <Calendar size={15} color="#64748b" />
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="input-control" style={{ height: '36px', width: '150px' }} />
            <span style={{ color: '#64748b', fontSize: '13px' }}>to</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="input-control" style={{ height: '36px', width: '150px' }} />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ position: 'relative', width: '280px' }}>
              <Search size={15} color="#94a3b8" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search reg no., patient, investigation..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchOutsourceCases()}
                className="input-control"
                style={{ paddingLeft: '32px', height: '36px' }}
              />
            </div>
            <Button variant="primary" size="sm" onClick={fetchOutsourceCases}>Search</Button>
          </div>
        </div>
      </Card>

      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px' }}>Reg no.</th>
                <th style={{ padding: '12px 16px' }}>Date</th>
                <th style={{ padding: '12px 16px' }}>Patient</th>
                <th style={{ padding: '12px 16px' }}>Investigations</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}><Loader2 size={18} style={{ animation: 'spin 1s linear infinite', display: 'inline' }} /> Loading outsource cases...</td></tr>
              ) : cases.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No outsource cases found in this date range.</td></tr>
              ) : (
                cases.map((c) => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#0284c7' }}>{c.regNo}</td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>{c.date}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 500, color: '#1e293b' }}>{c.patient}</td>
                    <td style={{ padding: '12px 16px', color: '#334155' }}>{c.investigations}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, backgroundColor: '#eff6ff', color: '#1d4ed8' }}>{c.status}</span>
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedCaseForStatus(c);
                          setNewStatus(c.status);
                          setNotesInput(c.notes || '');
                        }}
                        style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                      >
                        <Edit3 size={13} />
                        <span>Update</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {selectedCaseForStatus && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '420px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Update Outsource Status — {selectedCaseForStatus.regNo}</h3>
              <button onClick={() => setSelectedCaseForStatus(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleUpdateStatus} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <select className="select-control" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                <option value="Pending">Pending</option>
                <option value="Collected">Collected / Dispatched</option>
                <option value="Processing">Processing at Reference Lab</option>
                <option value="Completed">Result Received</option>
              </select>
              <textarea rows={3} className="input-control" style={{ height: 'auto', padding: '8px 10px' }} value={notesInput} onChange={(e) => setNotesInput(e.target.value)} placeholder="Partner lab / courier tracking notes..." />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <Button variant="secondary" size="sm" onClick={() => setSelectedCaseForStatus(null)}>Cancel</Button>
                <Button variant="primary" size="sm" type="submit">Save</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
