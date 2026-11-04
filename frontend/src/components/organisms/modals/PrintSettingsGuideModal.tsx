import React from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Printer, Settings, CheckCircle2 } from 'lucide-react';

export interface PrintSettingsGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrintSettingsGuideModal: React.FC<PrintSettingsGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Print Settings Guide" maxWidth="560px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13px', color: '#334155' }}>
        <p style={{ margin: 0 }}>
          To print receipt receipts accurately on your thermal or standard desktop printer, ensure the following print dialog settings in Google Chrome or Microsoft Edge:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              1. Paper Size &amp; Orientation
            </h4>
            <p style={{ margin: 0, color: '#64748b' }}>
              Select <strong>A5</strong> or <strong>A4</strong> matching your paper stock. Set orientation to <strong>Portrait</strong>.
            </p>
          </div>

          <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              2. Margins
            </h4>
            <p style={{ margin: 0, color: '#64748b' }}>
              In More Settings &gt; Margins, choose <strong>Minimum</strong> or <strong>None</strong> to prevent extra white padding around the receipt borders.
            </p>
          </div>

          <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              3. Headers and Footers
            </h4>
            <p style={{ margin: 0, color: '#64748b' }}>
              <strong>Uncheck</strong> "Headers and footers" to avoid browser date, time, and URL links printing at the corners.
            </p>
          </div>

          <div style={{ padding: '12px', border: '1px solid #e2e8f0', borderRadius: '6px', backgroundColor: '#f8fafc' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700, color: '#0f172a' }}>
              4. Background Graphics
            </h4>
            <p style={{ margin: 0, color: '#64748b' }}>
              <strong>Check</strong> "Background graphics" so table borders, shading, and logo banners print sharply in color/grayscale.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
          <Button variant="primary" onClick={onClose}>
            Got It
          </Button>
        </div>
      </div>
    </Modal>
  );
};
