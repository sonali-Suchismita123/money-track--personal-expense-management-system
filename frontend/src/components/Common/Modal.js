import React, { useEffect, useCallback } from 'react';
import './Modal.css';

/**
 * Reusable Modal component.
 * Props:
 *   isOpen: boolean
 *   onClose: function
 *   title: string
 *   size: 'sm' | 'md' | 'lg' | 'xl'
 *   children
 */
export default function Modal({ isOpen, onClose, title, size = 'md', children }) {

  /** Close on Escape key */
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`modal modal--${size}`} role="document">
        {/* Header */}
        <div className="modal__header">
          <h2 id="modal-title" className="modal__title">{title}</h2>
          <button className="modal__close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="modal__body">
          {children}
        </div>
      </div>
    </div>
  );
}
