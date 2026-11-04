import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Copy, Check, Send, Gift, Users, Award, ExternalLink } from 'lucide-react';

export interface ReferModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const ReferModal: React.FC<ReferModalProps> = ({
  isOpen,
  onClose,
  referralCode = 'LAB3774',
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const referralLink = `https://app.labsmartlis.com/signup?ref=${referralCode}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = encodeURIComponent(
      `Join Labsmart LIS Cloud for your diagnostic lab & pathology center! Sign up using my referral link for a 5-day free trial: ${referralLink}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Refer Labs & Save Rs. 300"
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
            color: '#ffffff',
            borderRadius: '12px',
            padding: '24px 20px',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '12px', borderRadius: '9999px', backgroundColor: 'rgba(255,255,255,0.2)', marginBottom: '12px' }}>
            <Gift size={32} />
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 6px 0' }}>
            Save Rs. 300 on Every Referral
          </h3>
          <p style={{ fontSize: '13px', opacity: 0.9, margin: 0, lineHeight: 1.5 }}>
            Help fellow pathologists and lab owners automate their laboratory with Labsmart LIS.
          </p>
        </div>

        {/* 3 Step Process */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            {
              icon: <Send size={18} color="#2563eb" />,
              title: '1. Invite Labs',
              desc: 'Share your unique referral link or code with any diagnostic lab or pathology center.',
            },
            {
              icon: <Users size={18} color="#16a34a" />,
              title: '2. 5 Days Free Trial',
              desc: 'They get instant access to 5 days free unlimited trial on Labsmart Cloud.',
            },
            {
              icon: <Award size={18} color="#d97706" />,
              title: '3. Rs. 300 Renewal Credit',
              desc: 'When they renew their subscription, you receive Rs. 300 instant credit towards your next invoice.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '14px',
                padding: '12px 14px',
                borderRadius: '8px',
                backgroundColor: '#f8fafc',
                border: '1px solid #f1f5f9',
              }}
            >
              <div style={{ padding: '6px', backgroundColor: '#ffffff', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                {item.icon}
              </div>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b' }}>{item.title}</div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Share Link Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Your Unique Referral Link</label>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input
              type="text"
              readOnly
              value={referralLink}
              style={{
                flex: 1,
                padding: '8px 12px',
                fontSize: '13px',
                backgroundColor: '#f1f5f9',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                color: '#334155',
                fontFamily: 'monospace',
              }}
            />
            <Button variant="secondary" onClick={handleCopy} icon={copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}>
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
        </div>

        {/* WhatsApp & Actions */}
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', paddingTop: '8px' }}>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <button
            type="button"
            onClick={handleWhatsAppShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '9px 18px',
              borderRadius: '6px',
              backgroundColor: '#25D366',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              transition: 'opacity 0.15s ease',
            }}
          >
            <span>Share on WhatsApp</span>
            <ExternalLink size={15} />
          </button>
        </div>
      </div>
    </Modal>
  );
};
