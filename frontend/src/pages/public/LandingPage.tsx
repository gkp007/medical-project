import React, { useState, useEffect, useRef } from 'react';
import './nd-styles.css';
import {
  Phone,
  FlaskConical,
  Microscope,
  Mail,
  Clock,
  Calendar,
  Search,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  X,
  Menu,
  Star,
  Users,
  FileText,
  Truck,
  HeartPulse,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  Stethoscope,
  Activity,
  MessageCircle,
  Play,
  Pause,
  RefreshCw,
  Send,
  MapPin,
  ExternalLink,
  Lock,
  CreditCard,
  UserCheck,
  Check,
  BookOpen
} from 'lucide-react';

import {
  Doctor,
  ClinicService,
  HealthPackage,
  DiagnosticTest,
  BlogPost,
  FAQItem,
  Testimonial,
  CLINIC_INFO,
  DOCTORS_DATA,
  SERVICES_DATA,
  PACKAGES_DATA,
  ALL_TESTS_DATA,
  BLOGS_DATA,
  FAQS_DATA,
  TESTIMONIALS_DATA,
} from './landingData';

import { DoctorBookingModal } from './modals/DoctorBookingModal';
import { TestBookingModal } from './modals/TestBookingModal';
import { TrackBookingModal } from './modals/TrackBookingModal';
import { ComparePackagesModal } from './modals/ComparePackagesModal';
import { DepartmentDetailsModal } from './modals/DepartmentDetailsModal';
import { DoctorProfileModal } from './modals/DoctorProfileModal';
import { BlogArticleModal } from './modals/BlogArticleModal';

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
  // Live Clock State (IST)
  const [currentTime, setCurrentTime] = useState<{
    day: string;
    dateStr: string;
    hours: string;
    minutes: string;
    seconds: string;
    ampm: string;
  }>({
    day: 'Wed',
    dateStr: '11 Nov',
    hours: '05',
    minutes: '30',
    seconds: '00',
    ampm: 'PM',
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Kolkata',
        weekday: 'short',
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      const formatter = new Intl.DateTimeFormat('en-IN', options);
      const parts = formatter.formatToParts(now);

      const weekday = parts.find(p => p.type === 'weekday')?.value || 'Wed';
      const day = parts.find(p => p.type === 'day')?.value || '11';
      const month = parts.find(p => p.type === 'month')?.value || 'Nov';
      const hour = parts.find(p => p.type === 'hour')?.value || '05';
      const minute = parts.find(p => p.type === 'minute')?.value || '30';
      const second = parts.find(p => p.type === 'second')?.value || '00';
      const dayPeriod = parts.find(p => p.type === 'dayPeriod')?.value?.toUpperCase() || 'PM';

      setCurrentTime({
        day: weekday,
        dateStr: `${day} ${month}`,
        hours: hour,
        minutes: minute,
        seconds: second,
        ampm: dayPeriod,
      });
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Modals Open State
  const [isDoctorBookingOpen, setIsDoctorBookingOpen] = useState(false);
  const [selectedDoctorIdForBooking, setSelectedDoctorIdForBooking] = useState<string | null>(null);
  const [selectedSpecialtyForBooking, setSelectedSpecialtyForBooking] = useState<string | null>(null);

  const [isTestBookingOpen, setIsTestBookingOpen] = useState(false);
  const [selectedTestIdForBooking, setSelectedTestIdForBooking] = useState<string | null>(null);
  const [selectedPackageIdForBooking, setSelectedPackageIdForBooking] = useState<string | null>(null);
  const [bookingMode, setBookingMode] = useState<'center' | 'home'>('center');

  const [isTrackBookingOpen, setIsTrackBookingOpen] = useState(false);
  const [isComparePackagesOpen, setIsComparePackagesOpen] = useState(false);

  const [selectedDepartment, setSelectedDepartment] = useState<ClinicService | null>(null);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState<Doctor | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<BlogPost | null>(null);

  // Navigation Menus State
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Live 3S Rotating Spotlight State
  const [spotlightIndex, setSpotlightIndex] = useState(0);
  const [spotlightDoctorIndex, setSpotlightDoctorIndex] = useState(0);
  const [spotlightTestIndex, setSpotlightTestIndex] = useState(0);
  const [spotlightArticleIndex, setSpotlightArticleIndex] = useState(0);
  const [isSpotlightPaused, setIsSpotlightPaused] = useState(false);

  useEffect(() => {
    if (isSpotlightPaused) return;
    const interval = setInterval(() => {
      setSpotlightIndex(prev => prev + 1);
      setSpotlightDoctorIndex(prev => (prev + 1) % DOCTORS_DATA.length);
      setSpotlightTestIndex(prev => (prev + 1) % ALL_TESTS_DATA.length);
      setSpotlightArticleIndex(prev => (prev + 1) % BLOGS_DATA.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isSpotlightPaused]);

  // Test Directory State
  const [testSearchQuery, setTestSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [testOffset, setTestOffset] = useState(0);
  const [isTestShufflingPaused, setIsTestShufflingPaused] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  const testCategories = [
    'All',
    'Biochemistry',
    'Hematology',
    'Immunology & Serology',
    'Microbiology',
    'Molecular Biology',
    'Histopathology',
    'Radiology & USG',
    'Cardiac Diagnostics',
    'Physiotherapy',
  ];

  // Auto shuffle test catalog every 7 seconds if not paused and no search query
  useEffect(() => {
    if (isTestShufflingPaused || testSearchQuery) return;
    const interval = setInterval(() => {
      setTestOffset(prev => (prev + 3) % (ALL_TESTS_DATA.length - 6));
    }, 7000);
    return () => clearInterval(interval);
  }, [isTestShufflingPaused, testSearchQuery]);

  const filteredTests = ALL_TESTS_DATA.filter(t => {
    const matchesQuery =
      !testSearchQuery ||
      t.name.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
      t.code.toLowerCase().includes(testSearchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(testSearchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      t.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      t.subCategory?.toLowerCase().includes(selectedCategory.toLowerCase());

    return matchesQuery && matchesCategory;
  });

  const displayedTests = testSearchQuery
    ? filteredTests
    : filteredTests.slice(testOffset, testOffset + 9).length >= 6
    ? filteredTests.slice(testOffset, testOffset + 9)
    : filteredTests.slice(0, 9);

  // FAQ State
  const [faqCategory, setFaqCategory] = useState('All');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-1');

  const filteredFaqs =
    faqCategory === 'All'
      ? FAQS_DATA
      : FAQS_DATA.filter(f => f.category.toLowerCase().includes(faqCategory.toLowerCase()));

  // Callback Enquiry Form State
  const [callbackForm, setCallbackForm] = useState({
    name: '',
    phone: '',
    subject: 'Doctor Appointment Inquiry',
    message: '',
  });
  const [callbackStatus, setCallbackStatus] = useState<string | null>(null);

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!callbackForm.name.trim() || !callbackForm.phone.trim()) {
      alert('Please provide your name and phone number');
      return;
    }
    setCallbackStatus('submitting');
    setTimeout(() => {
      setCallbackStatus('success');
      setCallbackForm({
        name: '',
        phone: '',
        subject: 'Doctor Appointment Inquiry',
        message: '',
      });
      setTimeout(() => setCallbackStatus(null), 5000);
    }, 700);
  };

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      categoryScrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth',
      });
    }
  };

  const handleOpenDoctorBooking = (doctorId?: string, specialty?: string) => {
    setSelectedDoctorIdForBooking(doctorId || null);
    setSelectedSpecialtyForBooking(specialty || null);
    setIsDoctorBookingOpen(true);
  };

  const handleOpenTestBooking = (testId?: string, packageId?: string, mode: 'center' | 'home' = 'center') => {
    setSelectedTestIdForBooking(testId || null);
    setSelectedPackageIdForBooking(packageId || null);
    setBookingMode(mode);
    setIsTestBookingOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-transparent text-slate-900 font-sans selection:bg-sky-100 selection:text-sky-900 relative">
      {/* =========================================================================
          1. TOP MICRO-BAR: Helplines, Social Icons, IST Clock & Live Marquee Ticker
          ========================================================================= */}
      <div className="bg-slate-950 text-slate-200 text-xs border-b border-slate-800/80 select-none">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-3">
          {/* Left Helplines */}
          <div className="flex flex-wrap items-center gap-x-4 sm:gap-x-6 gap-y-1.5">
            <div className="flex items-center gap-1.5 text-sky-400 font-medium">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <span className="hidden sm:inline text-slate-400">Clinic Booking:</span>
              <a
                href={`tel:${CLINIC_INFO.phonePrimary}`}
                className="text-white hover:text-sky-300 font-bold tracking-wide transition-colors"
              >
                {CLINIC_INFO.phonePrimary}
              </a>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 text-teal-400 font-medium">
              <FlaskConical className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-400">Laboratory:</span>
              <a
                href={`tel:${CLINIC_INFO.phoneLab}`}
                className="text-white hover:text-teal-300 font-semibold tracking-wide transition-colors"
              >
                {CLINIC_INFO.phoneLab}
              </a>
            </div>

            <div className="hidden xl:flex items-center gap-1.5 text-cyan-400 font-medium">
              <Microscope className="w-3.5 h-3.5 shrink-0" />
              <span className="text-slate-400">Histopathology:</span>
              <a
                href={`tel:${CLINIC_INFO.phoneHistopath}`}
                className="text-white hover:text-cyan-300 font-semibold tracking-wide transition-colors"
              >
                {CLINIC_INFO.phoneHistopath}
              </a>
            </div>

            <div className="hidden md:flex items-center gap-1.5 text-slate-400">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a
                href={`mailto:${CLINIC_INFO.email}`}
                className="text-slate-300 hover:text-white transition-colors"
              >
                {CLINIC_INFO.email}
              </a>
            </div>
          </div>

          {/* Right: Social Icons & Live Real-Time IST Clock */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center pr-2 border-r border-slate-800">
              <div className="inline-flex items-center gap-1.5 p-1 bg-slate-900/80 rounded-2xl border border-slate-700/60 backdrop-blur-md">
                <a
                  href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Aastha%20Diagnostics%2C%20I%20would%20like%20to%20inquire%20about%20booking%20and%20reports`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Connect with Aastha Diagnostics on WhatsApp"
                  className="p-2 rounded-xl text-slate-300 hover:text-white transition-all duration-150 hover:scale-105 bg-emerald-600 hover:bg-emerald-500"
                  title="WhatsApp: Chat Live"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://facebook.com/aasthapolyclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit Facebook Page"
                  className="p-2 rounded-xl text-slate-300 hover:text-white transition-all duration-150 hover:scale-105 bg-blue-600 hover:bg-blue-500"
                  title="Facebook: Official Page"
                >
                  <svg className="w-3.5 h-3.5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </a>
                <a
                  href="https://instagram.com/aasthapolyclinic"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Follow on Instagram"
                  className="p-2 rounded-xl text-slate-300 hover:text-white transition-all duration-150 hover:scale-105 bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 hover:opacity-90"
                  title="Instagram: Health Tips"
                >
                  <svg className="w-3.5 h-3.5 stroke-currentColor fill-none" viewBox="0 0 24 24" strokeWidth="2">
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </a>
                <a
                  href="https://maps.google.com/?q=Aastha+Polyclinic+and+Diagnostics"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Read and Write Google Reviews"
                  className="p-2 rounded-xl text-slate-300 hover:text-white transition-all duration-150 hover:scale-105 bg-amber-500 hover:bg-amber-400"
                  title="Google Review: 5.0 ★ Rating"
                >
                  <Star className="w-3.5 h-3.5 fill-white text-white" />
                </a>
              </div>
            </div>

            {/* Live IST Clock with pulsing green dot */}
            <div
              className="inline-flex items-center gap-2 bg-slate-900/90 text-slate-100 border border-slate-700/80 px-2.5 sm:px-3 py-1 rounded-xl shadow-xs backdrop-blur-md select-none font-mono"
              title="Clinic Real-Time Indian Standard Time (IST)"
            >
              <div className="flex items-center gap-1.5 text-teal-400">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Clock className="w-3.5 h-3.5 text-teal-300 shrink-0" />
              </div>
              <span className="hidden sm:inline-block text-[11px] font-sans font-medium text-slate-300 border-r border-slate-700/80 pr-2">
                {currentTime.day}, {currentTime.dateStr}
              </span>
              <div className="flex items-baseline gap-1 text-xs sm:text-sm font-bold tracking-wider text-white">
                <span className="text-teal-300 font-extrabold">{currentTime.hours}</span>
                <span className="text-teal-400/80 animate-pulse">:</span>
                <span className="text-teal-300 font-extrabold">{currentTime.minutes}</span>
                <span className="text-teal-400/80 animate-pulse">:</span>
                <span className="text-sky-300 text-xs font-semibold">{currentTime.seconds}</span>
                <span className="text-[10px] font-sans font-black text-amber-300 ml-0.5 uppercase tracking-normal">
                  {currentTime.ampm}
                </span>
                <span className="text-[9px] font-sans font-bold text-slate-400 hidden sm:inline ml-0.5">
                  IST
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Announcement Ticker */}
      <div className="bg-gradient-to-r from-sky-950 via-slate-900 to-teal-950 text-white border-b border-sky-500/20 py-2 overflow-hidden relative shadow-xs select-none">
        <div className="flex items-center">
          <div className="shrink-0 flex items-center gap-1.5 bg-sky-900/90 text-sky-200 border border-sky-400/40 px-2.5 sm:px-3.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold mx-2 sm:mx-4 z-10 shadow-sm backdrop-blur-md">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="uppercase tracking-wider whitespace-nowrap">Welcome</span>
          </div>

          <div className="relative w-full overflow-hidden whitespace-nowrap">
            <div className="inline-flex animate-marquee hover:[animation-play-state:paused] cursor-pointer">
              <span className="inline-flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-100 px-4">
                <span className="inline-flex items-center gap-2 text-sky-200 font-extrabold tracking-wide">
                  <img src="/aastha-icon.svg" alt="Aastha" className="w-4 h-4 inline-block" />
                  <span>Welcome to {CLINIC_INFO.name}, {CLINIC_INFO.city}</span>
                </span>
                <span className="text-teal-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">
                  <span className="text-teal-300 font-bold">{CLINIC_INFO.tagline}</span> — {CLINIC_INFO.subTagline}
                </span>
                <span className="text-sky-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">
                  Direct Clinic Booking: <span className="text-sky-300 font-bold">{CLINIC_INFO.phonePrimary}</span> | 24x7 Diagnostic & Histopathology Services
                </span>
                <span className="text-teal-400 font-bold">•</span>
              </span>

              {/* Second loop duplicate for seamless continuous translation */}
              <span className="inline-flex items-center gap-6 text-xs sm:text-sm font-semibold text-slate-100 px-4" aria-hidden="true">
                <span className="inline-flex items-center gap-2 text-sky-200 font-extrabold tracking-wide">
                  <img src="/aastha-icon.svg" alt="Aastha" className="w-4 h-4 inline-block" />
                  <span>Welcome to {CLINIC_INFO.name}, {CLINIC_INFO.city}</span>
                </span>
                <span className="text-teal-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">
                  <span className="text-teal-300 font-bold">{CLINIC_INFO.tagline}</span> — {CLINIC_INFO.subTagline}
                </span>
                <span className="text-sky-400 font-bold">•</span>
                <span className="text-slate-300 font-medium">
                  Direct Clinic Booking: <span className="text-sky-300 font-bold">{CLINIC_INFO.phonePrimary}</span> | 24x7 Diagnostic & Histopathology Services
                </span>
                <span className="text-teal-400 font-bold">•</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          2. STICKY MAIN HEADER: Brand, Nav with Dropdowns, Track & Pay, Book Appt
          ========================================================================= */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-xl border-b border-slate-200/80 shadow-xs transition-all">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-3 sm:gap-4 md:gap-6">
            {/* Logo */}
            <div
              id="header-brand-logo-container"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="cursor-pointer group py-1 min-w-0 max-w-[100px] md:max-w-[180px] shrink-0 flex items-center"
              title={`${CLINIC_INFO.name} - Home`}
            >
              <img
                alt={CLINIC_INFO.name}
                className="w-full h-auto max-h-12 md:max-h-14 object-contain transition-transform duration-200 group-hover:opacity-95"
                src="/aastha-logo.svg"
              />
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-sm font-semibold">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap text-sky-800 bg-sky-50/90 border border-sky-200/80 shadow-2xs"
              >
                Home
              </button>

              {/* Clinical Care Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('clinical')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => {
                    document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-slate-700 hover:text-sky-700 hover:bg-slate-50"
                  aria-expanded={activeDropdown === 'clinical'}
                >
                  <Stethoscope className="w-3.5 h-3.5 text-sky-600" />
                  <span>Clinical Care</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                      activeDropdown === 'clinical' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === 'clinical' && (
                  <div className="absolute top-full left-0 w-80 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-1">
                      12 Specialty Outpatient Clinics
                    </div>
                    <div className="grid grid-cols-1 gap-1 max-h-72 overflow-y-auto pr-1">
                      {SERVICES_DATA.map(srv => (
                        <div
                          key={srv.id}
                          onClick={() => {
                            setSelectedDepartment(srv);
                            setActiveDropdown(null);
                          }}
                          className="px-3 py-2 rounded-xl hover:bg-sky-50 text-xs font-medium text-slate-700 hover:text-sky-800 flex items-center justify-between transition-colors cursor-pointer"
                        >
                          <span>{srv.name}</span>
                          <ChevronRight className="w-3 h-3 text-slate-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Diagnostics & Lab Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('diagnostics')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  onClick={() => {
                    document.getElementById('tests-section')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-slate-700 hover:text-teal-700 hover:bg-slate-50"
                  aria-expanded={activeDropdown === 'diagnostics'}
                >
                  <FlaskConical className="w-3.5 h-3.5 text-teal-600" />
                  <span>Diagnostics & Lab</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                      activeDropdown === 'diagnostics' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === 'diagnostics' && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="space-y-1">
                      <div
                        onClick={() => {
                          document.getElementById('tests-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2.5 rounded-xl hover:bg-teal-50 cursor-pointer"
                      >
                        <div className="text-xs font-bold text-slate-900">800+ Diagnostic Directory</div>
                        <div className="text-[11px] text-slate-500">Biochemistry, Hematology, Microbiology</div>
                      </div>
                      <div
                        onClick={() => {
                          document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2.5 rounded-xl hover:bg-teal-50 cursor-pointer"
                      >
                        <div className="text-xs font-bold text-slate-900">Health Checkup Packages</div>
                        <div className="text-[11px] text-slate-500">Full Body & Organ Specific Panels</div>
                      </div>
                      <div
                        onClick={() => {
                          handleOpenTestBooking(undefined, undefined, 'home');
                          setActiveDropdown(null);
                        }}
                        className="p-2.5 rounded-xl hover:bg-teal-50 cursor-pointer"
                      >
                        <div className="text-xs font-bold text-teal-700">Home Sample Collection</div>
                        <div className="text-[11px] text-slate-500">Certified phlebotomist at doorstep</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* About & Info Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('about')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button
                  className="px-3 py-2 rounded-xl text-xs xl:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 text-slate-700 hover:text-sky-700 hover:bg-slate-50"
                  aria-expanded={activeDropdown === 'about'}
                >
                  <Sparkles className="w-3.5 h-3.5 text-sky-600" />
                  <span>About & Info</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-400 ${
                      activeDropdown === 'about' ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {activeDropdown === 'about' && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="space-y-0.5 text-xs">
                      <div
                        onClick={() => {
                          document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                      >
                        Specialist Medical Doctors
                      </div>
                      <div
                        onClick={() => {
                          document.getElementById('faq-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                      >
                        Frequently Asked Questions
                      </div>
                      <div
                        onClick={() => {
                          document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                      >
                        Doctor Health Guides
                      </div>
                      <div
                        onClick={() => {
                          document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                          setActiveDropdown(null);
                        }}
                        className="p-2 rounded-xl hover:bg-slate-50 font-medium text-slate-700 cursor-pointer"
                      >
                        Clinic Location & Support
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Action Buttons: Track & Pay, Book Appointment */}
            <div className="hidden lg:flex items-center gap-2 xl:gap-2.5 shrink-0">
              <button
                onClick={() => setIsTrackBookingOpen(true)}
                style={{ backgroundColor: 'rgba(236, 253, 245, 0.9)', borderColor: 'rgba(110, 231, 183, 0.8)', color: '#065f46' }}
                className="px-3 py-2 text-xs font-bold rounded-xl border border-emerald-300/80 bg-emerald-50/80 text-emerald-800 hover:bg-emerald-100 hover:border-emerald-400 flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                title="Track Request Status & Make Payment"
              >
                <Clock className="w-3.5 h-3.5 text-emerald-600" />
                <span>Track & Pay</span>
              </button>

              <button
                onClick={() => handleOpenDoctorBooking()}
                style={{ background: 'linear-gradient(to right, #0284c7, #0d9488)', color: '#ffffff' }}
                className="px-3.5 xl:px-4 py-2 text-xs xl:text-sm font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 shadow-md shadow-sky-600/20 rounded-xl flex items-center gap-1.5 transition-all hover:shadow-lg active:scale-98 cursor-pointer shrink-0"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Appointment</span>
              </button>
            </div>

            {/* Mobile Actions: Quick Book & Hamburger */}
            <div className="flex items-center gap-1.5 sm:gap-2 lg:hidden shrink-0">
              <button
                onClick={() => handleOpenDoctorBooking()}
                style={{ background: 'linear-gradient(to right, #0284c7, #0d9488)', color: '#ffffff' }}
                className="px-2.5 py-1.5 text-xs font-bold text-white bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 rounded-lg flex items-center gap-1 shadow-xs cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Book</span>
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer border border-slate-200/80 bg-white/80"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Slide-Down Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl animate-in slide-in-from-top-4 duration-200">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setIsTrackBookingOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Track & Pay</span>
              </button>
              <button
                onClick={() => {
                  handleOpenTestBooking();
                  setIsMobileMenuOpen(false);
                }}
                className="p-2.5 rounded-xl border border-teal-200 bg-teal-50 text-teal-800 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <FlaskConical className="w-3.5 h-3.5" />
                <span>Book Lab Test</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100 text-xs font-semibold text-slate-700">
              <div
                onClick={() => {
                  document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 flex items-center justify-between"
              >
                <span>Clinical Specialty Clinics</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div
                onClick={() => {
                  document.getElementById('tests-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 flex items-center justify-between"
              >
                <span>Diagnostic Pathology Tests</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div
                onClick={() => {
                  document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 flex items-center justify-between"
              >
                <span>Health Packages</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div
                onClick={() => {
                  document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 flex items-center justify-between"
              >
                <span>Meet Specialist Doctors</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
              <div
                onClick={() => {
                  document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMobileMenuOpen(false);
                }}
                className="py-2.5 flex items-center justify-between"
              >
                <span>Contact & Location</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Clinic Helpline:</span>
              <a href={`tel:${CLINIC_INFO.phonePrimary}`} className="font-bold text-sky-700">
                {CLINIC_INFO.phonePrimary}
              </a>
            </div>
          </div>
        )}
      </header>

      {/* =========================================================================
          3. HERO SECTION: Badges, Headline, CTAs, Hero Card & Live 3S Spotlight
          ========================================================================= */}
      <main className="flex-1">
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white pt-8 sm:pt-14 pb-16 sm:pb-20">
          {/* Subtle Ambient Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              {/* Left Column: Heading & CTAs */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2.5 bg-sky-950/80 border border-sky-600/40 px-4 py-1.5 rounded-full text-xs font-semibold text-sky-200 shadow-md backdrop-blur-md">
                  <img src="/aastha-icon.svg" alt="" className="w-4 h-4 shrink-0" />
                  <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-teal-300 to-emerald-300">
                    Serve Respect Love
                  </span>
                  <span className="text-slate-500">•</span>
                  <span>{CLINIC_INFO.shortName}</span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                  Complete Healthcare.{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-300">
                    Accurate Diagnostics.
                  </span>{' '}
                  Trusted Care.
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Consult experienced specialist doctors, book precision pathology and imaging tests, access preventive health packages, and receive verified digital reports — all under one trusted roof.
                </p>

                {/* Primary CTA Buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                  <button
                    onClick={() => handleOpenDoctorBooking()}
                    style={{ background: 'linear-gradient(to right, #0284c7, #0369a1)', color: '#ffffff' }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all hover:shadow-sky-600/50 hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  <button
                    onClick={() => handleOpenTestBooking()}
                    style={{ backgroundColor: 'rgba(13, 148, 136, 0.2)', borderColor: 'rgba(20, 184, 166, 0.4)', color: '#5eead4' }}
                    className="w-full sm:w-auto px-7 py-3.5 bg-teal-600/20 hover:bg-teal-600/30 text-teal-300 border border-teal-500/40 font-bold text-sm rounded-xl shadow-xs transition-all hover:border-teal-400 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FlaskConical className="w-4 h-4 text-teal-400" />
                    <span>Book a Diagnostic Test</span>
                  </button>
                </div>

                {/* Trust Highlights Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-800/80 text-xs text-slate-300 font-medium">
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Experienced Doctors</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Advanced Diagnostics</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Digital Reports</span>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>Home Sample Collection</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Showcase Image with Floating Stats Badges */}
              <div className="lg:col-span-5 relative">
                <div className="relative mx-auto max-w-md lg:max-w-none">
                  <div className="relative rounded-3xl overflow-hidden border-2 border-slate-700/60 shadow-2xl bg-slate-800">
                    <img
                      alt="Modern Laboratory and Medical Consultations"
                      className="w-full h-80 sm:h-96 object-cover object-center"
                      src="https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=900&q=80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <div className="flex items-center gap-2">
                        <img src="/aastha-icon.svg" alt="" className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                          Fully Automated Diagnostics
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">
                        Pathology, Histopathology, Biochemistry, Microbiology & Cardiology.
                      </p>
                    </div>
                  </div>

                  {/* Floating Badge 1 (top-left) */}
                  <div className="absolute -top-4 -left-4 sm:-left-6 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">90,000+</div>
                      <div className="text-[10px] text-slate-400">Patients Cared For</div>
                    </div>
                  </div>

                  {/* Floating Badge 2 (middle-right) */}
                  <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-3 rounded-2xl shadow-xl flex items-center gap-3 hidden sm:flex">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Digital Reports</div>
                      <div className="text-[10px] text-teal-300">Fast Online Access</div>
                    </div>
                  </div>

                  {/* Floating Badge 3 (bottom-left) */}
                  <div className="absolute -bottom-4 -left-3 sm:-left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 p-2.5 sm:p-3 rounded-2xl shadow-xl flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">Home Sample Collection</div>
                      <div className="text-[10px] text-emerald-400">60-Min Doorstep Service</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* LIVE 3S ROTATING SPOTLIGHT (Doctors • Specialized Tests • Doctor Health Articles) */}
            <div className="mt-14 pt-8 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Live 3S Rotating Spotlight
                  </span>
                  <span className="hidden sm:inline text-xs text-slate-400">
                    — Doctors • Specialized Tests • Doctor Health Articles
                  </span>
                </div>

                <button
                  onClick={() => setIsSpotlightPaused(!isSpotlightPaused)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                  title={isSpotlightPaused ? 'Resume Auto Scroll' : 'Pause Auto Scroll'}
                >
                  {isSpotlightPaused ? (
                    <>
                      <Play className="w-3 h-3 text-emerald-400" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 text-amber-400" />
                      <span>Pause Scroll</span>
                    </>
                  )}
                </button>
              </div>

              {/* 3 Interactive Spotlight Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 1. Doctor Spotlight Card */}
                {(() => {
                  const doc = DOCTORS_DATA[spotlightDoctorIndex % DOCTORS_DATA.length];
                  return (
                    <div className="relative bg-slate-900/85 backdrop-blur-xl border border-sky-500/25 hover:border-sky-400/50 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-sky-900/20">
                      {/* Top Animated Progress Indicator */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-sky-400 to-teal-400"
                          style={{
                            animation: isSpotlightPaused ? 'none' : 'progress 3.5s linear infinite',
                          }}
                        />
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
                            <Stethoscope className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-sky-300">
                              Specialist Doctors OPD
                            </h3>
                            <p className="text-[10px] text-slate-400">Active Chamber Consultations</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                            {(spotlightDoctorIndex % DOCTORS_DATA.length) + 1}/{DOCTORS_DATA.length}
                          </span>
                          <button
                            onClick={() =>
                              setSpotlightDoctorIndex(
                                prev => (prev - 1 + DOCTORS_DATA.length) % DOCTORS_DATA.length
                              )
                            }
                            aria-label="Previous Doctor"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-sky-950 text-slate-300 hover:text-sky-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setSpotlightDoctorIndex(prev => (prev + 1) % DOCTORS_DATA.length)
                            }
                            aria-label="Next Doctor"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-sky-950 text-slate-300 hover:text-sky-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Doctor Details */}
                      <div className="py-4 space-y-3.5 animate-in fade-in slide-in-from-right-3 duration-300 flex-1 flex flex-col justify-between">
                        <div className="flex items-start gap-3.5">
                          <div className="relative shrink-0">
                            <img
                              alt={doc.name}
                              className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover border-2 border-sky-500/40 shadow-md"
                              src={doc.image}
                            />
                            <div
                              className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-xs"
                              title="Available for Booking"
                            >
                              <UserCheck className="w-3 h-3" />
                            </div>
                          </div>
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <h4
                                onClick={() => setSelectedDoctorProfile(doc)}
                                className="text-sm sm:text-base font-extrabold text-white hover:text-sky-300 transition-colors cursor-pointer truncate"
                              >
                                {doc.name}
                              </h4>
                            </div>
                            <p className="text-xs font-semibold text-sky-400 leading-tight line-clamp-1">
                              {doc.specialty}
                            </p>
                            <p className="text-[11px] text-slate-400 line-clamp-1">
                              {doc.qualification}
                            </p>
                            <div className="flex items-center gap-2 pt-0.5 text-[11px] text-slate-300">
                              <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                <Star className="w-3 h-3 fill-amber-400" />
                                {doc.rating}
                              </span>
                              <span className="text-slate-600">•</span>
                              <span className="text-slate-400">{doc.experience}</span>
                            </div>
                          </div>
                        </div>

                        {/* OPD Schedule Box */}
                        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1 text-[11px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="flex items-center gap-1 text-slate-400">
                              <Clock className="w-3 h-3 text-sky-400 shrink-0" />
                              <span>OPD Hours:</span>
                            </span>
                            <span className="font-semibold text-sky-200 text-right line-clamp-1">
                              {doc.timing}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400 text-[10px]">
                            <span>Days: {doc.availableDays.join(', ')}</span>
                            <span className="text-emerald-400 font-bold">Fee: ₹{doc.fee}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleOpenDoctorBooking(doc.id)}
                            className="flex-1 py-2 bg-gradient-to-r from-sky-600 to-sky-700 hover:from-sky-500 hover:to-sky-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Calendar className="w-3.5 h-3.5" />
                            <span>Book Appointment</span>
                          </button>
                          <button
                            onClick={() => setSelectedDoctorProfile(doc)}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                          >
                            Profile
                          </button>
                        </div>
                      </div>

                      {/* Pagination Indicator Dots */}
                      <div className="flex items-center justify-center gap-1 pt-2">
                        {DOCTORS_DATA.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSpotlightDoctorIndex(idx)}
                            aria-label={`Jump to Doctor ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === (spotlightDoctorIndex % DOCTORS_DATA.length)
                                ? 'w-5 bg-sky-400'
                                : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 2. Specialized Test Spotlight Card */}
                {(() => {
                  const test = ALL_TESTS_DATA[spotlightTestIndex % ALL_TESTS_DATA.length];
                  return (
                    <div className="relative bg-slate-900/85 backdrop-blur-xl border border-teal-500/25 hover:border-teal-400/50 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-teal-900/20">
                      {/* Top Progress Indicator */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-teal-400 to-emerald-400"
                          style={{
                            animation: isSpotlightPaused ? 'none' : 'progress 3.5s linear infinite',
                          }}
                        />
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-teal-500/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
                            <Microscope className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-teal-300">
                              Advance & Special Tests
                            </h3>
                            <p className="text-[10px] text-slate-400">Automated Pathology & Histology</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                            {(spotlightTestIndex % ALL_TESTS_DATA.length) + 1}/{ALL_TESTS_DATA.length}
                          </span>
                          <button
                            onClick={() =>
                              setSpotlightTestIndex(
                                prev => (prev - 1 + ALL_TESTS_DATA.length) % ALL_TESTS_DATA.length
                              )
                            }
                            aria-label="Previous Test"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-teal-950 text-slate-300 hover:text-teal-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setSpotlightTestIndex(prev => (prev + 1) % ALL_TESTS_DATA.length)
                            }
                            aria-label="Next Test"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-teal-950 text-slate-300 hover:text-teal-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Test Details */}
                      <div className="py-4 space-y-3.5 animate-in fade-in slide-in-from-right-3 duration-300 flex-1 flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="bg-teal-950/90 text-teal-300 border border-teal-600/40 text-[10px] font-bold px-2 py-0.5 rounded">
                              {test.category}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {test.subCategory || 'Automated Diagnostics'}
                            </span>
                          </div>
                          <h4
                            onClick={() => handleOpenTestBooking(test.id)}
                            className="text-sm sm:text-base font-extrabold text-white hover:text-teal-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                          >
                            {test.name}
                          </h4>
                          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                            Diagnostic code: {test.code} | {test.category.toUpperCase()}
                          </p>
                        </div>

                        {/* Test Meta Schedule Box */}
                        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1.5 text-[11px]">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3 text-teal-400" />
                              <span>Report Time:</span>
                            </span>
                            <span className="font-semibold text-teal-300">{test.reportTime}</span>
                          </div>
                          <div className="flex items-center justify-between text-slate-400 text-[10px]">
                            <span className="truncate max-w-[170px]">{test.sampleType}</span>
                            <div className="flex items-center gap-1.5">
                              <span className="line-through text-slate-500">₹{test.originalPrice}</span>
                              <span className="text-sm font-extrabold text-emerald-400">
                                ₹{test.price}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => handleOpenTestBooking(test.id)}
                            className="flex-1 py-2 bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-500 hover:to-teal-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <FlaskConical className="w-3.5 h-3.5" />
                            <span>Book Diagnostic Test</span>
                          </button>
                          <button
                            onClick={() => {
                              document
                                .getElementById('tests-section')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                          >
                            All Tests
                          </button>
                        </div>
                      </div>

                      {/* Pagination Indicator Dots */}
                      <div className="flex items-center justify-center gap-1 pt-2">
                        {Array.from({ length: 10 }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSpotlightTestIndex(idx)}
                            aria-label={`Jump to Test ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === (spotlightTestIndex % 10)
                                ? 'w-5 bg-teal-400'
                                : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* 3. Doctor Health Article Spotlight Card */}
                {(() => {
                  const blog = BLOGS_DATA[spotlightArticleIndex % BLOGS_DATA.length];
                  return (
                    <div className="relative bg-slate-900/85 backdrop-blur-xl border border-violet-500/25 hover:border-violet-400/50 rounded-2xl p-5 shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden group hover:shadow-violet-900/20">
                      {/* Top Progress Indicator */}
                      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800 overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-violet-400 to-indigo-400"
                          style={{
                            animation: isSpotlightPaused ? 'none' : 'progress 3.5s linear infinite',
                          }}
                        />
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center border border-violet-500/30">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-violet-300">
                              Doctor-Written Articles
                            </h3>
                            <p className="text-[10px] text-slate-400">Health Awareness & Clinical Insights</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                            {(spotlightArticleIndex % BLOGS_DATA.length) + 1}/{BLOGS_DATA.length}
                          </span>
                          <button
                            onClick={() =>
                              setSpotlightArticleIndex(
                                prev => (prev - 1 + BLOGS_DATA.length) % BLOGS_DATA.length
                              )
                            }
                            aria-label="Previous Article"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-violet-950 text-slate-300 hover:text-violet-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronLeft className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setSpotlightArticleIndex(prev => (prev + 1) % BLOGS_DATA.length)
                            }
                            aria-label="Next Article"
                            className="w-6 h-6 rounded-md bg-slate-800 hover:bg-violet-950 text-slate-300 hover:text-violet-300 flex items-center justify-center transition-colors cursor-pointer"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Article Details */}
                      <div className="py-4 space-y-3.5 animate-in fade-in slide-in-from-right-3 duration-300 flex-1 flex flex-col justify-between">
                        <div className="flex gap-3.5 items-start">
                          <img
                            alt={blog.title}
                            className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover shrink-0 border border-violet-500/30 shadow-sm group-hover:scale-105 transition-transform duration-300"
                            src={blog.image}
                          />
                          <div className="space-y-1 min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-violet-950/90 text-violet-300 border border-violet-600/40 text-[10px] font-bold px-2 py-0.5 rounded">
                                {blog.category}
                              </span>
                              <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {blog.readTime}
                              </span>
                            </div>
                            <h4
                              onClick={() => setSelectedArticle(blog)}
                              className="text-sm font-extrabold text-white hover:text-violet-300 transition-colors cursor-pointer leading-snug line-clamp-2"
                            >
                              {blog.title}
                            </h4>
                          </div>
                        </div>

                        {/* Article Excerpt & Author Box */}
                        <div className="bg-slate-950/60 rounded-xl p-2.5 border border-slate-800/80 space-y-1 text-[11px]">
                          <p className="text-slate-400 line-clamp-2 text-[11px] leading-relaxed">
                            {blog.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-slate-400 pt-1 text-[10px] border-t border-slate-800/60">
                            <span className="font-medium text-slate-300">
                              By {blog.author.name}
                            </span>
                            <span>{blog.publishDate}</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => setSelectedArticle(blog)}
                            className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Read Article</span>
                          </button>
                          <button
                            onClick={() => {
                              document
                                .getElementById('blog-section')
                                ?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl border border-slate-700 transition-colors cursor-pointer"
                          >
                            Health Hub
                          </button>
                        </div>
                      </div>

                      {/* Pagination Indicator Dots */}
                      <div className="flex items-center justify-center gap-1 pt-2">
                        {BLOGS_DATA.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setSpotlightArticleIndex(idx)}
                            aria-label={`Jump to Article ${idx + 1}`}
                            className={`h-1.5 rounded-full transition-all cursor-pointer ${
                              idx === (spotlightArticleIndex % BLOGS_DATA.length)
                                ? 'w-5 bg-violet-400'
                                : 'w-1.5 bg-slate-700 hover:bg-slate-500'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Jump Dots */}
              <div className="flex items-center justify-center gap-1.5 mt-4">
                {[0, 1, 2, 3, 4].map(idx => (
                  <button
                    key={idx}
                    onClick={() => setSpotlightIndex(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      spotlightIndex % 5 === idx
                        ? 'w-6 bg-sky-400'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                    aria-label={`Jump to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            4. ELEVATED QUICK ACTION CARDS (-mt-8 sm:-mt-12)
            ========================================================================= */}
        <section className="relative -mt-8 sm:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Book Appointment */}
            <div
              onClick={() => handleOpenDoctorBooking()}
              className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-sky-100/90 text-sky-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Calendar className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 block mb-1">
                OPD DAILY
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                Book Appointment
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Find a doctor and submit your consultation request.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-sky-600 group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Book a Test */}
            <div
              onClick={() => handleOpenTestBooking()}
              className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-teal-100/90 text-teal-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <FlaskConical className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 block mb-1">
                800+ TESTS
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                Book a Test
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Search and request diagnostic tests & profiles.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-teal-600 group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: Home Collection */}
            <div
              onClick={() => handleOpenTestBooking(undefined, undefined, 'home')}
              className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 block mb-1">
                DOORSTEP SERVICE
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">
                Home Collection
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Doorstep sample pickup by trained phlebotomists.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-emerald-600 group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Track & Pay */}
            <div
              onClick={() => setIsTrackBookingOpen(true)}
              className="p-5 rounded-2xl bg-white/95 backdrop-blur-xl border border-white/80 shadow-xl hover:shadow-2xl transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl bg-purple-100/90 text-purple-700 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <CreditCard className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 block mb-1">
                APPROVAL & PAY
              </span>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-700 transition-colors">
                Track & Pay Booking
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Check admin approval status & complete payment online.
              </p>
              <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-purple-600 group-hover:translate-x-1 transition-transform">
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            5. STATS COUNTER BAR (Single-Line 4-Metric Grid)
            ========================================================================= */}
        <section className="py-12 bg-white/40 backdrop-blur-md border-y border-white/60 my-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-3.5 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs hover:bg-white/80 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-white/90 shadow-2xs border border-white/90 flex items-center justify-center shrink-0">
                  <Users className="w-6 h-6 text-sky-600" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                    90,000+
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Patients Treated
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    With Trusted Clinical Care
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-3.5 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs hover:bg-white/80 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-white/90 shadow-2xs border border-white/90 flex items-center justify-center shrink-0">
                  <Stethoscope className="w-6 h-6 text-teal-600" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                    10+
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Specialist Doctors
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Experienced Medical Consultants
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-3.5 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs hover:bg-white/80 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-white/90 shadow-2xs border border-white/90 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                    829+
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Diagnostic Lab Tests
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Automated Analyzers & Imaging
                  </span>
                </div>
              </div>

              <div className="text-center sm:text-left flex flex-col sm:flex-row items-center sm:items-start gap-3.5 p-4 rounded-2xl bg-white/60 backdrop-blur-md border border-white/80 shadow-xs hover:bg-white/80 transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-white/90 shadow-2xs border border-white/90 flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block">
                    24/7
                  </span>
                  <span className="text-xs font-bold text-slate-800 block mt-0.5">
                    Emergency Lab & Digital Access
                  </span>
                  <span className="text-[11px] text-slate-500 block">
                    Same-Day Report Delivery
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            6. OUTPATIENT SPECIALTY CARE & DEPARTMENTS (#services-section)
            ========================================================================= */}
        <section id="services-section" className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                  Outpatient Specialty Care
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
                  Comprehensive Clinic Services & Departments
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Our modern outpatient departments are staffed by experienced physicians and specialists, backed by on-site automated diagnostic labs for immediate investigation.
                </p>
              </div>

              <button
                onClick={() => {
                  document.getElementById('services-grid')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                View All {SERVICES_DATA.length} Departments
              </button>
            </div>

            {/* Department Cards Grid */}
            <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {SERVICES_DATA.map(srv => (
                <div
                  key={srv.id}
                  className="group relative rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md p-6 hover:bg-white/95 hover:border-slate-300 transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-100">
                        {srv.department}
                      </span>
                      <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Stethoscope className="w-5 h-5" />
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 group-hover:text-sky-700 transition-colors">
                      {srv.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {srv.shortDesc}
                    </p>

                    {/* Common Condition Badges */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {srv.commonConditions.slice(0, 2).map((cond, i) => (
                        <span
                          key={i}
                          className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-600"
                        >
                          {cond}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedDepartment(srv)}
                      className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Details & Protocols
                    </button>
                    <button
                      onClick={() => handleOpenDoctorBooking(undefined, srv.name)}
                      className="py-2 px-3 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Book OPD Doctor
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            7. AUTOMATED DIAGNOSTIC DIRECTORY (#tests-section)
            ========================================================================= */}
        <section id="tests-section" className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-8 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                Automated Diagnostic Directory
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Search 800+ Pathology & Diagnostic Tests
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                Standardized sample processing on automated biochemistry, hematology, chemiluminescence, and molecular analyzers with certified reporting.
              </p>
            </div>

            {/* Search Input Box */}
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  placeholder="Search 800+ tests by name or code (e.g. CBC, HbA1c, Thyroid, Lipid, Vitamin D, CG002, USG)..."
                  value={testSearchQuery}
                  onChange={e => setTestSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 bg-white border border-slate-300 rounded-2xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-sm transition-all"
                />
                {testSearchQuery && (
                  <button
                    onClick={() => setTestSearchQuery('')}
                    className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Horizontally-Scrollable Category Pills */}
            <div className="flex items-center gap-2 mb-6 max-w-5xl mx-auto">
              <button
                onClick={() => scrollCategories('left')}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs transition-colors shrink-0"
                aria-label="Scroll categories left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div
                ref={categoryScrollRef}
                className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 flex-1"
              >
                {testCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-teal-600 text-white shadow-xs'
                        : 'bg-white/80 backdrop-blur-xs text-slate-700 hover:bg-white border border-white/80'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <button
                onClick={() => scrollCategories('right')}
                className="p-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 shadow-2xs transition-colors shrink-0"
                aria-label="Scroll categories right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Status & Auto-Shuffle Controls */}
            <div className="flex items-center justify-between text-xs text-slate-500 mb-4 px-1">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span>Live Auto-Shuffling</span>
                <span>•</span>
                <span>
                  Showing {displayedTests.length} of {ALL_TESTS_DATA.length} tests
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTestShufflingPaused(!isTestShufflingPaused)}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                  title="Pause auto rotation"
                >
                  {isTestShufflingPaused ? (
                    <>
                      <Play className="w-3 h-3 text-emerald-600" />
                      <span>Resume</span>
                    </>
                  ) : (
                    <>
                      <Pause className="w-3 h-3 text-amber-600" />
                      <span>Pause</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => setTestOffset(prev => (prev + 3) % (ALL_TESTS_DATA.length - 6))}
                  className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-700 font-medium transition-colors cursor-pointer flex items-center gap-1"
                  title="Shuffle tests now"
                >
                  <RefreshCw className="w-3 h-3 text-teal-600" />
                  <span>Shuffle Now</span>
                </button>
              </div>
            </div>

            {/* Test Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedTests.map(test => (
                <div
                  key={test.id}
                  className="p-4 sm:p-5 rounded-2xl border border-white/80 bg-white/70 backdrop-blur-md hover:bg-white/95 hover:border-teal-300 transition-all duration-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-[10px] font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-100">
                        {test.category}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400 font-bold">{test.code}</span>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 mt-1 mb-2">
                      <span className="text-lg font-black text-slate-900">₹{test.price}</span>
                      <span className="text-xs text-slate-400 line-through">₹{test.originalPrice}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-2">
                      {test.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                      {test.shortDesc || `Diagnostic code: ${test.code} | ${test.category}`}
                    </p>

                    <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
                      <div>
                        Report: <span className="font-semibold text-slate-800">{test.reportTime}</span>
                      </div>
                      <div className="truncate">
                        Sample: <span className="font-semibold text-slate-800">{test.sampleType}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 mt-4 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-semibold text-slate-500">
                      {test.fastingRequired ? '10-12 Hrs Fasting' : 'No Fasting Required'}
                    </span>
                    <button
                      onClick={() => handleOpenTestBooking(test.id)}
                      className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-2xs transition-colors cursor-pointer"
                    >
                      Book at Lab
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Full-Width CTA */}
            <div className="text-center mt-10">
              <button
                onClick={() => handleOpenTestBooking()}
                className="px-10 py-4 bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm rounded-full shadow-lg shadow-teal-600/25 transition-all hover:scale-105 cursor-pointer inline-flex items-center justify-center gap-3 whitespace-nowrap"
              >
                <FlaskConical className="w-4 h-4 shrink-0" />
                <span className="tracking-wide">Explore All 829+ Diagnostic Tests &amp; Imaging</span>
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================================
            8. PREVENTIVE HEALTH CHECKUP PACKAGES (#packages-section)
            ========================================================================= */}
        <section
          id="packages-section"
          className="py-16 bg-slate-950/90 backdrop-blur-2xl text-white relative overflow-hidden"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 bg-teal-950/80 border border-teal-700/60 px-3 py-1 rounded-full">
                  Full-Body Preventive Health Checkups
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
                  Curated Health Packages for Every Life Stage
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Detect latent metabolic, cardiac, liver, and thyroid risks early. Includes complete organ profiles, pathologist review, and doorstep collection.
                </p>
              </div>

              <button
                onClick={() => setIsComparePackagesOpen(true)}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white font-bold text-xs rounded-xl border border-white/20 transition-all inline-flex items-center gap-2 self-start md:self-auto shadow-sm cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Compare Packages Side-by-Side</span>
              </button>
            </div>

            {/* Package Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {PACKAGES_DATA.map(pkg => (
                <div
                  key={pkg.id}
                  className="relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 backdrop-blur-xl bg-white/5 border border-white/15 hover:border-white/30 shadow-lg group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        Save {pkg.discountPercent}%
                      </span>
                      <span className="text-xs font-bold text-sky-300">
                        {pkg.parametersCount} Parameters
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-teal-300 transition-colors tracking-tight">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      {pkg.tagline}
                    </p>

                    <div className="my-5 flex items-baseline gap-2">
                      <span className="text-3xl font-black text-white">₹{pkg.price}</span>
                      <span className="text-sm text-slate-400 line-through">₹{pkg.originalPrice}</span>
                      <span className="text-xs font-semibold text-emerald-400 ml-auto">
                        {pkg.parametersCount} Parameters
                      </span>
                    </div>

                    {/* Parameter category list with green checkmarks */}
                    <div className="space-y-2.5 border-t border-white/10 pt-4 text-xs">
                      {pkg.testsIncluded?.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-slate-300">
                          <div className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/30">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span className="line-clamp-1">
                            <strong className="text-white">{item.category}:</strong>{' '}
                            {Array.isArray(item.tests) ? item.tests.join(', ') : item.tests}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-400" />
                        <span>Same Day (Evening)</span>
                      </span>
                      <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                        Home Collection Available
                      </span>
                    </div>

                    <button
                      onClick={() => handleOpenTestBooking(undefined, pkg.id)}
                      className="w-full py-3 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white cursor-pointer"
                    >
                      <span>Book Package Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            9. SPECIALIST DOCTORS & VISITING CONSULTANTS (#doctors-section)
            ========================================================================= */}
        <section id="doctors-section" className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                  Clinical Medical Team
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
                  Meet Our Specialist Doctors & Visiting Consultants
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Highly experienced specialists offering daily OPD and scheduled visits (weekly / monthly super-specialist clinics) with comprehensive clinical diagnostic correlation.
                </p>
              </div>

              <button
                onClick={() => handleOpenDoctorBooking()}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                View All Doctors & Visiting Schedules
              </button>
            </div>

            {/* Doctor Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {DOCTORS_DATA.slice(0, 6).map(doc => (
                <div
                  key={doc.id}
                  className="bg-white/80 backdrop-blur-md rounded-2xl border border-white/80 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-4">
                      <img
                        alt={doc.name}
                        className="w-20 h-20 rounded-2xl object-cover border border-slate-200 shrink-0 group-hover:scale-105 transition-transform"
                        src={doc.image}
                      />
                      <div className="space-y-1 flex-1">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border bg-sky-100/90 text-sky-900 border-sky-300 shadow-2xs font-bold inline-block">
                          {doc.visitingScheduleText}
                        </span>
                        <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{doc.rating}</span>
                        </div>
                        <p className="text-xs font-semibold text-sky-700">{doc.specialty}</p>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-sky-700 transition-colors">
                      {doc.name}
                    </h3>
                    <p className="text-xs text-slate-500">{doc.qualification}</p>

                    <div className="space-y-1 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
                      <div>{doc.experience}</div>
                      <div>
                        <span className="text-slate-400">Timings:</span> {doc.timing}
                      </div>
                      <div>
                        <span className="text-slate-400">Days:</span> {doc.availableDays.join(', ')}
                      </div>
                      <div className="font-bold text-slate-800 pt-1">
                        Consultation Fee: <span className="text-sky-700">₹{doc.fee}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDoctorProfile(doc)}
                      className="flex-1 py-2 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors cursor-pointer text-center"
                    >
                      Profile
                    </button>
                    <button
                      onClick={() => handleOpenDoctorBooking(doc.id)}
                      className="flex-1 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer text-center"
                    >
                      Book Visit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            10. DOORSTEP DIAGNOSTIC SERVICE (Home Collection)
            ========================================================================= */}
        <section className="py-16 bg-gradient-to-r from-emerald-900 via-teal-900 to-sky-950 text-white relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full">
                  Doorstep Diagnostic Service
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-2">
                  Quality Diagnostic Care in the Comfort of Your Home
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Skip clinic queues and travel stress. Especially convenient for elderly parents, diabetic fasting profiles, and infant blood collections.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenTestBooking(undefined, undefined, 'home')}
                  className="px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition-all cursor-pointer"
                >
                  Schedule Home Visit Now
                </button>
                <a
                  href={`tel:${CLINIC_INFO.phoneLab}`}
                  className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 transition-colors flex items-center gap-2"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call Lab: {CLINIC_INFO.phoneLab}</span>
                </a>
              </div>
            </div>

            {/* 4 Steps */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xs font-bold text-emerald-400 mb-2">STEP 01</div>
                <h3 className="text-sm font-bold text-white">Book Online or Call</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Select your tests or health package and choose your preferred morning time slot.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xs font-bold text-emerald-400 mb-2">STEP 02</div>
                <h3 className="text-sm font-bold text-white">Certified Phlebotomist Visit</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Trained healthcare technician arrives with barcode-sealed, single-use sterile vacutainers.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xs font-bold text-emerald-400 mb-2">STEP 03</div>
                <h3 className="text-sm font-bold text-white">Temperature-Controlled Transit</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Samples transported in calibrated cold-chain carriers directly to our central lab.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15">
                <div className="text-xs font-bold text-emerald-400 mb-2">STEP 04</div>
                <h3 className="text-sm font-bold text-white">Digital Reports on WhatsApp/Web</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Verified reports delivered same-day to your phone with QR code authenticity verification.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            11. THE DIAGNOSTIC STANDARD / WHY CHOOSE US
            ========================================================================= */}
        <section className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                The {CLINIC_INFO.shortName} Standard
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Why Thousands of Families Trust Us
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                Combining empathetic patient care with world-class laboratory technology to deliver the highest clinical confidence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center mb-4">
                  <Award className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Trusted Clinical Excellence</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Over 90,000+ satisfied patients treated with compassionate, ethical, and evidence-based medicine.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center mb-4">
                  <Microscope className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Precision Automated Diagnostics</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Fully calibrated analyzers, strict internal quality controls, and MD Pathologist verified results.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center mb-4">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Multi-Specialty Doctor OPD</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Dedicated consultations across Cardiology, Gynaecology, Pediatrics, Internal Medicine, and ENT.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Smart Digital Lab Reports</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Instant online report access, historical trend analytics, and QR-code backed verification.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Sterile Home Collection</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Convenient morning sample collection by vaccinated phlebotomists with zero contamination risk.
                </p>
              </div>

              <div className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Seamless Digital Booking</h3>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                  Book doctor appointments and tests in under 60 seconds with instant WhatsApp confirmations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================================
            12. PATIENT STORIES & REVIEWS
            ========================================================================= */}
        <section className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                Patient Stories & Reviews
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Real Experiences from Our Community
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto">
                See how our clinic consultations and diagnostic accuracy make a positive difference in daily health.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS_DATA.map(t => (
                <div
                  key={t.id}
                  className="p-6 rounded-2xl bg-white/80 backdrop-blur-md border border-white/80 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-3">
                      <div className="flex text-amber-400">
                        {[...Array(t.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-amber-400" />
                        ))}
                      </div>
                      <span className="text-slate-400 text-[11px]">{t.date}</span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                      "{t.comment}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{t.patientName}</h4>
                      <div className="text-[10px] text-slate-500">{t.serviceUsed}</div>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                      Verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            13. FREQUENTLY ASKED QUESTIONS (#faq-section)
            ========================================================================= */}
        <section id="faq-section" className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                Frequently Asked Questions
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Got Questions? We Have Answers
              </h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Everything you need to know about tests, doctor consultations, fasting, and reports.
              </p>
            </div>

            {/* Category Filter */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto pb-4 mb-6">
              {['All', 'General', 'Diagnostics', 'Home Collection', 'Reports', 'Appointments'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setFaqCategory(cat)}
                  className={`px-3.5 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                    faqCategory === cat
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white/70 backdrop-blur-xs text-slate-700 hover:bg-white border border-white/80'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Accordion Items */}
            <div className="space-y-3">
              {filteredFaqs.map(faq => {
                const isExpanded = expandedFaqId === faq.id;
                return (
                  <div
                    key={faq.id}
                    className="rounded-2xl border border-white/80 overflow-hidden bg-white/70 backdrop-blur-md transition-all shadow-xs"
                  >
                    <button
                      onClick={() => setExpandedFaqId(isExpanded ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-white/80 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-slate-900">{faq.question}</span>
                      <div
                        className={`w-6 h-6 rounded-full bg-white/90 shadow-2xs flex items-center justify-center text-slate-500 shrink-0 transition-transform ${
                          isExpanded ? 'rotate-180 bg-sky-100 text-sky-700' : ''
                        }`}
                      >
                        <ChevronDown className="w-4 h-4" />
                      </div>
                    </button>
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100/80 bg-white/50">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================================
            14. DOCTOR-WRITTEN HEALTH GUIDES (#blog-section)
            ========================================================================= */}
        <section id="blog-section" className="py-16 bg-transparent border-b border-white/60">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                  Health Awareness & Clinical Insights
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
                  Doctor-Written Health Guides
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
                  Read practical medical advice on interpreting lab tests, managing chronic conditions, nutrition, and preventive wellness.
                </p>
              </div>

              <button
                onClick={() => {
                  if (BLOGS_DATA[0]) setSelectedArticle(BLOGS_DATA[0]);
                }}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                Read All Health Articles
              </button>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {BLOGS_DATA.map(blog => (
                <div
                  key={blog.id}
                  className="rounded-2xl overflow-hidden border border-white/80 bg-white/80 backdrop-blur-md shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
                >
                  <div>
                    <div className="h-44 w-full overflow-hidden relative">
                      <img
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        src={blog.image}
                      />
                      <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider text-white bg-slate-900/80 backdrop-blur-xs px-2.5 py-0.5 rounded-full">
                        {blog.category}
                      </span>
                    </div>

                    <div className="p-5">
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-2">
                        <span>{blog.publishDate}</span>
                        <span>•</span>
                        <span>{blog.readTime}</span>
                      </div>

                      <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-sky-700 transition-colors line-clamp-2">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                        {blog.excerpt}
                      </p>
                    </div>
                  </div>

                  <div className="p-5 pt-0 flex items-center justify-between text-xs border-t border-slate-100 mt-2">
                    <span className="text-[11px] text-slate-500">
                      By <span className="font-semibold text-slate-700">{blog.author.name}</span>
                    </span>
                    <button
                      onClick={() => setSelectedArticle(blog)}
                      className="font-bold text-sky-600 hover:text-sky-700 transition-colors cursor-pointer"
                    >
                      Read Guide
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================================
            15. CLINIC LOCATION, SUPPORT & CALLBACK ENQUIRY (#contact-section)
            ========================================================================= */}
        <section id="contact-section" className="py-16 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-800 bg-white/80 border border-white/80 backdrop-blur-xs px-3 py-1 rounded-full shadow-2xs">
                Clinic Location &amp; Support
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
                Visit {CLINIC_INFO.name} or Reach Out
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Conveniently located in the heart of {CLINIC_INFO.city} with dedicated parking, wheelchair access, and 24/7 sample collection.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
              {/* Left Column: 4 Contact Cards + Google Map underneath */}
              <div className="lg:col-span-7 space-y-6 flex flex-col justify-between">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card 1: Doctor OPD Booking */}
                  <div className="p-4 rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 flex items-start gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-sky-100/90 text-sky-700 flex items-center justify-center shrink-0">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Doctor OPD Booking
                      </span>
                      <a
                        href={`tel:${CLINIC_INFO.phonePrimary}`}
                        className="text-sm font-bold text-slate-900 hover:text-sky-700 block mt-0.5"
                      >
                        {CLINIC_INFO.phonePrimary}
                      </a>
                      <span className="text-[11px] text-slate-500">{CLINIC_INFO.hoursOpd}</span>
                    </div>
                  </div>

                  {/* Card 2: Laboratory & Histopathology */}
                  <div className="p-4 rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 flex items-start gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-teal-100/90 text-teal-700 flex items-center justify-center shrink-0">
                      <FlaskConical className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Laboratory &amp; Histopathology
                      </span>
                      <a
                        href={`tel:${CLINIC_INFO.phoneLab}`}
                        className="text-sm font-bold text-slate-900 hover:text-teal-700 block mt-0.5"
                      >
                        {CLINIC_INFO.phoneLab}
                      </a>
                      <span className="text-[11px] text-slate-500">
                        Histopath: {CLINIC_INFO.phoneHistopath}
                      </span>
                    </div>
                  </div>

                  {/* Card 3: Official Email */}
                  <div className="p-4 rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 flex items-start gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-emerald-700 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Official Email
                      </span>
                      <a
                        href={`mailto:${CLINIC_INFO.email}`}
                        className="text-sm font-bold text-slate-900 hover:text-emerald-700 block mt-0.5 truncate max-w-[200px]"
                      >
                        {CLINIC_INFO.email}
                      </a>
                      <span className="text-[11px] text-slate-500">
                        Corporate &amp; Clinical Enquiries
                      </span>
                    </div>
                  </div>

                  {/* Card 4: Operational Hours */}
                  <div className="p-4 rounded-2xl bg-white/65 backdrop-blur-md border border-white/80 flex items-start gap-3 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-amber-100/90 text-amber-700 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase text-slate-500">
                        Operational Hours
                      </span>
                      <span className="text-sm font-bold text-slate-900 block mt-0.5">
                        {CLINIC_INFO.hoursLab}
                      </span>
                      <span className="text-[11px] text-slate-500">
                        Walk in &amp; Emergency Service
                      </span>
                    </div>
                  </div>
                </div>

                {/* Google Map Container with Directions Overlay */}
                <div className="rounded-2xl overflow-hidden border border-white/80 shadow-md relative h-64 sm:h-72 bg-slate-100/80">
                  <iframe
                    title={`${CLINIC_INFO.name} Location`}
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d118949.62312674913!2d83.5516089764516!3d21.332306786221775!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a213e4b09c5d003%3A0xe54e3895e63eb077!2sBargarh%2C%20Odisha!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                    className="w-full h-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-md p-3 rounded-xl shadow-lg border border-white/80 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-600 shrink-0" />
                      <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                        {CLINIC_INFO.addressLine1}, {CLINIC_INFO.city} - {CLINIC_INFO.pincode}
                      </p>
                    </div>
                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(
                        CLINIC_INFO.name + ' ' + CLINIC_INFO.city
                      )}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1 shrink-0 bg-sky-50/90 px-2.5 py-1 rounded-md border border-sky-200/50 shadow-2xs"
                    >
                      <span>Directions</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              {/* Right Column: Dark Callback Enquiry Card */}
              <div className="lg:col-span-5 bg-slate-950/85 backdrop-blur-xl text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/15 flex flex-col justify-between">
                <form onSubmit={handleCallbackSubmit} className="space-y-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-300">
                      Fast Reception Response
                    </span>
                    <h3 className="text-xl font-bold text-white mt-1">
                      Request a Callback / Enquiry
                    </h3>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Leave your contact details and our medical coordinator will get in touch immediately.
                    </p>
                  </div>

                  {callbackStatus === 'success' && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Your request has been received. Our coordinator will call you shortly.</span>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      required
                      placeholder="e.g. Anand Sharma"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      type="text"
                      value={callbackForm.name}
                      onChange={e => setCallbackForm({ ...callbackForm, name: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Mobile Number *
                    </label>
                    <input
                      required
                      placeholder="e.g. 9559955899"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      type="tel"
                      value={callbackForm.phone}
                      onChange={e => setCallbackForm({ ...callbackForm, phone: e.target.value })}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Service Required
                    </label>
                    <select
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/20 text-sm text-white focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      value={callbackForm.subject}
                      onChange={e => setCallbackForm({ ...callbackForm, subject: e.target.value })}
                    >
                      <option value="Doctor Appointment Inquiry" className="bg-slate-900 text-white">
                        Doctor OPD Consultation
                      </option>
                      <option value="Laboratory Test Booking" className="bg-slate-900 text-white">
                        Laboratory &amp; Pathology Test
                      </option>
                      <option value="Home Sample Collection" className="bg-slate-900 text-white">
                        Home Sample Collection
                      </option>
                      <option value="Health Package Query" className="bg-slate-900 text-white">
                        Health Checkup Package
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Message / Clinical Notes
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Describe symptoms or requirement..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white/10 border border-white/20 text-sm text-white placeholder:text-slate-400 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
                      value={callbackForm.message}
                      onChange={e => setCallbackForm({ ...callbackForm, message: e.target.value })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={callbackStatus === 'submitting'}
                    className="w-full py-3 bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-500 hover:to-teal-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-sky-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <span>{callbackStatus === 'submitting' ? 'Submitting...' : 'Send Request'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =========================================================================
          16. FOOTER: Brand, Links, Socials, Disclaimers & Staff Portal Login
          ========================================================================= */}
      <footer className="bg-slate-950/85 backdrop-blur-xl text-slate-300 pt-16 pb-12 border-t border-white/10 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            {/* Brand column */}
            <div className="lg:col-span-2 space-y-4">
              <div
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="cursor-pointer group flex items-center"
              >
                <img
                  src="/aastha-logo.svg"
                  alt={CLINIC_INFO.name}
                  className="max-h-12 w-auto brightness-0 invert"
                />
              </div>

              <div className="text-xs font-bold uppercase tracking-wider text-teal-400">
                {CLINIC_INFO.tagline}
              </div>

              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                Complete healthcare, multi-specialty doctor consultations, and fully automated diagnostic pathology under one roof. Committed to accuracy, compassionate patient care, and reliable clinical outcomes.
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Standardized Quality Control Protocols</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Rapid Digital Reports with Online Doctor Verification</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sterile & Temperature-Monitored Home Sample Collection</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Connect & Patient Reviews
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`https://wa.me/${CLINIC_INFO.whatsapp}?text=Hello%20Aastha%20Diagnostics%2C%20I%20would%20like%20to%20inquire%20about%20booking%20and%20reports`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="https://facebook.com/aasthapolyclinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-blue-500 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Facebook</span>
                  </a>
                  <a
                    href="https://instagram.com/aasthapolyclinic"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-rose-500 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Instagram</span>
                  </a>
                  <a
                    href="https://maps.google.com/?q=Aastha+Polyclinic+and+Diagnostics"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500 text-xs text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  >
                    <span>Google Review</span>
                    <span className="text-amber-400 font-bold">5.0 ★</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Quick Links
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('services-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Clinic Services
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('doctors-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Meet Doctors
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('tests-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Diagnostic Tests
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('packages-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Health Packages
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      document.getElementById('blog-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Health Insights Blog
                  </button>
                </li>
              </ul>
            </div>

            {/* Patient Services Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Patient Services
              </h3>
              <ul className="space-y-2 text-xs text-slate-400">
                <li>
                  <button
                    onClick={() => handleOpenDoctorBooking()}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Book Doctor Appointment
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenTestBooking()}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Book Lab Test Online
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleOpenTestBooking(undefined, undefined, 'home')}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Home Sample Collection
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setIsTrackBookingOpen(true)}
                    className="hover:text-white transition-colors cursor-pointer"
                  >
                    Track & Pay Booking Status
                  </button>
                </li>
                <li>
                  <a
                    href={`tel:${CLINIC_INFO.phoneHistopath}`}
                    className="hover:text-white transition-colors"
                  >
                    Histopathology Query
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact & Helplines Column */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Contact & Helplines
              </h3>
              <div className="space-y-2 text-xs text-slate-400">
                <div>
                  <span className="block text-slate-500">Clinic OPD Booking:</span>
                  <a href={`tel:${CLINIC_INFO.phonePrimary}`} className="font-bold text-white hover:text-sky-400">
                    {CLINIC_INFO.phonePrimary}
                  </a>
                </div>
                <div>
                  <span className="block text-slate-500">Laboratory & Home Visits:</span>
                  <a href={`tel:${CLINIC_INFO.phoneLab}`} className="font-bold text-teal-400 hover:text-teal-300">
                    {CLINIC_INFO.phoneLab}
                  </a>
                </div>
                <div>
                  <span className="block text-slate-500">Histopathology Division:</span>
                  <a href={`tel:${CLINIC_INFO.phoneHistopath}`} className="font-bold text-cyan-400 hover:text-cyan-300">
                    {CLINIC_INFO.phoneHistopath}
                  </a>
                </div>
                <div>
                  <span className="block text-slate-500">Email Desk:</span>
                  <a href={`mailto:${CLINIC_INFO.email}`} className="font-medium text-slate-300 hover:text-white">
                    {CLINIC_INFO.email}
                  </a>
                </div>
                <div className="pt-1 text-[11px] text-slate-500">
                  {CLINIC_INFO.addressLine1}, {CLINIC_INFO.city}, {CLINIC_INFO.state} - {CLINIC_INFO.pincode}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Staff Portal */}
          <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
            <div>
              © 2026 {CLINIC_INFO.name} ({CLINIC_INFO.domain}). All rights reserved.
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[11px] text-slate-600 hidden md:inline">
                Medical Disclaimer: Lab reports must be correlated clinically by a registered doctor.
              </span>

              {/* Staff Portal Link */}
              <button
                onClick={() => {
                  if (currentUser && onOpenDashboard) {
                    onOpenDashboard();
                  } else {
                    onOpenLogin();
                  }
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-sky-300 border border-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-xs font-semibold"
                title="Laboratory Information System Portal"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{currentUser ? 'Go to Dashboard' : 'Staff Portal'}</span>
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* =========================================================================
          17. MODALS
          ========================================================================= */}
      {/* 1. Doctor Consultation Booking Modal */}
      <DoctorBookingModal
        isOpen={isDoctorBookingOpen}
        onClose={() => {
          setIsDoctorBookingOpen(false);
          setSelectedDoctorIdForBooking(null);
          setSelectedSpecialtyForBooking(null);
        }}
        initialDoctorId={selectedDoctorIdForBooking}
        initialSpecialty={selectedSpecialtyForBooking}
      />

      {/* 2. Diagnostic Test & Home Collection Booking Modal */}
      <TestBookingModal
        isOpen={isTestBookingOpen}
        onClose={() => {
          setIsTestBookingOpen(false);
          setSelectedTestIdForBooking(null);
          setSelectedPackageIdForBooking(null);
        }}
        initialTestId={selectedTestIdForBooking}
        initialPackageId={selectedPackageIdForBooking}
        initialMode={bookingMode}
      />

      {/* 3. Track Booking & Confirm Slot Modal */}
      <TrackBookingModal
        isOpen={isTrackBookingOpen}
        onClose={() => setIsTrackBookingOpen(false)}
      />

      {/* 4. Compare Preventive Health Packages Modal */}
      <ComparePackagesModal
        isOpen={isComparePackagesOpen}
        onClose={() => setIsComparePackagesOpen(false)}
        onSelectPackage={pkg => {
          handleOpenTestBooking(undefined, pkg.id);
        }}
      />

      {/* 5. Department Details & Protocols Modal */}
      <DepartmentDetailsModal
        isOpen={!!selectedDepartment}
        onClose={() => setSelectedDepartment(null)}
        service={selectedDepartment}
        onBookDoctor={specialty => {
          handleOpenDoctorBooking(undefined, specialty);
        }}
      />

      {/* 6. Doctor Detailed Profile Modal */}
      <DoctorProfileModal
        isOpen={!!selectedDoctorProfile}
        onClose={() => setSelectedDoctorProfile(null)}
        doctor={selectedDoctorProfile}
        onBookDoctor={doctorId => {
          handleOpenDoctorBooking(doctorId);
        }}
      />

      {/* 7. Doctor-Written Health Guide / Article Modal */}
      <BlogArticleModal
        isOpen={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
        article={selectedArticle}
        onBookTest={() => handleOpenTestBooking()}
      />
    </div>
  );
};
