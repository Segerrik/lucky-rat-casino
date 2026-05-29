import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <label className={`lr-field ${className}`}>
      {label && <span className="lr-field-label">{label}</span>}
      <input className={`lr-input ${error ? 'lr-input--error' : ''}`} {...props} />
      {error && <span className="lr-field-error">{error}</span>}
    </label>
  );
}
