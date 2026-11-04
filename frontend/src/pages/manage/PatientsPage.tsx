import React, { useState, useEffect } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Search,
  Plus,
  Edit2,
  Eye,
  CheckCircle2,
  X,
  FilePlus2,
  FileText
} from 'lucide-react';
import { PatientProfilePage } from './PatientProfilePage';
import { patientApi } from '../../services/api';

interface PatientRecord {
  id: string;
  uhid: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'M' | 'F' | 'O';
  address: string;
  mobile: string;
  registeredOn: string;
  totalVisits: number;
}

export interface PatientsPageProps {
  onNavigateNewBill?: () => void;
}

export const PatientsPage: React.FC<PatientsPageProps> = ({ onNavigateNewBill }) => {
  // Filter States (Exact 7 fields from Labsmart)
  const [uhidQuery, setUhidQuery] = useState('');
  const [firstNameQuery, setFirstNameQuery] = useState('');
  const [lastNameQuery, setLastNameQuery] = useState('');
  const [mobileQuery, setMobileQuery] = useState('');
  const [idQuery, setIdQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // Modals & Drawers
  const [selectedPatientForView, setSelectedPatientForView] = useState<PatientRecord | null>(null);
  const [selectedPatientForEdit, setSelectedPatientForEdit] = useState<PatientRecord | null>(null);
  const [isNewPatientModalOpen, setIsNewPatientModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Edit/Add Form State
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formAge, setFormAge] = useState<number>(30);
  const [formGender, setFormGender] = useState<'M' | 'F' | 'O'>('M');
  const [formMobile, setFormMobile] = useState('');
  const [formAddress, setFormAddress] = useState('');

  const [patients, setPatients] = useState<PatientRecord[]>([
    {
      id: '35375569',
      uhid: 'UHID-8801',
      firstName: 'Rahul',
      lastName: 'Sharma',
      age: 32,
      gender: 'M',
      address: 'House 42, Sector 14, Main Road',
      mobile: '9876543210',
      registeredOn: '18/10/2026',
      totalVisits: 1
    },
    {
      id: '35375570',
      uhid: 'UHID-8802',
      firstName: 'Suresh',
      lastName: 'Mehta',
      age: 52,
      gender: 'M',
      address: 'Plot 105, Civil Lines',
      mobile: '9811223344',
      registeredOn: '18/10/2026',
      totalVisits: 1
    },
    {
      id: '35375571',
      uhid: 'UHID-8803',
      firstName: 'Kavita',
      lastName: 'Singhal',
      age: 34,
      gender: 'F',
      address: 'Flat 402, Green Park Residency',
      mobile: '9899887766',
      registeredOn: '17/10/2026',
      totalVisits: 2
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const fetchPatients = async () => {
    try {
      const res = await patientApi.listPatients();
      if (res.success && res.data?.patients && res.data.patients.length > 0) {
        const mapped: PatientRecord[] = res.data.patients.map((p: any) => ({
          id: p.id,
          uhid: p.uhid,
          firstName: p.firstName || p.fullName?.split(' ')[0] || 'Patient',
          lastName: p.lastName || p.fullName?.split(' ').slice(1).join(' ') || '',
          age: p.age || 30,
          gender: (p.gender?.[0] || 'M').toUpperCase() as any,
          address: p.address || 'Address not specified',
          mobile: p.mobile || 'Not available',
          registeredOn: new Date(p.createdAt).toLocaleDateString(),
          totalVisits: p.totalVisits || 1,
        }));
        setPatients(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch patients:', err);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleClearFilters = () => {
    setUhidQuery('');
    setFirstNameQuery('');
    setLastNameQuery('');
    setMobileQuery('');
    setIdQuery('');
    setFromDate('');
    setToDate('');
    showToast('Reset patient filters.');
  };

  const handleSavePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFirstName.trim() || !formMobile.trim()) return;

    if (selectedPatientForEdit) {
      // Update
      try {
        await patientApi.updatePatient(selectedPatientForEdit.id, {
          fullName: `${formFirstName} ${formLastName}`.trim(),
          age: Number(formAge),
          gender: formGender === 'M' ? 'Male' : formGender === 'F' ? 'Female' : 'Other',
          mobile: formMobile,
          address: formAddress
        });
        showToast(`Updated details for ${formFirstName} ${formLastName}`);
        setSelectedPatientForEdit(null);
        await fetchPatients();
        return;
      } catch (err) {
        console.error('Failed to update patient:', err);
      }

      setPatients(prev =>
        prev.map(p =>
          p.id === selectedPatientForEdit.id
            ? {
                ...p,
                firstName: formFirstName,
                lastName: formLastName,
                age: Number(formAge),
                gender: formGender,
                mobile: formMobile,
                address: formAddress
              }
            : p
        )
      );
      showToast(`Updated details for ${formFirstName} ${formLastName}`);
      setSelectedPatientForEdit(null);
    } else {
      // Create
      try {
        const res = await patientApi.createPatient({
          fullName: `${formFirstName} ${formLastName}`.trim(),
          age: Number(formAge),
          gender: formGender === 'M' ? 'Male' : formGender === 'F' ? 'Female' : 'Other',
          mobile: formMobile,
          address: formAddress || 'City Centre Clinic Area'
        });
        if (res.success && res.data) {
          showToast(`Registered patient ${formFirstName} ${formLastName}`);
          setIsNewPatientModalOpen(false);
          await fetchPatients();
          return;
        }
      } catch (err) {
        console.error('Failed to create patient on backend:', err);
      }

      const newP: PatientRecord = {
        id: String(Math.floor(35375500 + Math.random() * 900)),
        uhid: `UHID-${Math.floor(1000 + Math.random() * 9000)}`,
        firstName: formFirstName,
        lastName: formLastName,
        age: Number(formAge),
        gender: formGender,
        address: formAddress || 'City Centre Clinic Area',
        mobile: formMobile,
        registeredOn: new Date().toLocaleDateString(),
        totalVisits: 1
      };
      setPatients([newP, ...patients]);
      showToast(`Registered patient ${newP.firstName} ${newP.lastName} (#${newP.id})`);
      setIsNewPatientModalOpen(false);
    }
  };

  const handleOpenEdit = (p: PatientRecord) => {
    setSelectedPatientForEdit(p);
    setFormFirstName(p.firstName);
    setFormLastName(p.lastName);
    setFormAge(p.age);
    setFormGender(p.gender);
    setFormMobile(p.mobile);
    setFormAddress(p.address);
  };

  const handleAddCase = (p: PatientRecord) => {
    localStorage.setItem('labsmart_selected_patient', JSON.stringify({
      id: p.id,
      uhid: p.uhid || p.id,
      name: `${p.firstName} ${p.lastName}`.trim(),
      prefix: p.gender === 'F' ? 'Mrs' : 'Mr',
      age: p.age,
      gender: p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : 'Other',
      phone: p.mobile,
      address: p.address,
    }));
    showToast(`Starting new bill for ${p.firstName} ${p.lastName}...`);
    if (onNavigateNewBill) {
      setTimeout(() => onNavigateNewBill(), 250);
    }
  };

  const filteredPatients = patients.filter(p => {
    if (uhidQuery && !p.uhid.toLowerCase().includes(uhidQuery.toLowerCase())) return false;
    if (firstNameQuery && !p.firstName.toLowerCase().includes(firstNameQuery.toLowerCase())) return false;
    if (lastNameQuery && !p.lastName.toLowerCase().includes(lastNameQuery.toLowerCase())) return false;
    if (mobileQuery && !p.mobile.includes(mobileQuery)) return false;
    if (idQuery && !p.id.includes(idQuery)) return false;
    return true;
  });

  if (selectedPatientForView) {
    return (
      <PatientProfilePage
        patient={{
          title: selectedPatientForView.gender === 'M' ? 'Mr.' : 'Ms.',
          firstName: selectedPatientForView.firstName,
          lastName: selectedPatientForView.lastName,
          sex: selectedPatientForView.gender === 'M' ? 'MALE' : 'FEMALE',
          ageYears: selectedPatientForView.age,
          ageMonths: 0,
          ageDays: 0,
          mobile: selectedPatientForView.mobile,
          onlineReportRequested: false,
          address: selectedPatientForView.address,
        }}
        regNo="3391"
        onBack={() => setSelectedPatientForView(null)}
        onEditProfile={() => {
          handleOpenEdit(selectedPatientForView);
          setSelectedPatientForView(null);
        }}
        onAddCase={() => handleAddCase(selectedPatientForView)}
        onViewBill={() => showToast('Opening bill #3391...')}
        onViewReport={() => showToast('Opening laboratory reports...')}
      />
    );
  }

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
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Patients</h1>
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={14} />}
          onClick={() => {
            setSelectedPatientForEdit(null);
            setFormFirstName('');
            setFormLastName('');
            setFormAge(30);
            setFormGender('M');
            setFormMobile('');
            setFormAddress('');
            setIsNewPatientModalOpen(true);
          }}
        >
          + Add patient
        </Button>
      </div>

      {/* 7-Field Filter Form Card */}
      <Card style={{ padding: '20px', marginBottom: '24px', backgroundColor: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '14px', alignItems: 'flex-end' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>UHID</label>
            <input
              type="text"
              placeholder="e.g. UHID-8801"
              value={uhidQuery}
              onChange={(e) => setUhidQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>First name</label>
            <input
              type="text"
              placeholder="First name..."
              value={firstNameQuery}
              onChange={(e) => setFirstNameQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Last name</label>
            <input
              type="text"
              placeholder="Last name..."
              value={lastNameQuery}
              onChange={(e) => setLastNameQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>Mobile number</label>
            <input
              type="text"
              placeholder="10-digit mobile..."
              value={mobileQuery}
              onChange={(e) => setMobileQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>ID</label>
            <input
              type="text"
              placeholder="Patient ID..."
              value={idQuery}
              onChange={(e) => setIdQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>From</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ fontSize: '12px', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '4px' }}>To</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ width: '100%', padding: '7px 10px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid #f1f5f9' }}>
          <Button variant="primary" size="sm" onClick={() => showToast('Applying patient search filter...')}>
            Search
          </Button>
          <button
            onClick={handleClearFilters}
            style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', cursor: 'pointer', fontWeight: 500 }}
          >
            Clear
          </button>
        </div>
      </Card>

      {/* Patients Table */}
      <Card style={{ padding: '0', overflow: 'hidden', border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 600 }}>
                <th style={{ padding: '12px 16px', width: '110px' }}>ID</th>
                <th style={{ padding: '12px 16px' }}>NAME</th>
                <th style={{ padding: '12px 16px' }}>ADDRESS</th>
                <th style={{ padding: '12px 16px', width: '140px' }}>MOBILE NUMBER</th>
                <th style={{ padding: '12px 16px', width: '140px' }}>REGISTERED ON</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', width: '180px' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>
                    No patient records found matching the search criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', fontWeight: 600, color: '#2563eb' }}>
                      {p.id}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 600, color: '#1e293b' }}>
                        {p.firstName} {p.lastName} ({p.age} YRS/{p.gender})
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {p.address}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#1e293b' }}>
                      {p.mobile}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#64748b' }}>
                      {p.registeredOn}
                    </td>
                    <td style={{ padding: '12px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          onClick={() => setSelectedPatientForView(p)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleOpenEdit(p)}
                          style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleAddCase(p)}
                          style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}
                        >
                          Add case
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* MODAL: EDIT / ADD PATIENT */}
      {(selectedPatientForEdit || isNewPatientModalOpen) && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(15, 23, 42, 0.5)' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '8px', width: '100%', maxWidth: '520px', padding: '24px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, margin: 0, color: '#1e293b' }}>
                {selectedPatientForEdit ? `Edit Patient #${selectedPatientForEdit.id}` : 'Add New Patient'}
              </h3>
              <button
                onClick={() => { setSelectedPatientForEdit(null); setIsNewPatientModalOpen(false); }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSavePatient} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>First name *</label>
                  <input
                    type="text"
                    required
                    value={formFirstName}
                    onChange={(e) => setFormFirstName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Last name</label>
                  <input
                    type="text"
                    value={formLastName}
                    onChange={(e) => setFormLastName(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Age (Years)</label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formAge}
                    onChange={(e) => setFormAge(Number(e.target.value))}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Sex</label>
                  <select
                    value={formGender}
                    onChange={(e) => setFormGender(e.target.value as any)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px', backgroundColor: '#ffffff' }}
                  >
                    <option value="M">MALE</option>
                    <option value="F">FEMALE</option>
                    <option value="O">OTHER</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Mobile *</label>
                  <input
                    type="text"
                    required
                    value={formMobile}
                    onChange={(e) => setFormMobile(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '4px' }}>Address</label>
                <input
                  type="text"
                  value={formAddress}
                  onChange={(e) => setFormAddress(e.target.value)}
                  placeholder="Street / Colony / Locality..."
                  style={{ width: '100%', padding: '8px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                <Button variant="secondary" size="sm" onClick={() => { setSelectedPatientForEdit(null); setIsNewPatientModalOpen(false); }}>
                  Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit">
                  Save Patient
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
