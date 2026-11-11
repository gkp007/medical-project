import React from 'react';
import {
  X,
  Stethoscope,
  Activity,
  CheckCircle2,
  Calendar,
  Clock,
  ArrowRight
} from 'lucide-react';
import { ClinicService } from '../landingData';

interface DepartmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ClinicService | null;
  onBookDoctor: (specialty: string) => void;
}

export const DepartmentDetailsModal: React.FC<DepartmentDetailsModalProps> = ({
  isOpen,
  onClose,
  service,
  onBookDoctor,
}) => {
  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-sky-500/20 border border-sky-400/30 flex items-center justify-center text-sky-400 backdrop-blur-xs">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
                {service.department}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-white">{service.name}</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 text-slate-800">
          {/* Overview */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Department Overview
            </h4>
            <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
          </div>

          {/* Common conditions */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Common Conditions Evaluated & Treated
            </h4>
            <div className="flex flex-wrap gap-2">
              {service.commonConditions.map((cond, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-xl text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  {cond}
                </span>
              ))}
            </div>
          </div>

          {/* Clinical protocols */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              In-House Clinical Protocols & Investigations
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {service.procedures.map((proc, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-xl bg-sky-50/60 border border-sky-100 flex items-center gap-2 text-xs font-medium text-slate-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>{proc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-sky-600" />
              <span>
                OPD Schedule: <strong>{service.opdDays}</strong>
              </span>
            </div>
            <span className="text-sky-700 font-bold">Walk-in & Online Booking</span>
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
              onBookDoctor(service.name);
              onClose();
            }}
            className="px-5 py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Consultation in {service.name}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

