import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Calendar,
  Filter,
  CheckCircle2,
  Clock,
  User,
  AlertTriangle
} from 'lucide-react';

interface ActivityRecord {
  id: string;
  time: string;
  owner: string;
  activityType: 'Patient name change' | 'Referrer name change' | 'Case referrer change' | 'Investigations changed';
  summary: string;
  caseRef: string;
}

export const ActivitiesPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [selectedActivityFilter, setSelectedActivityFilter] = useState<string>('All Activities');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [activitiesList, setActivitiesList] = useState<ActivityRecord[]>([
    {
      id: '1',
      time: '12:15 PM',
      owner: 'Admin Demo (Cashier)',
      activityType: 'Patient name change',
      summary: "Changed Patient first name from 'Rahul' to 'Rahul Kumar' on Case #261019-001.",
      caseRef: '261019-001'
    },
    {
      id: '2',
      time: '11:40 AM',
      owner: 'Admin Demo (Lab Tech)',
      activityType: 'Investigations changed',
      summary: "Added test 'Lipid Profile' to Case #261019-001 upon doctor request.",
      caseRef: '261019-001'
    },
    {
      id: '3',
      time: '10:30 AM',
      owner: 'Admin Demo (Cashier)',
      activityType: 'Case referrer change',
      summary: "Updated referrer from 'Self' to 'Dr. Anil Verma, MBBS MD' on Case #261019-001.",
      caseRef: '261019-001'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredActivities = activitiesList.filter(act => {
    if (selectedActivityFilter === 'All Activities') return true;
    return act.activityType === selectedActivityFilter;
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

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Activities</h1>
        <span style={{ backgroundColor: '#f3e8ff', color: '#7e22ce', fontSize: '12px', fontWeight: 600, padding: '2px 8px', borderRadius: '4px', border: '1px solid #d8b4fe' }}>
          Advanced plan feature
        </span>
      </div>

      {/* How does this work? Info Card */}
      <Card style={{ padding: '20px', marginBottom: '20px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
          <ShieldCheck size={24} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b', margin: '0 0 6px 0' }}>How does this work?</h3>
            <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: '0 0 12px 0' }}>
              Activities sensitive to business are monitored and logged. Summary of the activity, activity owner and timestamp of activity is logged in plain text and cannot be changed in future. Only listed activities are monitored.
            </p>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>
              Activities monitored:
            </div>
            <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <li>Patient first name and last name change.</li>
              <li>Referrer first name and last name change.</li>
              <li>Referrer change on case.</li>
              <li>Investigations changed on case.</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Date Switcher & Filter Controls */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            onClick={() => {
              const d = new Date(selectedDate);
              d.setDate(d.getDate() - 1);
              setSelectedDate(d.toISOString().split('T')[0]);
            }}
            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            <ChevronLeft size={16} color="#475569" />
          </button>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Calendar size={15} style={{ position: 'absolute', left: '10px', color: '#64748b' }} />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              style={{
                padding: '6px 12px 6px 34px',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '14px',
                fontWeight: 600,
                color: '#334155',
                backgroundColor: '#ffffff',
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
            style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #cbd5e1', borderRadius: '6px', backgroundColor: '#ffffff', cursor: 'pointer' }}
          >
            <ChevronRight size={16} color="#475569" />
          </button>
        </div>

        {/* Activity Filter Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <select
            value={selectedActivityFilter}
            onChange={(e) => setSelectedActivityFilter(e.target.value)}
            style={{
              padding: '7px 14px',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              color: '#334155',
              backgroundColor: '#ffffff',
              cursor: 'pointer'
            }}
          >
            <option value="All Activities">All Activities</option>
            <option value="Patient name change">Patient name change</option>
            <option value="Referrer name change">Referrer name change</option>
            <option value="Case referrer change">Case referrer change</option>
            <option value="Investigations changed">Investigations changed</option>
          </select>
        </div>
      </div>

      {/* Activities Table Ledger */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '120px' }}>TIME</th>
                <th style={{ padding: '12px 16px', width: '180px' }}>USER / ACTOR</th>
                <th style={{ padding: '12px 16px', width: '180px' }}>ACTIVITY TYPE</th>
                <th style={{ padding: '12px 16px' }}>SUMMARY OF ACTIVITY</th>
                <th style={{ padding: '12px 16px', width: '140px' }}>CASE REG NO.</th>
              </tr>
            </thead>
            <tbody>
              {filteredActivities.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '32px', textAlign: 'center', color: '#94a3b8' }}>
                    No monitored activities logged on {selectedDate}.
                  </td>
                </tr>
              ) : (
                filteredActivities.map((act) => (
                  <tr key={act.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', color: '#64748b', fontWeight: 500 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Clock size={13} color="#94a3b8" />
                        <span>{act.time}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <User size={13} color="#64748b" />
                        <span>{act.owner}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span
                        style={{
                          backgroundColor:
                            act.activityType === 'Patient name change' ? '#fef3c7' :
                            act.activityType === 'Investigations changed' ? '#e0f2fe' : '#f1f5f9',
                          color:
                            act.activityType === 'Patient name change' ? '#92400e' :
                            act.activityType === 'Investigations changed' ? '#0369a1' : '#475569',
                          padding: '3px 8px',
                          borderRadius: '4px',
                          fontSize: '11px',
                          fontWeight: 600
                        }}
                      >
                        {act.activityType}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#334155', lineHeight: 1.5 }}>
                      {act.summary}
                    </td>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: '#2563eb', fontWeight: 600 }}>
                      {act.caseRef}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
