import React, { forwardRef } from 'react';
import './Input.css';

/**
 * Reusable Input / Textarea / Select component.
 * Props:
 *   label: string
 *   error: string
 *   helperText: string
 *   icon: emoji or element (shown inside left side)
 *   rightIcon: element (shown inside right side)
 *   as: 'input' | 'textarea' | 'select'
 *   All standard HTML input/textarea/select props
 */
const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon,
    rightIcon,
    as: Tag = 'input',
    className = '',
    id,
    children, // for <select> options
    ...rest
  },
  ref
) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`input-group ${error ? 'input-group--error' : ''} ${className}`}>
      {label && (
        <label className="input-label" htmlFor={inputId}>
          {label}
        </label>
      )}

      <div className="input-wrapper">
        {icon && <span className="input-icon input-icon--left">{icon}</span>}

        <Tag
          id={inputId}
          ref={ref}
          className={[
            'input-field',
            icon      ? 'input-field--with-left-icon'  : '',
            rightIcon ? 'input-field--with-right-icon' : '',
            Tag === 'textarea' ? 'input-field--textarea' : '',
            Tag === 'select'   ? 'input-field--select'   : '',
          ].filter(Boolean).join(' ')}
          aria-describedby={
            error      ? `${inputId}-error`  :
            helperText ? `${inputId}-helper` : undefined
          }
          aria-invalid={error ? 'true' : undefined}
          {...rest}
        >
          {children}
        </Tag>

        {rightIcon && <span className="input-icon input-icon--right">{rightIcon}</span>}
      </div>

      {error && (
        <span id={`${inputId}-error`} className="input-error" role="alert">
          ⚠ {error}
        </span>
      )}
      {!error && helperText && (
        <span id={`${inputId}-helper`} className="input-helper">
          {helperText}
        </span>
      )}
    </div>
  );
});

export default Input;
