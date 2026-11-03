import React, { useState, useCallback, createContext, useContext, useRef } from 'react';
import './Toast.css';

/* =============================================
   Toast Context
   ============================================= */
const ToastContext = createContext(null);

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const timersRef = useRef({});

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, removing: true } : t));
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      clearTimeout(timersRef.current[id]);
      delete timersRef.current[id];
    }, 300);
  }, []);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type, removing: false }]);
    if (duration > 0) {
      timersRef.current[id] = setTimeout(() => removeToast(id), duration);
    }
    return id;
  }, [removeToast]);

  const toast = {
    success: (msg, duration) => addToast(msg, 'success', duration),
    error:   (msg, duration) => addToast(msg, 'error',   duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info:    (msg, duration) => addToast(msg, 'info',    duration),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="toast-container" aria-live="polite" aria-label="Notifications">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`toast toast--${t.type} ${t.removing ? 'toast--removing' : ''}`}
            role="alert"
          >
            <span className="toast__icon">
              {t.type === 'success' ? '✅' :
               t.type === 'error'   ? '❌' :
               t.type === 'warning' ? '⚠️' : 'ℹ️'}
            </span>
            <span className="toast__message">{t.message}</span>
            <button
              className="toast__close"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** Hook to access toast functions */
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastProvider;
