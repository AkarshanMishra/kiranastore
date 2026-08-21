import React, { useState } from 'react';
import { X, CreditCard, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Smartphone, QrCode, Building2, Wallet, Lock, Sparkles, Check, ArrowRight } from 'lucide-react';

export default function RazorpayModal({ isOpen, onClose, amount, onPaymentSuccess, onPaymentFailure }) {
  const [selectedMode, setSelectedMode] = useState('UPI'); // 'UPI' | 'QR' | 'CARD' | 'NETBANKING' | 'WALLET'
  const [upiId, setUpiId] = useState('customer@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4111 1111 1111 1111');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [selectedWallet, setSelectedWallet] = useState('PAYTM');
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [testOtp, setTestOtp] = useState('1207');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handlePaySuccess = () => {
    setIsProcessing(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsProcessing(false);
      const razorpayPaymentId = `pay_RzpTest_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      const razorpayOrderId = `order_RzpTest_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      onPaymentSuccess({
        razorpay_payment_id: razorpayPaymentId,
        razorpay_order_id: razorpayOrderId,
        razorpay_signature: 'sig_test_verified_998822'
      });
    }, 1200);
  };

  const handleSimulateFailure = () => {
    setIsProcessing(true);
    setErrorMsg('');
    setTimeout(() => {
      setIsProcessing(false);
      setErrorMsg('Payment failed (Test Mode): Card declined or bank server timeout. Please try another method.');
      if (onPaymentFailure) onPaymentFailure();
    }, 900);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 text-white rounded-3xl max-w-md w-full p-6 relative shadow-2xl animate-in zoom-in duration-200 max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 p-1.5 rounded-full transition"
        >
          <X size={18} />
        </button>

        {/* Razorpay Test Mode Branding Banner */}
        <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 border border-blue-800/80 rounded-2xl p-3 mb-5 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-xs">
              RAZORPAY TEST MODE
            </span>
            <span className="text-xs font-bold text-blue-200">Gateway: rzp_test_kirana</span>
          </div>
          <ShieldCheck size={18} className="text-blue-400" />
        </div>

        {/* Payment Amount */}
        <div className="text-center mb-5 bg-slate-800/80 border border-slate-700/60 rounded-2xl p-3.5">
          <span className="text-xs text-slate-400 font-bold block mb-0.5">Amount Payable</span>
          <div className="text-3xl font-black text-emerald-400">₹{amount.toFixed(2)}</div>
          <span className="text-[10px] text-slate-400 font-medium">Merchant: KiranaStore 10-Min Delivery</span>
        </div>

        {/* Payment Mode Selector Tabs */}
        <div className="grid grid-cols-4 gap-1.5 mb-4">
          {[
            { id: 'UPI', label: 'UPI / VPA', icon: Smartphone },
            { id: 'QR', label: 'Scan QR', icon: QrCode },
            { id: 'CARD', label: 'Card', icon: CreditCard },
            { id: 'NETBANKING', label: 'NetBank', icon: Building2 },
          ].map((tab) => {
            const Icon = tab.icon;
            const isAct = selectedMode === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => { setSelectedMode(tab.id); setOtpStep(false); }}
                className={`py-2 px-1 rounded-xl text-[11px] font-extrabold flex flex-col items-center justify-center gap-1 transition border ${
                  isAct
                    ? 'bg-blue-600 text-white border-blue-500 shadow-md ring-2 ring-blue-400/30'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                }`}
              >
                <Icon size={15} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Mode Content */}
        {selectedMode === 'UPI' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-extrabold">UPI ID / Virtual Payment Address</label>
              <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                Auto-Verified
              </span>
            </div>

            <div className="relative">
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@oksbi"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 outline-none font-mono text-white text-xs focus:border-blue-500"
              />
            </div>

            {/* Quick UPI App Shortcuts */}
            <div className="flex gap-2 pt-1">
              {['@okhdfcbank', '@oksbi', '@paytm', '@ybl'].map((suffix) => (
                <button
                  key={suffix}
                  type="button"
                  onClick={() => setUpiId(`customer${suffix}`)}
                  className="bg-slate-900 hover:bg-slate-700 border border-slate-700 text-[10px] font-bold px-2 py-1 rounded-lg text-slate-300 transition"
                >
                  {suffix}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400">Works with Google Pay, PhonePe, Paytm, and BHIM in test mode.</p>
          </div>
        )}

        {selectedMode === 'QR' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-4 text-center space-y-3">
            <span className="text-xs font-extrabold text-slate-200 block">Scan Dynamic UPI QR to Pay</span>
            <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-2xl shadow-inner flex flex-col items-center justify-center border-2 border-blue-500">
              <div className="w-full h-full bg-slate-900 rounded-lg p-2 flex items-center justify-center text-white">
                <QrCode size={90} className="text-emerald-400 animate-pulse" />
              </div>
            </div>
            <div className="text-[11px] text-emerald-400 font-black">₹{amount.toFixed(0)} • Live UPI QR Code</div>
            <p className="text-[10px] text-slate-400">Clicking Pay below simulates scanning this QR from your phone.</p>
          </div>
        )}

        {selectedMode === 'CARD' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-4 text-xs space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-slate-200 font-extrabold">Test Card Number</label>
              <span className="text-[10px] text-blue-300 font-mono">VISA / Mastercard</span>
            </div>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 outline-none font-mono text-white text-xs focus:border-blue-500"
            />
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">Expiry (MM/YY)</label>
                <input
                  type="text"
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white text-xs"
                />
              </div>
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">CVV / CVC</label>
                <input
                  type="password"
                  maxLength="3"
                  value={cardCvv}
                  onChange={(e) => setCardCvv(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono text-white text-xs"
                />
              </div>
            </div>
            <p className="text-[10px] text-emerald-400 font-medium">✓ Razorpay 3D Secure sandbox preloaded.</p>
          </div>
        )}

        {selectedMode === 'NETBANKING' && (
          <div className="bg-slate-800/90 border border-slate-700 rounded-2xl p-4 mb-4 text-xs space-y-3">
            <label className="text-slate-200 font-extrabold block">Select Popular Bank</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'HDFC', name: 'HDFC Bank' },
                { id: 'SBI', name: 'State Bank of India' },
                { id: 'ICICI', name: 'ICICI Bank' },
                { id: 'AXIS', name: 'Axis Bank' }
              ].map(bank => (
                <button
                  key={bank.id}
                  type="button"
                  onClick={() => setSelectedBank(bank.id)}
                  className={`p-2.5 rounded-xl border text-xs font-extrabold text-left transition ${
                    selectedBank === bank.id
                      ? 'bg-blue-600 text-white border-blue-500 shadow'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-850'
                  }`}
                >
                  🏦 {bank.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="bg-rose-950 border border-rose-800 text-rose-300 font-bold text-xs p-3 rounded-2xl mb-4 flex items-center gap-2">
            <AlertTriangle size={16} className="flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Submit Actions */}
        <div className="space-y-2">
          <button
            onClick={handlePaySuccess}
            disabled={isProcessing}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black py-3.5 rounded-2xl shadow-lg transition active:scale-95 text-xs sm:text-sm flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            {isProcessing ? (
              <>
                <RefreshCw size={15} className="animate-spin" /> Verifying Razorpay Gateway...
              </>
            ) : (
              <>
                <CheckCircle2 size={17} /> PAY ₹{amount.toFixed(2)} (TEST GATEWAY)
              </>
            )}
          </button>

          <button
            onClick={handleSimulateFailure}
            disabled={isProcessing}
            className="w-full bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold py-2 rounded-xl text-xs transition border border-slate-700 cursor-pointer"
          >
            Simulate Payment Failure & Retry Flow
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-4 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1 font-medium">
          <Lock size={12} className="text-emerald-500" />
          <span>Secured by Razorpay Test API • 256-bit TLS Encrypted</span>
        </div>

      </div>
    </div>
  );
}
