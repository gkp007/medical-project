import React, { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Banknote, CreditCard, Smartphone, CheckCircle2, Printer, AlertCircle } from 'lucide-react';

export interface AcceptDueModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseData?: {
    id: string;
    regNo: string;
    patientName: string;
    date: string;
    dueAmount: number;
    phone?: string;
  } | null;
  onCollectSuccess?: (collectedAmount: number, paymentMode: string) => void;
}

export const AcceptDueModal: React.FC<AcceptDueModalProps> = ({
  isOpen,
  onClose,
  caseData,
  onCollectSuccess,
}) => {
  const [amount, setAmount] = useState<number>(caseData?.dueAmount || 0);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'UPI' | 'Card' | 'Cheque'>('Cash');
  const [referenceNo, setReferenceNo] = useState('');
  const [printReceipt, setPrintReceipt] = useState(true);
  const [sendSms, setSendSms] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (caseData) {
      setAmount(caseData.dueAmount);
      setIsSuccess(false);
      setReferenceNo('');
    }
  }, [caseData]);

  if (!isOpen || !caseData) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    setTimeout(() => {
      if (onCollectSuccess) {
        onCollectSuccess(amount, paymentMode);
      }
      onClose();
    }, 1200);
  };

  const remainingAfterPayment = Math.max(0, caseData.dueAmount - amount);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Accept Patient Due Payment"
      maxWidth="540px"
    >
      {isSuccess ? (
        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#16a34a', marginBottom: '16px' }}>
            <CheckCircle2 size={40} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Payment Collected Successfully!</h3>
          <p style={{ fontSize: '14px', color: '#64748b', margin: 0 }}>
            Receipt of <strong>Rs. {amount}</strong> recorded for <strong>{caseData.patientName}</strong> (Reg. {caseData.regNo}).
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Patient Details Callout Card */}
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '14px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '15px', fontWeight: 700, color: '#1e293b' }}>
                {caseData.patientName}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                Reg. {caseData.regNo} &bull; Date: {caseData.date}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: '#64748b', textTransform: 'uppercase' }}>Current Due</div>
              <div style={{ fontSize: '18px', fontWeight: 800, color: '#b91c1c' }}>
                Rs. {caseData.dueAmount}
              </div>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
              Amount to Collect (Rs.) <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <Input
              type="number"
              min={1}
              max={caseData.dueAmount}
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
              autoFocus
            />
            {remainingAfterPayment > 0 && (
              <p style={{ fontSize: '12px', color: '#d97706', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <AlertCircle size={14} /> Remaining balance after this receipt: <strong>Rs. {remainingAfterPayment}</strong>
              </p>
            )}
          </div>

          {/* Payment Mode Segmented Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
              Payment Method
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {[
                { id: 'Cash', label: 'Cash', icon: <Banknote size={15} /> },
                { id: 'UPI', label: 'UPI / QR', icon: <Smartphone size={15} /> },
                { id: 'Card', label: 'Card', icon: <CreditCard size={15} /> },
                { id: 'Cheque', label: 'Cheque', icon: <Printer size={15} /> },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setPaymentMode(mode.id as any)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: paymentMode === mode.id ? '1px solid #2563eb' : '1px solid #cbd5e1',
                    backgroundColor: paymentMode === mode.id ? '#eff6ff' : '#ffffff',
                    color: paymentMode === mode.id ? '#1d4ed8' : '#475569',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {mode.icon}
                  <span>{mode.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Optional Reference */}
          {paymentMode !== 'Cash' && (
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                Transaction Ref / UTR / Approval No.
              </label>
              <Input
                placeholder="e.g. UPI Ref # 32904810294"
                value={referenceNo}
                onChange={(e) => setReferenceNo(e.target.value)}
              />
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '4px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={printReceipt}
                onChange={(e) => setPrintReceipt(e.target.checked)}
              />
              <span>Print thermal payment receipt immediately</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sendSms}
                onChange={(e) => setSendSms(e.target.checked)}
              />
              <span>Send SMS payment receipt to patient mobile</span>
            </label>
          </div>

          {/* Footer Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
            <Button variant="secondary" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={amount <= 0}>
              Accept Rs. {amount} &amp; Update
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
