import React, { useState } from 'react';
import { Lock, Unlock, LogOut, AlertCircle, ShieldAlert } from 'lucide-react';
import { authApi } from '../../../services/api';

interface TerminalLockModalProps {
  user: any;
  onUnlock: () => void;
  onSignOut: () => void;
}

export const TerminalLockModal: React.FC<TerminalLockModalProps> = ({
  user,
  onUnlock,
  onSignOut
}) => {
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [isUnlocking, setIsUnlocking] = useState(false);

  const handleUnlock = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 4-digit PIN or password');
      return;
    }

    setIsUnlocking(true);
    setError('');

    try {
      const res = await authApi.unlockTerminal(pin.trim());
      if (res.success) {
        onUnlock();
      } else {
        setError(res.message || 'Incorrect PIN or password. (Default PIN: 1234)');
      }
    } catch (err: any) {
      setError(err.message || 'Verification failed. Try again.');
    } finally {
      setIsUnlocking(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(11, 19, 41, 0.88)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      zIndex: 99999,
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: '#ffffff',
        borderRadius: '20px',
        padding: '32px 28px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
        textAlign: 'center',
        position: 'relative'
      }}>
        {/* Lock Icon */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: '#fef2f2',
          border: '2px solid #fee2e2',
          color: '#ef4444',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
        }}>
          <Lock size={32} />
        </div>

        <h2 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
          Terminal Screen Locked
        </h2>
        <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#64748b' }}>
          Session paused to protect patient clinical confidentiality.
        </p>

        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 14px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          marginBottom: '20px',
          textAlign: 'left'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: '#0284c7',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '15px'
          }}>
            {user?.fullName?.charAt(0) || 'A'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user?.fullName || 'Administrator'}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {user?.role || 'Staff'} • Terminal Main
            </div>
          </div>
        </div>

        {error && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 12px',
            borderRadius: '8px',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            color: '#b91c1c',
            fontSize: '12px',
            marginBottom: '16px',
            textAlign: 'left'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleUnlock}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '6px', textAlign: 'left' }}>
              Enter 4-Digit Unlock PIN or Password:
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Default PIN: 1234"
              autoFocus
              maxLength={20}
              style={{
                width: '100%',
                boxSizing: 'border-box',
                padding: '12px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                fontSize: '16px',
                textAlign: 'center',
                letterSpacing: '3px',
                fontWeight: 700,
                outline: 'none',
                color: '#0f172a'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isUnlocking}
            style={{
              width: '100%',
              padding: '12px 18px',
              borderRadius: '10px',
              border: 'none',
              background: '#0284c7',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 700,
              cursor: isUnlocking ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '10px',
              boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)'
            }}
          >
            <Unlock size={16} />
            <span>{isUnlocking ? 'Unlocking...' : 'Unlock Terminal'}</span>
          </button>
        </form>

        <button
          type="button"
          onClick={onSignOut}
          style={{
            width: '100%',
            padding: '10px 18px',
            borderRadius: '10px',
            border: '1px solid #e2e8f0',
            background: '#ffffff',
            color: '#64748b',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={15} />
          <span>Sign Out completely</span>
        </button>
      </div>
    </div>
  );
};
