import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  Download,
  Calendar,
  AlertCircle,
  FileSpreadsheet,
  CheckCircle2,
  Clock,
  History,
  FileText
} from 'lucide-react';
import { businessApi } from '../../services/api';

interface ExportHistoryItem {
  id: string;
  fileName: string;
  entity: string;
  exportType: string;
  dateRange: string;
  createdAt: string;
  fileSize: string;
}

const mapEntityToType = (ent: string): string => {
  const lower = ent.toLowerCase();
  if (lower.includes('patient')) return 'patients';
  if (lower.includes('expense')) return 'expenses';
  if (lower.includes('transaction')) return 'transactions';
  if (lower.includes('result') || lower.includes('tat') || lower.includes('pdf')) return 'results';
  if (lower.includes('ratelist') || lower.includes('test')) return 'tests';
  if (lower.includes('referrer') || lower.includes('doctor')) return 'doctors';
  return 'cases';
};

export const DataExportPage: React.FC = () => {
  const [entity, setEntity] = useState<string>('Select');
  const [fromDate, setFromDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [toDate, setToDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [historyList, setHistoryList] = useState<ExportHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('labsmart_export_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('labsmart_export_history', JSON.stringify(historyList));
    } catch {}
  }, [historyList]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDownload = async (item: ExportHistoryItem) => {
    try {
      showToast(`Downloading ${item.fileName}...`);
      const exportType = item.exportType || mapEntityToType(item.entity);
      const [from, to] = item.dateRange.split(' to ');
      await businessApi.downloadExport(exportType, from, to, item.fileName);
      showToast(`Downloaded ${item.fileName} successfully!`);
    } catch (err: any) {
      console.error('Download failed', err);
      showToast(`Error downloading file: ${err.message || 'Server error'}`);
    }
  };

  const handleRunExport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (entity === 'Select') {
      showToast('Please select an entity to export.');
      return;
    }

    setIsExporting(true);
    const exportType = mapEntityToType(entity);
    const cleanEntity = entity.replace(/[^a-zA-Z0-9]/g, '_');
    const fileName = `${cleanEntity}_${fromDate}_to_${toDate}.csv`;

    try {
      showToast(`Generating and downloading ${fileName}...`);
      await businessApi.downloadExport(exportType, fromDate, toDate, fileName);

      const item: ExportHistoryItem = {
        id: String(Date.now()),
        fileName,
        entity,
        exportType,
        dateRange: `${fromDate} to ${toDate}`,
        createdAt: new Date().toLocaleString(),
        fileSize: 'Live Stream'
      };

      setHistoryList(prev => [item, ...prev]);
      showToast(`Export ${fileName} downloaded successfully!`);
    } catch (err: any) {
      console.error('Export generation failed', err);
      showToast(`Export failed: ${err.message || 'Server error'}`);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', position: 'relative' }}>
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
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Data export</h1>
        <span style={{ backgroundColor: '#f1f5f9', color: '#475569', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', border: '1px solid #cbd5e1' }}>
          Premium feature
        </span>
      </div>

      {/* Advisory Banner */}
      <div style={{ padding: '12px 16px', backgroundColor: '#eff6ff', borderRadius: '6px', border: '1px solid #bfdbfe', color: '#1e40af', fontSize: '13px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <AlertCircle size={16} />
        <span>Please utilize the available files from Data export history before exporting more data.</span>
      </div>

      {/* Section 1: Data export history */}
      <Card style={{ padding: '20px', marginBottom: '24px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>Data export history</h3>

        {historyList.length === 0 ? (
          <div style={{ padding: '32px 16px', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px dashed #cbd5e1' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#475569', marginBottom: '2px' }}>No data export history</div>
            <div style={{ fontSize: '12px', color: '#94a3b8' }}>New files will appear here</div>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f1f5f9', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '8px 12px' }}>FILE NAME</th>
                <th style={{ padding: '8px 12px' }}>ENTITY</th>
                <th style={{ padding: '8px 12px' }}>RANGE</th>
                <th style={{ padding: '8px 12px' }}>GENERATED</th>
                <th style={{ padding: '8px 12px' }}>SIZE</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {historyList.map(item => (
                <tr key={item.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '8px 12px', fontWeight: 600, color: '#2563eb' }}>{item.fileName}</td>
                  <td style={{ padding: '8px 12px' }}>{item.entity}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{item.dateRange}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{item.createdAt}</td>
                  <td style={{ padding: '8px 12px', color: '#64748b' }}>{item.fileSize}</td>
                  <td style={{ padding: '8px 12px', textAlign: 'right' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={<Download size={13} />}
                      onClick={() => handleDownload(item)}
                    >
                      Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {/* Section 2: Export Form */}
      <Card style={{ padding: '24px', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <form onSubmit={handleRunExport} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
              Entity
            </label>
            <select
              value={entity}
              onChange={(e) => setEntity(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: '#ffffff',
                color: entity === 'Select' ? '#94a3b8' : '#1e293b'
              }}
            >
              <option value="Select">Select</option>
              <option value="Bill (Case)">Bill (Case)</option>
              <option value="Patient">Patient</option>
              <option value="Transaction">Transaction</option>
              <option value="Lab report TAT">Lab report TAT</option>
              <option value="Expense">Expense</option>
              <option value="Lab report PDF links">Lab report PDF links</option>
              <option value="Lab Ratelist">Lab Ratelist</option>
              <option value="Referrer">Referrer</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                From <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                required
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                To <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="date"
                required
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
              />
            </div>
          </div>

          {/* Max Duration Limits Guidance Card */}
          <div style={{ padding: '14px 16px', backgroundColor: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '13px' }}>
            <div style={{ fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Max Duration limits:</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '4px', color: '#64748b' }}>
              <div>• For Bill (Case): 31 days.</div>
              <div>• For Patient: 365 days.</div>
              <div>• For Transaction: 31 days.</div>
              <div>• For Lab report TAT: 31 days.</div>
              <div>• For Expense: 365 days.</div>
              <div>• For Lab report PDF links: 31 days.</div>
            </div>
          </div>

          {/* Submit Button */}
          <div style={{ marginTop: '8px' }}>
            <Button
              variant="primary"
              size="md"
              type="submit"
              disabled={isExporting}
            >
              {isExporting ? 'Generating...' : 'Run export'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};
