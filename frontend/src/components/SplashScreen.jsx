import React, { useEffect, useState } from 'react';
import { Zap, Sparkles } from 'lucide-react';

export default function SplashScreen({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFade(true), 1600);
    const timer2 = setTimeout(() => onFinish(), 2000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onFinish]);

  return (
    <div className={`fixed inset-0 z-50 bg-gradient-to-br from-emerald-800 via-brand-green to-teal-900 flex flex-col items-center justify-center text-white transition-opacity duration-500 ${fade ? 'opacity-0' : 'opacity-100'}`}>
      <div className="relative flex flex-col items-center animate-in zoom-in-50 duration-500">
        
        {/* Animated Icon */}
        <div className="w-24 h-24 bg-brand-yellow text-gray-900 rounded-3xl flex items-center justify-center text-4xl font-black shadow-2xl mb-4 animate-bounce border-4 border-white/20">
          ⚡
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight select-none">
          Kirana<span className="text-brand-yellow">Store</span>
        </h1>

        {/* Subtitle */}
        <div className="flex items-center gap-2 mt-2 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-bold tracking-wider uppercase text-green-100">
          <Sparkles size={14} className="text-brand-yellow animate-spin" />
          <span>EXPRESS HOME DELIVERY</span>
        </div>

        {/* Loading Spinner */}
        <div className="mt-8 flex items-center gap-2">
          <div className="w-2 h-2 bg-white rounded-full animate-ping" />
          <span className="text-xs text-green-200 font-medium">Connecting to Dark Store #402...</span>
        </div>
      </div>

      <div className="absolute bottom-6 text-[11px] text-green-300/80 font-mono">
        v2.4.0 • Enterprise QuickCommerce OS
      </div>
    </div>
  );
}
