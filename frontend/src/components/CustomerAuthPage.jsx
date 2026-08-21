import React, { useState } from 'react';
import { Phone, User, MapPin, Mail, ArrowRight, ShieldCheck, Sparkles, CheckCircle2, ArrowLeft, Lock, KeyRound, Store, Gift, HeartHandshake } from 'lucide-react';

export default function CustomerAuthPage({
  onLoginSuccess,
  onBackToStore,
  initialMode = 'login', // 'login' | 'signup'
  setUserAddress
}) {
  const [mode, setMode] = useState(initialMode); // 'login' | 'signup'
  
  // Login State
  const [loginPhone, setLoginPhone] = useState('');
  const [loginOtp, setLoginOtp] = useState('1207');
  const [loginStep, setLoginStep] = useState('phone'); // 'phone' | 'otp'
  
  // Sign Up State
  const [signupName, setSignupName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupOtp, setSignupOtp] = useState('1207');
  const [signupStep, setSignupStep] = useState('details'); // 'details' | 'otp'

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Quick Demo Customer Profiles
  const demoCustomers = [
    {
      name: 'Akarshan Mishra',
      phone: '+91 9876543210',
      email: 'akarshan@kiranastore.com',
      address: 'Flat 402, Block B, Sector 62, Noida, UP',
      tag: '👑 Regular VIP Customer'
    },
    {
      name: 'Priya Sharma',
      phone: '+91 9811223344',
      email: 'priya.sharma@gmail.com',
      address: 'Tower 4, Flat 12B, Indirapuram, Ghaziabad, UP',
      tag: '✨ Monthly Rashan Member'
    },
    {
      name: 'Rohan Verma',
      phone: '+91 9822334455',
      email: 'rohan.verma@outlook.com',
      address: 'House 88, Sector 18 Market Road, Noida, UP',
      tag: '⚡ 10-Min Fast Buyer'
    }
  ];

  const handleQuickDemoLogin = async (profile) => {
    setIsLoading(true);
    setErrorMsg(null);
    const userData = {
      name: profile.name,
      phone: profile.phone,
      email: profile.email,
      address: profile.address
    };

    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          phone: profile.phone,
          email: profile.email,
          address: profile.address,
          wallet_balance: 100.0
        })
      });
    } catch (err) {
      console.warn("Backend sync notice:", err);
    }

    localStorage.setItem('kirana_customer_user', JSON.stringify(userData));
    if (setUserAddress && profile.address) {
      setUserAddress(profile.address);
    }
    setIsLoading(false);
    if (onLoginSuccess) onLoginSuccess(userData);
  };

  const handleLoginPhoneSubmit = (e) => {
    e.preventDefault();
    if (!loginPhone || loginPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setLoginStep('otp');
      setSuccessMsg(`OTP sent to +91 ${loginPhone}. Use test code 1207.`);
    }, 500);
  };

  const handleVerifyLoginOtp = async (e) => {
    e.preventDefault();
    if (loginOtp !== '1207' && loginOtp.length !== 4) {
      setErrorMsg('Invalid OTP. Please enter test OTP: 1207');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    const userNameDerived = loginPhone === '9876543210' ? 'Akarshan Mishra' : `Customer (${loginPhone.slice(-4)})`;
    const userData = {
      name: userNameDerived,
      phone: `+91 ${loginPhone}`,
      email: `${loginPhone}@kiranastore.com`,
      address: 'Flat 402, Block B, Sector 62, Noida, UP'
    };

    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: userNameDerived,
          phone: `+91 ${loginPhone}`,
          email: `${loginPhone}@kiranastore.com`,
          address: 'Flat 402, Block B, Sector 62, Noida, UP',
          wallet_balance: 100.0
        })
      });
    } catch (err) {
      console.warn("Customer sync notice:", err);
    }

    localStorage.setItem('kirana_customer_user', JSON.stringify(userData));
    setIsLoading(false);
    if (onLoginSuccess) onLoginSuccess(userData);
  };

  const handleSignupDetailsSubmit = (e) => {
    e.preventDefault();
    if (!signupName.trim()) {
      setErrorMsg('Please enter your full name');
      return;
    }
    if (!signupPhone || signupPhone.length < 10) {
      setErrorMsg('Please enter a valid 10-digit mobile number');
      return;
    }
    if (!signupAddress.trim()) {
      setErrorMsg('Please enter your delivery street/house address');
      return;
    }

    setErrorMsg(null);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSignupStep('otp');
      setSuccessMsg(`Verification code sent to +91 ${signupPhone}. Use test code 1207.`);
    }, 500);
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();
    if (signupOtp !== '1207' && signupOtp.length !== 4) {
      setErrorMsg('Invalid OTP. Please enter test OTP: 1207');
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);

    const userData = {
      name: signupName.trim(),
      phone: `+91 ${signupPhone}`,
      email: signupEmail.trim() || `${signupPhone}@kiranastore.com`,
      address: signupAddress.trim(),
      wallet_balance: 100
    };

    try {
      await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: signupName.trim(),
          phone: `+91 ${signupPhone}`,
          email: signupEmail.trim() || `${signupPhone}@kiranastore.com`,
          address: signupAddress.trim(),
          wallet_balance: 100.0
        })
      });
    } catch (err) {
      console.warn("Signup sync error:", err);
    }

    localStorage.setItem('kirana_customer_user', JSON.stringify(userData));
    if (setUserAddress) {
      setUserAddress(signupAddress.trim());
    }
    setIsLoading(false);
    if (onLoginSuccess) onLoginSuccess(userData);
  };

  return (
    <div className="min-h-[85vh] bg-gradient-to-b from-emerald-50/60 via-slate-50 to-emerald-100/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-6 sm:py-10 px-3 sm:px-4 flex flex-col justify-center items-center font-sans">
      
      {/* Container Box */}
      <div className="max-w-md w-full relative z-10">
        
        {/* Back Navigation Bar */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={onBackToStore}
            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 bg-white dark:bg-slate-850 px-3.5 py-2 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xs transition active:scale-95 cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </button>

          <div className="inline-flex items-center gap-1 bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 text-[11px] font-black px-3 py-1 rounded-full border border-emerald-300 dark:border-emerald-700">
            <Sparkles size={12} className="text-yellow-500" />
            <span>₹100 Welcome Cash</span>
          </div>
        </div>

        {/* Brand Card Header */}
        <div className="text-center mb-5">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <div className="bg-brand-green text-white font-black text-2xl px-3 py-1 rounded-2xl shadow-md tracking-tight">
              Kirana<span className="text-yellow-400">Store</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 dark:text-slate-400 font-bold">
            India's Trusted Neighborhood Quick-Commerce & Monthly Rashan Hub
          </p>
        </div>

        {/* Auth Main Card */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-7 shadow-2xl border border-gray-200 dark:border-slate-800 space-y-5">
          
          {/* Toggle Tabs: Login vs Sign Up */}
          <div className="grid grid-cols-2 p-1.5 bg-gray-100 dark:bg-slate-800 rounded-2xl gap-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setLoginStep('phone');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'login'
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <KeyRound size={14} />
              <span>Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('signup');
                setSignupStep('details');
                setErrorMsg(null);
                setSuccessMsg(null);
              }}
              className={`py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-gray-600 dark:text-slate-400 hover:text-black dark:hover:text-white'
              }`}
            >
              <Gift size={14} />
              <span>Sign Up (New)</span>
            </button>
          </div>

          {/* Alert Messages */}
          {errorMsg && (
            <div className="bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-3 rounded-2xl text-xs font-bold animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 p-3 rounded-2xl text-xs font-bold animate-in fade-in flex items-center gap-1.5">
              <CheckCircle2 size={15} />
              <span>{successMsg}</span>
            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* LOGIN WORKFLOW */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {mode === 'login' && (
            <div className="space-y-4">
              
              {loginStep === 'phone' ? (
                <form onSubmit={handleLoginPhoneSubmit} className="space-y-3.5 text-xs">
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">
                      Mobile Number
                    </label>
                    <div className="flex rounded-2xl border border-gray-300 dark:border-slate-700 overflow-hidden focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/20 bg-gray-50 dark:bg-slate-800">
                      <span className="px-3 py-3 text-xs font-black text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-750 flex items-center gap-1 border-r border-gray-200 dark:border-slate-700">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        required
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3.5 py-3 text-xs font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || loginPhone.length < 10}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <span>Send OTP Verification</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifyLoginOtp} className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-gray-700 dark:text-slate-300 font-bold">
                        Enter 4-Digit OTP
                      </label>
                      <button
                        type="button"
                        onClick={() => setLoginStep('phone')}
                        className="text-[11px] text-purple-600 font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength="4"
                      required
                      value={loginOtp}
                      onChange={(e) => setLoginOtp(e.target.value)}
                      placeholder="1207"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3.5 py-3 text-center text-lg font-black tracking-widest text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-gray-500 block text-center mt-1">
                      💡 Test OTP: <strong>1207</strong> (Auto-filled)
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Verify & Login</span>
                  </button>
                </form>
              )}

              {/* 1-Click Fast Quick Demo Customers */}
              <div className="pt-3 border-t border-gray-100 dark:border-slate-800 space-y-2">
                <span className="text-[10px] font-black text-gray-400 dark:text-slate-500 uppercase tracking-wider block text-center">
                  ⚡ Or 1-Click Quick Demo Sign In
                </span>

                <div className="space-y-1.5">
                  {demoCustomers.map((cust, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleQuickDemoLogin(cust)}
                      className="w-full bg-gray-50 hover:bg-emerald-50/80 dark:bg-slate-800/80 dark:hover:bg-emerald-950/30 border border-gray-200 dark:border-slate-700 hover:border-emerald-400 p-2.5 rounded-2xl flex items-center justify-between text-left transition active:scale-98 cursor-pointer group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 flex items-center justify-center font-black text-xs flex-shrink-0">
                          {cust.name[0]}
                        </div>
                        <div className="min-w-0">
                          <span className="font-extrabold text-xs text-gray-900 dark:text-white block group-hover:text-emerald-600 transition truncate">
                            {cust.name}
                          </span>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {cust.phone} • {cust.address.split(',')[0]}
                          </span>
                        </div>
                      </div>

                      <span className="text-[9px] bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-300 font-black px-2 py-0.5 rounded-lg border border-gray-200 dark:border-slate-600 flex-shrink-0">
                        Log in ➔
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* SIGN UP WORKFLOW */}
          {/* ══════════════════════════════════════════════════════════════ */}
          {mode === 'signup' && (
            <div className="space-y-4">
              
              {signupStep === 'details' ? (
                <form onSubmit={handleSignupDetailsSubmit} className="space-y-3 text-xs">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={signupName}
                      onChange={(e) => setSignupName(e.target.value)}
                      placeholder="e.g. Akarshan Mishra"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Mobile Number */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">
                      Mobile Number
                    </label>
                    <div className="flex rounded-2xl border border-gray-300 dark:border-slate-700 overflow-hidden bg-gray-50 dark:bg-slate-800 focus-within:border-emerald-500">
                      <span className="px-3 py-2.5 text-xs font-black text-gray-700 dark:text-slate-300 bg-gray-100 dark:bg-slate-750 flex items-center border-r border-gray-200 dark:border-slate-700">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength="10"
                        required
                        value={signupPhone}
                        onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98765 43210"
                        className="w-full px-3 py-2.5 text-xs font-bold bg-transparent outline-none text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  {/* Email (Optional) */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      placeholder="akarshan@gmail.com"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="block text-gray-700 dark:text-slate-300 font-bold mb-1">
                      Delivery Address (Flat / House & Sector)
                    </label>
                    <input
                      type="text"
                      required
                      value={signupAddress}
                      onChange={(e) => setSignupAddress(e.target.value)}
                      placeholder="e.g. Flat 402, Block B, Sector 62, Noida"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Welcome Bonus Callout */}
                  <div className="bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 p-2.5 rounded-2xl text-[11px] text-emerald-800 dark:text-emerald-300 font-bold flex items-center gap-2">
                    <Gift size={16} className="text-emerald-600 flex-shrink-0" />
                    <span>🎉 Sign up now & get ₹100 Welcome Cash credited instantly!</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading || !signupName || signupPhone.length < 10 || !signupAddress}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 disabled:opacity-50 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <span>Proceed to Verify Mobile</span>
                    <ArrowRight size={15} />
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerifySignupOtp} className="space-y-3.5 text-xs">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-gray-700 dark:text-slate-300 font-bold">
                        Enter 4-Digit OTP for +91 {signupPhone}
                      </label>
                      <button
                        type="button"
                        onClick={() => setSignupStep('details')}
                        className="text-[11px] text-purple-600 font-bold hover:underline"
                      >
                        Edit Details
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength="4"
                      required
                      value={signupOtp}
                      onChange={(e) => setSignupOtp(e.target.value)}
                      placeholder="1207"
                      className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 rounded-2xl px-3.5 py-3 text-center text-lg font-black tracking-widest text-gray-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-gray-500 block text-center mt-1">
                      💡 Test OTP: <strong>1207</strong> (Auto-filled)
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black text-xs sm:text-sm py-3.5 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition active:scale-98 cursor-pointer"
                  >
                    <CheckCircle2 size={16} />
                    <span>Create Account & Claim ₹100 🎁</span>
                  </button>
                </form>
              )}

            </div>
          )}

        </div>

        {/* Security and Trust Footer */}
        <div className="flex items-center justify-center gap-4 text-gray-400 dark:text-slate-600 text-[11px] font-bold mt-4">
          <span className="flex items-center gap-1">
            <ShieldCheck size={13} className="text-emerald-500" /> 256-Bit Encrypted
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Store size={13} className="text-purple-500" /> Direct Dark Store Delivery
          </span>
        </div>

        {/* Developer Attribution */}
        <div className="text-center pt-3 text-xs font-semibold text-gray-500 dark:text-slate-400">
          <span>🚀 App is developed by </span>
          <span className="text-purple-600 dark:text-purple-400 font-black">Akarshan Mishra</span>
        </div>

      </div>

    </div>
  );
}
