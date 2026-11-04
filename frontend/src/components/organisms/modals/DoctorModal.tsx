import React, { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';

export interface DoctorData {
  id?: number | string;
  name: string;
  qualification: string;
  speciality: string;
  phone: string;
  address: string;
  incentivePercent: string;
}

export interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (doctor: DoctorData) => void;
  initialData?: DoctorData | null;
}

export const DoctorModal: React.FC<DoctorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [formData, setFormData] = useState<DoctorData>({
    name: '',
    qualification: 'MBBS, MD',
    speciality: 'General Medicine',
    phone: '',
    address: '',
    incentivePercent: '15',
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        qualification: 'MBBS, MD',
        speciality: 'General Medicine',
        phone: '',
        address: '',
        incentivePercent: '15',
      });
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Referring Doctor' : 'Add New Referring Doctor'}
      size="md"
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Doctor
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <Input
          label="Doctor Full Name"
          required
          placeholder="e.g. Dr. Anil Verma"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Degree / Qualification"
            placeholder="e.g. MBBS, MD, MS"
            value={formData.qualification}
            onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
          />
          <Input
            label="Medical Speciality"
            placeholder="e.g. Internal Medicine"
            value={formData.speciality}
            onChange={(e) => setFormData({ ...formData, speciality: e.target.value })}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          <Input
            label="Contact Mobile"
            placeholder="+91 9876543210"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            label="Referral Commission (%)"
            type="number"
            placeholder="15"
            value={formData.incentivePercent}
            onChange={(e) => setFormData({ ...formData, incentivePercent: e.target.value })}
          />
        </div>

        <div>
          <label className="form-label">Clinic / Hospital Address</label>
          <textarea
            className="form-input"
            rows={2}
            placeholder="e.g. City Care Clinic, Sector 14"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            style={{ width: '100%', height: 'auto', resize: 'vertical' }}
          />
        </div>
      </form>
    </Modal>
  );
};
