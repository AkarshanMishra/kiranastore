import React, { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, ShoppingBag, X } from 'lucide-react';

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handleShowToast = (e) => {
      const { message, type = 'success', duration = 3000 } = e.detail || {};
      if (!message) return;

      const id = Date.now() + Math.random();
      const newToast = { id, message, type };

      setToasts((prev) => [newToast, ...prev.slice(0, 3)]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    };

    window.addEventListener('kirana_show_toast', handleShowToast);
    return () => window.removeEventListener('kirana_show_toast', handleShowToast);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-md px-4">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isCart = toast.type === 'cart';

        const bgClass = isError
          ? 'bg-rose-600 text-white shadow-rose-900/30'
          : isWarning
          ? 'bg-amber-600 text-white shadow-amber-900/30'
          : isCart
          ? 'bg-brand-green text-white shadow-emerald-900/30'
          : isSuccess
          ? 'bg-emerald-600 text-white shadow-emerald-900/30'
          : 'bg-slate-900 text-white shadow-slate-950/40';

        const Icon = isError
          ? AlertCircle
          : isWarning
          ? AlertTriangle
          : isCart
          ? ShoppingBag
          : isSuccess
          ? CheckCircle2
          : Info;

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl shadow-xl border border-white/20 backdrop-blur-md animate-in slide-in-from-top-4 fade-in duration-200 w-full max-w-sm ${bgClass}`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <Icon size={18} className="flex-shrink-0" />
              <span className="text-xs font-bold leading-tight break-words">
                {toast.message}
              </span>
            </div>
            <button
              onClick={() => setToasts((prev) => prev.filter((t) => t.id !== toast.id))}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition flex-shrink-0"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export const showToast = (message, type = 'success', duration = 3000) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('kirana_show_toast', {
        detail: {message, type, duration}
      })
    );
  }
};
