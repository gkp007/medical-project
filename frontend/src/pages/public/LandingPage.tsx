import React, { useState } from 'react';
import './LandingPage.css';
import {
  Activity,
  ShieldCheck,
  Clock,
  PhoneCall,
  MapPin,
  Calendar,
  Search,
  FileText,
  Download,
  CheckCircle2,
  Award,
  HeartPulse,
  Stethoscope,
  Microscope,
  Star,
  Sparkles,
  ArrowRight,
  Lock,
  X,
  Truck,
  MessageSquare,
  QrCode,
  Check
} from 'lucide-react';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenDashboard?: () => void;
  currentUser?: any;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenDashboard,
  currentUser,
}) => {
  // Report Tracker State
  const [reportQuery, setReportQuery] = useState('');
  const [reportStatus, setReportStatus] = useState<any | null>(null);
  const [isSearchingReport, setIsSearchingReport] = useState(false);

  // Test Finder State
  const [testSearch, setTestSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [basket, setBasket] = useState<any[]>([]);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingType, setBookingType] = useState<'home_collection' | 'opd_visit'>('home_collection');
  const [bookingSuccess, setBookingSuccess] = useState<any | null>(null);
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    mobile: '',
    age: '',
    gender: 'Male',
    address: '',
    preferredDate: '',
    preferredTime: 'Morning (07:00 AM - 10:00 AM)',
    notes: '',
  });

  // Master Test Catalog for Patient Directory
  const testCatalog = [
    {
      code: 'CBC',
      name: 'Complete Blood Count (CBC / Hemogram)',
      dept: 'Pathology',
      specimen: 'EDTA Whole Blood',
      fasting: 'No fasting required',
      tat: 'Within 4 Hours',
      rate: 350,
      originalRate: 450,
    },
    {
      code: 'LFT',
      name: 'Liver Function Test (LFT Profile)',
      dept: 'Biochemistry',
      specimen: 'Serum',
      fasting: '8-10 Hours Fasting',
      tat: 'Within 6 Hours',
      rate: 650,
      originalRate: 850,
    },
    {
      code: 'KFT',
      name: 'Kidney Function Test (KFT / RFT with Electrolytes)',
      dept: 'Biochemistry',
      specimen: 'Serum',
      fasting: 'Overnight Fasting preferred',
      tat: 'Within 6 Hours',
      rate: 700,
      originalRate: 900,
    },
    {
      code: 'LIPID',
      name: 'Lipid Profile Screen (Cholesterol, HDL, LDL, Triglycerides)',
      dept: 'Biochemistry',
      specimen: 'Serum',
      fasting: '12 Hours Strict Fasting',
      tat: 'Within 6 Hours',
      rate: 600,
      originalRate: 800,
    },
    {
      code: 'HBA1C',
      name: 'HbA1c (Glycosylated Hemoglobin for 3-Month Diabetes Index)',
      dept: 'Biochemistry',
      specimen: 'EDTA Whole Blood',
      fasting: 'No fasting required',
      tat: 'Within 4 Hours',
      rate: 450,
      originalRate: 600,
    },
    {
      code: 'THYROID',
      name: 'Thyroid Profile Total (T3, T4, Ultrasensitive TSH)',
      dept: 'Biochemistry',
      specimen: 'Serum',
      fasting: 'Morning sample preferred',
      tat: 'Within 6 Hours',
      rate: 500,
      originalRate: 700,
    },
    {
      code: 'USG-ABD',
      name: 'Ultrasound Whole Abdomen & Pelvis (High-Resolution 4D)',
      dept: 'Radiology',
      specimen: 'Diagnostic Imaging',
      fasting: 'Fasting 6 hrs + Full Urinary Bladder',
      tat: 'Instant Report',
      rate: 1200,
      originalRate: 1500,
    },
    {
      code: 'XRAY-CHEST',
      name: 'Digital X-Ray Chest PA View (Low-Radiation DR)',
      dept: 'Radiology',
      specimen: 'Digital Radiography',
      fasting: 'No preparation needed',
      tat: 'Within 30 Mins',
      rate: 400,
      originalRate: 550,
    },
    {
      code: 'CT-BRAIN',
      name: 'CT Brain Plain (Multi-slice Spiral CT)',
      dept: 'Radiology',
      specimen: 'CT Imaging',
      fasting: 'No preparation needed',
      tat: 'Within 2 Hours',
      rate: 2500,
      originalRate: 3200,
    },
    {
      code: 'CT-CHEST',
      name: 'CT High Resolution Chest (HRCT Lungs)',
      dept: 'Radiology',
      specimen: 'CT Imaging',
      fasting: 'Fasting 4 hours if contrast indicated',
      tat: 'Within 2 Hours',
      rate: 3500,
      originalRate: 4500,
    },
  ];

  // Filtered Tests
  const filteredTests = testCatalog.filter((t) => {
    const matchesDept = selectedDept === 'ALL' || t.dept === selectedDept;
    const matchesQuery =
      t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
      t.code.toLowerCase().includes(testSearch.toLowerCase());
    return matchesDept && matchesQuery;
  });

  // Handle Track Report
  const handleTrackReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportQuery.trim()) return;

    setIsSearchingReport(true);
    setTimeout(() => {
      setIsSearchingReport(false);
      const clean = reportQuery.trim().toUpperCase();
      // Realistic matching simulation with fallback
      if (clean.includes('0001') || clean.includes('RAHUL') || clean.includes('BL-')) {
        setReportStatus({
          billNumber: clean.startsWith('BL-') ? clean : 'BL-2026-0001',
          patientName: 'Rahul Sharma (32 Yrs / Male)',
          date: '04 Nov 2026',
          investigations: ['Complete Blood Count (CBC / Hemogram)'],
          currentStage: 4, // 1 to 4
          stageName: 'Signed Off & Verified by Pathologist',
          readyForDownload: true,
          reportUrl: '#',
        });
      } else {
        setReportStatus({
          billNumber: clean.startsWith('BL-') ? clean : `BL-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          patientName: 'Verified Patient',
          date: 'Today',
          investigations: ['Routine Diagnostic Profile'],
          currentStage: 3,
          stageName: 'Processing in Laboratory Analyzers',
          readyForDownload: false,
        });
      }
    }, 700);
  };

  const toggleBasket = (test: any) => {
    if (basket.some((b) => b.code === test.code)) {
      setBasket(basket.filter((b) => b.code !== test.code));
    } else {
      setBasket([...basket, test]);
    }
  };

  const basketTotal = basket.reduce((acc, curr) => acc + curr.rate, 0);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingForm.fullName || !bookingForm.mobile) {
      alert('Please fill patient full name and mobile number');
      return;
    }
    const bookingRef = `ASTH-${Math.floor(100000 + Math.random() * 900000)}`;
    setBookingSuccess({
      refNumber: bookingRef,
      patientName: bookingForm.fullName,
      service: bookingType === 'home_collection' ? 'Home Sample Collection' : 'Clinic OPD Consultation',
      date: bookingForm.preferredDate || 'Earliest Available Slot',
      time: bookingForm.preferredTime,
      totalAmount: basketTotal || 0,
      testCount: basket.length,
    });
  };

  return (
    <div className="lp-container">
      {/* --------------------------------------------------------------------
          1. Top Announcement & Emergency Bar
         -------------------------------------------------------------------- */}
      <div className="lp-topbar">
        <div className="lp-topbar-inner">
          <div className="lp-topbar-left">
            <span className="lp-badge-pulse">
              <span className="lp-pulse-dot" />
              NABL ISO 15189:2022 Accredited Laboratory & Diagnostic RIS
            </span>
            <span className="lp-topbar-item">
              <Clock size={13} />
              Mon - Sat: 7:00 AM – 9:00 PM | Sun: 7:00 AM – 2:00 PM
            </span>
          </div>

          <div className="lp-topbar-right">
            <a href="tel:+919876543210" className="lp-topbar-item" style={{ fontWeight: 600 }}>
              <PhoneCall size={13} color="#38bdf8" />
              Emergency Helpline: +91 98765 43210
            </a>
            <span style={{ color: '#475569' }}>|</span>
            {currentUser ? (
              <button
                onClick={onOpenDashboard}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#38bdf8',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <ShieldCheck size={14} />
                Terminal ({currentUser.fullName})
              </button>
            ) : (
              <button
                onClick={onOpenLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#94a3b8',
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <Lock size={12} />
                Staff LIS Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* --------------------------------------------------------------------
          2. Sticky Main Header
         -------------------------------------------------------------------- */}
      <nav className="lp-navbar">
        <div className="lp-navbar-inner">
          <div
            className="lp-logo"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="lp-logo-icon">
              <HeartPulse size={24} />
            </div>
            <div className="lp-logo-text">
              <h1>Aastha Polyclinic & Diagnostic Centre</h1>
              <span>Advanced Multi-Specialty & Certified Diagnostic Network</span>
            </div>
          </div>

          <ul className="lp-nav-links">
            <li>
              <a href="#services" className="lp-nav-link">
                Diagnostics & Imaging
              </a>
            </li>
            <li>
              <a href="#tests" className="lp-nav-link">
                Find Tests & Rates
              </a>
            </li>
            <li>
              <a href="#packages" className="lp-nav-link">
                Health Packages
              </a>
            </li>
            <li>
              <a href="#doctors" className="lp-nav-link">
                Specialist Doctors
              </a>
            </li>
            <li>
              <a href="#tracker" className="lp-nav-link">
                Online Reports
              </a>
            </li>
            <li>
              <a href="#contact" className="lp-nav-link">
                Contact & Timings
              </a>
            </li>
          </ul>

          <div className="lp-nav-actions">
            {currentUser ? (
              <button onClick={onOpenDashboard} className="lp-btn-primary">
                <Activity size={16} />
                Enter LIS Workspace
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setBookingType('home_collection');
                    setIsBookingOpen(true);
                  }}
                  className="lp-btn-primary"
                >
                  <Truck size={16} />
                  Book Home Collection
                </button>
                <button onClick={onOpenLogin} className="lp-btn-staff">
                  <Lock size={15} />
                  Staff Portal
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --------------------------------------------------------------------
          3. Hero Section
         -------------------------------------------------------------------- */}
      <header className="lp-hero">
        <div className="lp-hero-grid-bg" />
        <div className="lp-hero-inner">
          <div>
            <div className="lp-hero-badge">
              <Sparkles size={14} color="#0284c7" />
              <span>NABL ISO 15189 Standard • Same-Day Digital Reports</span>
            </div>

            <h1 className="lp-hero-title">
              Precision Diagnostics,{' '}
              <span className="lp-hero-title-highlight">Compassionate Healthcare.</span>
            </h1>

            <p className="lp-hero-desc">
              Experience the highest standard of medical diagnostics in our fully automated centre.
              Offering 5-part hematology, 4D Ultrasound, Digital X-Ray, Multi-Slice CT, and multi-specialty
              consultations with certified zero sample-mixup barcodes.
            </p>

            <div className="lp-hero-actions">
              <button
                onClick={() => {
                  setBookingType('home_collection');
                  setIsBookingOpen(true);
                }}
                className="lp-btn-primary"
                style={{ padding: '14px 26px', fontSize: '15.5px' }}
              >
                <Truck size={18} />
                Book Free Home Sample Pickup
              </button>

              <a
                href="#tracker"
                className="lp-btn-outline"
                style={{ padding: '13px 22px', fontSize: '15px' }}
              >
                <FileText size={17} />
                Download Patient Report
              </a>
            </div>

            <div className="lp-hero-stats">
              <div>
                <div className="lp-stat-number">50,000+</div>
                <div className="lp-stat-label">Happy Patients</div>
              </div>
              <div>
                <div className="lp-stat-number">100%</div>
                <div className="lp-stat-label">Barcode Tracking</div>
              </div>
              <div>
                <div className="lp-stat-number">&lt; 4 Hours</div>
                <div className="lp-stat-label">Rapid Lab TAT</div>
              </div>
              <div>
                <div className="lp-stat-number">99.9%</div>
                <div className="lp-stat-label">Diagnostic Precision</div>
              </div>
            </div>
          </div>

          {/* Quick Hero Interactive Card */}
          <div className="lp-hero-card">
            <div className="lp-hero-card-header">
              <div className="lp-card-icon-wrap">
                <Search size={22} />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
                  Quick Patient Services
                </h3>
                <span style={{ fontSize: '12.5px', color: '#64748b' }}>
                  Track reports, book OPD visits or home visits in 30 seconds
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div
                onClick={() => {
                  const el = document.getElementById('tracker');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <FileText size={20} color="#0284c7" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                      Download Diagnostic Report
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Enter Bill # or Registered Mobile
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </div>

              <div
                onClick={() => {
                  setBookingType('home_collection');
                  setIsBookingOpen(true);
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Truck size={20} color="#059669" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                      Home Blood Collection
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Painless vacuum sampling at your doorstep
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </div>

              <div
                onClick={() => {
                  const el = document.getElementById('tests');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                style={{
                  padding: '14px 16px',
                  borderRadius: '10px',
                  border: '1px solid #e2e8f0',
                  background: '#f8fafc',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Microscope size={20} color="#7c3aed" />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '14px', color: '#0f172a' }}>
                      Explore Diagnostic Test Menu
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      Pathology, 4D Ultrasound, Digital X-Ray & CT
                    </div>
                  </div>
                </div>
                <ArrowRight size={16} color="#94a3b8" />
              </div>
            </div>

            <div
              style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '12.5px',
                color: '#64748b'
              }}
            >
              <span>Instant WhatsApp Report Delivery</span>
              <span style={{ color: '#059669', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Active 24/7
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------
          4. Live Report Tracker & Download Section
         -------------------------------------------------------------------- */}
      <section id="tracker" className="lp-tracker-section">
        <div className="lp-tracker-box">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div className="lp-card-icon-wrap" style={{ width: '38px', height: '38px' }}>
              <QrCode size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Live Diagnostic Report Tracker
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>
                Enter your Bill Number (e.g. BL-2026-0001) or Registered Mobile Number to check real-time status.
              </p>
            </div>
          </div>

          <form onSubmit={handleTrackReport} className="lp-tracker-form">
            <input
              type="text"
              placeholder="e.g. BL-2026-0001 or 9876543210"
              value={reportQuery}
              onChange={(e) => setReportQuery(e.target.value)}
              className="lp-input"
            />
            <button
              type="submit"
              disabled={isSearchingReport}
              className="lp-btn-primary"
              style={{ padding: '12px 24px' }}
            >
              {isSearchingReport ? 'Searching...' : 'Track & Download'}
            </button>
          </form>

          {/* Quick Demo Pill */}
          <div style={{ marginTop: '10px', fontSize: '12px', color: '#94a3b8' }}>
            Try searching demo bill number:{' '}
            <span
              onClick={() => {
                setReportQuery('BL-2026-0001');
              }}
              style={{ color: '#0284c7', textDecoration: 'underline', cursor: 'pointer', fontWeight: 600 }}
            >
              BL-2026-0001
            </span>
          </div>

          {/* Report Results */}
          {reportStatus && (
            <div
              style={{
                marginTop: '24px',
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '12px',
                  marginBottom: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>
                    {reportStatus.patientName}
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#64748b' }}>
                    Bill #{reportStatus.billNumber} • Registered: {reportStatus.date}
                  </div>
                </div>

                {reportStatus.readyForDownload ? (
                  <button
                    onClick={() => {
                      alert(`Opening verified digital report for ${reportStatus.patientName} (${reportStatus.billNumber})`);
                    }}
                    className="lp-btn-primary"
                    style={{ background: '#059669', fontSize: '13.5px' }}
                  >
                    <Download size={15} />
                    Download Verified PDF Report
                  </button>
                ) : (
                  <span
                    style={{
                      background: '#fef3c7',
                      color: '#b45309',
                      padding: '6px 14px',
                      borderRadius: '8px',
                      fontSize: '12.5px',
                      fontWeight: 600,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <Clock size={13} />
                    Processing in Analyzer
                  </span>
                )}
              </div>

              {/* Progress Milestones */}
              <div className="lp-tracker-steps">
                {[
                  { num: 1, title: 'Registered', desc: 'Patient verified' },
                  { num: 2, title: 'Sample Barcoded', desc: 'Zero mixup vacuum tube' },
                  { num: 3, title: 'Lab Analysis', desc: 'Automated 5-part review' },
                  { num: 4, title: 'Signed & Ready', desc: 'Pathologist certified' },
                ].map((step) => {
                  const isDone = step.num <= reportStatus.currentStage;
                  return (
                    <div key={step.num} className={`lp-step-item ${isDone ? 'lp-step-active' : ''}`}>
                      <div className="lp-step-circle">
                        {isDone ? <Check size={16} /> : step.num}
                      </div>
                      <div className="lp-step-title">{step.title}</div>
                      <div className="lp-step-desc">{step.desc}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          5. Diagnostic Modalities & Specialized Departments
         -------------------------------------------------------------------- */}
      <section id="services" className="lp-section lp-section-alt">
        <div className="lp-section-header">
          <span className="lp-section-tag">Accredited Clinical Excellence</span>
          <h2 className="lp-section-title">Comprehensive Diagnostics & Polyclinic Specialties</h2>
          <p className="lp-section-desc">
            Integrated pathology, advanced ultrasonography, low-radiation digital radiography,
            and super-specialty outpatient consultations under one roof.
          </p>
        </div>

        <div className="lp-departments-grid">
          {/* Dept 1 */}
          <div className="lp-dept-card">
            <div className="lp-dept-icon" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <Microscope size={28} />
            </div>
            <h3>Pathology & Biochemistry</h3>
            <p>
              Fully automated hematology 5-part analyzers, chemiluminescence hormone testing,
              and bi-directional LIS integration for zero manual transcription errors.
            </p>
            <ul className="lp-dept-features">
              <li><CheckCircle2 size={13} color="#059669" /> Complete Hemogram & CBC</li>
              <li><CheckCircle2 size={13} color="#059669" /> Liver, Kidney & Lipid Profiles</li>
              <li><CheckCircle2 size={13} color="#059669" /> Thyroid & Vitamin D3 / B12</li>
            </ul>
            <a href="#tests" style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              View 120+ Pathology Tests &rarr;
            </a>
          </div>

          {/* Dept 2 */}
          <div className="lp-dept-card">
            <div className="lp-dept-icon" style={{ background: '#dbeafe', color: '#2563eb' }}>
              <Activity size={28} />
            </div>
            <h3>4D Ultrasound & Doppler</h3>
            <p>
              State-of-the-art color Doppler imaging for high-risk obstetrics anomaly screening,
              whole abdomen & pelvis, venous Doppler, and small parts ultrasonography.
            </p>
            <ul className="lp-dept-features">
              <li><CheckCircle2 size={13} color="#059669" /> Whole Abdomen & Pelvis Scans</li>
              <li><CheckCircle2 size={13} color="#059669" /> Antenatal Level-II Anomaly</li>
              <li><CheckCircle2 size={13} color="#059669" /> Arterial & Venous Color Doppler</li>
            </ul>
            <a href="#tests" style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              View Ultrasound Protocols &rarr;
            </a>
          </div>

          {/* Dept 3 */}
          <div className="lp-dept-card">
            <div className="lp-dept-icon" style={{ background: '#fef3c7', color: '#d97706' }}>
              <ShieldCheck size={28} />
            </div>
            <h3>Digital Radiography (X-Ray)</h3>
            <p>
              High-frequency, low-radiation DR digital detector system with instantaneous PACS
              cloud archiving and radiologist interpretation within 30 minutes.
            </p>
            <ul className="lp-dept-features">
              <li><CheckCircle2 size={13} color="#059669" /> Digital Chest PA/AP Views</li>
              <li><CheckCircle2 size={13} color="#059669" /> Spine, Joint & Extremity Scans</li>
              <li><CheckCircle2 size={13} color="#059669" /> Low-Dose Radiation Protocol</li>
            </ul>
            <a href="#tests" style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              View X-Ray Services &rarr;
            </a>
          </div>

          {/* Dept 4 */}
          <div className="lp-dept-card">
            <div className="lp-dept-icon" style={{ background: '#f3e8ff', color: '#7c3aed' }}>
              <Stethoscope size={28} />
            </div>
            <h3>Multi-Slice CT & Polyclinic OPD</h3>
            <p>
              High-resolution spiral CT scans (Brain, HRCT Chest, Abdomen) paired with daily OPD
              clinics led by experienced internal medicine specialists and gynecologists.
            </p>
            <ul className="lp-dept-features">
              <li><CheckCircle2 size={13} color="#059669" /> CT Brain Plain & HRCT Chest</li>
              <li><CheckCircle2 size={13} color="#059669" /> General Physician & Diabetologist</li>
              <li><CheckCircle2 size={13} color="#059669" /> Obstetrics & Gynecology OPD</li>
            </ul>
            <a href="#doctors" style={{ color: '#0284c7', fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}>
              Meet Consultant Doctors &rarr;
            </a>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          6. Interactive Test Directory & Live Rate Calculator
         -------------------------------------------------------------------- */}
      <section id="tests" className="lp-section">
        <div className="lp-section-header">
          <span className="lp-section-tag">Transparent Diagnostics</span>
          <h2 className="lp-section-title">Diagnostic Test Catalog & Price Calculator</h2>
          <p className="lp-section-desc">
            Search 150+ investigations, check fasting instructions, turnaround times, and add
            to your home collection basket with 1 click.
          </p>
        </div>

        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {/* Filter Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '16px',
              marginBottom: '28px'
            }}
          >
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['ALL', 'Pathology', 'Biochemistry', 'Radiology'].map((dept) => (
                <button
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '13.5px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: '1px solid',
                    borderColor: selectedDept === dept ? '#0284c7' : '#e2e8f0',
                    background: selectedDept === dept ? '#0284c7' : '#ffffff',
                    color: selectedDept === dept ? '#ffffff' : '#475569',
                    transition: 'all 0.2s'
                  }}
                >
                  {dept === 'ALL' ? 'All Investigations' : dept}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', width: '320px' }}>
              <Search
                size={17}
                style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }}
              />
              <input
                type="text"
                placeholder="Search test name or code (CBC, LFT)..."
                value={testSearch}
                onChange={(e) => setTestSearch(e.target.value)}
                className="lp-input"
                style={{ paddingLeft: '38px', paddingRight: '12px', width: '100%' }}
              />
            </div>
          </div>

          {/* Test Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
              gap: '20px'
            }}
          >
            {filteredTests.map((test) => {
              const inBasket = basket.some((b) => b.code === test.code);
              return (
                <div
                  key={test.code}
                  style={{
                    background: '#ffffff',
                    border: inBasket ? '1.5px solid #0284c7' : '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: inBasket ? '0 8px 20px -6px rgba(2, 132, 199, 0.15)' : 'none',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <span
                        style={{
                          background: '#f1f5f9',
                          color: '#0f172a',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: 700,
                          letterSpacing: '0.04em'
                        }}
                      >
                        {test.code}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 500 }}>
                        {test.dept}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0', lineHeight: 1.35 }}>
                      {test.name}
                    </h4>

                    <div style={{ fontSize: '12.5px', color: '#64748b', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>• <strong>Sample:</strong> {test.specimen}</div>
                      <div>• <strong>Preparation:</strong> {test.fasting}</div>
                      <div>• <strong>TAT:</strong> {test.tat}</div>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '12px',
                      borderTop: '1px solid #f1f5f9'
                    }}
                  >
                    <div>
                      <span style={{ fontSize: '20px', fontWeight: 800, color: '#0f172a' }}>
                        ₹{test.rate}
                      </span>
                      <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through', marginLeft: '6px' }}>
                        ₹{test.originalRate}
                      </span>
                    </div>

                    <button
                      onClick={() => toggleBasket(test)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: inBasket ? '#059669' : '#0284c7',
                        color: '#ffffff',
                        transition: 'background 0.2s'
                      }}
                    >
                      {inBasket ? (
                        <>
                          <Check size={14} /> Added
                        </>
                      ) : (
                        '+ Add to Basket'
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sticky Home Collection Basket Bar */}
          {basket.length > 0 && (
            <div
              style={{
                position: 'sticky',
                bottom: '24px',
                marginTop: '32px',
                background: '#0f172a',
                color: '#ffffff',
                borderRadius: '12px',
                padding: '16px 24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
                boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
                zIndex: 100
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ background: 'rgba(2, 132, 199, 0.3)', padding: '10px', borderRadius: '8px' }}>
                  <Truck size={22} color="#38bdf8" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '16px' }}>
                    {basket.length} {basket.length === 1 ? 'Test' : 'Tests'} Selected in Basket
                  </div>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>
                    Total Estimated Amount: <strong style={{ color: '#38bdf8' }}>₹{basketTotal}</strong> (Free doorstep sample collection within 5 km)
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  onClick={() => setBasket([])}
                  style={{
                    background: 'transparent',
                    border: '1px solid #475569',
                    color: '#cbd5e1',
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '13px'
                  }}
                >
                  Clear All
                </button>
                <button
                  onClick={() => {
                    setBookingType('home_collection');
                    setIsBookingOpen(true);
                  }}
                  className="lp-btn-primary"
                  style={{ background: '#0284c7' }}
                >
                  Confirm Home Collection &rarr;
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* --------------------------------------------------------------------
          7. Popular Health Checkup Packages
         -------------------------------------------------------------------- */}
      <section id="packages" className="lp-section lp-section-alt">
        <div className="lp-section-header">
          <span className="lp-section-tag">Preventive Wellness</span>
          <h2 className="lp-section-title">Curated Full Body Health Packages</h2>
          <p className="lp-section-desc">
            Affordable comprehensive health checkups designed by clinical experts for early
            detection of cardiac, diabetic, liver, and metabolic disorders.
          </p>
        </div>

        <div className="lp-packages-grid">
          {/* Package 1 */}
          <div className="lp-package-card">
            <h3 className="lp-package-title">Aastha Basic Wellness</h3>
            <div className="lp-package-subtitle">Essential screening for young adults (42 parameters)</div>

            <div className="lp-package-price-wrap">
              <span className="lp-package-price">₹799</span>
              <span className="lp-package-original">₹1,500</span>
              <span className="lp-package-discount">47% OFF</span>
            </div>

            <ul className="lp-package-tests">
              <li><CheckCircle2 size={16} color="#059669" /> Complete Blood Count (CBC - 24 Params)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Fasting Blood Glucose (Sugar)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Lipid Profile Screen (Cholesterol & Triglycerides)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Kidney Function Screen (Serum Creatinine & Urea)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Routine & Microscopic Urine Examination</li>
            </ul>

            <button
              onClick={() => {
                setBasket([...basket, { code: 'PKG-BASIC', name: 'Aastha Basic Wellness', rate: 799 }]);
                setBookingType('home_collection');
                setIsBookingOpen(true);
              }}
              className="lp-btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Book Basic Package
            </button>
          </div>

          {/* Package 2 (Popular) */}
          <div className="lp-package-card popular">
            <div className="lp-popular-badge">★ Most Recommended</div>
            <h3 className="lp-package-title">Executive Comprehensive Checkup</h3>
            <div className="lp-package-subtitle">Holistic whole-body analysis (78 parameters)</div>

            <div className="lp-package-price-wrap">
              <span className="lp-package-price">₹1,999</span>
              <span className="lp-package-original">₹4,200</span>
              <span className="lp-package-discount">52% OFF</span>
            </div>

            <ul className="lp-package-tests">
              <li><CheckCircle2 size={16} color="#0284c7" /> <strong>All Basic Wellness Tests</strong></li>
              <li><CheckCircle2 size={16} color="#0284c7" /> Liver Function Test (Complete LFT - 11 Params)</li>
              <li><CheckCircle2 size={16} color="#0284c7" /> Kidney Function Test (KFT + Electrolytes)</li>
              <li><CheckCircle2 size={16} color="#0284c7" /> Thyroid Profile Total (T3, T4, TSH)</li>
              <li><CheckCircle2 size={16} color="#0284c7" /> HbA1c (Glycosylated Hemoglobin Diabetes Index)</li>
              <li><CheckCircle2 size={16} color="#0284c7" /> Digital Chest X-Ray PA View</li>
              <li><CheckCircle2 size={16} color="#0284c7" /> Resting 12-Lead ECG Screening</li>
            </ul>

            <button
              onClick={() => {
                setBasket([...basket, { code: 'PKG-EXEC', name: 'Executive Comprehensive Checkup', rate: 1999 }]);
                setBookingType('home_collection');
                setIsBookingOpen(true);
              }}
              className="lp-btn-primary"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Book Executive Package
            </button>
          </div>

          {/* Package 3 */}
          <div className="lp-package-card">
            <h3 className="lp-package-title">Senior Citizen Golden Health</h3>
            <div className="lp-package-subtitle">Specialized geriatric profile with vitamins (92 parameters)</div>

            <div className="lp-package-price-wrap">
              <span className="lp-package-price">₹2,799</span>
              <span className="lp-package-original">₹6,000</span>
              <span className="lp-package-discount">53% OFF</span>
            </div>

            <ul className="lp-package-tests">
              <li><CheckCircle2 size={16} color="#059669" /> <strong>All Executive Checkup Tests</strong></li>
              <li><CheckCircle2 size={16} color="#059669" /> Vitamin D3 (25-OH Total)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Vitamin B12 (Cyanocobalamin)</li>
              <li><CheckCircle2 size={16} color="#059669" /> Serum Calcium & Bone Health Index</li>
              <li><CheckCircle2 size={16} color="#059669" /> Cardiac Risk Markers & Uric Acid</li>
              <li><CheckCircle2 size={16} color="#059669" /> High-Resolution Ultrasound Abdomen</li>
            </ul>

            <button
              onClick={() => {
                setBasket([...basket, { code: 'PKG-SENIOR', name: 'Senior Citizen Golden Health', rate: 2799 }]);
                setBookingType('home_collection');
                setIsBookingOpen(true);
              }}
              className="lp-btn-outline"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              Book Senior Care Package
            </button>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          8. Specialist Doctors & Medical Leadership
         -------------------------------------------------------------------- */}
      <section id="doctors" className="lp-section">
        <div className="lp-section-header">
          <span className="lp-section-tag">Clinical Leadership</span>
          <h2 className="lp-section-title">Meet Our Senior Specialists & Consultants</h2>
          <p className="lp-section-desc">
            Compassionate, board-certified clinicians and medical directors providing accurate
            consultation and expert diagnostic interpretations.
          </p>
        </div>

        <div className="lp-doctors-grid">
          {/* Doctor 1 */}
          <div className="lp-doctor-card">
            <div className="lp-doctor-avatar">RG</div>
            <h4 className="lp-doctor-name">Dr. Rajesh Gupta</h4>
            <div className="lp-doctor-spec">General Medicine & Diabetology</div>
            <div className="lp-doctor-deg">MD (Medicine), MBBS • 18+ Yrs Exp</div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Specialist in chronic metabolic diseases, diabetes management, hypertension, and lifestyle medicine.
            </p>
            <button
              onClick={() => {
                setBookingType('opd_visit');
                setIsBookingOpen(true);
              }}
              className="lp-btn-outline"
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              Consult Dr. Gupta
            </button>
          </div>

          {/* Doctor 2 */}
          <div className="lp-doctor-card">
            <div className="lp-doctor-avatar" style={{ background: '#fdf2f8', color: '#db2777' }}>SD</div>
            <h4 className="lp-doctor-name">Dr. Sunita Deshmukh</h4>
            <div className="lp-doctor-spec" style={{ color: '#db2777' }}>Obstetrics & Gynecology</div>
            <div className="lp-doctor-deg">MBBS, DGO • 15+ Yrs Exp</div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Expert in high-risk pregnancy care, women's wellness, infertility screening, and hormonal health.
            </p>
            <button
              onClick={() => {
                setBookingType('opd_visit');
                setIsBookingOpen(true);
              }}
              className="lp-btn-outline"
              style={{ fontSize: '12.5px', padding: '6px 14px' }}
            >
              Consult Dr. Deshmukh
            </button>
          </div>

          {/* Doctor 3 */}
          <div className="lp-doctor-card">
            <div className="lp-doctor-avatar" style={{ background: '#eff6ff', color: '#2563eb' }}>AS</div>
            <h4 className="lp-doctor-name">Dr. A. K. Sharma</h4>
            <div className="lp-doctor-spec" style={{ color: '#2563eb' }}>Director of Pathology</div>
            <div className="lp-doctor-deg">MD (Pathology), Ex-AIIMS • 20+ Yrs Exp</div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Leads our NABL accredited laboratory quality programs, automated hematology, and histopathology.
            </p>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              ✓ Lab Quality Sign-off
            </span>
          </div>

          {/* Doctor 4 */}
          <div className="lp-doctor-card">
            <div className="lp-doctor-avatar" style={{ background: '#f5f3ff', color: '#7c3aed' }}>PV</div>
            <h4 className="lp-doctor-name">Dr. Pradeep Verma</h4>
            <div className="lp-doctor-spec" style={{ color: '#7c3aed' }}>Consultant Radiologist</div>
            <div className="lp-doctor-deg">MD, DMRD (Radiodiagnosis) • 14+ Yrs Exp</div>
            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>
              Specializes in fetal ultrasound anomalies, color Doppler vascular studies, digital radiography and CT imaging.
            </p>
            <span style={{ fontSize: '12px', color: '#059669', fontWeight: 600 }}>
              ✓ Radiology Sign-off
            </span>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          9. Why Choose Aastha Polyclinic - Quality Pillars
         -------------------------------------------------------------------- */}
      <section className="lp-section lp-section-alt">
        <div className="lp-section-header">
          <span className="lp-section-tag">Quality Assurance</span>
          <h2 className="lp-section-title">Why Doctors & Families Trust Aastha</h2>
          <p className="lp-section-desc">
            Built on stringent NABL ISO 15189 diagnostic protocols and patient-first care.
          </p>
        </div>

        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '24px'
          }}
        >
          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Award size={32} color="#0284c7" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              NABL Standard Quality
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Daily 3-level internal quality controls (IQC) and EQAS participation guarantee verified accuracy.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <QrCode size={32} color="#059669" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Zero Sample Mix-up
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Dual-barcode labeling at collection time ensures bidirectional tracking through automated analyzers.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <MessageSquare size={32} color="#2563eb" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Instant WhatsApp Reports
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Receive encrypted, password-protected PDF test reports on WhatsApp and SMS the moment they are signed.
            </p>
          </div>

          <div style={{ background: '#ffffff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <Truck size={32} color="#d97706" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 8px 0', fontSize: '17px', fontWeight: 700, color: '#0f172a' }}>
              Painless Home Visits
            </h4>
            <p style={{ margin: 0, fontSize: '13.5px', color: '#64748b', lineHeight: 1.5 }}>
              Trained phlebotomists collect vacuum-tube samples safely at your home with sterile single-use kits.
            </p>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          10. Contact, Location & Opening Hours
         -------------------------------------------------------------------- */}
      <section id="contact" className="lp-section">
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: '#ffffff',
            borderRadius: '20px',
            padding: '48px',
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '40px',
            alignItems: 'center'
          }}
        >
          <div>
            <span
              style={{
                background: 'rgba(2, 132, 199, 0.25)',
                color: '#38bdf8',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontSize: '12px',
                fontWeight: 600,
                display: 'inline-block',
                marginBottom: '16px'
              }}
            >
              Visit Our Centre
            </span>

            <h2 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 16px 0', lineHeight: 1.25 }}>
              Aastha Polyclinic & Diagnostic Centre
            </h2>

            <p style={{ fontSize: '16px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 28px 0', maxWidth: '520px' }}>
              Conveniently located with dedicated patient parking, wheelchair accessibility,
              comfortable waiting lounge, and sterile sample collection stations.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14.5px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <MapPin size={20} color="#38bdf8" />
                <span>Plot 42, Health City Enclave, Medical Square, Main Road</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <PhoneCall size={20} color="#38bdf8" />
                <span>Direct Appointments: +91 98765 43210 / +91 98765 43299</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Clock size={20} color="#38bdf8" />
                <span>Mon – Sat: 7:00 AM – 9:00 PM | Sunday: 7:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '32px',
              backdropFilter: 'blur(8px)'
            }}
          >
            <h3 style={{ fontSize: '19px', fontWeight: 700, margin: '0 0 16px 0' }}>
              Book an Appointment
            </h3>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', margin: '0 0 20px 0' }}>
              Have questions or need to book a priority ultrasound or CT scan slot? Contact our reception desk now.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <button
                onClick={() => {
                  setBookingType('home_collection');
                  setIsBookingOpen(true);
                }}
                className="lp-btn-primary"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
              >
                <Truck size={17} /> Request Home Visit Online
              </button>

              <button
                onClick={() => {
                  setBookingType('opd_visit');
                  setIsBookingOpen(true);
                }}
                className="lp-btn-outline"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px',
                  background: 'transparent',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.2)'
                }}
              >
                <Calendar size={17} /> Schedule Clinic Consultation
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------------
          11. Footer
         -------------------------------------------------------------------- */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <div className="lp-logo-icon" style={{ width: '36px', height: '36px' }}>
                <HeartPulse size={20} />
              </div>
              <span style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff' }}>
                Aastha Polyclinic
              </span>
            </div>
            <p style={{ fontSize: '13.5px', color: '#94a3b8', lineHeight: 1.6, margin: '0 0 18px 0' }}>
              Leading multi-specialty polyclinic & NABL accredited diagnostic facility.
              Providing comprehensive pathology, ultrasound, digital radiography, and specialty OPD care.
            </p>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              NABL ISO 15189:2022 • ICMR Registered • AERB Certified
            </div>
          </div>

          <div className="lp-footer-col">
            <h4>Quick Links</h4>
            <ul className="lp-footer-links">
              <li><a href="#services">Diagnostic Services</a></li>
              <li><a href="#tests">Test Menu & Rates</a></li>
              <li><a href="#packages">Health Packages</a></li>
              <li><a href="#doctors">Consultant Doctors</a></li>
              <li><a href="#tracker">Report Tracker</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>Diagnostics</h4>
            <ul className="lp-footer-links">
              <li><a href="#tests">Complete Blood Count</a></li>
              <li><a href="#tests">Liver & Kidney Function</a></li>
              <li><a href="#tests">4D Ultrasound Abdomen</a></li>
              <li><a href="#tests">Digital Chest X-Ray</a></li>
              <li><a href="#tests">Multi-Slice CT Brain</a></li>
            </ul>
          </div>

          <div className="lp-footer-col">
            <h4>LIS Administration</h4>
            <p style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '16px' }}>
              Secure terminal access for lab technicians, radiologists, phlebotomists, and administrators.
            </p>
            <button
              onClick={currentUser ? onOpenDashboard : onOpenLogin}
              className="lp-btn-primary"
              style={{ background: '#1e293b', border: '1px solid #334155', width: '100%', justifyContent: 'center' }}
            >
              <Lock size={15} />
              {currentUser ? 'Open LIS Terminal' : 'Staff LIS Login'}
            </button>
          </div>
        </div>

        <div className="lp-footer-bottom">
          <div>
            © {new Date().getFullYear()} Aastha Polyclinic & Diagnostic Centre. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <span>Powered by Labsmart Healthcare LIS Cloud</span>
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* --------------------------------------------------------------------
          12. Interactive Booking Modal (Home Sample Collection & OPD)
         -------------------------------------------------------------------- */}
      {isBookingOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.7)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '520px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
              padding: '28px',
              position: 'relative'
            }}
          >
            <button
              onClick={() => {
                setIsBookingOpen(false);
                setBookingSuccess(null);
              }}
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748b'
              }}
            >
              <X size={20} />
            </button>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '16px 8px' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    background: '#dcfce7',
                    color: '#15803d',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 16px auto'
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <h3 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>
                  Booking Request Confirmed!
                </h3>
                <p style={{ fontSize: '14px', color: '#64748b', margin: '0 0 20px 0' }}>
                  Thank you, <strong>{bookingSuccess.patientName}</strong>. Your appointment request has been logged.
                </p>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '16px',
                    textAlign: 'left',
                    fontSize: '13.5px',
                    marginBottom: '24px'
                  }}
                >
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Reference ID:</strong>{' '}
                    <span style={{ color: '#0284c7', fontWeight: 700 }}>{bookingSuccess.refNumber}</span>
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Service:</strong> {bookingSuccess.service}
                  </div>
                  <div style={{ marginBottom: '6px' }}>
                    <strong>Slot:</strong> {bookingSuccess.time}
                  </div>
                  {bookingSuccess.totalAmount > 0 && (
                    <div>
                      <strong>Estimated Amount:</strong> ₹{bookingSuccess.totalAmount}
                    </div>
                  )}
                </div>

                <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>
                  Our medical coordinator will call you within 15 minutes to confirm the exact phlebotomist arrival time.
                </p>

                <button
                  onClick={() => {
                    setIsBookingOpen(false);
                    setBookingSuccess(null);
                    setBasket([]);
                  }}
                  className="lp-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Done
                </button>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <div className="lp-card-icon-wrap" style={{ width: '36px', height: '36px' }}>
                    <Calendar size={18} />
                  </div>
                  <h3 style={{ fontSize: '19px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {bookingType === 'home_collection' ? 'Book Home Sample Collection' : 'Schedule OPD Consultation'}
                  </h3>
                </div>
                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>
                  Enter your details below and our lab executive will contact you right away.
                </p>

                {/* Service Type Switcher */}
                <div
                  style={{
                    display: 'flex',
                    background: '#f1f5f9',
                    borderRadius: '8px',
                    padding: '4px',
                    marginBottom: '20px'
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setBookingType('home_collection')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: bookingType === 'home_collection' ? '#ffffff' : 'transparent',
                      color: bookingType === 'home_collection' ? '#0284c7' : '#64748b',
                      boxShadow: bookingType === 'home_collection' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Home Sample Collection
                  </button>
                  <button
                    type="button"
                    onClick={() => setBookingType('opd_visit')}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      background: bookingType === 'opd_visit' ? '#ffffff' : 'transparent',
                      color: bookingType === 'opd_visit' ? '#0284c7' : '#64748b',
                      boxShadow: bookingType === 'opd_visit' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
                    }}
                  >
                    Clinic OPD Visit
                  </button>
                </div>

                <form onSubmit={handleBookingSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                      className="lp-input"
                      style={{ width: '100%', boxSizing: 'border-box' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                        Mobile Number (for SMS & Reports) *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="10-digit number"
                        value={bookingForm.mobile}
                        onChange={(e) => setBookingForm({ ...bookingForm, mobile: e.target.value })}
                        className="lp-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={bookingForm.age}
                        onChange={(e) => setBookingForm({ ...bookingForm, age: e.target.value })}
                        className="lp-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>
                  </div>

                  {bookingType === 'home_collection' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                        Pickup Address & Landmark *
                      </label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Flat / House number, building, area and landmark"
                        value={bookingForm.address}
                        onChange={(e) => setBookingForm({ ...bookingForm, address: e.target.value })}
                        className="lp-input"
                        style={{ width: '100%', boxSizing: 'border-box', resize: 'none' }}
                      />
                    </div>
                  )}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={bookingForm.preferredDate}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredDate: e.target.value })}
                        className="lp-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#334155' }}>
                        Time Slot
                      </label>
                      <select
                        value={bookingForm.preferredTime}
                        onChange={(e) => setBookingForm({ ...bookingForm, preferredTime: e.target.value })}
                        className="lp-input"
                        style={{ width: '100%', boxSizing: 'border-box' }}
                      >
                        <option>Morning (07:00 AM - 10:00 AM)</option>
                        <option>Mid-Day (10:00 AM - 01:00 PM)</option>
                        <option>Afternoon (01:00 PM - 05:00 PM)</option>
                        <option>Evening (05:00 PM - 08:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  {basket.length > 0 && (
                    <div
                      style={{
                        background: '#f8fafc',
                        padding: '10px 14px',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        fontSize: '13px'
                      }}
                    >
                      <span style={{ color: '#64748b' }}>Selected tests ({basket.length}): </span>
                      <strong style={{ color: '#0f172a' }}>{basket.map((b) => b.name).join(', ')}</strong>
                      <div style={{ marginTop: '4px', fontWeight: 700, color: '#0284c7' }}>
                        Total Payable: ₹{basketTotal}
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="lp-btn-primary"
                    style={{ width: '100%', justifyContent: 'center', padding: '12px', marginTop: '6px' }}
                  >
                    Confirm Booking Request
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
