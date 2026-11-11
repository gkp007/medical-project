import React, { useState } from 'react';
import {
  FlaskConical,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  MapPin,
  Home,
  Building,
  Plus,
  Trash2,
  Search,
  Sparkles,
  Share2,
  Printer
} from 'lucide-react';
import { DiagnosticTest, HealthPackage, ALL_TESTS_DATA, PACKAGES_DATA, CLINIC_INFO } from '../landingData';

interface TestBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTestId?: string | null;
  initialPackageId?: string | null;
  initialMode?: 'center' | 'home';
}

export const TestBookingModal: React.FC<TestBookingModalProps> = ({
  isOpen,
  onClose,
  initialTestId,
  initialPackageId,
  initialMode = 'center',
}) => {
  const [step, setStep] = useState<number>(1);
  const [mode, setMode] = useState<'center' | 'home'>(initialMode);
  const [testSearch, setTestSearch] = useState<string>('');

  // Cart
  const [selectedTests, setSelectedTests] = useState<DiagnosticTest[]>(() => {
    if (initialTestId) {
      const match = ALL_TESTS_DATA.find(t => t.id === initialTestId);
      return match ? [match] : [ALL_TESTS_DATA[0]];
    }
    return [ALL_TESTS_DATA[0]];
  });

  const [selectedPackages, setSelectedPackages] = useState<HealthPackage[]>(() => {
    if (initialPackageId) {
      const match = PACKAGES_DATA.find(p => p.id === initialPackageId);
      return match ? [match] : [];
    }
    return [];
  });

  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('07:00 AM - 09:30 AM (Fasting)');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    address: '',
    landmark: '',
    agreedFasting: true,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    token: string;
    mode: 'center' | 'home';
    date: string;
    timeSlot: string;
    patientName: string;
    phone: string;
    totalAmount: number;
    itemsCount: number;
  } | null>(null);

  if (!isOpen) return null;

  const totalAmount =
    selectedTests.reduce((sum, t) => sum + t.price, 0) +
    selectedPackages.reduce((sum, p) => sum + p.price, 0);

  const toggleTest = (test: DiagnosticTest) => {
    if (selectedTests.some(t => t.id === test.id)) {
      setSelectedTests(selectedTests.filter(t => t.id !== test.id));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const togglePackage = (pkg: HealthPackage) => {
    if (selectedPackages.some(p => p.id === pkg.id)) {
      setSelectedPackages(selectedPackages.filter(p => p.id !== pkg.id));
    } else {
      setSelectedPackages([...selectedPackages, pkg]);
    }
  };

  const filteredTests = testSearch
    ? ALL_TESTS_DATA.filter(
        t =>
          t.name.toLowerCase().includes(testSearch.toLowerCase()) ||
          t.code.toLowerCase().includes(testSearch.toLowerCase()) ||
          t.category.toLowerCase().includes(testSearch.toLowerCase())
      )
    : ALL_TESTS_DATA.slice(0, 15);

  const handleNext = () => {
    if (step === 1 && selectedTests.length === 0 && selectedPackages.length === 0) {
      alert('Please select at least one test or package to continue');
      return;
    }
    if (step === 2 && mode === 'home' && !formData.address.trim()) {
      alert('Please enter your pickup address for Home Collection');
      return;
    }
    if (step === 3) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        alert('Please fill in patient name and phone number');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => setStep(s => Math.max(s - 1, 1));

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const token = `AST-LAB-2026-${randomNum}`;
      setConfirmedBooking({
        token,
        mode,
        date,
        timeSlot,
        patientName: formData.fullName,
        phone: formData.phone,
        totalAmount,
        itemsCount: selectedTests.length + selectedPackages.length,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handlePrint = () => window.print();

  const handleShareWhatsApp = () => {
    if (!confirmedBooking) return;
    const msg = `*Aastha Polyclinic & Diagnostic Centre - Lab Booking Confirmed*\n\nBooking Token: ${confirmedBooking.token}\nMode: ${confirmedBooking.mode === 'home' ? 'Doorstep Home Collection' : 'Lab Visit'}\nPatient: ${confirmedBooking.patientName}\nDate: ${confirmedBooking.date}\nTime: ${confirmedBooking.timeSlot}\nTotal Payable: ₹${confirmedBooking.totalAmount}\n\nClinic Helpline: ${CLINIC_INFO.phoneLab}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-700 via-teal-600 to-sky-600 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <FlaskConical className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Book Diagnostic Test & Packages
              </h2>
              <p className="text-xs text-teal-100">
                {CLINIC_INFO.name} • Doorstep Home Collection & Centre Visit
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!confirmedBooking && (
          <div className="bg-white/60 backdrop-blur-xs border-b border-slate-200/60 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={step >= 1 ? 'text-teal-700 font-bold' : ''}>1. Select Tests</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 2 ? 'text-teal-700 font-bold' : ''}>2. Mode & Schedule</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 3 ? 'text-teal-700 font-bold' : ''}>3. Patient Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 4 ? 'text-teal-700 font-bold' : ''}>4. Review</span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto">
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Order Submitted
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Diagnostic Booking Confirmed!
                </h3>
                <p className="text-xs text-slate-500">
                  {confirmedBooking.mode === 'home'
                    ? 'Our certified phlebotomist Subrat will visit your address during the selected time window.'
                    : 'Please visit our central laboratory reception with your booking token.'}
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-teal-50/50 rounded-2xl border border-teal-200/80 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Booking Token #
                    </span>
                    <span className="text-base font-black text-teal-800 font-mono tracking-wider">
                      {confirmedBooking.token}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Mode</span>
                    <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200">
                      {confirmedBooking.mode === 'home' ? 'Home Collection' : 'Center Visit'}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Patient Name:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.patientName}</span>
                    <span className="text-[11px] text-slate-500 block">{confirmedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Total Payable:</span>
                    <span className="text-base font-black text-teal-700">₹{confirmedBooking.totalAmount}</span>
                    <span className="text-[10px] text-slate-500 block">Pay on Sample Collection</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Scheduled Date:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Time Window:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.timeSlot}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>WhatsApp Details</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Receipt</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Select Tests & Packages */}
              {step === 1 && (
                <div className="space-y-4">
                  {/* Cart preview */}
                  {(selectedTests.length > 0 || selectedPackages.length > 0) && (
                    <div className="p-3 bg-teal-50/80 border border-teal-200/80 rounded-xl flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-teal-600" />
                        <span className="font-bold text-teal-900">
                          {selectedTests.length} Tests + {selectedPackages.length} Packages Selected
                        </span>
                      </div>
                      <div className="font-black text-teal-800 text-sm">
                        Total: ₹{totalAmount}
                      </div>
                    </div>
                  )}

                  {/* Search box */}
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      placeholder="Search 800+ diagnostic tests (e.g. CBC, Lipid, HbA1c, Thyroid, USG)..."
                      value={testSearch}
                      onChange={e => setTestSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                    />
                  </div>

                  {/* Curated Health Packages Pill Selector */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Preventive Health Packages (Full Body)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PACKAGES_DATA.slice(0, 4).map(pkg => {
                        const isSelected = selectedPackages.some(p => p.id === pkg.id);
                        return (
                          <div
                            key={pkg.id}
                            onClick={() => togglePackage(pkg)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50/80 text-teal-900 font-bold ring-1 ring-teal-500'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900">{pkg.name}</div>
                              <div className="text-[11px] text-teal-700">{pkg.parametersCount} Parameters</div>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-slate-900">₹{pkg.price}</span>
                              <span className="block text-[10px] text-slate-400 line-through">₹{pkg.originalPrice}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tests List */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Individual Diagnostic Tests
                    </label>
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {filteredTests.map(test => {
                        const isSelected = selectedTests.some(t => t.id === test.id);
                        return (
                          <div
                            key={test.id}
                            onClick={() => toggleTest(test)}
                            className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between text-xs ${
                              isSelected
                                ? 'border-teal-500 bg-teal-50/90 text-teal-900 font-bold ring-1 ring-teal-500'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <div>
                              <div className="font-bold text-slate-900">{test.name}</div>
                              <div className="text-[11px] text-slate-500">
                                {test.code} • {test.category} • {test.reportTime}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="font-bold text-teal-700 text-sm">₹{test.price}</span>
                              <span className="block text-[10px] text-slate-400 line-through">₹{test.originalPrice}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Mode & Schedule */}
              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Choose Sample Collection Mode
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setMode('center')}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          mode === 'center'
                            ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-500'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Building className="w-6 h-6 mx-auto mb-1.5 text-teal-600" />
                        <span className="text-xs font-bold block">Visit Diagnostic Center</span>
                        <span className="text-[10px] text-slate-500">Walk-in Anytime</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setMode('home')}
                        className={`p-4 rounded-xl border text-center transition-all cursor-pointer ${
                          mode === 'home'
                            ? 'border-teal-500 bg-teal-50 text-teal-900 font-bold ring-1 ring-teal-500'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <Home className="w-6 h-6 mx-auto mb-1.5 text-teal-600" />
                        <span className="text-xs font-bold block">Doorstep Home Collection</span>
                        <span className="text-[10px] text-emerald-600 font-semibold">Trained Phlebotomist</span>
                      </button>
                    </div>
                  </div>

                  {mode === 'home' && (
                    <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl animate-in fade-in">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Complete Address for Home Pickup *
                        </label>
                        <input
                          type="text"
                          placeholder="House/Flat #, Street, Colony, Near Landmark"
                          value={formData.address}
                          onChange={e => setFormData({ ...formData, address: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Nearby Landmark
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Near Kalyan Mandap / Main Road"
                          value={formData.landmark}
                          onChange={e => setFormData({ ...formData, landmark: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={e => setDate(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Preferred Time Slot
                      </label>
                      <select
                        value={timeSlot}
                        onChange={e => setTimeSlot(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                      >
                        <option value="07:00 AM - 09:30 AM (Fasting)">07:00 AM - 09:30 AM (Fasting)</option>
                        <option value="09:30 AM - 12:00 PM (Morning)">09:30 AM - 12:00 PM (Morning)</option>
                        <option value="12:00 PM - 03:00 PM (Afternoon)">12:00 PM - 03:00 PM (Afternoon)</option>
                        <option value="04:00 PM - 07:00 PM (Evening)">04:00 PM - 07:00 PM (Evening)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Patient Details */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Patient Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ramesh Kumar Patel"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9827493536"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 45"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-teal-500 shadow-2xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="fasting-agree"
                      checked={formData.agreedFasting}
                      onChange={e => setFormData({ ...formData, agreedFasting: e.target.checked })}
                      className="mt-0.5"
                    />
                    <label htmlFor="fasting-agree" className="cursor-pointer">
                      I understand that blood sugar, lipid profiles, and comprehensive health checks may require 10-12 hours overnight fasting (water is allowed).
                    </label>
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
                      Order Summary
                    </h4>

                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {selectedPackages.map(p => (
                        <div key={p.id} className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-800">{p.name} (Package)</span>
                          <span className="font-bold text-teal-700">₹{p.price}</span>
                        </div>
                      ))}
                      {selectedTests.map(t => (
                        <div key={t.id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700">{t.name}</span>
                          <span className="font-bold text-slate-800">₹{t.price}</span>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mode</span>
                        <span className="font-bold text-slate-800">
                          {mode === 'home' ? 'Home Collection' : 'Lab Center Visit'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Scheduled Window</span>
                        <span className="font-bold text-slate-800">{date} • {timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Patient</span>
                        <span className="font-bold text-slate-800">{formData.fullName} ({formData.phone})</span>
                      </div>
                      {mode === 'home' && (
                        <div>
                          <span className="text-slate-400 text-[11px] block">Address</span>
                          <span className="font-medium text-slate-700">{formData.address}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between font-bold">
                      <span className="text-slate-700 text-xs">Total Amount (Pay on Collection):</span>
                      <span className="text-lg text-teal-700 font-black">₹{totalAmount}</span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {!confirmedBooking && (
          <div className="bg-white/60 backdrop-blur-xs border-t border-slate-200/60 px-6 py-4 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrev}
                className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl flex items-center gap-1 transition-all cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-5 py-2.5 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl flex items-center gap-1.5 shadow-sm shadow-teal-600/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-teal-600 to-sky-600 hover:from-teal-700 hover:to-sky-700 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-teal-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Generating Token...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Booking</span>
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

