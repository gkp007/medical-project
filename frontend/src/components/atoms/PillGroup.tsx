import React from 'react';

export interface PillOption<T extends string | number> {
  label: string;
  value: T;
}

export interface PillGroupProps<T extends string | number> {
  options: PillOption<T>[];
  value: T;
  onChange: (val: T) => void;
  className?: string;
}

export function PillGroup<T extends string | number>({
  options,
  value,
  onChange,
  className = '',
}: PillGroupProps<T>) {
  return (
    <div className={`pill-group ${className}`.trim()}>
      {options.map((opt) => {
        const isActive = opt.value === value;
        return (
          <div
            key={String(opt.value)}
            className={`pill-option ${isActive ? 'active' : ''}`}
            onClick={() => onChange(opt.value)}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
}
