import React from 'react';
import './Button.css';
import LoadingSpinner from './LoadingSpinner';

/**
 * Reusable Button component.
 * Props:
 *   variant: 'primary' | 'secondary' | 'danger' | 'success' | 'ghost' | 'outline'
 *   size: 'sm' | 'md' | 'lg'
 *   loading: boolean
 *   disabled: boolean
 *   fullWidth: boolean
 *   icon: string (emoji or element shown before label)
 *   onClick, type, className, children
 */
export default function Button({
  variant   = 'primary',
  size      = 'md',
  loading   = false,
  disabled  = false,
  fullWidth = false,
  icon,
  onClick,
  type      = 'button',
  className = '',
  children,
  ...rest
}) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    fullWidth ? 'btn--full' : '',
    loading   ? 'btn--loading' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <>
          <LoadingSpinner size="sm" inline />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && <span className="btn__icon">{icon}</span>}
          {children && <span>{children}</span>}
        </>
      )}
    </button>
  );
}
