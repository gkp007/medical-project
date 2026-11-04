import React from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

export interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'danger',
}) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertTriangle size={32} color="#dc2626" />;
      case 'warning':
        return <AlertCircle size={32} color="#d97706" />;
      default:
        return <Info size={32} color="#2563eb" />;
    }
  };

  const getConfirmStyle = () => {
    if (variant === 'danger') {
      return {
        backgroundColor: '#dc2626',
        color: '#ffffff',
        border: 'none',
      };
    }
    return {};
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={onClose}>
            {cancelLabel}
          </Button>
          <button
            type="button"
            className="btn btn-primary"
            style={getConfirmStyle()}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            {confirmLabel}
          </button>
        </div>
      }
    >
      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0, marginTop: '2px' }}>{getIcon()}</div>
        <div>
          <p style={{ fontSize: '14px', color: '#334155', lineHeight: 1.5, margin: 0 }}>
            {message}
          </p>
        </div>
      </div>
    </Modal>
  );
};
