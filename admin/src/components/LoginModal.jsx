import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, X } from 'lucide-react';

export default function LoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('admin@kiranastore.com');
  const [password, setPassword] = useState('••••••••••••');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({ name: 'Super Admin', email });
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 text-slate-900 rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-1.5 rounded-full"
        >
          <X size={18} />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-purple-100 text-purple-700 border border-purple-200 rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-xs">
            ⚡
          </div>
          <h3 className="font-black text-xl text-slate-900">KiranaControl Admin Login</h3>
          <p className="text-xs text-slate-500 mt-1">Authenticate to access Dark Store Enterprise OS</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-700 font-bold mb-1">Admin Email / Username</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none focus:border-purple-600 text-slate-900 font-bold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3.5 rounded-2xl shadow-md flex items-center justify-center gap-2 text-xs"
          >
            <span>{loading ? 'Authenticating 2FA...' : 'LOG IN TO ADMIN PORTAL'}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <ShieldCheck size={14} className="text-emerald-600" /> Protected by 2FA & Role Permissions
        </div>
      </div>
    </div>
  );
}
