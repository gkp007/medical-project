import React, { useState } from 'react';
import { Card } from '../../components/atoms/Card';
import { Badge } from '../../components/atoms/Badge';
import {
  Search,
  CheckCircle2,
  Phone,
  MoreVertical,
  ChevronDown,
  ChevronUp,
  RotateCcw,
} from 'lucide-react';

export interface HistoricalReportItem {
  id: string;
  regNo: string;
  dailyCode: string;
  dateTime: string;
  patientName: string;
  ageGender: string;
  phone: string;
  referredBy: string;
  referredDegree: string;
  tests: string[];
  collectionCentre: string;
  status: 'New' | 'In progress' | 'Final' | 'Signed off';
  uhid: string;
}

interface SearchReportsPageProps {
  onNavigateViewReport?: () => void;
  onNavigateEnterResults?: () => void;
}

export const SearchReportsPage: React.FC<SearchReportsPageProps> = ({
  onNavigateViewReport,
  onNavigateEnterResults,
}) => {
  // Filter States
  const [duration, setDuration] = useState('Past 7 days');
  const [dateRangeText, setDateRangeText] = useState('12 Oct 2026 to 19 Oct 2026');
  const [patientFirstName, setPatientFirstName] = useState('');
  const [status, setStatus] = useState('All');
  const [referredBy, setReferredBy] = useState('');
  const [regNo, setRegNo] = useState('');
  const [dailyCaseNo, setDailyCaseNo] = useState('');
  const [uhid, setUhid] = useState('');

  // Collapsible Extra Filters
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [selectedTest, setSelectedTest] = useState('');
  const [collectionCentre, setCollectionCentre] = useState('');

  // Sample Reports Data
  const [reports] = useState<HistoricalReportItem[]>([
    {
      id: '30583846',
      regNo: '1001',
      dailyCode: 'L1',
      dateTime: '18/10/2026 07:26 PM',
      patientName: 'Rahul Sharma',
      ageGender: '32 YRS/M',
      phone: '9876543210',
      referredBy: 'Dr. Anil Verma',
      referredDegree: 'MBBS, MD',
      tests: ['Complete Blood Count (CBC)'],
      collectionCentre: 'Main',
      status: 'Signed off',
      uhid: '35375569',
    },
    {
      id: '30583840',
      regNo: '1000',
      dailyCode: 'L1',
      dateTime: '17/10/2026 05:14 PM',
      patientName: 'Sunita Rao',
      ageGender: '58 YRS/F',
      phone: '9822334455',
      referredBy: 'Dr. Priya Sharma',
      referredDegree: 'MS',
      tests: ['HbA1c Glycated Hemoglobin', 'Fasting Blood Sugar'],
      collectionCentre: 'Main',
      status: 'Signed off',
      uhid: '35375560',
    },
    {
      id: '30583835',
      regNo: '995',
      dailyCode: 'L2',
      dateTime: '16/10/2026 11:30 AM',
      patientName: 'Anil Saxena',
      ageGender: '44 YRS/M',
      phone: '9811002233',
      referredBy: 'Self Referral / Walk-in',
      referredDegree: '',
      tests: ['Lipid Profile Standard', 'Liver Function Test (LFT)'],
      collectionCentre: 'City Care (AG-102)',
      status: 'In progress',
      uhid: '35375545',
    },
    {
      id: '30583820',
      regNo: '988',
      dailyCode: 'L1',
      dateTime: '15/10/2026 03:45 PM',
      patientName: 'Vikas Malhotra',
      ageGender: '38 YRS/M',
      phone: '9944556677',
      referredBy: 'Dr. Anil Verma',
      referredDegree: 'MBBS, MD',
      tests: ['Kidney Function Test (KFT)', 'Urine Routine Examination'],
      collectionCentre: 'Main',
      status: 'Final',
      uhid: '35375530',
    },
  ]);

  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleClearFilters = () => {
    setDuration('Past 7 days');
    setDateRangeText('12 Oct 2026 to 19 Oct 2026');
    setPatientFirstName('');
    setStatus('All');
    setReferredBy('');
    setRegNo('');
    setDailyCaseNo('');
    setUhid('');
    setSelectedTest('');
    setCollectionCentre('');
    showToast('Filters cleared to default (Past 7 days)');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Search executed with applied filters.');
  };

  // Filter evaluation
  const filteredReports = reports.filter((r) => {
    if (patientFirstName && !r.patientName.toLowerCase().includes(patientFirstName.toLowerCase())) {
      return false;
    }
    if (status !== 'All' && r.status !== status) {
      return false;
    }
    if (referredBy && !r.referredBy.toLowerCase().includes(referredBy.toLowerCase())) {
      return false;
    }
    if (regNo && !r.regNo.includes(regNo)) {
      return false;
    }
    if (dailyCaseNo && !r.dailyCode.toLowerCase().includes(dailyCaseNo.toLowerCase())) {
      return false;
    }
    if (uhid && !r.uhid.includes(uhid)) {
      return false;
    }
    if (selectedTest && !r.tests.some((t) => t.toLowerCase().includes(selectedTest.toLowerCase()))) {
      return false;
    }
    if (collectionCentre && !r.collectionCentre.toLowerCase().includes(collectionCentre.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 500,
          }}
        >
          <CheckCircle2 size={18} color="#22c55e" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0, color: '#0f172a' }}>
          Search lab reports
        </h1>
        <p className="text-muted" style={{ margin: '4px 0 0', fontSize: '13px' }}>
          Search historical pathology investigations by date duration, patient, referrer, or test.
        </p>
      </div>

      {/* 8-Field Search Filter Card */}
      <form onSubmit={handleSearch}>
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
            padding: '16px 20px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px 0 rgba(0,0,0,0.05)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              alignItems: 'flex-end',
            }}
          >
            {/* 1. Duration */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Duration
              </label>
              <select
                className="select-control"
                value={duration}
                onChange={(e) => {
                  setDuration(e.target.value);
                  if (e.target.value === 'Today') setDateRangeText('19 Oct 2026 to 19 Oct 2026');
                  else if (e.target.value === 'Yesterday') setDateRangeText('18 Oct 2026 to 18 Oct 2026');
                  else if (e.target.value === 'Past 7 days') setDateRangeText('12 Oct 2026 to 19 Oct 2026');
                  else if (e.target.value === 'Past 30 days') setDateRangeText('19 Sep 2026 to 19 Oct 2026');
                }}
                style={{ height: '36px', fontSize: '13px' }}
              >
                <option value="Past 7 days">Past 7 days</option>
                <option value="Today">Today</option>
                <option value="Yesterday">Yesterday</option>
                <option value="Past 30 days">Past 30 days</option>
                <option value="This month">This month</option>
              </select>
              <div style={{ fontSize: '11px', color: '#64748b', marginTop: '3px' }}>{dateRangeText}</div>
            </div>

            {/* 2. Patient first name */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Patient first name
              </label>
              <input
                type="text"
                placeholder="Search patient..."
                value={patientFirstName}
                onChange={(e) => setPatientFirstName(e.target.value)}
                className="input-control"
                style={{ height: '36px', fontSize: '13px' }}
              />
            </div>

            {/* 3. Status */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Status
              </label>
              <select
                className="select-control"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ height: '36px', fontSize: '13px' }}
              >
                <option value="All">All statuses</option>
                <option value="New">New</option>
                <option value="In progress">In progress</option>
                <option value="Final">Final</option>
                <option value="Signed off">Signed off</option>
              </select>
            </div>

            {/* 4. Referred by */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Referred by
              </label>
              <select
                className="select-control"
                value={referredBy}
                onChange={(e) => setReferredBy(e.target.value)}
                style={{ height: '36px', fontSize: '13px' }}
              >
                <option value="">Select referrer...</option>
                <option value="Dr. Anil Verma">Dr. Anil Verma (MBBS, MD - Internal Med)</option>
                <option value="Dr. Priya Sharma">Dr. Priya Sharma (MS - Surgery & Ortho)</option>
                <option value="Dr. S. K. Gupta">Dr. S. K. Gupta (MD - General Medicine)</option>
                <option value="Dr. Sunil Bansal">Dr. Sunil Bansal (MS - Orthopaedics)</option>
                <option value="Dr. Rajesh Khanna">Dr. Rajesh Khanna (DM - Cardiology)</option>
                <option value="Dr. Sunita Patil">Dr. Sunita Patil (DGO - Gynaecology)</option>
                <option value="Dr. Vikram Malhotra">Dr. Vikram Malhotra (DM - Neurology)</option>
                <option value="Dr. Ramesh Saxena">Dr. Ramesh Saxena (MD - Paediatrics)</option>
                <option value="Dr. Meena Agarwal">Dr. Meena Agarwal (MD - Pathology)</option>
                <option value="Self Referral">Self Referral / Walk-in Patient</option>
              </select>
            </div>

            {/* 5. Reg. no. */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Reg. no.
              </label>
              <input
                type="text"
                placeholder="e.g. 1001"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="input-control"
                style={{ height: '36px', fontSize: '13px' }}
              />
            </div>

            {/* 6. Daily case no. */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                Daily case no.
              </label>
              <input
                type="text"
                placeholder="e.g. L1"
                value={dailyCaseNo}
                onChange={(e) => setDailyCaseNo(e.target.value)}
                className="input-control"
                style={{ height: '36px', fontSize: '13px' }}
              />
            </div>

            {/* 7. UHID */}
            <div>
              <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                UHID
              </label>
              <input
                type="text"
                placeholder="e.g. 35375569"
                value={uhid}
                onChange={(e) => setUhid(e.target.value)}
                className="input-control"
                style={{ height: '36px', fontSize: '13px' }}
              />
            </div>
          </div>

          {/* Collapsible More Filters (Select test, Collection Centre) */}
          {showAllFilters && (
            <div
              style={{
                marginTop: '14px',
                paddingTop: '14px',
                borderTop: '1px dashed #cbd5e1',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '14px',
              }}
            >
              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  Select test
                </label>
                <select
                  className="select-control"
                  value={selectedTest}
                  onChange={(e) => setSelectedTest(e.target.value)}
                  style={{ height: '36px', fontSize: '13px' }}
                >
                  <option value="">Select test...</option>
                  <option value="Serum Phosphorus">Serum Phosphorus</option>
                  <option value="FNAC">FNAC (Fine Needle Aspiration)</option>
                  <option value="Gram's Stain">Gram's Stain</option>
                  <option value="Hemoglobin">Hemoglobin (Hb)</option>
                  <option value="Widal">Widal (Tube Method)</option>
                  <option value="CBC">Complete Blood Count (CBC)</option>
                  <option value="LFT">Liver Function Test (LFT)</option>
                  <option value="KFT">Kidney Function Test (KFT)</option>
                  <option value="Lipid">Lipid Profile Screen</option>
                  <option value="Glucose">Blood Glucose (FBS / PPBS)</option>
                  <option value="HbA1c">HbA1c (Glycosylated Hemoglobin)</option>
                  <option value="Urine">Urine Routine & Microscopic</option>
                  <option value="Creatinine">Serum Creatinine</option>
                  <option value="TSH">Thyroid Stimulating Hormone (TSH)</option>
                  <option value="ESR">Erythrocyte Sedimentation Rate (ESR)</option>
                  <option value="Vitamin D">25-OH Vitamin D</option>
                  <option value="Vitamin B12">Vitamin B12</option>
                  <option value="Dengue">Dengue NS1 Ag & Ab Duo</option>
                  <option value="USG">USG Whole Abdomen</option>
                  <option value="X-Ray">Chest PA Digital X-Ray</option>
                </select>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '12px', fontWeight: 600, color: '#475569' }}>
                  Collection centre
                </label>
                <select
                  className="select-control"
                  value={collectionCentre}
                  onChange={(e) => setCollectionCentre(e.target.value)}
                  style={{ height: '36px', fontSize: '13px' }}
                >
                  <option value="">All collection centres</option>
                  <option value="Main">Main Laboratory Branch</option>
                  <option value="City Care">City Care Collection Center (AG-102)</option>
                  <option value="Sector 56">Sector 56 Phlebotomy Point (AG-105)</option>
                  <option value="Civil Hospital">Civil Hospital Extension Counter</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '16px',
              paddingTop: '12px',
              borderTop: '1px solid #f1f5f9',
            }}
          >
            <button
              type="button"
              onClick={() => setShowAllFilters(!showAllFilters)}
              style={{
                background: 'none',
                border: 'none',
                color: '#0284c7',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span>{showAllFilters ? 'Hide extra filters' : 'Show all filters'}</span>
              {showAllFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                type="button"
                onClick={handleClearFilters}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#64748b',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <RotateCcw size={13} />
                <span>Clear</span>
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: '8px 20px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <Search size={14} />
                <span>Search</span>
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Reports Ledger Table */}
      <div className="table-container" style={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        <table className="data-table">
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ width: '110px' }}>REG. NO.</th>
              <th style={{ width: '130px' }}>DATE/TIME</th>
              <th>PATIENT</th>
              <th>REFERRED BY</th>
              <th>TESTS</th>
              <th style={{ width: '90px' }}>CC</th>
              <th style={{ width: '110px', textAlign: 'center' }}>STATUS</th>
              <th style={{ width: '170px', textAlign: 'center' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredReports.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                  No lab reports matching the specified filter criteria.
                </td>
              </tr>
            ) : (
              filteredReports.map((r) => {
                const isSigned = r.status === 'Signed off';
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    {/* Reg No & DCN */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontWeight: 700, color: '#0284c7', fontSize: '13px' }}>
                          #{r.regNo}
                        </span>
                        <span
                          style={{
                            fontSize: '11px',
                            fontWeight: 700,
                            padding: '2px 5px',
                            borderRadius: '4px',
                            backgroundColor: '#e0f2fe',
                            color: '#0369a1',
                          }}
                        >
                          {r.dailyCode}
                        </span>
                      </div>
                    </td>

                    {/* Date / Time */}
                    <td style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap' }}>
                      {r.dateTime}
                    </td>

                    {/* Patient Name, Age/Sex, Phone icon */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '13px' }}>
                          {r.patientName}
                        </div>
                        <a
                          href={`tel:${r.phone}`}
                          title={`Call ${r.phone}`}
                          style={{ color: '#0284c7', display: 'flex', alignItems: 'center' }}
                        >
                          <Phone size={12} />
                        </a>
                      </div>
                      <div style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>
                        {r.ageGender} • UHID: {r.uhid}
                      </div>
                    </td>

                    {/* Referred By */}
                    <td>
                      <div style={{ fontSize: '13px', fontWeight: 500, color: '#334155' }}>
                        {r.referredBy}
                      </div>
                      {r.referredDegree && (
                        <div style={{ fontSize: '11px', color: '#64748b' }}>
                          {r.referredDegree}
                        </div>
                      )}
                    </td>

                    {/* Tests */}
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                        {r.tests.map((t, idx) => (
                          <span
                            key={idx}
                            style={{
                              fontSize: '12px',
                              backgroundColor: '#f1f5f9',
                              padding: '2px 6px',
                              borderRadius: '4px',
                              color: '#334155',
                            }}
                          >
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Collection Centre */}
                    <td style={{ fontSize: '12px', color: '#475569' }}>
                      {r.collectionCentre}
                    </td>

                    {/* Status Badge */}
                    <td style={{ textAlign: 'center' }}>
                      <Badge
                        variant={
                          r.status === 'Signed off'
                            ? 'success'
                            : r.status === 'In progress'
                            ? 'info'
                            : r.status === 'Final'
                            ? 'warning'
                            : 'neutral'
                        }
                      >
                        {r.status}
                      </Badge>
                    </td>

                    {/* Actions */}
                    <td style={{ textAlign: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                        {isSigned ? (
                          <button
                            type="button"
                            onClick={onNavigateViewReport}
                            className="btn btn-secondary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                          >
                            View
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={onNavigateEnterResults}
                            className="btn btn-primary"
                            style={{ padding: '4px 10px', fontSize: '12px' }}
                          >
                            Enter results
                          </button>
                        )}

                        {/* 3-Dot Meatball Menu */}
                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            className="btn-icon"
                            onClick={() => setActiveMenuId(activeMenuId === r.id ? null : r.id)}
                            title="Actions"
                          >
                            <MoreVertical size={16} />
                          </button>

                          {activeMenuId === r.id && (
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '100%',
                                marginTop: '4px',
                                backgroundColor: '#ffffff',
                                border: '1px solid #cbd5e1',
                                borderRadius: '6px',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                zIndex: 50,
                                minWidth: '150px',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: '4px 0',
                                textAlign: 'left',
                              }}
                            >
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#334155',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onNavigateEnterResults?.();
                                }}
                              >
                                Edit / Results
                              </button>
                              <button
                                type="button"
                                style={{
                                  padding: '8px 12px',
                                  background: 'none',
                                  border: 'none',
                                  fontSize: '12px',
                                  textAlign: 'left',
                                  cursor: 'pointer',
                                  color: '#334155',
                                }}
                                onClick={() => {
                                  setActiveMenuId(null);
                                  onNavigateViewReport?.();
                                }}
                              >
                                Print PDF
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              }))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };
