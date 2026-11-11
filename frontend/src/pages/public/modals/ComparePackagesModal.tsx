import React from 'react';
import { Sparkles, X, Check, Minus } from 'lucide-react';
import { PACKAGES_DATA, HealthPackage } from '../landingData';

interface ComparePackagesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPackage: (pkg: HealthPackage) => void;
}

export const ComparePackagesModal: React.FC<ComparePackagesModalProps> = ({
  isOpen,
  onClose,
  onSelectPackage,
}) => {
  if (!isOpen) return null;

  const comparisonFeatures = [
    { label: 'Total Parameters Tested', key: 'parametersCount', render: (p: HealthPackage) => `${p.parametersCount} Parameters` },
    { label: 'Complete Hemogram (CBC + ESR)', render: () => <Check className="w-4 h-4 text-emerald-600 mx-auto" /> },
    { label: 'Fasting Blood Sugar (FBS)', render: () => <Check className="w-4 h-4 text-emerald-600 mx-auto" /> },
    {
      label: 'HbA1c by HPLC (3 Months Average)',
      render: (p: HealthPackage) =>
        p.id !== 'pkg-basic' ? (
          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
        ),
    },
    {
      label: 'Lipid Cardiovascular Profile',
      render: (p: HealthPackage) =>
        p.id === 'pkg-diabetes' ? (
          <span className="text-xs text-slate-600">Screening</span>
        ) : (
          <span className="text-xs font-semibold text-emerald-700">8 Parameters</span>
        ),
    },
    {
      label: 'Liver Function Test (LFT - 11 Tests)',
      render: (p: HealthPackage) =>
        p.id === 'pkg-basic' ? (
          <span className="text-xs text-slate-600">Screen (SGPT, SGOT, Bilirubin)</span>
        ) : p.id === 'pkg-diabetes' ? (
          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
        ) : (
          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
        ),
    },
    {
      label: 'Kidney Function Test (KFT with Electrolytes)',
      render: (p: HealthPackage) =>
        p.id === 'pkg-senior' || p.id === 'pkg-complete' ? (
          <span className="text-xs font-bold text-teal-700">Full KFT + Electrolytes</span>
        ) : (
          <span className="text-xs text-slate-600">Creatinine, Urea, Uric Acid</span>
        ),
    },
    {
      label: 'Thyroid Profile (T3, T4, TSH Ultrasensitive)',
      render: (p: HealthPackage) =>
        p.id === 'pkg-women' || p.id === 'pkg-complete' || p.id === 'pkg-senior' ? (
          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
        ),
    },
    {
      label: 'Vitamin D3 & Vitamin B12 Levels',
      render: (p: HealthPackage) =>
        p.id === 'pkg-senior' || p.id === 'pkg-men' || p.id === 'pkg-complete' || p.id === 'pkg-women' ? (
          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
        ) : (
          <Minus className="w-4 h-4 text-slate-300 mx-auto" />
        ),
    },
    {
      label: '12-Lead Digital ECG at Clinic',
      render: (p: HealthPackage) =>
        p.id === 'pkg-senior' ? (
          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
        ) : (
          <span className="text-[11px] text-slate-400">Optional Add-on</span>
        ),
    },
    {
      label: 'Urine Routine & Microscopic',
      render: () => <Check className="w-4 h-4 text-emerald-600 mx-auto" />,
    },
    {
      label: 'Home Sample Collection Available',
      render: () => (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          Yes (Doorstep)
        </span>
      ),
    },
    {
      label: 'Digital Report Turnaround Time',
      render: () => <span className="text-xs text-slate-700 font-medium">Same Day (Evening)</span>,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-white/80 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-400/30 backdrop-blur-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-white">
                Compare Preventive Health Packages
              </h2>
              <p className="text-xs text-slate-300">
                Side-by-side diagnostic investigation matrix
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

        {/* Scrollable Matrix Table */}
        <div className="p-4 sm:p-6 max-h-[75vh] overflow-y-auto overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="p-3 text-xs font-bold text-slate-500 uppercase tracking-wider w-1/4">
                  Investigation Parameter
                </th>
                {PACKAGES_DATA.map(pkg => (
                  <th key={pkg.id} className="p-3 text-center align-top">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                        Save {pkg.discountPercent}%
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight mt-1">
                        {pkg.name}
                      </h4>
                      <div className="mt-1">
                        <span className="text-base font-black text-sky-700">₹{pkg.price}</span>
                        <span className="text-[11px] text-slate-400 line-through ml-1.5">
                          ₹{pkg.originalPrice}
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          onSelectPackage(pkg);
                          onClose();
                        }}
                        className="mt-2 w-full py-1.5 px-2 bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-bold rounded-lg shadow-2xs transition-colors cursor-pointer"
                      >
                        Book Package
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs">
              {comparisonFeatures.map((feat, fIdx) => (
                <tr
                  key={fIdx}
                  className={fIdx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}
                >
                  <td className="p-3 font-semibold text-slate-700">{feat.label}</td>
                  {PACKAGES_DATA.map(pkg => (
                    <td key={pkg.id} className="p-3 text-center text-slate-800">
                      {feat.render(pkg)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between text-xs text-slate-500">
          <span>* All packages include Pathologist review and automated barcoded processing.</span>
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

