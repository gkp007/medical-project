import React, { useState, useEffect } from 'react';
import {
  Printer,
  ArrowLeft,
  Download,
  Edit2,
  Eye,
  PanelRightClose,
  PanelRightOpen,
  Clock,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  FileText,
  User,
  Stethoscope,
  Activity,
  FolderOpen,
  ChevronRight,
  ChevronDown,
  Settings,
  Upload,
  Check,
} from 'lucide-react';
import {
  UpdatePatientDetailsView,
  PatientDetailsData,
} from '../../components/organisms/modals/UpdatePatientDetailsModal';
import {
  EditReferrerView,
  ReferrerData,
} from '../../components/organisms/modals/EditReferrerModal';
import {
  EditTransactionModal,
  TransactionData,
} from '../../components/organisms/modals/EditTransactionModal';
import { ViewPatientModal } from '../../components/organisms/modals/ViewPatientModal';
import { PrintSettingsGuideModal } from '../../components/organisms/modals/PrintSettingsGuideModal';
import { PatientProfilePage } from '../manage/PatientProfilePage';
import { casesApi } from '../../services/api';

const WhatsAppIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.96.541 1.961.828 2.796.828 3.182 0 5.768-2.587 5.768-5.766-.001-3.187-2.575-5.77-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.072-2.112-.515-1.745-.722-2.883-2.502-2.971-2.617-.087-.116-.708-.941-.708-1.794s.448-1.273.607-1.446c.159-.175.347-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.116-.087.188-.173.289l-.26.303c-.087.087-.179.182-.077.357.101.174.45 0.742.965 1.201.664.592 1.224.776 1.397.863.173.087.275.072.376-.044.101-.116.433-.506.549-.679.116-.173.231-.145.39-.087s1.011.477 1.185.564c.173.087.289.13.332.202.043.073.043.419-.101.824z" />
  </svg>
);

export interface PrintableBillPageProps {
  onBack: () => void;
  onNavigateModifyBill?: () => void;
  onNavigateEnterResults?: () => void;
  caseId?: string;
}

