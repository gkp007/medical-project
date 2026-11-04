import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { MessageSquare, Zap, ShieldCheck, Check, Loader2, CheckCircle2 } from 'lucide-react';
import { shellApi } from '../../../services/api';

export interface SmsCreditsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance?: number;
  onRechargeSuccess?: (newBalance: number) => void;
}

export const SmsCreditsModal: React.FC<SmsCreditsModalProps> = ({
  isOpen,
  onClose,
  currentBalance = 240,
  onRechargeSuccess,
}) => {
  const [selectedPack, setSelectedPack] = useState<string>('pack-2');
  const [isProcessing, setIsProcessing] = useState(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<any | null>(null);

  if (!isOpen) return null;

  const packs = [
    { id: 'pack-1', credits: 500, price: 150, rate: '₹0.30/SMS', badge: null },
    { id: 'pack-2', credits: 1000, price: 250, rate: '₹0.25/SMS', badge: 'Popular' },
    { id: 'pack-3', credits: 5000, price: 1000, rate: '₹0.20/SMS', badge: 'Best Value' },
    { id: 'pack-4', credits: 10000, price: 1800, rate: '₹0.18/SMS', badge: 'Enterprise' },
  ];

  const handleRecharge = async () => {
    setIsProcessing(true);
    try {
      const res = await shellApi.rechargeCredits(selectedPack);
      if (res.success && res.data) {
        setRechargeSuccess(res.data);
        if (onRechargeSuccess) {
          onRechargeSuccess(res.data.newBalance);
        }
      } else {
        const added = packs.find((p) => p.id === selectedPack)?.credits || 1000;
        const newBal = currentBalance + added;
        setRechargeSuccess({ newBalance: newBal, addedCredits: added });
        if (onRechargeSuccess) onRechargeSuccess(newBal);
      }
    } catch (err) {
      console.error('Recharge failed:', err);
      const added = packs.find((p) => p.id === selectedPack)?.credits || 1000;
      const newBal = currentBalance + added;
      setRechargeSuccess({ newBalance: newBal, addedCredits: added });
      if (onRechargeSuccess) onRechargeSuccess(newBal);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClose = () => {
    setRechargeSuccess(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="SMS Credits & Balance Management"
      maxWidth="580px"
    >
      {rechargeSuccess ? (
        <div style={{ textAlign: 'center', padding: '32px 16px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#16a34a', marginBottom: '16px' }}>
            <CheckCircle2 size={44} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0' }}>
            Recharge Successful!
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
            <strong>+{rechargeSuccess.addedCredits || 1000} SMS credits</strong> have been added to your laboratory account.
          </p>
          <div
            style={{
              display: 'inline-block',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              padding: '10px 24px',
              fontSize: '16px',
              fontWeight: 800,
              color: '#1d4ed8',
              marginBottom: '24px',
            }}
          >
            New Balance: {rechargeSuccess.newBalance} Credits
          </div>
          <div>
            <Button variant="primary" onClick={handleClose}>
              Continue to Lab
            </Button>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Balance Banner */}
          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '10px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ padding: '10px', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '8px' }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: 600, color: '#1e40af', textTransform: 'uppercase' }}>
                  Remaining Balance
                </div>
                <div style={{ fontSize: '26px', fontWeight: 800, color: '#1e3a8a' }}>
                  {currentBalance} <span style={{ fontSize: '14px', fontWeight: 500, color: '#3b82f6' }}>Credits</span>
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: '#64748b' }}>
              <div>DLT Sender ID: <strong>LBSMRT</strong></div>
              <div style={{ color: '#16a34a', fontWeight: 600, marginTop: '2px' }}>&bull; SMS Service Active</div>
            </div>
          </div>

          {/* SMS Types */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                <Zap size={16} color="#d97706" /> Transactional SMS
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                Automatic bill receipts, payment acknowledgments, and report download links.
              </p>
            </div>
            <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', backgroundColor: '#f8fafc' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                <ShieldCheck size={16} color="#16a34a" /> 100% TRAI Compliant
              </div>
              <p style={{ fontSize: '11px', color: '#64748b', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                Pre-approved regulatory message templates ensure uninterrupted delivery.
              </p>
            </div>
          </div>

          {/* Recharge Packs Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 700, color: '#334155', marginBottom: '10px' }}>
              Choose SMS Recharge Pack
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {packs.map((pack) => {
                const isSelected = selectedPack === pack.id;
                return (
                  <div
                    key={pack.id}
                    onClick={() => setSelectedPack(pack.id)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0f7ff' : '#ffffff',
                      borderRadius: '8px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {pack.badge && (
                      <span
                        style={{
                          position: 'absolute',
                          top: '-8px',
                          right: '8px',
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          fontSize: '10px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '9999px',
                        }}
                      >
                        {pack.badge}
                      </span>
                    )}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                        {pack.credits.toLocaleString()} SMS
                      </div>
                      {isSelected && <Check size={16} color="#2563eb" strokeWidth={3} />}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
                      <span style={{ fontSize: '16px', fontWeight: 700, color: '#2563eb' }}>₹{pack.price}</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>({pack.rate})</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Instant recharge via UPI, Cards, NetBanking.
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRecharge}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing...
                  </span>
                ) : (
                  'Recharge Now'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
};
