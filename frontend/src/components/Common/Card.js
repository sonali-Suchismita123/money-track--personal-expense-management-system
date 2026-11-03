import React from 'react';
import './Card.css';

/**
 * Reusable Card component.
 * Props:
 *   title: string (optional header)
 *   subtitle: string
 *   action: React node (rendered in header right side)
 *   noPadding: boolean
 *   className: string
 *   style: object
 *   onClick: function
 *   children
 */
export default function Card({
  title,
  subtitle,
  action,
  noPadding  = false,
  className  = '',
  style,
  onClick,
  children,
}) {
  return (
    <div
      className={`card ${noPadding ? 'card--no-padding' : ''} ${onClick ? 'card--clickable' : ''} ${className}`}
      style={style}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    >
      {(title || action) && (
        <div className="card__header">
          <div className="card__header-left">
            {title    && <h3 className="card__title">{title}</h3>}
            {subtitle && <p className="card__subtitle">{subtitle}</p>}
          </div>
          {action && <div className="card__action">{action}</div>}
        </div>
      )}
      <div className={`card__body ${noPadding ? '' : ''}`}>
        {children}
      </div>
    </div>
  );
}
