import React from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const ToastContainer = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container" aria-live="polite">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast-message animate-slide-up">
          {toast.type === 'success' && <CheckCircle2 size={20} className="toast-icon-success" />}
          {toast.type === 'info' && <Info size={20} className="toast-icon-info" />}
          {toast.type === 'error' && <AlertCircle size={20} className="toast-icon-error" />}

          <span style={{ fontSize: '0.88rem', fontWeight: 600, flex: 1 }}>{toast.message}</span>

          <button
            onClick={() => removeToast(toast.id)}
            style={{ color: 'var(--text-muted)', cursor: 'pointer', padding: '2px' }}
            aria-label="Close notification"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  );
};
