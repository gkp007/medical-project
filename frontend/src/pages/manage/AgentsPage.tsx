import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { mastersApi } from '../../services/api';
import {
  HelpCircle,
  Plus,
  Archive,
  RotateCcw,
  CheckCircle2,
  Phone,
  MapPin,
  X,
  Edit2
} from 'lucide-react';

interface AgentItem {
  id: string;
  agentId: string;
  name: string;
  phone: string;
  area: string;
  registeredOn: string;
  isArchived: boolean;
}

export const AgentsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'archived'>('active');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<AgentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formArea, setFormArea] = useState('');

  const [agents, setAgents] = useState<AgentItem[]>([]);

  useEffect(() => {
    const fetchLiveAgents = async () => {
      try {
        const res = await mastersApi.listAgents();
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped: AgentItem[] = res.data.map((ag: any, idx: number) => ({
            id: ag.id,
            agentId: ag.code || `AG-0${idx + 1}`,
            name: ag.name,
            phone: ag.phone || 'N/A',
            area: ag.area || 'City Area',
            registeredOn: ag.createdAt ? new Date(ag.createdAt).toLocaleDateString() : 'Active',
            isArchived: !ag.isActive
          }));
          setAgents(mapped);
        }
      } catch (err) {
        console.error('Failed to load agents:', err);
      }
    };
    fetchLiveAgents();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingAgent) {
      setAgents(prev =>
        prev.map(a =>
          a.id === editingAgent.id
            ? { ...a, name: formName, phone: formPhone, area: formArea }
            : a
        )
      );
      showToast(`Updated agent ${formName}`);
      setEditingAgent(null);
    } else {
      const newAg: AgentItem = {
        id: String(Date.now()),
        agentId: `AG-0${agents.length + 1}`,
        name: formName,
        phone: formPhone,
        area: formArea || 'City Area',
        registeredOn: '19/10/2026',
        isArchived: false
      };
      setAgents([newAg, ...agents]);
      showToast(`Added sample collection agent ${newAg.name}`);
      setIsAddModalOpen(false);
    }
  };

  const handleToggleArchive = (id: string, archive: boolean) => {
    setAgents(prev =>
      prev.map(a => (a.id === id ? { ...a, isArchived: archive } : a))
    );
    showToast(archive ? 'Agent moved to archive.' : 'Agent restored to active list.');
  };

  const activeAgents = agents.filter(a => !a.isArchived);
  const archivedAgents = agents.filter(a => a.isArchived);
  const displayedAgents = activeTab === 'active' ? activeAgents : archivedAgents;

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
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Sample collection agents</h1>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => {
            setEditingAgent(null);
            setFormName('');
            setFormPhone('');
            setFormArea('');
            setIsAddModalOpen(true);
          }}
        >
          + Add Agent
        </Button>
      </div>

      {/* How does this work? Info Card */}
      <Card style={{ padding: '16px 20px', marginBottom: '20px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 8px 0' }}>How does this work?</h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>You can add and edit agents from new case page.</li>
          <li>Agent name will be displayed on cases page and daily business page.</li>
          <li>You can filter cases by agent name on cases page.</li>
        </ul>
      </Card>

      {/* Active / Archived Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('active')}
          style={{
            padding: '7px 16px',
            borderRadius: '6px',
            border: activeTab === 'active' ? '1px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: activeTab === 'active' ? '#eff6ff' : '#ffffff',
            color: activeTab === 'active' ? '#1d4ed8' : '#475569',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Active {activeAgents.length}
        </button>

        <button
          onClick={() => setActiveTab('archived')}
          style={{
            padding: '7px 16px',
            borderRadius: '6px',
            border: activeTab === 'archived' ? '1px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: activeTab === 'archived' ? '#eff6ff' : '#ffffff',
            color: activeTab === 'archived' ? '#1d4ed8' : '#475569',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Archived {archivedAgents.length}
        </button>
      </div>

      {/* Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '130px' }}>AGENT ID</th>
                <th style={{ padding: '12px 16px' }}>NAME</th>
                <th style={{ padding: '12px 16px', width: '180px' }}>REGISTERED ON</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '140px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {displayedAgents.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    No {activeTab} sample collection agents found.
                  </td>
                </tr>
              ) : (
                displayedAgents.map(ag => (
                  <tr key={ag.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>
                      {ag.agentId}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#1e293b' }}>{ag.name}</div>
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
                        <span>{ag.phone}</span>
                        <span>•</span>
                        <span>{ag.area}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {ag.registeredOn}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <button
                          onClick={() => {
                            setEditingAgent(ag);
                            setFormName(ag.name);
                            setFormPhone(ag.phone);
                            setFormArea(ag.area);
                          }}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                        >
                          Edit
                        </button>
                        {ag.isArchived ? (
                          <button
                            onClick={() => handleToggleArchive(ag.id, false)}
                            style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                          >
                            Restore
                          </button>
                        ) : (
                          <button
                            onClick={() => handleToggleArchive(ag.id, true)}
                            style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: ADD / EDIT AGENT */}
      {(editingAgent || isAddModalOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '440px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                {editingAgent ? `Edit ${editingAgent.name}` : 'New Collection Agent'}
              </h3>
              <button
                onClick={() => { setEditingAgent(null); setIsAddModalOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAgent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Agent Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Phlebotomist"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="text"
                  placeholder="10-digit mobile number..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Operating Zone / Catchment Area</label>
                <input
                  type="text"
                  placeholder="e.g. South Delhi / Central Zone"
                  value={formArea}
                  onChange={(e) => setFormArea(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                <Button variant="secondary" size="sm" onClick={() => { setEditingAgent(null); setIsAddModalOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Agent
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
