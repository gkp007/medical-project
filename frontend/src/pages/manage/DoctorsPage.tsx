import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { doctorApi } from '../../services/api';
import {
  Search,
  Phone,
  Download,
  Check,
  CheckCircle2,
  Printer,
  Plus,
  Edit2,
  Eye,
  X
} from 'lucide-react';

interface DoctorItem {
  id: string;
  regOn: string;
  active: boolean;
  name: string;
  degree: string;
  phone: string;
  address: string;
  commission: number;
}

export const DoctorsPage: React.FC = () => {
  const [selectedLetter, setSelectedLetter] = useState<string>('All');
  const [firstNameFilter, setFirstNameFilter] = useState('');
  const [contactFilter, setContactFilter] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [showMoreFilters, setShowMoreFilters] = useState(false);
  const [addressFilter, setAddressFilter] = useState('');

  // Modals
  const [selectedDoctorForView, setSelectedDoctorForView] = useState<DoctorItem | null>(null);
  const [selectedDoctorForEdit, setSelectedDoctorForEdit] = useState<DoctorItem | null>(null);
  const [isAddDoctorModalOpen, setIsAddDoctorModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDegree, setFormDegree] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formCommission, setFormCommission] = useState<number>(15);
  const [formActive, setFormActive] = useState<boolean>(true);

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const [doctors, setDoctors] = useState<DoctorItem[]>([]);

  const loadDoctors = async () => {
    setIsLoading(true);
    try {
      const res = await doctorApi.listDoctors();
      if (res.status === 'success' && Array.isArray(res.data)) {
        const mapped: DoctorItem[] = res.data.map((d: any) => ({
          id: d.id,
          regOn: d.createdAt ? new Date(d.createdAt).toLocaleDateString() : 'Active',
          active: d.isActive !== undefined ? Boolean(d.isActive) : true,
          name: d.name || 'Unnamed Doctor',
          degree: d.specialization || d.degree || '',
          phone: d.phone || '',
          address: d.address || 'Clinic / Hospital',
          commission: Number(d.commissionPercent || d.commission || 0)
        }));
        setDoctors(mapped);
      }
    } catch (err) {
      console.error('Failed to load doctors from backend', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDoctors();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setSelectedLetter('All');
    setFirstNameFilter('');
    setContactFilter('');
    setActiveFilter('All');
    setAddressFilter('');
    showToast('Reset doctor filters.');
  };

  const handleToggleStatus = async (doc: DoctorItem) => {
    try {
      await doctorApi.toggleDoctorStatus(doc.id);
      showToast(`Updated status for ${doc.name}`);
      await loadDoctors();
    } catch (err: any) {
      showToast(err.message || 'Failed to update status');
    }
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    try {
      if (selectedDoctorForEdit) {
        await doctorApi.updateDoctor(selectedDoctorForEdit.id, {
          name: formName,
          specialization: formDegree,
          phone: formPhone,
          address: formAddress,
          commissionPercent: Number(formCommission),
          isActive: formActive
        });
        showToast(`Updated profile for ${formName}`);
        setSelectedDoctorForEdit(null);
      } else {
        await doctorApi.createDoctor({
          name: formName,
          specialization: formDegree,
          phone: formPhone,
          address: formAddress || 'City Clinic Area',
          commissionPercent: Number(formCommission)
        });
        showToast(`Added consulting doctor ${formName}`);
        setIsAddDoctorModalOpen(false);
      }
      await loadDoctors();
    } catch (err: any) {
      showToast(err.message || 'Failed to save doctor');
    }
  };

  const handleOpenEdit = (doc: DoctorItem) => {
    setSelectedDoctorForEdit(doc);
    setFormName(doc.name);
    setFormDegree(doc.degree);
    setFormPhone(doc.phone);
    setFormAddress(doc.address);
    setFormCommission(doc.commission);
    setFormActive(doc.active);
  };

  const filteredDoctors = doctors.filter(doc => {
    if (selectedLetter !== 'All' && !doc.name.replace(/^Dr\.\s*/i, '').toUpperCase().startsWith(selectedLetter)) {
      return false;
    }
    if (firstNameFilter && !doc.name.toLowerCase().includes(firstNameFilter.toLowerCase())) return false;
    if (contactFilter && !doc.phone.includes(contactFilter)) return false;
    if (activeFilter === 'Active' && !doc.active) return false;
    if (activeFilter === 'Inactive' && doc.active) return false;
    if (addressFilter && !doc.address.toLowerCase().includes(addressFilter.toLowerCase())) return false;
    return true;
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
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Referral Doctors</h1>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => {
            setSelectedDoctorForEdit(null);
            setFormName('');
            setFormDegree('');
            setFormPhone('');
            setFormAddress('');
            setFormCommission(15);
            setFormActive(true);
            setIsAddDoctorModalOpen(true);
          }}
        >
          + Add Doctor
        </Button>
      </div>

      {/* A-Z Alphabet Filter Index */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', fontWeight: 600, color: '#64748b' }}>Name starts with:</span>
        <button
          onClick={() => setSelectedLetter('All')}
          style={{
            padding: '2px 8px',
            borderRadius: '4px',
            border: selectedLetter === 'All' ? '1px solid #2563eb' : '1px solid #cbd5e1',
            backgroundColor: selectedLetter === 'All' ? '#2563eb' : '#ffffff',
            color: selectedLetter === 'All' ? '#ffffff' : '#475569',
            fontSize: '12px',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          All
        </button>
        {alphabet.map(letter => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            style={{
              padding: '2px 6px',
              borderRadius: '3px',
              border: selectedLetter === letter ? '1px solid #2563eb' : '1px solid #e2e8f0',
              backgroundColor: selectedLetter === letter ? '#2563eb' : '#ffffff',
              color: selectedLetter === letter ? '#ffffff' : '#64748b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Filter Form Card */}
      <Card style={{ padding: '20px', marginBottom: '20px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>First name</label>
            <input
              type="text"
              placeholder="Doctor name..."
              value={firstNameFilter}
              onChange={(e) => setFirstNameFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Contact number</label>
            <input
              type="text"
              placeholder="Contact number..."
              value={contactFilter}
              onChange={(e) => setContactFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Active</label>
            <select
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', backgroundColor: '#ffffff' }}
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active only</option>
              <option value="Inactive">Inactive only</option>
            </select>
          </div>
        </div>

        {/* Show More Filters */}
        {showMoreFilters && (
          <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px dashed #e2e8f0' }}>
            <div style={{ maxWidth: '320px' }}>
              <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Address</label>
              <input
                type="text"
                placeholder="Clinic address..."
                value={addressFilter}
                onChange={(e) => setAddressFilter(e.target.value)}
                style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              />
            </div>
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9', flexWrap: 'wrap', gap: '12px' }}>
          <button
            onClick={() => setShowMoreFilters(!showMoreFilters)}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
          >
            {showMoreFilters ? '- Hide extra filters' : '+ Show more filters'}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Button variant="primary" size="sm" onClick={() => showToast('Applying doctor search...')}>
              Search
            </Button>
            <button
              onClick={handleClearFilters}
              style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
            >
              Clear
            </button>
          </div>
        </div>
      </Card>

      {/* Advisory Banner & Action Links */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '8px' }}>
        <span style={{ fontSize: '13px', color: '#64748b', fontStyle: 'italic' }}>
          Inactive referrers will not appear in patient registration page.
        </span>
        <button
          onClick={() => showToast('Downloading active referrers directory (.xlsx)...')}
          style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
        >
          <Download size={14} />
          Download active referrers
        </button>
      </div>

      {/* Directory Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '70px' }}>ID</th>
                <th style={{ padding: '12px 16px', width: '120px' }}>REG. ON</th>
                <th style={{ padding: '12px 16px', width: '90px', textAlign: 'center' }}>ACTIVE</th>
                <th style={{ padding: '12px 16px' }}>REFERRER</th>
                <th style={{ padding: '12px 16px' }}>ADDRESS</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', width: '140px' }}>PRINT BUSINESS</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '130px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredDoctors.map(doc => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{doc.id}</td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{doc.regOn}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <button
                      onClick={() => handleToggleStatus(doc)}
                      title="Click to toggle active status"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: doc.active ? '#16a34a' : '#94a3b8',
                        fontWeight: 700,
                        fontSize: '14px'
                      }}
                    >
                      {doc.active ? '✓ Active' : '✕ Inactive'}
                    </button>
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#1e293b' }}>
                      {doc.name} {doc.degree && `(${doc.degree})`}
                    </div>
                    {doc.phone && (
                      <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <Phone size={11} />
                        <span>{doc.phone}</span>
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{doc.address}</td>
                  <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => showToast(`Selected ${doc.name} for business statement print`)}
                    >
                      Select
                    </Button>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                      <button
                        onClick={() => setSelectedDoctorForView(doc)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleOpenEdit(doc)}
                        style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                      >
                        Edit
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: VIEW DOCTOR PROFILE */}
      {selectedDoctorForView && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '460px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                Consulting Physician Profile
              </h3>
              <button onClick={() => setSelectedDoctorForView(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b' }}>Doctor Name:</span>
                <span style={{ fontWeight: 600 }}>{selectedDoctorForView.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b' }}>Qualifications:</span>
                <span style={{ fontWeight: 600 }}>{selectedDoctorForView.degree || 'General Practitioner'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b' }}>Contact Phone:</span>
                <span style={{ fontWeight: 600 }}>{selectedDoctorForView.phone || 'Direct Patient'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b' }}>Clinic Address:</span>
                <span style={{ fontWeight: 600, textAlign: 'right', maxWidth: '240px' }}>{selectedDoctorForView.address}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', backgroundColor: '#f8fafc', borderRadius: '4px' }}>
                <span style={{ color: '#64748b' }}>Incentive Rate:</span>
                <span style={{ fontWeight: 700, color: '#16a34a' }}>{selectedDoctorForView.commission}% Commission</span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
              <Button variant="primary" size="sm" onClick={() => setSelectedDoctorForView(null)}>
                Done
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: EDIT / ADD DOCTOR */}
      {(selectedDoctorForEdit || isAddDoctorModalOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '480px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                {selectedDoctorForEdit ? `Edit ${selectedDoctorForEdit.name}` : 'Register Referral Doctor'}
              </h3>
              <button
                onClick={() => { setSelectedDoctorForEdit(null); setIsAddDoctorModalOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Doctor Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Ramesh Gupta"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Degrees / Speciality</label>
                <input
                  type="text"
                  placeholder="e.g. MBBS, MD (Medicine)"
                  value={formDegree}
                  onChange={(e) => setFormDegree(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Contact Phone</label>
                <input
                  type="text"
                  placeholder="10-digit mobile number..."
                  value={formPhone}
                  onChange={(e) => setFormPhone(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Clinic Address</label>
                <input
                  type="text"
                  placeholder="Clinic location..."
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Incentive Rate (%)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formCommission}
                    onChange={(e) => setFormCommission(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Active Status</label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px', fontSize: '13px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formActive}
                      onChange={(e) => setFormActive(e.target.checked)}
                    />
                    <span>Active in billing</span>
                  </label>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <Button variant="secondary" size="sm" onClick={() => { setSelectedDoctorForEdit(null); setIsAddDoctorModalOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Doctor
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
