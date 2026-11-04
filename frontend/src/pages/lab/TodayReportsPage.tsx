import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Printer,
  CheckCircle2,
  MoreVertical,
  Plus,
  FileText,
  Phone,
  BarChart2,
  Barcode,
} from 'lucide-react';
import { pathologyApi } from '../../services/api';

export interface TodayReportItem {
  id: string;
  regNo: string;
  dailyCode: string;
  dateTime: string;
  patientName: string;
  ageGender: string;
  phone: string;
  referredBy: string;
  referredDegree: string;
  tests: string[];
  collectionCentre: string;
  status: 'New' | 'In progress' | 'Final' | 'Signed off';
  isPrinted: boolean;
  barcode: string;
}

interface TodayReportsPageProps {
  onNavigateEnterResults?: () => void;
  onNavigateViewReport?: () => void;
  onNavigateNewBill?: () => void;
  onNavigateSearchReports?: () => void;
  onNavigateTestCounts?: () => void;
}

export const TodayReportsPage: React.FC<TodayReportsPageProps> = ({
  onNavigateEnterResults,
  onNavigateViewReport,
  onNavigateNewBill,
  onNavigateSearchReports,
  onNavigateTestCounts,
}) => {
  const [currentDate, setCurrentDate] = useState(() => new Date().toLocaleDateString());
  const [sortBy, setSortBy] = useState<'Oldest first' | 'Recent first'>('Oldest first');
  const [activeStatusTab, setActiveStatusTab] = useState<'All' | 'New' | 'In progress' | 'Final' | 'Signed off'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const [reports, setReports] = useState<TodayReportItem[]>([]);

  // Load live pathology worklist from backend API
  useEffect(() => {
    const fetchWorklist = async () => {
      try {
        const res = await pathologyApi.getWorklist();
        if (res.success && res.data?.cases) {
          const mapped: TodayReportItem[] = res.data.cases.map((c: any) => {
            const rawDate = c.registeredAt || c.createdAt || Date.now();
            return {
              id: c.id,
              regNo: c.billNumber,
              dailyCode: c.dailyCode || 'L1',
              dateTime: new Date(rawDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
              patientName: c.patient?.fullName || 'Walk-in Patient',
              ageGender: c.patient?.age ? `${c.patient.age}/${(c.patient?.gender || 'M').charAt(0)}` : `${c.patient?.ageYears || 30} YRS/${(c.patient?.gender || 'M').charAt(0)}`,
              phone: c.patient?.mobile || 'N/A',
              referredBy: typeof c.doctor === 'object' ? c.doctor?.name : c.doctor || 'Self Referral',
              referredDegree: typeof c.doctor === 'object' ? c.doctor?.degree || '' : '',
              tests: Array.isArray(c.tests) ? c.tests : (c.items || []).map((i: any) => i.testName),
              collectionCentre: 'Main Branch',
              status: c.reportStatus === 'Signed Off' ? 'Signed off' : c.reportStatus === 'Finalized' ? 'Final' : c.reportStatus === 'In Progress' ? 'In progress' : 'New',
              isPrinted: c.isPrinted || false,
              barcode: `${c.billNumber}-${c.dailyCode || 'EDTA'}`,
            };
          });
          setReports(mapped);
        } else {
          setReports([]);
        }
      } catch (err) {
        console.error('Failed to load pathology worklist:', err);
      }
    };

    fetchWorklist();
  }, []);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [barcodeModalItem, setBarcodeModalItem] = useState<TodayReportItem | null>(null);
  const [cancelModalItem, setCancelModalItem] = useState<TodayReportItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStepDay = (direction: 'prev' | 'next') => {
    showToast(`Navigated to ${direction === 'prev' ? 'previous' : 'next'} day.`);
  };

  const handleConfirmCancel = () => {
    if (!cancelModalItem) return;
    setReports((prev) => prev.filter((r) => r.id !== cancelModalItem.id));
    showToast(`Cancelled lab report #${cancelModalItem.regNo} (${cancelModalItem.patientName})`);
    setCancelModalItem(null);
  };

  const handleTogglePrint = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, isPrinted: !r.isPrinted } : r))
    );
    showToast('Updated report printed status');
  };

  // Filter and Sort Logic
  const filteredReports = reports.filter((r) => {
    const matchesTab = activeStatusTab === 'All' || r.status === activeStatusTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      r.patientName.toLowerCase().includes(q) ||
      r.regNo.includes(q) ||
      r.dailyCode.toLowerCase().includes(q) ||
      r.referredBy.toLowerCase().includes(q) ||
      r.tests.some((t) => t.toLowerCase().includes(q));
    return matchesTab && matchesSearch;
  });

  const sortedReports = [...filteredReports].sort((a, b) => {
    if (sortBy === 'Oldest first') {
      return Number(a.regNo) - Number(b.regNo);
    }
    return Number(b.regNo) - Number(a.regNo);
  });

  const counts = {
    all: reports.length,
    new: reports.filter((r) => r.status === 'New').length,
    inProgress: reports.filter((r) => r.status === 'In progress').length,
    final: reports.filter((r) => r.status === 'Final').length,
    signedOff: reports.filter((r) => r.status === 'Signed off').length,
    printed: reports.filter((r) => r.isPrinted).length,
  };

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

      {/* Top Header Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>Reports for today</h1>
          <a
            href="#recent-changes"
            onClick={(e) => {
              e.preventDefault();
              showToast('Opening Recent Changes changelog preview...');
            }}
            style={{ fontSize: '13px', color: '#0284c7', textDecoration: 'none', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            Recent changes <ExternalLink size={12} />
          </a>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onNavigateTestCounts}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <BarChart2 size={15} color="#0284c7" />
            <span>Stats / Workload</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={onNavigateNewBill}
            style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} />
            <span>Add new case</span>
          </button>
        </div>
      </div>

      {/* Control Bar: Search + Date Navigator + Sort by */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          marginBottom: '16px',
        }}
      >
        {/* Search in page */}
        <div style={{ position: 'relative', width: '280px' }}>
          <Search size={16} style={{ position: 'absolute', left: '10px', top: '9px', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search in page..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-control"
            style={{ paddingLeft: '32px', height: '34px', fontSize: '13px' }}
          />
        </div>

        {/* Date Navigator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => handleStepDay('prev')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Previous Day"
          >
            <ChevronLeft size={16} />
          </button>
          <div
            style={{
              padding: '6px 16px',
              borderRadius: '6px',
              backgroundColor: '#f1f5f9',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
            }}
          >
            {currentDate}
          </div>
          <button
            type="button"
            onClick={() => handleStepDay('next')}
            style={{
              padding: '6px 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
            title="Next Day"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Sort by dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Sort by:</span>
          <select
            className="select-control"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            style={{ width: '130px', height: '34px', fontSize: '13px' }}
          >
            <option value="Oldest first">Oldest first</option>
            <option value="Recent first">Recent first</option>
          </select>
        </div>
      </div>

      {/* Segmented Status Pill Tabs + Print Tracker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '16px',
        }}
      >
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {[
            { id: 'All', label: `All ${counts.all}` },
            { id: 'New', label: `New ${counts.new}` },
            { id: 'In progress', label: `In progress ${counts.inProgress}` },
            { id: 'Final', label: `Final ${counts.final}` },
            { id: 'Signed off', label: `Signed off ${counts.signedOff}` },
          ].map((tab) => {
            const isActive = activeStatusTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveStatusTab(tab.id as any)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: isActive ? '1px solid #0284c7' : '1px solid #cbd5e1',
                  backgroundColor: isActive ? '#0284c7' : '#ffffff',
                  color: isActive ? '#ffffff' : '#475569',
                  transition: 'all 0.15s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Print Progress Pill */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12px',
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: '16px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            color: '#475569',
          }}
        >
          <Printer size={13} color="#0284c7" />
          <span>
            {counts.printed}/{counts.all} Printed
          </span>
        </div>
      </div>

      {/* Reports Table or Empty State */}
      {sortedReports.length === 0 ? (
        <Card style={{ padding: '60px 20px', textAlign: 'center' }}>
          <FileText size={42} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1e293b', marginBottom: '6px' }}>
            No reports to show.
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
            Get started by adding a new lab case for today.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
            <button type="button" className="btn btn-primary" onClick={onNavigateNewBill}>
              Add new case
            </button>
            <button type="button" className="btn btn-secondary" onClick={onNavigateSearchReports}>
              Search old reports
            </button>
          </div>
        </Card>
      ) : (
        <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <table className="data-table">
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ width: '110px' }}>REG. NO.</th>
                <th style={{ width: '130px' }}>DATE/TIME</th>
                <th>PATIENT</th>
                <th>REFERRED BY</th>
                <th>TESTS</th>
                <th style={{ width: '90px' }}>CC</th>
                <th style={{ width: '110px', textAlign: 'center' }}>STATUS</th>
                <th style={{ width: '170px', textAlign: 'center' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {sortedReports.map((r) => {
                const isSigned = r.status === 'Signed off';
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Reg No & DCN */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '13px' }}>
                          #{r.regNo}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                          }}
                        >
                          {r.dailyCode}
                        </span>
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {r.dateTime}
                    </td>

                    {/* Patient Name, Age/Sex, Phone icon */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                          {r.patientName}
                        </div>
                        <a
                          href={`tel:${r.phone}`}
                          title={`Call ${r.phone}`}
                          style={{ color: '#0284c7', display: 'flex', alignItems: 'center' }}
                        >
                          <Phone size={12} />
                        </a>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {r.ageGender}
                      </div>
                    </td>

                    {/* Referred By */}
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                        {r.referredBy}
                      </div>
                      {r.referredDegree && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {r.referredDegree}
                        </div>
                      )}
                    </td>

                    {/* Tests */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {r.tests.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '12px',
                              backgroundColor: '#f1f5f9',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              color: '#334155',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Collection Centre */}
                    <td style={{ fontSize: '12px', color: '#475569' }}>
                      {r.collectionCentre}
                    </td>

                    {/* Status Badge */}
                    <td style={{ textAlign: 'center' }}>
                      <Badge
                        variant={
                          r.status === 'Signed off'
                            ? 'success'
                            : r.status === 'In progress'
                            ? 'info'
                            : r.status === 'Final'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {r.status}
                      </Badge>
                      {r.isPrinted && (
                        <div style={{ fontSize: '10px', color: '#16a34a', marginTop: '3px', fontWeight: 600 }}>
                          ✓ Printed
                        </div>
                      )}
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {isSigned ? (
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem('labsmart_active_case_id', r.id);
                              localStorage.setItem('labsmart_active_bill_number', r.regNo);
                              if (onNavigateViewReport) onNavigateViewReport();
                            }}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                          >
                            View
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              localStorage.setItem('labsmart_active_case_id', r.id);
                              localStorage.setItem('labsmart_active_bill_number', r.regNo);
                              if (onNavigateEnterResults) onNavigateEnterResults();
                            }}
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                          >
                            Enter results
                          </button>
                        )}

                        {/* 3-Dot Meatball Menu */}
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                            title="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === r.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '4px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                zIndex: 50,
                                minWidth: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '4px 0',
                                textAlign: 'left',
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#334155',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onNavigateEnterResults?.();
                                }}
                              >
                                Edit / Results
                              </button>
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#334155',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setBarcodeModalItem(r);
                                }}
                              >
                                Print Barcode
                              </button>
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#334155',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  handleTogglePrint(r.id);
                                }}
                              >
                                {r.isPrinted ? 'Mark unprinted' : 'Mark printed'}
                              </button>
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#dc2626',
                                  borderTop: '1px solid #f1f5f9',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  setCancelModalItem(r);
                                }}
                              >
                                Cancel Case
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Barcode Print Modal */}
      {barcodeModalItem && (
        <Modal
          isOpen={!!barcodeModalItem}
          onClose={() => setBarcodeModalItem(null)}
          title={`Barcode Label: ${barcodeModalItem.barcode}`}
          size="sm"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setBarcodeModalItem(null)}>
                Close
              </Button>
              <Button
                variant="primary"
                icon={<Printer size={16} />}
                onClick={() => {
                  showToast(`Printed thermal barcode sticker for ${barcodeModalItem.barcode}`);
                  setBarcodeModalItem(null);
                }}
              >
                Print Sticker
              </Button>
            </div>
          }
        >
          <div style={{ textAlign: 'center', padding: '16px' }}>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '28px',
                letterSpacing: '4px',
                fontWeight: 'bold',
                padding: '12px',
                border: '2px dashed #cbd5e1',
                borderRadius: '8px',
                display: 'inline-block',
                marginBottom: '12px',
              }}
            >
              ||| | || |||| | |||
            </div>
            <div style={{ fontWeight: 700, fontSize: '15px' }}>{barcodeModalItem.barcode}</div>
            <div style={{ fontSize: '13px', color: '#64748b' }}>
              {barcodeModalItem.patientName} • {barcodeModalItem.ageGender}
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
              Reg: #{barcodeModalItem.regNo} ({barcodeModalItem.dailyCode}) • {barcodeModalItem.collectionCentre}
            </div>
          </div>
        </Modal>
      )}

      {/* Cancel Case Modal */}
      {cancelModalItem && (
        <ConfirmationModal
          isOpen={!!cancelModalItem}
          onClose={() => setCancelModalItem(null)}
          onConfirm={handleConfirmCancel}
          title="Cancel Lab Case?"
          message={`Are you sure you want to cancel report #${cancelModalItem.regNo} for "${cancelModalItem.patientName}"? This case will be removed from today's active worklist.`}
          confirmLabel="Cancel Case"
          cancelLabel="Keep Active"
          variant="danger"
        />
      )}
    </div>
  );
};
