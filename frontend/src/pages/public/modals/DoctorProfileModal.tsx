import React from 'react';
import {
  X,
  Star,
  Award,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Globe,
  UserCheck
} from 'lucide-react';
import { Doctor } from '../landingData';

interface DoctorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctor: Doctor | null;
  onBookDoctor: (doctorId: string) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  isOpen,
  onClose,
  doctor,
  onBookDoctor,
}) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header with Doctor Photo & Info */}
        <div className="relative bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-sky-400/50 shadow-lg shrink-0"
              src={doctor.image}
            />
            <div className="text-center sm:text-left space-y-1.5 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 bg-sky-900/60 px-2.5 py-0.5 rounded-full border border-sky-700">
                  {doctor.specialty}
                </span>
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border bg-amber-100/90 text-amber-900 border-amber-300 shadow-2xs font-bold">
                  {doctor.visitingScheduleText}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">{doctor.name}</h3>
              <p className="text-xs text-sky-200">{doctor.qualification}</p>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-slate-300 pt-1">
                <span className="flex items-center gap-1 text-amber-300 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-300" />
                  {doctor.rating}
                </span>
                <span>•</span>
                <span>{doctor.experience}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[65vh] overflow-y-auto space-y-5 text-slate-800">
          {/* Timing & Fee Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-sky-50/70 border border-sky-200/80 rounded-xl text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                Consultation Fee
              </span>
              <span className="text-sm font-black text-sky-800">₹{doctor.fee}</span>
            </div>
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                OPD Hours
              </span>
              <span className="font-bold text-slate-800">{doctor.timing}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-slate-400 text-[10px] uppercase font-bold block">
                Days Available
              </span>
              <span className="font-bold text-slate-800">
                {doctor.availableDays.join(', ')}
              </span>
            </div>
          </div>

          {/* About / Bio */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Professional Background
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{doctor.about}</p>
          </div>

          {/* Clinical Expertise */}
          {doctor.expertise && doctor.expertise.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Key Clinical Expertise & Specialties
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {doctor.expertise.map((exp, i) => (
                  <div
                    key={i}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-700"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{exp}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages & Room */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-slate-500 border-t border-slate-100">
            <span>Chamber: {doctor.roomNo || 'Main Outpatient Wing'}</span>
            <span>Languages: {doctor.languages?.join(', ') || 'English, Hindi, Odia'}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-white/60 backdrop-blur-xs border-t border-slate-200/60 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer"
          >
            Close
          </button>
          <button
            onClick={() => {
              onBookDoctor(doctor.id);
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation with {doctor.name.split(' ')[1] || doctor.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

