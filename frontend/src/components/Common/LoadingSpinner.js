import React from 'react';
import './LoadingSpinner.css';

/**
 * LoadingSpinner – animated circular spinner.
 * Props:
 *   size: 'sm' | 'md' | 'lg'  (default: 'md')
 *   text: optional label below spinner
 *   inline: if true, renders inline (no centering wrapper)
 */
export default function LoadingSpinner({ size = 'md', text, inline = false }) {
  if (inline) {
    return <span className={`spinner spinner--${size} spinner--inline`} aria-label="Loading" />;
  }

  return (
    <div className="spinner-wrapper" role="status" aria-label="Loading">
      <span className={`spinner spinner--${size}`} />
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
