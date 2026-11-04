import React, { useState, useEffect } from 'react';
import { User, Check, Plus, Minus, X } from 'lucide-react';

export interface PatientDetailsData {
  title: string;
  firstName: string;
  lastName: string;
  sex: 'MALE' | 'FEMALE' | 'OTHER';
  ageYears: number;
  ageMonths: number;
  ageDays: number;
  mobile: string;
  onlineReportRequested: boolean;
  email?: string;
  address?: string;
  aadhaar?: string;
  patientHistory?: string;
}

export interface UpdatePatientDetailsModalProps {
  isOpen?: boolean;
  isPageMode?: boolean;
  initialData: PatientDetailsData;
  onSave: (data: PatientDetailsData) => void;
  onCancel: () => void;
}

export const UpdatePatientDetailsView: React.FC<UpdatePatientDetailsModalProps> = ({
  initialData,
  onSave,
  onCancel,
  isPageMode = false,
}) => {
  const [title, setTitle] = useState(initialData.title || 'Mr.');
  const [firstName, setFirstName] = useState(initialData.firstName || '');
  const [lastName, setLastName] = useState(initialData.lastName || '');
  const [sex, setSex] = useState<'MALE' | 'FEMALE' | 'OTHER'>(initialData.sex || 'MALE');
  const [ageYears, setAgeYears] = useState(initialData.ageYears || 0);
  const [ageMonths, setAgeMonths] = useState(initialData.ageMonths || 0);
  const [ageDays, setAgeDays] = useState(initialData.ageDays || 0);
  const [mobile, setMobile] = useState(initialData.mobile || '');
  const [onlineReportRequested, setOnlineReportRequested] = useState(
    initialData.onlineReportRequested || false
  );

  // Optional expandable fields
  const [showEmail, setShowEmail] = useState(Boolean(initialData.email));
  const [email, setEmail] = useState(initialData.email || '');

  const [showAddress, setShowAddress] = useState(Boolean(initialData.address));
  const [address, setAddress] = useState(initialData.address || '');

  const [showAadhaar, setShowAadhaar] = useState(Boolean(initialData.aadhaar));
  const [aadhaar, setAadhaar] = useState(initialData.aadhaar || '');

  const [showHistory, setShowHistory] = useState(Boolean(initialData.patientHistory));
  const [history, setHistory] = useState(initialData.patientHistory || '');

  useEffect(() => {
    setTitle(initialData.title || 'Mr.');
    setFirstName(initialData.firstName || '');
    setLastName(initialData.lastName || '');
    setSex(initialData.sex || 'MALE');
    setAgeYears(initialData.ageYears || 0);
    setAgeMonths(initialData.ageMonths || 0);
    setAgeDays(initialData.ageDays || 0);
    setMobile(initialData.mobile || '');
    setOnlineReportRequested(initialData.onlineReportRequested || false);
    setEmail(initialData.email || '');
    setShowEmail(Boolean(initialData.email));
    setAddress(initialData.address || '');
    setShowAddress(Boolean(initialData.address));
    setAadhaar(initialData.aadhaar || '');
    setShowAadhaar(Boolean(initialData.aadhaar));
    setHistory(initialData.patientHistory || '');
    setShowHistory(Boolean(initialData.patientHistory));
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      title,
      firstName,
      lastName,
      sex,
      ageYears,
      ageMonths,
      ageDays,
      mobile,
      onlineReportRequested,
      email: showEmail ? email : undefined,
      address: showAddress ? address : undefined,
      aadhaar: showAadhaar ? aadhaar : undefined,
      patientHistory: showHistory ? history : undefined,
    });
  };

  const formContent = (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '28px 32px',
        boxShadow: isPageMode ? '0 1px 3px rgba(0,0,0,0.05)' : 'none',
        maxWidth: '880px',
        margin: '0 auto',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
          Update patient details
        </h2>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Row 1: Title, First name, Last name, Sex */}
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1.5fr 1.5fr 1.8fr', gap: '16px', alignItems: 'flex-start' }}>
          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Title*
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
              <option value="Mr.">Mr.</option>
              <option value="Mrs.">Mrs.</option>
              <option value="Miss">Miss</option>
              <option value="Ms.">Ms.</option>
              <option value="Master">Master</option>
              <option value="Baby">Baby</option>
              <option value="Baby of">Baby of</option>
              <option value="Dr.">Dr.</option>
              <option value="Prof.">Prof.</option>
              <option value="Late">Late</option>
            </select>
          </div>

          {/* First name */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              First name*
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

          {/* Sex Segmented Buttons */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Sex*
            </label>
            <div style={{ display: 'flex', gap: '6px' }}>
              {[
                { id: 'MALE', label: 'MALE', icon: '👤' },
                { id: 'FEMALE', label: 'FEMALE', icon: '👤' },
                { id: 'OTHER', label: 'OTHER', icon: '⚧' },
              ].map((item) => {
                const isSelected = sex === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSex(item.id as any)}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      border: isSelected ? '1px solid #7c3aed' : '1px solid #cbd5e1',
                      backgroundColor: isSelected ? '#7c3aed' : '#ffffff',
                      color: isSelected ? '#ffffff' : '#64748b',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span>{item.label}</span>
                    <span style={{ fontSize: '12px' }}>{item.icon}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Age (3 input boxes: Years, Months, Days) & Mobile number */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.5fr', gap: '24px', alignItems: 'flex-start' }}>
          {/* Age Group */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Age*
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              <div>
                <input
                  type="number"
                  min="0"
                  max="120"
                  value={ageYears}
                  onChange={(e) => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Years"
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
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                  Years
                </span>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={ageMonths}
                  onChange={(e) => setAgeMonths(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Months"
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
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                  Months
                </span>
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={ageDays}
                  onChange={(e) => setAgeDays(Math.max(0, parseInt(e.target.value) || 0))}
                  placeholder="Days"
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
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px', textAlign: 'center' }}>
                  Days
                </span>
              </div>
            </div>
          </div>

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
        </div>

        {/* Online report requested Checkbox */}
        <div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={onlineReportRequested}
              onChange={(e) => setOnlineReportRequested(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            <span>Online report requested</span>
          </label>
        </div>

        {/* Optional Pill Buttons to toggle extra details */}
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', paddingTop: '4px' }}>
          <button
            type="button"
            onClick={() => setShowEmail(!showEmail)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: showEmail ? '#eff6ff' : '#ffffff',
              color: showEmail ? '#2563eb' : '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showEmail ? <Minus size={14} /> : <Plus size={14} />}
            <span>Email</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAddress(!showAddress)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: showAddress ? '#eff6ff' : '#ffffff',
              color: showAddress ? '#2563eb' : '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showAddress ? <Minus size={14} /> : <Plus size={14} />}
            <span>Address</span>
          </button>

          <button
            type="button"
            onClick={() => setShowAadhaar(!showAadhaar)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: showAadhaar ? '#eff6ff' : '#ffffff',
              color: showAadhaar ? '#2563eb' : '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showAadhaar ? <Minus size={14} /> : <Plus size={14} />}
            <span>Aadhaar</span>
          </button>

          <button
            type="button"
            onClick={() => setShowHistory(!showHistory)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              borderRadius: '20px',
              border: '1px solid #cbd5e1',
              backgroundColor: showHistory ? '#eff6ff' : '#ffffff',
              color: showHistory ? '#2563eb' : '#475569',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            {showHistory ? <Minus size={14} /> : <Plus size={14} />}
            <span>Patient history</span>
          </button>
        </div>

        {/* Dynamic Optional Inputs */}
        {showEmail && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Email address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="patient@example.com"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#1e293b',
              }}
            />
          </div>
        )}

        {showAddress && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Address
            </label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter residential or clinic address"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {showAadhaar && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Aadhaar / National ID
            </label>
            <input
              type="text"
              value={aadhaar}
              onChange={(e) => setAadhaar(e.target.value)}
              placeholder="xxxx xxxx xxxx"
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#1e293b',
              }}
            />
          </div>
        )}

        {showHistory && (
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
              Patient history &amp; clinical remarks
            </label>
            <textarea
              rows={3}
              value={history}
              onChange={(e) => setHistory(e.target.value)}
              placeholder="e.g. 28/10/2026 - History of hypertension..."
              style={{
                width: '100%',
                padding: '9px 12px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '14px',
                color: '#1e293b',
                fontFamily: 'inherit',
              }}
            />
          </div>
        )}

        {/* Submit Button */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
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
            <Check size={16} />
            <span>Update</span>
          </button>
          {!isPageMode && (
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
          )}
        </div>
      </form>
    </div>
  );

  return formContent;
};
