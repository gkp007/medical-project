import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Activity,
  Play,
  RefreshCw,
  Plus,
  Radio,
  Settings,
  CheckCircle2,
  Clock,
  ArrowRight,
  Terminal,
  Database,
  Search,
  Eye,
  Sliders,
  AlertTriangle,
} from 'lucide-react';
import { analyzerApi } from '../../services/api';

interface AnalyzerMachine {
  id: string;
  name: string;
  model: string;
  department: string;
  protocol: string;
  connectionType: string;
  hostIp: string;
  port: number;
  isBidirectional: boolean;
  status: string;
  lastPacketAt: string | null;
  totalPacketsProcessed: number;
  _count?: {
    mappings: number;
    transmissions: number;
  };
}

interface TransmissionLog {
  id: string;
  analyzerName: string;
  protocol: string;
  sampleBarcode: string;
  matchedCaseId: string | null;
  rawPayload: string;
  parsedResults: string;
  status: string;
  createdAt: string;
}

export const AnalyzersPage: React.FC = () => {
  const [analyzers, setAnalyzers] = useState<AnalyzerMachine[]>([]);
  const [transmissions, setTransmissions] = useState<TransmissionLog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Simulation Modal State
  const [isSimulateOpen, setIsSimulateOpen] = useState<boolean>(false);
  const [selectedMachineId, setSelectedMachineId] = useState<string>('');
  const [simBarcode, setSimBarcode] = useState<string>('BL-2026-0015');
  const [simScenario, setSimScenario] = useState<'NORMAL' | 'ABNORMAL'>('NORMAL');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<any>(null);

  // Payload Inspector Modal
  const [selectedPayload, setSelectedPayload] = useState<TransmissionLog | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      const [analyzersRes, transRes] = await Promise.all([
        analyzerApi.listAnalyzers(),
        analyzerApi.getTransmissions(40),
      ]);

      if (analyzersRes.success && analyzersRes.data) {
        setAnalyzers(analyzersRes.data);
        if (analyzersRes.data.length > 0 && !selectedMachineId) {
          setSelectedMachineId(analyzersRes.data[0].id);
        }
      }

      if (transRes.success && transRes.data) {
        setTransmissions(transRes.data);
      }
    } catch (err: any) {
      console.error('Failed to load analyzers:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleRunSimulation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachineId || !simBarcode) return;

    setIsSimulating(true);
    setSimResult(null);

    try {
      const res = await analyzerApi.simulateRun(selectedMachineId, simBarcode.trim(), simScenario);
      if (res.success && res.data) {
        setSimResult(res.data);
        showToast(
          `Machine run processed! Matched with ${res.data.billNumber || simBarcode} (${res.data.status})`
        );
        loadData();
      } else {
        showToast(res.message || 'Simulation processed');
      }
    } catch (err: any) {
      showToast(err.message || 'Simulation error');
    } finally {
      setIsSimulating(false);
    }
  };

  const filteredTransmissions = transmissions.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.analyzerName.toLowerCase().includes(q) ||
      t.sampleBarcode.toLowerCase().includes(q) ||
      t.status.toLowerCase().includes(q) ||
      t.protocol.toLowerCase().includes(q)
    );
  });

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '60px' }}>
      {/* Toast */}
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
          <CheckCircle2 size={16} color="#4ade80" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '24px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Automated LIS Analyzer Interfacing
            </h1>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                color: '#166534',
                backgroundColor: '#dcfce7',
                padding: '2px 8px',
                borderRadius: '9999px',
                border: '1px solid #bbf7d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <Radio size={12} className="animate-pulse" />
              TCP & Serial Listeners Active
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
            Bi-directional machine communication, ASTM E1381/E1394 and HL7 v2.x packet parsing, automated worklist barcode matching, and NABL ISO 15189 traceability.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              setSimResult(null);
              setIsSimulateOpen(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              backgroundColor: '#2563eb',
            }}
          >
            <Play size={14} />
            <span>Run Machine Simulator</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '16px',
          marginBottom: '24px',
        }}
      >
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Cpu size={22} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              {analyzers.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Configured Analyzers</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#f0fdf4',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Radio size={22} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              Port 5100, 5101
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Active TCP Sockets</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#faf5ff',
              color: '#9333ea',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Activity size={22} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>
              {transmissions.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>Packets Ingested Today</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '8px',
              backgroundColor: '#fffbeb',
              color: '#d97706',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Database size={22} />
          </div>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>100%</div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>NABL ISO 15189 Audit Ready</div>
          </div>
        </div>
      </div>

      {/* Machine Cards */}
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#1e293b', marginBottom: '14px' }}>
        Connected Laboratory Equipment
      </h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '18px',
          marginBottom: '32px',
        }}
      >
        {analyzers.map((mach) => (
          <div
            key={mach.id}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              position: 'relative',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '14px',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {mach.name}
                  </h3>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                  Model: {mach.model} • Dept: {mach.department}
                </div>
              </div>

              <span
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  padding: '3px 8px',
                  borderRadius: '9999px',
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  border: '1px solid #bbf7d0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: '#16a34a',
                  }}
                />
                {mach.status}
              </span>
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '12px',
                color: '#334155',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px',
                marginBottom: '16px',
              }}
            >
              <div>
                <span style={{ color: '#64748b' }}>Protocol: </span>
                <strong style={{ color: '#0284c7' }}>{mach.protocol}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Port / Host: </span>
                <strong>{mach.port} ({mach.hostIp})</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Direction: </span>
                <strong>{mach.isBidirectional ? 'Bi-directional (Host Query)' : 'Unidirectional'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b' }}>Processed: </span>
                <strong>{mach.totalPacketsProcessed} runs</strong>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={12} />
                <span>Last active: {mach.lastPacketAt ? new Date(mach.lastPacketAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Online now'}</span>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setSelectedMachineId(mach.id);
                    setSimResult(null);
                    setIsSimulateOpen(true);
                  }}
                  style={{ padding: '6px 12px', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  <Play size={12} />
                  <span>Test Run</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Raw Traffic & Ingested Transmissions Stream */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '16px 20px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Terminal size={18} color="#0f172a" />
            <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 700, color: '#0f172a' }}>
              Real-Time Machine Traffic & Observation Ingestion Stream
            </h3>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ position: 'relative' }}>
              <Search
                size={14}
                style={{
                  position: 'absolute',
                  left: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#94a3b8',
                }}
              />
              <input
                type="text"
                placeholder="Search barcode, machine, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  padding: '6px 10px 6px 30px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  width: '240px',
                }}
              />
            </div>
          </div>
        </div>

        {filteredTransmissions.length === 0 ? (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: '#64748b' }}>
            <Activity size={36} color="#cbd5e1" style={{ margin: '0 auto 12px auto' }} />
            <p style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>No analyzer packets found.</p>
            <p style={{ margin: '4px 0 16px 0', fontSize: '12px', color: '#94a3b8' }}>
              Click "Run Machine Simulator" to execute an automated CBC or Biochemistry test run.
            </p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                  <th style={{ padding: '12px 16px' }}>TIME</th>
                  <th style={{ padding: '12px 16px' }}>ANALYZER</th>
                  <th style={{ padding: '12px 16px' }}>PROTOCOL</th>
                  <th style={{ padding: '12px 16px' }}>SPECIMEN BARCODE</th>
                  <th style={{ padding: '12px 16px' }}>STATUS</th>
                  <th style={{ padding: '12px 16px' }}>OBSERVATION RESULTS</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransmissions.map((t) => {
                  let resultsArr: any[] = [];
                  try {
                    resultsArr = JSON.parse(t.parsedResults || '[]');
                  } catch (_) {}

                  return (
                    <tr
                      key={t.id}
                      style={{
                        borderBottom: '1px solid #f1f5f9',
                        transition: 'background-color 0.1s',
                      }}
                    >
                      <td style={{ padding: '12px 16px', color: '#64748b', fontSize: '12px', whiteSpace: 'nowrap' }}>
                        {new Date(t.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                          {new Date(t.createdAt).toLocaleDateString()}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                        {t.analyzerName}
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            backgroundColor: t.protocol.includes('ASTM') ? '#eff6ff' : '#fdf2f8',
                            color: t.protocol.includes('ASTM') ? '#1e40af' : '#9d174d',
                          }}
                        >
                          {t.protocol}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            color: '#0f172a',
                            backgroundColor: '#f1f5f9',
                            padding: '3px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          {t.sampleBarcode}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '9999px',
                            backgroundColor: t.status === 'MATCHED' ? '#dcfce7' : '#fef3c7',
                            color: t.status === 'MATCHED' ? '#15803d' : '#b45309',
                          }}
                        >
                          {t.status === 'MATCHED' ? '✓ Auto-Matched' : 'Orphan Specimen'}
                        </span>
                      </td>

                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', maxWidth: '420px' }}>
                          {resultsArr.slice(0, 5).map((r, idx) => (
                            <span
                              key={idx}
                              style={{
                                fontSize: '11px',
                                padding: '1px 6px',
                                borderRadius: '4px',
                                backgroundColor: r.flag === 'H' ? '#fee2e2' : r.flag === 'L' ? '#fef9c3' : '#f8fafc',
                                color: r.flag === 'H' ? '#b91c1c' : r.flag === 'L' ? '#854d0e' : '#334155',
                                border: '1px solid #e2e8f0',
                              }}
                            >
                              <strong>{r.code}</strong>: {r.value} {r.flag && r.flag !== 'N' ? `(${r.flag})` : ''}
                            </span>
                          ))}
                          {resultsArr.length > 5 && (
                            <span style={{ fontSize: '11px', color: '#64748b', alignSelf: 'center' }}>
                              +{resultsArr.length - 5} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                        <button
                          type="button"
                          onClick={() => setSelectedPayload(t)}
                          style={{
                            backgroundColor: '#f1f5f9',
                            border: '1px solid #cbd5e1',
                            borderRadius: '6px',
                            padding: '4px 8px',
                            fontSize: '12px',
                            color: '#334155',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <Eye size={12} />
                          <span>Inspect</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: MACHINE SIMULATOR */}
      {isSimulateOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '540px',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}
            >
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 4px 0', color: '#1e293b' }}>
                  Laboratory Machine Run Simulator
                </h3>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  Emulate automated specimen barcode scanning and parameter transmission over ASTM or HL7 socket protocol.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsSimulateOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  color: '#94a3b8',
                  cursor: 'pointer',
                }}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleRunSimulation}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Target Diagnostic Machine
                </label>
                <select
                  value={selectedMachineId}
                  onChange={(e) => setSelectedMachineId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                  }}
                >
                  {analyzers.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.protocol} - Port {a.port})
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Specimen Vacutainer Barcode / Bill Number
                </label>
                <input
                  type="text"
                  required
                  value={simBarcode}
                  onChange={(e) => setSimBarcode(e.target.value)}
                  placeholder="e.g. BL-2026-0015 or BL-2026-0015-T1 or L1"
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    fontFamily: 'monospace',
                  }}
                />
                <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
                  Tip: Use an existing patient bill (like <strong>BL-2026-0015</strong>) to auto-populate results directly to the bench.
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                  Diagnostic Profile Scenario
                </label>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <label
                    style={{
                      flex: 1,
                      border: `1.5px solid ${simScenario === 'NORMAL' ? '#2563eb' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      backgroundColor: simScenario === 'NORMAL' ? '#eff6ff' : '#ffffff',
                    }}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      checked={simScenario === 'NORMAL'}
                      onChange={() => setSimScenario('NORMAL')}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>Normal Health Screen</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>All values within biological interval</div>
                  </label>

                  <label
                    style={{
                      flex: 1,
                      border: `1.5px solid ${simScenario === 'ABNORMAL' ? '#dc2626' : '#e2e8f0'}`,
                      borderRadius: '8px',
                      padding: '10px 14px',
                      cursor: 'pointer',
                      backgroundColor: simScenario === 'ABNORMAL' ? '#fef2f2' : '#ffffff',
                    }}
                  >
                    <input
                      type="radio"
                      name="scenario"
                      checked={simScenario === 'ABNORMAL'}
                      onChange={() => setSimScenario('ABNORMAL')}
                      style={{ display: 'none' }}
                    />
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#b91c1c' }}>Abnormal / Critical Flags</div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>High WBC, Low Platelets / Anemia flags</div>
                  </label>
                </div>
              </div>

              {simResult && (
                <div
                  style={{
                    backgroundColor: simResult.status === 'MATCHED' ? '#f0fdf4' : '#fffbeb',
                    border: `1px solid ${simResult.status === 'MATCHED' ? '#bbf7d0' : '#fde68a'}`,
                    borderRadius: '8px',
                    padding: '12px 14px',
                    marginBottom: '16px',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ fontWeight: 700, color: simResult.status === 'MATCHED' ? '#166534' : '#b45309', marginBottom: '4px' }}>
                    {simResult.status === 'MATCHED' ? '✓ Transmission Matched with Patient Record' : '⚠ Ingested as Orphan Sample'}
                  </div>
                  {simResult.billNumber && (
                    <div style={{ color: '#334155' }}>
                      Patient: <strong>{simResult.patientName}</strong> (Bill: {simResult.billNumber}) • Populated <strong>{simResult.parametersCount}</strong> observation parameters.
                    </div>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsSimulateOpen(false)}
                  style={{ fontSize: '13px' }}
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSimulating}
                  className="btn btn-primary"
                  style={{
                    fontSize: '13px',
                    backgroundColor: '#16a34a',
                    borderColor: '#16a34a',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Play size={14} />
                  <span>{isSimulating ? 'Processing Transmission...' : 'Execute Machine Run'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: RAW PACKET INSPECTOR */}
      {selectedPayload && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(2px)',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              width: '100%',
              maxWidth: '720px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                  Packet Inspector: {selectedPayload.analyzerName}
                </h3>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Protocol: {selectedPayload.protocol} • Barcode: {selectedPayload.sampleBarcode}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayload(null)}
                style={{ background: 'none', border: 'none', fontSize: '18px', color: '#94a3b8', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '20px', overflowY: 'auto' }}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Parsed Observation Parameters:
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
                  {(() => {
                    try {
                      const res = JSON.parse(selectedPayload.parsedResults || '[]');
                      return res.map((r: any, idx: number) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: '#f8fafc',
                            border: '1px solid #e2e8f0',
                            borderRadius: '6px',
                            padding: '8px 10px',
                            fontSize: '12px',
                          }}
                        >
                          <div style={{ fontWeight: 600, color: '#0f172a' }}>{r.parameterName || r.code}</div>
                          <div style={{ color: '#2563eb', fontWeight: 700, fontSize: '13px' }}>
                            {r.value} <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 400 }}>{r.unit}</span>
                          </div>
                          {r.referenceRange && (
                            <div style={{ fontSize: '10px', color: '#94a3b8' }}>Ref: {r.referenceRange}</div>
                          )}
                        </div>
                      ));
                    } catch (_) {
                      return <div>Failed to parse results</div>;
                    }
                  })()}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '6px' }}>
                  Raw Diagnostic Frame Stream (ASTM/HL7 MLLP):
                </label>
                <pre
                  style={{
                    backgroundColor: '#0f172a',
                    color: '#38bdf8',
                    padding: '14px',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontFamily: 'monospace',
                    lineHeight: 1.5,
                    overflowX: 'auto',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all',
                    maxHeight: '260px',
                  }}
                >
                  {selectedPayload.rawPayload
                    .replace(/\x02/g, '<STX>')
                    .replace(/\x03/g, '<ETX>')
                    .replace(/\x04/g, '<EOT>')
                    .replace(/\x05/g, '<ENQ>')
                    .replace(/\x06/g, '<ACK>')
                    .replace(/\x0B/g, '<VT>')
                    .replace(/\x1C/g, '<FS>')
                    .replace(/\x0D/g, '<CR>\n')}
                </pre>
              </div>
            </div>

            <div style={{ padding: '12px 20px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', backgroundColor: '#f8fafc' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setSelectedPayload(null)}
                style={{ fontSize: '13px' }}
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

