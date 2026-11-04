import React, { useState, useEffect } from 'react';
import { Info, History, X, Check } from 'lucide-react';

export interface ReferrerData {
  title: string;
  firstName: string;
  lastName: string;
  degree: string;
  mobile: string;
  email: string;
  address: string;
  active: boolean;
}

export interface EditReferrerViewProps {
  initialData: ReferrerData;
  onSave: (data: ReferrerData) => void;
  onCancel: () => void;
  isPageMode?: boolean;
}

export const EditReferrerView: React.FC<EditReferrerViewProps> = ({
  initialData,
  onSave,
  onCancel,
  isPageMode = true,
}) => {
  const [title, setTitle] = useState(initialData.title || 'Dr.');
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [degree, setDegree] = useState(initialData.degree || '');
  const [mobile, setMobile] = useState(initialData.mobile || '');
  const [email, setEmail] = useState(initialData.email || '');
  const [address, setAddress] = useState(initialData.address || '');
  const [active, setActive] = useState(initialData.active ?? true);

  const [showHistoryModal, setShowHistoryModal] = useState(false);

  useEffect(() => {
    setTitle(initialData.title || 'Dr.');
    setFirstName(initialData.firstName || '');
    setLastName(initialData.lastName || '');
    setDegree(initialData.degree || '');
    setMobile(initialData.mobile || '');
    setEmail(initialData.email || '');
    setAddress(initialData.address || '');
    setActive(initialData.active ?? true);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      firstName,
      lastName,
      degree,
      mobile,
      email,
      address,
      active,
    });
  };

  const fullNameDisplay = `${title} ${firstName} ${lastName}`.trim();

  return (
    <div style={{ maxWidth: '980px', margin: '0 auto' }}>
      {/* Breadcrumb matching Screenshot 3 */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', gap: '8px' }}>
          <span>REFERRAL DOCTORS</span>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span>{fullNameDisplay || 'REFERRER'} ({degree || 'GENERAL'})</span>
          <span style={{ color: '#94a3b8' }}>/</span>
          <span style={{ color: '#64748b' }}>EDIT</span>
        </div>
        {isPageMode && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              background: 'none',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              padding: '6px 14px',
              fontSize: '13px',
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Back to bill
          </button>
        )}
      </div>

      {/* Main Container */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '28px 32px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: '0 0 16px 0' }}>
          Edit referrer
        </h2>

        {/* Inactive Ref Doctor Callout Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '10px 14px',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontSize: '13px',
            color: '#1e293b',
            marginBottom: '24px',
          }}
        >
          <Info size={16} color="#0f172a" />
          <span>
            <strong>Inactive ref. doctor</strong> will not appear in referrer list on case reg. page.
          </span>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Row 1: Title, First name, Last name, Degree */}
          <div style={{ display: 'grid', gridTemplateColumns: '110px 1.6fr 1.4fr 1.6fr', gap: '16px', alignItems: 'flex-start' }}>
            {/* Title */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Title
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  backgroundColor: '#ffffff',
                  color: '#1e293b',
                  outline: 'none',
                }}
              >
                <option value="Dr.">Dr.</option>
                <option value="Prof.">Prof.</option>
                <option value="Mr.">Mr.</option>
                <option value="Mrs.">Mrs.</option>
                <option value="Ms.">Ms.</option>
              </select>
            </div>

            {/* * First name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                * First name
              </label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
              <button
                type="button"
                onClick={() => setShowHistoryModal(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '12px',
                  fontWeight: 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  marginTop: '6px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <History size={13} />
                <span>Referrer name change history</span>
              </button>
            </div>

            {/* Last name */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Last name
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Last name"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
            </div>

            {/* Degree */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Degree
              </label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. MBBS, MD, Pharmacist"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 2: Mobile number & Contact email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            {/* Mobile number */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Mobile number
              </label>
              <div style={{ display: 'flex' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: '0 12px',
                    backgroundColor: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRight: 'none',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '14px',
                    color: '#475569',
                    fontWeight: 600,
                  }}
                >
                  +91
                </span>
                <input
                  type="tel"
                  value={mobile === 'Not available' ? '' : mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  placeholder="Mobile number"
                  style={{
                    flex: 1,
                    padding: '9px 12px',
                    borderRadius: '0 6px 6px 0',
                    border: '1px solid #cbd5e1',
                    fontSize: '14px',
                    color: '#1e293b',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Contact email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                Contact email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="doctor@example.com"
                style={{
                  width: '100%',
                  padding: '9px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '14px',
                  color: '#1e293b',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Row 3: Address */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Address
            </label>
            <textarea
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Clinic or practice address"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#1e293b',
                fontFamily: 'inherit',
                outline: 'none',
              }}
            />
          </div>

          {/* Row 4: Active Checkbox */}
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#1e293b', fontWeight: 500, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={active}
                onChange={(e) => setActive(e.target.checked)}
                style={{ width: '16px', height: '16px', cursor: 'pointer' }}
              />
              <span>Active</span>
            </label>
          </div>

          {/* Row 5: Action Button */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#1d4ed8',
                color: '#ffffff',
                padding: '10px 24px',
                borderRadius: '6px',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
              }}
            >
              Update Referrer
            </button>
            <button
              type="button"
              onClick={onCancel}
              style={{
                backgroundColor: '#ffffff',
                color: '#475569',
                padding: '10px 20px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Referrer Name Change History Modal */}
      {showHistoryModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '16px',
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '8px',
              maxWidth: '540px',
              width: '100%',
              padding: '24px',
              boxShadow: '0 20px 25px -5px rgba(0,0,0,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
                Referrer Name Change History
              </h3>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px' }}>
              Audit log of changes made to this referral doctor's name across all system records:
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '6px', overflow: 'hidden' }}>
              <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', textAlign: 'left' }}>
                    <th style={{ padding: '8px 12px' }}>Date</th>
                    <th style={{ padding: '8px 12px' }}>Previous Name</th>
                    <th style={{ padding: '8px 12px' }}>Changed To</th>
                    <th style={{ padding: '8px 12px' }}>By</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '8px 12px' }}>28/10/2026</td>
                    <td style={{ padding: '8px 12px' }}>Pramod Pradhani</td>
                    <td style={{ padding: '8px 12px', fontWeight: 600 }}>Drx. Pramod Ku.Pradhani</td>
                    <td style={{ padding: '8px 12px' }}>Bimal Meher</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button
                onClick={() => setShowHistoryModal(false)}
                style={{
                  padding: '8px 18px',
                  backgroundColor: '#1d4ed8',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
