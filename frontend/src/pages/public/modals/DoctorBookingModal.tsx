import React, { useState } from 'react';
import {
  Calendar,
  X,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Clock,
  User,
  Phone,
  MapPin,
  FileText,
  Printer,
  Share2,
  Stethoscope
} from 'lucide-react';
import { Doctor, DOCTORS_DATA, CLINIC_INFO } from '../landingData';

interface DoctorBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDoctorId?: string | null;
  initialSpecialty?: string | null;
}

export const DoctorBookingModal: React.FC<DoctorBookingModalProps> = ({
  isOpen,
  onClose,
  initialDoctorId,
  initialSpecialty,
}) => {
  const [step, setStep] = useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>(initialSpecialty || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(
    initialDoctorId || DOCTORS_DATA[0]?.id || ''
  );

  const [date, setDate] = useState<string>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState<string>('09:30 AM - 11:30 AM (Morning)');

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    age: '',
    gender: 'Male',
    city: 'Bargarh',
    symptoms: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{
    token: string;
    doctor: Doctor;
    date: string;
    timeSlot: string;
    patientName: string;
    phone: string;
  } | null>(null);

  if (!isOpen) return null;

  const filteredDoctors = selectedSpecialty
    ? DOCTORS_DATA.filter(
        d =>
          d.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase()) ||
          selectedSpecialty.toLowerCase().includes(d.specialty.toLowerCase())
      )
    : DOCTORS_DATA;

  const selectedDoctor =
    DOCTORS_DATA.find(d => d.id === selectedDoctorId) || filteredDoctors[0] || DOCTORS_DATA[0];

  const handleNext = () => {
    if (step === 1 && !selectedDoctor) return;
    if (step === 2 && !date) return;
    if (step === 3) {
      if (!formData.fullName.trim() || !formData.phone.trim()) {
        alert('Please fill in patient name and phone number');
        return;
      }
    }
    setStep(s => Math.min(s + 1, 4));
  };

  const handlePrev = () => {
    setStep(s => Math.max(s - 1, 1));
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      const token = `AST-DOC-2026-${randomNum}`;
      setConfirmedBooking({
        token,
        doctor: selectedDoctor,
        date,
        timeSlot,
        patientName: formData.fullName,
        phone: formData.phone,
      });
      setIsSubmitting(false);
    }, 600);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    if (!confirmedBooking) return;
    const msg = `*Aastha Polyclinic & Diagnostic Centre - Appointment Confirmed*\n\nAppointment Token: ${confirmedBooking.token}\nDoctor: ${confirmedBooking.doctor.name} (${confirmedBooking.doctor.specialty})\nPatient: ${confirmedBooking.patientName}\nDate: ${confirmedBooking.date}\nTime Slot: ${confirmedBooking.timeSlot}\n\nClinic Helpline: ${CLINIC_INFO.phonePrimary}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-700 via-sky-600 to-teal-600 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                Book Doctor Consultation
              </h2>
              <p className="text-xs text-sky-100">
                {CLINIC_INFO.name} • Instant Slot Confirmation
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

        {/* Multi-Step Indicator */}
        {!confirmedBooking && (
          <div className="bg-white/60 backdrop-blur-xs border-b border-slate-200/60 px-6 py-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className={step >= 1 ? 'text-sky-700 font-bold' : ''}>1. Doctor</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 2 ? 'text-sky-700 font-bold' : ''}>2. Date & Slot</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 3 ? 'text-sky-700 font-bold' : ''}>3. Patient Details</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
              <span className={step >= 4 ? 'text-sky-700 font-bold' : ''}>4. Review</span>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 sm:p-6 max-h-[72vh] overflow-y-auto">
          {confirmedBooking ? (
            <div className="text-center py-6 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Appointment Confirmed
                </span>
                <h3 className="text-xl font-black text-slate-900 mt-2">
                  Slot Reserved Successfully!
                </h3>
                <p className="text-xs text-slate-500">
                  A confirmation SMS & WhatsApp have been queued. Please present this token at the reception.
                </p>
              </div>

              {/* Pass Card */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-sky-50/50 rounded-2xl border border-sky-200/80 text-left space-y-3 shadow-xs">
                <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Appointment Token #
                    </span>
                    <span className="text-base font-black text-sky-800 font-mono tracking-wider">
                      {confirmedBooking.token}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Status</span>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      Confirmed
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Doctor:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.doctor.name}</span>
                    <span className="text-[11px] text-sky-700 block">{confirmedBooking.doctor.specialty}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Patient Name:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.patientName}</span>
                    <span className="text-[11px] text-slate-500 block">{confirmedBooking.phone}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Date:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.date}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Slot:</span>
                    <span className="font-bold text-slate-800">{confirmedBooking.timeSlot}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-500">
                  <span>Room: {confirmedBooking.doctor.roomNo || 'OPD Chamber'}</span>
                  <span>Fee: ₹{confirmedBooking.doctor.fee} (Payable at Desk)</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleShareWhatsApp}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Share2 className="w-4 h-4" />
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-300 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Pass</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Step 1: Select Specialist Doctor */}
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Filter by Medical Specialty (Optional)
                    </label>
                    <select
                      value={selectedSpecialty}
                      onChange={e => setSelectedSpecialty(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-white/80 bg-white/90 text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    >
                      <option value="">All Specialties ({DOCTORS_DATA.length} Doctors)</option>
                      <option value="Cardiology">Cardiology & Heart Care</option>
                      <option value="Dermatology">Dermatology & Skin Care</option>
                      <option value="ENT">ENT (Ear, Nose & Throat)</option>
                      <option value="Gastroenterology">Gastroenterology & Liver</option>
                      <option value="Medicine">General Medicine & Diabetology</option>
                      <option value="Gynecology">Gynecology & Obstetrics</option>
                      <option value="Neurology">Neurology Consultation</option>
                      <option value="Orthopedic">Orthopedics & Joint Care</option>
                      <option value="Pediatrics">Pediatrics & Child Health</option>
                      <option value="Urology">Urology & Kidney Care</option>
                      <option value="Pathology">Pathology & Lab Consultations</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Specialist
                    </label>
                    <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                      {filteredDoctors.map(doc => {
                        const isSelected = doc.id === selectedDoctorId;
                        return (
                          <div
                            key={doc.id}
                            onClick={() => setSelectedDoctorId(doc.id)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-3 ${
                              isSelected
                                ? 'border-sky-500 bg-sky-50/90 shadow-sm ring-1 ring-sky-500'
                                : 'border-white/80 bg-white/60 hover:bg-white/90 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                alt={doc.name}
                                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                                src={doc.image}
                              />
                              <div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <h4 className="text-sm font-bold text-slate-900 leading-tight">
                                    {doc.name}
                                  </h4>
                                  <span className="text-[9px] px-2 py-0.5 rounded-full border bg-sky-100/90 text-sky-900 border-sky-300 shadow-2xs font-bold">
                                    {doc.visitingScheduleText}
                                  </span>
                                </div>
                                <p className="text-xs text-sky-700 font-medium">{doc.specialty}</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {doc.qualification} • {doc.timing}
                                </p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-sm font-bold text-slate-900">
                                ₹{doc.fee}
                              </span>
                              <span className="block text-[10px] text-slate-500">
                                Consultation Fee
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Date & Slot */}
              {step === 2 && (
                <div className="space-y-5">
                  <div className="p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl flex items-center gap-3">
                    <img
                      src={selectedDoctor.image}
                      alt={selectedDoctor.name}
                      className="w-11 h-11 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{selectedDoctor.name}</h4>
                      <p className="text-xs text-sky-700">{selectedDoctor.specialty}</p>
                      <p className="text-[11px] text-slate-500">
                        Available Days: {selectedDoctor.availableDays.join(', ')} • {selectedDoctor.timing}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select Preferred Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={e => setDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      Select Consultation Time Slot
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {[
                        '09:30 AM - 11:30 AM (Morning)',
                        '11:30 AM - 01:30 PM (Mid-day)',
                        '04:30 PM - 06:30 PM (Evening)',
                        '06:30 PM - 08:30 PM (Late Evening)',
                      ].map(slot => (
                        <button
                          type="button"
                          key={slot}
                          onClick={() => setTimeSlot(slot)}
                          className={`p-3 rounded-xl border text-left text-xs font-medium transition-all cursor-pointer flex items-center justify-between ${
                            timeSlot === slot
                              ? 'border-sky-500 bg-sky-50 text-sky-900 font-bold ring-1 ring-sky-500'
                              : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <Clock className="w-3.5 h-3.5 text-sky-600" />
                            <span>{slot}</span>
                          </div>
                          {timeSlot === slot && (
                            <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                          )}
                        </button>
                      ))}
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
                        placeholder="e.g. Anand Sharma"
                        value={formData.fullName}
                        onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
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
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 38"
                        value={formData.age}
                        onChange={e => setFormData({ ...formData, age: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Gender
                      </label>
                      <select
                        value={formData.gender}
                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        City / Town
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Bargarh"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Chief Complaints / Symptoms (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Briefly describe fever, joint pain, chest tightness, routine checkup..."
                      value={formData.symptoms}
                      onChange={e => setFormData({ ...formData, symptoms: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-white text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-sky-500 shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Review */}
              {step === 4 && (
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5">
                      Consultation Overview
                    </h4>
                    <div className="flex items-center gap-3">
                      <img
                        src={selectedDoctor.image}
                        alt={selectedDoctor.name}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-300"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{selectedDoctor.name}</h4>
                        <p className="text-xs text-sky-700 font-medium">{selectedDoctor.specialty}</p>
                        <p className="text-[11px] text-slate-500">{selectedDoctor.qualification}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-200/60">
                      <div>
                        <span className="text-slate-400 text-[11px] block">Appointment Date</span>
                        <span className="font-bold text-slate-800">{date}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Time Window</span>
                        <span className="font-bold text-slate-800">{timeSlot}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Patient Name</span>
                        <span className="font-bold text-slate-800">{formData.fullName} ({formData.gender}, {formData.age || 'Adult'})</span>
                      </div>
                      <div>
                        <span className="text-slate-400 text-[11px] block">Mobile</span>
                        <span className="font-bold text-slate-800">{formData.phone}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold">
                      <span className="text-slate-600">Consultation Fee (Pay at Clinic):</span>
                      <span className="text-base text-sky-700">₹{selectedDoctor.fee}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 italic">
                    By clicking confirm, an automated slot will be reserved under your name. No advance payment required for clinic visit.
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer Navigation */}
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
                className="px-5 py-2.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-xl flex items-center gap-1.5 shadow-sm shadow-sky-600/20 transition-all cursor-pointer"
              >
                <span>Continue</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-xs font-bold bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 text-white rounded-xl flex items-center gap-1.5 shadow-md shadow-sky-600/30 transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Slot...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm Appointment</span>
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

