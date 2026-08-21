import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck, Flame } from 'lucide-react';

export default function HeroBanners() {
  const [secondsLeft, setSecondsLeft] = useState(6130);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4 pb-2 space-y-3 sm:space-y-4">
      {/* Live Flash Deals Ticker Bar */}
      <div className="bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 text-white rounded-2xl p-2.5 sm:p-3 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2 text-xs font-black">
        <div className="flex items-center gap-1.5 min-w-0">
          <Flame size={16} className="text-yellow-300 animate-bounce flex-shrink-0" />
          <span className="truncate text-[11px] sm:text-xs">⚡ FLASH SALE: UP TO 50% OFF ON FRESH DAIRY & SNACKS</span>
        </div>
        <div className="flex items-center gap-1.5 bg-black/25 backdrop-blur-md px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-mono font-bold self-end sm:self-auto flex-shrink-0">
          <Clock size={12} className="text-yellow-300" />
          <span>ENDS IN {formatTimer(secondsLeft)}</span>
        </div>
      </div>

      {/* Main Promo Grid (Swipeable on Mobile, 3-column Grid on Desktop) */}
      <div className="flex md:grid md:grid-cols-3 gap-3 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-1">
        {/* Banner 1 */}
        <div className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px] sm:min-h-[140px] flex-shrink-0">
          <div className="relative z-10">
            <span className="bg-yellow-400 text-gray-900 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Superfast
            </span>
            <h3 className="text-base sm:text-xl font-black mt-1.5 sm:mt-2 leading-tight">
              Express Home Delivery <br />Or Free Products!
            </h3>
            <p className="text-[11px] sm:text-xs text-emerald-100 mt-1">Dark store nearby within 1.2 km</p>
          </div>
          <div className="absolute right-2 -bottom-2 opacity-20">
            <Zap size={110} />
          </div>
        </div>

        {/* Banner 2 */}
        <div className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px] sm:min-h-[140px] flex-shrink-0">
          <div className="relative z-10">
            <span className="bg-white text-orange-700 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Farm Fresh
            </span>
            <h3 className="text-base sm:text-xl font-black mt-1.5 sm:mt-2 leading-tight">
              Fresh Milk, Paneer & Eggs <br />Direct From Dairy Mandi
            </h3>
            <p className="text-[11px] sm:text-xs text-orange-100 mt-1">Chilled in temperature-safe bags</p>
          </div>
          <div className="absolute right-3 bottom-0 text-white/20">
            <Clock size={100} />
          </div>
        </div>

        {/* Banner 3 */}
        <div className="min-w-[85vw] sm:min-w-[340px] md:min-w-0 snap-center bg-gradient-to-r from-purple-600 to-indigo-700 text-white rounded-3xl p-4 sm:p-5 shadow-xs relative overflow-hidden flex flex-col justify-between min-h-[125px] sm:min-h-[140px] flex-shrink-0">
          <div className="relative z-10">
            <span className="bg-pink-400 text-gray-900 font-black text-[9px] sm:text-[10px] px-2 py-0.5 rounded uppercase tracking-wider">
              Midnight Specials
            </span>
            <h3 className="text-base sm:text-xl font-black mt-1.5 sm:mt-2 leading-tight">
              Snacks, Drinks & Munchies <br />Up to 40% OFF
            </h3>
            <p className="text-[11px] sm:text-xs text-purple-200 mt-1">Instant delivery available 24/7</p>
          </div>
          <div className="absolute right-3 bottom-0 text-white/20">
            <ShieldCheck size={100} />
          </div>
        </div>
      </div>
    </div>
  );
}
