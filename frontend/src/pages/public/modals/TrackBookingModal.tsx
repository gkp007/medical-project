import React, { useState } from 'react';
import {
  CreditCard,
  X,
  Search,
  ArrowRight,
  Phone,
  CheckCircle2,
  Clock,
  Printer,
  Share2,
  AlertCircle
} from 'lucide-react';
import { CLINIC_INFO } from '../landingData';

interface TrackBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MockBooking {
  token: string;
  patientName: string;
  type: string;
  doctorOrTest: string;
  date: string;
  timeSlot: string;
  amount: number;
  status: 'Pending' | 'Approved' | 'Confirmed';
}

const SAMPLE_REQUESTS: MockBooking[] = [
  {
    token: 'AST-2026-89265',
    patientName: 'Ramesh Kumar Patel',
    type: 'Doctor Consultation',
    doctorOrTest: 'Dr. P R Mohapatra (Cardiology)',
    date: '2026-11-12',
    timeSlot: '09:00 AM - 11:30 AM',
    amount: 500,
    status: 'Pending',
  },
  {
    token: 'AST-2026-30549',
    patientName: 'Vrindawati Patel',
    type: 'Doctor Consultation',
    doctorOrTest: 'Dr. Rajesh N. Panda (General Medicine)',
    date: '2026-11-13',
    timeSlot: '11:00 AM - 01:00 PM',
    amount: 500,
    status: 'Approved',
  },
  {
    token: 'AST-2026-93594',
    patientName: 'Prasanna Kumar Sahu',
    type: 'Home Sample Collection',
    doctorOrTest: 'Senior Citizen Comprehensive Package (78 Tests)',
    date: '2026-11-14',
    timeSlot: '07:00 AM - 09:00 AM',
    amount: 1999,
    status: 'Confirmed',
  },
];

export const TrackBookingModal: React.FC<TrackBookingModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<MockBooking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setHasSearched(true);
    setPaymentSuccess(false);

    const match = SAMPLE_REQUESTS.find(
      r =>
        r.token.toLowerCase().includes(query.trim().toLowerCase()) ||
        r.patientName.toLowerCase().includes(query.trim().toLowerCase()) ||
        query.includes('98274') ||
        query.includes('82497')
    );

    if (match) {
      setResult(match);
    } else {
      // Dynamic fallback preview
      setResult({
        token: query.startsWith('AST-') ? query : `AST-2026-${Math.floor(10000 + Math.random() * 90000)}`,
        patientName: 'Verified Patient',
        type: 'Clinic OPD / Diagnostic Booking',
        doctorOrTest: 'Outpatient Consultation & Laboratory',
        date: '2026-11-12',
        timeSlot: 'Morning Slot (09:30 AM - 11:30 AM)',
        amount: 500,
        status: 'Approved',
      });
    }
  };

  const handleSelectQuick = (req: MockBooking) => {
    setQuery(req.token);
    setResult(req);
    setHasSearched(true);
    setPaymentSuccess(false);
  };

  const handlePayNow = () => {
    setPaymentSuccess(true);
    if (result) {
      setResult({ ...result, status: 'Confirmed' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/90 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-900 via-slate-900 to-teal-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-sky-300 border border-white/20">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                  Track Booking & Confirm Slot
                </h3>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-2 py-0.5 rounded-full">
                  Admin Approval Required
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Check admin acceptance status & complete payment to confirm your appointment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200/80">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                placeholder="Enter Request / Booking # (e.g. AST-DOC-... or AST-LAB-...) or Phone Number"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-2xs"
                type="text"
              />
            </div>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <span>Track</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[70vh] overflow-y-auto space-y-5">
          {result ? (
            <div className="space-y-4 animate-in fade-in duration-200">
              {paymentSuccess && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Payment received successfully! Slot has been confirmed.</span>
                </div>
              )}

              <div className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Booking Token
                    </span>
                    <span className="text-base font-black text-slate-900 font-mono">
                      {result.token}
                    </span>
                  </div>
                  <div>
                    <span
                      className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                        result.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : result.status === 'Approved'
                          ? 'bg-sky-100 text-sky-800 border-sky-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {result.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Patient Name:</span>
                    <span className="font-bold text-slate-800">{result.patientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Booking Type:</span>
                    <span className="font-bold text-slate-800">{result.type}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 text-[11px] block">Doctor / Item:</span>
                    <span className="font-bold text-sky-700">{result.doctorOrTest}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Scheduled Date:</span>
                    <span className="font-medium text-slate-800">{result.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Time Window:</span>
                    <span className="font-medium text-slate-800">{result.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-600">Total Consultation/Test Fee:</span>
                  <span className="text-base font-black text-slate-900">₹{result.amount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Pass</span>
                </button>

                {result.status !== 'Confirmed' ? (
                  <button
                    onClick={handlePayNow}
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay ₹{result.amount} to Confirm Slot</span>
                  </button>
                ) : (
                  <span className="text-xs font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Ready for Clinic Reception</span>
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-sky-50 text-sky-600 rounded-2xl flex items-center justify-center mx-auto border border-sky-200">
                <Search className="w-7 h-7" />
              </div>
              <div className="max-w-md mx-auto space-y-1">
                <h4 className="text-base font-bold text-slate-900">
                  Lookup Any Booking Request
                </h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your Request Token # or Mobile Number above to view admin approval status, complete payment, or print your confirmed appointment pass.
                </p>
              </div>

              {/* Recent Requests */}
              <div className="max-w-md mx-auto pt-4 text-left border-t border-slate-200">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Sample Recent Requests
                </span>
                <div className="space-y-1.5">
                  {SAMPLE_REQUESTS.map(req => (
                    <button
                      key={req.token}
                      onClick={() => handleSelectQuick(req)}
                      className="w-full p-2.5 rounded-xl bg-slate-50 hover:bg-sky-50 border border-slate-200 text-left flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <div>
                        <div className="text-xs font-bold text-slate-800">
                          {req.patientName} • {req.doctorOrTest.split('(')[0]}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          {req.token} ({req.date})
                        </div>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          req.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : req.status === 'Approved'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {req.status}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <Phone className="w-3.5 h-3.5 text-sky-600" />
            <span>
              Need assistance? Call Clinic OPD: <strong>{CLINIC_INFO.phonePrimary}</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

