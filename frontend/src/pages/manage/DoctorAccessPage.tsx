import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import { 
  UserPlus, 
  Send, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  RotateCcw, 
  Info, 
  Lock, 
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export interface DoctorPortalAccess {
  id: string;
  docId: string;
  name: string;
  speciality: string;
  address: string;
  mobile: string;
  email: string;
  invitedOn: string;
  status: 'Invited' | 'Access Granted' | 'Access Revoked';
}

export const DoctorAccessPage: React.FC = () => {
  const [accessList, setAccessList] = useState<DoctorPortalAccess[]>([
    {
      id: '1',
      docId: '2',
      name: 'Dr. Anil Verma (MBBS, MD)',
      speciality: 'Internal Medicine',
      address: 'Shop 4, Civil Lines, New Delhi',
      mobile: '+91 9811223344',
      email: 'dr.anil@delhiclinic.com',
      invitedOn: '18/10/2026',
      status: 'Access Granted',
    },
    {
      id: '2',
      docId: '4',
      name: 'Dr. Rajesh Gupta (MD Medicine)',
      speciality: 'Chest & General Medicine',
      address: 'Near City Hospital, Delhi Gate',
      mobile: '+91 9820349120',
      email: 'dr.rajesh.gupta@delhimed.org',
      invitedOn: '19/10/2026',
      status: 'Invited',
    },
    {
      id: '3',
      docId: '1',
      name: 'Self (In-House Laboratory)',
      speciality: 'Pathology & Imaging',
      address: 'Laboratory Premises',
      mobile: '+91 7752058263',
      email: 'inhouse@labsmart.internal',
      invitedOn: '17/10/2026',
      status: 'Access Granted',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'Invited' | 'Access Granted' | 'Access Revoked'>('Invited');
  const [selectedDocId, setSelectedDocId] = useState('3');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [docToRevoke, setDocToRevoke] = useState<DoctorPortalAccess | null>(null);
  const [docToRestore, setDocToRestore] = useState<DoctorPortalAccess | null>(null);
  const [docToDelete, setDocToDelete] = useState<DoctorPortalAccess | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Invite form details
  const [customDocName, setCustomDocName] = useState('Dr. Priya Sharma');
  const [customSpeciality, setCustomSpeciality] = useState('MS General Surgery');
  const [customAddress, setCustomAddress] = useState('Apollo Clinic, Ring Road');
  const [inviteMobile, setInviteMobile] = useState('+91 9812345678');
  const [inviteEmail, setInviteEmail] = useState('dr.priya@clinic.in');
  const [inviteSmsPreview, setInviteSmsPreview] = useState(
    'Dear Doctor, Labsmart Diagnostics has invited you to access patient pathology and radiology reports online. Click here to login: https://labsmartlis.com/dr/invite'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSelectDoctorChange = (val: string) => {
    setSelectedDocId(val);
    if (val === '3') {
      setCustomDocName('Dr. Priya Sharma');
      setCustomSpeciality('MS General Surgery');
      setCustomAddress('Apollo Clinic, Ring Road');
      setInviteMobile('+91 9812345678');
      setInviteEmail('dr.priya@clinic.in');
    } else if (val === '5') {
      setCustomDocName('Dr. Sunil Bansal');
      setCustomSpeciality('MS Orthopaedics');
      setCustomAddress('Orthopaedic Care Centre, Model Town');
      setInviteMobile('+91 9871122334');
      setInviteEmail('dr.bansal@orthocare.in');
    } else if (val === '6') {
      setCustomDocName('Dr. Ramesh Saxena');
      setCustomSpeciality('MD Paediatrics');
      setCustomAddress('Rainbow Child Clinic, Karol Bagh');
      setInviteMobile('+91 9810987654');
      setInviteEmail('dr.saxena@childcare.com');
    } else if (val === '7') {
      setCustomDocName('Dr. Rajesh Khanna');
      setCustomSpeciality('DM Cardiology');
      setCustomAddress('Heart & Rhythm Centre, Civil Lines');
      setInviteMobile('+91 9822355667');
      setInviteEmail('dr.khanna@cardioheart.org');
    } else if (val === '8') {
      setCustomDocName('Dr. Sunita Patil');
      setCustomSpeciality('DGO Obstetrics & Gynaecology');
      setCustomAddress('Motherhood Maternity Centre, Saket');
      setInviteMobile('+91 9833466778');
      setInviteEmail('dr.sunita@motherhood.in');
    } else if (val === '9') {
      setCustomDocName('Dr. Vikram Malhotra');
      setCustomSpeciality('DM Neurology');
      setCustomAddress('Neuro Science Hospital, Sector 22');
      setInviteMobile('+91 9844577889');
      setInviteEmail('dr.vikram@neurospine.org');
    } else if (val === '10') {
      setCustomDocName('Dr. Meena Agarwal');
      setCustomSpeciality('MD Pathology');
      setCustomAddress('City Diagnostic Laboratory, MG Road');
      setInviteMobile('+91 9855688990');
      setInviteEmail('dr.meena@pathocare.com');
    }
  };

  const handleOpenInviteModal = () => {
    handleSelectDoctorChange(selectedDocId);
    setIsInviteModalOpen(true);
  };

  const handleSendInvite = (e: React.FormEvent) => {
    e.preventDefault();
    const newEntry: DoctorPortalAccess = {
      id: String(Date.now()),
      docId: selectedDocId,
      name: customDocName,
      speciality: customSpeciality,
      address: customAddress,
      mobile: inviteMobile,
      email: inviteEmail,
      invitedOn: 'Today',
      status: 'Invited',
    };

    setAccessList([newEntry, ...accessList]);
    setIsInviteModalOpen(false);
    setActiveTab('Invited');
    showToast(`Invitation SMS & Email sent to ${customDocName}`);
  };

  const handleResend = (doc: DoctorPortalAccess) => {
    showToast(`Invite link resent via SMS & Email to ${doc.name} (${doc.mobile})`);
  };

  const handleConfirmRevoke = () => {
    if (!docToRevoke) return;
    setAccessList((prev) =>
      prev.map((d) => (d.id === docToRevoke.id ? { ...d, status: 'Access Revoked' } : d))
    );
    showToast(`Revoked doctor portal access for ${docToRevoke.name}`);
    setDocToRevoke(null);
  };

  const handleConfirmRestore = () => {
    if (!docToRestore) return;
    setAccessList((prev) =>
      prev.map((d) => (d.id === docToRestore.id ? { ...d, status: 'Access Granted' } : d))
    );
    showToast(`Restored active doctor portal access for ${docToRestore.name}`);
    setDocToRestore(null);
  };

  const handleConfirmDelete = () => {
    if (!docToDelete) return;
    setAccessList((prev) => prev.filter((d) => d.id !== docToDelete.id));
    showToast(`Removed invitation record for ${docToDelete.name}`);
    setDocToDelete(null);
  };

  const invitedList = accessList.filter((d) => d.status === 'Invited');
  const grantedList = accessList.filter((d) => d.status === 'Access Granted');
  const revokedList = accessList.filter((d) => d.status === 'Access Revoked');

  const displayedList = activeTab === 'Invited' ? invitedList : activeTab === 'Access Granted' ? grantedList : revokedList;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with BETA Badge */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            Manage Labsmart Doctor Portal Access
          </h2>
          <span
            style={{
              backgroundColor: '#fdf2f8',
              color: '#db2777',
              border: '1px solid #fbcfe8',
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '4px',
              textTransform: 'uppercase',
            }}
          >
            BETA
          </span>
        </div>

        {/* Plan Limit Callout */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            color: '#1e293b',
            marginBottom: '4px',
          }}
        >
          <Info size={15} color="#2563eb" />
          <span>
            <strong>Invite and access limit: 5 doctors</strong> — You currently have {grantedList.length} active doctor accounts.{' '}
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                showToast('Plan upgrades available in Account Settings.');
              }}
              style={{ color: '#2563eb', fontWeight: 600, textDecoration: 'none' }}
            >
              Upgrade
            </a>{' '}
            to premium plan to increase this limit.
          </span>
        </div>

        <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>
          Grant live access to investigations and reports to doctors. Doctor can signup with the invite link and will use the same login as labs.
        </p>
      </div>

      {/* Direct Invite Widget Card Matching Labsmart */}
      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '16px 20px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        <select
          className="form-select"
          style={{
            minWidth: '320px',
            padding: '9px 12px',
            fontSize: '13px',
            borderRadius: '6px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            outline: 'none',
          }}
          value={selectedDocId}
          onChange={(e) => handleSelectDoctorChange(e.target.value)}
        >
          <option value="3">ID: 3, Dr. Priya Sharma (MS General Surgery)</option>
          <option value="5">ID: 5, Dr. Sunil Bansal (MS Orthopaedics)</option>
          <option value="6">ID: 6, Dr. Ramesh Saxena (MD Paediatrics)</option>
          <option value="7">ID: 7, Dr. Rajesh Khanna (DM Cardiology)</option>
          <option value="8">ID: 8, Dr. Sunita Patil (DGO Gynaecology)</option>
          <option value="9">ID: 9, Dr. Vikram Malhotra (DM Neurology)</option>
          <option value="10">ID: 10, Dr. Meena Agarwal (MD Pathology)</option>
        </select>

        <button
          type="button"
          onClick={handleOpenInviteModal}
          style={{
            backgroundColor: '#2563eb',
            color: '#ffffff',
            border: 'none',
            padding: '9px 20px',
            borderRadius: '6px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Send size={14} />
          <span>Invite</span>
        </button>
      </div>

      {/* 3 Status Navigation Tabs */}
      <div style={{ display: 'flex', gap: '24px', marginBottom: '16px', borderBottom: '1px solid #e2e8f0' }}>
        {[
          { id: 'Invited', label: 'Invited', count: invitedList.length },
          { id: 'Access Granted', label: 'Access Granted', count: grantedList.length },
          { id: 'Access Revoked', label: 'Access Revoked', count: revokedList.length },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              style={{
                background: 'none',
                border: 'none',
                fontWeight: isActive ? 700 : 500,
                color: isActive ? '#2563eb' : '#64748b',
                borderBottom: isActive ? '2px solid #2563eb' : '2px solid transparent',
                padding: '8px 4px',
                fontSize: '14px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>{tab.label}</span>
              <span
                style={{
                  backgroundColor: isActive ? '#dbeafe' : '#f1f5f9',
                  color: isActive ? '#1d4ed8' : '#64748b',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '1px 6px',
                  borderRadius: '10px',
                }}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Doctor Access Ledger Table */}
      <div className="table-container" style={{ border: '1px solid #e2e8f0', borderRadius: '8px', overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '60px' }}>S. NO.</th>
              <th style={{ width: '70px' }}>ID</th>
              <th>REFERRER</th>
              <th>ADDRESS</th>
              <th>INVITED ON</th>
              {activeTab === 'Invited' ? (
                <>
                  <th style={{ textAlign: 'center', width: '100px' }}>RESEND</th>
                  <th style={{ textAlign: 'center', width: '90px' }}>DELETE</th>
                </>
              ) : (
                <>
                  <th style={{ textAlign: 'center', width: '120px' }}>STATUS</th>
                  <th style={{ textAlign: 'center', width: '130px' }}>ACTIONS</th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {displayedList.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
                  No records found.
                </td>
              </tr>
            ) : (
              displayedList.map((doc, idx) => (
                <tr key={doc.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td className="table-cell-mono" style={{ color: '#64748b' }}>
                    {idx + 1}.
                  </td>
                  <td className="table-cell-mono" style={{ fontWeight: 600 }}>
                    #{doc.docId}
                  </td>
                  <td>
                    <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '14px' }}>
                      {doc.name}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {doc.speciality} • {doc.mobile}
                    </div>
                  </td>
                  <td style={{ fontSize: '13px', color: '#334155' }}>
                    {doc.address}
                  </td>
                  <td style={{ fontSize: '13px', color: '#64748b' }}>
                    {doc.invitedOn}
                  </td>

                  {activeTab === 'Invited' ? (
                    <>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => handleResend(doc)}
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <RefreshCw size={12} />
                          <span>Resend</span>
                        </button>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setDocToDelete(doc)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: '#dc2626',
                            padding: '4px 8px',
                            cursor: 'pointer',
                            fontSize: '12px',
                            fontWeight: 500,
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </>
                  ) : activeTab === 'Access Granted' ? (
                    <>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            backgroundColor: '#dcfce7',
                            color: '#15803d',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          Active
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setDocToRevoke(doc)}
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fecaca',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          Revoke Access
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ textAlign: 'center' }}>
                        <span
                          style={{
                            backgroundColor: '#fee2e2',
                            color: '#dc2626',
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 8px',
                            borderRadius: '4px',
                          }}
                        >
                          Revoked
                        </span>
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        <button
                          type="button"
                          onClick={() => setDocToRestore(doc)}
                          style={{
                            backgroundColor: '#eff6ff',
                            color: '#2563eb',
                            border: '1px solid #bfdbfe',
                            padding: '4px 10px',
                            borderRadius: '4px',
                            fontSize: '12px',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <RotateCcw size={12} />
                          <span>Restore</span>
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal 1: Doctor Invitation Modal */}
      {isInviteModalOpen && (
        <Modal
          isOpen={isInviteModalOpen}
          onClose={() => setIsInviteModalOpen(false)}
          title={`Invite Doctor to Portal: ${customDocName}`}
          size="md"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setIsInviteModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSendInvite}>
                Send Invitation Link
              </Button>
            </div>
          }
        >
          <form onSubmit={handleSendInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 14px', borderRadius: '6px', fontSize: '13px', color: '#166534' }}>
              Doctor will receive a portal activation SMS & Email with a secure single-sign-on token.
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Doctor Full Name"
                value={customDocName}
                onChange={(e) => setCustomDocName(e.target.value)}
                required
              />
              <Input
                label="Speciality / Degree"
                value={customSpeciality}
                onChange={(e) => setCustomSpeciality(e.target.value)}
                required
              />
            </div>

            <Input
              label="Clinic / Hospital Street Address"
              value={customAddress}
              onChange={(e) => setCustomAddress(e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Mobile Number (For SMS Link)"
                value={inviteMobile}
                onChange={(e) => setInviteMobile(e.target.value)}
                required
              />
              <Input
                label="Email (For Portal Credentials)"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Automated Invitation Message
              </label>
              <textarea
                value={inviteSmsPreview}
                onChange={(e) => setInviteSmsPreview(e.target.value)}
                rows={3}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  backgroundColor: '#f8fafc',
                  outline: 'none',
                }}
              />
            </div>
          </form>
        </Modal>
      )}

      {/* Modal 2: Revoke Access Confirmation */}
      <ConfirmationModal
        isOpen={!!docToRevoke}
        onClose={() => setDocToRevoke(null)}
        onConfirm={handleConfirmRevoke}
        title="Revoke Doctor Portal Access"
        message={`Are you sure you want to revoke portal access for "${docToRevoke?.name}"? The doctor will no longer be able to log in or download patient reports.`}
        confirmLabel="Yes, Revoke Access"
        variant="danger"
      />

      {/* Modal 3: Restore Access Confirmation */}
      <ConfirmationModal
        isOpen={!!docToRestore}
        onClose={() => setDocToRestore(null)}
        onConfirm={handleConfirmRestore}
        title="Restore Doctor Portal Access"
        message={`Do you want to re-activate portal credentials for "${docToRestore?.name}"?`}
        confirmLabel="Restore Access"
        variant="info"
      />

      {/* Modal 4: Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!docToDelete}
        onClose={() => setDocToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Doctor Invitation"
        message={`Remove pending invitation record for "${docToDelete?.name}"?`}
        confirmLabel="Delete Invitation"
        variant="danger"
      />
    </div>
  );
};
