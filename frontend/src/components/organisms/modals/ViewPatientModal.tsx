import React from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { User, Phone, Mail, MapPin, Calendar, CreditCard, Clock } from 'lucide-react';
import { PatientDetailsData } from './UpdatePatientDetailsModal';

export interface ViewPatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: PatientDetailsData;
  regNo: string;
  onEditClick: () => void;
}

export const ViewPatientModal: React.FC<ViewPatientModalProps> = ({
  isOpen,
  onClose,
  patient,
  regNo,
  onEditClick,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Patient Information" maxWidth="520px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Patient Profile Card */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#eff6ff', color: '#2563eb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '18px' }}>
            {patient.firstName.charAt(0)}
          </div>
          <div>
            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              {patient.title} {patient.firstName} {patient.lastName}
            </h3>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '2px 0 0 0' }}>
              Reg No: <strong>#{regNo}</strong> &bull; Sex: {patient.sex} &bull; Age: {patient.ageYears} Y {patient.ageMonths} M
            </p>
          </div>
        </div>

        {/* Details List */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13px' }}>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Mobile Number</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{patient.mobile || 'Not Available'}</span>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Email Address</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{patient.email || 'Not Available'}</span>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Aadhaar / ID</span>
            <span style={{ fontWeight: 600, color: '#1e293b' }}>{patient.aadhaar || 'Not Available'}</span>
          </div>
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Online Reports</span>
            <span style={{ fontWeight: 600, color: patient.onlineReportRequested ? '#15803d' : '#64748b' }}>
              {patient.onlineReportRequested ? 'Requested (SMS/Email)' : 'Not Opted'}
            </span>
          </div>
        </div>

        <div>
          <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Residential Address</span>
          <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#1e293b' }}>{patient.address || 'Not Available'}</p>
        </div>

        {patient.patientHistory && (
          <div>
            <span style={{ color: '#64748b', display: 'block', fontSize: '11px', textTransform: 'uppercase', fontWeight: 600 }}>Clinical Remarks / History</span>
            <div style={{ marginTop: '4px', padding: '10px 12px', backgroundColor: '#fffbeb', border: '1px solid #fef3c7', borderRadius: '6px', fontSize: '12px', color: '#92400e' }}>
              {patient.patientHistory}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={() => { onClose(); onEditClick(); }}>
            Edit Patient Details
          </Button>
        </div>
      </div>
    </Modal>
  );
};
