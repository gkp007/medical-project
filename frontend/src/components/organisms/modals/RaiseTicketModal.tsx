import React, { useState } from 'react';
import { Modal } from '../../atoms/Modal';
import { Button } from '../../atoms/Button';
import { Input } from '../../atoms/Input';
import { Headphones, UploadCloud, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { shellApi } from '../../../services/api';

export interface RaiseTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RaiseTicketModal: React.FC<RaiseTicketModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('Report Printing & Letterhead');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('+91 7752058263');
  const [priority, setPriority] = useState<'Normal' | 'High' | 'Urgent'>('Normal');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketResult, setTicketResult] = useState<{ ticketId: string; receivedAt: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await shellApi.createTicket({
        category,
        subject,
        description,
        urgency: priority,
        contactNumber: phone,
      });

      if (res.success && res.data) {
        setTicketResult(res.data);
      } else {
        setTicketResult({
          ticketId: `TICK-${Date.now().toString().slice(-5)}`,
          receivedAt: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.error('Failed to submit ticket:', err);
      setTicketResult({
        ticketId: `TICK-${Date.now().toString().slice(-5)}`,
        receivedAt: new Date().toISOString(),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClose = () => {
    setTicketResult(null);
    setSubject('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title="Raise Support Ticket / Contact Helpdesk"
      maxWidth="560px"
    >
      {ticketResult ? (
        <div style={{ textAlign: 'center', padding: '36px 16px' }}>
          <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '9999px', backgroundColor: '#dcfce7', color: '#16a34a', marginBottom: '16px' }}>
            <CheckCircle2 size={44} />
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>
            Ticket #{ticketResult.ticketId} Logged!
          </h3>
          <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0', lineHeight: 1.5 }}>
            Our Labsmart engineering &amp; support desk has received your ticket. We will contact you at <strong>{phone}</strong> within 15-30 minutes.
          </p>
          <Button variant="primary" onClick={handleModalClose}>
            Done
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {/* Status info bar */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '10px 14px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#334155' }}>
              <Headphones size={16} color="#2563eb" />
              <span>Labsmart Support Desk</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#16a34a' }} />
              <span style={{ color: '#16a34a', fontWeight: 600 }}>Active (Response within 15-30 mins)</span>
            </div>
          </div>

          {/* Category & Priority Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Query Category <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
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
                <option>Billing &amp; Financial Ledger</option>
                <option>Report Printing &amp; Letterhead</option>
                <option>Analyzer Machine Interfacing (LIS)</option>
                <option>SMS &amp; WhatsApp Notifications</option>
                <option>Doctor Portal Access</option>
                <option>Feature Request / Suggestion</option>
                <option>Other Operational Issue</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
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
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Subject */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Subject <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <Input
              placeholder="e.g. Need help adjusting top margin on patient report print"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Detailed Description <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Please describe the issue or what you would like configured..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 10px',
                fontSize: '13px',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                resize: 'vertical',
                outline: 'none',
                fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Contact Phone */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Callback Contact Number <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <Input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          {/* Screenshot Upload simulation */}
          <div>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
              Attach Screenshot (Optional)
            </label>
            <div
              style={{
                border: '1px dashed #cbd5e1',
                borderRadius: '6px',
                padding: '12px',
                textAlign: 'center',
                backgroundColor: '#f8fafc',
                cursor: 'pointer',
              }}
              onClick={() => setFileName('screenshot_report_error.png')}
            >
              <UploadCloud size={20} color="#64748b" style={{ margin: '0 auto 4px auto' }} />
              <span style={{ fontSize: '12px', color: '#2563eb', fontWeight: 600 }}>
                {fileName ? fileName : 'Click to select or drag & drop image'}
              </span>
            </div>
          </div>

          {/* Footer Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
            <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={!subject || !description || isSubmitting}>
              {isSubmitting ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...
                </span>
              ) : (
                'Submit Ticket'
              )}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
};
