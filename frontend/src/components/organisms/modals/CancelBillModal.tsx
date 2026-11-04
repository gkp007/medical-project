import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { AlertTriangle, Ban } from 'lucide-react';

export interface CancelBillModalProps {
  isOpen: boolean;
  onClose: () => void;
  billData?: {
    id: string;
    regNo: string;
    patientName: string;
    totalAmount: number;
    paidAmount: number;
  } | null;
  onConfirmCancel?: (billId: string, reason: string, refundAmount: number) => void;
}

export const CancelBillModal: React.FC<CancelBillModalProps> = ({
  isOpen,
  onClose,
  billData,
  onConfirmCancel,
}) => {
  const [reason, setReason] = useState('Patient cancelled test');
  const [notes, setNotes] = useState('');
  const [issueRefund, setIssueRefund] = useState(true);

  if (!isOpen || !billData) return null;

  const handleCancelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onConfirmCancel) {
      onConfirmCancel(billData.id, reason, issueRefund ? billData.paidAmount : 0);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel & Void Case Bill"
      maxWidth="500px"
    >
      <form onSubmit={handleCancelSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '12px 14px',
          }}
        >
          <AlertTriangle size={22} color="#dc2626" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div style={{ fontSize: '13px', color: '#991b1b', lineHeight: 1.5 }}>
            You are about to cancel bill <strong>#{billData.regNo}</strong> for <strong>{billData.patientName}</strong>. 
            Once cancelled, tests will be removed from pending worklists.
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Reason for Cancellation <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <select
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            style={{
              width: '100%',
              height: '38px',
              padding: '0 10px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              fontSize: '13px',
            }}
          >
            <option>Patient cancelled test / Left without giving sample</option>
            <option>Duplicate bill registered by mistake</option>
            <option>Wrong investigations selected</option>
            <option>Specimen rejected / Hemolyzed (No re-collection)</option>
            <option>Billing clerical error / Price adjustment</option>
            <option>Other reason</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Additional Remarks
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add specific notes for audit records..."
            style={{
              width: '100%',
              padding: '8px 10px',
              fontSize: '13px',
              borderRadius: '6px',
              border: '1px solid #cbd5e1',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {billData.paidAmount > 0 && (
          <div style={{ backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={issueRefund}
                onChange={(e) => setIssueRefund(e.target.checked)}
              />
              <span>Issue full cashier refund of <strong>Rs. {billData.paidAmount}</strong></span>
            </label>
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Back
          </Button>
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 16px',
              borderRadius: '6px',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Ban size={15} />
            Confirm Cancellation
          </button>
        </div>
      </form>
    </Modal>
  );
};
