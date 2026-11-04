import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { Modal } from '../../components/atoms/Modal';
import { ConfirmationModal } from '../../components/organisms/modals/ConfirmationModal';
import {
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Upload,
  Eye,
  Star,
  Award,
  FileCheck2,
} from 'lucide-react';

export interface USGSignatory {
  id: string;
  name: string;
  qualification: string;
  regNo: string;
  council: string;
  stampTitle: string;
  isDefault: boolean;
  signatureText: string;
  sealType: 'circular' | 'horizontal';
  phone?: string;
}

export const USGSignaturesPage: React.FC = () => {
  const [signatories, setSignatories] = useState<USGSignatory[]>([
    {
      id: '1',
      name: 'Dr. S. K. Verma',
      qualification: 'MBBS, MD Radiodiagnosis (AIIMS)',
      regNo: 'DMC-29104',
      council: 'Delhi Medical Council',
      stampTitle: 'Chief Consultant Radiologist & Head of Sonography',
      isDefault: true,
      signatureText: 'Dr. S. K. Verma',
      sealType: 'circular',
      phone: '+91 98100 23456',
    },
    {
      id: '2',
      name: 'Dr. Neha Agarwal',
      qualification: 'MBBS, DMRD (Radiodiagnosis)',
      regNo: 'UPMC-84192',
      council: 'Uttar Pradesh Medical Council',
      stampTitle: 'Consultant Radiologist & Fetal Medicine Specialist',
      isDefault: false,
      signatureText: 'Dr. Neha Agarwal',
      sealType: 'horizontal',
      phone: '+91 98450 78120',
    },
    {
      id: '3',
      name: 'Dr. Arvind Swaminathan',
      qualification: 'MBBS, DNB (Radio-Diagnosis), FRCR',
      regNo: 'MCI-19482',
      council: 'Medical Council of India',
      stampTitle: 'Senior Consultant Radiologist',
      isDefault: false,
      signatureText: 'Dr. A. Swaminathan',
      sealType: 'circular',
      phone: '+91 98200 45192',
    },
  ]);

  const [activeModal, setActiveModal] = useState<'upload' | 'edit' | 'preview_stamp' | null>(null);
  const [selectedSignatory, setSelectedSignatory] = useState<USGSignatory | null>(null);
  const [signatoryToDelete, setSignatoryToDelete] = useState<USGSignatory | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formQual, setFormQual] = useState('');
  const [formRegNo, setFormRegNo] = useState('');
  const [formCouncil, setFormCouncil] = useState('Delhi Medical Council');
  const [formStampTitle, setFormStampTitle] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [formSealType, setFormSealType] = useState<'circular' | 'horizontal'>('circular');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenUpload = () => {
    setFormName('');
    setFormQual('MBBS, MD Radiodiagnosis');
    setFormRegNo('');
    setFormCouncil('Delhi Medical Council');
    setFormStampTitle('Consulting Radiologist');
    setFormIsDefault(false);
    setFormSealType('circular');
    setActiveModal('upload');
  };

  const handleOpenEdit = (s: USGSignatory) => {
    setSelectedSignatory(s);
    setFormName(s.name);
    setFormQual(s.qualification);
    setFormRegNo(s.regNo);
    setFormCouncil(s.council);
    setFormStampTitle(s.stampTitle);
    setFormIsDefault(s.isDefault);
    setFormSealType(s.sealType);
    setActiveModal('edit');
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const newSignatory: USGSignatory = {
      id: String(Date.now()),
      name: formName,
      qualification: formQual,
      regNo: formRegNo || 'MCI-00000',
      council: formCouncil,
      stampTitle: formStampTitle,
      isDefault: formIsDefault,
      signatureText: formName,
      sealType: formSealType,
    };

    let updatedList = signatories;
    if (formIsDefault) {
      updatedList = signatories.map((s) => ({ ...s, isDefault: false }));
    }

    setSignatories([...updatedList, newSignatory]);
    setActiveModal(null);
    showToast(`Digital signature added for ${formName}`);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSignatory || !formName.trim()) return;

    setSignatories((prev) =>
      prev.map((s) => {
        if (s.id === selectedSignatory.id) {
          return {
            ...s,
            name: formName,
            qualification: formQual,
            regNo: formRegNo,
            council: formCouncil,
            stampTitle: formStampTitle,
            isDefault: formIsDefault,
            signatureText: formName,
            sealType: formSealType,
          };
        }
        return formIsDefault ? { ...s, isDefault: false } : s;
      })
    );
    setActiveModal(null);
    showToast(`Updated doctor stamp for ${formName}`);
  };

  const handleSetDefault = (id: string) => {
    setSignatories((prev) =>
      prev.map((s) => ({ ...s, isDefault: s.id === id }))
    );
    showToast('Default signatory updated.');
  };

  const handleConfirmDelete = () => {
    if (!signatoryToDelete) return;
    setSignatories((prev) => prev.filter((s) => s.id !== signatoryToDelete.id));
    showToast(`Signatory ${signatoryToDelete.name} deleted.`);
    setSignatoryToDelete(null);
  };

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
            gap: '10px',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '20px',
        }}
      >
        <div>
          <h2 className="h1-title" style={{ margin: 0 }}>
            USG Doctor Signatures & Seals
          </h2>
          <p className="text-muted" style={{ margin: '4px 0 0 0', fontSize: '13px' }}>
            Authorized digital signatures, Medical Council registration seals, and medico-legal authentication for Sonologists.
          </p>
        </div>

        <Button variant="primary" icon={<Plus size={16} />} onClick={handleOpenUpload}>
          + Upload Signature
        </Button>
      </div>

      {/* Statutory Regulatory Notice */}
      <div
        style={{
          backgroundColor: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '8px',
          padding: '14px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px',
        }}
      >
        <ShieldCheck size={20} color="#2563eb" style={{ marginTop: '2px', flexShrink: 0 }} />
        <div style={{ fontSize: '13px', color: '#1e3a8a', lineHeight: 1.5 }}>
          <strong>PNDT & Medical Council Compliance:</strong> All sonography reports issued through Labsmart LIS require the registered Medical Council number and digital authorization of a qualified Radiologist (MD/DNB/DMRD). Signatures set as default are automatically embedded onto all finalized ultrasound reports.
        </div>
      </div>

      {/* Signatories List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        {signatories.map((sig) => (
          <Card key={sig.id} style={{ padding: '22px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '20px',
              }}
            >
              {/* Left: Signature Preview Canvas & Doctor Info */}
              <div style={{ display: 'flex', gap: '22px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Visual Signature & Seal Stamp Preview Box */}
                <div
                  style={{
                    width: '180px',
                    height: '84px',
                    border: '1px dashed #94a3b8',
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Caveat, cursive, Brush Script MT, sans-serif',
                      fontSize: '22px',
                      color: '#1e3a8a',
                      fontWeight: 700,
                      transform: 'rotate(-4deg)',
                    }}
                  >
                    {sig.signatureText}
                  </div>
                  <div
                    style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#64748b',
                      borderTop: '1px solid #cbd5e1',
                      paddingTop: '2px',
                      marginTop: '4px',
                      textTransform: 'uppercase',
                    }}
                  >
                    {sig.regNo}
                  </div>
                </div>

                {/* Doctor Bio Details */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                      {sig.name}
                    </h3>
                    <span
                      style={{
                        fontSize: '12px',
                        color: '#475569',
                        fontWeight: 600,
                      }}
                    >
                      {sig.qualification}
                    </span>
                    {sig.isDefault && (
                      <Badge variant="success">
                        ★ Default Signatory
                      </Badge>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', fontSize: '13px', color: '#334155' }}>
                    <span>
                      Registration No: <strong style={{ color: '#0f172a' }}>{sig.regNo}</strong> ({sig.council})
                    </span>
                    <span>•</span>
                    <span style={{ color: '#64748b' }}>{sig.stampTitle}</span>
                  </div>

                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px' }}>
                    Stamp Layout: {sig.sealType === 'circular' ? 'Circular Doctor Seal' : 'Standard Linear Seal'} • Transparent PNG Active
                  </div>
                </div>
              </div>

              {/* Right: Actions */}
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!sig.isDefault ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={<Star size={13} />}
                    onClick={() => handleSetDefault(sig.id)}
                  >
                    Make Default
                  </Button>
                ) : (
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#15803d',
                      padding: '4px 10px',
                      backgroundColor: '#dcfce7',
                      borderRadius: '6px',
                    }}
                  >
                    Active on Reports
                  </span>
                )}

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Eye size={13} />}
                  onClick={() => {
                    setSelectedSignatory(sig);
                    setActiveModal('preview_stamp');
                  }}
                  title="Preview Stamp Layout"
                >
                  Preview Seal
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  icon={<Edit3 size={13} />}
                  onClick={() => handleOpenEdit(sig)}
                  title="Edit Stamp"
                >
                  Change Stamp
                </Button>

                {signatories.length > 1 && (
                  <Button
                    variant="secondary"
                    size="sm"
                    style={{ color: '#dc2626' }}
                    icon={<Trash2 size={13} />}
                    onClick={() => setSignatoryToDelete(sig)}
                    title="Remove Signatory"
                  />
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* MODAL 1: Upload / Edit Signatory Modal */}
      {(activeModal === 'upload' || activeModal === 'edit') && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={activeModal === 'upload' ? 'Upload Sonologist Digital Signature & Seal' : `Edit Seal: ${formName}`}
          size="md"
          footer={
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={() => setActiveModal(null)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={activeModal === 'upload' ? handleSaveUpload : handleSaveEdit}>
                {activeModal === 'upload' ? 'Save Signatory' : 'Update Seal'}
              </Button>
            </div>
          }
        >
          <form style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <Input
              label="Doctor Full Name (with Dr. prefix)"
              placeholder="e.g. Dr. S. K. Verma"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              required
            />

            <Input
              label="Medical Qualifications & Degrees"
              placeholder="e.g. MBBS, MD Radiodiagnosis"
              value={formQual}
              onChange={(e) => setFormQual(e.target.value)}
              required
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <Input
                label="Registration Number"
                placeholder="e.g. DMC-29104"
                value={formRegNo}
                onChange={(e) => setFormRegNo(e.target.value)}
                required
              />
              <Input
                label="State Medical Council"
                placeholder="e.g. Delhi Medical Council"
                value={formCouncil}
                onChange={(e) => setFormCouncil(e.target.value)}
              />
            </div>

            <Input
              label="Designation / Official Stamp Title"
              placeholder="e.g. Chief Consultant Radiologist"
              value={formStampTitle}
              onChange={(e) => setFormStampTitle(e.target.value)}
            />

            <div
              style={{
                border: '1px dashed #94a3b8',
                padding: '16px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
              }}
            >
              <Upload size={24} color="#64748b" style={{ margin: '0 auto 6px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: 600 }}>Upload Signature Image (PNG / JPEG)</div>
              <p className="text-caption" style={{ margin: '2px 0 8px 0' }}>
                Transparent background recommended for official reports (Max 2MB)
              </p>
              <input type="file" style={{ fontSize: '12px' }} />
            </div>

            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '13px',
                cursor: 'pointer',
                fontWeight: 600,
                marginTop: '4px',
              }}
            >
              <input
                type="checkbox"
                checked={formIsDefault}
                onChange={(e) => setFormIsDefault(e.target.checked)}
              />
              <span>Set as default signatory on all new USG reports</span>
            </label>
          </form>
        </Modal>
      )}

      {/* MODAL 2: Preview Stamp Layout */}
      {activeModal === 'preview_stamp' && selectedSignatory && (
        <Modal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          title={`Doctor Seal & Stamp Preview: ${selectedSignatory.name}`}
          size="md"
          footer={
            <Button variant="primary" onClick={() => setActiveModal(null)}>
              Done
            </Button>
          }
        >
          <div
            style={{
              padding: '28px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '8px',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '14px' }}>
              Report Footer Appearance
            </div>

            <div
              style={{
                display: 'inline-block',
                border: '2px solid #1e3a8a',
                padding: '16px 28px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
              }}
            >
              <div
                style={{
                  fontFamily: 'Caveat, cursive, Brush Script MT, sans-serif',
                  fontSize: '26px',
                  color: '#1e3a8a',
                  fontWeight: 700,
                  marginBottom: '4px',
                }}
              >
                {selectedSignatory.signatureText}
              </div>
              <div style={{ borderTop: '1.5px solid #1e3a8a', width: '220px', margin: '6px auto' }} />
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                {selectedSignatory.name}
              </div>
              <div style={{ fontSize: '11px', color: '#334155', fontWeight: 600 }}>
                {selectedSignatory.qualification}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b' }}>
                Reg. No: {selectedSignatory.regNo} ({selectedSignatory.council})
              </div>
              <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: 600, marginTop: '2px' }}>
                {selectedSignatory.stampTitle}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* MODAL 3: Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!signatoryToDelete}
        onClose={() => setSignatoryToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Remove Sonologist Signatory"
        message={`Are you sure you want to remove the digital stamp for ${signatoryToDelete?.name}?`}
        confirmLabel="Yes, Remove"
        variant="danger"
      />
    </div>
  );
};
