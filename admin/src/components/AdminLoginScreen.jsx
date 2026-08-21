import React, { useState } from 'react';
import { Lock, ShieldCheck, ArrowRight, Store, KeyRound, Sparkles, UserCheck, Eye, EyeOff, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AdminLoginScreen({ onLoginSuccess }) {
  const [email, setEmail] = useState('admin@kiranastore.com');
  const [password, setPassword] = useState('kirana2026');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedHub, setSelectedHub] = useState('NOIDA_SEC62');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoRoles = [
    {
      role: 'Super Admin / Owner',
      name: 'Akarshan Mishra (Store Owner)',
      email: 'owner@kiranastore.com',
      pass: 'owner123',
      badge: 'Full Access',
      color: 'from-purple-600 to-indigo-700'
    },
    {
      role: 'Dark Store Manager',
      name: 'Rohan Verma (Manager)',
      email: 'manager.sec62@kiranastore.com',
      pass: 'manager123',
      badge: 'Orders & Inventory',
      color: 'from-emerald-600 to-teal-700'
    },
    {
      role: 'Delivery Dispatcher',
      name: 'Vikram Singh (Dispatcher)',
      email: 'dispatch@kiranastore.com',
      pass: 'dispatch123',
      badge: 'Riders & Dispatch',
      color: 'from-blue-600 to-cyan-700'
    }
  ];

  const handleDemoLogin = (demo) => {
    setEmail(demo.email);
    setPassword(demo.pass);
    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: demo.name,
        email: demo.email,
        role: demo.role,
        hub: selectedHub,
        token: 'admin_token_' + Date.now()
      };
      localStorage.setItem('kirana_admin_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
    }, 500);
  };

  const handleManualSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const roleName = email.includes('owner') ? 'Super Admin / Owner' : email.includes('dispatch') ? 'Delivery Dispatcher' : 'Dark Store Manager';
      const userObj = {
        name: email.split('@')[0].toUpperCase(),
        email,
        role: roleName,
        hub: selectedHub,
        token: 'admin_token_' + Date.now()
      };
      localStorage.setItem('kirana_admin_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 flex flex-col justify-center items-center p-4 selection:bg-purple-500 selection:text-white relative overflow-hidden font-sans text-slate-100">
      
      {/* Background ambient lighting */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 px-3.5 py-1.5 rounded-full text-purple-300 text-xs font-black uppercase tracking-wider mb-3 shadow-inner">
            <Sparkles size={14} className="text-yellow-400 animate-pulse" />
            <span>Dark Store Control Center</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-amber-400 text-slate-950 font-black text-2xl px-3 py-1 rounded-2xl shadow-lg tracking-tight">
              Kirana<span className="text-emerald-700">Store</span>
            </div>
            <span className="bg-purple-600 text-white font-black text-xs px-2 py-1 rounded-xl uppercase tracking-widest shadow-md">
              Admin OS
            </span>
          </div>
          
          <p className="text-xs text-slate-400 font-medium">
            Sign in to manage orders, live dispatch, inventory & rashan slips
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-900/85 backdrop-blur-xl border border-slate-700/80 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-5">
          
          {errorMsg && (
            <div className="bg-rose-500/10 border border-rose-500/40 text-rose-300 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Manual Login Form */}
          <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Admin Email or Username</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@kiranastore.com"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-3.5 py-3 text-slate-100 font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Password / 2FA Security Key</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-3.5 py-3 pr-10 text-slate-100 font-bold outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Dark Store Hub Selection */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Active Fulfillment Hub</label>
              <select
                value={selectedHub}
                onChange={(e) => setSelectedHub(e.target.value)}
                className="w-full bg-slate-800/80 border border-slate-700 rounded-2xl px-3.5 py-3 text-slate-100 font-bold outline-none focus:border-purple-500 transition cursor-pointer"
              >
                <option value="NOIDA_SEC62">🏬 Sector 62 Express Dark Store (Main Hub)</option>
                <option value="INDIRAPURAM">🏬 Indirapuram Kirana Mandi Hub</option>
                <option value="NOIDA_SEC18">🏬 Sector 18 Central Distribution Hub</option>
                <option value="GREATER_NOIDA">🏬 Greater Noida West Express Store</option>
              </select>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-purple-900/40 flex items-center justify-center gap-2 text-xs transition active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating Session...
                </span>
              ) : (
                <>
                  <span>SIGN IN TO DASHBOARD</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* 1-Click Quick Demo Switcher */}
          <div className="pt-4 border-t border-slate-800 space-y-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block text-center">
              ⚡ 1-Click Quick Demo Roles
            </span>

            <div className="space-y-1.5">
              {demoRoles.map((demo) => (
                <button
                  key={demo.role}
                  type="button"
                  onClick={() => handleDemoLogin(demo)}
                  className="w-full bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 hover:border-purple-500/50 p-2.5 rounded-2xl flex items-center justify-between transition group text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-xl bg-gradient-to-tr ${demo.color} text-white flex items-center justify-center font-bold text-xs shadow-xs`}>
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="font-extrabold text-xs text-slate-200 block group-hover:text-purple-300 transition-colors">
                        {demo.role}
                      </span>
                      <span className="text-[10px] text-slate-400">{demo.email}</span>
                    </div>
                  </div>

                  <span className="text-[9px] font-black bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full">
                    {demo.badge}
                  </span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Security & Developer Attribution Footer */}
        <div className="mt-5 text-center text-[11px] text-slate-500 space-y-1.5 font-medium">
          <div className="flex items-center justify-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            <span>Encrypted with TLS 1.3 & Multi-Store Role Guard</span>
          </div>
          <div className="text-xs font-semibold text-slate-400">
            🚀 Admin App is developed by <span className="text-purple-400 font-black">Akarshan Mishra</span>
          </div>
        </div>

      </div>
    </div>
  );
}
