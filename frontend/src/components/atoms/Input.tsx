import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  required?: boolean;
  isAbnormal?: boolean;
  error?: string;
  helperText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  required,
  isAbnormal,
  error,
  helperText,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
  const abnormalClass = isAbnormal ? 'abnormal' : '';

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <input
        id={inputId}
        className={`input-control ${abnormalClass} ${className}`.trim()}
        {...props}
      />
      {error && <span style={{ color: 'var(--color-danger)', fontSize: 'var(--font-size-xs)' }}>{error}</span>}
      {helperText && !error && <span className="text-caption">{helperText}</span>}
    </div>
  );
};
