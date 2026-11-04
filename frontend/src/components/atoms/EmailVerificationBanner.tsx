import React, { useState } from 'react';
import { AlertTriangle, X, CheckCircle, MailCheck } from 'lucide-react';
import { authApi } from '../../services/api';

export interface EmailVerificationBannerProps {
  userEmail?: string;
  isVerified?: boolean;
  onContinue?: () => void;
}

export const EmailVerificationBanner: React.FC<EmailVerificationBannerProps> = ({
  userEmail = 'gkpattanaik001@gmail.com',
  isVerified = false,
  onContinue
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sentMessage, setSentMessage] = useState('');

  if (dismissed || isVerified) return null;

  const handleSend = async () => {
    if (onContinue) {
      onContinue();
      return;
    }

    setIsSending(true);
    try {
      const res = await authApi.sendVerificationEmail(userEmail);
      if (res.success) {
        setSentMessage(`Verification email dispatched to ${userEmail}! Please check your inbox.`);
      } else {
        alert(res.message || 'Failed to dispatch verification email');
      }
    } catch {
      alert('Network error dispatching verification email');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: sentMessage ? '#ecfdf5' : '#fef9c3',
        borderBottom: `1px solid ${sentMessage ? '#a7f3d0' : '#fef08a'}`,
        padding: '10px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '13px',
        color: sentMessage ? '#065f46' : '#854d0e',
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        transition: 'background-color 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
        {sentMessage ? (
          <MailCheck size={18} color="#059669" style={{ flexShrink: 0 }} />
        ) : (
          <AlertTriangle size={18} color="#ca8a04" style={{ flexShrink: 0 }} />
        )}
        <div>
          {sentMessage ? (
            <span><strong>Dispatched!</strong> {sentMessage}</span>
          ) : (
            <>
              <strong style={{ color: '#713f12', marginRight: '6px' }}>Email verification pending</strong>
              <span>
                Kindly verify your email ({userEmail}), verified email allows you to smoothly receive reports, summaries & OTPs from our end.
              </span>
            </>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {!sentMessage && (
          <button
            type="button"
            onClick={handleSend}
            disabled={isSending}
            style={{
              padding: '4px 14px',
              backgroundColor: '#ffffff',
              border: '1px solid #cbd5e1',
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              color: '#1e293b',
              cursor: isSending ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
          >
            {isSending ? 'Sending...' : 'Continue'}
          </button>
        )}
        <button
          type="button"
          onClick={() => setDismissed(true)}
          style={{
            background: 'none',
            border: 'none',
            color: sentMessage ? '#059669' : '#a16207',
            cursor: 'pointer',
            padding: '2px',
            display: 'flex',
            alignItems: 'center',
          }}
          title="Dismiss"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  );
};
