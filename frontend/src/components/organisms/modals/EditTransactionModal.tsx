import React, { useState, useEffect } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Banknote, CreditCard, Smartphone, CheckCircle2, ShieldCheck } from 'lucide-react';

export interface TransactionData {
  date: string;
  time: string;
  amount: number;
  receivedBy: string;
  mode: string;
}

export interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: TransactionData | null;
  onSave: (updated: TransactionData) => void;
}

export const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
  onSave,
}) => {
  const [mode, setMode] = useState('Cash');
  const [amount, setAmount] = useState(200);
  const [receivedBy, setReceivedBy] = useState('Bimal Meher');

  useEffect(() => {
    if (transaction) {
      setMode(transaction.mode || 'Cash');
      setAmount(transaction.amount || 200);
      setReceivedBy(transaction.receivedBy || 'Bimal Meher');
    }
  }, [transaction]);

  if (!isOpen || !transaction) return null;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...transaction,
      mode,
      amount,
      receivedBy,
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Payment Transaction" maxWidth="480px">
      <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Payment Mode
          </label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {['Cash', 'UPI', 'Card', 'Cheque'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                style={{
                  padding: '8px 4px',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: mode === m ? '1px solid #2563eb' : '1px solid #cbd5e1',
                  backgroundColor: mode === m ? '#eff6ff' : '#ffffff',
                  color: mode === m ? '#1d4ed8' : '#475569',
                  textAlign: 'center',
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Amount (Rs.)
          </label>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
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

        <div>
          <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
            Received By
          </label>
          <input
            type="text"
            value={receivedBy}
            onChange={(e) => setReceivedBy(e.target.value)}
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

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
          <Button variant="secondary" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