export const PrintableBillPage: React.FC<PrintableBillPageProps> = ({
  onBack,
  onNavigateModifyBill,
  onNavigateEnterResults,
  caseId,
}) => {
  // Subview State: 'bill' | 'update_patient' | 'edit_referrer' | 'patient_profile'
  const [activeSubView, setActiveSubView] = useState<'bill' | 'update_patient' | 'edit_referrer' | 'patient_profile'>('bill');

  // Sidebar collapse toggle
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Bottom action buttons dropdown states
  const [isPrintSplitOpen, setIsPrintSplitOpen] = useState(false);
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false);

  // Bill configuration state
  const [billVersion, setBillVersion] = useState<'Version 1' | 'Version 2'>('Version 2');
  const [pageSize, setPageSize] = useState<'A5' | 'A4' | 'Thermal'>('A5');
  const [orientation, setOrientation] = useState<'Portrait' | 'Landscape'>('Portrait');
  const [clinicLogo, setClinicLogo] = useState<string | null>(null);

  // Toast feedback state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals state
  const [isViewPatientOpen, setIsViewPatientOpen] = useState(false);
  const [isEditTransactionOpen, setIsEditTransactionOpen] = useState(false);
  const [isPrintGuideOpen, setIsPrintGuideOpen] = useState(false);

  // Inline sidebar editing for Patient History
  const [isEditingHistory, setIsEditingHistory] = useState(false);
  const [historyDraft, setHistoryDraft] = useState('28/10/2026 - ');

  // Patient Data (matches Screenshot 1 & 2)
  const [patient, setPatient] = useState<PatientDetailsData>({
    title: 'Mr.',
    firstName: 'Nikash ranjan',
    lastName: 'Bishi',
    sex: 'MALE',
    ageYears: 33,
    ageMonths: 0,
    ageDays: 0,
    mobile: 'Not Available',
    onlineReportRequested: false,
    email: '',
    address: '',
    aadhaar: '',
    patientHistory: '28/10/2026 - Initial checkup.',
  });

  // Doctor Data (matches Screenshot 1 & 3)
  const [doctor, setDoctor] = useState<ReferrerData>({
    title: 'Dr.',
    firstName: 'Drx. Pramod Ku.Pradhani',
    lastName: '',
    degree: 'Pharmacist',
    mobile: 'Not Available',
    email: '',
    address: 'Majhipali clinic chowk',
    active: true,
  });

  // Transaction Data (matches Screenshot 1)
  const [transaction, setTransaction] = useState<TransactionData>({
    date: '28/10/2026',
    time: '11:54 AM',
    amount: 200,
    receivedBy: 'Bimal Meher',
    mode: 'Cash',
  });

  const [billNumber, setBillNumber] = useState('3391');
  const [billDate, setBillDate] = useState('28/10/2026');
  const [billItems, setBillItems] = useState<{ id: string; name: string; rate: number }[]>([
    { id: '1', name: 'Complete Blood Count (CBC)', rate: 200 }
  ]);
  const [billFinancials, setBillFinancials] = useState({
    gross: 200,
    discount: 0,
    net: 200,
    paid: 200,
    due: 0
  });

  useEffect(() => {
    const activeCaseId = caseId || localStorage.getItem('labsmart_active_case_id');
    if (!activeCaseId) return;

    const loadCase = async () => {
      try {
        const res = await casesApi.getCaseById(activeCaseId);
        if (res.success && res.data) {
          const c = res.data;
          setBillNumber(c.billNumber || c.dailyCode || '1001');
          setBillDate(new Date(c.createdAt).toLocaleDateString());
          
          if (c.patient) {
            setPatient({
              title: c.patient.prefix || 'Mr.',
              firstName: c.patient.firstName || c.patient.fullName?.split(' ')[0] || 'Patient',
              lastName: c.patient.lastName || c.patient.fullName?.split(' ').slice(1).join(' ') || '',
              sex: (c.patient.gender || 'MALE').toUpperCase() as any,
              ageYears: c.patient.age || 30,
              ageMonths: 0,
              ageDays: 0,
              mobile: c.patient.mobile || 'Not Available',
              onlineReportRequested: false,
              email: c.patient.email || '',
              address: c.patient.address || '',
              aadhaar: '',
              patientHistory: `${new Date(c.createdAt).toLocaleDateString()} - Registered case ${c.billNumber}`,
            });
          }

          if (c.doctor) {
            setDoctor({
              title: 'Dr.',
              firstName: c.doctor.name || 'Referring Physician',
              lastName: '',
              degree: c.doctor.degree || 'MBBS',
              mobile: c.doctor.mobile || 'Not Available',
              email: c.doctor.email || '',
              address: c.doctor.address || '',
              active: true,
            });
          }

          if (c.items && c.items.length > 0) {
            setBillItems(c.items.map((it: any) => ({
              id: it.id,
              name: it.testName || it.testCode,
              rate: it.rate
            })));
          }

          setBillFinancials({
            gross: c.grossAmount || 0,
            discount: c.discountAmount || 0,
            net: c.netAmount || 0,
            paid: c.paidAmount || 0,
            due: c.balanceDue || 0
          });

          if (c.transactions && c.transactions.length > 0) {
            const tx = c.transactions[0];
            setTransaction({
              date: new Date(tx.createdAt).toLocaleDateString(),
              time: new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              amount: tx.amount,
              receivedBy: tx.receivedBy || 'Front Desk',
              mode: tx.mode || 'Cash',
            });
          }
        }
      } catch (err) {
        console.error('Failed to load active case for bill print:', err);
      }
    };
    loadCase();
  }, [caseId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSavePatient = (updated: PatientDetailsData) => {
    setPatient(updated);
    setActiveSubView('bill');
    showToast('Patient details updated successfully.');
  };

  const handleSaveDoctor = (updated: ReferrerData) => {
    setDoctor(updated);
    setActiveSubView('bill');
    showToast('Referral doctor details updated successfully.');
  };

  const handleSaveTransaction = (updated: TransactionData) => {
    setTransaction(updated);
    showToast('Payment transaction details updated.');
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setClinicLogo(uploadEvent.target?.result as string);
        showToast('Logo uploaded successfully.');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInlineHistoryUpdate = () => {
    setPatient((prev) => ({ ...prev, patientHistory: historyDraft }));
    setIsEditingHistory(false);
    showToast('Patient history updated.');
  };

  // Render Subviews for direct editing
  if (activeSubView === 'update_patient') {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
          <button
            onClick={() => setActiveSubView('bill')}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: 500 }}
          >
            Dashboard
          </button>
          <span>&gt;</span>
          <button
            onClick={() => setActiveSubView('bill')}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: 500 }}
          >
            Bill - #3391
          </button>
          <span>&gt;</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Update patient details</span>
        </div>
        <UpdatePatientDetailsView
          isPageMode={true}
          initialData={patient}
          onSave={handleSavePatient}
          onCancel={() => setActiveSubView('bill')}
        />
      </div>
    );
  }

  if (activeSubView === 'edit_referrer') {
    return (
      <div style={{ maxWidth: '1100px', margin: '0 auto', paddingBottom: '40px' }}>
        <EditReferrerView
          isPageMode={true}
          initialData={doctor}
          onSave={handleSaveDoctor}
          onCancel={() => setActiveSubView('bill')}
        />
      </div>
    );
  }

  if (activeSubView === 'patient_profile') {
    return (
      <div style={{ maxWidth: '1440px', margin: '0 auto', paddingBottom: '40px' }}>
        <PatientProfilePage
          patient={patient}
          regNo="3391"
          onBack={() => setActiveSubView('bill')}
          onEditProfile={() => setActiveSubView('update_patient')}
          onAddCase={() => onNavigateModifyBill ? onNavigateModifyBill() : setActiveSubView('bill')}
          onViewBill={() => setActiveSubView('bill')}
          onViewReport={() => onNavigateEnterResults ? onNavigateEnterResults() : showToast('Opening test results...')}
        />
      </div>
    );
  }

  const patientFullName = `${patient.title} ${patient.firstName} ${patient.lastName}`.trim();
  const doctorFullName = `${doctor.title} ${doctor.firstName} ${doctor.lastName}`.trim();
  const sexDisplay = patient.sex === 'MALE' ? 'M' : patient.sex === 'FEMALE' ? 'F' : 'O';

  return (
    <div style={{ width: '100%', maxWidth: '1520px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '80px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0,0,0,0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            fontSize: '14px',
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Breadcrumb Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#64748b' }}>
          <button
            onClick={onBack}
            style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0, fontWeight: 500 }}
          >
            Dashboard
          </button>
          <span>&gt;</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Bill - #{billNumber}</span>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => window.print()}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Printer size={15} />
            <span>Print Bill</span>
          </button>
        </div>
      </div>

      {/* Main 3-Column Layout: Left (Bill Preview), Center (Transactions/Activities), Right (Sidebar) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isSidebarCollapsed
            ? 'minmax(460px, 1.25fr) minmax(360px, 1fr) 52px'
            : 'minmax(460px, 1.2fr) minmax(340px, 1fr) 300px',
          gap: '20px',
          alignItems: 'flex-start',
        }}
      >
        {/* ===================== COLUMN 1: BILL PREVIEW & CONTROLS ===================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Controls Bar above Bill */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '13px',
              color: '#475569',
              padding: '4px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              {/* Version Select */}
              <select
                value={billVersion}
                onChange={(e) => setBillVersion(e.target.value as any)}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  fontSize: '12px',
                  color: '#2563eb',
                  fontWeight: 600,
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="Version 1">Version 1</option>
                <option value="Version 2">Version 2</option>
              </select>

              {/* Page size select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#64748b' }}>Page size :</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as any)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="A5">A5</option>
                  <option value="A4">A4</option>
                  <option value="Thermal">Thermal 80mm</option>
                </select>
              </div>

              {/* Orientation select */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ color: '#64748b' }}>Orientation :</span>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as any)}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    fontSize: '12px',
                    color: '#1e293b',
                    outline: 'none',
                    cursor: 'pointer',
                  }}
                >
                  <option value="Portrait">Portrait</option>
                  <option value="Landscape">Landscape</option>
                </select>
              </div>

              {/* Print settings guide link */}
              <button
                type="button"
                onClick={() => setIsPrintGuideOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#475569',
                  fontSize: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <HelpCircle size={14} color="#64748b" />
                <span>Print settings guide</span>
              </button>
            </div>
          </div>

          {/* Paper Receipt Canvas */}
          <div
            id="printable-receipt"
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              padding: '24px 28px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
              color: '#0f172a',
              fontFamily: 'Inter, -apple-system, sans-serif',
              minHeight: '620px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              {/* Header: Clinic Info & Logo Upload Box */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>
                    Binapani Patho Clinic
                  </h1>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 2px 0' }}>
                    Majhipali (bhuliabandh chowk)
                  </p>
                  <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>
                    Phone no.: 8018723449
                  </p>
                </div>

                {/* Logo Box */}
                <div
                  style={{
                    border: '1px dashed #cbd5e1',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    textAlign: 'center',
                    backgroundColor: '#fafaf9',
                    fontSize: '11px',
                    color: '#64748b',
                    maxWidth: '190px',
                  }}
                >
                  {clinicLogo ? (
                    <div style={{ position: 'relative' }}>
                      <img
                        src={clinicLogo}
                        alt="Clinic Logo"
                        style={{ maxHeight: '42px', maxWidth: '140px', objectFit: 'contain' }}
                      />
                      <button
                        onClick={() => setClinicLogo(null)}
                        style={{
                          display: 'block',
                          margin: '2px auto 0 auto',
                          fontSize: '10px',
                          color: '#b91c1c',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <>
                      <div style={{ marginBottom: '4px' }}>Upload logo here (max 10MB)</div>
                      <label
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#ffffff',
                          border: '1px solid #cbd5e1',
                          borderRadius: '4px',
                          padding: '2px 8px',
                          fontSize: '11px',
                          cursor: 'pointer',
                          color: '#334155',
                        }}
                      >
                        Choose file
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          style={{ display: 'none' }}
                        />
                      </label>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px' }}>No file chosen</div>
                    </>
                  )}
                </div>
              </div>

              {/* Horizontal separator */}
              <div style={{ borderTop: '1px solid #cbd5e1', margin: '8px 0 16px 0' }} />

              {/* Barcode & Reg No */}
              <div style={{ marginBottom: '16px' }}>
                <svg width="220" height="34" viewBox="0 0 220 34" style={{ display: 'block' }}>
                  {/* Authentic barcode lines representation */}
                  <rect x="0" y="0" width="3" height="34" fill="#000" />
                  <rect x="5" y="0" width="2" height="34" fill="#000" />
                  <rect x="10" y="0" width="5" height="34" fill="#000" />
                  <rect x="18" y="0" width="2" height="34" fill="#000" />
                  <rect x="23" y="0" width="4" height="34" fill="#000" />
                  <rect x="30" y="0" width="2" height="34" fill="#000" />
                  <rect x="35" y="0" width="5" height="34" fill="#000" />
                  <rect x="43" y="0" width="3" height="34" fill="#000" />
                  <rect x="49" y="0" width="2" height="34" fill="#000" />
                  <rect x="54" y="0" width="6" height="34" fill="#000" />
                  <rect x="63" y="0" width="2" height="34" fill="#000" />
                  <rect x="68" y="0" width="4" height="34" fill="#000" />
                  <rect x="75" y="0" width="3" height="34" fill="#000" />
                  <rect x="81" y="0" width="2" height="34" fill="#000" />
                  <rect x="86" y="0" width="5" height="34" fill="#000" />
                  <rect x="94" y="0" width="3" height="34" fill="#000" />
                  <rect x="100" y="0" width="2" height="34" fill="#000" />
                  <rect x="105" y="0" width="5" height="34" fill="#000" />
                  <rect x="113" y="0" width="2" height="34" fill="#000" />
                  <rect x="118" y="0" width="4" height="34" fill="#000" />
                  <rect x="125" y="0" width="3" height="34" fill="#000" />
                  <rect x="131" y="0" width="2" height="34" fill="#000" />
                  <rect x="136" y="0" width="6" height="34" fill="#000" />
                  <rect x="145" y="0" width="2" height="34" fill="#000" />
                  <rect x="150" y="0" width="4" height="34" fill="#000" />
                  <rect x="157" y="0" width="3" height="34" fill="#000" />
                  <rect x="163" y="0" width="2" height="34" fill="#000" />
                  <rect x="168" y="0" width="5" height="34" fill="#000" />
                  <rect x="176" y="0" width="2" height="34" fill="#000" />
                  <rect x="181" y="0" width="4" height="34" fill="#000" />
                  <rect x="188" y="0" width="2" height="34" fill="#000" />
                  <rect x="193" y="0" width="5" height="34" fill="#000" />
                  <rect x="201" y="0" width="3" height="34" fill="#000" />
                  <rect x="207" y="0" width="2" height="34" fill="#000" />
                  <rect x="212" y="0" width="4" height="34" fill="#000" />
                </svg>
                <div style={{ fontSize: '12px', fontWeight: 700, color: '#1e293b', marginTop: '4px' }}>
                  Bill / Reg. No. {billNumber}
                </div>
              </div>

              {/* Patient & Doctor 2-Column Info Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1.1fr 1fr',
                  gap: '16px',
                  fontSize: '12px',
                  marginBottom: '20px',
                  lineHeight: '1.6',
                }}
              >
                <div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Name : </strong>
                    <span>{patientFullName}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Age / Sex : </strong>
                    <span>{patient.ageYears} YRS / {sexDisplay}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Mobile number : </strong>
                    <span>{patient.mobile || 'Not available'}</span>
                  </div>
                </div>

                <div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Referred by : </strong>
                    <span>{doctorFullName} ({doctor.degree || 'Pharmacist'})</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Date : </strong>
                    <span>{billDate}</span>
                  </div>
                  <div>
                    <strong style={{ color: '#0f172a' }}>Received by : </strong>
                    <span>{transaction.receivedBy}</span>
                  </div>
                </div>
              </div>

              {/* Itemized Investigations Table */}
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
                <thead>
                  <tr style={{ borderTop: '1px solid #94a3b8', borderBottom: '1px solid #94a3b8', textAlign: 'left' }}>
                    <th style={{ padding: '6px 4px', fontWeight: 700, width: '48px' }}>S. NO.</th>
                    <th style={{ padding: '6px 8px', fontWeight: 700 }}>INVESTIGATIONS</th>
                    <th style={{ padding: '6px 4px', fontWeight: 700, textAlign: 'right', width: '90px' }}>AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item, idx) => (
                    <tr key={item.id || idx} style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <td style={{ padding: '8px 4px' }}>{idx + 1}.</td>
                      <td style={{ padding: '8px 8px' }}>{item.name}</td>
                      <td style={{ padding: '8px 4px', textAlign: 'right' }}>Rs.{item.rate.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals Section */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px', fontSize: '12px', paddingRight: '4px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                  <span style={{ fontWeight: 600 }}>Total amount</span>
                  <span>Rs.{billFinancials.gross.toFixed(2)}</span>
                </div>
                {billFinancials.discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', color: '#16a34a' }}>
                    <span style={{ fontWeight: 600 }}>Discount</span>
                    <span>- Rs.{billFinancials.discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px' }}>
                  <span style={{ fontWeight: 600 }}>Amount paid</span>
                  <span>Rs.{billFinancials.paid.toFixed(2)}</span>
                </div>
                {billFinancials.due > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', width: '220px', color: '#dc2626' }}>
                    <span style={{ fontWeight: 700 }}>Balance due</span>
                    <span style={{ fontWeight: 700 }}>Rs.{billFinancials.due.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ fontSize: '11px', color: '#475569', marginTop: '4px', textAlign: 'right' }}>
                  <strong>Payment Mode: </strong> {transaction.mode}
                </div>
              </div>
            </div>

            {/* Signature & Thank You Footer */}
            <div style={{ paddingTop: '28px' }}>
              <div style={{ textAlign: 'right', marginBottom: '16px', paddingRight: '20px' }}>
                <div style={{ width: '180px', borderTop: '1px solid #cbd5e1', marginLeft: 'auto', marginBottom: '6px' }} />
                <div style={{ fontSize: '12px', color: '#1e293b', fontWeight: 600 }}>Cashier's signature</div>
              </div>
              <div style={{ textAlign: 'center', fontSize: '13px', color: '#475569', letterSpacing: '0.04em' }}>
                ~~~ Thank You ~~~
              </div>
            </div>
          </div>

          {/* Bottom Action Toolbar (Matches user's screenshot) */}
          <div className="no-print" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '14px' }}>
            {/* Row 1: Print split button, Modify, Enter results */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Blue Split Print Button */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <button
                  type="button"
                  onClick={() => window.print()}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px 0 0 6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <Printer size={15} />
                  <span>Print</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsPrintSplitOpen(!isPrintSplitOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '8px 10px',
                    backgroundColor: '#1d4ed8',
                    color: '#ffffff',
                    border: 'none',
                    borderLeft: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '0 6px 6px 0',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronDown size={14} />
                </button>

                {/* Split Print Dropdown Menu */}
                {isPrintSplitOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      minWidth: '200px',
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setPageSize('A5');
                        setIsPrintSplitOpen(false);
                        setTimeout(() => window.print(), 100);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>Print Receipt (A5)</span>
                      {pageSize === 'A5' && <Check size={14} color="#2563eb" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPageSize('A4');
                        setIsPrintSplitOpen(false);
                        setTimeout(() => window.print(), 100);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>Print Receipt (A4)</span>
                      {pageSize === 'A4' && <Check size={14} color="#2563eb" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setPageSize('Thermal');
                        setIsPrintSplitOpen(false);
                        setTimeout(() => window.print(), 100);
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span>Print Thermal (80mm)</span>
                      {pageSize === 'Thermal' && <Check size={14} color="#2563eb" />}
                    </button>
                    <div style={{ borderTop: '1px solid #e2e8f0' }} />
                    <button
                      type="button"
                      onClick={() => {
                        setIsPrintSplitOpen(false);
                        showToast('Generating and exporting PDF receipt...');
                      }}
                      style={{
                        width: '100%',
                        padding: '8px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#2563eb',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Download PDF
                    </button>
                  </div>
                )}
              </div>

              {/* Modify Button */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateModifyBill) {
                    onNavigateModifyBill();
                  } else {
                    setActiveSubView('update_patient');
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  border: '1px solid #93c5fd',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <Edit2 size={15} color="#2563eb" />
                <span>Modify</span>
              </button>

              {/* Enter Results Button */}
              <button
                type="button"
                onClick={() => {
                  if (onNavigateEnterResults) {
                    onNavigateEnterResults();
                  } else {
                    showToast('Navigating to Enter Results...');
                  }
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#334155',
                  border: '1px solid #cbd5e1',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <Edit2 size={15} color="#475569" />
                <span>Enter results</span>
              </button>
            </div>

            {/* Row 2: Whatsapp bill, Print Settings */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Whatsapp Bill Dropdown Button */}
              <div style={{ position: 'relative', display: 'inline-flex' }}>
                <button
                  type="button"
                  onClick={() => setIsWhatsappOpen(!isWhatsappOpen)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    backgroundColor: '#16a34a',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                  }}
                >
                  <WhatsAppIcon size={16} />
                  <span>Whatsapp bill</span>
                  <ChevronDown size={14} />
                </button>

                {/* Whatsapp Dropdown Menu */}
                {isWhatsappOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      left: 0,
                      marginTop: '6px',
                      backgroundColor: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                      minWidth: '280px',
                      zIndex: 50,
                      overflow: 'hidden',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setIsWhatsappOpen(false);
                        const text = encodeURIComponent(`Hello ${patientFullName}, your invoice #3391 for Complete Blood Count (CBC) at Binapani Patho Clinic has been generated. Amount: Rs.200.`);
                        window.open(`https://api.whatsapp.com/send?phone=91${patient.mobile === 'Not available' ? '8018723449' : patient.mobile}&text=${text}`, '_blank');
                        showToast('Opening WhatsApp to send bill to patient...');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ fontWeight: 600 }}>Send to Patient</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>+91 {patient.mobile || 'Not available'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsWhatsappOpen(false);
                        const text = encodeURIComponent(`Dr. ${doctorFullName}, patient ${patientFullName} was registered under your referral for CBC (Bill #3391).`);
                        window.open(`https://api.whatsapp.com/send?phone=91${doctor.mobile === 'Not available' ? '8018723449' : doctor.mobile}&text=${text}`, '_blank');
                        showToast('Opening WhatsApp to send referral update to doctor...');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#1e293b',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        borderTop: '1px solid #f1f5f9',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      <span style={{ fontWeight: 600 }}>Send to Doctor</span>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>+91 {doctor.mobile || 'Not available'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsWhatsappOpen(false);
                        navigator.clipboard?.writeText?.(window.location.href);
                        showToast('Direct bill link copied to clipboard!');
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 14px',
                        textAlign: 'left',
                        border: 'none',
                        background: 'none',
                        fontSize: '13px',
                        color: '#16a34a',
                        cursor: 'pointer',
                        fontWeight: 600,
                        borderTop: '1px solid #f1f5f9',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f1f5f9')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      Copy WhatsApp Bill Link
                    </button>
                  </div>
                )}
              </div>

              {/* Print Settings Button */}
              <button
                type="button"
                onClick={() => setIsPrintGuideOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  backgroundColor: '#ffffff',
                  color: '#2563eb',
                  border: '1px solid #93c5fd',
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                }}
              >
                <Settings size={15} color="#2563eb" />
                <span>Print Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* ===================== COLUMN 2: TRANSACTIONS & ACTIVITIES ===================== */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card 1: Transaction History */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Transaction history
              </h3>
              <div title="Lists all payments received for this bill" style={{ cursor: 'help', display: 'flex', alignItems: 'center' }}>
                <HelpCircle size={14} color="#94a3b8" />
              </div>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>DATE</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>TIME</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>AMOUNT</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>RECEIVED BY</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>MODE</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ padding: '10px 4px', color: '#1e293b' }}>{transaction.date}</td>
                  <td style={{ padding: '10px 4px', color: '#1e293b' }}>{transaction.time}</td>
                  <td style={{ padding: '10px 4px', color: '#15803d', fontWeight: 700 }}>
                    + Rs.{transaction.amount}
                  </td>
                  <td style={{ padding: '10px 4px', color: '#1e293b' }}>{transaction.receivedBy}</td>
                  <td style={{ padding: '10px 4px', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontWeight: 500 }}>{transaction.mode}</span>
                      <button
                        type="button"
                        onClick={() => setIsEditTransactionOpen(true)}
                        title="Edit Payment Mode / Transaction"
                        style={{
                          background: 'none',
                          border: '1px solid #bfdbfe',
                          borderRadius: '4px',
                          padding: '2px 5px',
                          color: '#2563eb',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Edit2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Card 2: Activities (Advanced Plan Feature) */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '16px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: 0 }}>
                Activities
              </h3>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#fef3c7',
                  color: '#d97706',
                  fontSize: '11px',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                ★ Advanced plan feature
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px', marginBottom: '16px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>DATE</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>TIME</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>SUMMARY</th>
                  <th style={{ padding: '6px 4px', fontWeight: 600 }}>BY</th>
                </tr>
              </thead>
            </table>

            {/* Empty state */}
            <div style={{ textAlign: 'center', padding: '16px 0', color: '#64748b' }}>
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#94a3b8',
                  marginBottom: '8px',
                }}
              >
                <Clock size={18} />
              </div>
              <div style={{ fontSize: '12px' }}>No recent activities to show.</div>
            </div>
          </div>

          {/* Card 3: Request a review from the patient */}
          <div
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#1e293b', margin: '0 0 14px 0' }}>
              Request a review from the patient
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Bring your lab on top of google search to nearby patients.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Build more positive reviews and reduce negative review impact.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                <CheckCircle2 size={16} color="#16a34a" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span>Get more patients by building a strong online presence.</span>
              </div>
            </div>

            <div style={{ marginTop: '16px' }}>
              <button
                type="button"
                onClick={() => showToast('Trial requested! Our support specialist will activate Google Reviews on your account.')}
                style={{
                  backgroundColor: '#6366f1',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '6px',
                  padding: '8px 18px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
                }}
              >
                Start free trial
              </button>
            </div>
          </div>
        </div>

        {/* ===================== COLUMN 3: RIGHT SIDEBAR ===================== */}
        <div
          style={{
            backgroundColor: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            overflow: 'hidden',
          }}
        >
          {/* Sidebar Header with Collapse Button */}
          <div
            style={{
              padding: '12px 14px',
              borderBottom: '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#f8fafc',
            }}
          >
            {!isSidebarCollapsed && (
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>Sidebar</span>
            )}
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              style={{
                background: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '4px 6px',
                cursor: 'pointer',
                color: '#2563eb',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {isSidebarCollapsed ? <PanelRightOpen size={15} /> : <PanelRightClose size={15} />}
            </button>
          </div>

          {!isSidebarCollapsed && (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {/* Section 1: Patient Info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#ede9fe',
                        color: '#7c3aed',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <User size={15} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      Patient info
                    </span>
                  </div>

                  {/* Actions: Edit & View */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() => setActiveSubView('update_patient')}
                      title="Update patient details"
                      style={{
                        background: 'none',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSubView('patient_profile')}
                      title="View patient profile"
                      style={{
                        background: 'none',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Eye size={13} />
                    </button>
                  </div>
                </div>

                {/* Patient Summary Rows */}
                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Name : </span>
                    <strong style={{ color: '#1e293b' }}>{patientFullName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Phone no : </span>
                    <span>{patient.mobile || 'Not Available'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Email : </span>
                    <span>{patient.email || 'Not Available'}</span>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Address : </span>
                    <span>{patient.address || 'Not Available'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Doctor Info */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#fef3c7',
                        color: '#d97706',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Stethoscope size={15} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      Doctor info
                    </span>
                  </div>

                  {/* Action: Edit Referrer */}
                  <button
                    type="button"
                    onClick={() => setActiveSubView('edit_referrer')}
                    title="Edit referrer details"
                    style={{
                      background: 'none',
                      border: '1px solid #bfdbfe',
                      borderRadius: '4px',
                      padding: '3px 6px',
                      color: '#2563eb',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    <Edit2 size={13} />
                  </button>
                </div>

                <div style={{ fontSize: '12px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div>
                    <span style={{ color: '#64748b' }}>Name : </span>
                    <strong style={{ color: '#1e293b' }}>{doctorFullName}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#64748b' }}>Degree : </span>
                    <span>{doctor.degree || 'Pharmacist'}</span>
                  </div>
                </div>
              </div>

              {/* Section 3: Patient History (Matches Screenshot 4) */}
              <div style={{ padding: '14px 16px', borderBottom: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div
                      style={{
                        width: '26px',
                        height: '26px',
                        borderRadius: '6px',
                        backgroundColor: '#ffe4e6',
                        color: '#e11d48',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Activity size={15} />
                    </div>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                      Patient history
                    </span>
                  </div>

                  {!isEditingHistory && (
                    <button
                      type="button"
                      onClick={() => {
                        setHistoryDraft(patient.patientHistory || '28/10/2026 - ');
                        setIsEditingHistory(true);
                      }}
                      title="Edit patient history"
                      style={{
                        background: 'none',
                        border: '1px solid #bfdbfe',
                        borderRadius: '4px',
                        padding: '3px 6px',
                        color: '#2563eb',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                      }}
                    >
                      <Edit2 size={13} />
                    </button>
                  )}
                </div>

                {/* Inline Editing Form (Screenshot 4) */}
                {isEditingHistory ? (
                  <div style={{ marginTop: '8px' }}>
                    <textarea
                      rows={4}
                      value={historyDraft}
                      onChange={(e) => setHistoryDraft(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '12px',
                        color: '#1e293b',
                        fontFamily: 'inherit',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <button
                        type="button"
                        onClick={handleInlineHistoryUpdate}
                        style={{
                          backgroundColor: '#2563eb',
                          color: '#ffffff',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          border: 'none',
                          fontSize: '12px',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}
                      >
                        Update
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingHistory(false)}
                        style={{
                          backgroundColor: '#ffffff',
                          color: '#475569',
                          padding: '6px 14px',
                          borderRadius: '4px',
                          border: '1px solid #cbd5e1',
                          fontSize: '12px',
                          fontWeight: 500,
                          cursor: 'pointer',
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {patient.patientHistory ? (
                      <p style={{ margin: 0, color: '#334155' }}>{patient.patientHistory}</p>
                    ) : (
                      <p style={{ margin: 0, fontStyle: 'italic' }}>No past medical history recorded.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Section 4: Recent Lab Reports (Matches Screenshot 5) */}
              <div style={{ padding: '14px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: '6px',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FolderOpen size={15} />
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: '#1e293b' }}>
                    Recent lab reports
                  </span>
                </div>

                <div style={{ textAlign: 'center', padding: '16px 8px', color: '#64748b', fontSize: '12px' }}>
                  <p style={{ margin: '0 0 12px 0', lineHeight: '1.5' }}>
                    To view previous reports upgrade your plan to premium.
                  </p>
                  <button
                    type="button"
                    onClick={() => showToast('Plan trial requested! Upgrade inquiry received.')}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#334155',
                      border: '1px solid #cbd5e1',
                      borderRadius: '6px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Start plan trial
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Payment Transaction Modal */}
      <EditTransactionModal
        isOpen={isEditTransactionOpen}
        onClose={() => setIsEditTransactionOpen(false)}
        transaction={transaction}
        onSave={handleSaveTransaction}
      />

      {/* View Patient Modal */}
      <ViewPatientModal
        isOpen={isViewPatientOpen}
        onClose={() => setIsViewPatientOpen(false)}
        patient={patient}
        regNo="3391"
        onEditClick={() => setActiveSubView('update_patient')}
      />

      {/* Print Settings Guide Modal */}
      <PrintSettingsGuideModal
        isOpen={isPrintGuideOpen}
        onClose={() => setIsPrintGuideOpen(false)}
      />
    </div>
  );
};
