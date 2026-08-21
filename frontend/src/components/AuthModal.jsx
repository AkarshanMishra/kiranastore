import React, { useState } from 'react';
import { X, Phone, Lock, CheckCircle2, ArrowRight, ShieldCheck, User, Sparkles, KeyRound } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [step, setStep] = useState('PHONE'); // 'PHONE' | 'OTP'
  const [phone, setPhone] = useState('9876543210');
  const [fullName, setFullName] = useState('Akarshan Mishra');
  const [otp, setOtp] = useState(['1', '2', '0', '7']);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number.');
      return;
    }
    setErrorMsg('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep('OTP');
    }, 500);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 4) {
      setErrorMsg('Please enter the 4-digit verification code.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: fullName || 'Customer',
        phone: phone.startsWith('+91') ? phone : `+91 ${phone}`,
        email: `${fullName.toLowerCase().replace(/\s+/g, '') || 'user'}@kiranastore.com`,
        membership: 'GOLD VIP',
        token: 'customer_jwt_' + Date.now()
      };
      localStorage.setItem('kirana_customer_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
      onClose();
    }, 600);
  };

  const handleQuickDemoLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const userObj = {
        name: 'Akarshan Mishra',
        phone: '+91 9876543210',
        email: 'akarshan@kiranastore.com',
        membership: 'GOLD VIP',
        token: 'customer_jwt_' + Date.now()
      };
      localStorage.setItem('kirana_customer_user', JSON.stringify(userObj));
      onLoginSuccess(userObj);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 text-gray-900 dark:text-white rounded-3xl max-w-md w-full p-6 sm:p-7 relative shadow-2xl animate-in zoom-in duration-200 border border-gray-100 dark:border-slate-800">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-700 dark:hover:text-white bg-gray-100 dark:bg-slate-800 p-2 rounded-full transition"
        >
          <X size={18} />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-tr from-emerald-500 to-green-600 text-white rounded-2xl mx-auto flex items-center justify-center text-2xl mb-3 shadow-lg shadow-green-500/20">
            🛍️
          </div>
          <h3 className="font-black text-xl text-gray-900 dark:text-white">
            {step === 'PHONE' ? 'Customer Sign In / Register' : 'Verify Mobile OTP'}
          </h3>
          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 font-medium">
            {step === 'PHONE'
              ? 'Get instant groceries & monthly rashan delivered in 10 mins'
              : `Enter 4-digit code sent to +91 ${phone}`}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-300 p-3 rounded-2xl text-xs font-bold mb-4 text-center">
            {errorMsg}
          </div>
        )}

        {step === 'PHONE' ? (
          <form onSubmit={handleSendOtp} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Your Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Akarshan Mishra"
                  className="w-full text-xs font-bold p-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-2xl outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 dark:focus:ring-emerald-950 dark:text-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <div className="flex items-center border border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800 rounded-2xl overflow-hidden focus-within:border-brand-green focus-within:ring-2 focus-within:ring-green-100 dark:focus-within:ring-emerald-950 transition">
                <span className="bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-black px-3 py-3 border-r border-gray-200 dark:border-slate-700">
                  🇮🇳 +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                  placeholder="9876543210"
                  className="w-full text-xs font-black p-3 bg-transparent outline-none dark:text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-green-800 text-white font-black py-3.5 rounded-2xl shadow-lg shadow-green-600/20 transition active:scale-95 flex items-center justify-center gap-2 text-xs cursor-pointer mt-1"
            >
              {loading ? (
                <span>Sending OTP Code...</span>
              ) : (
                <>
                  <span>CONTINUE WITH OTP</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {/* Quick 1-Click Demo Login */}
            <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
              <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider block text-center">
                ⚡ Quick Instant Access
              </span>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-950 border border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300 p-2.5 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition"
              >
                <Sparkles size={15} className="text-emerald-600 animate-pulse" />
                <span>1-Click Demo Login (Akarshan Mishra)</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-slate-300 py-1 text-center"
              >
                Continue as Guest Browser
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-2xl text-center text-xs font-bold text-emerald-800 dark:text-emerald-300">
              💡 Test OTP auto-filled: <strong>1207</strong>
            </div>

            <div className="flex justify-center gap-2.5 my-2">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => {
                    const newOtp = [...otp];
                    newOtp[idx] = e.target.value;
                    setOtp(newOtp);
                    if (e.target.value && idx < 3) {
                      document.getElementById(`otp-${idx + 1}`)?.focus();
                    }
                  }}
                  className="w-12 h-13 text-center text-xl font-black bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl outline-none focus:border-brand-green focus:ring-2 focus:ring-green-100 dark:focus:ring-emerald-950"
                />
              ))}
            </div>

            <div className="flex items-center justify-between text-xs font-bold">
              <button
                type="button"
                onClick={() => setStep('PHONE')}
                className="text-brand-green hover:underline"
              >
                Change Phone Number
              </button>
              <span className="text-gray-400">Resend Code (00:28)</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-green hover:bg-green-800 text-white font-black py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Verifying Secure OTP...</span>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  <span>VERIFY & SIGN IN</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="mt-5 pt-3 border-t border-gray-100 dark:border-slate-800 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
          <ShieldCheck size={14} className="text-brand-green" /> 100% Encrypted OTP Authentication
        </div>
      </div>
    </div>
  );
}
